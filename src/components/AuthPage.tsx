import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBlockchain } from '@/components/BlockchainProvider';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  UserPlus, 
  Mail, 
  User, 
  Shield, 
  Key, 
  Loader2,
  CheckCircle
} from 'lucide-react';

interface RegistrationForm {
  name: string;
  email: string;
}

export const AuthPage: React.FC = () => {
  const { connectWallet, registerVoter, isConnected, currentAccount, voters } = useBlockchain();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: '',
    email: ''
  });

  const isUserRegistered = currentAccount && voters.some(v => v.id === currentAccount);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected!",
        description: "Successfully connected to blockchain network.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRegisterVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationForm.name || !registrationForm.email) {
      toast({
        title: "Invalid Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      const success = await registerVoter(registrationForm);
      if (success) {
        toast({
          title: "Registration Successful!",
          description: "You are now registered to vote in the election.",
        });
        setRegistrationForm({ name: '', email: '' });
      } else {
        toast({
          title: "Registration Failed",
          description: "Unable to register. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationForm, value: string) => {
    setRegistrationForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Secure Voting
            </h1>
            <p className="text-muted-foreground">
              Blockchain-powered student elections
            </p>
          </div>
        </div>

        {/* Authentication Tabs */}
        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Connect
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Register
            </TabsTrigger>
          </TabsList>

          {/* Wallet Connection Tab */}
          <TabsContent value="connect" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </CardTitle>
                <CardDescription>
                  Connect your Web3 wallet to access the voting system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <Button
                    variant="blockchain"
                    className="w-full"
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-md">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-sm font-medium">Wallet Connected</span>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Account Address</Label>
                      <div className="p-2 bg-muted rounded-md">
                        <code className="text-xs break-all">{currentAccount}</code>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Key className="w-4 h-4" />
                    <span>Secured by blockchain technology</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Your private keys remain secure</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voter Registration Tab */}
          <TabsContent value="register" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Voter Registration
                </CardTitle>
                <CardDescription>
                  Register as a verified voter for the student election
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="text-center py-6">
                    <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Please connect your wallet first to register as a voter
                    </p>
                  </div>
                ) : isUserRegistered ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-md">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-sm font-medium">Already Registered</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You are already registered as a voter. You can now participate in the election.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterVoter} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={registrationForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={registrationForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="vote"
                      className="w-full"
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Register to Vote
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-muted-foreground">
                      By registering, you agree to participate in a secure, transparent voting process.
                      Your registration will be recorded on the blockchain for verification.
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 text-center">
          <div className="space-y-2">
            <Shield className="mx-auto h-6 w-6 text-blockchain-primary" />
            <h3 className="text-sm font-medium">Secure & Transparent</h3>
            <p className="text-xs text-muted-foreground">
              Every vote is recorded on the blockchain for complete transparency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};