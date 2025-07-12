import React, { useState } from "react";
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
import { Search, Filter, SlidersHorizontal, MapPin, ShoppingCart, Clock, Users } from "lucide-react";
import PropertyCard from "./PropertyCard";
import WhitelistPropertyCard from "./WhitelistPropertyCard";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("yield");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("sale"); // 'sale' or 'whitelist'

  // Define property types
  interface BaseProperty {
    id: string;
    title: string;
    location: string;
    image: string;
    price: string;
    yield: string;
    totalShares: number;
    category: string;
  }

  interface SaleProperty extends BaseProperty {
    status: 'sale';
    availableShares: number;
  }

  interface WhitelistProperty extends BaseProperty {
    status: 'whitelist';
    whitelistSpots: number;
    whitelistFilled: number;
    launchDate: string;
  }

  type Property = SaleProperty | WhitelistProperty;

  const properties: Property[] = [
    // Properties on Sale
    {
      id: "1",
      title: "Luxury Villa Monaco",
      location: "Monaco, Monaco",
      image:
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
      price: "€500",
      yield: "8.5%",
      totalShares: 1000,
      availableShares: 234,
      category: "Villa",
      status: "sale",
    },
    {
      id: "2",
      title: "Haussmann Apartment",
      location: "Paris 16th, France",
      image:
        "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80",
      price: "€250",
      yield: "11.2%",
      totalShares: 2000,
      availableShares: 1450,
      category: "Apartment",
      status: "sale",
    },
    {
      id: "3",
      title: "Design Loft Berlin",
      location: "Berlin, Germany",
      image:
        "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80",
      price: "€180",
      yield: "12.8%",
      totalShares: 1500,
      availableShares: 890,
      category: "Loft",
      status: "sale",
    },
    {
      id: "4",
      title: "Manhattan Penthouse",
      location: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
      price: "€750",
      yield: "7.3%",
      totalShares: 800,
      availableShares: 127,
      category: "Penthouse",
      status: "sale",
    },
    // Properties for Whitelisting
    {
      id: "5",
      title: "Luxury Resort Maldives",
      location: "Maldives",
      image:
        "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80",
      price: "€1,200",
      yield: "15.2%",
      totalShares: 500,
      category: "Resort",
      status: "whitelist",
      whitelistSpots: 150,
      whitelistFilled: 89,
      launchDate: "March 15, 2024",
    },
    {
      id: "6",
      title: "Historic Castle Scotland",
      location: "Edinburgh, Scotland",
      image:
        "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80",
      price: "€850",
      yield: "13.8%",
      totalShares: 800,
      category: "Castle",
      status: "whitelist",
      whitelistSpots: 200,
      whitelistFilled: 156,
      launchDate: "April 2, 2024",
    },
    {
      id: "7",
      title: "Ski Chalet Alps",
      location: "Chamonix, France",
      image:
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80",
      price: "€650",
      yield: "11.5%",
      totalShares: 600,
      category: "Chalet",
      status: "whitelist",
      whitelistSpots: 100,
      whitelistFilled: 34,
      launchDate: "May 10, 2024",
    },
    {
      id: "8",
      title: "Beachfront Villa Santorini",
      location: "Santorini, Greece",
      image:
        "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=800&q=80",
      price: "€980",
      yield: "14.1%",
      totalShares: 750,
      category: "Villa",
      status: "whitelist",
      whitelistSpots: 120,
      whitelistFilled: 78,
      launchDate: "March 28, 2024",
    },
  ];

  // Filter properties based on active tab, category, and search term
  const getFilteredProperties = () => {
    return properties.filter(property => {
      const matchesTab = property.status === activeTab;
      const matchesCategory = filterCategory === 'all' || property.category === filterCategory;
      const matchesSearch = searchTerm === '' || 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTab && matchesCategory && matchesSearch;
    });
  };

  const filteredProperties = getFilteredProperties();
  const saleProperties = properties.filter(p => p.status === 'sale');
  const whitelistProperties = properties.filter(p => p.status === 'whitelist');

  const marketStats = {
    totalProperties: properties.length,
    saleProperties: saleProperties.length,
    whitelistProperties: whitelistProperties.length,
    totalValue: "€12.4M",
    averageYield: activeTab === 'sale' ? "9.7%" : "13.7%",
    activeInvestors: "2,341",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-realvora-blue mb-2">
            Marketplace
          </h1>
          <p className="text-gray-600">
            Discover and invest in tokenized properties
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
            <Button
              variant={activeTab === 'sale' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('sale')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'sale'
                  ? 'bg-realvora-blue text-white shadow-md'
                  : 'text-gray-600 hover:text-realvora-blue'
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              On Sale ({marketStats.saleProperties})
            </Button>
            <Button
              variant={activeTab === 'whitelist' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('whitelist')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'whitelist'
                  ? 'bg-realvora-blue text-white shadow-md'
                  : 'text-gray-600 hover:text-realvora-blue'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Whitelist ({marketStats.whitelistProperties})
            </Button>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="p-4 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-realvora-blue">
              {filteredProperties.length}
            </div>
            <div className="text-sm text-gray-600">
              {activeTab === 'sale' ? 'Available' : 'Upcoming'} Properties
            </div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-realvora-green">
              {marketStats.totalValue}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-realvora-gold">
              {marketStats.averageYield}
            </div>
            <div className="text-sm text-gray-600">Average Yield</div>
          </Card>
          <Card className="p-4 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold text-realvora-blue">
              {activeTab === 'sale' ? marketStats.activeInvestors : '1,247'}
            </div>
            <div className="text-sm text-gray-600">
              {activeTab === 'sale' ? 'Active Investors' : 'Whitelisted Users'}
            </div>
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
                <SelectItem value="Resort">Resort</SelectItem>
                <SelectItem value="Castle">Castle</SelectItem>
                <SelectItem value="Chalet">Chalet</SelectItem>
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
        <Card className="p-6 mb-8 bg-gradient-to-r from-realvora-blue to-realvora-navy text-white animate-fade-in shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                {activeTab === 'sale' ? 'Featured Properties' : 'Upcoming Launches'}
              </h2>
              <p className="text-white/90 font-medium">
                {activeTab === 'sale' 
                  ? 'Limited opportunities with exceptional yields'
                  : 'Exclusive early access to premium properties'}
              </p>
            </div>
            <Button className="bg-realvora-gold text-realvora-navy hover:bg-realvora-gold/90 mt-4 md:mt-0 font-semibold shadow-md">
              {activeTab === 'sale' ? 'View Selection' : 'Join Whitelist'}
            </Button>
          </div>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                {activeTab === 'sale' ? (
                  <>
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No properties on sale</h3>
                    <p>Check back later for new investment opportunities</p>
                  </>
                ) : (
                  <>
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No upcoming launches</h3>
                    <p>Be the first to know about new whitelist opportunities</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {property.status === 'sale' ? (
                  <PropertyCard {...(property as SaleProperty)} />
                ) : (
                  <WhitelistPropertyCard {...(property as WhitelistProperty)} />
                )}
              </div>
            ))
          )}
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
              <h3 className="font-semibold text-realvora-blue mb-2">
                Premium Selection
              </h3>
              <p className="text-gray-600 text-sm">
                Properties selected in the best geographical areas
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-realvora-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Badge className="w-8 h-8 bg-realvora-green text-white">
                  %
                </Badge>
              </div>
              <h3 className="font-semibold text-realvora-blue mb-2">
                Attractive Returns
              </h3>
              <p className="text-gray-600 text-sm">
                Rental income distributed automatically every month
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-realvora-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-realvora-gold" />
              </div>
              <h3 className="font-semibold text-realvora-blue mb-2">
                Maximum Liquidity
              </h3>
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
