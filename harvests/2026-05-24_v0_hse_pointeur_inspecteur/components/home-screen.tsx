'use client'

import { useState, useEffect } from 'react'
import { 
  Play, 
  AlertTriangle, 
  Eye,
  MapPin,
  Truck,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Timer,
  Lock
} from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { siteTypes, priorityLabels, statusLabels, syncStatusLabels, mockTrucks, vehicleTypes, truckStatusLabels } from '@/lib/mock-data'
import type { Priority, InspectionStatus, SyncStatus } from '@/lib/types'
import type { TruckStatus } from '@/lib/mock-data'

interface HomeScreenProps {
  onStartInspection: (id: string) => void
  onReportIncident: () => void
  onNewObservation: () => void
  onTruckInspection?: () => void
}

const priorityColors: Record<Priority, string> = {
  normal: 'bg-success/20 text-success',
  attention: 'bg-warning/20 text-warning',
  critique: 'bg-critical/20 text-critical',
}

const statusColors: Record<InspectionStatus, string> = {
  a_faire: 'bg-info/20 text-info',
  en_cours: 'bg-warning/20 text-warning',
  en_attente_correction: 'bg-danger/20 text-danger',
  cloture: 'bg-success/20 text-success',
}

const syncColors: Record<SyncStatus, string> = {
  synced: 'text-success',
  pending: 'text-warning',
  error: 'text-danger',
}

const statusIcons: Record<InspectionStatus, typeof CheckCircle2> = {
  a_faire: Timer,
  en_cours: RefreshCw,
  en_attente_correction: AlertCircle,
  cloture: CheckCircle2,
}

const truckStatusColors: Record<TruckStatus, string> = {
  disponible: 'bg-success/20 text-success',
  en_mission: 'bg-info/20 text-info',
  en_maintenance: 'bg-warning/20 text-warning',
  hors_service: 'bg-danger/20 text-danger',
}

export function HomeScreen({ onStartInspection, onReportIncident, onNewObservation, onTruckInspection }: HomeScreenProps) {
  const { inspections, hseEvents, correctiveActions } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Stats - use fixed values to avoid hydration mismatch
  const todayStats = {
    inspectionsTodo: inspections.filter(i => i.status === 'a_faire').length,
    inspectionsInProgress: inspections.filter(i => i.status === 'en_cours').length,
    eventsToday: hseEvents.length, // All mock events are from "today"
    criticalActions: correctiveActions.filter(a => 
      a.priority === 'critique' && a.status !== 'termine' && a.status !== 'verifie'
    ).length,
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-info/20 flex items-center justify-center">
                <Timer className="h-4 w-4 text-info" />
              </div>
              <span className="text-2xl font-bold text-foreground">{todayStats.inspectionsTodo}</span>
            </div>
            <p className="text-xs text-muted-foreground">Inspections à faire</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <span className="text-2xl font-bold text-foreground">{todayStats.eventsToday}</span>
            </div>
            <p className="text-xs text-muted-foreground">Événements aujourd&apos;hui</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-success" />
              </div>
              <span className="text-2xl font-bold text-foreground">{todayStats.inspectionsInProgress}</span>
            </div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-critical/20 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-critical" />
              </div>
              <span className="text-2xl font-bold text-foreground">{todayStats.criticalActions}</span>
            </div>
            <p className="text-xs text-muted-foreground">Actions critiques</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={onReportIncident}
          className="h-14 bg-danger hover:bg-danger/90 text-danger-foreground flex items-center justify-center gap-2"
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">Signaler incident</span>
        </Button>
        <Button 
          onClick={onNewObservation}
          variant="outline"
          className="h-14 border-primary text-primary hover:bg-primary/10 flex items-center justify-center gap-2"
        >
          <Eye className="h-5 w-5" />
          <span className="font-semibold">Observation</span>
        </Button>
      </div>

      {/* Truck Fleet Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            Flotte Camions / Dumptrucks
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success" />
              {mockTrucks.filter(t => t.status === 'disponible').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-info" />
              {mockTrucks.filter(t => t.status === 'en_mission').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-warning" />
              {mockTrucks.filter(t => t.status === 'en_maintenance').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-danger" />
              {mockTrucks.filter(t => t.status === 'hors_service').length}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {mockTrucks.map((truck) => (
            <Card 
              key={truck.id} 
              className={cn(
                "bg-card border-border overflow-hidden cursor-pointer hover:bg-secondary/50 transition-colors",
                truck.alertCount > 0 && "border-l-2 border-l-warning"
              )}
              onClick={onTruckInspection}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Truck Icon */}
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    truck.type === 'dumptruck' || truck.type === 'camion_benne' 
                      ? "bg-warning/20" 
                      : "bg-info/20"
                  )}>
                    <Truck className={cn(
                      "h-5 w-5",
                      truck.type === 'dumptruck' || truck.type === 'camion_benne' 
                        ? "text-warning" 
                        : "text-info"
                    )} />
                  </div>

                  {/* Truck Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{truck.id}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded",
                        truckStatusColors[truck.status]
                      )}>
                        {truckStatusLabels[truck.status]}
                      </span>
                      {truck.alertCount > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-warning">
                          <AlertTriangle className="h-3 w-3" />
                          {truck.alertCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{truck.immatriculation}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{vehicleTypes[truck.type]}</span>
                    </div>
                    {truck.driverName && truck.currentSite && (
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{truck.currentSite}</span>
                      </div>
                    )}
                  </div>

                  {/* Score & Fuel */}
                  <div className="flex flex-col items-end gap-1">
                    <div className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded",
                      truck.lastInspectionScore >= 90 ? "bg-success/20 text-success" :
                      truck.lastInspectionScore >= 70 ? "bg-warning/20 text-warning" :
                      "bg-danger/20 text-danger"
                    )}>
                      {truck.lastInspectionScore}%
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            truck.fuelLevel > 50 ? "bg-success" :
                            truck.fuelLevel > 25 ? "bg-warning" : "bg-danger"
                          )}
                          style={{ width: `${truck.fuelLevel}%` }}
                        />
                      </div>
                      <span>{truck.fuelLevel}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inspection Queue */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          File d&apos;inspections du jour
        </h2>
        
        <div className="space-y-3">
          {inspections.map((inspection) => {
            const StatusIcon = statusIcons[inspection.status]
            
            return (
              <Card key={inspection.id} className="bg-card border-border overflow-hidden">
                <CardContent className="p-0">
                  {/* Priority indicator */}
                  <div className={cn(
                    'h-1',
                    inspection.priority === 'critique' ? 'bg-critical' :
                    inspection.priority === 'attention' ? 'bg-warning' : 'bg-success'
                  )} />
                  
                  <div className="p-3">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {inspection.siteName}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground truncate">
                            {siteTypes[inspection.siteType]}
                          </span>
                        </div>
                      </div>
                      
                      {/* Sync Status */}
                      <div className={cn(
                        'text-[10px] flex items-center gap-1',
                        syncColors[inspection.syncStatus]
                      )}>
                        {inspection.syncStatus === 'synced' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : inspection.syncStatus === 'pending' ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        <span>{syncStatusLabels[inspection.syncStatus]}</span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {inspection.missionId && (
                        <span className="text-[10px] px-2 py-0.5 bg-secondary rounded text-secondary-foreground">
                          {inspection.missionId}
                        </span>
                      )}
                      {inspection.truckId && (
                        <span className="text-[10px] px-2 py-0.5 bg-secondary rounded text-secondary-foreground flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {inspection.truckId}
                        </span>
                      )}
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded',
                        priorityColors[inspection.priority]
                      )}>
                        {priorityLabels[inspection.priority]}
                      </span>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        'flex items-center gap-1.5 text-xs px-2 py-1 rounded',
                        statusColors[inspection.status]
                      )}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        <span>{statusLabels[inspection.status]}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {inspection.status === 'cloture' ? (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 text-xs text-muted-foreground"
                            disabled
                          >
                            <Lock className="h-3.5 w-3.5 mr-1" />
                            Clôturé
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="h-8 text-xs bg-primary hover:bg-primary/90"
                            onClick={() => onStartInspection(inspection.id)}
                          >
                            <Play className="h-3.5 w-3.5 mr-1" />
                            {inspection.status === 'a_faire' ? 'Démarrer' : 'Continuer'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Last update */}
                    {mounted && (
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Dernière mise à jour: {format(inspection.lastUpdated, 'HH:mm', { locale: fr })}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
