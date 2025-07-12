import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, TrendingUp } from "lucide-react";

interface WhitelistPropertyCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: string;
  yield: string;
  totalShares: number;
  category: string;
  whitelistSpots: number;
  whitelistFilled: number;
  launchDate: string;
}

const WhitelistPropertyCard: React.FC<WhitelistPropertyCardProps> = ({
  title,
  location,
  image,
  price,
  yield: propertyYield,
  category,
  whitelistSpots,
  whitelistFilled,
  launchDate,
}) => {
  const whitelistProgress = (whitelistFilled / whitelistSpots) * 100;
  const spotsRemaining = whitelistSpots - whitelistFilled;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-realvora-gold text-realvora-navy font-medium">
            {category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-orange-500 text-white font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Whitelist
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <div className="flex items-center text-sm opacity-90">
            <MapPin className="w-3 h-3 mr-1" />
            {location}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Price and Yield */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-2xl font-bold text-realvora-blue">{price}</div>
            <div className="text-sm text-gray-600">per share</div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-realvora-green font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />
              {propertyYield}
            </div>
            <div className="text-sm text-gray-600">Expected Yield</div>
          </div>
        </div>

        {/* Whitelist Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Whitelist Progress</span>
            <span className="text-sm text-gray-600">
              {whitelistFilled}/{whitelistSpots} spots
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${whitelistProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.round(whitelistProgress)}% filled</span>
            <span className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {spotsRemaining} spots left
            </span>
          </div>
        </div>

        {/* Launch Date */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Launch Date</span>
            <span className="text-sm font-semibold text-realvora-blue">{launchDate}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={spotsRemaining === 0}
        >
          {spotsRemaining === 0 ? 'Whitelist Full' : 'Join Whitelist'}
        </Button>

        {spotsRemaining <= 10 && spotsRemaining > 0 && (
          <div className="mt-2 text-center">
            <span className="text-xs text-orange-600 font-medium">
              ⚡ Only {spotsRemaining} spots remaining!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhitelistPropertyCard;