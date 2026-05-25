'use client';

import type { JobNote } from '../../_types';

export function NotesSection({ notes }: { notes: JobNote[] }) {
  return (
    <div className="flex flex-col gap-2">
      {notes.length === 0 ? (
        <textarea
          rows={4}
          placeholder="Texte libre — pour le prochain méca…"
          defaultValue={`Demander à passer un coup de souffleur sur l'étrier avant remontage —
poussière de plaquettes très présente côté int. Penser à reposer le capteur
d'usure dans le bon sens.`}
          className="block min-h-28 w-full rounded-[10px] border-[1.5px] bg-[var(--cockpit-surface-2)] px-3 py-2.5 text-[14px] font-medium leading-relaxed text-[var(--cockpit-text)]"
          style={{ borderColor: 'var(--cockpit-line)' }}
        />
      ) : (
        notes.map((n) => (
          <div
            key={n.id}
            className="rounded-[10px] border-[1.5px] bg-[var(--cockpit-surface-2)] px-3 py-2.5"
            style={{ borderColor: n.isBlocker ? 'var(--cockpit-status-orange)' : 'var(--cockpit-line)' }}
          >
            <p className="text-[14px] font-medium leading-relaxed text-[var(--cockpit-text)]">{n.content}</p>
            <p className="mt-1.5 font-mono text-[11px] tabular-nums text-[var(--cockpit-text-3)]">
              {new Date(n.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
              {n.isBlocker && <span className="ml-2 font-bold text-[var(--cockpit-status-orange)]">Blocker</span>}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
