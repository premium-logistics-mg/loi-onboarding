'use client'

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Gauge, 
  Users, 
  Bot, 
  ClipboardList, 
  BookOpen, 
  User,
  ChevronDown,
  Target
} from 'lucide-react'

type TabId = 'overview' | 'pilotage' | 'coaching' | 'copilot' | 'scorecards' | 'carnet' | 'profil'

interface SidebarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const mainTabs = [
  { id: 'overview' as const, label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'pilotage' as const, label: 'Pilotage', icon: Gauge },
  { id: 'coaching' as const, label: 'Coaching', icon: Users },
]

const secondaryTabs = [
  { id: 'copilot' as const, label: 'Copilot', icon: Bot },
  { id: 'scorecards' as const, label: 'Scorecards', icon: ClipboardList },
  { id: 'carnet' as const, label: 'Carnet M13', icon: BookOpen },
  { id: 'profil' as const, label: 'Profil', icon: User },
]

interface SOTrackerMiniProps {
  soCode: string
  title: string
  score: number
  deadline: string
}

function SOTrackerMini({ soCode, title, score, deadline }: SOTrackerMiniProps) {
  return (
    <div className="mx-3 mb-4 p-3 rounded-lg bg-[#111d2e] border border-[#1e293b]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#2dd4bf]" />
          <span className="text-xs font-semibold text-[#2dd4bf]">{soCode}</span>
        </div>
        <span className={cn(
          'font-mono text-lg font-bold',
          score >= 80 ? 'text-[#22c55e]' : score >= 60 ? 'text-[#eab308]' : 'text-[#ef4444]'
        )}>
          {score}
        </span>
      </div>
      <p className="text-xs text-foreground leading-tight mb-2 line-clamp-2">{title}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Deadline</span>
        <span className="font-mono">{deadline}</span>
      </div>
    </div>
  )
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-[#0d1929] border-r border-[#1e293b] flex flex-col z-40">
      {/* SO Tracker Mini */}
      <div className="pt-4">
        <SOTrackerMini
          soCode="SO·4"
          title="Disponibilité technique maximale & coût maîtrisé"
          score={64}
          deadline="31/08/26"
        />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-[#2dd4bf]/10 text-[#2dd4bf] border border-[#2dd4bf]/30'
                    : 'text-muted-foreground hover:bg-[#1e293b] hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-[#1e293b]" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  activeTab === tab.id
                    ? 'bg-[#2dd4bf]/10 text-[#2dd4bf] border border-[#2dd4bf]/30'
                    : 'text-muted-foreground hover:bg-[#1e293b] hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* CASCADE Panel Toggle */}
      <div className="p-3 border-t border-[#1e293b]">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#111d2e] hover:bg-[#1e293b] transition-colors">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2dd4bf]" />
            <span className="text-sm font-medium text-foreground">CASCADE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">4 lieutenants</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      </div>
    </aside>
  )
}

export type { TabId }
