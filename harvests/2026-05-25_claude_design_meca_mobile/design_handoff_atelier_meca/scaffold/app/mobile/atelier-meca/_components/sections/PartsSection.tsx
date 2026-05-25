'use client';

import { Search, Plus } from 'lucide-react';
import type { PartUsage } from '../../_types';

export function PartsSection({ parts }: { parts: PartUsage[] }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Rechercher / Scanner */}
      <div className="flex min-h-12 items-center gap-2.5 rounded-[10px] border-[1.5px] bg-[var(--cockpit-surface-2)] px-3 py-2.5" style={{ borderColor: 'var(--cockpit-line)' }}>
        <Search className="h-5 w-5 stroke-[1.8] text-[var(--cockpit-text-3)]" aria-hidden />
        <span className="flex-1 text-[14px] font-medium text-[var(--cockpit-text-3)]">Rechercher · réf. ou nom de pièce</span>
        <button
          type="button"
          className="h-8 rounded-md border-0 px-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white"
          style={{ background: 'var(--cockpit-teal)' }}
        >
          Scanner
        </button>
      </div>

      {parts.map((p) => (
        <div
          key={p.ref}
          className="flex min-h-14 items-center gap-2.5 rounded-[10px] border-[1.5px] bg-[var(--cockpit-surface-2)] px-3 py-2.5"
          style={{ borderColor: 'var(--cockpit-line)' }}
        >
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-bold leading-snug text-[var(--cockpit-text)]">{p.label}</div>
            <div className="mt-0.5 font-mono text-[11px] font-semibold tracking-wide tabular-nums text-[var(--cockpit-text-3)]">{p.ref}</div>
          </div>
          {/* Stepper */}
          <div
            className="flex h-10 flex-shrink-0 items-center rounded-lg border-[1.5px] bg-[var(--cockpit-surface-mute)]"
            style={{ borderColor: 'var(--cockpit-line)' }}
          >
            <button type="button" className="h-9 w-9 bg-transparent text-[18px] font-extrabold text-[var(--cockpit-text)]">−</button>
            <span className="min-w-9 text-center font-mono text-[15px] font-bold tabular-nums text-[var(--cockpit-text)]">{p.qty}</span>
            <button type="button" className="h-9 w-9 bg-transparent text-[18px] font-extrabold text-[var(--cockpit-text)]">+</button>
          </div>
          <span className="w-6.5 flex-shrink-0 text-right text-[11px] font-bold uppercase tracking-wide text-[var(--cockpit-text-3)]">{p.unit}</span>
        </div>
      ))}

      <button
        type="button"
        className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed bg-transparent px-3 text-[13px] font-bold uppercase tracking-wide text-[var(--cockpit-text-2)]"
        style={{ borderColor: 'var(--cockpit-line)' }}
      >
        <Plus className="h-4.5 w-4.5 stroke-[2.2]" aria-hidden />
        Ajouter une pièce
      </button>
    </div>
  );
}
