/* global React */
// MobileChrome.jsx — phone shell, status bar, app header for Bernardin module.
// Width: 390px (between iPhone SE 375 and Pro Max 414, Android 6.1" Pixel-like).
// Renders inside a DCArtboard at 390 × 844.

const PHONE_W = 390;
const PHONE_H = 844;

function PhoneShell({ children, screenLabel, offline = false }) {
  return (
    <div
      style={{
        width: PHONE_W,
        height: PHONE_H,
        background: "#080B14",
        color: "#F0EEEB",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        // subtle inner edge — replaces a heavy device bezel
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      <StatusBar />
      {offline && <OfflineBanner />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {children}
      </div>
      {screenLabel && <ScreenStamp label={screenLabel} />}
    </div>
  );
}

function StatusBar() {
  return (
    <div
      style={{
        height: 28,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 12,
        fontWeight: 500,
        color: "#F0EEEB",
        letterSpacing: "-0.01em",
      }}
    >
      <span>09:14</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.85 }}>
        {/* signal */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <rect x="0" y="7" width="2" height="3" fill="currentColor" />
          <rect x="3" y="5" width="2" height="5" fill="currentColor" />
          <rect x="6" y="3" width="2" height="7" fill="currentColor" />
          <rect x="9" y="1" width="2" height="9" fill="currentColor" />
        </svg>
        <span style={{ fontSize: 10, opacity: 0.85 }}>4G</span>
        {/* battery */}
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
          <rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor" />
          <rect x="2" y="2" width="13" height="6" fill="currentColor" />
          <rect x="19.5" y="3" width="1.5" height="4" rx="0.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function OfflineBanner() {
  return (
    <div
      style={{
        flexShrink: 0,
        background: "rgba(199, 126, 42, 0.14)",
        borderTop: "1px solid rgba(199, 126, 42, 0.35)",
        borderBottom: "1px solid rgba(199, 126, 42, 0.35)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 12,
        color: "#E8B16B",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8.5a13 13 0 0 1 20 0" opacity="0.4" />
        <path d="M5 12.5a8 8 0 0 1 14 0" />
        <path d="M8.5 16.5a3.5 3.5 0 0 1 7 0" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
      <span style={{ flex: 1, fontWeight: 500 }}>Hors-ligne</span>
      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, opacity: 0.85 }}>3 actions en attente</span>
    </div>
  );
}

/* AppHeader — title row + back button + optional subtitle. */
function AppHeader({ title, subtitle, onBack, right }) {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: "10px 18px 14px",
        borderBottom: "1px solid #1A1F2E",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#080B14",
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Retour"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "transparent",
            border: "1px solid #242835",
            color: "#F0EEEB",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: "#F0EEEB", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: "rgba(240,238,235,0.55)", marginTop: 2, fontFamily: "IBM Plex Mono, monospace" }}>
            {subtitle}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}

/* ScreenStamp — small caption bottom-right of the artboard, only on canvas view. */
function ScreenStamp({ label }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 8,
        right: 10,
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 9,
        color: "rgba(240,238,235,0.25)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        pointerEvents: "none",
      }}
    >
      {label}
    </div>
  );
}

/* BottomNav — tab bar shared by the 4 root screens. */
function BottomNav({ active = "home" }) {
  const items = [
    { id: "home", label: "Jour", icon: "home" },
    { id: "scores", label: "Scores", icon: "gauge" },
    { id: "carnet", label: "Carnet", icon: "book" },
    { id: "profil", label: "Profil", icon: "user" },
  ];
  return (
    <div
      style={{
        flexShrink: 0,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderTop: "1px solid #1A1F2E",
        background: "#0B0F1A",
        paddingBottom: 14,
      }}
    >
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            style={{
              minHeight: 56,
              background: "transparent",
              border: 0,
              color: on ? "#3EAA9B" : "rgba(240,238,235,0.55)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              cursor: "pointer",
              padding: "8px 4px",
              borderTop: on ? "1.5px solid #3EAA9B" : "1.5px solid transparent",
              marginTop: "-1px",
            }}
          >
            <NavIcon name={it.icon} />
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function NavIcon({ name }) {
  const s = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "home") return (
    <svg viewBox="0 0 24 24" {...s}><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" /></svg>
  );
  if (name === "gauge") return (
    <svg viewBox="0 0 24 24" {...s}><path d="M12 14l4-4" /><circle cx="12" cy="13" r="9" /><path d="M12 4v2M20 13h2M4 13H2M12 22v-2" /></svg>
  );
  if (name === "book") return (
    <svg viewBox="0 0 24 24" {...s}><path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z" /><path d="M4 17a3 3 0 0 1 3-3h13" /></svg>
  );
  if (name === "user") return (
    <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
  );
  return null;
}

window.PhoneShell = PhoneShell;
window.AppHeader = AppHeader;
window.BottomNav = BottomNav;
window.PHONE_W = PHONE_W;
window.PHONE_H = PHONE_H;
