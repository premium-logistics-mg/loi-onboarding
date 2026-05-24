'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DriverEvent, eventTypeLabels, severityConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ConfirmationScreenProps {
  event: DriverEvent;
  title?: string;
  onDone?: () => void;
}

export function ConfirmationScreen({ event, title = 'Événement enregistré', onDone }: ConfirmationScreenProps) {
  const [showDetails, setShowDetails] = useState(false);
  const severityConf = severityConfig[event.severity];

  useEffect(() => {
    // Auto-show details after a brief delay
    const timer = setTimeout(() => setShowDetails(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      {/* Success Icon */}
      <div
        className={cn(
          'h-24 w-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500',
          event.severity === 'urgent'
            ? 'bg-severity-urgent/20'
            : event.severity === 'probleme'
            ? 'bg-severity-problem/20'
            : 'bg-severity-ok/20'
        )}
      >
        {event.severity === 'urgent' || event.severity === 'probleme' ? (
          <AlertCircle
            className={cn(
              'h-12 w-12',
              event.severity === 'urgent' ? 'text-severity-urgent' : 'text-severity-problem'
            )}
          />
        ) : (
          <CheckCircle2 className="h-12 w-12 text-severity-ok" />
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
      <p className="text-muted-foreground text-center mb-6">
        Transmis au Driver Manager
      </p>

      {/* Event Details */}
      <div
        className={cn(
          'w-full max-w-sm bg-card rounded-xl border border-border p-4 space-y-3 transition-all duration-500',
          showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <div className="flex justify-between items-start">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="text-sm font-medium text-right">
            {eventTypeLabels[event.event_type]}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Gravité</span>
          <span
            className={cn(
              'text-sm font-medium px-2 py-0.5 rounded',
              event.severity === 'urgent'
                ? 'bg-severity-urgent/20 text-severity-urgent'
                : event.severity === 'probleme'
                ? 'bg-severity-problem/20 text-severity-problem'
                : 'bg-severity-ok/20 text-severity-ok'
            )}
          >
            {severityConf.label}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-muted-foreground">Heure</span>
          <span className="text-sm font-medium">
            {new Date(event.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {event.description && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{event.description}</p>
          </div>
        )}

        {event.photo_url && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Photo</p>
            <img
              src={event.photo_url}
              alt="Photo jointe"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm mt-8 space-y-3">
        <Button asChild className="w-full h-14 text-lg font-semibold">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
        {onDone && (
          <Button
            variant="outline"
            onClick={onDone}
            className="w-full h-12"
          >
            Nouvel événement
          </Button>
        )}
      </div>
    </div>
  );
}
