import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import type { CoachingSignal } from '@/lib/types'

interface CoachingSignalsProps {
  signals: CoachingSignal[]
  className?: string
}

export function CoachingSignals({ signals, className }: CoachingSignalsProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {signals.map((signal) => (
        <Card
          key={signal.id}
          className="border-l-4 border-l-[#D97706] bg-[#D97706]/5 border-[#D4CFC4] shadow-none py-4"
        >
          <CardContent className="flex flex-col gap-2 px-4">
            {/* Cause */}
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#D97706]/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-[#D97706]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <p className="text-sm text-[#0B2540] leading-relaxed">
                {signal.cause}
              </p>
            </div>

            {/* Levier */}
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#1A8E7E]/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-[#1A8E7E]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
              <p className="text-sm text-[#0B2540] leading-relaxed">
                <span className="font-medium text-[#1A8E7E]">Levier : </span>
                {signal.levier}
              </p>
            </div>

            {/* Gain estimé */}
            <div className="flex items-center gap-2 mt-1">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#2D8659]/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-[#2D8659]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <span className="text-xs font-mono text-[#4A5568]">
                Gain estimé : <span className="font-semibold text-[#2D8659]">{signal.gainEstime}</span>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
