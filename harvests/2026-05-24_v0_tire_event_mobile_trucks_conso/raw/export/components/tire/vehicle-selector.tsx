'use client'

import { useState } from 'react'
import { useTireStore } from '@/lib/tire-store'
import { VEHICLES } from '@/lib/tire-types'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export function VehicleSelector() {
  const { updateCurrentEvent, nextStep, prevStep, currentEvent } = useTireStore()
  const [search, setSearch] = useState('')

  const filteredVehicles = VEHICLES.filter(v => 
    v.code.toLowerCase().includes(search.toLowerCase()) ||
    v.plate.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (vehicle: typeof VEHICLES[0]) => {
    updateCurrentEvent({
      vehicleCode: vehicle.code,
      vehiclePlate: vehicle.plate,
    })
    nextStep()
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8">
      {/* Header */}
      <header className="mb-4">
        <button 
          onClick={prevStep}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-3 active:opacity-70"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <h1 className="text-xl font-semibold text-foreground">Véhicule</h1>
        <p className="text-sm text-muted-foreground">
          Sélectionnez le véhicule concerné
        </p>
      </header>

      {/* Search */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Rechercher (code ou plaque)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 text-base bg-card border-border"
        />
      </div>

      {/* Vehicle List */}
      <div className="flex-1 overflow-auto -mx-4 px-4 space-y-2">
        {filteredVehicles.map((vehicle) => (
          <button
            key={vehicle.code}
            onClick={() => handleSelect(vehicle)}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl transition-all active:scale-[0.98]",
              "bg-card border-2",
              currentEvent.vehicleCode === vehicle.code
                ? "border-primary"
                : "border-border hover:border-primary/40"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-mono font-semibold text-foreground">{vehicle.code}</p>
                <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
              {vehicle.type}
            </span>
          </button>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun véhicule trouvé
          </div>
        )}
      </div>

      {/* Step indicator */}
      <footer className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                s === 1 ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </footer>
    </div>
  )
}
