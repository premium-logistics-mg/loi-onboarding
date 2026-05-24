'use client';

import { cn } from '@/lib/utils';
import { Severity, severityConfig } from '@/lib/types';
import { Check, AlertTriangle, AlertCircle } from 'lucide-react';

interface SeveritySelectorProps {
  value: Severity;
  onChange: (severity: Severity) => void;
  className?: string;
}

export function SeveritySelector({ value, onChange, className }: SeveritySelectorProps) {
  const options: { severity: Severity; icon: typeof Check }[] = [
    { severity: 'ok', icon: Check },
    { severity: 'probleme', icon: AlertTriangle },
    { severity: 'urgent', icon: AlertCircle },
  ];

  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {options.map(({ severity, icon: Icon }) => {
        const config = severityConfig[severity];
        const isSelected = value === severity;

        return (
          <button
            key={severity}
            type="button"
            onClick={() => onChange(severity)}
            className={cn(
              'touch-target-lg flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all font-medium',
              isSelected
                ? severity === 'ok'
                  ? 'border-severity-ok bg-severity-ok/20 text-severity-ok'
                  : severity === 'probleme'
                  ? 'border-severity-problem bg-severity-problem/20 text-severity-problem'
                  : 'border-severity-urgent bg-severity-urgent/20 text-severity-urgent'
                : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
            )}
          >
            <Icon className="h-8 w-8" />
            <span className="text-sm">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
