import React, { useState } from 'react';
import { Plus, Car, Zap, Recycle, Droplets, TreePine, Coins, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { UserData } from '../App';
import { MediaCapture } from './MediaCapture';
import { VerificationCard } from './VerificationCard';
import { toast } from 'sonner@2.0.3';

interface ActionsScreenProps {
  userData: UserData;
  onAddAction: (category: string, action: string, tokens: number, mediaFile?: File) => void;
}

const ecoActions = [
  {
    category: 'Transport',
    icon: Car,
    color: 'bg-blue-100 text-blue-700',
    actions: [
      { name: 'Walked to work', tokens: 25 },
      { name: 'Used public transport', tokens: 20 },
      { name: 'Biked instead of driving', tokens: 30 },
      { name: 'Carpooled', tokens: 15 }
    ]
  },
  {
    category: 'Energy',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-700',
    actions: [
      { name: 'Used LED lights all day', tokens: 15 },
      { name: 'Unplugged devices when not in use', tokens: 10 },
      { name: 'Used natural light instead of artificial', tokens: 12 },
      { name: 'Set thermostat to eco-mode', tokens: 18 }
    ]
  },
  {
    category: 'Waste',
    icon: Recycle,
    color: 'bg-green-100 text-green-700',
    actions: [
      { name: 'Recycled plastic bottles', tokens: 20 },
      { name: 'Composted organic waste', tokens: 25 },
      { name: 'Used reusable bags', tokens: 10 },
      { name: 'Avoided single-use plastics', tokens: 15 }
    ]
  },
  {
    category: 'Water',
    icon: Droplets,
    color: 'bg-cyan-100 text-cyan-700',
    actions: [
      { name: 'Took a shorter shower', tokens: 15 },
      { name: 'Fixed a leaky faucet', tokens: 30 },
      { name: 'Collected rainwater', tokens: 20 },
      { name: 'Used water-efficient appliances', tokens: 25 }
    ]
  },
  {
    category: 'Nature',
    icon: TreePine,
    color: 'bg-emerald-100 text-emerald-700',
    actions: [
      { name: 'Planted a tree', tokens: 50 },
      { name: 'Started a garden', tokens: 35 },
      { name: 'Participated in cleanup', tokens: 40 },
      { name: 'Fed birds or wildlife', tokens: 15 }
    ]
  }
];

export function ActionsScreen({ userData, onAddAction }: ActionsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<{ name: string; tokens: number } | null>(null);
  const [showMediaCapture, setShowMediaCapture] = useState(false);

  const handleActionClick = (category: string, action: string, tokens: number) => {
    setSelectedAction({ name: action, tokens });
    setShowMediaCapture(true);
  };

  const handleLogWithoutVerification = () => {
    if (selectedAction && selectedCategory) {
      onAddAction(selectedCategory, selectedAction.name, selectedAction.tokens);
      toast.success(`${selectedAction.name} logged successfully!`);
      resetForm();
    }
  };

  const handleMediaCapture = (file: File) => {
    if (selectedAction && selectedCategory) {
      onAddAction(selectedCategory, selectedAction.name, selectedAction.tokens, file);
      toast.success('Action submitted for AI verification!');
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedAction(null);
    setShowMediaCapture(false);
    setSelectedCategory(null);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Log Eco Actions</h1>
        <p className="text-muted-foreground">Track your sustainable choices and earn tokens!</p>
      </div>

      {/* Token Display */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Your Balance</p>
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6" />
                <span className="text-2xl font-bold">{userData.totalTokens}</span>
                <span className="text-green-100">tokens</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-100">Level</p>
              <p className="text-3xl font-bold">{userData.level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Categories */}
      {!selectedCategory ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose a Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {ecoActions.map(({ category, icon: Icon, color }) => (
              <Button
                key={category}
                variant="outline"
                className="h-20 flex flex-col gap-2 p-4"
                onClick={() => setSelectedCategory(category)}
              >
                <div className={`p-2 rounded-full ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm">{category}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : showMediaCapture ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMediaCapture(false)}
            >
              ← Back
            </Button>
            <h2 className="text-lg font-semibold">Verify: {selectedAction?.name}</h2>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">AI Verification Available</p>
                  <p className="text-sm text-blue-700">
                    Verify your action with photo/video to earn full tokens instantly!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MediaCapture
            onMediaCapture={handleMediaCapture}
            onCancel={() => setShowMediaCapture(false)}
          />

          <div className="space-y-3">
            <div className="text-center text-sm text-muted-foreground">
              Or log without verification
            </div>
            <Button
              variant="outline"
              onClick={handleLogWithoutVerification}
              className="w-full"
            >
              Log Action ({selectedAction?.tokens} tokens)
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              ← Back
            </Button>
            <h2 className="text-lg font-semibold">{selectedCategory} Actions</h2>
          </div>
          
          <div className="space-y-2">
            {ecoActions
              .find(cat => cat.category === selectedCategory)
              ?.actions.map(({ name, tokens }) => (
                <Card key={name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between"
                      onClick={() => handleActionClick(selectedCategory, name, tokens)}
                    >
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">Tap to log this action</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        +{tokens} tokens
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Recent Actions */}
      {userData.actions.length > 0 && !selectedCategory && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Actions</h2>
          <div className="space-y-2">
            {userData.actions.slice(0, 5).map((action) => (
              <div key={action.id}>
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{action.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.category} • {formatTimeAgo(action.timestamp)}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          action.verification?.status === 'pending' 
                            ? "text-yellow-600 border-yellow-200" 
                            : action.verification?.status === 'rejected'
                            ? "text-red-600 border-red-200"
                            : "text-green-600 border-green-200"
                        }
                      >
                        {action.verification?.status === 'pending' ? 'Pending' : `+${action.tokens}`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                <VerificationCard action={action} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}