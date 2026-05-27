/* global React */
// ════════════════════════════════════════════════════════════════
// LOI · Terrain Export — Icons (line, 1.6 px, currentColor)
// Style Lucide-like, mais inliné pour zéro dépendance externe.
// ════════════════════════════════════════════════════════════════

function Icon({ name, size = 24, stroke = 1.6, color = "currentColor", style }) {
  const sw = stroke;
  const p = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth: sw,
    strokeLinecap: "round", strokeLinejoin: "round",
    style: { display: "block", ...style },
  };
  switch (name) {
    case "chevron-left":   return <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>;
    case "chevron-right":  return <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>;
    case "chevron-down":   return <svg {...p}><polyline points="6 9 12 15 18 9"/></svg>;
    case "x":              return <svg {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>;
    case "qr":             return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3"/><path d="M14 20h3"/><path d="M20 14v3"/><path d="M20 20v1"/></svg>;
    case "camera":         return <svg {...p}><path d="M3 7h3l2-3h8l2 3h3v13H3z"/><circle cx="12" cy="13" r="4"/></svg>;
    case "container":      return <svg {...p}><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M7 7v10M11 7v10M15 7v10M19 7v10"/></svg>;
    case "anchor":         return <svg {...p}><circle cx="12" cy="5" r="2"/><path d="M12 7v14"/><path d="M5 14a7 7 0 0 0 14 0"/><path d="M3 14h4M17 14h4"/></svg>;
    case "clipboard":      return <svg {...p}><rect x="6" y="4" width="12" height="18" rx="1"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 13l2 2 4-4"/></svg>;
    case "shield":         return <svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "alert":          return <svg {...p}><path d="M12 3 22 20H2z"/><line x1="12" y1="10" x2="12" y2="15"/><circle cx="12" cy="18" r="0.8" fill={color} stroke="none"/></svg>;
    case "mic":            return <svg {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="21"/></svg>;
    case "check":          return <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>;
    case "check-circle":   return <svg {...p}><circle cx="12" cy="12" r="9"/><polyline points="16 10 11 15 8 12"/></svg>;
    case "edit":           return <svg {...p}><path d="M14 4l6 6L8 22H2v-6z"/></svg>;
    case "signal":         return <svg {...p} fill={color} stroke="none"><rect x="1.5" y="14" width="3.5" height="6" rx="0.5"/><rect x="7" y="10" width="3.5" height="10" rx="0.5"/><rect x="12.5" y="6" width="3.5" height="14" rx="0.5"/><rect x="18" y="2" width="3.5" height="18" rx="0.5"/></svg>;
    case "wifi":           return <svg {...p}><path d="M2 9a16 16 0 0 1 20 0"/><path d="M5 13a11 11 0 0 1 14 0"/><path d="M9 17a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r="0.6" fill={color} stroke="none"/></svg>;
    case "battery":        return <svg {...p}><rect x="2" y="8" width="18" height="9" rx="1.5"/><rect x="3.5" y="9.5" width="14" height="6" rx="0.6" fill={color} stroke="none"/><rect x="20.5" y="11" width="1.5" height="3" rx="0.4" fill={color} stroke="none"/></svg>;
    case "send":           return <svg {...p}><path d="M22 2 11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>;
    case "user":           return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case "scan":           return <svg {...p}><path d="M3 8V5a2 2 0 0 1 2-2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2h-3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><line x1="6" y1="12" x2="18" y2="12"/></svg>;
    case "plus":           return <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "refresh":        return <svg {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><polyline points="21 3 21 8 16 8"/></svg>;
    case "circle":         return <svg {...p}><circle cx="12" cy="12" r="8"/></svg>;
    case "triangle":       return <svg {...p}><path d="M12 4 22 20H2z"/></svg>;
    case "square":         return <svg {...p}><rect x="4.5" y="4.5" width="15" height="15"/></svg>;
    case "map-pin":        return <svg {...p}><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case "calendar":       return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case "image":          return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="9" cy="10" r="1.5"/><path d="m3 18 5-5 5 5 3-3 5 5"/></svg>;
    case "backspace":      return <svg {...p}><path d="M22 5H9L3 12l6 7h13z"/><line x1="13" y1="9" x2="19" y2="15"/><line x1="19" y1="9" x2="13" y2="15"/></svg>;
    case "weight":         return <svg {...p}><path d="M5 7h14l-1.5 13H6.5z"/><circle cx="12" cy="5" r="2"/><path d="M10 12h4"/></svg>;
    case "fingerprint":    return <svg {...p}><path d="M5 12a7 7 0 0 1 14 0v2"/><path d="M8 12a4 4 0 0 1 8 0v3"/><path d="M11 12v6"/><path d="M5 16v3"/><path d="M19 17v2"/></svg>;
    default:               return null;
  }
}

// ─────────────────────────────────────────────
// Tokens locaux (calculés sur les vars D82)
// ─────────────────────────────────────────────
const T = {
  bg:        "var(--bg)",
  surface:   "var(--surface)",
  surface2:  "var(--surface-2)",
  border:    "var(--border)",
  borderS:   "var(--border-soft)",
  fg1:       "var(--fg-1)",
  fg2:       "var(--fg-2)",
  fg3:       "var(--fg-3)",
  accent:    "var(--accent)",
  accentFg:  "var(--accent-fg)",
  accentSoft:"var(--accent-soft)",
  ok:        "var(--ok)",
  warn:      "var(--warn)",
  err:       "var(--err)",
  okSoft:    "var(--ok-soft)",
  warnSoft:  "var(--warn-soft)",
  errSoft:   "var(--err-soft)",
  navy:      "var(--pl-navy)",
  cream:     "var(--pl-cream)",
  mono:      'var(--font-mono)',
  sans:      'var(--font-sans)',
};

// ─────────────────────────────────────────────
// Status bar iOS-like (heure, signal, wifi, batterie)
// ─────────────────────────────────────────────
function StatusBar() {
  return (
    <div style={{
      height: 44, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px",
      fontFamily: T.sans, fontSize: 14, fontWeight: 600, color: T.fg1,
    }}>
      <span style={{ fontFeatureSettings: "'tnum'" }}>14:32</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: T.fg1 }}>
        <Icon name="signal" size={15}/>
        <Icon name="wifi" size={15}/>
        <Icon name="battery" size={22}/>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Home indicator (barre iOS)
// ─────────────────────────────────────────────
function HomeIndicator() {
  return (
    <div style={{
      height: 34, flexShrink: 0,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      paddingBottom: 8,
    }}>
      <div style={{
        width: 134, height: 5, borderRadius: 999,
        background: "color-mix(in srgb, var(--fg-1) 70%, transparent)",
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// Nav bar — bouton retour + dots progression + label droit
// ─────────────────────────────────────────────
function NavBar({ onBack = "Retour", step = 1, total = 5, right }) {
  return (
    <div style={{
      height: 52, flexShrink: 0,
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
      gap: 8,
    }}>
      <button style={{
        justifySelf: "start",
        display: "inline-flex", alignItems: "center", gap: 4,
        height: 44, padding: "0 12px 0 4px",
        background: "transparent", border: 0, color: T.fg1,
        fontFamily: T.sans, fontSize: 15, fontWeight: 500,
        cursor: "pointer",
      }}>
        <Icon name="chevron-left" size={22}/>
        <span>{onBack}</span>
      </button>
      <div style={{ display: "inline-flex", gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{
            width: i + 1 === step ? 18 : 6, height: 6, borderRadius: 999,
            background: i + 1 <= step ? T.accent : "color-mix(in srgb, var(--fg-3) 40%, transparent)",
            transition: "width 120ms",
          }}/>
        ))}
      </div>
      <div style={{ justifySelf: "end", color: T.fg3, fontFamily: T.mono, fontSize: 11, letterSpacing: "0.04em" }}>
        {right ?? `${step}·${total}`}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Micro label (UPPERCASE, tracking, mono-ish)
// ─────────────────────────────────────────────
function MicroLabel({ children, color, style }) {
  return (
    <div style={{
      fontFamily: T.sans, fontSize: 10, fontWeight: 600,
      letterSpacing: "0.10em", textTransform: "uppercase",
      color: color ?? T.fg3,
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────
// Chip — couleur + forme par statut
// ─────────────────────────────────────────────
function Chip({ children, kind = "default", icon, style }) {
  const map = {
    default: { bg: T.surface2, fg: T.fg2, bd: T.border },
    accent:  { bg: T.accentSoft, fg: T.accent, bd: "transparent" },
    ok:      { bg: T.okSoft,   fg: T.ok,   bd: "transparent" },
    warn:    { bg: T.warnSoft, fg: T.warn, bd: "transparent" },
    err:     { bg: T.errSoft,  fg: T.err,  bd: "transparent" },
  };
  const s = map[kind] || map.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 10px", borderRadius: 3,
      background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
      fontFamily: T.sans, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.04em", textTransform: "uppercase",
      lineHeight: 1, whiteSpace: "nowrap",
      ...style,
    }}>
      {icon && <Icon name={icon} size={12} stroke={2}/>}
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// Bouton primaire (≥ 56 px) — pleine largeur
// ─────────────────────────────────────────────
function PrimaryBtn({ children, icon, style, height = 60 }) {
  return (
    <button style={{
      height, width: "100%",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
      background: T.accent, color: T.accentFg,
      border: 0, borderRadius: 8,
      fontFamily: T.sans, fontSize: 16, fontWeight: 600,
      letterSpacing: "-0.005em",
      cursor: "pointer",
      ...style,
    }}>
      {children}
      {icon && <Icon name={icon} size={20} stroke={2}/>}
    </button>
  );
}

function GhostBtn({ children, icon, style, height = 52 }) {
  return (
    <button style={{
      height, width: "100%",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
      background: "transparent", color: T.fg1,
      border: `1px solid ${T.border}`, borderRadius: 8,
      fontFamily: T.sans, fontSize: 15, fontWeight: 500,
      cursor: "pointer",
      ...style,
    }}>
      {icon && <Icon name={icon} size={18}/>}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// "À confirmer" badge
// ─────────────────────────────────────────────
function ConfirmBadge({ children = "À confirmer" }) {
  return (
    <span style={{
      display: "inline-block",
      fontFamily: T.sans, fontSize: 9, fontWeight: 700,
      padding: "2px 6px", borderRadius: 2,
      color: T.warn, background: T.warnSoft,
      textTransform: "uppercase", letterSpacing: "0.08em",
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────
// PhoneFrame — wrapper qui pose le thème (data-theme="dark"/light)
//
// Note CSS : loi-tokens.css déclare les alias --bg / --fg-1 / etc. sur :root
// à partir des --cockpit-* light. Un descendant qui pose data-theme="dark"
// ne fait que basculer les --cockpit-* — les alias eux ont déjà été
// résolus sur :root. On doit donc surcharger les alias DIRECTEMENT sur ce
// nœud pour que le thème dark se propage à l'intérieur du téléphone.
// ─────────────────────────────────────────────
const DARK_TOKENS = {
  "--cockpit-bg":             "#080B14",
  "--cockpit-surface":        "#161A24",
  "--cockpit-card":           "#161A24",
  "--cockpit-card-border":    "#242835",
  "--cockpit-text-primary":   "#F0EEEB",
  "--cockpit-text-secondary": "rgba(240, 238, 235, 0.78)",
  "--cockpit-text-muted":     "rgba(240, 238, 235, 0.60)",
  "--cockpit-accent":         "#3EAA9B",
  "--cockpit-divider":        "#242835",
  "--cockpit-sidebar-bg":     "#0E1320",
  // Alias (résolus une fois sur :root → on les ré-écrit)
  "--bg":           "#080B14",
  "--bg-elev-1":    "#10141F",
  "--surface":      "#161A24",
  "--surface-2":    "#11151E",
  "--border":       "#242835",
  "--border-soft":  "#1C202D",
  "--sidebar-bg":   "#0E1320",
  "--fg-1":         "#F0EEEB",
  "--fg-2":         "rgba(240,238,235,0.78)",
  "--fg-3":         "rgba(240,238,235,0.60)",
  "--fg-mute":      "rgba(240,238,235,0.36)",
  "--accent":       "#3EAA9B",
  "--accent-fg":    "#07140F",
  "--accent-soft":  "color-mix(in srgb, #3EAA9B 14%, transparent)",
  "--ok-soft":      "color-mix(in srgb, #2D8659 22%, transparent)",
  "--warn-soft":    "color-mix(in srgb, #C77E2A 22%, transparent)",
  "--err-soft":     "color-mix(in srgb, #B8421E 22%, transparent)",
  "--focus-ring":   "0 0 0 2px color-mix(in srgb, #3EAA9B 45%, transparent)",
  "--shadow-1":     "0 1px 0 rgba(255,255,255,0.02) inset, 0 1px 2px rgba(0,0,0,0.4)",
  "--shadow-2":     "0 8px 24px rgba(0,0,0,0.45)",
};

function PhoneFrame({ dark, children }) {
  const themeStyle = dark ? DARK_TOKENS : null;
  return (
    <div data-theme={dark ? "dark" : "light"} style={{
      ...(themeStyle || {}),
      width: 375, height: 812,
      background: "var(--bg)", color: "var(--fg-1)",
      fontFamily: T.sans,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      borderRadius: 0,
    }}>
      <StatusBar />
      <div style={{
        flex: 1, minHeight: 0,
        display: "flex", flexDirection: "column",
        padding: "0 20px",
      }}>
        {children}
      </div>
      <HomeIndicator />
    </div>
  );
}

Object.assign(window, {
  Icon, T, StatusBar, HomeIndicator, NavBar, MicroLabel, Chip,
  PrimaryBtn, GhostBtn, ConfirmBadge, PhoneFrame,
});
