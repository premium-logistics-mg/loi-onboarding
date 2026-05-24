'use client'

import { useTireStore } from '@/lib/tire-store'
import { EVENT_LABELS, AXLE_POSITIONS, VEHICLES } from '@/lib/tire-types'
import { cn } from '@/lib/utils'

export function SuccessScreen() {
  const { currentEvent, resetEvent, isOnline, pendingEvents } = useTireStore()
  
  // Get the last submitted event info (it was cleared, so we show a generic success)
  // In a real app, we'd pass this through or store the last event separately

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8 items-center justify-center">
      {/* Success Animation */}
      <div className="mb-6">
        <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
            <svg className="w-10 h-10 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-2xl font-semibold text-foreground mb-2 text-center">
        Événement enregistré
      </h1>
      
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
        {isOnline 
          ? 'Les données ont été synchronisées avec le serveur.'
          : 'Les données seront synchronisées au retour réseau.'
        }
      </p>

      {/* Status Cards */}
      <div className="w-full max-w-sm space-y-3 mb-8">
        {/* Sync Status */}
        <div className={cn(
          "p-4 rounded-xl border-2 flex items-center gap-3",
          isOnline 
            ? "bg-success/10 border-success/30" 
            : "bg-warning/10 border-warning/30"
        )}>
          {isOnline ? (
            <>
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Synchronisé</p>
                <p className="text-xs text-muted-foreground">Données envoyées</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">En attente</p>
                <p className="text-xs text-muted-foreground">
                  {pendingEvents.length} événement{pendingEvents.length > 1 ? 's' : ''} en file
                </p>
              </div>
            </>
          )}
        </div>

        {/* Connection Status */}
        <div className="p-4 rounded-xl border-2 border-border bg-card flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isOnline ? "bg-success/20" : "bg-destructive/20"
          )}>
            {isOnline ? (
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-7.072 0l2.829-2.829M3 3l18 18" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">
              {isOnline ? 'Connecté' : 'Hors ligne'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOnline ? 'Réseau disponible' : 'Mode hors connexion actif'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={resetEvent}
        className="w-full max-w-sm py-4 rounded-xl bg-primary text-primary-foreground font-semibold transition-all active:scale-[0.98]"
      >
        Nouveau pointage
      </button>

      {/* Footer */}
      <footer className="mt-8">
        <p className="text-xs text-center text-muted-foreground font-mono">
          LOI Fleet · Maintenance Manager
        </p>
      </footer>
    </div>
  )
}
