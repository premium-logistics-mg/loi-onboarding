"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, Search, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StepHeader } from "./step-header"
import { CameraCapture } from "./camera-capture"

interface Vehicle {
  plate: string
  code: string
  type: string
}

interface VehicleStepProps {
  vehicles: Vehicle[]
  onSelect: (plate: string, code: string, photo?: string) => void
  onBack: () => void
  stepNumber: number
}

export function VehicleStep({ vehicles, onSelect, onBack, stepNumber }: VehicleStepProps) {
  const [search, setSearch] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null)

  const filteredVehicles = vehicles.filter(
    v => v.plate.toLowerCase().includes(search.toLowerCase()) ||
         v.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleCameraCapture = useCallback((photoData: string) => {
    setCapturedPhoto(photoData)
    // Simulate OCR detection - in production, this would call an OCR API
    // For demo, we'll try to match against known plates
    const mockDetection = vehicles.find(v => 
      Math.random() > 0.5 // Simulate 50% detection rate
    )
    if (mockDetection) {
      setDetectedPlate(mockDetection.plate)
      setSearch(mockDetection.plate)
    }
    setShowCamera(false)
  }, [vehicles])

  const handleSelect = useCallback((vehicle: Vehicle) => {
    onSelect(vehicle.plate, vehicle.code, capturedPhoto || undefined)
  }, [onSelect, capturedPhoto])

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraCapture}
        onCancel={() => setShowCamera(false)}
        title="Scanner la plaque"
        instructions="Cadrer la plaque du vehicule"
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <StepHeader
        title="Vehicule"
        stepNumber={stepNumber}
        onBack={onBack}
      />

      <div className="flex-1 p-4 space-y-4">
        {/* Scan button */}
        <Button
          variant="outline"
          onClick={() => setShowCamera(true)}
          className="w-full h-14 border-dashed border-2 border-primary/50 text-primary hover:bg-primary/10 rounded-xl"
        >
          <Camera className="w-5 h-5 mr-2" />
          Scanner la plaque
        </Button>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher (plaque ou code)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-secondary border-0 rounded-xl text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Detected plate indicator */}
        {detectedPlate && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
            <p className="text-sm text-primary">
              Plaque detectee : <span className="font-mono font-semibold">{detectedPlate}</span>
            </p>
          </div>
        )}

        {/* Vehicle list */}
        <div className="space-y-2">
          {filteredVehicles.map((vehicle) => (
            <button
              key={vehicle.plate}
              onClick={() => handleSelect(vehicle)}
              className={`w-full p-4 rounded-xl border transition-all active:scale-[0.98] ${
                detectedPlate === vehicle.plate
                  ? "bg-primary/20 border-primary"
                  : "bg-card border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-mono text-lg font-semibold text-foreground">
                    {vehicle.plate}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.code} · {vehicle.type}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun vehicule trouve</p>
          </div>
        )}
      </div>
    </div>
  )
}
