'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { DDVItem, DDVType, DDVStep } from '@/lib/types'
import { DDV_TYPE_LABELS, DDV_STEP_LABELS } from '@/lib/types'

interface DDVQueueProps {
  items: DDVItem[]
  className?: string
}

const TYPE_COLORS: Record<DDVType, string> = {
  facturation: 'bg-[#1A8E7E]/10 text-[#1A8E7E] border-[#1A8E7E]/20',
  cnaps: 'bg-[#0B2540]/10 text-[#0B2540] border-[#0B2540]/20',
  achat: 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20',
  stc: 'bg-[#2D8659]/10 text-[#2D8659] border-[#2D8659]/20',
}

const STEP_STYLES: Record<DDVStep, { bg: string; text: string; shape: string }> = {
  demande: { bg: 'bg-[#D97706]', text: 'text-white', shape: 'rounded-full' },
  matrice: { bg: 'bg-[#1A8E7E]', text: 'text-white', shape: 'rounded-md' },
  haja: { bg: 'bg-[#0B2540]', text: 'text-[#F5F1E8]', shape: 'rounded-sm' },
  paye: { bg: 'bg-[#2D8659]', text: 'text-white', shape: 'rounded-none' },
}

function getActionLabel(step: DDVStep): string {
  switch (step) {
    case 'demande':
      return 'Traiter'
    case 'matrice':
      return 'Valider'
    case 'haja':
      return 'Transmettre'
    case 'paye':
      return 'Clôturer'
  }
}

export function DDVQueue({ items, className }: DDVQueueProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)))
    }
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[#0B2540] text-[#F5F1E8] rounded-t-lg">
        <Checkbox
          checked={selectedIds.size === items.length && items.length > 0}
          onCheckedChange={toggleAll}
          className="border-[#F5F1E8]/50 data-[state=checked]:bg-[#1A8E7E] data-[state=checked]:border-[#1A8E7E]"
        />
        <span className="w-28 text-xs font-medium">Type</span>
        <span className="w-24 text-xs font-medium">Montant</span>
        <span className="w-20 text-xs font-medium">Demandeur</span>
        <span className="w-24 text-xs font-medium">Département</span>
        <span className="w-20 text-xs font-medium">Étape</span>
        <span className="w-16 text-xs font-medium text-center">Âge</span>
        <span className="flex-1 text-xs font-medium text-right">Action</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#D4CFC4] border border-t-0 border-[#D4CFC4] rounded-b-lg overflow-hidden">
        {items.map((item) => {
          const stepStyle = STEP_STYLES[item.etape]
          const isSelected = selectedIds.has(item.id)
          const isOverdue = item.ageJours > 3

          return (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-4 px-4 py-3 transition-colors',
                isSelected ? 'bg-[#1A8E7E]/5' : 'bg-white hover:bg-[#F5F1E8]/50',
                isOverdue && !isSelected && 'bg-[#DC2626]/5'
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleSelect(item.id)}
                className="border-[#D4CFC4] data-[state=checked]:bg-[#1A8E7E] data-[state=checked]:border-[#1A8E7E]"
              />
              
              {/* Type */}
              <Badge
                variant="outline"
                className={cn('w-28 justify-center text-[10px]', TYPE_COLORS[item.type])}
              >
                {DDV_TYPE_LABELS[item.type]}
              </Badge>

              {/* Montant */}
              <span className="w-24 font-mono text-xs text-[#4A5568]">
                {item.montant}
              </span>

              {/* Demandeur */}
              <span className="w-20 text-xs font-medium text-[#0B2540]">
                {item.demandeur}
              </span>

              {/* Département */}
              <span className="w-24 text-xs text-[#4A5568]">
                {item.departement}
              </span>

              {/* Étape - couleur + forme */}
              <div className="w-20">
                <span
                  className={cn(
                    'inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-medium',
                    stepStyle.bg,
                    stepStyle.text,
                    stepStyle.shape
                  )}
                >
                  {DDV_STEP_LABELS[item.etape]}
                </span>
              </div>

              {/* Âge */}
              <div className="w-16 flex items-center justify-center gap-1">
                <span
                  className={cn(
                    'font-mono text-sm font-semibold',
                    isOverdue ? 'text-[#DC2626]' : 'text-[#0B2540]'
                  )}
                >
                  {item.ageJours}j
                </span>
                {isOverdue && (
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                )}
              </div>

              {/* Action */}
              <div className="flex-1 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-[#1A8E7E] text-[#1A8E7E] hover:bg-[#1A8E7E] hover:text-white"
                >
                  {getActionLabel(item.etape)}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-xs text-[#4A5568]">
          {selectedIds.size > 0
            ? `${selectedIds.size} sélectionné(s)`
            : `${items.length} demande(s)`}
        </span>
        {selectedIds.size > 0 && (
          <Button
            size="sm"
            className="h-7 text-xs bg-[#1A8E7E] hover:bg-[#147567]"
          >
            Traiter la sélection
          </Button>
        )}
      </div>
    </div>
  )
}
