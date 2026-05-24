'use client'

import { cn } from '@/lib/utils'
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle,
  Clock,
  Trophy,
  XCircle,
  Circle
} from 'lucide-react'
import type { 
  Pipeline, 
  Indicator, 
  Deadline, 
  Alert, 
  Arbitrage,
  TireBrandComparison,
  TruckRanking 
} from '@/lib/loi-types'

interface PilotageTabProps {
  pipelines: Pipeline[]
  indicators: Indicator[]
  deadlines: Deadline[]
  alerts: Alert[]
  arbitrages: Arbitrage[]
  tireBrands: TireBrandComparison[]
  topCostTrucks: TruckRanking[]
  worstCostTrucks: TruckRanking[]
  tireStats: {
    total: number
    bon: number
    moyen: number
    aRemplacer: number
    nonEvalue: number
    kmMoyenEffectue: number
    resteMoyenPourcent: number
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'green': return 'text-[#22c55e]'
    case 'yellow': return 'text-[#eab308]'
    case 'red': return 'text-[#ef4444]'
    default: return 'text-muted-foreground'
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case 'green': return 'bg-[#22c55e]/10 border-[#22c55e]/30'
    case 'yellow': return 'bg-[#eab308]/10 border-[#eab308]/30'
    case 'red': return 'bg-[#ef4444]/10 border-[#ef4444]/30'
    default: return 'bg-[#1e293b] border-[#1e293b]'
  }
}

function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  const total = pipeline.steps.reduce((sum, step) => sum + step.count, 0)
  
  return (
    <div className="p-4 rounded-xl bg-[#111d2e] border border-[#1e293b]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground">{pipeline.title}</h4>
        <span className="text-xs text-muted-foreground">{total} items</span>
      </div>
      <div className="flex items-center gap-1">
        {pipeline.steps.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className={cn(
              'w-full h-8 rounded flex items-center justify-center text-sm font-mono font-semibold',
              step.count > 0 
                ? 'bg-[#2dd4bf]/10 text-[#2dd4bf] border border-[#2dd4bf]/30' 
                : 'bg-[#1e293b] text-muted-foreground border border-[#1e293b]'
            )}>
              {step.count}
            </div>
            <span className="text-[9px] text-muted-foreground mt-1 text-center leading-tight">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function IndicatorRow({ indicator }: { indicator: Indicator }) {
  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-lg border',
      getStatusBg(indicator.status)
    )}>
      <div className="flex-1">
        <span className="text-sm text-foreground">{indicator.label}</span>
        <span className="block text-xs text-muted-foreground mt-0.5">{indicator.detail}</span>
      </div>
      <span className={cn('font-mono text-sm font-semibold', getStatusColor(indicator.status))}>
        {indicator.value}
      </span>
    </div>
  )
}

function DeadlineRow({ deadline }: { deadline: Deadline }) {
  const getStatusIcon = () => {
    switch (deadline.status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-[#22c55e]" />
      case 'in_progress': return <Clock className="w-4 h-4 text-[#2dd4bf]" />
      default: return <Circle className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1e293b]/50 transition-colors">
      {getStatusIcon()}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-foreground block truncate">{deadline.objet}</span>
        <span className="text-xs text-muted-foreground">{deadline.camion} · {deadline.responsable}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{deadline.date}</span>
        <span className={cn(
          'font-mono text-xs px-2 py-0.5 rounded',
          deadline.jMoins === 'J-0' || deadline.jMoins === 'J-1' 
            ? 'bg-[#ef4444]/10 text-[#ef4444]' 
            : 'bg-[#1e293b] text-muted-foreground'
        )}>
          {deadline.jMoins}
        </span>
      </div>
    </div>
  )
}

function AlertRow({ alert }: { alert: Alert }) {
  return (
    <div className={cn(
      'flex items-start gap-2 p-3 rounded-lg border',
      alert.type === 'red' ? 'bg-[#ef4444]/5 border-[#ef4444]/30' : 'bg-[#eab308]/5 border-[#eab308]/30'
    )}>
      <AlertTriangle className={cn('w-4 h-4 mt-0.5 shrink-0', getStatusColor(alert.type))} />
      <span className={cn('text-sm', getStatusColor(alert.type))}>{alert.message}</span>
    </div>
  )
}

function ArbitrageRow({ arbitrage }: { arbitrage: Arbitrage }) {
  return (
    <div className="p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]">
      <span className="text-sm text-foreground block mb-2">{arbitrage.description}</span>
      <div className="flex items-center justify-between">
        {arbitrage.montant && (
          <span className="text-xs font-mono text-muted-foreground">{arbitrage.montant}</span>
        )}
        <button className="px-3 py-1 rounded bg-[#2dd4bf]/10 text-[#2dd4bf] text-xs font-medium border border-[#2dd4bf]/30 hover:bg-[#2dd4bf]/20 transition-colors">
          {arbitrage.action}
        </button>
      </div>
    </div>
  )
}

export function PilotageTab({
  pipelines,
  indicators,
  deadlines,
  alerts,
  arbitrages,
  tireBrands,
  topCostTrucks,
  worstCostTrucks,
  tireStats
}: PilotageTabProps) {
  return (
    <div className="space-y-6">
      {/* Pipelines */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Pipelines</h3>
        <div className="grid grid-cols-3 gap-4">
          {pipelines.map((pipeline) => (
            <PipelineCard key={pipeline.id} pipeline={pipeline} />
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-8 space-y-6">
          {/* Indicators */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Indicateurs Pilotage</h3>
            <div className="space-y-2">
              {indicators.map((indicator, index) => (
                <IndicatorRow key={index} indicator={indicator} />
              ))}
            </div>
          </div>

          {/* Truck Rankings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#111d2e] border border-[#1e293b]">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#22c55e]" />
                TOP 5 — Meilleur Coût/km
              </h4>
              <div className="space-y-2">
                {topCostTrucks.map((truck) => (
                  <div key={truck.position} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground w-4">{truck.position}.</span>
                      <span className="font-mono text-foreground">{truck.immatriculation}</span>
                      <span className="text-xs text-muted-foreground">({truck.code})</span>
                    </div>
                    <span className="font-mono text-[#22c55e]">{truck.coutKm}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#111d2e] border border-[#1e293b]">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                TOP 5 — Coût Critique
              </h4>
              <div className="space-y-2">
                {worstCostTrucks.map((truck) => (
                  <div key={truck.position} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground w-5">{truck.position}.</span>
                      <span className="font-mono text-foreground">{truck.immatriculation}</span>
                      <span className="text-xs text-muted-foreground">({truck.code})</span>
                      {truck.alert && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ef4444]/10 text-[#ef4444]">
                          {truck.alert}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[#ef4444]">{truck.coutKm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tire Brand Comparison */}
          <div className="p-4 rounded-xl bg-[#111d2e] border border-[#1e293b]">
            <h4 className="text-sm font-semibold text-foreground mb-4">Comparatif Marques Pneus</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e293b]">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Marque</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground">KM moyen avant HS</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground">Taux éclatement</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground">Coût/km</th>
                    <th className="text-center py-2 text-xs font-medium text-muted-foreground">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {tireBrands.map((brand) => (
                    <tr key={brand.marque} className="border-b border-[#1e293b]/50">
                      <td className="py-2 font-medium text-foreground">{brand.marque}</td>
                      <td className="py-2 text-right font-mono text-foreground">{brand.kmMoyenAvantHS}</td>
                      <td className={cn(
                        'py-2 text-right font-mono',
                        parseFloat(brand.tauxEclatement) > 30 ? 'text-[#ef4444]' : 
                        parseFloat(brand.tauxEclatement) > 10 ? 'text-[#eab308]' : 'text-[#22c55e]'
                      )}>
                        {brand.tauxEclatement}
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">{brand.coutKmEstime}</td>
                      <td className="py-2 text-center">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded',
                          brand.verdict === 'Meilleur' ? 'bg-[#22c55e]/10 text-[#22c55e]' :
                          brand.verdict.includes('Éviter') ? 'bg-[#ef4444]/10 text-[#ef4444]' :
                          'bg-[#1e293b] text-muted-foreground'
                        )}>
                          {brand.verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-6">
          {/* Tire Stats */}
          <div className="p-4 rounded-xl bg-[#111d2e] border border-[#1e293b]">
            <h4 className="text-sm font-semibold text-foreground mb-4">État Global Pneus</h4>
            <div className="space-y-3">
              <div className="text-center mb-4">
                <span className="font-mono text-3xl font-bold text-foreground">{tireStats.total}</span>
                <span className="block text-xs text-muted-foreground">pneus suivis</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                    BON
                  </span>
                  <span className="font-mono text-sm text-[#22c55e]">{tireStats.bon} ({Math.round(tireStats.bon/tireStats.total*100)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#eab308]" />
                    MOYEN
                  </span>
                  <span className="font-mono text-sm text-[#eab308]">{tireStats.moyen} ({Math.round(tireStats.moyen/tireStats.total*100)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                    À REMPLACER
                  </span>
                  <span className="font-mono text-sm text-[#ef4444]">{tireStats.aRemplacer} ({Math.round(tireStats.aRemplacer/tireStats.total*100)}%)</span>
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-[#1e293b]">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>KM moyen effectué</span>
                  <span className="font-mono text-foreground">{tireStats.kmMoyenEffectue.toLocaleString('fr-FR')} km</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>Reste moyen</span>
                  <span className="font-mono text-foreground">{tireStats.resteMoyenPourcent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deadlines */}
          <div className="p-4 rounded-xl bg-[#111d2e] border border-[#1e293b]">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2dd4bf]" />
              Échéances (7 jours)
            </h4>
            <div className="space-y-1">
              {deadlines.map((deadline, index) => (
                <DeadlineRow key={index} deadline={deadline} />
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              Alertes ({alerts.length})
            </h4>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <AlertRow key={index} alert={alert} />
              ))}
            </div>
          </div>

          {/* Arbitrages */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Arbitrages en attente</h4>
            <div className="space-y-2">
              {arbitrages.map((arbitrage, index) => (
                <ArbitrageRow key={index} arbitrage={arbitrage} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
