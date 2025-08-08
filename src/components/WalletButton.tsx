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
import { Wallet, LogOut, User, Copy, Check } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';

const WalletButton: React.FC = () => {
  const { isConnected, userData, connectWallet, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);

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

  if (!isConnected) {
    return (
      <Button 
        onClick={connectWallet}
        className="bg-realvora-blue hover:bg-realvora-navy text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connecter Wallet
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
              : 'Wallet Connecté'
            }
          </span>
          <Badge variant="secondary" className="bg-realvora-green text-white">
            Connecté
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-medium">
            {userData?.username || 'Utilisateur Stacks'}
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
            {copied && <span className="text-xs text-green-500">Copié!</span>}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={disconnectWallet}
          className="flex items-center gap-2 text-red-600 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletButton;