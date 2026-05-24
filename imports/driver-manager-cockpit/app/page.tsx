'use client'

import { useState } from 'react'
import { PillarBar } from '@/components/loi/pillar-bar'
import { Sidebar } from '@/components/loi/sidebar'
import { OverviewTab } from '@/components/loi/overview-tab'
import { PilotageTab } from '@/components/loi/pilotage-tab'
import { CoachingTab } from '@/components/loi/coaching-tab'
import { DriverDetailPanel } from '@/components/loi/driver-detail-panel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  pillars, 
  kpiCards, 
  soTracker, 
  drivers, 
  alerts, 
  arbitrages, 
  teamMembers,
  getDriverDetail 
} from '@/lib/driver-data'
import { pipelines, indicateurs, ranking, standards } from '@/lib/pilotage-data'
import { oneOnOnes, coachingActions, developmentObjectives } from '@/lib/coaching-data'
import type { Driver, DriverDetail } from '@/lib/loi-types'
import { Construction } from 'lucide-react'

export default function CockpitPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [cascadeOpen, setCascadeOpen] = useState(true)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [driverDetail, setDriverDetail] = useState<DriverDetail | null>(null)
  const [detailPanelOpen, setDetailPanelOpen] = useState(false)

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver)
    const detail = getDriverDetail(driver.id)
    setDriverDetail(detail)
    setDetailPanelOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailPanelOpen(false)
    setTimeout(() => {
      setSelectedDriver(null)
      setDriverDetail(null)
    }, 300)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            kpiCards={kpiCards}
            soTracker={soTracker}
            drivers={drivers}
            alerts={alerts}
            arbitrages={arbitrages}
            onDriverSelect={handleDriverSelect}
            selectedDriverId={selectedDriver?.id}
          />
        )
      case 'pilotage':
        return (
          <PilotageTab
            pipelines={pipelines}
            indicateurs={indicateurs}
            ranking={ranking}
            standards={standards}
          />
        )
      case 'coaching':
        return (
          <CoachingTab
            teamMembers={teamMembers}
            oneOnOnes={oneOnOnes}
            coachingActions={coachingActions}
            developmentObjectives={developmentObjectives}
          />
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <Construction className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">En cours de developpement</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Cette section sera disponible prochainement. Restez connecte pour les mises a jour.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Pillar Bar */}
      <PillarBar pillars={pillars} />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        teamMembers={teamMembers}
        cascadeOpen={cascadeOpen}
        onCascadeToggle={() => setCascadeOpen(!cascadeOpen)}
      />

      {/* Main Content */}
      <main className="ml-64 pt-14 min-h-screen">
        <ScrollArea className="h-[calc(100vh-56px)]">
          <div className="p-6">
            {/* Tab Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                {activeTab === 'overview' && "Vue d'ensemble"}
                {activeTab === 'pilotage' && 'Pilotage'}
                {activeTab === 'coaching' && 'Coaching'}
                {activeTab === 'copilot' && 'Copilot'}
                {activeTab === 'scorecards' && 'Scorecards'}
                {activeTab === 'carnet' && 'Carnet M13'}
                {activeTab === 'profil' && 'Profil'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'overview' && 'Suivi temps reel de la flotte et des chauffeurs'}
                {activeTab === 'pilotage' && 'Pipelines operationnels et indicateurs de pilotage'}
                {activeTab === 'coaching' && "Gestion d'equipe et developpement des lieutenants"}
              </p>
            </div>

            {/* Tab Content */}
            {renderTab()}
          </div>
        </ScrollArea>
      </main>

      {/* Driver Detail Panel */}
      <DriverDetailPanel
        driver={driverDetail}
        isOpen={detailPanelOpen}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
