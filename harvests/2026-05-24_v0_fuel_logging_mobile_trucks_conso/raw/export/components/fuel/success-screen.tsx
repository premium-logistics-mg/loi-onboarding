"use client"

import { CheckCircle2, Plus, WifiOff, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FuelEntry } from "@/app/page"

interface SuccessScreenProps {
  entry: FuelEntry
  onNewEntry: () => void
  isOnline: boolean
}

export function SuccessScreen({ entry, onNewEntry, isOnline }: SuccessScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Success icon */}
      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-14 h-14 text-primary" />
      </div>

      {/* Success message */}
      <h1 className="text-2xl font-bold text-foreground text-center mb-2">
        Plein enregistre
      </h1>
      
      <p className="text-muted-foreground text-center mb-6">
        Les donnees ont ete sauvegardees
      </p>

      {/* Summary */}
      <div className="w-full max-w-sm bg-card rounded-2xl p-4 border border-border mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono font-bold text-lg text-foreground">{entry.vehiclePlate}</span>
          <span className="font-mono font-bold text-lg text-primary">{entry.liters} L</span>
        </div>
        <p className="text-sm text-muted-foreground">{entry.station}</p>
        <p className="text-sm text-muted-foreground">{entry.trip}</p>
        
        {/* Sync status */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs">
            {isOnline ? (
              <>
                <Cloud className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Pret a synchroniser</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-warning" />
                <span className="text-warning">Hors ligne - sync au retour reseau</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* New entry button */}
      <Button
        onClick={onNewEntry}
        className="w-full max-w-sm h-14 rounded-xl bg-primary text-primary-foreground text-lg font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" />
        Nouveau plein
      </Button>

      {/* Timestamp */}
      <p className="text-xs text-muted-foreground mt-6">
        {new Date().toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  )
}
