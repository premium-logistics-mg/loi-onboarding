"use client"

import { Fuel, WifiOff, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeScreenProps {
  onStartNew: () => void
  isOnline: boolean
  pendingCount: number
}

export function HomeScreen({ onStartNew, isOnline, pendingCount }: HomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">LOI MOBILE</span>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <span className="flex items-center gap-1 text-xs text-warning">
                <WifiOff className="w-3 h-3" />
                Hors ligne
              </span>
            )}
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {pendingCount} en attente
              </span>
            )}
          </div>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Pointage Carburant</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Flotte SCHACMAN / KERAX
        </p>
      </div>

      {/* Main CTA Button */}
      <Button
        onClick={onStartNew}
        className="w-full max-w-sm h-32 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
      >
        <div className="flex flex-col items-center gap-3">
          <Fuel className="w-10 h-10" />
          <span>Nouveau plein</span>
        </div>
      </Button>

      {/* Footer info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Saisie rapide en 5 etapes
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Photo + Signature TER
        </p>
      </div>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 bg-warning/10 border border-warning/30 rounded-lg p-3">
          <p className="text-xs text-warning text-center">
            Mode hors ligne actif. Les donnees seront synchronisees au retour reseau.
          </p>
        </div>
      )}
    </div>
  )
}
