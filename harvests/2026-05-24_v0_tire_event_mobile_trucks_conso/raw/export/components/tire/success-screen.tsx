'use client'

import { useTireStore } from '@/lib/tire-store'
import { EVENT_LABELS, AXLE_POSITIONS } from '@/lib/tire-types'

export function SuccessScreen() {
  const { lastEvent, resetEvent } = useTireStore()

  const eventLabel = lastEvent?.type ? EVENT_LABELS[lastEvent.type] : null
  const axlePosition = lastEvent
    ? AXLE_POSITIONS.find(p => p.id === lastEvent.axlePosition)
    : undefined

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8">
      {/* Bloc confirmation */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
              <svg className="w-10 h-10 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-1 text-center">
          Événement enregistré
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
          Enregistré sur l&apos;appareil.
        </p>

        {/* Récap */}
        {lastEvent && (
          <div className="w-full max-w-sm bg-card rounded-sm border-2 border-border p-4 space-y-3">
            <SummaryRow label="Camion" value={`${lastEvent.vehicleCode} · ${lastEvent.vehiclePlate}`} />
            <SummaryRow label="Position" value={axlePosition?.label || lastEvent.axlePosition} />
            <SummaryRow label="Événement" value={eventLabel?.label || lastEvent.type} />
            <SummaryRow label="Marque" value={lastEvent.brand} mono={false} />
            <SummaryRow
              label="Km"
              value={`${lastEvent.currentKm.toLocaleString('fr-FR')} km`}
              highlight
            />
          </div>
        )}
      </div>

      {/* Bouton nouveau (bas d'écran · pouce) */}
      <button
        onClick={resetEvent}
        className="w-full max-w-sm mx-auto py-4 rounded-sm bg-primary text-primary-foreground font-semibold transition-all active:scale-[0.98] min-h-[44px]"
      >
        Nouveau
      </button>

      {/* Pied */}
      <footer className="mt-6">
        <p className="text-xs text-center text-muted-foreground font-mono">
          LOI · Terrain pneu
        </p>
      </footer>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  mono = true,
  highlight = false,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={[
          'text-sm text-foreground',
          mono ? 'font-mono' : '',
          highlight ? 'font-semibold text-primary' : '',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}
