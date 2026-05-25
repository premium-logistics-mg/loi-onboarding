'use client';

import { useState } from 'react';
import { ChevronRight, Mic, Square, Play } from 'lucide-react';
import { SYSTEMS } from '../../_data';
import type { Diagnostic, Severity, MechSystem } from '../../_types';

type VoiceState = 'idle' | 'recording' | 'done';

export function DiagnosticSection({ value }: { value: Diagnostic }) {
  const [system, setSystem] = useState<MechSystem | undefined>(value.system);
  const [severity, setSeverity] = useState<Severity | undefined>(value.severity);
  const [voice, setVoice] = useState<VoiceState>(value.voiceNoteBlobId ? 'done' : 'idle');

  return (
    <div className="flex flex-col gap-3">
      {/* Système touché */}
      <div>
        <SectionLabel>Système touché</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {SYSTEMS.map((s) => {
            const sel = system === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSystem(s)}
                className="inline-flex min-h-9 items-center gap-1 rounded-full border-[1.5px] px-3 text-[13px] font-semibold"
                style={{
                  background: sel ? 'rgba(26,142,126,0.22)' : 'var(--cockpit-surface-2)',
                  color: sel ? 'var(--cockpit-text)' : 'var(--cockpit-text-2)',
                  borderColor: sel ? 'var(--cockpit-teal)' : 'var(--cockpit-line)',
                  fontWeight: sel ? 700 : 600,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pièce / sous-système */}
      <FieldRow label="Pièce / sous-système" value={value.subSystem} placeholder="Ex : Plaquettes AR · joint hydraulique…" />

      {/* DTC */}
      <FieldRow label="Code défaut" value={value.dtc} placeholder="DTC · scanner OBD-II ou saisir" mono />

      {/* Sévérité */}
      <div>
        <SectionLabel>Sévérité diagnostic</SectionLabel>
        <div className="flex gap-1.5">
          {(['mineure', 'majeure', 'critique'] as const).map((s) => (
            <SeverityButton key={s} kind={s} selected={severity === s} onClick={() => setSeverity(s)} />
          ))}
        </div>
      </div>

      {/* Voice */}
      <VoiceRecorder state={voice} onChange={setVoice} durationSec={value.voiceDurationSec} />

      {/* Texte court */}
      <div>
        <SectionLabel>Texte court</SectionLabel>
        <textarea
          defaultValue={value.text ?? ''}
          placeholder="Décris brièvement le défaut (1-2 lignes)…"
          rows={3}
          className="block min-h-16 w-full rounded-[10px] border-[1.5px] bg-[var(--cockpit-surface-2)] px-3 py-2.5 text-[14px] font-medium leading-snug text-[var(--cockpit-text)] placeholder:italic placeholder:text-[var(--cockpit-text-4)]"
          style={{ borderColor: 'var(--cockpit-line)' }}
        />
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[9px] font-extrabold uppercase tracking-[1.4px] text-[var(--cockpit-text-3)]">
      {children}
    </div>
  );
}

function FieldRow({ label, value, placeholder, mono }: { label: string; value?: string; placeholder: string; mono?: boolean }) {
  const filled = !!value;
  return (
    <div className="flex min-h-14 items-center gap-3 rounded-[10px] border-[1.5px] bg-[var(--cockpit-surface-2)] px-3 py-2.5" style={{ borderColor: 'var(--cockpit-line)' }}>
      <span className="w-22 flex-shrink-0 text-[9px] font-extrabold uppercase tracking-[1.4px] text-[var(--cockpit-text-3)]">{label}</span>
      <span
        className={`min-w-0 flex-1 text-[14px] ${filled ? 'font-bold text-[var(--cockpit-text)]' : 'font-medium text-[var(--cockpit-text-4)]'} ${mono ? 'font-mono tabular-nums' : ''}`}
      >
        {filled ? value : placeholder}
      </span>
      <ChevronRight className="h-4 w-4 stroke-[1.8] text-[var(--cockpit-text-3)]" aria-hidden />
    </div>
  );
}

function SeverityButton({ kind, selected, onClick }: { kind: Severity; selected: boolean; onClick: () => void }) {
  const cfg = ({
    mineure:  { label: 'Mineure',  color: 'var(--cockpit-teal)',           shape: 'dot' as const },
    majeure:  { label: 'Majeure',  color: 'var(--cockpit-status-orange)',  shape: 'tri' as const },
    critique: { label: 'Critique', color: 'var(--cockpit-status-red)',     shape: 'sq'  as const },
  })[kind];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] px-1.5 py-2 text-[12px] font-extrabold tracking-wide"
      style={{
        background: selected ? cfg.color : 'var(--cockpit-surface-2)',
        borderColor: selected ? cfg.color : 'var(--cockpit-line)',
        color: selected ? '#fff' : 'var(--cockpit-text)',
      }}
    >
      <ShapeMark shape={cfg.shape} color={selected ? '#fff' : cfg.color} />
      <span>{cfg.label}</span>
    </button>
  );
}

function ShapeMark({ shape, color }: { shape: 'dot' | 'tri' | 'sq'; color: string }) {
  if (shape === 'dot') return <span className="h-3 w-3 rounded-full" style={{ background: color }} />;
  if (shape === 'sq')  return <span className="h-3 w-3" style={{ background: color }} />;
  return (
    <svg width="13" height="11" viewBox="0 0 13 11" aria-hidden>
      <path d="M6.5 0.5l5.5 10h-11L6.5 0.5z" fill={color} />
    </svg>
  );
}

function VoiceRecorder({ state, onChange, durationSec }: { state: VoiceState; onChange: (s: VoiceState) => void; durationSec?: number }) {
  if (state === 'idle') {
    return (
      <div className="flex min-h-19 items-center gap-3 rounded-[10px] border-[1.5px] border-dashed bg-[var(--cockpit-surface-2)] p-3" style={{ borderColor: 'var(--cockpit-line)' }}>
        <button
          type="button"
          aria-label="Enregistrer note vocale"
          onClick={() => onChange('recording')}
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-white shadow-[0_8px_18px_rgba(184,66,30,0.35)]"
          style={{ background: 'var(--cockpit-status-red)' }}
        >
          <Mic className="h-6.5 w-6.5 stroke-[1.8]" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-extrabold uppercase tracking-[1.4px] text-[var(--cockpit-text-3)]">Note vocale</div>
          <div className="mt-0.5 text-[14px] font-bold text-[var(--cockpit-text-2)]">Tape pour parler · 60s max</div>
        </div>
      </div>
    );
  }
  if (state === 'recording') {
    return (
      <div className="flex min-h-19 items-center gap-3 rounded-[10px] border-[1.5px] bg-[var(--cockpit-status-red-soft)] p-3" style={{ borderColor: 'var(--cockpit-status-red)' }}>
        <button
          type="button"
          aria-label="Arrêter"
          onClick={() => onChange('done')}
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-[4px] text-white shadow-[0_0_0_8px_rgba(184,66,30,0.18)]"
          style={{ background: 'var(--cockpit-status-red)', borderColor: 'rgba(184,66,30,0.45)' }}
        >
          <Square className="h-4.5 w-4.5 fill-white" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[1.4px]" style={{ color: 'var(--cockpit-status-red)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--cockpit-status-red)' }} />
            Enregistrement
          </div>
          <div className="mt-0.5 font-mono text-[18px] font-bold tabular-nums text-[var(--cockpit-text)]">00:08</div>
          <Waveform live />
        </div>
      </div>
    );
  }
  // done
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] border-[1.5px] bg-[var(--cockpit-surface-2)] p-3" style={{ borderColor: 'var(--cockpit-line)' }}>
      <button
        type="button"
        aria-label="Lire"
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white shadow-[0_6px_14px_rgba(26,142,126,0.30)]"
        style={{ background: 'var(--cockpit-teal)' }}
      >
        <Play className="h-5 w-5 fill-white" aria-hidden />
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] font-extrabold uppercase tracking-[1.4px] text-[var(--cockpit-text-3)]">Note vocale · enregistrée</div>
        <div className="mt-0.5 font-mono text-[14px] font-bold tabular-nums text-[var(--cockpit-text)]">
          {durationSec ? `${String(Math.floor(durationSec / 60)).padStart(2, '0')}:${String(durationSec % 60).padStart(2, '0')}` : '00:32'}
        </div>
        <Waveform />
      </div>
      <button
        type="button"
        onClick={() => onChange('recording')}
        className="min-h-9 flex-shrink-0 rounded-md border-[1.5px] bg-transparent px-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--cockpit-text-2)]"
        style={{ borderColor: 'var(--cockpit-line)' }}
      >
        Ré-enr.
      </button>
    </div>
  );
}

function Waveform({ live = false }: { live?: boolean }) {
  const bars = live
    ? [4, 10, 16, 12, 18, 8, 14, 20, 12, 8, 16, 10, 18, 14, 8, 12, 16, 10, 4, 2]
    : [6, 10, 14, 8, 12, 16, 12, 10, 18, 14, 8, 6, 10, 14, 18, 10, 8, 12, 8, 4, 8, 12, 10, 16, 12];
  const activeCount = live ? 11 : 18;
  const activeColor = live ? 'var(--cockpit-status-red)' : 'var(--cockpit-teal)';
  return (
    <div className="mt-1.5 flex items-center gap-[2px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm"
          style={{ height: h, background: i < activeCount ? activeColor : 'var(--cockpit-text-4)' }}
        />
      ))}
    </div>
  );
}
