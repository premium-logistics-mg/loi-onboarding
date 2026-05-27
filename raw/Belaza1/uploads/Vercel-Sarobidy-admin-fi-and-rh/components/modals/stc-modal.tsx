'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface STCModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: STCFormSubmit) => void
}

export interface STCFormSubmit {
  matricule: string
  nom: string
  elementsSolde: string
  net: string
  visas: string[]
}

export function STCModal({ open, onClose, onSubmit }: STCModalProps) {
  const [formData, setFormData] = useState<Partial<STCFormSubmit>>({
    elementsSolde: 'A CONFIRMER',
    net: 'A CONFIRMER',
    visas: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.matricule || !formData.nom) {
      alert('Matricule et nom sont obligatoires')
      return
    }
    onSubmit({
      matricule: formData.matricule,
      nom: formData.nom,
      elementsSolde: formData.elementsSolde || 'A CONFIRMER',
      net: formData.net || 'A CONFIRMER',
      visas: formData.visas || [],
    })
    setFormData({
      elementsSolde: 'A CONFIRMER',
      net: 'A CONFIRMER',
      visas: [],
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white border-[#D4CFC4]">
        <DialogHeader>
          <DialogTitle className="text-[#0B2540] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2D8659]" />
            Etablir STC (Solde de Tout Compte)
          </DialogTitle>
        </DialogHeader>

        {/* Bandeau confidentiel */}
        <div className="flex items-center gap-2 p-3 bg-[#DC2626]/10 rounded-lg border border-[#DC2626]/20">
          <svg className="w-5 h-5 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium text-[#DC2626]">
            Confidentiel RH/B17 - Acces restreint
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricule" className="text-[#0B2540]">
                Matricule <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="matricule"
                placeholder="Ex: MAT-001"
                required
                value={formData.matricule || ''}
                onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#2D8659] font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-[#0B2540]">
                Nom (RH only) <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="nom"
                placeholder="Nom du salarie"
                required
                value={formData.nom || ''}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="border-[#D4CFC4] focus:border-[#2D8659]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="elementsSolde" className="text-[#0B2540]">Elements du solde</Label>
            <Textarea
              id="elementsSolde"
              placeholder="Details des elements de solde..."
              rows={4}
              value={formData.elementsSolde || ''}
              onChange={(e) => setFormData({ ...formData, elementsSolde: e.target.value })}
              className="border-[#D4CFC4] focus:border-[#2D8659]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="net" className="text-[#0B2540]">Net a payer</Label>
            <Input
              id="net"
              placeholder="A CONFIRMER"
              value={formData.net || ''}
              onChange={(e) => setFormData({ ...formData, net: e.target.value })}
              className="border-[#D4CFC4] focus:border-[#2D8659] font-mono text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#0B2540]">Visas requis</Label>
            <div className="flex flex-wrap gap-2">
              {['RH', 'DAF', 'DG'].map((visa) => (
                <button
                  key={visa}
                  type="button"
                  onClick={() => {
                    const current = formData.visas || []
                    setFormData({
                      ...formData,
                      visas: current.includes(visa)
                        ? current.filter((v) => v !== visa)
                        : [...current, visa],
                    })
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    (formData.visas || []).includes(visa)
                      ? 'bg-[#2D8659] text-white'
                      : 'bg-[#EBE6DB] text-[#4A5568] hover:bg-[#D4CFC4]'
                  }`}
                >
                  {visa}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#2D8659]/10 rounded-lg border border-[#2D8659]/20">
            <p className="text-xs text-[#4A5568]">
              STC debauche - Document confidentiel soumis aux visas RH et direction.
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
              className="bg-[#2D8659] hover:bg-[#236B47] text-white"
            >
              Etablir STC
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
