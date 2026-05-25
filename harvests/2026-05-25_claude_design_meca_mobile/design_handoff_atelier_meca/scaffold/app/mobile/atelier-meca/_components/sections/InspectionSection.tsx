import type { InspectionItem, InspectionStatus } from '../../_types';

const ST: Record<InspectionStatus, { color: string; shape: 'dot' | 'tri' | 'sq' | 'rh'; label: string }> = {
  ok:       { color: 'var(--cockpit-teal)',          shape: 'dot', label: 'OK' },
  alerte:   { color: 'var(--cockpit-status-orange)', shape: 'tri', label: 'Alerte' },
  critique: { color: 'var(--cockpit-status-red)',    shape: 'sq',  label: 'Critique' },
  nonverif: { color: '#5B7398',                      shape: 'rh',  label: 'Non vérifié' },
};

// Items par défaut — réécrire pour SCHACMAN/Kerax côté master dataset.
// À CONFIRMER avec LOI : liste exacte par type d'intervention.
const DEFAULT_ITEMS: InspectionItem[] = [
  { id: '1', group: 'Vehicule', label: 'Disque frein arrière · usure',  status: 'critique' },
  { id: '2', group: 'Vehicule', label: 'Plaquette frein arrière · état', status: 'critique' },
  { id: '3', group: 'Vehicule', label: 'Niveau liquide de frein',        status: 'alerte' },
  { id: '4', group: 'Vehicule', label: 'Étrier · jeu + axes',            status: 'ok' },
  { id: '5', group: 'Vehicule', label: 'Flexible hydraulique',           status: 'ok' },
  { id: '6', group: 'Vehicule', label: 'Témoin tableau de bord',         status: 'nonverif' },
];

export function InspectionSection({ items }: { items: InspectionItem[] }) {
  const rows = items.length > 0 ? items : DEFAULT_ITEMS;
  return (
    <div className="flex flex-col gap-2">
      {/* Légende */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-dashed border-[var(--cockpit-line-soft)] pb-2">
        {(Object.keys(ST) as InspectionStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[var(--cockpit-text-3)]">
            <Glyph shape={ST[s].shape} color={ST[s].color} />
            {ST[s].label}
          </span>
        ))}
      </div>

      {rows.map((r, i) => (
        <div
          key={r.id}
          className="flex min-h-11 items-center gap-2.5 px-1 py-2.5"
          style={{ borderBottom: i === rows.length - 1 ? 0 : '1px solid var(--cockpit-line-soft)' }}
        >
          <span className="w-5.5 flex-shrink-0 font-mono text-[11px] font-bold tabular-nums text-[var(--cockpit-text-3)]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-bold leading-snug text-[var(--cockpit-text)]">{r.label}</div>
            <div
              className="mt-0.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[1.2px]"
              style={{ color: ST[r.status].color }}
            >
              <Glyph shape={ST[r.status].shape} color={ST[r.status].color} />
              {ST[r.status].label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Glyph({ shape, color, size = 9 }: { shape: 'dot' | 'tri' | 'sq' | 'rh'; color: string; size?: number }) {
  if (shape === 'dot') return <span className="rounded-full" style={{ width: size, height: size, background: color }} />;
  if (shape === 'sq')  return <span style={{ width: size, height: size, background: color }} />;
  if (shape === 'tri') return <svg width={size + 1} height={size} viewBox="0 0 10 9" aria-hidden><path d="M5 0.5l4.5 8h-9L5 0.5z" fill={color} /></svg>;
  return <svg width={size + 1} height={size + 1} viewBox="0 0 10 10" aria-hidden><path d="M5 0.5l4.5 4.5L5 9.5 0.5 5z" stroke={color} strokeWidth="1.6" fill="none" /></svg>;
}
