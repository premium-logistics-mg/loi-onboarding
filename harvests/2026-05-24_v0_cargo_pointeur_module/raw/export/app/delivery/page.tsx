'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/status-badges'
import { mockMissions, DELIVERY_SITES } from '@/lib/mock-data'
import { SEAL_STATUS_LABELS, type SealStatus } from '@/lib/types'
import {
  Truck,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  User,
  Package,
  FileText,
  Lock,
  Timer,
  Scale,
  Pen,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type DeliveryStatus = 'arrived_delivery' | 'unloading_started' | 'unloading_completed' | 'delivered' | 'delivered_anomaly'

const STATUS_STEPS: { status: DeliveryStatus; label: string }[] = [
  { status: 'arrived_delivery', label: 'Arrivé au site' },
  { status: 'unloading_started', label: 'Déchargement démarré' },
  { status: 'unloading_completed', label: 'Déchargement terminé' },
  { status: 'delivered', label: 'Livraison confirmée' },
]

export default function DeliveryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const missionId = searchParams.get('mission')

  const selectedMission = missionId
    ? mockMissions.find((m) => m.id === missionId)
    : mockMissions.find((m) => m.status === 'arrived_delivery' || m.status === 'departed_loading')

  const [currentStatus, setCurrentStatus] = useState<DeliveryStatus>('arrived_delivery')
  const [formData, setFormData] = useState({
    deliverySite: selectedMission?.deliverySite || '',
    receiverName: '',
    deliveryTicketNumber: '',
    tonnageReceived: selectedMission?.estimatedTonnage?.toString() || '',
    sealStatus: 'intact' as SealStatus,
    comments: '',
  })
  const [arrivalTime] = useState(new Date())
  const [unloadingStartTime, setUnloadingStartTime] = useState<Date | null>(null)
  const [unloadingEndTime, setUnloadingEndTime] = useState<Date | null>(null)
  const [photos, setPhotos] = useState<{ type: string; captured: boolean }[]>([
    { type: 'arrival', captured: false },
    { type: 'delivery_ticket', captured: false },
    { type: 'unloading_proof', captured: false },
  ])
  const [hasSignature, setHasSignature] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hasAnomaly, setHasAnomaly] = useState(false)

  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.status === currentStatus
  )

  const tonnageDifference = selectedMission?.estimatedTonnage && formData.tonnageReceived
    ? parseFloat(formData.tonnageReceived) - selectedMission.estimatedTonnage
    : 0

  const handleNextStatus = () => {
    if (currentStepIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentStepIndex + 1].status
      setCurrentStatus(nextStatus)
      
      if (nextStatus === 'unloading_started') {
        setUnloadingStartTime(new Date())
      } else if (nextStatus === 'unloading_completed') {
        setUnloadingEndTime(new Date())
      }
    }
  }

  const handlePhotoCapture = (type: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.type === type ? { ...p, captured: true } : p))
    )
  }

  const handleSubmit = () => {
    // Check for anomalies
    const anomalyDetected = 
      formData.sealStatus !== 'intact' || 
      Math.abs(tonnageDifference) > 1
    
    setHasAnomaly(anomalyDetected)
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    router.push('/')
  }

  const handleReportAnomaly = () => {
    router.push(`/anomalies/new?mission=${selectedMission?.id}`)
  }

  const unloadingDuration = unloadingStartTime && unloadingEndTime
    ? Math.round((unloadingEndTime.getTime() - unloadingStartTime.getTime()) / 60000)
    : null

  if (showConfirmation) {
    return (
      <div className="flex min-h-screen flex-col bg-background pb-20">
        <AppHeader title="Confirmation" subtitle="Vérifiez les informations" />
        
        <main className="flex-1 px-4 py-4">
          <Card className={`border-${hasAnomaly ? 'red-500/30' : 'primary/30'} bg-card`}>
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${hasAnomaly ? 'bg-red-500/20' : 'bg-primary/20'}`}>
                  {hasAnomaly ? (
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {hasAnomaly ? 'Livraison avec anomalie' : 'Résumé de livraison'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedMission?.id || 'Mission'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {hasAnomaly && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    Anomalies détectées:
                  </div>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-red-300">
                    {formData.sealStatus !== 'intact' && (
                      <li>Scellé: {SEAL_STATUS_LABELS[formData.sealStatus]}</li>
                    )}
                    {Math.abs(tonnageDifference) > 1 && (
                      <li>Écart tonnage: {tonnageDifference > 0 ? '+' : ''}{tonnageDifference.toFixed(1)}t</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Camion</span>
                  <span className="font-medium">{selectedMission?.truckPlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chauffeur</span>
                  <span className="font-medium">{selectedMission?.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Site livraison</span>
                  <span className="font-medium">{formData.deliverySite}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Réceptionnaire</span>
                  <span className="font-medium">{formData.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bon de livraison</span>
                  <span className="font-medium">{formData.deliveryTicketNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tonnage chargé</span>
                  <span className="font-medium">{selectedMission?.estimatedTonnage}t</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tonnage reçu</span>
                  <span className={`font-medium ${Math.abs(tonnageDifference) > 1 ? 'text-red-400' : ''}`}>
                    {formData.tonnageReceived}t
                    {tonnageDifference !== 0 && (
                      <span className="ml-1 text-xs">
                        ({tonnageDifference > 0 ? '+' : ''}{tonnageDifference.toFixed(1)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">État scellé</span>
                  <span className={`font-medium ${formData.sealStatus !== 'intact' ? 'text-red-400' : ''}`}>
                    {SEAL_STATUS_LABELS[formData.sealStatus]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signature</span>
                  <span className="font-medium">{hasSignature ? 'Capturée' : 'Non capturée'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Photos</span>
                  <span className="font-medium">
                    {photos.filter((p) => p.captured).length}/{photos.length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {hasAnomaly && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleReportAnomaly}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Signaler anomalie détaillée
                  </Button>
                )}
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Modifier
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={handleConfirm}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <AppHeader
        title="Contrôle Livraison"
        subtitle={selectedMission?.deliverySite || 'Site de livraison'}
      />

      <main className="flex-1 px-4 py-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour
        </Button>

        {/* Mission Info Card */}
        {selectedMission && (
          <Card className="mb-4 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium text-primary">
                      {selectedMission.id}
                    </div>
                    <div className="text-sm">{selectedMission.truckPlate}</div>
                  </div>
                </div>
                <StatusBadge status={selectedMission.status} />
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedMission.driverName}
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {selectedMission.estimatedTonnage}t chargé
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Progress */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex
                const isCurrent = index === currentStepIndex
                return (
                  <div key={step.status} className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isCurrent
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={
                        isCurrent ? 'font-medium' : 'text-muted-foreground'
                      }
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <Badge className="ml-auto bg-primary/20 text-primary">
                        En cours
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Timing Info */}
            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Arrivée: {format(arrivalTime, 'HH:mm', { locale: fr })}</span>
              </div>
            </div>

            {unloadingDuration !== null && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Durée déchargement: {unloadingDuration} min</span>
              </div>
            )}

            {currentStepIndex < STATUS_STEPS.length - 1 && (
              <Button
                className="mt-4 w-full bg-primary text-primary-foreground"
                size="lg"
                onClick={handleNextStatus}
              >
                {STATUS_STEPS[currentStepIndex + 1].label}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Informations livraison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deliverySite">Site de livraison</Label>
              <Select
                value={formData.deliverySite}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, deliverySite: value }))
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Sélectionner le site" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_SITES.map((site) => (
                    <SelectItem key={site} value={site}>
                      {site}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverName">Nom du réceptionnaire</Label>
              <Input
                id="receiverName"
                value={formData.receiverName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, receiverName: e.target.value }))
                }
                className="bg-secondary"
                placeholder="Nom complet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryTicket">N° Bon de livraison</Label>
              <Input
                id="deliveryTicket"
                value={formData.deliveryTicketNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryTicketNumber: e.target.value,
                  }))
                }
                className="bg-secondary"
                placeholder="BDL-..."
              />
            </div>

            {/* Tonnage with difference indicator */}
            <div className="space-y-2">
              <Label htmlFor="tonnageReceived" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Tonnage reçu (t)
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="tonnageReceived"
                  type="number"
                  step="0.1"
                  value={formData.tonnageReceived}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tonnageReceived: e.target.value,
                    }))
                  }
                  className="bg-secondary flex-1"
                  placeholder="0"
                />
                {tonnageDifference !== 0 && (
                  <Badge
                    className={
                      Math.abs(tonnageDifference) > 1
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }
                  >
                    {tonnageDifference > 0 ? '+' : ''}
                    {tonnageDifference.toFixed(1)}t
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Tonnage chargé: {selectedMission?.estimatedTonnage}t
              </p>
            </div>

            {/* Seal Status */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                État du scellé
              </Label>
              <Select
                value={formData.sealStatus}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    sealStatus: value as SealStatus,
                  }))
                }
              >
                <SelectTrigger className={`bg-secondary ${formData.sealStatus !== 'intact' ? 'border-red-500/50' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SEAL_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.sealStatus !== 'intact' && formData.sealStatus !== 'not_applicable' && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Anomalie détectée - sera signalée
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Commentaires</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comments: e.target.value }))
                }
                className="bg-secondary min-h-20"
                placeholder="Notes additionnelles..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Photos requises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'arrival', label: 'Arrivée camion' },
                { type: 'delivery_ticket', label: 'Bon livraison' },
                { type: 'unloading_proof', label: 'Déchargement' },
              ].map((photo) => {
                const captured = photos.find((p) => p.type === photo.type)?.captured
                return (
                  <button
                    key={photo.type}
                    onClick={() => handlePhotoCapture(photo.type)}
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
                      captured
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-border hover:border-primary/50 hover:bg-secondary'
                    }`}
                  >
                    {captured ? (
                      <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-400" />
                    ) : (
                      <Camera className="mb-2 h-8 w-8 text-muted-foreground" />
                    )}
                    <span className="text-xs text-center">{photo.label}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Signature */}
        <Card className="mb-4 border-border/50">
          <CardContent className="p-4">
            <button
              onClick={() => setHasSignature(true)}
              className={`w-full flex items-center justify-between rounded-lg border-2 border-dashed p-4 transition-colors ${
                hasSignature
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-border hover:border-primary/50 hover:bg-secondary'
              }`}
            >
              <div className="flex items-center gap-3">
                {hasSignature ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                ) : (
                  <Pen className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="text-left">
                  <div className="font-medium">
                    {hasSignature ? 'Signature capturée' : 'Signature réceptionnaire'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {hasSignature ? 'Appuyez pour modifier' : 'Appuyez pour capturer'}
                  </div>
                </div>
              </div>
              {hasSignature && (
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  OK
                </Badge>
              )}
            </button>
          </CardContent>
        </Card>

        {/* GPS Location */}
        <Card className="mb-4 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Position GPS capturée</div>
                  <div className="text-xs text-muted-foreground">
                    -15.4167, 28.2833 (±12m)
                  </div>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                OK
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        {currentStatus === 'delivered' && (
          <Button
            className="w-full bg-primary text-primary-foreground"
            size="lg"
            onClick={handleSubmit}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Soumettre la livraison
          </Button>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
