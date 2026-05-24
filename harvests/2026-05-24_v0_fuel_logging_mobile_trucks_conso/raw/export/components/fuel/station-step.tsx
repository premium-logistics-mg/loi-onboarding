"use client"

import { StepHeader } from "./step-header"

interface Station {
  id: string
  name: string
  color: string
}

interface StationStepProps {
  stations: Station[]
  onSelect: (station: string) => void
  onBack: () => void
  stepNumber: number
  selectedVehicle?: string
}

export function StationStep({ stations, onSelect, onBack, stepNumber, selectedVehicle }: StationStepProps) {
  return (
    <div className="flex-1 flex flex-col">
      <StepHeader
        title="Station"
        stepNumber={stepNumber}
        onBack={onBack}
        context={selectedVehicle}
      />

      <div className="flex-1 p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Selectionnez la station service
        </p>

        <div className="space-y-3">
          {stations.map((station) => (
            <button
              key={station.id}
              onClick={() => onSelect(station.name)}
              className="w-full h-20 rounded-2xl border border-border bg-card hover:border-primary/50 active:scale-[0.98] transition-all flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${station.color}15 0%, transparent 100%)`,
                borderColor: `${station.color}30`,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: station.color }}
                />
                <span className="text-lg font-semibold text-foreground">
                  {station.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
