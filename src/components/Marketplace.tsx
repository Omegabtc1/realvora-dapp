
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import PropertyCard from './PropertyCard';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('yield');
  const [filterCategory, setFilterCategory] = useState('all');

  const properties = [
    {
      id: '1',
      title: 'Luxury Villa Monaco',
      location: 'Monaco, Monaco',
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80',
      price: '€500',
      yield: '8.5%',
      totalShares: 1000,
      availableShares: 234,
      category: 'Villa'
    },
    {
      id: '2',
      title: 'Haussmann Apartment',
      location: 'Paris 16th, France',
      image: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80',
      price: '€250',
      yield: '11.2%',
      totalShares: 2000,
      availableShares: 1450,
      category: 'Apartment'
    },
    {
      id: '3',
      title: 'Design Loft Berlin',
      location: 'Berlin, Germany',
      image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80',
      price: '€180',
      yield: '12.8%',
      totalShares: 1500,
      availableShares: 890,
      category: 'Loft'
    },
    {
      id: '4',
      title: 'Manhattan Penthouse',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80',
      price: '€750',
      yield: '7.3%',
      totalShares: 800,
      availableShares: 127,
      category: 'Penthouse'
    },
    {
      id: '5',
      title: 'Modern House Cannes',
      location: 'Cannes, France',
      image: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80',
      price: '€420',
      yield: '9.1%',
      totalShares: 1200,
      availableShares: 567,
      category: 'House'
    },
    {
      id: '6',
      title: 'Design Studio Tokyo',
      location: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80',
      price: '€320',
      yield: '10.5%',
      totalShares: 1800,
      availableShares: 934,
      category: 'Studio'
    }
  ];

  const marketStats = {
    totalProperties: properties.length,
    totalValue: '€12.4M',
    averageYield: '9.7%',
    activeInvestors: '2,341'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-realvora-blue mb-2">Marketplace</h1>
          <p className="text-gray-600">Discover and invest in tokenized properties</p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="p-4 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-realvora-blue">{marketStats.totalProperties}</div>
            <div className="text-sm text-gray-600">Properties</div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-realvora-green">{marketStats.totalValue}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-realvora-gold">{marketStats.averageYield}</div>
            <div className="text-sm text-gray-600">Average Yield</div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-realvora-blue">{marketStats.activeInvestors}</div>
            <div className="text-sm text-gray-600">Investors</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search by city, type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Loft">Loft</SelectItem>
                <SelectItem value="Penthouse">Penthouse</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yield">Yield</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Featured Properties Banner */}
        <Card className="p-6 mb-8 bg-gradient-realvora text-white animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🔥 Featured Properties</h2>
              <p className="text-blue-100">Limited opportunities with exceptional yields</p>
            </div>
            <Button className="bg-realvora-gold text-realvora-navy hover:bg-realvora-gold/90 mt-4 md:mt-0">
              View Selection
            </Button>
          </div>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {properties.map((property, index) => (
            <div 
              key={property.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PropertyCard {...property} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="border-realvora-blue text-realvora-blue hover:bg-realvora-blue hover:text-white px-8 py-3"
          >
            Load More Properties
          </Button>
        </div>

        {/* Market Info */}
        <Card className="p-8 mt-12 bg-white/80 backdrop-blur-sm text-center">
          <h2 className="text-2xl font-bold text-realvora-blue mb-4">
            Why Invest with Realvora?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="w-16 h-16 bg-realvora-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-realvora-blue" />
              </div>
              <h3 className="font-semibold text-realvora-blue mb-2">Premium Selection</h3>
              <p className="text-gray-600 text-sm">
                Properties selected in the best geographical areas
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-realvora-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Badge className="w-8 h-8 bg-realvora-green text-white">%</Badge>
              </div>
              <h3 className="font-semibold text-realvora-blue mb-2">Attractive Returns</h3>
              <p className="text-gray-600 text-sm">
                Rental income distributed automatically every month
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-realvora-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-realvora-gold" />
              </div>
              <h3 className="font-semibold text-realvora-blue mb-2">Maximum Liquidity</h3>
              <p className="text-gray-600 text-sm">
                Buy and sell your shares 24/7 on our marketplace
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Marketplace;
