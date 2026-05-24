'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { MobileLayout } from '@/components/mobile-layout';
import { ConfirmationScreen } from '@/components/confirmation-screen';
import { PhotoCapture } from '@/components/photo-capture';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DriverEvent } from '@/lib/types';
import { 
  Play, 
  Gauge, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CameraIAStatus = 'loading' | 'success' | 'error' | 'manual';

interface CameraIAData {
  reading: number;
  confidence: number;
  timestamp: string;
}

export function StartMissionContent() {
  const { vehicle, startMission } = useApp();
  const [odometer, setOdometer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);

  // Camera IA (OCR) states
  const [cameraIAStatus, setCameraIAStatus] = useState<CameraIAStatus>('loading');
  const [cameraIAData, setCameraIAData] = useState<CameraIAData | null>(null);
  const [manualOverrideReason, setManualOverrideReason] = useState('');
  
  // Compteur proof photo (always required)
  const [compteurProofPhoto, setCompteurProofPhoto] = useState<string | null>(null);

  // Simulate Camera IA OCR attempt
  useEffect(() => {
    const attemptCameraIA = async () => {
      setCameraIAStatus('loading');
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate 70% success rate
      const success = Math.random() > 0.3;
      
      if (success) {
        const mockReading = vehicle.current_odometer + Math.floor(Math.random() * 50);
        setCameraIAData({
          reading: mockReading,
          confidence: 95 + Math.floor(Math.random() * 5),
          timestamp: new Date().toISOString()
        });
        setOdometer(mockReading.toString());
        setCameraIAStatus('success');
      } else {
        setCameraIAStatus('error');
      }
    };
    
    attemptCameraIA();
  }, [vehicle.current_odometer]);

  const retryCameraIA = async () => {
    setCameraIAStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Higher success rate on retry
    const success = Math.random() > 0.2;
    
    if (success) {
      const mockReading = vehicle.current_odometer + Math.floor(Math.random() * 50);
      setCameraIAData({
        reading: mockReading,
        confidence: 95 + Math.floor(Math.random() * 5),
        timestamp: new Date().toISOString()
      });
      setOdometer(mockReading.toString());
      setCameraIAStatus('success');
    } else {
      setCameraIAStatus('error');
    }
  };

  const switchToManual = () => {
    setCameraIAStatus('manual');
    setOdometer(vehicle.current_odometer.toString());
  };

  const isManualMode = cameraIAStatus === 'manual' || cameraIAStatus === 'error';

  const canSubmit = () => {
    const odometerValue = parseInt(odometer, 10);
    const validOdometer = !isNaN(odometerValue) && odometerValue >= vehicle.current_odometer;
    
    // Compteur proof photo is ALWAYS required
    if (!compteurProofPhoto) {
      return false;
    }
    
    return validOdometer;
  };

  const handleSubmit = () => {
    const odometerValue = parseInt(odometer, 10);
    if (!canSubmit()) return;

    const event: DriverEvent = {
      id: `temp-${Date.now()}`,
      driver_id: '',
      vehicle_id: '',
      mission_id: '',
      timestamp: new Date().toISOString(),
      event_type: 'mission_started',
      severity: 'ok',
      severity_value: 1,
      captured_by: 'self_pwa',
      description: `Mission démarrée. Kilométrage départ: ${odometerValue} km. Source: ${cameraIAStatus === 'success' ? 'Camera OCR' : 'Saisie manuelle'}`,
      photo_url: compteurProofPhoto || undefined,
      acknowledged: false,
    };

    startMission(odometerValue);
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="Mission démarrée" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title="Mission démarrée!"
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Démarrer la mission" showBack backHref="/">
      <div className="p-4 space-y-6">
        {/* Instructions */}
        <div className="bg-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Play className="h-6 w-6 text-primary" />
            <h2 className="font-semibold text-primary">Avant de partir</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Relevez le kilométrage actuel du véhicule avant de démarrer votre mission.
          </p>
        </div>

        {/* Camera IA Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Camera IA (OCR)</span>
          </div>

          {/* Loading State */}
          {cameraIAStatus === 'loading' && (
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Lecture automatique en cours...</span>
            </div>
          )}

          {/* Success State */}
          {cameraIAStatus === 'success' && cameraIAData && (
            <div className="bg-severity-ok/10 border border-severity-ok/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-severity-ok" />
                <span className="text-sm font-medium text-severity-ok">Lecture automatique</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold">{cameraIAData.reading.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">Confiance: {cameraIAData.confidence}%</div>
              </div>
              <button
                onClick={switchToManual}
                className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 py-2"
              >
                <Edit3 className="h-4 w-4" />
                Saisie manuelle
              </button>
            </div>
          )}

          {/* Error State */}
          {cameraIAStatus === 'error' && (
            <div className="bg-severity-problem/10 border border-severity-problem/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-severity-problem" />
                <span className="text-sm font-medium text-severity-problem">Camera IA indisponible</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Impossible de lire le compteur automatiquement. Réessayez ou saisissez manuellement.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryCameraIA}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={switchToManual}
                  className="flex-1"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Saisie manuelle
                </Button>
              </div>
            </div>
          )}

          {/* Manual Mode */}
          {cameraIAStatus === 'manual' && (
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Mode manuel activé</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Saisissez le kilométrage affiché sur le compteur.
              </p>
            </div>
          )}
        </div>

        {/* Manual Odometer Input */}
        {isManualMode && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4" />
                Kilométrage de départ
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
            <p className="text-xs text-muted-foreground text-center">
              Dernier relevé: {vehicle.current_odometer.toLocaleString()} km
            </p>
          </div>
        )}

        {/* Manual Override Reason */}
        {isManualMode && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-severity-problem" />
              <span className="text-sm font-medium">Raison saisie manuelle</span>
            </div>
            <Input
              type="text"
              value={manualOverrideReason}
              onChange={(e) => setManualOverrideReason(e.target.value)}
              placeholder="Ex: Camera OCR cassée, mauvaise luminosité..."
              className="h-12"
            />
          </div>
        )}

        {/* Compteur Proof Photo - ALWAYS REQUIRED */}
        <div className="space-y-3 border-t border-border pt-5">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Photo compteur</span>
            <span className="text-xs text-severity-urgent">* obligatoire</span>
          </div>
          <p className="text-sm text-foreground font-medium">
            Relevez le kilométrage actuel du véhicule avant de démarrer votre mission.
          </p>
          <p className="text-xs text-muted-foreground">
            {cameraIAStatus === 'success' 
              ? 'Camera OCR a pré-rempli la valeur. Confirmez en prenant une photo du compteur.'
              : 'Prenez une photo claire du compteur kilométrique.'
            }
          </p>
          <PhotoCapture
            onCapture={setCompteurProofPhoto}
            className={cn(
              !compteurProofPhoto && 'border-severity-problem/50'
            )}
          />
          {compteurProofPhoto && (
            <div className="flex items-center gap-2 text-severity-ok text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Photo compteur enregistrée</span>
            </div>
          )}
        </div>

        {/* Validation Messages */}
        {!compteurProofPhoto && (
          <div className="flex items-center gap-2 text-severity-urgent text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Photo compteur requise pour archivage</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="w-full h-16 text-xl font-bold"
        >
          <Play className="h-6 w-6 mr-2" />
          Démarrer
        </Button>
      </div>
    </MobileLayout>
  );
}
