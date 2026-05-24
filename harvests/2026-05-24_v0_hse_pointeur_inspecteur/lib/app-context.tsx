'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type {
  Inspection,
  HSEEvent,
  EPICheck,
  SiteInspection,
  CorrectiveAction,
  ManagerFeedItem,
} from './types'
import {
  mockInspections,
  mockHSEEvents,
  mockEPIChecks,
  mockSiteInspections,
  mockCorrectiveActions,
  mockManagerFeedItems,
} from './mock-data'

interface AppState {
  inspections: Inspection[]
  hseEvents: HSEEvent[]
  epiChecks: EPICheck[]
  siteInspections: SiteInspection[]
  correctiveActions: CorrectiveAction[]
  managerFeed: ManagerFeedItem[]
  isOffline: boolean
  pendingSyncCount: number
}

interface AppContextType extends AppState {
  addHSEEvent: (event: Omit<HSEEvent, 'id' | 'syncStatus'>) => void
  updateInspectionStatus: (id: string, status: Inspection['status']) => void
  updateCorrectiveAction: (id: string, updates: Partial<CorrectiveAction>) => void
  addManagerFeedItem: (item: Omit<ManagerFeedItem, 'id' | 'syncStatus'>) => void
  retrySync: (id: string) => void
  setOfflineMode: (offline: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    inspections: mockInspections,
    hseEvents: mockHSEEvents,
    epiChecks: mockEPIChecks,
    siteInspections: mockSiteInspections,
    correctiveActions: mockCorrectiveActions,
    managerFeed: mockManagerFeedItems,
    isOffline: false,
    pendingSyncCount: 2,
  })

  const addHSEEvent = useCallback((event: Omit<HSEEvent, 'id' | 'syncStatus'>) => {
    const newEvent: HSEEvent = {
      ...event,
      id: `EVT-${String(Date.now()).slice(-6)}`,
      syncStatus: state.isOffline ? 'pending' : 'synced',
    }
    
    setState(prev => ({
      ...prev,
      hseEvents: [newEvent, ...prev.hseEvents],
      pendingSyncCount: prev.isOffline ? prev.pendingSyncCount + 1 : prev.pendingSyncCount,
    }))

    // Auto-generate manager feed item
    const feedItem: ManagerFeedItem = {
      id: `FEED-${String(Date.now()).slice(-6)}`,
      timestamp: event.dateTime,
      type: ['fatigue_conducteur', 'chargement_dangereux', 'vehicule_non_conforme'].includes(event.eventType) ? 'exploitation' : 'hse',
      title: `Nouvel événement: ${event.eventType}`,
      description: event.notes || 'Événement HSE enregistré',
      severity: event.severity,
      siteId: event.siteId,
      siteName: event.siteName,
      truckId: event.truckId,
      missionId: event.missionId,
      syncStatus: state.isOffline ? 'pending' : 'synced',
      escalated: event.escalated,
    }

    setState(prev => ({
      ...prev,
      managerFeed: [feedItem, ...prev.managerFeed],
    }))
  }, [state.isOffline])

  const updateInspectionStatus = useCallback((id: string, status: Inspection['status']) => {
    setState(prev => ({
      ...prev,
      inspections: prev.inspections.map(insp =>
        insp.id === id ? { ...insp, status, lastUpdated: new Date() } : insp
      ),
    }))
  }, [])

  const updateCorrectiveAction = useCallback((id: string, updates: Partial<CorrectiveAction>) => {
    setState(prev => ({
      ...prev,
      correctiveActions: prev.correctiveActions.map(action =>
        action.id === id ? { ...action, ...updates } : action
      ),
    }))
  }, [])

  const addManagerFeedItem = useCallback((item: Omit<ManagerFeedItem, 'id' | 'syncStatus'>) => {
    const newItem: ManagerFeedItem = {
      ...item,
      id: `FEED-${String(Date.now()).slice(-6)}`,
      syncStatus: state.isOffline ? 'pending' : 'synced',
    }
    setState(prev => ({
      ...prev,
      managerFeed: [newItem, ...prev.managerFeed],
    }))
  }, [state.isOffline])

  const retrySync = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      hseEvents: prev.hseEvents.map(evt =>
        evt.id === id ? { ...evt, syncStatus: 'pending' as const } : evt
      ),
    }))
    // Simulate sync after retry
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        hseEvents: prev.hseEvents.map(evt =>
          evt.id === id ? { ...evt, syncStatus: 'synced' as const } : evt
        ),
        pendingSyncCount: Math.max(0, prev.pendingSyncCount - 1),
      }))
    }, 1500)
  }, [])

  const setOfflineMode = useCallback((offline: boolean) => {
    setState(prev => ({ ...prev, isOffline: offline }))
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        addHSEEvent,
        updateInspectionStatus,
        updateCorrectiveAction,
        addManagerFeedItem,
        retrySync,
        setOfflineMode,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
