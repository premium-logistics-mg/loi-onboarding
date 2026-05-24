'use client'

import { cn } from '@/lib/utils'
import type { DriverDetail } from '@/lib/loi-types'
import { 
  X, 
  Fuel, 
  Route, 
  Gauge, 
  AlertTriangle, 
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  Circle,
  Loader2,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface DriverDetailPanelProps {
  driver: DriverDetail | null
  isOpen: boolean
  onClose: () => void
}

function getStatusColor(status: 'green' | 'yellow' | 'red') {
  switch (status) {
    case 'green': return 'bg-status-green'
    case 'yellow': return 'bg-status-yellow'
    case 'red': return 'bg-status-red'
  }
}

function getScoreColor(score: number) {
  if (score >= 75) return 'text-status-green'
  if (score >= 60) return 'text-status-yellow'
  return 'text-status-red'
}

function getScoreBgColor(score: number) {
  if (score >= 75) return 'bg-status-green/10'
  if (score >= 60) return 'bg-status-yellow/10'
  return 'bg-status-red/10'
}

function ActionStatusIcon({ status }: { status: 'done' | 'in_progress' | 'pending' }) {
  switch (status) {
    case 'done':
      return <CheckCircle className="w-4 h-4 text-status-green" />
    case 'in_progress':
      return <Loader2 className="w-4 h-4 text-status-yellow animate-spin" />
    case 'pending':
      return <Circle className="w-4 h-4 text-muted-foreground" />
  }
}

export function DriverDetailPanel({ driver, isOpen, onClose }: DriverDetailPanelProps) {
  if (!driver) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-14 right-0 bottom-0 w-full max-w-[480px] bg-card border-l border-border z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-bold",
                  getScoreBgColor(driver.score),
                  getScoreColor(driver.score)
                )}>
                  {driver.score}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{driver.nom}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono">{driver.camion}</span>
                    <span>·</span>
                    <span>{driver.corridor}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn("w-2 h-2 rounded-full", getStatusColor(driver.status))} />
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      driver.status === 'green' && "border-status-green/30 text-status-green",
                      driver.status === 'yellow' && "border-status-yellow/30 text-status-yellow",
                      driver.status === 'red' && "border-status-red/30 text-status-red"
                    )}>
                      {driver.status === 'green' ? 'Conforme' : driver.status === 'yellow' ? 'Attention' : 'Alerte'}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* KPIs Grid */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                KPIs Individuels
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Fuel className="w-3 h-3" />
                    Conso L/km
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "font-mono text-lg font-bold",
                      driver.kpis.ecartPourcent > 0 ? "text-status-red" : "text-status-green"
                    )}>
                      {driver.kpis.consoLkm.toFixed(3)}
                    </span>
                    {driver.kpis.ecartPourcent !== 0 && (
                      <span className={cn(
                        "text-xs",
                        driver.kpis.ecartPourcent > 0 ? "text-status-red" : "text-status-green"
                      )}>
                        {driver.kpis.ecartPourcent > 0 ? '+' : ''}{driver.kpis.ecartPourcent.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Obj: {driver.kpis.consoObjectif}</div>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Route className="w-3 h-3" />
                    Conformite
                  </div>
                  <span className={cn(
                    "font-mono text-lg font-bold",
                    driver.kpis.conformiteTrajet >= 95 ? "text-status-green" :
                    driver.kpis.conformiteTrajet >= 90 ? "text-status-yellow" : "text-status-red"
                  )}>
                    {driver.kpis.conformiteTrajet}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    Incidents
                  </div>
                  <span className={cn(
                    "font-mono text-lg font-bold",
                    driver.kpis.incidents > 0 ? "text-status-red" : "text-status-green"
                  )}>
                    {driver.kpis.incidents}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-1">Voyages/mois</div>
                  <span className="font-mono text-lg font-bold text-foreground">
                    {driver.kpis.voyagesMois}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-1">Km/mois</div>
                  <span className="font-mono text-lg font-bold text-foreground">
                    {driver.kpis.kmMois.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-1">Cout fuel</div>
                  <span className="font-mono text-lg font-bold text-primary">
                    {driver.kpis.coutFuelMois}
                  </span>
                </div>
              </div>
            </section>

            <Separator className="my-4" />

            {/* Alertes */}
            {driver.alertes.length > 0 && (
              <section className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Alertes Actives ({driver.alertes.length})
                </h3>
                <div className="space-y-2">
                  {driver.alertes.map((alerte, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-md bg-status-red/10 border border-status-red/20"
                    >
                      <AlertTriangle className="w-4 h-4 text-status-red shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{alerte}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Trajets Recents */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Trajets Recents
              </h3>
              <div className="space-y-2">
                {driver.trajetsRecents.map((trajet, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-lg border",
                      trajet.status === 'conforme' 
                        ? "bg-card border-border" 
                        : "bg-status-red/5 border-status-red/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{trajet.date}</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        trajet.status === 'conforme' 
                          ? "border-status-green/30 text-status-green" 
                          : "border-status-red/30 text-status-red"
                      )}>
                        {trajet.status === 'conforme' ? 'Conforme' : 'Retard'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-medium text-foreground">{trajet.corridor}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Reel: {trajet.dureeReelle}</span>
                      <span>Standard: {trajet.dureeStandard}</span>
                      <span className={cn(
                        "font-mono font-medium",
                        trajet.ecart.startsWith('+') ? "text-status-red" : 
                        trajet.ecart.startsWith('-') ? "text-status-green" : "text-muted-foreground"
                      )}>
                        {trajet.ecart}
                      </span>
                    </div>
                    {trajet.cause && (
                      <div className="mt-2 text-xs text-status-red">
                        Cause: {trajet.cause}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Fuel Recent */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Historique Fuel
              </h3>
              <div className="space-y-2">
                {driver.fuelRecent.map((fuel, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{fuel.station}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {fuel.date} · {fuel.voyage}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-foreground">{fuel.litres}L</div>
                      <div className="text-xs text-muted-foreground font-mono">{fuel.bc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions en cours */}
            {driver.actions.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Actions en Cours
                </h3>
                <div className="space-y-2">
                  {driver.actions.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border"
                    >
                      <ActionStatusIcon status={action.status} />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{action.label}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{action.responsable}</span>
                          <span>·</span>
                          <span>{action.deadline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
