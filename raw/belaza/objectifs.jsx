/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

// ---- Shared data -----------------------------------------------
const OBJECTIVES = [
  {
    id: 1, so: "SO-1", owner: "KETSIAH", due: "31/12/26",
    title: "Encaissement accéléré & dette réduite",
    targetLabel: "DSO ≤ 60j",
    actualLabel: "68j",
    target: "60 j", actual: "68 j",
    pct: 22,
    status: "err", // bar end red
    deltaKind: "err",
  },
  {
    id: 2, so: "SO-2", owner: "TUDI", due: "31/08/26",
    title: "Cycle commande → facture maîtrisé",
    targetLabel: "Dossiers > 7j < 10",
    actualLabel: "14",
    target: "< 10", actual: "14",
    pct: 78,
    status: "ok",
    deltaKind: "warn",
  },
  {
    id: 3, so: "SO-3", owner: "JOEL", due: "31/12/26",
    title: "Flotte productive & rentable",
    targetLabel: "Utilisation 75 %",
    actualLabel: "71 %",
    target: "75 %", actual: "71 %",
    pct: 50,
    status: "warn",
    deltaKind: "warn",
  },
  {
    id: 4, so: "SO-4", owner: "KENNY", due: "31/12/26",
    title: "Portefeuille équilibré & diversifié",
    targetLabel: "Top client ≤ 25 % rolling 90j",
    actualLabel: "PENTA-OCEAN 28,5 %",
    target: "≤ 25 %", actual: "28,5 %",
    pct: 40,
    status: "err",
    deltaKind: "err",
  },
  {
    id: 5, so: "SO-5", owner: "KENNY", due: "30/09/26",
    title: "Décisions tracées & clôturées",
    targetLabel: "≥ 90 % leaders actifs hebdo",
    actualLabel: "85 %",
    target: "≥ 90 %", actual: "85 %",
    pct: 80,
    status: "ok",
    deltaKind: "warn",
  },
];

const STATUS_COLOR = {
  ok:   "var(--ok)",
  warn: "var(--warn)",
  err:  "var(--err)",
};

// Mini progress bar, single fill, status colored
function Bar({ pct, status = "ok", showTick = true }) {
  return (
    <div className="bar">
      <div className="fill" style={{ width: `${Math.max(2, Math.min(100, pct))}%`, background: STATUS_COLOR[status] }} />
      {showTick && <div className="tick" style={{ left: `100%`, transform: "translateX(-1px)" }} />}
    </div>
  );
}

function CardHead({ count = 5, title = "Objectifs du board" }) {
  return (
    <div className="card-head">
      <div className="t"><span className="num">{count}</span>&nbsp; {title}</div>
      <div className="actions">
        <button className="filter" aria-pressed="true">Tous</button>
        <button className="filter">À risque</button>
        <span className="i" style={{ width: 14, height: 14, borderRadius: 999, border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "var(--fg-3)" }}>i</span>
      </div>
    </div>
  );
}

function PageHead() {
  return (
    <div className="pl-label">
      <span>Pilotage PL</span>
      <span className="i">i</span>
    </div>
  );
}

// ============================================================
// Variant A — Slim row (60–72 px tall)
//   header row · title + inline cible/actuel · thin bar · %
// ============================================================
function VariantA() {
  return (
    <div className="frame">
      <PageHead />
      <div className="card">
        <CardHead />
        {OBJECTIVES.map((o, i) => (
          <div className="va-row edge" data-s={o.status} key={o.id}>
            <div className="meta">
              <span className="so-id">{o.so} · #{o.id}</span>
              <span className="owner">{o.owner}</span>
            </div>
            <div className="title-col">
              <div className="title">{o.title}</div>
              <div className="sub">
                <span>cible <b>{o.target}</b></span>
                <span className="sep">·</span>
                <span>actuel <b style={{ color: STATUS_COLOR[o.deltaKind] }}>{o.actual}</b></span>
                <span className="sep">·</span>
                <span>échéance {o.due}</span>
              </div>
            </div>
            <div /> {/* spacer */}
            <div className="right">
              <Bar pct={o.pct} status={o.status} />
            </div>
            <div style={{ justifySelf: "end" }}>
              <span className={`pct ${o.status}`}>{o.pct}<span className="u">%</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Variant B — Dense table
//   columns: # · Objectif · Pilote · Échéance · Cible · Actuel · Progression
// ============================================================
function VariantB() {
  return (
    <div className="frame">
      <PageHead />
      <div className="card">
        <CardHead />
        <table className="vb-table">
          <thead>
            <tr>
              <th style={{ width: 200 }}>Objectif</th>
              <th style={{ width: 80 }}>Pilote</th>
              <th style={{ width: 80 }}>Échéance</th>
              <th>Cible</th>
              <th>Actuel</th>
              <th style={{ width: 220 }}>Progression</th>
            </tr>
          </thead>
          <tbody>
            {OBJECTIVES.map((o) => (
              <tr key={o.id}>
                <td>
                  <div className="obj edge" data-s={o.status}>
                    <span className="id">{o.so} · #{o.id}</span>
                    <span className="name">{o.title}</span>
                  </div>
                </td>
                <td className="own-cell">{o.owner}</td>
                <td className="due-cell">{o.due}</td>
                <td><span className="nm">{o.target}</span></td>
                <td><span className={`nm delta-${o.deltaKind}`}>{o.actual}</span></td>
                <td className="progress-cell">
                  <div className="row">
                    <Bar pct={o.pct} status={o.status} />
                    <span className="pct-sm" style={{ color: STATUS_COLOR[o.status] }}>{o.pct} %</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// Variant C — 2-column compact tiles
//   keeps the richer 2-line layout but in a 2×3 grid
// ============================================================
function VariantC() {
  return (
    <div className="frame">
      <PageHead />
      <div className="card">
        <CardHead />
        <div className="vc-grid">
          {OBJECTIVES.map((o, i) => (
            <div className={`vc-cell edge ${i === OBJECTIVES.length - 1 ? "span-full" : ""}`} data-s={o.status} key={o.id}>
              <div className="head">
                <span className="so-id">{o.so} · #{o.id}</span>
                <span className="owner">· {o.owner}</span>
                <span className="due"><span className="due">{o.due}</span></span>
              </div>
              <span className={`pct ${o.status}`} style={{ alignSelf: "center" }}>{o.pct}<span className="u">%</span></span>
              <div className="title">{o.title}</div>
              <div className="sub">
                <span>cible <b>{o.target}</b></span>
                <span>actuel <b style={{ color: STATUS_COLOR[o.deltaKind] }}>{o.actual}</b></span>
              </div>
              <div className="bar"><div className="fill" style={{ width: `${o.pct}%`, background: STATUS_COLOR[o.status] }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Variant D — Bullet chart (Stephen Few)
//   single bar per objective with qualitative bands + target tick.
//   Shows GAP-to-target, not just %.
// ============================================================
// Bands are normalized 0–120 % space. Target is at 100 %, actual is positioned
// relative to the target along that scale.
function Bullet({ pctOfTarget, status }) {
  // pctOfTarget: 0..120 ; clamp for display
  const x = Math.max(0, Math.min(120, pctOfTarget));
  const pct = (v) => `${(v / 120) * 100}%`;
  const color = STATUS_COLOR[status];
  return (
    <div style={{ position: "relative", height: 14 }}>
      {/* qualitative bands */}
      <div style={{
        position: "absolute", inset: 0, display: "grid",
        gridTemplateColumns: "60% 25% 35%", borderRadius: 2, overflow: "hidden",
        background: "var(--surface-2)",
      }}>
        <div style={{ background: "color-mix(in srgb, var(--err) 8%, transparent)" }} />
        <div style={{ background: "color-mix(in srgb, var(--warn) 10%, transparent)" }} />
        <div style={{ background: "color-mix(in srgb, var(--ok) 10%, transparent)" }} />
      </div>
      {/* actual bar (thick) */}
      <div style={{
        position: "absolute", top: 4, bottom: 4, left: 0,
        width: pct(x), background: color, borderRadius: 1,
      }} />
      {/* target tick at 100 % */}
      <div style={{
        position: "absolute", top: -2, bottom: -2, left: pct(100),
        width: 2, background: "var(--fg-1)", borderRadius: 1,
      }} />
    </div>
  );
}

function VariantD() {
  // pctOfTarget derived from the stated actual vs target ratio (rough but readable)
  const rows = [
    { ...OBJECTIVES[0], pctOfTarget: 60 / 68 * 100 }, // DSO 68 vs ≤60 → 88
    { ...OBJECTIVES[1], pctOfTarget: 100 - (14 - 10) * 8 }, // 14 vs <10
    { ...OBJECTIVES[2], pctOfTarget: 71 / 75 * 100 },
    { ...OBJECTIVES[3], pctOfTarget: 25 / 28.5 * 100 },
    { ...OBJECTIVES[4], pctOfTarget: 85 / 90 * 100 },
  ];
  return (
    <div className="frame">
      <PageHead />
      <div className="card">
        <CardHead />
        <div style={{ padding: "4px 0" }}>
          {rows.map((o) => (
            <div key={o.id} style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr 280px 60px",
              alignItems: "center", gap: 20,
              padding: "14px 20px 14px 24px",
              borderTop: "1px solid var(--border)",
              position: "relative",
            }} className="edge" data-s={o.status}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {o.so} · {o.owner}
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500, marginTop: 4, lineHeight: 1.25 }}>
                  {o.title}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>
                cible <b style={{ color: "var(--fg-1)", fontWeight: 500 }}>{o.target}</b>
                <span style={{ margin: "0 8px", color: "var(--fg-mute)" }}>·</span>
                actuel <b style={{ color: STATUS_COLOR[o.deltaKind], fontWeight: 500 }}>{o.actual}</b>
              </div>
              <Bullet pctOfTarget={o.pctOfTarget} status={o.status} />
              <span className={`pct ${o.status}`} style={{ justifySelf: "end" }}>{o.pct}<span className="u">%</span></span>
            </div>
          ))}
        </div>
        {/* legend */}
        <div style={{
          display: "flex", gap: 16, padding: "10px 24px",
          borderTop: "1px solid var(--border)",
          fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--fg-3)",
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, background: "color-mix(in srgb, var(--err) 18%, transparent)" }} /> en retard
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, background: "color-mix(in srgb, var(--warn) 20%, transparent)" }} /> à surveiller
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, background: "color-mix(in srgb, var(--ok) 20%, transparent)" }} /> conforme
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <span style={{ width: 2, height: 12, background: "var(--fg-1)" }} /> cible
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Variant E — Donuts en bandeau
//   5 small radial gauges side by side. Header-strip format.
// ============================================================
function Donut({ pct, status, size = 56, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={STATUS_COLOR[status]} strokeWidth={stroke}
        strokeDasharray={`${dash} ${c}`}
        strokeDashoffset={c * 0.25}
        strokeLinecap="butt"
        transform={`rotate(-90 ${size / 2} ${size / 2}) scale(1 -1) translate(0 -${size})`} />
    </svg>
  );
}

function VariantE() {
  return (
    <div className="frame">
      <PageHead />
      <div className="card">
        <CardHead />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 1,
          background: "var(--border)",
        }}>
          {OBJECTIVES.map((o) => (
            <div key={o.id} style={{
              background: "var(--surface)",
              padding: "18px 16px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              position: "relative",
              minHeight: 180,
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                <span>{o.so}</span>
                <span>{o.owner}</span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ position: "relative" }}>
                  <Donut pct={o.pct} status={o.status} size={58} stroke={5} />
                  <span style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 500,
                    color: STATUS_COLOR[o.status],
                  }}>{o.pct}</span>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--fg-1)", fontWeight: 600, lineHeight: 1.25 }}>
                    {o.title}
                  </div>
                </div>
              </div>
              <div style={{
                display: "flex", flexDirection: "column", gap: 4,
                marginTop: "auto",
                fontFamily: "var(--font-mono)", fontSize: 11,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--fg-3)" }}>cible</span>
                  <span style={{ color: "var(--fg-1)" }}>{o.target}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--fg-3)" }}>actuel</span>
                  <span style={{ color: STATUS_COLOR[o.deltaKind] }}>{o.actual}</span>
                </div>
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
                paddingTop: 6, borderTop: "1px solid var(--border)",
              }}>
                échéance {o.due}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Variant F — Trajectoire
//   sparkline of the last 8 weeks per objective; trend > % itself.
// ============================================================
function Sparkline({ values, status, width = 180, height = 36 }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const color = STATUS_COLOR[status];
  const last = pts[pts.length - 1];
  // target reference: dashed horizontal line at the last value's target line — visual gap
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      {/* area */}
      <path d={`${d} L${width},${height} L0,${height} Z`}
        fill={color} opacity={0.10} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  );
}

// fabricate plausible 8-week trajectories ending at each objective's pct
const TRAJ = {
  1: [10, 12, 11, 15, 14, 18, 20, 22],
  2: [55, 58, 62, 66, 70, 74, 76, 78],
  3: [60, 58, 55, 56, 52, 50, 51, 50],
  4: [55, 52, 48, 46, 44, 42, 41, 40],
  5: [62, 65, 68, 72, 74, 76, 78, 80],
};

const TREND = {
  1: { dir: "up", pts: 12 },
  2: { dir: "up", pts: 23 },
  3: { dir: "down", pts: -10 },
  4: { dir: "down", pts: -15 },
  5: { dir: "up", pts: 18 },
};

function TrendArrow({ dir }) {
  return dir === "up"
    ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 7 L5 3 L8 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    : <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 3 L5 7 L8 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function VariantF() {
  return (
    <div className="frame">
      <PageHead />
      <div className="card">
        <CardHead />
        <div>
          {OBJECTIVES.map((o) => {
            const trend = TREND[o.id];
            const trendColor = trend.dir === "up" ? "var(--ok)" : "var(--err)";
            return (
              <div key={o.id} style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 200px 110px 60px",
                alignItems: "center", gap: 20,
                padding: "14px 20px 14px 24px",
                borderTop: "1px solid var(--border)",
                position: "relative",
              }} className="edge" data-s={o.status}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {o.so} · {o.owner}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500, marginTop: 4, lineHeight: 1.25 }}>
                    {o.title}
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>
                  cible <b style={{ color: "var(--fg-1)", fontWeight: 500 }}>{o.target}</b>
                  <span style={{ margin: "0 8px", color: "var(--fg-mute)" }}>·</span>
                  actuel <b style={{ color: STATUS_COLOR[o.deltaKind], fontWeight: 500 }}>{o.actual}</b>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkline values={TRAJ[o.id]} status={o.status} width={150} height={32} />
                  <span style={{
                    fontFamily: "var(--font-sans)", fontSize: 9, color: "var(--fg-3)",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>8 sem.</span>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  color: trendColor,
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
                  justifySelf: "end",
                }}>
                  <TrendArrow dir={trend.dir} />
                  {trend.pts > 0 ? "+" : ""}{trend.pts} pts
                </div>
                <span className={`pct ${o.status}`} style={{ justifySelf: "end" }}>{o.pct}<span className="u">%</span></span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Donut form studies — five different radial vocabularies
// ============================================================

// --- shared 5-up tile shell ---
function DonutTile({ o, children, footer }) {
  return (
    <div style={{
      background: "var(--surface)",
      padding: "16px 14px",
      display: "flex", flexDirection: "column",
      gap: 8, minHeight: 180,
      position: "relative",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
        textTransform: "uppercase", letterSpacing: "0.04em",
      }}>
        <span>{o.so}</span>
        <span>{o.owner}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
        {children}
      </div>
      <div style={{
        fontSize: 12, color: "var(--fg-1)", fontWeight: 600,
        lineHeight: 1.25, textAlign: "center", minHeight: 30,
      }}>{o.title}</div>
      {footer || (
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          color: "var(--fg-3)", textAlign: "center",
          marginTop: "auto", paddingTop: 6,
          borderTop: "1px solid var(--border)",
        }}>
          <span>cible {o.target}</span>
          <span style={{ margin: "0 6px", color: "var(--fg-mute)" }}>·</span>
          <span style={{ color: STATUS_COLOR[o.deltaKind] }}>{o.actual}</span>
        </div>
      )}
    </div>
  );
}

function DonutSection({ title, subtitle, children, count = 5 }) {
  return (
    <div className="frame">
      <PageHead />
      <div className="card">
        <div className="card-head">
          <div className="t"><span className="num">{count}</span>&nbsp; Objectifs du board</div>
          <div className="actions" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--fg-3)" }}>
            <span style={{ fontStyle: "italic" }}>{subtitle}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// E2 — Demi-gauge (speedometer)
// ============================================================
function HalfGauge({ pct, status, size = 100, stroke = 8 }) {
  // Semi-circle 180° opening at bottom, fill clockwise from left.
  const w = size, h = size / 2 + stroke;
  const r = (size - stroke) / 2;
  const cx = w / 2, cy = size / 2;
  const c = Math.PI * r; // half circumference
  const dash = (pct / 100) * c;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${w - stroke / 2} ${cy}`}
        fill="none" stroke="var(--surface-2)" strokeWidth={stroke} strokeLinecap="butt" />
      <path
        d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${w - stroke / 2} ${cy}`}
        fill="none" stroke={STATUS_COLOR[status]} strokeWidth={stroke}
        strokeLinecap="butt"
        strokeDasharray={`${dash} ${c}`} />
    </svg>
  );
}

function VariantE2() {
  return (
    <DonutSection subtitle="Demi-gauge — speedometer 180°">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "var(--border)" }}>
        {OBJECTIVES.map((o) => (
          <DonutTile key={o.id} o={o}>
            <div style={{ position: "relative", width: 110 }}>
              <HalfGauge pct={o.pct} status={o.status} size={110} stroke={9} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 4,
                textAlign: "center",
                fontFamily: "var(--font-mono)", fontWeight: 500,
                fontSize: 22, color: STATUS_COLOR[o.status],
                lineHeight: 1,
              }}>{o.pct}<span style={{ fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-sans)", marginLeft: 1 }}>%</span></div>
            </div>
          </DonutTile>
        ))}
      </div>
    </DonutSection>
  );
}

// ============================================================
// E3 — Anneaux concentriques (Apple Watch style — single composite)
// ============================================================
function ConcentricRings({ items, size = 220, stroke = 13, gap = 3 }) {
  // outermost = item[0], innermost = item[N-1]
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {items.map((it, i) => {
        const r = (size - stroke) / 2 - i * (stroke + gap);
        if (r <= stroke / 2) return null;
        const c = 2 * Math.PI * r;
        const dash = (it.pct / 100) * c;
        return (
          <g key={it.id}>
            <circle cx={cx} cy={cy} r={r}
              fill="none" stroke="color-mix(in srgb, var(--border) 100%, transparent)" strokeWidth={stroke} />
            <circle cx={cx} cy={cy} r={r}
              fill="none" stroke={STATUS_COLOR[it.status]} strokeWidth={stroke}
              strokeDasharray={`${dash} ${c}`}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`} />
          </g>
        );
      })}
    </svg>
  );
}

function VariantE3() {
  return (
    <DonutSection subtitle="Anneaux concentriques — un seul composite">
      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: 32,
        padding: "28px 32px",
      }}>
        {/* composite chart */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ConcentricRings items={OBJECTIVES} size={240} stroke={14} gap={3} />
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>extérieur → SO-1 · intérieur → SO-5</div>
        </div>
        {/* legend / list */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
          {OBJECTIVES.map((o) => (
            <div key={o.id} style={{
              display: "grid",
              gridTemplateColumns: "14px 40px 1fr auto",
              alignItems: "center",
              gap: 12,
              padding: "8px 0",
              borderTop: "1px solid var(--border)",
            }}>
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: 2,
                background: STATUS_COLOR[o.status],
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>{o.so}</span>
              <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>{o.title}</div>
              <span className={`pct ${o.status}`} style={{ fontSize: 16 }}>{o.pct}<span className="u">%</span></span>
            </div>
          ))}
        </div>
      </div>
    </DonutSection>
  );
}

// ============================================================
// E4 — Anneau segmenté (deciles)
// ============================================================
function SegmentedDonut({ pct, status, size = 92, stroke = 8, segs = 10, gap = 3 }) {
  const cx = size / 2, cy = size / 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = Math.round((pct / 100) * segs);
  const segLen = (c - segs * gap) / segs;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: segs }).map((_, i) => {
        const offset = -i * (segLen + gap);
        const active = i < filled;
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none"
            stroke={active ? STATUS_COLOR[status] : "var(--surface-2)"}
            strokeWidth={stroke}
            strokeDasharray={`${segLen} ${c - segLen}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
    </svg>
  );
}

function VariantE4() {
  return (
    <DonutSection subtitle="Anneau segmenté — deciles">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "var(--border)" }}>
        {OBJECTIVES.map((o) => (
          <DonutTile key={o.id} o={o}>
            <div style={{ position: "relative", width: 92, height: 92 }}>
              <SegmentedDonut pct={o.pct} status={o.status} size={92} stroke={8} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontWeight: 500,
                  fontSize: 22, color: STATUS_COLOR[o.status], lineHeight: 1,
                }}>{o.pct}</span>
                <span style={{ fontSize: 9, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>%</span>
              </div>
            </div>
          </DonutTile>
        ))}
      </div>
    </DonutSection>
  );
}

// ============================================================
// E5 — Anneau pointillé (12-dot clock)
// ============================================================
function DotRing({ pct, status, size = 92, dots = 12, dotR = 3.5 }) {
  const cx = size / 2, cy = size / 2;
  const r = (size - dotR * 2 - 4) / 2;
  const filled = Math.round((pct / 100) * dots);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: dots }).map((_, i) => {
        const angle = (i / dots) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const active = i < filled;
        return (
          <circle key={i} cx={x} cy={y} r={dotR}
            fill={active ? STATUS_COLOR[status] : "var(--surface-2)"}
            stroke={active ? "none" : "var(--border)"}
            strokeWidth={1} />
        );
      })}
    </svg>
  );
}

function VariantE5() {
  return (
    <DonutSection subtitle="Anneau pointillé — 12 dots, clock-face">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "var(--border)" }}>
        {OBJECTIVES.map((o) => (
          <DonutTile key={o.id} o={o}>
            <div style={{ position: "relative", width: 92, height: 92 }}>
              <DotRing pct={o.pct} status={o.status} size={92} dots={12} dotR={4} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontWeight: 500,
                  fontSize: 20, color: STATUS_COLOR[o.status], lineHeight: 1,
                }}>{o.pct}<span style={{ fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-sans)" }}>%</span></span>
              </div>
            </div>
          </DonutTile>
        ))}
      </div>
    </DonutSection>
  );
}

// ============================================================
// E6 — Cible + actuel (twin arc; gap visualized)
// ============================================================
// Outer thin "cible" arc traces 100 % faintly. Inner thicker arc shows actuel.
// When actuel = cible, the inner arc completes the same angle.
function TwinArc({ pct, status, size = 96 }) {
  const cx = size / 2, cy = size / 2;
  // outer ring (target reference)
  const Ro = (size - 6) / 2;
  // inner ring (actual)
  const Ri = Ro - 9;
  const Co = 2 * Math.PI * Ro;
  const Ci = 2 * Math.PI * Ri;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* outer cible reference — full ring, hairline */}
      <circle cx={cx} cy={cy} r={Ro}
        fill="none" stroke="var(--fg-3)"
        strokeWidth={1} opacity="0.35" strokeDasharray="3 3" />
      {/* inner backing */}
      <circle cx={cx} cy={cy} r={Ri}
        fill="none" stroke="var(--surface-2)" strokeWidth={7} />
      {/* inner actual */}
      <circle cx={cx} cy={cy} r={Ri}
        fill="none" stroke={STATUS_COLOR[status]} strokeWidth={7}
        strokeDasharray={`${(pct / 100) * Ci} ${Ci}`}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`} />
      {/* cible tick — at top of outer ring */}
      <line x1={cx} y1={3} x2={cx} y2={9}
        stroke="var(--fg-1)" strokeWidth={1.5} />
    </svg>
  );
}

function VariantE6() {
  return (
    <DonutSection subtitle="Cible (extérieur pointillé) + actuel (intérieur)">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "var(--border)" }}>
        {OBJECTIVES.map((o) => (
          <DonutTile key={o.id} o={o}>
            <div style={{ position: "relative", width: 96, height: 96 }}>
              <TwinArc pct={o.pct} status={o.status} size={96} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontWeight: 500,
                  fontSize: 19, color: STATUS_COLOR[o.status], lineHeight: 1,
                }}>{o.pct}<span style={{ fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-sans)" }}>%</span></span>
              </div>
            </div>
          </DonutTile>
        ))}
      </div>
    </DonutSection>
  );
}

// ============================================================
// Canvas
// ============================================================
function App() {
  return (
    <DesignCanvas
      title="Objectifs du board — revisions"
      subtitle="Same data, lighter weight. 3 directions."
    >
      <DCSection
        id="revisions"
        title="Objectifs du board"
        subtitle="The original block fits ~700 px tall. These rebuild it under 360 px while keeping cible / actuel / progression."
      >
        <DCArtboard id="a" label="A · Ligne fine" width={1180} height={420}>
          <VariantA />
        </DCArtboard>
        <DCArtboard id="b" label="B · Table dense" width={1180} height={420}>
          <VariantB />
        </DCArtboard>
        <DCArtboard id="c" label="C · Tuiles 2 colonnes" width={1180} height={520}>
          <VariantC />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="measures"
        title="Autres mesures visuelles"
        subtitle="Different progress vocabularies: bullet (gap-to-target), radial (header strip), sparkline (trajectory)."
      >
        <DCArtboard id="d" label="D · Bullet chart" width={1180} height={460}>
          <VariantD />
        </DCArtboard>
        <DCArtboard id="e" label="E · Donuts en bandeau" width={1180} height={300}>
          <VariantE />
        </DCArtboard>
        <DCArtboard id="f" label="F · Trajectoire (sparkline)" width={1180} height={460}>
          <VariantF />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="donut-forms"
        title="Donuts — formes alternatives"
        subtitle="Same data, different radial vocabulary."
      >
        <DCArtboard id="e2" label="E2 · Demi-gauge" width={1180} height={340}>
          <VariantE2 />
        </DCArtboard>
        <DCArtboard id="e3" label="E3 · Anneaux concentriques" width={1180} height={440}>
          <VariantE3 />
        </DCArtboard>
        <DCArtboard id="e4" label="E4 · Anneau segmenté (deciles)" width={1180} height={340}>
          <VariantE4 />
        </DCArtboard>
        <DCArtboard id="e5" label="E5 · Anneau pointillé" width={1180} height={340}>
          <VariantE5 />
        </DCArtboard>
        <DCArtboard id="e6" label="E6 · Cible + actuel (twin arc)" width={1180} height={340}>
          <VariantE6 />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="service-client"
        title="Service client — refonte"
        subtitle="Original casse au top (z-index) et duplique les KPI. Trois directions plus claires."
      >
        <DCArtboard id="cs-a" label="CS-A · Pulse (hero + funnel)" width={1240} height={740}>
          <CSVariantA />
        </DCArtboard>
        <DCArtboard id="cs-b" label="CS-B · Triage (urgent en tête)" width={1240} height={660}>
          <CSVariantB />
        </DCArtboard>
        <DCArtboard id="cs-c" label="CS-C · Health-strip" width={1240} height={620}>
          <CSVariantC />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
