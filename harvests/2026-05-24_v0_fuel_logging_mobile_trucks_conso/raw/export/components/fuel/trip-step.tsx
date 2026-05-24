"use client"

import { useState, useCallback } from "react"
import { Camera, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StepHeader } from "./step-header"
import { CameraCapture } from "./camera-capture"

interface TripStepProps {
  trips: string[]
  onSubmit: (trip: string, bcNumber?: string, voyages?: number, ticketPhoto?: string) => void
  onBack: () => void
  stepNumber: number
  selectedVehicle?: string
  selectedStation?: string
  liters?: number
}

export function TripStep({ trips, onSubmit, onBack, stepNumber, selectedVehicle, selectedStation, liters }: TripStepProps) {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null)
  const [bcNumber, setBcNumber] = useState("")
  const [voyages, setVoyages] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [ticketPhoto, setTicketPhoto] = useState<string | null>(null)

  const handleCameraCapture = useCallback((photoData: string) => {
    setTicketPhoto(photoData)
    setShowCamera(false)
  }, [])

  const handleSubmit = useCallback(() => {
    if (selectedTrip) {
      onSubmit(
        selectedTrip,
        bcNumber || undefined,
        voyages ? parseInt(voyages) : undefined,
        ticketPhoto || undefined
      )
    }
  }, [selectedTrip, bcNumber, voyages, ticketPhoto, onSubmit])

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraCapture}
        onCancel={() => setShowCamera(false)}
        title="Photo BC/Ticket"
        instructions="Photographier le bon de commande ou ticket"
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <StepHeader
        title="Trajet"
        stepNumber={stepNumber}
        onBack={onBack}
        context={`${selectedVehicle} · ${liters}L`}
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Trip selection */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">Selectionnez le trajet</p>
          <div className="space-y-2">
            {trips.map((trip) => (
              <button
                key={trip}
                onClick={() => setSelectedTrip(trip)}
                className={`w-full p-4 rounded-xl border transition-all active:scale-[0.98] flex items-center justify-between ${
                  selectedTrip === trip
                    ? "bg-primary/20 border-primary"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <span className="font-medium text-foreground">{trip}</span>
                {selectedTrip === trip && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Optional fields */}
        {selectedTrip && (
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Informations optionnelles</p>
            
            {/* BC Number */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">N° BC (optionnel)</label>
              <Input
                type="text"
                placeholder="Numero du bon de commande"
                value={bcNumber}
                onChange={(e) => setBcNumber(e.target.value)}
                className="h-12 bg-secondary border-0 rounded-xl text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Voyages */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Voyages (optionnel)</label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Nombre de voyages"
                value={voyages}
                onChange={(e) => setVoyages(e.target.value)}
                className="h-12 bg-secondary border-0 rounded-xl text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Ticket photo */}
            <Button
              variant="outline"
              onClick={() => setShowCamera(true)}
              className={`w-full h-12 rounded-xl ${ticketPhoto ? 'border-primary text-primary' : 'border-dashed border-muted-foreground/50'}`}
            >
              <Camera className="w-4 h-4 mr-2" />
              {ticketPhoto ? "Photo BC ajoutee" : "Photo BC/Ticket (optionnel)"}
            </Button>
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="p-4 bg-background safe-area-bottom">
        <Button
          onClick={handleSubmit}
          disabled={!selectedTrip}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-semibold disabled:opacity-50"
        >
          Continuer
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
