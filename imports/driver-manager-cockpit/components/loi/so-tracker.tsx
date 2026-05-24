'use client'

import { cn } from '@/lib/utils'
import type { SOTracker as SOTrackerType } from '@/lib/loi-types'
import { Target, AlertTriangle, Calendar, User } from 'lucide-react'

interface SOTrackerProps {
  tracker: SOTrackerType
}

function getStatusColor(status: string) {
  switch (status) {
    case 'green': return 'text-status-green'
    case 'yellow':
    case 'warning': return 'text-status-yellow'
    case 'red': return 'text-status-red'
    default: return 'text-muted-foreground'
  }
}

export function SOTracker({ tracker }: SOTrackerProps) {
  return (
    <div className="p-5 rounded-lg bg-card border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary">{tracker.soCode}</span>
              <span className="text-xs text-muted-foreground">{tracker.soNumber}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{tracker.title}</h3>
          </div>
        </div>
        <div className={cn(
          "flex items-center justify-center w-16 h-16 rounded-xl font-mono text-3xl font-bold",
          tracker.score >= 75 ? "bg-status-green/10 text-status-green" :
          tracker.score >= 60 ? "bg-status-yellow/10 text-status-yellow" :
          "bg-status-red/10 text-status-red"
        )}>
          {tracker.score}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">Owner</div>
            <div className="text-sm font-medium text-foreground">{tracker.owner}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">Deadline</div>
            <div className="text-sm font-medium text-foreground">{tracker.deadline}</div>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Cible</div>
          <div className="text-sm font-mono text-foreground">{tracker.target}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Actuel</div>
          <div className={cn("text-sm font-mono", getStatusColor(tracker.forecastStatus))}>
            {tracker.current}
          </div>
        </div>
      </div>

      {tracker.alertCount > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-md bg-status-red/10 text-status-red">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">{tracker.alertCount} alertes actives</span>
        </div>
      )}
    </div>
  )
}
