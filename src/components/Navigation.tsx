import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlockchain } from '@/components/BlockchainProvider';
import { 
  Shield, 
  Vote, 
  Users, 
  BarChart3, 
  Settings,
  Wallet,
  LogOut
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { isConnected, currentAccount, isVotingActive, totalVotes } = useBlockchain();

  const navigationItems = [
    {
      id: 'auth',
      label: 'Authentication',
      icon: Wallet,
      description: 'Connect wallet & register'
    },
    {
      id: 'vote',
      label: 'Vote',
      icon: Vote,
      description: 'Cast your ballot',
      requiresAuth: true
    },
    {
      id: 'results',
      label: 'Results',
      icon: BarChart3,
      description: 'View live results'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Settings,
      description: 'Election management',
      requiresAuth: true
    }
  ];

  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SecureVote</h1>
              <p className="text-xs text-muted-foreground">Blockchain Voting System</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isDisabled = item.requiresAuth && !isConnected;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  disabled={isDisabled}
                  className="relative"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {item.id === 'vote' && isVotingActive && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                      !
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* User Status */}
          <div className="flex items-center gap-3">
            {/* Voting Status */}
            <div className="flex items-center gap-2">
              <Badge variant={isVotingActive ? "default" : "secondary"} className="text-xs">
                {isVotingActive ? "Voting Active" : "Voting Closed"}
              </Badge>
              {totalVotes > 0 && (
                <Badge variant="outline" className="text-xs">
                  {totalVotes} votes
                </Badge>
              )}
            </div>

            {/* Connection Status */}
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-md">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs font-medium">Connected</span>
                <code className="text-xs bg-background/50 px-1 rounded">
                  {currentAccount?.slice(0, 6)}...{currentAccount?.slice(-4)}
                </code>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border rounded-md">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                <span className="text-xs">Not Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};