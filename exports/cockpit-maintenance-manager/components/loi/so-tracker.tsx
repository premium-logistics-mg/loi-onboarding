'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { SOTracker as SOTrackerType } from '@/lib/loi-types'

interface SOTrackerProps {
  data: SOTrackerType
}

export function SOTracker({ data }: SOTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'text-[#22c55e]'
      case 'yellow': 
      case 'warning': return 'text-[#eab308]'
      case 'red': return 'text-[#ef4444]'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'green': return 'bg-[#22c55e]/10 border-[#22c55e]/30'
      case 'yellow': 
      case 'warning': return 'bg-[#eab308]/10 border-[#eab308]/30'
      case 'red': return 'bg-[#ef4444]/10 border-[#ef4444]/30'
      default: return 'bg-[#1e293b] border-[#1e293b]'
    }
  }

  return (
    <div className="p-4 rounded-xl bg-[#111d2e] border border-[#1e293b]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2dd4bf]/10 border border-[#2dd4bf]/30">
            <Target className="w-5 h-5 text-[#2dd4bf]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#2dd4bf]">{data.soCode}</span>
              <span className="text-xs text-muted-foreground">{data.soNumber}</span>
            </div>
            <span className="text-xs text-muted-foreground">Owner: {data.owner}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={cn(
            'font-mono text-3xl font-bold',
            data.score >= 80 ? 'text-[#22c55e]' : data.score >= 60 ? 'text-[#eab308]' : 'text-[#ef4444]'
          )}>
            {data.score}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-3">{data.title}</h3>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progression</span>
            <span className="text-foreground font-mono">{data.score}%</span>
          </div>
          <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all',
                data.score >= 80 ? 'bg-[#22c55e]' : data.score >= 60 ? 'bg-[#eab308]' : 'bg-[#ef4444]'
              )}
              style={{ width: `${data.score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-2 rounded-lg bg-[#0a1628]">
          <span className="text-xs text-muted-foreground block mb-1">Cible</span>
          <span className="text-sm font-medium text-foreground">{data.target}</span>
        </div>
        <div className="p-2 rounded-lg bg-[#0a1628]">
          <span className="text-xs text-muted-foreground block mb-1">Actuel</span>
          <span className="text-sm font-medium text-foreground">{data.current}</span>
        </div>
        <div className="p-2 rounded-lg bg-[#0a1628]">
          <span className="text-xs text-muted-foreground block mb-1">Deadline</span>
          <span className="text-sm font-mono font-medium text-foreground">{data.deadline}</span>
        </div>
      </div>

      {data.alertCount > 0 && (
        <div className={cn(
          'mt-4 p-2 rounded-lg border flex items-center gap-2',
          getStatusBg(data.forecastStatus)
        )}>
          <AlertTriangle className={cn('w-4 h-4', getStatusColor(data.forecastStatus))} />
          <span className={cn('text-xs font-medium', getStatusColor(data.forecastStatus))}>
            {data.alertCount} alertes actives
          </span>
        </div>
      )}
    </div>
  )
}
