'use client'

import { useTireStore } from '@/lib/tire-store'
import { EVENT_LABELS, EventType } from '@/lib/tire-types'
import { cn } from '@/lib/utils'

const eventTypes: EventType[] = ['montage', 'depose', 'inspection', 'reparation', 'remplacement']

export function EventTypeSelector() {
  const { setEventType, pendingEvents } = useTireStore()

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8">
      {/* En-tête */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold text-foreground">Pointage pneu</h1>
          {pendingEvents.length > 0 && (
            <span className="px-2 py-1 text-xs font-mono bg-warning/20 text-warning rounded-sm">
              {pendingEvents.length} enregistré{pendingEvents.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Quel type d&apos;événement ?
        </p>
      </header>

      {/* Boutons type d'événement */}
      <div className="grid grid-cols-1 gap-3 flex-1">
        {eventTypes.map((type) => {
          const { label, icon, description } = EVENT_LABELS[type]
          const isRemove = type === 'depose'

          return (
            <button
              key={type}
              onClick={() => setEventType(type)}
              className={cn(
                'flex items-center gap-4 p-5 rounded-sm text-left transition-all active:scale-[0.98] min-h-[64px]',
                'border-2',
                isRemove
                  ? 'bg-destructive/10 border-destructive/30'
                  : 'bg-card border-border'
              )}
            >
              <span className="text-3xl" role="img" aria-label={label}>
                {icon}
              </span>
              <div className="flex-1 min-w-0">
                <h2 className={cn(
                  'text-lg font-semibold',
                  isRemove ? 'text-destructive' : 'text-foreground'
                )}>
                  {label}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {description}
                </p>
              </div>
              <svg
                className={cn(
                  'w-6 h-6 flex-shrink-0',
                  isRemove ? 'text-destructive/60' : 'text-muted-foreground'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )
        })}
      </div>

      {/* Pied */}
      <footer className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground font-mono">
          LOI · Terrain pneu
        </p>
      </footer>
    </div>
  )
}
