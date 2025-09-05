import React from 'react';
import { User, Award, BarChart3, Calendar, Leaf, Target, Settings, Share, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { UserData } from '../App';

interface ProfileScreenProps {
  userData: UserData;
  onLogout?: () => void;
}

export function ProfileScreen({ userData, onLogout }: ProfileScreenProps) {
  const totalActions = userData.actions.length;
  const categoriesUsed = [...new Set(userData.actions.map(action => action.category))].length;
  
  const categoryStats = userData.actions.reduce((acc, action) => {
    acc[action.category] = (acc[action.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];

  const joinDate = new Date('2024-01-15'); // Mock join date
  const daysSinceJoined = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

  const streakDays = 5; // Mock streak
  const weeklyGoal = 50; // Mock weekly goal
  const weeklyProgress = userData.actions
    .filter(action => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return action.timestamp >= weekAgo;
    })
    .reduce((sum, action) => sum + action.tokens, 0);

  const achievements = [
    { 
      name: 'First Steps', 
      description: 'Logged your first eco action', 
      unlocked: totalActions > 0,
      icon: '🌱'
    },
    { 
      name: 'Green Warrior', 
      description: 'Reached Level 3', 
      unlocked: userData.level >= 3,
      icon: '⚡'
    },
    { 
      name: 'Century Club', 
      description: 'Earned 100+ tokens', 
      unlocked: userData.totalTokens >= 100,
      icon: '💯'
    },
    { 
      name: 'Consistent Champion', 
      description: 'Maintained a 5-day streak', 
      unlocked: streakDays >= 5,
      icon: '🔥'
    },
    { 
      name: 'Category Explorer', 
      description: 'Tried actions from 3+ categories', 
      unlocked: categoriesUsed >= 3,
      icon: '🗺️'
    },
    { 
      name: 'Eco Master', 
      description: 'Reached Level 5', 
      unlocked: userData.level >= 5,
      icon: '👑'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Avatar className="w-20 h-20 mx-auto">
          <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-600 text-white text-2xl">
            EJ
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-2xl font-bold">Eco Journey</h1>
          <p className="text-muted-foreground">Level {userData.level} Green Champion</p>
          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
            Member for {daysSinceJoined} days
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Leaf className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{totalActions}</p>
            <p className="text-sm text-muted-foreground">Total Actions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Streak & Weekly Goal */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🔥</div>
                <div>
                  <p className="font-semibold">Current Streak</p>
                  <p className="text-sm text-muted-foreground">{streakDays} days strong!</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-500">{streakDays}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Weekly Goal</span>
                </div>
                <span className="text-sm text-muted-foreground">{weeklyProgress}/{weeklyGoal} tokens</span>
              </div>
              <Progress value={(weeklyProgress / weeklyGoal) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Category */}
      {topCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Most Active Category</p>
              <p className="font-semibold">{topCategory[0]}</p>
              <p className="text-sm text-muted-foreground">{topCategory[1]} actions logged</p>
            </div>
            
            <div className="space-y-2">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between text-sm">
                  <span>{category}</span>
                  <span className="text-muted-foreground">{count} actions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
              achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-muted/50'
            }`}>
              <div className="text-2xl">{achievement.unlocked ? achievement.icon : '🔒'}</div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  Unlocked
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start" size="lg">
          <Share className="w-5 h-5 mr-3" />
          Share Your Progress
        </Button>
        
        <Button variant="outline" className="w-full justify-start" size="lg">
          <Settings className="w-5 h-5 mr-3" />
          App Settings
        </Button>
        
        <Button variant="outline" className="w-full justify-start" size="lg">
          <Calendar className="w-5 h-5 mr-3" />
          View Full History
        </Button>

        {onLogout && (
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
            size="lg"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        )}
      </div>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="text-4xl mb-2">🌍</div>
          <h3 className="font-semibold mb-1">Keep Making a Difference!</h3>
          <p className="text-sm text-muted-foreground">
            Every action counts towards a sustainable future.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}