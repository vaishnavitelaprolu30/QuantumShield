import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBlockchain } from '@/components/BlockchainProvider';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  UserPlus, 
  Play, 
  Square, 
  Users, 
  Vote, 
  BarChart3,
  Activity,
  Loader2,
  Eye,
  Download
} from 'lucide-react';

interface CandidateForm {
  name: string;
  party: string;
  description: string;
}

export const AdminPanel: React.FC = () => {
  const { 
    candidates, 
    voters, 
    isVotingActive, 
    totalVotes,
    addCandidate,
    startVoting,
    endVoting,
    getResults,
    getBlockchainAudit
  } = useBlockchain();
  const { toast } = useToast();
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [candidateForm, setCandidateForm] = useState<CandidateForm>({
    name: '',
    party: '',
    description: ''
  });

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.party || !candidateForm.description) {
      toast({
        title: "Invalid Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingCandidate(true);
    try {
      const success = await addCandidate(candidateForm);
      if (success) {
        toast({
          title: "Candidate Added!",
          description: `${candidateForm.name} has been added to the election.`,
        });
        setCandidateForm({ name: '', party: '', description: '' });
      } else {
        toast({
          title: "Failed to Add Candidate",
          description: "Unable to add candidate. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the candidate.",
        variant: "destructive",
      });
    } finally {
      setIsAddingCandidate(false);
    }
  };

  const handleStartVoting = () => {
    startVoting();
    toast({
      title: "Voting Started!",
      description: "The election is now open for voting.",
    });
  };

  const handleEndVoting = () => {
    endVoting();
    toast({
      title: "Voting Ended!",
      description: "The election has been closed. Results are now final.",
    });
  };

  const handleInputChange = (field: keyof CandidateForm, value: string) => {
    setCandidateForm(prev => ({ ...prev, [field]: value }));
  };

  const exportResults = () => {
    const results = getResults();
    const auditTrail = getBlockchainAudit();
    
    const reportData = {
      election: "Student Election 2024",
      timestamp: new Date().toISOString(),
      totalVotes,
      totalRegisteredVoters: voters.length,
      candidates: results,
      auditTrail: auditTrail.map(vote => ({
        ...vote,
        timestamp: new Date(vote.timestamp).toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Results Exported",
      description: "Election results and audit trail have been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Election Administration
              </CardTitle>
              <CardDescription>
                Manage candidates, control voting, and monitor results
              </CardDescription>
            </div>
            <Badge variant={isVotingActive ? "default" : "secondary"} className="text-sm">
              {isVotingActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="text-center">
              <div className="text-2xl font-bold text-info">
                {voters.filter(v => v.hasVoted).length}
              </div>
              <div className="text-sm text-muted-foreground">Votes Cast</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Tabs */}
      <Tabs defaultValue="candidates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="voters">Voters</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {/* Candidates Management */}
        <TabsContent value="candidates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New Candidate
              </CardTitle>
              <CardDescription>
                Register a new candidate for the election
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidateName">Candidate Name</Label>
                    <Input
                      id="candidateName"
                      type="text"
                      placeholder="Enter candidate name"
                      value={candidateForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="party">Party/Coalition</Label>
                    <Input
                      id="party"
                      type="text"
                      placeholder="Enter party name"
                      value={candidateForm.party}
                      onChange={(e) => handleInputChange('party', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter candidate description and platform"
                    value={candidateForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="blockchain"
                  disabled={isAddingCandidate}
                >
                  {isAddingCandidate ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Candidate...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Candidate
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Candidates */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Candidates</CardTitle>
              <CardDescription>
                {candidates.length} candidates registered for the election
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">{candidate.party}</p>
                      <p className="text-xs text-muted-foreground mt-1">{candidate.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{candidate.voteCount}</div>
                      <div className="text-xs text-muted-foreground">votes</div>
                    </div>
                  </div>
                ))}
                {candidates.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No candidates registered yet. Add the first candidate above.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voters Management */}
        <TabsContent value="voters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registered Voters
              </CardTitle>
              <CardDescription>
                {voters.length} voters registered for the election
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {voters.map((voter) => (
                  <div key={voter.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{voter.name}</h4>
                      <p className="text-sm text-muted-foreground">{voter.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {voter.id.slice(0, 10)}...
                      </p>
                    </div>
                    <Badge variant={voter.hasVoted ? "default" : "secondary"}>
                      {voter.hasVoted ? "Voted" : "Not Voted"}
                    </Badge>
                  </div>
                ))}
                {voters.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No voters registered yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voting Control */}
        <TabsContent value="control" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Voting Control
              </CardTitle>
              <CardDescription>
                Start or stop the voting process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant="vote"
                  onClick={handleStartVoting}
                  disabled={isVotingActive || candidates.length === 0}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Voting
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleEndVoting}
                  disabled={!isVotingActive}
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Voting
                </Button>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Vote className="w-4 h-4" />
                  <span className="font-medium">Current Status</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isVotingActive 
                    ? "Voting is currently active. Voters can cast their ballots."
                    : "Voting is currently inactive. Start voting to allow ballot casting."
                  }
                </p>
                {candidates.length === 0 && (
                  <p className="text-sm text-warning mt-2">
                    ⚠️ At least one candidate must be registered before starting voting.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results & Analytics */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Election Results
                  </CardTitle>
                  <CardDescription>
                    Real-time results and blockchain audit trail
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={exportResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getResults().map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{candidate.voteCount}</div>
                      <div className="text-sm text-muted-foreground">
                        {totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                ))}
                {totalVotes === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No votes cast yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Blockchain Audit Trail
              </CardTitle>
              <CardDescription>
                Immutable record of all voting transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getBlockchainAudit().map((vote) => (
                  <div key={vote.id} className="p-3 bg-muted/50 rounded-lg text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">
                        Vote #{vote.id.slice(0, 8)}...
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(vote.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>Voter: {vote.voterId.slice(0, 10)}...</div>
                      <div>Candidate: {candidates.find(c => c.id === vote.candidateId)?.name}</div>
                      <div>Block: {vote.blockHash.slice(0, 10)}...</div>
                      <div>Transaction: {vote.transactionHash.slice(0, 10)}...</div>
                    </div>
                  </div>
                ))}
                {getBlockchainAudit().length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No votes recorded yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};