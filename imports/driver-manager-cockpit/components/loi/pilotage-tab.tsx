'use client'

import { cn } from '@/lib/utils'
import type { Pipeline, Indicateur } from '@/lib/loi-types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, AlertTriangle, ArrowRight } from 'lucide-react'

interface PilotageTabProps {
  pipelines: Pipeline[]
  indicateurs: Indicateur[]
  ranking: {
    top5: { rank: number; nom: string; score: number; camion: string }[]
    bottom5: { rank: number; nom: string; score: number; camion: string; critical?: boolean }[]
  }
  standards: {
    corridors: { corridor: string; sens: string; tempsStandard: string }[]
    consommation: { type: string; objectif: string }[]
  }
}

function getStatusColor(status: 'green' | 'yellow' | 'red') {
  switch (status) {
    case 'green': return 'text-status-green'
    case 'yellow': return 'text-status-yellow'
    case 'red': return 'text-status-red'
  }
}

function getStatusBgColor(status: 'green' | 'yellow' | 'red') {
  switch (status) {
    case 'green': return 'bg-status-green/10 border-status-green/20'
    case 'yellow': return 'bg-status-yellow/10 border-status-yellow/20'
    case 'red': return 'bg-status-red/10 border-status-red/20'
  }
}

export function PilotageTab({ pipelines, indicateurs, ranking, standards }: PilotageTabProps) {
  return (
    <div className="space-y-6">
      {/* Pipelines */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Pipelines Operationnels
        </h2>
        <div className="space-y-4">
          {pipelines.map((pipeline) => (
            <div key={pipeline.name} className="p-4 rounded-lg bg-card border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">{pipeline.name}</h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {pipeline.stages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex flex-col items-center min-w-[100px]">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-1">
                        <span className="text-lg">{stage.icon}</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-center whitespace-nowrap">
                        {stage.label}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "mt-1 font-mono",
                          stage.count > 5 && "bg-status-yellow/20 text-status-yellow",
                          stage.count === 0 && "bg-status-green/20 text-status-green"
                        )}
                      >
                        {stage.count}
                      </Badge>
                    </div>
                    {idx < pipeline.stages.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Indicateurs Pilotage */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Indicateurs Pilotage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {indicateurs.map((ind, idx) => (
            <div 
              key={idx}
              className={cn(
                "p-4 rounded-lg border",
                getStatusBgColor(ind.status)
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-muted-foreground">{ind.label}</span>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  ind.status === 'green' && "bg-status-green",
                  ind.status === 'yellow' && "bg-status-yellow",
                  ind.status === 'red' && "bg-status-red"
                )} />
              </div>
              <div className={cn("font-mono text-xl font-bold mb-1", getStatusColor(ind.status))}>
                {ind.value}
              </div>
              <p className="text-xs text-muted-foreground">{ind.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ranking Chauffeurs */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Classement Chauffeurs
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top 5 */}
          <div className="p-4 rounded-lg bg-status-green/5 border border-status-green/20">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-status-green" />
              <h3 className="text-sm font-semibold text-status-green">TOP 5 PERFORMANTS</h3>
            </div>
            <div className="space-y-2">
              {ranking.top5.map((driver) => (
                <div key={driver.rank} className="flex items-center justify-between p-2 rounded-md bg-card">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-status-green/20 flex items-center justify-center text-xs font-bold text-status-green">
                      {driver.rank}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-foreground">{driver.nom}</span>
                      <span className="text-xs text-muted-foreground ml-2 font-mono">{driver.camion}</span>
                    </div>
                  </div>
                  <span className="font-mono text-lg font-bold text-status-green">{driver.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom 5 */}
          <div className="p-4 rounded-lg bg-status-red/5 border border-status-red/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-status-red" />
              <h3 className="text-sm font-semibold text-status-red">BOTTOM 5 — PLAN D&apos;ACTION REQUIS</h3>
            </div>
            <div className="space-y-2">
              {ranking.bottom5.map((driver) => (
                <div 
                  key={driver.rank} 
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md",
                    driver.critical ? "bg-status-red/10 border border-status-red/30" : "bg-card"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-status-red/20 flex items-center justify-center text-xs font-bold text-status-red">
                      {driver.rank}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-foreground">{driver.nom}</span>
                      <span className="text-xs text-muted-foreground ml-2 font-mono">{driver.camion}</span>
                      {driver.critical && (
                        <Badge variant="destructive" className="ml-2 text-[10px]">CRITIQUE</Badge>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-lg font-bold text-status-red">{driver.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Standards de Reference */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Standards de Reference
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Temps corridors */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Temps Trajet par Corridor</h3>
            <div className="space-y-2">
              {standards.corridors.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{c.corridor}</span>
                    <span className="text-xs text-muted-foreground">({c.sens})</span>
                  </div>
                  <span className="font-mono text-sm font-medium text-primary">{c.tempsStandard}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consommation */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Objectifs Consommation</h3>
            <div className="space-y-2">
              {standards.consommation.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{c.type}</span>
                  <span className="font-mono text-sm font-medium text-primary">{c.objectif}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
