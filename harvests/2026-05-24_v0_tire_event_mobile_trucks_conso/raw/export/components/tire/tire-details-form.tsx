'use client'

import { useState, useRef } from 'react'
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
  type DecisionNote,
} from '@/lib/tire-types'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

// Lecture d'un fichier image natif → data URL (pas de getUserMedia/canvas)
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function TireDetailsForm() {
  const { updateCurrentEvent, nextStep, prevStep, currentEvent } = useTireStore()
  const proofInputRef = useRef<HTMLInputElement>(null)

  const isRemove = currentEvent.type === 'depose'

  const [formData, setFormData] = useState({
    brand: currentEvent.brand || '',
    serialNumber: currentEvent.serialNumber || '',
    reference: currentEvent.reference || '',
    profile: currentEvent.profile || '',
    currentKm: currentEvent.currentKm?.toString() || '',
    proofPhotos: currentEvent.proofPhotos || ([] as string[]),
  })

  const [wear, setWear] = useState<boolean>(currentEvent.wear ?? false)

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

  // Photo obligatoire si Dépose OU usure signalée
  const photoRequired = isRemove || wear

  const handleProofFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const incoming = Array.from(files).slice(0, 4 - formData.proofPhotos.length)
    const dataUrls = await Promise.all(incoming.map(fileToDataUrl))
    setFormData(prev => ({
      ...prev,
      proofPhotos: [...prev.proofPhotos, ...dataUrls].slice(0, 4),
    }))
  }

  const removeProofPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      proofPhotos: prev.proofPhotos.filter((_, i) => i !== index),
    }))
  }

  const handleContinue = () => {
    updateCurrentEvent({
      brand: formData.brand,
      serialNumber: formData.serialNumber,
      reference: formData.reference,
      profile: formData.profile,
      currentKm: parseInt(formData.currentKm) || 0,
      wear,
      proofPhotos: formData.proofPhotos,
      treadDepth: (treadDepth.exterior || treadDepth.center || treadDepth.interior) ? treadDepth : undefined,
      decisionNote: decisionNote.observation ? decisionNote : undefined,
    })
    nextStep()
  }

  const isValid =
    formData.brand &&
    formData.serialNumber &&
    formData.reference &&
    formData.currentKm &&
    (!photoRequired || formData.proofPhotos.length > 0)

  return (
    <div className="flex flex-col min-h-screen p-4 pb-8">
      {/* En-tête */}
      <header className="mb-4">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-3 active:opacity-70 min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <h1 className="text-xl font-semibold text-foreground">Détails du pneu</h1>
        <p className="text-sm text-muted-foreground">
          Marque, numéro, référence, km
        </p>
      </header>

      {/* Formulaire */}
      <div className="flex-1 space-y-4 overflow-auto -mx-4 px-4">
        {/* Marque */}
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
                  'py-3 px-4 rounded-sm text-sm font-medium transition-all active:scale-[0.98] min-h-[44px]',
                  formData.brand === brand
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border-2 border-border text-foreground'
                )}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Numéro de série */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Numéro de série
          </label>
          <Input
            value={formData.serialNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
            placeholder="Saisir le numéro…"
            className="h-12 text-base bg-card border-border font-mono rounded-sm"
          />
        </div>

        {/* Référence */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Référence
          </label>
          <div className="flex flex-wrap gap-2">
            {REFERENCES.map(ref => (
              <button
                key={ref}
                onClick={() => setFormData(prev => ({ ...prev, reference: ref }))}
                className={cn(
                  'py-3 px-4 rounded-sm text-sm font-mono transition-all active:scale-[0.98] min-h-[44px]',
                  formData.reference === ref
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border-2 border-border text-foreground'
                )}
              >
                {ref}
              </button>
            ))}
          </div>
        </div>

        {/* Km actuel */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Km actuel
          </label>
          <Input
            type="number"
            inputMode="numeric"
            value={formData.currentKm}
            onChange={(e) => setFormData(prev => ({ ...prev, currentKm: e.target.value }))}
            placeholder="82000"
            className="h-12 text-base bg-card border-border font-mono rounded-sm"
          />
        </div>

        {/* Usure */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => setWear(prev => !prev)}
            className={cn(
              'w-full flex items-center justify-between gap-3 p-4 rounded-sm border-2 transition-all active:scale-[0.98] min-h-[56px]',
              wear ? 'bg-warning/10 border-warning/50' : 'bg-card border-border'
            )}
          >
            <span className="text-sm font-medium text-foreground text-left">
              Usure constatée
              <span className="block text-xs text-muted-foreground">Photo obligatoire si oui</span>
            </span>
            <span className={cn(
              'w-12 h-7 rounded-full flex items-center px-1 transition-colors',
              wear ? 'bg-warning justify-end' : 'bg-muted justify-start'
            )}>
              <span className="w-5 h-5 rounded-full bg-card" />
            </span>
          </button>
        </div>

        {/* Mesure épaisseur */}
        <div className="border-t border-border pt-4">
          <h2 className="text-base font-semibold text-foreground mb-3">
            Épaisseur (mm)
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
                className="h-12 text-center text-lg bg-card border-border font-mono rounded-sm"
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
                className="h-12 text-center text-lg bg-card border-border font-mono rounded-sm"
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
                className="h-12 text-center text-lg bg-card border-border font-mono rounded-sm"
              />
            </div>
          </div>

          {/* Min épaisseur */}
          {(treadDepth.exterior > 0 || treadDepth.center > 0 || treadDepth.interior > 0) && (
            <div className="mt-2 p-2 rounded-sm bg-card border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Mini :</span>
                <span className={cn(
                  'font-mono font-medium',
                  Math.min(treadDepth.exterior || 99, treadDepth.center || 99, treadDepth.interior || 99) < 3
                    ? 'text-destructive'
                    : Math.min(treadDepth.exterior || 99, treadDepth.center || 99, treadDepth.interior || 99) < 5
                    ? 'text-warning'
                    : 'text-success'
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

        {/* Carnet de décision */}
        <div className="border-t border-border pt-4">
          <h2 className="text-base font-semibold text-foreground mb-3">
            Carnet de décision
          </h2>

          {/* Observations rapides */}
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
                    observation: prev.observation === obs ? '' : obs,
                  }))}
                  className={cn(
                    'py-2 px-3 rounded-sm text-xs transition-all active:scale-[0.98] min-h-[40px]',
                    decisionNote.observation === obs
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground'
                  )}
                >
                  {obs}
                </button>
              ))}
            </div>
          </div>

          {/* Escalade */}
          <div className="mb-3">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Prévenir qui ?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ESCALATION_LABELS) as EscalationTarget[]).map(target => (
                <button
                  key={target}
                  onClick={() => setDecisionNote(prev => ({
                    ...prev,
                    escalation: prev.escalation === target ? undefined : target,
                  }))}
                  className={cn(
                    'py-3 px-4 rounded-sm text-sm font-medium transition-all active:scale-[0.98] min-h-[44px]',
                    decisionNote.escalation === target
                      ? 'bg-warning/20 border-2 border-warning text-warning'
                      : 'bg-card border-2 border-border text-foreground'
                  )}
                >
                  {ESCALATION_LABELS[target]}
                </button>
              ))}
            </div>
          </div>

          {/* Urgence */}
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
                    'py-3 px-4 rounded-sm text-sm font-medium transition-all active:scale-[0.98] min-h-[44px]',
                    decisionNote.urgency === level
                      ? level === 'immediate'
                        ? 'bg-destructive text-destructive-foreground'
                        : level === 'today'
                        ? 'bg-warning/20 border-2 border-warning text-warning'
                        : level === 'week'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      : 'bg-card border-2 border-border text-foreground'
                  )}
                >
                  {URGENCY_LABELS[level].label}
                </button>
              ))}
            </div>
          </div>

          {/* Commentaire libre */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Commentaire
            </label>
            <textarea
              value={decisionNote.customComment}
              onChange={(e) => setDecisionNote(prev => ({ ...prev, customComment: e.target.value }))}
              placeholder="Notes en plus…"
              rows={2}
              className="w-full p-3 rounded-sm bg-card border-2 border-border text-foreground text-sm resize-none focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Photos preuve (input fichier natif) */}
        <div className="border-t border-border pt-4">
          <h2 className="text-base font-semibold text-foreground mb-1">
            Photo preuve {photoRequired && <span className="text-destructive">*</span>}
          </h2>
          {photoRequired && (
            <p className="text-xs text-destructive mb-3">
              Obligatoire pour {isRemove ? 'une dépose' : 'une usure'}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {formData.proofPhotos.map((photo, idx) => (
              <div key={idx} className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Preuve ${idx + 1}`}
                  className="w-full h-full object-cover rounded-sm"
                />
                <button
                  onClick={() => removeProofPhoto(idx)}
                  aria-label="Supprimer la photo"
                  className="absolute top-2 right-2 w-9 h-9 bg-background/80 rounded-sm flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {formData.proofPhotos.length < 4 && (
              <button
                onClick={() => proofInputRef.current?.click()}
                className={cn(
                  'aspect-square rounded-sm border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors',
                  photoRequired && formData.proofPhotos.length === 0
                    ? 'border-destructive/50 bg-destructive/5'
                    : 'border-border bg-card'
                )}
              >
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-muted-foreground">
                  Prendre une photo ({formData.proofPhotos.length}/4)
                </span>
              </button>
            )}
          </div>

          {/* Caméra native HTML5 (pas de getUserMedia) */}
          <input
            ref={proofInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              handleProofFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>

        {/* Profil (optionnel) */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Profil <span className="text-muted-foreground">(optionnel)</span>
          </label>
          <Input
            value={formData.profile}
            onChange={(e) => setFormData(prev => ({ ...prev, profile: e.target.value }))}
            placeholder="Ex : usure normale, recreusé…"
            className="h-12 text-base bg-card border-border rounded-sm"
          />
        </div>
      </div>

      {/* Bouton continuer (bas d'écran · pouce) */}
      <button
        onClick={handleContinue}
        disabled={!isValid}
        className={cn(
          'mt-4 w-full py-4 rounded-sm font-semibold transition-all active:scale-[0.98] min-h-[44px]',
          isValid
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        Vérifier
      </button>

      {/* Indicateur d'étape */}
      <footer className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                s <= 3 ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </footer>
    </div>
  )
}
