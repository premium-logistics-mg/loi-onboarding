/* global React, ReactDOM, AfIcon, DDVModal, FactureModal, DeclarationModal, STCModal */
// ════════════════════════════════════════════════════════════════
// LOI · Admin-Fi BELAZA — Workspace D82
// Exécutant Admin-Fi #2 · TVA/IRSA & DÉCAISSEMENT
// Archétype identique au workspace Sarobidy · contenu métier swappé.
// ════════════════════════════════════════════════════════════════
const { useState, useMemo, useCallback, useEffect } = React;

// ───────────────────────────────────────────────────────────
// DATA — Belaza
// ───────────────────────────────────────────────────────────
const PILLARS_DATA = [
  { id: "p1", short: "P1", name: "Exécution & discipline",  score: 78, trend: "up",     delta: "+4" },
  { id: "p2", short: "P2", name: "Cash & rentabilité",      score: 65, trend: "down",   delta: "−6", isFocus: true },
  { id: "p3", short: "P3", name: "Fidélité client",         score: 82, trend: "stable", delta: "±0" },
  { id: "p4", short: "P4", name: "Fluidité",                score: 71, trend: "up",     delta: "+2" },
];

const HERO_KPIS = [
  { id: "h1", label: "DDV ouvertes",   value: 14, unit: "objets",           tone: "neutral", icon: "clipboard" },
  { id: "h2", label: "En retard",      value: 3,  unit: "délais dépassés",  tone: "danger",  icon: "alert" },
  { id: "h3", label: "Montant cumulé", value: "47.85", unit: "M MGA",       tone: "accent",  icon: "pillar-cash", isMontant: true },
];

const STEPS = [
  { key: "demande",      label: "Demande",      icon: "step-demande" },
  { key: "matrice",      label: "Matrice",      icon: "step-matrice" },
  { key: "decaissement", label: "Décaissement", icon: "step-haja" },
  { key: "paye",         label: "Payé · classé", icon: "step-paye" },
];

const TYPE_META = {
  decaissement: { label: "Décaissement",      color: "var(--accent)",  shortName: "Décaisser"  },
  declaration:  { label: "Déclaration TVA/IRSA", color: "var(--pl-navy)", shortName: "Déclarer" },
  enregistrer:  { label: "À enregistrer",     color: "var(--warn)",    shortName: "Enregistrer" },
  paye:         { label: "Prête à classer",   color: "var(--ok)",      shortName: "Marquer payé" },
};

// Action label = contextual to type AND etape
function actionLabelFor(item) {
  if (item.type === "decaissement") return "Décaisser";
  if (item.type === "declaration")  return "Déclarer";
  if (item.type === "enregistrer")  return "Enregistrer";
  if (item.type === "paye")         return "Marquer payé";
  return "Traiter";
}

const QUEUE_SEED = [
  { id: "b-006", type: "decaissement", ref: "DDV-204188", demandeur: "Rico",      dept: "Achat",     montant: "12.4 M MGA",  etape: "decaissement", ageJours: 5, slaJours: 3 },
  { id: "b-007", type: "declaration",  ref: "TVA-2024-03", demandeur: "Belaza",   dept: "Admin-Fi",  montant: "8.2 M MGA",   etape: "matrice",      ageJours: 4, slaJours: 3 },
  { id: "b-001", type: "decaissement", ref: "DDV-204192", demandeur: "Christine", dept: "Transit",   montant: "5.6 M MGA",   etape: "decaissement", ageJours: 2, slaJours: 3 },
  { id: "b-002", type: "declaration",  ref: "IRSA-03-24", demandeur: "Lynda",     dept: "RH",        montant: "3.1 M MGA",   etape: "demande",      ageJours: 1, slaJours: 4 },
  { id: "b-003", type: "enregistrer",  ref: "DDV-204195", demandeur: "Édienne",   dept: "Transit",   montant: "1.85 M MGA",  etape: "demande",      ageJours: 1, slaJours: 2 },
  { id: "b-004", type: "paye",         ref: "DDV-204180", demandeur: "Ketsiah",   dept: "RH",        montant: "4.2 M MGA",   etape: "paye",         ageJours: 0, slaJours: 1 },
  { id: "b-005", type: "decaissement", ref: "DDV-204199", demandeur: "Haja",      dept: "Direction", montant: "16.5 M MGA",  etape: "matrice",      ageJours: 2, slaJours: 3 },
];

// Tri : retards d'abord
function sortByOverdueFirst(items) {
  return [...items].sort((a, b) => {
    const over = (x) => x.ageJours - x.slaJours;
    return over(b) - over(a);
  });
}

const COACHING = [
  {
    id: "sig-1", icon: "link",
    cause: "3 DDV décaissées >72h faute de pièce justificative",
    levier: "Relancer le demandeur pour la pièce avant approbation",
    gain: "Tenir le SLA cash · sécurise P2 Cash",
    source: "Rico",
  },
  {
    id: "sig-2", icon: "check-circle",
    cause: "Concordance 3 points échoue ponctuellement (92%)",
    levier: "Check-list concordance avant tout décaissement",
    gain: "0 erreur de paiement · zéro reprise",
    source: "Christine",
  },
  {
    id: "sig-3", icon: "users",
    cause: "Pic de charge déclarations en fin de mois",
    levier: "Étaler la prépa TVA sur la semaine",
    gain: "0 retard d'échéance légale · stress réduit",
    source: "Lynda",
  },
];

const CARNET = [
  { id: "c-1", date: "2024-03-18", type: "decision", text: "Mise en place check-list concordance 3 points pour décaissement", source: "Haja" },
  { id: "c-2", date: "2024-03-14", type: "escalade", text: "Pic TVA fin mars · escalade ressource RH temporaire",            source: "Lynda" },
  { id: "c-3", date: "2024-03-10", type: "decision", text: "Délégation décaissement chèques <5M MGA validée",                source: "Belaza" },
];

// SO Objectif 1
const SO_DATA = {
  code: "Objectif 1",
  title: "Encaissement accéléré & dette réduite",
  subtitle: "Cash Discipline",
  q: "Q3",
};
const SO_KPI = {
  label: "Décaissements <72h après approbation",
  value: 85, target: 95, unit: "%",
  hint: "% sous SLA · 12 semaines glissantes",
  series: [70, 74, 72, 78, 80, 79, 82, 84, 83, 86, 84, 85],
};

// Conformité fiscale — 2 cartes (scope Belaza)
const COMPLIANCE = [
  { id: "tva",  label: "TVA à temps",   current: 12, total: 12, unit: "mois",     echeance: "15 avr.", status: "ok" },
  { id: "irsa", label: "IRSA à temps",  current: 12, total: 12, unit: "mois",     echeance: "15 avr.", status: "ok" },
];

// Scores perso Belaza
const PERSO_KPIS = [
  { id: "B-K01", label: "Déclarations dans les délais",          value: 100, target: 100, status: "ok",   series: [95, 96, 100, 100, 98, 100, 100, 100, 100, 100, 100, 100] },
  { id: "B-K02", label: "Décaissement <72h après approbation",    value: 85,  target: 95,  status: "warn", series: [70, 74, 72, 78, 80, 79, 82, 84, 83, 86, 84, 85] },
  { id: "B-K03", label: "Concordance 3 points avant décaissement", value: 92,  target: 95,  status: "warn", series: [85, 87, 88, 90, 91, 90, 92, 91, 93, 92, 91, 92] },
];

// ───────────────────────────────────────────────────────────
// Atoms
// ───────────────────────────────────────────────────────────
function Chip({ children, color = "var(--fg-2)", bg = "transparent", border, mono }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 999,
      background: bg, color, border: border || "1px solid var(--border-soft)",
      fontSize: 13, fontWeight: 600,
      fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
      fontVariantNumeric: mono ? "tabular-nums" : "normal",
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function ageVsSla(age, sla) {
  if (age >= sla)        return { color: "var(--err)",  bg: "var(--err-soft)",  label: "Dépassement" };
  if (age >= sla - 1)    return { color: "var(--warn)", bg: "var(--warn-soft)", label: "À risque" };
  return                       { color: "var(--ok)",   bg: "var(--ok-soft)",   label: "Dans SLA" };
}

// ───────────────────────────────────────────────────────────
// Sparkline
// ───────────────────────────────────────────────────────────
function Sparkline({ series, color, target, width = 120, height = 36, fill = true }) {
  if (!series || series.length === 0) return null;
  const min = Math.min(...series, target ?? Infinity) - 4;
  const max = Math.max(...series, target ?? -Infinity) + 4;
  const range = Math.max(1, max - min);
  const stepX = width / (series.length - 1);
  const points = series.map((v, i) => [i * stepX, height - ((v - min) / range) * height]);
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const last = points[points.length - 1];
  const targetY = target != null ? height - ((target - min) / range) * height : null;
  const gid = `g-${Math.random().toString(36).slice(2, 7)}`;
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      {targetY != null && <line x1="0" y1={targetY} x2={width} y2={targetY} stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>}
      {fill && <path d={area} fill={`url(#${gid})`}/>}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} stroke="var(--surface)" strokeWidth="2"/>
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
// Pillar Bar
// ───────────────────────────────────────────────────────────
function PillarCard({ p }) {
  const focus = p.isFocus;
  const fillColor = focus ? "var(--accent)" : (p.trend === "down" ? "var(--err)" : "var(--pl-navy)");
  return (
    <div style={{
      padding: "14px 18px",
      background: focus ? "color-mix(in srgb, var(--accent) 12%, var(--surface))" : "var(--surface)",
      border: `1px solid ${focus ? "color-mix(in srgb, var(--accent) 50%, var(--border))" : "var(--border)"}`,
      borderRadius: 12,
      boxShadow: focus ? "0 0 0 1px color-mix(in srgb, var(--accent) 28%, transparent), 0 4px 14px color-mix(in srgb, var(--accent) 14%, transparent)" : "var(--shadow-1)",
      display: "flex", alignItems: "center", gap: 14, minWidth: 0,
    }}>
      <div style={{
        flexShrink: 0,
        padding: "6px 12px", borderRadius: 6,
        background: focus ? "var(--accent)" : "var(--pl-navy)",
        color: focus ? "var(--accent-fg)" : "var(--pl-cream)",
        fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em",
      }}>{p.short}</div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>{p.name}</span>
          {focus && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", padding: "2px 8px", borderRadius: 4, background: "var(--accent)", color: "var(--accent-fg)", textTransform: "uppercase" }}>Focus</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--bg-elev-1)", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${p.score}%`,
              background: `linear-gradient(90deg, ${fillColor} 0%, color-mix(in srgb, ${fillColor} 70%, white) 100%)`,
              boxShadow: `0 0 8px color-mix(in srgb, ${fillColor} 50%, transparent)`,
              transition: "width 500ms",
            }}/>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", minWidth: 38, textAlign: "right", lineHeight: 1 }}>{p.score}</span>
        </div>
      </div>
      <div style={{
        flexShrink: 0,
        width: 28, height: 28, borderRadius: 6, display: "grid", placeItems: "center",
        background: p.trend === "up" ? "var(--ok-soft)" : p.trend === "down" ? "var(--err-soft)" : "transparent",
        color: p.trend === "up" ? "var(--ok)" : p.trend === "down" ? "var(--err)" : "var(--fg-3)",
      }}>
        <AfIcon name={p.trend === "up" ? "trend-up" : p.trend === "down" ? "trend-down" : "trend-flat"} size={16}/>
      </div>
    </div>
  );
}

function PillarBar({ pillars }) {
  return (
    <div style={{ background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)", padding: "16px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {pillars.map((p) => <PillarCard key={p.id} p={p}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Simulation banner
// ───────────────────────────────────────────────────────────
function SimulationBanner() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 16px",
      background: "color-mix(in srgb, var(--warn) 14%, transparent)",
      borderBottom: "1px solid color-mix(in srgb, var(--warn) 30%, var(--border))",
      color: "var(--warn)",
      fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.06em",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--warn)", animation: "afPulse 1.6s ease-out infinite" }}/>
      [SIMULATION · DONNÉES SYNTHÉTIQUES COHÉRENTES DIGITAL TWIN V3]
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Workspace header (sous les piliers)
// ───────────────────────────────────────────────────────────
function WorkspaceHeader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 6 }}>
      <a href="#" style={{ fontSize: 13, color: "var(--fg-3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, width: "fit-content" }}>
        <AfIcon name="arrow-right" size={12} style={{ transform: "rotate(180deg)" }}/> Haja · Resp Admin & Fi
      </a>
      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.015em", display: "flex", alignItems: "center", gap: 10 }}>
        WORKSPACE BELAZA <span style={{ color: "var(--accent)" }}>·</span> TVA/IRSA & DÉCAISSEMENT
      </div>
      <div style={{ fontSize: 14, color: "var(--fg-3)" }}>TVA/IRSA · décaissement · doc · achat · drill-out Haja</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 3 KPI Hero (top)
// ───────────────────────────────────────────────────────────
function HeroKpiCard({ k }) {
  const tone = k.tone === "danger"  ? { color: "var(--err)",    bg: "var(--err-soft)",    border: "color-mix(in srgb, var(--err) 35%, var(--border))" }
              : k.tone === "accent" ? { color: "var(--accent)", bg: "var(--accent-soft)", border: "color-mix(in srgb, var(--accent) 35%, var(--border))" }
              :                       { color: "var(--fg-1)",   bg: "var(--bg-elev-1)",   border: "var(--border)" };
  return (
    <div style={{
      background: "var(--surface)", border: `1px solid ${tone.border}`,
      borderRadius: 12, padding: "16px 18px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: "var(--shadow-1)",
      position: "relative", overflow: "hidden",
    }}>
      {k.tone === "danger" && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "var(--err)" }}/>}
      <div style={{ width: 44, height: 44, borderRadius: 10, background: tone.bg, color: tone.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <AfIcon name={k.icon} size={22}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "var(--fg-2)", fontWeight: 500, marginBottom: 2 }}>{k.label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, color: tone.color, letterSpacing: "-0.025em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
          <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: k.isMontant ? "var(--font-mono)" : "var(--font-sans)" }}>{k.unit}</span>
        </div>
      </div>
    </div>
  );
}

function HeroKpis() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
      {HERO_KPIS.map((k) => <HeroKpiCard key={k.id} k={k}/>)}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// SO Band (variants A/B/C) — réutilise même protocole que Sarobidy
// ───────────────────────────────────────────────────────────
function ObjectiveBand() {
  const [variant, setVariant] = useState("A");
  const ecart = SO_KPI.target - SO_KPI.value;
  const pct = Math.round((SO_KPI.value / SO_KPI.target) * 100);
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 12, right: 14, zIndex: 2, display: "inline-flex", border: "1px solid color-mix(in srgb, currentColor 20%, transparent)", borderRadius: 6, overflow: "hidden", background: variant === "B" ? "rgba(11,37,64,0.06)" : "rgba(245,241,232,0.08)", backdropFilter: "blur(4px)" }}>
        {["A","B","C"].map((v) => (
          <button key={v} onClick={() => setVariant(v)}
            style={{
              padding: "5px 10px", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
              background: variant === v ? "var(--accent)" : "transparent",
              color: variant === v ? "var(--accent-fg)" : (variant === "B" ? "var(--fg-2)" : "var(--pl-cream)"),
              border: "none", cursor: "pointer",
            }}>{v}</button>
        ))}
      </div>
      {variant === "A" && <SOA value={SO_KPI.value} target={SO_KPI.target} ecart={ecart} pct={pct}/>}
      {variant === "B" && <SOB value={SO_KPI.value} target={SO_KPI.target} ecart={ecart} pct={pct}/>}
      {variant === "C" && <SOC value={SO_KPI.value} target={SO_KPI.target} ecart={ecart} pct={pct}/>}
    </div>
  );
}

function SOA({ value, target, ecart, pct }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, var(--pl-navy) 0%, var(--pl-navy-deep) 100%)",
      borderRadius: 14, padding: "20px 24px",
      color: "var(--pl-cream)",
      display: "flex", flexWrap: "wrap", gap: 22, alignItems: "center",
      boxShadow: "0 4px 14px rgba(6,24,41,0.20)",
      border: "1px solid color-mix(in srgb, var(--accent) 20%, var(--pl-navy))",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 220, flex: "1 1 220px" }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.q} · OBJECTIF RATTACHÉ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", boxShadow: "0 4px 12px color-mix(in srgb, var(--accent) 40%, transparent)" }}>{SO_DATA.code}</div>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--pl-teal-light)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.subtitle}</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: "var(--pl-cream)", letterSpacing: "-0.015em", lineHeight: 1.25 }}>{SO_DATA.title}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 240, flex: "2 1 280px", borderLeft: "1px solid color-mix(in srgb, var(--pl-cream) 14%, transparent)", paddingLeft: 22 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 600, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.03em", textShadow: "0 0 24px color-mix(in srgb, var(--accent) 40%, transparent)" }}>{value}<span style={{ fontSize: 20, color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)" }}>%</span></span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--pl-cream)" }}>{SO_KPI.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, position: "relative", height: 10, borderRadius: 999, background: "color-mix(in srgb, var(--pl-cream) 10%, transparent)", overflow: "visible" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, width: `${pct}%`, background: "linear-gradient(90deg, var(--accent) 0%, var(--pl-teal-light) 100%)", boxShadow: "0 0 14px color-mix(in srgb, var(--accent) 70%, transparent)" }}/>
            <div style={{ position: "absolute", left: "100%", top: -4, bottom: -4, width: 2, marginLeft: -1, background: "var(--pl-cream)", opacity: 0.6, borderRadius: 1 }}/>
          </div>
          <Sparkline series={SO_KPI.series} color="var(--pl-teal-light)" target={target} width={110} height={26}/>
        </div>
        <div style={{ fontSize: 12, color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)" }}>{SO_KPI.hint}</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <div style={{ padding: "8px 14px", borderRadius: 8, minWidth: 88, textAlign: "center", background: "color-mix(in srgb, var(--err) 24%, transparent)", border: "1px solid color-mix(in srgb, var(--err) 55%, transparent)" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>écart</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "#FFB4A3", fontWeight: 700, letterSpacing: "-0.02em" }}>−{ecart}<span style={{ fontSize: 12, opacity: 0.7 }}>pts</span></div>
        </div>
        <div style={{ padding: "8px 14px", borderRadius: 8, minWidth: 88, textAlign: "center", background: "color-mix(in srgb, var(--pl-cream) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--pl-cream) 18%, transparent)" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>cible</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--pl-cream)", fontWeight: 700, letterSpacing: "-0.02em" }}>≥{target}<span style={{ fontSize: 12, opacity: 0.7 }}>%</span></div>
        </div>
      </div>
    </div>
  );
}

function SOB({ value, target, ecart, pct }) {
  return (
    <div style={{
      background: "var(--surface)", borderRadius: 14, padding: "22px 26px",
      color: "var(--fg-1)",
      display: "flex", flexWrap: "wrap", gap: 22, alignItems: "center",
      border: "1px solid var(--border)", boxShadow: "var(--shadow-1)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "linear-gradient(180deg, var(--accent) 0%, var(--pl-teal-light) 100%)" }}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 8, minWidth: 220, flex: "1 1 240px" }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.q} · OBJECTIF RATTACHÉ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{SO_DATA.code}</span>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.subtitle}</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.015em", lineHeight: 1.25 }}>{SO_DATA.title}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 240, flex: "2 1 260px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 52, fontWeight: 600, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.035em" }}>{value}<span style={{ fontSize: 22, color: "var(--fg-3)" }}>%</span></span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)", marginLeft: 4 }}>{SO_KPI.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, position: "relative", height: 10, borderRadius: 999, background: "var(--bg-elev-1)" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, width: `${pct}%`, background: "linear-gradient(90deg, var(--accent) 0%, var(--pl-teal-light) 100%)", boxShadow: "0 0 10px color-mix(in srgb, var(--accent) 50%, transparent)" }}/>
            <div style={{ position: "absolute", left: "100%", top: -3, bottom: -3, width: 2, marginLeft: -1, background: "var(--fg-2)", borderRadius: 1 }}/>
          </div>
          <Sparkline series={SO_KPI.series} color="var(--accent)" target={target} width={110} height={30}/>
        </div>
        <div style={{ fontSize: 13, color: "var(--fg-3)" }}>{SO_KPI.hint}</div>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--err-soft)", border: "1px solid color-mix(in srgb, var(--err) 30%, transparent)", textAlign: "center", minWidth: 88 }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>écart</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--err)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>−{ecart}<span style={{ fontSize: 11, opacity: 0.7 }}>pts</span></div>
        </div>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-elev-1)", border: "1px solid var(--border)", textAlign: "center", minWidth: 88 }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>cible</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--fg-1)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>≥{target}<span style={{ fontSize: 11, opacity: 0.7 }}>%</span></div>
        </div>
      </div>
    </div>
  );
}

function SOC({ value, target, ecart, pct }) {
  const size = 140, stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ratio = value / 100;
  return (
    <div style={{
      background: "linear-gradient(135deg, var(--pl-navy-deep) 0%, var(--pl-navy) 60%, color-mix(in srgb, var(--accent) 14%, var(--pl-navy-deep)) 100%)",
      borderRadius: 14, padding: "24px 28px",
      color: "var(--pl-cream)",
      display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap",
      border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--pl-navy))",
      boxShadow: "0 8px 22px rgba(6,24,41,0.30)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="color-mix(in srgb, var(--pl-cream) 12%, transparent)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#soGradBel)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c * ratio} ${c}`} transform={`rotate(-90 ${size/2} ${size/2})`} style={{ filter: "drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 70%, transparent))" }}/>
          <defs><linearGradient id="soGradBel" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="var(--accent)"/><stop offset="100%" stopColor="var(--pl-teal-light)"/></linearGradient></defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 42, fontWeight: 600, color: "var(--pl-cream)", lineHeight: 1, letterSpacing: "-0.03em" }}>{value}<span style={{ fontSize: 18, opacity: 0.6 }}>%</span></span>
          <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginTop: 2 }}>cible ≥{target}</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.q} · objectif rattaché</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", boxShadow: "0 4px 14px color-mix(in srgb, var(--accent) 45%, transparent)" }}>{SO_DATA.code}</span>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--pl-teal-light)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.subtitle}</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--pl-cream)", letterSpacing: "-0.015em", lineHeight: 1.2 }}>{SO_DATA.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--pl-cream)" }}>{SO_KPI.label}</div>
          <Sparkline series={SO_KPI.series} color="var(--pl-teal-light)" target={target} width={160} height={36}/>
          <span style={{ padding: "5px 12px", borderRadius: 999, background: "color-mix(in srgb, var(--err) 28%, transparent)", border: "1px solid color-mix(in srgb, var(--err) 55%, transparent)", color: "#FFB4A3", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)" }}>écart −{ecart}pts</span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Conformité fiscale (TVA + IRSA)
// ───────────────────────────────────────────────────────────
function ConformiteCard({ k }) {
  const tone = k.status === "ok" ? { color: "var(--ok)", bg: "var(--ok-soft)", label: "À jour" }
            : k.status === "warn" ? { color: "var(--warn)", bg: "var(--warn-soft)", label: "Attention" }
            : { color: "var(--err)", bg: "var(--err-soft)", label: "Retard" };
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 10,
      boxShadow: "var(--shadow-1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)" }}>{k.label}</span>
        <Chip color={tone.color} bg={tone.bg} border={`1px solid color-mix(in srgb, ${tone.color} 30%, transparent)`}>{tone.label}</Chip>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.current}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-3)" }}>/ {k.total} {k.unit}</span>
        <span className="confirm-badge" style={{ marginLeft: 8 }}>SYNTH</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: "var(--bg-elev-1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(k.current/k.total)*100}%`, background: tone.color }}/>
      </div>
      <div style={{ fontSize: 12, color: "var(--fg-3)" }}>
        Prochaine échéance : <span style={{ color: "var(--fg-2)", fontWeight: 600 }}>{k.echeance}</span>
      </div>
    </div>
  );
}

function ConformiteBlock() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, boxShadow: "var(--shadow-1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>Conformité fiscale</h3>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>(hors SO · scope Belaza)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {COMPLIANCE.map((k) => <ConformiteCard key={k.id} k={k}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Action Bar — 4 boutons contextuels Belaza
// ───────────────────────────────────────────────────────────
function ActionButton({ label, onClick, variant }) {
  const colors = {
    primary: { bg: "var(--pl-navy)", fg: "var(--pl-cream)", hov: "color-mix(in srgb, var(--pl-navy) 86%, white)" },
    accent:  { bg: "var(--accent)",  fg: "var(--accent-fg)", hov: "color-mix(in srgb, var(--accent) 88%, white)" },
    ok:      { bg: "var(--ok)",      fg: "white", hov: "color-mix(in srgb, var(--ok) 88%, white)" },
    warn:    { bg: "color-mix(in srgb, var(--warn) 10%, var(--surface))", fg: "var(--warn)", hov: "color-mix(in srgb, var(--warn) 18%, var(--surface))", border: "1px solid color-mix(in srgb, var(--warn) 40%, var(--border))" },
  }[variant || "primary"];
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, minWidth: 0, padding: "16px 18px", borderRadius: 10,
        background: hover ? colors.hov : colors.bg, color: colors.fg,
        border: colors.border || "none", cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
        transition: "background 120ms", fontSize: 14, fontWeight: 600, letterSpacing: "-0.005em",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
      <AfIcon name="plus" size={18}/> {label}
    </button>
  );
}

function ActionBar({ onDecaisser, onDeclarer, onEnregistrer, onMarquer }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10,
      boxShadow: "var(--shadow-1)",
    }}>
      <ActionButton label="Décaisser chèque/virement" variant="accent"  onClick={onDecaisser}/>
      <ActionButton label="Déclarer TVA/IRSA"         variant="primary" onClick={onDeclarer}/>
      <ActionButton label="Enregistrer Kiaoras"       variant="warn"    onClick={onEnregistrer}/>
      <ActionButton label="Marquer payé + classer"    variant="ok"      onClick={onMarquer}/>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Stepper dots
// ───────────────────────────────────────────────────────────
function StepperDots({ current }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
      {STEPS.map((s, i) => {
        const isPast = i < currentIdx;
        const isCurrent = i === currentIdx;
        const color = isCurrent ? "var(--accent)" : isPast ? "var(--ok)" : "var(--border)";
        return (
          <React.Fragment key={s.key}>
            <span title={s.label} style={{
              width: isCurrent ? 18 : 12, height: 12,
              borderRadius: isCurrent ? 4 : "50%", background: color,
              boxShadow: isCurrent ? "0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)" : "none",
              flexShrink: 0,
            }}/>
            {i < STEPS.length - 1 && (
              <span style={{ width: 14, height: 2, background: i < currentIdx ? "var(--ok)" : "var(--border)", margin: "0 4px" }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Work Queue (tri retards d'abord)
// ───────────────────────────────────────────────────────────
const QUEUE_COLS = "32px 168px 130px 130px 130px 130px 110px 1fr";

function QueueHeader() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: QUEUE_COLS, gap: 10,
      padding: "12px 16px",
      background: "var(--pl-navy)", color: "var(--pl-cream)",
      fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      alignItems: "center", minWidth: "max-content",
    }}>
      <span/>
      <span>Type</span>
      <span>Ref</span>
      <span>Montant</span>
      <span>Demandeur</span>
      <span>Étape</span>
      <span>Âge / SLA</span>
      <span style={{ textAlign: "right" }}>Action</span>
    </div>
  );
}

function QueueRow({ item, selected, onSelect, onAction, isLast }) {
  const meta = TYPE_META[item.type];
  const sla = ageVsSla(item.ageJours, item.slaJours);
  const overdue = item.ageJours >= item.slaJours;
  return (
    <div onClick={onSelect}
      style={{
        display: "grid", gridTemplateColumns: QUEUE_COLS, gap: 10,
        alignItems: "center", padding: "14px 16px",
        background: selected ? "color-mix(in srgb, var(--accent) 7%, var(--surface))" : (overdue ? "color-mix(in srgb, var(--err) 5%, var(--surface))" : "var(--surface)"),
        borderLeft: overdue ? "3px solid var(--err)" : "3px solid transparent",
        borderBottom: isLast ? "none" : "1px solid var(--border-soft)",
        cursor: "pointer", minWidth: "max-content",
      }}>
      <div onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{
          width: 20, height: 20, borderRadius: 5,
          border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
          background: selected ? "var(--accent)" : "transparent",
          display: "grid", placeItems: "center", color: "var(--accent-fg)",
        }}>{selected && <AfIcon name="check" size={12}/>}</div>

      <Chip color={meta.color} bg={`color-mix(in srgb, ${meta.color} 12%, transparent)`} border={`1px solid color-mix(in srgb, ${meta.color} 30%, transparent)`}>
        {meta.label}
      </Chip>

      <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-1)", fontWeight: 600, letterSpacing: "-0.01em" }}>{item.ref}</span>

      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-1)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{item.montant}</span>

      <span style={{ fontSize: 14, color: "var(--fg-1)", fontWeight: 500 }}>{item.demandeur}</span>

      <div>
        <span style={{
          display: "inline-block", padding: "3px 9px", borderRadius: 999,
          background: item.etape === "demande" ? "var(--warn-soft)" : item.etape === "matrice" ? "var(--ok-soft)" : item.etape === "decaissement" ? "var(--accent-soft)" : "color-mix(in srgb, var(--ok) 30%, transparent)",
          color: item.etape === "demande" ? "var(--warn)" : item.etape === "matrice" ? "var(--ok)" : item.etape === "decaissement" ? "var(--accent)" : "var(--ok)",
          fontSize: 11, fontWeight: 700, marginBottom: 5,
        }}>{STEPS.find(s => s.key === item.etape)?.label}</span>
        <div><StepperDots current={item.etape}/></div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: sla.color, fontVariantNumeric: "tabular-nums" }}>{item.ageJours}j</span>
        <span style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>/ {item.slaJours}j</span>
        {overdue && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--err)", boxShadow: "0 0 0 2px var(--err-soft)" }}/>}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={(e) => { e.stopPropagation(); onAction(item); }}
          style={{
            padding: "10px 18px", borderRadius: 8,
            background: meta.color === "var(--accent)" ? "var(--accent)" : meta.color === "var(--err)" ? "var(--err)" : meta.color === "var(--warn)" ? "var(--warn)" : meta.color === "var(--ok)" ? "var(--ok)" : "var(--pl-navy)",
            color: meta.color === "var(--warn)" ? "var(--pl-navy)" : "white",
            border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(6,24,41,0.12)",
          }}>{actionLabelFor(item)}</button>
      </div>
    </div>
  );
}

function WorkQueue({ items, onAction }) {
  const [selected, setSelected] = useState(new Set());
  const toggle = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const overdueCount = items.filter((it) => it.ageJours >= it.slaJours).length;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>Ma file de travail</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {overdueCount > 0 && (
            <Chip color="var(--err)" bg="var(--err-soft)" border={`1px solid color-mix(in srgb, var(--err) 30%, transparent)`}>
              <AfIcon name="alert" size={12} color="var(--err)"/> {overdueCount} en retard
            </Chip>
          )}
          <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{items.length} objet(s) · tri retards d'abord</span>
        </div>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-1)" }}>
        <div style={{ overflowX: "auto" }}>
          <QueueHeader/>
          <div>
            {items.map((it, i) => (
              <QueueRow key={it.id} item={it} selected={selected.has(it.id)} onSelect={() => toggle(it.id)} onAction={onAction} isLast={i === items.length - 1}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Coaching
// ───────────────────────────────────────────────────────────
function CoachingCard({ sig }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start",
      boxShadow: "var(--shadow-1)",
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
        <AfIcon name={sig.icon} size={22}/>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
        <div>
          <div className="label" style={{ marginBottom: 3 }}>Cause</div>
          <div style={{ fontSize: 14, color: "var(--fg-1)", lineHeight: 1.45, fontWeight: 500 }}>{sig.cause}</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 3, color: "var(--accent)" }}>Levier</div>
          <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>{sig.levier}</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 3, color: "var(--ok)" }}>Gain</div>
          <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>{sig.gain}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 6, borderTop: "1px dashed var(--border-soft)" }}>
          <AfIcon name="user" size={12} color="var(--fg-3)"/>
          <span style={{ fontSize: 12, color: "var(--fg-3)" }}>Source : <strong style={{ color: "var(--fg-2)", fontWeight: 600 }}>{sig.source}</strong></span>
        </div>
      </div>
    </div>
  );
}

function CoachingSignals({ signals }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>Signaux de coaching</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        {signals.map((s) => <CoachingCard key={s.id} sig={s}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sidebar (4 onglets · pas d'Assistant)
// ───────────────────────────────────────────────────────────
const NAV = [
  { id: "vue",       label: "Vue d'ensemble", icon: "grid"  },
  { id: "scores",    label: "Scores",         icon: "chart" },
  { id: "carnet",    label: "Carnet de bord", icon: "book"  },
  { id: "profil",    label: "Profil",         icon: "user"  },
];

function Sidebar({ active, onTab }) {
  return (
    <aside style={{ width: 240, flexShrink: 0, background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: 12, flex: 1 }}>
        {NAV.map((n) => {
          const a = active === n.id;
          return (
            <button key={n.id} onClick={() => onTab(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 10,
                background: a ? "var(--pl-navy)" : "transparent",
                color: a ? "var(--pl-cream)" : "var(--fg-2)",
                border: "none", cursor: "pointer", textAlign: "left",
                fontSize: 15, fontWeight: a ? 600 : 500,
              }}
              onMouseEnter={(e) => { if (!a) e.currentTarget.style.background = "var(--bg-elev-1)"; }}
              onMouseLeave={(e) => { if (!a) e.currentTarget.style.background = "transparent"; }}>
              <AfIcon name={n.icon} size={18} color={a ? "var(--accent)" : "var(--fg-3)"}/>
              {n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 14, borderTop: "1px solid var(--border-soft)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>Design System D82</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--warn)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--warn)" }}/>
          WRITES_LIVE=false
        </div>
      </div>
    </aside>
  );
}

// ───────────────────────────────────────────────────────────
// Header
// ───────────────────────────────────────────────────────────
function Header({ theme, onTheme }) {
  return (
    <header style={{
      background: "var(--pl-navy-deep)", color: "var(--pl-cream)",
      padding: "14px 24px",
      borderBottom: "1px solid color-mix(in srgb, var(--pl-cream) 8%, var(--pl-navy-deep))",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "var(--pl-cream)" }}>Admin-Fi</span>
        <span style={{ color: "var(--pl-teal)", fontSize: 18 }}>·</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "var(--pl-teal-light)" }}>Belaza</span>
        <Chip color="var(--pl-teal-light)" bg="color-mix(in srgb, var(--pl-teal) 20%, transparent)" border={`1px solid color-mix(in srgb, var(--pl-teal-light) 30%, transparent)`}>
          Premium Logistics
        </Chip>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onTheme}
          style={{
            padding: "6px 12px", borderRadius: 6,
            background: "transparent", color: "var(--pl-cream)",
            border: "1px solid color-mix(in srgb, var(--pl-cream) 20%, transparent)",
            fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)", fontWeight: 600,
          }}>
          {theme === "dark" ? "DARK" : "LIGHT"}
        </button>
        <span style={{ fontSize: 13, color: "color-mix(in srgb, var(--pl-cream) 65%, transparent)", fontFamily: "var(--font-mono)" }}>Madagascar</span>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--pl-teal)", display: "grid", placeItems: "center", color: "var(--pl-navy-deep)", fontWeight: 700, fontSize: 15 }}>B</div>
      </div>
    </header>
  );
}

// ───────────────────────────────────────────────────────────
// Toast
// ───────────────────────────────────────────────────────────
function Toast({ items, onClose }) {
  if (items.length === 0) return null;
  return (
    <div style={{ position: "fixed", top: 80, right: 24, zIndex: 200, display: "flex", flexDirection: "column", gap: 8, maxWidth: 380 }}>
      {items.map((t) => (
        <div key={t.id} style={{
          background: "var(--surface)", color: "var(--fg-1)",
          border: `1px solid color-mix(in srgb, var(--ok) 40%, var(--border))`,
          boxShadow: "0 10px 24px rgba(6,24,41,0.18)",
          borderRadius: 10, padding: "14px 16px",
          display: "flex", alignItems: "flex-start", gap: 10,
          animation: "afToastIn 220ms cubic-bezier(.2,.7,.2,1)", minWidth: 320,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ok-soft)", color: "var(--ok)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <AfIcon name="check" size={18}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>{t.title}</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{t.subtitle}</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", marginTop: 4 }}>Trace M13 simulée · WRITES_LIVE=false</div>
          </div>
          <button onClick={() => onClose(t.id)} style={{ background: "transparent", border: "none", color: "var(--fg-3)", cursor: "pointer" }}>
            <AfIcon name="x" size={14}/>
          </button>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Scores tab — 3 perso KPIs Belaza
// ───────────────────────────────────────────────────────────
function ScoresTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
        {PERSO_KPIS.map((k) => {
          const tone = k.status === "ok" ? { c: "var(--ok)",   bg: "var(--ok-soft)",   label: "Atteint" }
                    : k.status === "warn" ? { c: "var(--warn)", bg: "var(--warn-soft)", label: "À surveiller" }
                    :                       { c: "var(--err)",  bg: "var(--err-soft)",  label: "Sous cible" };
          return (
            <div key={k.id} style={{
              background: "var(--surface)", border: `1px solid var(--border)`,
              borderRadius: 12, padding: 18, position: "relative", overflow: "hidden",
              boxShadow: "var(--shadow-1)",
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: tone.c }}/>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, paddingLeft: 6 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", fontWeight: 700, letterSpacing: "0.06em" }}>{k.id}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)", marginTop: 4, lineHeight: 1.3 }}>{k.label}</div>
                </div>
                <Chip color={tone.c} bg={tone.bg} border={`1px solid color-mix(in srgb, ${tone.c} 30%, transparent)`}>{tone.label}</Chip>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14, paddingLeft: 6 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 600, color: tone.c, lineHeight: 1, letterSpacing: "-0.03em" }}>{k.value}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-3)" }}>%</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)", marginLeft: 10 }}>cible {k.target}%</span>
                </div>
                <Sparkline series={k.series} color={tone.c} target={k.target} width={130} height={36}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Détail tendance B-K02 + historique B-K01 */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, boxShadow: "var(--shadow-1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "0.01em" }}>Tendance · décaissement &lt;72h après approbation</h3>
        </div>
        <Sparkline series={PERSO_KPIS[1].series} color="var(--warn)" target={95} width={1000} height={120}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)" }}>
          <span>S-11</span><span>S-9</span><span>S-7</span><span>S-5</span><span>S-3</span><span>S-1</span><span>auj.</span>
        </div>
        <div style={{ marginTop: 16, padding: 12, background: "var(--bg-elev-1)", borderRadius: 8, fontSize: 13, color: "var(--fg-2)" }}>
          <strong style={{ color: "var(--fg-1)" }}>Historique B-K01 (Déclarations dans les délais)</strong> — 100% sur 12 dernières échéances · 0 retard légal · routine TVA/IRSA stable.
        </div>
      </div>
    </div>
  );
}

function CarnetTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {CARNET.map((c) => (
        <div key={c.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: c.type === "decision" ? "var(--accent-soft)" : "var(--warn-soft)",
            color: c.type === "decision" ? "var(--accent)" : "var(--warn)",
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <AfIcon name={c.type === "decision" ? "check-circle" : "alert"} size={16}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700,
                background: c.type === "decision" ? "var(--accent-soft)" : "var(--warn-soft)",
                color: c.type === "decision" ? "var(--accent)" : "var(--warn)",
              }}>{c.type}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>{c.date}</span>
            </div>
            <div style={{ fontSize: 15, color: "var(--fg-1)", marginTop: 6 }}>{c.text}</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <AfIcon name="user" size={12}/> Source : <strong style={{ fontWeight: 600, color: "var(--fg-2)" }}>{c.source}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfilTab() {
  const fonctions = [ "TVA / IRSA · déclarations fiscales", "Décaissement chèque & virement", "Concordance 3 points avant paiement", "Enregistrement Kiaoras · classement docs" ];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 26, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent) 0%, var(--pl-navy) 100%)", display: "grid", placeItems: "center", color: "white", fontSize: 40, fontWeight: 600 }}>B</div>
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.015em" }}>Belaza</div>
          <div style={{ fontSize: 14, color: "var(--fg-3)" }}>Admin-Fi · Exécutant #2 · drill-out Haja</div>
        </div>
        <div className="label">Fonctions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {fonctions.map((f) => <Chip key={f} color="var(--fg-1)" bg="var(--bg-elev-1)">{f}</Chip>)}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Main
// ───────────────────────────────────────────────────────────
function App() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  const [tab, setTab] = useState("vue");
  const [queue, setQueue] = useState(sortByOverdueFirst(QUEUE_SEED));
  const [toasts, setToasts] = useState([]);

  // 4 modales — réutilise celles de Sarobidy mais re-labellisées via brief
  const [openDecaisser, setOpenDecaisser] = useState(false);    // DDV modal (proxy)
  const [openDeclarer, setOpenDeclarer] = useState(false);      // Declaration modal
  const [openEnregistrer, setOpenEnregistrer] = useState(false);// DDV modal (proxy)
  const [openMarquer, setOpenMarquer] = useState(false);        // STC modal (proxy "marquer payé")

  const pushToast = (title, subtitle) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((p) => [...p, { id, title, subtitle }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5200);
  };
  const closeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const advanceByType = useCallback((type) => {
    setQueue((prev) => {
      const idx = prev.findIndex((it) => it.type === type && it.etape !== "paye");
      if (idx === -1) return prev;
      const item = prev[idx];
      const stepIdx = STEPS.findIndex((s) => s.key === item.etape);
      const nextStep = STEPS[Math.min(stepIdx + 1, STEPS.length - 1)].key;
      const next = [...prev];
      next[idx] = { ...item, etape: nextStep };
      return sortByOverdueFirst(next);
    });
  }, []);

  const onDecaisserSubmit = (data) => {
    setOpenDecaisser(false);
    pushToast(`✓ Décaissement ${data.numeroSerie || "DDV"} engagé`, `Mode : ${data.modePaiement || "À CONFIRMER"} · transmis trésorerie`);
    advanceByType("decaissement");
  };
  const onDeclarerSubmit = (data) => {
    setOpenDeclarer(false);
    pushToast(`✓ Déclaration ${data.type} soumise`, `Période ${data.periode || "—"} · transmis Lynda (RH)`);
    advanceByType("declaration");
  };
  const onEnregistrerSubmit = (data) => {
    setOpenEnregistrer(false);
    pushToast(`✓ Kiaoras ${data.numeroSerie || ""} enregistré`, `Objet : ${data.objet || "À CONFIRMER"} · entrée matrice V4`);
    advanceByType("enregistrer");
  };
  const onMarquerSubmit = (data) => {
    setOpenMarquer(false);
    pushToast(`✓ Marqué payé · ${data.matricule || data.numeroSerie || "DDV"}`, `Classement archive · trace M13 simulée`);
    advanceByType("paye");
  };

  const handleQueueAction = (item) => {
    if (item.type === "decaissement") setOpenDecaisser(true);
    else if (item.type === "declaration") setOpenDeclarer(true);
    else if (item.type === "enregistrer") setOpenEnregistrer(true);
    else if (item.type === "paye") setOpenMarquer(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg-1)", display: "flex", flexDirection: "column" }} data-screen-label="Admin-Fi Belaza Workspace">
      <Header theme={theme} onTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")}/>
      <SimulationBanner/>
      <PillarBar pillars={PILLARS_DATA}/>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar active={tab} onTab={setTab}/>

        <main style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
            {tab === "vue" && (
              <>
                <WorkspaceHeader/>
                <HeroKpis/>
                <ObjectiveBand/>
                <ActionBar
                  onDecaisser={() => setOpenDecaisser(true)}
                  onDeclarer={() => setOpenDeclarer(true)}
                  onEnregistrer={() => setOpenEnregistrer(true)}
                  onMarquer={() => setOpenMarquer(true)}
                />
                <ConformiteBlock/>
                <WorkQueue items={queue} onAction={handleQueueAction}/>
                <CoachingSignals signals={COACHING}/>
              </>
            )}
            {tab === "scores" && <ScoresTab/>}
            {tab === "carnet" && <CarnetTab/>}
            {tab === "profil" && <ProfilTab/>}
          </div>
        </main>
      </div>

      <footer style={{
        borderTop: "1px solid var(--border)", background: "var(--surface)",
        padding: "12px 24px", fontSize: 12, color: "var(--fg-3)",
        display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)",
      }}>
        <span>LOI · Admin-Fi Belaza · exécutant #2</span>
        <span>CockpitLayout V2 · D82 · Digital Twin V3</span>
      </footer>

      <Toast items={toasts} onClose={closeToast}/>

      <DDVModal         open={openDecaisser}    onClose={() => setOpenDecaisser(false)}    onSubmit={onDecaisserSubmit}/>
      <DeclarationModal open={openDeclarer}     onClose={() => setOpenDeclarer(false)}     onSubmit={onDeclarerSubmit}/>
      <DDVModal         open={openEnregistrer}  onClose={() => setOpenEnregistrer(false)}  onSubmit={onEnregistrerSubmit}/>
      <STCModal         open={openMarquer}      onClose={() => setOpenMarquer(false)}      onSubmit={onMarquerSubmit}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
