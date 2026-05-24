'use client'

import { useState } from 'react'
import { 
  HardHat, 
  Shirt,
  Footprints,
  Hand,
  Glasses,
  Headphones,
  Wind,
  Unlink,
  Check,
  X,
  Minus,
  Camera,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CheckStatus } from '@/lib/types'

interface EPIScreenProps {
  onBack?: () => void
}

const epiItems: { id: string; name: string; icon: typeof HardHat; isCritical: boolean }[] = [
  { id: 'casque', name: 'Casque', icon: HardHat, isCritical: true },
  { id: 'gilet', name: 'Gilet haute visibilité', icon: Shirt, isCritical: true },
  { id: 'chaussures', name: 'Chaussures de sécurité', icon: Footprints, isCritical: true },
  { id: 'gants', name: 'Gants', icon: Hand, isCritical: false },
  { id: 'lunettes', name: 'Lunettes', icon: Glasses, isCritical: false },
  { id: 'auditive', name: 'Protection auditive', icon: Headphones, isCritical: false },
  { id: 'masque', name: 'Masque / respirateur', icon: Wind, isCritical: false },
  { id: 'harnais', name: 'Harnais', icon: Unlink, isCritical: false },
]

const statusConfig: { status: CheckStatus; label: string; icon: typeof Check; color: string }[] = [
  { status: 'conforme', label: 'OK', icon: Check, color: 'bg-success text-success-foreground' },
  { status: 'non_conforme', label: 'Non', icon: X, color: 'bg-danger text-danger-foreground' },
  { status: 'non_applicable', label: 'N/A', icon: Minus, color: 'bg-muted text-muted-foreground' },
]

export function EPIScreen({ onBack }: EPIScreenProps) {
  const [personName, setPersonName] = useState('')
  const [personId, setPersonId] = useState('')
  const [items, setItems] = useState<Record<string, { status: CheckStatus; comment: string }>>(
    Object.fromEntries(epiItems.map(item => [item.id, { status: 'conforme', comment: '' }]))
  )
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

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

  // Calculate compliance score
  const applicableItems = epiItems.filter(item => items[item.id].status !== 'non_applicable')
  const conformeItems = applicableItems.filter(item => items[item.id].status === 'conforme')
  const complianceScore = applicableItems.length > 0 
    ? Math.round((conformeItems.length / applicableItems.length) * 100) 
    : 100

  // Check for critical non-compliance
  const hasCriticalNonCompliance = epiItems
    .filter(item => item.isCritical)
    .some(item => items[item.id].status === 'non_conforme')

  const handleSubmit = () => {
    setShowConfirmation(true)
    setTimeout(() => {
      setShowConfirmation(false)
      // Reset form
      setPersonName('')
      setPersonId('')
      setItems(Object.fromEntries(epiItems.map(item => [item.id, { status: 'conforme', comment: '' }])))
    }, 2000)
  }

  if (showConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Contrôle EPI enregistré</h2>
        <p className="text-sm text-muted-foreground">
          Score de conformité: {complianceScore}%
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
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
          <h2 className="text-lg font-bold text-foreground">Contrôle EPI</h2>
          <p className="text-xs text-muted-foreground">Équipement de protection individuelle</p>
        </div>
      </div>

      {/* Compliance Score */}
      <Card className={cn(
        'border-2',
        complianceScore >= 80 ? 'bg-success/10 border-success/30' :
        complianceScore >= 60 ? 'bg-warning/10 border-warning/30' :
        'bg-danger/10 border-danger/30'
      )}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Conformité EPI</p>
            <p className={cn(
              'text-3xl font-bold',
              complianceScore >= 80 ? 'text-success' :
              complianceScore >= 60 ? 'text-warning' :
              'text-danger'
            )}>
              {complianceScore}%
            </p>
          </div>
          <div className={cn(
            'h-16 w-16 rounded-full flex items-center justify-center',
            complianceScore >= 80 ? 'bg-success/20' :
            complianceScore >= 60 ? 'bg-warning/20' :
            'bg-danger/20'
          )}>
            <HardHat className={cn(
              'h-8 w-8',
              complianceScore >= 80 ? 'text-success' :
              complianceScore >= 60 ? 'text-warning' :
              'text-danger'
            )} />
          </div>
        </CardContent>
      </Card>

      {/* Critical Warning Banner */}
      {hasCriticalNonCompliance && (
        <div className="flex items-center gap-3 p-3 bg-critical/20 border border-critical/30 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-critical flex-shrink-0" />
          <p className="text-sm font-medium text-critical">
            Accès site à valider avant opération
          </p>
        </div>
      )}

      {/* Person Info */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Nom</label>
          <Input
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Nom complet"
            className="h-12 bg-input"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">ID</label>
          <Input
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            placeholder="DRV-XXX"
            className="h-12 bg-input"
          />
        </div>
      </div>

      {/* EPI Checklist */}
      <div className="space-y-2">
        {epiItems.map((item) => {
          const Icon = item.icon
          const currentStatus = items[item.id].status
          const isExpanded = expandedItem === item.id
          
          return (
            <Card 
              key={item.id} 
              className={cn(
                'bg-card border-border overflow-hidden transition-all',
                currentStatus === 'non_conforme' && 'border-danger/50'
              )}
            >
              <CardContent className="p-0">
                <div className="flex items-center p-3">
                  {/* Item info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      currentStatus === 'conforme' ? 'bg-success/20' :
                      currentStatus === 'non_conforme' ? 'bg-danger/20' :
                      'bg-muted'
                    )}>
                      <Icon className={cn(
                        'h-5 w-5',
                        currentStatus === 'conforme' ? 'text-success' :
                        currentStatus === 'non_conforme' ? 'text-danger' :
                        'text-muted-foreground'
                      )} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {item.name}
                      </p>
                      {item.isCritical && (
                        <span className="text-[10px] text-critical">Critique</span>
                      )}
                    </div>
                  </div>

                  {/* Status buttons */}
                  <div className="flex gap-1.5">
                    {statusConfig.map(({ status, label, icon: StatusIcon, color }) => (
                      <button
                        key={status}
                        onClick={() => updateItemStatus(item.id, status)}
                        className={cn(
                          'h-10 w-10 rounded-lg flex items-center justify-center transition-all',
                          currentStatus === status 
                            ? color 
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        )}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>

                  {/* Expand button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 ml-1"
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  >
                    <MessageSquare className={cn(
                      'h-4 w-4',
                      items[item.id].comment ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </Button>
                </div>

                {/* Expanded section */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border mt-0">
                    <div className="pt-3 flex gap-2">
                      <Input
                        value={items[item.id].comment}
                        onChange={(e) => updateItemComment(item.id, e.target.value)}
                        placeholder="Commentaire..."
                        className="flex-1 h-10 bg-input text-sm"
                      />
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Submit */}
      <Button 
        onClick={handleSubmit}
        disabled={!personName}
        className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
      >
        <CheckCircle2 className="h-5 w-5 mr-2" />
        Enregistrer contrôle EPI
      </Button>
    </div>
  )
}
