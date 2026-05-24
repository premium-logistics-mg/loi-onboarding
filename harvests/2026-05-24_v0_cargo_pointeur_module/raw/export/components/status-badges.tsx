import type { SyncStatus, MissionStatus, AnomalySeverity } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SyncBadgeProps {
  status: SyncStatus
  className?: string
}

export function SyncBadge({ status, className }: SyncBadgeProps) {
  const config = {
    draft: {
      label: 'Brouillon',
      icon: FileText,
      variant: 'outline' as const,
      className: 'border-muted-foreground/30 text-muted-foreground',
    },
    pending: {
      label: 'En attente',
      icon: Loader2,
      variant: 'secondary' as const,
      className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    synced: {
      label: 'Synchronisé',
      icon: CheckCircle2,
      variant: 'secondary' as const,
      className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    failed: {
      label: 'Échec',
      icon: XCircle,
      variant: 'destructive' as const,
      className: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
  }

  const { label, icon: Icon, className: variantClass } = config[status]

  return (
    <Badge
      variant="outline"
      className={cn('flex items-center gap-1 text-xs', variantClass, className)}
    >
      <Icon className={cn('h-3 w-3', status === 'pending' && 'animate-spin')} />
      {label}
    </Badge>
  )
}

interface StatusBadgeProps {
  status: MissionStatus
  className?: string
}

const STATUS_CONFIG: Record<
  MissionStatus,
  { label: string; className: string }
> = {
  assigned: {
    label: 'Assigné',
    className: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  },
  arrived_loading: {
    label: 'Arrivé mine',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  loading_started: {
    label: 'Chargement',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  loading_completed: {
    label: 'Chargé',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  departed_loading: {
    label: 'En route',
    className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  arrived_delivery: {
    label: 'Arrivé livraison',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  unloading_started: {
    label: 'Déchargement',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  delivered: {
    label: 'Livré',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  delivered_anomaly: {
    label: 'Anomalie',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge
      variant="outline"
      className={cn('text-xs', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}

interface SeverityBadgeProps {
  severity: AnomalySeverity
  className?: string
}

const SEVERITY_CONFIG: Record<
  AnomalySeverity,
  { label: string; className: string }
> = {
  low: {
    label: 'Faible',
    className: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  },
  medium: {
    label: 'Moyen',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  high: {
    label: 'Élevé',
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  critical: {
    label: 'Critique',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity]
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
