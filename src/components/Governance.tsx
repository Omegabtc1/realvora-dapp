import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Vote,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Building,
  MapPin,
} from "lucide-react";

const Governance = () => {
  const [selectedTab, setSelectedTab] = useState("active");
  const [selectedProperty, setSelectedProperty] = useState("all");

  // User's owned properties (simulated data)
  const userOwnedProperties = [
    {
      id: "1",
      title: "Luxury Villa Monaco",
      location: "Monaco, Monaco",
      shares: 45,
    },
    {
      id: "2",
      title: "Haussmann Apartment",
      location: "Paris 16th, France",
      shares: 120,
    },
    {
      id: "3",
      title: "Design Loft Berlin",
      location: "Berlin, Germany",
      shares: 78,
    },
  ];

  const [proposals, setProposals] = useState({
    active: [
      {
        id: 1,
        title: "Renovate Pool Area",
        description:
          "Proposal to renovate the pool area and add modern amenities. Estimated cost: €50,000. Expected to increase property value by 8%.",
        author: "0x1234...5678",
        votesFor: 32,
        votesAgainst: 8,
        totalVotes: 40,
        endDate: "2024-01-20",
        status: "active",
        userVoted: false,
        propertyId: "1",
        propertyTitle: "Luxury Villa Monaco",
      },
      {
        id: 2,
        title: "Install Smart Home System",
        description:
          "Proposal to install a comprehensive smart home system including automated lighting, security, and climate control.",
        author: "0x9876...1234",
        votesFor: 89,
        votesAgainst: 23,
        totalVotes: 112,
        endDate: "2024-01-25",
        status: "active",
        userVoted: true,
        userVote: "for",
        propertyId: "2",
        propertyTitle: "Haussmann Apartment",
      },
      {
        id: 3,
        title: "Increase Rent by 5%",
        description:
          "Proposal to increase monthly rent by 5% to match current market rates in the area.",
        author: "0x5555...9999",
        votesFor: 45,
        votesAgainst: 28,
        totalVotes: 73,
        endDate: "2024-01-22",
        status: "active",
        userVoted: false,
        propertyId: "3",
        propertyTitle: "Design Loft Berlin",
      },
    ],
    completed: [
      {
        id: 4,
        title: "Upgrade Kitchen Appliances",
        description:
          "Proposal to replace all kitchen appliances with energy-efficient models. Total cost: €15,000.",
        author: "0x5555...9999",
        votesFor: 95,
        votesAgainst: 12,
        totalVotes: 107,
        endDate: "2023-12-15",
        status: "passed",
        userVoted: true,
        userVote: "for",
        propertyId: "2",
        propertyTitle: "Haussmann Apartment",
      },
      {
        id: 5,
        title: "Install Solar Panels",
        description:
          "Proposal to install solar panels on the roof to reduce energy costs and increase sustainability.",
        author: "0x7777...8888",
        votesFor: 28,
        votesAgainst: 45,
        totalVotes: 73,
        endDate: "2023-11-20",
        status: "rejected",
        userVoted: true,
        userVote: "against",
        propertyId: "3",
        propertyTitle: "Design Loft Berlin",
      },
    ],
  });

  // Filter proposals based on selected property and user ownership
  const getFilteredProposals = (status) => {
    const allProposals = proposals[status];
    if (selectedProperty === "all") {
      // Show only proposals for properties the user owns
      return allProposals.filter((proposal) =>
        userOwnedProperties.some(
          (property) => property.id === proposal.propertyId
        )
      );
    }
    return allProposals.filter(
      (proposal) => proposal.propertyId === selectedProperty
    );
  };

  const handleVote = (proposalId, voteType) => {
    // Find the proposal
    const proposalIndex = proposals.active.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) return;

    const proposal = proposals.active[proposalIndex];
    
    // Check if user owns shares in this property
    const userProperty = userOwnedProperties.find(p => p.id === proposal.propertyId);
    if (!userProperty) {
      toast({
        title: "Error",
        description: "You must own shares in this property to vote",
        variant: "destructive",
      });
      return;
    }

    // Update the proposal with the vote
    const updatedProposals = { ...proposals };
    const updatedProposal = { ...proposal };
    
    // Add user's voting power to the vote count
    const votingPower = userProperty.shares;
    
    if (voteType === "for") {
      updatedProposal.votesFor += votingPower;
    } else {
      updatedProposal.votesAgainst += votingPower;
    }
    
    updatedProposal.totalVotes += votingPower;
    updatedProposal.userVoted = true;
    updatedProposal.userVote = voteType;
    
    updatedProposals.active[proposalIndex] = updatedProposal;
    setProposals(updatedProposals);

    toast({
      title: "Vote Submitted!",
      description: `You voted ${voteType === "for" ? "For" : "Against"} with ${votingPower} shares`,
    });
  };

  // Calculate user's voting power for selected property
  const getUserVotingPower = () => {
    if (selectedProperty === "all") {
      return userOwnedProperties.reduce(
        (total, property) => total + property.shares,
        0
      );
    }
    const property = userOwnedProperties.find((p) => p.id === selectedProperty);
    return property ? property.shares : 0;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-realvora-blue mb-2">
            Property Sub-DAOs
          </h1>
          <p className="text-gray-600">
            Vote on proposals for properties you own shares in
          </p>

          {/* Property Selector */}
          <div className="mt-6 max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Property DAO
            </label>
            <Select
              value={selectedProperty}
              onValueChange={setSelectedProperty}
            >
              <SelectTrigger className="w-full">
                <Building className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    All My Properties
                  </div>
                </SelectItem>
                {userOwnedProperties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{property.title}</span>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {property.shares} shares
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-realvora-blue mb-1">
              {userOwnedProperties.length}
            </div>
            <div className="text-sm text-gray-600">Properties Owned</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-realvora-green mb-1">
              {getUserVotingPower()}
            </div>
            <div className="text-sm text-gray-600">Your Voting Power</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-realvora-gold mb-1">
              {getFilteredProposals("active").length}
            </div>
            <div className="text-sm text-gray-600">Active Proposals</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-700 mb-1">
              {getFilteredProposals("completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed Votes</div>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-1">
            <Button
              variant={selectedTab === "active" ? "default" : "outline"}
              onClick={() => setSelectedTab("active")}
              className={
                selectedTab === "active"
                  ? "bg-realvora-blue hover:bg-realvora-navy"
                  : ""
              }
            >
              Active Proposals
            </Button>
            <Button
              variant={selectedTab === "completed" ? "default" : "outline"}
              onClick={() => setSelectedTab("completed")}
              className={
                selectedTab === "completed"
                  ? "bg-realvora-blue hover:bg-realvora-navy"
                  : ""
              }
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
          {getFilteredProposals(selectedTab).length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No proposals found</h3>
                <p className="text-sm">
                  {selectedProperty === "all"
                    ? "No active proposals for your properties at the moment."
                    : "No proposals for this property at the moment."}
                </p>
              </div>
            </Card>
          ) : (
            getFilteredProposals(selectedTab).map((proposal) => (
              <Card
                key={proposal.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-realvora-blue/10 text-realvora-blue border-realvora-blue">
                          <Building className="w-3 h-3 mr-1" />
                          {proposal.propertyTitle}
                        </Badge>
                      </div>
                      <CardTitle className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(proposal.status)}
                        <span>{proposal.title}</span>
                      </CardTitle>
                      <p className="text-gray-600 text-sm">
                        {proposal.description}
                      </p>
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
                      <span className="text-green-600">
                        For: {proposal.votesFor}
                      </span>
                      <span className="text-red-600">
                        Against: {proposal.votesAgainst}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (proposal.votesFor / proposal.totalVotes) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Voting Power Info */}
                  <div className="bg-gray-50 p-3 rounded-lg mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Your voting power for this property:
                      </span>
                      <span className="font-medium text-realvora-blue">
                        {userOwnedProperties.find(
                          (p) => p.id === proposal.propertyId
                        )?.shares || 0}{" "}
                        shares
                      </span>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  {proposal.status === "active" && (
                    <div className="flex space-x-3 mt-4">
                      {userOwnedProperties.find(
                        (p) => p.id === proposal.propertyId
                      ) ? (
                        !proposal.userVoted ? (
                          <>
                            <Button
                              onClick={() => handleVote(proposal.id, "for")}
                              className="bg-green-500 hover:bg-green-600 text-white flex-1"
                            >
                              <Vote className="w-4 h-4 mr-2" />
                              Vote For
                            </Button>
                            <Button
                              onClick={() => handleVote(proposal.id, "against")}
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
                            You voted{" "}
                            {proposal.userVote === "for" ? "For" : "Against"}{" "}
                            this proposal
                          </div>
                        )
                      ) : (
                        <div className="flex-1 text-center py-3 text-gray-500 text-sm">
                          You must own shares in this property to vote
                        </div>
                      )}
                    </div>
                  )}

                  {proposal.status !== "active" && (
                    <div className="text-sm text-gray-600">
                      Proposal{" "}
                      {proposal.status === "passed" ? "passed" : "rejected"} on{" "}
                      {proposal.endDate}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Governance;
