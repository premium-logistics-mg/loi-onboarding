/* global React */
// Atoms.jsx — shared D82-mobile atoms: chips, mini-gauges, big touch buttons, etc.

function Chip({ kind = "neutral", children, mono = false, compact = false }) {
  const map = {
    ok:      { bg: "rgba(45, 134, 89, 0.18)",  fg: "#5BC58B" },
    warn:    { bg: "rgba(199, 126, 42, 0.18)", fg: "#E3A053" },
    err:     { bg: "rgba(184, 66, 30, 0.20)",  fg: "#E4734D" },
    accent:  { bg: "rgba(62, 170, 155, 0.16)", fg: "#3EAA9B" },
    neutral: { bg: "rgba(255,255,255,0.04)",   fg: "rgba(240,238,235,0.78)" },
    navy:    { bg: "#11203A",                  fg: "#9EC3FF" }, // for Mode badge A
    cream:   { bg: "rgba(245, 241, 232, 0.10)", fg: "#E8DEC8" }, // Mode badge E
  };
  const s = map[kind] || map.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: compact ? 10 : 11,
        fontWeight: 600,
        padding: compact ? "2px 6px" : "3px 8px",
        borderRadius: 2,
        background: s.bg,
        color: s.fg,
        lineHeight: 1.4,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: mono ? "IBM Plex Mono, monospace" : "Inter, sans-serif",
      }}
    >
      {children}
    </span>
  );
}

/**
 * MiniGauge — compact horizontal KPI gauge for Home jour.
 * Hero number is the value; sublabel is the target.
 */
function MiniGauge({ code, label, value, unit, target, pct, status = "ok" }) {
  const color = status === "ok" ? "#5BC58B" : status === "warn" ? "#E3A053" : "#E4734D";
  const c = Math.max(0, Math.min(1, pct));
  return (
    <div
      style={{
        background: "#161A24",
        border: "1px solid #242835",
        borderRadius: 6,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 9,
            fontWeight: 600,
            color: "#3EAA9B",
            background: "rgba(62, 170, 155, 0.14)",
            padding: "2px 5px",
            borderRadius: 2,
            letterSpacing: "0.04em",
          }}
        >
          {code}
        </span>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 16,
            fontWeight: 500,
            color: color,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
          {unit && (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9, color: "rgba(240,238,235,0.5)", marginLeft: 3, fontWeight: 500 }}>
              {unit}
            </span>
          )}
        </span>
      </div>
      <div style={{ fontSize: 10.5, color: "rgba(240,238,235,0.8)", lineHeight: 1.25, minHeight: 26 }}>
        {label}
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${c * 100}%`, background: color }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "rgba(240,238,235,0.45)" }}>
        <span>cible {target}</span>
        <span>{Math.round(c * 100)} %</span>
      </div>
    </div>
  );
}

/* TouchButton — large >= 48px button for terrain use. */
function TouchButton({ kind = "primary", icon, children, onClick, disabled = false, subtle, fullWidth = true }) {
  const palettes = {
    primary: {
      bg: "#1A8E7E",
      bgHover: "#3EAA9B",
      color: "#07140F",
      border: "transparent",
    },
    secondary: {
      bg: "transparent",
      color: "#F0EEEB",
      border: "#2C3142",
    },
    success: {
      bg: "#2D8659",
      color: "#FFFFFF",
      border: "transparent",
    },
    warn: {
      bg: "transparent",
      color: "#E3A053",
      border: "rgba(199, 126, 42, 0.55)",
    },
    danger: {
      bg: "transparent",
      color: "#E4734D",
      border: "rgba(184, 66, 30, 0.5)",
    },
    ghost: {
      bg: "rgba(255,255,255,0.03)",
      color: "rgba(240,238,235,0.75)",
      border: "transparent",
    },
  };
  const p = palettes[kind] || palettes.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : "auto",
        minHeight: 52,
        padding: "0 18px",
        background: disabled ? "rgba(255,255,255,0.04)" : p.bg,
        color: disabled ? "rgba(240,238,235,0.35)" : p.color,
        border: `1px solid ${disabled ? "#1F2433" : p.border}`,
        borderRadius: 6,
        fontFamily: "Inter, sans-serif",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        textAlign: "center",
      }}
    >
      {icon}
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
        <span>{children}</span>
        {subtle && (
          <span style={{ fontSize: 10.5, fontWeight: 500, opacity: 0.7, marginTop: 3, letterSpacing: 0 }}>
            {subtle}
          </span>
        )}
      </span>
    </button>
  );
}

/* SectionLabel — uppercase tracking micro-label */
function SectionLabel({ children, count, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", margin: "18px 0 10px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            color: "rgba(240,238,235,0.55)",
            textTransform: "uppercase",
            letterSpacing: "0.10em",
          }}
        >
          {children}
        </span>
        {count !== undefined && (
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "rgba(240,238,235,0.45)" }}>
            {count}
          </span>
        )}
      </div>
      {right}
    </div>
  );
}

/* Field — labeled value row. */
function Field({ label, value, mono = false, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "rgba(240,238,235,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          color: "#F0EEEB",
          fontFamily: mono ? "IBM Plex Mono, monospace" : "Inter, sans-serif",
          fontWeight: mono ? 500 : 500,
          letterSpacing: mono ? "-0.01em" : "-0.005em",
        }}
      >
        {value}
      </span>
      {hint && (
        <span style={{ fontSize: 11, color: "rgba(240,238,235,0.5)" }}>{hint}</span>
      )}
    </div>
  );
}

/* MicroTrace — footer line showing GPS, time, owner — M13 trace stamp. */
function MicroTrace({ gps = "−18.1492, 49.4023", time = "28 mai · 09:14", owner = "Bernardin" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        background: "rgba(62, 170, 155, 0.06)",
        border: "1px solid rgba(62, 170, 155, 0.18)",
        borderRadius: 4,
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 10,
        color: "rgba(240,238,235,0.7)",
        letterSpacing: "-0.01em",
        flexWrap: "wrap",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#3EAA9B" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        M13
      </span>
      <span>{gps}</span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span>{time}</span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span>{owner}</span>
    </div>
  );
}

/* PhotoSlot — placeholder for camera capture (or filled photo card). */
function PhotoSlot({ label, filled = false, small = false }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: small ? "1 / 1" : "4 / 3",
        background: filled ? "#1A2030" : "rgba(255,255,255,0.025)",
        border: filled ? "1px solid #2A3145" : "1px dashed rgba(240,238,235,0.18)",
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        color: filled ? "rgba(240,238,235,0.8)" : "rgba(240,238,235,0.45)",
        overflow: "hidden",
      }}
    >
      {filled ? (
        <FilledPhotoArt />
      ) : (
        <>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7h3l2-3h8l2 3h3v13H3z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span style={{ fontSize: 10.5, textAlign: "center", padding: "0 6px", letterSpacing: "0.02em" }}>
            {label}
          </span>
        </>
      )}
    </div>
  );
}

function FilledPhotoArt() {
  // schematic representation of a container photo — no AI-slop gradient
  return (
    <svg viewBox="0 0 120 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <rect width="120" height="90" fill="#0E1322" />
      <rect x="0" y="58" width="120" height="32" fill="#162033" />
      <rect x="8" y="22" width="104" height="40" fill="#21304D" stroke="#2C3F60" strokeWidth="0.8" />
      <g stroke="#2C3F60" strokeWidth="0.5">
        <line x1="20" y1="22" x2="20" y2="62" />
        <line x1="32" y1="22" x2="32" y2="62" />
        <line x1="44" y1="22" x2="44" y2="62" />
        <line x1="56" y1="22" x2="56" y2="62" />
        <line x1="68" y1="22" x2="68" y2="62" />
        <line x1="80" y1="22" x2="80" y2="62" />
        <line x1="92" y1="22" x2="92" y2="62" />
        <line x1="104" y1="22" x2="104" y2="62" />
      </g>
      <rect x="48" y="35" width="24" height="10" fill="#0B2540" stroke="#3EAA9B" strokeWidth="0.6" />
      <text x="60" y="42" fontFamily="IBM Plex Mono, monospace" fontSize="4.5" fill="#3EAA9B" textAnchor="middle">MSCU 4729183</text>
      <rect x="0" y="0" width="120" height="20" fill="#080B14" opacity="0.4" />
      <text x="6" y="11" fontFamily="IBM Plex Mono, monospace" fontSize="5" fill="rgba(245,241,232,0.5)">28/05/26 09:12</text>
    </svg>
  );
}

/* SignaturePad — visual mock of a signature canvas (filled or empty). */
function SignaturePad({ filled = false, label = "Signature client" }) {
  return (
    <div
      style={{
        background: filled ? "#F5F1E8" : "rgba(245, 241, 232, 0.06)",
        border: filled ? "1px solid #C9C2B0" : "1px dashed rgba(245, 241, 232, 0.25)",
        borderRadius: 4,
        height: 110,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {filled ? (
        <svg viewBox="0 0 280 110" width="100%" height="100%" preserveAspectRatio="none">
          <path
            d="M30 78 C 42 30, 60 86, 78 60 S 110 28, 130 70 S 168 92, 188 50 S 220 30, 250 78"
            stroke="#0B2540"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M60 86 L 64 92 M 100 90 L 108 96"
            stroke="#0B2540"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(245, 241, 232, 0.5)",
            fontSize: 12,
          }}
        >
          {label}
        </div>
      )}
      <span
        style={{
          position: "absolute",
          left: 10,
          bottom: 6,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 9,
          color: filled ? "rgba(11, 37, 64, 0.5)" : "rgba(245, 241, 232, 0.3)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {filled ? "tracé · 09:12:48" : "appui long pour signer"}
      </span>
    </div>
  );
}

/* TextInput — mock styled input field. */
function TextInput({ label, value, mono = false, suffix, placeholder }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "rgba(240,238,235,0.55)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid #242835",
          borderRadius: 4,
          padding: "12px 14px",
          minHeight: 48,
        }}
      >
        <span
          style={{
            flex: 1,
            fontFamily: mono ? "IBM Plex Mono, monospace" : "Inter, sans-serif",
            fontSize: 15,
            color: value ? "#F0EEEB" : "rgba(240,238,235,0.4)",
            letterSpacing: mono ? "-0.01em" : "0",
          }}
        >
          {value || placeholder}
        </span>
        {suffix && (
          <span style={{ fontSize: 11, color: "rgba(240,238,235,0.5)", fontFamily: "Inter, sans-serif" }}>
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

/* SegmentedChoice — 3-state radio (Bon / Légères / Majeures, etc.) */
function SegmentedChoice({ options = [], value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid #242835",
        borderRadius: 6,
        padding: 3,
        gap: 3,
      }}
    >
      {options.map((o) => {
        const on = o === value;
        return (
          <div
            key={o}
            style={{
              minHeight: 42,
              borderRadius: 4,
              background: on ? "#1A8E7E" : "transparent",
              color: on ? "#07140F" : "rgba(240,238,235,0.7)",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 6px",
              lineHeight: 1.2,
            }}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
}

window.Chip = Chip;
window.MiniGauge = MiniGauge;
window.TouchButton = TouchButton;
window.SectionLabel = SectionLabel;
window.Field = Field;
window.MicroTrace = MicroTrace;
window.PhotoSlot = PhotoSlot;
window.SignaturePad = SignaturePad;
window.TextInput = TextInput;
window.SegmentedChoice = SegmentedChoice;
