import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Header from './Header';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireKYC?: boolean;
  requireWallet?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requireKYC = false, 
  requireWallet = false 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { connectWallet } = useWallet();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-realvora-blue/5 to-realvora-gold/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-realvora-blue" />
              <p className="text-gray-600">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Check authentication requirements
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check KYC requirements
  if (requireKYC && user) {
    if (user.kycStatus === 'pending') {
      return (
        <>
          <Header />
          <div className="min-h-screen bg-gradient-to-br from-realvora-blue/5 to-realvora-gold/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification Required</h2>
                <p className="text-gray-600 mb-6">
                  You need to complete your identity verification to access this feature.
                </p>
                <Button 
                  onClick={() => window.location.href = '/kyc-verification'}
                  className="w-full bg-realvora-blue hover:bg-realvora-navy"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Complete KYC Verification
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      );
    }

    if (user.kycStatus === 'in_review') {
      return (
        <>
          <Header />
          <div className="min-h-screen bg-gradient-to-br from-realvora-blue/5 to-realvora-gold/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Under Review</h2>
                <p className="text-gray-600 mb-6">
                  Your identity verification is currently being reviewed. This usually takes 2-3 business days.
                </p>
                <Alert className="mb-4 text-left">
                  <AlertDescription>
                    We'll notify you via email once your verification is complete. You can check your status anytime in your profile.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      );
    }

    if (user.kycStatus === 'rejected') {
      return (
        <>
          <Header />
          <div className="min-h-screen bg-gradient-to-br from-realvora-blue/5 to-realvora-gold/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification Failed</h2>
                <p className="text-gray-600 mb-6">
                  Your identity verification was not approved. Please contact support or try again with different documents.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => window.location.href = '/kyc-verification'}
                    className="w-full bg-realvora-blue hover:bg-realvora-navy"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/support'}
                    variant="outline"
                    className="w-full"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      );
    }
  }

  // Check wallet connection requirements
  if (requireWallet && user && !user.walletConnected) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-realvora-blue/5 to-realvora-gold/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Connection Required</h2>
              <p className="text-gray-600 mb-6">
                You need to connect your Stacks wallet to access this feature.
              </p>
              <Button 
                onClick={connectWallet}
                className="w-full bg-realvora-blue hover:bg-realvora-navy"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // All requirements met, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;