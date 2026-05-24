'use client'

import { useState, useEffect } from 'react'
import { 
  ListTodo,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Camera,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Timer,
  RefreshCw,
  Check
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, isPast } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useApp } from '@/lib/app-context'
import { eventTypes, priorityLabels, statusLabels } from '@/lib/mock-data'
import type { ActionStatus, Priority } from '@/lib/types'

const statusConfig: Record<ActionStatus, { icon: typeof Timer; color: string; bgColor: string }> = {
  a_faire: { icon: Timer, color: 'text-info', bgColor: 'bg-info/20' },
  en_cours: { icon: RefreshCw, color: 'text-warning', bgColor: 'bg-warning/20' },
  en_retard: { icon: AlertCircle, color: 'text-danger', bgColor: 'bg-danger/20' },
  termine: { icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/20' },
  verifie: { icon: Check, color: 'text-success', bgColor: 'bg-success/20' },
}

const priorityConfig: Record<Priority, { color: string; bgColor: string }> = {
  normal: { color: 'text-success', bgColor: 'bg-success/20' },
  attention: { color: 'text-warning', bgColor: 'bg-warning/20' },
  critique: { color: 'text-critical', bgColor: 'bg-critical/20' },
}

export function ActionsScreen() {
  const { correctiveActions, updateCorrectiveAction } = useApp()
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('all')
  const [expandedAction, setExpandedAction] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredActions = correctiveActions.filter(action => {
    if (filter === 'pending') {
      return action.status !== 'termine' && action.status !== 'verifie'
    }
    if (filter === 'overdue') {
      return action.status === 'en_retard' || (
        isPast(action.dueDate) && 
        action.status !== 'termine' && 
        action.status !== 'verifie'
      )
    }
    return true
  })

  const stats = {
    total: correctiveActions.length,
    pending: correctiveActions.filter(a => a.status !== 'termine' && a.status !== 'verifie').length,
    overdue: correctiveActions.filter(a => 
      a.status === 'en_retard' || (isPast(a.dueDate) && a.status !== 'termine' && a.status !== 'verifie')
    ).length,
  }

  const handleStatusUpdate = (id: string, newStatus: ActionStatus) => {
    updateCorrectiveAction(id, { status: newStatus })
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <ListTodo className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Actions correctives</h2>
          <p className="text-xs text-muted-foreground">Suivi et mise à jour</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'p-3 rounded-lg border-2 transition-all',
            filter === 'all' 
              ? 'bg-primary/20 border-primary' 
              : 'bg-card border-border'
          )}
        >
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={cn(
            'p-3 rounded-lg border-2 transition-all',
            filter === 'pending' 
              ? 'bg-warning/20 border-warning' 
              : 'bg-card border-border'
          )}
        >
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          <p className="text-[10px] text-muted-foreground">En cours</p>
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={cn(
            'p-3 rounded-lg border-2 transition-all',
            filter === 'overdue' 
              ? 'bg-danger/20 border-danger' 
              : 'bg-card border-border'
          )}
        >
          <p className="text-2xl font-bold text-danger">{stats.overdue}</p>
          <p className="text-[10px] text-muted-foreground">En retard</p>
        </button>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {filteredActions.map(action => {
          const statusInfo = statusConfig[action.status]
          const priorityInfo = priorityConfig[action.priority]
          const StatusIcon = statusInfo.icon
          const isExpanded = expandedAction === action.id
          const isOverdue = isPast(action.dueDate) && action.status !== 'termine' && action.status !== 'verifie'

          return (
            <Card 
              key={action.id} 
              className={cn(
                'bg-card border-border overflow-hidden',
                isOverdue && 'border-danger/50'
              )}
            >
              <CardContent className="p-0">
                {/* Priority indicator */}
                <div className={cn(
                  'h-1',
                  action.priority === 'critique' ? 'bg-critical' :
                  action.priority === 'attention' ? 'bg-warning' : 'bg-success'
                )} />

                <div className="p-3">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">
                        {action.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {action.siteName}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
                      statusInfo.bgColor,
                      statusInfo.color
                    )}>
                      <StatusIcon className="h-3 w-3" />
                      <span>{statusLabels[action.status]}</span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[10px] px-2 py-0.5 bg-secondary rounded text-secondary-foreground flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {eventTypes[action.sourceEventType]}
                    </span>
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded',
                      priorityInfo.bgColor,
                      priorityInfo.color
                    )}>
                      {priorityLabels[action.priority]}
                    </span>
                    {action.evidenceRequired && (
                      <span className="text-[10px] px-2 py-0.5 bg-info/20 text-info rounded flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        Photo requise
                      </span>
                    )}
                  </div>

                  {/* Responsible & Due Date */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>{action.responsiblePerson}</span>
                    </div>
                    {mounted && (
                      <div className={cn(
                        'flex items-center gap-1.5',
                        isOverdue ? 'text-danger' : 'text-muted-foreground'
                      )}>
                        <Clock className="h-3.5 w-3.5" />
                        <span>{format(action.dueDate, 'dd MMM yyyy', { locale: fr })}</span>
                      </div>
                    )}
                  </div>

                  {/* Expand button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                    className="w-full mt-3 h-8 text-xs"
                  >
                    {isExpanded ? 'Réduire' : 'Mettre à jour'}
                    <ChevronRight className={cn(
                      'h-4 w-4 ml-1 transition-transform',
                      isExpanded && 'rotate-90'
                    )} />
                  </Button>

                  {/* Expanded actions */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border space-y-3">
                      <p className="text-xs text-muted-foreground">Changer le statut:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {action.status !== 'en_cours' && action.status !== 'termine' && action.status !== 'verifie' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(action.id, 'en_cours')}
                            className="h-10 text-xs bg-warning/10 border-warning/30 text-warning hover:bg-warning/20"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            En cours
                          </Button>
                        )}
                        {action.status !== 'termine' && action.status !== 'verifie' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(action.id, 'termine')}
                            className="h-10 text-xs bg-success/10 border-success/30 text-success hover:bg-success/20"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Terminé
                          </Button>
                        )}
                        {action.status === 'termine' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(action.id, 'verifie')}
                            className="h-10 text-xs bg-success/10 border-success/30 text-success hover:bg-success/20 col-span-2"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Marquer vérifié
                          </Button>
                        )}
                      </div>

                      {action.evidenceRequired && action.status !== 'verifie' && (
                        <Button
                          variant="outline"
                          className="w-full h-12 border-dashed"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Ajouter preuve photo
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredActions.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-success/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {filter === 'overdue' 
                ? 'Aucune action en retard' 
                : filter === 'pending'
                  ? 'Toutes les actions sont complétées'
                  : 'Aucune action corrective'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
