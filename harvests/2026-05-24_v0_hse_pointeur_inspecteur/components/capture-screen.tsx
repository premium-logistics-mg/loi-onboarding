'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Zap,
  Flame,
  ShieldAlert,
  HardHat,
  Droplets,
  Moon,
  Gauge,
  Package,
  AlertOctagon,
  Truck,
  MoreHorizontal,
  MapPin,
  Camera,
  Mic,
  FileText,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'
import type { EventType, Severity, OperationalImpact } from '@/lib/types'
import { eventTypes, severityLabels, operationalImpactLabels } from '@/lib/mock-data'

interface CaptureScreenProps {
  preselectedType?: EventType
  onBack?: () => void
}

const eventTypeConfig: { type: EventType; icon: typeof AlertTriangle; color: string }[] = [
  { type: 'incident', icon: AlertTriangle, color: 'bg-danger/20 text-danger border-danger/30' },
  { type: 'near_miss', icon: Zap, color: 'bg-warning/20 text-warning border-warning/30' },
  { type: 'acte_dangereux', icon: Flame, color: 'bg-danger/20 text-danger border-danger/30' },
  { type: 'condition_dangereuse', icon: ShieldAlert, color: 'bg-warning/20 text-warning border-warning/30' },
  { type: 'non_conformite_epi', icon: HardHat, color: 'bg-info/20 text-info border-info/30' },
  { type: 'fuite_pollution', icon: Droplets, color: 'bg-danger/20 text-danger border-danger/30' },
  { type: 'fatigue_conducteur', icon: Moon, color: 'bg-critical/20 text-critical border-critical/30' },
  { type: 'exces_vitesse', icon: Gauge, color: 'bg-warning/20 text-warning border-warning/30' },
  { type: 'chargement_dangereux', icon: Package, color: 'bg-danger/20 text-danger border-danger/30' },
  { type: 'zone_non_securisee', icon: AlertOctagon, color: 'bg-warning/20 text-warning border-warning/30' },
  { type: 'vehicule_non_conforme', icon: Truck, color: 'bg-info/20 text-info border-info/30' },
  { type: 'autre', icon: MoreHorizontal, color: 'bg-secondary text-secondary-foreground border-border' },
]

const severityConfig: { value: Severity; color: string }[] = [
  { value: 'faible', color: 'bg-success/20 text-success border-success/30 data-[selected=true]:bg-success data-[selected=true]:text-success-foreground' },
  { value: 'moyen', color: 'bg-warning/20 text-warning border-warning/30 data-[selected=true]:bg-warning data-[selected=true]:text-warning-foreground' },
  { value: 'eleve', color: 'bg-danger/20 text-danger border-danger/30 data-[selected=true]:bg-danger data-[selected=true]:text-danger-foreground' },
  { value: 'critique', color: 'bg-critical/20 text-critical border-critical/30 data-[selected=true]:bg-critical data-[selected=true]:text-critical-foreground' },
]

const impactConfig: { value: OperationalImpact; color: string }[] = [
  { value: 'aucun', color: 'bg-secondary border-border' },
  { value: 'retard', color: 'bg-warning/20 border-warning/30' },
  { value: 'arret_mission', color: 'bg-danger/20 border-danger/30' },
  { value: 'blocage_chargement', color: 'bg-danger/20 border-danger/30' },
  { value: 'blocage_livraison', color: 'bg-danger/20 border-danger/30' },
  { value: 'escalade_manager', color: 'bg-critical/20 border-critical/30' },
]

const mockSites = [
  { id: 'SITE-001', name: 'Mine Khouribga - Zone A' },
  { id: 'SITE-002', name: 'Dépôt Casablanca Est' },
  { id: 'SITE-003', name: 'Base Logistique Marrakech' },
  { id: 'SITE-004', name: 'Atelier Mécanique Fès' },
  { id: 'SITE-005', name: 'Point Contrôle RN9 - Km 145' },
]

export function CaptureScreen({ preselectedType, onBack }: CaptureScreenProps) {
  const { addHSEEvent, isOffline } = useApp()
  const [step, setStep] = useState<'type' | 'details' | 'confirm'>(preselectedType ? 'details' : 'type')
  const [selectedType, setSelectedType] = useState<EventType | null>(preselectedType || null)
  const [severity, setSeverity] = useState<Severity>('moyen')
  const [impact, setImpact] = useState<OperationalImpact>('aucun')
  const [siteId, setSiteId] = useState('')
  const [truckId, setTruckId] = useState('')
  const [driverName, setDriverName] = useState('')
  const [missionId, setMissionId] = useState('')
  const [immediateAction, setImmediateAction] = useState('')
  const [notes, setNotes] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date().toLocaleString('fr-FR'))
  }, [])

  const handleTypeSelect = (type: EventType) => {
    setSelectedType(type)
    setStep('details')
  }

  const handleSubmit = () => {
    if (!selectedType || !siteId) return

    const site = mockSites.find(s => s.id === siteId)
    
    addHSEEvent({
      eventType: selectedType,
      dateTime: new Date(),
      location: site?.name || 'Unknown',
      siteId,
      siteName: site?.name || 'Unknown',
      truckId: truckId || undefined,
      driverName: driverName || undefined,
      missionId: missionId || undefined,
      severity,
      immediateAction: immediateAction || undefined,
      operationalImpact: impact,
      notes: notes || undefined,
      escalated: severity === 'critique' || impact === 'escalade_manager',
    })

    setShowConfirmation(true)
    setTimeout(() => {
      setShowConfirmation(false)
      // Reset form
      setStep('type')
      setSelectedType(null)
      setSeverity('moyen')
      setImpact('aucun')
      setSiteId('')
      setTruckId('')
      setDriverName('')
      setMissionId('')
      setImmediateAction('')
      setNotes('')
    }, 2000)
  }

  if (showConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Événement HSE enregistré</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {isOffline 
            ? 'Les données seront synchronisées dès que le réseau revient'
            : 'Les données ont été synchronisées avec succès'
          }
        </p>
        <div className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium',
          isOffline ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
        )}>
          {isOffline ? 'En attente de synchronisation' : 'Synchronisé'}
        </div>
      </div>
    )
  }

  if (step === 'type') {
    return (
      <div className="space-y-4 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-danger/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Capture rapide HSE</h2>
            <p className="text-xs text-muted-foreground">Sélectionnez le type d&apos;événement</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {eventTypeConfig.map(({ type, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={cn(
                'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all active:scale-95',
                color
              )}
            >
              <Icon className="h-8 w-8 mb-2" />
              <span className="text-xs font-medium text-center leading-tight">
                {eventTypes[type]}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onBack ? onBack() : setStep('type')}
          className="h-10 w-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-foreground">
            {selectedType ? eventTypes[selectedType] : 'Événement HSE'}
          </h2>
          <p className="text-xs text-muted-foreground">Remplissez les détails</p>
        </div>
      </div>

      {/* Auto-generated info */}
      <Card className="bg-card border-border">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Date/Heure</span>
            <span className="font-medium text-foreground">
              {mounted ? currentTime : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> GPS
            </span>
            <span className="font-mono text-foreground">32.8854, -6.9063</span>
          </div>
        </CardContent>
      </Card>

      {/* Site Selection */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Site *</label>
        <select
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          className="w-full h-12 px-3 rounded-lg bg-input border border-border text-foreground text-sm"
        >
          <option value="">Sélectionner un site</option>
          {mockSites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">ID Camion</label>
          <Input
            value={truckId}
            onChange={(e) => setTruckId(e.target.value)}
            placeholder="TRK-XXX"
            className="h-12 bg-input"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">ID Mission</label>
          <Input
            value={missionId}
            onChange={(e) => setMissionId(e.target.value)}
            placeholder="MIS-XXXX"
            className="h-12 bg-input"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Nom conducteur</label>
        <Input
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          placeholder="Nom du conducteur"
          className="h-12 bg-input"
        />
      </div>

      {/* Severity */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Sévérité</label>
        <div className="grid grid-cols-4 gap-2">
          {severityConfig.map(({ value, color }) => (
            <button
              key={value}
              data-selected={severity === value}
              onClick={() => setSeverity(value)}
              className={cn(
                'py-3 rounded-lg border-2 text-xs font-medium transition-all',
                color
              )}
            >
              {severityLabels[value]}
            </button>
          ))}
        </div>
      </div>

      {/* Immediate Action */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Action immédiate prise
        </label>
        <Input
          value={immediateAction}
          onChange={(e) => setImmediateAction(e.target.value)}
          placeholder="Décrivez l'action prise..."
          className="h-12 bg-input"
        />
      </div>

      {/* Operational Impact */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Impact opérationnel
        </label>
        <div className="grid grid-cols-2 gap-2">
          {impactConfig.map(({ value, color }) => (
            <button
              key={value}
              onClick={() => setImpact(value)}
              className={cn(
                'py-3 px-2 rounded-lg border-2 text-xs font-medium transition-all',
                color,
                impact === value 
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                  : 'opacity-70'
              )}
            >
              {operationalImpactLabels[value]}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence placeholders */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 h-14 border-dashed">
          <Camera className="h-5 w-5 mr-2" />
          Photo
        </Button>
        <Button variant="outline" className="flex-1 h-14 border-dashed">
          <Mic className="h-5 w-5 mr-2" />
          Note vocale
        </Button>
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
          <FileText className="h-3 w-3" /> Notes
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Détails supplémentaires..."
          className="min-h-[100px] bg-input resize-none"
        />
      </div>

      {/* Submit */}
      <Button 
        onClick={handleSubmit}
        disabled={!siteId || !selectedType}
        className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
      >
        <CheckCircle2 className="h-5 w-5 mr-2" />
        Enregistrer événement HSE
      </Button>
    </div>
  )
}
