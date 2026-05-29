/* global React */
/* ============================================================
   Atoms.jsx — primitives D82 partagées (cockpit DM)
   Btn · IconBtn · StatusChip · PillarChip · StatusDot · Dot
   SectionRule · Sparkline · GaugeBar · Modal · Collapsible
   Exporte tout sur window.
   ============================================================ */
const { useState: useStateA, useEffect: useEffectA } = React;

/* ---- colors helper ---- */
const SEV = {
  ok:     { fg: "var(--ok)",     soft: "var(--ok-soft)" },
  warn:   { fg: "var(--warn)",   soft: "var(--warn-soft)" },
  err:    { fg: "var(--err)",    soft: "var(--err-soft)" },
  accent: { fg: "var(--accent)", soft: "var(--accent-soft)" },
  neutral:{ fg: "var(--fg-2)",   soft: "var(--surface-2)" },
};
function sevColor(s) { return (SEV[s] || SEV.neutral).fg; }
function sevSoft(s)  { return (SEV[s] || SEV.neutral).soft; }

/* ---- Btn ---- */
function Btn({ children, kind = "secondary", onClick, icon, size = "md", title }) {
  const map = {
    primary:   { bg: "var(--accent)", color: "var(--accent-fg)", border: "transparent" },
    secondary: { bg: "transparent",   color: "var(--fg-1)",      border: "var(--border)" },
    ghost:     { bg: "transparent",   color: "var(--fg-2)",      border: "transparent" },
    danger:    { bg: "transparent",   color: "var(--err)",       border: "var(--err)" },
  };
  const s = map[kind] || map.secondary;
  const pad = size === "sm" ? "6px 10px" : "8px 14px";
  return (
    <button onClick={onClick} title={title} style={{
      fontFamily: "Inter, sans-serif", fontSize: size === "sm" ? 12 : 13, fontWeight: 500,
      padding: pad, borderRadius: 4, lineHeight: 1, cursor: "pointer",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
      transition: "all 120ms cubic-bezier(0.2,0.7,0.2,1)",
    }}>
      {icon && <i data-lucide={icon} style={{ width: 14, height: 14 }} />}
      {children}
    </button>
  );
}

function IconBtn({ icon, onClick, label, active }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} style={{
      width: 32, height: 32, borderRadius: 4,
      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
      background: active ? "var(--accent-soft)" : "transparent",
      color: active ? "var(--accent)" : "var(--fg-2)", cursor: "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
    }}>
      <i data-lucide={icon} style={{ width: 16, height: 16 }} />
    </button>
  );
}

/* ---- StatusChip ---- */
function StatusChip({ kind = "neutral", children, dot = true, mono = false }) {
  const s = SEV[kind] || SEV.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 2,
      background: s.soft, color: s.fg, lineHeight: 1.4, whiteSpace: "nowrap",
      border: kind === "neutral" ? "1px solid var(--border)" : "none",
      fontFamily: mono ? "IBM Plex Mono, monospace" : "Inter, sans-serif",
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: s.fg }} />}
      {children}
    </span>
  );
}

/* ---- PillarChip ---- */
function PillarChip({ pillar }) {
  if (!pillar) return null;
  return (
    <span style={{
      fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
      color: "var(--accent)", padding: "2px 6px", borderRadius: 2,
      background: "var(--accent-soft)", letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>{pillar}</span>
  );
}

/* ---- StatusDot ---- */
function StatusDot({ status, size = 7 }) {
  const c = sevColor(status), s = sevSoft(status);
  return (
    <span style={{
      display: "inline-block", width: size, height: size, borderRadius: 999,
      background: c, boxShadow: `0 0 0 3px ${s}`, flexShrink: 0,
    }} />
  );
}

/* ---- SectionRule ---- */
function SectionRule({ label, meta, right }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, paddingBottom: 8, borderBottom: "1px solid var(--border-soft)" }}>
      <h2 style={{ margin: 0, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-2)", fontWeight: 600 }}>{label}</h2>
      <span style={{ flex: 1, minWidth: 0 }} />
      {right}
      {meta && <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.02em" }}>{meta}</span>}
    </div>
  );
}

/* ---- Sparkline (SVG, calme) ---- */
function Sparkline({ points = [], width = 120, height = 32, color = "var(--accent)", target, showEndpoint = true }) {
  if (!points.length) return null;
  const min = Math.min(...points, target ?? Infinity);
  const max = Math.max(...points, target ?? -Infinity);
  const range = max - min || 1;
  const pad = 3;
  const x = (i) => pad + (i / (points.length - 1)) * (width - pad * 2);
  const y = (v) => height - pad - ((v - min) / range) * (height - pad * 2);
  const d = points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${d} L${x(points.length - 1).toFixed(1)},${height - pad} L${x(0).toFixed(1)},${height - pad} Z`;
  const last = points[points.length - 1];
  const gid = "sg" + Math.random().toString(36).slice(2, 8);
  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {target !== undefined && (
        <line x1={pad} x2={width - pad} y1={y(target)} y2={y(target)} stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
      )}
      <path d={area} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {showEndpoint && <circle cx={x(points.length - 1)} cy={y(last)} r="2.4" fill={color} />}
    </svg>
  );
}

/* ---- GaugeBar (0-100 vers cible) ---- */
function GaugeBar({ score, target = 75, height = 6 }) {
  const pct = Math.min(100, Math.max(0, score || 0));
  const color = pct >= target ? "var(--ok)" : pct >= 60 ? "var(--warn)" : "var(--err)";
  return (
    <div style={{ position: "relative", height, background: "var(--surface-2)", borderRadius: height / 2, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: color, transition: "width 240ms cubic-bezier(0.2,0.7,0.2,1)" }} />
      <div style={{ position: "absolute", top: -2, bottom: -2, left: `${target}%`, width: 1.5, background: "var(--fg-1)", opacity: 0.55 }} />
    </div>
  );
}

/* ---- Modal (Pattern 9 · drawer modal, scrim blur) ---- */
function Modal({ open, onClose, title, eyebrow, children, footer, width = 620 }) {
  useEffectA(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => window.lucide && lucide.createIcons(), 30);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(7,24,43,0.62)", backdropFilter: "blur(8px)",
      zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "loiFade 180ms cubic-bezier(0.2,0.7,0.2,1)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
        width, maxWidth: "94vw", maxHeight: "88vh", overflow: "hidden", boxShadow: "var(--shadow-2)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 24px 16px", borderBottom: "1px solid var(--border-soft)" }}>
          <div>
            {eyebrow && <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 5, fontWeight: 600 }}>{eyebrow}</div>}
            <div style={{ fontSize: 17, fontWeight: 600, color: "var(--fg-1)" }}>{title}</div>
          </div>
          <button onClick={onClose} aria-label="Fermer" style={{ background: "transparent", border: 0, color: "var(--fg-2)", cursor: "pointer", padding: 6 }}>
            <i data-lucide="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div style={{ padding: 24, overflowY: "auto" }}>{children}</div>
        {footer && <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border-soft)", display: "flex", justifyContent: "flex-end", gap: 10, background: "var(--bg-elev-1)" }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ---- Field (form input mock) ---- */
function Field({ label, children, hint }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600 }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{hint}</span>}
    </label>
  );
}
function Input(props) {
  return <input {...props} style={{
    background: "var(--bg-elev-1)", border: "1px solid var(--border)", borderRadius: 4,
    padding: "9px 11px", color: "var(--fg-1)", fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none",
  }} />;
}
function Select({ children, ...rest }) {
  return <select {...rest} style={{
    background: "var(--bg-elev-1)", border: "1px solid var(--border)", borderRadius: 4,
    padding: "9px 11px", color: "var(--fg-1)", fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none",
  }}>{children}</select>;
}

/* ---- Collapsible ---- */
function Collapsible({ title, meta, defaultOpen = false, badge, children, dense }) {
  const [open, setOpen] = useStateA(defaultOpen);
  useEffectA(() => { const t = setTimeout(() => window.lucide && lucide.createIcons(), 20); return () => clearTimeout(t); }, [open]);
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 10, padding: dense ? "12px 16px" : "14px 18px",
        cursor: "pointer", background: open ? "var(--bg-elev-1)" : "transparent", transition: "background 120ms",
      }}>
        <i data-lucide={open ? "chevron-down" : "chevron-right"} style={{ width: 16, height: 16, color: "var(--fg-3)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>{title}</span>
        {badge}
        <span style={{ flex: 1 }} />
        {meta && <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>{meta}</span>}
      </div>
      {open && <div style={{ borderTop: "1px solid var(--border-soft)" }}>{children}</div>}
    </div>
  );
}

/* ---- SOChip (F2 · étiquette SO d'origine) ---- */
function SOChip({ children, gap = false }) {
  const c = gap ? "var(--warn)" : "var(--accent)";
  return (
    <span style={{
      fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
      color: c, border: `1px solid color-mix(in srgb, ${c} 55%, transparent)`,
      background: "transparent", padding: "2px 6px", borderRadius: 4, lineHeight: 1.3,
      whiteSpace: "nowrap", letterSpacing: "0.02em",
    }}>{children}</span>
  );
}

/* ---- Tooltip (hover · sobre) ---- */
function Tooltip({ children, content, width = 280 }) {
  const [show, setShow] = useStateA(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 40, width,
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
          boxShadow: "var(--shadow-2)", padding: 14, fontFamily: "Inter, sans-serif",
          fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5, whiteSpace: "normal",
        }}>{content}</span>
      )}
    </span>
  );
}

Object.assign(window, { Btn, IconBtn, StatusChip, PillarChip, StatusDot, SectionRule, Sparkline, GaugeBar, Modal, Field, Input, Select, Collapsible, SOChip, Tooltip, sevColor, sevSoft });
