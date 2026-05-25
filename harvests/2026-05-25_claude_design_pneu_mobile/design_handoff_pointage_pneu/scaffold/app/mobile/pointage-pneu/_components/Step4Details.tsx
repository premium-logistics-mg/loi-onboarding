'use client';

import * as React from 'react';
import { useWizard, labelForEvent } from '../_state';
import { getTireBrands, formatKm } from '../_data';
import type { TireBrand } from '../_types';
import { CheckMark, ToConfirmBadge } from './ToConfirmBadge';
import { NumericPad } from './NumericPad';

type Field = 'brand' | 'serial' | 'km' | 'photo';

export function Step4Details() {
  const { state, dispatch } = useWizard();
  const [open, setOpen] = React.useState<Field | null>(null);
  const [brands, setBrands] = React.useState<TireBrand[]>([]);

  React.useEffect(() => {
    let cancel = false;
    getTireBrands().then(b => { if (!cancel) setBrands(b); });
    return () => { cancel = true; };
  }, []);

  const filled = {
    brand:  Boolean(state.brand),
    serial: Boolean(state.serial),
    km:     state.km !== undefined,
    photo:  state.photos.length > 0,
  };

  function scanSerial() {
    // TODO write-path : ouvrir caméra DOT/QR via <input capture> + parsing LOI.
    dispatch({ type: 'setSerial', serial: 'Y82C19A2387' }); // valeur de démo, À CONFIRMER format
  }

  function capturePhoto() {
    // TODO write-path : input file capture + IndexedDB.
    dispatch({ type: 'addPhoto', photo: {
      blobId: `local-${Date.now()}`,
      capturedAt: new Date().toISOString(),
    }});
  }

  return (
    <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3.5 pb-4 pt-3.5">
      {/* Context strip */}
      <div className="flex items-center gap-2 rounded-lg border border-[rgba(26,142,126,0.2)] bg-[var(--cockpit-teal-soft)] px-3 py-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--cockpit-teal)] shadow-[0_0_0_3px_rgba(26,142,126,0.20)]" />
        <span className="text-[12px] font-semibold text-[var(--cockpit-navy)]">
          {state.vehicle?.code ?? '— —'} ·{' '}
          <span className="font-mono">{state.position ?? '— —'}</span>
          {' · '}{state.event ? labelForEvent(state.event) : '—'}
        </span>
      </div>

      {/* 1 · Marque */}
      <DetailCard
        idx={1}
        label="Marque pneu"
        status={filled.brand ? 'done' : open === 'brand' ? 'active' : 'todo'}
        value={state.brand?.name ?? 'Sélectionner une marque'}
        sub={state.brand?.size}
        action={
          <button type="button" onClick={() => setOpen(open === 'brand' ? null : 'brand')}
            className="shrink-0 rounded-lg border-[1.5px] border-[var(--cockpit-line)] bg-[var(--cockpit-card)] px-3 py-2 text-[12px] font-bold uppercase tracking-[1px] text-[var(--cockpit-navy)]">
            {filled.brand ? 'Modifier' : 'Choisir'}
          </button>
        }
      />
      {open === 'brand' && (
        <ul className="rounded-xl border border-[var(--cockpit-line)] bg-[var(--cockpit-card)] p-1.5">
          {brands.map((b) => (
            <li key={b.name}>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'setBrand', brand: { name: b.name, size: b.sizes[0] }});
                  setOpen(null);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left hover:bg-[var(--cockpit-paper)]"
              >
                <div>
                  <div className="text-[15px] font-bold text-[var(--cockpit-navy)]">{b.name}</div>
                  <div className="font-mono text-[12px] text-[var(--cockpit-steel)]">{b.sizes[0]}</div>
                </div>
                {state.brand?.name === b.name && <CheckMark size={20} color="var(--cockpit-teal)" />}
              </button>
            </li>
          ))}
          <li className="px-3 py-2"><ToConfirmBadge>Liste fermée à valider</ToConfirmBadge></li>
        </ul>
      )}

      {/* 2 · N° série */}
      <DetailCard
        idx={2}
        label="N° série pneu"
        mono
        status={filled.serial ? 'done' : 'todo'}
        value={state.serial ?? 'Scanner DOT / QR'}
        sub={filled.serial ? <span className="inline-flex items-center gap-1.5">Scanné via DOT/QR <ToConfirmBadge>format à valider</ToConfirmBadge></span> : undefined}
        action={
          <button type="button" onClick={scanSerial}
            className="shrink-0 rounded-lg border-[1.5px] border-[var(--cockpit-line)] bg-[var(--cockpit-card)] px-3 py-2 text-[12px] font-bold uppercase tracking-[1px] text-[var(--cockpit-navy)]">
            {filled.serial ? 'Rescan' : 'Scanner'}
          </button>
        }
      />

      {/* 3 · Km */}
      <DetailCard
        idx={3}
        label="Kilométrage véhicule"
        mono
        status={filled.km ? 'done' : open === 'km' ? 'active' : 'todo'}
        value={state.km !== undefined ? formatKm(state.km) : 'Saisir le compteur'}
        sub="Pavé numérique · pas de clavier alpha"
        action={
          <button type="button" onClick={() => setOpen(open === 'km' ? null : 'km')}
            className="shrink-0 rounded-lg border-[1.5px] border-[var(--cockpit-line)] bg-[var(--cockpit-card)] px-3 py-2 text-[12px] font-bold uppercase tracking-[1px] text-[var(--cockpit-navy)]">
            {filled.km ? 'Modifier' : 'Saisir'}
          </button>
        }
      />
      {open === 'km' && (
        <NumericPad
          value={state.km}
          onChange={(n) => dispatch({ type: 'setKm', km: n ?? 0 })}
          onValidate={() => setOpen(null)}
        />
      )}

      {/* 4 · Photo */}
      <div className="flex min-h-[92px] items-center gap-3 rounded-xl border-[1.5px] border-[var(--cockpit-line)] bg-[var(--cockpit-card)] p-3">
        <StepBadge done={filled.photo} idx={4} />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-[var(--cockpit-steel)]">
            Photo preuve
          </div>
          <div className="mt-0.5 text-[15px] font-bold text-[var(--cockpit-navy)]">
            {filled.photo ? `${state.photos.length} photo${state.photos.length > 1 ? 's' : ''}` : 'Prendre une photo'}
          </div>
          <div className="mt-0.5 text-[12px] text-[var(--cockpit-steel)]">
            {filled.photo ? 'Pneu en place · gauche essieu 2' : 'Cadre net · plein soleil OK'}
          </div>
        </div>
        <button
          type="button"
          onClick={capturePhoto}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[var(--cockpit-line)] bg-[repeating-linear-gradient(45deg,var(--cockpit-line-soft)_0_8px,var(--cockpit-line)_8px_16px)]"
          aria-label="Prendre une photo"
        >
          <span className="rounded bg-[rgba(245,241,232,0.85)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--cockpit-steel)]">
            photo
          </span>
        </button>
      </div>

      {/* Auto-save hint */}
      <div className="mt-1 flex items-center gap-2 text-[12px] text-[var(--cockpit-steel)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M20 7L9 18l-5-5" stroke="var(--cockpit-status-green)" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Enregistré localement · sera envoyé dès le réseau
      </div>
    </div>
  );
}

function DetailCard({
  idx, label, value, sub, action, status, mono,
}: {
  idx: number;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  status: 'done' | 'active' | 'todo';
  mono?: boolean;
}) {
  const isDone = status === 'done';
  const isActive = status === 'active';
  return (
    <div
      className="flex min-h-[76px] items-center gap-3 rounded-xl border-[1.5px] bg-[var(--cockpit-card)] px-3.5 py-3"
      style={{
        borderColor: isActive ? 'var(--cockpit-navy)' : 'var(--cockpit-line)',
        boxShadow: isActive ? '0 4px 14px rgba(11,37,64,0.12)' : 'none',
      }}
    >
      <StepBadge done={isDone} idx={idx} active={isActive} />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-[var(--cockpit-steel)]">{label}</div>
        <div
          className={`mt-0.5 truncate text-[17px] font-bold text-[var(--cockpit-navy)] ${
            mono ? 'font-mono tracking-[0.5px] tabular-nums' : 'tracking-[-0.2px]'
          }`}
        >
          {value}
        </div>
        {sub && (
          <div className="mt-0.5 text-[12px] text-[var(--cockpit-steel)]">{sub}</div>
        )}
      </div>
      {action}
    </div>
  );
}

function StepBadge({ idx, done, active = false }: { idx: number; done: boolean; active?: boolean }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[14px] font-bold"
      style={{
        background: done ? 'var(--cockpit-teal)' : active ? 'var(--cockpit-navy)' : 'var(--cockpit-line-soft)',
        color: done || active ? '#fff' : 'var(--cockpit-steel)',
      }}
    >
      {done ? <CheckMark size={18} /> : idx}
    </div>
  );
}
