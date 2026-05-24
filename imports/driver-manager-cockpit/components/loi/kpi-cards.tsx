'use client'

import { cn } from '@/lib/utils'
import type { KPICard as KPICardType } from '@/lib/loi-types'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardsProps {
  cards: KPICardType[]
}

function getStatusColor(status: 'green' | 'yellow' | 'red') {
  switch (status) {
    case 'green': return 'border-status-green/30 bg-status-green/5'
    case 'yellow': return 'border-status-yellow/30 bg-status-yellow/5'
    case 'red': return 'border-status-red/30 bg-status-red/5'
  }
}

function getValueColor(status: 'green' | 'yellow' | 'red') {
  switch (status) {
    case 'green': return 'text-status-green'
    case 'yellow': return 'text-status-yellow'
    case 'red': return 'text-status-red'
  }
}

function getDeltaInfo(delta: string) {
  const isPositive = delta.startsWith('+')
  const isNegative = delta.startsWith('-')
  return {
    isPositive,
    isNegative,
    icon: isPositive ? TrendingUp : isNegative ? TrendingDown : null,
    color: isPositive ? 'text-status-red' : isNegative ? 'text-status-green' : 'text-muted-foreground'
  }
}

export function KPICards({ cards }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const deltaInfo = getDeltaInfo(card.delta)
        return (
          <div
            key={card.label}
            className={cn(
              "p-4 rounded-lg border transition-all hover:shadow-md",
              getStatusColor(card.status)
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {card.label}
              </span>
              <div className={cn(
                "w-2 h-2 rounded-full",
                card.status === 'green' && "bg-status-green",
                card.status === 'yellow' && "bg-status-yellow",
                card.status === 'red' && "bg-status-red"
              )} />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={cn(
                "font-mono text-2xl font-bold",
                getValueColor(card.status)
              )}>
                {card.value}
              </span>
              {deltaInfo.icon && (
                <div className={cn("flex items-center gap-0.5", deltaInfo.color)}>
                  <deltaInfo.icon className="w-3 h-3" />
                  <span className="text-xs font-mono">{card.delta}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{card.target}</div>
          </div>
        )
      })}
    </div>
  )
}
