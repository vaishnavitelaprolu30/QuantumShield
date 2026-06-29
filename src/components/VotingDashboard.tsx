import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBlockchain } from '@/components/BlockchainProvider';
import { useToast } from '@/hooks/use-toast';
import { 
  Vote, 
  Shield, 
  CheckCircle, 
  Clock, 
  Users, 
  BarChart3,
  Loader2,
  Trophy,
  Eye
} from 'lucide-react';

export const VotingDashboard: React.FC = () => {
  const { 
    candidates, 
    isVotingActive, 
    totalVotes, 
    voters,
    currentAccount,
    castVote,
    isConnected 
  } = useBlockchain();
  const { toast } = useToast();
  const [votingFor, setVotingFor] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');

  const currentVoter = voters.find(v => v.id === currentAccount);
  const hasVoted = currentVoter?.hasVoted || false;

  const handleVote = async (candidateId: string) => {
    if (!currentAccount || hasVoted) return;

    setVotingFor(candidateId);
    try {
      const success = await castVote(candidateId, currentAccount);
      if (success) {
        toast({
          title: "Vote Cast Successfully!",
          description: "Your vote has been recorded on the blockchain.",
        });
        setSelectedCandidate('');
      } else {
        toast({
          title: "Vote Failed",
          description: "Unable to cast vote. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while casting your vote.",
        variant: "destructive",
      });
    } finally {
      setVotingFor(null);
    }
  };

  const getVotePercentage = (voteCount: number) => {
    return totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
            <p className="text-muted-foreground mb-4">
              Please connect your wallet to participate in voting
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voting Status Header */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Student Election 2024</CardTitle>
              <CardDescription>
                Secure blockchain-based voting system
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isVotingActive ? "default" : "secondary"} className="text-sm">
                {isVotingActive ? (
                  <>
                    <Clock className="w-4 h-4 mr-1" />
                    Voting Active
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-1" />
                    Voting Closed
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{voters.length}</div>
              <div className="text-sm text-muted-foreground">Registered Voters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blockchain-accent">{candidates.length}</div>
              <div className="text-sm text-muted-foreground">Candidates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voter Status */}
      {currentVoter && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Voting Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{currentVoter.name}</p>
                <p className="text-sm text-muted-foreground">{currentVoter.email}</p>
              </div>
              <Badge variant={hasVoted ? "default" : "secondary"}>
                {hasVoted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Voted
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-1" />
                    Not Voted
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => {
          const votePercentage = getVotePercentage(candidate.voteCount);
          const isLeading = candidates.every(c => c.voteCount <= candidate.voteCount);
          
          return (
            <Card 
              key={candidate.id} 
              className={`relative border-border/50 transition-all duration-300 hover:shadow-lg ${
                selectedCandidate === candidate.id ? 'ring-2 ring-primary' : ''
              } ${isLeading && candidate.voteCount > 0 ? 'border-success/50 shadow-glow-success/20' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.party}</CardDescription>
                  </div>
                  {isLeading && candidate.voteCount > 0 && (
                    <Trophy className="w-5 h-5 text-success" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {candidate.description}
                </p>
                
                {/* Vote Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Votes: {candidate.voteCount}</span>
                    <span>{votePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={votePercentage} className="h-2" />
                </div>

                {/* Vote Button */}
                {isVotingActive && !hasVoted && currentVoter && (
                  <Button
                    variant="vote"
                    className="w-full"
                    onClick={() => handleVote(candidate.id)}
                    disabled={votingFor !== null}
                  >
                    {votingFor === candidate.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Casting Vote...
                      </>
                    ) : (
                      <>
                        <Vote className="w-4 h-4 mr-2" />
                        Vote for {candidate.name}
                      </>
                    )}
                  </Button>
                )}

                {hasVoted && (
                  <Button variant="ghost" className="w-full" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    You have already voted
                  </Button>
                )}

                {!isVotingActive && (
                  <Button variant="ghost" className="w-full" disabled>
                    <Eye className="w-4 h-4 mr-2" />
                    Voting Closed
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-time Results Summary */}
      {totalVotes > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Live Results
            </CardTitle>
            <CardDescription>
              Real-time vote tallying powered by blockchain technology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidates
                .sort((a, b) => b.voteCount - a.voteCount)
                .map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{candidate.voteCount}</p>
                      <p className="text-sm text-muted-foreground">
                        {getVotePercentage(candidate.voteCount).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};