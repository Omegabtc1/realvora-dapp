import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

interface WalletContextType {
  userSession: UserSession | null;
  userData: any;
  isConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  network: StacksMainnet | StacksTestnet;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSession] = useState(new UserSession({ appConfig }));
  const [userData, setUserData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network] = useState(new StacksTestnet()); // Utiliser StacksMainnet() pour la production

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
        setIsConnected(true);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
      setIsConnected(true);
    }
  }, [userSession]);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'Realvora',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut('/');
    setUserData(null);
    setIsConnected(false);
  };

  const value = {
    userSession,
    userData,
    isConnected,
    connectWallet,
    disconnectWallet,
    network,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};