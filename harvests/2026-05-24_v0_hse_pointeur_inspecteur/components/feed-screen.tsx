'use client'

import { useState } from 'react'
import { 
  Activity,
  AlertTriangle,
  Truck,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Filter,
  Users,
  BarChart3,
  Briefcase
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useApp } from '@/lib/app-context'
import { eventTypes, severityLabels, syncStatusLabels } from '@/lib/mock-data'
import type { Severity, SyncStatus } from '@/lib/types'

const severityConfig: Record<Severity, { color: string; bgColor: string; border: string }> = {
  faible: { color: 'text-success', bgColor: 'bg-success/20', border: 'border-l-success' },
  moyen: { color: 'text-warning', bgColor: 'bg-warning/20', border: 'border-l-warning' },
  eleve: { color: 'text-danger', bgColor: 'bg-danger/20', border: 'border-l-danger' },
  critique: { color: 'text-critical', bgColor: 'bg-critical/20', border: 'border-l-critical' },
}

const syncConfig: Record<SyncStatus, { color: string; icon: typeof CheckCircle2 }> = {
  synced: { color: 'text-success', icon: CheckCircle2 },
  pending: { color: 'text-warning', icon: RefreshCw },
  error: { color: 'text-danger', icon: AlertCircle },
}

export function FeedScreen() {
  const { hseEvents, managerFeed, correctiveActions } = useApp()
  const [view, setView] = useState<'timeline' | 'managers'>('timeline')
  const [feedType, setFeedType] = useState<'all' | 'hse' | 'exploitation'>('all')

  const filteredFeed = managerFeed.filter(item => {
    if (feedType === 'all') return true
    return item.type === feedType
  })

  // Stats for manager feeds
  const hseStats = {
    incidents: hseEvents.filter(e => e.eventType === 'incident').length,
    nearMiss: hseEvents.filter(e => e.eventType === 'near_miss').length,
    epiCompliance: 86, // Mock value
    criticalRisks: hseEvents.filter(e => e.severity === 'critique').length,
    openActions: correctiveActions.filter(a => a.status !== 'termine' && a.status !== 'verifie').length,
    overdueActions: correctiveActions.filter(a => a.status === 'en_retard').length,
  }

  const exploitationStats = {
    blockedMissions: hseEvents.filter(e => e.operationalImpact === 'arret_mission').length,
    delayedTrucks: hseEvents.filter(e => e.operationalImpact === 'retard').length,
    blockedLoading: hseEvents.filter(e => e.operationalImpact === 'blocage_chargement').length,
    fatigueAlerts: hseEvents.filter(e => e.eventType === 'fatigue_conducteur').length,
    impactMinutes: 185, // Mock value
    escalatedItems: managerFeed.filter(i => i.escalated).length,
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Feed HSE</h2>
            <p className="text-xs text-muted-foreground">Événements et synthèse managers</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 p-1 bg-secondary rounded-lg">
        <button
          onClick={() => setView('timeline')}
          className={cn(
            'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all',
            view === 'timeline' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground'
          )}
        >
          Chronologie
        </button>
        <button
          onClick={() => setView('managers')}
          className={cn(
            'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all',
            view === 'managers' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground'
          )}
        >
          Feed Managers
        </button>
      </div>

      {view === 'timeline' ? (
        <>
          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'hse', 'exploitation'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFeedType(type)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  feedType === type 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {type === 'all' ? 'Tous' : type === 'hse' ? 'HSE' : 'Exploitation'}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            {filteredFeed.map((item, index) => {
              const severityInfo = severityConfig[item.severity]
              const syncInfo = syncConfig[item.syncStatus]
              const SyncIcon = syncInfo.icon

              return (
                <Card 
                  key={item.id} 
                  className={cn(
                    'bg-card border-border overflow-hidden border-l-4',
                    severityInfo.border
                  )}
                >
                  <CardContent className="p-3">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 rounded font-medium',
                            item.type === 'hse' ? 'bg-info/20 text-info' : 'bg-warning/20 text-warning'
                          )}>
                            {item.type === 'hse' ? 'HSE' : 'EXPLOITATION'}
                          </span>
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 rounded',
                            severityInfo.bgColor,
                            severityInfo.color
                          )}>
                            {severityLabels[item.severity]}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {item.title}
                        </h3>
                      </div>
                      
                      {/* Sync Status */}
                      <div className={cn('flex items-center gap-1', syncInfo.color)}>
                        <SyncIcon className={cn(
                          'h-3.5 w-3.5',
                          item.syncStatus === 'pending' && 'animate-spin'
                        )} />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mb-2">
                      {item.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{item.siteName}</span>
                      </div>
                      {item.truckId && (
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          <span>{item.truckId}</span>
                        </div>
                      )}
                    </div>

                    {/* Escalation badge */}
                    {item.escalated && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-critical">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span className="font-medium">Escaladé aux managers</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {/* Manager Feed Preview */}
          <div className="space-y-4">
            {/* HSE Manager Card */}
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-info/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-info" />
                  </div>
                  <CardTitle className="text-sm">Feed HSE Manager</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-lg font-bold text-danger">{hseStats.incidents}</p>
                    <p className="text-[10px] text-muted-foreground">Incidents</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-lg font-bold text-warning">{hseStats.nearMiss}</p>
                    <p className="text-[10px] text-muted-foreground">Presqu&apos;accidents</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-lg font-bold text-success">{hseStats.epiCompliance}%</p>
                    <p className="text-[10px] text-muted-foreground">Conformité EPI</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-lg font-bold text-critical">{hseStats.criticalRisks}</p>
                    <p className="text-[10px] text-muted-foreground">Risques critiques</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Actions ouvertes</span>
                    <span className="font-semibold text-warning">{hseStats.openActions}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Actions en retard</span>
                    <span className="font-semibold text-danger">{hseStats.overdueActions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exploitation Manager Card */}
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-warning" />
                  </div>
                  <CardTitle className="text-sm">Feed Exploitation Manager</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-lg font-bold text-danger">{exploitationStats.blockedMissions}</p>
                    <p className="text-[10px] text-muted-foreground">Missions bloquées</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-lg font-bold text-warning">{exploitationStats.delayedTrucks}</p>
                    <p className="text-[10px] text-muted-foreground">Camions retardés</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-lg font-bold text-danger">{exploitationStats.blockedLoading}</p>
                    <p className="text-[10px] text-muted-foreground">Chargements bloqués</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <p className="text-lg font-bold text-critical">{exploitationStats.fatigueAlerts}</p>
                    <p className="text-[10px] text-muted-foreground">Alertes fatigue</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Impact opérationnel</span>
                    <span className="font-semibold text-warning">{exploitationStats.impactMinutes} min</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Éléments escaladés</span>
                    <span className="font-semibold text-critical">{exploitationStats.escalatedItems}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
