'use client'

import { cn } from '@/lib/utils'
import type { Pillar } from '@/lib/loi-types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { User, Bell } from 'lucide-react'

interface PillarBarProps {
  pillars: Pillar[]
  activePillar?: string
  onPillarClick?: (code: string) => void
}

function getScoreColor(score: number) {
  if (score >= 75) return 'bg-status-green'
  if (score >= 60) return 'bg-status-yellow'
  return 'bg-status-red'
}

function getScoreTextColor(score: number) {
  if (score >= 75) return 'text-status-green'
  if (score >= 60) return 'text-status-yellow'
  return 'text-status-red'
}

export function PillarBar({ pillars, activePillar, onPillarClick }: PillarBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">RI</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-foreground">RIJA</div>
            <div className="text-xs text-muted-foreground">Driver Manager</div>
          </div>
        </div>

        {/* Pillars */}
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-1 sm:gap-2">
            {pillars.map((pillar) => (
              <Tooltip key={pillar.code}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPillarClick?.(pillar.code)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                      "hover:bg-secondary",
                      activePillar === pillar.code && "bg-secondary ring-1 ring-primary/50"
                    )}
                  >
                    <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
                      {pillar.code}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {pillar.label}
                    </span>
                    <div className={cn(
                      "flex items-center justify-center w-8 h-6 rounded text-xs font-mono font-bold",
                      getScoreColor(pillar.score),
                      "text-background"
                    )}>
                      {pillar.score}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{pillar.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-md hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-status-red rounded-full" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-secondary transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden sm:inline text-sm text-foreground">Rija</span>
          </button>
        </div>
      </div>
    </header>
  )
}
