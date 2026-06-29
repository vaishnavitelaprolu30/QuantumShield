import React, { useState } from 'react';
import { BlockchainProvider } from '@/components/BlockchainProvider';
import { Navigation } from '@/components/Navigation';
import { AuthPage } from '@/components/AuthPage';
import { VotingDashboard } from '@/components/VotingDashboard';
import { ResultsPage } from '@/components/ResultsPage';
import { AdminPanel } from '@/components/AdminPanel';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [currentView, setCurrentView] = useState('auth');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'auth':
        return <AuthPage />;
      case 'vote':
        return <VotingDashboard />;
      case 'results':
        return <ResultsPage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <AuthPage />;
    }
  };

  return (
    <BlockchainProvider>
      <div className="min-h-screen bg-background">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <main className="container mx-auto px-4 py-8">
          {renderCurrentView()}
        </main>
        <Toaster />
      </div>
    </BlockchainProvider>
  );
};

export default Index;
