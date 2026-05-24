'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AlertTriangle, Heart } from 'lucide-react'
import type { SignauxHSEData } from '@/lib/garage-types'

interface GarageSignauxHSEProps {
  data: SignauxHSEData
}

export function GarageSignauxHSE({ data }: GarageSignauxHSEProps) {
  const [activeFilter, setActiveFilter] = useState('Tous')

  const filteredSignals = data.signals.filter(signal => {
    if (activeFilter === 'Tous') return true
    if (activeFilter.includes('Open')) return signal.status === 'open'
    if (activeFilter.includes('Acknowledged')) return signal.status === 'acknowledged'
    return true
  })

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xs font-bold tracking-wider text-amber-500 uppercase">
            SIGNAUX HSE
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-status-yellow" />
            <span className="text-foreground font-medium">{data.title}</span>
            <span className="text-muted-foreground">· {data.subtitle}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{data.rightLabel}</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {data.filter.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-md transition-colors",
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Signals */}
      <div className="space-y-3 mb-4">
        {filteredSignals.map((signal) => (
          <div
            key={signal.id}
            className={cn(
              "bg-card border rounded-lg p-4",
              signal.severity === 'critical' ? 'border-status-red/50' : 'border-status-yellow/50'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full mt-1.5",
                signal.status === 'open' ? 'bg-status-red' : 'bg-status-yellow'
              )} />
              <div className="flex-1">
                <p className="text-sm text-foreground">{signal.description}</p>
                <span className={cn(
                  "inline-block mt-2 text-xs px-2 py-0.5 rounded",
                  signal.status === 'open' 
                    ? 'bg-status-red/10 text-status-red' 
                    : 'bg-status-yellow/10 text-status-yellow'
                )}>
                  {signal.status === 'open' ? 'Open' : 'Acknowledged'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bascule */}
      <div className="bg-status-green/5 border border-status-green/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-status-green mt-0.5" />
          <div>
            <p className="text-sm font-medium text-status-green">{data.bascule.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{data.bascule.detail}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
