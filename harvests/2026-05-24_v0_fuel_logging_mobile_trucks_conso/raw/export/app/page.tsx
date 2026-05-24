"use client"

import { useState, useCallback, useEffect } from "react"
import { HomeScreen } from "@/components/fuel/home-screen"
import { VehicleStep } from "@/components/fuel/vehicle-step"
import { StationStep } from "@/components/fuel/station-step"
import { LitersStep } from "@/components/fuel/liters-step"
import { TripStep } from "@/components/fuel/trip-step"
import { ConfirmStep } from "@/components/fuel/confirm-step"
import { SuccessScreen } from "@/components/fuel/success-screen"

export type FuelEntry = {
  id: string
  vehiclePlate: string
  vehicleCode: string
  station: string
  liters: number
  trip: string
  bcNumber?: string
  voyages?: number
  odometer?: number
  photos: {
    plate?: string
    ticket?: string
    odometer?: string
  }
  signature?: string
  timestamp: Date
  synced: boolean
}

type Step = "home" | "vehicle" | "station" | "liters" | "trip" | "confirm" | "success"

const VEHICLES = [
  { plate: "6851TCB", code: "S001", type: "SCHACMAN" },
  { plate: "6852TCB", code: "S002", type: "SCHACMAN" },
  { plate: "6853TCB", code: "S003", type: "KERAX" },
  { plate: "6854TCB", code: "S004", type: "KERAX" },
  { plate: "6855TCB", code: "S005", type: "SCHACMAN" },
  { plate: "6856TCB", code: "S006", type: "KERAX" },
]

const STATIONS = [
  { id: "galana-tmm", name: "GALANA TMM", color: "#E11D48" },
  { id: "galana-mmg", name: "GALANA MMG", color: "#E11D48" },
  { id: "total-energies", name: "TOTAL ENERGIES", color: "#1D4ED8" },
]

const TRIPS = [
  "TMM-TANA",
  "MANGORO-ADM",
  "DEPOT ITALYA-PORT",
  "TANA-TMM",
  "ADM-MANGORO",
  "PORT-DEPOT ITALYA",
]

export default function FuelPointagePage() {
  const [step, setStep] = useState<Step>("home")
  const [entry, setEntry] = useState<Partial<FuelEntry>>({
    photos: {},
    timestamp: new Date(),
    synced: false,
  })
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    // Load pending entries count from localStorage
    const pending = localStorage.getItem("fuel_pending_entries")
    if (pending) {
      const entries = JSON.parse(pending)
      setPendingCount(entries.length)
    }
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleStartNew = useCallback(() => {
    setEntry({
      id: crypto.randomUUID(),
      photos: {},
      timestamp: new Date(),
      synced: false,
    })
    setStep("vehicle")
  }, [])

  const handleBack = useCallback(() => {
    const stepOrder: Step[] = ["home", "vehicle", "station", "liters", "trip", "confirm"]
    const currentIndex = stepOrder.indexOf(step)
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1])
    }
  }, [step])

  const handleVehicleSelect = useCallback((plate: string, code: string, photo?: string) => {
    setEntry(prev => ({
      ...prev,
      vehiclePlate: plate,
      vehicleCode: code,
      photos: { ...prev.photos, plate: photo },
    }))
    setStep("station")
  }, [])

  const handleStationSelect = useCallback((station: string) => {
    setEntry(prev => ({ ...prev, station }))
    setStep("liters")
  }, [])

  const handleLitersSubmit = useCallback((liters: number, odometerPhoto?: string, odometer?: number) => {
    setEntry(prev => ({
      ...prev,
      liters,
      odometer,
      photos: { ...prev.photos, odometer: odometerPhoto },
    }))
    setStep("trip")
  }, [])

  const handleTripSubmit = useCallback((trip: string, bcNumber?: string, voyages?: number, ticketPhoto?: string) => {
    setEntry(prev => ({
      ...prev,
      trip,
      bcNumber,
      voyages,
      photos: { ...prev.photos, ticket: ticketPhoto },
    }))
    setStep("confirm")
  }, [])

  const handleConfirm = useCallback((signature: string) => {
    const finalEntry: FuelEntry = {
      ...entry as FuelEntry,
      signature,
      timestamp: new Date(),
    }

    // Save to localStorage (offline-first)
    const pending = localStorage.getItem("fuel_pending_entries")
    const entries: FuelEntry[] = pending ? JSON.parse(pending) : []
    entries.push(finalEntry)
    localStorage.setItem("fuel_pending_entries", JSON.stringify(entries))
    setPendingCount(entries.length)

    // TODO: write-path - sync to backend when online
    // POST /api/fuel/entries with finalEntry
    
    setStep("success")
  }, [entry])

  const handleNewEntry = useCallback(() => {
    setEntry({
      id: crypto.randomUUID(),
      photos: {},
      timestamp: new Date(),
      synced: false,
    })
    setStep("home")
  }, [])

  const stepNumber = () => {
    const steps: Step[] = ["vehicle", "station", "liters", "trip", "confirm"]
    return steps.indexOf(step) + 1
  }

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom flex flex-col">
      {step === "home" && (
        <HomeScreen
          onStartNew={handleStartNew}
          isOnline={isOnline}
          pendingCount={pendingCount}
        />
      )}

      {step === "vehicle" && (
        <VehicleStep
          vehicles={VEHICLES}
          onSelect={handleVehicleSelect}
          onBack={handleBack}
          stepNumber={stepNumber()}
        />
      )}

      {step === "station" && (
        <StationStep
          stations={STATIONS}
          onSelect={handleStationSelect}
          onBack={handleBack}
          stepNumber={stepNumber()}
          selectedVehicle={entry.vehiclePlate}
        />
      )}

      {step === "liters" && (
        <LitersStep
          onSubmit={handleLitersSubmit}
          onBack={handleBack}
          stepNumber={stepNumber()}
          selectedVehicle={entry.vehiclePlate}
          selectedStation={entry.station}
        />
      )}

      {step === "trip" && (
        <TripStep
          trips={TRIPS}
          onSubmit={handleTripSubmit}
          onBack={handleBack}
          stepNumber={stepNumber()}
          selectedVehicle={entry.vehiclePlate}
          selectedStation={entry.station}
          liters={entry.liters}
        />
      )}

      {step === "confirm" && (
        <ConfirmStep
          entry={entry as Omit<FuelEntry, "signature">}
          onConfirm={handleConfirm}
          onBack={handleBack}
          stepNumber={stepNumber()}
        />
      )}

      {step === "success" && (
        <SuccessScreen
          entry={entry as FuelEntry}
          onNewEntry={handleNewEntry}
          isOnline={isOnline}
        />
      )}
    </div>
  )
}
