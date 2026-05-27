/* global React, ReactDOM, AfIcon, DDVModal, FactureModal, DeclarationModal, STCModal */
// ════════════════════════════════════════════════════════════════
// LOI · Admin-Fi Sarobidy — Workspace D82 (Simple · gros texte lisible)
// ════════════════════════════════════════════════════════════════
const { useState, useMemo, useCallback, useEffect } = React;

// ───────────────────────────────────────────────────────────
// DATA
// ───────────────────────────────────────────────────────────
const PILLARS_DATA = [
  { id: "p1", short: "P1", name: "Exécution",       score: 78, trend: "up",     delta: "+4" },
  { id: "p2", short: "P2", name: "Cash",            score: 65, trend: "down",   delta: "−6", isFocus: true },
  { id: "p3", short: "P3", name: "Fidélité client", score: 82, trend: "stable", delta: "±0" },
  { id: "p4", short: "P4", name: "Fluidité",        score: 71, trend: "up",     delta: "+2" },
];

const STEPS = [
  { key: "demande", label: "Demande", icon: "step-demande" },
  { key: "matrice", label: "Matrice", icon: "step-matrice" },
  { key: "haja",    label: "Haja",    icon: "step-haja" },
  { key: "paye",    label: "Payé",    icon: "step-paye" },
];

const TYPE_META = {
  facturation: { label: "Facturation Vente", color: "var(--accent)",  actionLabel: "Émettre" },
  cnaps:       { label: "CNAPS",             color: "var(--pl-navy)", actionLabel: "Soumettre" },
  achat:       { label: "Achat",             color: "var(--warn)",    actionLabel: "Transmettre" },
  stc:         { label: "STC",               color: "var(--err)",     actionLabel: "Établir" },
};

const QUEUE_SEED = [
  { id: "ddv-001", type: "facturation", ref: "ddv-001", montant: "À CONFIRMER", demandeur: "Christine", dept: "Transit",    etape: "demande", ageJours: 2, slaJours: 3 },
  { id: "ddv-002", type: "cnaps",       ref: "ddv-002", montant: "À CONFIRMER", demandeur: "Lynda",     dept: "RH",         etape: "matrice", ageJours: 1, slaJours: 4 },
  { id: "ddv-003", type: "achat",       ref: "ddv-003", montant: "À CONFIRMER", demandeur: "Rico",      dept: "Achat",      etape: "haja",    ageJours: 4, slaJours: 3 },
  { id: "ddv-004", type: "facturation", ref: "ddv-004", montant: "À CONFIRMER", demandeur: "Belaza",    dept: "Commercial", etape: "demande", ageJours: 1, slaJours: 3 },
  { id: "ddv-005", type: "stc",         ref: "ddv-005", montant: "À CONFIRMER", demandeur: "Ketsiah",   dept: "RH",         etape: "matrice", ageJours: 3, slaJours: 5 },
  { id: "ddv-006", type: "facturation", ref: "ddv-006", montant: "À CONFIRMER", demandeur: "Édienne",   dept: "Transit",    etape: "demande", ageJours: 5, slaJours: 3 },
];

const COACHING = [
  {
    id: "sig-1", icon: "link",
    cause: "3 factures vente bloquées faute de pièces amont (Transit)",
    levier: "Aligne Christine sur la check-list pièces · relance Édienne sur les BL manquants",
    gain: "Déblocage de 3 lignes file de travail · réduction de l'âge moyen",
    source: "Christine",
  },
  {
    id: "sig-2", icon: "users",
    cause: "Déclaration CNAPS en attente — pièces RH incomplètes",
    levier: "Boucle avec Lynda pour clôturer la matrice avant échéance légale",
    gain: "Évite la pénalité CNAPS · sécurise P2 Cash",
    source: "Lynda",
  },
  {
    id: "sig-3", icon: "bolt",
    cause: "DDV achat Rico bloqué côté Haja depuis 4 jours",
    levier: "Pousse un point court Haja · documente le besoin opérationnel",
    gain: "Pipeline P4 Fluidité débloqué · trésorerie projetable",
    source: "Rico",
  },
];

const CARNET = [
  { id: "c-1", date: "2024-03-18", type: "decision", text: "Validation prioritaire des factures Transit > 72h",        source: "Haja" },
  { id: "c-2", date: "2024-03-15", type: "escalade", text: "Blocage paiement fournisseur — en attente BC validé",       source: "Rico" },
  { id: "c-3", date: "2024-03-12", type: "decision", text: "Routine CNAPS hebdomadaire · jeudi 10h",                    source: "Lynda" },
  { id: "c-4", date: "2024-03-08", type: "escalade", text: "STC débauche · escalade B17 pour visas manquants",          source: "Ketsiah" },
];

// SO + KPI
const SO_DATA = {
  code: "SO·2",
  title: "Cycle commande → facture maîtrisé",
  subtitle: "Order-to-Cash",
  q: "Q3",
};
const SO_KPI = {
  label: "Factures vente émises <72h",
  value: 78, target: 90, unit: "%",
  hint: "% sous SLA · 12 semaines glissantes",
  series: [62, 68, 64, 70, 72, 71, 74, 76, 75, 78, 77, 78],
};

// Conformité — comptes synthétiques (mois/dossiers)
const COMPLIANCE = [
  { id: "cnaps", label: "CNAPS à temps", current: 11, total: 12, unit: "mois", echeance: "15 juil.",  status: "ok" },
  { id: "omsi",  label: "OMSI à temps",  current: 11, total: 12, unit: "mois", echeance: "15 juil.",  status: "ok" },
  { id: "fmfp",  label: "FMFP à temps",  current: 10, total: 12, unit: "mois", echeance: "30 juin",   status: "warn" },
  { id: "stc",   label: "STC à temps",   current: 8,  total: 8,  unit: "dossiers", echeance: null,    status: "ok" },
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

function statusFromRatio(value, target) {
  const r = value / target;
  if (r >= 0.95) return { color: "var(--ok)",   bg: "var(--ok-soft)",   label: "À jour" };
  if (r >= 0.80) return { color: "var(--warn)", bg: "var(--warn-soft)", label: "Attention" };
  return                 { color: "var(--err)",  bg: "var(--err-soft)",  label: "En retard" };
}

function ageVsSla(age, sla) {
  if (age >= sla) return { color: "var(--err)",  bg: "var(--err-soft)",  label: "Dépassement" };
  if (age >= sla - 1) return { color: "var(--warn)", bg: "var(--warn-soft)", label: "À risque" };
  return { color: "var(--ok)", bg: "var(--ok-soft)", label: "Dans SLA" };
}

// ───────────────────────────────────────────────────────────
// Pillar Bar — simple, gros, lisible (no radial gauges)
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
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--fg-1)" }}>{p.name}</span>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {pillars.map((p) => <PillarCard key={p.id} p={p}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sparkline (small & sharp)
// ───────────────────────────────────────────────────────────
function Sparkline({ series, color, target, width = 120, height = 36 }) {
  if (!series || series.length === 0) return null;
  const min = Math.min(...series, target ?? Infinity) - 4;
  const max = Math.max(...series, target ?? -Infinity) + 4;
  const range = Math.max(1, max - min);
  const stepX = width / (series.length - 1);
  const points = series.map((v, i) => [i * stepX, height - ((v - min) / range) * height]);
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const last = points[points.length - 1];
  const targetY = target != null ? height - ((target - min) / range) * height : null;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {targetY != null && (
        <line x1="0" y1={targetY} x2={width} y2={targetY} stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} stroke="var(--surface)" strokeWidth="2"/>
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
// SO Band — single horizontal row, simple
// ───────────────────────────────────────────────────────────
function SmallRadial({ value, target, color, size = 56 }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ratio = Math.min(1, value / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="color-mix(in srgb, var(--pl-cream) 16%, transparent)" strokeWidth={stroke}/>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${c * ratio} ${c}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 500ms" }}
      />
    </svg>
  );
}

function ObjectiveBand() {
  const [variant, setVariant] = useState("A");
  const ecart = SO_KPI.target - SO_KPI.value;
  const pctTowardTarget = Math.round((SO_KPI.value / SO_KPI.target) * 100);
  return (
    <div style={{ position: "relative" }}>
      {/* Variant switcher */}
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
      {variant === "A" && <ObjectiveBandA value={SO_KPI.value} target={SO_KPI.target} ecart={ecart} pct={pctTowardTarget}/>}
      {variant === "B" && <ObjectiveBandB value={SO_KPI.value} target={SO_KPI.target} ecart={ecart} pct={pctTowardTarget}/>}
      {variant === "C" && <ObjectiveBandC value={SO_KPI.value} target={SO_KPI.target} ecart={ecart} pct={pctTowardTarget}/>}
    </div>
  );
}

// ── Variant A — Navy strip, équilibré (fix font/visibilité)
function ObjectiveBandA({ value, target, ecart, pct }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, var(--pl-navy) 0%, var(--pl-navy-deep) 100%)",
      borderRadius: 14, padding: "20px 24px",
      color: "var(--pl-cream)",
      display: "grid", gridTemplateColumns: "minmax(240px, auto) 1px minmax(280px, 1fr) auto", gap: 22, alignItems: "center",
      boxShadow: "0 4px 14px rgba(6,24,41,0.20)",
      border: "1px solid color-mix(in srgb, var(--accent) 20%, var(--pl-navy))",
    }}>
      {/* SO identité */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.q} · OBJECTIF RATTACHÉ</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            padding: "6px 14px", borderRadius: 8,
            background: "var(--accent)", color: "var(--accent-fg)",
            fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em",
            boxShadow: "0 4px 12px color-mix(in srgb, var(--accent) 40%, transparent)",
          }}>{SO_DATA.code}</div>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--pl-teal-light)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.subtitle}</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "var(--pl-cream)", letterSpacing: "-0.015em", lineHeight: 1.25, maxWidth: 320 }}>
          {SO_DATA.title}
        </div>
      </div>

      <div style={{ width: 1, alignSelf: "stretch", background: "color-mix(in srgb, var(--pl-cream) 14%, transparent)" }}/>

      {/* KPI body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 600, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.03em", textShadow: "0 0 24px color-mix(in srgb, var(--accent) 40%, transparent)" }}>{value}<span style={{ fontSize: 22, color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)" }}>%</span></span>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--pl-cream)" }}>{SO_KPI.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, position: "relative", height: 10, borderRadius: 999, background: "color-mix(in srgb, var(--pl-cream) 10%, transparent)", overflow: "visible" }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: 999, width: `${pct}%`,
              background: "linear-gradient(90deg, var(--accent) 0%, var(--pl-teal-light) 100%)",
              boxShadow: "0 0 14px color-mix(in srgb, var(--accent) 70%, transparent)",
              transition: "width 600ms",
            }}/>
            {/* Target marker */}
            <div style={{ position: "absolute", left: "100%", top: -4, bottom: -4, width: 2, marginLeft: -1, background: "var(--pl-cream)", opacity: 0.6, borderRadius: 1 }}/>
          </div>
          <Sparkline series={SO_KPI.series} color="var(--pl-teal-light)" target={target} width={120} height={28}/>
        </div>
        <div style={{ fontSize: 12, color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)" }}>{SO_KPI.hint}</div>
      </div>

      {/* Right metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
        <div style={{
          padding: "8px 14px", borderRadius: 8, minWidth: 96, textAlign: "center",
          background: "color-mix(in srgb, var(--err) 24%, transparent)",
          border: "1px solid color-mix(in srgb, var(--err) 55%, transparent)",
        }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>écart</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "#FFB4A3", fontWeight: 700, letterSpacing: "-0.02em" }}>−{ecart}<span style={{ fontSize: 12, opacity: 0.7 }}>pts</span></div>
        </div>
        <div style={{
          padding: "8px 14px", borderRadius: 8, minWidth: 96, textAlign: "center",
          background: "color-mix(in srgb, var(--pl-cream) 10%, transparent)",
          border: "1px solid color-mix(in srgb, var(--pl-cream) 18%, transparent)",
        }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 70%, transparent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>cible</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--pl-cream)", fontWeight: 700, letterSpacing: "-0.02em" }}>{target}<span style={{ fontSize: 12, opacity: 0.7 }}>%</span></div>
        </div>
      </div>
    </div>
  );
}

// ── Variant B — Cream/Light card with bold teal — lisible, plus calme
function ObjectiveBandB({ value, target, ecart, pct }) {
  return (
    <div style={{
      background: "var(--surface)",
      borderRadius: 14, padding: "22px 26px",
      color: "var(--fg-1)",
      display: "grid", gridTemplateColumns: "minmax(260px, auto) 1fr auto", gap: 26, alignItems: "center",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-1)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Left accent stripe */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "linear-gradient(180deg, var(--accent) 0%, var(--pl-teal-light) 100%)" }}/>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0, paddingLeft: 8 }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.q} · OBJECTIF RATTACHÉ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            padding: "6px 14px", borderRadius: 8,
            background: "var(--accent)", color: "var(--accent-fg)",
            fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em",
          }}>{SO_DATA.code}</span>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{SO_DATA.subtitle}</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.015em", lineHeight: 1.25 }}>{SO_DATA.title}</div>
      </div>

      {/* Center KPI */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 56, fontWeight: 600, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.035em" }}>{value}<span style={{ fontSize: 24, color: "var(--fg-3)" }}>%</span></span>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)", marginLeft: 6 }}>{SO_KPI.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, position: "relative", height: 10, borderRadius: 999, background: "var(--bg-elev-1)" }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: 999, width: `${pct}%`,
              background: "linear-gradient(90deg, var(--accent) 0%, var(--pl-teal-light) 100%)",
              boxShadow: "0 0 10px color-mix(in srgb, var(--accent) 50%, transparent)",
              transition: "width 600ms",
            }}/>
            <div style={{ position: "absolute", left: "100%", top: -3, bottom: -3, width: 2, marginLeft: -1, background: "var(--fg-2)", borderRadius: 1 }}/>
          </div>
          <Sparkline series={SO_KPI.series} color="var(--accent)" target={target} width={130} height={32}/>
        </div>
        <div style={{ fontSize: 13, color: "var(--fg-3)" }}>{SO_KPI.hint}</div>
      </div>

      {/* Right metrics — chip style */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--err-soft)", border: "1px solid color-mix(in srgb, var(--err) 30%, transparent)", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>écart</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--err)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>−{ecart}<span style={{ fontSize: 11, opacity: 0.7 }}>pts</span></div>
        </div>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--bg-elev-1)", border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>cible</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--fg-1)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>{target}<span style={{ fontSize: 11, opacity: 0.7 }}>%</span></div>
        </div>
      </div>
    </div>
  );
}

// ── Variant C — Stat hero: gauge radiale dominante + chiffre central
function ObjectiveBandC({ value, target, ecart, pct }) {
  // Large radial with value as hero number
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
      {/* Radial hero */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="color-mix(in srgb, var(--pl-cream) 12%, transparent)" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke="url(#soGrad)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${c * ratio} ${c}`}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ filter: "drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 70%, transparent))", transition: "stroke-dasharray 700ms" }}
          />
          {/* target tick */}
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke="var(--pl-cream)" strokeWidth={stroke}
            strokeDasharray={`${c * 0.018} ${c}`}
            strokeDashoffset={c * (1 - target/100) + c * 0.25}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            opacity="0.6"
          />
          <defs>
            <linearGradient id="soGrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)"/>
              <stop offset="100%" stopColor="var(--pl-teal-light)"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 42, fontWeight: 600, color: "var(--pl-cream)", lineHeight: 1, letterSpacing: "-0.03em" }}>{value}<span style={{ fontSize: 18, opacity: 0.6 }}>%</span></span>
          <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginTop: 2 }}>cible {target}</span>
        </div>
      </div>

      {/* Right block */}
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "color-mix(in srgb, var(--pl-cream) 60%, transparent)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700 }}>{SO_DATA.q} · objectif rattaché</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{
            padding: "6px 14px", borderRadius: 8,
            background: "var(--accent)", color: "var(--accent-fg)",
            fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
            boxShadow: "0 4px 14px color-mix(in srgb, var(--accent) 45%, transparent)",
          }}>{SO_DATA.code}</span>
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
// Conformité Block — 4 compact cards
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
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>{k.label}</span>
        <Chip color={tone.color} bg={tone.bg} border={`1px solid color-mix(in srgb, ${tone.color} 30%, transparent)`}>{tone.label}</Chip>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, color: "var(--fg-1)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{k.current}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-3)" }}>/ {k.total} {k.unit}</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: "var(--bg-elev-1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(k.current/k.total)*100}%`, background: tone.color, transition: "width 500ms" }}/>
      </div>
      <div style={{ fontSize: 12, color: "var(--fg-3)" }}>
        {k.echeance ? <>Prochaine échéance : <span style={{ color: "var(--fg-2)", fontWeight: 600 }}>{k.echeance}</span></> : "—"}
      </div>
    </div>
  );
}

function ConformiteBlock() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, boxShadow: "var(--shadow-1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>Conformité & social</h3>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>(hors SO)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {COMPLIANCE.map((k) => <ConformiteCard key={k.id} k={k}/>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Action Bar — simple, gros bouton, label clair
// ───────────────────────────────────────────────────────────
function ActionButton({ label, onClick, variant }) {
  const colors = {
    primary:   { bg: "var(--pl-navy)", fg: "var(--pl-cream)", hov: "color-mix(in srgb, var(--pl-navy) 86%, white)" },
    accent:    { bg: "var(--accent)",  fg: "var(--accent-fg)", hov: "color-mix(in srgb, var(--accent) 88%, white)" },
    danger:    { bg: "color-mix(in srgb, var(--err) 10%, var(--surface))", fg: "var(--err)", hov: "color-mix(in srgb, var(--err) 16%, var(--surface))", border: "1px solid color-mix(in srgb, var(--err) 40%, var(--border))" },
  }[variant || "primary"];
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, minWidth: 0,
        padding: "16px 18px", borderRadius: 10,
        background: hover ? colors.hov : colors.bg, color: colors.fg,
        border: colors.border || "none",
        cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
        transition: "background 120ms",
        fontSize: 15, fontWeight: 600, letterSpacing: "-0.005em",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
      <AfIcon name="plus" size={18}/> {label}
    </button>
  );
}

function ActionBar({ onDDV, onFacture, onDeclaration, onSTC }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10,
      boxShadow: "var(--shadow-1)",
    }}>
      <ActionButton label="Créer DDV"              variant="primary" onClick={onDDV}/>
      <ActionButton label="Émettre facture vente"  variant="accent"  onClick={onFacture}/>
      <ActionButton label="Soumettre déclaration"  variant="primary" onClick={onDeclaration}/>
      <ActionButton label="Établir STC"            variant="danger"  onClick={onSTC}/>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Pipeline stepper — DOTS ONLY (no labels), bigger
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
              borderRadius: isCurrent ? 4 : "50%",
              background: color,
              boxShadow: isCurrent ? "0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)" : "none",
              transition: "all 200ms",
              flexShrink: 0,
            }}/>
            {i < STEPS.length - 1 && (
              <span style={{
                width: 14, height: 2,
                background: i < currentIdx ? "var(--ok)" : "var(--border)",
                margin: "0 4px",
              }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Work Queue — TABLE (header bar + rows)
// ───────────────────────────────────────────────────────────
const QUEUE_COLS = "32px 152px 110px 130px 130px 110px 110px 1fr";

function QueueHeader() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: QUEUE_COLS, gap: 10,
      padding: "12px 16px",
      background: "var(--pl-navy)", color: "var(--pl-cream)",
      borderRadius: "10px 10px 0 0",
      fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      alignItems: "center",
      minWidth: "max-content",
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
  return (
    <div onClick={onSelect}
      style={{
        display: "grid", gridTemplateColumns: QUEUE_COLS, gap: 10,
        alignItems: "center", padding: "14px 16px",
        background: selected ? "color-mix(in srgb, var(--accent) 7%, var(--surface))" : "var(--surface)",
        borderBottom: isLast ? "none" : "1px solid var(--border-soft)",
        cursor: "pointer", minWidth: "max-content",
        transition: "background 120ms",
      }}>
      <div onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{
          width: 20, height: 20, borderRadius: 5,
          border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
          background: selected ? "var(--accent)" : "transparent",
          display: "grid", placeItems: "center", color: "var(--accent-fg)",
        }}>
        {selected && <AfIcon name="check" size={12}/>}
      </div>

      <Chip color={meta.color} bg={`color-mix(in srgb, ${meta.color} 12%, transparent)`} border={`1px solid color-mix(in srgb, ${meta.color} 30%, transparent)`}>
        {meta.label}
      </Chip>

      <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-1)", fontWeight: 600, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>{item.ref}</span>

      <span className="confirm-badge">À CONFIRMER</span>

      <span style={{ fontSize: 14, color: "var(--fg-1)", fontWeight: 500 }}>{item.demandeur}</span>

      <div>
        <span style={{
          display: "inline-block",
          padding: "4px 10px", borderRadius: 999,
          background: item.etape === "demande" ? "var(--warn-soft)" : item.etape === "matrice" ? "var(--ok-soft)" : item.etape === "haja" ? "color-mix(in srgb, var(--pl-navy) 12%, transparent)" : "var(--accent-soft)",
          color: item.etape === "demande" ? "var(--warn)" : item.etape === "matrice" ? "var(--ok)" : item.etape === "haja" ? "var(--pl-navy)" : "var(--accent)",
          fontSize: 12, fontWeight: 600, marginBottom: 6,
        }}>
          {STEPS.find(s => s.key === item.etape)?.label}
        </span>
        <div><StepperDots current={item.etape}/></div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: sla.color, fontVariantNumeric: "tabular-nums" }}>{item.ageJours}j</span>
        <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{item.slaJours === "À CONFIRMER" ? "À CONFIRMER" : "/ À CONFIRMER"}</span>
        {sla.color === "var(--err)" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--err)" }}/>}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={(e) => { e.stopPropagation(); onAction(item); }}
          style={{
            padding: "10px 18px", borderRadius: 8,
            background: meta.color === "var(--accent)" ? "var(--accent)" : meta.color === "var(--err)" ? "var(--err)" : meta.color === "var(--warn)" ? "var(--warn)" : "var(--pl-navy)",
            color: meta.color === "var(--warn)" ? "var(--pl-navy)" : "var(--pl-cream)",
            border: "none", fontSize: 14, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(6,24,41,0.12)",
          }}>
          {meta.actionLabel}
        </button>
      </div>
    </div>
  );
}

function WorkQueue({ items, onAction }) {
  const [selected, setSelected] = useState(new Set());
  const toggle = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 18, background: "var(--accent)", borderRadius: 2 }}/>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "0.01em", textTransform: "uppercase" }}>Ma file de travail</h3>
        </div>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{items.length} objet(s) en cours</span>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-1)" }}>
        <div style={{ overflowX: "auto" }}>
          <QueueHeader/>
          <div>
            {items.map((it, i) => (
              <QueueRow key={it.id} item={it}
                selected={selected.has(it.id)}
                onSelect={() => toggle(it.id)}
                onAction={onAction}
                isLast={i === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Coaching cards — simple, big text
// ───────────────────────────────────────────────────────────
function CoachingCard({ sig }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start",
      boxShadow: "var(--shadow-1)",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: "var(--accent-soft)", color: "var(--accent)",
        display: "grid", placeItems: "center",
        border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
      }}>
        <AfIcon name={sig.icon} size={22}/>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
        <div>
          <div className="label" style={{ marginBottom: 3 }}>Cause</div>
          <div style={{ fontSize: 15, color: "var(--fg-1)", lineHeight: 1.45, fontWeight: 500 }}>{sig.cause}</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 3, color: "var(--accent)" }}>Levier</div>
          <div style={{ fontSize: 14, color: "var(--fg-2)", lineHeight: 1.5 }}>{sig.levier}</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 3, color: "var(--ok)" }}>Gain</div>
          <div style={{ fontSize: 14, color: "var(--fg-2)", lineHeight: 1.5 }}>{sig.gain}</div>
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
// Sidebar
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
    <aside style={{
      width: 240, flexShrink: 0,
      background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
    }}>
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
                transition: "background 120ms",
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
        <span style={{ fontSize: 18, fontWeight: 700, color: "var(--pl-teal-light)" }}>Sarobidy</span>
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
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--pl-teal)", display: "grid", placeItems: "center", color: "var(--pl-navy-deep)", fontWeight: 700, fontSize: 15 }}>S</div>
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
          animation: "afToastIn 220ms cubic-bezier(.2,.7,.2,1)",
          minWidth: 320,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ok-soft)", color: "var(--ok)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <AfIcon name="check" size={18}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>{t.title}</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{t.subtitle}</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
              Trace M13 simulée · WRITES_LIVE=false
            </div>
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
// Secondary tabs
// ───────────────────────────────────────────────────────────
function AssistantTab() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 40, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, margin: "0 auto 14px", borderRadius: 16, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
        <AfIcon name="chat" size={32}/>
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "var(--fg-1)" }}>Assistant IA</div>
      <div style={{ fontSize: 14, color: "var(--fg-3)", marginTop: 4 }}>Fonctionnalité en cours de définition</div>
      <span className="confirm-badge" style={{ marginTop: 14, display: "inline-block" }}>À CONFIRMER</span>
    </div>
  );
}

function ScoresTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      {PILLARS_DATA.map((p) => (
        <div key={p.id} style={{
          padding: 22, borderRadius: 12,
          background: p.isFocus ? "color-mix(in srgb, var(--accent) 8%, var(--surface))" : "var(--surface)",
          border: `1px solid ${p.isFocus ? "color-mix(in srgb, var(--accent) 40%, var(--border))" : "var(--border)"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: p.isFocus ? "var(--accent)" : "var(--pl-navy)", color: p.isFocus ? "var(--accent-fg)" : "var(--pl-cream)", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700 }}>{p.short}</div>
            <span style={{ fontSize: 15, color: "var(--fg-2)", fontWeight: 500 }}>{p.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1, letterSpacing: "-0.03em" }}>{p.score}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-3)" }}>/100</span>
          </div>
          <div style={{ marginTop: 14, height: 8, borderRadius: 999, background: "var(--bg-elev-1)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${p.score}%`, background: p.isFocus ? "var(--accent)" : "var(--pl-navy)", transition: "width 500ms" }}/>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: "var(--fg-3)", display: "flex", justifyContent: "space-between" }}>
            <span>Variation hebdo : <span style={{ fontFamily: "var(--font-mono)", color: p.trend === "up" ? "var(--ok)" : p.trend === "down" ? "var(--err)" : "var(--fg-3)", fontWeight: 700 }}>{p.delta}</span></span>
            <span className="confirm-badge">À CONFIRMER</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CarnetTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {CARNET.map((c) => (
        <div key={c.id} style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
          padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12,
        }}>
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
    "Déclaration CNAPS / OMSI / FMFP",
    "Facturation Vente",
    "STC débauche (RH · B17)",
    "Achat",
  ];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 26, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{
        width: 96, height: 96, borderRadius: "50%",
        background: "linear-gradient(135deg, var(--accent) 0%, var(--pl-navy) 100%)",
        display: "grid", placeItems: "center", color: "white", fontSize: 40, fontWeight: 600,
      }}>S</div>
      <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.015em" }}>Sarobidy</div>
          <div style={{ fontSize: 14, color: "var(--fg-3)" }}>Admin-Fi · Premium Logistics Madagascar</div>
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
// Main App
// ───────────────────────────────────────────────────────────
function App() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const [tab, setTab] = useState("vue");
  const [queue, setQueue] = useState(QUEUE_SEED);
  const [toasts, setToasts] = useState([]);

  const [openDDV, setOpenDDV] = useState(false);
  const [openFacture, setOpenFacture] = useState(false);
  const [openDeclaration, setOpenDeclaration] = useState(false);
  const [openSTC, setOpenSTC] = useState(false);

  const pushToast = (title, subtitle) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((p) => [...p, { id, title, subtitle }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5200);
  };
  const closeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const advanceQueueByType = useCallback((type) => {
    setQueue((prev) => {
      const idx = prev.findIndex((it) => it.type === type && it.etape !== "paye");
      if (idx === -1) return prev;
      const item = prev[idx];
      const stepIdx = STEPS.findIndex((s) => s.key === item.etape);
      const nextStep = STEPS[Math.min(stepIdx + 1, STEPS.length - 1)].key;
      const next = [...prev];
      next[idx] = { ...item, etape: nextStep };
      return next;
    });
  }, []);

  const onDDVSubmit = (data) => {
    setOpenDDV(false);
    pushToast(`✓ DDV ${data.numeroSerie} créée`, `Objet : ${data.objet || "À CONFIRMER"} · transmis matrice V4`);
    advanceQueueByType("achat");
  };
  const onFactureSubmit = (data) => {
    setOpenFacture(false);
    pushToast(`✓ Facture ${data.refDossier} émise`, `Client : ${data.client} · transmis Haja (B17)`);
    advanceQueueByType("facturation");
  };
  const onDeclarationSubmit = (data) => {
    setOpenDeclaration(false);
    pushToast(`✓ Déclaration ${data.type} soumise`, `Période ${data.periode || "—"} · transmis Lynda (RH)`);
    advanceQueueByType("cnaps");
  };
  const onSTCSubmit = (data) => {
    setOpenSTC(false);
    pushToast(`✓ STC matricule ${data.matricule} établi`, `Visas en attente : ${(data.visas || []).join(", ")} · trace M13 chiffrée`);
    advanceQueueByType("stc");
  };

  const handleQueueAction = (item) => {
    if (item.type === "facturation") setOpenFacture(true);
    else if (item.type === "cnaps")  setOpenDeclaration(true);
    else if (item.type === "stc")    setOpenSTC(true);
    else setOpenDDV(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg-1)", display: "flex", flexDirection: "column" }} data-screen-label="Admin-Fi Workspace">
      <Header theme={theme} onTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")}/>
      <PillarBar pillars={PILLARS_DATA}/>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar active={tab} onTab={setTab}/>

        <main style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
            {tab === "vue" && (
              <>
                <ObjectiveBand/>
                <ActionBar
                  onDDV={() => setOpenDDV(true)}
                  onFacture={() => setOpenFacture(true)}
                  onDeclaration={() => setOpenDeclaration(true)}
                  onSTC={() => setOpenSTC(true)}
                />
                <ConformiteBlock/>
                <WorkQueue items={queue} onAction={handleQueueAction}/>
                <CoachingSignals signals={COACHING}/>
              </>
            )}
            {tab === "assistant" && <AssistantTab/>}
            {tab === "scores"    && <ScoresTab/>}
            {tab === "carnet"    && <CarnetTab/>}
            {tab === "profil"    && <ProfilTab/>}
          </div>
        </main>
      </div>

      <footer style={{
        borderTop: "1px solid var(--border)", background: "var(--surface)",
        padding: "12px 24px", fontSize: 12, color: "var(--fg-3)",
        display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)",
      }}>
        <span>LOI · Admin-Fi Sarobidy</span>
        <span>CockpitLayout V2 · D82</span>
      </footer>

      <Toast items={toasts} onClose={closeToast}/>

      <DDVModal         open={openDDV}         onClose={() => setOpenDDV(false)}         onSubmit={onDDVSubmit}/>
      <FactureModal     open={openFacture}     onClose={() => setOpenFacture(false)}     onSubmit={onFactureSubmit}/>
      <DeclarationModal open={openDeclaration} onClose={() => setOpenDeclaration(false)} onSubmit={onDeclarationSubmit}/>
      <STCModal         open={openSTC}         onClose={() => setOpenSTC(false)}         onSubmit={onSTCSubmit}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
