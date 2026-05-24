'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SyncBadge, StatusBadge } from '@/components/status-badges'
import { CARGO_TYPE_LABELS } from '@/lib/types'
import type { CargoMission } from '@/lib/types'
import {
  Truck,
  User,
  MapPin,
  Package,
  Clock,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface MissionCardProps {
  mission: CargoMission
  onStartLoading?: () => void
  onStartDelivery?: () => void
}

export function MissionCard({
  mission,
  onStartLoading,
  onStartDelivery,
}: MissionCardProps) {
  const canStartLoading = mission.status === 'assigned'
  const canStartDelivery =
    mission.status === 'departed_loading' ||
    mission.status === 'arrived_delivery'
  const hasAnomaly = mission.status === 'delivered_anomaly'

  return (
    <Card className="overflow-hidden border-border/50 bg-card transition-colors hover:border-border">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-primary">
                  {mission.id}
                </span>
                {hasAnomaly && (
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <span>{mission.truckPlate}</span>
                {mission.trailerNumber && (
                  <span className="text-muted-foreground">
                    / {mission.trailerNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={mission.status} />
            <SyncBadge status={mission.syncStatus} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Driver */}
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{mission.driverName}</span>
          </div>

          {/* Cargo */}
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{CARGO_TYPE_LABELS[mission.cargoType]}</span>
            {mission.estimatedTonnage && (
              <span className="text-muted-foreground">
                ({mission.estimatedTonnage}t)
              </span>
            )}
          </div>

          {/* Route */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-muted-foreground">{mission.mineSite}</div>
              <div className="my-1 ml-1.5 h-4 w-px bg-border" />
              <div>{mission.deliverySite}</div>
            </div>
          </div>

          {/* Last Event */}
          {mission.lastEvent && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{mission.lastEvent}</span>
              {mission.lastEventTimestamp && (
                <span className="text-xs">
                  {format(parseISO(mission.lastEventTimestamp), 'HH:mm', {
                    locale: fr,
                  })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-border/50 p-4">
          {canStartLoading && (
            <Button
              onClick={onStartLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Démarrer chargement
            </Button>
          )}
          {canStartDelivery && (
            <Button
              onClick={onStartDelivery}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Démarrer livraison
            </Button>
          )}
          <Link href={`/mission/${mission.id}`} className="flex-1">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Détails
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
