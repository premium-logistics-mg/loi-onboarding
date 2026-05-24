"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Truck, Fuel, MapPin, FileText, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepHeader } from "./step-header"
import type { FuelEntry } from "@/app/page"

interface ConfirmStepProps {
  entry: Omit<FuelEntry, "signature">
  onConfirm: (signature: string) => void
  onBack: () => void
  stepNumber: number
}

export function ConfirmStep({ entry, onConfirm, onBack, stepNumber }: ConfirmStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    // Set drawing style
    ctx.strokeStyle = "#1A8E7E"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const getCoordinates = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const startDrawing = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }, [getCoordinates])

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
  }, [isDrawing, getCoordinates])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }, [])

  const handleConfirm = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return

    const signatureData = canvas.toDataURL("image/png")
    onConfirm(signatureData)
  }, [hasSignature, onConfirm])

  return (
    <div className="flex-1 flex flex-col">
      <StepHeader
        title="Confirmer"
        stepNumber={stepNumber}
        onBack={onBack}
        context="Signature TER"
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Summary card */}
        <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
          <h3 className="font-semibold text-foreground text-sm mb-3">Resume du plein</h3>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-mono font-semibold text-foreground">{entry.vehiclePlate}</p>
              <p className="text-xs text-muted-foreground">{entry.vehicleCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Fuel className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-mono font-semibold text-foreground text-xl">{entry.liters} L</p>
              <p className="text-xs text-muted-foreground">Gasoil</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{entry.station}</p>
              <p className="text-xs text-muted-foreground">{entry.trip}</p>
            </div>
          </div>

          {(entry.bcNumber || entry.voyages || entry.odometer) && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">
                {entry.bcNumber && <p>BC: {entry.bcNumber}</p>}
                {entry.voyages && <p>Voyages: {entry.voyages}</p>}
                {entry.odometer && <p>Compteur: {entry.odometer} km</p>}
              </div>
            </div>
          )}

          {/* Photos indicator */}
          {(entry.photos?.plate || entry.photos?.ticket || entry.photos?.odometer) && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Photos jointes: {[
                  entry.photos?.plate && "Plaque",
                  entry.photos?.ticket && "BC/Ticket",
                  entry.photos?.odometer && "Compteur"
                ].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Signature area */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground text-sm">Signature TER</h3>
            {hasSignature && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSignature}
                className="text-muted-foreground h-8"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Effacer
              </Button>
            )}
          </div>
          
          <div className="relative bg-secondary rounded-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-32 touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-muted-foreground text-sm">Signez ici</p>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Pacte TER - Validation terrain
          </p>
        </div>
      </div>

      {/* Confirm button */}
      <div className="p-4 bg-background safe-area-bottom">
        <Button
          onClick={handleConfirm}
          disabled={!hasSignature}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-semibold disabled:opacity-50"
        >
          <Check className="w-5 h-5 mr-2" />
          Enregistrer le plein
        </Button>
      </div>
    </div>
  )
}
