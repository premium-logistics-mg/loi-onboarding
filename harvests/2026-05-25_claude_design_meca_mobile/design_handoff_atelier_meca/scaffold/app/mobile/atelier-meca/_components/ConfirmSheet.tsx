'use client';

import { useState } from 'react';
import { CircleSlash, Check } from 'lucide-react';
import type { Intervention } from '../_types';
import { BLOCK_MOTIFS } from '../_data';

export function ConfirmSheet({
  tone, job, mechanic, onClose, onConfirm,
}: {
  tone: 'teal' | 'orange';
  job: Intervention;
  mechanic: string;
  onClose: () => void;
  onConfirm: (payload?: { motif: string; freeText?: string }) => void;
}) {
  const [motif, setMotif] = useState<string>('piece_manquante');
  const [freeText, setFreeText] = useState<string>('');

  const accent = tone === 'orange' ? 'var(--cockpit-status-orange)' : 'var(--cockpit-teal)';
  const isBloquer = tone === 'orange';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end backdrop-blur-[2px]"
      style={{ background: 'rgba(6,12,22,0.62)' }}
      onClick={onClose}
    >
      <div
        className="flex w-full flex-col gap-3 rounded-t-[22px] bg-[var(--cockpit-surface)] px-4 pt-3.5 pb-4 shadow-[0_-22px_60px_rgba(0,0,0,0.45)]"
        style={{ borderTop: `4px solid ${accent}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="-mt-1 mb-0.5 self-center h-1 w-11 rounded-sm" style={{ background: 'var(--cockpit-line)' }} />

        <div className="flex items-center gap-2.5">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: accent }}
          >
            {isBloquer ? <CircleSlash className="h-5.5 w-5.5 stroke-[2.4]" /> : <Check className="h-6.5 w-6.5 stroke-[2.8]" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-[1.4px]" style={{ color: accent }}>
              {isBloquer ? 'Confirmer le blocage' : 'Confirmer la clôture'}
            </div>
            <h2 className="mt-0.5 text-[20px] font-extrabold -tracking-[0.2px] leading-snug text-[var(--cockpit-text)]">
              {isBloquer ? "Bloquer l'intervention ?" : "Terminer l'intervention ?"}
            </h2>
          </div>
        </div>

        <p className="text-[14px] font-medium leading-relaxed text-[var(--cockpit-text-2)]">
          {isBloquer
            ? "Le véhicule reste en file atelier. Indique au chef d'atelier ce qui te bloque — il pourra commander la pièce ou réassigner."
            : "Vérifie le récap avant clôture · l'OT passe en « Terminé » et le véhicule sort de la file atelier."}
        </p>

        {isBloquer && (
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[1.4px] text-[var(--cockpit-text-3)]">
              Motif (liste fermée — À CONFIRMER LOI)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {BLOCK_MOTIFS.map((m) => {
                const sel = motif === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMotif(m.id)}
                    className="min-h-9 rounded-full border-[1.5px] px-3 text-[12px] font-bold"
                    style={{
                      background: sel ? 'var(--cockpit-status-orange-soft)' : 'var(--cockpit-surface-2)',
                      color: sel ? 'var(--cockpit-status-orange)' : 'var(--cockpit-text-2)',
                      borderColor: sel ? 'var(--cockpit-status-orange)' : 'var(--cockpit-line)',
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5 rounded-[10px] border-[1.5px] border-[var(--cockpit-line)] bg-[var(--cockpit-surface-2)] px-3 py-2.5">
          <SummaryRow k="OT atelier" v={job.id} mono />
          <SummaryRow k="Véhicule"   v={`${job.vehicle.code} · ${job.vehicle.plate}`} mono />
          {!isBloquer && (
            <>
              <SummaryRow k="Inspection" v={`${job.inspection.filter(i=>i.status!=='nonverif').length}/${job.inspection.length || 6} vérifiés`} />
              <SummaryRow k="Pièces"     v={`${job.parts.length} consommées`} />
              <SummaryRow k="Photos"     v={`${job.photos.length} preuves`} />
              <SummaryRow k="Mécanicien" v={mechanic} mono />
            </>
          )}
        </div>

        {isBloquer && (
          <div className="flex items-center gap-2 rounded-lg border border-[var(--cockpit-status-orange)] bg-[var(--cockpit-status-orange-soft)] px-3 py-2 text-[12px] font-semibold text-[var(--cockpit-text)]">
            <span className="h-2 w-2 flex-shrink-0" style={{ background: 'var(--cockpit-status-orange)' }} />
            Le chef d'atelier reçoit une notification immédiate.
          </div>
        )}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-14 min-h-14 basis-[38%] rounded-[10px] border-[2px] bg-transparent text-[15px] font-bold uppercase tracking-wide"
            style={{ borderColor: 'var(--cockpit-cream)', color: 'var(--cockpit-cream)' }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => onConfirm(isBloquer ? { motif, freeText } : undefined)}
            className="flex h-15 min-h-15 flex-1 items-center justify-center gap-2 rounded-[10px] border-0 text-[17px] font-extrabold uppercase tracking-wide text-white"
            style={{ background: accent, boxShadow: isBloquer ? '0 8px 20px rgba(199,126,42,0.45)' : '0 8px 20px rgba(26,142,126,0.45)' }}
          >
            {isBloquer ? <CircleSlash className="h-5 w-5 stroke-[2.6]" /> : <Check className="h-5.5 w-5.5 stroke-[2.8]" />}
            {isBloquer ? 'Bloquer' : 'Terminer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10px] font-extrabold uppercase tracking-[1.2px] text-[var(--cockpit-text-3)]">{k}</span>
      <span className={`text-[13px] font-bold text-right text-[var(--cockpit-text)] ${mono ? 'font-mono tabular-nums' : ''}`}>{v}</span>
    </div>
  );
}
