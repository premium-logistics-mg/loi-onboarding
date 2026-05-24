'use client'

import type { Truck } from '@/lib/loi-types'
import type { SOTracker as SOTrackerType, KPICard } from '@/lib/loi-types'
import type { TeamMember } from '@/lib/loi-types'
import { SOTracker } from './so-tracker'
import { KPICards } from './kpi-cards'
import { TruckTable } from './truck-table'
import { CascadePanel } from './cascade-panel'

interface OverviewTabProps {
  soTracker: SOTrackerType
  kpiCards: KPICard[]
  trucks: Truck[]
  teamMembers: TeamMember[]
  onTruckSelect: (truck: Truck) => void
  selectedTruckId?: string
}

export function OverviewTab({
  soTracker,
  kpiCards,
  trucks,
  teamMembers,
  onTruckSelect,
  selectedTruckId
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Top Section: SO Tracker + KPI Cards */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <SOTracker data={soTracker} />
        </div>
        <div className="col-span-8">
          <KPICards cards={kpiCards} />
        </div>
      </div>

      {/* Truck Table - Full Width */}
      <TruckTable 
        trucks={trucks} 
        onTruckSelect={onTruckSelect}
        selectedTruckId={selectedTruckId}
      />

      {/* CASCADE Panel - Below Table */}
      <CascadePanel members={teamMembers} />
    </div>
  )
}
