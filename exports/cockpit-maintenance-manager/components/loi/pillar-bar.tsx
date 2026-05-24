'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Pillar } from '@/lib/loi-types'
import { Wrench, Settings, Bell } from 'lucide-react'

interface PillarBarProps {
  pillars: Pillar[]
  activePillar?: string
  onPillarClick?: (code: string) => void
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-[#22c55e]'
  if (score >= 60) return 'text-[#eab308]'
  return 'text-[#ef4444]'
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-[#22c55e]/10 border-[#22c55e]/30'
  if (score >= 60) return 'bg-[#eab308]/10 border-[#eab308]/30'
  return 'bg-[#ef4444]/10 border-[#ef4444]/30'
}

export function PillarBar({ pillars, activePillar, onPillarClick }: PillarBarProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0d1929] border-b border-[#1e293b]">
        <div className="h-full flex items-center justify-between px-4">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#2dd4bf]/10 border border-[#2dd4bf]/30">
              <Wrench className="w-5 h-5 text-[#2dd4bf]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">LOI Cockpit</span>
              <span className="text-xs text-muted-foreground">Maintenance Transport</span>
            </div>
          </div>

          {/* Pillars */}
          <div className="flex items-center gap-2">
            {pillars.map((pillar) => (
              <Tooltip key={pillar.code}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPillarClick?.(pillar.code)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all',
                      'hover:bg-[#1e293b]',
                      activePillar === pillar.code && 'ring-1 ring-[#2dd4bf]',
                      getScoreBg(pillar.score)
                    )}
                  >
                    <span className="text-xs font-medium text-muted-foreground">{pillar.code}</span>
                    <span className="text-xs text-foreground">{pillar.label}</span>
                    <span className={cn('font-mono text-sm font-semibold', getScoreColor(pillar.score))}>
                      {pillar.score}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs bg-[#111d2e] border-[#1e293b] text-foreground">
                  <p className="text-xs">{pillar.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* User / Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-md hover:bg-[#1e293b] transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full" />
            </button>
            <button className="p-2 rounded-md hover:bg-[#1e293b] transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-[#1e293b]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2dd4bf] text-[#0a1628] font-semibold text-sm">
                HE
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Hery</span>
                <span className="text-xs text-muted-foreground">Maintenance Mgr</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
