'use client'

import { cn } from '@/lib/utils'
import type { OneOnOne, CoachingAction, DevelopmentObjective, TeamMember } from '@/lib/loi-types'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Calendar, 
  MessageSquare, 
  Target, 
  CheckCircle, 
  Clock, 
  Circle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface CoachingTabProps {
  teamMembers: TeamMember[]
  oneOnOnes: OneOnOne[]
  coachingActions: CoachingAction[]
  developmentObjectives: DevelopmentObjective[]
}

function StatusIcon({ status }: { status: 'done' | 'in_progress' | 'pending' }) {
  switch (status) {
    case 'done':
      return <CheckCircle className="w-4 h-4 text-status-green" />
    case 'in_progress':
      return <Clock className="w-4 h-4 text-status-yellow" />
    case 'pending':
      return <Circle className="w-4 h-4 text-muted-foreground" />
  }
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  switch (trend) {
    case 'up': return <TrendingUp className="w-3 h-3 text-status-green" />
    case 'down': return <TrendingDown className="w-3 h-3 text-status-red" />
    case 'stable': return <Minus className="w-3 h-3 text-status-yellow" />
  }
}

function getScoreColor(score: number) {
  if (score >= 75) return 'text-status-green'
  if (score >= 60) return 'text-status-yellow'
  return 'text-status-red'
}

export function CoachingTab({ teamMembers, oneOnOnes, coachingActions, developmentObjectives }: CoachingTabProps) {
  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Equipe Directe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div 
              key={member.initials}
              className={cn(
                "p-4 rounded-lg border",
                member.isCapRouge 
                  ? "bg-status-red/5 border-status-red/30" 
                  : "bg-card border-border"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                  member.isCapRouge 
                    ? "bg-status-red/20 text-status-red" 
                    : "bg-primary/20 text-primary"
                )}>
                  {member.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">{member.name}</span>
                    {member.isCapRouge && (
                      <Badge variant="destructive" className="text-[10px]">CAP ROUGE</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{member.level} · {member.role}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={cn("font-mono text-2xl font-bold", getScoreColor(member.score))}>
                    {member.score}
                  </span>
                  <TrendIcon trend={member.trend} />
                </div>
                <span className="text-xs text-muted-foreground">{member.tasksCount} taches</span>
              </div>
              <div className="space-y-1">
                {member.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className={cn("font-mono font-medium", getScoreColor(metric.score))}>
                      {metric.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 1:1 Records */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Historique 1:1
        </h2>
        <div className="space-y-3">
          {oneOnOnes.map((record, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">{record.lieutenant}</span>
                  <Badge variant="secondary" className="text-xs">{record.date}</Badge>
                </div>
                <StatusIcon status={record.status} />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-2">{record.sujet}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Decisions:</span>
                  <p className="text-foreground">{record.decisions}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Prochaine action:</span>
                  <p className="text-foreground">{record.prochaineAction}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Deadline:</span>
                  <p className="text-foreground font-mono">{record.deadline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coaching Actions */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Actions Coaching
        </h2>
        <div className="space-y-2">
          {coachingActions.map((action, idx) => (
            <div 
              key={idx}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                action.completed 
                  ? "bg-status-green/5 border-status-green/20" 
                  : "bg-card border-border"
              )}
            >
              <Checkbox checked={action.completed} disabled />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{action.lieutenant}</Badge>
                  <span className={cn(
                    "text-sm",
                    action.completed ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {action.action}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{action.deadline}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Development Objectives */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Objectifs Developpement 90j
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {developmentObjectives.map((obj, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <Badge variant="secondary" className="text-xs">{obj.lieutenant}</Badge>
              </div>
              <p className="text-sm text-foreground mb-3">{obj.objective}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progression</span>
                  <span className={cn(
                    "font-mono font-medium",
                    obj.progress >= 70 ? "text-status-green" :
                    obj.progress >= 50 ? "text-status-yellow" : "text-status-red"
                  )}>
                    {obj.progress}%
                  </span>
                </div>
                <Progress 
                  value={obj.progress} 
                  className={cn(
                    "h-2",
                    obj.progress >= 70 && "[&>div]:bg-status-green",
                    obj.progress >= 50 && obj.progress < 70 && "[&>div]:bg-status-yellow",
                    obj.progress < 50 && "[&>div]:bg-status-red"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
