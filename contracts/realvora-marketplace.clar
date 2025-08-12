;; Realvora Marketplace Contract
;; This contract enables peer-to-peer trading of property shares
;; with order book functionality and automated matching

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u300))
(define-constant ERR_NOT_FOUND (err u301))
(define-constant ERR_ALREADY_EXISTS (err u302))
(define-constant ERR_INSUFFICIENT_FUNDS (err u303))
(define-constant ERR_INVALID_AMOUNT (err u304))
(define-constant ERR_INVALID_PRICE (err u305))
(define-constant ERR_ORDER_EXPIRED (err u306))
(define-constant ERR_INSUFFICIENT_SHARES (err u307))
(define-constant ERR_SELF_TRADE (err u308))
(define-constant ERR_ORDER_FILLED (err u309))

;; Trading fee (in basis points, e.g., 250 = 2.5%)
(define-constant TRADING_FEE u250)
(define-constant BASIS_POINTS u10000)

;; Data Variables
(define-data-var next-order-id uint u1)
(define-data-var property-contract principal tx-sender)
(define-data-var fee-recipient principal CONTRACT_OWNER)
(define-data-var total-volume uint u0)
(define-data-var total-fees-collected uint u0)

;; Order types
(define-constant ORDER_TYPE_BUY u1)
(define-constant ORDER_TYPE_SELL u2)

;; Order status
(define-constant ORDER_STATUS_ACTIVE u1)
(define-constant ORDER_STATUS_FILLED u2)
(define-constant ORDER_STATUS_CANCELLED u3)
(define-constant ORDER_STATUS_EXPIRED u4)

;; Order structure
(define-map orders
  { order-id: uint }
  {
    creator: principal,
    property-id: uint,
    order-type: uint, ;; 1 = buy, 2 = sell
    shares: uint,
    price-per-share: uint,
    total-value: uint,
    filled-shares: uint,
    status: uint,
    created-at: uint,
    expires-at: uint
  }
)

;; Active orders by property (for order book)
(define-map property-buy-orders
  { property-id: uint }
  { orders: (list 50 uint) }
)

(define-map property-sell-orders
  { property-id: uint }
  { orders: (list 50 uint) }
)

;; User orders tracking
(define-map user-orders
  { user: principal }
  { orders: (list 100 uint) }
)

;; Trade history
(define-map trades
  { trade-id: uint }
  {
    property-id: uint,
    buyer: principal,
    seller: principal,
    shares: uint,
    price-per-share: uint,
    total-value: uint,
    fee-amount: uint,
    buy-order-id: uint,
    sell-order-id: uint,
    executed-at: uint
  }
)

(define-data-var next-trade-id uint u1)

;; Price tracking for properties
(define-map property-prices
  { property-id: uint }
  {
    last-price: uint,
    volume-24h: uint,
    high-24h: uint,
    low-24h: uint,
    updated-at: uint
  }
)

;; Read-only functions
(define-read-only (get-order (order-id uint))
  (map-get? orders { order-id: order-id })
)

(define-read-only (get-property-buy-orders (property-id uint))
  (default-to (list) (get orders (map-get? property-buy-orders { property-id: property-id })))
)

(define-read-only (get-property-sell-orders (property-id uint))
  (default-to (list) (get orders (map-get? property-sell-orders { property-id: property-id })))
)

(define-read-only (get-user-orders (user principal))
  (default-to (list) (get orders (map-get? user-orders { user: user })))
)

(define-read-only (get-property-price (property-id uint))
  (map-get? property-prices { property-id: property-id })
)

(define-read-only (get-trade (trade-id uint))
  (map-get? trades { trade-id: trade-id })
)

(define-read-only (get-next-order-id)
  (var-get next-order-id)
)

(define-read-only (get-total-volume)
  (var-get total-volume)
)

(define-read-only (calculate-fee (amount uint))
  (/ (* amount TRADING_FEE) BASIS_POINTS)
)

(define-read-only (get-order-book (property-id uint))
  (ok {
    buy-orders: (get-property-buy-orders property-id),
    sell-orders: (get-property-sell-orders property-id)
  })
)

;; Public functions

;; Create a buy order
(define-public (create-buy-order 
  (property-id uint)
  (shares uint)
  (price-per-share uint)
  (expires-in-blocks uint)
)
  (let (
    (order-id (var-get next-order-id))
    (total-value (* shares price-per-share))
    (fee-amount (calculate-fee total-value))
    (total-cost (+ total-value fee-amount))
    (expires-at (+ block-height expires-in-blocks))
  )
    (asserts! (> shares u0) ERR_INVALID_AMOUNT)
    (asserts! (> price-per-share u0) ERR_INVALID_PRICE)
    (asserts! (> expires-in-blocks u0) ERR_INVALID_AMOUNT)
    
    ;; Lock STX for the order (including fees)
    (try! (stx-transfer? total-cost tx-sender (as-contract tx-sender)))
    
    ;; Create the order
    (map-set orders
      { order-id: order-id }
      {
        creator: tx-sender,
        property-id: property-id,
        order-type: ORDER_TYPE_BUY,
        shares: shares,
        price-per-share: price-per-share,
        total-value: total-value,
        filled-shares: u0,
        status: ORDER_STATUS_ACTIVE,
        created-at: block-height,
        expires-at: expires-at
      }
    )
    
    ;; Add to property buy orders
    (let (
      (current-orders (get-property-buy-orders property-id))
    )
      (map-set property-buy-orders
        { property-id: property-id }
        { orders: (unwrap! (as-max-len? (append current-orders order-id) u50) ERR_INVALID_AMOUNT) }
      )
    )
    
    ;; Add to user orders
    (let (
      (current-user-orders (get-user-orders tx-sender))
    )
      (map-set user-orders
        { user: tx-sender }
        { orders: (unwrap! (as-max-len? (append current-user-orders order-id) u100) ERR_INVALID_AMOUNT) }
      )
    )
    
    ;; Increment order ID
    (var-set next-order-id (+ order-id u1))
    
    ;; Try to match with existing sell orders
    (try! (match-buy-order order-id))
    
    (ok order-id)
  )
)

;; Create a sell order
(define-public (create-sell-order
  (property-id uint)
  (shares uint)
  (price-per-share uint)
  (expires-in-blocks uint)
)
  (let (
    (order-id (var-get next-order-id))
    (total-value (* shares price-per-share))
    (expires-at (+ block-height expires-in-blocks))
  )
    (asserts! (> shares u0) ERR_INVALID_AMOUNT)
    (asserts! (> price-per-share u0) ERR_INVALID_PRICE)
    (asserts! (> expires-in-blocks u0) ERR_INVALID_AMOUNT)
    
    ;; Verify user has enough shares (this would call property contract)
    ;; For now, we'll assume this check is done externally
    
    ;; Create the order
    (map-set orders
      { order-id: order-id }
      {
        creator: tx-sender,
        property-id: property-id,
        order-type: ORDER_TYPE_SELL,
        shares: shares,
        price-per-share: price-per-share,
        total-value: total-value,
        filled-shares: u0,
        status: ORDER_STATUS_ACTIVE,
        created-at: block-height,
        expires-at: expires-at
      }
    )
    
    ;; Add to property sell orders
    (let (
      (current-orders (get-property-sell-orders property-id))
    )
      (map-set property-sell-orders
        { property-id: property-id }
        { orders: (unwrap! (as-max-len? (append current-orders order-id) u50) ERR_INVALID_AMOUNT) }
      )
    )
    
    ;; Add to user orders
    (let (
      (current-user-orders (get-user-orders tx-sender))
    )
      (map-set user-orders
        { user: tx-sender }
        { orders: (unwrap! (as-max-len? (append current-user-orders order-id) u100) ERR_INVALID_AMOUNT) }
      )
    )
    
    ;; Increment order ID
    (var-set next-order-id (+ order-id u1))
    
    ;; Try to match with existing buy orders
    (try! (match-sell-order order-id))
    
    (ok order-id)
  )
)

;; Cancel an order
(define-public (cancel-order (order-id uint))
  (let (
    (order-data (unwrap! (get-order order-id) ERR_NOT_FOUND))
  )
    (asserts! (is-eq tx-sender (get creator order-data)) ERR_UNAUTHORIZED)
    (asserts! (is-eq (get status order-data) ORDER_STATUS_ACTIVE) ERR_ORDER_FILLED)
    
    ;; Update order status
    (map-set orders
      { order-id: order-id }
      (merge order-data { status: ORDER_STATUS_CANCELLED })
    )
    
    ;; Refund locked STX for buy orders
    (if (is-eq (get order-type order-data) ORDER_TYPE_BUY)
      (let (
        (remaining-shares (- (get shares order-data) (get filled-shares order-data)))
        (remaining-value (* remaining-shares (get price-per-share order-data)))
        (fee-amount (calculate-fee remaining-value))
        (refund-amount (+ remaining-value fee-amount))
      )
        (try! (as-contract (stx-transfer? refund-amount tx-sender (get creator order-data))))
        (ok true)
      )
      (ok true)
    )
  )
)

;; Execute a trade between two orders
(define-public (execute-trade
  (buy-order-id uint)
  (sell-order-id uint)
  (shares-to-trade uint)
)
  (let (
    (buy-order (unwrap! (get-order buy-order-id) ERR_NOT_FOUND))
    (sell-order (unwrap! (get-order sell-order-id) ERR_NOT_FOUND))
    (trade-id (var-get next-trade-id))
  )
    ;; Validation
    (asserts! (is-eq (get property-id buy-order) (get property-id sell-order)) ERR_INVALID_AMOUNT)
    (asserts! (is-eq (get status buy-order) ORDER_STATUS_ACTIVE) ERR_ORDER_FILLED)
    (asserts! (is-eq (get status sell-order) ORDER_STATUS_ACTIVE) ERR_ORDER_FILLED)
    (asserts! (not (is-eq (get creator buy-order) (get creator sell-order))) ERR_SELF_TRADE)
    (asserts! (<= shares-to-trade (- (get shares buy-order) (get filled-shares buy-order))) ERR_INSUFFICIENT_SHARES)
    (asserts! (<= shares-to-trade (- (get shares sell-order) (get filled-shares sell-order))) ERR_INSUFFICIENT_SHARES)
    (asserts! (>= (get price-per-share buy-order) (get price-per-share sell-order)) ERR_INVALID_PRICE)
    
    ;; Execute the trade at the sell order price
    (let (
      (trade-price (get price-per-share sell-order))
      (trade-value (* shares-to-trade trade-price))
      (fee-amount (calculate-fee trade-value))
      (seller-receives (- trade-value fee-amount))
    )
      ;; Transfer STX from contract to seller
      (try! (as-contract (stx-transfer? seller-receives tx-sender (get creator sell-order))))
      
      ;; Transfer fees to fee recipient
      (try! (as-contract (stx-transfer? fee-amount tx-sender (var-get fee-recipient))))
      
      ;; Update order filled amounts
      (map-set orders
        { order-id: buy-order-id }
        (merge buy-order { 
          filled-shares: (+ (get filled-shares buy-order) shares-to-trade),
          status: (if (is-eq (+ (get filled-shares buy-order) shares-to-trade) (get shares buy-order)) ORDER_STATUS_FILLED ORDER_STATUS_ACTIVE)
        })
      )
      
      (map-set orders
        { order-id: sell-order-id }
        (merge sell-order { 
          filled-shares: (+ (get filled-shares sell-order) shares-to-trade),
          status: (if (is-eq (+ (get filled-shares sell-order) shares-to-trade) (get shares sell-order)) ORDER_STATUS_FILLED ORDER_STATUS_ACTIVE)
        })
      )
      
      ;; Record the trade
      (map-set trades
        { trade-id: trade-id }
        {
          property-id: (get property-id buy-order),
          buyer: (get creator buy-order),
          seller: (get creator sell-order),
          shares: shares-to-trade,
          price-per-share: trade-price,
          total-value: trade-value,
          fee-amount: fee-amount,
          buy-order-id: buy-order-id,
          sell-order-id: sell-order-id,
          executed-at: block-height
        }
      )
      
      ;; Update statistics
      (var-set next-trade-id (+ trade-id u1))
      (var-set total-volume (+ (var-get total-volume) trade-value))
      (var-set total-fees-collected (+ (var-get total-fees-collected) fee-amount))
      
      ;; Update property price data
      (try! (update-property-price (get property-id buy-order) trade-price trade-value))
      
      (ok trade-id)
    )
  )
)

;; Private functions

;; Match buy order with existing sell orders
(define-private (match-buy-order (buy-order-id uint))
  ;; Simplified matching logic - in practice, this would iterate through sell orders
  ;; and execute trades automatically
  (ok true)
)

;; Match sell order with existing buy orders
(define-private (match-sell-order (sell-order-id uint))
  ;; Simplified matching logic - in practice, this would iterate through buy orders
  ;; and execute trades automatically
  (ok true)
)

;; Update property price statistics
(define-private (update-property-price (property-id uint) (price uint) (volume uint))
  (let (
    (current-data (map-get? property-prices { property-id: property-id }))
  )
    (match current-data
      existing-data
      (map-set property-prices
        { property-id: property-id }
        {
          last-price: price,
          volume-24h: (+ (get volume-24h existing-data) volume),
          high-24h: (if (> price (get high-24h existing-data)) price (get high-24h existing-data)),
          low-24h: (if (< price (get low-24h existing-data)) price (get low-24h existing-data)),
          updated-at: block-height
        }
      )
      (map-set property-prices
        { property-id: property-id }
        {
          last-price: price,
          volume-24h: volume,
          high-24h: price,
          low-24h: price,
          updated-at: block-height
        }
      )
    )
    (ok true)
  )
)

;; Admin functions

;; Set property contract reference
(define-public (set-property-contract (new-contract principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (var-set property-contract new-contract)
    (ok true)
  )
)

;; Set fee recipient
(define-public (set-fee-recipient (new-recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (var-set fee-recipient new-recipient)
    (ok true)
  )
)

;; Emergency order cancellation
(define-public (emergency-cancel-order (order-id uint))
  (let (
    (order-data (unwrap! (get-order order-id) ERR_NOT_FOUND))
  )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    
    ;; Update order status
    (map-set orders
      { order-id: order-id }
      (merge order-data { status: ORDER_STATUS_CANCELLED })
    )
    
    (ok true)
  )
)