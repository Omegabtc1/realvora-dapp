import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, MapPin, ShoppingCart, Clock, Users, Plus, Minus, Building } from "lucide-react";
import { useContracts } from '../hooks/useContracts';
import { PropertyData } from '../services/contractService';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
//import KYCWarning from './KYCWarning';

const Marketplace = () => {
  const { userSession } = useWallet();
  const { 
    getProperty, 
    purchaseShares, 
    createBuyOrder, 
    createSellOrder, 
    loading, 
    error 
  } = useContracts();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("yield");
  const [filterCategory, setFilterCategory] = useState("all");
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: number]: number }>({});
  //const [showKYCWarning, setShowKYCWarning] = useState(false);

  //const isKYCApproved = user?.kycStatus === 'approved';

  // Load properties from contracts
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const propertyPromises = [];
        for (let i = 1; i <= 10; i++) {
          propertyPromises.push(getProperty(i));
        }
        
        const propertyResults = await Promise.all(propertyPromises);
        const validProperties = propertyResults.filter(p => p !== null) as PropertyData[];
        setProperties(validProperties);
      } catch (err) {
        console.error('Error loading properties:', err);
        toast({
          title: 'Error',
          description: 'Unable to load properties',
          variant: 'destructive'
        });
      }
    };

    loadProperties();
  }, [getProperty]);

  // Handle purchase shares
  const handlePurchaseShares = async (propertyId: number, shares: number) => {
    if (!userSession?.isUserSignedIn()) {
      toast({
        title: 'Connection required',
        description: 'Please connect your wallet to purchase shares',
        variant: 'destructive'
      });
      return;
    }

    /*if (!isKYCApproved) {
      setShowKYCWarning(true);
      return;
    }*/

    try {
      await purchaseShares(propertyId, shares, {
        onSuccess: (txId) => {
          toast({
            title: 'Purchase successful!',
            description: `Transaction sent: ${txId}`,
          });
          // Reset purchase amount
          setPurchaseAmounts(prev => ({ ...prev, [propertyId]: 0 }));
        },
        onError: (error) => {
          toast({
            title: 'Purchase error',
            description: error,
            variant: 'destructive'
          });
        }
      });
    } catch (err) {
      console.error('Purchase error:', err);
    }
  };

  // Handle create buy order
  const handleCreateBuyOrder = async (propertyId: number, shares: number, pricePerShare: number) => {
    if (!userSession?.isUserSignedIn()) {
      toast({
        title: 'Connection required',
        description: 'Please connect your wallet to create an order',
        variant: 'destructive'
      });
      return;
    }

    /*if (!isKYCApproved) {
      setShowKYCWarning(true);
      return;
    }*/

    try {
      await createBuyOrder(propertyId, shares, pricePerShare, 1440, { // 1440 blocks ≈ 10 days
        onSuccess: (txId) => {
          toast({
            title: 'Order created!',
            description: `Buy order created: ${txId}`,
          });
        },
        onError: (error) => {
          toast({
            title: 'Order creation error',
            description: error,
            variant: 'destructive'
          });
        }
      });
    } catch (err) {
      console.error('Create buy order error:', err);
    }
  };

  // Filter and sort properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "yield":
        return b.rentalYield - a.rentalYield;
      case "price":
        return a.pricePerShare - b.pricePerShare;
      case "shares":
        return b.availableShares - a.availableShares;
      default:
        return 0;
    }
  });

  const updatePurchaseAmount = (propertyId: number, change: number) => {
    setPurchaseAmounts(prev => {
      const current = prev[propertyId] || 0;
      const newAmount = Math.max(0, current + change);
      return { ...prev, [propertyId]: newAmount };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real Estate Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Invest in fractional real estate with Stacks blockchain
          </p>
        </div>

        {/* KYC Warning */}
        {/*showKYCWarning && (
          <div className="mb-8">
            <KYCWarning 
              message="Complete your KYC verification to perform transactions on the marketplace."
              onClose={() => setShowKYCWarning(false)}
              variant="banner"
            />
          </div>
        )*/}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yield">Yield</SelectItem>
                <SelectItem value="price">Price per share</SelectItem>
                <SelectItem value="shares">Available shares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => {
            const purchaseAmount = purchaseAmounts[property.id] || 0;
            const totalCost = purchaseAmount * property.pricePerShare;

            return (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  {property.metadataUri && (
                    <img 
                      src={property.metadataUri} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      {(property.rentalYield / 100).toFixed(1)}% APY
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per share:</span>
                      <span className="font-semibold">
                        {(property.pricePerShare / 1000000).toFixed(6)} STX
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available shares:</span>
                      <span className="font-semibold">{property.availableShares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total shares:</span>
                      <span className="font-semibold">{property.totalShares}</span>
                    </div>
                  </div>

                  {/* Purchase Interface */}
                  {property.availableShares > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePurchaseAmount(property.id, -1)}
                            disabled={purchaseAmount <= 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {purchaseAmount}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePurchaseAmount(property.id, 1)}
                            disabled={purchaseAmount >= property.availableShares}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {purchaseAmount > 0 && (
                        <div className="text-sm text-gray-600">
                          Total cost: {(totalCost / 1000000).toFixed(6)} STX
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          onClick={() => handlePurchaseShares(property.id, purchaseAmount)}
                          disabled={purchaseAmount <= 0 || loading}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy
                        </Button>
                        <Button
                          variant="outline"
                          className="disabled:bg-gray-100 disabled:cursor-not-allowed"
                          onClick={() => handleCreateBuyOrder(property.id, purchaseAmount, property.pricePerShare)}
                          disabled={purchaseAmount <= 0 || loading}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  )}

                  {property.availableShares === 0 && (
                    <Badge variant="secondary" className="w-full justify-center">
                      Sold Out
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div> 

        {/* Empty State */}
        {!loading && sortedProperties.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try modifying your search criteria.' : 'Properties will be available soon.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
