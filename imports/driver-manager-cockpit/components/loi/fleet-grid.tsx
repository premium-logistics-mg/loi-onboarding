'use client'

import { Info } from 'lucide-react'
import type { FleetDriverCard } from '@/lib/garage-types'
import { DriverCard } from './driver-card'

interface FleetGridProps {
  drivers: FleetDriverCard[]
  onDriverClick: (code: string) => void
}

export function FleetGrid({ drivers, onDriverClick }: FleetGridProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-bold tracking-wider text-amber-500 uppercase">
          FLEET GRID
        </h2>
        <span className="text-xs text-muted-foreground">({drivers.length} chauffeurs)</span>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.code}
            driver={driver}
            onClick={() => onDriverClick(driver.code)}
          />
        ))}
      </div>

      {/* Info footer */}
      <div className="flex items-start gap-2 p-4 bg-card/50 border border-border rounded-lg">
        <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Cliquez un chauffeur dans la grille au-dessus pour voir son profil 360 ·
          Identite · Performance · Safety · Wellness & Coaching · Carnet M13 · Asset Preservation · Ambassade Client.
          Consentement M13 verifie avant drill nominatif (doctrine D33).
        </p>
      </div>
    </section>
  )
}
