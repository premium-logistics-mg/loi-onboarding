'use client'

import { cn } from '@/lib/utils'
import type { Workflow } from '@/lib/garage-types'
import { toast } from 'sonner'

interface GarageWorkflowsProps {
  workflows: Workflow[]
}

export function GarageWorkflows({ workflows }: GarageWorkflowsProps) {
  const handleWorkflowClick = (title: string) => {
    toast.info(`${title} - En cours de developpement`)
  }

  return (
    <section className="mb-8">
      <h2 className="text-xs font-bold tracking-wider text-amber-500 uppercase mb-4">
        WORKFLOWS
      </h2>
      <div className="grid grid-cols-5 gap-4">
        {workflows.map((workflow, idx) => (
          <button
            key={idx}
            onClick={() => handleWorkflowClick(workflow.title)}
            className={cn(
              "bg-card border border-border rounded-lg p-4 text-left",
              "hover:border-primary/50 hover:bg-card/80 transition-colors",
              "group cursor-pointer"
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{workflow.icon}</span>
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {workflow.title}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">{workflow.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
