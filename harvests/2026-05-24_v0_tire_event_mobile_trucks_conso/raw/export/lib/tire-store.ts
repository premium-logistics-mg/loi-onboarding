'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TireEvent, EventType } from './tire-types'

// Write-path désactivé en MVP : on enregistre en local seulement (store + persist).
// TODO write-path (patron DDV · brancher Postgres quand MOBILE_WRITES_LIVE)
export const MOBILE_WRITES_LIVE = false

interface TireStore {
  // Événement en cours de saisie
  currentEvent: Partial<TireEvent>
  step: number

  // File locale (pas de POST tant que MOBILE_WRITES_LIVE = false)
  pendingEvents: TireEvent[]

  // Récap du dernier événement enregistré (pour l'écran succès)
  lastEvent: TireEvent | null

  // Actions
  setEventType: (type: EventType) => void
  updateCurrentEvent: (data: Partial<TireEvent>) => void
  nextStep: () => void
  prevStep: () => void
  resetEvent: () => void
  submitEvent: () => void
  isOnline: boolean
  setOnline: (online: boolean) => void
}

export const useTireStore = create<TireStore>()(
  persist(
    (set, get) => ({
      currentEvent: {},
      step: 0,
      pendingEvents: [],
      lastEvent: null,
      isOnline: true,

      setEventType: (type) => set({
        currentEvent: { type },
        step: 1,
      }),

      updateCurrentEvent: (data) => set((state) => ({
        currentEvent: { ...state.currentEvent, ...data },
      })),

      nextStep: () => set((state) => ({ step: state.step + 1 })),

      prevStep: () => set((state) => ({
        step: Math.max(0, state.step - 1),
      })),

      resetEvent: () => set({
        currentEvent: {},
        step: 0,
      }),

      submitEvent: () => {
        const { currentEvent, pendingEvents } = get()

        const event: TireEvent = {
          id: crypto.randomUUID(),
          type: currentEvent.type!,
          vehicleCode: currentEvent.vehicleCode!,
          vehiclePlate: currentEvent.vehiclePlate!,
          axlePosition: currentEvent.axlePosition!,
          brand: currentEvent.brand!,
          serialNumber: currentEvent.serialNumber!,
          reference: currentEvent.reference!,
          profile: currentEvent.profile,
          currentKm: currentEvent.currentKm!,
          wear: currentEvent.wear,
          photo: currentEvent.photo,
          proofPhotos: currentEvent.proofPhotos,
          treadDepth: currentEvent.treadDepth,
          decisionNote: currentEvent.decisionNote,
          timestamp: new Date(),
          synced: false,
        }

        // TODO write-path (patron DDV · brancher Postgres quand MOBILE_WRITES_LIVE)
        // MVP : enregistrement LOCAL uniquement, aucun POST backend.
        set({
          pendingEvents: [...pendingEvents, event],
          lastEvent: event,
          currentEvent: {},
          step: 5, // écran succès
        })
      },

      setOnline: (online) => set({ isOnline: online }),
    }),
    {
      name: 'tire-pointage-storage',
      partialize: (state) => ({
        pendingEvents: state.pendingEvents,
        lastEvent: state.lastEvent,
      }),
    }
  )
)
