'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Driver } from '@/lib/loi-types'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, AlertTriangle, Fuel, Route, Gauge } from 'lucide-react'

interface DriverTableProps {
  drivers: Driver[]
  onDriverSelect: (driver: Driver) => void
  selectedDriverId?: string
}

type FilterType = 'all' | 'red' | 'yellow' | 'green'

function getStatusBadge(status: 'green' | 'yellow' | 'red') {
  switch (status) {
    case 'green':
      return <Badge variant="outline" className="bg-status-green/10 text-status-green border-status-green/30">Conforme</Badge>
    case 'yellow':
      return <Badge variant="outline" className="bg-status-yellow/10 text-status-yellow border-status-yellow/30">Attention</Badge>
    case 'red':
      return <Badge variant="outline" className="bg-status-red/10 text-status-red border-status-red/30">Alerte</Badge>
  }
}

function getScoreColor(score: number) {
  if (score >= 75) return 'text-status-green'
  if (score >= 60) return 'text-status-yellow'
  return 'text-status-red'
}

function getConsoColor(conso: number, objectif: number) {
  const ecart = ((conso - objectif) / objectif) * 100
  if (ecart <= 0) return 'text-status-green'
  if (ecart <= 5) return 'text-status-yellow'
  return 'text-status-red'
}

function getConformiteColor(conformite: number) {
  if (conformite >= 95) return 'text-status-green'
  if (conformite >= 90) return 'text-status-yellow'
  return 'text-status-red'
}

export function DriverTable({ drivers, onDriverSelect, selectedDriverId }: DriverTableProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredDrivers = drivers.filter(driver => {
    if (filter === 'all') return true
    return driver.status === filter
  })

  const counts = {
    all: drivers.length,
    red: drivers.filter(d => d.status === 'red').length,
    yellow: drivers.filter(d => d.status === 'yellow').length,
    green: drivers.filter(d => d.status === 'green').length
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-3 border-b border-border bg-secondary/30">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            filter === 'all' 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:bg-secondary"
          )}
        >
          Tous ({counts.all})
        </button>
        <button
          onClick={() => setFilter('red')}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
            filter === 'red' 
              ? "bg-status-red text-white" 
              : "text-muted-foreground hover:bg-secondary"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-status-red" />
          En alerte ({counts.red})
        </button>
        <button
          onClick={() => setFilter('yellow')}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
            filter === 'yellow' 
              ? "bg-status-yellow text-background" 
              : "text-muted-foreground hover:bg-secondary"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-status-yellow" />
          Attention ({counts.yellow})
        </button>
        <button
          onClick={() => setFilter('green')}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
            filter === 'green' 
              ? "bg-status-green text-background" 
              : "text-muted-foreground hover:bg-secondary"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-status-green" />
          Conformes ({counts.green})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-xs text-muted-foreground font-medium">NOM</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">CAMION</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">CORRIDOR</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  CONSO L/KM
                </div>
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  CONFORMITE
                </div>
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">VOYAGES</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">INCIDENTS</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  SCORE
                </div>
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">STATUT</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow
                key={driver.id}
                onClick={() => onDriverSelect(driver)}
                className={cn(
                  "cursor-pointer transition-colors border-border",
                  selectedDriverId === driver.id 
                    ? "bg-primary/10" 
                    : "hover:bg-secondary/50"
                )}
              >
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {driver.alertes.length > 0 && (
                      <AlertTriangle className="w-4 h-4 text-status-red" />
                    )}
                    {driver.nom}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {driver.camion}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {driver.corridor}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "font-mono text-sm font-medium",
                      getConsoColor(driver.consoLkm, driver.consoObjectif)
                    )}>
                      {driver.consoLkm.toFixed(3)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {driver.consoObjectif.toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "font-mono text-sm font-medium",
                    getConformiteColor(driver.conformiteTrajet)
                  )}>
                    {driver.conformiteTrajet}%
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {driver.voyagesMois}
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "font-mono text-sm",
                    driver.incidents > 0 ? "text-status-red font-medium" : "text-muted-foreground"
                  )}>
                    {driver.incidents}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "font-mono text-lg font-bold",
                    getScoreColor(driver.score)
                  )}>
                    {driver.score}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(driver.status)}
                </TableCell>
                <TableCell>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
