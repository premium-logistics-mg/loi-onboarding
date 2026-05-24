'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Mic, Square, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceNoteProps {
  onRecord: (audioUrl: string | null) => void;
  className?: string;
}

export function VoiceNote({ onRecord, className }: VoiceNoteProps) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecord(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      console.error('[v0] Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setPlaying(false);
      }
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    }
  };

  const clearAudio = () => {
    stopAudio();
    setAudioUrl(null);
    setDuration(0);
    onRecord(null);
    audioRef.current = null;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioUrl) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-xl bg-card border border-border',
          className
        )}
      >
        <Button
          type="button"
          variant={playing ? 'secondary' : 'default'}
          onClick={playing ? stopAudio : playAudio}
          className="h-12 w-12 rounded-full p-0 shrink-0"
        >
          {playing ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
        <div className="flex-1">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full bg-primary transition-all',
                playing ? 'animate-pulse' : ''
              )}
              style={{ width: playing ? '100%' : '0%' }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDuration(duration)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={clearAudio}
          className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={recording ? stopRecording : startRecording}
      className={cn(
        'touch-target-lg w-full flex items-center justify-center gap-3 rounded-xl border-2 transition-all',
        recording
          ? 'border-destructive bg-destructive/10 text-destructive'
          : 'border-dashed border-border bg-card hover:border-primary hover:bg-primary/5 text-muted-foreground',
        'h-16',
        className
      )}
    >
      {recording ? (
        <>
          <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
          <span className="font-medium">
            {formatDuration(duration)} - Appuyer pour arrêter
          </span>
        </>
      ) : (
        <>
          <Mic className="h-6 w-6" />
          <span className="text-sm">Enregistrer une note vocale</span>
        </>
      )}
    </button>
  );
}
