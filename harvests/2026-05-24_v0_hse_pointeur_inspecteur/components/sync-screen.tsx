'use client'

import { useState, useEffect } from 'react'
import { 
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useApp } from '@/lib/app-context'
import { eventTypes, syncStatusLabels } from '@/lib/mock-data'
import type { SyncStatus } from '@/lib/types'

const syncConfig: Record<SyncStatus, { color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  synced: { color: 'text-success', bgColor: 'bg-success/20', icon: CheckCircle2 },
  pending: { color: 'text-warning', bgColor: 'bg-warning/20', icon: Clock },
  error: { color: 'text-danger', bgColor: 'bg-danger/20', icon: AlertCircle },
}

export function SyncScreen() {
  const { hseEvents, isOffline, pendingSyncCount, retrySync, setOfflineMode } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const pendingEvents = hseEvents.filter(e => e.syncStatus === 'pending' || e.syncStatus === 'error')

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center',
          isOffline ? 'bg-warning/20' : 'bg-success/20'
        )}>
          {isOffline ? (
            <WifiOff className="h-5 w-5 text-warning" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-success" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Centre de synchronisation</h2>
          <p className="text-xs text-muted-foreground">
            {isOffline ? 'Mode hors ligne actif' : 'Connecté au serveur'}
          </p>
        </div>
      </div>

      {/* Offline Banner */}
      {isOffline && (
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4 flex items-start gap-3">
            <WifiOff className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Mode hors ligne actif</p>
              <p className="text-xs text-muted-foreground mt-1">
                Les données seront synchronisées dès que le réseau revient. 
                Vous pouvez continuer à travailler normalement.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingSyncCount}</p>
              <p className="text-[10px] text-muted-foreground">En attente</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-danger/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {hseEvents.filter(e => e.syncStatus === 'error').length}
              </p>
              <p className="text-[10px] text-muted-foreground">Erreurs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toggle Offline Mode (for demo) */}
      <Card className="bg-card border-border">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Mode démo hors ligne</p>
              <p className="text-xs text-muted-foreground">Simuler le mode hors ligne</p>
            </div>
            <Button
              variant={isOffline ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOfflineMode(!isOffline)}
            >
              {isOffline ? 'Désactiver' : 'Activer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Records */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
          Enregistrements en attente
        </h3>

        {pendingEvents.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-success/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Tous les enregistrements sont synchronisés
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {pendingEvents.map(event => {
              const syncInfo = syncConfig[event.syncStatus]
              const SyncIcon = syncInfo.icon

              return (
                <Card key={event.id} className="bg-card border-border">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">
                            {event.id}
                          </span>
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 rounded flex items-center gap-1',
                            syncInfo.bgColor,
                            syncInfo.color
                          )}>
                            <SyncIcon className={cn(
                              'h-3 w-3',
                              event.syncStatus === 'pending' && 'animate-spin'
                            )} />
                            {syncStatusLabels[event.syncStatus]}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {eventTypes[event.eventType]}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.siteName}
                          </span>
                          {mounted && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(event.dateTime, 'HH:mm', { locale: fr })}
                            </span>
                          )}
                        </div>
                      </div>

                      {event.syncStatus === 'error' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retrySync(event.id)}
                          className="h-8 text-xs"
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          Réessayer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
