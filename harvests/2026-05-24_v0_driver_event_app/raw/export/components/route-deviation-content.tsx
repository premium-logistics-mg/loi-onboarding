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
import { Construction, MapPin } from 'lucide-react';

export function RouteDeviationContent() {
  const { submitEvent } = useApp();
  const [severity, setSeverity] = useState<Severity>('probleme');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);

  const quickOptions = [
    'Route bloquée',
    'Travaux',
    'Accident',
    'Inondation',
    'Éboulement',
    'Manifestation',
    'Contrôle de police',
    'Autre obstacle',
  ];

  const handleQuickOption = (option: string) => {
    setDescription((prev) => (prev ? `${prev}\n${option}` : option));
  };

  const handleSubmit = () => {
    const event = submitEvent({
      event_type: 'route_deviation',
      severity,
      description: description || 'Déviation de route signalée',
      photo_url: photoUrl || undefined,
    });
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="Route bloquée" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title="Déviation signalée"
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
    <MobileLayout title="Route bloquée / Déviation" showBack backHref="/">
      <div className="p-4 space-y-6 pb-8">
        {/* Info */}
        <div className="bg-severity-problem/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-6 w-6 text-severity-problem" />
            <h2 className="font-semibold text-severity-problem">Signaler un obstacle</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Aidez les autres chauffeurs en signalant les routes impraticables.
          </p>
        </div>

        {/* Severity */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Impact sur le trajet</p>
          <SeveritySelector value={severity} onChange={setSeverity} />
        </div>

        {/* Quick Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Cause de la déviation</p>
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
            Localisation / Détails
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: RN7 km 45, route coupée par éboulement..."
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
          className="w-full h-16 text-xl font-bold"
        >
          <Construction className="h-6 w-6 mr-2" />
          Signaler
        </Button>
      </div>
    </MobileLayout>
  );
}
