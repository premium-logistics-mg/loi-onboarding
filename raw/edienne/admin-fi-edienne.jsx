/* global React, ReactDOM, AfIcon, CongeVisaModal, STCVisaRHModal, ClimatHebdoModal, OneOnOneTraceModal */
// ════════════════════════════════════════════════════════════════
// LOI · Admin-Fi ÉDIENNE — Workspace D82
// Exécutant Admin-Fi N4 spéciale · RH & PACTE TER (B17 strict)
// Archétype identique aux executants (Sarobidy/Belaza/Christine/Facturation).
// Contenu RH · zéro finance · ZÉRO "Kiaoras".
// ════════════════════════════════════════════════════════════════
const { useState, useMemo, useCallback, useEffect } = React;

// ───────────────────────────────────────────────────────────
// DATA — Édienne (RH)
// ───────────────────────────────────────────────────────────
const PILLARS_DATA = [
  { id: "p1", short: "P1", name: "Exécution & discipline",  score: 78, trend: "up",     delta: "+4" },
  { id: "p2", short: "P2", name: "Cash & rentabilité",      score: 65, trend: "down",   delta: "−6", isFocus: true },
  { id: "p3", short: "P3", name: "Fidélité client",         score: 82, trend: "stable", delta: "±0" },
  { id: "p4", short: "P4", name: "Fluidité",                score: 71, trend: "up",     delta: "+2" },
];

// File de travail — "Demandes à viser" · 7 lignes · 2 overdue
const QUEUE_SEED = [
  { id: "e-001", type: "conge",     ref: "CONG-2606-014", matricule: "MAT-0214", nom: "Lalaina R.",   rattachement: "Transit Antananarivo", periode: "10–17 juin 2026", duree: "6 j",  statut: "2 visas OK · attente RH", ageJours: 4, slaJours: 2,
    prefill: { matricule: "MAT-0214", nom: "Lalaina Rakotonirina", rattachement: "Transit Antananarivo", motif: "annuel", dateDebut: "2026-06-10", dateFin: "2026-06-17", soldeRestant: "14", visaN1: "Sarobidy · N+1", visaN2: "Haja · N+2", visaN1Date: "23 mai", visaN2Date: "25 mai" } },
  { id: "e-002", type: "stc",       ref: "STC-2605-003",  matricule: "MAT-0177", nom: "Mialy A.",     rattachement: "Caisse Toamasina",     periode: "Rupture 31 mai 2026", duree: "—",   statut: "STC + cash OK · attente visa RH", ageJours: 3, slaJours: 2,
    prefill: { matricule: "MAT-0177", nom: "Mialy Andriana", motifRupture: "demission", dateRupture: "2026-05-31", montantNet: "3 850 000", dateSarobidy: "22 mai", dateHaja: "25 mai" } },
  { id: "e-003", type: "conge",     ref: "CONG-2607-022", matricule: "MAT-0188", nom: "Tahiry N.",    rattachement: "Achat",                periode: "1–8 juillet 2026",   duree: "6 j", statut: "2 visas OK · attente RH", ageJours: 1, slaJours: 3,
    prefill: { matricule: "MAT-0188", nom: "Tahiry Nirina", rattachement: "Achat", motif: "annuel", dateDebut: "2026-07-01", dateFin: "2026-07-08", soldeRestant: "11", visaN1: "Rico · N+1", visaN2: "Haja · N+2", visaN1Date: "24 mai", visaN2Date: "26 mai" } },
  { id: "e-004", type: "absence",   ref: "ABS-2605-041",  matricule: "MAT-0203", nom: "Soa M.",       rattachement: "Transit Toamasina",    periode: "28–29 mai 2026",   duree: "2 j", statut: "Maladie · attente RH", ageJours: 0, slaJours: 1,
    prefill: { matricule: "MAT-0203", nom: "Soa Mahatoky", rattachement: "Transit Toamasina", motif: "maladie", dateDebut: "2026-05-28", dateFin: "2026-05-29", soldeRestant: "—" } },
  { id: "e-005", type: "conge",     ref: "CONG-2606-018", matricule: "MAT-0162", nom: "Hery R.",      rattachement: "Direction",            periode: "15–22 juin 2026",  duree: "6 j", statut: "2 visas OK · attente RH", ageJours: 2, slaJours: 3,
    prefill: { matricule: "MAT-0162", nom: "Hery Razafy", rattachement: "Direction", motif: "annuel", dateDebut: "2026-06-15", dateFin: "2026-06-22", soldeRestant: "8", visaN1: "Haja · N+1", visaN2: "Ketsiah · N+2", visaN1Date: "25 mai", visaN2Date: "26 mai" } },
  { id: "e-006", type: "conge",     ref: "CONG-2607-031", matricule: "MAT-0241", nom: "Fanja H.",     rattachement: "Admin-Fi",             periode: "20–24 juillet 2026", duree: "4 j", statut: "2 visas OK · attente RH", ageJours: 0, slaJours: 3,
    prefill: { matricule: "MAT-0241", nom: "Fanja Heriniaina", rattachement: "Admin-Fi", motif: "exception", dateDebut: "2026-07-20", dateFin: "2026-07-24", soldeRestant: "9", visaN1: "Belaza · N+1", visaN2: "Haja · N+2", visaN1Date: "26 mai", visaN2Date: "27 mai" } },
  { id: "e-007", type: "absence",   ref: "ABS-2606-005",  matricule: "MAT-0195", nom: "Voary T.",     rattachement: "Achat",                periode: "2 juin 2026",      duree: "1 j", statut: "Exception · attente RH", ageJours: 0, slaJours: 2,
    prefill: { matricule: "MAT-0195", nom: "Voary Toky", rattachement: "Achat", motif: "exception", dateDebut: "2026-06-02", dateFin: "2026-06-02", soldeRestant: "—" } },
];

const TYPE_META = {
  conge:   { label: "Congé",          color: "var(--accent)",  actionLabel: "Viser" },
  absence: { label: "Absence",        color: "var(--warn)",    actionLabel: "Viser" },
  stc:     { label: "STC · sortie",   color: "var(--err)",     actionLabel: "Viser RH" },
};

function sortByOverdueFirst(items) {
  return [...items].sort((a, b) => (b.ageJours - b.slaJours) - (a.ageJours - a.slaJours));
}

// HERO KPIS — calculés à partir des sources
const HERO_KPIS = (() => {
  const aViser = QUEUE_SEED.length;
  return [
    { id: "h1", label: "Demandes à viser",     value: aViser, unit: "objets · congés + STC", tone: "neutral", icon: "clipboard" },
    { id: "h2", label: "Cadence 1on1 P0/P1",   value: "11", unit: "/14 à jour · cycle Q3",   tone: "accent",  icon: "users", isCadence: true },
    { id: "h3", label: "Climat social pulse",  value: "72", unit: "% · semaine 21 · SYNTH",  tone: "warn",    icon: "spark", isPct: true },
  ];
})();

// SO Objectif 5 — Décisions tracées & clôturées (CO-OWNER Kenny+Édienne)
const SO_DATA = {
  code: "Objectif 5",
  title: "Décisions tracées & clôturées",
  subtitle: "Pacte TER · Co-owner Kenny + Édienne",
  q: "Q3",
};
const SO_KPI = {
  label: "% M13 P0/P1 clôturées",
  value: 76, target: 90, unit: "%",
  hint: "Décisions priorité P0/P1 fermées dans le cycle M13 · 12 semaines glissantes",
  series: [62, 64, 65, 67, 68, 69, 71, 72, 73, 74, 75, 76],
};

// RH & Climat (B17) — 3 cartes
const RH_CARDS = [
  {
    id: "climat", label: "Climat social hebdo", value: "72", unit: "%",
    sub: "Pulse 6 départements · S21", series: [65, 66, 68, 70, 69, 71, 72, 70, 71, 72, 71, 72],
    target: 75, status: "warn", synth: true,
    note: "Seul trou data RH · cadence hebdo Édienne",
  },
  {
    id: "effectifs", label: "Effectifs (agrégat)", value: "87", unit: "ETP",
    sub: "82 CDI · 5 CDD · 0 stagiaire", series: [83, 84, 84, 85, 85, 86, 86, 87, 87, 87, 87, 87],
    target: null, status: "ok", synth: false,
    note: "Agrégat anonymisé · jamais nominatif hors workspace",
  },
  {
    id: "turnover", label: "Turnover 12 mois", value: "8.0", unit: "%",
    sub: "7 départs / 87 ETP · sectoriel ≈10%", series: [12, 11, 11, 10, 10, 9, 9, 9, 8, 8, 8, 8],
    target: 10, status: "ok", synth: false, lowerIsBetter: true,
    note: "Agrégat B17 · cible ≤10%",
  },
];

// Signaux Pacte TER — pilote cross-département
const SIGNAUX_PACTE = [
  {
    id: "sig-1", icon: "spark",
    cause: "Pulse climat tendu : 1 département (Caisse Toamasina) à 2/5 · 2e semaine consécutive",
    levier: "Visite terrain + 1on1 ad-hoc avec le N+1 du département · check workload",
    gain: "Désamorce avant escalade · sécurise rétention et P3 Fidélité client",
    source: "Pulse climat S21 (agrégé)",
    priorite: "P1",
  },
  {
    id: "sig-2", icon: "clock",
    cause: "3 lieutenants en retard sur cadence 1on1 trimestrielle · cycle Q3 (anonymisé)",
    levier: "Bloquer 3 créneaux fixes calendrier d'ici S22 · ne pas reporter",
    gain: "Cadence 14/14 → SO·5 sécurisé · pacte TER respecté",
    source: "Cadence 1on1 P0/P1",
    priorite: "P0",
  },
  {
    id: "sig-3", icon: "alert",
    cause: "2 décisions M13 priorité P0 non clôturées depuis >21 jours",
    levier: "Co-revue Kenny+Édienne · escalade Haja si pas de clôture S22",
    gain: "Tient SO·5 à 90% · trace complète des décisions",
    source: "M13 backlog",
    priorite: "P0",
  },
  {
    id: "sig-4", icon: "check-circle",
    cause: "0 nouveau STC ouvert · routine sortie sous contrôle",
    levier: "Rester sur cadence préavis 30j + remise certificat J+1",
    gain: "Conformité Code du Travail 100% · 0 contentieux ouvert",
    source: "Routine RH",
    priorite: "P2",
  },
];

const CARNET = [
  { id: "c-1", date: "2026-05-27", type: "decision", text: "Cadence 1on1 Q3 = 14 sessions bloquées dans agenda · co-owner Kenny",                    source: "Édienne" },
  { id: "c-2", date: "2026-05-24", type: "escalade", text: "Pulse climat Caisse Toamasina à 2/5 · S20–S21 · escalade Haja pour visite terrain",       source: "Édienne" },
  { id: "c-3", date: "2026-05-20", type: "decision", text: "Mise en place pulse climat hebdo 6 départements · agrégé pour remontée Haja (B17)",        source: "Haja" },
  { id: "c-4", date: "2026-05-15", type: "decision", text: "Visa RH systématique sur tout STC après cash Haja · clôture pacte sortie",                source: "Édienne" },
];

// Scores perso Édienne (Onglet Scores)
const PERSO_KPIS = [
  { id: "E-K01", label: "Cadence 1on1 P0/P1",        value: 79, target: 95, status: "warn", series: [62, 65, 68, 70, 72, 73, 75, 76, 77, 78, 78, 79], unit: "%" },
  { id: "E-K02", label: "Délai visa congé (jours)",  value: "1.8", target: "≤2", status: "ok",  series: [3.2, 3.0, 2.8, 2.5, 2.3, 2.1, 2.0, 1.9, 2.0, 1.9, 1.8, 1.8], unit: "j", lowerIsBetter: true },
  { id: "E-K03", label: "Climat pulse hebdo",        value: 72, target: 75, status: "warn", series: [65, 66, 68, 70, 69, 71, 72, 70, 71, 72, 71, 72], unit: "%", synth: true },
  { id: "E-K04", label: "% M13 P0/P1 clôturées",     value: 76, target: 90, status: "warn", series: [62, 64, 65, 67, 68, 69, 71, 72, 73, 74, 75, 76], unit: "%", isSO: true },
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
  const nums = series.map((v) => typeof v === "number" ? v : parseFloat(v));
  const min = Math.min(...nums, target ? (typeof target === "number" ? target : parseFloat(target)) : Infinity) - 4;
  const max = Math.max(...nums, target ? (typeof target === "number" ? target : parseFloat(target)) : -Infinity) + 4;
  const range = Math.max(1, max - min);
  const stepX = width / (nums.length - 1);
  const points = nums.map((v, i) => [i * stepX, height - ((v - min) / range) * height]);
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const last = points[points.length - 1];
  const tNum = target != null ? (typeof target === "number" ? target : parseFloat(target)) : null;
  const targetY = tNum != null && !isNaN(tNum) ? height - ((tNum - min) / range) * height : null;
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
      padding: "20px 24px",
      background: focus ? "color-mix(in srgb, var(--accent) 10%, var(--surface))" : "var(--surface)",
      border: `1px solid ${focus ? "color-mix(in srgb, var(--accent) 45%, var(--border))" : "var(--border)"}`,
      borderRadius: 12,
      display: "flex", alignItems: "center", gap: 18, minWidth: 0,
    }}>
      <div style={{
        flexShrink: 0,
        padding: "8px 14px", borderRadius: 6,
        background: focus ? "var(--accent)" : "var(--pl-navy)",
        color: focus ? "var(--accent-fg)" : "var(--pl-cream)",
        fontFamily: "var(--font-mono)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em",
      }}>{p.short}</div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--fg-1)" }}>{p.name}</span>
          {focus && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", padding: "3px 9px", borderRadius: 4, background: "var(--accent)", color: "var(--accent-fg)", textTransform: "uppercase" }}>Focus</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--bg-elev-1)", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${p.score}%`,
              background: fillColor,
              transition: "width 500ms",
            }}/>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", minWidth: 42, textAlign: "right", lineHeight: 1 }}>{p.score}</span>
        </div>
      </div>
      <div style={{
        flexShrink: 0,
        width: 32, height: 32, borderRadius: 6, display: "grid", placeItems: "center",
        background: p.trend === "up" ? "var(--ok-soft)" : p.trend === "down" ? "var(--err-soft)" : "transparent",
        color: p.trend === "up" ? "var(--ok)" : p.trend === "down" ? "var(--err)" : "var(--fg-3)",
      }}>
        <AfIcon name={p.trend === "up" ? "trend-up" : p.trend === "down" ? "trend-down" : "trend-flat"} size={18}/>
      </div>
    </div>
  );
}

function PillarBar({ pillars }) {
  return (
    <div style={{ background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)", padding: "22px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
      <a href="Admin-Fi Haja.html" style={{ fontSize: 14, color: "var(--fg-3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content" }}>
        <AfIcon name="arrow-right" size={12} style={{ transform: "rotate(180deg)" }}/> Haja · Resp Admin & Fi
      </a>
      <div style={{ fontSize: 28, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", lineHeight: 1.15 }}>
        WORKSPACE ÉDIENNE <span style={{ color: "var(--accent)" }}>·</span> RH & PACTE TER
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "var(--err-soft)", color: "var(--err)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid color-mix(in srgb, var(--err) 28%, transparent)" }}>
          <AfIcon name="lock" size={11}/> B17 strict
        </span>
      </div>
      <div style={{ fontSize: 15, color: "var(--fg-3)", lineHeight: 1.5 }}>Congés · STC · climat · 1on1 · Pacte TER · B17 · drill-up Haja</div>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 6, marginTop: 6,
        background: "color-mix(in srgb, var(--err) 6%, var(--surface))",
        border: "1px dashed color-mix(in srgb, var(--err) 30%, var(--border))",
        color: "var(--err)", fontSize: 13, fontWeight: 500,
      }}>
        <AfIcon name="lock" size={13}/>
        Données nominatives RH · visibles Édienne uniquement (Loi 2014-038 · cf. Pacte TER §B17)
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 3 KPI Hero (top)
// ───────────────────────────────────────────────────────────
function HeroKpiCard({ k }) {
  const tone = k.tone === "danger"  ? { color: "var(--err)",    bg: "var(--err-soft)",    border: "color-mix(in srgb, var(--err) 30%, var(--border))" }
              : k.tone === "warn"    ? { color: "var(--warn)",  bg: "var(--warn-soft)",   border: "color-mix(in srgb, var(--warn) 30%, var(--border))" }
              : k.tone === "accent"  ? { color: "var(--accent)", bg: "var(--accent-soft)", border: "color-mix(in srgb, var(--accent) 30%, var(--border))" }
              :                        { color: "var(--fg-1)",   bg: "var(--bg-elev-1)",   border: "var(--border)" };
  return (
    <div style={{
      background: "var(--surface)", border: `1px solid ${tone.border}`,
      borderRadius: 12, padding: "22px 24px",
      display: "flex", alignItems: "center", gap: 18,
      position: "relative", overflow: "hidden",
    }}>
      {k.tone === "warn" && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--warn)" }}/>}
      <div style={{ width: 52, height: 52, borderRadius: 10, background: tone.bg, color: tone.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <AfIcon name={k.icon} size={26}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: "var(--fg-2)", fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 600, color: tone.color, letterSpacing: "-0.025em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
          {k.isPct && <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: tone.color, opacity: 0.7 }}>%</span>}
          <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--font-mono)", marginLeft: 6 }}>{k.unit}</span>
        </div>
      </div>
    </div>
  );
}

function HeroKpis() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
      {HERO_KPIS.map((k) => <HeroKpiCard key={k.id} k={k}/>)}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// SO Band — Objectif 5 · Décisions tracées & clôturées (variants A/B/C)
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

function CoOwnerChip() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "color-mix(in srgb, var(--pl-cream) 14%, transparent)", border: "1px solid color-mix(in srgb, var(--pl-cream) 22%, transparent)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--pl-cream)", fontWeight: 700, letterSpacing: "0.06em" }}>
      <AfIcon name="users" size={11}/> CO-OWNER · KENNY + ÉDIENNE
    </span>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 220, flex: "1 1 240px" }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.q} · OBJECTIF RATTACHÉ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ padding: "7px 15px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>{SO_DATA.code}</div>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--pl-teal-light)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Pacte TER</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: "var(--pl-cream)", letterSpacing: "-0.015em", lineHeight: 1.25 }}>{SO_DATA.title}</div>
        <CoOwnerChip/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 240, flex: "2 1 280px", borderLeft: "1px solid color-mix(in srgb, var(--pl-cream) 14%, transparent)", paddingLeft: 22 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 600, color: "var(--pl-teal-light)", lineHeight: 1, letterSpacing: "-0.03em" }}>{value}<span style={{ fontSize: 22, color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)" }}>%</span></span>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--pl-cream)" }}>{SO_KPI.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, position: "relative", height: 10, borderRadius: 999, background: "color-mix(in srgb, var(--pl-cream) 10%, transparent)", overflow: "visible" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, width: `${pct}%`, background: "var(--pl-teal-light)" }}/>
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
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Pacte TER</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.015em", lineHeight: 1.25 }}>{SO_DATA.title}</div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-2)", fontWeight: 700, letterSpacing: "0.06em", alignSelf: "flex-start" }}>
          <AfIcon name="users" size={11}/> CO-OWNER · Kenny + Édienne
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 240, flex: "2 1 260px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 56, fontWeight: 600, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.035em" }}>{value}<span style={{ fontSize: 24, color: "var(--fg-3)" }}>%</span></span>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)", marginLeft: 4 }}>{SO_KPI.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, position: "relative", height: 10, borderRadius: 999, background: "var(--bg-elev-1)" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, width: `${pct}%`, background: "var(--accent)" }}/>
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
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#soGradEd)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c * ratio} ${c}`} transform={`rotate(-90 ${size/2} ${size/2})`}/>
          <defs><linearGradient id="soGradEd" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="var(--accent)"/><stop offset="100%" stopColor="var(--pl-teal-light)"/></linearGradient></defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 42, fontWeight: 600, color: "var(--pl-cream)", lineHeight: 1, letterSpacing: "-0.03em" }}>{value}<span style={{ fontSize: 18, opacity: 0.6 }}>%</span></span>
          <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginTop: 2 }}>cible ≥{target}</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.q} · objectif rattaché</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{SO_DATA.code}</span>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--pl-teal-light)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>Pacte TER</span>
          <CoOwnerChip/>
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
// Action Bar — 4 boutons RH (Édienne)
// ───────────────────────────────────────────────────────────
function ActionButton({ label, onClick, variant }) {
  const colors = {
    primary: { bg: "var(--pl-navy)", fg: "var(--pl-cream)", hov: "color-mix(in srgb, var(--pl-navy) 86%, white)" },
    accent:  { bg: "var(--accent)",  fg: "var(--accent-fg)", hov: "color-mix(in srgb, var(--accent) 88%, white)" },
    ok:      { bg: "var(--ok)",      fg: "white", hov: "color-mix(in srgb, var(--ok) 88%, white)" },
    err:     { bg: "color-mix(in srgb, var(--err) 12%, var(--surface))", fg: "var(--err)", hov: "color-mix(in srgb, var(--err) 20%, var(--surface))", border: "1px solid color-mix(in srgb, var(--err) 40%, var(--border))" },
  }[variant || "primary"];
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, minWidth: 0, padding: "18px 20px", borderRadius: 10,
        background: hover ? colors.hov : colors.bg, color: colors.fg,
        border: colors.border || "none", cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 12,
        transition: "background 120ms", fontSize: 15, fontWeight: 600, letterSpacing: "-0.005em",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
      <AfIcon name="plus" size={20}/> {label}
    </button>
  );
}

function ActionBar({ onConge, onSTC, onClimat, on1on1 }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      padding: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12,
    }}>
      <ActionButton label="Viser congé (ref-002)" variant="accent"  onClick={onConge}/>
      <ActionButton label="Viser STC"             variant="err"     onClick={onSTC}/>
      <ActionButton label="Saisir climat hebdo"   variant="primary" onClick={onClimat}/>
      <ActionButton label="Tracer 1on1"           variant="ok"      onClick={on1on1}/>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// RH & CLIMAT block — 3 cartes B17
// ───────────────────────────────────────────────────────────
function RHCard({ k }) {
  const tone = k.status === "ok"   ? { color: "var(--ok)",   bg: "var(--ok-soft)",   label: "Stable" }
            : k.status === "warn"  ? { color: "var(--warn)", bg: "var(--warn-soft)", label: "À surveiller" }
            :                        { color: "var(--err)",  bg: "var(--err-soft)",  label: "Critique" };
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 16,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: tone.color }}/>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingLeft: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)" }}>{k.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {k.synth && <span className="confirm-badge">SYNTH</span>}
          <Chip color={tone.color} bg={tone.bg} border={`1px solid color-mix(in srgb, ${tone.color} 30%, transparent)`}>{tone.label}</Chip>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingLeft: 8, gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 42, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-3)" }}>{k.unit}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 6 }}>{k.sub}</div>
        </div>
        <Sparkline series={k.series} color={tone.color} target={k.target} width={130} height={40}/>
      </div>
      <div style={{ fontSize: 12, color: "var(--fg-3)", paddingLeft: 8, paddingTop: 10, borderTop: "1px dashed var(--border-soft)", display: "flex", alignItems: "center", gap: 8 }}>
        <AfIcon name="lock" size={12} color="var(--err)"/>{k.note}
      </div>
    </div>
  );
}

function RHBlock() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ width: 4, height: 20, background: "var(--accent)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>RH & Climat</h3>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, background: "var(--err-soft)", color: "var(--err)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid color-mix(in srgb, var(--err) 28%, transparent)" }}>
          <AfIcon name="lock" size={11}/> B17
        </span>
        <span style={{ fontSize: 14, color: "var(--fg-3)" }}>(scope Édienne · agrégé en remontée Haja)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {RH_CARDS.map((k) => <RHCard key={k.id} k={k}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Work Queue — "Demandes à viser"
// ───────────────────────────────────────────────────────────
const QUEUE_COLS = "32px 120px 160px 120px 170px 200px 220px 130px 1fr";

function QueueHeader() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: QUEUE_COLS, gap: 14,
      padding: "16px 20px",
      background: "var(--pl-navy)", color: "var(--pl-cream)",
      fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      alignItems: "center", minWidth: "max-content",
    }}>
      <span/>
      <span>Type</span>
      <span>Réf</span>
      <span>Matricule</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>Nom <AfIcon name="lock" size={10} color="var(--pl-teal-light)"/></span>
      <span>Rattachement</span>
      <span>Dates / durée</span>
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
        display: "grid", gridTemplateColumns: QUEUE_COLS, gap: 14,
        alignItems: "center", padding: "18px 20px",
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

      <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-2)", fontVariantNumeric: "tabular-nums" }}>{item.matricule}</span>

      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 15, color: "var(--fg-1)", fontWeight: 500 }}>
        {item.nom}
        <AfIcon name="lock" size={11} color="var(--err)"/>
      </span>

      <span style={{ fontSize: 14, color: "var(--fg-2)" }}>{item.rattachement}</span>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 14, color: "var(--fg-1)", fontWeight: 500 }}>{item.periode}</span>
        <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>{item.duree} · {item.statut}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: sla.color, fontVariantNumeric: "tabular-nums" }}>{item.ageJours}j</span>
        <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>/ {item.slaJours}j</span>
        {overdue && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--err)" }}/>}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={(e) => { e.stopPropagation(); onAction(item); }}
          style={{
            padding: "11px 20px", borderRadius: 8,
            background: meta.color === "var(--accent)" ? "var(--accent)" : meta.color === "var(--err)" ? "var(--err)" : meta.color === "var(--warn)" ? "var(--warn)" : "var(--pl-navy)",
            color: "white",
            border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}>{meta.actionLabel}</button>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>Demandes à viser</h3>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 999, background: "var(--err-soft)", color: "var(--err)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid color-mix(in srgb, var(--err) 28%, transparent)" }}>
            <AfIcon name="lock" size={10}/> B17 · nominatif
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {overdueCount > 0 && (
            <Chip color="var(--err)" bg="var(--err-soft)" border={`1px solid color-mix(in srgb, var(--err) 30%, transparent)`}>
              <AfIcon name="alert" size={12} color="var(--err)"/> {overdueCount} en attente
            </Chip>
          )}
          <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{items.length} demande(s) · tri en attente d'abord</span>
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
// Signaux Pacte TER
// ───────────────────────────────────────────────────────────
const PRIORITE_TONE = {
  P0: { color: "var(--err)",  bg: "var(--err-soft)" },
  P1: { color: "var(--warn)", bg: "var(--warn-soft)" },
  P2: { color: "var(--ok)",   bg: "var(--ok-soft)" },
};

function SignalCard({ sig }) {
  const tone = PRIORITE_TONE[sig.priorite];
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      padding: "22px 24px", display: "flex", gap: 18, alignItems: "flex-start",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: tone.color }}/>
      <div style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0, background: tone.bg, color: tone.color, display: "grid", placeItems: "center", border: `1px solid color-mix(in srgb, ${tone.color} 25%, transparent)` }}>
        <AfIcon name={sig.icon} size={24}/>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ padding: "3px 10px", borderRadius: 4, background: tone.bg, color: tone.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>{sig.priorite}</span>
          <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>{sig.source}</span>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Cause</div>
          <div style={{ fontSize: 15, color: "var(--fg-1)", lineHeight: 1.5, fontWeight: 500 }}>{sig.cause}</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6, color: "var(--accent)" }}>Levier</div>
          <div style={{ fontSize: 14, color: "var(--fg-2)", lineHeight: 1.55 }}>{sig.levier}</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6, color: "var(--ok)" }}>Gain</div>
          <div style={{ fontSize: 14, color: "var(--fg-2)", lineHeight: 1.55 }}>{sig.gain}</div>
        </div>
      </div>
    </div>
  );
}

function SignauxBlock({ signaux }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ width: 4, height: 20, background: "var(--accent)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>Signaux · Pacte TER pulse</h3>
        <span style={{ fontSize: 14, color: "var(--fg-3)" }}>(pilote cross-département · cause → levier → gain)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
        {signaux.map((s) => <SignalCard key={s.id} sig={s}/>)}
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
      <div style={{ padding: 14, borderTop: "1px solid var(--border-soft)", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>Design System D82</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--err)", display: "flex", alignItems: "center", gap: 6 }}>
          <AfIcon name="lock" size={11} color="var(--err)"/> B17 · scope nominatif Édienne
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--warn)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
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
        <span style={{ fontSize: 18, fontWeight: 700, color: "var(--pl-teal-light)" }}>Édienne</span>
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
        <span style={{ fontSize: 13, color: "color-mix(in srgb, var(--pl-cream) 65%, transparent)", fontFamily: "var(--font-mono)" }}>27 mai 2026</span>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--pl-teal)", display: "grid", placeItems: "center", color: "var(--pl-navy-deep)", fontWeight: 700, fontSize: 15 }}>É</div>
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
// Drill-up Haja banner — bas de page (rappel B17 agrégat)
// ───────────────────────────────────────────────────────────
function DrillUpHaja() {
  return (
    <div style={{
      background: "linear-gradient(135deg, color-mix(in srgb, var(--pl-navy) 96%, transparent) 0%, color-mix(in srgb, var(--pl-navy-deep) 96%, transparent) 100%)",
      color: "var(--pl-cream)",
      borderRadius: 12, padding: "18px 22px",
      border: "1px solid color-mix(in srgb, var(--pl-cream) 12%, transparent)",
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "1 1 280px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "color-mix(in srgb, var(--accent) 18%, transparent)", color: "var(--pl-teal-light)", display: "grid", placeItems: "center", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)" }}>
          <AfIcon name="arrow-right" size={18} style={{ transform: "rotate(-90deg)" }}/>
        </div>
        <div>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>Remontée Haja</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>Carte Édienne · agrégat B17 uniquement</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: "1 1 320px" }}>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "color-mix(in srgb, var(--pl-cream) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--pl-cream) 14%, transparent)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Score</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--pl-cream)", letterSpacing: "-0.02em" }}>72</span>
          <AfIcon name="trend-up" size={14} color="var(--ok)"/>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "color-mix(in srgb, var(--pl-cream) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--pl-cream) 14%, transparent)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Climat</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--pl-cream)" }}>72%</span>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "color-mix(in srgb, var(--pl-cream) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--pl-cream) 14%, transparent)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Cadence</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--pl-cream)" }}>11/14</span>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "color-mix(in srgb, var(--err) 22%, transparent)", border: "1px solid color-mix(in srgb, var(--err) 45%, transparent)", display: "flex", alignItems: "center", gap: 8 }}>
          <AfIcon name="lock" size={12} color="#FFB4A3"/>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#FFB4A3", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>0 nominatif</span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Scores Tab
// ───────────────────────────────────────────────────────────
function ScoresTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
        {PERSO_KPIS.map((k) => {
          const tone = k.status === "ok"   ? { c: "var(--ok)",   bg: "var(--ok-soft)",   label: "Atteint" }
                    : k.status === "warn"  ? { c: "var(--warn)", bg: "var(--warn-soft)", label: "À surveiller" }
                    :                        { c: "var(--err)",  bg: "var(--err-soft)",  label: "Sous cible" };
          return (
            <div key={k.id} style={{
              background: "var(--surface)", border: `1px solid var(--border)`,
              borderRadius: 12, padding: 18, position: "relative", overflow: "hidden",
              boxShadow: "var(--shadow-1)",
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: tone.c }}/>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, paddingLeft: 6 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", fontWeight: 700, letterSpacing: "0.06em" }}>{k.id}</span>
                    {k.isSO && <span style={{ padding: "1px 6px", borderRadius: 4, background: "var(--accent-soft)", color: "var(--accent)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>SO·5</span>}
                    {k.synth && <span className="confirm-badge">SYNTH</span>}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)", marginTop: 4, lineHeight: 1.3 }}>{k.label}</div>
                </div>
                <Chip color={tone.c} bg={tone.bg} border={`1px solid color-mix(in srgb, ${tone.c} 30%, transparent)`}>{tone.label}</Chip>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14, paddingLeft: 6 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 600, color: tone.c, lineHeight: 1, letterSpacing: "-0.03em" }}>{k.value}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-3)" }}>{k.unit}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)", marginLeft: 10 }}>cible {k.target}{k.unit !== "j" && k.unit ? k.unit : ""}</span>
                </div>
                <Sparkline series={k.series} color={tone.c} target={typeof k.target === "string" && k.target.startsWith("≤") ? parseFloat(k.target.slice(1)) : k.target} width={130} height={36}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Détail tendance E-K04 (SO5) + zoom climat */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, boxShadow: "var(--shadow-1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "0.01em" }}>Tendance · % M13 P0/P1 clôturées</h3>
          <span style={{ padding: "2px 8px", borderRadius: 4, background: "var(--accent-soft)", color: "var(--accent)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>SO·5</span>
        </div>
        <Sparkline series={PERSO_KPIS[3].series} color="var(--warn)" target={90} width={1000} height={120}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)" }}>
          <span>S-11</span><span>S-9</span><span>S-7</span><span>S-5</span><span>S-3</span><span>S-1</span><span>auj.</span>
        </div>
        <div style={{ marginTop: 16, padding: 12, background: "var(--bg-elev-1)", borderRadius: 8, fontSize: 13, color: "var(--fg-2)" }}>
          <strong style={{ color: "var(--fg-1)" }}>Lecture</strong> — Tendance ascendante : +14 pts sur 12 semaines. 2 décisions P0 toujours non clôturées depuis &gt;21 jours → co-revue Kenny+Édienne nécessaire pour fermer l'écart à la cible 90%.
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
  const fonctions = [
    "RH · congés, STC, absences (visa final)",
    "Pacte TER · co-owner avec Kenny",
    "Cadence 1on1 lieutenants · 14 sessions / trimestre",
    "Pulse climat hebdo · 6 départements",
    "B17 strict · accès nominatif RH",
  ];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 26, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent) 0%, var(--pl-navy) 100%)", display: "grid", placeItems: "center", color: "white", fontSize: 40, fontWeight: 600 }}>É</div>
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.015em" }}>Édienne</div>
          <div style={{ fontSize: 14, color: "var(--fg-3)" }}>Admin-Fi · Exécutant N4 spéciale · RH & Pacte TER · drill-up Haja</div>
        </div>
        <div className="label">Fonctions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {fonctions.map((f) => <Chip key={f} color="var(--fg-1)" bg="var(--bg-elev-1)">{f}</Chip>)}
        </div>
        <div className="label" style={{ marginTop: 8 }}>Périmètre B17</div>
        <div style={{ padding: 12, background: "color-mix(in srgb, var(--err) 6%, var(--bg-elev-1))", border: "1px dashed color-mix(in srgb, var(--err) 30%, var(--border))", borderRadius: 8, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AfIcon name="lock" size={16} color="var(--err)"/>
          <div>
            <strong style={{ color: "var(--fg-1)" }}>Loi 2014-038 + Pacte TER §B17</strong> — toutes les données nominatives RH (matricule, nom, motif, montant STC) sont visibles depuis ce workspace UNIQUEMENT. La remontée Haja est strictement agrégée et anonymisée.
          </div>
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

  // 4 modales
  const [openConge, setOpenConge] = useState(false);
  const [openSTC, setOpenSTC] = useState(false);
  const [openClimat, setOpenClimat] = useState(false);
  const [open1on1, setOpen1on1] = useState(false);

  // Prefill pour les modales lancées depuis la file
  const [prefillConge, setPrefillConge] = useState(null);
  const [prefillSTC, setPrefillSTC] = useState(null);

  const pushToast = (title, subtitle) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((p) => [...p, { id, title, subtitle }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5200);
  };
  const closeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const removeFromQueue = (id) => setQueue((prev) => sortByOverdueFirst(prev.filter((it) => it.id !== id)));

  const LIEUTENANTS_PACTE_LABEL = {
    sarobidy: "Sarobidy", belaza: "Belaza", christine: "Christine", facturation: "Facturation", haja: "Haja",
  };

  // Submits
  const onCongeSubmit = (data) => {
    setOpenConge(false);
    pushToast(`✓ Congé visé · ${data.matricule || "MAT-?"}`, `${data.dureeJours || "?"} j · ${data.dateDebut || "?"} → ${data.dateFin || "?"} · clôture RH`);
    if (prefillConge?.id) removeFromQueue(prefillConge.id);
    setPrefillConge(null);
  };
  const onSTCSubmit = (data) => {
    setOpenSTC(false);
    pushToast(`✓ STC visé RH · ${data.matricule || "MAT-?"}`, `Rupture ${data.dateRupture || "?"} · clôture pacte sortie B17`);
    if (prefillSTC?.id) removeFromQueue(prefillSTC.id);
    setPrefillSTC(null);
  };
  const onClimatSubmit = (data) => {
    setOpenClimat(false);
    pushToast(`✓ Pulse climat ${data.semaine || "—"} enregistré`, `Moyenne ${data.moyenne}/5 · agrégé pour Haja`);
  };
  const on1on1Submit = (data) => {
    setOpen1on1(false);
    pushToast(`✓ 1on1 tracé · ${LIEUTENANTS_PACTE_LABEL[data.lieutenant] || data.lieutenant}`, `${data.sujets.length} sujet(s) · ${data.m13 ? "M13 actif" : "M13 désactivé"}`);
  };

  const handleQueueAction = (item) => {
    if (item.type === "conge" || item.type === "absence") {
      setPrefillConge({ id: item.id, ...item.prefill });
      setOpenConge(true);
    } else if (item.type === "stc") {
      setPrefillSTC({ id: item.id, ...item.prefill });
      setOpenSTC(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg-1)", display: "flex", flexDirection: "column" }} data-screen-label="Admin-Fi Édienne Workspace">
      <Header theme={theme} onTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")}/>
      <SimulationBanner/>
      <PillarBar pillars={PILLARS_DATA}/>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar active={tab} onTab={setTab}/>

        <main style={{ flex: 1, overflow: "auto", padding: "32px 28px" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
            {tab === "vue" && (
              <>
                <WorkspaceHeader/>
                <HeroKpis/>
                <ObjectiveBand/>
                <ActionBar
                  onConge={() => { setPrefillConge(null); setOpenConge(true); }}
                  onSTC={() => { setPrefillSTC(null); setOpenSTC(true); }}
                  onClimat={() => setOpenClimat(true)}
                  on1on1={() => setOpen1on1(true)}
                />
                <RHBlock/>
                <WorkQueue items={queue} onAction={handleQueueAction}/>
                <SignauxBlock signaux={SIGNAUX_PACTE}/>
                <DrillUpHaja/>
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
        <span>LOI · Admin-Fi Édienne · exécutant N4 spéciale · RH & Pacte TER</span>
        <span>CockpitLayout V2 · D82 · B17 strict · Digital Twin V3</span>
      </footer>

      <Toast items={toasts} onClose={closeToast}/>

      <CongeVisaModal     open={openConge}  onClose={() => { setOpenConge(false); setPrefillConge(null); }} onSubmit={onCongeSubmit}  prefill={prefillConge}/>
      <STCVisaRHModal     open={openSTC}    onClose={() => { setOpenSTC(false);   setPrefillSTC(null); }}   onSubmit={onSTCSubmit}    prefill={prefillSTC}/>
      <ClimatHebdoModal   open={openClimat} onClose={() => setOpenClimat(false)}                            onSubmit={onClimatSubmit}/>
      <OneOnOneTraceModal open={open1on1}   onClose={() => setOpen1on1(false)}                              onSubmit={on1on1Submit}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
