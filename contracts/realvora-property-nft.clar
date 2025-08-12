;; Realvora Property NFT Contract
;; This contract manages tokenized real estate properties as NFTs
;; with fractional ownership capabilities

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_NOT_FOUND (err u101))
(define-constant ERR_ALREADY_EXISTS (err u102))
(define-constant ERR_INSUFFICIENT_FUNDS (err u103))
(define-constant ERR_INVALID_AMOUNT (err u104))
(define-constant ERR_PROPERTY_NOT_ACTIVE (err u105))
(define-constant ERR_EXCEEDS_MAX_SUPPLY (err u106))

;; Data Variables
(define-data-var next-property-id uint u1)
(define-data-var contract-uri (string-ascii 256) "https://realvora.com/metadata/")

;; Property Data Structure
(define-map properties
  { property-id: uint }
  {
    owner: principal,
    name: (string-ascii 64),
    description: (string-ascii 256),
    location: (string-ascii 128),
    total-value: uint,
    total-shares: uint,
    available-shares: uint,
    price-per-share: uint,
    rental-yield: uint, ;; Annual rental yield in basis points (e.g., 500 = 5%)
    is-active: bool,
    created-at: uint,
    metadata-uri: (string-ascii 256)
  }
)

;; Share ownership tracking
(define-map share-ownership
  { property-id: uint, owner: principal }
  { shares: uint }
)

;; Property share holders list
(define-map property-shareholders
  { property-id: uint }
  { shareholders: (list 100 principal) }
)

;; Revenue distribution tracking
(define-map revenue-distributions
  { property-id: uint, distribution-id: uint }
  {
    total-amount: uint,
    amount-per-share: uint,
    distributed-at: uint,
    is-claimed: bool
  }
)

;; User claims tracking
(define-map user-claims
  { property-id: uint, distribution-id: uint, user: principal }
  { claimed: bool, amount: uint }
)

;; NFT Implementation
(define-non-fungible-token realvora-property uint)

;; Read-only functions
(define-read-only (get-property (property-id uint))
  (map-get? properties { property-id: property-id })
)

(define-read-only (get-user-shares (property-id uint) (user principal))
  (default-to u0 (get shares (map-get? share-ownership { property-id: property-id, owner: user })))
)

(define-read-only (get-property-shareholders (property-id uint))
  (map-get? property-shareholders { property-id: property-id })
)

(define-read-only (get-next-property-id)
  (var-get next-property-id)
)

(define-read-only (get-contract-uri)
  (var-get contract-uri)
)

(define-read-only (get-token-uri (property-id uint))
  (match (get-property property-id)
    property-data (ok (get metadata-uri property-data))
    ERR_NOT_FOUND
  )
)

;; Public functions

;; Create a new property NFT
(define-public (create-property 
  (name (string-ascii 64))
  (description (string-ascii 256))
  (location (string-ascii 128))
  (total-value uint)
  (total-shares uint)
  (price-per-share uint)
  (rental-yield uint)
  (metadata-uri (string-ascii 256))
)
  (let (
    (property-id (var-get next-property-id))
  )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (asserts! (> total-shares u0) ERR_INVALID_AMOUNT)
    (asserts! (> price-per-share u0) ERR_INVALID_AMOUNT)
    
    ;; Mint the property NFT to the contract owner
    (try! (nft-mint? realvora-property property-id CONTRACT_OWNER))
    
    ;; Store property data
    (map-set properties
      { property-id: property-id }
      {
        owner: CONTRACT_OWNER,
        name: name,
        description: description,
        location: location,
        total-value: total-value,
        total-shares: total-shares,
        available-shares: total-shares,
        price-per-share: price-per-share,
        rental-yield: rental-yield,
        is-active: true,
        created-at: block-height,
        metadata-uri: metadata-uri
      }
    )
    
    ;; Initialize empty shareholders list
    (map-set property-shareholders
      { property-id: property-id }
      { shareholders: (list) }
    )
    
    ;; Increment next property ID
    (var-set next-property-id (+ property-id u1))
    
    (ok property-id)
  )
)

;; Purchase shares of a property
(define-public (purchase-shares (property-id uint) (shares-to-buy uint))
  (let (
    (property-data (unwrap! (get-property property-id) ERR_NOT_FOUND))
    (current-shares (get-user-shares property-id tx-sender))
    (total-cost (* shares-to-buy (get price-per-share property-data)))
    (available-shares (get available-shares property-data))
  )
    (asserts! (get is-active property-data) ERR_PROPERTY_NOT_ACTIVE)
    (asserts! (>= available-shares shares-to-buy) ERR_EXCEEDS_MAX_SUPPLY)
    (asserts! (> shares-to-buy u0) ERR_INVALID_AMOUNT)
    
    ;; Transfer STX payment to contract owner
    (try! (stx-transfer? total-cost tx-sender (get owner property-data)))
    
    ;; Update user's share ownership
    (map-set share-ownership
      { property-id: property-id, owner: tx-sender }
      { shares: (+ current-shares shares-to-buy) }
    )
    
    ;; Update available shares
    (map-set properties
      { property-id: property-id }
      (merge property-data { available-shares: (- available-shares shares-to-buy) })
    )
    
    ;; Add user to shareholders list if not already present
    (if (is-eq current-shares u0)
      (let (
        (current-shareholders (default-to (list) (get shareholders (get-property-shareholders property-id))))
      )
        (map-set property-shareholders
          { property-id: property-id }
          { shareholders: (unwrap! (as-max-len? (append current-shareholders tx-sender) u100) ERR_EXCEEDS_MAX_SUPPLY) }
        )
      )
      true
    )
    
    (ok shares-to-buy)
  )
)

;; Distribute rental income to shareholders
(define-public (distribute-revenue (property-id uint) (total-amount uint) (distribution-id uint))
  (let (
    (property-data (unwrap! (get-property property-id) ERR_NOT_FOUND))
    (total-shares (get total-shares property-data))
    (amount-per-share (/ total-amount total-shares))
  )
    (asserts! (is-eq tx-sender (get owner property-data)) ERR_UNAUTHORIZED)
    (asserts! (> total-amount u0) ERR_INVALID_AMOUNT)
    
    ;; Record the distribution
    (map-set revenue-distributions
      { property-id: property-id, distribution-id: distribution-id }
      {
        total-amount: total-amount,
        amount-per-share: amount-per-share,
        distributed-at: block-height,
        is-claimed: false
      }
    )
    
    (ok distribution-id)
  )
)

;; Claim revenue distribution
(define-public (claim-revenue (property-id uint) (distribution-id uint))
  (let (
    (distribution-data (unwrap! (map-get? revenue-distributions { property-id: property-id, distribution-id: distribution-id }) ERR_NOT_FOUND))
    (user-shares (get-user-shares property-id tx-sender))
    (claim-amount (* user-shares (get amount-per-share distribution-data)))
    (already-claimed (default-to false (get claimed (map-get? user-claims { property-id: property-id, distribution-id: distribution-id, user: tx-sender }))))
  )
    (asserts! (> user-shares u0) ERR_UNAUTHORIZED)
    (asserts! (not already-claimed) ERR_ALREADY_EXISTS)
    (asserts! (> claim-amount u0) ERR_INVALID_AMOUNT)
    
    ;; Mark as claimed
    (map-set user-claims
      { property-id: property-id, distribution-id: distribution-id, user: tx-sender }
      { claimed: true, amount: claim-amount }
    )
    
    ;; Transfer STX to user
    (try! (as-contract (stx-transfer? claim-amount tx-sender tx-sender)))
    
    (ok claim-amount)
  )
)

;; Transfer property NFT ownership
(define-public (transfer-property (property-id uint) (new-owner principal))
  (let (
    (property-data (unwrap! (get-property property-id) ERR_NOT_FOUND))
  )
    (asserts! (is-eq tx-sender (get owner property-data)) ERR_UNAUTHORIZED)
    
    ;; Transfer the NFT
    (try! (nft-transfer? realvora-property property-id tx-sender new-owner))
    
    ;; Update property owner
    (map-set properties
      { property-id: property-id }
      (merge property-data { owner: new-owner })
    )
    
    (ok true)
  )
)

;; Admin functions

;; Update contract URI
(define-public (set-contract-uri (new-uri (string-ascii 256)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (var-set contract-uri new-uri)
    (ok true)
  )
)

;; Toggle property active status
(define-public (toggle-property-status (property-id uint))
  (let (
    (property-data (unwrap! (get-property property-id) ERR_NOT_FOUND))
  )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    
    (map-set properties
      { property-id: property-id }
      (merge property-data { is-active: (not (get is-active property-data)) })
    )
    
    (ok true)
  )
)