// Custom React hook for contract interactions
// This hook provides easy access to contract functions with loading states and error handling

import { useState, useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { contractService, PropertyData, ProposalData, OrderData } from '../services/contractService';
import { CONTRACTS, network } from '../config/contracts';
import {
  uintCV,
  stringUtf8CV,
  stringAsciiCV,
  principalCV,
  boolCV,
  AnchorMode,
  PostConditionMode
} from '@stacks/transactions';

export interface ContractCallOptions {
  onSuccess?: (txId: string) => void;
  onError?: (error: string) => void;
  onFinish?: () => void;
}

export const useContracts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle contract calls with Stacks Connect
  const executeContractCall = useCallback(
    async (
      contractName: string,
      functionName: string,
      functionArgs: any[],
      options: ContractCallOptions = {}
    ) => {
      setLoading(true);
      setError(null);

      try {
        await openContractCall({
          contractAddress: CONTRACTS.deployer,
          contractName,
          functionName,
          functionArgs,
          network,
          anchorMode: AnchorMode.Any,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data) => {
            setLoading(false);
            if (data.txId) {
              options.onSuccess?.(data.txId);
            }
            options.onFinish?.();
          },
          onCancel: () => {
            setLoading(false);
            setError('Transaction cancelled by user');
            options.onError?.('Transaction cancelled by user');
            options.onFinish?.();
          }
        });
      } catch (err) {
        setLoading(false);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
        options.onFinish?.();
      }
    },
    [openContractCall]
  );

  // ========================================
  // PROPERTY NFT CONTRACT FUNCTIONS
  // ========================================

  const createProperty = useCallback(
    async (
      name: string,
      description: string,
      location: string,
      totalValue: number,
      totalShares: number,
      pricePerShare: number,
      rentalYield: number,
      metadataUri: string,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-property-nft',
        'create-property',
        [
          stringUtf8CV(name),
          stringUtf8CV(description),
          stringUtf8CV(location),
          uintCV(totalValue),
          uintCV(totalShares),
          uintCV(pricePerShare),
          uintCV(rentalYield),
          stringUtf8CV(metadataUri)
        ],
        options
      );
    },
    [executeContractCall]
  );

  const purchaseShares = useCallback(
    async (
      propertyId: number,
      sharesToBuy: number,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-property-nft',
        'purchase-shares',
        [
          uintCV(propertyId),
          uintCV(sharesToBuy)
        ],
        options
      );
    },
    [executeContractCall]
  );

  const distributeRevenue = useCallback(
    async (
      propertyId: number,
      totalAmount: number,
      distributionId: number,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-property-nft',
        'distribute-revenue',
        [
          uintCV(propertyId),
          uintCV(totalAmount),
          uintCV(distributionId)
        ],
        options
      );
    },
    [executeContractCall]
  );

  const claimRevenue = useCallback(
    async (
      propertyId: number,
      distributionId: number,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-property-nft',
        'claim-revenue',
        [
          uintCV(propertyId),
          uintCV(distributionId)
        ],
        options
      );
    },
    [executeContractCall]
  );

  // ========================================
  // DAO CONTRACT FUNCTIONS
  // ========================================

  const createProposal = useCallback(
    async (
      propertyId: number,
      proposalType: string,
      title: string,
      description: string,
      amount: number,
      target: string,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-dao',
        'create-proposal',
        [
          uintCV(propertyId),
          stringAsciiCV(proposalType),
          stringUtf8CV(title),
          stringUtf8CV(description),
          uintCV(amount),
          principalCV(target)
        ],
        options
      );
    },
    [executeContractCall]
  );

  const vote = useCallback(
    async (
      proposalId: number,
      voteFor: boolean,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-dao',
        'vote',
        [
          uintCV(proposalId),
          boolCV(voteFor)
        ],
        options
      );
    },
    [executeContractCall]
  );

  const executeProposal = useCallback(
    async (
      proposalId: number,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-dao',
        'execute-proposal',
        [uintCV(proposalId)],
        options
      );
    },
    [executeContractCall]
  );

  // ========================================
  // MARKETPLACE CONTRACT FUNCTIONS
  // ========================================

  const createBuyOrder = useCallback(
    async (
      propertyId: number,
      shares: number,
      pricePerShare: number,
      expiresInBlocks: number,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-marketplace',
        'create-buy-order',
        [
          uintCV(propertyId),
          uintCV(shares),
          uintCV(pricePerShare),
          uintCV(expiresInBlocks)
        ],
        options
      );
    },
    [executeContractCall]
  );

  const createSellOrder = useCallback(
    async (
      propertyId: number,
      shares: number,
      pricePerShare: number,
      expiresInBlocks: number,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-marketplace',
        'create-sell-order',
        [
          uintCV(propertyId),
          uintCV(shares),
          uintCV(pricePerShare),
          uintCV(expiresInBlocks)
        ],
        options
      );
    },
    [executeContractCall]
  );

  const executeTrade = useCallback(
    async (
      buyOrderId: number,
      sellOrderId: number,
      sharesToTrade: number,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-marketplace',
        'execute-trade',
        [
          uintCV(buyOrderId),
          uintCV(sellOrderId),
          uintCV(sharesToTrade)
        ],
        options
      );
    },
    [executeContractCall]
  );

  const cancelOrder = useCallback(
    async (
      orderId: number,
      options?: ContractCallOptions
    ) => {
      await executeContractCall(
        'realvora-marketplace',
        'cancel-order',
        [uintCV(orderId)],
        options
      );
    },
    [executeContractCall]
  );

  // ========================================
  // READ-ONLY FUNCTIONS
  // ========================================

  const getProperty = useCallback(
    async (propertyId: number): Promise<PropertyData | null> => {
      try {
        setLoading(true);
        
        // For demo purposes, return mock data if contract call fails
        try {
          const property = await contractService.getProperty(propertyId);
          if (property) return property;
        } catch (contractError) {
          console.warn('Contract call failed, using mock data:', contractError);
        }
        
        // Mock data for demonstration
        const mockProperties: { [key: number]: PropertyData } = {
          1: {
            id: 1,
            name: "Villa Moderne Paris",
            description: "Beautiful modern villa in the 16th arrondissement",
            location: "Paris 16ème, France",
            totalValue: 2500000000000, // 2.5M STX
            totalShares: 1000,
            pricePerShare: 2500000000, // 2500 STX
            rentalYield: 850, // 8.5%
            metadataUri: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
            owner: "ST7ZDSC9HA4R0Y1RE2H68MWHZJMR7HH4HTSERSVP",
            availableShares: 234
          },
          2: {
            id: 2,
            name: "Appartement Haussmannien",
            description: "Prestigious Haussmannian-style apartment",
            location: "Paris 8ème, France",
            totalValue: 1800000000000, // 1.8M STX
            totalShares: 2000,
            pricePerShare: 900000000, // 900 STX
            rentalYield: 1120, // 11.2%
            metadataUri: "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80",
            owner: "ST7ZDSC9HA4R0Y1RE2H68MWHZJMR7HH4HTSERSVP",
            availableShares: 1450
          },
          3: {
            id: 3,
            name: "Loft Design Berlin",
            description: "Modern loft in Berlin's artistic district",
            location: "Berlin, Allemagne",
            totalValue: 1200000000000, // 1.2M STX
            totalShares: 1500,
            pricePerShare: 800000000, // 800 STX
            rentalYield: 1280, // 12.8%
            metadataUri: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80",
            owner: "ST7ZDSC9HA4R0Y1RE2H68MWHZJMR7HH4HTSERSVP",
            availableShares: 890
          }
        };
        
        return mockProperties[propertyId] || null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error retrieving property';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getUserShares = useCallback(
    async (userAddress: string, propertyId: number): Promise<number> => {
      try {
        // Try to get real data first
        try {
          const shares = await contractService.getUserShares(userAddress, propertyId);
          if (shares > 0) return shares;
        } catch (contractError) {
          console.warn('Contract call failed for user shares, using mock data:', contractError);
        }
        
        // Mock data for demonstration - simulate user having some shares
        const mockUserShares: { [key: string]: { [propertyId: number]: number } } = {
          // Default test address shares
          'ST7ZDSC9HA4R0Y1RE2H68MWHZJMR7HH4HTSERSVP': {
            1: 25, // 25 shares in property 1
            2: 50, // 50 shares in property 2
          },
          // Add more mock addresses if needed
        };
        
        return mockUserShares[userAddress]?.[propertyId] || 0;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error retrieving user shares';
        setError(errorMessage);
        return 0;
      }
    },
    []
  );

  const getProposal = useCallback(
    async (proposalId: number): Promise<ProposalData | null> => {
      try {
        return await contractService.getProposal(proposalId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch proposal';
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  const getOrder = useCallback(
    async (orderId: number): Promise<OrderData | null> => {
      try {
        return await contractService.getOrder(orderId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const waitForConfirmation = useCallback(
    async (txId: string): Promise<boolean> => {
      try {
        return await contractService.waitForConfirmation(txId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Transaction confirmation failed';
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  return {
    // State
    loading,
    error,
    
    // Property NFT functions
    createProperty,
    purchaseShares,
    distributeRevenue,
    claimRevenue,
    
    // DAO functions
    createProposal,
    vote,
    executeProposal,
    
    // Marketplace functions
    createBuyOrder,
    createSellOrder,
    executeTrade,
    cancelOrder,
    
    // Read-only functions
    getProperty,
    getUserShares,
    getProposal,
    getOrder,
    
    // Utility functions
    clearError,
    waitForConfirmation
  };
};

export default useContracts;