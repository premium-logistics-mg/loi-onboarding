'use client'

import { useState } from 'react'
import { AppProvider } from '@/lib/app-context'
import { BottomNav, TopHeader } from '@/components/navigation'
import { HomeScreen } from '@/components/home-screen'
import { CaptureScreen } from '@/components/capture-screen'
import { EPIScreen } from '@/components/epi-screen'
import { InspectionScreen } from '@/components/inspection-screen'
import { ActionsScreen } from '@/components/actions-screen'
import { FeedScreen } from '@/components/feed-screen'
import { SyncScreen } from '@/components/sync-screen'
import { HardHat, ClipboardCheck, Wifi, Truck } from 'lucide-react'

type TabId = 'accueil' | 'capture' | 'inspection' | 'actions' | 'feed'
type SubScreen = 'epi' | 'site' | 'sync' | 'truck' | null

function HSEApp() {
  const [activeTab, setActiveTab] = useState<TabId>('accueil')
  const [subScreen, setSubScreen] = useState<SubScreen>(null)

  const handleStartInspection = (id: string) => {
    setActiveTab('inspection')
    setSubScreen('site')
  }

  const handleReportIncident = () => {
    setActiveTab('capture')
  }

  const handleNewObservation = () => {
    setActiveTab('capture')
  }

  const handleTruckInspection = () => {
    setActiveTab('inspection')
    setSubScreen('truck')
  }

  const renderContent = () => {
    // Sub-screens
    if (subScreen === 'epi') {
      return <EPIScreen onBack={() => setSubScreen(null)} />
    }
    if (subScreen === 'site') {
      return <InspectionScreen onBack={() => setSubScreen(null)} />
    }
    if (subScreen === 'truck') {
      return <InspectionScreen onBack={() => setSubScreen(null)} />
    }
    if (subScreen === 'sync') {
      return <SyncScreen />
    }

    // Main tabs
    switch (activeTab) {
      case 'accueil':
        return (
          <HomeScreen
            onStartInspection={handleStartInspection}
            onReportIncident={handleReportIncident}
            onNewObservation={handleNewObservation}
            onTruckInspection={handleTruckInspection}
          />
        )
      case 'capture':
        return <CaptureScreen />
      case 'inspection':
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Inspections</h2>
                <p className="text-xs text-muted-foreground">Sélectionnez le type d&apos;inspection</p>
              </div>
            </div>

            {/* Inspection type selector */}
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setSubScreen('epi')}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl text-left hover:bg-secondary transition-colors"
              >
                <div className="h-14 w-14 rounded-xl bg-info/20 flex items-center justify-center flex-shrink-0">
                  <HardHat className="h-7 w-7 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Contrôle EPI</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Vérification équipement de protection individuelle
                  </p>
                </div>
                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => setSubScreen('truck')}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl text-left hover:bg-secondary transition-colors"
              >
                <div className="h-14 w-14 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <Truck className="h-7 w-7 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Inspection Véhicule</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Camion benne / Dumptruck - Contrôle départ ou complet
                  </p>
                </div>
                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => setSubScreen('site')}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl text-left hover:bg-secondary transition-colors"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Inspection de site</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Checklist sécurité par type de site
                  </p>
                </div>
                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => setSubScreen('sync')}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl text-left hover:bg-secondary transition-colors"
              >
                <div className="h-14 w-14 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Wifi className="h-7 w-7 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Centre de synchronisation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Gérer les données hors ligne
                  </p>
                </div>
                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )
      case 'actions':
        return <ActionsScreen />
      case 'feed':
        return <FeedScreen />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      {/* Main Content */}
      <main className="pt-16 pb-24 px-4">
        {renderContent()}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab)
          setSubScreen(null)
        }} 
      />
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <HSEApp />
    </AppProvider>
  )
}
