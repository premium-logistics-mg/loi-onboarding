import * as React from 'react';

export function ToConfirmBadge({ children = 'À CONFIRMER' }: { children?: React.ReactNode }) {
  return (
    <span className="inline-block whitespace-nowrap rounded-[3px] border border-[rgba(199,126,42,0.4)] bg-[rgba(199,126,42,0.10)] px-1.5 py-px text-[9px] font-extrabold uppercase tracking-[1.2px] text-[var(--cockpit-status-orange)]">
      {children}
    </span>
  );
}

export function CheckMark({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
