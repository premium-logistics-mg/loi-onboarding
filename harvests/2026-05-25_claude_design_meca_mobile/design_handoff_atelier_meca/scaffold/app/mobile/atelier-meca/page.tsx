import { Shell } from './_components/Shell';
import { MecChip } from './_components/Chips';
import { JobCard } from './_components/JobCard';
import { EmptyState } from './_components/EmptyState';
import { StatusCounters } from './_components/StatusCounters';
import { getCurrentMechanic, getInterventionsForMechanic } from './_data';
import { MapPin } from 'lucide-react';

export default async function MesInterventionsPage() {
  const matricule = await getCurrentMechanic();
  const list = await getInterventionsForMechanic(matricule);

  if (list.length === 0) {
    return (
      <Shell crumb="LOI · Atelier Méca" title="Mes interventions" right={<MecChip matricule={matricule} />}>
        <EmptyState />
      </Shell>
    );
  }

  return (
    <Shell crumb="LOI · Atelier Méca" title="Mes interventions" right={<MecChip matricule={matricule} />}>
      {/* Bandeau atelier + date */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
        <MapPin className="w-4 h-4 stroke-[1.8] text-[var(--cockpit-text-3)]" aria-hidden />
        <span className="text-[11px] font-bold tracking-wide text-[var(--cockpit-text-2)]">Atelier Betainomby</span>
        <span className="text-[var(--cockpit-text-4)]">·</span>
        <time className="font-mono text-[11px] text-[var(--cockpit-text-3)]">25 mai 2026</time>
      </div>

      <StatusCounters list={list} />

      <div className="flex items-baseline justify-between px-4 pt-3 pb-2">
        <span className="text-[11px] font-extrabold tracking-[1.5px] uppercase text-[var(--cockpit-text-2)]">
          Mes interventions
        </span>
        <span className="font-mono text-[11px] tracking-wide text-[var(--cockpit-text-3)]">{list.length} OT</span>
      </div>

      <div className="flex flex-col gap-2.5 px-3 pb-4">
        {list.map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </div>
    </Shell>
  );
}
