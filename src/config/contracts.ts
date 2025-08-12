// Realvora DApp Contract Configuration
// This file contains the deployed contract addresses and network configuration

import { StacksTestnet, StacksMainnet } from '@stacks/network';

// Network configuration
export const NETWORK_CONFIG = {
  testnet: {
    network: new StacksTestnet(),
    coreApiUrl: 'https://stacks-node-api.testnet.stacks.co',
    explorerUrl: 'https://explorer.stacks.co/?chain=testnet'
  },
  mainnet: {
    network: new StacksMainnet(),
    coreApiUrl: 'https://stacks-node-api.mainnet.stacks.co',
    explorerUrl: 'https://explorer.stacks.co'
  }
};

// Current network (change this for production)
export const CURRENT_NETWORK = 'testnet';
export const network = NETWORK_CONFIG[CURRENT_NETWORK].network;
export const coreApiUrl = NETWORK_CONFIG[CURRENT_NETWORK].coreApiUrl;
export const explorerUrl = NETWORK_CONFIG[CURRENT_NETWORK].explorerUrl;

// Deployed contract addresses on testnet
// These addresses are from the successful deployment
export const CONTRACT_ADDRESSES = {
  testnet: {
    deployer: 'ST7ZDSC9HA4R0Y1RE2H68MWHZJMR7HH4HTSERSVP',
    propertyNft: 'ST7ZDSC9HA4R0Y1RE2H68MWHZJMR7HH4HTSERSVP.realvora-property-nft',
    dao: 'ST7ZDSC9HA4R0Y1RE2H68MWHZJMR7HH4HTSERSVP.realvora-dao',
    marketplace: 'ST7ZDSC9HA4R0Y1RE2H68MWHZJMR7HH4HTSERSVP.realvora-marketplace'
  },
  mainnet: {
    deployer: '', // To be filled when deploying to mainnet
    propertyNft: '',
    dao: '',
    marketplace: ''
  }
};

// Current contract addresses based on network
export const CONTRACTS = CONTRACT_ADDRESSES[CURRENT_NETWORK];

// Contract transaction IDs (for reference)
export const DEPLOYMENT_TX_IDS = {
  testnet: {
    propertyNft: 'ac5bda1d16541b64d29907f2e27aed5ae85124c8848f4687e9894f12e1f822c2',
    dao: 'c586c743707d569ad6ad7377c4f81d808d049b4fb4316115008a36ffcf8babf1',
    marketplace: '7f6a9f9d4e4e20a9d40cbf106c406e2fe3e16f1ddf917bb1b2e55a99708568a0'
  }
};

// Contract function names for easy reference
export const CONTRACT_FUNCTIONS = {
  propertyNft: {
    createProperty: 'create-property',
    purchaseShares: 'purchase-shares',
    distributeRevenue: 'distribute-revenue',
    claimRevenue: 'claim-revenue',
    transferProperty: 'transfer-property',
    getProperty: 'get-property',
    getUserShares: 'get-user-shares',
    getRevenue: 'get-revenue'
  },
  dao: {
    createProposal: 'create-proposal',
    vote: 'vote',
    executeProposal: 'execute-proposal',
    updateVotingPower: 'update-voting-power',
    getProposal: 'get-proposal',
    getUserVotingPower: 'get-user-voting-power'
  },
  marketplace: {
    createBuyOrder: 'create-buy-order',
    createSellOrder: 'create-sell-order',
    executeTrade: 'execute-trade',
    cancelOrder: 'cancel-order',
    getOrder: 'get-order',
    getOrderBook: 'get-order-book'
  }
};

// Contract constants
export const CONTRACT_CONSTANTS = {
  tradingFee: 250, // 2.5% in basis points
  maxShareholders: 100,
  maxUserOrders: 100,
  votingPeriod: 1440, // blocks (~10 days)
  quorumThreshold: 50, // 50%
  approvalThreshold: 51 // 51%
};

// Helper function to get full contract identifier
export const getContractId = (contractName: keyof typeof CONTRACTS): string => {
  return CONTRACTS[contractName];
};

// Helper function to get explorer URL for transaction
export const getTransactionUrl = (txId: string): string => {
  return `${explorerUrl}/txid/${txId}`;
};

// Helper function to get explorer URL for contract
export const getContractUrl = (contractId: string): string => {
  return `${explorerUrl}/address/${contractId}`;
};

// Helper function to get explorer URL for address
export const getAddressUrl = (address: string): string => {
  return `${explorerUrl}/address/${address}`;
};