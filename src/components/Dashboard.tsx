
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Wallet, Building, Vote, ArrowUpRight, Calendar } from 'lucide-react';
import PropertyCard from './PropertyCard';
import WalletInfo from './WalletInfo';
import { useContracts } from '../hooks/useContracts';
import { PropertyData } from '../services/contractService';
import { useWallet } from '../contexts/WalletContext';
import { toast } from '../hooks/use-toast';

const Dashboard = () => {
  const { userSession } = useWallet();
  const { getProperty, getUserShares, loading, error } = useContracts();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [userStats, setUserStats] = useState({
    totalInvested: '€0',
    monthlyReturn: '€0',
    portfolioYield: '0%',
    nftCount: 0
  });

  // Load properties and user data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userSession?.isUserSignedIn()) return;

      try {
        // Load properties (assuming property IDs 1-10 for demo)
        const propertyPromises = [];
        for (let i = 1; i <= 10; i++) {
          propertyPromises.push(getProperty(i));
        }
        
        const propertyResults = await Promise.all(propertyPromises);
        const validProperties = propertyResults.filter(p => p !== null) as PropertyData[];
        setProperties(validProperties);

        // Calculate user stats
        if (validProperties.length > 0) {
          const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
          let totalInvested = 0;
          let totalShares = 0;

          for (const property of validProperties) {
            const shares = await getUserShares(userAddress, property.id);
            if (shares > 0) {
              totalShares += shares;
              totalInvested += shares * property.pricePerShare;
            }
          }

          setUserStats({
            totalInvested: `€${(totalInvested / 1000000).toFixed(2)}`, // Convert from micro-STX
            monthlyReturn: `€${(totalInvested * 0.08 / 12 / 1000000).toFixed(2)}`, // Estimated 8% annual yield
            portfolioYield: '8.5%',
            nftCount: totalShares
          });
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        toast({
          title: 'Error',
          description: 'Unable to load dashboard data',
          variant: 'destructive'
        });
      }
    };

    loadDashboardData();
  }, [userSession, getProperty, getUserShares]);

  const recentTransactions = [
    { type: 'Rent received', amount: '+€42.15', property: 'Monaco Villa', date: '2024-06-10' },
    { type: 'NFT Purchase', amount: '-€500.00', property: 'Paris Apartment', date: '2024-06-08' },
    { type: 'DAO Vote', amount: '', property: 'Proposal #15', date: '2024-06-05' }
  ];

  // Convert contract properties to UI format
  const userProperties = properties.map(property => ({
    id: property.id.toString(),
    title: property.name,
    location: property.location,
    image: property.metadataUri || 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80',
    price: `€${(property.pricePerShare / 1000000).toFixed(2)}`, // Convert from micro-STX
    yield: `${(property.rentalYield / 100).toFixed(1)}%`,
    totalShares: property.totalShares,
    availableShares: property.availableShares,
    category: 'Property'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-realvora-blue mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your tokenized real estate portfolio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-realvora rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-realvora-green text-white">+12.5%</Badge>
            </div>
            <div className="text-2xl font-bold text-realvora-blue mb-1">
              {userStats.totalInvested}
            </div>
            <div className="text-sm text-gray-600">Total Invested</div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-realvora-navy" />
              </div>
              <Badge className="bg-realvora-gold text-realvora-navy">
                {userStats.portfolioYield}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-realvora-green mb-1">
              {userStats.monthlyReturn}
            </div>
            <div className="text-sm text-gray-600">Monthly Returns</div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-realvora-green rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-realvora-green" />
            </div>
            <div className="text-2xl font-bold text-realvora-blue mb-1">
              {userStats.nftCount}
            </div>
            <div className="text-sm text-gray-600">NFTs Owned</div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-realvora-navy rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-realvora-blue text-white">3 Active</Badge>
            </div>
            <div className="text-2xl font-bold text-realvora-blue mb-1">
              15
            </div>
            <div className="text-sm text-gray-600">DAO Votes</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Properties */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-realvora-blue">My Properties</h2>
                <Button 
                  variant="outline"
                  className="border-realvora-blue text-realvora-blue hover:bg-realvora-blue hover:text-white"
                >
                  Explore More
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-realvora-blue mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-realvora-blue/10 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-realvora-blue" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.type}</div>
                        <div className="text-sm text-gray-500">{transaction.property}</div>
                        <div className="text-xs text-gray-400">{transaction.date}</div>
                      </div>
                    </div>
                    {transaction.amount && (
                      <div className={`font-semibold ${
                        transaction.amount.startsWith('+') ? 'text-realvora-green' : 'text-red-500'
                      }`}>
                        {transaction.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Wallet Information */}
            <WalletInfo />

            {/* Quick Actions */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-realvora-blue mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Button className="w-full bg-realvora-blue hover:bg-realvora-navy text-white justify-start">
                  <Building className="w-4 h-4 mr-2" />
                  Buy NFTs
                </Button>
                <Button className="w-full bg-realvora-green hover:bg-realvora-green/90 text-white justify-start">
                  <Vote className="w-4 h-4 mr-2" />
                  View DAO Votes
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-realvora-gold text-realvora-gold hover:bg-realvora-gold hover:text-white justify-start"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyze Performance
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
