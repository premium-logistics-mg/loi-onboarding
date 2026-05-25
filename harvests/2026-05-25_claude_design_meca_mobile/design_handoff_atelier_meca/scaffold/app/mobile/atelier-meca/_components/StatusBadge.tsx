import type { JobStatus } from '../_types';

const CFG: Record<JobStatus, { color: string; soft: string; label: string; shape: 'dot' | 'tri' | 'sq' | 'check' }> = {
  cours:   { color: 'var(--cockpit-teal)',           soft: 'var(--cockpit-teal-soft)',          label: 'En cours',   shape: 'dot' },
  attente: { color: 'var(--cockpit-status-orange)',  soft: 'var(--cockpit-status-orange-soft)', label: 'En attente', shape: 'tri' },
  bloque:  { color: 'var(--cockpit-status-orange)',  soft: 'var(--cockpit-status-orange-soft)', label: 'Bloqué',     shape: 'sq' },
  termine: { color: 'var(--cockpit-status-green)',   soft: 'rgba(45,134,89,0.20)',              label: 'Terminé',    shape: 'check' },
};

export function StatusBadge({ kind, size = 'lg' }: { kind: JobStatus; size?: 'lg' | 'sm' }) {
  const c = CFG[kind];
  const big = size === 'lg';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border font-extrabold uppercase tracking-[1.2px] whitespace-nowrap ${
        big ? 'px-2.5 py-1 text-[11px]' : 'px-1.5 py-0.5 text-[9px]'
      }`}
      style={{ color: c.color, background: c.soft, borderColor: c.color }}
    >
      <ShapeGlyph shape={c.shape} color={c.color} size={big ? 11 : 9} />
      {c.label}
    </span>
  );
}

export function ShapeGlyph({ shape, color, size = 10 }: { shape: 'dot' | 'tri' | 'sq' | 'check'; color: string; size?: number }) {
  switch (shape) {
    case 'dot':   return <span style={{ width: size, height: size, background: color, borderRadius: '50%' }} />;
    case 'sq':    return <span style={{ width: size, height: size, background: color }} />;
    case 'tri':
      return (
        <svg width={size + 2} height={size} viewBox="0 0 12 11" aria-hidden>
          <path d="M6 0.5l5.5 9.5h-11L6 0.5z" fill={color} />
        </svg>
      );
    case 'check':
      return (
        <svg width={size + 2} height={size + 2} viewBox="0 0 14 14" aria-hidden>
          <path d="M2 7.5l3.5 3.5L12 4" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
  }
}
