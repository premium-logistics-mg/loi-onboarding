'use client'

import { useState } from 'react'
import { PillarBar } from '@/components/loi/pillar-bar'
import { Sidebar, type TabId } from '@/components/loi/sidebar'
import { OverviewTab } from '@/components/loi/overview-tab'
import { PilotageTab } from '@/components/loi/pilotage-tab'
import { CoachingTab } from '@/components/loi/coaching-tab'
import { TruckDetailPanel } from '@/components/loi/truck-detail-panel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Construction } from 'lucide-react'

// Data imports
import { pillars, kpiCards, soTracker, trucks, truckDetails, teamMembers } from '@/lib/maintenance-data'
import { 
  pipelines, 
  indicators, 
  deadlines, 
  alerts, 
  arbitrages, 
  tireBrandComparison, 
  topCostTrucks, 
  worstCostTrucks,
  tireStats 
} from '@/lib/pilotage-maintenance-data'
import { oneOnOnes, coachingActions, developmentObjectives } from '@/lib/coaching-maintenance-data'

import type { Truck } from '@/lib/loi-types'

function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-[#111d2e] border border-[#1e293b] flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-[#2dd4bf]" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">En cours de développement</p>
    </div>
  )
}

export default function MaintenanceCockpit() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null)
  const [activePillar, setActivePillar] = useState<string | undefined>()

  const handleTruckSelect = (truck: Truck) => {
    setSelectedTruck(truck)
  }

  const handleCloseDetail = () => {
    setSelectedTruck(null)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            soTracker={soTracker}
            kpiCards={kpiCards}
            trucks={trucks}
            teamMembers={teamMembers}
            onTruckSelect={handleTruckSelect}
            selectedTruckId={selectedTruck?.id}
          />
        )
      case 'pilotage':
        return (
          <PilotageTab
            pipelines={pipelines}
            indicators={indicators}
            deadlines={deadlines}
            alerts={alerts}
            arbitrages={arbitrages}
            tireBrands={tireBrandComparison}
            topCostTrucks={topCostTrucks}
            worstCostTrucks={worstCostTrucks}
            tireStats={tireStats}
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
      case 'copilot':
        return <PlaceholderTab title="Copilot IA" />
      case 'scorecards':
        return <PlaceholderTab title="Scorecards" />
      case 'carnet':
        return <PlaceholderTab title="Carnet M13" />
      case 'profil':
        return <PlaceholderTab title="Profil" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Pillar Bar */}
      <PillarBar 
        pillars={pillars} 
        activePillar={activePillar}
        onPillarClick={setActivePillar}
      />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className={`ml-64 pt-14 transition-all ${selectedTruck ? 'mr-[480px]' : ''}`}>
        <ScrollArea className="h-[calc(100vh-56px)]">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </ScrollArea>
      </main>

      {/* Truck Detail Panel */}
      {selectedTruck && (
        <TruckDetailPanel 
          truck={truckDetails[selectedTruck.id] || null} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  )
}
