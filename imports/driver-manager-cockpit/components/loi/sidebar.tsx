'use client'

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Gauge, 
  Users, 
  Bot, 
  Target, 
  BookOpen, 
  User,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { TeamMember } from '@/lib/loi-types'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  teamMembers: TeamMember[]
  cascadeOpen: boolean
  onCascadeToggle: () => void
}

const navItems = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'pilotage', label: 'Pilotage', icon: Gauge },
  { id: 'coaching', label: 'Coaching', icon: Users },
  { id: 'copilot', label: 'Copilot', icon: Bot, disabled: true },
  { id: 'scorecards', label: 'Scorecards', icon: Target, disabled: true },
  { id: 'carnet', label: 'Carnet M13', icon: BookOpen, disabled: true },
  { id: 'profil', label: 'Profil', icon: User, disabled: true },
]

function getScoreColor(score: number) {
  if (score >= 75) return 'text-status-green'
  if (score >= 60) return 'text-status-yellow'
  return 'text-status-red'
}

function getWorkloadColor(status: 'green' | 'yellow' | 'red') {
  switch (status) {
    case 'green': return 'bg-status-green'
    case 'yellow': return 'bg-status-yellow'
    case 'red': return 'bg-status-red'
  }
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  switch (trend) {
    case 'up': return <TrendingUp className="w-3 h-3 text-status-green" />
    case 'down': return <TrendingDown className="w-3 h-3 text-status-red" />
    case 'stable': return <Minus className="w-3 h-3 text-status-yellow" />
  }
}

export function Sidebar({ activeTab, onTabChange, teamMembers, cascadeOpen, onCascadeToggle }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onTabChange(item.id)}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left",
              activeTab === item.id 
                ? "bg-sidebar-accent text-sidebar-primary" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              item.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
            {item.disabled && (
              <span className="ml-auto text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                Bientot
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* CASCADE Panel */}
      <div className="px-4 mt-4">
        <Collapsible open={cascadeOpen} onOpenChange={onCascadeToggle}>
          <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">CASCADE</span>
              <span className="text-xs text-muted-foreground">({teamMembers.length})</span>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              cascadeOpen && "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {teamMembers.map((member) => (
              <div
                key={member.initials}
                className={cn(
                  "p-3 rounded-md bg-card border border-border",
                  member.isCapRouge && "border-status-red/50 bg-status-red/5"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      member.isCapRouge 
                        ? "bg-status-red/20 text-status-red" 
                        : "bg-primary/20 text-primary"
                    )}>
                      {member.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-foreground">{member.name}</span>
                        {member.isCapRouge && (
                          <span className="text-[10px] font-bold text-status-red bg-status-red/10 px-1 rounded">
                            CAP ROUGE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{member.level} · {member.role}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-mono text-lg font-bold", getScoreColor(member.score))}>
                      {member.score}
                    </span>
                    <TrendIcon trend={member.trend} />
                    <span className="text-xs text-muted-foreground">{member.trendPeriod}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full", getWorkloadColor(member.workloadStatus))} />
                    <span className="text-xs text-muted-foreground">{member.tasksCount} taches</span>
                  </div>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* SO Tracker Mini */}
      <div className="p-4 mt-4">
        <div className="p-3 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-primary">SO·2</span>
            <span className="text-xs text-muted-foreground">31/08/26</span>
          </div>
          <p className="text-xs text-foreground mb-2">Flotte productive & fuel maitrise</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl font-bold text-primary">66</span>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Conso</div>
              <div className="text-sm font-mono text-status-yellow">0.69 L/km</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
