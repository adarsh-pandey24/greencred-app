import React, { useState } from 'react';
import { Eye, EyeOff, Leaf, Mail, Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  loading?: boolean;
}

export function LoginScreen({ onLogin, loading = false }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600" />
        
        {/* Secondary Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/30 via-transparent to-emerald-300/20" />
        
        {/* Animated Orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-32 right-8 w-24 h-24 bg-emerald-300/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute bottom-32 left-8 w-20 h-20 bg-green-400/15 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-48 right-16 w-28 h-28 bg-teal-300/10 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        
        {/* Floating Leaf Elements */}
        <div className="absolute top-20 left-1/4 text-white/20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '6s' }}>
          <Leaf className="w-8 h-8 transform rotate-12" />
        </div>
        <div className="absolute top-40 right-1/3 text-white/15 animate-pulse" style={{ animationDelay: '3s' }}>
          <Leaf className="w-6 h-6 transform -rotate-45" />
        </div>
        <div className="absolute bottom-40 left-1/3 text-white/20 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '5s' }}>
          <Leaf className="w-7 h-7 transform rotate-90" />
        </div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
                           radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 60px 60px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center flex-1 p-6 space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
            <Leaf className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg tracking-wide">Greencred</h1>
            <p className="text-white/90 mt-2 text-lg drop-shadow-sm">
              Build your green credibility through sustainable actions
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-center text-gray-600 text-sm">
              {isSignUp 
                ? 'Join the eco-friendly community today'
                : 'Sign in to continue your eco journey'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-green-700 font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Demo Credentials:
              </p>
              <p className="text-xs text-green-600 font-mono">Email: demo@greencred.com</p>
              <p className="text-xs text-green-600 font-mono">Password: demo123</p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 text-center text-white">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <div className="w-14 h-14 mx-auto bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border border-white/30 shadow-lg">
              <Leaf className="w-7 h-7 drop-shadow-sm" />
            </div>
            <p className="text-sm font-medium drop-shadow-sm">Track Actions</p>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-200">
            <div className="w-14 h-14 mx-auto bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border border-white/30 shadow-lg">
              <span className="text-xl drop-shadow-sm">🪙</span>
            </div>
            <p className="text-sm font-medium drop-shadow-sm">Earn Tokens</p>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-200">
            <div className="w-14 h-14 mx-auto bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border border-white/30 shadow-lg">
              <span className="text-xl drop-shadow-sm">🎁</span>
            </div>
            <p className="text-sm font-medium drop-shadow-sm">Get Rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
}