import { Truck, Clock } from 'lucide-react';
import type { Intervention } from '../_types';
import { durationFromMin } from '../_types';
import { StatusBadge } from './StatusBadge';

export function JobHeader({ job }: { job: Intervention }) {
  return (
    <section className="border-b border-[var(--cockpit-line)] bg-[var(--cockpit-surface-2)] px-3.5 pt-3.5 pb-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--cockpit-line)] bg-[var(--cockpit-surface-mute)]">
          <Truck className="h-7 w-7 stroke-[1.8] text-[var(--cockpit-text)]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[22px] font-bold leading-tight tabular-nums text-[var(--cockpit-text)]">
              {job.vehicle.code}
            </span>
            <span className="font-mono text-[13px] font-semibold tabular-nums text-[var(--cockpit-text-3)]">
              {job.vehicle.plate}
            </span>
          </div>
          <div className="mt-0.5 text-[11px] font-semibold tracking-wide text-[var(--cockpit-text-3)]">
            {job.vehicle.model}
          </div>
        </div>
        <StatusBadge kind={job.status} />
      </div>

      <div className="mt-3">
        <h2 className="text-[16px] font-bold leading-snug text-[var(--cockpit-text)]">{job.label}</h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[var(--cockpit-text-3)]">
          <span className="font-mono text-[12px] font-bold tabular-nums text-[var(--cockpit-text-2)]">{job.id}</span>
          <span className="text-[var(--cockpit-text-4)]">·</span>
          <span className="font-mono">{job.source}</span>
          <span className="text-[var(--cockpit-text-4)]">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3 stroke-[1.8]" aria-hidden />
            <span className="font-mono font-bold text-[var(--cockpit-text)] tabular-nums">{durationFromMin(job.estimatedDurationMin)}</span>
            <span>est.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
