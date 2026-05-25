'use client';

import * as React from 'react';
import { useWizard } from '../_state';
import { getRecentVehiclesForMechanic } from '../_data';
import type { Vehicle } from '../_types';
import { CheckMark, ToConfirmBadge } from './ToConfirmBadge';

export function Step1Vehicle() {
  const { state, dispatch } = useWizard();
  const [recents, setRecents] = React.useState<Vehicle[]>([]);

  React.useEffect(() => {
    let cancel = false;
    getRecentVehiclesForMechanic('PL-MEC-007').then(v => { if (!cancel) setRecents(v); });
    return () => { cancel = true; };
  }, []);

  function pick(v: Vehicle) {
    dispatch({ type: 'setVehicle', vehicle: v });
  }

  function onScanClick() {
    // TODO write-path : ouvrir la caméra plaque via <input capture> + OCR LOI.
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Hero — Scan plaque */}
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={onScanClick}
          className="flex w-full min-h-[92px] items-center gap-3.5 rounded-xl bg-[var(--cockpit-navy)] px-4 py-3.5 text-left text-white shadow-[0_8px_20px_rgba(11,37,64,0.22)]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-[var(--cockpit-teal)]">
            <CameraIcon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-[1.6px] text-[#9CD4C9]">
              Action recommandée
            </div>
            <div className="mt-0.5 text-[22px] font-extrabold tracking-[-0.2px]">
              Scanner la plaque
            </div>
            <div className="mt-0.5 text-[13px] text-[var(--cockpit-on-navy-soft)]">
              Pointe l’appareil sur la plaque arrière
            </div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-2.5 px-4 pb-2 pt-3.5">
        <span className="h-px flex-1 bg-[var(--cockpit-line)]" />
        <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--cockpit-steel)]">ou</span>
        <span className="h-px flex-1 bg-[var(--cockpit-line)]" />
      </div>

      {/* Search field */}
      <div className="px-4">
        <label className="flex min-h-[56px] items-center gap-3 rounded-[10px] border-[1.5px] border-[var(--cockpit-line)] bg-[var(--cockpit-card)] px-3.5">
          <SearchIcon />
          <input
            type="search"
            inputMode="search"
            placeholder="Code véhicule ou plaque"
            className="flex-1 bg-transparent text-[16px] text-[var(--cockpit-text)] placeholder:text-[var(--cockpit-steel-2)] focus:outline-none"
          />
          <span className="rounded bg-[var(--cockpit-line-soft)] px-2 py-1 text-[10px] font-bold tracking-[1px] text-[var(--cockpit-steel)]">
            CT-…
          </span>
        </label>
      </div>

      {/* Recents */}
      <div className="flex items-baseline justify-between px-4 pb-2 pt-5">
        <span className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-[var(--cockpit-text)]">
          Tes véhicules récents
        </span>
        <span className="text-[12px] text-[var(--cockpit-steel)]">{recents.length} derniers</span>
      </div>

      <ul className="flex flex-col gap-2 px-3 pb-3">
        {recents.map((v) => {
          const selected = state.vehicle?.code === v.code;
          return (
            <li key={v.code}>
              <button
                type="button"
                onClick={() => pick(v)}
                className={`flex min-h-[72px] w-full items-center gap-3 rounded-[10px] px-3.5 py-3 text-left ${
                  selected
                    ? 'border-2 border-[var(--cockpit-teal)] bg-[var(--cockpit-card)] shadow-[0_6px_16px_rgba(26,142,126,0.18)]'
                    : 'border border-[var(--cockpit-line)] bg-[var(--cockpit-card)]'
                }`}
                aria-pressed={selected}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                    selected ? 'bg-[var(--cockpit-teal)]' : 'bg-[var(--cockpit-line-soft)]'
                  }`}
                  aria-hidden
                >
                  {selected ? <CheckMark size={26} /> : <TruckGlyph />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[16px] font-bold text-[var(--cockpit-navy)] tabular-nums">{v.code}</span>
                    <span className="font-mono text-[13px] text-[var(--cockpit-steel)]">·</span>
                    <span className="font-mono text-[14px] tracking-[0.5px] text-[var(--cockpit-navy-2)] tabular-nums">{v.plate}</span>
                  </div>
                  <div className="mt-0.5 text-[13px] font-medium text-[var(--cockpit-navy-2)]">{v.model}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[var(--cockpit-steel)]">
                    <PinIcon />
                    {v.homeSite}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-1.5 px-4 pb-3 text-[11px] text-[var(--cockpit-steel-2)]">
        <ToConfirmBadge>Format plaque</ToConfirmBadge>
        <span>masque exact à valider avec LOI</span>
      </div>
    </div>
  );
}

// ─── icons ─────────────────────────────────────────────────

function CameraIcon() {
  return (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="#fff" strokeWidth="2"/>
      <circle cx="12" cy="13.5" r="3.5" stroke="#fff" strokeWidth="2"/>
      <path d="M8 7l1.5-3h5L16 7" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="var(--cockpit-steel)" strokeWidth="2"/>
      <path d="M16 16l4 4" stroke="var(--cockpit-steel)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TruckGlyph() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 16V7h11l4 4v5" stroke="var(--cockpit-navy)" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="7" cy="17" r="2.2" stroke="var(--cockpit-navy)" strokeWidth="2"/>
      <circle cx="16" cy="17" r="2.2" stroke="var(--cockpit-navy)" strokeWidth="2"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z" stroke="var(--cockpit-steel)" strokeWidth="1.8"/>
      <circle cx="12" cy="9" r="2.2" stroke="var(--cockpit-steel)" strokeWidth="1.8"/>
    </svg>
  );
}
