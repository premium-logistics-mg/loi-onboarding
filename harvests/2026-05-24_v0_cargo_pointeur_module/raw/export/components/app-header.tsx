'use client'

import { Wifi, WifiOff, MapPin, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AppHeaderProps {
  title: string
  subtitle?: string
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  // Simulating online status - in real app would use navigator.onLine
  const isOnline = true
  const currentTime = format(new Date(), 'HH:mm', { locale: fr })

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">CP</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 text-xs"
          >
            <Clock className="h-3 w-3" />
            {currentTime}
          </Badge>
          <Badge
            variant={isOnline ? 'default' : 'destructive'}
            className="flex items-center gap-1.5 text-xs"
          >
            {isOnline ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </Badge>
        </div>
      </div>
    </header>
  )
}
