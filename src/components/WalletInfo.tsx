import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useStacks } from '@/hooks/useStacks';
import { useToast } from '@/hooks/use-toast';

interface WalletBalance {
  stx: number;
  locked: number;
  total_sent: number;
  total_received: number;
}

const WalletInfo: React.FC = () => {
  const { isConnected, address, getBalance } = useStacks();
  const { toast } = useToast();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      const balanceData = await getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le solde du wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [isConnected]);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Adresse copiée",
        description: "L'adresse du wallet a été copiée dans le presse-papiers",
      });
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://explorer.stacks.co/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Stacks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connectez votre wallet pour voir vos informations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Stacks
          </div>
          <Badge variant="secondary" className="bg-realvora-green text-white">
            Connecté
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adresse */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Adresse</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-sm bg-muted p-2 rounded font-mono">
              {address ? `${address.slice(0, 8)}...${address.slice(-8)}` : 'N/A'}
            </code>
            <Button size="sm" variant="outline" onClick={copyAddress}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openExplorer}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Solde */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-muted-foreground">Solde STX</label>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={fetchBalance}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {balance ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Disponible:</span>
                <span className="font-medium">{balance.stx.toFixed(6)} STX</span>
              </div>
              {balance.locked > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Verrouillé:</span>
                  <span className="font-medium">{balance.locked.toFixed(6)} STX</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Total reçu:</span>
                <span>{balance.total_received.toFixed(6)} STX</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Total envoyé:</span>
                <span>{balance.total_sent.toFixed(6)} STX</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Chargement...</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Impossible de charger le solde</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletInfo;