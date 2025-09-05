import React from 'react';
import { CheckCircle, XCircle, Clock, Eye, Video, Camera } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { EcoAction } from '../App';

interface VerificationCardProps {
  action: EcoAction;
}

export function VerificationCard({ action }: VerificationCardProps) {
  if (!action.verification) return null;

  const { status, mediaType, aiAnalysis, verifiedAt } = action.verification;

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'approved':
        return 'AI Verified';
      case 'rejected':
        return 'Verification Failed';
      case 'pending':
        return 'AI Analyzing...';
    }
  };

  return (
    <Card className="mt-3 border-l-4 border-l-gray-200">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {mediaType === 'video' ? (
              <Video className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Camera className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getStatusColor()} border text-xs`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon()}
                  {getStatusText()}
                </div>
              </Badge>
              {verifiedAt && (
                <span className="text-xs text-muted-foreground">
                  {verifiedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {status === 'pending' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  AI is analyzing your {mediaType}...
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}

            {aiAnalysis && status !== 'pending' && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                {aiAnalysis}
              </p>
            )}

            {status === 'approved' && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                +{action.tokens} tokens awarded
              </div>
            )}

            {status === 'rejected' && (
              <div className="text-xs text-red-600">
                No tokens awarded. Try submitting new evidence.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}