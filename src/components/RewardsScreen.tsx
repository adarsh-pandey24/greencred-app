import React, { useState } from 'react';
import { Gift, Coins, Star, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { UserData } from '../App';
import { toast } from 'sonner@2.0.3';

interface RewardsScreenProps {
  userData: UserData;
  onRedeemReward: (rewardId: string, cost: number) => boolean;
}

const rewards = [
  {
    id: 'coffee-discount',
    title: 'Free Coffee',
    description: 'Get a free coffee at participating local cafes',
    cost: 50,
    category: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1620219729343-f5b6d109aa4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBkcmlua3xlbnwxfHx8fDE3NTY4MjQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    popular: true
  },
  {
    id: 'plant-kit',
    title: 'Mini Plant Kit',
    description: 'Small succulent plant with pot and care instructions',
    cost: 120,
    category: 'Eco Products',
    image: 'https://images.unsplash.com/photo-1550642088-04d7e6a461b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1Y2N1bGVudCUyMGdyZWVufGVufDF8fHx8MTc1Njg5NzI5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    popular: false
  },
  {
    id: 'store-discount',
    title: '20% Store Discount',
    description: '20% off at eco-friendly partner stores',
    cost: 80,
    category: 'Discounts',
    image: 'https://images.unsplash.com/photo-1617992477211-dfab5866182b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3VudCUyMHZvdWNoZXIlMjBjb3Vwb258ZW58MXx8fHwxNzU2ODk3MjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    popular: false
  },
  {
    id: 'tree-planting',
    title: 'Plant a Tree',
    description: 'We plant a real tree in your name in a reforestation project',
    cost: 200,
    category: 'Environmental',
    image: 'https://images.unsplash.com/photo-1550642088-04d7e6a461b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1Y2N1bGVudCUyMGdyZWVufGVufDF8fHx8MTc1Njg5NzI5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    popular: true
  },
  {
    id: 'eco-bag',
    title: 'Reusable Eco Bag',
    description: 'High-quality reusable shopping bag made from recycled materials',
    cost: 75,
    category: 'Eco Products',
    image: 'https://images.unsplash.com/photo-1550642088-04d7e6a461b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1Y2N1bGVudCUyMGdyZWVufGVufDF8fHx8MTc1Njg5NzI5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    popular: false
  },
  {
    id: 'premium-features',
    title: 'Premium Features',
    description: 'Unlock advanced tracking and personalized insights',
    cost: 300,
    category: 'App Features',
    image: 'https://images.unsplash.com/photo-1617992477211-dfab5866182b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3VudCUyMHZvdWNoZXIlMjBjb3Vwb258ZW58MXx8fHwxNzU2ODk3MjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    popular: false
  }
];

const categories = ['All', 'Food & Drink', 'Eco Products', 'Discounts', 'Environmental', 'App Features'];

export function RewardsScreen({ userData, onRedeemReward }: RewardsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRewards = selectedCategory === 'All' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (userData.redeemedRewards.includes(reward.id)) {
      toast.error('You have already redeemed this reward!');
      return;
    }

    const success = onRedeemReward(reward.id, reward.cost);
    if (success) {
      toast.success(`Successfully redeemed ${reward.title}!`);
    } else {
      toast.error('Not enough tokens to redeem this reward.');
    }
  };

  const canAfford = (cost: number) => userData.totalTokens >= cost;
  const isRedeemed = (rewardId: string) => userData.redeemedRewards.includes(rewardId);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Rewards Store</h1>
        <p className="text-muted-foreground">Redeem your tokens for amazing rewards!</p>
        
        <div className="flex items-center justify-center gap-2 mt-4">
          <Coins className="w-5 h-5 text-green-600" />
          <span className="font-bold text-lg">{userData.totalTokens}</span>
          <span className="text-muted-foreground">tokens available</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold">Categories</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="space-y-4">
        {filteredRewards.map((reward) => {
          const affordable = canAfford(reward.cost);
          const redeemed = isRedeemed(reward.id);
          
          return (
            <Card key={reward.id} className={`relative ${!affordable && !redeemed ? 'opacity-60' : ''}`}>
              {reward.popular && (
                <Badge className="absolute top-2 right-2 z-10 bg-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <ImageWithFallback
                      src={reward.image}
                      alt={reward.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {!affordable && !redeemed && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {reward.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-600">{reward.cost}</span>
                        <span className="text-sm text-muted-foreground">tokens</span>
                      </div>
                      
                      {redeemed ? (
                        <Button size="sm" variant="secondary" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Redeemed
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled={!affordable}
                          onClick={() => handleRedeem(reward)}
                          className={affordable ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          {affordable ? 'Redeem' : 'Locked'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No rewards in this category</h3>
          <p className="text-muted-foreground">Try selecting a different category</p>
        </div>
      )}

      {/* Earn More Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold mb-2">Need more tokens?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Log more eco-friendly actions to earn tokens faster!
          </p>
          <Button variant="outline" size="sm">
            View Actions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}