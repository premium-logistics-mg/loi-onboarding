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
import { ShieldAlert, HardHat } from 'lucide-react';

export function EpiContent() {
  const { submitEvent } = useApp();
  const [severity, setSeverity] = useState<Severity>('probleme');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);

  const quickOptions = [
    'Casque manquant',
    'Gilet réfléchissant',
    'Chaussures de sécurité',
    'Gants',
    'Lunettes de protection',
    'EPI endommagé',
    'EPI non fourni',
    'Autre EPI',
  ];

  const handleQuickOption = (option: string) => {
    setDescription((prev) => (prev ? `${prev}\n${option}` : option));
  };

  const handleSubmit = () => {
    const event = submitEvent({
      event_type: 'epi_non_compliant',
      severity,
      description: description || 'Non-conformité EPI signalée',
      photo_url: photoUrl || undefined,
    });
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="EPI / Sécurité" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title="Signalement enregistré"
          onDone={() => {
            setSubmitted(false);
            setDescription('');
            setSeverity('probleme');
            setPhotoUrl(null);
          }}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="EPI / Sécurité" showBack backHref="/">
      <div className="p-4 space-y-6 pb-8">
        {/* Info */}
        <div className="bg-accent/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <HardHat className="h-6 w-6 text-accent" />
            <h2 className="font-semibold text-accent">Équipements de Protection</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Signalez tout problème d&apos;équipement de protection individuelle.
          </p>
        </div>

        {/* Severity */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Urgence</p>
          <SeveritySelector value={severity} onChange={setSeverity} />
        </div>

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
            placeholder="Décrivez le problème d'EPI..."
            className="min-h-[100px] text-base"
          />
        </div>

        {/* Photo */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Photo (optionnel)</p>
          <PhotoCapture onCapture={setPhotoUrl} />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          className="w-full h-16 text-xl font-bold"
        >
          <ShieldAlert className="h-6 w-6 mr-2" />
          Signaler
        </Button>
      </div>
    </MobileLayout>
  );
}
