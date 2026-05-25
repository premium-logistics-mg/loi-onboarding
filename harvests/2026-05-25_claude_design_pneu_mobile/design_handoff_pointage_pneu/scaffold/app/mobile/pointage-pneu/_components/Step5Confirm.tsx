'use client';

import * as React from 'react';
import { useWizard, labelForEvent } from '../_state';
import { decodePositionCode, formatKm } from '../_data';
import { CheckMark } from './ToConfirmBadge';

export function Step5Confirm() {
  const { state } = useWizard();
  const v = state.vehicle;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Hero success */}
      <div className="flex items-center gap-3.5 border-b border-[var(--cockpit-navy-2)] bg-[var(--cockpit-navy)] px-4 py-5 text-white">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[var(--cockpit-teal)] shadow-[0_0_0_6px_rgba(26,142,126,0.25)]">
          <CheckMark size={34} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[24px] font-extrabold tracking-[-0.3px]">Enregistré</div>
          <div className="mt-0.5 text-[13px] text-[var(--cockpit-on-navy-soft)]">
            Pointage ajouté à la file locale · sync au réseau
          </div>
        </div>
      </div>

      {/* Reference */}
      <div className="flex items-center justify-between border-b border-[var(--cockpit-line)] bg-[var(--cockpit-teal-soft)] px-4 py-3">
        <span className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-[var(--cockpit-navy)]">
          Référence locale
        </span>
        <span className="font-mono text-[15px] font-bold text-[var(--cockpit-navy)] tabular-nums">
          {state.localRef ?? 'PNEU-…'}
        </span>
      </div>

      {/* Summary */}
      <div className="px-4 pb-2 pt-3.5">
        <div className="rounded-xl border-[1.5px] border-[var(--cockpit-line)] bg-[var(--cockpit-card)] px-4 py-2">
          <SummaryRow k="Véhicule" v={v ? `${v.code} · ${v.plate}` : '—'} mono />
          <SummaryRow k="Modèle"   v={v?.model ?? '—'} />
          <SummaryRow k="Position" v={state.position ?? '—'} mono />
          <SummaryRow k="Décodage" v={state.position ? decodePositionCode(state.position) : '—'} />
          <SummaryRow k="Événement" v={state.event ? labelForEvent(state.event) : '—'} />
          <SummaryRow k="Marque" v={state.brand ? `${state.brand.name} · ${state.brand.size}` : '—'} />
          <SummaryRow k="N° série" v={state.serial ?? '—'} mono />
          <SummaryRow k="Kilométrage" v={state.km !== undefined ? formatKm(state.km) : '—'} mono />
          <SummaryRow k="Photo" v={`${state.photos.length} jointe${state.photos.length > 1 ? 's' : ''}`} />
          <SummaryRow k="Mécanicien · heure" v="PL-MEC-007 · 07:42" mono last />
        </div>
      </div>

      {/* Sync queue */}
      <div className="mx-4 mt-1.5 flex items-center gap-3 rounded-[10px] border border-dashed border-[var(--cockpit-line)] bg-[var(--cockpit-card)] px-3.5 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(199,126,42,0.40)] bg-[rgba(199,126,42,0.14)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 12a8 8 0 0114-5.3L20 5M20 12a8 8 0 01-14 5.3L4 19"
                  stroke="var(--cockpit-status-orange)" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 5v4h-4M4 19v-4h4"
                  stroke="var(--cockpit-status-orange)" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-bold text-[var(--cockpit-navy)]">3 pointages en file</div>
          <div className="mt-px text-[12px] text-[var(--cockpit-steel)]">
            Envoi automatique dès le retour du réseau
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  k, v, mono, last,
}: { k: string; v: React.ReactNode; mono?: boolean; last?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-2.5 ${
        last ? '' : 'border-b border-[var(--cockpit-line-soft)]'
      }`}
    >
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-[1.2px] text-[var(--cockpit-steel)]">
        {k}
      </span>
      <span
        className={`text-right text-[14px] font-semibold text-[var(--cockpit-navy)] ${
          mono ? 'font-mono tracking-[0.3px] tabular-nums' : ''
        }`}
      >
        {v}
      </span>
    </div>
  );
}
