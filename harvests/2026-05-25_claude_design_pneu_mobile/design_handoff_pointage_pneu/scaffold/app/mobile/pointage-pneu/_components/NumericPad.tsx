'use client';

import * as React from 'react';

// Pavé numérique custom — interdit le clavier alpha pour la saisie km (§7).
// Affiché en sheet plein-largeur sous la valeur courante.

export function NumericPad({
  value,
  onChange,
  onValidate,
  suffix = 'km',
}: {
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  onValidate?: () => void;
  suffix?: string;
}) {
  const display = value === undefined ? '' : value.toString();

  function press(d: string) {
    const next = (display + d).replace(/^0+(?=\d)/, '');
    if (next.length > 9) return;
    onChange(next === '' ? undefined : Number(next));
  }
  function back() {
    const next = display.slice(0, -1);
    onChange(next === '' ? undefined : Number(next));
  }

  const keys: { label: string; action: () => void; variant?: 'digit' | 'back' | 'ok' }[] = [
    ...['1','2','3','4','5','6','7','8','9'].map(d => ({ label: d, action: () => press(d) })),
    { label: '⌫', action: back, variant: 'back' as const },
    { label: '0', action: () => press('0') },
    { label: 'OK', action: () => onValidate?.(), variant: 'ok' as const },
  ];

  return (
    <div className="rounded-xl border border-[var(--cockpit-line)] bg-[var(--cockpit-card)] p-3">
      {/* Display */}
      <div className="mb-2 flex items-baseline justify-end gap-2 rounded-lg bg-[var(--cockpit-paper)] px-4 py-3">
        <span className="font-mono text-[34px] font-extrabold leading-none tracking-[0.5px] text-[var(--cockpit-navy)] tabular-nums">
          {display === '' ? '0' : Number(display).toLocaleString('fr-FR')}
        </span>
        <span className="text-[14px] font-bold uppercase tracking-[1px] text-[var(--cockpit-steel)]">{suffix}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {keys.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={k.action}
            className={`flex h-14 items-center justify-center rounded-[10px] text-[22px] font-bold ${
              k.variant === 'ok'
                ? 'bg-[var(--cockpit-teal)] text-white shadow-[0_4px_12px_rgba(26,142,126,0.28)]'
                : k.variant === 'back'
                ? 'bg-[var(--cockpit-line-soft)] text-[var(--cockpit-navy)]'
                : 'border border-[var(--cockpit-line)] bg-[var(--cockpit-card)] font-mono text-[var(--cockpit-navy)] tabular-nums'
            }`}
            aria-label={k.label === '⌫' ? 'Effacer un chiffre' : k.label}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
