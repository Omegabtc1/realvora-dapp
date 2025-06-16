
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Shield, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [kycStatus, setKycStatus] = useState('pending'); // 'pending', 'verified', 'rejected'

  const kycStatusConfig = {
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'KYC Pending' },
    verified: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', text: 'KYC Verified' },
    rejected: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', text: 'KYC Rejected' }
  };

  const currentStatus = kycStatusConfig[kycStatus];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-realvora-blue mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and verification status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-realvora-blue"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-realvora-blue"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-realvora-blue"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <Button className="bg-realvora-blue hover:bg-realvora-navy text-white">
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Purchase', property: 'Downtown Apartment NFT #123', amount: '$5,000', date: '2024-01-15', status: 'Completed' },
                    { type: 'Rental Income', property: 'Downtown Apartment NFT #123', amount: '+$125', date: '2024-01-01', status: 'Received' },
                    { type: 'Purchase', property: 'Luxury Villa NFT #456', amount: '$12,000', date: '2023-12-20', status: 'Completed' }
                  ].map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.type}</div>
                        <div className="text-sm text-gray-600">{transaction.property}</div>
                        <div className="text-xs text-gray-500">{transaction.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${transaction.type === 'Rental Income' ? 'text-green-600' : 'text-gray-900'}`}>
                          {transaction.amount}
                        </div>
                        <div className="text-xs text-green-600">{transaction.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* KYC Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Verification Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${currentStatus.bg}`}>
                  <currentStatus.icon className={`w-6 h-6 ${currentStatus.color}`} />
                  <div>
                    <div className="font-medium text-gray-900">{currentStatus.text}</div>
                    <div className="text-sm text-gray-600">
                      {kycStatus === 'pending' && 'Review in progress'}
                      {kycStatus === 'verified' && 'Account verified'}
                      {kycStatus === 'rejected' && 'Please resubmit documents'}
                    </div>
                  </div>
                </div>
                {kycStatus !== 'verified' && (
                  <Button className="w-full mt-4 bg-realvora-gold hover:bg-realvora-gold/90 text-realvora-navy">
                    Complete KYC
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">SMS Notifications</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Marketing Updates</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
