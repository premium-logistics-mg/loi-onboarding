'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DECLARATION_TYPE_LABELS, type DeclarationType } from '@/lib/types'

interface DeclarationModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: DeclarationFormSubmit) => void
}

export interface DeclarationFormSubmit {
  type: DeclarationType
  periode: string
  assiette: string
  taux: string
  montantDu: string
  dateLimiteLegale: string
}

export function DeclarationModal({ open, onClose, onSubmit }: DeclarationModalProps) {
  const [formData, setFormData] = useState<Partial<DeclarationFormSubmit>>({
    assiette: 'A CONFIRMER',
    taux: 'A CONFIRMER',
    montantDu: 'A CONFIRMER',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.type || !formData.periode || !formData.dateLimiteLegale) {
      alert('Type, periode et date limite sont obligatoires')
      return
    }
    onSubmit({
      type: formData.type,
      periode: formData.periode,
      assiette: formData.assiette || 'A CONFIRMER',
      taux: formData.taux || 'A CONFIRMER',
      montantDu: formData.montantDu || 'A CONFIRMER',
      dateLimiteLegale: formData.dateLimiteLegale,
    })
    setFormData({
      assiette: 'A CONFIRMER',
      taux: 'A CONFIRMER',
      montantDu: 'A CONFIRMER',
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white border-[#D4CFC4]">
        <DialogHeader>
          <DialogTitle className="text-[#0B2540] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0B2540]" />
            Soumettre declaration fiscale/sociale
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[#0B2540]">
                Type <span className="text-[#DC2626]">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as DeclarationType })}
              >
                <SelectTrigger className="border-[#D4CFC4]">
                  <SelectValue placeholder="Selectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DECLARATION_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periode" className="text-[#0B2540]">
                Periode <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="periode"
                placeholder="Ex: 2024-01"
                required
                value={formData.periode || ''}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assiette" className="text-[#0B2540]">Assiette</Label>
              <Input
                id="assiette"
                placeholder="A CONFIRMER"
                value={formData.assiette || ''}
                onChange={(e) => setFormData({ ...formData, assiette: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E] font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taux" className="text-[#0B2540]">Taux</Label>
              <Input
                id="taux"
                placeholder="A CONFIRMER"
                value={formData.taux || ''}
                onChange={(e) => setFormData({ ...formData, taux: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montantDu" className="text-[#0B2540]">Montant du</Label>
              <Input
                id="montantDu"
                placeholder="A CONFIRMER"
                value={formData.montantDu || ''}
                onChange={(e) => setFormData({ ...formData, montantDu: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E] font-mono text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateLimiteLegale" className="text-[#0B2540]">
                Date limite legale <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="dateLimiteLegale"
                type="date"
                required
                value={formData.dateLimiteLegale || ''}
                onChange={(e) => setFormData({ ...formData, dateLimiteLegale: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0B2540]/5 rounded-lg border border-[#0B2540]/10">
            <p className="text-xs text-[#4A5568]">
              Declaration CNAPS/OMSI/FMFP - Les donnees seront soumises pour validation.
              Phase test : aucune ecriture reelle.
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#D4CFC4] text-[#4A5568]"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#0B2540] hover:bg-[#0B2540]/90 text-[#F5F1E8]"
            >
              Soumettre declaration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
