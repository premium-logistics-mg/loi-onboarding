'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface FactureModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: FactureFormSubmit) => void
}

export interface FactureFormSubmit {
  client: string
  refDossier: string
  piecesRecues: boolean
  lignes: { libelle: string; montant: string }[]
  montantTotal: string
}

export function FactureModal({ open, onClose, onSubmit }: FactureModalProps) {
  const [formData, setFormData] = useState<Partial<FactureFormSubmit>>({
    piecesRecues: false,
    lignes: [{ libelle: '', montant: '' }],
    montantTotal: 'A CONFIRMER',
  })

  const addLigne = () => {
    setFormData({
      ...formData,
      lignes: [...(formData.lignes || []), { libelle: '', montant: '' }],
    })
  }

  const updateLigne = (index: number, field: 'libelle' | 'montant', value: string) => {
    const newLignes = [...(formData.lignes || [])]
    newLignes[index] = { ...newLignes[index], [field]: value }
    setFormData({ ...formData, lignes: newLignes })
  }

  const removeLigne = (index: number) => {
    const newLignes = (formData.lignes || []).filter((_, i) => i !== index)
    setFormData({ ...formData, lignes: newLignes })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.piecesRecues) {
      alert('Verifiez que les pieces sont recues avant emission')
      return
    }
    if (!formData.client || !formData.refDossier) {
      alert('Client et reference dossier obligatoires')
      return
    }
    onSubmit({
      client: formData.client,
      refDossier: formData.refDossier,
      piecesRecues: formData.piecesRecues,
      lignes: formData.lignes || [],
      montantTotal: formData.montantTotal || 'A CONFIRMER',
    })
    setFormData({
      piecesRecues: false,
      lignes: [{ libelle: '', montant: '' }],
      montantTotal: 'A CONFIRMER',
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] bg-white border-[#D4CFC4]">
        <DialogHeader>
          <DialogTitle className="text-[#0B2540] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1A8E7E]" />
            Emettre facture vente
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client" className="text-[#0B2540]">
                Client <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="client"
                placeholder="Nom du client"
                required
                value={formData.client || ''}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="refDossier" className="text-[#0B2540]">
                Ref dossier <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="refDossier"
                placeholder="Reference du dossier"
                required
                value={formData.refDossier || ''}
                onChange={(e) => setFormData({ ...formData, refDossier: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#1A8E7E]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#D97706]/10 rounded-lg border border-[#D97706]/20">
            <Checkbox
              id="piecesRecues"
              checked={formData.piecesRecues}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, piecesRecues: checked as boolean })
              }
              className="border-[#D97706] data-[state=checked]:bg-[#D97706] data-[state=checked]:border-[#D97706]"
            />
            <Label htmlFor="piecesRecues" className="text-[#D97706] text-sm font-medium cursor-pointer">
              Je confirme que les pieces Transit sont recues (verif obligatoire)
            </Label>
          </div>

          {/* Lignes de facture */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[#0B2540]">Lignes de facture</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLigne}
                className="h-7 text-xs border-[#1A8E7E] text-[#1A8E7E]"
              >
                + Ajouter ligne
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(formData.lignes || []).map((ligne, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Libelle"
                    value={ligne.libelle}
                    onChange={(e) => updateLigne(index, 'libelle', e.target.value)}
                    className="flex-1 border-[#D4CFC4] text-sm"
                  />
                  <Input
                    placeholder="Montant"
                    value={ligne.montant}
                    onChange={(e) => updateLigne(index, 'montant', e.target.value)}
                    className="w-32 border-[#D4CFC4] text-sm font-mono"
                  />
                  {(formData.lignes || []).length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLigne(index)}
                      className="h-8 w-8 p-0 text-[#DC2626] hover:bg-[#DC2626]/10"
                    >
                      x
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="montantTotal" className="text-[#0B2540]">Montant total</Label>
            <Input
              id="montantTotal"
              placeholder="A CONFIRMER"
              value={formData.montantTotal || ''}
              onChange={(e) => setFormData({ ...formData, montantTotal: e.target.value })}
              className="border-[#D4CFC4] focus:border-[#1A8E7E] font-mono text-lg"
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
              disabled={!formData.piecesRecues}
              className="bg-[#1A8E7E] hover:bg-[#147567] text-white disabled:opacity-50"
            >
              Emettre facture
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
