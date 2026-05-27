'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PillarBar } from '@/components/pillar-bar'
import { ObjectivesCard } from '@/components/objectives-card'
import { WorkQueue } from '@/components/work-queue'
import { CoachingSignals } from '@/components/coaching-signals'
import { CarnetList } from '@/components/carnet-list'
import { UserProfile } from '@/components/user-profile'
import { ActionBar } from '@/components/action-bar'
import { DDVModal, type DDVFormSubmit } from '@/components/modals/ddv-modal'
import { FactureModal, type FactureFormSubmit } from '@/components/modals/facture-modal'
import { DeclarationModal, type DeclarationFormSubmit } from '@/components/modals/declaration-modal'
import { STCModal, type STCFormSubmit } from '@/components/modals/stc-modal'
import { pillars, objectives, ddvQueue, coachingSignals, carnetEntries, userProfile } from '@/lib/data'
import type { DDVItem } from '@/lib/types'

const navItems = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: 'grid' },
  { id: 'assistant', label: 'Assistant', icon: 'chat' },
  { id: 'scores', label: 'Scores', icon: 'chart' },
  { id: 'carnet', label: 'Carnet de bord', icon: 'book' },
  { id: 'profil', label: 'Profil', icon: 'user' },
] as const

type NavId = typeof navItems[number]['id']

function NavIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'grid':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    case 'chat':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    case 'chart':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'book':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'user':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    default:
      return null
  }
}

interface FeedbackMessage {
  id: string
  type: 'success' | 'info'
  message: string
}

export function WorkspaceLayout() {
  const [activeTab, setActiveTab] = useState<NavId>('overview')
  
  // Modal states
  const [ddvModalOpen, setDdvModalOpen] = useState(false)
  const [factureModalOpen, setFactureModalOpen] = useState(false)
  const [declarationModalOpen, setDeclarationModalOpen] = useState(false)
  const [stcModalOpen, setStcModalOpen] = useState(false)
  
  // Feedback messages
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([])

  const addFeedback = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString()
    setFeedbacks((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id))
    }, 4000)
  }, [])

  // Handlers for form submissions (WRITES_LIVE=false - stub only)
  const handleDDVSubmit = useCallback((data: DDVFormSubmit) => {
    addFeedback(`DDV creee - ref ${data.numeroSerie} - objet: ${data.objet || 'N/A'} - transmise pour validation`)
  }, [addFeedback])

  const handleFactureSubmit = useCallback((data: FactureFormSubmit) => {
    addFeedback(`Facture emise - client ${data.client} - ref ${data.refDossier} - transmise Haja`)
  }, [addFeedback])

  const handleDeclarationSubmit = useCallback((data: DeclarationFormSubmit) => {
    addFeedback(`Declaration ${data.type} soumise - periode ${data.periode} - en attente validation`)
  }, [addFeedback])

  const handleSTCSubmit = useCallback((data: STCFormSubmit) => {
    addFeedback(`STC etabli - matricule ${data.matricule} - en attente visas ${(data.visas || []).join(', ')}`)
  }, [addFeedback])

  // Handler for work queue actions
  const handleQueueAction = useCallback((item: DDVItem, action: string) => {
    if (item.type === 'facturation') {
      setFactureModalOpen(true)
    } else if (item.type === 'cnaps') {
      setDeclarationModalOpen(true)
    } else if (item.type === 'stc') {
      setStcModalOpen(true)
    } else {
      setDdvModalOpen(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0B2540] border-b border-[#1A3A5C]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-[#F5F1E8]">
                  Admin-Fi
                </span>
                <span className="text-[#1A8E7E]">·</span>
                <span className="text-lg font-semibold text-[#1A8E7E]">
                  {userProfile.name}
                </span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-[#1A8E7E]/20 text-[#1A8E7E] text-xs rounded-md">
                Premium Logistics
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#F5F1E8]/60 font-mono">
                Madagascar
              </span>
              <div className="w-8 h-8 rounded-full bg-[#1A8E7E] flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {userProfile.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Pillar Bar - Full Width */}
      <PillarBar pillars={pillars} />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation - Vertical */}
        <aside className="w-56 bg-white border-r border-[#D4CFC4] flex flex-col">
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                      activeTab === item.id
                        ? 'bg-[#0B2540] text-[#F5F1E8]'
                        : 'text-[#4A5568] hover:bg-[#EBE6DB] hover:text-[#0B2540]'
                    )}
                  >
                    <NavIcon 
                      type={item.icon} 
                      className={cn(
                        'w-5 h-5',
                        activeTab === item.id ? 'text-[#1A8E7E]' : 'text-[#4A5568]'
                      )} 
                    />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#D4CFC4]">
            <div className="text-[10px] text-[#4A5568] font-mono">
              Design System D82
            </div>
            <div className="text-[10px] text-[#D97706] font-mono mt-1">
              WRITES_LIVE=false
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto relative">
          {/* Feedback Toast */}
          {feedbacks.length > 0 && (
            <div className="fixed top-24 right-6 z-50 flex flex-col gap-2">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className={cn(
                    'px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 flex items-center gap-2',
                    fb.type === 'success' 
                      ? 'bg-[#2D8659] text-white'
                      : 'bg-[#0B2540] text-[#F5F1E8]'
                  )}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{fb.message}</span>
                </div>
              ))}
            </div>
          )}

          <div className="max-w-[1200px] mx-auto p-6">
            {/* Vue d'ensemble - ACTION FIRST */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                {/* Action Bar */}
                <ActionBar
                  onCreateDDV={() => setDdvModalOpen(true)}
                  onEmitFacture={() => setFactureModalOpen(true)}
                  onSubmitDeclaration={() => setDeclarationModalOpen(true)}
                  onCreateSTC={() => setStcModalOpen(true)}
                />

                {/* Work Queue (File de travail) */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#0B2540] uppercase tracking-wide">
                      Ma file de travail
                    </h3>
                    <span className="text-xs text-[#4A5568]">
                      {ddvQueue.length} objet(s) en cours
                    </span>
                  </div>
                  <WorkQueue items={ddvQueue} onAction={handleQueueAction} />
                </div>

                {/* Objectives */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-[#0B2540] uppercase tracking-wide">
                    Ma contribution objectifs
                  </h3>
                  <ObjectivesCard objectives={objectives} />
                </div>

                {/* Coaching Signals */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-[#0B2540] uppercase tracking-wide">
                    Signaux de coaching
                  </h3>
                  <CoachingSignals signals={coachingSignals} />
                </div>
              </div>
            )}

            {/* Assistant */}
            {activeTab === 'assistant' && (
              <Card className="border-[#D4CFC4] shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-[#0B2540] uppercase tracking-wide">
                    Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-16 text-[#4A5568]">
                    <div className="w-16 h-16 mb-4 rounded-full bg-[#EBE6DB] flex items-center justify-center">
                      <NavIcon type="chat" className="w-8 h-8 text-[#0B2540]" />
                    </div>
                    <p className="text-sm">Assistant IA - A CONFIRMER</p>
                    <p className="text-xs mt-1 text-[#4A5568]/70">Fonctionnalite en cours de definition</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scores */}
            {activeTab === 'scores' && (
              <Card className="border-[#D4CFC4] shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-[#0B2540] uppercase tracking-wide">
                    Scores detailles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pillars.map((pillar) => (
                      <div
                        key={pillar.id}
                        className={cn(
                          'p-6 rounded-lg border',
                          pillar.isFocus
                            ? 'border-[#1A8E7E] bg-[#1A8E7E]/5'
                            : 'border-[#D4CFC4] bg-white'
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#0B2540]">
                              {pillar.shortName}
                            </span>
                            <span className="text-sm text-[#4A5568]">
                              {pillar.name}
                            </span>
                          </div>
                          {pillar.isFocus && (
                            <span className="px-2 py-0.5 bg-[#1A8E7E] text-white text-[10px] rounded-md">
                              Focus
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-4xl font-bold text-[#0B2540]">
                            {pillar.score}
                          </span>
                          <span className="text-sm text-[#4A5568]">/100</span>
                        </div>

                        <div className="mt-4 h-2 bg-[#EBE6DB] rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              pillar.isFocus ? 'bg-[#1A8E7E]' : 'bg-[#0B2540]'
                            )}
                            style={{ width: `${pillar.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Carnet de bord */}
            {activeTab === 'carnet' && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-[#0B2540] uppercase tracking-wide">
                  Decisions tracees & Escalades
                </h3>
                <CarnetList entries={carnetEntries} />
              </div>
            )}

            {/* Profil */}
            {activeTab === 'profil' && (
              <Card className="border-[#D4CFC4] shadow-none">
                <CardContent className="pt-6">
                  <UserProfile />
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#D4CFC4] bg-white">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between text-xs text-[#4A5568]">
            <span>LOI Workspace - Premium Logistics Madagascar</span>
            <span className="font-mono">CockpitLayout V2</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DDVModal
        open={ddvModalOpen}
        onClose={() => setDdvModalOpen(false)}
        onSubmit={handleDDVSubmit}
      />
      <FactureModal
        open={factureModalOpen}
        onClose={() => setFactureModalOpen(false)}
        onSubmit={handleFactureSubmit}
      />
      <DeclarationModal
        open={declarationModalOpen}
        onClose={() => setDeclarationModalOpen(false)}
        onSubmit={handleDeclarationSubmit}
      />
      <STCModal
        open={stcModalOpen}
        onClose={() => setStcModalOpen(false)}
        onSubmit={handleSTCSubmit}
      />
    </div>
  )
}
