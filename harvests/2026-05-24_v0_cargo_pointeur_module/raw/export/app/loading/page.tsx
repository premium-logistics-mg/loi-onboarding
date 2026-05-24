'use client'

import { useState, useEffect } from 'react'
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
import { SyncBadge, StatusBadge } from '@/components/status-badges'
import { mockMissions, MINE_SITES } from '@/lib/mock-data'
import { CARGO_TYPE_LABELS, type CargoType, type LoadingEvent } from '@/lib/types'
import {
  Truck,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  User,
  Package,
  FileText,
  Lock,
  Timer,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type LoadingStatus = 'arrived_loading' | 'loading_started' | 'loading_completed' | 'awaiting_departure' | 'departed_loading'

const STATUS_STEPS: { status: LoadingStatus; label: string }[] = [
  { status: 'arrived_loading', label: 'Arrivé au site' },
  { status: 'loading_started', label: 'Chargement démarré' },
  { status: 'loading_completed', label: 'Chargement terminé' },
  { status: 'departed_loading', label: 'Départ du site' },
]

export default function LoadingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const missionId = searchParams.get('mission')

  const selectedMission = missionId
    ? mockMissions.find((m) => m.id === missionId)
    : null

  const [currentStatus, setCurrentStatus] = useState<LoadingStatus>('arrived_loading')
  const [formData, setFormData] = useState({
    mineSite: selectedMission?.mineSite || '',
    cargoType: selectedMission?.cargoType || '',
    tonnage: selectedMission?.estimatedTonnage?.toString() || '',
    loadingTicketNumber: '',
    sealNumber: '',
    trailerNumber: selectedMission?.trailerNumber || '',
    comments: '',
  })
  const [arrivalTime] = useState(new Date())
  const [loadingStartTime, setLoadingStartTime] = useState<Date | null>(null)
  const [loadingEndTime, setLoadingEndTime] = useState<Date | null>(null)
  const [photos, setPhotos] = useState<{ type: string; captured: boolean }[]>([
    { type: 'truck_empty', captured: false },
    { type: 'loading_ticket', captured: false },
    { type: 'loaded_truck', captured: false },
  ])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.status === currentStatus
  )

  const handleNextStatus = () => {
    if (currentStepIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentStepIndex + 1].status
      setCurrentStatus(nextStatus)
      
      if (nextStatus === 'loading_started') {
        setLoadingStartTime(new Date())
      } else if (nextStatus === 'loading_completed') {
        setLoadingEndTime(new Date())
      }
    }
  }

  const handlePhotoCapture = (type: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.type === type ? { ...p, captured: true } : p))
    )
  }

  const handleSubmit = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    // In real app, would save to local storage / sync queue
    router.push('/')
  }

  const waitingTime = loadingStartTime
    ? Math.round((loadingStartTime.getTime() - arrivalTime.getTime()) / 60000)
    : Math.round((new Date().getTime() - arrivalTime.getTime()) / 60000)

  const loadingDuration = loadingStartTime && loadingEndTime
    ? Math.round((loadingEndTime.getTime() - loadingStartTime.getTime()) / 60000)
    : null

  if (showConfirmation) {
    return (
      <div className="flex min-h-screen flex-col bg-background pb-20">
        <AppHeader title="Confirmation" subtitle="Vérifiez les informations" />
        
        <main className="flex-1 px-4 py-4">
          <Card className="border-primary/30 bg-card">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Résumé du chargement</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedMission?.id || 'Nouvelle mission'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
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
                  <span className="text-muted-foreground">Site mine</span>
                  <span className="font-medium">{formData.mineSite}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type cargo</span>
                  <span className="font-medium">
                    {CARGO_TYPE_LABELS[formData.cargoType as CargoType]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tonnage</span>
                  <span className="font-medium">{formData.tonnage}t</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bon de chargement</span>
                  <span className="font-medium">{formData.loadingTicketNumber}</span>
                </div>
                {formData.sealNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Numéro scellé</span>
                    <span className="font-medium">{formData.sealNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arrivée</span>
                  <span className="font-medium">
                    {format(arrivalTime, 'HH:mm', { locale: fr })}
                  </span>
                </div>
                {loadingStartTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Début chargement</span>
                    <span className="font-medium">
                      {format(loadingStartTime, 'HH:mm', { locale: fr })}
                    </span>
                  </div>
                )}
                {loadingEndTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fin chargement</span>
                    <span className="font-medium">
                      {format(loadingEndTime, 'HH:mm', { locale: fr })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Photos</span>
                  <span className="font-medium">
                    {photos.filter((p) => p.captured).length}/{photos.length}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
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
        title="Contrôle Chargement"
        subtitle={selectedMission?.mineSite || 'Site de chargement'}
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
                  {selectedMission.estimatedTonnage}t
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
              <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-amber-400">
                <Timer className="h-4 w-4" />
                <span>Attente: {waitingTime} min</span>
              </div>
            </div>

            {loadingDuration !== null && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Durée chargement: {loadingDuration} min</span>
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
              Informations chargement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mineSite">Site mine</Label>
              <Select
                value={formData.mineSite}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, mineSite: value }))
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Sélectionner le site" />
                </SelectTrigger>
                <SelectContent>
                  {MINE_SITES.map((site) => (
                    <SelectItem key={site} value={site}>
                      {site}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargoType">Type de cargaison</Label>
              <Select
                value={formData.cargoType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, cargoType: value }))
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CARGO_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tonnage">Tonnage (t)</Label>
                <Input
                  id="tonnage"
                  type="number"
                  value={formData.tonnage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tonnage: e.target.value }))
                  }
                  className="bg-secondary"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loadingTicket">N° Bon chargement</Label>
                <Input
                  id="loadingTicket"
                  value={formData.loadingTicketNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      loadingTicketNumber: e.target.value,
                    }))
                  }
                  className="bg-secondary"
                  placeholder="BDC-..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sealNumber">N° Scellé</Label>
                <Input
                  id="sealNumber"
                  value={formData.sealNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sealNumber: e.target.value }))
                  }
                  className="bg-secondary"
                  placeholder="SL-..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailerNumber">N° Remorque</Label>
                <Input
                  id="trailerNumber"
                  value={formData.trailerNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      trailerNumber: e.target.value,
                    }))
                  }
                  className="bg-secondary"
                  placeholder="TR-..."
                />
              </div>
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
                { type: 'truck_empty', label: 'Camion vide' },
                { type: 'loading_ticket', label: 'Bon chargement' },
                { type: 'loaded_truck', label: 'Camion chargé' },
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
                    -10.7167, 25.4667 (±8m)
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
        {currentStatus === 'departed_loading' && (
          <Button
            className="w-full bg-primary text-primary-foreground"
            size="lg"
            onClick={handleSubmit}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Soumettre le chargement
          </Button>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
