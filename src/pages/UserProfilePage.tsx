import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Edit, 
  Save,
  X
} from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  type?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  isEditing,
  onChange,
  onSave,
  onCancel,
  onEdit,
  type = 'text'
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={onSave} className="px-2">
            <Save className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="px-2">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-gray-900">{value || 'Not provided'}</span>
          <Button size="sm" variant="ghost" onClick={onEdit} className="px-2">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const UserProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please log in to view your profile.</p>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full mt-4 bg-realvora-blue hover:bg-realvora-navy"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = (field: string) => {
    setEditingField(field);
    setEditValues(prev => ({
      ...prev,
      [field]: (user as any)[field] || ''
    }));
  };

  const handleSave = async (field: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        [field]: editValues[field as keyof typeof editValues]
      };
      
      updateUser(updatedUser);
      setEditingField(null);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: user?.address || ''
    });
  };

  const handleApproveKYC = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual admin API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        kycStatus: 'approved' as const,
        kycApprovedAt: new Date().toISOString()
      };
      
      updateUser(updatedUser);
      setMessage('KYC approuvé avec succès!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de l\'approbation du KYC. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getKYCStatusInfo = () => {
    switch (user.kycStatus) {
      case 'approved':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          badge: <Badge className="bg-green-100 text-green-800">Verified</Badge>,
          description: 'Your identity has been verified successfully.',
          action: null
        };
      case 'in_review':
        return {
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          badge: <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>,
          description: 'Your KYC documents are being reviewed. This usually takes 1-3 business days.',
          action: (
            <div className="flex space-x-2">
              <Button 
                onClick={handleApproveKYC}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? 'Validation...' : '✓ Valider KYC (Temporaire)'}
              </Button>
            </div>
          )
        };
      case 'rejected':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          badge: <Badge className="bg-red-100 text-red-800">Rejected</Badge>,
          description: 'Your KYC verification was rejected. Please resubmit your documents.',
          action: (
            <Button 
              onClick={() => navigate('/kyc-verification')} 
              className="bg-realvora-blue hover:bg-realvora-navy"
            >
              Resubmit KYC
            </Button>
          )
        };
      default:
        return {
          icon: <Shield className="w-5 h-5 text-gray-600" />,
          badge: <Badge className="bg-gray-100 text-gray-800">Pending</Badge>,
          description: 'Complete your KYC verification to access all platform features.',
          action: (
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate('/kyc-verification')} 
                className="bg-realvora-blue hover:bg-realvora-navy"
              >
                Start KYC Verification
              </Button>
              <Button 
                onClick={handleApproveKYC}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? 'Validation...' : '✓ Valider KYC (Temporaire)'}
              </Button>
            </div>
          )
        };
    }
  };

  const kycInfo = getKYCStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and verification status</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="verification">Verification Status</TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField
                    label="First Name"
                    value={editValues.firstName}
                    isEditing={editingField === 'firstName'}
                    onChange={(value) => setEditValues(prev => ({ ...prev, firstName: value }))}
                    onSave={() => handleSave('firstName')}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit('firstName')}
                  />
                  
                  <EditableField
                    label="Last Name"
                    value={editValues.lastName}
                    isEditing={editingField === 'lastName'}
                    onChange={(value) => setEditValues(prev => ({ ...prev, lastName: value }))}
                    onSave={() => handleSave('lastName')}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit('lastName')}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField
                    label="Email Address"
                    value={editValues.email}
                    isEditing={editingField === 'email'}
                    onChange={(value) => setEditValues(prev => ({ ...prev, email: value }))}
                    onSave={() => handleSave('email')}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit('email')}
                    type="email"
                  />
                  
                  <EditableField
                    label="Phone Number"
                    value={editValues.phone}
                    isEditing={editingField === 'phone'}
                    onChange={(value) => setEditValues(prev => ({ ...prev, phone: value }))}
                    onSave={() => handleSave('phone')}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit('phone')}
                    type="tel"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField
                    label="Date of Birth"
                    value={editValues.dateOfBirth}
                    isEditing={editingField === 'dateOfBirth'}
                    onChange={(value) => setEditValues(prev => ({ ...prev, dateOfBirth: value }))}
                    onSave={() => handleSave('dateOfBirth')}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit('dateOfBirth')}
                    type="date"
                  />
                  
                  <EditableField
                    label="Address"
                    value={editValues.address}
                    isEditing={editingField === 'address'}
                    onChange={(value) => setEditValues(prev => ({ ...prev, address: value }))}
                    onSave={() => handleSave('address')}
                    onCancel={handleCancel}
                    onEdit={() => handleEdit('address')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Status Tab */}
          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Verification Status</span>
                </CardTitle>
                <CardDescription>
                  Track your KYC verification progress and compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* KYC Status */}
                  <div className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {kycInfo.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">KYC Verification</h3>
                        {kycInfo.badge}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{kycInfo.description}</p>
                      {kycInfo.action}
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Account Created</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Email Status</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <Alert>
                    <Shield className="w-4 h-4" />
                    <AlertDescription>
                      Your personal information is encrypted and stored securely. We comply with all relevant data protection regulations.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;