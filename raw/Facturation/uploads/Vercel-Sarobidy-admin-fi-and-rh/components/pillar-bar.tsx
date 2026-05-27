'use client'

import { cn } from '@/lib/utils'
import type { Pillar } from '@/lib/types'

interface PillarBarProps {
  pillars: Pillar[]
  className?: string
}

export function PillarBar({ pillars, className }: PillarBarProps) {
  return (
    <div className={cn('w-full bg-[#0B2540]/5 border-b border-[#D4CFC4]', className)}>
      <div className="max-w-[1400px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className={cn(
                'flex-1 flex items-center gap-4 px-4 py-2 rounded-lg transition-colors',
                pillar.isFocus 
                  ? 'bg-[#1A8E7E]/10 border border-[#1A8E7E]/30' 
                  : 'bg-white border border-[#D4CFC4]'
              )}
            >
              {/* Pillar ID */}
              <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-md font-semibold text-sm',
                pillar.isFocus 
                  ? 'bg-[#1A8E7E] text-white' 
                  : 'bg-[#0B2540] text-[#F5F1E8]'
              )}>
                {pillar.shortName}
              </div>
              
              {/* Name + Score */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#4A5568] truncate">{pillar.name}</span>
                  {pillar.isFocus && (
                    <span className="px-1.5 py-0.5 bg-[#1A8E7E] text-white text-[9px] rounded uppercase tracking-wider">
                      Focus
                    </span>
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#EBE6DB] rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        pillar.isFocus ? 'bg-[#1A8E7E]' : 'bg-[#0B2540]'
                      )}
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#0B2540] w-8 text-right">
                    {pillar.score}
                  </span>
                </div>
              </div>
              
              {/* Trend */}
              <div className="flex items-center justify-center w-6">
                {pillar.trend === 'up' && (
                  <svg className="w-4 h-4 text-[#2D8659]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
                {pillar.trend === 'down' && (
                  <svg className="w-4 h-4 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {pillar.trend === 'stable' && (
                  <svg className="w-4 h-4 text-[#4A5568]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                  </svg>
                )}
              </div>
              
              {/* Separator */}
              {index < pillars.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
