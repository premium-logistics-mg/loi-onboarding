'use client'

import { 
  Home, 
  AlertTriangle, 
  ClipboardCheck, 
  ListTodo, 
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

type TabId = 'accueil' | 'capture' | 'inspection' | 'actions' | 'feed'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'accueil', label: 'Accueil', icon: Home },
  { id: 'capture', label: 'Capture', icon: AlertTriangle },
  { id: 'inspection', label: 'Inspection', icon: ClipboardCheck },
  { id: 'actions', label: 'Actions', icon: ListTodo },
  { id: 'feed', label: 'Feed', icon: Activity },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { isOffline, pendingSyncCount } = useApp()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      {/* Offline Banner */}
      {isOffline && (
        <div className="flex items-center justify-center gap-2 py-1.5 bg-warning text-warning-foreground text-xs font-medium">
          <WifiOff className="h-3.5 w-3.5" />
          <span>Mode hors ligne actif</span>
          {pendingSyncCount > 0 && (
            <span className="px-1.5 py-0.5 bg-warning-foreground/20 rounded">
              {pendingSyncCount} en attente
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center min-w-[64px] py-1.5 px-3 rounded-lg transition-colors',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive && 'text-primary')} />
              <span className={cn(
                'text-[10px] mt-1 font-medium',
                isActive && 'text-primary'
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function TopHeader() {
  const { isOffline, pendingSyncCount } = useApp()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">HSE Pointeur</h1>
            <p className="text-[10px] text-muted-foreground">Premium Logistics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sync Status */}
          <div className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
            isOffline 
              ? 'bg-warning/20 text-warning' 
              : pendingSyncCount > 0 
                ? 'bg-info/20 text-info'
                : 'bg-success/20 text-success'
          )}>
            {isOffline ? (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                <span>Hors ligne</span>
              </>
            ) : pendingSyncCount > 0 ? (
              <>
                <div className="h-2 w-2 rounded-full bg-info animate-pulse" />
                <span>{pendingSyncCount} sync</span>
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5" />
                <span>Synchronisé</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
