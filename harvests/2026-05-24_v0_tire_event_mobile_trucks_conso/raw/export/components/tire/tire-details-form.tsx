'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useTireStore } from '@/lib/tire-store'
import { 
  BRANDS, 
  REFERENCES, 
  PRESET_OBSERVATIONS, 
  URGENCY_LABELS, 
  ESCALATION_LABELS,
  type UrgencyLevel,
  type EscalationTarget,
  type TreadMeasurement,
  type DecisionNote
} from '@/lib/tire-types'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

type CameraMode = 'none' | 'barcode' | 'photo' | 'odometer' | 'proof'

export function TireDetailsForm() {
  const { updateCurrentEvent, nextStep, prevStep, currentEvent } = useTireStore()
  const [cameraMode, setCameraMode] = useState<CameraMode>('none')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const isEclatement = currentEvent.type === 'eclatement'
  
  const [formData, setFormData] = useState({
    brand: currentEvent.brand || '',
    serialNumber: currentEvent.serialNumber || '',
    reference: currentEvent.reference || '',
    profile: currentEvent.profile || '',
    currentKm: currentEvent.currentKm?.toString() || '',
    photo: currentEvent.photo || '',
    proofPhotos: currentEvent.proofPhotos || [] as string[],
  })

  const [treadDepth, setTreadDepth] = useState<TreadMeasurement>({
    exterior: currentEvent.treadDepth?.exterior || 0,
    center: currentEvent.treadDepth?.center || 0,
    interior: currentEvent.treadDepth?.interior || 0,
  })

  const [decisionNote, setDecisionNote] = useState<DecisionNote>({
    observation: currentEvent.decisionNote?.observation || '',
    escalation: currentEvent.decisionNote?.escalation,
    urgency: currentEvent.decisionNote?.urgency || 'next_visit',
    customComment: currentEvent.decisionNote?.customComment || '',
  })

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraMode('none')
  }, [])

  const startCamera = async (mode: CameraMode) => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraMode(mode)
    } catch {
      setCameraError('Camera non disponible')
      setCameraMode('none')
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
    
    if (cameraMode === 'photo') {
      setFormData(prev => ({ ...prev, photo: dataUrl }))
    } else if (cameraMode === 'proof') {
      setFormData(prev => ({ 
        ...prev, 
        proofPhotos: [...prev.proofPhotos, dataUrl].slice(0, 4) // Max 4 proof photos
      }))
    }
    
    stopCamera()
  }

  const removeProofPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      proofPhotos: prev.proofPhotos.filter((_, i) => i !== index)
    }))
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleContinue = () => {
    updateCurrentEvent({
      brand: formData.brand,
      serialNumber: formData.serialNumber,
      reference: formData.reference,
      profile: formData.profile,
      currentKm: parseInt(formData.currentKm) || 0,
      photo: formData.photo,
      proofPhotos: formData.proofPhotos,
      treadDepth: (treadDepth.exterior || treadDepth.center || treadDepth.interior) ? treadDepth : undefined,
      decisionNote: decisionNote.observation ? decisionNote : undefined,
    })
    nextStep()
  }

  const isValid = formData.brand && formData.serialNumber && formData.reference && formData.currentKm &&
    (!isEclatement || (formData.photo || formData.proofPhotos.length > 0))

  // Camera overlay
  if (cameraMode !== 'none') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <header className="p-4 flex items-center justify-between">
          <button 
            onClick={stopCamera}
            className="text-foreground p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-medium text-foreground">
            {cameraMode === 'barcode' && 'Scanner code-barres'}
            {cameraMode === 'photo' && 'Photo du pneu'}
            {cameraMode === 'odometer' && 'Photo compteur'}
            {cameraMode === 'proof' && 'Photo preuve'}
          </span>
          <div className="w-10" />
        </header>
        
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />
          
          {cameraMode === 'barcode' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-32 border-2 border-primary rounded-lg" />
            </div>
          )}
        </div>
        
        <div className="p-6 flex justify-center">
          {cameraMode === 'barcode' ? (
            <button
              onClick={() => {
                // Simulate barcode scan for demo
                setFormData(prev => ({ ...prev, serialNumber: 'SN-' + Math.random().toString(36).substring(2, 10).toUpperCase() }))
                stopCamera()
              }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold"
            >
              Simuler scan
            </button>
          ) : (
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-primary border-4 border-primary-foreground flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary-foreground" />
            </button>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8">
      {/* Header */}
      <header className="mb-4">
        <button 
          onClick={prevStep}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-3 active:opacity-70"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <h1 className="text-xl font-semibold text-foreground">Details Pneu</h1>
        <p className="text-sm text-muted-foreground">
          Renseignez les informations du pneu
        </p>
      </header>

      {/* Form */}
      <div className="flex-1 space-y-4 overflow-auto -mx-4 px-4">
        {/* Brand */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Marque
          </label>
          <div className="grid grid-cols-2 gap-2">
            {BRANDS.map(brand => (
              <button
                key={brand}
                onClick={() => setFormData(prev => ({ ...prev, brand }))}
                className={cn(
                  "py-3 px-4 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                  formData.brand === brand
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border-2 border-border text-foreground hover:border-primary/40"
                )}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Serial Number */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            N de serie
          </label>
          <div className="flex gap-2">
            <Input
              value={formData.serialNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              placeholder="Scanner ou saisir..."
              className="h-12 text-base bg-card border-border font-mono flex-1"
            />
            <button
              onClick={() => startCamera('barcode')}
              className="h-12 w-12 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
          </div>
          {cameraError && (
            <p className="text-xs text-destructive mt-1">{cameraError}</p>
          )}
        </div>

        {/* Reference */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Reference
          </label>
          <div className="flex flex-wrap gap-2">
            {REFERENCES.map(ref => (
              <button
                key={ref}
                onClick={() => setFormData(prev => ({ ...prev, reference: ref }))}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-mono transition-all active:scale-[0.98]",
                  formData.reference === ref
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border-2 border-border text-foreground hover:border-primary/40"
                )}
              >
                {ref}
              </button>
            ))}
          </div>
        </div>

        {/* Current KM */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Km actuel
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={formData.currentKm}
              onChange={(e) => setFormData(prev => ({ ...prev, currentKm: e.target.value }))}
              placeholder="82000"
              className="h-12 text-base bg-card border-border font-mono flex-1"
            />
            <button
              onClick={() => startCamera('odometer')}
              className="h-12 w-12 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-4">
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Mesure epaisseur (mm)
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block text-center">EXT</label>
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={treadDepth.exterior || ''}
                onChange={(e) => setTreadDepth(prev => ({ ...prev, exterior: parseFloat(e.target.value) || 0 }))}
                placeholder="0.0"
                className="h-12 text-center text-lg bg-card border-border font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block text-center">CENTRE</label>
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={treadDepth.center || ''}
                onChange={(e) => setTreadDepth(prev => ({ ...prev, center: parseFloat(e.target.value) || 0 }))}
                placeholder="0.0"
                className="h-12 text-center text-lg bg-card border-border font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block text-center">INT</label>
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={treadDepth.interior || ''}
                onChange={(e) => setTreadDepth(prev => ({ ...prev, interior: parseFloat(e.target.value) || 0 }))}
                placeholder="0.0"
                className="h-12 text-center text-lg bg-card border-border font-mono"
              />
            </div>
          </div>
          
          {/* Tread depth indicator */}
          {(treadDepth.exterior > 0 || treadDepth.center > 0 || treadDepth.interior > 0) && (
            <div className="mt-2 p-2 rounded-lg bg-card border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Min:</span>
                <span className={cn(
                  "font-mono font-medium",
                  Math.min(treadDepth.exterior || 99, treadDepth.center || 99, treadDepth.interior || 99) < 3 
                    ? "text-destructive" 
                    : Math.min(treadDepth.exterior || 99, treadDepth.center || 99, treadDepth.interior || 99) < 5
                    ? "text-warning"
                    : "text-success"
                )}>
                  {Math.min(
                    treadDepth.exterior || 99, 
                    treadDepth.center || 99, 
                    treadDepth.interior || 99
                  ).toFixed(1)} mm
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Decision Notebook Section */}
        <div className="border-t border-border pt-4">
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Carnet de decision
          </h2>

          {/* Preset Observations */}
          <div className="mb-3">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Observation
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_OBSERVATIONS.map(obs => (
                <button
                  key={obs}
                  onClick={() => setDecisionNote(prev => ({ 
                    ...prev, 
                    observation: prev.observation === obs ? '' : obs 
                  }))}
                  className={cn(
                    "py-2 px-3 rounded-lg text-xs transition-all active:scale-[0.98]",
                    decisionNote.observation === obs
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/40"
                  )}
                >
                  {obs}
                </button>
              ))}
            </div>
          </div>

          {/* Escalation */}
          <div className="mb-3">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Escalader vers
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ESCALATION_LABELS) as EscalationTarget[]).map(target => (
                <button
                  key={target}
                  onClick={() => setDecisionNote(prev => ({ 
                    ...prev, 
                    escalation: prev.escalation === target ? undefined : target 
                  }))}
                  className={cn(
                    "py-3 px-4 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                    decisionNote.escalation === target
                      ? "bg-warning/20 border-2 border-warning text-warning"
                      : "bg-card border-2 border-border text-foreground hover:border-warning/40"
                  )}
                >
                  {ESCALATION_LABELS[target]}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="mb-3">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Urgence
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(URGENCY_LABELS) as UrgencyLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setDecisionNote(prev => ({ ...prev, urgency: level }))}
                  className={cn(
                    "py-3 px-4 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                    decisionNote.urgency === level
                      ? level === 'immediate' 
                        ? "bg-destructive text-destructive-foreground"
                        : level === 'today'
                        ? "bg-warning/20 border-2 border-warning text-warning"
                        : level === 'week'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                      : "bg-card border-2 border-border text-foreground hover:border-primary/40"
                  )}
                >
                  {URGENCY_LABELS[level].label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Comment */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Commentaire libre
            </label>
            <textarea
              value={decisionNote.customComment}
              onChange={(e) => setDecisionNote(prev => ({ ...prev, customComment: e.target.value }))}
              placeholder="Notes supplementaires..."
              rows={2}
              className="w-full p-3 rounded-xl bg-card border-2 border-border text-foreground text-sm resize-none focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Proof Photos Section */}
        <div className="border-t border-border pt-4">
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Photos preuve {isEclatement && <span className="text-destructive">*</span>}
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {formData.proofPhotos.map((photo, idx) => (
              <div key={idx} className="relative aspect-square">
                <img
                  src={photo}
                  alt={`Preuve ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={() => removeProofPhoto(idx)}
                  className="absolute top-2 right-2 w-7 h-7 bg-background/80 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            
            {formData.proofPhotos.length < 4 && (
              <button
                onClick={() => startCamera('proof')}
                className={cn(
                  "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors",
                  isEclatement && formData.proofPhotos.length === 0
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-muted-foreground">
                  {formData.proofPhotos.length}/4
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Profile (optional) */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Profil <span className="text-muted-foreground">(optionnel)</span>
          </label>
          <Input
            value={formData.profile}
            onChange={(e) => setFormData(prev => ({ ...prev, profile: e.target.value }))}
            placeholder="Ex: usure normale, recreuse..."
            className="h-12 text-base bg-card border-border"
          />
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!isValid}
        className={cn(
          "mt-4 w-full py-4 rounded-xl font-semibold transition-all active:scale-[0.98]",
          isValid
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        Verifier
      </button>

      {/* Step indicator */}
      <footer className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                s <= 3 ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </footer>
    </div>
  )
}
