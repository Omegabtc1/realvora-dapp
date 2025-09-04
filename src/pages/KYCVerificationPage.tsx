import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  MapPin, 
  CreditCard,
  Shield,
  Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUpload {
  type: string;
  file: File | null;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}

const KYCVerificationPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    dateOfBirth: '',
    nationality: '',
    phoneNumber: '',
    occupation: '',
    sourceOfFunds: ''
  });
  
  // Address Information
  const [addressInfo, setAddressInfo] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  // Document Uploads
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: 'government_id', file: null, status: 'pending' },
    { type: 'proof_of_address', file: null, status: 'pending' },
    { type: 'selfie', file: null, status: 'pending' }
  ]);

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Address Details', icon: MapPin },
    { number: 3, title: 'Document Upload', icon: FileText },
    { number: 4, title: 'Review & Submit', icon: CheckCircle }
  ];

  const documentTypes = {
    government_id: {
      title: 'Government ID',
      description: 'Upload a clear photo of your passport, driver\'s license, or national ID',
      icon: CreditCard
    },
    proof_of_address: {
      title: 'Proof of Address',
      description: 'Upload a utility bill, bank statement, or lease agreement (not older than 3 months)',
      icon: MapPin
    },
    selfie: {
      title: 'Selfie Verification',
      description: 'Take a clear selfie holding your government ID next to your face',
      icon: Camera
    }
  };

  const handleFileUpload = (documentType: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.type === documentType 
        ? { ...doc, file, status: 'uploaded' as const }
        : doc
    ));
  };

  const handleSubmitKYC = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock API call for KYC submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user KYC status
      updateUser({
        kycStatus: 'in_review',
        kycSubmittedAt: new Date().toISOString()
      });
      
      setSuccess('KYC verification submitted successfully! We will review your documents within 2-3 business days.');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError('Failed to submit KYC verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return personalInfo.dateOfBirth && personalInfo.nationality && personalInfo.phoneNumber;
      case 2:
        return addressInfo.street && addressInfo.city && addressInfo.country;
      case 3:
        return documents.every(doc => doc.file !== null);
      default:
        return true;
    }
  };

  const renderKYCStatus = () => {
    if (!user) return null;
    
    const statusConfig = {
      pending: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Verification Pending' },
      in_review: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Under Review' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Verified' },
      rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Rejected' }
    };
    
    const config = statusConfig[user.kycStatus];
    const Icon = config.icon;
    
    return (
      <div className="mb-6">
        <Badge className={`${config.color} px-3 py-1`}>
          <Icon className="w-4 h-4 mr-2" />
          {config.text}
        </Badge>
      </div>
    );
  };

  if (user?.kycStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-realvora-blue/5 to-realvora-gold/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verified!</h2>
            <p className="text-gray-600 mb-6">Your identity has been successfully verified. You can now connect your wallet and start investing.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-realvora-blue/5 to-realvora-gold/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-realvora-blue" />
            <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          </div>
          <p className="text-gray-600">Complete your identity verification to access all platform features</p>
          {renderKYCStatus()}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-realvora-blue text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-realvora-blue' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Please provide your personal information'}
              {currentStep === 2 && 'Enter your current residential address'}
              {currentStep === 3 && 'Upload the required verification documents'}
              {currentStep === 4 && 'Review your information and submit for verification'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select value={personalInfo.nationality} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, nationality: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={personalInfo.phoneNumber}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    type="text"
                    placeholder="Software Engineer"
                    value={personalInfo.occupation}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, occupation: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                  <Select value={personalInfo.sourceOfFunds} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, sourceOfFunds: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source of funds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary/Employment</SelectItem>
                      <SelectItem value="business">Business Income</SelectItem>
                      <SelectItem value="investments">Investment Returns</SelectItem>
                      <SelectItem value="inheritance">Inheritance</SelectItem>
                      <SelectItem value="savings">Personal Savings</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    type="text"
                    placeholder="123 Main Street, Apt 4B"
                    value={addressInfo.street}
                    onChange={(e) => setAddressInfo(prev => ({ ...prev, street: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="New York"
                    value={addressInfo.city}
                    onChange={(e) => setAddressInfo(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="NY"
                    value={addressInfo.state}
                    onChange={(e) => setAddressInfo(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    placeholder="10001"
                    value={addressInfo.zipCode}
                    onChange={(e) => setAddressInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={addressInfo.country} onValueChange={(value) => setAddressInfo(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {documents.map((doc) => {
                  const docType = documentTypes[doc.type as keyof typeof documentTypes];
                  const Icon = docType.icon;
                  
                  return (
                    <div key={doc.type} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-realvora-blue/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-realvora-blue" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{docType.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{docType.description}</p>
                          
                          {doc.file ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">{doc.file.name}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*,.pdf';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) handleFileUpload(doc.type, file);
                                  };
                                  input.click();
                                }}
                              >
                                Replace
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*,.pdf';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleFileUpload(doc.type, file);
                                };
                                input.click();
                              }}
                              className="w-full"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload {docType.title}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-600">Date of Birth:</span> {personalInfo.dateOfBirth}</div>
                    <div><span className="text-gray-600">Nationality:</span> {personalInfo.nationality}</div>
                    <div><span className="text-gray-600">Phone:</span> {personalInfo.phoneNumber}</div>
                    <div><span className="text-gray-600">Occupation:</span> {personalInfo.occupation}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                  <p className="text-sm text-gray-700">
                    {addressInfo.street}<br />
                    {addressInfo.city}, {addressInfo.state} {addressInfo.zipCode}<br />
                    {addressInfo.country}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                  <div className="space-y-2">
                    {documents.map((doc) => {
                      const docType = documentTypes[doc.type as keyof typeof documentTypes];
                      return (
                        <div key={doc.type} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{docType.title}: {doc.file?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceedToNextStep()}
                  className="bg-realvora-blue hover:bg-realvora-navy"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitKYC}
                  disabled={isLoading}
                  className="bg-realvora-blue hover:bg-realvora-navy"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Review'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KYCVerificationPage;