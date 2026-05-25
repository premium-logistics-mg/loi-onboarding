'use client';

import * as React from 'react';
import { useWizard } from '../_state';
import type { TireEvent } from '../_types';
import { CheckMark } from './ToConfirmBadge';

interface EventDef {
  id: TireEvent;
  label: string;
  desc: string;
  /** override accent for higher-cost actions — status + form + label (§7). */
  accentVar?: '--cockpit-teal' | '--cockpit-status-orange';
  icon: (color: string) => React.ReactNode;
}

const EVENTS: EventDef[] = [
  { id: 'inspection',  label: 'Inspection',  desc: 'Contrôle visuel · pression · état',
    icon: (c) => (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="6.5" stroke={c} strokeWidth="2.2"/>
        <path d="M16 16l5 5" stroke={c} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  { id: 'montage',     label: 'Montage',     desc: 'Pose d’un pneu neuf ou recreusé',
    icon: (c) => (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/>
        <path d="M12 3v18M3 12h18" stroke={c} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  { id: 'depose',      label: 'Dépose',      desc: 'Retrait sans remplacement immédiat',
    icon: (c) => (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/>
        <path d="M7 12h10" stroke={c} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  { id: 'reparation',  label: 'Réparation',  desc: 'Plug · vulcanisation · valve',
    icon: (c) => (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M14 4l6 6-9 9-6 1 1-6 8-10z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12 6l6 6" stroke={c} strokeWidth="2"/>
      </svg>
    ),
  },
  { id: 'remplacement',label: 'Remplacement',desc: 'Dépose + montage d’un autre pneu',
    accentVar: '--cockpit-status-orange',
    icon: (c) => (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 8h12l-3-3M20 16H8l3 3" stroke={c} strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function Step3Event() {
  const { state, dispatch } = useWizard();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-3.5 pb-4 pt-3.5">
      <div className="px-1 pb-2.5 text-[11px] font-extrabold uppercase tracking-[1.5px] text-[var(--cockpit-steel)]">
        Que fais-tu sur ce pneu ?
      </div>
      <ul className="flex flex-col gap-2.5">
        {EVENTS.map((e) => {
          const selected = state.event === e.id;
          const accentVar = e.accentVar ?? '--cockpit-teal';
          return (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => dispatch({ type: 'setEvent', event: e.id })}
                aria-pressed={selected}
                className="flex w-full min-h-[88px] items-center gap-3.5 rounded-xl border bg-[var(--cockpit-card)] px-4 py-3.5 text-left"
                style={{
                  borderWidth: selected ? 2 : 1.5,
                  borderColor: selected ? `var(${accentVar})` : 'var(--cockpit-line)',
                  boxShadow: selected ? `0 6px 18px rgba(26,142,126,0.20)` : 'none',
                }}
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ background: selected ? `var(${accentVar})` : 'var(--cockpit-line-soft)' }}
                >
                  {e.icon(selected ? '#fff' : 'var(--cockpit-navy)')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[18px] font-extrabold tracking-[-0.2px] text-[var(--cockpit-navy)]">
                    {e.label}
                  </div>
                  <div className="mt-0.5 text-[13px] font-medium text-[var(--cockpit-steel)]">
                    {e.desc}
                  </div>
                </div>
                {selected ? (
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `var(${accentVar})` }}
                  >
                    <CheckMark size={20} />
                  </div>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 6l6 6-6 6" stroke="var(--cockpit-steel-2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
