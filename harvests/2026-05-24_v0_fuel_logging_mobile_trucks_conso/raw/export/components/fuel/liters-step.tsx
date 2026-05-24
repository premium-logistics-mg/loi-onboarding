"use client"

import { useState, useCallback } from "react"
import { Camera, Delete, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepHeader } from "./step-header"
import { CameraCapture } from "./camera-capture"

interface LitersStepProps {
  onSubmit: (liters: number, odometerPhoto?: string, odometer?: number) => void
  onBack: () => void
  stepNumber: number
  selectedVehicle?: string
  selectedStation?: string
}

export function LitersStep({ onSubmit, onBack, stepNumber, selectedVehicle, selectedStation }: LitersStepProps) {
  const [liters, setLiters] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [odometerPhoto, setOdometerPhoto] = useState<string | null>(null)
  const [odometer, setOdometer] = useState<string>("")

  const handleKeyPress = useCallback((key: string) => {
    if (key === "delete") {
      setLiters(prev => prev.slice(0, -1))
    } else if (key === "." && !liters.includes(".")) {
      setLiters(prev => prev + ".")
    } else if (key !== "." && liters.length < 6) {
      setLiters(prev => prev + key)
    }
  }, [liters])

  const handleCameraCapture = useCallback((photoData: string) => {
    setOdometerPhoto(photoData)
    // Simulate OCR for odometer reading
    // In production, this would call an OCR API
    const mockOdometer = Math.floor(100000 + Math.random() * 50000)
    setOdometer(mockOdometer.toString())
    setShowCamera(false)
  }, [])

  const handleSubmit = useCallback(() => {
    const litersNum = parseFloat(liters)
    if (litersNum > 0) {
      onSubmit(
        litersNum, 
        odometerPhoto || undefined,
        odometer ? parseInt(odometer) : undefined
      )
    }
  }, [liters, odometerPhoto, odometer, onSubmit])

  const isValid = parseFloat(liters) > 0

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraCapture}
        onCancel={() => setShowCamera(false)}
        title="Photo compteur"
        instructions="Cadrer le compteur kilometrique"
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <StepHeader
        title="Litres GO"
        stepNumber={stepNumber}
        onBack={onBack}
        context={`${selectedVehicle} · ${selectedStation}`}
      />

      <div className="flex-1 p-4 flex flex-col">
        {/* Liters display */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <div className="h-20 flex items-center justify-center">
              <span className="text-5xl font-mono font-bold text-foreground">
                {liters || "0"}
              </span>
              <span className="text-2xl font-mono text-muted-foreground ml-2">L</span>
            </div>
            <p className="text-sm text-muted-foreground">Litres livres (GO)</p>
          </div>

          {/* Odometer photo button */}
          <Button
            variant="outline"
            onClick={() => setShowCamera(true)}
            className={`mb-4 h-12 px-6 rounded-xl ${odometerPhoto ? 'border-primary text-primary' : 'border-dashed border-muted-foreground/50'}`}
          >
            <Camera className="w-4 h-4 mr-2" />
            {odometerPhoto ? `Compteur: ${odometer} km` : "Photo compteur (optionnel)"}
          </Button>
        </div>

        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "delete"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={`h-16 rounded-xl text-2xl font-semibold transition-all active:scale-95 ${
                key === "delete"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {key === "delete" ? <Delete className="w-6 h-6 mx-auto" /> : key}
            </button>
          ))}
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="h-14 rounded-xl bg-primary text-primary-foreground text-lg font-semibold disabled:opacity-50"
        >
          <Check className="w-5 h-5 mr-2" />
          Valider {liters && `${liters} L`}
        </Button>
      </div>
    </div>
  )
}
