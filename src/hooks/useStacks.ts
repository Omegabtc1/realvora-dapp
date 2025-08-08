import { useWallet } from '@/contexts/WalletContext';
import { 
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { openSTXTransfer } from '@stacks/connect';

export const useStacks = () => {
  const { userSession, userData, isConnected, network } = useWallet();

  const sendSTX = async (recipient: string, amount: number, memo?: string) => {
    if (!isConnected || !userSession) {
      throw new Error('Wallet not connected');
    }

    const txOptions = {
      recipient,
      amount: BigInt(amount * 1000000), // Convert to microSTX
      memo,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data: any) => {
        console.log('Transaction broadcasted:', data);
      },
      onCancel: () => {
        console.log('Transaction cancelled');
      },
    };

    await openSTXTransfer(txOptions);
  };

  const getBalance = async () => {
    if (!userData?.profile?.stxAddress?.mainnet) {
      return null;
    }

    try {
      const response = await fetch(
        `${network.coreApiUrl}/extended/v1/address/${userData.profile.stxAddress.mainnet}/balances`
      );
      const data = await response.json();
      return {
        stx: parseInt(data.stx.balance) / 1000000, // Convert from microSTX
        locked: parseInt(data.stx.locked) / 1000000,
        total_sent: parseInt(data.stx.total_sent) / 1000000,
        total_received: parseInt(data.stx.total_received) / 1000000,
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  };

  const getTransactions = async (limit = 50) => {
    if (!userData?.profile?.stxAddress?.mainnet) {
      return [];
    }

    try {
      const response = await fetch(
        `${network.coreApiUrl}/extended/v1/address/${userData.profile.stxAddress.mainnet}/transactions?limit=${limit}`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  return {
    userSession,
    userData,
    isConnected,
    network,
    sendSTX,
    getBalance,
    getTransactions,
    address: userData?.profile?.stxAddress?.mainnet || null,
  };
};