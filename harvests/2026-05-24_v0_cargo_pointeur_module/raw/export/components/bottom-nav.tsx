'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Truck,
  Package,
  MapPin,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Missions', icon: Truck },
  { href: '/loading', label: 'Chargement', icon: Package },
  { href: '/delivery', label: 'Livraison', icon: MapPin },
  { href: '/anomalies', label: 'Anomalies', icon: AlertTriangle },
  { href: '/manager', label: 'Manager', icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
