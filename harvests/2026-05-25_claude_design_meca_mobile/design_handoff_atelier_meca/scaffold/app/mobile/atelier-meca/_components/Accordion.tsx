'use client';

import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function Accordion({
  icon, title, summary, count, countTone = 'neutral', handoff,
  open, onToggle, children,
}: {
  icon: ReactNode;
  title: string;
  summary?: string;
  count?: string;
  countTone?: 'teal' | 'orange' | 'red' | 'neutral';
  handoff?: boolean;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const dotColor =
    countTone === 'teal'   ? 'var(--cockpit-teal)' :
    countTone === 'orange' ? 'var(--cockpit-status-orange)' :
    countTone === 'red'    ? 'var(--cockpit-status-red)' :
                             'var(--cockpit-text-4)';

  return (
    <section
      className={`overflow-hidden rounded-xl border-[1.5px] bg-[var(--cockpit-surface)] ${
        open ? 'shadow-[0_8px_24px_rgba(0,0,0,0.30)]' : ''
      }`}
      style={{ borderColor: open ? 'var(--cockpit-teal)' : 'var(--cockpit-line)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-16 w-full items-center gap-3 px-3.5 py-3 text-left"
        style={{ background: open ? 'rgba(26,142,126,0.10)' : 'transparent' }}
      >
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border-[1.5px]"
          style={{
            background: open ? 'var(--cockpit-teal)' : 'var(--cockpit-surface-mute)',
            borderColor: open ? 'var(--cockpit-teal)' : 'var(--cockpit-line)',
            color: open ? '#fff' : 'var(--cockpit-text-2)',
          }}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="text-[17px] font-extrabold -tracking-[0.2px] text-[var(--cockpit-text)]">{title}</span>
            {handoff && (
              <span
                className="rounded-sm border px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[1.2px]"
                style={{ background: 'var(--cockpit-teal-soft)', color: 'var(--cockpit-teal)', borderColor: 'var(--cockpit-teal)' }}
              >
                Module dédié
              </span>
            )}
          </span>
          {summary && (
            <span className="mt-0.5 block truncate text-[12px] font-medium leading-snug text-[var(--cockpit-text-3)]">
              {summary}
            </span>
          )}
        </span>
        {count !== undefined && (
          <span
            className="flex-shrink-0 rounded-md border-[1.5px] bg-[var(--cockpit-surface-mute)] px-2 py-0.5 text-center font-mono text-[16px] font-bold tabular-nums"
            style={{ borderColor: 'var(--cockpit-line)', color: dotColor, minWidth: 32 }}
          >
            {count}
          </span>
        )}
        <ChevronRight
          className="h-5 w-5 stroke-[2.4] text-[var(--cockpit-text-2)] transition-transform"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          aria-hidden
        />
      </button>

      {open && (
        <div className="border-t border-[var(--cockpit-line-soft)] bg-[var(--cockpit-surface)] px-3.5 pb-3.5 pt-3">
          {children}
        </div>
      )}
    </section>
  );
}
