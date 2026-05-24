'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { MobileLayout } from '@/components/mobile-layout';
import { ConfirmationScreen } from '@/components/confirmation-screen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DriverEvent } from '@/lib/types';
import { Square, Gauge, CheckCircle2 } from 'lucide-react';

export function EndMissionContent() {
  const { vehicle, currentMission, endMission } = useApp();
  const [odometer, setOdometer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);

  const handleSubmit = () => {
    const odometerValue = parseInt(odometer, 10);
    if (isNaN(odometerValue) || odometerValue < vehicle.current_odometer) {
      return;
    }

    const event: DriverEvent = {
      id: `temp-${Date.now()}`,
      driver_id: '',
      vehicle_id: '',
      mission_id: '',
      timestamp: new Date().toISOString(),
      event_type: 'mission_completed',
      severity: 'ok',
      severity_value: 1,
      captured_by: 'self_pwa',
      description: `Mission terminée. Kilométrage arrivée: ${odometerValue} km. Distance parcourue: ${odometerValue - (currentMission.current_odometer || vehicle.current_odometer)} km`,
      acknowledged: false,
    };

    endMission(odometerValue);
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="Mission terminée" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title="Mission terminée!"
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Terminer la mission" showBack backHref="/">
      <div className="p-4 space-y-6">
        {/* Instructions */}
        <div className="bg-severity-ok/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-6 w-6 text-severity-ok" />
            <h2 className="font-semibold text-severity-ok">Arrivée à destination</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Relevez le kilométrage final pour clôturer la mission.
          </p>
        </div>

        {/* Mission Summary */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Trajet</span>
            <span className="text-sm font-medium">{currentMission.origin} → {currentMission.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Kilométrage départ</span>
            <span className="text-sm font-mono">{currentMission.current_odometer?.toLocaleString() || vehicle.current_odometer.toLocaleString()} km</span>
          </div>
        </div>

        {/* Odometer Input */}
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
              <Gauge className="h-4 w-4" />
              Kilométrage d&apos;arrivée
            </span>
            <Input
              type="number"
              inputMode="numeric"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="h-16 text-2xl text-center font-mono"
              placeholder="000000"
            />
          </label>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!odometer || parseInt(odometer, 10) < vehicle.current_odometer}
          variant="destructive"
          className="w-full h-16 text-xl font-bold"
        >
          <Square className="h-6 w-6 mr-2" />
          Terminer la mission
        </Button>
      </div>
    </MobileLayout>
  );
}
