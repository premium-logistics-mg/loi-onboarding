import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function HandoffSection({
  route, label, hint, ctaLabel,
}: { route: string; label: string; hint: string; ctaLabel: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start gap-2.5 rounded-[10px] border-[1.5px] bg-[var(--cockpit-surface-2)] p-3.5" style={{ borderColor: 'var(--cockpit-line)' }}>
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border-[1.5px]"
          style={{ background: 'var(--cockpit-teal-soft)', borderColor: 'var(--cockpit-teal)' }}
        >
          <ArrowUpRight className="h-5 w-5 stroke-[1.8]" style={{ color: 'var(--cockpit-teal)' }} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-extrabold uppercase tracking-[1.3px]" style={{ color: 'var(--cockpit-teal)' }}>
            Module dédié · composant partagé
          </div>
          <div className="mt-1 text-[14px] font-bold leading-snug text-[var(--cockpit-text)]">{label}</div>
          <p className="mt-1 text-[12px] font-medium leading-snug text-[var(--cockpit-text-3)]">{hint}</p>
          <code className="mt-1.5 inline-block rounded-sm border bg-[var(--cockpit-surface-mute)] px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-wide text-[var(--cockpit-text-2)]" style={{ borderColor: 'var(--cockpit-line)' }}>
            {route}
          </code>
        </div>
      </div>

      <Link
        href={route}
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[10px] border-0 px-3.5 text-[15px] font-extrabold uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(26,142,126,0.45)]"
        style={{ background: 'var(--cockpit-teal)' }}
      >
        {ctaLabel}
        <ArrowUpRight className="h-4.5 w-4.5 stroke-[1.8]" aria-hidden />
      </Link>
    </div>
  );
}
