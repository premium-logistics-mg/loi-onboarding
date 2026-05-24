'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { MobileLayout } from '@/components/mobile-layout';
import { ConfirmationScreen } from '@/components/confirmation-screen';
import { PhotoCapture } from '@/components/photo-capture';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DriverEvent } from '@/lib/types';
import { 
  Gauge, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  FileText,
  Fuel,
  UserX,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CameraIAStatus = 'loading' | 'success' | 'error' | 'manual';

interface CameraIAData {
  odometer_reading: number;
  confidence: number;
  timestamp: string;
  image_url?: string;
}

export function OdometerContent() {
  const { vehicle, updateOdometer } = useApp();
  const [odometer, setOdometer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<DriverEvent | null>(null);
  
  // Camera IA (OCR) states
  const [cameraIAStatus, setCameraIAStatus] = useState<CameraIAStatus>('loading');
  const [cameraIAData, setCameraIAData] = useState<CameraIAData | null>(null);
  const [manualOverrideReason, setManualOverrideReason] = useState('');
  
  // Compteur proof photo (always required for archival)
  const [compteurProofPhoto, setCompteurProofPhoto] = useState<string | null>(null);
  
  // Rapport de livraison
  const [rapportLivraison, setRapportLivraison] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<'completed' | 'partial' | 'failed' | null>(null);
  
  // Relevé type (départ ou destination)
  const [releveType, setReleveType] = useState<'depart' | 'destination'>('depart');
  
  // Fuel pointage (when no pointeur)
  const [noPointeur, setNoPointeur] = useState(false);
  const [fuelLevel, setFuelLevel] = useState('');
  const [fuelLiters, setFuelLiters] = useState('');
  const [fuelProofPhoto, setFuelProofPhoto] = useState<string | null>(null);

  // Simulate Camera IA data fetch
  useEffect(() => {
    const fetchCameraIAData = async () => {
      setCameraIAStatus('loading');
      
      // Simulate API call to Camera IA service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate 80% success rate
      const success = Math.random() > 0.2;
      
      if (success) {
        const simulatedReading = vehicle.current_odometer + Math.floor(Math.random() * 150) + 50;
        setCameraIAData({
          odometer_reading: simulatedReading,
          confidence: 0.94 + Math.random() * 0.05,
          timestamp: new Date().toISOString(),
        });
        setOdometer(simulatedReading.toString());
        setCameraIAStatus('success');
      } else {
        setCameraIAStatus('error');
      }
    };

    fetchCameraIAData();
  }, [vehicle.current_odometer]);

  const handleSwitchToManual = () => {
    setCameraIAStatus('manual');
    setOdometer('');
  };

  const handleRetryIA = () => {
    setCameraIAStatus('loading');
    setCameraIAData(null);
    // Re-trigger the effect
    const fetchCameraIAData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = Math.random() > 0.3;
      if (success) {
        const simulatedReading = vehicle.current_odometer + Math.floor(Math.random() * 150) + 50;
        setCameraIAData({
          odometer_reading: simulatedReading,
          confidence: 0.94 + Math.random() * 0.05,
          timestamp: new Date().toISOString(),
        });
        setOdometer(simulatedReading.toString());
        setCameraIAStatus('success');
      } else {
        setCameraIAStatus('error');
      }
    };
    fetchCameraIAData();
  };

  const isManualMode = cameraIAStatus === 'manual' || cameraIAStatus === 'error';
  
  const canSubmit = () => {
    const odometerValue = parseInt(odometer, 10);
    const validOdometer = !isNaN(odometerValue) && odometerValue >= vehicle.current_odometer;
    
    // Compteur proof photo is ALWAYS required for archival
    if (!compteurProofPhoto) {
      return false;
    }
    
    // If no pointeur, require fuel data and proof
    if (noPointeur && (!fuelLevel || !fuelProofPhoto)) {
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
      event_type: 'odometer_updated',
      severity: 'ok',
      severity_value: 1,
      captured_by: 'self_pwa',
      description: buildDescription(odometerValue),
      photo_url: compteurProofPhoto || undefined,
      acknowledged: false,
    };

    updateOdometer(odometerValue);
    setSubmittedEvent(event);
    setSubmitted(true);
  };

  const buildDescription = (odometerValue: number) => {
    let desc = releveType === 'depart' 
      ? `Kilométrage départ: ${odometerValue} km`
      : `Kilométrage destination: ${odometerValue} km`;
    
    if (cameraIAStatus === 'success' && cameraIAData) {
      desc += ` | Source: Camera IA (confiance: ${(cameraIAData.confidence * 100).toFixed(0)}%)`;
    } else {
      desc += ` | Source: Saisie manuelle`;
      if (manualOverrideReason) {
        desc += ` - Raison: ${manualOverrideReason}`;
      }
    }
    
    if (deliveryStatus) {
      const statusLabels = { completed: 'Complète', partial: 'Partielle', failed: 'Echouée' };
      desc += ` | Livraison: ${statusLabels[deliveryStatus]}`;
    }
    
    if (rapportLivraison) {
      desc += ` | Rapport: ${rapportLivraison}`;
    }
    
    if (noPointeur) {
      desc += ` | Sans pointeur - Carburant: ${fuelLevel}% (${fuelLiters || 'N/A'} L)`;
    }
    
    return desc;
  };

  if (submitted && submittedEvent) {
    return (
      <MobileLayout title="Kilométrage" showBack backHref="/">
        <ConfirmationScreen
          event={submittedEvent}
          title="Kilométrage enregistré"
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Mise à jour kilométrage" showBack backHref="/">
      <div className="p-4 space-y-5">
        {/* Relevé Type Selection */}
        <div className="space-y-3">
          <span className="text-sm font-medium">Type de relevé</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setReleveType('depart')}
              className={cn(
                'py-4 px-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2',
                releveType === 'depart'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              <Gauge className="h-5 w-5" />
              <span>Relevé départ</span>
            </button>
            <button
              type="button"
              onClick={() => setReleveType('destination')}
              className={cn(
                'py-4 px-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2',
                releveType === 'destination'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Relevé destination</span>
            </button>
          </div>
        </div>

        {/* Current Reading */}
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Dernier relevé</p>
          <p className="text-3xl font-mono font-bold">{vehicle.current_odometer.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">km</p>
        </div>

        {/* Camera IA Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Camera IA
            </span>
            {cameraIAStatus === 'success' && (
              <button
                type="button"
                onClick={handleSwitchToManual}
                className="text-xs text-primary flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                Saisie manuelle
              </button>
            )}
          </div>

          {/* Camera IA Status Display */}
          <div className={cn(
            'rounded-xl border p-4 transition-all',
            cameraIAStatus === 'loading' && 'border-border bg-card',
            cameraIAStatus === 'success' && 'border-severity-ok/50 bg-severity-ok/10',
            cameraIAStatus === 'error' && 'border-severity-urgent/50 bg-severity-urgent/10',
            cameraIAStatus === 'manual' && 'border-severity-problem/50 bg-severity-problem/10'
          )}>
            {cameraIAStatus === 'loading' && (
              <div className="flex items-center justify-center gap-3 py-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm">Lecture Camera IA en cours...</span>
              </div>
            )}

            {cameraIAStatus === 'success' && cameraIAData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-severity-ok">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Lecture automatique</span>
                </div>
                <div className="text-center py-2">
                  <p className="text-3xl font-mono font-bold">{cameraIAData.odometer_reading.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Confiance: {(cameraIAData.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            )}

            {cameraIAStatus === 'error' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-severity-urgent">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">Camera IA indisponible</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  La lecture automatique a échoué. Veuillez réessayer ou saisir manuellement.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetryIA}
                    className="flex-1"
                  >
                    Réessayer
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleSwitchToManual}
                    className="flex-1"
                  >
                    Saisie manuelle
                  </Button>
                </div>
              </div>
            )}

            {cameraIAStatus === 'manual' && (
              <div className="flex items-center gap-2 text-severity-problem">
                <Edit3 className="h-5 w-5" />
                <span className="text-sm font-medium">Mode saisie manuelle</span>
              </div>
            )}
          </div>
        </div>

        {/* Manual Odometer Input (shown when manual mode or to allow adjustment) */}
        {(cameraIAStatus === 'manual' || cameraIAStatus === 'error') && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4" />
                Nouveau kilométrage
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
        )}

        {/* Proof Photo Required for Manual Mode */}
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
            {releveType === 'depart' 
              ? 'Relevez le kilométrage actuel du véhicule avant de démarrer votre mission.'
              : 'Relevez le kilométrage à destination pour clôturer votre trajet.'
            }
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

        {/* Rapport de Livraison Section */}
        <div className="space-y-3 border-t border-border pt-5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Rapport de livraison</span>
          </div>
          
          {/* Delivery Status Selection */}
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'completed', label: 'Complète', color: 'bg-severity-ok' },
              { value: 'partial', label: 'Partielle', color: 'bg-severity-problem' },
              { value: 'failed', label: 'Echouée', color: 'bg-severity-urgent' },
            ] as const).map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => setDeliveryStatus(
                  deliveryStatus === status.value ? null : status.value
                )}
                className={cn(
                  'py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all',
                  deliveryStatus === status.value
                    ? `${status.color} border-transparent text-white`
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
          
          {/* Delivery Notes */}
          <Textarea
            value={rapportLivraison}
            onChange={(e) => setRapportLivraison(e.target.value)}
            placeholder="Notes sur la livraison (optionnel)..."
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Fuel Pointage Section (when no pointeur) */}
        <div className="space-y-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={() => setNoPointeur(!noPointeur)}
            className={cn(
              'w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all',
              noPointeur
                ? 'border-severity-problem bg-severity-problem/10'
                : 'border-border bg-card hover:border-primary/50'
            )}
          >
            <div className="flex items-center gap-3">
              <UserX className={cn(
                'h-5 w-5',
                noPointeur ? 'text-severity-problem' : 'text-muted-foreground'
              )} />
              <span className="text-sm font-medium">Pas de pointeur disponible</span>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center',
              noPointeur
                ? 'border-severity-problem bg-severity-problem'
                : 'border-muted-foreground'
            )}>
              {noPointeur && (
                <CheckCircle2 className="h-3 w-3 text-white" />
              )}
            </div>
          </button>

          {noPointeur && (
            <div className="space-y-4 p-4 bg-card rounded-xl border border-severity-problem/30">
              <div className="flex items-center gap-2 text-severity-problem">
                <Fuel className="h-4 w-4" />
                <span className="text-sm font-medium">Pointage carburant manuel</span>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Sans pointeur, vous devez enregistrer le niveau de carburant avec preuve photo.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Niveau jauge (%)
                  </label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(e.target.value)}
                    placeholder="75"
                    className="h-12 text-center font-mono"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Litres ajoutés (optionnel)
                  </label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={fuelLiters}
                    onChange={(e) => setFuelLiters(e.target.value)}
                    placeholder="50"
                    className="h-12 text-center font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-severity-problem" />
                  <span className="text-sm font-medium">Photo jauge carburant</span>
                  <span className="text-xs text-severity-problem">*</span>
                </div>
                <PhotoCapture
                  onCapture={setFuelProofPhoto}
                  className={cn(
                    !fuelProofPhoto && 'border-severity-problem/50'
                  )}
                />
              </div>
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
        
        {noPointeur && !fuelProofPhoto && (
          <div className="flex items-center gap-2 text-severity-problem text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Photo jauge carburant requise</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="w-full h-16 text-xl font-bold"
        >
          <Gauge className="h-6 w-6 mr-2" />
          Enregistrer
        </Button>
      </div>
    </MobileLayout>
  );
}
