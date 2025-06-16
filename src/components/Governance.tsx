
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vote, Plus, Clock, CheckCircle, XCircle, Users } from 'lucide-react';

const Governance = () => {
  const [selectedTab, setSelectedTab] = useState('active');

  const proposals = {
    active: [
      {
        id: 1,
        title: 'Acquire Premium Downtown Office Building',
        description: 'Proposal to purchase a 15-story office building in downtown financial district. Expected ROI: 9.2% annually.',
        author: '0x1234...5678',
        votesFor: 1250,
        votesAgainst: 340,
        totalVotes: 1590,
        endDate: '2024-01-20',
        status: 'active',
        userVoted: false
      },
      {
        id: 2,
        title: 'Increase Management Fee to 2.5%',
        description: 'Proposal to adjust the management fee from 2% to 2.5% to improve property maintenance and platform development.',
        author: '0x9876...1234',
        votesFor: 890,
        votesAgainst: 1150,
        totalVotes: 2040,
        endDate: '2024-01-25',
        status: 'active',
        userVoted: true,
        userVote: 'against'
      }
    ],
    completed: [
      {
        id: 3,
        title: 'Implement Automated Rent Distribution',
        description: 'Proposal to automate monthly rent distribution to NFT holders through smart contracts.',
        author: '0x5555...9999',
        votesFor: 2340,
        votesAgainst: 156,
        totalVotes: 2496,
        endDate: '2023-12-15',
        status: 'passed',
        userVoted: true,
        userVote: 'for'
      }
    ]
  };

  const handleVote = (proposalId, voteType) => {
    console.log(`Voting ${voteType} on proposal ${proposalId}`);
    // Implement voting logic here
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-realvora-blue mb-2">DAO Governance</h1>
          <p className="text-gray-600">Participate in community decisions and shape the future of Realvora</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-realvora-blue mb-1">42</div>
            <div className="text-sm text-gray-600">Total Proposals</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-realvora-green mb-1">15,240</div>
            <div className="text-sm text-gray-600">Your Voting Power</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-realvora-gold mb-1">89%</div>
            <div className="text-sm text-gray-600">Participation Rate</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-700 mb-1">$2.8M</div>
            <div className="text-sm text-gray-600">Treasury Value</div>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-1">
            <Button
              variant={selectedTab === 'active' ? 'default' : 'outline'}
              onClick={() => setSelectedTab('active')}
              className={selectedTab === 'active' ? 'bg-realvora-blue hover:bg-realvora-navy' : ''}
            >
              Active Proposals
            </Button>
            <Button
              variant={selectedTab === 'completed' ? 'default' : 'outline'}
              onClick={() => setSelectedTab('completed')}
              className={selectedTab === 'completed' ? 'bg-realvora-blue hover:bg-realvora-navy' : ''}
            >
              Completed
            </Button>
          </div>
          <Button className="bg-realvora-gold hover:bg-realvora-gold/90 text-realvora-navy">
            <Plus className="w-4 h-4 mr-2" />
            Create Proposal
          </Button>
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals[selectedTab].map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(proposal.status)}
                      <span>{proposal.title}</span>
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{proposal.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>By {proposal.author}</span>
                      <span>Ends {proposal.endDate}</span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {proposal.totalVotes} votes
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Voting Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-600">For: {proposal.votesFor}</span>
                    <span className="text-red-600">Against: {proposal.votesAgainst}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Voting Buttons */}
                {proposal.status === 'active' && (
                  <div className="flex space-x-3">
                    {!proposal.userVoted ? (
                      <>
                        <Button
                          onClick={() => handleVote(proposal.id, 'for')}
                          className="bg-green-500 hover:bg-green-600 text-white flex-1"
                        >
                          <Vote className="w-4 h-4 mr-2" />
                          Vote For
                        </Button>
                        <Button
                          onClick={() => handleVote(proposal.id, 'against')}
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1"
                        >
                          <Vote className="w-4 h-4 mr-2" />
                          Vote Against
                        </Button>
                      </>
                    ) : (
                      <div className="text-sm text-gray-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        You voted {proposal.userVote === 'for' ? 'For' : 'Against'} this proposal
                      </div>
                    )}
                  </div>
                )}

                {proposal.status !== 'active' && (
                  <div className="text-sm text-gray-600">
                    Proposal {proposal.status === 'passed' ? 'passed' : 'rejected'} on {proposal.endDate}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Governance;
