'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { MobileLayout } from '@/components/mobile-layout';
import { SeveritySelector } from '@/components/severity-selector';
import { PhotoCapture } from '@/components/photo-capture';
import { ConfirmationScreen } from '@/components/confirmation-screen';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Severity, DriverEvent } from '@/lib/types';
import { Wrench, AlertTriangle } from 'lucide-react';

export function VehicleIssueContent() {
  const { submitEvent } = useApp();
  const [severity, setSeverity] = useState<Severity>('probleme');
  const [isBreakdown, setIsBreakdown] = useState(false);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);

  const quickOptions = [
    'Voyant moteur',
    'Freins',
    'Pneu crevé',
    'Fuite',
    'Problème électrique',
    'Climatisation',
    'Direction',
    'Boîte de vitesse',
  ];

  const handleQuickOption = (option: string) => {
    setDescription((prev) => (prev ? `${prev}\n${option}` : option));
  };

  const handleSubmit = () => {
    const event = submitEvent({
      event_type: isBreakdown ? 'breakdown_reported' : 'vehicle_issue_reported',
      severity: isBreakdown ? 'urgent' : severity,
      description: description || (isBreakdown ? 'Panne signalée' : 'Problème véhicule signalé'),
      photo_url: photoUrl || undefined,
    });
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="Problème véhicule" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title={isBreakdown ? 'Panne signalée' : 'Problème signalé'}
          onDone={() => {
            setSubmitted(false);
            setDescription('');
            setSeverity('probleme');
            setIsBreakdown(false);
            setPhotoUrl(null);
          }}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Problème véhicule" showBack backHref="/">
      <div className="p-4 space-y-6 pb-8">
        {/* Breakdown Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsBreakdown(false)}
            className={`touch-target flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${
              !isBreakdown
                ? 'border-severity-problem bg-severity-problem/20 text-severity-problem'
                : 'border-border bg-card text-muted-foreground'
            }`}
          >
            <Wrench className="h-6 w-6" />
            <span className="text-sm font-medium">Problème</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsBreakdown(true);
              setSeverity('urgent');
            }}
            className={`touch-target flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${
              isBreakdown
                ? 'border-severity-urgent bg-severity-urgent/20 text-severity-urgent'
                : 'border-border bg-card text-muted-foreground'
            }`}
          >
            <AlertTriangle className="h-6 w-6" />
            <span className="text-sm font-medium">Panne</span>
          </button>
        </div>

        {/* Severity (only if not breakdown) */}
        {!isBreakdown && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Gravité du problème</p>
            <SeveritySelector value={severity} onChange={setSeverity} />
          </div>
        )}

        {/* Quick Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Type de problème</p>
          <div className="flex flex-wrap gap-2">
            {quickOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleQuickOption(option)}
                className="px-3 py-2 text-sm rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le problème..."
            className="min-h-[100px] text-base"
          />
        </div>

        {/* Photo */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Photo (recommandé)</p>
          <PhotoCapture onCapture={setPhotoUrl} />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          variant={isBreakdown ? 'destructive' : 'default'}
          className="w-full h-16 text-xl font-bold"
        >
          <Wrench className="h-6 w-6 mr-2" />
          {isBreakdown ? 'Signaler la panne' : 'Signaler'}
        </Button>
      </div>
    </MobileLayout>
  );
}
