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
import { mockMissions } from '@/lib/mock-data'
import {
  ANOMALY_TYPE_LABELS,
  SEVERITY_LABELS,
  SITE_TYPE_LABELS,
  type AnomalyType,
  type AnomalySeverity,
  type SiteType,
} from '@/lib/types'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronLeft,
  MapPin,
  Truck,
  ArrowUpCircle,
  Send,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function NewAnomalyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const missionId = searchParams.get('mission')

  const selectedMission = missionId
    ? mockMissions.find((m) => m.id === missionId)
    : null

  const [formData, setFormData] = useState({
    missionId: selectedMission?.id || '',
    truckPlate: selectedMission?.truckPlate || '',
    siteType: '' as SiteType | '',
    anomalyType: '' as AnomalyType | '',
    severity: 'medium' as AnomalySeverity,
    description: '',
    immediateAction: '',
  })
  const [photos, setPhotos] = useState<{ id: number; captured: boolean }[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleAddPhoto = () => {
    setPhotos((prev) => [...prev, { id: Date.now(), captured: false }])
  }

  const handlePhotoCapture = (id: number) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, captured: true } : p))
    )
  }

  const handleSubmit = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = (escalate: boolean) => {
    // In real app, would save to local storage / sync queue
    router.push('/anomalies')
  }

  const canSubmit =
    formData.siteType &&
    formData.anomalyType &&
    formData.description.length >= 10

  if (showConfirmation) {
    return (
      <div className="flex min-h-screen flex-col bg-background pb-20">
        <AppHeader title="Confirmation" subtitle="Vérifiez l'anomalie" />
        
        <main className="flex-1 px-4 py-4">
          <Card className="border-red-500/30 bg-card">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Anomalie signalée</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formData.missionId || 'Sans mission'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-3 text-sm">
                {formData.truckPlate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Camion</span>
                    <span className="font-medium">{formData.truckPlate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type de site</span>
                  <span className="font-medium">
                    {SITE_TYPE_LABELS[formData.siteType as SiteType]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type d&apos;anomalie</span>
                  <span className="font-medium">
                    {ANOMALY_TYPE_LABELS[formData.anomalyType as AnomalyType]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sévérité</span>
                  <Badge
                    className={
                      formData.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : formData.severity === 'high'
                        ? 'bg-orange-500/20 text-orange-400'
                        : formData.severity === 'medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-500/20 text-slate-300'
                    }
                  >
                    {SEVERITY_LABELS[formData.severity]}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="font-medium">
                    {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Photos</span>
                  <span className="font-medium">
                    {photos.filter((p) => p.captured).length} capturée(s)
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-secondary p-3">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Description:
                </div>
                <p className="text-sm">{formData.description}</p>
              </div>

              {formData.immediateAction && (
                <div className="rounded-lg bg-secondary p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Action immédiate:
                  </div>
                  <p className="text-sm">{formData.immediateAction}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleConfirm(true)}
                >
                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                  Soumettre et Escalader
                </Button>
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
                    onClick={() => handleConfirm(false)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Soumettre
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
        title="Nouvelle Anomalie"
        subtitle="Signaler un incident"
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

        {/* Mission Selection */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Mission concernée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mission">Mission</Label>
              <Select
                value={formData.missionId}
                onValueChange={(value) => {
                  const mission = mockMissions.find((m) => m.id === value)
                  setFormData((prev) => ({
                    ...prev,
                    missionId: value,
                    truckPlate: mission?.truckPlate || '',
                  }))
                }}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Sélectionner une mission" />
                </SelectTrigger>
                <SelectContent>
                  {mockMissions.map((mission) => (
                    <SelectItem key={mission.id} value={mission.id}>
                      {mission.id} - {mission.truckPlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="truckPlate">Plaque camion</Label>
              <Input
                id="truckPlate"
                value={formData.truckPlate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, truckPlate: e.target.value }))
                }
                className="bg-secondary"
                placeholder="CD-XXXX-XX"
              />
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Details */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Détails de l&apos;anomalie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type de site</Label>
              <Select
                value={formData.siteType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, siteType: value as SiteType }))
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Sélectionner le type de site" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SITE_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type d&apos;anomalie</Label>
              <Select
                value={formData.anomalyType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    anomalyType: value as AnomalyType,
                  }))
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ANOMALY_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sévérité</Label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.entries(SEVERITY_LABELS) as [AnomalySeverity, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, severity: key }))
                      }
                      className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                        formData.severity === key
                          ? key === 'critical'
                            ? 'border-red-500 bg-red-500/20 text-red-400'
                            : key === 'high'
                            ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                            : key === 'medium'
                            ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                            : 'border-slate-500 bg-slate-500/20 text-slate-300'
                          : 'border-border bg-secondary text-muted-foreground hover:border-muted-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="bg-secondary min-h-24"
                placeholder="Décrivez l'anomalie en détail..."
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10 caractères ({formData.description.length}/10)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="immediateAction">Action immédiate prise</Label>
              <Textarea
                id="immediateAction"
                value={formData.immediateAction}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    immediateAction: e.target.value,
                  }))
                }
                className="bg-secondary min-h-20"
                placeholder="Qu'avez-vous fait immédiatement?"
              />
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="mb-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => handlePhotoCapture(photo.id)}
                  className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed aspect-square transition-colors ${
                    photo.captured
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-border hover:border-primary/50 hover:bg-secondary'
                  }`}
                >
                  {photo.captured ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  ) : (
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  )}
                </button>
              ))}
              <button
                onClick={handleAddPhoto}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border aspect-square transition-colors hover:border-primary/50 hover:bg-secondary"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <span className="text-lg text-primary">+</span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">Ajouter</span>
              </button>
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
                    Position actuelle enregistrée
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
        <Button
          className="w-full bg-red-500 text-white hover:bg-red-600"
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          <AlertTriangle className="mr-2 h-5 w-5" />
          Signaler l&apos;anomalie
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}
