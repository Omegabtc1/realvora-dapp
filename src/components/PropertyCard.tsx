
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
//import KYCWarning from './KYCWarning';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: string;
  yield: string;
  totalShares: number;
  availableShares: number;
  category: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  image,
  price,
  yield: propertyYield,
  totalShares,
  availableShares,
  category
}) => {
  const { user } = useAuth();
  //const [showKYCWarning, setShowKYCWarning] = useState(false);
  const sharesSoldPercentage = ((totalShares - availableShares) / totalShares) * 100;

  //const isKYCApproved = user?.kycStatus === 'approved';
  const canInvest = availableShares > 0;

  const handleInvestClick = () => {
    console.log('Investing in Property:', id)
    // Logique d'investissement existante
  };

  return (
    <Card className="group overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-realvora-blue text-white">
            {category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-realvora-green text-white">
            <TrendingUp className="w-3 h-3 mr-1" />
            {propertyYield}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-realvora-blue mb-2 group-hover:text-realvora-gold transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Price and Shares */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-2xl font-bold text-realvora-blue">{price}</div>
            <div className="text-sm text-gray-500">per NFT</div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">{availableShares}/{totalShares} shares</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {sharesSoldPercentage.toFixed(1)}% sold
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-realvora rounded-full h-2 transition-all duration-500"
            style={{ width: `${sharesSoldPercentage}%` }}
          ></div>
        </div>

        {/* KYC Warning */}
        {/*showKYCWarning && (
          <div className="mb-4">
            <KYCWarning 
              message="Complete your KYC verification to invest in properties."
              onClose={() => setShowKYCWarning(false)}
              variant="banner"
            />
          </div>
        ) */}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-realvora-blue hover:bg-realvora-navy text-white transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!canInvest}
            onClick={handleInvestClick}
          >
            {availableShares === 0 ? 'Sold Out' : 'Invest'}
          </Button>
          <Button 
            variant="outline" 
            className="border-realvora-gold text-realvora-gold hover:bg-realvora-gold hover:text-white transition-all duration-200"
          >
            Details
          </Button>
          <Link to={`/property/${id}/analytics`}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
