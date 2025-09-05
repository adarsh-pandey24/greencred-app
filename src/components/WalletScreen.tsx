import React from 'react';
import { Coins, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { UserData } from '../App';

interface WalletScreenProps {
  userData: UserData;
}

export function WalletScreen({ userData }: WalletScreenProps) {
  const nextLevelTokens = userData.level * 100;
  const currentLevelProgress = userData.totalTokens % 100;
  const progressPercentage = (currentLevelProgress / 100) * 100;

  const todayActions = userData.actions.filter(action => {
    const today = new Date();
    const actionDate = new Date(action.timestamp);
    return actionDate.toDateString() === today.toDateString();
  });

  const todayTokens = todayActions.reduce((sum, action) => sum + action.tokens, 0);

  const weeklyActions = userData.actions.filter(action => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return action.timestamp >= weekAgo;
  });

  const weeklyTokens = weeklyActions.reduce((sum, action) => sum + action.tokens, 0);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const achievements = [
    { name: 'First Steps', description: 'Logged your first eco action', unlocked: userData.actions.length > 0 },
    { name: 'Green Warrior', description: 'Reached Level 3', unlocked: userData.level >= 3 },
    { name: 'Century Club', description: 'Earned 100+ tokens', unlocked: userData.totalTokens >= 100 },
    { name: 'Daily Hero', description: 'Logged 3 actions in one day', unlocked: todayActions.length >= 3 },
    { name: 'Eco Master', description: 'Reached Level 5', unlocked: userData.level >= 5 }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Digital Wallet</h1>
        <p className="text-muted-foreground">Track your eco rewards and progress</p>
      </div>

      {/* Main Balance Card */}
      <Card className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Total Balance</p>
                <div className="flex items-center gap-2">
                  <Coins className="w-8 h-8" />
                  <span className="text-4xl font-bold">{userData.totalTokens}</span>
                </div>
                <p className="text-emerald-100 text-sm">EcoTokens</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-full p-3">
                  <Award className="w-8 h-8" />
                </div>
                <p className="mt-2 text-emerald-100 text-sm">Level {userData.level}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-emerald-100">
                <span>Progress to Level {userData.level + 1}</span>
                <span>{currentLevelProgress}/100</span>
              </div>
              <Progress value={progressPercentage} className="bg-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{todayTokens}</p>
            <p className="text-sm text-muted-foreground">Today's Tokens</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{weeklyTokens}</p>
            <p className="text-sm text-muted-foreground">Weekly Tokens</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userData.actions.slice(0, 8).map((action) => (
            <div key={action.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-sm">{action.action}</p>
                <p className="text-xs text-muted-foreground">
                  {action.category} • {formatTimeAgo(action.timestamp)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-medium text-sm">+{action.tokens}</p>
                <p className="text-xs text-muted-foreground">tokens</p>
              </div>
            </div>
          ))}
          
          {userData.actions.length === 0 && (
            <div className="text-center py-8">
              <Coins className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground">Start logging eco actions to earn tokens!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                achievement.unlocked ? 'bg-yellow-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  Unlocked
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}