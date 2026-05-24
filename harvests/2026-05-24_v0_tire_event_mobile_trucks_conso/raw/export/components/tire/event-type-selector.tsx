'use client'

import { useTireStore } from '@/lib/tire-store'
import { EVENT_LABELS, EventType } from '@/lib/tire-types'
import { cn } from '@/lib/utils'

const eventTypes: EventType[] = ['montage', 'permutation', 'eclatement', 'reception']

export function EventTypeSelector() {
  const { setEventType, pendingEvents, isOnline } = useTireStore()

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold text-foreground">Pointage Pneus</h1>
          <div className="flex items-center gap-2">
            {pendingEvents.length > 0 && (
              <span className="px-2 py-1 text-xs font-mono bg-warning/20 text-warning rounded-md">
                {pendingEvents.length} en attente
              </span>
            )}
            <span className={cn(
              "w-2.5 h-2.5 rounded-full",
              isOnline ? "bg-success" : "bg-destructive"
            )} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Sélectionnez le type d&apos;événement
        </p>
      </header>

      {/* Event Type Buttons */}
      <div className="grid grid-cols-1 gap-4 flex-1">
        {eventTypes.map((type) => {
          const { label, icon, description } = EVENT_LABELS[type]
          const isDestructive = type === 'eclatement'
          
          return (
            <button
              key={type}
              onClick={() => setEventType(type)}
              className={cn(
                "flex items-center gap-4 p-5 rounded-xl text-left transition-all active:scale-[0.98]",
                "border-2",
                isDestructive 
                  ? "bg-destructive/10 border-destructive/30 hover:border-destructive/60" 
                  : "bg-card border-border hover:border-primary/60"
              )}
            >
              <span className="text-4xl" role="img" aria-label={label}>
                {icon}
              </span>
              <div className="flex-1 min-w-0">
                <h2 className={cn(
                  "text-lg font-semibold",
                  isDestructive ? "text-destructive" : "text-foreground"
                )}>
                  {label}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {description}
                </p>
              </div>
              <svg 
                className={cn(
                  "w-6 h-6 flex-shrink-0",
                  isDestructive ? "text-destructive/60" : "text-muted-foreground"
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

      {/* Footer */}
      <footer className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground font-mono">
          LOI Fleet · Maintenance Manager
        </p>
      </footer>
    </div>
  )
}
