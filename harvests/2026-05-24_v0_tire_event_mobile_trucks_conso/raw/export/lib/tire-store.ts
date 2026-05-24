'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TireEvent, EventType, TreadMeasurement, DecisionNote } from './tire-types'

interface TireStore {
  // Current event being created
  currentEvent: Partial<TireEvent>
  step: number
  
  // Offline queue
  pendingEvents: TireEvent[]
  
  // Actions
  setEventType: (type: EventType) => void
  updateCurrentEvent: (data: Partial<TireEvent>) => void
  nextStep: () => void
  prevStep: () => void
  resetEvent: () => void
  submitEvent: () => void
  syncEvents: () => Promise<void>
  isOnline: boolean
  setOnline: (online: boolean) => void
}

export const useTireStore = create<TireStore>()(
  persist(
    (set, get) => ({
      currentEvent: {},
      step: 0,
      pendingEvents: [],
      isOnline: true,
      
      setEventType: (type) => set({ 
        currentEvent: { type },
        step: 1 
      }),
      
      updateCurrentEvent: (data) => set((state) => ({
        currentEvent: { ...state.currentEvent, ...data }
      })),
      
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      
      prevStep: () => set((state) => ({ 
        step: Math.max(0, state.step - 1) 
      })),
      
      resetEvent: () => set({ 
        currentEvent: {},
        step: 0 
      }),
      
      submitEvent: () => {
        const { currentEvent, isOnline, pendingEvents } = get()
        
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
          photo: currentEvent.photo,
          proofPhotos: currentEvent.proofPhotos,
          treadDepth: currentEvent.treadDepth,
          decisionNote: currentEvent.decisionNote,
          timestamp: new Date(),
          synced: isOnline,
        }
        
        // TODO: write-path - Send to API when online
        // POST /api/tire-events with event data
        
        if (!isOnline) {
          set({ 
            pendingEvents: [...pendingEvents, event],
            currentEvent: {},
            step: 5 // Success screen
          })
        } else {
          set({ 
            currentEvent: {},
            step: 5 // Success screen
          })
        }
      },
      
      syncEvents: async () => {
        const { pendingEvents, isOnline } = get()
        
        if (!isOnline || pendingEvents.length === 0) return
        
        // TODO: write-path - Sync pending events to API
        // POST /api/tire-events/batch with pendingEvents
        
        const syncedEvents = pendingEvents.map(e => ({ ...e, synced: true }))
        console.log('[v0] Syncing events:', syncedEvents)
        
        set({ pendingEvents: [] })
      },
      
      setOnline: (online) => {
        set({ isOnline: online })
        if (online) {
          get().syncEvents()
        }
      },
    }),
    {
      name: 'tire-pointage-storage',
      partialize: (state) => ({ 
        pendingEvents: state.pendingEvents,
      }),
    }
  )
)
