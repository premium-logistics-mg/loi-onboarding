'use client'

import { useEffect } from 'react'
import { useTireStore } from '@/lib/tire-store'
import { EventTypeSelector } from './event-type-selector'
import { VehicleSelector } from './vehicle-selector'
import { AxlePositionSelector } from './axle-position-selector'
import { TireDetailsForm } from './tire-details-form'
import { ConfirmationScreen } from './confirmation-screen'
import { SuccessScreen } from './success-screen'

export function TirePointage() {
  const { step, setOnline } = useTireStore()

  // Détection en ligne / hors ligne (indicatif · pas de POST en MVP)
  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    setOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline])

  // Étape courante
  switch (step) {
    case 0:
      return <EventTypeSelector />
    case 1:
      return <VehicleSelector />
    case 2:
      return <AxlePositionSelector />
    case 3:
      return <TireDetailsForm />
    case 4:
      return <ConfirmationScreen />
    case 5:
      return <SuccessScreen />
    default:
      return <EventTypeSelector />
  }
}
