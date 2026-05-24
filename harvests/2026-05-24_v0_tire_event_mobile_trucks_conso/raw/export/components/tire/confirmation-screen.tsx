'use client'

import { useState } from 'react'
import { useTireStore } from '@/lib/tire-store'
import { 
  EVENT_LABELS, 
  AXLE_POSITIONS, 
  VEHICLES,
  URGENCY_LABELS,
  ESCALATION_LABELS 
} from '@/lib/tire-types'
import { cn } from '@/lib/utils'

export function ConfirmationScreen() {
  const { currentEvent, prevStep, submitEvent, isOnline } = useTireStore()
  const [signature, setSignature] = useState(false)

  const eventLabel = currentEvent.type ? EVENT_LABELS[currentEvent.type] : null
  const vehicle = VEHICLES.find(v => v.code === currentEvent.vehicleCode)
  const axlePosition = AXLE_POSITIONS.find(p => p.id === currentEvent.axlePosition)

  const handleConfirm = () => {
    if (signature) {
      submitEvent()
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8">
      {/* Header */}
      <header className="mb-4">
        <button 
          onClick={prevStep}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-3 active:opacity-70"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <h1 className="text-xl font-semibold text-foreground">Confirmation</h1>
        <p className="text-sm text-muted-foreground">
          Verifiez les informations avant validation
        </p>
      </header>

      {/* Summary Card */}
      <div className="flex-1 space-y-4 overflow-auto -mx-4 px-4">
        {/* Event Type Badge */}
        {eventLabel && (
          <div className={cn(
            "p-4 rounded-xl border-2",
            currentEvent.type === 'eclatement'
              ? "bg-destructive/10 border-destructive/30"
              : "bg-primary/10 border-primary/30"
          )}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{eventLabel.icon}</span>
              <div>
                <p className={cn(
                  "font-semibold text-lg",
                  currentEvent.type === 'eclatement' ? "text-destructive" : "text-primary"
                )}>
                  {eventLabel.label}
                </p>
                <p className="text-sm text-muted-foreground">{eventLabel.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-card rounded-xl border-2 border-border p-4 space-y-3">
          <DetailRow 
            label="Vehicule" 
            value={vehicle ? `${vehicle.code} - ${vehicle.plate}` : '-'}
            mono
          />
          <DetailRow 
            label="Position" 
            value={axlePosition?.label || '-'}
            mono
          />
          <div className="border-t border-border pt-3">
            <DetailRow label="Marque" value={currentEvent.brand || '-'} />
            <DetailRow label="N serie" value={currentEvent.serialNumber || '-'} mono />
            <DetailRow label="Reference" value={currentEvent.reference || '-'} mono />
            {currentEvent.profile && (
              <DetailRow label="Profil" value={currentEvent.profile} />
            )}
          </div>
          <div className="border-t border-border pt-3">
            <DetailRow 
              label="Km actuel" 
              value={currentEvent.currentKm ? `${currentEvent.currentKm.toLocaleString('fr-FR')} km` : '-'}
              mono
              highlight
            />
          </div>
        </div>

        {/* Tread Depth */}
        {currentEvent.treadDepth && (
          <div className="bg-card rounded-xl border-2 border-border p-4">
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Epaisseur pneu
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">EXT</p>
                <p className="font-mono font-semibold text-foreground">{currentEvent.treadDepth.exterior} mm</p>
              </div>
              <div className="p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">CENTRE</p>
                <p className="font-mono font-semibold text-foreground">{currentEvent.treadDepth.center} mm</p>
              </div>
              <div className="p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">INT</p>
                <p className="font-mono font-semibold text-foreground">{currentEvent.treadDepth.interior} mm</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Valeur min:</span>
              <span className={cn(
                "font-mono font-medium px-2 py-0.5 rounded",
                Math.min(currentEvent.treadDepth.exterior, currentEvent.treadDepth.center, currentEvent.treadDepth.interior) < 3 
                  ? "bg-destructive/20 text-destructive" 
                  : Math.min(currentEvent.treadDepth.exterior, currentEvent.treadDepth.center, currentEvent.treadDepth.interior) < 5
                  ? "bg-warning/20 text-warning"
                  : "bg-success/20 text-success"
              )}>
                {Math.min(
                  currentEvent.treadDepth.exterior, 
                  currentEvent.treadDepth.center, 
                  currentEvent.treadDepth.interior
                ).toFixed(1)} mm
              </span>
            </div>
          </div>
        )}

        {/* Decision Note */}
        {currentEvent.decisionNote && (
          <div className="bg-card rounded-xl border-2 border-border p-4">
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Carnet de decision
            </p>
            
            {currentEvent.decisionNote.observation && (
              <div className="mb-2 p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Observation</p>
                <p className="text-sm text-foreground">{currentEvent.decisionNote.observation}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {currentEvent.decisionNote.escalation && (
                <div className="p-2 bg-warning/10 border border-warning/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Escalader vers</p>
                  <p className="text-sm font-medium text-warning">
                    {ESCALATION_LABELS[currentEvent.decisionNote.escalation]}
                  </p>
                </div>
              )}
              
              <div className={cn(
                "p-2 rounded-lg border",
                currentEvent.decisionNote.urgency === 'immediate' 
                  ? "bg-destructive/10 border-destructive/30"
                  : currentEvent.decisionNote.urgency === 'today'
                  ? "bg-warning/10 border-warning/30"
                  : currentEvent.decisionNote.urgency === 'week'
                  ? "bg-primary/10 border-primary/30"
                  : "bg-muted/30 border-border"
              )}>
                <p className="text-xs text-muted-foreground mb-1">Urgence</p>
                <p className={cn(
                  "text-sm font-medium",
                  currentEvent.decisionNote.urgency === 'immediate' 
                    ? "text-destructive"
                    : currentEvent.decisionNote.urgency === 'today'
                    ? "text-warning"
                    : currentEvent.decisionNote.urgency === 'week'
                    ? "text-primary"
                    : "text-muted-foreground"
                )}>
                  {URGENCY_LABELS[currentEvent.decisionNote.urgency].label}
                </p>
              </div>
            </div>

            {currentEvent.decisionNote.customComment && (
              <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Commentaire</p>
                <p className="text-sm text-foreground">{currentEvent.decisionNote.customComment}</p>
              </div>
            )}
          </div>
        )}

        {/* Proof Photos */}
        {currentEvent.proofPhotos && currentEvent.proofPhotos.length > 0 && (
          <div className="bg-card rounded-xl border-2 border-border p-3">
            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Photos preuve ({currentEvent.proofPhotos.length})
            </p>
            <div className="grid grid-cols-4 gap-2">
              {currentEvent.proofPhotos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Preuve ${idx + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Legacy Photo */}
        {currentEvent.photo && (
          <div className="bg-card rounded-xl border-2 border-border p-3">
            <p className="text-sm font-medium text-muted-foreground mb-2">Photo jointe</p>
            <img
              src={currentEvent.photo}
              alt="Photo du pneu"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Offline Warning */}
        {!isOnline && (
          <div className="p-3 rounded-xl bg-warning/10 border border-warning/30">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm text-warning font-medium">
                Mode hors ligne - sera synchronise au retour reseau
              </span>
            </div>
          </div>
        )}

        {/* Signature TER */}
        <div className="bg-card rounded-xl border-2 border-border p-4">
          <p className="text-sm font-medium text-foreground mb-3">
            Signature TER (Pacte)
          </p>
          <button
            onClick={() => setSignature(!signature)}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
              signature 
                ? "bg-success/10 border-success/50" 
                : "bg-muted/50 border-border"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
              signature 
                ? "bg-success border-success" 
                : "border-muted-foreground"
            )}>
              {signature && (
                <svg className="w-4 h-4 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={cn(
              "text-sm font-medium",
              signature ? "text-success" : "text-muted-foreground"
            )}>
              Je confirme l&apos;exactitude des informations
            </span>
          </button>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={!signature}
        className={cn(
          "mt-4 w-full py-4 rounded-xl font-semibold transition-all active:scale-[0.98]",
          signature
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        Valider l&apos;evenement
      </button>

      {/* Step indicator */}
      <footer className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </footer>
    </div>
  )
}

function DetailRow({ 
  label, 
  value, 
  mono = false,
  highlight = false 
}: { 
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn(
        "text-sm text-foreground",
        mono && "font-mono",
        highlight && "font-semibold text-primary"
      )}>
        {value}
      </span>
    </div>
  )
}
