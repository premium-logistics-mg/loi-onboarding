'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SyncBadge, SeverityBadge } from '@/components/status-badges'
import { mockAnomalies } from '@/lib/mock-data'
import { ANOMALY_TYPE_LABELS, SITE_TYPE_LABELS } from '@/lib/types'
import {
  AlertTriangle,
  Plus,
  Truck,
  MapPin,
  Clock,
  ChevronRight,
  Filter,
  ArrowUpCircle,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function AnomaliesPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filters = [
    { id: 'all', label: 'Tous', count: mockAnomalies.length },
    { id: 'critical', label: 'Critique', count: mockAnomalies.filter(a => a.severity === 'critical').length },
    { id: 'high', label: 'Élevé', count: mockAnomalies.filter(a => a.severity === 'high').length },
    { id: 'escalated', label: 'Escaladé', count: mockAnomalies.filter(a => a.escalated).length },
  ]

  const filteredAnomalies = mockAnomalies.filter((anomaly) => {
    if (!activeFilter || activeFilter === 'all') return true
    if (activeFilter === 'critical') return anomaly.severity === 'critical'
    if (activeFilter === 'high') return anomaly.severity === 'high'
    if (activeFilter === 'escalated') return anomaly.escalated
    return true
  })

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader
        title="Anomalies"
        subtitle="Incidents et exceptions"
      />

      <main className="flex-1 px-4 py-4">
        {/* New Anomaly Button */}
        <Button
          className="mb-4 w-full bg-red-500 text-white hover:bg-red-600"
          size="lg"
          onClick={() => router.push('/anomalies/new')}
        >
          <Plus className="mr-2 h-5 w-5" />
          Signaler une anomalie
        </Button>

        {/* Filters */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id || (!activeFilter && filter.id === 'all') ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="shrink-0"
            >
              {filter.label}
              <Badge
                variant="outline"
                className="ml-1.5 h-5 min-w-5 px-1 text-xs"
              >
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Anomalies List */}
        <div className="space-y-4">
          {filteredAnomalies.map((anomaly) => (
            <Card key={anomaly.id} className="overflow-hidden border-border/50 bg-card">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      anomaly.severity === 'critical' ? 'bg-red-500/20' :
                      anomaly.severity === 'high' ? 'bg-orange-500/20' :
                      anomaly.severity === 'medium' ? 'bg-amber-500/20' :
                      'bg-slate-500/20'
                    }`}>
                      <AlertTriangle className={`h-6 w-6 ${
                        anomaly.severity === 'critical' ? 'text-red-400' :
                        anomaly.severity === 'high' ? 'text-orange-400' :
                        anomaly.severity === 'medium' ? 'text-amber-400' :
                        'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-primary">
                          {anomaly.id}
                        </span>
                        {anomaly.escalated && (
                          <ArrowUpCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        {ANOMALY_TYPE_LABELS[anomaly.anomalyType]}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <SeverityBadge severity={anomaly.severity} />
                    <SyncBadge status={anomaly.syncStatus} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 p-4">
                  {/* Truck & Mission */}
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{anomaly.truckPlate}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{anomaly.missionId}</span>
                  </div>

                  {/* Site */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{SITE_TYPE_LABELS[anomaly.siteType]}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {anomaly.description}
                  </p>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(parseISO(anomaly.timestamp), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </span>
                  </div>

                  {anomaly.immediateAction && (
                    <div className="rounded-lg bg-secondary p-3 text-sm">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Action immédiate:
                      </div>
                      {anomaly.immediateAction}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-border/50 p-4">
                  {anomaly.escalated ? (
                    <Badge className="bg-red-500/20 text-red-400">
                      <ArrowUpCircle className="mr-1 h-3 w-3" />
                      Escaladé au Manager
                    </Badge>
                  ) : (
                    <Button variant="destructive" size="sm">
                      <ArrowUpCircle className="mr-1 h-4 w-4" />
                      Escalader
                    </Button>
                  )}
                  <Button variant="secondary" size="sm">
                    Détails
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAnomalies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
                <AlertTriangle className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium">Aucune anomalie</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Toutes les opérations se déroulent normalement
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
