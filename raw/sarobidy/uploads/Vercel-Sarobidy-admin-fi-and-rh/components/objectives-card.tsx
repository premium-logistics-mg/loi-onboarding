import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import type { Objective } from '@/lib/types'

interface ObjectivesCardProps {
  objectives: Objective[]
  className?: string
}

export function ObjectivesCard({ objectives, className }: ObjectivesCardProps) {
  return (
    <Card className={cn('border-[#D4CFC4] shadow-none', className)}>
      <CardContent className="flex flex-col gap-4 py-0">
        {objectives.map((obj, idx) => (
          <div
            key={obj.id}
            className={cn(
              'flex items-center justify-between py-3',
              idx !== objectives.length - 1 && 'border-b border-[#D4CFC4]'
            )}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#0B2540]">
                {obj.label}
              </span>
              <span className="text-xs text-[#4A5568]">
                Cible : {obj.cible}
              </span>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-semibold text-[#0B2540]">
                {obj.current}
              </span>
              {obj.unit && (
                <span className="text-sm text-[#4A5568]">{obj.unit}</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
