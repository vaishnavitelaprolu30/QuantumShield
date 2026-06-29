import React, { createContext, useContext, useState, useCallback } from 'react';

// Simulated blockchain types
interface Vote {
  id: string;
  candidateId: string;
  voterId: string;
  timestamp: number;
  blockHash: string;
  transactionHash: string;
}

interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  voteCount: number;
}

interface Voter {
  id: string;
  name: string;
  email: string;
  hasVoted: boolean;
  registrationHash: string;
}

interface BlockchainState {
  isConnected: boolean;
  currentAccount: string | null;
  votes: Vote[];
  candidates: Candidate[];
  voters: Voter[];
  isVotingActive: boolean;
  totalVotes: number;
}

interface BlockchainContextType extends BlockchainState {
  connectWallet: () => Promise<void>;
  castVote: (candidateId: string, voterId: string) => Promise<boolean>;
  registerVoter: (voter: Omit<Voter, 'id' | 'hasVoted' | 'registrationHash'>) => Promise<boolean>;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'voteCount'>) => Promise<boolean>;
  startVoting: () => void;
  endVoting: () => void;
  getResults: () => Candidate[];
  getBlockchainAudit: () => Vote[];
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// Mock candidates for demo
const initialCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    party: 'Progressive Party',
    description: 'Advocates for digital transformation and student welfare',
    voteCount: 0
  },
  {
    id: '2',
    name: 'Bob Smith',
    party: 'Innovation Alliance',
    description: 'Focuses on sustainability and technological advancement',
    voteCount: 0
  },
  {
    id: '3',
    name: 'Carol Davis',
    party: 'Unity Coalition',
    description: 'Promotes inclusivity and academic excellence',
    voteCount: 0
  }
];

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BlockchainState>({
    isConnected: false,
    currentAccount: null,
    votes: [],
    candidates: initialCandidates,
    voters: [],
    isVotingActive: false,
    totalVotes: 0
  });

  const generateHash = (data: string): string => {
    // Simple hash simulation for demo
    return `0x${Math.random().toString(36).substr(2, 9)}${Date.now().toString(36)}`;
  };

  const connectWallet = useCallback(async () => {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockAccount = `0x${Math.random().toString(36).substr(2, 40)}`;
    
    setState(prev => ({
      ...prev,
      isConnected: true,
      currentAccount: mockAccount
    }));
  }, []);

  const castVote = useCallback(async (candidateId: string, voterId: string): Promise<boolean> => {
    if (!state.isConnected || !state.isVotingActive) return false;

    // Check if voter has already voted
    const voter = state.voters.find(v => v.id === voterId);
    if (!voter || voter.hasVoted) return false;

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const vote: Vote = {
      id: generateHash('vote'),
      candidateId,
      voterId,
      timestamp: Date.now(),
      blockHash: generateHash('block'),
      transactionHash: generateHash('transaction')
    };

    setState(prev => ({
      ...prev,
      votes: [...prev.votes, vote],
      candidates: prev.candidates.map(c => 
        c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
      ),
      voters: prev.voters.map(v => 
        v.id === voterId ? { ...v, hasVoted: true } : v
      ),
      totalVotes: prev.totalVotes + 1
    }));

    return true;
  }, [state.isConnected, state.isVotingActive, state.voters]);

  const registerVoter = useCallback(async (voterData: Omit<Voter, 'id' | 'hasVoted' | 'registrationHash'>): Promise<boolean> => {
    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 1000));

    const voter: Voter = {
      ...voterData,
      id: generateHash('voter'),
      hasVoted: false,
      registrationHash: generateHash('registration')
    };

    setState(prev => ({
      ...prev,
      voters: [...prev.voters, voter]
    }));

    return true;
  }, []);

  const addCandidate = useCallback(async (candidateData: Omit<Candidate, 'id' | 'voteCount'>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const candidate: Candidate = {
      ...candidateData,
      id: generateHash('candidate'),
      voteCount: 0
    };

    setState(prev => ({
      ...prev,
      candidates: [...prev.candidates, candidate]
    }));

    return true;
  }, []);

  const startVoting = useCallback(() => {
    setState(prev => ({ ...prev, isVotingActive: true }));
  }, []);

  const endVoting = useCallback(() => {
    setState(prev => ({ ...prev, isVotingActive: false }));
  }, []);

  const getResults = useCallback(() => {
    return [...state.candidates].sort((a, b) => b.voteCount - a.voteCount);
  }, [state.candidates]);

  const getBlockchainAudit = useCallback(() => {
    return state.votes;
  }, [state.votes]);

  const value: BlockchainContextType = {
    ...state,
    connectWallet,
    castVote,
    registerVoter,
    addCandidate,
    startVoting,
    endVoting,
    getResults,
    getBlockchainAudit
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};