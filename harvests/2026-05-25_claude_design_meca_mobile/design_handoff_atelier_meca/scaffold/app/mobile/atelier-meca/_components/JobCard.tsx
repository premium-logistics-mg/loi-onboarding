import Link from 'next/link';
import { Truck } from 'lucide-react';
import type { Intervention } from '../_types';
import { durationFromMin } from '../_types';
import { StatusBadge } from './StatusBadge';

export function JobCard({ job }: { job: Intervention }) {
  const isCours = job.status === 'cours';
  const isBloque = job.status === 'bloque';
  const isTermine = job.status === 'termine';
  const accent = isCours
    ? 'var(--cockpit-teal)'
    : isBloque
    ? 'var(--cockpit-status-orange)'
    : isTermine
    ? 'var(--cockpit-status-green)'
    : 'var(--cockpit-line)';

  return (
    <Link
      href={`/mobile/atelier-meca/${job.id}`}
      className={`relative flex min-h-[116px] flex-col gap-2.5 rounded-xl border-[1.5px] bg-[var(--cockpit-surface)] p-3.5 text-left ${
        isTermine ? 'opacity-[0.78]' : ''
      } ${isCours ? 'shadow-[0_6px_18px_rgba(26,142,126,0.18)]' : ''}`}
      style={{ borderColor: (isCours || isBloque) ? accent : 'var(--cockpit-line)' }}
    >
      {(isCours || isBloque) && (
        <span className="absolute left-3.5 right-3.5 top-[-1px] h-[3px] rounded-sm" style={{ background: accent }} />
      )}

      {/* Row 1 — code OT + status */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[13px] font-bold tabular-nums text-[var(--cockpit-text)]">{job.id}</span>
        <span className="ml-auto">
          <StatusBadge kind={job.status} />
        </span>
      </div>

      {/* Row 2 — véhicule + durée */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] border border-[var(--cockpit-line)] bg-[var(--cockpit-surface-mute)]">
          <Truck className="h-6 w-6 stroke-[1.8] text-[var(--cockpit-text-2)]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[20px] font-bold leading-none text-[var(--cockpit-text)] tabular-nums">
            {job.vehicle.code}
            <span className="text-[14px] font-semibold text-[var(--cockpit-text-3)]"> · {job.vehicle.plate}</span>
          </div>
          <div className="mt-1 text-[11px] font-semibold tracking-wide text-[var(--cockpit-text-3)]">
            {job.vehicle.model}
          </div>
        </div>
        <div className="min-w-[70px] text-right">
          <div className="text-[9px] font-extrabold uppercase tracking-[1.2px] text-[var(--cockpit-text-3)]">
            Durée est.
          </div>
          <div className="mt-0.5 font-mono text-[22px] font-bold leading-tight tabular-nums text-[var(--cockpit-text)]">
            {durationFromMin(job.estimatedDurationMin)}
          </div>
        </div>
      </div>

      {/* Row 3 — description */}
      <div className="text-[15px] font-bold leading-snug text-[var(--cockpit-text)]">{job.label}</div>

      {/* Row 4 — source */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[var(--cockpit-text-3)]">
        <span className="font-mono">{job.source}</span>
        {job.blocked?.freeText && (
          <>
            <span className="text-[var(--cockpit-text-4)]">·</span>
            <span className="font-bold text-[var(--cockpit-status-orange)]">{job.blocked.freeText}</span>
          </>
        )}
        {job.completedAt && (
          <>
            <span className="text-[var(--cockpit-text-4)]">·</span>
            <span>Clôturé {new Date(job.completedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
          </>
        )}
      </div>
    </Link>
  );
}
