import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Upload,
  Eye,
  Zap,
  TrendingUp,
  Award,
  Plus,
  FileImage,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MediaCapture } from './MediaCapture';
import { VerificationCard } from './VerificationCard';
import { UserData, EcoAction } from '../App';
import { toast } from 'sonner@2.0.3';

interface ProofDashboardProps {
  userData: UserData;
  onAddAction: (category: string, action: string, tokens: number, mediaFile?: File) => void;
}

export function ProofDashboard({ userData, onAddAction }: ProofDashboardProps) {
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<{
    category: string;
    action: string;
    tokens: number;
  } | null>(null);

  // Calculate verification statistics
  const pendingActions = userData.actions.filter(action => action.verification?.status === 'pending');
  const approvedActions = userData.actions.filter(action => action.verification?.status === 'approved');
  const rejectedActions = userData.actions.filter(action => action.verification?.status === 'rejected');
  const verifiedActions = userData.actions.filter(action => action.verification);
  
  const verificationRate = userData.actions.length > 0 
    ? Math.round((approvedActions.length / userData.actions.length) * 100) 
    : 0;

  const todayVerifications = verifiedActions.filter(action => {
    const today = new Date();
    const actionDate = new Date(action.timestamp);
    return actionDate.toDateString() === today.toDateString();
  });

  // Quick action suggestions for proof submission
  const quickActions = [
    { category: 'Transport', action: 'Walked/Biked today', tokens: 25, icon: '🚶' },
    { category: 'Waste', action: 'Recycled items', tokens: 20, icon: '♻️' },
    { category: 'Energy', action: 'Used renewable energy', tokens: 30, icon: '💡' },
    { category: 'Nature', action: 'Planted something', tokens: 40, icon: '🌱' },
  ];

  const handleQuickAction = (category: string, action: string, tokens: number) => {
    setSelectedQuickAction({ category, action, tokens });
    setShowQuickCapture(true);
  };

  const handleQuickProofSubmit = (file: File) => {
    if (selectedQuickAction) {
      onAddAction(selectedQuickAction.category, selectedQuickAction.action, selectedQuickAction.tokens, file);
      toast.success('Proof submitted for verification!');
      setShowQuickCapture(false);
      setSelectedQuickAction(null);
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  if (showQuickCapture && selectedQuickAction) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQuickCapture(false)}
          >
            ← Back
          </Button>
          <h2 className="text-lg font-semibold">Submit Proof: {selectedQuickAction.action}</h2>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">AI Verification Required</p>
                <p className="text-sm text-blue-700">
                  Take a photo or video to prove your eco-friendly action
                </p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                +{selectedQuickAction.tokens} tokens
              </Badge>
            </div>
          </CardContent>
        </Card>

        <MediaCapture
          onMediaCapture={handleQuickProofSubmit}
          onCancel={() => setShowQuickCapture(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Proof Dashboard</h1>
        <p className="text-muted-foreground">Submit and track your eco-action verifications</p>
      </div>

      {/* Verification Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Verification Rate</p>
                <p className="text-2xl font-bold">{verificationRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-100" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-100">{approvedActions.length} verified actions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pending Review</p>
                <p className="text-2xl font-bold">{pendingActions.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-100" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-orange-100">AI analyzing proofs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Proof Submission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Proof Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col gap-2 p-4"
                onClick={() => handleQuickAction(action.category, action.action, action.tokens)}
              >
                <div className="text-2xl">{action.icon}</div>
                <div className="text-center">
                  <p className="text-xs font-medium">{action.action}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    +{action.tokens}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending ({pendingActions.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Approved ({approvedActions.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Rejected ({rejectedActions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-3 mt-4">
              {pendingActions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No actions pending verification</p>
                  <p className="text-sm">Submit proof above to get started!</p>
                </div>
              ) : (
                pendingActions.map((action) => (
                  <div key={action.id}>
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {action.verification?.mediaType === 'video' ? (
                                <Play className="w-4 h-4 text-blue-500" />
                              ) : (
                                <FileImage className="w-4 h-4 text-green-500" />
                              )}
                              <p className="font-medium text-sm">{action.action}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {action.category} • {formatTimeAgo(action.timestamp)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                            Analyzing...
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <VerificationCard action={action} />
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-3 mt-4">
              {approvedActions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No verified actions yet</p>
                  <p className="text-sm">Submit your first proof to earn verified tokens!</p>
                </div>
              ) : (
                approvedActions.slice(0, 5).map((action) => (
                  <div key={action.id}>
                    <Card className="border-green-200">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {action.verification?.mediaType === 'video' ? (
                                <Play className="w-4 h-4 text-blue-500" />
                              ) : (
                                <FileImage className="w-4 h-4 text-green-500" />
                              )}
                              <p className="font-medium text-sm">{action.action}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {action.category} • Verified {formatTimeAgo(action.verification?.verifiedAt || action.timestamp)}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            +{action.tokens} earned
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <VerificationCard action={action} />
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-3 mt-4">
              {rejectedActions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No rejected verifications</p>
                  <p className="text-sm">Keep up the great work!</p>
                </div>
              ) : (
                rejectedActions.map((action) => (
                  <div key={action.id}>
                    <Card className="border-red-200">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {action.verification?.mediaType === 'video' ? (
                                <Play className="w-4 h-4 text-blue-500" />
                              ) : (
                                <FileImage className="w-4 h-4 text-green-500" />
                              )}
                              <p className="font-medium text-sm">{action.action}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {action.category} • {formatTimeAgo(action.timestamp)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-red-600 border-red-200">
                            Rejected
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <VerificationCard action={action} />
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Daily Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Proofs submitted today</span>
              <span className="font-medium">{todayVerifications.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Verification rate</span>
              <span className="font-medium">{verificationRate}%</span>
            </div>
            <Progress value={verificationRate} className="h-2" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>
                {verificationRate >= 80 ? "Excellent verification rate!" : 
                 verificationRate >= 60 ? "Good verification rate!" : 
                 "Submit more quality proofs to improve your rate"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}