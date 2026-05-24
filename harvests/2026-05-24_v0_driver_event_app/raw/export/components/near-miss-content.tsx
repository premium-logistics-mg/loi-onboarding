'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { MobileLayout } from '@/components/mobile-layout';
import { SeveritySelector } from '@/components/severity-selector';
import { PhotoCapture } from '@/components/photo-capture';
import { VoiceNote } from '@/components/voice-note';
import { ConfirmationScreen } from '@/components/confirmation-screen';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Severity, DriverEvent } from '@/lib/types';
import { Car, AlertCircle } from 'lucide-react';

export function NearMissContent() {
  const { submitEvent } = useApp();
  const [severity, setSeverity] = useState<Severity>('probleme');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);

  const quickOptions = [
    'Autre véhicule',
    'Piéton',
    'Animal',
    'Obstacle sur la route',
    'Freinage brusque',
    'Évitement de collision',
  ];

  const handleQuickOption = (option: string) => {
    setDescription((prev) => (prev ? `${prev}\n${option}` : option));
  };

  const handleSubmit = () => {
    const event = submitEvent({
      event_type: 'near_miss_declared',
      severity,
      description: description || 'Quasi-accident signalé',
      photo_url: photoUrl || undefined,
      voice_note_url: voiceUrl || undefined,
    });
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="Quasi-accident" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title="Déclaration enregistrée"
          onDone={() => {
            setSubmitted(false);
            setDescription('');
            setSeverity('probleme');
            setPhotoUrl(null);
            setVoiceUrl(null);
          }}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Quasi-accident" showBack backHref="/">
      <div className="p-4 space-y-6 pb-8">
        {/* Warning */}
        <div className="bg-severity-urgent/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-severity-urgent" />
            <h2 className="font-semibold text-severity-urgent">Déclarer un quasi-accident</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Documentez l&apos;événement pour améliorer la sécurité de tous.
          </p>
        </div>

        {/* Severity */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Gravité de la situation</p>
          <SeveritySelector value={severity} onChange={setSeverity} />
        </div>

        {/* Quick Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Type d&apos;incident</p>
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
            placeholder="Décrivez ce qui s'est passé..."
            className="min-h-[100px] text-base"
          />
        </div>

        {/* Photo */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Photo (optionnel)</p>
          <PhotoCapture onCapture={setPhotoUrl} />
        </div>

        {/* Voice Note */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Note vocale (optionnel)</p>
          <VoiceNote onRecord={setVoiceUrl} />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          className="w-full h-16 text-xl font-bold"
        >
          <Car className="h-6 w-6 mr-2" />
          Déclarer
        </Button>
      </div>
    </MobileLayout>
  );
}
