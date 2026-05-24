'use client'

import { useTireStore } from '@/lib/tire-store'
import { AXLE_POSITIONS, AxlePosition } from '@/lib/tire-types'
import { cn } from '@/lib/utils'

interface WheelProps {
  position: AxlePosition
  isSelected: boolean
  onSelect: () => void
}

function Wheel({ position, isSelected, onSelect }: WheelProps) {
  const isInner = position.position.includes('INT')
  const isOuter = position.position.includes('EXT')
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-11 h-11 rounded-full border-2 transition-all active:scale-95 flex items-center justify-center text-xs font-mono",
        isSelected
          ? "bg-primary border-primary text-primary-foreground"
          : "bg-card border-border text-muted-foreground",
        isInner && "scale-90",
        isOuter && "scale-100"
      )}
      aria-label={position.label}
    >
      {isInner ? 'I' : isOuter ? 'E' : ''}
    </button>
  )
}

interface AxleGroupProps {
  label: string
  positions: AxlePosition[]
  selectedId: string | null
  onSelect: (pos: AxlePosition) => void
  isDual?: boolean
}

function AxleGroup({ label, positions, selectedId, onSelect, isDual = false }: AxleGroupProps) {
  const leftPositions = positions.filter(p => p.position.includes('G'))
  const rightPositions = positions.filter(p => p.position.includes('D'))
  
  return (
    <div className="flex items-center gap-3">
      {/* Left wheels */}
      <div className={cn("flex gap-1", isDual && "flex-row-reverse")}>
        {leftPositions.map(pos => (
          <Wheel
            key={pos.id}
            position={pos}
            isSelected={selectedId === pos.id}
            onSelect={() => onSelect(pos)}
          />
        ))}
      </div>
      
      {/* Axle bar */}
      <div className="flex-1 flex items-center">
        <div className="flex-1 h-1.5 bg-muted rounded-full" />
        <span className="px-2 text-xs font-mono text-muted-foreground whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-1.5 bg-muted rounded-full" />
      </div>
      
      {/* Right wheels */}
      <div className={cn("flex gap-1", !isDual && "flex-row-reverse")}>
        {rightPositions.map(pos => (
          <Wheel
            key={pos.id}
            position={pos}
            isSelected={selectedId === pos.id}
            onSelect={() => onSelect(pos)}
          />
        ))}
      </div>
    </div>
  )
}

export function AxlePositionSelector() {
  const { updateCurrentEvent, nextStep, prevStep, currentEvent } = useTireStore()

  const handleSelect = (position: AxlePosition) => {
    updateCurrentEvent({ axlePosition: position.id })
  }

  const handleContinue = () => {
    if (currentEvent.axlePosition) {
      nextStep()
    }
  }

  // Group positions by axle type
  const dirPositions = AXLE_POSITIONS.filter(p => p.axle === 'DIR')
  const mot2Positions = AXLE_POSITIONS.filter(p => p.axle === 'MOT' && p.essieu === 2)
  const mot3Positions = AXLE_POSITIONS.filter(p => p.axle === 'MOT' && p.essieu === 3)
  const rem1Positions = AXLE_POSITIONS.filter(p => p.axle === 'REM' && p.essieu === 1)
  const rem2Positions = AXLE_POSITIONS.filter(p => p.axle === 'REM' && p.essieu === 2)
  const rem3Positions = AXLE_POSITIONS.filter(p => p.axle === 'REM' && p.essieu === 3)

  const selectedPosition = AXLE_POSITIONS.find(p => p.id === currentEvent.axlePosition)

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8">
      {/* Header */}
      <header className="mb-4">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-3 active:opacity-70 min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <h1 className="text-xl font-semibold text-foreground">Position du pneu</h1>
        <p className="text-sm text-muted-foreground">
          Touchez la roue concernée
        </p>
      </header>

      {/* Truck Diagram */}
      <div className="flex-1 bg-card rounded-sm p-4 border-2 border-border">
        {/* Cabine */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-8 bg-muted rounded-t-sm flex items-center justify-center">
            <span className="text-xs font-mono text-muted-foreground">CABINE</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Direction axle */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-center font-semibold">DIRECTION</p>
            <AxleGroup
              label="ESS 1"
              positions={dirPositions}
              selectedId={currentEvent.axlePosition || null}
              onSelect={handleSelect}
            />
          </div>

          {/* Moteur axles */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-center font-semibold">MOTEUR</p>
            <div className="space-y-3">
              <AxleGroup
                label="ESS 2"
                positions={mot2Positions}
                selectedId={currentEvent.axlePosition || null}
                onSelect={handleSelect}
                isDual
              />
              <AxleGroup
                label="ESS 3"
                positions={mot3Positions}
                selectedId={currentEvent.axlePosition || null}
                onSelect={handleSelect}
                isDual
              />
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-2 py-2">
            <div className="flex-1 border-t border-dashed border-border" />
            <span className="text-xs text-muted-foreground">REMORQUE</span>
            <div className="flex-1 border-t border-dashed border-border" />
          </div>

          {/* Remorque axles */}
          <div className="space-y-3">
            <AxleGroup
              label="REM 1"
              positions={rem1Positions}
              selectedId={currentEvent.axlePosition || null}
              onSelect={handleSelect}
            />
            <AxleGroup
              label="REM 2"
              positions={rem2Positions}
              selectedId={currentEvent.axlePosition || null}
              onSelect={handleSelect}
            />
            <AxleGroup
              label="REM 3"
              positions={rem3Positions}
              selectedId={currentEvent.axlePosition || null}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>

      {/* Selected Position Display */}
      {selectedPosition && (
        <div className="mt-4 p-3 bg-primary/10 rounded-sm border border-primary/30">
          <p className="text-center font-mono text-primary font-semibold">
            {selectedPosition.label}
          </p>
        </div>
      )}

      {/* Bouton continuer (bas d'écran · pouce) */}
      <button
        onClick={handleContinue}
        disabled={!currentEvent.axlePosition}
        className={cn(
          "mt-4 w-full py-4 rounded-sm font-semibold transition-all active:scale-[0.98] min-h-[44px]",
          currentEvent.axlePosition
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        Continuer
      </button>

      {/* Step indicator */}
      <footer className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                s <= 2 ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </footer>
    </div>
  )
}
