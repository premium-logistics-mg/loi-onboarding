'use client'

import { cn } from '@/lib/utils'
import type { OverviewKPICard } from '@/lib/garage-types'

interface GarageOverviewProps {
  cardsRow1: OverviewKPICard[]
  cardsRow2: OverviewKPICard[]
}

function getColorClass(color: OverviewKPICard['color']) {
  switch (color) {
    case 'green': return 'border-l-status-green'
    case 'yellow': return 'border-l-status-yellow'
    case 'red': return 'border-l-status-red'
    case 'teal': return 'border-l-primary'
    case 'amber': return 'border-l-amber-500'
    case 'neutral': return 'border-l-muted-foreground'
    default: return 'border-l-border'
  }
}

function getIconColor(color: OverviewKPICard['color']) {
  switch (color) {
    case 'green': return 'text-status-green'
    case 'yellow': return 'text-status-yellow'
    case 'red': return 'text-status-red'
    case 'teal': return 'text-primary'
    case 'amber': return 'text-amber-500'
    default: return 'text-muted-foreground'
  }
}

function KPICard({ card }: { card: OverviewKPICard }) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-4 border-l-4",
      getColorClass(card.color)
    )}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-medium text-foreground">{card.title}</h4>
          <p className="text-xs text-muted-foreground">{card.subtitle}</p>
        </div>
        {card.icon && (
          <span className={cn("text-lg", getIconColor(card.color))}>{card.icon}</span>
        )}
      </div>
      
      {card.mainValue && (
        <div className="mb-2">
          <span className={cn("text-2xl font-bold font-mono", getIconColor(card.color))}>
            {card.mainValue}
          </span>
        </div>
      )}
      
      {card.detail && (
        <p className="text-xs text-muted-foreground">{card.detail}</p>
      )}
      
      {card.secondLine && (
        <p className="text-xs text-muted-foreground mt-1">{card.secondLine}</p>
      )}
      
      {card.data && (
        <div className="space-y-1 mt-2">
          {card.data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                {item.icon && <span>{item.icon}</span>}
                <span className="font-mono text-muted-foreground">{item.ref}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground">{item.value}</span>
                {item.delta && (
                  <span className={cn(
                    "font-mono",
                    item.delta.startsWith('-') ? 'text-status-green' : 'text-status-red'
                  )}>
                    {item.delta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function GarageOverview({ cardsRow1, cardsRow2 }: GarageOverviewProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-bold tracking-wider text-amber-500 uppercase mb-4">
        OVERVIEW
      </h2>
      <div className="grid grid-cols-5 gap-4 mb-4">
        {cardsRow1.map((card, idx) => (
          <KPICard key={idx} card={card} />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4">
        {cardsRow2.map((card, idx) => (
          <KPICard key={idx} card={card} />
        ))}
      </div>
    </section>
  )
}
