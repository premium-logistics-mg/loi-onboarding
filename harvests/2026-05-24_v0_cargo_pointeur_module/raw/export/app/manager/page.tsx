'use client'

import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { mockManagerStats, mockAnomalies, mockMissions } from '@/lib/mock-data'
import { SeverityBadge, SyncBadge } from '@/components/status-badges'
import { ANOMALY_TYPE_LABELS } from '@/lib/types'
import {
  Truck,
  Package,
  Clock,
  AlertTriangle,
  Scale,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  CheckCircle2,
  Timer,
  MapPin,
  CloudOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
}: StatCardProps) {
  const bgColors = {
    default: 'bg-secondary',
    success: 'bg-emerald-500/10',
    warning: 'bg-amber-500/10',
    danger: 'bg-red-500/10',
  }

  const iconColors = {
    default: 'text-primary',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    danger: 'text-red-400',
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColors[variant]}`}
          >
            <div className={iconColors[variant]}>{icon}</div>
          </div>
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 text-xs ${
                trend === 'up'
                  ? 'text-emerald-400'
                  : trend === 'down'
                  ? 'text-red-400'
                  : 'text-muted-foreground'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : trend === 'down' ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              {trendValue}
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
          {subtitle && (
            <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ManagerFeedPage() {
  const stats = mockManagerStats

  const loadingProgress = (stats.trucksLoadedToday / (stats.trucksLoadedToday + stats.trucksWaitingMine)) * 100
  const deliveryProgress = (stats.trucksDeliveredToday / (stats.trucksDeliveredToday + stats.trucksWaitingDelivery)) * 100
  const tonnageEfficiency = (stats.tonnageDelivered / stats.tonnageLoaded) * 100

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader
        title="Manager Feed"
        subtitle="Tableau de bord opérationnel"
      />

      <main className="flex-1 px-4 py-4">
        {/* Refresh Button */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Vue d&apos;ensemble</h2>
            <p className="text-sm text-muted-foreground">
              Données en temps réel du terrain
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>

        {/* Sync Status Alert */}
        {stats.unsyncedEvents > 0 && (
          <Card className="mb-4 border-amber-500/30 bg-amber-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                  <CloudOff className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-amber-400">
                    Événements non synchronisés
                  </div>
                  <div className="text-sm text-amber-300/80">
                    {stats.unsyncedEvents} événement(s) en attente de sync
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400">
                  {stats.unsyncedEvents}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Stats Grid */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <StatCard
            title="Camions chargés"
            value={stats.trucksLoadedToday}
            icon={<Package className="h-5 w-5" />}
            variant="success"
            trend="up"
            trendValue="+3 vs hier"
          />
          <StatCard
            title="Camions livrés"
            value={stats.trucksDeliveredToday}
            icon={<CheckCircle2 className="h-5 w-5" />}
            variant="success"
            trend="up"
            trendValue="+2 vs hier"
          />
          <StatCard
            title="En attente mine"
            value={stats.trucksWaitingMine}
            icon={<Clock className="h-5 w-5" />}
            variant="warning"
          />
          <StatCard
            title="En attente livraison"
            value={stats.trucksWaitingDelivery}
            icon={<MapPin className="h-5 w-5" />}
            variant="warning"
          />
        </div>

        {/* Progress Cards */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Progression journalière
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Chargement</span>
                <span className="text-muted-foreground">
                  {stats.trucksLoadedToday}/{stats.trucksLoadedToday + stats.trucksWaitingMine} camions
                </span>
              </div>
              <Progress value={loadingProgress} className="h-2" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Livraison</span>
                <span className="text-muted-foreground">
                  {stats.trucksDeliveredToday}/{stats.trucksDeliveredToday + stats.trucksWaitingDelivery} camions
                </span>
              </div>
              <Progress value={deliveryProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Timing Stats */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              Temps moyens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.averageLoadingTime}
                  <span className="text-sm font-normal text-muted-foreground"> min</span>
                </div>
                <div className="text-sm text-muted-foreground">Temps chargement</div>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.averageUnloadingTime}
                  <span className="text-sm font-normal text-muted-foreground"> min</span>
                </div>
                <div className="text-sm text-muted-foreground">Temps déchargement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tonnage Stats */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              Tonnage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary p-4">
                <div className="text-2xl font-bold">
                  {stats.tonnageLoaded}
                  <span className="text-sm font-normal text-muted-foreground"> t</span>
                </div>
                <div className="text-sm text-muted-foreground">Tonnage chargé</div>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <div className="text-2xl font-bold">
                  {stats.tonnageDelivered}
                  <span className="text-sm font-normal text-muted-foreground"> t</span>
                </div>
                <div className="text-sm text-muted-foreground">Tonnage livré</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Efficacité transport</span>
                <span className={tonnageEfficiency < 95 ? 'text-amber-400' : 'text-emerald-400'}>
                  {tonnageEfficiency.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={tonnageEfficiency} 
                className={`h-2 ${tonnageEfficiency < 95 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`} 
              />
              {tonnageEfficiency < 100 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Différence: {(stats.tonnageLoaded - stats.tonnageDelivered).toFixed(0)}t
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Anomalies Summary */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                Anomalies
              </CardTitle>
              <Badge className="bg-red-500/20 text-red-400">
                {stats.missionsWithAnomalies}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnomalies.slice(0, 3).map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="flex items-center justify-between rounded-lg bg-secondary p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        anomaly.severity === 'critical'
                          ? 'bg-red-500/20'
                          : anomaly.severity === 'high'
                          ? 'bg-orange-500/20'
                          : 'bg-amber-500/20'
                      }`}
                    >
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          anomaly.severity === 'critical'
                            ? 'text-red-400'
                            : anomaly.severity === 'high'
                            ? 'text-orange-400'
                            : 'text-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {ANOMALY_TYPE_LABELS[anomaly.anomalyType]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {anomaly.truckPlate} • {anomaly.missionId}
                      </div>
                    </div>
                  </div>
                  <SeverityBadge severity={anomaly.severity} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Missions */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Missions actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMissions
                .filter((m) => !['delivered', 'delivered_anomaly'].includes(m.status))
                .slice(0, 4)
                .map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-center justify-between rounded-lg bg-secondary p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                        <Truck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {mission.truckPlate}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {mission.id} • {mission.driverName}
                        </div>
                      </div>
                    </div>
                    <SyncBadge status={mission.syncStatus} />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
