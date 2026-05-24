'use client'

import { useState } from 'react'
import { 
  Truck,
  Check,
  X,
  Minus,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  MessageSquare,
  Gauge,
  Lightbulb,
  CircleDot,
  Disc,
  Cog,
  Container,
  Droplets,
  Shield,
  Compass
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { CheckStatus } from '@/lib/types'
import { truckInspectionCategories, vehicleTypes, dailyDepartureChecklist } from '@/lib/mock-data'

interface InspectionScreenProps {
  onBack?: () => void
}

type InspectionMode = 'daily' | 'full'
type VehicleType = keyof typeof vehicleTypes

const categoryIcons: Record<string, typeof Truck> = {
  cabine_exterieur: Truck,
  eclairage_signalisation: Lightbulb,
  pneumatiques: CircleDot,
  freinage: Disc,
  moteur_mecanique: Cog,
  benne_dumptruck: Container,
  hydraulique: Droplets,
  securite_equipements: Shield,
  transmission_direction: Compass,
}

const statusConfig: { status: CheckStatus; label: string; icon: typeof Check; color: string }[] = [
  { status: 'conforme', label: 'OK', icon: Check, color: 'bg-success text-success-foreground' },
  { status: 'non_conforme', label: 'Non', icon: X, color: 'bg-danger text-danger-foreground' },
  { status: 'non_applicable', label: 'N/A', icon: Minus, color: 'bg-muted text-muted-foreground' },
]

const mockTrucks = [
  { id: 'TRK-042', immatriculation: '12345-A-78', type: 'dumptruck' as VehicleType, km: 145230 },
  { id: 'TRK-018', immatriculation: '54321-B-12', type: 'camion_benne' as VehicleType, km: 89540 },
  { id: 'TRK-007', immatriculation: '98765-C-45', type: 'semi_remorque' as VehicleType, km: 234100 },
  { id: 'TRK-031', immatriculation: '11111-D-99', type: 'porteur' as VehicleType, km: 67890 },
  { id: 'TRK-055', immatriculation: '22222-E-33', type: 'tracteur' as VehicleType, km: 312450 },
]

const mockResponsibles = [
  'Chef de parc',
  'Responsable Maintenance',
  'HSE Manager',
  'Responsable Exploitation',
  'Mécanicien chef',
]

export function InspectionScreen({ onBack }: InspectionScreenProps) {
  const [inspectionMode, setInspectionMode] = useState<InspectionMode | null>(null)
  const [selectedTruck, setSelectedTruck] = useState<string>('')
  const [currentKm, setCurrentKm] = useState('')
  const [items, setItems] = useState<Record<string, { status: CheckStatus; comment: string }>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [mainRisk, setMainRisk] = useState('')
  const [correctiveAction, setCorrectiveAction] = useState('')
  const [responsiblePerson, setResponsiblePerson] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const truck = mockTrucks.find(t => t.id === selectedTruck)
  const isDumptruck = truck?.type === 'dumptruck' || truck?.type === 'camion_benne'

  // Get applicable categories based on vehicle type
  const getApplicableCategories = () => {
    const allCategories = Object.entries(truckInspectionCategories)
    if (!isDumptruck) {
      // Filter out benne and hydraulique for non-dump trucks
      return allCategories.filter(([key]) => key !== 'benne_dumptruck' && key !== 'hydraulique')
    }
    return allCategories
  }

  const applicableCategories = getApplicableCategories()

  // Initialize items when truck changes
  const initializeItems = (truckId: string) => {
    const newTruck = mockTrucks.find(t => t.id === truckId)
    if (newTruck) {
      setCurrentKm(newTruck.km.toString())
      
      if (inspectionMode === 'daily') {
        setItems(Object.fromEntries(
          dailyDepartureChecklist.map(item => [item.id, { status: 'conforme' as CheckStatus, comment: '' }])
        ))
      } else {
        const newItems: Record<string, { status: CheckStatus; comment: string }> = {}
        const isDump = newTruck.type === 'dumptruck' || newTruck.type === 'camion_benne'
        
        Object.entries(truckInspectionCategories).forEach(([catKey, category]) => {
          // Skip benne and hydraulique for non-dump trucks
          if (!isDump && (catKey === 'benne_dumptruck' || catKey === 'hydraulique')) return
          
          category.items.forEach(item => {
            newItems[item.id] = { status: 'conforme', comment: '' }
          })
        })
        setItems(newItems)
        
        // Expand first category by default
        const firstCat = Object.keys(truckInspectionCategories)[0]
        setExpandedCategories({ [firstCat]: true })
      }
    }
  }

  const updateItemStatus = (id: string, status: CheckStatus) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], status }
    }))
  }

  const updateItemComment = (id: string, comment: string) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], comment }
    }))
  }

  const toggleCategory = (catKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }))
  }

  // Calculate score
  const getAllItems = () => {
    if (inspectionMode === 'daily') {
      return dailyDepartureChecklist
    }
    const allItems: { id: string; label: string; isCritical: boolean }[] = []
    applicableCategories.forEach(([, category]) => {
      allItems.push(...category.items)
    })
    return allItems
  }

  const allItems = getAllItems()
  const applicableItems = allItems.filter(item => items[item.id]?.status !== 'non_applicable')
  const conformeItems = applicableItems.filter(item => items[item.id]?.status === 'conforme')
  const criticalNonConforme = allItems.filter(
    item => item.isCritical && items[item.id]?.status === 'non_conforme'
  )
  
  const score = applicableItems.length > 0 
    ? Math.round((conformeItems.length / applicableItems.length) * 100) 
    : 100

  const hasNonCompliance = allItems.some(item => items[item.id]?.status === 'non_conforme')
  const hasCriticalIssue = criticalNonConforme.length > 0

  const handleSubmit = () => {
    setShowConfirmation(true)
    setTimeout(() => {
      setShowConfirmation(false)
      // Reset form
      setInspectionMode(null)
      setSelectedTruck('')
      setCurrentKm('')
      setItems({})
      setExpandedCategories({})
      setMainRisk('')
      setCorrectiveAction('')
      setResponsiblePerson('')
      setDueDate('')
    }, 2000)
  }

  if (showConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Inspection soumise</h2>
        <p className="text-sm text-muted-foreground">
          Score: {score}% - {truck?.id} ({truck?.immatriculation})
        </p>
        {hasCriticalIssue && (
          <div className="mt-4 px-4 py-2 bg-danger/20 rounded-lg">
            <p className="text-sm text-danger font-medium">
              {criticalNonConforme.length} point(s) critique(s) - Véhicule bloqué
            </p>
          </div>
        )}
      </div>
    )
  }

  // Mode selection
  if (!inspectionMode) {
    return (
      <div className="space-y-4 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">Inspection véhicule</h2>
            <p className="text-xs text-muted-foreground">Camion / Dumptruck</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Sélectionnez le type d&apos;inspection :</p>

        <Card 
          className="bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setInspectionMode('daily')}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-success/20 flex items-center justify-center">
              <Gauge className="h-7 w-7 text-success" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Contrôle départ quotidien</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                10 points essentiels - 2-3 min
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground rotate-[-90deg]" />
          </CardContent>
        </Card>

        <Card 
          className="bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setInspectionMode('full')}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Truck className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Inspection complète</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                9 catégories - 60+ points - 15-20 min
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground rotate-[-90deg]" />
          </CardContent>
        </Card>
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
          onClick={() => {
            if (selectedTruck) {
              setSelectedTruck('')
              setItems({})
            } else {
              setInspectionMode(null)
            }
          }}
          className="h-10 w-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-foreground">
            {inspectionMode === 'daily' ? 'Contrôle départ' : 'Inspection complète'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {inspectionMode === 'daily' ? '10 points essentiels' : 'Camion / Dumptruck'}
          </p>
        </div>
      </div>

      {/* Truck Selection */}
      {!selectedTruck ? (
        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground block">
            Sélectionner le véhicule
          </label>
          {mockTrucks.map(t => (
            <Card 
              key={t.id}
              className="bg-card border-border cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => {
                setSelectedTruck(t.id)
                initializeItems(t.id)
              }}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn(
                  'h-12 w-12 rounded-xl flex items-center justify-center',
                  t.type === 'dumptruck' || t.type === 'camion_benne' 
                    ? 'bg-warning/20' 
                    : 'bg-primary/20'
                )}>
                  <Truck className={cn(
                    'h-6 w-6',
                    t.type === 'dumptruck' || t.type === 'camion_benne' 
                      ? 'text-warning' 
                      : 'text-primary'
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{t.id}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t.immatriculation} - {vehicleTypes[t.type]}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.km.toLocaleString()} km</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Truck Info */}
          <Card className="bg-secondary/50 border-border">
            <CardContent className="p-3 flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{truck?.id}</p>
                <p className="text-xs text-muted-foreground">
                  {truck?.immatriculation} - {truck && vehicleTypes[truck.type]}
                </p>
              </div>
              <div className="text-right">
                <label className="text-xs text-muted-foreground">Km actuel</label>
                <Input
                  type="number"
                  value={currentKm}
                  onChange={(e) => setCurrentKm(e.target.value)}
                  className="h-8 w-28 text-xs bg-input text-right"
                />
              </div>
            </CardContent>
          </Card>

          {/* Score Card */}
          <Card className={cn(
            'border-2',
            hasCriticalIssue ? 'bg-danger/10 border-danger/50' :
            score >= 80 ? 'bg-success/10 border-success/30' :
            score >= 60 ? 'bg-warning/10 border-warning/30' :
            'bg-danger/10 border-danger/30'
          )}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Score inspection</p>
                <p className={cn(
                  'text-3xl font-bold',
                  hasCriticalIssue ? 'text-danger' :
                  score >= 80 ? 'text-success' :
                  score >= 60 ? 'text-warning' :
                  'text-danger'
                )}>
                  {score}%
                </p>
                {hasCriticalIssue && (
                  <p className="text-xs text-danger font-medium mt-1">
                    {criticalNonConforme.length} point(s) critique(s)
                  </p>
                )}
              </div>
              <div className={cn(
                'h-16 w-16 rounded-full flex items-center justify-center',
                hasCriticalIssue ? 'bg-danger/20' :
                score >= 80 ? 'bg-success/20' :
                score >= 60 ? 'bg-warning/20' :
                'bg-danger/20'
              )}>
                <Truck className={cn(
                  'h-8 w-8',
                  hasCriticalIssue ? 'text-danger' :
                  score >= 80 ? 'text-success' :
                  score >= 60 ? 'text-warning' :
                  'text-danger'
                )} />
              </div>
            </CardContent>
          </Card>

          {/* Daily Checklist */}
          {inspectionMode === 'daily' && (
            <div className="space-y-2">
              {dailyDepartureChecklist.map((item, index) => {
                const currentStatus = items[item.id]?.status || 'conforme'
                
                return (
                  <Card 
                    key={item.id} 
                    className={cn(
                      'bg-card border-border overflow-hidden',
                      currentStatus === 'non_conforme' && item.isCritical && 'border-danger/50 bg-danger/5'
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
                          currentStatus === 'conforme' ? 'bg-success/20 text-success' :
                          currentStatus === 'non_conforme' ? 'bg-danger/20 text-danger' :
                          'bg-muted text-muted-foreground'
                        )}>
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground leading-tight">
                              {item.label}
                            </p>
                            {item.isCritical && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-danger/20 text-danger rounded font-medium">
                                CRITIQUE
                              </span>
                            )}
                          </div>
                          
                          {currentStatus === 'non_conforme' && (
                            <div className="mt-2 flex items-center gap-2">
                              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <Input
                                value={items[item.id]?.comment || ''}
                                onChange={(e) => updateItemComment(item.id, e.target.value)}
                                placeholder="Commentaire..."
                                className="h-8 text-xs bg-input"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1">
                          {statusConfig.map(({ status, icon: StatusIcon, color }) => (
                            <button
                              key={status}
                              onClick={() => updateItemStatus(item.id, status)}
                              className={cn(
                                'h-9 w-9 rounded-lg flex items-center justify-center transition-all',
                                currentStatus === status 
                                  ? color 
                                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                              )}
                            >
                              <StatusIcon className="h-4 w-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Full Inspection Categories */}
          {inspectionMode === 'full' && (
            <div className="space-y-3">
              {applicableCategories.map(([catKey, category]) => {
                const CategoryIcon = categoryIcons[catKey] || Truck
                const isExpanded = expandedCategories[catKey]
                const catItems = category.items
                const catConforme = catItems.filter(i => items[i.id]?.status === 'conforme')
                const catNonConforme = catItems.filter(i => items[i.id]?.status === 'non_conforme')
                const catCriticalNc = catItems.filter(i => i.isCritical && items[i.id]?.status === 'non_conforme')

                return (
                  <Card key={catKey} className="bg-card border-border overflow-hidden">
                    {/* Category Header */}
                    <div 
                      className="p-3 flex items-center gap-3 cursor-pointer"
                      onClick={() => toggleCategory(catKey)}
                    >
                      <div className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center',
                        catCriticalNc.length > 0 ? 'bg-danger/20' :
                        catNonConforme.length > 0 ? 'bg-warning/20' :
                        'bg-primary/20'
                      )}>
                        <CategoryIcon className={cn(
                          'h-5 w-5',
                          catCriticalNc.length > 0 ? 'text-danger' :
                          catNonConforme.length > 0 ? 'text-warning' :
                          'text-primary'
                        )} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm">{category.label}</h3>
                        <p className="text-xs text-muted-foreground">
                          {catConforme.length}/{catItems.length} conforme
                          {catCriticalNc.length > 0 && (
                            <span className="text-danger ml-2">
                              - {catCriticalNc.length} critique(s)
                            </span>
                          )}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Category Items */}
                    {isExpanded && (
                      <div className="border-t border-border">
                        {catItems.map((item, index) => {
                          const currentStatus = items[item.id]?.status || 'conforme'
                          
                          return (
                            <div 
                              key={item.id}
                              className={cn(
                                'p-3 border-b border-border last:border-b-0',
                                currentStatus === 'non_conforme' && item.isCritical && 'bg-danger/5'
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  'h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
                                  currentStatus === 'conforme' ? 'bg-success/20 text-success' :
                                  currentStatus === 'non_conforme' ? 'bg-danger/20 text-danger' :
                                  'bg-muted text-muted-foreground'
                                )}>
                                  {index + 1}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm text-foreground leading-tight">
                                      {item.label}
                                    </p>
                                    {item.isCritical && (
                                      <span className="text-[9px] px-1 py-0.5 bg-danger/20 text-danger rounded font-medium">
                                        CRITIQUE
                                      </span>
                                    )}
                                  </div>
                                  
                                  {currentStatus === 'non_conforme' && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <MessageSquare className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                      <Input
                                        value={items[item.id]?.comment || ''}
                                        onChange={(e) => updateItemComment(item.id, e.target.value)}
                                        placeholder="Commentaire..."
                                        className="h-7 text-xs bg-input"
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-1">
                                  {statusConfig.map(({ status, icon: StatusIcon, color }) => (
                                    <button
                                      key={status}
                                      onClick={() => updateItemStatus(item.id, status)}
                                      className={cn(
                                        'h-8 w-8 rounded-md flex items-center justify-center transition-all',
                                        currentStatus === status 
                                          ? color 
                                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                      )}
                                    >
                                      <StatusIcon className="h-3.5 w-3.5" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}

          {/* Corrective Action Section */}
          {hasNonCompliance && (
            <Card className={cn(
              'border-2',
              hasCriticalIssue ? 'bg-danger/10 border-danger/50' : 'bg-warning/10 border-warning/30'
            )}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn(
                    'h-5 w-5',
                    hasCriticalIssue ? 'text-danger' : 'text-warning'
                  )} />
                  <h3 className="font-semibold text-foreground">
                    {hasCriticalIssue ? 'Points critiques détectés' : 'Action corrective requise'}
                  </h3>
                </div>

                {hasCriticalIssue && (
                  <div className="p-3 bg-danger/20 rounded-lg">
                    <p className="text-sm text-danger font-medium mb-2">
                      Véhicule NON AUTORISÉ à circuler :
                    </p>
                    <ul className="text-xs text-danger space-y-1">
                      {criticalNonConforme.map(item => (
                        <li key={item.id}>• {item.label}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Problème principal
                  </label>
                  <Textarea
                    value={mainRisk}
                    onChange={(e) => setMainRisk(e.target.value)}
                    placeholder="Décrivez le problème..."
                    className="min-h-[80px] bg-input resize-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Action corrective
                  </label>
                  <Textarea
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="Action à entreprendre..."
                    className="min-h-[80px] bg-input resize-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
                      <User className="h-3 w-3" /> Responsable
                    </label>
                    <select
                      value={responsiblePerson}
                      onChange={(e) => setResponsiblePerson(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-input border border-border text-foreground text-xs"
                    >
                      <option value="">Sélectionner</option>
                      {mockResponsibles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Échéance
                    </label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="h-10 bg-input text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <Button 
            onClick={handleSubmit}
            disabled={hasCriticalIssue && !correctiveAction}
            className={cn(
              'w-full h-14 text-base font-semibold',
              hasCriticalIssue 
                ? 'bg-danger hover:bg-danger/90' 
                : 'bg-primary hover:bg-primary/90'
            )}
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            {hasCriticalIssue ? 'Soumettre (Véhicule bloqué)' : 'Soumettre inspection'}
          </Button>
        </>
      )}
    </div>
  )
}
