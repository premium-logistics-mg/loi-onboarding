"use client"

import { ChevronLeft, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepHeaderProps {
  title: string
  stepNumber: number
  totalSteps?: number
  onBack: () => void
  context?: string
}

export function StepHeader({ title, stepNumber, totalSteps = 5, onBack, context }: StepHeaderProps) {
  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 z-10">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-full hover:bg-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-primary">
              {stepNumber}/{totalSteps}
            </span>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          </div>
          {context && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Truck className="w-3 h-3" />
              {context}
            </p>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
}
