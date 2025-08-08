# Stacks Wallet Integration - Realvora DApp

## 📋 Overview

This documentation describes the implementation of Stacks wallet connection in the Realvora DApp application. The integration allows users to connect their Stacks wallets (Xverse, Leather) to interact with the blockchain.

## 🏗️ Architecture

### Main Components

1. **WalletContext** (`src/contexts/WalletContext.tsx`)
   - React context to manage global wallet state
   - Handles connection/disconnection
   - Stores user information

2. **WalletButton** (`src/components/WalletButton.tsx`)
   - UI component for wallet connection
   - Dropdown menu with user information
   - Actions: copy address, disconnect, view on explorer

3. **WalletInfo** (`src/components/WalletInfo.tsx`)
   - Displays detailed wallet information
   - STX balance, transaction history
   - Integrated in the Dashboard

4. **useStacks Hook** (`src/hooks/useStacks.ts`)
   - Custom hook for Stacks interactions
   - Functions: send STX, fetch balance, history

## 🔧 Added Dependencies

```json
{
  "@stacks/connect": "^7.8.1",
  "@stacks/wallet-sdk": "^6.13.0",
  "@stacks/transactions": "^6.13.0",
  "@stacks/network": "^6.13.0"
}
```

## 🚀 Implemented Features

### ✅ Wallet Connection
- Support for Xverse and Leather wallets
- Automatic session management
- Intuitive user interface

### ✅ Information Display
- Wallet address (truncated with copy option)
- Real-time STX balance
- Connection status

### ✅ UI Integration
- Connection button in the Header
- Wallet information in the Dashboard
- Consistent design with Realvora brand guidelines

### ✅ Advanced Features
- One-click address copying
- Link to Stacks explorer
- Balance refresh
- Error handling

## 🎯 Usage

### Connecting a Wallet
1. Click "Connect Wallet" in the header
2. Choose the wallet (Xverse/Leather)
3. Authorize the connection
4. State is automatically updated

### Using the useStacks Hook
```typescript
import { useStacks } from '@/hooks/useStacks';

const MyComponent = () => {
  const { isConnected, address, getBalance, sendSTX } = useStacks();
  
  // Check connection
  if (!isConnected) {
    return <div>Wallet not connected</div>;
  }
  
  // Use features
  const handleSendSTX = async () => {
    await sendSTX('SP1234...', 1.5, 'Test transaction');
  };
  
  return (
    <div>
      <p>Address: {address}</p>
      <button onClick={handleSendSTX}>Send STX</button>
    </div>
  );
};
```

## 🔒 Security

- Uses testnet by default (configurable)
- Client-side transaction validation
- Secure user session management
- No private key storage

## 🌐 Network Configuration

By default, the application uses **Stacks Testnet**. To switch to mainnet:

```typescript
// In src/contexts/WalletContext.tsx
const [network] = useState(new StacksMainnet()); // Change here
```

## 🔄 Next Steps

### Features to Implement
- [ ] NFT transactions (mint, transfer)
- [ ] Clarity smart contract integration
- [ ] Message signing
- [ ] Multi-signature
- [ ] Detailed transaction history

### UI/UX Improvements
- [ ] Connection animations
- [ ] Enhanced toast notifications
- [ ] Dark mode for wallet components
- [ ] Optimized responsive design

## 🐛 Troubleshooting

### Common Issues

1. **Wallet not detected**
   - Verify that Xverse or Leather is installed
   - Refresh the page

2. **Connection error**
   - Check internet connection
   - Try disconnecting/reconnecting

3. **Balance not displayed**
   - Click the refresh button
   - Check network configuration

## 📝 Development Notes

- Integration is compatible with React 18+
- Uses TypeScript for type safety
- Follows React best practices (hooks, context)
- Consistent design system with shadcn/ui

---

**Developed for Realvora DApp** 🏠⛓️