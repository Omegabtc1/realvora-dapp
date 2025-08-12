// Realvora DApp Contract Service
// This service handles all interactions with the deployed smart contracts

import {
  makeContractCall,
  callReadOnlyFunction,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  createSTXPostCondition,
  FungibleConditionCode,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  listCV,
  tupleCV,
  boolCV,
  principalCV,
  cvToJSON,
  hexToCV
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import {
  CONTRACTS,
  CONTRACT_FUNCTIONS,
  network,
  coreApiUrl,
  getContractId
} from '../config/contracts';

// Types for contract interactions
export interface PropertyData {
  id: number;
  name: string;
  description: string;
  location: string;
  totalValue: number;
  totalShares: number;
  pricePerShare: number;
  rentalYield: number;
  metadataUri: string;
  owner: string;
  availableShares: number;
}

export interface ProposalData {
  id: number;
  propertyId: number;
  proposalType: string;
  title: string;
  description: string;
  amount: number;
  target: string;
  creator: string;
  votesFor: number;
  votesAgainst: number;
  status: string;
  createdAt: number;
  expiresAt: number;
}

export interface OrderData {
  id: number;
  propertyId: number;
  creator: string;
  shares: number;
  pricePerShare: number;
  orderType: 'buy' | 'sell';
  status: string;
  createdAt: number;
  expiresAt: number;
}

export interface UserShares {
  propertyId: number;
  shares: number;
  totalInvested: number;
}

// Contract Service Class
export class ContractService {
  private network: StacksNetwork;
  private apiUrl: string;

  constructor() {
    this.network = network;
    this.apiUrl = coreApiUrl;
  }

  // ========================================
  // PROPERTY NFT CONTRACT FUNCTIONS
  // ========================================

  /**
   * Create a new property
   */
  async createProperty(
    senderKey: string,
    name: string,
    description: string,
    location: string,
    totalValue: number,
    totalShares: number,
    pricePerShare: number,
    rentalYield: number,
    metadataUri: string
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-property-nft',
      functionName: CONTRACT_FUNCTIONS.propertyNft.createProperty,
      functionArgs: [
        stringUtf8CV(name),
        stringUtf8CV(description),
        stringUtf8CV(location),
        uintCV(totalValue),
        uintCV(totalShares),
        uintCV(pricePerShare),
        uintCV(rentalYield),
        stringUtf8CV(metadataUri)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000, // 0.05 STX
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  /**
   * Purchase shares of a property
   */
  async purchaseShares(
    senderKey: string,
    propertyId: number,
    sharesToBuy: number,
    totalCost: number
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-property-nft',
      functionName: CONTRACT_FUNCTIONS.propertyNft.purchaseShares,
      functionArgs: [
        uintCV(propertyId),
        uintCV(sharesToBuy)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow,
      amount: totalCost // STX amount to transfer
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  /**
   * Distribute revenue to shareholders
   */
  async distributeRevenue(
    senderKey: string,
    propertyId: number,
    totalAmount: number,
    distributionId: number
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-property-nft',
      functionName: CONTRACT_FUNCTIONS.propertyNft.distributeRevenue,
      functionArgs: [
        uintCV(propertyId),
        uintCV(totalAmount),
        uintCV(distributionId)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  /**
   * Claim revenue distribution
   */
  async claimRevenue(
    senderKey: string,
    propertyId: number,
    distributionId: number
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-property-nft',
      functionName: CONTRACT_FUNCTIONS.propertyNft.claimRevenue,
      functionArgs: [
        uintCV(propertyId),
        uintCV(distributionId)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  // ========================================
  // DAO CONTRACT FUNCTIONS
  // ========================================

  /**
   * Create a governance proposal
   */
  async createProposal(
    senderKey: string,
    propertyId: number,
    proposalType: string,
    title: string,
    description: string,
    amount: number,
    target: string
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-dao',
      functionName: CONTRACT_FUNCTIONS.dao.createProposal,
      functionArgs: [
        uintCV(propertyId),
        stringAsciiCV(proposalType),
        stringUtf8CV(title),
        stringUtf8CV(description),
        uintCV(amount),
        principalCV(target)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  /**
   * Vote on a proposal
   */
  async vote(
    senderKey: string,
    proposalId: number,
    voteFor: boolean
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-dao',
      functionName: CONTRACT_FUNCTIONS.dao.vote,
      functionArgs: [
        uintCV(proposalId),
        boolCV(voteFor)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  /**
   * Execute a passed proposal
   */
  async executeProposal(
    senderKey: string,
    proposalId: number
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-dao',
      functionName: CONTRACT_FUNCTIONS.dao.executeProposal,
      functionArgs: [
        uintCV(proposalId)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  // ========================================
  // MARKETPLACE CONTRACT FUNCTIONS
  // ========================================

  /**
   * Create a buy order
   */
  async createBuyOrder(
    senderKey: string,
    propertyId: number,
    shares: number,
    pricePerShare: number,
    expiresInBlocks: number
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-marketplace',
      functionName: CONTRACT_FUNCTIONS.marketplace.createBuyOrder,
      functionArgs: [
        uintCV(propertyId),
        uintCV(shares),
        uintCV(pricePerShare),
        uintCV(expiresInBlocks)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  /**
   * Create a sell order
   */
  async createSellOrder(
    senderKey: string,
    propertyId: number,
    shares: number,
    pricePerShare: number,
    expiresInBlocks: number
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-marketplace',
      functionName: CONTRACT_FUNCTIONS.marketplace.createSellOrder,
      functionArgs: [
        uintCV(propertyId),
        uintCV(shares),
        uintCV(pricePerShare),
        uintCV(expiresInBlocks)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  /**
   * Execute a trade between orders
   */
  async executeTrade(
    senderKey: string,
    buyOrderId: number,
    sellOrderId: number,
    sharesToTrade: number
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-marketplace',
      functionName: CONTRACT_FUNCTIONS.marketplace.executeTrade,
      functionArgs: [
        uintCV(buyOrderId),
        uintCV(sellOrderId),
        uintCV(sharesToTrade)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  /**
   * Cancel an order
   */
  async cancelOrder(
    senderKey: string,
    orderId: number
  ) {
    const txOptions = {
      contractAddress: CONTRACTS.deployer,
      contractName: 'realvora-marketplace',
      functionName: CONTRACT_FUNCTIONS.marketplace.cancelOrder,
      functionArgs: [
        uintCV(orderId)
      ],
      senderKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      fee: 50000,
      postConditionMode: PostConditionMode.Allow
    };

    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, this.network);
  }

  // ========================================
  // READ-ONLY FUNCTIONS
  // ========================================

  /**
   * Get property information
   */
  async getProperty(propertyId: number): Promise<PropertyData | null> {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACTS.deployer,
        contractName: 'realvora-property-nft',
        functionName: CONTRACT_FUNCTIONS.propertyNft.getProperty,
        functionArgs: [uintCV(propertyId)],
        network: this.network,
        senderAddress: CONTRACTS.deployer
      });

      const data = cvToJSON(result);
      if (data.success && data.value) {
        return this.parsePropertyData(data.value);
      }
      return null;
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  }

  /**
   * Get user shares for a property
   */
  async getUserShares(userAddress: string, propertyId: number): Promise<number> {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACTS.deployer,
        contractName: 'realvora-property-nft',
        functionName: CONTRACT_FUNCTIONS.propertyNft.getUserShares,
        functionArgs: [
          principalCV(userAddress),
          uintCV(propertyId)
        ],
        network: this.network,
        senderAddress: CONTRACTS.deployer
      });

      const data = cvToJSON(result);
      return data.value || 0;
    } catch (error) {
      console.error('Error fetching user shares:', error);
      return 0;
    }
  }

  /**
   * Get proposal information
   */
  async getProposal(proposalId: number): Promise<ProposalData | null> {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACTS.deployer,
        contractName: 'realvora-dao',
        functionName: CONTRACT_FUNCTIONS.dao.getProposal,
        functionArgs: [uintCV(proposalId)],
        network: this.network,
        senderAddress: CONTRACTS.deployer
      });

      const data = cvToJSON(result);
      if (data.success && data.value) {
        return this.parseProposalData(data.value);
      }
      return null;
    } catch (error) {
      console.error('Error fetching proposal:', error);
      return null;
    }
  }

  /**
   * Get order information
   */
  async getOrder(orderId: number): Promise<OrderData | null> {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACTS.deployer,
        contractName: 'realvora-marketplace',
        functionName: CONTRACT_FUNCTIONS.marketplace.getOrder,
        functionArgs: [uintCV(orderId)],
        network: this.network,
        senderAddress: CONTRACTS.deployer
      });

      const data = cvToJSON(result);
      if (data.success && data.value) {
        return this.parseOrderData(data.value);
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  private parsePropertyData(data: any): PropertyData {
    return {
      id: data.id?.value || 0,
      name: data.name?.value || '',
      description: data.description?.value || '',
      location: data.location?.value || '',
      totalValue: data['total-value']?.value || 0,
      totalShares: data['total-shares']?.value || 0,
      pricePerShare: data['price-per-share']?.value || 0,
      rentalYield: data['rental-yield']?.value || 0,
      metadataUri: data['metadata-uri']?.value || '',
      owner: data.owner?.value || '',
      availableShares: data['available-shares']?.value || 0
    };
  }

  private parseProposalData(data: any): ProposalData {
    return {
      id: data.id?.value || 0,
      propertyId: data['property-id']?.value || 0,
      proposalType: data['proposal-type']?.value || '',
      title: data.title?.value || '',
      description: data.description?.value || '',
      amount: data.amount?.value || 0,
      target: data.target?.value || '',
      creator: data.creator?.value || '',
      votesFor: data['votes-for']?.value || 0,
      votesAgainst: data['votes-against']?.value || 0,
      status: data.status?.value || '',
      createdAt: data['created-at']?.value || 0,
      expiresAt: data['expires-at']?.value || 0
    };
  }

  private parseOrderData(data: any): OrderData {
    return {
      id: data.id?.value || 0,
      propertyId: data['property-id']?.value || 0,
      creator: data.creator?.value || '',
      shares: data.shares?.value || 0,
      pricePerShare: data['price-per-share']?.value || 0,
      orderType: data['order-type']?.value || 'buy',
      status: data.status?.value || '',
      createdAt: data['created-at']?.value || 0,
      expiresAt: data['expires-at']?.value || 0
    };
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForConfirmation(txId: string, maxAttempts: number = 30): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`${this.apiUrl}/extended/v1/tx/${txId}`);
        const txData = await response.json();
        
        if (txData.tx_status === 'success') {
          return true;
        } else if (txData.tx_status === 'abort_by_response' || txData.tx_status === 'abort_by_post_condition') {
          throw new Error(`Transaction failed: ${txData.tx_status}`);
        }
        
        // Wait 10 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (error) {
        console.error('Error checking transaction status:', error);
      }
    }
    
    throw new Error('Transaction confirmation timeout');
  }
}

// Export singleton instance
export const contractService = new ContractService();
export default contractService;