import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  kycStatus?: 'pending' | 'in_review' | 'approved' | 'rejected';
  kycSubmittedAt?: string;
  kycApprovedAt?: string;
  walletConnected: boolean;
  walletAddress?: string;
  createdAt: string;
  emailVerified: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected: walletConnected, userData: walletData } = useWallet();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // In a real app, validate token with backend
          const userData = localStorage.getItem('userData');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Synchronize wallet connection status with user data
  useEffect(() => {
    if (user) {
      const updatedUser = {
        ...user,
        walletConnected,
        walletAddress: walletData?.profile?.stxAddress?.mainnet || walletData?.profile?.stxAddress?.testnet || undefined
      };
      
      // Only update if there's actually a change to avoid infinite loops
      if (user.walletConnected !== walletConnected || user.walletAddress !== updatedUser.walletAddress) {
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    }
  }, [walletConnected, walletData, user?.walletConnected, user?.walletAddress]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Mock API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this comes from backend
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const existingUser = mockUsers.find((u: any) => u.email === email);
      
      if (!existingUser) {
        return { success: false, error: 'User not found' };
      }
      
      if (existingUser.password !== password) {
        return { success: false, error: 'Invalid password' };
      }
      
      const userData: User = {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        kycStatus: existingUser.kycStatus || 'pending',
        kycSubmittedAt: existingUser.kycSubmittedAt,
        kycApprovedAt: existingUser.kycApprovedAt,
        walletConnected: existingUser.walletConnected || false,
        walletAddress: existingUser.walletAddress,
        createdAt: existingUser.createdAt,
        emailVerified: existingUser.emailVerified || false
      };
      
      // Store auth token and user data
      const mockToken = `mock_token_${Date.now()}`;
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const existingUser = mockUsers.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email: userData.email,
        password: userData.password, // In real app, this should be hashed
        firstName: userData.firstName,
        lastName: userData.lastName,
        kycStatus: 'pending' as const,
        walletConnected: false,
        createdAt: new Date().toISOString(),
        emailVerified: false
      };
      
      // Store in mock database
      mockUsers.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      
      // Auto-login after registration
      const loginResult = await login(userData.email, userData.password);
      return loginResult;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Update in mock database
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const userIndex = mockUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      }
    }
  };

  const refreshUser = async () => {
    // In a real app, this would fetch fresh user data from the backend
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;