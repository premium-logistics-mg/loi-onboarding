'use client'

import { useParams, useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SyncBadge, StatusBadge } from '@/components/status-badges'
import { mockMissions, mockLoadingEvents, mockDeliveryEvents, mockAnomalies } from '@/lib/mock-data'
import { CARGO_TYPE_LABELS, MISSION_STATUS_LABELS } from '@/lib/types'
import {
  Truck,
  User,
  Package,
  MapPin,
  Clock,
  ChevronLeft,
  Phone,
  FileText,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ArrowRight,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const TIMELINE_EVENTS = [
  { status: 'assigned', label: 'Mission assignée', icon: FileText },
  { status: 'arrived_loading', label: 'Arrivé au site de chargement', icon: MapPin },
  { status: 'loading_started', label: 'Chargement démarré', icon: Package },
  { status: 'loading_completed', label: 'Chargement terminé', icon: CheckCircle2 },
  { status: 'departed_loading', label: 'Départ du site de chargement', icon: ArrowRight },
  { status: 'arrived_delivery', label: 'Arrivé au site de livraison', icon: MapPin },
  { status: 'unloading_started', label: 'Déchargement démarré', icon: Package },
  { status: 'delivered', label: 'Livraison confirmée', icon: CheckCircle2 },
]

export default function MissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const missionId = params.id as string

  const mission = mockMissions.find((m) => m.id === missionId)
  const loadingEvent = mockLoadingEvents.find((e) => e.missionId === missionId)
  const deliveryEvent = mockDeliveryEvents.find((e) => e.missionId === missionId)
  const anomalies = mockAnomalies.filter((a) => a.missionId === missionId)

  if (!mission) {
    return (
      <div className="flex min-h-screen flex-col bg-background pb-20">
        <AppHeader title="Mission" subtitle="Détails" />
        <main className="flex-1 px-4 py-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <Truck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Mission non trouvée</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cette mission n&apos;existe pas ou a été supprimée
            </p>
            <Button className="mt-4" onClick={() => router.push('/')}>
              Retour aux missions
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  const currentStatusIndex = TIMELINE_EVENTS.findIndex(
    (e) => e.status === mission.status || 
           (mission.status === 'delivered_anomaly' && e.status === 'delivered')
  )

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader
        title={mission.id}
        subtitle={mission.truckPlate}
      />

      <main className="flex-1 px-4 py-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour
        </Button>

        {/* Status & Sync */}
        <div className="mb-4 flex items-center gap-2">
          <StatusBadge status={mission.status} />
          <SyncBadge status={mission.syncStatus} />
          {anomalies.length > 0 && (
            <Badge className="bg-red-500/20 text-red-400">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {anomalies.length} anomalie(s)
            </Badge>
          )}
        </div>

        {/* Truck & Driver Info */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Véhicule & Chauffeur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plaque</span>
              <span className="font-mono font-medium">{mission.truckPlate}</span>
            </div>
            {mission.trailerNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Remorque</span>
                <span className="font-mono font-medium">{mission.trailerNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Chauffeur</span>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{mission.driverName}</span>
              </div>
            </div>
            {mission.driverPhone && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Téléphone</span>
                <a
                  href={`tel:${mission.driverPhone}`}
                  className="flex items-center gap-2 text-primary"
                >
                  <Phone className="h-4 w-4" />
                  <span>{mission.driverPhone}</span>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cargo Info */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Cargaison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="font-medium">
                {CARGO_TYPE_LABELS[mission.cargoType]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tonnage estimé</span>
              <span className="font-medium">{mission.estimatedTonnage}t</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Client</span>
              <span className="font-medium">{mission.clientName}</span>
            </div>
          </CardContent>
        </Card>

        {/* Route Info */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Itinéraire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                  <Circle className="h-3 w-3 fill-blue-400 text-blue-400" />
                </div>
                <div className="my-1 h-8 w-px bg-border" />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground">Origine</div>
                  <div className="font-medium">{mission.mineSite}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Destination</div>
                  <div className="font-medium">{mission.deliverySite}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Chronologie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TIMELINE_EVENTS.map((event, index) => {
                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const Icon = event.icon

                return (
                  <div key={event.status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted
                            ? isCurrent
                              ? 'bg-primary/20'
                              : 'bg-emerald-500/20'
                            : 'bg-secondary'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            isCompleted
                              ? isCurrent
                                ? 'text-primary'
                                : 'text-emerald-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      {index < TIMELINE_EVENTS.length - 1 && (
                        <div
                          className={`my-1 h-6 w-px ${
                            index < currentStatusIndex
                              ? 'bg-emerald-500/50'
                              : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div
                        className={`text-sm ${
                          isCurrent ? 'font-medium' : isCompleted ? '' : 'text-muted-foreground'
                        }`}
                      >
                        {event.label}
                      </div>
                      {isCurrent && (
                        <Badge className="mt-1 bg-primary/20 text-primary text-xs">
                          En cours
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        {(loadingEvent || deliveryEvent) && (
          <Card className="mb-4 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingEvent && (
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Bon de chargement</div>
                      <div className="text-xs text-muted-foreground">
                        {loadingEvent.loadingTicketNumber}
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
              )}
              {deliveryEvent && (
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Bon de livraison</div>
                      <div className="text-xs text-muted-foreground">
                        {deliveryEvent.deliveryTicketNumber}
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Photos */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Photos capturées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {['Camion vide', 'Bon chargement', 'Camion chargé', 'Arrivée', 'Déchargement'].map(
                (label, index) => (
                  <div
                    key={label}
                    className="flex aspect-square flex-col items-center justify-center rounded-lg bg-secondary"
                  >
                    <Camera className="h-6 w-6 text-muted-foreground" />
                    <span className="mt-1 text-xs text-muted-foreground text-center px-1">
                      {label}
                    </span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Anomalies */}
        {anomalies.length > 0 && (
          <Card className="mb-4 border-red-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Anomalies signalées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomalies.map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className="rounded-lg bg-red-500/10 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-red-400">
                        {anomaly.anomalyType.replace(/_/g, ' ')}
                      </span>
                      <Badge
                        className={
                          anomaly.severity === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : anomaly.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }
                      >
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-red-300/80">
                      {anomaly.description}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {format(parseISO(anomaly.timestamp), 'dd/MM/yyyy HH:mm', {
                        locale: fr,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync Log */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Journal de synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Assigné</span>
                <span>{format(parseISO(mission.assignedAt), 'dd/MM HH:mm', { locale: fr })}</span>
              </div>
              {mission.lastEventTimestamp && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Dernière mise à jour</span>
                  <span>
                    {format(parseISO(mission.lastEventTimestamp), 'dd/MM HH:mm', {
                      locale: fr,
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Statut sync</span>
                <SyncBadge status={mission.syncStatus} />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
