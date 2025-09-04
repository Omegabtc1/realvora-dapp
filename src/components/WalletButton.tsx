import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, LogOut, User, Copy, Check, Shield, AlertTriangle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WalletButton: React.FC = () => {
  const { isConnected, userData, connectWallet, disconnectWallet } = useWallet();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showKycWarning, setShowKycWarning] = useState(false);

  const copyAddress = async () => {
    if (userData?.profile?.stxAddress?.mainnet) {
      await navigator.clipboard.writeText(userData.profile.stxAddress.mainnet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnectWallet = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user || user.kycStatus !== 'approved') {
      setShowKycWarning(true);
      setTimeout(() => setShowKycWarning(false), 5000);
      return;
    }

    connectWallet();
  };

  // Show KYC warning if user tries to connect without proper verification
  if (showKycWarning) {
    return (
      <div className="relative">
        <Alert className="absolute top-0 right-0 w-80 z-50 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-sm">
            {!isAuthenticated 
              ? 'Please sign in to connect your wallet.'
              : user?.kycStatus === 'pending'
              ? 'Complete KYC verification to connect your wallet.'
              : user?.kycStatus === 'in_review'
              ? 'Your KYC is under review. Please wait for approval.'
              : user?.kycStatus === 'rejected'
              ? 'Your KYC was rejected. Please resubmit your documents.'
              : 'KYC verification required to connect wallet.'
            }
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => {
            setShowKycWarning(false);
            if (!isAuthenticated) {
              navigate('/login');
            } else if (user?.kycStatus !== 'approved') {
              navigate('/kyc-verification');
            }
          }}
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          {!isAuthenticated ? 'Sign In Required' : 'KYC Required'}
        </Button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Button 
        onClick={handleConnectWallet}
        className="bg-realvora-blue hover:bg-realvora-navy text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        {!isAuthenticated 
          ? 'Sign In to Connect' 
          : user?.kycStatus !== 'approved'
          ? 'KYC Required'
          : 'Connect Wallet'
        }
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-realvora-blue text-realvora-blue hover:bg-realvora-blue hover:text-white transition-all duration-200 flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">
            {userData?.profile?.stxAddress?.mainnet 
              ? truncateAddress(userData.profile.stxAddress.mainnet)
              : 'Wallet Connected'
            }
          </span>
          <Badge variant="secondary" className="bg-realvora-green text-white">
            Connected
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-medium">
            {userData?.username || 'Stacks User'}
          </span>
        </DropdownMenuItem>
        
        {userData?.profile?.stxAddress?.mainnet && (
          <DropdownMenuItem 
            onClick={copyAddress}
            className="flex items-center gap-2 cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="text-sm font-mono">
              {truncateAddress(userData.profile.stxAddress.mainnet)}
            </span>
            {copied && <span className="text-xs text-green-500">Copied!</span>}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={disconnectWallet}
          className="flex items-center gap-2 text-red-600 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletButton;