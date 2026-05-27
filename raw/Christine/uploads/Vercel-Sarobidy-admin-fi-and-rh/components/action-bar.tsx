'use client'

import { Button } from '@/components/ui/button'

interface ActionBarProps {
  onCreateDDV: () => void
  onEmitFacture: () => void
  onSubmitDeclaration: () => void
  onCreateSTC: () => void
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

export function ActionBar({ 
  onCreateDDV, 
  onEmitFacture, 
  onSubmitDeclaration, 
  onCreateSTC 
}: ActionBarProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-[#D4CFC4] rounded-lg">
      <Button
        onClick={onCreateDDV}
        className="flex-1 h-12 bg-[#0B2540] hover:bg-[#0B2540]/90 text-[#F5F1E8] font-medium"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Creer DDV
      </Button>
      
      <Button
        onClick={onEmitFacture}
        className="flex-1 h-12 bg-[#1A8E7E] hover:bg-[#147567] text-white font-medium"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Emettre facture vente
      </Button>
      
      <Button
        onClick={onSubmitDeclaration}
        className="flex-1 h-12 bg-[#0B2540] hover:bg-[#0B2540]/90 text-[#F5F1E8] font-medium"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Soumettre declaration
      </Button>
      
      <Button
        onClick={onCreateSTC}
        variant="outline"
        className="flex-1 h-12 border-[#2D8659] text-[#2D8659] hover:bg-[#2D8659] hover:text-white font-medium"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Etablir STC
      </Button>
    </div>
  )
}
