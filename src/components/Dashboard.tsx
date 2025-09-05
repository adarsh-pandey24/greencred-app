import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Leaf, 
  Award, 
  Calendar,
  Target,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Shield,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { QuickProofWidget } from './QuickProofWidget';
import { UserData } from '../App';

interface DashboardProps {
  userData: UserData;
  userName: string;
  onAddAction?: (category: string, action: string, tokens: number, mediaFile?: File) => void;
}

export function Dashboard({ userData, userName, onAddAction }: DashboardProps) {
  // Calculate statistics
  const todayActions = userData.actions.filter(action => {
    const today = new Date();
    const actionDate = new Date(action.timestamp);
    return actionDate.toDateString() === today.toDateString();
  });

  const weeklyActions = userData.actions.filter(action => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return action.timestamp >= weekAgo;
  });

  const monthlyActions = userData.actions.filter(action => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return action.timestamp >= monthAgo;
  });

  const todayTokens = todayActions.reduce((sum, action) => sum + action.tokens, 0);
  const weeklyTokens = weeklyActions.reduce((sum, action) => sum + action.tokens, 0);
  const monthlyTokens = monthlyActions.reduce((sum, action) => sum + action.tokens, 0);

  const currentLevelProgress = userData.totalTokens % 100;
  const progressPercentage = (currentLevelProgress / 100) * 100;

  // Calculate verification statistics
  const verifiedActions = userData.actions.filter(action => action.verification?.status === 'approved');
  const pendingActions = userData.actions.filter(action => action.verification?.status === 'pending');
  const rejectedActions = userData.actions.filter(action => action.verification?.status === 'rejected');
  const unverifiedActions = userData.actions.filter(action => !action.verification);
  
  const verificationRate = userData.actions.length > 0 
    ? Math.round((verifiedActions.length / userData.actions.length) * 100) 
    : 0;

  // Mock data for additional dashboard metrics
  const communityStats = {
    totalUsers: 12847,
    totalActionsLogged: 156293,
    carbonSaved: 2847, // kg CO2
    treesPlanted: 1245
  };

  const weeklyGrowth = 15.3; // Mock percentage
  const monthlyGrowth = 8.7; // Mock percentage

  const topCategories = Object.entries(
    userData.actions.reduce((acc, action) => {
      acc[action.category] = (acc[action.category] || 0) + action.tokens;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Welcome back, {userName.split('@')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your eco-impact dashboard for today
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Tokens</p>
                <p className="text-2xl font-bold">{userData.totalTokens}</p>
              </div>
              <Coins className="w-8 h-8 text-green-100" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp className="w-3 h-3 text-green-100" />
              <span className="text-xs text-green-100">+{todayTokens} today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Level</p>
                <p className="text-2xl font-bold">{userData.level}</p>
              </div>
              <Award className="w-8 h-8 text-blue-100" />
            </div>
            <div className="mt-2">
              <Progress value={progressPercentage} className="bg-white/20 h-1" />
              <span className="text-xs text-blue-100">{currentLevelProgress}/100 to next</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Verification Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            AI Verification Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{verificationRate}%</p>
              <p className="text-sm text-muted-foreground">Verification Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{verifiedActions.length}</p>
              <p className="text-sm text-muted-foreground">AI Verified</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">{verifiedActions.length}</span>
              <span className="text-xs text-muted-foreground">Verified</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium">{pendingActions.length}</span>
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium">{rejectedActions.length}</span>
              <span className="text-xs text-muted-foreground">Rejected</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Leaf className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium">{unverifiedActions.length}</span>
              <span className="text-xs text-muted-foreground">Manual</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{todayActions.length}</p>
              <p className="text-sm text-muted-foreground">Today</p>
              <Badge variant="outline" className="text-xs mt-1">
                {todayTokens} tokens
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{weeklyActions.length}</p>
              <p className="text-sm text-muted-foreground">This Week</p>
              <Badge variant="outline" className="text-xs mt-1">
                {weeklyTokens} tokens
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{monthlyActions.length}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
              <Badge variant="outline" className="text-xs mt-1">
                {monthlyTokens} tokens
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Top Impact Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCategories.map(([category, tokens], index) => {
              const percentage = (tokens / userData.totalTokens) * 100;
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500'];
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">{tokens} tokens</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${colors[index]} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Community Impact */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Users className="w-5 h-5" />
            Community Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">
              {formatNumber(communityStats.totalUsers)}
            </p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">
              {formatNumber(communityStats.totalActionsLogged)}
            </p>
            <p className="text-sm text-muted-foreground">Actions Logged</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">
              {formatNumber(communityStats.carbonSaved)}kg
            </p>
            <p className="text-sm text-muted-foreground">CO₂ Saved</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">
              {formatNumber(communityStats.treesPlanted)}
            </p>
            <p className="text-sm text-muted-foreground">Trees Planted</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Actions Preview */}
      {userData.actions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userData.actions.slice(0, 3).map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{action.action}</p>
                  <p className="text-xs text-muted-foreground">{action.category}</p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  +{action.tokens}
                </Badge>
              </div>
            ))}
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                View all in the Actions tab
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-lg font-bold text-green-600">+{weeklyGrowth}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Weekly Growth</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-lg font-bold text-blue-600">+{monthlyGrowth}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Monthly Growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Proof Submission */}
      {onAddAction && (
        <QuickProofWidget onAddAction={onAddAction} />
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="text-4xl mb-2">🚀</div>
          <h3 className="font-semibold mb-1">Ready for more eco-actions?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Log new sustainable activities to earn more tokens!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}