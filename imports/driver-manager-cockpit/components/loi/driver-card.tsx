'use client'

import { cn } from '@/lib/utils'
import type { FleetDriverCard, Badge } from '@/lib/garage-types'

interface DriverCardProps {
  driver: FleetDriverCard
  onClick: () => void
}

function getBorderColor(statusEmoji: FleetDriverCard['statusEmoji']) {
  switch (statusEmoji) {
    case '🟢': return 'border-l-status-green'
    case '🚌': return 'border-l-primary'
    case '🤒': return 'border-l-status-yellow'
    case '🔴': return 'border-l-status-red'
    default: return 'border-l-border'
  }
}

function getScoreColor(score: number | null) {
  if (score === null) return 'text-muted-foreground'
  if (score >= 85) return 'text-status-green'
  if (score >= 70) return 'text-status-yellow'
  return 'text-status-red'
}

function getBadgeStyle(type: Badge['type']) {
  switch (type) {
    case 'top5_econome':
      return 'bg-status-green/10 text-status-green border-status-green/30'
    case 'preservateur':
      return 'bg-primary/10 text-primary border-primary/30'
    case 'permis_alerte':
      return 'bg-status-red/10 text-status-red border-status-red/30'
    case 'medicale_alerte':
      return 'bg-status-red/10 text-status-red border-status-red/30'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function DriverCard({ driver, onClick }: DriverCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-lg p-4 text-left border-l-4 w-full",
        "hover:bg-card/80 hover:border-primary/30 transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        getBorderColor(driver.statusEmoji)
      )}
    >
      {/* Header: Status + Code + Score */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{driver.statusEmoji}</span>
          <span className="font-mono text-xs text-muted-foreground">{driver.code}</span>
        </div>
        <span className={cn("font-mono text-lg font-bold", getScoreColor(driver.score))}>
          {driver.score !== null ? `${driver.score}` : '--'}
        </span>
      </div>

      {/* Name */}
      <div className="mb-1">
        <span className="text-sm font-medium text-foreground">
          {driver.nom} {driver.prenom}
        </span>
      </div>

      {/* Vehicle */}
      <div className="text-xs text-muted-foreground mb-3">
        Vehicule · {driver.vehicule}
      </div>

      {/* Badges */}
      {driver.badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {driver.badges.map((badge, idx) => (
            <span
              key={idx}
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded border",
                getBadgeStyle(badge.type)
              )}
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
