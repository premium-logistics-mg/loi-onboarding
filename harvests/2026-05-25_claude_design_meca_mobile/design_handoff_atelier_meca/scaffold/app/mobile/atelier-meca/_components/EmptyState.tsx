import { MapPin, Wrench, RefreshCw } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
        <MapPin className="h-4 w-4 stroke-[1.8] text-[var(--cockpit-text-3)]" aria-hidden />
        <span className="text-[11px] font-bold tracking-wide text-[var(--cockpit-text-2)]">Atelier Betainomby</span>
        <span className="text-[var(--cockpit-text-4)]">·</span>
        <time className="font-mono text-[11px] text-[var(--cockpit-text-3)]">25 mai 2026</time>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4.5 px-9 py-5">
        <div className="flex h-[88px] w-[88px] items-center justify-center rounded-[22px] border border-[var(--cockpit-line)] bg-[var(--cockpit-surface)]">
          <Wrench className="h-11 w-11 stroke-[1.8] text-[var(--cockpit-text-3)]" aria-hidden />
        </div>
        <div className="text-center">
          <h2 className="text-[22px] font-extrabold -tracking-[0.3px] text-[var(--cockpit-text)]">Aucune intervention</h2>
          <p className="mt-1.5 text-[14px] font-medium leading-relaxed text-[var(--cockpit-text-3)]">
            Tu n'as pas d'ordre de travail en cours ni en attente. Le chef d'atelier en assignera un nouveau bientôt.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-12 items-center gap-2 rounded-[10px] border-[1.5px] border-[var(--cockpit-line)] bg-transparent px-4.5 text-[14px] font-bold uppercase tracking-wide text-[var(--cockpit-text)]"
        >
          <RefreshCw className="h-4.5 w-4.5 stroke-[1.8]" aria-hidden />
          Rafraîchir
        </button>
      </div>

      <div className="flex items-center gap-2.5 border-t border-[var(--cockpit-line-soft)] bg-[var(--cockpit-surface-2)] px-4.5 py-3.5">
        <span
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{
            background: 'var(--cockpit-teal)',
            boxShadow: '0 0 0 4px var(--cockpit-teal-soft)',
          }}
        />
        <span className="text-[12px] font-semibold text-[var(--cockpit-text-2)]">Synchronisé · file vide</span>
      </div>
    </div>
  );
}
