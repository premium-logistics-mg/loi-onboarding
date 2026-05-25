import type { Intervention } from '../_types';
import { ShapeGlyph } from './StatusBadge';

export function StatusCounters({ list }: { list: Intervention[] }) {
  const cours = list.filter((j) => j.status === 'cours').length;
  const attente = list.filter((j) => j.status === 'attente').length;
  const bloque = list.filter((j) => j.status === 'bloque').length;

  const cells = [
    { label: 'En cours',   value: cours,   color: 'var(--cockpit-teal)',          shape: 'dot' as const },
    { label: 'En attente', value: attente, color: 'var(--cockpit-status-orange)', shape: 'tri' as const },
    { label: 'Bloqué',     value: bloque,  color: 'var(--cockpit-status-orange)', shape: 'sq'  as const },
  ];

  return (
    <div className="flex gap-2 px-3.5">
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex min-w-0 flex-1 flex-col gap-1 rounded-[10px] border border-[var(--cockpit-line)] bg-[var(--cockpit-surface)] px-2.5 py-2"
        >
          <div className="flex items-center gap-1.5">
            <ShapeGlyph shape={c.shape} color={c.color} size={9} />
            <span className="text-[9px] font-extrabold uppercase tracking-[1.1px] text-[var(--cockpit-text-3)]">
              {c.label}
            </span>
          </div>
          <span className="font-mono text-[24px] font-bold leading-none tabular-nums" style={{ color: c.color }}>
            {String(c.value).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  );
}
