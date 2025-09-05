import React, { useState } from 'react';
import { Camera, Plus, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MediaCapture } from './MediaCapture';
import { toast } from 'sonner@2.0.3';

interface QuickProofWidgetProps {
  onAddAction: (category: string, action: string, tokens: number, mediaFile?: File) => void;
}

export function QuickProofWidget({ onAddAction }: QuickProofWidgetProps) {
  const [showCapture, setShowCapture] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    category: string;
    action: string;
    tokens: number;
  } | null>(null);

  const quickActions = [
    { category: 'Transport', action: 'Sustainable transport used', tokens: 25, emoji: '🚶' },
    { category: 'Waste', action: 'Waste properly recycled', tokens: 20, emoji: '♻️' },
    { category: 'Energy', action: 'Energy-saving action taken', tokens: 30, emoji: '💡' },
  ];

  const handleActionSelect = (action: typeof quickActions[0]) => {
    setSelectedAction(action);
    setShowCapture(true);
  };

  const handleProofSubmit = (file: File) => {
    if (selectedAction) {
      onAddAction(selectedAction.category, selectedAction.action, selectedAction.tokens, file);
      toast.success('Proof submitted for AI verification!');
      setShowCapture(false);
      setSelectedAction(null);
    }
  };

  if (showCapture && selectedAction) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCapture(false)}
            >
              ← Back
            </Button>
            <span className="font-medium">Submit Proof: {selectedAction.action}</span>
          </div>
          <MediaCapture
            onMediaCapture={handleProofSubmit}
            onCancel={() => setShowCapture(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">Quick Proof Submission</h3>
            <p className="text-sm text-blue-700">Earn tokens with verified eco-actions</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 flex flex-col gap-1 p-2 bg-white hover:bg-blue-50 border-blue-200"
              onClick={() => handleActionSelect(action)}
            >
              <div className="text-lg">{action.emoji}</div>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                +{action.tokens}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1 mt-3 text-xs text-blue-600">
          <Zap className="w-3 h-3" />
          <span>AI verifies your proof in seconds</span>
        </div>
      </CardContent>
    </Card>
  );
}