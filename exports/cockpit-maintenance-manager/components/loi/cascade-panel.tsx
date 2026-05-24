'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'
import type { TeamMember } from '@/lib/loi-types'

interface CascadePanelProps {
  members: TeamMember[]
  onMemberClick?: (member: TeamMember) => void
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-[#22c55e]'
  if (score >= 60) return 'text-[#eab308]'
  return 'text-[#ef4444]'
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up': return <TrendingUp className="w-3 h-3 text-[#22c55e]" />
    case 'down': return <TrendingDown className="w-3 h-3 text-[#ef4444]" />
    default: return <Minus className="w-3 h-3 text-muted-foreground" />
  }
}

function getWorkloadColor(status: string) {
  switch (status) {
    case 'green': return 'bg-[#22c55e]'
    case 'yellow': return 'bg-[#eab308]'
    case 'red': return 'bg-[#ef4444]'
    default: return 'bg-muted'
  }
}

export function CascadePanel({ members, onMemberClick }: CascadePanelProps) {
  return (
    <div className="rounded-xl bg-[#111d2e] border border-[#1e293b] overflow-hidden">
      <div className="p-4 border-b border-[#1e293b]">
        <h3 className="text-sm font-semibold text-foreground">CASCADE — Équipe directe</h3>
        <p className="text-xs text-muted-foreground mt-1">4 lieutenants N4</p>
      </div>

      <div className="p-4 space-y-3">
        {members.map((member) => (
          <button
            key={member.initials}
            onClick={() => onMemberClick?.(member)}
            className={cn(
              'w-full p-3 rounded-lg border transition-all text-left',
              'hover:border-[#2dd4bf]/50 hover:bg-[#1e293b]/50',
              member.isCapRouge 
                ? 'bg-[#ef4444]/5 border-[#ef4444]/30' 
                : 'bg-[#0a1628] border-[#1e293b]'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm',
                  member.isCapRouge 
                    ? 'bg-[#ef4444] text-white' 
                    : 'bg-[#2dd4bf] text-[#0a1628]'
                )}>
                  {member.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.level}</span>
                    {member.isCapRouge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#ef4444] text-white">
                        CAP ROUGE
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{member.role}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  <span className={cn('font-mono text-lg font-bold', getScoreColor(member.score))}>
                    {member.score}
                  </span>
                  {getTrendIcon(member.trend)}
                </div>
                <span className="text-[10px] text-muted-foreground">{member.trendPeriod}</span>
              </div>
            </div>

            {/* Mini metrics */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {member.metrics.map((metric) => (
                <div key={metric.label} className="text-center">
                  <span className={cn('font-mono text-xs font-semibold', getScoreColor(metric.score))}>
                    {metric.score}
                  </span>
                  <span className="block text-[9px] text-muted-foreground truncate">{metric.label}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{member.tasksCount} tâches</span>
                <div className={cn('w-2 h-2 rounded-full', getWorkloadColor(member.workloadStatus))} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
