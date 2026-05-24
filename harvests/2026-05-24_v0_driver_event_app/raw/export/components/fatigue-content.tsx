'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { MobileLayout } from '@/components/mobile-layout';
import { SeveritySelector } from '@/components/severity-selector';
import { ConfirmationScreen } from '@/components/confirmation-screen';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Severity, DriverEvent } from '@/lib/types';
import { AlertTriangle, Moon } from 'lucide-react';

export function FatigueContent() {
  const { submitEvent } = useApp();
  const [severity, setSeverity] = useState<Severity>('probleme');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);

  const quickOptions = [
    'Somnolence légère',
    'Besoin d\'une pause',
    'Conduite prolongée (> 4h)',
    'Vision trouble',
    'Difficulté de concentration',
  ];

  const handleQuickOption = (option: string) => {
    setDescription((prev) => (prev ? `${prev}\n${option}` : option));
  };

  const handleSubmit = () => {
    const event = submitEvent({
      event_type: 'fatigue_alert',
      severity,
      description: description || 'Alerte fatigue signalée',
    });
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="Alerte fatigue" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title="Alerte transmise"
          onDone={() => {
            setSubmitted(false);
            setDescription('');
            setSeverity('probleme');
          }}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Alerte fatigue" showBack backHref="/">
      <div className="p-4 space-y-6">
        {/* Warning */}
        <div className="bg-severity-problem/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="h-6 w-6 text-severity-problem" />
            <h2 className="font-semibold text-severity-problem">Sécurité d&apos;abord</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Si vous vous sentez fatigué, arrêtez-vous dans un endroit sûr avant de signaler.
          </p>
        </div>

        {/* Severity */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Niveau de fatigue</p>
          <SeveritySelector value={severity} onChange={setSeverity} />
        </div>

        {/* Quick Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Symptômes (appuyez pour ajouter)</p>
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
            Détails (optionnel)
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre état..."
            className="min-h-[100px] text-base"
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          className="w-full h-16 text-xl font-bold"
        >
          <AlertTriangle className="h-6 w-6 mr-2" />
          Envoyer l&apos;alerte
        </Button>
      </div>
    </MobileLayout>
  );
}
