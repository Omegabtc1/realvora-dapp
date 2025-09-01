import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Users,
  Calendar,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Vote,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWallet } from '@/contexts/WalletContext';
import { useContracts } from '@/hooks/useContracts';

interface PropertyAnalytics {
  id: number;
  name: string;
  location: string;
  currentValuation: number;
  totalTokens: number;
  tokenPrice: number;
  availableSupply: number;
  estimatedYield: number;
  projectedROI: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  occupancyRate: number;
  avgRentPerUnit: number;
  expenseRatio: number;
  noi: number;
  irr: number;
  vacancyRate: number;
}

const PropertyAnalyticsPage = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { userSession, userData, isConnected } = useWallet();
  const { getProperty, getUserShares } = useContracts();
  
  const [property, setProperty] = useState<PropertyAnalytics | null>(null);
  const [userShares, setUserShares] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockAnalytics: PropertyAnalytics = {
    id: parseInt(propertyId || '1'),
    name: 'Luxury Downtown Apartments',
    location: 'Dubai Marina, UAE',
    currentValuation: 2500000,
    totalTokens: 100000,
    tokenPrice: 25,
    availableSupply: 15,
    estimatedYield: 8.2,
    projectedROI: {
      oneYear: 8.5,
      threeYear: 28.7,
      fiveYear: 52.3
    },
    occupancyRate: 95,
    avgRentPerUnit: 3500,
    expenseRatio: 25,
    noi: 187500,
    irr: 12.4,
    vacancyRate: 5
  };

  // Mock chart data
  const yieldData = [
    { month: 'Jan', yield: 7.8, projected: 8.0 },
    { month: 'Feb', yield: 8.1, projected: 8.1 },
    { month: 'Mar', yield: 8.0, projected: 8.2 },
    { month: 'Apr', yield: 8.3, projected: 8.3 },
    { month: 'May', yield: 8.2, projected: 8.4 },
    { month: 'Jun', yield: 8.4, projected: 8.5 }
  ];

  const revenueData = [
    { month: 'Jan', income: 15000, investorShare: 11250, fees: 2250, treasury: 1500 },
    { month: 'Feb', income: 15500, investorShare: 11625, fees: 2325, treasury: 1550 },
    { month: 'Mar', income: 15200, investorShare: 11400, fees: 2280, treasury: 1520 },
    { month: 'Apr', income: 15800, investorShare: 11850, fees: 2370, treasury: 1580 },
    { month: 'May', income: 15600, investorShare: 11700, fees: 2340, treasury: 1560 },
    { month: 'Jun', income: 16000, investorShare: 12000, fees: 2400, treasury: 1600 }
  ];

  const distributionData = [
    { name: 'Investors', value: 75, color: '#3b82f6' },
    { name: 'Management Fees', value: 15, color: '#ef4444' },
    { name: 'DAO Treasury', value: 10, color: '#10b981' }
  ];

  const occupancyData = [
    { month: 'Jan', occupancy: 92, vacancy: 8 },
    { month: 'Feb', occupancy: 94, vacancy: 6 },
    { month: 'Mar', occupancy: 96, vacancy: 4 },
    { month: 'Apr', occupancy: 95, vacancy: 5 },
    { month: 'May', occupancy: 97, vacancy: 3 },
    { month: 'Jun', occupancy: 95, vacancy: 5 }
  ];

  const marketComparison = [
    { metric: 'Yield', property: 8.2, market: 5.7, unit: '%' },
    { metric: 'Occupancy', property: 95, market: 88, unit: '%' },
    { metric: 'Rent Growth', property: 12, market: 8, unit: '%' },
    { metric: 'IRR', property: 12.4, market: 9.2, unit: '%' }
  ];

  const proposals = [
    {
      id: 1,
      title: 'Rooftop Garden Installation',
      type: 'Property Improvement',
      status: 'Active',
      votesFor: 75,
      votesAgainst: 25,
      endDate: '2024-02-15'
    },
    {
      id: 2,
      title: 'Rent Adjustment for 2024',
      type: 'Rent Adjustment',
      status: 'Passed',
      votesFor: 82,
      votesAgainst: 18,
      endDate: '2024-01-30'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, load actual property data
        setProperty(mockAnalytics);
        
        if (isConnected && userData) {
          // Load user shares
          const shares = await getUserShares(userData.profile.stxAddress.mainnet, parseInt(propertyId || '1'));
          setUserShares(shares);
        }
      } catch (error) {
        console.error('Error loading property analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propertyId, isConnected, userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading property analytics...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600">The requested property analytics could not be loaded.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Property Overview Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4" />
            {property.location}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{property.name}</h1>
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Valuation</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(property.currentValuation / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.totalTokens.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">@ ${property.tokenPrice} each</p>
                  </div>
                  <Home className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Supply</p>
                    <p className="text-2xl font-bold text-gray-900">{property.availableSupply}%</p>
                    <p className="text-xs text-gray-500">Remaining tokens</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Est. Annual Yield</p>
                    <p className="text-2xl font-bold text-green-600">{property.estimatedYield}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">+0.3% vs last month</span>
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI Projections */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Projected ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">1 Year</p>
                  <p className="text-2xl font-bold text-blue-600">{property.projectedROI.oneYear}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">3 Years</p>
                  <p className="text-2xl font-bold text-blue-600">{property.projectedROI.threeYear}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">5 Years</p>
                  <p className="text-2xl font-bold text-blue-600">{property.projectedROI.fiveYear}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="yield" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="yield">Yield & Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance KPIs</TabsTrigger>
            <TabsTrigger value="comparative">Market Analysis</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="investor">My Holdings</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* Yield & Revenue Metrics */}
          <TabsContent value="yield" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rental Yield Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Rental Yield Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="yield" stroke="#3b82f6" name="Actual Yield (%)" />
                      <Line type="monotone" dataKey="projected" stroke="#10b981" strokeDasharray="5 5" name="Projected (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Income Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="investorShare" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Investor Share" />
                    <Area type="monotone" dataKey="fees" stackId="1" stroke="#ef4444" fill="#ef4444" name="Management Fees" />
                    <Area type="monotone" dataKey="treasury" stackId="1" stroke="#10b981" fill="#10b981" name="DAO Treasury" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Occupancy/Vacancy Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Occupancy & Vacancy Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="occupancy" fill="#10b981" name="Occupancy (%)" />
                    <Bar dataKey="vacancy" fill="#ef4444" name="Vacancy (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance KPIs */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                      <p className="text-3xl font-bold text-green-600">{property.occupancyRate}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">+2% vs last quarter</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rent/Unit</p>
                      <p className="text-3xl font-bold text-blue-600">${property.avgRentPerUnit}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">+5% YoY</span>
                      </div>
                    </div>
                    <Home className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Expense Ratio</p>
                      <p className="text-3xl font-bold text-orange-600">{property.expenseRatio}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">-1% vs target</span>
                      </div>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Net Operating Income</p>
                      <p className="text-3xl font-bold text-green-600">${property.noi.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Monthly NOI</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Internal Rate of Return</p>
                      <p className="text-3xl font-bold text-purple-600">{property.irr}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Above target</span>
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Vacancy Rate</p>
                      <p className="text-3xl font-bold text-red-600">{property.vacancyRate}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">Below market avg</span>
                      </div>
                    </div>
                    <Home className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparative Analytics */}
          <TabsContent value="comparative" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property vs Market Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketComparison.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.metric}</p>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">This Property</p>
                          <p className="text-lg font-bold text-blue-600">{item.property}{item.unit}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Market Average</p>
                          <p className="text-lg font-bold text-gray-600">{item.market}{item.unit}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Difference</p>
                          <div className="flex items-center gap-1">
                            {item.property > item.market ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                            <p className={`text-lg font-bold ${
                              item.property > item.market ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {Math.abs(item.property - item.market).toFixed(1)}{item.unit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Governance */}
          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active & Recent Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{proposal.title}</h3>
                          <p className="text-sm text-gray-600">{proposal.type}</p>
                        </div>
                        <Badge variant={proposal.status === 'Active' ? 'default' : 'secondary'}>
                          {proposal.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>For: {proposal.votesFor}%</span>
                            <span>Against: {proposal.votesAgainst}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${proposal.votesFor}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Ends: {proposal.endDate}</span>
                        {proposal.status === 'Active' && (
                          <Button size="sm" variant="outline">
                            <Vote className="h-4 w-4 mr-1" />
                            Vote
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investor Dashboard */}
          <TabsContent value="investor" className="space-y-6">
            {isConnected ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">My Token Holdings</p>
                        <p className="text-3xl font-bold text-blue-600">{userShares.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">tokens owned</p>
                      </div>
                      <Wallet className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Invested</p>
                        <p className="text-3xl font-bold text-green-600">${(userShares * property.tokenPrice).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">initial investment</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cumulative Earnings</p>
                        <p className="text-3xl font-bold text-purple-600">$2,847</p>
                        <p className="text-xs text-gray-500">total received</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Next Payout</p>
                        <p className="text-2xl font-bold text-orange-600">Feb 15</p>
                        <p className="text-xs text-gray-500">estimated: $156</p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">My ROI</p>
                        <p className="text-3xl font-bold text-green-600">+11.4%</p>
                        <p className="text-xs text-gray-500">since investment</p>
                      </div>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ownership %</p>
                        <p className="text-3xl font-bold text-blue-600">{((userShares / property.totalTokens) * 100).toFixed(2)}%</p>
                        <p className="text-xs text-gray-500">of total property</p>
                      </div>
                      <PieChartIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-600 mb-4">Connect your wallet to view your investment details and earnings.</p>
                  <Button>Connect Wallet</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Yield</span>
                      <span className="font-semibold">{property.estimatedYield}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupancy Rate</span>
                      <span className="font-semibold">{property.occupancyRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IRR</span>
                      <span className="font-semibold">{property.irr}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Tokens</span>
                      <span className="font-semibold">{property.availableSupply}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Above market yield performance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">High occupancy rate (95%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Strong rental growth (+12% YoY)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Prime Dubai Marina location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Professional property management</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyAnalyticsPage;