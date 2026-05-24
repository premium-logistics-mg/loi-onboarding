'use client';

import { useApp } from '@/lib/app-context';
import { MobileLayout } from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Play,
  Square,
  Gauge,
  AlertTriangle,
  Car,
  Construction,
  ShieldAlert,
  Wrench,
  MapPin,
  Clock,
  Truck,
  Package,
} from 'lucide-react';

export function HomeContent() {
  const { driver, vehicle, currentMission, missionStarted, events } = useApp();

  const quickActions = [
    {
      href: '/fatigue',
      icon: AlertTriangle,
      label: 'Fatigue',
      color: 'text-severity-problem',
      bgColor: 'bg-severity-problem/10 hover:bg-severity-problem/20',
    },
    {
      href: '/near-miss',
      icon: Car,
      label: 'Quasi-accident',
      color: 'text-severity-urgent',
      bgColor: 'bg-severity-urgent/10 hover:bg-severity-urgent/20',
    },
    {
      href: '/incident',
      icon: ShieldAlert,
      label: 'Incident',
      color: 'text-severity-urgent',
      bgColor: 'bg-severity-urgent/10 hover:bg-severity-urgent/20',
    },
    {
      href: '/route-deviation',
      icon: Construction,
      label: 'Route bloquée',
      color: 'text-severity-problem',
      bgColor: 'bg-severity-problem/10 hover:bg-severity-problem/20',
    },
    {
      href: '/vehicle-issue',
      icon: Wrench,
      label: 'Problème véhicule',
      color: 'text-severity-problem',
      bgColor: 'bg-severity-problem/10 hover:bg-severity-problem/20',
    },
    {
      href: '/epi',
      icon: ShieldAlert,
      label: 'EPI',
      color: 'text-accent',
      bgColor: 'bg-accent/10 hover:bg-accent/20',
    },
  ];

  const recentEvents = events.slice(-3).reverse();

  return (
    <MobileLayout title="LOI Driver">
      <div className="p-4 space-y-6 pb-8">
        {/* Driver & Vehicle Info */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{driver.name}</p>
              <p className="text-sm text-muted-foreground">{driver.badge_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 shrink-0" />
            <span className="truncate">{vehicle.plate} • {vehicle.model}</span>
          </div>
        </div>

        {/* Current Mission */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/50">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Mission du jour</h2>
              <span
                className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  currentMission.status === 'completed'
                    ? 'bg-severity-ok/20 text-severity-ok'
                    : currentMission.status === 'in_progress'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {currentMission.status === 'completed'
                  ? 'Terminée'
                  : currentMission.status === 'in_progress'
                  ? 'En cours'
                  : 'En attente'}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Trajet</p>
                <p className="font-medium">{currentMission.origin} → {currentMission.destination}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Chargement</p>
                <p className="font-medium">{currentMission.cargo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="font-medium">{currentMission.distance_km} km</p>
              </div>
            </div>
          </div>

          {/* Mission Actions */}
          <div className="p-4 pt-0 space-y-2">
            {!missionStarted ? (
              <Button asChild className="w-full h-14 text-lg font-semibold">
                <Link href="/start-mission">
                  <Play className="h-5 w-5 mr-2" />
                  Démarrer la mission
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full h-12">
                  <Link href="/odometer">
                    <Gauge className="h-5 w-5 mr-2" />
                    Mettre à jour le kilométrage
                  </Link>
                </Button>
                <Button asChild variant="destructive" className="w-full h-14 text-lg font-semibold">
                  <Link href="/end-mission">
                    <Square className="h-5 w-5 mr-2" />
                    Terminer la mission
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold mb-3">Actions rapides</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  'touch-target-lg flex flex-col items-center justify-center gap-2 rounded-xl transition-all',
                  action.bgColor
                )}
              >
                <action.icon className={cn('h-7 w-7', action.color)} />
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3">Événements récents</h2>
            <div className="space-y-2">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-card rounded-lg border border-border p-3 flex items-center gap-3"
                >
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      event.severity === 'urgent'
                        ? 'bg-severity-urgent'
                        : event.severity === 'probleme'
                        ? 'bg-severity-problem'
                        : 'bg-severity-ok'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
