# Realvora DApp Smart Contracts

This directory contains the Clarity smart contracts for the Realvora decentralized real estate investment platform. The contracts enable tokenized property ownership, fractional shares trading, and decentralized governance.

## 📋 Contract Overview

### 1. Property NFT Contract (`realvora-property-nft.clar`)

**Purpose**: Core contract for tokenizing real estate properties as NFTs with fractional ownership capabilities.

**Key Features**:
- Property tokenization as NFTs
- Fractional share ownership system
- Revenue distribution to shareholders
- Property metadata management
- Share purchase and transfer functionality

**Main Functions**:
- `create-property`: Create a new tokenized property
- `purchase-shares`: Buy fractional shares of a property
- `distribute-revenue`: Distribute rental income to shareholders
- `claim-revenue`: Claim revenue distributions
- `transfer-property`: Transfer property NFT ownership

### 2. DAO Governance Contract (`realvora-dao.clar`)

**Purpose**: Decentralized governance system for property-related decisions and protocol upgrades.

**Key Features**:
- Proposal creation and voting system
- Shareholder-based voting power
- Multiple proposal types (sales, renovations, rent adjustments)
- Quorum and approval thresholds
- Treasury management

**Main Functions**:
- `create-proposal`: Create governance proposals
- `vote`: Vote on active proposals
- `execute-proposal`: Execute passed proposals
- `update-voting-power`: Update user voting power based on shares

### 3. Marketplace Contract (`realvora-marketplace.clar`)

**Purpose**: Peer-to-peer marketplace for trading property shares with order book functionality.

**Key Features**:
- Buy/sell order creation
- Automated order matching
- Trading fee system
- Order book management
- Price tracking and statistics

**Main Functions**:
- `create-buy-order`: Create buy orders for property shares
- `create-sell-order`: Create sell orders for property shares
- `execute-trade`: Execute trades between orders
- `cancel-order`: Cancel active orders

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Realvora DApp Architecture               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Frontend      │    │   Backend       │                │
│  │   (React)       │◄──►│   (Optional)    │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Stacks Blockchain                          ││
│  │                                                         ││
│  │  ┌─────────────────┐  ┌─────────────────┐              ││
│  │  │ Property NFT    │  │ DAO Governance  │              ││
│  │  │ Contract        │◄─┤ Contract        │              ││
│  │  │                 │  │                 │              ││
│  │  │ • Tokenization  │  │ • Proposals     │              ││
│  │  │ • Shares        │  │ • Voting        │              ││
│  │  │ • Revenue       │  │ • Execution     │              ││
│  │  └─────────────────┘  └─────────────────┘              ││
│  │           │                     │                      ││
│  │           ▼                     ▼                      ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │           Marketplace Contract                      │││
│  │  │                                                     │││
│  │  │ • Order Book        • Trade Execution              │││
│  │  │ • Price Discovery   • Fee Collection               │││
│  │  │ • Liquidity         • Statistics                   │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment

### Prerequisites

1. **Install Clarinet** (Stacks development tool):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   cargo install clarinet
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install @stacks/transactions @stacks/network
   ```

### Local Development

1. **Start local Stacks node**:
   ```bash
   clarinet integrate
   ```

2. **Run contract tests**:
   ```bash
   clarinet test
   ```

3. **Deploy to local network**:
   ```bash
   clarinet deploy --local
   ```

### Testnet Deployment

1. **Set environment variables**:
   ```bash
   export NETWORK=testnet
   export PRIVATE_KEY=your_private_key_here
   ```

2. **Run deployment script**:
   ```bash
   node deploy.js
   ```

### Mainnet Deployment

1. **Set environment variables**:
   ```bash
   export NETWORK=mainnet
   export PRIVATE_KEY=your_private_key_here
   ```

2. **Run deployment script**:
   ```bash
   node deploy.js
   ```

## 🔧 Configuration

### Contract Parameters

**Property NFT Contract**:
- `TRADING_FEE`: 250 basis points (2.5%)
- `MAX_SHAREHOLDERS`: 100 per property
- `MAX_USER_ORDERS`: 100 per user

**DAO Contract**:
- `VOTING_PERIOD`: 1440 blocks (~10 days)
- `QUORUM_THRESHOLD`: 50% of total voting power
- `APPROVAL_THRESHOLD`: 51% of votes cast

**Marketplace Contract**:
- `TRADING_FEE`: 250 basis points (2.5%)
- `MAX_ORDERS_PER_PROPERTY`: 50
- `MAX_USER_ORDERS`: 100

### Network Configuration

**Testnet**:
- RPC: `https://stacks-node-api.testnet.stacks.co`
- Explorer: `https://explorer.stacks.co/?chain=testnet`

**Mainnet**:
- RPC: `https://stacks-node-api.mainnet.stacks.co`
- Explorer: `https://explorer.stacks.co`

## 📊 Contract Interactions

### Property Creation Flow

1. **Deploy Property**: Call `create-property` with property details
2. **Set Metadata**: Upload property metadata to IPFS
3. **Enable Trading**: Property becomes available for share purchases
4. **Revenue Distribution**: Periodic revenue distributions to shareholders

### Governance Flow

1. **Create Proposal**: Shareholders create governance proposals
2. **Voting Period**: Shareholders vote based on their share ownership
3. **Execution**: Passed proposals are executed automatically
4. **Treasury Management**: DAO manages protocol treasury

### Trading Flow

1. **Create Orders**: Users create buy/sell orders
2. **Order Matching**: Automatic matching of compatible orders
3. **Trade Execution**: Trades executed with fee collection
4. **Settlement**: Share ownership updated in property contract

## 🔒 Security Considerations

### Access Control
- Contract owner privileges for emergency functions
- Shareholder-based permissions for governance
- User ownership verification for trades

### Economic Security
- Trading fees prevent spam attacks
- Minimum voting power requirements for proposals
- Locked funds during active orders

### Upgrade Path
- DAO-controlled contract upgrades
- Emergency pause mechanisms
- Gradual migration strategies

## 🧪 Testing

The contracts include comprehensive test suites covering:

- Property creation and share management
- Revenue distribution mechanisms
- Governance proposal lifecycle
- Marketplace order matching
- Edge cases and error conditions

Run tests with:
```bash
clarinet test
```

## 📚 API Reference

### Property NFT Contract

```clarity
;; Create a new property
(create-property name description location total-value total-shares price-per-share rental-yield metadata-uri)

;; Purchase property shares
(purchase-shares property-id shares-to-buy)

;; Distribute revenue to shareholders
(distribute-revenue property-id total-amount distribution-id)

;; Claim revenue distribution
(claim-revenue property-id distribution-id)
```

### DAO Contract

```clarity
;; Create governance proposal
(create-proposal property-id proposal-type title description amount target)

;; Vote on proposal
(vote proposal-id vote-for)

;; Execute passed proposal
(execute-proposal proposal-id)
```

### Marketplace Contract

```clarity
;; Create buy order
(create-buy-order property-id shares price-per-share expires-in-blocks)

;; Create sell order
(create-sell-order property-id shares price-per-share expires-in-blocks)

;; Execute trade
(execute-trade buy-order-id sell-order-id shares-to-trade)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions and support:
- GitHub Issues: [Create an issue](https://github.com/realvora/realvora-dapp/issues)
- Discord: [Join our community](https://discord.gg/realvora)
- Documentation: [Read the docs](https://docs.realvora.com)

---

**Built with ❤️ for the future of real estate investment** 🏠⛓️