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
import { Textarea } from '@/components/ui/textarea'
import { MODE_PAIEMENT_LABELS, NATURE_MATRICE_LABELS, type ModePaiement, type NatureMatriceV4 } from '@/lib/types'

interface DDVModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: DDVFormSubmit) => void
}

export interface DDVFormSubmit {
  numeroSerie: string
  date: string
  modePaiement: ModePaiement
  dateLivraison: string
  objet: string
  natureMatrice: NatureMatriceV4
  montantEstime: string
  details: string
}

export function DDVModal({ open, onClose, onSubmit }: DDVModalProps) {
  const [formData, setFormData] = useState<Partial<DDVFormSubmit>>({
    date: new Date().toISOString().split('T')[0],
    montantEstime: 'A CONFIRMER',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.dateLivraison) {
      alert('Date livraison obligatoire')
      return
    }
    onSubmit({
      numeroSerie: formData.numeroSerie || `DDV-${Date.now().toString().slice(-6)}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      modePaiement: formData.modePaiement || 'virement',
      dateLivraison: formData.dateLivraison,
      objet: formData.objet || '',
      natureMatrice: formData.natureMatrice || 'autres',
      montantEstime: formData.montantEstime || 'A CONFIRMER',
      details: formData.details || '',
    })
    setFormData({ date: new Date().toISOString().split('T')[0], montantEstime: 'A CONFIRMER' })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white border-[#D4CFC4]">
        <DialogHeader>
          <DialogTitle className="text-[#0B2540] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1A8E7E]" />
            Creer DDV (Demande de Validation)
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroSerie" className="text-[#0B2540]">N Serie</Label>
              <Input
                id="numeroSerie"
                placeholder="Auto-genere"
                value={formData.numeroSerie || ''}
                onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-[#0B2540]">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modePaiement" className="text-[#0B2540]">Mode paiement</Label>
              <Select
                value={formData.modePaiement}
                onValueChange={(v) => setFormData({ ...formData, modePaiement: v as ModePaiement })}
              >
                <SelectTrigger className="border-[#D4CFC4]">
                  <SelectValue placeholder="Selectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MODE_PAIEMENT_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateLivraison" className="text-[#0B2540]">
                Date livraison <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="dateLivraison"
                type="date"
                required
                value={formData.dateLivraison || ''}
                onChange={(e) => setFormData({ ...formData, dateLivraison: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objet" className="text-[#0B2540]">Objet</Label>
            <Input
              id="objet"
              placeholder="Description de la demande"
              value={formData.objet || ''}
              onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
              className="border-[#D4CFC4] focus:border-[#1A8E7E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="natureMatrice" className="text-[#0B2540]">Nature matrice V4</Label>
              <Select
                value={formData.natureMatrice}
                onValueChange={(v) => setFormData({ ...formData, natureMatrice: v as NatureMatriceV4 })}
              >
                <SelectTrigger className="border-[#D4CFC4]">
                  <SelectValue placeholder="Selectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NATURE_MATRICE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montantEstime" className="text-[#0B2540]">Montant estime MGA</Label>
              <Input
                id="montantEstime"
                placeholder="A CONFIRMER"
                value={formData.montantEstime || ''}
                onChange={(e) => setFormData({ ...formData, montantEstime: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E] font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-[#0B2540]">Details (4 lignes max)</Label>
            <Textarea
              id="details"
              placeholder="Details supplementaires..."
              rows={4}
              value={formData.details || ''}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="border-[#D4CFC4] focus:border-[#1A8E7E]"
            />
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
              Creer DDV
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
