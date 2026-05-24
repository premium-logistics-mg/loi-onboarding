'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { KPICard } from '@/lib/loi-types'

interface KPICardsProps {
  cards: KPICard[]
}

function getStatusColor(status: string) {
  switch (status) {
    case 'green': return 'text-[#22c55e]'
    case 'yellow': return 'text-[#eab308]'
    case 'red': return 'text-[#ef4444]'
    default: return 'text-muted-foreground'
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case 'green': return 'bg-[#22c55e]/10 border-[#22c55e]/30'
    case 'yellow': return 'bg-[#eab308]/10 border-[#eab308]/30'
    case 'red': return 'bg-[#ef4444]/10 border-[#ef4444]/30'
    default: return 'bg-[#1e293b] border-[#1e293b]'
  }
}

function getDeltaIcon(delta: string) {
  if (delta.startsWith('+')) return <TrendingUp className="w-3 h-3" />
  if (delta.startsWith('-')) return <TrendingDown className="w-3 h-3" />
  return <Minus className="w-3 h-3" />
}

function getDeltaColor(delta: string, isInverse = false) {
  // For metrics where lower is better (like retard), inverse the colors
  if (delta.startsWith('+')) return isInverse ? 'text-[#ef4444]' : 'text-[#22c55e]'
  if (delta.startsWith('-')) return isInverse ? 'text-[#22c55e]' : 'text-[#ef4444]'
  return 'text-muted-foreground'
}

export function KPICards({ cards }: KPICardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => {
        // Determine if this is an inverse metric (where + is bad)
        const isInverseMetric = card.label.includes('RETARD') || card.label.includes('EN RETARD')
        
        return (
          <div
            key={card.id}
            className={cn(
              'p-4 rounded-xl border transition-all hover:border-[#2dd4bf]/50',
              getStatusBg(card.status)
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {card.label}
              </span>
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                getDeltaColor(card.delta, isInverseMetric)
              )}>
                {getDeltaIcon(card.delta)}
                <span>{card.delta}</span>
              </div>
            </div>
            
            <div className="mb-2">
              <span className={cn(
                'font-mono text-2xl font-bold',
                getStatusColor(card.status)
              )}>
                {card.value}
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {card.target}
            </div>
          </div>
        )
      })}
    </div>
  )
}
