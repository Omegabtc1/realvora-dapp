;; Realvora DAO Governance Contract
;; This contract manages decentralized governance for property decisions
;; and protocol upgrades through shareholder voting

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u200))
(define-constant ERR_NOT_FOUND (err u201))
(define-constant ERR_ALREADY_EXISTS (err u202))
(define-constant ERR_INVALID_PROPOSAL (err u203))
(define-constant ERR_VOTING_ENDED (err u204))
(define-constant ERR_VOTING_ACTIVE (err u205))
(define-constant ERR_ALREADY_VOTED (err u206))
(define-constant ERR_INSUFFICIENT_SHARES (err u207))
(define-constant ERR_PROPOSAL_NOT_PASSED (err u208))

;; Proposal types
(define-constant PROPOSAL_TYPE_PROPERTY_SALE u1)
(define-constant PROPOSAL_TYPE_PROPERTY_RENOVATION u2)
(define-constant PROPOSAL_TYPE_RENT_ADJUSTMENT u3)
(define-constant PROPOSAL_TYPE_PROTOCOL_UPGRADE u4)
(define-constant PROPOSAL_TYPE_TREASURY_ALLOCATION u5)

;; Voting parameters
(define-constant VOTING_PERIOD u1440) ;; ~10 days in blocks (assuming 10 min blocks)
(define-constant QUORUM_THRESHOLD u5000) ;; 50% in basis points
(define-constant APPROVAL_THRESHOLD u5100) ;; 51% in basis points

;; Data Variables
(define-data-var next-proposal-id uint u1)
(define-data-var treasury-balance uint u0)

;; Proposal structure
(define-map proposals
  { proposal-id: uint }
  {
    proposer: principal,
    property-id: (optional uint),
    proposal-type: uint,
    title: (string-ascii 128),
    description: (string-ascii 512),
    amount: (optional uint), ;; For financial proposals
    target: (optional principal), ;; For transfers or upgrades
    voting-start: uint,
    voting-end: uint,
    votes-for: uint,
    votes-against: uint,
    total-voting-power: uint,
    is-executed: bool,
    is-cancelled: bool
  }
)

;; Vote tracking
(define-map votes
  { proposal-id: uint, voter: principal }
  {
    voting-power: uint,
    vote: bool, ;; true = for, false = against
    voted-at: uint
  }
)

;; Shareholder voting power (based on total shares across all properties)
(define-map voting-power
  { user: principal }
  { power: uint, last-updated: uint }
)

;; Property contract reference
(define-data-var property-contract principal tx-sender)

;; Read-only functions
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { proposal-id: proposal-id })
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)

(define-read-only (get-voting-power (user principal))
  (default-to u0 (get power (map-get? voting-power { user: user })))
)

(define-read-only (get-next-proposal-id)
  (var-get next-proposal-id)
)

(define-read-only (get-treasury-balance)
  (var-get treasury-balance)
)

(define-read-only (calculate-quorum (total-voting-power uint))
  (/ (* total-voting-power QUORUM_THRESHOLD) u10000)
)

(define-read-only (calculate-approval-threshold (total-votes uint))
  (/ (* total-votes APPROVAL_THRESHOLD) u10000)
)

(define-read-only (is-proposal-passed (proposal-id uint))
  (match (get-proposal proposal-id)
    proposal-data
    (let (
      (total-votes (+ (get votes-for proposal-data) (get votes-against proposal-data)))
      (quorum (calculate-quorum (get total-voting-power proposal-data)))
      (approval-threshold (calculate-approval-threshold total-votes))
    )
      (and
        (>= total-votes quorum)
        (>= (get votes-for proposal-data) approval-threshold)
        (>= block-height (get voting-end proposal-data))
      )
    )
    false
  )
)

;; Public functions

;; Create a new proposal
(define-public (create-proposal
  (property-id (optional uint))
  (proposal-type uint)
  (title (string-ascii 128))
  (description (string-ascii 512))
  (amount (optional uint))
  (target (optional principal))
)
  (let (
    (proposal-id (var-get next-proposal-id))
    (user-power (get-voting-power tx-sender))
    (voting-start block-height)
    (voting-end (+ block-height VOTING_PERIOD))
  )
    ;; Require minimum voting power to create proposals (1% of total)
    (asserts! (>= user-power u100) ERR_INSUFFICIENT_SHARES)
    (asserts! (<= proposal-type PROPOSAL_TYPE_TREASURY_ALLOCATION) ERR_INVALID_PROPOSAL)
    
    ;; Store proposal
    (map-set proposals
      { proposal-id: proposal-id }
      {
        proposer: tx-sender,
        property-id: property-id,
        proposal-type: proposal-type,
        title: title,
        description: description,
        amount: amount,
        target: target,
        voting-start: voting-start,
        voting-end: voting-end,
        votes-for: u0,
        votes-against: u0,
        total-voting-power: u0, ;; Will be calculated when voting starts
        is-executed: false,
        is-cancelled: false
      }
    )
    
    ;; Increment proposal ID
    (var-set next-proposal-id (+ proposal-id u1))
    
    (ok proposal-id)
  )
)

;; Vote on a proposal
(define-public (vote (proposal-id uint) (vote-for bool))
  (let (
    (proposal-data (unwrap! (get-proposal proposal-id) ERR_NOT_FOUND))
    (user-power (get-voting-power tx-sender))
    (existing-vote (get-vote proposal-id tx-sender))
  )
    (asserts! (> user-power u0) ERR_INSUFFICIENT_SHARES)
    (asserts! (< block-height (get voting-end proposal-data)) ERR_VOTING_ENDED)
    (asserts! (>= block-height (get voting-start proposal-data)) ERR_VOTING_ACTIVE)
    (asserts! (is-none existing-vote) ERR_ALREADY_VOTED)
    (asserts! (not (get is-cancelled proposal-data)) ERR_INVALID_PROPOSAL)
    
    ;; Record the vote
    (map-set votes
      { proposal-id: proposal-id, voter: tx-sender }
      {
        voting-power: user-power,
        vote: vote-for,
        voted-at: block-height
      }
    )
    
    ;; Update proposal vote counts
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal-data
        {
          votes-for: (if vote-for (+ (get votes-for proposal-data) user-power) (get votes-for proposal-data)),
          votes-against: (if vote-for (get votes-against proposal-data) (+ (get votes-against proposal-data) user-power)),
          total-voting-power: (+ (get total-voting-power proposal-data) user-power)
        }
      )
    )
    
    (ok true)
  )
)

;; Execute a passed proposal
(define-public (execute-proposal (proposal-id uint))
  (let (
    (proposal-data (unwrap! (get-proposal proposal-id) ERR_NOT_FOUND))
  )
    (asserts! (is-proposal-passed proposal-id) ERR_PROPOSAL_NOT_PASSED)
    (asserts! (not (get is-executed proposal-data)) ERR_ALREADY_EXISTS)
    (asserts! (not (get is-cancelled proposal-data)) ERR_INVALID_PROPOSAL)
    
    ;; Mark as executed
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal-data { is-executed: true })
    )
    
    ;; Execute based on proposal type
    (match (get proposal-type proposal-data)
      PROPOSAL_TYPE_TREASURY_ALLOCATION (execute-treasury-allocation proposal-data)
      PROPOSAL_TYPE_PROTOCOL_UPGRADE (execute-protocol-upgrade proposal-data)
      ;; Other proposal types would be handled by external contracts
      (ok true)
    )
  )
)

;; Cancel a proposal (only by proposer or admin)
(define-public (cancel-proposal (proposal-id uint))
  (let (
    (proposal-data (unwrap! (get-proposal proposal-id) ERR_NOT_FOUND))
  )
    (asserts! (or 
      (is-eq tx-sender (get proposer proposal-data))
      (is-eq tx-sender CONTRACT_OWNER)
    ) ERR_UNAUTHORIZED)
    (asserts! (not (get is-executed proposal-data)) ERR_ALREADY_EXISTS)
    (asserts! (< block-height (get voting-end proposal-data)) ERR_VOTING_ENDED)
    
    ;; Mark as cancelled
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal-data { is-cancelled: true })
    )
    
    (ok true)
  )
)

;; Update user voting power (should be called when shares change)
(define-public (update-voting-power (user principal) (new-power uint))
  (begin
    ;; Only property contract can update voting power
    (asserts! (is-eq tx-sender (var-get property-contract)) ERR_UNAUTHORIZED)
    
    (map-set voting-power
      { user: user }
      { power: new-power, last-updated: block-height }
    )
    
    (ok true)
  )
)

;; Deposit to treasury
(define-public (deposit-treasury (amount uint))
  (begin
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (var-set treasury-balance (+ (var-get treasury-balance) amount))
    (ok true)
  )
)

;; Private functions for proposal execution

(define-private (execute-treasury-allocation (proposal-data (tuple (proposer principal) (property-id (optional uint)) (proposal-type uint) (title (string-ascii 128)) (description (string-ascii 512)) (amount (optional uint)) (target (optional principal)) (voting-start uint) (voting-end uint) (votes-for uint) (votes-against uint) (total-voting-power uint) (is-executed bool) (is-cancelled bool))))
  (let (
    (amount (unwrap! (get amount proposal-data) ERR_INVALID_PROPOSAL))
    (target (unwrap! (get target proposal-data) ERR_INVALID_PROPOSAL))
    (current-balance (var-get treasury-balance))
  )
    (asserts! (>= current-balance amount) ERR_INSUFFICIENT_SHARES)
    
    ;; Transfer from treasury
    (try! (as-contract (stx-transfer? amount tx-sender target)))
    (var-set treasury-balance (- current-balance amount))
    
    (ok true)
  )
)

(define-private (execute-protocol-upgrade (proposal-data (tuple (proposer principal) (property-id (optional uint)) (proposal-type uint) (title (string-ascii 128)) (description (string-ascii 512)) (amount (optional uint)) (target (optional principal)) (voting-start uint) (voting-end uint) (votes-for uint) (votes-against uint) (total-voting-power uint) (is-executed bool) (is-cancelled bool))))
  ;; Protocol upgrades would be handled by updating contract references
  ;; This is a placeholder for future implementation
  (ok true)
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

;; Emergency functions

;; Pause voting (emergency only)
(define-public (emergency-pause-proposal (proposal-id uint))
  (let (
    (proposal-data (unwrap! (get-proposal proposal-id) ERR_NOT_FOUND))
  )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    
    ;; Mark as cancelled
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal-data { is-cancelled: true })
    )
    
    (ok true)
  )
)