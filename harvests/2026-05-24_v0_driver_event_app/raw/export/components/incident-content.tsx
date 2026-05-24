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
import { ShieldAlert, AlertCircle } from 'lucide-react';

export function IncidentContent() {
  const { submitEvent } = useApp();
  const [severity, setSeverity] = useState<Severity>('urgent');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);

  const quickOptions = [
    'Accident de la route',
    'Collision légère',
    'Dommage matériel',
    'Blessure',
    'Vol / Tentative de vol',
    'Agression',
    'Chargement endommagé',
  ];

  const handleQuickOption = (option: string) => {
    setDescription((prev) => (prev ? `${prev}\n${option}` : option));
  };

  const handleSubmit = () => {
    const event = submitEvent({
      event_type: 'incident_reported',
      severity,
      description: description || 'Incident signalé',
      photo_url: photoUrl || undefined,
      voice_note_url: voiceUrl || undefined,
    });
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="Incident / Accident" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title="Incident signalé"
          onDone={() => {
            setSubmitted(false);
            setDescription('');
            setSeverity('urgent');
            setPhotoUrl(null);
            setVoiceUrl(null);
          }}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Incident / Accident" showBack backHref="/">
      <div className="p-4 space-y-6 pb-8">
        {/* Warning */}
        <div className="bg-severity-urgent/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-severity-urgent" />
            <h2 className="font-semibold text-severity-urgent">Signaler un incident</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            En cas d&apos;urgence médicale, appelez les secours d&apos;abord (117).
          </p>
        </div>

        {/* Severity */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Gravité</p>
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
            Description détaillée
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez l'incident en détail..."
            className="min-h-[120px] text-base"
          />
        </div>

        {/* Photo */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Photos (recommandé)</p>
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
          variant="destructive"
          className="w-full h-16 text-xl font-bold"
        >
          <ShieldAlert className="h-6 w-6 mr-2" />
          Signaler l&apos;incident
        </Button>
      </div>
    </MobileLayout>
  );
}
