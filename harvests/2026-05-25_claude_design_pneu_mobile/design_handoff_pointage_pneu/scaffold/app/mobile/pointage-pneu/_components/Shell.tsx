'use client';

import * as React from 'react';

// ─────────────────────────────────────────────────────────────
// LOI Mobile Shell — D82 light. Sun-readable cream body, navy
// chrome, teal accent strict. Tailwind + --cockpit-* tokens.
// ─────────────────────────────────────────────────────────────

const STEP_LABELS = ['Véhicule', 'Position', 'Événement', 'Détails', 'Confirmer'];

export function StatusBar({ offline = false }: { offline?: boolean }) {
  return (
    <div
      className="flex h-[30px] items-center justify-between bg-[var(--cockpit-navy)] px-4 text-[12px] font-semibold text-white"
      role="presentation"
      aria-hidden
    >
      <span className="font-mono tabular-nums">07:42</span>
      <div className="flex items-center gap-2">
        {offline && (
          <span className="rounded-[3px] border border-[rgba(232,185,122,0.45)] bg-[rgba(199,126,42,0.22)] px-1.5 py-px text-[9px] font-extrabold tracking-[1.5px] text-[#E8B97A]">
            HORS LIGNE
          </span>
        )}
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

export function AppBar({
  crumb = 'Premium Logistics · Atelier',
  title = 'Pointage pneu',
  showBack = true,
  onBack,
  right,
}: {
  crumb?: string;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <header className="bg-[var(--cockpit-navy)] px-1.5 pb-3 pt-1.5 text-white">
      <div className="flex min-h-[56px] items-center gap-1">
        <button
          type="button"
          aria-label="Retour"
          onClick={onBack}
          disabled={!showBack}
          className="flex h-14 w-14 items-center justify-center rounded-lg transition-colors hover:bg-white/5 disabled:opacity-20"
        >
          <Chevron dir="left" />
        </button>
        <div className="min-w-0 flex-1 pl-1">
          <div className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--cockpit-on-navy-dim)]">
            {crumb}
          </div>
          <div className="mt-px text-[22px] font-bold tracking-[-0.3px]">{title}</div>
        </div>
        {right}
      </div>
    </header>
  );
}

export function StepsBar({ step }: { step: number }) {
  return (
    <div className="bg-[var(--cockpit-navy)] px-3.5 pb-3.5">
      <ol className="flex items-stretch gap-1.5">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          const filled = done || active;
          return (
            <li key={label} className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span
                className={`h-1 rounded-sm ${filled ? 'bg-[var(--cockpit-teal)]' : 'bg-white/[0.16]'}`}
                aria-hidden
              />
              <span
                className={`truncate text-[9px] font-bold uppercase tracking-[1px] ${
                  active
                    ? 'text-white'
                    : done
                    ? 'text-[#9CC8C0]'
                    : 'text-[#6E84A3]'
                }`}
              >
                {String(n).padStart(2, '0')} · {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ActionBar({
  primary = 'Continuer',
  secondary,
  primaryEnabled = true,
  hint,
  onPrimary,
  onSecondary,
}: {
  primary?: string;
  secondary?: string;
  primaryEnabled?: boolean;
  hint?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}) {
  return (
    <footer className="border-t border-[var(--cockpit-line)] bg-[var(--cockpit-card)] px-3.5 pb-3.5 pt-3 shadow-[0_-10px_24px_-16px_rgba(11,37,64,0.18)]">
      {hint && (
        <div className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-[var(--cockpit-steel)]">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              primaryEnabled
                ? 'bg-[var(--cockpit-teal)] shadow-[0_0_0_4px_var(--cockpit-teal-soft)]'
                : 'bg-[var(--cockpit-steel-2)]'
            }`}
            aria-hidden
          />
          {hint}
        </div>
      )}
      <div className="flex gap-2.5">
        {secondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="flex h-[60px] shrink-0 basis-[38%] items-center justify-center gap-1.5 rounded-[10px] border-2 border-[var(--cockpit-navy)] bg-transparent text-[15px] font-bold uppercase tracking-[0.3px] text-[var(--cockpit-navy)]"
          >
            <Chevron dir="left" color="currentColor" size={18} stroke={2.6} />
            {secondary}
          </button>
        )}
        <button
          type="button"
          onClick={onPrimary}
          disabled={!primaryEnabled}
          className={`flex h-16 flex-1 items-center justify-center gap-2.5 rounded-[10px] text-[18px] font-extrabold uppercase tracking-[0.5px] ${
            primaryEnabled
              ? 'bg-[var(--cockpit-teal)] text-white shadow-[0_8px_20px_rgba(26,142,126,0.28)]'
              : 'bg-[var(--cockpit-line-soft)] text-[var(--cockpit-steel-2)]'
          }`}
        >
          {primary}
          {primaryEnabled && <ArrowRight />}
        </button>
      </div>
    </footer>
  );
}

export function MatChip({ matricule }: { matricule: string }) {
  return (
    <div className="mr-1 flex flex-col items-end gap-0.5 rounded-lg border border-white/[0.16] bg-white/[0.06] px-2.5 py-1.5 leading-[1.1]">
      <span className="text-[9px] font-bold uppercase tracking-[1.3px] text-[var(--cockpit-on-navy-dim)]">
        Mécanicien
      </span>
      <span className="font-mono text-[13px] font-semibold text-white tabular-nums">{matricule}</span>
    </div>
  );
}

export function TruckChip({ code, plate }: { code: string; plate?: string }) {
  return (
    <div className="mr-1 flex flex-col items-end gap-0.5 rounded-lg border border-[rgba(62,170,155,0.4)] bg-[rgba(26,142,126,0.22)] px-2.5 py-1.5 leading-[1.1]">
      <span className="text-[9px] font-bold uppercase tracking-[1.3px] text-[#9CD4C9]">Véhicule</span>
      <span className="font-mono text-[13px] font-semibold text-white tabular-nums">
        {code}{plate ? ` · ${plate}` : ''}
      </span>
    </div>
  );
}

export function GestureNav() {
  return (
    <div
      className="flex h-4 items-center justify-center bg-[var(--cockpit-card)]"
      aria-hidden
    >
      <span className="h-1 w-[108px] rounded-sm bg-[var(--cockpit-navy)]/40" />
    </div>
  );
}

// ─── small svg atoms ────────────────────────────────────────

function Chevron({
  dir = 'right', size = 26, color = '#fff', stroke = 2.4,
}: { dir?: 'left' | 'right'; size?: number; color?: string; stroke?: number }) {
  const d = dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width={14} height={11} viewBox="0 0 14 11" aria-hidden>
      <path d="M7 9.5l5.5-5.5a7.78 7.78 0 00-11 0L7 9.5z" fill="#fff" opacity="0.95"/>
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width={22} height={11} viewBox="0 0 22 11" aria-hidden>
      <rect x="0.5" y="0.5" width="18" height="10" rx="1.5" fill="none" stroke="#fff" opacity="0.85"/>
      <rect x="2" y="2" width="9" height="7" fill="#fff"/>
      <rect x="19" y="3.5" width="2" height="4" rx="0.5" fill="#fff" opacity="0.85"/>
    </svg>
  );
}
