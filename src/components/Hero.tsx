
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Shield, Users, Coins } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Passive Income',
      description: 'Receive rental income automatically distributed via blockchain'
    },
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'Fractional ownership via NFTs on Stacks blockchain'
    },
    {
      icon: Users,
      title: 'DAO Governance',
      description: 'Participate in investment decisions with your community'
    },
    {
      icon: Coins,
      title: 'Enhanced Liquidity',
      description: 'Buy and sell your real estate shares 24/7'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-realvora-blue leading-tight mb-6">
            Invest in real estate
            <span className="text-realvora-gold block mt-2">via NFTs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Realvora democratizes real estate investment through tokenization. 
            Own shares of premium properties and receive rental income automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-realvora-blue hover:bg-realvora-navy text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105">
              Start Investing
            </Button>
            <Button 
              variant="outline" 
              className="border-realvora-blue text-realvora-blue hover:bg-realvora-blue hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
            >
              Explore Marketplace
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-realvora-gold/20 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-realvora-blue mb-2">$2.5M+</div>
            <div className="text-gray-600">Total Value Locked</div>
          </Card>
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-realvora-gold/20 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-realvora-green mb-2">8.2%</div>
            <div className="text-gray-600">Average Annual Yield</div>
          </Card>
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-realvora-gold/20 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-realvora-gold mb-2">1,200+</div>
            <div className="text-gray-600">Active Investors</div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-gradient-realvora rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-realvora-blue mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
            <h2 className="text-2xl font-bold text-realvora-blue mb-4">
              Ready to diversify your portfolio?
            </h2>
            <p className="text-gray-600 mb-6">
              Join the decentralized real estate investment revolution
            </p>
            <Button className="bg-gradient-gold text-realvora-navy px-8 py-3 text-lg rounded-xl hover:scale-105 transition-all duration-300">
              Connect My Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
