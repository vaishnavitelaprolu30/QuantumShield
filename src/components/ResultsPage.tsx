import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBlockchain } from '@/components/BlockchainProvider';
import { 
  BarChart3, 
  Trophy, 
  Users, 
  Vote, 
  Clock,
  Shield,
  Eye,
  Activity,
  TrendingUp
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { 
    candidates, 
    totalVotes, 
    voters, 
    isVotingActive,
    getResults,
    getBlockchainAudit
  } = useBlockchain();

  const results = getResults();
  const auditTrail = getBlockchainAudit();
  const participationRate = voters.length > 0 ? (totalVotes / voters.length) * 100 : 0;

  const getVotePercentage = (voteCount: number) => {
    return totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Election Results
              </CardTitle>
              <CardDescription>
                Live results from the blockchain voting system
              </CardDescription>
            </div>
            <Badge variant={isVotingActive ? "default" : "secondary"} className="text-sm">
              {isVotingActive ? (
                <>
                  <Activity className="w-4 h-4 mr-1" />
                  Live Updates
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-1" />
                  Final Results
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Total Votes Cast</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{voters.length}</div>
              <div className="text-sm text-muted-foreground">Registered Voters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blockchain-accent">{participationRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Participation Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-info">{candidates.length}</div>
              <div className="text-sm text-muted-foreground">Candidates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Candidate Rankings
            </CardTitle>
            <CardDescription>
              Results ranked by vote count
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.map((candidate, index) => {
              const percentage = getVotePercentage(candidate.voteCount);
              const isWinner = index === 0 && candidate.voteCount > 0;
              
              return (
                <div 
                  key={candidate.id} 
                  className={`space-y-3 p-4 rounded-lg border ${
                    isWinner ? 'border-success/50 bg-success/5' : 'border-border/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={isWinner ? "default" : "outline"} 
                        className="w-8 h-8 p-0 flex items-center justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {candidate.name}
                          {isWinner && <Trophy className="w-4 h-4 text-success" />}
                        </h4>
                        <p className="text-sm text-muted-foreground">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{candidate.voteCount}</div>
                      <div className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vote Progress</span>
                      <span>{candidate.voteCount} of {totalVotes}</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-3 ${isWinner ? 'bg-success/20' : ''}`}
                    />
                  </div>
                </div>
              );
            })}
            
            {results.length === 0 && (
              <div className="text-center py-8">
                <Vote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No candidates registered yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics & Insights */}
        <div className="space-y-6">
          {/* Voting Statistics */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Voting Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-success">
                    {voters.filter(v => v.hasVoted).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Voters Participated</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-warning">
                    {voters.length - voters.filter(v => v.hasVoted).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Yet to Vote</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Participation Rate</span>
                  <span className="font-medium">{participationRate.toFixed(1)}%</span>
                </div>
                <Progress value={participationRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Real-time Updates */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest votes on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {auditTrail.slice(-5).reverse().map((vote) => {
                  const candidate = candidates.find(c => c.id === vote.candidateId);
                  return (
                    <div key={vote.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <span className="text-sm">
                          Vote for <span className="font-medium">{candidate?.name}</span>
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(vote.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
                
                {auditTrail.length === 0 && (
                  <div className="text-center py-6">
                    <Eye className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No votes cast yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Verification */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Blockchain Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>All votes cryptographically secured</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>Immutable audit trail maintained</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>Transparent & verifiable results</span>
              </div>
              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">Blockchain Verified</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {auditTrail.length} transactions recorded on blockchain
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};