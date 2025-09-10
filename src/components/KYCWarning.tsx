import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface KYCWarningProps {
  message?: string;
  showButton?: boolean;
  variant?: 'inline' | 'modal' | 'banner';
  onClose?: () => void;
}

const KYCWarning: React.FC<KYCWarningProps> = ({ 
  message, 
  showButton = true, 
  variant = 'inline',
  onClose 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getKYCStatusInfo = () => {
    if (!user) {
      return {
        icon: Shield,
        color: 'bg-gray-50 border-gray-200',
        iconColor: 'text-gray-600',
        title: 'Authentication Required',
        defaultMessage: 'Please sign in to perform transactions.'
      };
    }

    switch (user.kycStatus) {
      case 'pending':
        return {
          icon: Shield,
          color: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-600',
          title: 'KYC Verification Required',
          defaultMessage: 'Complete your KYC verification to perform transactions.'
        };
      case 'in_review':
        return {
          icon: Clock,
          color: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          title: 'KYC Under Review',
          defaultMessage: 'Your KYC is being reviewed. Transactions will be available once approved.'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          title: 'KYC Verification Failed',
          defaultMessage: 'Your KYC was rejected. Please resubmit your documents to perform transactions.'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-600',
          title: 'KYC Verification Required',
          defaultMessage: 'Complete your KYC verification to perform transactions.'
        };
    }
  };

  const statusInfo = getKYCStatusInfo();
  const Icon = statusInfo.icon;
  const displayMessage = message || statusInfo.defaultMessage;

  const handleAction = () => {
    if (!user) {
      navigate('/login');
    } else if (user.kycStatus === 'rejected') {
      navigate('/kyc-verification');
    } else if (user.kycStatus !== 'approved') {
      navigate('/kyc-verification');
    }
  };

  const getButtonText = () => {
    if (!user) return 'Sign In';
    if (user.kycStatus === 'rejected') return 'Resubmit KYC';
    if (user.kycStatus === 'in_review') return 'Check Status';
    return 'Complete KYC';
  };

  if (variant === 'banner') {
    return (
      <div className={`${statusInfo.color} border-l-4 p-4 mb-4`}>
        <div className="flex items-start">
          <Icon className={`w-5 h-5 ${statusInfo.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{statusInfo.title}</h3>
            <p className="text-sm text-gray-700">{displayMessage}</p>
            {showButton && (
              <div className="mt-3 flex items-center space-x-3">
                <Button 
                  size="sm"
                  onClick={handleAction}
                  className="bg-realvora-blue hover:bg-realvora-navy text-white"
                >
                  {getButtonText()}
                </Button>
                {onClose && (
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Alert className={statusInfo.color}>
      <Icon className={`w-4 h-4 ${statusInfo.iconColor}`} />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium">{statusInfo.title}:</span> {displayMessage}
        </div>
        {showButton && (
          <Button 
            size="sm"
            onClick={handleAction}
            className="ml-4 bg-realvora-blue hover:bg-realvora-navy text-white"
          >
            {getButtonText()}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default KYCWarning;