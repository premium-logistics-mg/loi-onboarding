'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Camera, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoCaptureProps {
  onCapture: (photoUrl: string | null) => void;
  className?: string;
}

export function PhotoCapture({ onCapture, className }: PhotoCaptureProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('[v0] Camera access denied:', err);
      // Fallback to file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            setPhoto(result);
            onCapture(result);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(dataUrl);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    onCapture(null);
  };

  if (photo) {
    return (
      <div className={cn('relative rounded-xl overflow-hidden', className)}>
        <img src={photo} alt="Photo capturée" className="w-full h-48 object-cover" />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={clearPhoto}
            className="h-10 w-10 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={clearPhoto}
            className="h-10 w-10 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (cameraActive) {
    return (
      <div className={cn('relative rounded-xl overflow-hidden bg-black', className)}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-48 object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={stopCamera}
            className="h-12 w-12 rounded-full p-0"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={takePhoto}
            className="h-14 w-14 rounded-full p-0 bg-primary"
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startCamera}
      className={cn(
        'touch-target-lg w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary hover:bg-primary/5 transition-all',
        'h-32',
        className
      )}
    >
      <Camera className="h-8 w-8 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Prendre une photo</span>
    </button>
  );
}
