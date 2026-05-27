'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { CarnetEntry } from '@/lib/types'

interface CarnetListProps {
  entries: CarnetEntry[]
  className?: string
}

export function CarnetList({ entries, className }: CarnetListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-start gap-4 p-4 bg-white border border-[#D4CFC4] rounded-lg"
        >
          {/* Date */}
          <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-[#0B2540] rounded-md">
            <span className="text-xs text-[#F5F1E8]/70">
              {formatDate(entry.date).split(' ')[1]}
            </span>
            <span className="text-lg font-semibold text-[#F5F1E8]">
              {formatDate(entry.date).split(' ')[0]}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px]',
                  entry.type === 'decision'
                    ? 'border-[#1A8E7E]/30 text-[#1A8E7E] bg-[#1A8E7E]/5'
                    : 'border-[#D97706]/30 text-[#D97706] bg-[#D97706]/5'
                )}
              >
                {entry.type === 'decision' ? 'Décision' : 'Escalade'}
              </Badge>
              {entry.personneSource && (
                <span className="text-xs text-[#4A5568]">
                  via {entry.personneSource}
                </span>
              )}
            </div>
            <p className="text-sm text-[#0B2540] leading-relaxed">
              {entry.description}
            </p>
          </div>
        </div>
      ))}

      {entries.length === 0 && (
        <div className="flex items-center justify-center py-12 text-[#4A5568]">
          <span className="text-sm">Aucune entrée dans le carnet</span>
        </div>
      )}
    </div>
  )
}
