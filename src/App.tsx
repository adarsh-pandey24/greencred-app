import React, { useState } from 'react';
import { Leaf, Wallet, Gift, User, Plus, LayoutDashboard, LogOut, Camera } from 'lucide-react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { ActionsScreen } from './components/ActionsScreen';
import { ProofDashboard } from './components/ProofDashboard';
import { WalletScreen } from './components/WalletScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';

export interface EcoAction {
  id: string;
  category: string;
  action: string;
  tokens: number;
  timestamp: Date;
  verification?: {
    status: 'pending' | 'approved' | 'rejected';
    mediaUrl?: string;
    mediaType?: 'photo' | 'video';
    aiAnalysis?: string;
    verifiedAt?: Date;
  };
}

export interface UserData {
  totalTokens: number;
  level: number;
  actions: EcoAction[];
  redeemedRewards: string[];
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState<UserData>({
    totalTokens: 150,
    level: 3,
    actions: [
      {
        id: '1',
        category: 'Transport',
        action: 'Walked to work',
        tokens: 25,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        verification: {
          status: 'approved',
          mediaType: 'photo',
          aiAnalysis: 'Photo verified: Person walking outdoors on pedestrian path. Action confirmed.',
          verifiedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000)
        }
      },
      {
        id: '2',
        category: 'Energy',
        action: 'Used LED lights all day',
        tokens: 15,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        verification: {
          status: 'approved',
          mediaType: 'photo',
          aiAnalysis: 'Photo verified: LED light bulbs detected in use. Energy-efficient lighting confirmed.',
          verifiedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 3 * 60 * 1000)
        }
      },
      {
        id: '3',
        category: 'Waste',
        action: 'Recycled plastic bottles',
        tokens: 20,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        verification: {
          status: 'approved',
          mediaType: 'photo',
          aiAnalysis: 'Photo verified: Multiple plastic bottles placed in recycling bin. Proper recycling confirmed.',
          verifiedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 2 * 60 * 1000)
        }
      },
      {
        id: '4',
        category: 'Transport',
        action: 'Used public transport',
        tokens: 20,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        verification: {
          status: 'pending',
          mediaType: 'photo'
        }
      },
      {
        id: '5',
        category: 'Nature',
        action: 'Planted vegetables in garden',
        tokens: 35,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        verification: {
          status: 'rejected',
          mediaType: 'video',
          aiAnalysis: 'Video unclear: Unable to clearly identify planting activity. Please provide clearer documentation.',
          verifiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 10 * 60 * 1000)
        }
      }
    ],
    redeemedRewards: []
  });

  const addAction = (category: string, action: string, tokens: number, mediaFile?: File) => {
    const newAction: EcoAction = {
      id: Date.now().toString(),
      category,
      action,
      tokens,
      timestamp: new Date(),
      verification: mediaFile ? {
        status: 'pending',
        mediaType: mediaFile.type.startsWith('video/') ? 'video' : 'photo',
        mediaUrl: URL.createObjectURL(mediaFile)
      } : undefined
    };

    setUserData(prev => ({
      ...prev,
      actions: [newAction, ...prev.actions],
      // Don't add tokens immediately if verification is required
      totalTokens: mediaFile ? prev.totalTokens : prev.totalTokens + tokens,
      level: mediaFile ? prev.level : Math.floor((prev.totalTokens + tokens) / 100) + 1
    }));

    // Start AI verification if media was provided
    if (mediaFile) {
      verifyAction(newAction.id, mediaFile);
    }
  };

  const verifyAction = async (actionId: string, mediaFile: File) => {
    // Simulate AI verification delay
    setTimeout(() => {
      // Simulate AI analysis with random results for demo
      const isApproved = Math.random() > 0.2; // 80% approval rate
      const analysisMessages = {
        approved: [
          'Photo verified: Eco-friendly action confirmed through image analysis.',
          'Video analysis complete: Sustainable behavior detected and validated.',
          'AI verification successful: Action matches environmental criteria.',
          'Image recognition confirmed: Valid eco-friendly activity identified.',
          'Visual verification complete: Action aligns with sustainability standards.'
        ],
        rejected: [
          'Photo unclear: Unable to verify eco-friendly action. Please retake.',
          'Image analysis inconclusive: Action not clearly visible in media.',
          'Verification failed: Media does not match claimed eco-friendly activity.',
          'AI analysis incomplete: Please provide clearer documentation.',
          'Visual verification unsuccessful: Action cannot be confirmed.'
        ]
      };

      const messages = isApproved ? analysisMessages.approved : analysisMessages.rejected;
      const aiAnalysis = messages[Math.floor(Math.random() * messages.length)];

      setUserData(prev => {
        const updatedActions = prev.actions.map(action => {
          if (action.id === actionId) {
            const updatedAction = {
              ...action,
              verification: {
                ...action.verification!,
                status: isApproved ? 'approved' as const : 'rejected' as const,
                aiAnalysis,
                verifiedAt: new Date()
              }
            };
            return updatedAction;
          }
          return action;
        });

        // Award tokens if approved
        const action = prev.actions.find(a => a.id === actionId);
        const tokensToAdd = isApproved && action ? action.tokens : 0;

        return {
          ...prev,
          actions: updatedActions,
          totalTokens: prev.totalTokens + tokensToAdd,
          level: Math.floor((prev.totalTokens + tokensToAdd) / 100) + 1
        };
      });
    }, 3000 + Math.random() * 2000); // 3-5 second verification time
  };

  const redeemReward = (rewardId: string, cost: number) => {
    if (userData.totalTokens >= cost) {
      setUserData(prev => ({
        ...prev,
        totalTokens: prev.totalTokens - cost,
        redeemedRewards: [...prev.redeemedRewards, rewardId]
      }));
      return true;
    }
    return false;
  };

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Demo validation
      if (email === 'demo@greencred.com' && password === 'demo123') {
        setCurrentUser(email);
        setIsAuthenticated(true);
      } else {
        // For demo, accept any valid email format
        if (email.includes('@') && password.length >= 6) {
          setCurrentUser(email);
          setIsAuthenticated(true);
        }
      }
      setLoginLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setActiveTab('dashboard');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userData={userData} userName={currentUser} onAddAction={addAction} />;
      case 'proof':
        return <ProofDashboard userData={userData} onAddAction={addAction} />;
      case 'actions':
        return <ActionsScreen userData={userData} onAddAction={addAction} />;
      case 'wallet':
        return <WalletScreen userData={userData} />;
      case 'rewards':
        return <RewardsScreen userData={userData} onRedeemReward={redeemReward} />;
      case 'profile':
        return <ProfileScreen userData={userData} onLogout={handleLogout} />;
      default:
        return <Dashboard userData={userData} userName={currentUser} onAddAction={addAction} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'proof', icon: Camera, label: 'Proof' },
    { id: 'actions', icon: Leaf, label: 'Actions' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} loading={loginLoading} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header with Logout */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-semibold">Greencred</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border">
        <nav className="flex items-center justify-around py-1 px-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors text-xs ${
                activeTab === id 
                  ? 'text-primary bg-accent' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </nav>
      </div>
      <Toaster />
    </div>
  );
}