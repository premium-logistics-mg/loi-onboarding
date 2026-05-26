/* LOI · Indicator kit — reusable Visual-First primitives.
   - MetricCardHero · PillarGauge · TargetBullet · ConcentrationGauge
   - TrajectorySparkline · CompositeScoreChip
   Tokens come from tokens.css. SVG only, no emoji. */

// ── line icons (stroke-only) ────────────────────────────────────────────
const Icon = {
  Cockpit: () => <svg className="icn" viewBox="0 0 24 24"><path d="M3 12h4l2-3 4 6 2-4h6"/></svg>,
  Spark:   () => <svg className="icn" viewBox="0 0 24 24"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2 8 12.7 4 8.8 9.5 8z"/></svg>,
  Award:   () => <svg className="icn" viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="M8 14l-2 7 6-3 6 3-2-7"/></svg>,
  Book:    () => <svg className="icn" viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h14v18H6a2 2 0 01-2-2zM8 3v18"/></svg>,
  Bell:    () => <svg className="icn" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 004 0"/></svg>,
  Search:  () => <svg className="icn" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  Sun:     () => <svg className="icn" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>,
  Moon:    () => <svg className="icn" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1110 4a7 7 0 0010 10.5z"/></svg>,
  Chev:    () => <svg className="icn" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>,
  AlertTri:() => <svg className="icn" viewBox="0 0 24 24"><path d="M12 4l10 17H2zM12 10v5M12 18.5v.01"/></svg>,
  ArrowUp: () => <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 10V2M2 5l4-3 4 3"/></svg>,
  ArrowDn: () => <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v8M2 7l4 3 4-3"/></svg>,
  Flag:    () => <svg className="icn" viewBox="0 0 24 24"><path d="M5 21V4h11l-2 4 2 4H5"/></svg>,
  User:    () => <svg className="icn" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>,
  Folder:  () => <svg className="icn" viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  Check:   () => <svg className="icn" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg>,
  Eye:     () => <svg className="icn" viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
  X:       () => <svg className="icn" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  Arrow:   () => <svg className="icn" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  Filter:  () => <svg className="icn" viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4-2v-4z"/></svg>,
  Send:    () => <svg className="icn" viewBox="0 0 24 24"><path d="M3 12L21 3l-4 18-5-7z"/></svg>,
  Escalate:() => <svg className="icn" viewBox="0 0 24 24"><path d="M12 21V5M6 11l6-6 6 6"/></svg>,
};

// ── helpers ─────────────────────────────────────────────────────────────
function formatMGA(n, { unit = 'Md MGA', digits = 2, signed = false } = {}) {
  const s = (Math.abs(n)).toLocaleString('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const sign = n < 0 ? '−' : (signed ? '+' : '');
  return { num: sign + s, unit };
}

// ── Sparkline (low-level SVG path) ──────────────────────────────────────
function Sparkline({ values, forecast = [], width = 240, height = 56, color = 'var(--teal)', target, padBottom = 6 }) {
  const all = [...values, ...forecast, ...(target != null ? [target] : [])];
  const min = Math.min(...all), max = Math.max(...all);
  const span = Math.max(max - min, 1e-6);
  const totalPts = values.length + forecast.length;
  const xStep = (width - 4) / (totalPts - 1);
  const y = v => height - padBottom - ((v - min) / span) * (height - padBottom - 6);
  const x = i => 2 + i * xStep;

  const realPath = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const fcStartIdx = values.length - 1;
  const fcPath = forecast.length
    ? `M${x(fcStartIdx)},${y(values[values.length - 1])} ` +
      forecast.map((v, i) => `L${x(fcStartIdx + 1 + i)},${y(v)}`).join(' ')
    : '';

  // area
  const areaPath = realPath + ` L${x(values.length - 1)},${height} L${x(0)},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`spk-grad-${color.replace(/[^a-z]/gi,'')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {target != null && (
        <line x1="0" x2={width} y1={y(target)} y2={y(target)} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3"/>
      )}
      <path d={areaPath} fill={`url(#spk-grad-${color.replace(/[^a-z]/gi,'')})`}/>
      <path d={realPath} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {fcPath && <path d={fcPath} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 3" opacity="0.7"/>}
      {/* last point dot */}
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r="2.5" fill={color}/>
    </svg>
  );
}

// ── MetricCardHero ──────────────────────────────────────────────────────
function MetricCardHero({ label, value, unit, series, delta, target, targetLabel, footnote, accent = 'var(--teal)' }) {
  const isUp = delta && delta.dir === 'up';
  const isDn = delta && delta.dir === 'down';
  return (
    <div className="hero">
      <div className="hero-left">
        <div className="hero-label">{label}</div>
        <div className="mono hero-num">
          {value}<span className="hero-unit">{unit}</span>
        </div>
        <div className="hero-sub">
          {delta && (
            <span className={`delta ${isUp ? 'up' : isDn ? 'down' : 'flat'}`}>
              {isUp ? <Icon.ArrowUp/> : isDn ? <Icon.ArrowDn/> : null}
              <span className="mono">{delta.text}</span>
            </span>
          )}
          {footnote && <span>{footnote}</span>}
        </div>
        <div style={{ marginTop: 16 }}>
          <Sparkline values={series} forecast={[]} width={420} height={64} color={accent} target={target}/>
          {targetLabel && <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{targetLabel}</div>}
        </div>
      </div>
      <div className="hero-right">
        {/* slot — alert/breakdown injected by parent via children pattern in v2 */}
      </div>
    </div>
  );
}

// ── PillarGauge ─────────────────────────────────────────────────────────
function PillarGauge({ code, name, score, max = 100, status = 'ok' }) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  const color = status === 'alert' ? 'var(--alert)' : status === 'warn' ? 'var(--warn)' : status === 'ok' ? 'var(--ok)' : 'var(--teal)';
  // 24 ticks
  const ticks = 28;
  const filled = Math.round((pct / 100) * ticks);
  return (
    <div className="pillar">
      <div className="pillar-head">
        <div>
          <div className="pillar-code">{code}</div>
          <div className="pillar-name">{name}</div>
        </div>
        <StatusGlyph status={status}/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {Array.from({ length: ticks }).map((_, i) => (
            <span key={i} style={{
              flex: 1, height: 14,
              background: i < filled ? color : 'var(--card-2)',
              opacity: i < filled ? 1 : 1,
              borderRadius: 1
            }}/>
          ))}
        </div>
      </div>
      <div className="pillar-status">
        <StatusDot status={status}/>
        <span>{status === 'ok' ? 'Sur la trajectoire' : status === 'warn' ? 'Tension surveillée' : status === 'alert' ? 'Hors trajectoire' : '—'}</span>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const color = status === 'alert' ? 'var(--alert)' : status === 'warn' ? 'var(--warn)' : 'var(--ok)';
  return <span style={{ width: 6, height: 6, borderRadius: 50, background: color, display: 'inline-block' }}/>;
}

function StatusGlyph({ status }) {
  // shape + color = double encoding
  if (status === 'alert') {
    return <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1l6 11H1z" fill="var(--alert)"/></svg>;
  }
  if (status === 'warn') {
    return <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" fill="var(--warn)"/></svg>;
  }
  return <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5" fill="var(--ok)"/></svg>;
}

// ── TargetBullet ────────────────────────────────────────────────────────
function TargetBullet({ actual, target, min, max, unit = '', invert = false, height = 22, label }) {
  // invert=true means lower is better (e.g. DSO)
  const lo = min ?? Math.min(actual, target) * 0.6;
  const hi = max ?? Math.max(actual, target) * 1.25;
  const span = hi - lo;
  const aPct = ((actual - lo) / span) * 100;
  const tPct = ((target - lo) / span) * 100;
  const onTarget = invert ? actual <= target : actual >= target;
  const color = onTarget ? 'var(--ok)' : 'var(--alert)';

  // zone : du début/fin jusqu'à la cible = "à atteindre"
  const goodFrom = invert ? 0 : tPct;
  const goodTo = invert ? tPct : 100;
  return (
    <div>
      {label && <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span className="mono" style={{ color: 'var(--ink-2)' }}>cible {target}{unit}</span>
      </div>}
      <div style={{ position: 'relative', height, background: 'var(--card-2)', borderRadius: 3 }}>
        <div style={{
          position: 'absolute', left: `${goodFrom}%`, width: `${goodTo - goodFrom}%`,
          top: 0, bottom: 0, background: 'var(--ok-soft)', borderRadius: 3
        }}/>
        {/* actual bar */}
        <div style={{
          position: 'absolute', left: 0, top: 4, bottom: 4,
          width: `${aPct}%`, background: color, borderRadius: 2
        }}/>
        {/* target marker */}
        <div style={{
          position: 'absolute', left: `${tPct}%`, top: -3, bottom: -3,
          width: 2, background: 'var(--ink)', borderRadius: 1
        }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11.5 }}>
        <span className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{actual}{unit}</span>
        <span style={{ color: onTarget ? 'var(--ok)' : 'var(--alert)' }}>
          {onTarget ? 'à cible' : `écart ${invert ? '+' : '−'}${Math.abs(actual - target)}${unit}`}
        </span>
      </div>
    </div>
  );
}

// ── ConcentrationGauge (semi-circle) ────────────────────────────────────
function ConcentrationGauge({ actual, ceiling, label, sublabel, unit = '%' }) {
  // arc from -90° to +90°, 180° span
  const r = 52, cx = 64, cy = 64;
  const startA = -180, endA = 0;
  const toRad = a => (a * Math.PI) / 180;
  const arcPath = (a0, a1) => {
    const x0 = cx + r * Math.cos(toRad(a0));
    const y0 = cy + r * Math.sin(toRad(a0));
    const x1 = cx + r * Math.cos(toRad(a1));
    const y1 = cy + r * Math.sin(toRad(a1));
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1}`;
  };
  const pctActual = Math.min(actual / (ceiling * 1.6), 1); // scale so ceiling sits around 62%
  const pctCeil = ceiling / (ceiling * 1.6);
  const angActual = startA + (endA - startA) * pctActual;
  const angCeil = startA + (endA - startA) * pctCeil;
  const over = actual > ceiling;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width="128" height="72" viewBox="0 0 128 72">
        <path d={arcPath(startA, endA)} stroke="var(--card-2)" strokeWidth="10" fill="none" strokeLinecap="butt"/>
        <path d={arcPath(startA, angCeil)} stroke="var(--ok-soft)" strokeWidth="10" fill="none"/>
        <path d={arcPath(startA, angActual)} stroke={over ? 'var(--alert)' : 'var(--ok)'} strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* ceiling tick */}
        <line
          x1={cx + (r - 8) * Math.cos(toRad(angCeil))} y1={cy + (r - 8) * Math.sin(toRad(angCeil))}
          x2={cx + (r + 8) * Math.cos(toRad(angCeil))} y2={cy + (r + 8) * Math.sin(toRad(angCeil))}
          stroke="var(--ink)" strokeWidth="1.5"
        />
      </svg>
      <div className="mono" style={{ fontSize: 22, fontWeight: 500, marginTop: -8, color: over ? 'var(--alert)' : 'var(--ink)' }}>
        {actual.toFixed(1)}{unit}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>plafond {ceiling}{unit}</div>
    </div>
  );
}

// ── TrajectorySparkline (with forecast + target) ────────────────────────
function TrajectorySparkline(props) {
  return <Sparkline {...props}/>;
}

// ── CompositeScoreChip ──────────────────────────────────────────────────
function CompositeScoreChip({ name, role, score, max = 100, status = 'ok', trend }) {
  return (
    <div className="lt-chip">
      <div className="lt-glyph">
        <StatusGlyph status={status}/>
      </div>
      <div>
        <div className="lt-name">{name}</div>
        <div className="lt-role">{role}</div>
      </div>
      <div className="mono lt-score" style={{
        color: status === 'alert' ? 'var(--alert)' : status === 'warn' ? 'var(--warn)' : 'var(--ok)',
        fontWeight: 500
      }}>
        {score}<span style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 2 }}>/{max}</span>
        {trend && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--ink-3)' }}>{trend}</span>}
      </div>
    </div>
  );
}

// ── Mini gauge (used in SO·3 — three indicators) ────────────────────────
function MiniGauge({ label, value, target, unit = '%' }) {
  const pct = Math.min(value, 100);
  const tPct = Math.min(target, 100);
  const ok = value >= target;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span>{label}</span>
        <span className="mono" style={{ color: 'var(--ink-2)' }}>›{target}{unit}</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'var(--card-2)', borderRadius: 2 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: ok ? 'var(--ok)' : 'var(--warn)', borderRadius: 2 }}/>
        <div style={{ position: 'absolute', left: `${tPct}%`, top: -2, bottom: -2, width: 1.5, background: 'var(--ink)' }}/>
      </div>
      <div className="mono" style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{value}{unit}</div>
    </div>
  );
}

// ── MetricHeroCompact (single-column, used in sous-SO grid) ─────────────
// chiffre mono + sparkline + bullet vs-cible. The Tudi anchor card.
function MetricHeroCompact({
  label, sublabel, value, unit,
  series, accent,
  target, targetUnit, invert = false,
  status = 'ok',
  vsLabel,
}) {
  const color = accent || (status === 'alert' ? 'var(--alert)' : status === 'warn' ? 'var(--warn)' : 'var(--ok)');
  return (
    <div className="card metric-compact">
      <div className="mc-head">
        <div>
          <div className="mc-label">{label}</div>
          {sublabel && <div className="mc-sublabel">{sublabel}</div>}
        </div>
        <StatusGlyph status={status}/>
      </div>

      <div>
        <div className="mono mc-num" style={{ color }}>
          {value}<span className="mc-unit">{unit}</span>
        </div>
        {vsLabel && (
          <div className="mc-sub" style={{ marginTop: 6 }}>
            <span className="mono" style={{ color: 'var(--ink-3)' }}>{vsLabel}</span>
          </div>
        )}
      </div>

      <div className="mc-spacer"/>

      <div>
        <TargetBullet
          actual={typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value}
          target={target}
          unit={targetUnit || unit}
          invert={invert}
        />
      </div>

      <div style={{ marginTop: 2 }}>
        <Sparkline values={series} width={280} height={36} color={color}/>
      </div>
    </div>
  );
}

// ── AggregateTile (big number → click → popup) ──────────────────────────
function AggregateTile({ label, value, unit, breakdown, cta, onClick, footnote }) {
  return (
    <div className="agg-tile" onClick={onClick} role="button" tabIndex={0}
         onKeyDown={(e) => { if (e.key === 'Enter') onClick && onClick(); }}>
      <div className="agg-left">
        <div className="hero-label">{label}</div>
        <div className="mono agg-num">{value}<span style={{ fontSize: 18, color: 'var(--ink-2)', marginLeft: 8 }}>{unit}</span></div>
        {footnote && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{footnote}</div>}
        <div className="agg-cta">
          <span>{cta || 'Voir la situation actuelle'}</span>
          <Icon.Arrow/>
        </div>
      </div>
      <div className="agg-right">
        {breakdown && breakdown.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={`mode-chip ${b.mode}`}>Mode {b.mode}</span>
            <div className="mode-line">
              <span className="mono">{b.count}</span>
              <span style={{ color: 'var(--ink-3)' }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{b.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WorklistRow (action row · Valider/Voir) ─────────────────────────────
function WorklistRow({ status, object, objectSub, subject, meta, actionLabel, actionKind, onAction }) {
  return (
    <div className="wl-row">
      <div className="wl-glyph"><StatusGlyph status={status}/></div>
      <div>
        <div className="wl-object">{object}</div>
        {objectSub && <div className="wl-object-sub">{objectSub}</div>}
      </div>
      <div className="wl-subject">{subject}</div>
      <div className="wl-meta">{meta}</div>
      <div className="wl-action">
        <button className={`btn ${actionKind === 'primary' ? 'primary' : 'ghost'}`} onClick={onAction}>
          {actionKind === 'primary' ? <Icon.Check/> : <Icon.Eye/>}
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

// Export to window for cross-script access
Object.assign(window, {
  Icon, Sparkline, MetricCardHero, MetricHeroCompact, PillarGauge, TargetBullet,
  ConcentrationGauge, TrajectorySparkline, CompositeScoreChip,
  AggregateTile, WorklistRow,
  StatusGlyph, StatusDot, MiniGauge, formatMGA
});
