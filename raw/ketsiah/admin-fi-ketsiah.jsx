/* global React, ReactDOM, AfIcon, DdvValidateModal */
// ════════════════════════════════════════════════════════════════
// LOI · COCKPIT KETSIAH — CFO N2 · Premium Logistics · PL
// 1 lieutenant : Haja (Resp Admin & Fi) · drill-up Kenny CEO
// Ossature D82 · 5 onglets · zéro nominatif RH (B17 agrégat)
// ════════════════════════════════════════════════════════════════
const { useState, useEffect, useMemo, useRef } = React;

// ───────────────────────────────────────────────────────────
// DATA
// ───────────────────────────────────────────────────────────
const PILLARS_DATA = [
  { id: "p1", short: "P1", name: "Exécution & discipline", score: 78, trend: "up",     delta: "+4" },
  { id: "p2", short: "P2", name: "Cash & rentabilité",     score: 65, trend: "down",   delta: "−6", isFocus: true, owne: "Obj. 1" },
  { id: "p3", short: "P3", name: "Fidélité client",        score: 82, trend: "stable", delta: "±0", watch: "concentration" },
  { id: "p4", short: "P4", name: "Fluidité",               score: 71, trend: "up",     delta: "+2", watch: "marge" },
];

// SO·1 OWNER — Ketsiah owne P2/Obj1 (trajectoire seulement, pas le détail 6 banques)
const SO_DATA = {
  code: "Objectif 1", q: "Q3",
  title: "Conversion en cash · cash net en hausse, dette en baisse",
  subtitle: "Owner CFO · co-mention SO·2",
};
const SO_DSO = {
  label: "DSO global", value: 68, target: 60, unit: "j",
  hint: "Trajectoire 12 semaines · cible ≤60 j",
  series: [76, 75, 73, 72, 71, 70, 70, 69, 69, 68, 68, 68],
};
const SO_BGFI = {
  label: "Dette BGFI · trajectoire", value: 22, target: 50, unit: "%",
  hint: "Réduction depuis pic · cible ≥−50 %",
  series: [0, 2, 4, 6, 8, 10, 12, 14, 17, 19, 21, 22],
};

// 3 KPI hero — synthèse top
const HERO_KPIS = [
  { id: "h1", label: "Marge consolidée",       value: "25,4", unit: "%",     sub: "cible 28 % · écart −2,6 pts",      icon: "pillar-cash", tone: "warn" },
  { id: "h2", label: "Cash net disponible",    value: "1,33", unit: "Md MGA", sub: "synthèse · détail chez Haja",       icon: "diamond",     tone: "neutral" },
  { id: "h3", label: "DDV en attente CFO",     value: "2",    unit: "objets", sub: "seuil >5 M ou cross-threshold",     icon: "clipboard",   tone: "err" },
];

// ★ FOCALE CFO — ce que Haja n'a PAS (sa propriété)
const FOCALE_CFO = [
  {
    id: "marge-cons",
    label: "Marge consolidée",
    value: "25,4", unit: "%", target: "28 %",
    series: [22, 22, 23, 23, 24, 24, 25, 25, 25, 25, 25.2, 25.4],
    status: "warn", icon: "pillar-cash",
    sub: "12 sem · écart −2,6 pts vs cible",
  },
  {
    id: "marge-dept",
    label: "Marge par département",
    value: "5", unit: "dépts", target: "BAKED",
    series: [28, 27, 26, 26, 25, 25, 24, 25, 25, 25, 25, 25],
    status: "warn", icon: "step-matrice", baked: true,
    sub: "Source à fiabiliser · 3/5 sous cible",
    detail: [
      { dept: "Transit",     v: "31 %", t: "29 %", ok: true  },
      { dept: "Caisse",      v: "24 %", t: "26 %", ok: false },
      { dept: "Achat",       v: "28 %", t: "27 %", ok: true  },
      { dept: "Direction",   v: "22 %", t: "28 %", ok: false },
      { dept: "Admin-Fi",    v: "21 %", t: "26 %", ok: false },
    ],
  },
  {
    id: "budget",
    label: "Budget vs estimé",
    value: "+3,8", unit: "%", target: "≤±2 %",
    series: [1.2, 1.5, 1.8, 2.0, 2.4, 2.7, 2.9, 3.2, 3.4, 3.6, 3.7, 3.8],
    status: "warn", icon: "chart",
    sub: "Dérive depuis S-7 · OPEX support",
  },
  {
    id: "turnover",
    label: "Turnover agrégé · B17",
    value: "8,0", unit: "%", target: "≤10 %",
    series: [12, 11, 11, 10, 10, 9, 9, 9, 8, 8, 8, 8],
    status: "ok", icon: "users", b17: true,
    sub: "Agrégat · jamais nominatif",
  },
];

// DDV À VALIDER · seuil CFO — 2 objets (cross-threshold)
const DDV_LIST = [
  {
    id: "ddv-2210", ref: "DDV-2210", fournisseur: "PC · Penta-Cargo",
    nature: "Avance fournisseur · pièces mécaniques manutention",
    montant: "3,4 M MGA", montantNum: 3.4,
    niveau: "Cross-threshold · concentration ≥2M sur même fournisseur (mois)",
    cross: "Concentration ≥2 M / mois",
    demandeur: "Haja", dept: "Admin-Fi",
    sla: "2 j / 3 j", slaTone: "warn",
    actor: "cfo-001",
  },
  {
    id: "ddv-2213", ref: "DDV-2213", fournisseur: "NS-ENTREPRISES",
    nature: "Crédit fournisseur 45 j · maintenance bâtiment",
    montant: "1,8 M MGA", montantNum: 1.8,
    niveau: "Cross-threshold · délai >30 j sur fournisseur non listé",
    cross: "Délai 45 j > 30 j",
    demandeur: "Haja", dept: "Admin-Fi",
    sla: "1 j / 2 j", slaTone: "ok",
    actor: "cfo-001",
  },
];

// SYNTHÈSE HAJA — 1 lieutenant · composite D54
const HAJA_SYNTH = {
  nom: "Haja",
  role: "Resp Admin & Finance",
  avatar: "H",
  score: 72,
  trend: "up",
  delta30: "+3 pts",
  drill: "Admin-Fi Haja.html",
  metricLabel: "5 lieutenants pilotés",
  metric: "F · S · É · B · C",
  seriesScore: [66, 67, 68, 68, 69, 69, 70, 70, 71, 71, 72, 72],
  sub: [
    { label: "Charge",         v: 78, hint: "DDV file + clôture J+8" ,            status: "warn" },
    { label: "Signaux 7j",     v: 14, hint: "5 lieutenants agrégés",                status: "warn" },
    { label: "Résolution",     v: 72, hint: "Décisions Haja clos sous SLA",         status: "warn" },
    { label: "Santé team",     v: 70, hint: "B17 agrégé · 0 nominatif",             status: "warn" },
    { label: "Alignement TER", v: 82, hint: "Cadence 1on1 OK · pacte respecté",     status: "ok"   },
  ],
};

// Alertes Haja — UNIQUEMENT signaux qui CHANGENT DE NATURE (pattern structurel récurrent)
const ALERTES_HAJA = [
  {
    id: "ah-1",
    nature: "Pattern structurel",
    pat: "Mining 5 clients ≥45 j depuis 3 semaines · DSO ne baisse plus malgré relances Sarobidy",
    coaching: "Donner mandat Haja pour rappel direction Ketsiah → CEO mining clients · co-arbitrage commercial",
    priorite: "P0",
    source: "F-K01 DSO · Sarobidy",
    icon: "alert",
  },
  {
    id: "ah-2",
    nature: "Pattern structurel",
    pat: "Marge mini PDJV sous seuil 7 % sur 4 semaines consécutives · 5,2 % validé en arbitrage isolé · risque normalisation",
    coaching: "Imposer revue marge mensuelle pre-facturation · poser règle écrite (pas exception)",
    priorite: "P0",
    source: "F-K07 PDJV · Facturation",
    icon: "spark",
  },
  {
    id: "ah-3",
    nature: "Saturation N3",
    pat: "Clôture mensuelle J+8 récurrente malgré actions Belaza · plafond capacitaire atteint",
    coaching: "Coaching cadence Haja · revoir délégation Belaza ou doubler ressource Q4",
    priorite: "P1",
    source: "F-K03 Clôture · Belaza",
    icon: "clock",
  },
];

// Concentration client — LECTURE SEULE (owner CEO/SO·4)
const CONCENTRATION = {
  client: "PENTA · Premier client mining",
  share: 28.5, target: 25,
  series: [24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 28.5, 28.5],
  owner: "CEO · SO·4",
  caveat: "Lecture seule depuis CFO · action chez Kenny",
};

// Conformité & DPO
const CONFORMITE = [
  { id: "c-1", label: "DPA signé",            value: "OK",        status: "ok",   sub: "Loi 2014-038 · v2.1 signée 12 mai 2026" },
  { id: "c-2", label: "PII active · scope",   value: "B17",       status: "warn", sub: "Périmètre RH · matricule + STC isolés" },
  { id: "c-3", label: "Audit Q2",             value: "juin 2026", status: "warn", sub: "Préparation dossier · 18 juin" },
];

// Rail droit
const CASH_NET = { value: "1,33", unit: "Md MGA", hint: "Synthèse · 6 banques", target: "≥2 Md MGA" };

const WHATIF_PRESETS = [
  { id: "w-0", label: "Baseline",                       deltaCash: 0,     desc: "Aucun arbitrage simulé" },
  { id: "w-1", label: "Recouvrement mining +30 j",     deltaCash: -180, desc: "DSO mining glisse · −180 M MGA" },
  { id: "w-2", label: "PENTA encaisse comptant Q3",    deltaCash: +420, desc: "−15 j sur 1 gros client · +420 M" },
  { id: "w-3", label: "Refus DDV-2210 (PC)",           deltaCash: +3.4, desc: "Réinjection trésorerie immédiate" },
  { id: "w-4", label: "BGFI réduction objectif −50 %", deltaCash: +890, desc: "Atteint cible Obj 1 · +890 M" },
];

// Scores onglet — F-K01..F-K04 + marge + co SO·2 facturé<72h
// FIX libellés : O2-K01 = % facturé · O2-K02 = délai moyen jours
const PERSO_KPIS = [
  { id: "F-K01", label: "DSO global",               value: 68,    target: 60,   invert: true, status: "warn", series: [76, 75, 73, 72, 71, 70, 70, 69, 69, 68, 68, 68], unit: "j",  isSO1: true, source: "Sarobidy" },
  { id: "F-K02", label: "Dette BGFI réduction",     value: 22,    target: 50,                  status: "warn", series: [0, 2, 4, 6, 8, 10, 12, 14, 17, 19, 21, 22],     unit: "%",  isSO1: true, source: "Belaza" },
  { id: "F-K04", label: "Recouvrement effectif",    value: 89,    target: 95,                  status: "warn", series: [82, 83, 84, 85, 86, 87, 88, 88, 89, 89, 89, 89], unit: "%", source: "Sarobidy" },
  { id: "F-MG",  label: "Marge consolidée",         value: "25,4", target: 28,                 status: "warn", series: [22, 22, 23, 23, 24, 24, 25, 25, 25, 25, 25.2, 25.4], unit: "%", owne: true, source: "CFO" },
  { id: "O2-K01", label: "% NoDos → Facture <72h",  value: 78,    target: 90,                  status: "warn", series: [68, 70, 72, 71, 74, 73, 75, 76, 75, 77, 78, 78], unit: "%", coSO2: true, source: "Facturation" },
  { id: "O2-K02", label: "Délai moyen NoDos → Facture", value: "3,1", target: "≤2", invert: true, status: "warn", series: [4.5, 4.2, 4.0, 3.9, 3.7, 3.6, 3.4, 3.3, 3.2, 3.1, 3.1, 3.1], unit: "j", coSO2: true, source: "Facturation" },
];

// Carnet de bord — décisions CFO (datées ≤ 27 mai 2026)
const CARNET = [
  { id: "c-1", date: "2026-05-27", type: "decision", text: "DDV-2210 PC 3,4 M MGA · validée sous condition revue mensuelle concentration fournisseur", source: "Ketsiah" },
  { id: "c-2", date: "2026-05-26", type: "decision", text: "Arbitrage marge AMBATOVY accepté à 5,2 % · règle exception · pas reconductible",            source: "Ketsiah → Haja" },
  { id: "c-3", date: "2026-05-24", type: "escalade", text: "Pattern mining 5 clients ≥45 j · mandat Haja pour rappel direction CEO · S-22",              source: "Sarobidy → Haja → Ketsiah" },
  { id: "c-4", date: "2026-05-20", type: "decision", text: "Cible BGFI −50 % réaffirmée pour clôture Q3 · trajectoire +1 pt/sem",                          source: "Ketsiah" },
  { id: "c-5", date: "2026-05-18", type: "decision", text: "Cross-threshold DDV : concentration fournisseur ≥2 M/mois → escalade CFO automatique",        source: "Ketsiah" },
];

// Assistant — copilote CFO · conversation seed
const ASSISTANT_SEED = [
  { who: "assistant", text: "Bonjour Ketsiah. 2 DDV en attente CFO (cross-threshold). La marge consolidée recule à 25,4 % (cible 28 %). Marge par département à fiabiliser. Tu veux qu'on prépare ta revue marge mensuelle ?" },
  { who: "user",      text: "Donne-moi d'abord le pattern mining · explique pourquoi le DSO ne baisse plus." },
  { who: "assistant", text: "5 clients mining ≥45 j (PENTA, MIB-Mada, GO-Mada, IRT, Holcim) cumulent 35 M MGA d'encours. Sarobidy relance hebdo mais aucun n'a payé sur 3 semaines glissantes — c'est devenu structurel, pas opérationnel. Recommandation : mandat Haja pour rappel direction CEO sur les 2 plus gros (PENTA + MIB-Mada = 22 M)." },
  { who: "user",      text: "Et la marge par département — pourquoi BAKED ?" },
  { who: "assistant", text: "La source agrège 4 reports manuels Belaza + 1 export Facturation. Pas de réconciliation auto. Avant de prendre une décision marge, exiger pipeline data fiable (cible Q3). En l'état · indicatif." },
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
      fontSize: 12, fontWeight: 600,
      fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
      fontVariantNumeric: mono ? "tabular-nums" : "normal",
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function statusTone(s) {
  if (s === "ok")    return { color: "var(--ok)",    bg: "var(--ok-soft)",    label: "À jour" };
  if (s === "warn")  return { color: "var(--warn)",  bg: "var(--warn-soft)",  label: "À surveiller" };
  if (s === "err")   return { color: "var(--err)",   bg: "var(--err-soft)",   label: "Sous cible" };
  if (s === "neutral") return { color: "var(--fg-1)", bg: "var(--bg-elev-1)",  label: "Synthèse" };
  return                  { color: "var(--fg-2)",   bg: "var(--bg-elev-1)",  label: "" };
}

function Sparkline({ series, color, target, width = 120, height = 36, fill = true }) {
  if (!series || series.length === 0) return null;
  const nums = series.map((v) => typeof v === "number" ? v : parseFloat(v));
  const tNum = target != null ? (typeof target === "number" ? target : parseFloat(target)) : null;
  const min = Math.min(...nums, tNum != null && !isNaN(tNum) ? tNum : Infinity) - 2;
  const max = Math.max(...nums, tNum != null && !isNaN(tNum) ? tNum : -Infinity) + 2;
  const range = Math.max(1, max - min);
  const stepX = width / (nums.length - 1);
  const points = nums.map((v, i) => [i * stepX, height - ((v - min) / range) * height]);
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const last = points[points.length - 1];
  const targetY = tNum != null && !isNaN(tNum) ? height - ((tNum - min) / range) * height : null;
  const gid = `g-${Math.random().toString(36).slice(2, 7)}`;
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      {targetY != null && <line x1="0" y1={targetY} x2={width} y2={targetY} stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="3 3" opacity="0.45"/>}
      {fill && <path d={area} fill={`url(#${gid})`}/>}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} stroke="var(--surface)" strokeWidth="2"/>
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
// Chrome — topbar + simulation banner + pillar bar
// ───────────────────────────────────────────────────────────
function Topbar({ theme, onTheme }) {
  return (
    <header style={{
      background: "var(--pl-navy-deep)", color: "var(--pl-cream)",
      padding: "14px 28px",
      borderBottom: "1px solid color-mix(in srgb, var(--pl-cream) 8%, var(--pl-navy-deep))",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", letterSpacing: "0.06em", fontWeight: 700, textTransform: "uppercase" }}>Direction</span>
        <span style={{ color: "var(--pl-teal)", opacity: 0.6 }}>·</span>
        <span style={{ fontSize: 17, fontWeight: 700, color: "var(--pl-cream)", letterSpacing: "-0.01em" }}>Ketsiah</span>
        <Chip color="var(--pl-teal-light)" bg="color-mix(in srgb, var(--pl-teal) 20%, transparent)" border="1px solid color-mix(in srgb, var(--pl-teal-light) 30%, transparent)">
          Premium Logistics
        </Chip>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", letterSpacing: "0.08em", fontWeight: 700, textTransform: "uppercase",
          padding: "3px 8px", borderRadius: 4, background: "color-mix(in srgb, var(--accent) 22%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)" }}>
          CFO · N2
        </span>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", letterSpacing: "0.08em", fontWeight: 700, textTransform: "uppercase",
          padding: "3px 8px", borderRadius: 4, background: "color-mix(in srgb, var(--pl-cream) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--pl-cream) 18%, transparent)" }}>
          PL
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onTheme}
          style={{
            padding: "6px 12px", borderRadius: 6,
            background: "transparent", color: "var(--pl-cream)",
            border: "1px solid color-mix(in srgb, var(--pl-cream) 20%, transparent)",
            fontSize: 11, cursor: "pointer", fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.08em",
          }}>{theme === "dark" ? "DARK" : "LIGHT"}</button>
        <span style={{ fontSize: 12, color: "color-mix(in srgb, var(--pl-cream) 65%, transparent)", fontFamily: "var(--font-mono)" }}>27 mai 2026</span>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--pl-navy))", display: "grid", placeItems: "center", color: "var(--pl-cream)", fontWeight: 700, fontSize: 15 }}>K</div>
      </div>
    </header>
  );
}

function SimulationBanner() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 20px",
      background: "color-mix(in srgb, var(--warn) 16%, transparent)",
      borderBottom: "1px solid color-mix(in srgb, var(--warn) 30%, var(--border))",
      color: "var(--warn)",
      fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.08em",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--warn)", animation: "kPulse 1.6s ease-out infinite" }}/>
      [SIMULATION · DIGITAL TWIN V3 · DONNÉES SYNTHÉTIQUES COHÉRENTES]
    </div>
  );
}

function PillarCard({ p }) {
  const focus = p.isFocus;
  const fillColor = focus ? "var(--accent)" : (p.trend === "down" ? "var(--err)" : "var(--pl-navy)");
  return (
    <div style={{
      padding: "18px 22px",
      background: focus ? "color-mix(in srgb, var(--accent) 12%, var(--surface))" : "var(--surface)",
      border: `1px solid ${focus ? "color-mix(in srgb, var(--accent) 50%, var(--border))" : "var(--border)"}`,
      borderRadius: 14,
      boxShadow: focus ? "0 0 0 1px color-mix(in srgb, var(--accent) 25%, transparent)" : "var(--shadow-1)",
      display: "flex", alignItems: "center", gap: 16, minWidth: 0,
    }}>
      <div style={{
        flexShrink: 0, padding: "8px 14px", borderRadius: 8,
        background: focus ? "var(--accent)" : "var(--pl-navy)",
        color: focus ? "var(--accent-fg)" : "var(--pl-cream)",
        fontFamily: "var(--font-mono)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em",
      }}>{p.short}</div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)", letterSpacing: "-0.005em" }}>{p.name}</span>
          {focus && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", padding: "3px 8px", borderRadius: 4, background: "var(--accent)", color: "var(--accent-fg)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>OWNE · {p.owne}</span>}
          {p.watch && !focus && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", padding: "3px 8px", borderRadius: 4, background: "var(--warn-soft)", color: "var(--warn)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>WATCH · {p.watch}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 7, borderRadius: 999, background: "var(--bg-elev-1)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${p.score}%`, background: fillColor, transition: "width 500ms" }}/>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums", minWidth: 40, textAlign: "right", lineHeight: 1 }}>{p.score}</span>
        </div>
      </div>
      <div style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center",
        background: p.trend === "up" ? "var(--ok-soft)" : p.trend === "down" ? "var(--err-soft)" : "var(--bg-elev-1)",
        color: p.trend === "up" ? "var(--ok)" : p.trend === "down" ? "var(--err)" : "var(--fg-3)",
      }}>
        <AfIcon name={p.trend === "up" ? "trend-up" : p.trend === "down" ? "trend-down" : "trend-flat"} size={16}/>
      </div>
    </div>
  );
}

function PillarBar() {
  return (
    <div style={{ background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)", padding: "22px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {PILLARS_DATA.map((p) => <PillarCard key={p.id} p={p}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Workspace header
// ───────────────────────────────────────────────────────────
function CockpitHeader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 4 }}>
      <a href="#" onClick={(e) => e.preventDefault()}
        style={{
          fontSize: 13, color: "var(--accent)", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content",
          padding: "7px 14px", borderRadius: 999, border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))",
          background: "color-mix(in srgb, var(--accent) 8%, transparent)",
          fontWeight: 600, cursor: "pointer", letterSpacing: "-0.005em", transition: "all 180ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 16%, transparent)"; e.currentTarget.style.transform = "translateX(-3px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 8%, transparent)"; e.currentTarget.style.transform = "none"; }}>
        <AfIcon name="arrow-right" size={13} style={{ transform: "rotate(180deg)" }}/> Kenny · CEO
      </a>
      <div style={{ fontSize: 40, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.03em", lineHeight: 1.02, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        COCKPIT KETSIAH <span style={{ color: "var(--accent)", fontWeight: 400, opacity: 0.6 }}>·</span> <span style={{ color: "var(--fg-2)" }}>CFO</span>
      </div>
      <div style={{ fontSize: 16, color: "var(--fg-2)", lineHeight: 1.55, maxWidth: 920 }}>
        Synthèse Admin-Fi &amp; RH · <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>marge</strong> · <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>budget</strong> · <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>arbitrage cash</strong> · 1 lieutenant <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>Haja</strong>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Hero KPIs (3 cards)
// ───────────────────────────────────────────────────────────
function HeroCard({ k }) {
  const tone = k.tone === "err"     ? { c: "var(--err)",  bg: "var(--err-soft)",  bd: "color-mix(in srgb, var(--err) 35%, var(--border))" }
            : k.tone === "warn"    ? { c: "var(--warn)", bg: "var(--warn-soft)", bd: "color-mix(in srgb, var(--warn) 35%, var(--border))" }
            : k.tone === "accent"  ? { c: "var(--accent)", bg: "var(--accent-soft)", bd: "color-mix(in srgb, var(--accent) 35%, var(--border))" }
            :                        { c: "var(--fg-1)",  bg: "var(--bg-elev-1)",  bd: "var(--border)" };
  return (
    <div style={{
      background: "var(--surface)", border: `1px solid ${tone.bd}`,
      borderRadius: 12, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16,
      position: "relative", overflow: "hidden", boxShadow: "var(--shadow-1)",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: tone.c }}/>
      <div style={{ width: 50, height: 50, borderRadius: 10, background: tone.bg, color: tone.c, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <AfIcon name={k.icon} size={24}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "var(--fg-2)", fontWeight: 500, marginBottom: 4 }}>{k.label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 600, color: tone.c, letterSpacing: "-0.025em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
          <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>{k.unit}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4 }}>{k.sub}</div>
      </div>
    </div>
  );
}

function HeroKpis() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
      {HERO_KPIS.map((k) => <HeroCard key={k.id} k={k}/>)}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// SO·1 OWNER band — 2 KPI trajectoires (DSO + BGFI)
// ───────────────────────────────────────────────────────────
function SOBand() {
  const dsoEcart = SO_DSO.value - SO_DSO.target;
  const bgfiEcart = SO_BGFI.target - SO_BGFI.value;
  return (
    <div style={{
      background: "linear-gradient(135deg, var(--pl-navy) 0%, var(--pl-navy-deep) 100%)",
      borderRadius: 14, padding: "22px 26px", color: "var(--pl-cream)",
      border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--pl-navy))",
      boxShadow: "0 6px 18px rgba(6,24,41,0.22)",
      display: "grid", gridTemplateColumns: "minmax(220px, 1fr) minmax(280px, 1.4fr) minmax(280px, 1.4fr)", gap: 24, alignItems: "stretch",
    }}>
      {/* Identity column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.q} · objectif rattaché</span>
          <span style={{
            padding: "3px 9px", borderRadius: 4, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            background: "color-mix(in srgb, var(--accent) 28%, transparent)",
            color: "var(--pl-cream)", border: "1px solid color-mix(in srgb, var(--accent) 55%, transparent)",
            fontFamily: "var(--font-mono)",
          }}>★ OWNER</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{SO_DATA.code}</span>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--pl-teal-light)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Conversion en cash</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, color: "var(--pl-cream)", letterSpacing: "-0.015em", lineHeight: 1.3 }}>{SO_DATA.title}</div>
        <Chip color="color-mix(in srgb, var(--pl-cream) 80%, transparent)" bg="color-mix(in srgb, var(--pl-cream) 8%, transparent)" border="1px solid color-mix(in srgb, var(--pl-cream) 18%, transparent)" mono>
          co-mention SO·2
        </Chip>
        <div style={{ fontSize: 11, color: "color-mix(in srgb, var(--pl-cream) 50%, transparent)", lineHeight: 1.5, marginTop: 4 }}>
          Trajectoire CFO · détail 6 banques chez Haja
        </div>
      </div>

      {/* DSO column */}
      <SOTrajectory
        label={SO_DSO.label} value={SO_DSO.value} unit={SO_DSO.unit} target={`≤${SO_DSO.target} j`}
        ecart={`+${dsoEcart} j`} ecartTone="err"
        series={SO_DSO.series} hint={SO_DSO.hint} invert
      />
      {/* BGFI column */}
      <SOTrajectory
        label={SO_BGFI.label} value={SO_BGFI.value} unit={SO_BGFI.unit} target={`≥${SO_BGFI.target} %`}
        ecart={`−${bgfiEcart} pts`} ecartTone="warn"
        series={SO_BGFI.series} hint={SO_BGFI.hint}
      />
    </div>
  );
}

function SOTrajectory({ label, value, unit, target, ecart, ecartTone, series, hint, invert }) {
  const tColor = ecartTone === "err" ? "#FFB4A3" : ecartTone === "warn" ? "#FBD38D" : "var(--pl-teal-light)";
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 10,
      borderLeft: "1px solid color-mix(in srgb, var(--pl-cream) 14%, transparent)", paddingLeft: 22,
    }}>
      <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 600, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.03em" }}>
          {invert && typeof value === "number" ? value : value}
          <span style={{ fontSize: 18, color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", marginLeft: 4 }}>{unit}</span>
        </span>
        <span style={{ fontSize: 12, color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", fontFamily: "var(--font-mono)" }}>cible {target}</span>
      </div>
      <Sparkline series={series} color="var(--pl-teal-light)" target={null} width={340} height={42}/>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          padding: "4px 10px", borderRadius: 999, fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 700,
          background: "color-mix(in srgb, var(--err) 24%, transparent)", color: tColor,
          border: `1px solid color-mix(in srgb, var(--err) 50%, transparent)`,
        }}>écart {ecart}</span>
        <span style={{ fontSize: 11, color: "color-mix(in srgb, var(--pl-cream) 55%, transparent)" }}>{hint}</span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Focale CFO — 4 cartes (sa propriété)
// ───────────────────────────────────────────────────────────
function FocaleCfoCard({ k }) {
  const tone = statusTone(k.status);
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "20px 22px",
      display: "flex", flexDirection: "column", gap: 14,
      position: "relative", overflow: "hidden", boxShadow: "var(--shadow-1)",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: tone.color }}/>
      <div style={{ paddingLeft: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: tone.bg, color: tone.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <AfIcon name={k.icon} size={17}/>
          </div>
          <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{k.label}</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {k.baked && <span className="confirm-badge" style={{ background: "color-mix(in srgb, var(--warn) 18%, transparent)", color: "var(--warn)" }}>BAKED · à fiabiliser</span>}
          {k.b17 && <span className="confirm-badge" style={{ background: "color-mix(in srgb, var(--err) 16%, transparent)", color: "var(--err)" }}>B17 · agrégat</span>}
        </div>
      </div>

      <div style={{ paddingLeft: 8, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 600, color: tone.color, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-3)" }}>{k.unit}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", marginTop: 4 }}>cible <strong style={{ color: "var(--fg-2)", fontWeight: 600 }}>{k.target}</strong></div>
        </div>
        <Sparkline series={k.series} color={tone.color} target={typeof k.target === "string" && /^\d/.test(k.target) ? parseFloat(k.target) : null} width={130} height={40}/>
      </div>

      <div style={{ paddingLeft: 8, fontSize: 12, color: "var(--fg-3)", lineHeight: 1.5 }}>{k.sub}</div>

      {/* Marge par dept · mini-table */}
      {k.detail && (
        <div style={{ paddingLeft: 8, paddingTop: 10, borderTop: "1px dashed var(--border-soft)", display: "flex", flexDirection: "column", gap: 6 }}>
          {k.detail.map((d) => (
            <div key={d.dept} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 12 }}>
              <span style={{ color: "var(--fg-2)" }}>{d.dept}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", color: d.ok ? "var(--ok)" : "var(--err)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{d.v}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-3)", fontSize: 11 }}>/ {d.t}</span>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: d.ok ? "var(--ok)" : "var(--err)" }}/>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FocaleCfoBlock() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ width: 4, height: 22, background: "var(--accent)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.005em", textTransform: "uppercase" }}>★ Focale CFO</h3>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>(propriété · 1 donnée = 1 domicile · ce que Haja n'a pas)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {FOCALE_CFO.map((k) => <FocaleCfoCard key={k.id} k={k}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// DDV à valider · seuil CFO
// ───────────────────────────────────────────────────────────
const DDV_COLS = "120px 240px 130px 1fr 130px 120px 110px 130px";

function DdvTable({ items, onAction }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ width: 4, height: 22, background: "var(--err)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.005em", textTransform: "uppercase" }}>DDV à valider · seuil CFO</h3>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>(&gt;5 M MGA ou cross-threshold · goulot CFO)</span>
        <Chip color="var(--err)" bg="var(--err-soft)" border="1px solid color-mix(in srgb, var(--err) 30%, transparent)" mono>
          {items.length} décision(s) requise(s)
        </Chip>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>source · ddv-baked actor_current cfo-001 · WRITES_LIVE=false · M13</span>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-1)" }}>
        <div style={{ overflowX: "auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: DDV_COLS, gap: 14,
            padding: "14px 20px", background: "var(--pl-navy)", color: "var(--pl-cream)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            alignItems: "center", minWidth: "max-content", fontFamily: "var(--font-mono)",
          }}>
            <span>Réf</span><span>Nature</span><span>Montant</span><span>Niveau matrice</span><span>Demandeur</span><span>Dépt</span><span>SLA</span><span style={{ textAlign: "right" }}>Action</span>
          </div>
          {items.map((it, i) => (
            <div key={it.id}
              style={{
                display: "grid", gridTemplateColumns: DDV_COLS, gap: 14,
                padding: "18px 20px", alignItems: "center",
                background: "var(--surface)",
                borderLeft: "3px solid var(--err)",
                borderBottom: i === items.length - 1 ? "none" : "1px solid var(--border-soft)",
                minWidth: "max-content",
              }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-1)", fontWeight: 700, letterSpacing: "-0.01em" }}>{it.ref}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                <span style={{ fontSize: 14, color: "var(--fg-1)", fontWeight: 600 }}>{it.fournisseur}</span>
                <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{it.nature}</span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 17, color: "var(--err)", fontWeight: 700, letterSpacing: "-0.015em", fontVariantNumeric: "tabular-nums" }}>{it.montant}</span>
              <span style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.45 }}>
                <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 4, background: "var(--warn-soft)", color: "var(--warn)", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", marginRight: 6 }}>{it.cross}</span>
                {it.niveau}
              </span>
              <span style={{ fontSize: 13, color: "var(--fg-2)" }}>{it.demandeur}</span>
              <span style={{ fontSize: 13, color: "var(--fg-2)" }}>{it.dept}</span>
              <Chip color={it.slaTone === "warn" ? "var(--warn)" : "var(--ok)"} bg={it.slaTone === "warn" ? "var(--warn-soft)" : "var(--ok-soft)"} border={`1px solid color-mix(in srgb, ${it.slaTone === "warn" ? "var(--warn)" : "var(--ok)"} 30%, transparent)`} mono>{it.sla}</Chip>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => onAction(it)}
                  style={{
                    padding: "11px 18px", borderRadius: 8, background: "var(--accent)",
                    color: "var(--accent-fg)", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                  }}>
                  Décider <AfIcon name="arrow-right" size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Synthèse Haja (1 lieutenant) + Alertes structurelles
// ───────────────────────────────────────────────────────────
function HajaSynthCard() {
  const tone = HAJA_SYNTH.score >= 80 ? "ok" : HAJA_SYNTH.score >= 65 ? "warn" : "err";
  const t = statusTone(tone);
  return (
    <div style={{
      background: "var(--surface)", border: `1px solid color-mix(in srgb, ${t.color} 25%, var(--border))`,
      borderRadius: 14, padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 18,
      boxShadow: "var(--shadow-1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--pl-navy)", color: "var(--pl-cream)", display: "grid", placeItems: "center", fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{HAJA_SYNTH.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.015em" }}>{HAJA_SYNTH.nom}</span>
            <span style={{ fontSize: 13, color: "var(--fg-3)" }}>· {HAJA_SYNTH.role}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>{HAJA_SYNTH.metricLabel} · <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-2)" }}>{HAJA_SYNTH.metric}</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkline series={HAJA_SYNTH.seriesScore} color={t.color} width={120} height={36}/>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700, color: t.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{HAJA_SYNTH.score}</div>
            <div style={{ fontSize: 11, color: "var(--ok)", fontFamily: "var(--font-mono)", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <AfIcon name="trend-up" size={11}/> {HAJA_SYNTH.delta30} · 30j
            </div>
          </div>
        </div>
        <a href={HAJA_SYNTH.drill}
          style={{
            padding: "10px 16px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)",
            textDecoration: "none", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6,
            whiteSpace: "nowrap",
          }}>
          Voir cockpit Haja <AfIcon name="arrow-right" size={14}/>
        </a>
      </div>

      {/* 5 sous-scores composite D54 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, paddingTop: 16, borderTop: "1px solid var(--border-soft)" }}>
        {HAJA_SYNTH.sub.map((s) => {
          const st = statusTone(s.status);
          return (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: st.color, fontVariantNumeric: "tabular-nums" }}>{s.v}</span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: "var(--bg-elev-1)" }}>
                <div style={{ height: "100%", width: `${Math.min(100, s.v)}%`, background: st.color, borderRadius: 999 }}/>
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", lineHeight: 1.4 }}>{s.hint}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AlertesHajaBlock() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ width: 4, height: 20, background: "var(--warn)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "-0.005em" }}>Alertes Haja · changement de nature</h3>
        <span style={{ fontSize: 12, color: "var(--fg-3)" }}>(pattern structurel · pas le bruit opérationnel · action = coaching)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
        {ALERTES_HAJA.map((a) => {
          const tone = a.priorite === "P0" ? { c: "var(--err)", bg: "var(--err-soft)" } : a.priorite === "P1" ? { c: "var(--warn)", bg: "var(--warn-soft)" } : { c: "var(--ok)", bg: "var(--ok-soft)" };
          return (
            <div key={a.id} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "18px 20px",
              display: "flex", gap: 14, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: tone.c }}/>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: tone.bg, color: tone.c, display: "grid", placeItems: "center", flexShrink: 0, border: `1px solid color-mix(in srgb, ${tone.c} 25%, transparent)` }}>
                <AfIcon name={a.icon} size={20}/>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: tone.bg, color: tone.c, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "var(--font-mono)" }}>{a.priorite}</span>
                  <span style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{a.nature}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>{a.source}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-1)", lineHeight: 1.5 }}>{a.pat}</div>
                <div style={{ padding: 10, background: "var(--bg-elev-1)", borderRadius: 6, borderLeft: "2px solid var(--accent)" }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 4 }}>Signal coaching → Haja</div>
                  <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>{a.coaching}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Concentration (lecture seule) + Conformité
// ───────────────────────────────────────────────────────────
function ConcentrationCard() {
  const over = CONCENTRATION.share > CONCENTRATION.target;
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "20px 22px", display: "flex", gap: 18, alignItems: "center",
      boxShadow: "var(--shadow-1)", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--fg-3)" }}/>
      <div style={{ width: 50, height: 50, borderRadius: 10, background: "var(--bg-elev-1)", color: "var(--fg-2)", display: "grid", placeItems: "center", flexShrink: 0, border: "1px solid var(--border)" }}>
        <AfIcon name="pillar-loyal" size={24}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Concentration client</span>
          <span style={{ padding: "2px 8px", borderRadius: 4, background: "var(--bg-elev-1)", color: "var(--fg-3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "var(--font-mono)", border: "1px solid var(--border)" }}>LECTURE SEULE · {CONCENTRATION.owner}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, color: over ? "var(--warn)" : "var(--ok)", letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>{CONCENTRATION.share}<span style={{ fontSize: 14, color: "var(--fg-3)" }}> %</span></span>
          <span style={{ fontSize: 13, color: "var(--fg-2)" }}>{CONCENTRATION.client}</span>
          <span style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", marginLeft: 6 }}>cible ≤{CONCENTRATION.target}%</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4 }}>{CONCENTRATION.caveat}</div>
      </div>
      <Sparkline series={CONCENTRATION.series} color="var(--warn)" target={CONCENTRATION.target} width={160} height={48}/>
    </div>
  );
}

function ConformiteCard() {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "var(--shadow-1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AfIcon name="shield" size={18} color="var(--accent)"/>
        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Conformité &amp; DPO</span>
        <Chip color="var(--accent)" bg="var(--accent-soft)" border="1px solid color-mix(in srgb, var(--accent) 30%, transparent)" mono>DPO Loi 2014-038</Chip>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        {CONFORMITE.map((c) => {
          const t = statusTone(c.status);
          return (
            <div key={c.id} style={{ padding: "10px 12px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{c.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: t.color }}>{c.value}</span>
              </div>
              <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{c.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Rail droit — Cash net + WhatIf trésorerie
// ───────────────────────────────────────────────────────────
function CashNetCard() {
  return (
    <div style={{
      background: "linear-gradient(160deg, var(--pl-navy) 0%, var(--pl-navy-deep) 100%)",
      color: "var(--pl-cream)", borderRadius: 14, padding: "20px 22px",
      border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--pl-navy))",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AfIcon name="diamond" size={16} color="var(--pl-teal-light)"/>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Cash net disponible</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 600, color: "var(--accent)", letterSpacing: "-0.03em", lineHeight: 1 }}>{CASH_NET.value}</span>
        <span style={{ fontSize: 14, color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", fontFamily: "var(--font-mono)" }}>{CASH_NET.unit}</span>
      </div>
      <div style={{ fontSize: 11, color: "color-mix(in srgb, var(--pl-cream) 55%, transparent)", fontFamily: "var(--font-mono)" }}>cible {CASH_NET.target} · {CASH_NET.hint}</div>
      <div style={{
        marginTop: 6, padding: "8px 10px", borderRadius: 6,
        background: "color-mix(in srgb, var(--pl-cream) 8%, transparent)",
        border: "1px dashed color-mix(in srgb, var(--pl-cream) 18%, transparent)",
        fontSize: 11, color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <AfIcon name="info" size={11}/> Synthèse · pas actionnable · arbitrage chez Haja
      </div>
    </div>
  );
}

function WhatIfCard() {
  const [sel, setSel] = useState("w-0");
  const preset = WHATIF_PRESETS.find((p) => p.id === sel);
  const baseValue = 1330; // M MGA
  const newValue = baseValue + preset.deltaCash;
  const delta = preset.deltaCash;
  const positive = delta > 0;
  const negative = delta < 0;
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "20px 22px",
      display: "flex", flexDirection: "column", gap: 14,
      boxShadow: "var(--shadow-1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <AfIcon name="bolt" size={16} color="var(--accent)"/>
        <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>WhatIf · trésorerie</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {WHATIF_PRESETS.map((p) => {
          const active = sel === p.id;
          return (
            <button key={p.id} onClick={() => setSel(p.id)}
              style={{
                textAlign: "left", padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                background: active ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "transparent",
                border: active ? "1px solid color-mix(in srgb, var(--accent) 40%, var(--border))" : "1px solid var(--border-soft)",
                color: active ? "var(--accent)" : "var(--fg-2)", fontSize: 12, fontWeight: 500,
                fontFamily: "var(--font-sans)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
              }}>
              <span>{p.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700,
                color: p.deltaCash > 0 ? "var(--ok)" : p.deltaCash < 0 ? "var(--err)" : "var(--fg-3)" }}>
                {p.deltaCash > 0 ? "+" : ""}{p.deltaCash} M
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: 12, borderRadius: 8, background: "var(--bg-elev-1)", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Projection cash net</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, color: positive ? "var(--ok)" : negative ? "var(--err)" : "var(--fg-1)", letterSpacing: "-0.02em" }}>
            {(newValue / 1000).toFixed(2)}
          </span>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)" }}>Md MGA</span>
          {delta !== 0 && (
            <span style={{ marginLeft: 6, fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: positive ? "var(--ok)" : "var(--err)" }}>
              ({delta > 0 ? "+" : ""}{delta} M)
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>{preset.desc}</div>
      </div>
      <div style={{ fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 6 }}>
        <AfIcon name="info" size={11}/> WRITES_LIVE=false · sandbox CFO
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Scores tab
// ───────────────────────────────────────────────────────────
function ScoresTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{
        padding: "12px 16px", borderRadius: 10,
        background: "color-mix(in srgb, var(--accent) 8%, var(--surface))",
        border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))",
        color: "var(--fg-2)", fontSize: 13, lineHeight: 1.5,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <AfIcon name="info" size={16} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }}/>
        <div>
          <strong style={{ color: "var(--fg-1)" }}>KPIs owné CFO</strong> — F-K01 DSO &amp; F-K02 BGFI sont SO·1. F-K04 recouvrement + marge consolidée = propriété CFO. O2-K01/K02 co-mention SO·2 (Order-to-Cash). <strong>O2-K03 non affiché</strong> (cible 0 TODO). <strong>Concentration</strong> = lecture seule (owner CEO).
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
        {PERSO_KPIS.map((k) => {
          const t = statusTone(k.status);
          return (
            <div key={k.id} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: 18, position: "relative", overflow: "hidden",
              boxShadow: "var(--shadow-1)",
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: t.color }}/>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, paddingLeft: 6 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", fontWeight: 700, letterSpacing: "0.06em" }}>{k.id}</span>
                    {k.isSO1 && <span style={{ padding: "1px 6px", borderRadius: 4, background: "var(--accent-soft)", color: "var(--accent)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>SO·1</span>}
                    {k.owne && <span style={{ padding: "1px 6px", borderRadius: 4, background: "color-mix(in srgb, var(--accent) 20%, transparent)", color: "var(--accent)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>★ OWNE</span>}
                    {k.coSO2 && <span style={{ padding: "1px 6px", borderRadius: 4, background: "var(--bg-elev-1)", color: "var(--fg-2)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>co · SO·2</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)", marginTop: 4, lineHeight: 1.3 }}>{k.label}</div>
                </div>
                <Chip color={t.color} bg={t.bg} border={`1px solid color-mix(in srgb, ${t.color} 30%, transparent)`}>{t.label}</Chip>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14, paddingLeft: 6, gap: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 600, color: t.color, lineHeight: 1, letterSpacing: "-0.03em" }}>{k.value}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)" }}>{k.unit}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", marginLeft: 8 }}>cible {k.target}{typeof k.target === "number" && k.unit ? k.unit : ""}</span>
                </div>
                <Sparkline series={k.series} color={t.color} width={130} height={36}/>
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--border-soft)", paddingLeft: 6, fontSize: 11, color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 6 }}>
                <AfIcon name="user" size={11}/> src · <strong style={{ color: "var(--fg-2)", fontWeight: 600 }}>{k.source}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note libellé fix */}
      <div style={{
        padding: 12, background: "var(--bg-elev-1)", borderRadius: 8,
        border: "1px solid var(--border-soft)", fontSize: 12, color: "var(--fg-3)",
        fontFamily: "var(--font-mono)", display: "flex", alignItems: "flex-start", gap: 8,
      }}>
        <AfIcon name="check-circle" size={14} color="var(--ok)" style={{ marginTop: 1, flexShrink: 0 }}/>
        <div>
          FIX libellés appliqué · O2-K01 = <strong style={{ color: "var(--fg-2)" }}>% NoDos→Facture &lt;72h</strong> · O2-K02 = <strong style={{ color: "var(--fg-2)" }}>Délai moyen jours</strong> (anciennement doublon &laquo; % Facturé &lt;72h &raquo;).
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Carnet tab
// ───────────────────────────────────────────────────────────
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
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, fontFamily: "var(--font-mono)",
                background: c.type === "decision" ? "var(--accent-soft)" : "var(--warn-soft)",
                color: c.type === "decision" ? "var(--accent)" : "var(--warn)",
              }}>{c.type}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>{c.date}</span>
            </div>
            <div style={{ fontSize: 14, color: "var(--fg-1)", marginTop: 6, lineHeight: 1.5 }}>{c.text}</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <AfIcon name="user" size={12}/> Source : <strong style={{ fontWeight: 600, color: "var(--fg-2)" }}>{c.source}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Profil tab
// ───────────────────────────────────────────────────────────
function ProfilTab() {
  const fonctions = [
    "Direction · CFO N2 Premium Logistics",
    "Owner SO·1 · Conversion en cash",
    "Co-mention SO·2 · Order-to-Cash",
    "Arbitrage cash > 5 M MGA + cross-threshold",
    "Marge consolidée + budget + turnover B17 agrégat",
    "DPO Loi 2014-038",
    "Pilote 1 lieutenant · Haja",
  ];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent) 0%, var(--pl-navy) 100%)", display: "grid", placeItems: "center", color: "var(--pl-cream)", fontSize: 44, fontWeight: 600, fontFamily: "var(--font-mono)" }}>K</div>
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.02em" }}>Ketsiah</div>
          <div style={{ fontSize: 14, color: "var(--fg-3)", marginTop: 2 }}>Direction · CFO N2 · Premium Logistics · drill-up Kenny CEO · drill-down Haja</div>
        </div>
        <div className="label">Fonctions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {fonctions.map((f) => <Chip key={f} color="var(--fg-1)" bg="var(--bg-elev-1)">{f}</Chip>)}
        </div>
        <div className="label" style={{ marginTop: 6 }}>Périmètre de décision</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <Tile2 label="Seuil DDV" v="> 5 M MGA · ou cross-threshold"/>
          <Tile2 label="Cross-threshold" v="concentration ≥2 M / mois · délai >30 j"/>
          <Tile2 label="Cascade Haja" v="muter Haja ⇒ bouge Ketsiah (1 domicile)"/>
          <Tile2 label="B17" v="agrégat uniquement · 0 nominatif RH"/>
        </div>
        <div className="label" style={{ marginTop: 6 }}>Conformité</div>
        <div style={{ padding: 12, background: "color-mix(in srgb, var(--accent) 5%, var(--bg-elev-1))", border: "1px dashed color-mix(in srgb, var(--accent) 30%, var(--border))", borderRadius: 8, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AfIcon name="shield" size={16} color="var(--accent)"/>
          <div>
            <strong style={{ color: "var(--fg-1)" }}>DPO Loi 2014-038</strong> — Ketsiah est responsable du traitement PII. DPA signé (v2.1 · 12 mai). Audit Q2 préparation pour 18 juin 2026.
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile2({ label, v }) {
  return (
    <div style={{ padding: "10px 12px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 8 }}>
      <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 13, color: "var(--fg-1)", fontWeight: 500, lineHeight: 1.4 }}>{v}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Assistant tab — copilote manager
// ───────────────────────────────────────────────────────────
function AssistantTab() {
  const [messages, setMessages] = useState(ASSISTANT_SEED);
  const [draft, setDraft] = useState("");
  const scrollerRef = useRef(null);

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    const userMsg = { who: "user", text: draft.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        who: "assistant",
        text: "Note prise. Cette piste est tracée en sandbox — WRITES_LIVE=false. Pour exécuter, ouvre la décision dans la file DDV ou descends sur le cockpit Haja.",
      }]);
    }, 600);
  };

  const PROMPTS = [
    "Que se passe-t-il si je refuse DDV-2210 ?",
    "Lance la revue marge mensuelle",
    "Résume les alertes Haja en 3 lignes",
    "Compare DSO vs trajectoire BGFI",
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14, minHeight: 540 }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
        display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "var(--shadow-1)",
      }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
            <AfIcon name="chat" size={16}/>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg-1)" }}>Copilote manager CFO</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>contexte chargé · 2 DDV · marge 25,4% · alertes Haja</div>
          </div>
        </div>
        <div ref={scrollerRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.who === "user" ? "flex-end" : "flex-start", maxWidth: "82%",
              padding: "11px 14px", borderRadius: m.who === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
              background: m.who === "user" ? "var(--accent)" : "var(--bg-elev-1)",
              color: m.who === "user" ? "var(--accent-fg)" : "var(--fg-1)",
              fontSize: 14, lineHeight: 1.55,
              border: m.who === "user" ? "none" : "1px solid var(--border-soft)",
            }}>
              {m.text}
            </div>
          ))}
        </div>
        <div style={{ padding: 14, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Pose une question, demande un arbitrage…"
            style={{
              flex: 1, padding: "11px 14px", borderRadius: 8,
              background: "var(--bg-elev-1)", color: "var(--fg-1)",
              border: "1px solid var(--border)", outline: "none", fontSize: 14, fontFamily: "var(--font-sans)",
            }}
          />
          <button onClick={send}
            style={{ padding: "11px 18px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Envoyer <AfIcon name="arrow-right" size={14}/>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10 }}>Suggestions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PROMPTS.map((p) => (
              <button key={p} onClick={() => setDraft(p)}
                style={{
                  textAlign: "left", padding: "9px 10px", borderRadius: 6,
                  background: "var(--bg-elev-1)", color: "var(--fg-2)",
                  border: "1px solid var(--border-soft)", cursor: "pointer",
                  fontSize: 12, lineHeight: 1.4, fontFamily: "var(--font-sans)",
                }}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 10 }}>Contexte chargé</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--fg-2)" }}>
            <div>• 2 DDV cross-threshold</div>
            <div>• Marge consolidée 25,4 % vs 28 %</div>
            <div>• 3 alertes Haja structurelles</div>
            <div>• PENTA concentration 28,5 % (lecture seule)</div>
            <div>• Cash net 1,33 Md MGA · cible 2 Md</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sidebar (5 onglets canoniques + Profil)
// ───────────────────────────────────────────────────────────
const NAV = [
  { id: "vue",       label: "Vue d'ensemble", icon: "grid"  },
  { id: "assistant", label: "Assistant",      icon: "chat"  },
  { id: "scores",    label: "Scores",         icon: "chart" },
  { id: "carnet",    label: "Carnet de bord", icon: "book"  },
  { id: "profil",    label: "Profil",         icon: "user"  },
];

function Sidebar({ active, onTab }) {
  return (
    <aside style={{ width: 220, flexShrink: 0, background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
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
                fontSize: 14, fontWeight: a ? 600 : 500,
              }}
              onMouseEnter={(e) => { if (!a) e.currentTarget.style.background = "var(--bg-elev-1)"; }}
              onMouseLeave={(e) => { if (!a) e.currentTarget.style.background = "transparent"; }}>
              <AfIcon name={n.icon} size={17} color={a ? "var(--accent)" : "var(--fg-3)"}/>
              {n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 14, borderTop: "1px solid var(--border-soft)", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>Design System D82</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}>
          <AfIcon name="shield" size={11}/> CFO N2 · 1 domicile
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
// Toast
// ───────────────────────────────────────────────────────────
function Toast({ items, onClose }) {
  if (items.length === 0) return null;
  return (
    <div style={{ position: "fixed", top: 80, right: 24, zIndex: 200, display: "flex", flexDirection: "column", gap: 8, maxWidth: 380 }}>
      {items.map((t) => (
        <div key={t.id} style={{
          background: "var(--surface)", color: "var(--fg-1)",
          border: `1px solid color-mix(in srgb, ${t.color || "var(--ok)"} 40%, var(--border))`,
          boxShadow: "0 10px 24px rgba(6,24,41,0.18)",
          borderRadius: 10, padding: "14px 16px",
          display: "flex", alignItems: "flex-start", gap: 10,
          animation: "kToastIn 220ms cubic-bezier(.2,.7,.2,1)", minWidth: 320,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `color-mix(in srgb, ${t.color || "var(--ok)"} 16%, transparent)`, color: t.color || "var(--ok)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <AfIcon name={t.icon || "check"} size={18}/>
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
// Main App
// ───────────────────────────────────────────────────────────
function App() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  const [tab, setTab] = useState("vue");
  const [ddvList, setDdvList] = useState(DDV_LIST);
  const [openDdv, setOpenDdv] = useState(null);
  const [toasts, setToasts] = useState([]);

  const pushToast = (t) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((p) => [...p, { id, ...t }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 5500);
  };
  const closeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const onDdvAction = ({ choice, motif, comment }) => {
    const ddv = openDdv;
    setOpenDdv(null);
    if (choice === "valider") {
      pushToast({ title: `✓ DDV ${ddv.ref} validée`, subtitle: `${ddv.montant} · ${ddv.fournisseur} · décaissement déclenché côté Belaza`, color: "var(--ok)", icon: "check" });
      setDdvList((p) => p.filter((x) => x.id !== ddv.id));
    } else if (choice === "refuser") {
      pushToast({ title: `✗ DDV ${ddv.ref} refusée`, subtitle: `Motif : ${motif} · transmis Haja`, color: "var(--err)", icon: "x" });
      setDdvList((p) => p.filter((x) => x.id !== ddv.id));
    } else {
      pushToast({ title: `↩ DDV ${ddv.ref} renvoyée Haja`, subtitle: comment || "Sans commentaire · pour complément dossier", color: "var(--warn)", icon: "arrow-right" });
      setDdvList((p) => p.filter((x) => x.id !== ddv.id));
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg-1)", display: "flex", flexDirection: "column" }} data-screen-label="Cockpit Ketsiah CFO">
      <Topbar theme={theme} onTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")}/>
      <SimulationBanner/>
      <PillarBar/>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar active={tab} onTab={setTab}/>

        <main style={{ flex: 1, overflow: "auto", padding: "30px 28px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 26 }}>
            {tab === "vue" && (
              <>
                <CockpitHeader/>
                <HeroKpis/>
                <SOBand/>

                {/* 2-col : main + rail */}
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 22, alignItems: "start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                    <FocaleCfoBlock/>
                    <DdvTable items={ddvList} onAction={(it) => setOpenDdv(it)}/>
                    <HajaSynthCard/>
                    <AlertesHajaBlock/>
                    <ConcentrationCard/>
                    <ConformiteCard/>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 0 }}>
                    <CashNetCard/>
                    <WhatIfCard/>
                  </div>
                </div>
              </>
            )}
            {tab === "assistant" && (
              <>
                <CockpitHeader/>
                <AssistantTab/>
              </>
            )}
            {tab === "scores" && (
              <>
                <CockpitHeader/>
                <ScoresTab/>
              </>
            )}
            {tab === "carnet" && (
              <>
                <CockpitHeader/>
                <CarnetTab/>
              </>
            )}
            {tab === "profil" && (
              <>
                <CockpitHeader/>
                <ProfilTab/>
              </>
            )}
          </div>
        </main>
      </div>

      <footer style={{
        borderTop: "1px solid var(--border)", background: "var(--surface)",
        padding: "12px 24px", fontSize: 12, color: "var(--fg-3)",
        display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", flexWrap: "wrap", gap: 8,
      }}>
        <span>LOI · Cockpit Ketsiah · CFO N2 · Premium Logistics · synthèse + arbitrage</span>
        <span>D82 · Digital Twin V3 · M13 actif · WRITES_LIVE=false</span>
      </footer>

      <Toast items={toasts} onClose={closeToast}/>
      <DdvValidateModal open={!!openDdv} ddv={openDdv} onClose={() => setOpenDdv(null)} onAction={onDdvAction}/>

      <style>{`
        @keyframes kPulse  { 0% {opacity:1; transform:scale(1)} 70% {opacity:0; transform:scale(2.2)} 100% {opacity:0} }
        @keyframes kToastIn { from {opacity:0; transform:translateY(-6px)} to {opacity:1; transform:none} }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
