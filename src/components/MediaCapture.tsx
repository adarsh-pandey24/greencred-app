import React, { useRef, useState } from 'react';
import { Camera, Video, Upload, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface MediaCaptureProps {
  onMediaCapture: (file: File) => void;
  onCancel: () => void;
}

export function MediaCapture({ onMediaCapture, onCancel }: MediaCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCapture = () => {
    if (selectedFile) {
      onMediaCapture(selectedFile);
      cleanup();
    }
  };

  const cleanup = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    cleanup();
    onCancel();
  };

  const isVideo = selectedFile?.type.startsWith('video/');

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {!selectedFile ? (
            <>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Verify Your Action</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Take a photo or video to verify your eco-friendly action
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                capture="environment"
              />

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*";
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "video/*";
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Video
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 text-muted-foreground"
              >
                <Upload className="w-4 h-4" />
                Or upload from gallery
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {isVideo ? 'Video' : 'Photo'} Selected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cleanup}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  {isVideo ? (
                    <video
                      src={previewUrl!}
                      className="w-full h-32 object-cover"
                      controls={false}
                      muted
                    />
                  ) : (
                    <img
                      src={previewUrl!}
                      alt="Selected media"
                      className="w-full h-32 object-cover"
                    />
                  )}
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ready to submit for AI verification?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCapture}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Verify Action
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}