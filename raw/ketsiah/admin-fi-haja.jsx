/* global React, ReactDOM, AfIcon */
// ════════════════════════════════════════════════════════════════
// LOI · COCKPIT HAJA — Resp Admin & Finance · MANAGER
// Pilote 4 lieutenants (Sarobidy · Belaza · Christine · Facturation/Lynda+Rico)
// Drill-up : Ketsiah · CFO · Drill-down : 4 workspaces lieutenants
// Layout ossature D82 identique aux workspaces · contenu manager.
// ════════════════════════════════════════════════════════════════
const { useState, useMemo, useEffect } = React;

// ───────────────────────────────────────────────────────────
// DATA — Cockpit Haja (manager · roll-up des 4 lieutenants)
// ───────────────────────────────────────────────────────────
const PILLARS_DATA = [
  { id: "p1", short: "P1", name: "Exécution & discipline",  score: 78, trend: "up",     delta: "+4" },
  { id: "p2", short: "P2", name: "Cash & rentabilité",      score: 65, trend: "down",   delta: "−6", isFocus: true },
  { id: "p3", short: "P3", name: "Fidélité client",         score: 82, trend: "stable", delta: "±0" },
  { id: "p4", short: "P4", name: "Fluidité",                score: 71, trend: "up",     delta: "+2" },
];

// Bloc CASH CONSOLIDÉ — cœur Resp Compta&Fi · trésorerie + encours + compta
// Seul domicile de : BGFI (réconciliations 5/6), Clôture mensuelle, Dossiers non facturés.
const CASH_DATA = [
  { id: "cash-1", label: "Créances clients",        value: "676",     unit: "M Ar",     hint: "AR immobilisée · suivi recouvrement Sarobidy",     status: "warn",  icon: "pillar-cash" },
  { id: "cash-2", label: "Trésorerie totale",       value: "1,33",    unit: "Md Ar",    hint: "6 banques consolidées · sous-cible structurelle",  status: "warn",  icon: "diamond",   target: "≥2 Md Ar" },
  { id: "cash-3", label: "Dossiers non facturés",   value: "43",      unit: "dossiers", hint: "À éditer · backlog Facturation · sortie de cash",   status: "err",   icon: "clipboard", target: "0" },
  { id: "cash-4", label: "Dettes fournisseurs",     value: "À conf.", unit: "",         hint: "Source AP à brancher · illustratif",               status: "info",  icon: "info",      confirm: true },
  { id: "cash-5", label: "Réconciliations bancaires", value: "5\u202f/\u202f6", unit: "banques", hint: "BGFI #6 non rapprochée · dette −1,97 Md Ar · réduction ≥50 %", status: "err", icon: "shield", target: "6\u202f/\u202f6" },
  { id: "cash-6", label: "Clôture mensuelle",       value: "J+8",    unit: "",          hint: "Clôture Belaza · surcharge fin de mois",            status: "warn",  icon: "step-paye", target: "≤J+5" },
];

// Roll-up des 5 lieutenants — composite D54 (lignes cascade)
// Ordre : Facturation · Sarobidy · Édienne · Belaza · Christine
// Score agrégé = moyenne arithmétique (recalculée · pas hardcodée)
const LIEUTENANTS = [
  {
    id: "facturation",
    name: "Facturation",
    persona: "Lynda + Rico · édition factures vente",
    avatar: "L+R",
    metricLabel: "Factures <72h",
    metricValue: "78",
    metricUnit: "%",
    metricTarget: "≥90 %",
    status: "warn",
    score: 68,
    trend: "stable",
    delta30: "+2 pts",
    seriesScore: [64, 65, 66, 65, 66, 67, 67, 67, 68, 68, 68, 68],
    metricSeries: [68, 70, 72, 71, 74, 73, 75, 76, 75, 77, 78, 78],
    objet: "Dossier AMBATOVY sous-margé (5 % vs 7 %)",
    drill: "Admin-Fi Facturation.html",
    sub: {
      charge:     { label: "Charge",         value: 85, unit: "%", hint: "10 pré-factures en attente (cible ≤5)",  status: "warn" },
      signaux:    { label: "Signaux 7 j",    value: 5,  unit: "",  hint: "Marge PDJV sous 7 % · pièces amont",     status: "warn" },
      resolution: { label: "Résolution",     value: 68, unit: "%", hint: "Factures émises sous SLA 72 h",          status: "warn" },
      sante:      { label: "Santé S/Dept",    value: 72, unit: "%", hint: "Binôme · charge symétrique",              status: "warn" },
      ter:        { label: "Alignement TER", value: 80, unit: "%", hint: "Pacte respecté · escalades remontées",  status: "ok"   },
    },
    signaux: [
      "Marge mini PDJV sous seuil sur 4 dernières semaines",
      "Backlog pré-factures 10 vs cible ≤5 · FIFO matin activé",
    ],
  },
  {
    id: "sarobidy",
    name: "Sarobidy",
    persona: "Créances · Dettes · facturation",
    avatar: "S",
    metricLabel: "DSO",
    metricValue: "68",
    metricUnit: "j",
    metricTarget: "≤60 j",
    status: "err",
    score: 55,
    trend: "down",
    delta30: "−4 pts",
    seriesScore: [62, 61, 60, 60, 59, 58, 57, 57, 56, 56, 55, 55],
    metricSeries: [76, 75, 73, 72, 71, 70, 70, 69, 69, 68, 68, 68],
    objet: "5 clients mining ≥45 j · 35 M Ar encours",
    drill: "Admin-Fi Workspace.html",
    sub: {
      charge:     { label: "Charge",         value: 78, unit: "%", hint: "12 dossiers actifs",                     status: "warn" },
      signaux:    { label: "Signaux 7 j",    value: 6,  unit: "",  hint: "3 escalades · 3 alertes recouv.",       status: "warn" },
      resolution: { label: "Résolution",     value: 62, unit: "%", hint: "Dossiers clos / ouverts (semaine)",       status: "warn" },
      sante:      { label: "Santé S/Dept",    value: 70, unit: "%", hint: "Sarobidy isolée · pas de doublure",      status: "warn" },
      ter:        { label: "Alignement TER", value: 75, unit: "%", hint: "1on1 hebdo OK · cadence préservée",      status: "ok"   },
    },
    signaux: [
      "Mining 5 clients ≥45 j (AMBATOVY · QMM · KRAOMA)",
      "Effet domino sur DSO global · ne baisse plus depuis S-3",
    ],
  },
  {
    id: "edienne",
    name: "Édienne",
    persona: "RH + Pacte TER · B17 agrégé · 0 nominatif",
    avatar: "É",
    metricLabel: "Climat équipe",
    metricValue: "72",
    metricUnit: "%",
    metricTarget: "≥75 %",
    status: "warn",
    score: 72,
    trend: "up",
    delta30: "+3 pts",
    seriesScore: [68, 68, 69, 69, 70, 70, 71, 71, 71, 72, 72, 72],
    metricSeries: [65, 66, 67, 67, 68, 69, 70, 70, 71, 71, 72, 72],
    objet: "Cadence 1on1 5/5 ce mois · 1 STC en cours",
    drill: "#",
    b17: true,
    sub: {
      charge:     { label: "Charge",         value: 70, unit: "%", hint: "STC débauche en cours · CNAPS routine",   status: "ok"   },
      signaux:    { label: "Signaux 7 j",    value: 2,  unit: "",  hint: "1 escalade visa · 1 climat (agrégé)",    status: "ok"   },
      resolution: { label: "Résolution",     value: 76, unit: "%", hint: "Tickets RH clos sous SLA",                status: "ok"   },
      sante:      { label: "Santé S/Dept",    value: 74, unit: "%", hint: "B17 agrégé · jamais nominatif",         status: "warn" },
      ter:        { label: "Alignement TER", value: 88, unit: "%", hint: "Cadence 1on1 5/5 · pacte exemplaire",   status: "ok"   },
    },
    signaux: [
      "Cadence 1on1 lieutenants 5/5 ce mois · pacte TER respecté",
      "STC débauche escaladé B17 · visas manquants (agrégat)",
    ],
  },
  {
    id: "belaza",
    name: "Belaza",
    persona: "Agent comptable · TVA · IRSA · décaissement",
    avatar: "B",
    metricLabel: "Décaissement <72h",
    metricValue: "85",
    metricUnit: "%",
    metricTarget: "≥95 %",
    status: "warn",
    score: 65,
    trend: "stable",
    delta30: "±0 pts",
    seriesScore: [64, 65, 66, 65, 64, 65, 65, 66, 65, 65, 65, 65],
    metricSeries: [70, 74, 72, 78, 80, 79, 82, 84, 83, 86, 84, 85],
    objet: "DDV >5 M Ar en attente · clôture J+8",
    drill: "Admin-Fi Belaza.html",
    sub: {
      charge:     { label: "Charge",         value: 82, unit: "%", hint: "TVA + IRSA + 6 réconciliations",         status: "warn" },
      signaux:    { label: "Signaux 7 j",    value: 4,  unit: "",  hint: "BGFI anomalie · 3 DDV >5 M en file",     status: "warn" },
      resolution: { label: "Résolution",     value: 71, unit: "%", hint: "Décaiss. clos sous SLA",                  status: "warn" },
      sante:      { label: "Santé S/Dept",    value: 65, unit: "%", hint: "Clôture J+8 · surcharge fin de mois",    status: "warn" },
      ter:        { label: "Alignement TER", value: 78, unit: "%", hint: "Cadence 1on1 OK · délégation à monter", status: "ok"   },
    },
    signaux: [
      "BGFI banque 6/6 non rapprochée · anomalie −1,97 Md Ar",
      "Pic charge fin de mois · risque retard clôture",
    ],
  },
  {
    id: "christine",
    name: "Christine",
    persona: "Agent admin · caisse · agréments",
    avatar: "C",
    metricLabel: "Conformité",
    metricValue: "92",
    metricUnit: "%",
    metricTarget: "≥95 %",
    status: "warn",
    score: 78,
    trend: "stable",
    delta30: "+1 pt",
    seriesScore: [76, 76, 77, 77, 78, 77, 78, 78, 78, 78, 78, 78],
    metricSeries: [82, 84, 86, 85, 88, 87, 89, 90, 88, 91, 90, 92],
    objet: "Agrément CAD à J+30 · renouvellement non lancé",
    drill: "Admin-Fi Christine.html",
    sub: {
      charge:     { label: "Charge",         value: 65, unit: "%", hint: "Caisse + cahier arrivée + agréments",     status: "ok"   },
      signaux:    { label: "Signaux 7 j",    value: 3,  unit: "",  hint: "Écart caisse 8 K · CAD J+30",             status: "warn" },
      resolution: { label: "Résolution",     value: 84, unit: "%", hint: "DDV caisse <24h · OK",                    status: "ok"   },
      sante:      { label: "Santé S/Dept",    value: 80, unit: "%", hint: "Rythme régulier · pas de surcharge",      status: "ok"   },
      ter:        { label: "Alignement TER", value: 82, unit: "%", hint: "Excellent reporting · 1on1 fluide",       status: "ok"   },
    },
    signaux: [
      "Agrément CAD expire dans 30 j · risque licence transitaire",
      "2ᵉ écart caisse mois · 8 K Ar à arbitrer",
    ],
  },
];

// Score agrégé Haja = moyenne arithmétique simple des 5 lieutenants (recalculée)
function computeAggregateScore() {
  return Math.round(LIEUTENANTS.reduce((s, l) => s + l.score, 0) / LIEUTENANTS.length);
}

// SO Objectif 1 — OWNER (Haja est owner · pas SO·2 Order-to-Cash)
const SO_DATA = {
  code: "Objectif 1",
  title: "Encaissement accéléré & dette réduite",
  subtitle: "Encaissement & dette",
  q: "Q3",
};
const SO_KPI = {
  label: "DSO global · clients consolidés",
  value: 68,        // jours
  target: 60,
  unit: "j",
  hint: "DSO en jours · 12 semaines glissantes · cible ≤60 j",
  series: [76, 75, 73, 72, 71, 70, 70, 69, 69, 68, 68, 68],
};

// À ARBITRER — remplace l'onglet Coaching · escalades + signaux des 4 qui attendent décision Haja
// amount = montant numérique en M Ar pour routage Authority Matrix (null = hors-routage)
// actionType = quelle modale ouvrir : "arbitrer" | "arbitrer-escalader" | "approuver-router"
const ARBITRER = [
  {
    id: "arb-1",
    source: "Facturation",
    sourceTone: "accent",
    subject: "Dossier AMBATOVY sous-margé (5 % vs seuil PDJV 7 %)",
    detail: "Avant émission facture vente · décision marge requise",
    montantLabel: "Enjeu marge",
    montantValue: "32,8 M Ar",
    amount: 32.8,
    actionType: "arbitrer",
    actionLabel: "Arbitrer",
    actionTone: "warn",
    seuil: "Décision marge · Haja",
  },
  {
    id: "arb-2",
    source: "Sarobidy",
    sourceTone: "accent",
    subject: "Pattern recouvrement mining · 5 clients ≥45 j",
    detail: "AMBATOVY · QMM · KRAOMA · AMSA · COLAS · risque DSO durable",
    montantLabel: "Encours cumulé",
    montantValue: "35,0 M Ar",
    amount: 35.0,
    actionType: "arbitrer-escalader",
    actionLabel: "Arbitrer / Escalader",
    actionTone: "err",
    seuil: ">5 M · escalade forcée Ketsiah",
  },
  {
    id: "arb-3",
    source: "Belaza",
    sourceTone: "accent",
    subject: "Décaissement >5 M Ar en attente · seuil Authority Matrix",
    detail: "Fournisseur PENTA-OCEAN · pièces conformes · BC validé",
    montantLabel: "Montant DDV",
    montantValue: "6,2 M Ar",
    amount: 6.2,
    actionType: "approuver-router",
    actionLabel: "Co-approuver + router Ketsiah",
    actionTone: "err",
    seuil: ">5 M · Haja route, Ketsiah obligatoire",
  },
  {
    id: "arb-4",
    source: "Christine",
    sourceTone: "accent",
    subject: "2ᵉ écart caisse du mois · 8 K Ar non rapproché",
    detail: "Cahier d'arrivée OK · écart entre tickets et fond caisse",
    montantLabel: "Écart caisse",
    montantValue: "8 K Ar",
    amount: 0.008,
    actionType: "arbitrer",
    actionLabel: "Arbitrer",
    actionTone: "warn",
    seuil: "<1 M · agent autonome (Haja contrôle)",
  },
  {
    id: "arb-5",
    source: "Christine",
    sourceTone: "accent",
    subject: "Agrément CAD à J+30 · renouvellement non lancé",
    detail: "Risque licence transitaire · dossier DGD à monter · délai légal",
    montantLabel: "Enjeu réglementaire",
    montantValue: "Licence CAD",
    amount: null,
    actionType: "arbitrer-escalader",
    actionLabel: "Arbitrer / Escalader",
    actionTone: "err",
    seuil: "Réglementaire · cascade Ketsiah possible",
  },
];

const APPROVAL_THRESHOLDS = [
  { range: "< 1 M MGA",      who: "Agent autonome",  tone: "ok" },
  { range: "1 – 3 M MGA",   who: "Haja",            tone: "accent" },
  { range: "3 – 5 M MGA",   who: "Haja + Ketsiah",  tone: "warn" },
  { range: "> 5 M MGA",      who: "Ketsiah",         tone: "err" },
];

// 8 KPI Haja (F-K01..F-K08) — onglet Scores · tous dérivés des 4 lieutenants
const PERSO_KPIS = [
  { id: "F-K01", label: "DSO global",                            value: 68,    target: 60,    invert: true,  status: "warn", series: [76, 75, 73, 72, 71, 70, 70, 69, 69, 68, 68, 68], unit: "j",  source: "Sarobidy" },
  { id: "F-K02", label: "NoDos → Facture <72h",                  value: 78,    target: 90,                  status: "warn", series: [68, 70, 72, 71, 74, 73, 75, 76, 75, 77, 78, 78], unit: "%",  source: "Facturation" },
  { id: "F-K03", label: "Clôture mensuelle (jours après mois)",  value: 8,     target: 5,     invert: true,  status: "warn", series: [10, 10, 9, 9, 9, 8, 8, 9, 8, 8, 8, 8],            unit: "j",  source: "Belaza" },
  { id: "F-K04", label: "Dette BGFI",                            value: "−1,97", target: "≤−0,98", status: "err", series: [220, 215, 210, 208, 205, 200, 198, 197, 197, 197, 197, 197], unit: "Md MGA", source: "Direction", confirm: true },
  { id: "F-K05", label: "Décaissement <72h après approbation",   value: 85,    target: 95,                  status: "warn", series: [70, 74, 72, 78, 80, 79, 82, 84, 83, 86, 84, 85], unit: "%",  source: "Belaza" },
  { id: "F-K06", label: "DDV caisse payées <24h",                value: 92,    target: 95,                  status: "warn", series: [82, 84, 86, 85, 88, 87, 89, 90, 88, 91, 90, 92], unit: "%",  source: "Christine" },
  { id: "F-K07", label: "Marge mini PDJV respectée",             value: "5 %", target: "≥7 %",              status: "err",  series: [7, 7, 6, 6, 7, 6, 6, 5, 5, 5, 5, 5],              unit: "",   source: "Facturation", confirm: true },
  { id: "F-K08", label: "Pré-factures en attente",               value: 10,    target: 5,     invert: true,  status: "warn", series: [4, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 10],          unit: "dossiers", source: "Facturation" },
];

// Carnet de bord — décisions & escalades manager (datées ≤ 27 mai 2026)
const CARNET = [
  { id: "c-1", date: "2026-05-26", type: "decision", text: "Arbitrage marge AMBATOVY · acceptation 5,2 % validée Ketsiah · trace M13",        source: "Haja → Ketsiah" },
  { id: "c-2", date: "2026-05-25", type: "decision", text: "Routine FIFO matin pré-factures · cadence quotidienne · Lynda pilote",            source: "Haja → Facturation" },
  { id: "c-3", date: "2026-05-22", type: "escalade", text: "Mining 5 clients ≥45 j · escalade Ketsiah pour rappel direction · 35 M MGA",     source: "Sarobidy → Haja" },
  { id: "c-4", date: "2026-05-20", type: "decision", text: "Seuil DDV >5 M MGA · double signature Authority Matrix · effet immédiat",        source: "Haja → Belaza" },
  { id: "c-5", date: "2026-05-18", type: "decision", text: "Check-list pièces dossier · alignement Transit ↔ Facturation · NoDos → 72h",     source: "Haja" },
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

function statusTone(s) {
  if (s === "ok")    return { color: "var(--ok)",    bg: "var(--ok-soft)",    label: "À jour" };
  if (s === "warn")  return { color: "var(--warn)",  bg: "var(--warn-soft)",  label: "À surveiller" };
  if (s === "err")   return { color: "var(--err)",   bg: "var(--err-soft)",   label: "Sous cible" };
  if (s === "accent") return { color: "var(--accent)", bg: "var(--accent-soft)", label: "" };
  if (s === "info")  return { color: "var(--fg-2)",  bg: "var(--bg-elev-1)",  label: "À confirmer" };
  return                  { color: "var(--fg-2)",   bg: "var(--bg-elev-1)",  label: "" };
}

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
// Pillar Bar (identique aux workspaces lieutenants)
// ───────────────────────────────────────────────────────────
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
        flexShrink: 0,
        padding: "8px 14px", borderRadius: 8,
        background: focus ? "var(--accent)" : "var(--pl-navy)",
        color: focus ? "var(--accent-fg)" : "var(--pl-cream)",
        fontFamily: "var(--font-mono)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em",
      }}>{p.short}</div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--fg-1)", letterSpacing: "-0.005em" }}>{p.name}</span>
          {focus && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", padding: "3px 9px", borderRadius: 4, background: "var(--accent)", color: "var(--accent-fg)", textTransform: "uppercase" }}>Focus</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, height: 7, borderRadius: 999, background: "var(--bg-elev-1)", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${p.score}%`,
              background: fillColor,
              transition: "width 500ms",
            }}/>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums", minWidth: 42, textAlign: "right", lineHeight: 1 }}>{p.score}</span>
        </div>
      </div>
      <div style={{
        flexShrink: 0,
        width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center",
        background: p.trend === "up" ? "var(--ok-soft)" : p.trend === "down" ? "var(--err-soft)" : "var(--bg-elev-1)",
        color: p.trend === "up" ? "var(--ok)" : p.trend === "down" ? "var(--err)" : "var(--fg-3)",
      }}>
        <AfIcon name={p.trend === "up" ? "trend-up" : p.trend === "down" ? "trend-down" : "trend-flat"} size={18}/>
      </div>
    </div>
  );
}

function PillarBar({ pillars }) {
  return (
    <div style={{ background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)", padding: "26px 64px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
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
      <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--warn)", animation: "hajaPulse 1.6s ease-out infinite" }}/>
      [SIMULATION · DONNÉES SYNTHÉTIQUES COHÉRENTES DIGITAL TWIN V3]
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Cockpit header (drill-up Ketsiah CFO)
// ───────────────────────────────────────────────────────────
function CockpitHeader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 8 }}>
      <a href="#" onClick={(e) => e.preventDefault()}
        style={{
          fontSize: 14, color: "var(--accent)", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content",
          padding: "7px 16px", borderRadius: 999, border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))",
          background: "color-mix(in srgb, var(--accent) 8%, transparent)",
          fontWeight: 600, cursor: "pointer", letterSpacing: "-0.005em",
          backdropFilter: "blur(6px)",
          transition: "all 180ms",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 16%, transparent)"; e.currentTarget.style.transform = "translateX(-3px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 8%, transparent)"; e.currentTarget.style.transform = "none"; }}>
        <AfIcon name="arrow-right" size={13} style={{ transform: "rotate(180deg)" }}/> Ketsiah · CFO
      </a>
      <div style={{ fontSize: 44, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.03em", lineHeight: 1.02, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        COCKPIT HAJA <span style={{ color: "var(--accent)", fontWeight: 400, opacity: 0.6 }}>·</span> <span style={{ color: "var(--fg-2)" }}>RESP ADMIN &amp; FINANCE</span>
      </div>
      <div style={{ fontSize: 17, color: "var(--fg-2)", lineHeight: 1.6, maxWidth: 880 }}>
        Pilotage Admin-Fi &amp; RH · <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>5 lieutenants</strong> · <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>SO·1 owner</strong> · drill-up Ketsiah CFO · drill-down cockpits
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// SO Band (A/B/C · Objectif 1 · OWNER)
// ───────────────────────────────────────────────────────────
function ObjectiveBand() {
  const [variant, setVariant] = useState("A");
  const ecart = SO_KPI.value - SO_KPI.target; // 68 - 60 = 8 jours d'écart (DSO trop élevé)
  const pct = Math.round((SO_KPI.target / SO_KPI.value) * 100); // progrès vers cible plus basse
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

function OwnerTag() {
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 4, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.14em", textTransform: "uppercase",
      background: "color-mix(in srgb, var(--accent) 28%, transparent)",
      color: "var(--pl-cream)",
      border: "1px solid color-mix(in srgb, var(--accent) 55%, transparent)",
      fontFamily: "var(--font-mono)",
    }}>★ OWNER</span>
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.q} · OBJECTIF RATTACHÉ</div>
          <OwnerTag/>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{SO_DATA.code}</div>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--pl-teal-light)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.subtitle}</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: "var(--pl-cream)", letterSpacing: "-0.015em", lineHeight: 1.25 }}>{SO_DATA.title}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 240, flex: "2 1 280px", borderLeft: "1px solid color-mix(in srgb, var(--pl-cream) 14%, transparent)", paddingLeft: 22 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 600, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.03em" }}>{value}<span style={{ fontSize: 20, color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)" }}>j</span></span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--pl-cream)" }}>{SO_KPI.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, position: "relative", height: 10, borderRadius: 999, background: "color-mix(in srgb, var(--pl-cream) 10%, transparent)", overflow: "visible" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, width: `${pct}%`, background: "var(--accent)" }}/>
            <div style={{ position: "absolute", left: `${pct}%`, top: -4, bottom: -4, width: 2, marginLeft: -1, background: "var(--pl-cream)", opacity: 0.6, borderRadius: 1 }}/>
          </div>
          <Sparkline series={SO_KPI.series} color="var(--pl-teal-light)" target={target} width={110} height={26}/>
        </div>
        <div style={{ fontSize: 12, color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)" }}>{SO_KPI.hint}</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <div style={{ padding: "8px 14px", borderRadius: 8, minWidth: 88, textAlign: "center", background: "color-mix(in srgb, var(--err) 24%, transparent)", border: "1px solid color-mix(in srgb, var(--err) 55%, transparent)" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>écart</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "#FFB4A3", fontWeight: 700, letterSpacing: "-0.02em" }}>−{ecart}<span style={{ fontSize: 12, opacity: 0.7 }}> j</span></div>
        </div>
        <div style={{ padding: "8px 14px", borderRadius: 8, minWidth: 88, textAlign: "center", background: "color-mix(in srgb, var(--pl-cream) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--pl-cream) 18%, transparent)" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>cible</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--pl-cream)", fontWeight: 700, letterSpacing: "-0.02em" }}>≤{target}<span style={{ fontSize: 12, opacity: 0.7 }}> j</span></div>
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.q} · OBJECTIF RATTACHÉ</div>
          <span style={{
            padding: "3px 9px", borderRadius: 4, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            background: "var(--accent-soft)", color: "var(--accent)",
            border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
            fontFamily: "var(--font-mono)",
          }}>★ OWNER</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{SO_DATA.code}</span>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.subtitle}</span>
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.015em", lineHeight: 1.25 }}>{SO_DATA.title}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 240, flex: "2 1 260px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 52, fontWeight: 600, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.035em" }}>{value}<span style={{ fontSize: 22, color: "var(--fg-3)" }}>j</span></span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)", marginLeft: 4 }}>{SO_KPI.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, position: "relative", height: 10, borderRadius: 999, background: "var(--bg-elev-1)" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, width: `${pct}%`, background: "var(--accent)" }}/>
            <div style={{ position: "absolute", left: `${pct}%`, top: -3, bottom: -3, width: 2, marginLeft: -1, background: "var(--fg-2)", borderRadius: 1 }}/>
          </div>
          <Sparkline series={SO_KPI.series} color="var(--accent)" target={target} width={110} height={30}/>
        </div>
        <div style={{ fontSize: 13, color: "var(--fg-3)" }}>{SO_KPI.hint}</div>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--err-soft)", border: "1px solid color-mix(in srgb, var(--err) 30%, transparent)", textAlign: "center", minWidth: 88 }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>écart</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--err)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>−{ecart}<span style={{ fontSize: 11, opacity: 0.7 }}> j</span></div>
        </div>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-elev-1)", border: "1px solid var(--border)", textAlign: "center", minWidth: 88 }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>cible</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--fg-1)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>≤{target}<span style={{ fontSize: 11, opacity: 0.7 }}> j</span></div>
        </div>
      </div>
    </div>
  );
}

function SOC({ value, target, ecart, pct }) {
  const size = 140, stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ratio = pct / 100;
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
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c * ratio} ${c}`} transform={`rotate(-90 ${size/2} ${size/2})`}/>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 600, color: "var(--pl-cream)", lineHeight: 1, letterSpacing: "-0.03em" }}>{value}<span style={{ fontSize: 18, opacity: 0.6 }}> j</span></span>
          <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginTop: 2 }}>cible ≤{target} j</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.q} · objectif rattaché</span>
          <OwnerTag/>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{SO_DATA.code}</span>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--pl-teal-light)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.subtitle}</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--pl-cream)", letterSpacing: "-0.015em", lineHeight: 1.2 }}>{SO_DATA.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--pl-cream)" }}>{SO_KPI.label}</div>
          <Sparkline series={SO_KPI.series} color="var(--pl-teal-light)" target={target} width={160} height={36}/>
          <span style={{ padding: "5px 12px", borderRadius: 999, background: "color-mix(in srgb, var(--err) 28%, transparent)", border: "1px solid color-mix(in srgb, var(--err) 55%, transparent)", color: "#FFB4A3", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)" }}>écart −{ecart} j</span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 4 KPI cœur
// ───────────────────────────────────────────────────────────
function CoreKpiCard({ k }) {
  const tone = statusTone(k.status);
  return (
    <div style={{
      background: "var(--surface)", border: `1px solid color-mix(in srgb, ${tone.color} 35%, var(--border))`,
      borderRadius: 12, padding: "16px 18px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: "var(--shadow-1)",
      position: "relative", overflow: "hidden", minWidth: 0,
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: tone.color }}/>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: tone.bg, color: tone.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <AfIcon name={k.icon} size={22}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "var(--fg-2)", fontWeight: 500, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 600, color: tone.color, letterSpacing: "-0.025em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
          {k.unit && <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: k.isMontant ? "var(--font-mono)" : "var(--font-sans)" }}>{k.unit}</span>}
          <span style={{ fontSize: 11, color: "var(--fg-3)", marginLeft: 6, fontFamily: "var(--font-mono)" }}>cible {k.target}</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <AfIcon name="user" size={10}/> src · <strong style={{ fontWeight: 600, color: "var(--fg-2)" }}>{k.source}</strong>
        </div>
      </div>
    </div>
  );
}

function CoreKpis() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
      {CORE_KPIS.map((k) => <CoreKpiCard key={k.id} k={k}/>)}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Bloc CASH CONSOLIDÉ — trésorerie & encours · cœur Resp Compta&Fi
// ───────────────────────────────────────────────────────
function CashCard({ k }) {
  const tone = statusTone(k.status);
  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${k.status === "err" ? "color-mix(in srgb, var(--err) 40%, var(--border))" : "var(--border)"}`,
      borderRadius: 14, padding: "22px 22px 20px",
      display: "flex", flexDirection: "column", gap: 10,
      boxShadow: "var(--shadow-1)",
      position: "relative", overflow: "hidden", minWidth: 0,
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: tone.color }}/>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingLeft: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `color-mix(in srgb, ${tone.color} 14%, transparent)`, color: tone.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <AfIcon name={k.icon} size={15}/>
          </div>
          <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.label}</span>
        </div>
        {k.confirm && <span className="confirm-badge">⚠ À CONFIRMER</span>}
      </div>
      <div style={{ paddingLeft: 8, display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 600, color: k.status === "info" ? "var(--fg-3)" : tone.color, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
        {k.unit && <span style={{ fontSize: 14, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>{k.unit}</span>}
      </div>
      {k.target && <div style={{ paddingLeft: 8, fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>cible <strong style={{ color: "var(--fg-2)", fontWeight: 600 }}>{k.target}</strong></div>}
      <div style={{ paddingLeft: 8, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>{k.hint}</div>
    </div>
  );
}

function CashBlock() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ width: 4, height: 22, background: "var(--accent)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.005em", textTransform: "uppercase" }}>Trésorerie, encours & compta</h3>
        <span style={{ fontSize: 14, color: "var(--fg-3)" }}>(consolidé · 6 banques + AR + AP + compta)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {CASH_DATA.map((k) => <CashCard key={k.id} k={k}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// LieutenantsCompositeScoreCascade — D54
// Lignes empilées (cascade) · collapsed = avatar/persona/score/trend/30j/pastille/chevron
// Expand = 5 sous-scores (CHARGE/SIGNAUX 7J/RÉSOLUTION/SANTÉ S/DEPT/ALIGNEMENT TER)
//         + chips signaux + "Voir cockpit →"
// ───────────────────────────────────────────────────────────

function trendIcon(t) {
  if (t === "up")    return { name: "trend-up",   color: "var(--ok)" };
  if (t === "down")  return { name: "trend-down", color: "var(--err)" };
  return                  { name: "trend-flat", color: "var(--fg-3)" };
}

function SubScoreBar({ s }) {
  const tone = statusTone(s.status);
  const numeric = typeof s.value === "number";
  const pct = numeric ? Math.min(100, Math.max(0, s.unit === "%" ? s.value : s.value * 10)) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{s.label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: tone.color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.015em" }}>{s.value}{s.unit}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "var(--bg-elev-1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: tone.color, borderRadius: 999 }}/>
      </div>
      <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.45 }}>{s.hint}</div>
    </div>
  );
}

function Avatar({ initials, b17 }) {
  return (
    <div style={{
      width: 48, height: 48, flexShrink: 0,
      borderRadius: 12,
      background: b17 ? "var(--pl-navy)" : "var(--pl-navy)",
      color: "var(--pl-cream)",
      display: "grid", placeItems: "center",
      fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em",
      fontFamily: "var(--font-mono)",
      border: b17 ? "1px solid color-mix(in srgb, var(--err) 50%, transparent)" : "1px solid color-mix(in srgb, var(--pl-cream) 8%, transparent)",
    }}>{initials}</div>
  );
}

function LieutenantCascadeRow({ l, expanded, onToggle, isLast }) {
  const tone = statusTone(l.status);
  const tr = trendIcon(l.trend);
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: isLast && !expanded ? "none" : "1px solid var(--border-soft)",
        background: expanded
          ? "color-mix(in srgb, var(--bg-elev-1) 50%, var(--surface))"
          : hover
            ? "color-mix(in srgb, var(--bg-elev-1) 30%, var(--surface))"
            : "transparent",
        transition: "background 180ms",
      }}>
      {/* COLLAPSED · avatar · fonction+persona · score · trend · 30j · pastille · chevron */}
      <button onClick={onToggle}
        style={{
          all: "unset", cursor: "pointer", display: "block", width: "100%",
          padding: "22px 26px",
        }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto auto auto", gap: 20, alignItems: "center" }}>
          <Avatar initials={l.avatar} b17={l.b17}/>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.015em" }}>{l.name}</span>
              {l.b17 && (
                <span style={{
                  padding: "3px 9px", borderRadius: 4,
                  background: "color-mix(in srgb, var(--accent) 22%, transparent)",
                  color: "var(--accent)",
                  fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
                }}>B17 · agrégé</span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4, lineHeight: 1.45, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.persona}</div>
          </div>

          <div style={{ textAlign: "right", minWidth: 78 }}>
            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 3 }}>Score</div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 600,
              color: "var(--fg-1)",
              lineHeight: 1, letterSpacing: "-0.035em", fontVariantNumeric: "tabular-nums",
            }}>{l.score}</div>
          </div>

          <div style={{
            width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center",
            background: l.trend === "up" ? "var(--ok-soft)" : l.trend === "down" ? "var(--err-soft)" : "var(--bg-elev-1)",
            color: tr.color,
          }}>
            <AfIcon name={tr.name} size={18}/>
          </div>

          <div style={{ textAlign: "right", minWidth: 80 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: tr.color, letterSpacing: "-0.01em" }}>{l.delta30}</div>
            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 2 }}>30 j</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span title={tone.label} style={{
              width: 14, height: 14, borderRadius: 999,
              background: tone.color, flexShrink: 0,
            }}/>
            <span style={{
              width: 30, height: 30, borderRadius: 8,
              display: "grid", placeItems: "center",
              background: hover || expanded ? "var(--accent-soft)" : "var(--bg-elev-1)",
              color: hover || expanded ? "var(--accent)" : "var(--fg-2)",
              transition: "transform 200ms, background 200ms",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}>
              <AfIcon name="arrow-right" size={14}/>
            </span>
          </div>
        </div>
      </button>

      {/* EXPAND · 5 sous-scores + signaux + drill cockpit */}
      {expanded && (
        <div style={{
          padding: "4px 26px 24px 90px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 22, paddingTop: 10,
          }}>
            {["charge","signaux","resolution","sante","ter"].map((k) => (
              <SubScoreBar key={k} s={l.sub[k]}/>
            ))}
          </div>

          {l.signaux && l.signaux.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {l.signaux.map((s, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "7px 12px", borderRadius: 999,
                  background: "var(--bg-elev-1)",
                  border: "1px solid var(--border-soft)",
                  fontSize: 13, color: "var(--fg-2)", lineHeight: 1.3,
                }}>
                  <AfIcon name="bolt" size={12} color="var(--warn)"/>
                  {s}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div style={{ fontSize: 13, color: "var(--fg-3)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <AfIcon name="info" size={13} color="var(--fg-3)"/>
              <span><strong style={{ color: "var(--fg-2)", fontWeight: 600 }}>{l.metricLabel}</strong> · {l.metricValue} {l.metricUnit} (cible {l.metricTarget})</span>
            </div>
            <a href={l.drill} onClick={(e) => { if (l.drill === "#") e.preventDefault(); }}
              style={{
                padding: "10px 18px", borderRadius: 10,
                background: "var(--accent)", color: "var(--accent-fg)",
                textDecoration: "none", fontSize: 14, fontWeight: 600,
                display: "inline-flex", alignItems: "center", gap: 10,
                letterSpacing: "-0.005em",
              }}>
              Voir cockpit <AfIcon name="arrow-right" size={14}/>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function LieutenantsRollup() {
  const [expanded, setExpanded] = useState(null);
  const aggregate = useMemo(() => computeAggregateScore(), []);
  const aggTone = aggregate >= 75 ? statusTone("ok") : aggregate >= 60 ? statusTone("warn") : statusTone("err");
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 4, height: 22, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.005em", textTransform: "uppercase" }}>Les 5 lieutenants</h3>
          <span style={{ fontSize: 14, color: "var(--fg-3)" }}>(composite score cascade · D54)</span>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 14,
          padding: "10px 18px", borderRadius: 999,
          background: aggTone.bg,
          border: `1px solid color-mix(in srgb, ${aggTone.color} 30%, transparent)`,
        }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Score agrégé Haja</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, color: aggTone.color, lineHeight: 1, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>{aggregate}</span>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)" }}>moy. 5 lt</span>
        </div>
      </div>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14, overflow: "hidden",
        boxShadow: "var(--shadow-1)",
      }}>
        {LIEUTENANTS.map((l, i) => (
          <LieutenantCascadeRow key={l.id} l={l}
            expanded={expanded === l.id}
            onToggle={() => setExpanded((p) => p === l.id ? null : l.id)}
            isLast={i === LIEUTENANTS.length - 1}/>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// À ARBITRER — table + seuils
// ───────────────────────────────────────────────────────────
function ApprovalLegend() {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 10,
      padding: "12px 18px", borderRadius: 12,
      background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)",
      marginBottom: 14,
    }}>
      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, alignSelf: "center", marginRight: 4 }}>Seuils Authority Matrix ·</span>
      {APPROVAL_THRESHOLDS.map((t, i) => {
        const tn = statusTone(t.tone);
        return (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 11px", borderRadius: 999,
            background: tn.bg, color: tn.color,
            fontSize: 12.5, fontFamily: "var(--font-mono)", fontWeight: 600,
            border: `1px solid color-mix(in srgb, ${tn.color} 28%, transparent)`,
          }}>
            <span style={{ fontWeight: 700 }}>{t.range}</span>
            <span style={{ opacity: 0.7 }}>· {t.who}</span>
          </span>
        );
      })}
    </div>
  );
}

const ARB_COLS = "170px 1fr 200px 220px";

function ArbitrerRow({ a, isLast, onAction }) {
  const action = statusTone(a.actionTone);
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: ARB_COLS, gap: 18,
        alignItems: "center", padding: "18px 22px",
        borderBottom: isLast ? "none" : "1px solid var(--border-soft)",
        background: hover ? "color-mix(in srgb, var(--bg-elev-1) 30%, var(--surface))" : "transparent",
        transition: "background 160ms",
        minWidth: "max-content",
      }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 11px", borderRadius: 999,
          background: "var(--accent-soft)", color: "var(--accent)",
          fontSize: 13, fontWeight: 700, width: "fit-content",
          border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
        }}>
          <AfIcon name="user" size={12}/> {a.source}
        </span>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)", letterSpacing: "0.05em", paddingLeft: 4, lineHeight: 1.4 }}>{a.seuil}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.45, letterSpacing: "-0.005em" }}>{a.subject}</div>
        <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 5, lineHeight: 1.5 }}>{a.detail}</div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 5 }}>{a.montantLabel}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.015em", fontVariantNumeric: "tabular-nums" }}>{a.montantValue}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => onAction(a)}
          style={{
            padding: "12px 18px", borderRadius: 10,
            background: action.color,
            color: "white",
            border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
            boxShadow: hover ? "0 4px 12px rgba(6,24,41,0.22)" : "0 2px 6px rgba(6,24,41,0.14)",
            whiteSpace: "nowrap",
            display: "inline-flex", alignItems: "center", gap: 8,
            transition: "all 180ms",
            transform: hover ? "translateY(-1px)" : "none",
            letterSpacing: "-0.005em",
          }}>
          {a.actionLabel}
          <AfIcon name="arrow-right" size={13}/>
        </button>
      </div>
    </div>
  );
}

function ArbitrerHeader() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: ARB_COLS, gap: 18,
      padding: "14px 22px",
      background: "var(--pl-navy)", color: "var(--pl-cream)",
      fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
      alignItems: "center", minWidth: "max-content",
    }}>
      <span>Source</span>
      <span>Sujet</span>
      <span>Montant / Enjeu</span>
      <span style={{ textAlign: "right" }}>Action</span>
    </div>
  );
}

function ArbitrerBlock({ onAction }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 4, height: 22, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.005em", textTransform: "uppercase" }}>À arbitrer</h3>
          <span style={{ fontSize: 14, color: "var(--fg-3)" }}>(escalades · signaux remontés des 5 lieutenants)</span>
        </div>
        <Chip color="var(--warn)" bg="var(--warn-soft)" border="1px solid color-mix(in srgb, var(--warn) 30%, transparent)">
          <AfIcon name="alert" size={12} color="var(--warn)"/> {ARBITRER.length} décisions en attente
        </Chip>
      </div>
      <ApprovalLegend/>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden",
        boxShadow: "var(--shadow-1)",
      }}>
        <div style={{ overflowX: "auto" }}>
          <ArbitrerHeader/>
          <div>
            {ARBITRER.map((a, i) => <ArbitrerRow key={a.id} a={a} isLast={i === ARBITRER.length - 1} onAction={onAction}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sidebar — 5 onglets (PAS Admin-Fi · PAS Coaching)
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
    <aside style={{ width: 252, flexShrink: 0, background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: 16, flex: 1 }}>
        {NAV.map((n) => {
          const a = active === n.id;
          return (
            <button key={n.id} onClick={() => onTab(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 10,
                background: a ? "var(--pl-navy)" : "transparent",
                color: a ? "var(--pl-cream)" : "var(--fg-2)",
                border: "none", cursor: "pointer", textAlign: "left",
                fontSize: 15, fontWeight: a ? 600 : 500, letterSpacing: "-0.005em",
                transition: "background 160ms, transform 160ms",
              }}
              onMouseEnter={(e) => { if (!a) { e.currentTarget.style.background = "var(--bg-elev-1)"; e.currentTarget.style.transform = "translateX(2px)"; } }}
              onMouseLeave={(e) => { if (!a) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; } }}>
              <AfIcon name={n.icon} size={18} color={a ? "var(--accent)" : "var(--fg-3)"}/>
              {n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 16, borderTop: "1px solid var(--border-soft)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.05em" }}>Design System D82</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--warn)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
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
      background: "var(--pl-navy-deep)",
      color: "var(--pl-cream)",
      padding: "18px 32px",
      borderBottom: "1px solid color-mix(in srgb, var(--pl-cream) 8%, var(--pl-navy-deep))",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: "var(--pl-cream)", letterSpacing: "-0.01em" }}>Admin-Fi</span>
        <span style={{ color: "var(--pl-teal)", fontSize: 19 }}>·</span>
        <span style={{ fontSize: 19, fontWeight: 700, color: "var(--pl-teal-light)", letterSpacing: "-0.01em" }}>Haja</span>
        <Chip color="var(--pl-teal-light)" bg="color-mix(in srgb, var(--pl-teal) 20%, transparent)" border="1px solid color-mix(in srgb, var(--pl-teal-light) 30%, transparent)">
          Premium Logistics
        </Chip>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", padding: "4px 11px", borderRadius: 4, background: "color-mix(in srgb, var(--accent) 25%, transparent)", color: "var(--pl-cream)", border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)", letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase" }}>Manager</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onTheme}
          style={{
            padding: "7px 14px", borderRadius: 7,
            background: "transparent", color: "var(--pl-cream)",
            border: "1px solid color-mix(in srgb, var(--pl-cream) 20%, transparent)",
            fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.05em",
          }}>
          {theme === "dark" ? "DARK" : "LIGHT"}
        </button>
        <span style={{ fontSize: 13, color: "color-mix(in srgb, var(--pl-cream) 65%, transparent)", fontFamily: "var(--font-mono)" }}>27 mai 2026</span>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--pl-teal)", display: "grid", placeItems: "center", color: "var(--pl-navy-deep)", fontWeight: 700, fontSize: 15 }}>H</div>
      </div>
    </header>
  );
}

// ───────────────────────────────────────────────────────────
// Scores tab — 8 KPI Haja (F-K01..F-K08) + cascade SO
// ───────────────────────────────────────────────────────────
function ScoresTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>Scorecard Haja · 8 KPI</h3>
          <span style={{ fontSize: 13, color: "var(--fg-3)" }}>(F-K01..F-K08 · dérivés des 4 lieutenants)</span>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-1)" }}>
          <div style={{ overflowX: "auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "70px 1fr 110px 110px 130px 110px 140px",
              gap: 12,
              padding: "12px 16px",
              background: "var(--pl-navy)", color: "var(--pl-cream)",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              alignItems: "center", minWidth: "max-content",
            }}>
              <span>Code</span>
              <span>KPI</span>
              <span>Valeur</span>
              <span>Cible</span>
              <span>Statut</span>
              <span>Source</span>
              <span style={{ textAlign: "right" }}>Tendance 12 sem.</span>
            </div>
            {PERSO_KPIS.map((k, i) => {
              const tone = k.status === "ok" ? statusTone("ok") : k.status === "warn" ? statusTone("warn") : statusTone("err");
              const statusLabel = k.status === "ok" ? "Atteint" : k.status === "warn" ? "À surveiller" : "Sous cible";
              return (
                <div key={k.id} style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr 110px 110px 130px 110px 140px",
                  gap: 12,
                  padding: "14px 16px",
                  alignItems: "center",
                  borderBottom: i === PERSO_KPIS.length - 1 ? "none" : "1px solid var(--border-soft)",
                  minWidth: "max-content",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)", fontWeight: 700, letterSpacing: "0.04em" }}>{k.id}</span>
                  <span style={{ fontSize: 14, color: "var(--fg-1)", fontWeight: 500 }}>
                    {k.label}
                    {k.confirm && <span className="confirm-badge" style={{ marginLeft: 8 }}>⚠ À CONFIRMER</span>}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: tone.color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.015em" }}>{k.value}{typeof k.value === "number" && k.unit === "%" ? " %" : k.unit && typeof k.value === "number" ? ` ${k.unit}` : ""}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>{typeof k.target === "number" ? `${k.invert ? "≤" : "≥"}${k.target}${k.unit === "%" ? " %" : k.unit ? ` ${k.unit}` : ""}` : k.target}</span>
                  <Chip color={tone.color} bg={tone.bg} border={`1px solid color-mix(in srgb, ${tone.color} 30%, transparent)`}>{statusLabel}</Chip>
                  <span style={{ fontSize: 12, color: "var(--fg-2)" }}>{k.source}</span>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {k.series && <Sparkline series={k.series} color={tone.color} target={typeof k.target === "number" ? k.target : null} width={130} height={32}/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cascade SO/Pilier */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, boxShadow: "var(--shadow-1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "0.01em" }}>Cascade SO · Pilier</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { title: "SO·1 Cash · OWNER",  kpis: ["F-K01 DSO", "F-K05 Décaiss.", "F-K06 Caisse"], pillar: "P2", tone: "err" },
            { title: "SO·2 Order-to-Cash", kpis: ["F-K02 NoDos→Fac.", "F-K07 Marge", "F-K08 Pré-fac."], pillar: "P2", tone: "warn" },
            { title: "SO·3 Discipline",    kpis: ["F-K03 Clôture J+5"], pillar: "P1", tone: "warn" },
            { title: "Dette structurelle", kpis: ["F-K04 BGFI"], pillar: "P2", tone: "err" },
          ].map((c, i) => {
            const tn = statusTone(c.tone);
            return (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg-elev-1)", border: `1px solid color-mix(in srgb, ${tn.color} 25%, var(--border-soft))` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg-1)" }}>{c.title}</span>
                  <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700, background: "var(--pl-navy)", color: "var(--pl-cream)", letterSpacing: "0.06em" }}>{c.pillar}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {c.kpis.map((k) => (
                    <span key={k} style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-2)" }}>· {k}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Assistant tab (copilote manager · synthèse + prompts cadrés)
// ───────────────────────────────────────────────────────────
const ASSISTANT_PROMPTS = [
  "Pourquoi le DSO global ne baisse pas malgré les actions de Sarobidy ?",
  "Quels dossiers de la file Facturation impactent le plus la marge Q3 ?",
  "Cascade les écarts vers les pilier P2 Cash et propose 3 actions cette semaine.",
  "Prépare un brief 5 lignes pour Ketsiah CFO sur la dette BGFI.",
];

function AssistantTab() {
  const [input, setInput] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{
        background: "linear-gradient(135deg, var(--pl-navy-deep) 0%, var(--pl-navy) 100%)",
        borderRadius: 14, padding: "22px 26px",
        color: "var(--pl-cream)",
        border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--pl-navy))",
        display: "flex", flexDirection: "column", gap: 14,
        boxShadow: "0 6px 18px rgba(6,24,41,0.25)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", color: "var(--accent-fg)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <AfIcon name="spark" size={18}/>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--pl-cream)" }}>Copilote manager · LOI Twin V3</div>
            <div style={{ fontSize: 12, color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", fontFamily: "var(--font-mono)" }}>Synthèse cross-lieutenants · cascade SO / pilier · arbitrage</div>
          </div>
        </div>
        <div style={{
          padding: "14px 16px", borderRadius: 10,
          background: "color-mix(in srgb, var(--pl-cream) 6%, transparent)",
          border: "1px solid color-mix(in srgb, var(--pl-cream) 12%, transparent)",
          fontSize: 14, lineHeight: 1.55, color: "var(--pl-cream)",
        }}>
          <strong style={{ color: "var(--pl-teal-light)" }}>Aujourd'hui ·</strong> 5 décisions en attente (dont 2 escalades Ketsiah). DSO stable à 68 j (≈ −8 j d'écart) — le levier principal reste la marge PDJV chez Facturation (<strong>F-K07</strong>, sous 7 %) et le pattern mining chez Sarobidy (35 M MGA, 5 clients). Christine signale un risque licence CAD (J+30) — à arbitrer avant fin de semaine.
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>Prompts cadrés manager</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
          {ASSISTANT_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => setInput(p)}
              style={{
                textAlign: "left", padding: "14px 16px", borderRadius: 10,
                background: "var(--surface)", color: "var(--fg-1)",
                border: "1px solid var(--border)", cursor: "pointer",
                fontSize: 13, lineHeight: 1.5, fontWeight: 500,
                display: "flex", alignItems: "flex-start", gap: 10,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 45%, var(--border))"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}>
              <AfIcon name="spark" size={14} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }}/>
              <span>{p}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
        padding: 12, display: "flex", gap: 10, alignItems: "center",
        boxShadow: "var(--shadow-1)",
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose une question · ex : « Pourquoi le DSO ne baisse pas ? »"
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 8,
            background: "var(--bg-elev-1)", color: "var(--fg-1)",
            border: "1px solid var(--border-soft)",
            fontSize: 14, fontFamily: "var(--font-sans)",
          }}/>
        <button style={{
          padding: "12px 18px", borderRadius: 8,
          background: "var(--accent)", color: "var(--accent-fg)",
          border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          <AfIcon name="arrow-right" size={14}/> Demander
        </button>
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
              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700,
                background: c.type === "decision" ? "var(--accent-soft)" : "var(--warn-soft)",
                color: c.type === "decision" ? "var(--accent)" : "var(--warn)",
              }}>{c.type}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>{c.date}</span>
            </div>
            <div style={{ fontSize: 15, color: "var(--fg-1)", marginTop: 6 }}>{c.text}</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <AfIcon name="user" size={12}/> Flux : <strong style={{ fontWeight: 600, color: "var(--fg-2)" }}>{c.source}</strong>
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
    "Pilotage 5 lieutenants Admin-Fi & RH",
    "OWNER SO·1 Cash · Encaissement & dette",
    "Arbitrage 1–3 M Ar · co-signature 3–5 M",
    "Cascade KPI vers Ketsiah CFO",
    "Routine clôture mensuelle J+5",
    "Authority Matrix · seuils approbation",
    "Pacte TER · cadence 1on1 lieutenants",
  ];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 26, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{ width: 96, height: 96, borderRadius: 20, background: "linear-gradient(135deg, var(--accent) 0%, var(--pl-navy) 100%)", display: "grid", placeItems: "center", color: "white", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>H</div>
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.015em" }}>Haja</div>
          <div style={{ fontSize: 14, color: "var(--fg-3)" }}>Resp Admin & Finance · Manager 5 lieutenants (Admin-Fi + RH) · OWNER SO·1</div>
        </div>
        <div className="label">Reporting</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Chip color="var(--accent)" bg="var(--accent-soft)" border="1px solid color-mix(in srgb, var(--accent) 30%, transparent)">↑ Ketsiah · CFO</Chip>
          <Chip color="var(--accent)" bg="var(--accent-soft)" border="1px solid color-mix(in srgb, var(--accent) 30%, transparent)">↓ Sarobidy</Chip>
          <Chip color="var(--accent)" bg="var(--accent-soft)" border="1px solid color-mix(in srgb, var(--accent) 30%, transparent)">↓ Belaza</Chip>
          <Chip color="var(--accent)" bg="var(--accent-soft)" border="1px solid color-mix(in srgb, var(--accent) 30%, transparent)">↓ Christine</Chip>
          <Chip color="var(--accent)" bg="var(--accent-soft)" border="1px solid color-mix(in srgb, var(--accent) 30%, transparent)">↓ Facturation (Lynda + Rico)</Chip>
          <Chip color="var(--accent)" bg="var(--accent-soft)" border="1px solid color-mix(in srgb, var(--accent) 30%, transparent)">↓ Édienne · RH (B17 agrégé)</Chip>
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
// Toast — confirmation arbitrage / cascade
// ───────────────────────────────────────────────────────────
function Toast({ items, onClose }) {
  if (items.length === 0) return null;
  return (
    <div style={{ position: "fixed", top: 80, right: 24, zIndex: 200, display: "flex", flexDirection: "column", gap: 8, maxWidth: 380 }}>
      {items.map((t) => (
        <div key={t.id} style={{
          background: "var(--surface)", color: "var(--fg-1)",
          border: `1px solid color-mix(in srgb, ${t.tone || "var(--ok)"} 40%, var(--border))`,
          boxShadow: "0 10px 24px rgba(6,24,41,0.18)",
          borderRadius: 10, padding: "14px 16px",
          display: "flex", alignItems: "flex-start", gap: 10,
          animation: "hajaToastIn 220ms cubic-bezier(.2,.7,.2,1)", minWidth: 320,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `color-mix(in srgb, ${t.tone || "var(--ok)"} 18%, transparent)`, color: t.tone || "var(--ok)", display: "grid", placeItems: "center", flexShrink: 0 }}>
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
// Main
// ───────────────────────────────────────────────────────────
function App() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  const [tab, setTab] = useState("vue");

  // Arbitrage Haja · modales (Pattern 9 · anti-blind-POST)
  const [activeArb, setActiveArb] = useState(null);   // l'objet ARBITRER cliqué
  const [openModal, setOpenModal] = useState(null);    // "arbitrer" | "arbitrer-escalader" | "approuver-router"
  const [toasts, setToasts] = useState([]);

  const handleArbAction = (a) => {
    setActiveArb(a);
    setOpenModal(a.actionType);
  };
  const closeModal = () => { setOpenModal(null); };

  const pushToast = (title, subtitle, tone, icon) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((p) => [...p, { id, title, subtitle, tone, icon }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5200);
  };
  const closeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const onArbitrerSubmit = (data) => {
    closeModal();
    const dec = data.decision === "valider" ? "validé"
              : data.decision === "rejeter" ? "rejeté"
              : "reprise demandée";
    const tone = data.decision === "rejeter" ? "var(--err)" : data.decision === "reprise" ? "var(--warn)" : "var(--ok)";
    pushToast(`✓ ${data.ctx.source} · ${dec}`, `${data.ctx.subject} · M13 = arbitrage_haja`, tone, data.decision === "rejeter" ? "x" : "check");
  };
  const onEscaladeSubmit = (data) => {
    closeModal();
    if (data.event === "cascade_ketsiah") {
      pushToast(`↑ Escaladé Ketsiah CFO`, `${data.ctx.source} · ${data.ctx.subject} · cascade ${data.route}`, "var(--accent)", "arrow-right");
    } else {
      pushToast(`✓ ${data.ctx.source} · arbitré`, `${data.ctx.subject} · M13 = arbitrage_haja`, "var(--ok)", "check");
    }
  };
  const onApprouverSubmit = (data) => {
    closeModal();
    const labels = {
      notif_agent:                       { t: "↗ Notif. agent autonome",       tone: "var(--ok)",     icon: "check" },
      approve_haja_solo:                 { t: "✓ Approuvé · Haja solo",        tone: "var(--ok)",     icon: "check" },
      approve_haja_co_route_ketsiah:     { t: "✓ Co-approuvé · ouvre Ketsiah", tone: "var(--warn)",   icon: "shield" },
      route_ketsiah:                     { t: "↑ Routé Ketsiah obligatoire",   tone: "var(--err)",    icon: "arrow-right" },
    };
    const meta = labels[data.event] || { t: "Routage effectué", tone: "var(--accent)", icon: "shield" };
    pushToast(meta.t, `${data.ctx.source} · ${data.ctx.montantValue} · ${data.tier} → ${data.route}`, meta.tone, meta.icon);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg-1)", display: "flex", flexDirection: "column" }} data-screen-label="Cockpit Haja · Resp Admin & Finance">
      <Header theme={theme} onTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")}/>
      <SimulationBanner/>
      <PillarBar pillars={PILLARS_DATA}/>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar active={tab} onTab={setTab}/>

        <main style={{
          flex: 1, overflow: "auto", padding: "44px 64px 72px",
          position: "relative",
        }}>
          <div style={{ maxWidth: 1520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 44, position: "relative" }}>
            {tab === "vue" && (
              <>
                <CockpitHeader/>
                <ObjectiveBand/>
                <CashBlock/>
                <LieutenantsRollup/>
                <ArbitrerBlock onAction={handleArbAction}/>
              </>
            )}
            {tab === "assistant" && <AssistantTab/>}
            {tab === "scores" && <ScoresTab/>}
            {tab === "carnet" && <CarnetTab/>}
            {tab === "profil" && <ProfilTab/>}
          </div>
        </main>
      </div>

      <footer style={{
        borderTop: "1px solid var(--border)", background: "var(--surface)",
        padding: "12px 24px", fontSize: 12, color: "var(--fg-3)",
        display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", flexWrap: "wrap", gap: 6,
      }}>
        <span>LOI · Cockpit Haja · Resp Admin & Finance · pilote 5 lieutenants</span>
        <span>CockpitLayout V2 · D82 · Digital Twin V3 · 27 mai 2026</span>
      </footer>

      <Toast items={toasts} onClose={closeToast}/>

      <ArbitrerModal           open={openModal === "arbitrer"}           onClose={closeModal} onSubmit={onArbitrerSubmit}  ctx={activeArb}/>
      <ArbitrerEscaladerModal  open={openModal === "arbitrer-escalader"} onClose={closeModal} onSubmit={onEscaladeSubmit}  ctx={activeArb}/>
      <ApprouverModal          open={openModal === "approuver-router"}   onClose={closeModal} onSubmit={onApprouverSubmit} ctx={activeArb}/>

      <style>{`
        @keyframes hajaPulse {
          0%   { opacity: 1; transform: scale(1); }
          70%  { opacity: 0; transform: scale(2.4); }
          100% { opacity: 0; transform: scale(2.4); }
        }
        @keyframes hajaToastIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
