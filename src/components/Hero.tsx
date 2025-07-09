import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Shield,
  Users,
  Coins,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
} from "lucide-react";

const Hero = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Passive Income",
      description:
        "Receive rental income automatically distributed via blockchain",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Fractional ownership via NFTs on Stacks blockchain",
    },
    {
      icon: Users,
      title: "DAO Governance",
      description: "Participate in investment decisions with your community",
    },
    {
      icon: Coins,
      title: "Enhanced Liquidity",
      description: "Buy and sell your real estate shares 24/7",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Real Estate Investor",
      content:
        "Realvora has revolutionized my investment strategy. The passive income is consistent and the platform is incredibly user-friendly.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "DeFi Enthusiast",
      content:
        "Finally, a way to invest in real estate with the transparency and liquidity of blockchain technology. Amazing returns!",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Portfolio Manager",
      content:
        "The fractional ownership model allows me to diversify across multiple properties with minimal capital. Brilliant concept!",
      rating: 5,
    },
  ];

  const benefits = [
    "No minimum investment requirements",
    "Instant liquidity through NFT marketplace",
    "Automated rental income distribution",
    "Professional property management",
    "Transparent blockchain records",
    "Global property access",
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center bg-realvora-gold/10 text-realvora-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
              New Real Estate Investment Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-realvora-blue leading-tight mb-6">
              Invest in real estate
              <span className="text-realvora-gold block mt-2">via NFTs</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Realvora democratizes real estate investment through tokenization.
              Own shares of premium properties and receive rental income
              automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button className="bg-realvora-blue hover:bg-realvora-navy text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                Start Investing
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="border-realvora-blue text-realvora-blue hover:bg-realvora-blue hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-realvora-green" />
                Blockchain Secured
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-realvora-green" />
                Automatic Returns
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-realvora-green" />
                24/7 Liquidity
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-realvora-gold/20 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-realvora-blue mb-2">
                $2.5M+
              </div>
              <div className="text-gray-600">Total Value Locked</div>
            </Card>
            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-realvora-gold/20 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-realvora-green mb-2">
                8.2%
              </div>
              <div className="text-gray-600">Average Annual Yield</div>
            </Card>
            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-realvora-gold/20 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-realvora-gold mb-2">
                1,200+
              </div>
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
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-realvora-blue mb-4">
              Why Choose Realvora?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover all the advantages of our decentralized real estate
              investment platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-realvora-green flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-br from-realvora-blue to-realvora-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Investors Say
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of satisfied investors who trust Realvora
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-realvora-gold fill-current"
                    />
                  ))}
                </div>
                <p className="text-white mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-white/20 pt-4">
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-realvora-blue mb-4">
                Ready to diversify your portfolio?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join the decentralized real estate investment revolution and
                start generating passive income today
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button className="bg-gradient-gold text-realvora-navy px-8 py-4 text-lg rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Connect My Wallet
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-realvora-blue text-realvora-blue hover:bg-realvora-blue hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-realvora-green" />
                  Secure & Audited
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-realvora-blue" />
                  Active Community
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-realvora-gold" />
                  Attractive Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
