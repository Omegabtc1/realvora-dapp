
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, BarChart3, Users, User, Menu, X, Wallet, Vote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setIsWalletConnected(!isWalletConnected);
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Marketplace', path: '/marketplace' },
    { icon: Vote, label: 'Governance', path: '/governance' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-realvora rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-realvora-blue">Realvora</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2 text-gray-600 hover:text-realvora-blue transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Wallet Connect Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={handleConnectWallet}
              className={`${
                isWalletConnected 
                  ? 'bg-realvora-green hover:bg-realvora-green/90' 
                  : 'bg-realvora-blue hover:bg-realvora-navy'
              } text-white px-6 py-2 rounded-lg transition-all duration-200`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isWalletConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-in-right">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-gray-600 hover:text-realvora-blue transition-colors duration-200 px-2 py-2"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <Button
                onClick={handleConnectWallet}
                className={`${
                  isWalletConnected 
                    ? 'bg-realvora-green hover:bg-realvora-green/90' 
                    : 'bg-realvora-blue hover:bg-realvora-navy'
                } text-white w-full mt-4`}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isWalletConnected ? 'Connected' : 'Connect Wallet'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
