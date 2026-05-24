'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { MissionCard } from '@/components/mission-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { mockMissions } from '@/lib/mock-data'
import { Search, RefreshCw } from 'lucide-react'

export default function MissionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filters = [
    { id: 'all', label: 'Tous', count: mockMissions.length },
    { id: 'loading', label: 'À charger', count: mockMissions.filter(m => m.status === 'assigned').length },
    { id: 'transit', label: 'En transit', count: mockMissions.filter(m => ['departed_loading', 'loading_completed'].includes(m.status)).length },
    { id: 'delivery', label: 'À livrer', count: mockMissions.filter(m => ['arrived_delivery', 'unloading_started'].includes(m.status)).length },
    { id: 'anomaly', label: 'Anomalies', count: mockMissions.filter(m => m.status === 'delivered_anomaly').length },
  ]

  const filteredMissions = mockMissions.filter((mission) => {
    const matchesSearch =
      mission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.truckPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.driverName.toLowerCase().includes(searchQuery.toLowerCase())

    if (!activeFilter || activeFilter === 'all') return matchesSearch

    switch (activeFilter) {
      case 'loading':
        return matchesSearch && mission.status === 'assigned'
      case 'transit':
        return matchesSearch && ['departed_loading', 'loading_completed'].includes(mission.status)
      case 'delivery':
        return matchesSearch && ['arrived_delivery', 'unloading_started'].includes(mission.status)
      case 'anomaly':
        return matchesSearch && mission.status === 'delivered_anomaly'
      default:
        return matchesSearch
    }
  })

  const handleStartLoading = (missionId: string) => {
    router.push(`/loading?mission=${missionId}`)
  }

  const handleStartDelivery = (missionId: string) => {
    router.push(`/delivery?mission=${missionId}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader
        title="Cargo Pointeur"
        subtitle="Premium Logistics"
      />

      <main className="flex-1 px-4 py-4">
        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher mission, camion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Button variant="secondary" size="icon" className="shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id || (!activeFilter && filter.id === 'all') ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="shrink-0"
            >
              {filter.label}
              <Badge
                variant="outline"
                className="ml-1.5 h-5 min-w-5 px-1 text-xs"
              >
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Mission List */}
        <div className="space-y-4">
          {filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onStartLoading={() => handleStartLoading(mission.id)}
              onStartDelivery={() => handleStartDelivery(mission.id)}
            />
          ))}

          {filteredMissions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-secondary p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Aucune mission trouvée</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
