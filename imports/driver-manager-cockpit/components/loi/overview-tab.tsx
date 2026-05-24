'use client'

import type { Driver } from '@/lib/loi-types'
import type { KPICard, SOTracker as SOTrackerType, Alert, Arbitrage } from '@/lib/loi-types'
import { KPICards } from './kpi-cards'
import { SOTracker } from './so-tracker'
import { DriverTable } from './driver-table'
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OverviewTabProps {
  kpiCards: KPICard[]
  soTracker: SOTrackerType
  drivers: Driver[]
  alerts: Alert[]
  arbitrages: Arbitrage[]
  onDriverSelect: (driver: Driver) => void
  selectedDriverId?: string
}

export function OverviewTab({
  kpiCards,
  soTracker,
  drivers,
  alerts,
  arbitrages,
  onDriverSelect,
  selectedDriverId
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Indicateurs Cles
        </h2>
        <KPICards cards={kpiCards} />
      </section>

      {/* SO Tracker */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Objectif Strategique
        </h2>
        <SOTracker tracker={soTracker} />
      </section>

      {/* Driver Table */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Suivi Chauffeur par Chauffeur
        </h2>
        <DriverTable 
          drivers={drivers} 
          onDriverSelect={onDriverSelect}
          selectedDriverId={selectedDriverId}
        />
      </section>

      {/* Alerts & Arbitrages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Alertes Actives ({alerts.length})
          </h2>
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border",
                  alert.type === 'red' 
                    ? "bg-status-red/5 border-status-red/20" 
                    : "bg-status-yellow/5 border-status-yellow/20"
                )}
              >
                <AlertTriangle className={cn(
                  "w-4 h-4 mt-0.5 shrink-0",
                  alert.type === 'red' ? "text-status-red" : "text-status-yellow"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  {alert.ref && (
                    <span className="text-xs font-mono text-muted-foreground">{alert.ref}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Arbitrages */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Arbitrages en attente ({arbitrages.length})
          </h2>
          <div className="space-y-2">
            {arbitrages.map((arb, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-card"
              >
                <p className="text-sm text-foreground mb-2">{arb.description}</p>
                {arb.montant && (
                  <p className="text-xs font-mono text-primary mb-2">{arb.montant}</p>
                )}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-status-green/10 text-status-green text-xs font-medium hover:bg-status-green/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {arb.action}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-muted-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
                    <Clock className="w-3.5 h-3.5" />
                    Reporter
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-status-red/10 text-status-red text-xs font-medium hover:bg-status-red/20 transition-colors">
                    <XCircle className="w-3.5 h-3.5" />
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
