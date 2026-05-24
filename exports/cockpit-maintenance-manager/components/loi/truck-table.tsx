'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Search, 
  Filter, 
  AlertTriangle,
  Wrench,
  Circle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Truck } from '@/lib/loi-types'

interface TruckTableProps {
  trucks: Truck[]
  onTruckSelect: (truck: Truck) => void
  selectedTruckId?: string
}

type FilterStatus = 'all' | 'red' | 'yellow' | 'green'

function getStatusIcon(status: string) {
  switch (status) {
    case 'green': return <Circle className="w-2.5 h-2.5 fill-[#22c55e] text-[#22c55e]" />
    case 'yellow': return <Circle className="w-2.5 h-2.5 fill-[#eab308] text-[#eab308]" />
    case 'red': return <Circle className="w-2.5 h-2.5 fill-[#ef4444] text-[#ef4444]" />
    default: return <Circle className="w-2.5 h-2.5 fill-muted text-muted" />
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'green': return 'Opérationnel'
    case 'yellow': return 'Maintenance requise'
    case 'red': return 'Immobilisé'
    default: return 'Inconnu'
  }
}

function formatKm(km: number): string {
  return km.toLocaleString('fr-FR')
}

export function TruckTable({ trucks, onTruckSelect, selectedTruckId }: TruckTableProps) {
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')

  const filteredTrucks = trucks.filter(truck => {
    const matchesFilter = filter === 'all' || truck.status === filter
    const matchesSearch = search === '' || 
      truck.immatriculation.toLowerCase().includes(search.toLowerCase()) ||
      truck.code.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const counts = {
    all: trucks.length,
    red: trucks.filter(t => t.status === 'red').length,
    yellow: trucks.filter(t => t.status === 'yellow').length,
    green: trucks.filter(t => t.status === 'green').length
  }

  return (
    <div className="rounded-xl bg-[#111d2e] border border-[#1e293b] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#1e293b]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#2dd4bf]" />
            Suivi Camion par Camion
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-9 h-8 bg-[#0a1628] border-[#1e293b] text-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              filter === 'all'
                ? 'bg-[#2dd4bf]/10 text-[#2dd4bf] border border-[#2dd4bf]/30'
                : 'bg-[#0a1628] text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            Tous ({counts.all})
          </button>
          <button
            onClick={() => setFilter('red')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5',
              filter === 'red'
                ? 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30'
                : 'bg-[#0a1628] text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            <Circle className="w-2 h-2 fill-[#ef4444] text-[#ef4444]" />
            Immobilisé ({counts.red})
          </button>
          <button
            onClick={() => setFilter('yellow')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5',
              filter === 'yellow'
                ? 'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/30'
                : 'bg-[#0a1628] text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            <Circle className="w-2 h-2 fill-[#eab308] text-[#eab308]" />
            Maintenance requise ({counts.yellow})
          </button>
          <button
            onClick={() => setFilter('green')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5',
              filter === 'green'
                ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30'
                : 'bg-[#0a1628] text-muted-foreground hover:text-foreground border border-transparent'
            )}
          >
            <Circle className="w-2 h-2 fill-[#22c55e] text-[#22c55e]" />
            Opérationnel ({counts.green})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] bg-[#0a1628]/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Immat</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Code</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">KM Total</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">KM/Mois</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Coût Pneu/km</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Pneus</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Prochaine Maint.</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">OT</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrucks.map((truck) => (
              <tr
                key={truck.id}
                onClick={() => onTruckSelect(truck)}
                className={cn(
                  'border-b border-[#1e293b]/50 cursor-pointer transition-all',
                  selectedTruckId === truck.id
                    ? 'bg-[#2dd4bf]/5 border-l-2 border-l-[#2dd4bf]'
                    : 'hover:bg-[#1e293b]/30'
                )}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {truck.immatriculation}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-muted-foreground">
                    {truck.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-sm text-foreground">
                    {formatKm(truck.kmTotal)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-sm text-foreground">
                    {formatKm(truck.kmMois)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    'font-mono text-sm',
                    truck.coutPneuKm > 30 ? 'text-[#eab308]' : 'text-[#22c55e]'
                  )}>
                    {truck.coutPneuKm.toFixed(1)} Ar
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {truck.pneusARemplacer > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ef4444]/10 text-[#ef4444] text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      {truck.pneusARemplacer}
                    </span>
                  ) : (
                    <span className="text-xs text-[#22c55e]">OK</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{truck.prochaineMaint}</span>
                    <span className={cn(
                      'text-xs font-mono',
                      truck.kmAvantMaint < 0 
                        ? 'text-[#ef4444]' 
                        : truck.kmAvantMaint < 1000 
                          ? 'text-[#eab308]' 
                          : 'text-muted-foreground'
                    )}>
                      {truck.kmAvantMaint < 0 
                        ? `${Math.abs(truck.kmAvantMaint)} km dépassés`
                        : `${formatKm(truck.kmAvantMaint)} km restants`
                      }
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {truck.otEnCours > 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#eab308]/10 text-[#eab308] text-xs font-semibold">
                      {truck.otEnCours}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {getStatusIcon(truck.status)}
                    <span className={cn(
                      'text-xs',
                      truck.status === 'green' ? 'text-[#22c55e]' : 
                      truck.status === 'yellow' ? 'text-[#eab308]' : 
                      'text-[#ef4444]'
                    )}>
                      {getStatusLabel(truck.status)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
