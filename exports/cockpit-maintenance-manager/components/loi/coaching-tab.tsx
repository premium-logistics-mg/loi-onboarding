'use client'

import { cn } from '@/lib/utils'
import { 
  CheckCircle, 
  Clock, 
  Circle,
  MessageSquare,
  Target,
  TrendingUp
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { OneOnOne, CoachingAction, DevelopmentObjective } from '@/lib/loi-types'
import type { TeamMember } from '@/lib/loi-types'

interface CoachingTabProps {
  teamMembers: TeamMember[]
  oneOnOnes: OneOnOne[]
  coachingActions: CoachingAction[]
  developmentObjectives: DevelopmentObjective[]
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-[#22c55e]'
  if (score >= 60) return 'text-[#eab308]'
  return 'text-[#ef4444]'
}

function getProgressColor(progress: number): string {
  if (progress >= 80) return 'bg-[#22c55e]'
  if (progress >= 50) return 'bg-[#eab308]'
  return 'bg-[#ef4444]'
}

function OneOnOneCard({ record }: { record: OneOnOne }) {
  const getStatusIcon = () => {
    switch (record.status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-[#22c55e]" />
      case 'in_progress': return <Clock className="w-4 h-4 text-[#2dd4bf]" />
      default: return <Circle className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="p-4 rounded-lg bg-[#111d2e] border border-[#1e293b]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2dd4bf] flex items-center justify-center text-[#0a1628] font-semibold text-sm">
            {record.lieutenant.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">{record.lieutenant}</span>
            <span className="block text-xs text-muted-foreground">{record.date}</span>
          </div>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Sujet</span>
          <p className="text-sm text-foreground">{record.sujet}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Décisions</span>
          <p className="text-sm text-foreground">{record.decisions}</p>
        </div>
        <div className="pt-2 border-t border-[#1e293b]">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Prochaine action</span>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-[#2dd4bf]">{record.prochaineAction}</p>
            <span className="text-xs font-mono text-muted-foreground">{record.deadline}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionItem({ action }: { action: CoachingAction }) {
  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg border',
      action.completed 
        ? 'bg-[#22c55e]/5 border-[#22c55e]/30' 
        : 'bg-[#111d2e] border-[#1e293b]'
    )}>
      {action.completed ? (
        <CheckCircle className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-[#2dd4bf]">{action.lieutenant}</span>
        </div>
        <p className={cn(
          'text-sm',
          action.completed ? 'text-muted-foreground line-through' : 'text-foreground'
        )}>
          {action.action}
        </p>
      </div>
      <span className="text-xs font-mono text-muted-foreground shrink-0">{action.deadline}</span>
    </div>
  )
}

function ObjectiveCard({ objective }: { objective: DevelopmentObjective }) {
  return (
    <div className="p-4 rounded-lg bg-[#111d2e] border border-[#1e293b]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2dd4bf] flex items-center justify-center text-[#0a1628] font-semibold text-sm">
            {objective.lieutenant.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-foreground">{objective.lieutenant}</span>
        </div>
        <span className={cn(
          'font-mono text-lg font-bold',
          objective.progress >= 80 ? 'text-[#22c55e]' : 
          objective.progress >= 50 ? 'text-[#eab308]' : 'text-[#ef4444]'
        )}>
          {objective.progress}%
        </span>
      </div>
      <p className="text-sm text-foreground mb-3">{objective.objective}</p>
      <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all', getProgressColor(objective.progress))}
          style={{ width: `${objective.progress}%` }}
        />
      </div>
    </div>
  )
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className={cn(
      'p-4 rounded-lg border',
      member.isCapRouge 
        ? 'bg-[#ef4444]/5 border-[#ef4444]/30' 
        : 'bg-[#111d2e] border-[#1e293b]'
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
          member.isCapRouge ? 'bg-[#ef4444] text-white' : 'bg-[#2dd4bf] text-[#0a1628]'
        )}>
          {member.initials}
        </div>
        <div className="flex-1">
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
        <span className={cn('font-mono text-xl font-bold', getScoreColor(member.score))}>
          {member.score}
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {member.metrics.map((metric) => (
          <div key={metric.label} className="text-center p-2 rounded bg-[#0a1628]">
            <span className={cn('font-mono text-sm font-semibold block', getScoreColor(metric.score))}>
              {metric.score}
            </span>
            <span className="text-[9px] text-muted-foreground">{metric.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CoachingTab({
  teamMembers,
  oneOnOnes,
  coachingActions,
  developmentObjectives
}: CoachingTabProps) {
  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
          <Target className="w-4 h-4 text-[#2dd4bf]" />
          Équipe directe — Performance 30j
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.initials} member={member} />
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - 1:1 Records */}
        <div className="col-span-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#2dd4bf]" />
            1:1 Records
          </h3>
          <div className="space-y-3">
            {oneOnOnes.map((record, index) => (
              <OneOnOneCard key={index} record={record} />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-6 space-y-6">
          {/* Actions Coaching */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2dd4bf]" />
              Actions Coaching
            </h3>
            <div className="space-y-2">
              {coachingActions.map((action, index) => (
                <ActionItem key={index} action={action} />
              ))}
            </div>
          </div>

          {/* Development Objectives */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2dd4bf]" />
              Objectifs Développement 90j
            </h3>
            <div className="space-y-3">
              {developmentObjectives.map((objective, index) => (
                <ObjectiveCard key={index} objective={objective} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
