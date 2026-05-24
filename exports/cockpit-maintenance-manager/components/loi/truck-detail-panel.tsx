'use client'

import { cn } from '@/lib/utils'
import { 
  X, 
  Truck as TruckIcon, 
  Gauge, 
  Circle, 
  AlertTriangle,
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TruckDetail, TruckTire, MaintenanceHistory, PreventivePlan } from '@/lib/loi-types'

interface TruckDetailPanelProps {
  truck: TruckDetail | null
  onClose: () => void
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

function getTireColor(etat: string) {
  switch (etat) {
    case 'BON': return 'text-[#22c55e] bg-[#22c55e]/10'
    case 'MOYEN': return 'text-[#eab308] bg-[#eab308]/10'
    case 'REMPLACER': return 'text-[#ef4444] bg-[#ef4444]/10'
    default: return 'text-muted-foreground bg-muted/10'
  }
}

function getPreventiveStatusColor(status: string) {
  switch (status) {
    case 'ok': return 'text-[#22c55e]'
    case 'pre_alerte': return 'text-[#eab308]'
    case 'depassement': return 'text-[#ef4444]'
    default: return 'text-muted-foreground'
  }
}

function formatKm(km: number): string {
  return km.toLocaleString('fr-FR')
}

export function TruckDetailPanel({ truck, onClose }: TruckDetailPanelProps) {
  if (!truck) return null

  return (
    <div className="fixed top-14 right-0 bottom-0 w-[480px] bg-[#0d1929] border-l border-[#1e293b] z-50 flex flex-col">
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between p-4 border-b',
        getStatusBg(truck.status)
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center justify-center w-12 h-12 rounded-lg',
            truck.status === 'red' ? 'bg-[#ef4444]/20' : 
            truck.status === 'yellow' ? 'bg-[#eab308]/20' : 'bg-[#22c55e]/20'
          )}>
            <TruckIcon className={cn('w-6 h-6', getStatusColor(truck.status))} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-foreground">{truck.immatriculation}</span>
              <span className="text-sm text-muted-foreground">{truck.code}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Circle className={cn('w-2 h-2 fill-current', getStatusColor(truck.status))} />
              <span className={cn('text-xs', getStatusColor(truck.status))}>
                {truck.status === 'red' ? 'Immobilisé' : truck.status === 'yellow' ? 'Maintenance requise' : 'Opérationnel'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[#1e293b] transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* KPIs Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">KM Total</span>
              <span className="font-mono text-lg font-semibold text-foreground">{formatKm(truck.kmTotal)}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">KM/Mois</span>
              <span className="font-mono text-lg font-semibold text-foreground">{formatKm(truck.kpis.kmMois)}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Disponibilité</span>
              <span className={cn(
                'font-mono text-lg font-semibold',
                truck.disponibilite >= 95 ? 'text-[#22c55e]' : truck.disponibilite >= 80 ? 'text-[#eab308]' : 'text-[#ef4444]'
              )}>
                {truck.disponibilite}%
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Coût Maint/km</span>
              <span className={cn(
                'font-mono text-lg font-semibold',
                truck.kpis.coutMaintKm <= 100 ? 'text-[#22c55e]' : truck.kpis.coutMaintKm <= 120 ? 'text-[#eab308]' : 'text-[#ef4444]'
              )}>
                {truck.kpis.coutMaintKm} Ar
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Coût Pneu/km</span>
              <span className="font-mono text-lg font-semibold text-[#22c55e]">{truck.kpis.coutPneuKm} Ar</span>
            </div>
            <div className="p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Taux Préventif</span>
              <span className={cn(
                'font-mono text-lg font-semibold',
                truck.kpis.tauxPreventif >= 80 ? 'text-[#22c55e]' : truck.kpis.tauxPreventif >= 60 ? 'text-[#eab308]' : 'text-[#ef4444]'
              )}>
                {truck.kpis.tauxPreventif}%
              </span>
            </div>
          </div>

          {/* Alerts */}
          {truck.alertes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                Alertes actives ({truck.alertes.length})
              </h4>
              <div className="space-y-2">
                {truck.alertes.map((alerte, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30"
                  >
                    <span className="text-sm text-[#ef4444]">{alerte}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Maintenance */}
          <div className="p-4 rounded-lg bg-[#111d2e] border border-[#1e293b]">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#2dd4bf]" />
              Prochaine Maintenance
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">{truck.kpis.prochaineMaint}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  Dernière: {truck.kpis.derniereMaint}
                </span>
              </div>
              <div className={cn(
                'px-3 py-1.5 rounded-lg font-mono text-sm font-semibold',
                truck.kpis.kmAvantMaint < 0 
                  ? 'bg-[#ef4444]/10 text-[#ef4444]' 
                  : truck.kpis.kmAvantMaint < 1000 
                    ? 'bg-[#eab308]/10 text-[#eab308]' 
                    : 'bg-[#22c55e]/10 text-[#22c55e]'
              )}>
                {truck.kpis.kmAvantMaint < 0 
                  ? `${Math.abs(truck.kpis.kmAvantMaint)} km dépassés`
                  : `${formatKm(truck.kpis.kmAvantMaint)} km`
                }
              </div>
            </div>
          </div>

          {/* Tire Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[#2dd4bf]" />
              État Pneus ({truck.pneus.length}/22 affichés)
            </h4>
            <div className="space-y-2">
              {truck.pneus.map((pneu, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#111d2e] border border-[#1e293b]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground w-28">{pneu.position}</span>
                    <span className="text-xs text-foreground">{pneu.marque} {pneu.profil}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{formatKm(pneu.kmEffectue)} km</span>
                    <div className="w-16 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full',
                          pneu.etat === 'BON' ? 'bg-[#22c55e]' : 
                          pneu.etat === 'MOYEN' ? 'bg-[#eab308]' : 'bg-[#ef4444]'
                        )}
                        style={{ width: `${pneu.usurePourcent}%` }}
                      />
                    </div>
                    <span className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded',
                      getTireColor(pneu.etat)
                    )}>
                      {pneu.etat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preventive Plan */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2dd4bf]" />
              Plan Préventif
            </h4>
            <div className="space-y-2">
              {truck.planPreventif.map((plan, index) => (
                <div 
                  key={index}
                  className={cn(
                    'p-3 rounded-lg border',
                    plan.status === 'depassement' ? 'bg-[#ef4444]/5 border-[#ef4444]/30' :
                    plan.status === 'pre_alerte' ? 'bg-[#eab308]/5 border-[#eab308]/30' :
                    'bg-[#111d2e] border-[#1e293b]'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">{plan.intervention}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        Intervalle: {plan.intervalle}
                      </span>
                    </div>
                    <span className={cn(
                      'font-mono text-xs font-semibold',
                      getPreventiveStatusColor(plan.status)
                    )}>
                      {plan.kmRestants < 0 
                        ? `${Math.abs(plan.kmRestants)} km dépassés`
                        : `${formatKm(plan.kmRestants)} km restants`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance History */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2dd4bf]" />
              Historique OT (5 dernières)
            </h4>
            <div className="space-y-2">
              {truck.historiqueOT.map((ot, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#2dd4bf]">{ot.ref}</span>
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded',
                        ot.type === 'préventif' 
                          ? 'bg-[#22c55e]/10 text-[#22c55e]' 
                          : 'bg-[#eab308]/10 text-[#eab308]'
                      )}>
                        {ot.type}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{ot.date}</span>
                  </div>
                  <span className="text-sm text-foreground">{ot.description}</span>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Coût: <span className="font-mono text-foreground">{ot.cout}</span></span>
                    <span>Durée: <span className="font-mono text-foreground">{ot.duree}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
