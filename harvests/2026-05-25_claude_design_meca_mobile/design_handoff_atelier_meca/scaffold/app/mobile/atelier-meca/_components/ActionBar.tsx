'use client';

import { CircleSlash, Check } from 'lucide-react';

export function ActionBar({
  onBloquer, onTerminer, hint,
}: { onBloquer: () => void; onTerminer: () => void; hint?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--cockpit-line)] bg-[var(--cockpit-surface)] px-3.5 pt-3 pb-3.5 shadow-[0_-12px_30px_rgba(0,0,0,0.40)]">
      {hint && (
        <div className="mb-2.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--cockpit-text-3)]">
          <span className="h-2 w-2 rounded-full" style={{ background: 'var(--cockpit-teal)', boxShadow: '0 0 0 4px var(--cockpit-teal-soft)' }} />
          {hint}
        </div>
      )}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onBloquer}
          className="flex h-15 min-h-15 basis-[42%] items-center justify-center gap-2 rounded-xl border-0 text-[16px] font-extrabold uppercase tracking-wide text-white"
          style={{ background: 'var(--cockpit-status-orange)', boxShadow: '0 8px 20px rgba(199,126,42,0.45)' }}
        >
          <CircleSlash className="h-5 w-5 stroke-[2.4]" aria-hidden />
          Bloquer
        </button>
        <button
          type="button"
          onClick={onTerminer}
          className="flex h-15 min-h-15 flex-1 items-center justify-center gap-2 rounded-xl border-0 text-[17px] font-extrabold uppercase tracking-wide text-white"
          style={{ background: 'var(--cockpit-teal)', boxShadow: '0 8px 20px rgba(26,142,126,0.45)' }}
        >
          <Check className="h-5.5 w-5.5 stroke-[2.8]" aria-hidden />
          Terminer
        </button>
      </div>
    </div>
  );
}
