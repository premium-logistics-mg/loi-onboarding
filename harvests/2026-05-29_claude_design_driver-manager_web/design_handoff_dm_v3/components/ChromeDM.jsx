/* global React, IconBtn, GaugeBar */
/* ============================================================
   ChromeDM.jsx — chrome cockpit Driver Manager
   SidebarDM · TopBarDM · PillarGaugeBar · CockpitTabsDM · FreshStrip
   ============================================================ */

/* SidebarDM — navigation primaire = 5 onglets STRICT canoniques (vertical) */
function SidebarDM({ tab, onChange, counts = {} }) {
  return (
    <aside style={{
      width: 240, background: "var(--sidebar-bg, var(--bg-elev-1))", borderRight: "1px solid var(--border)",
      padding: "16px 8px", display: "flex", flexDirection: "column", gap: 2, height: "100%", flexShrink: 0, overflowY: "auto",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px 18px" }}>
        <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-fg)", fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 14 }}>L</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.02em", color: "var(--fg-1)" }}>LOI</div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-3)" }}>Premium Logistics</div>
        </div>
      </div>

      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", padding: "6px 12px 8px" }}>Cockpit Driver Manager</div>
      {TABS_DM.map(t => {
        const on = tab === t.id;
        return (
          <div key={t.id} onClick={() => onChange(t.id)} title={t.label} style={{
            display: "grid", gridTemplateColumns: "18px 1fr auto", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 4, fontSize: 13, cursor: "pointer",
            background: on ? "var(--accent-soft)" : "transparent",
            color: on ? "var(--accent)" : "var(--fg-2)",
            fontWeight: on ? 600 : 500,
            borderLeft: on ? "2px solid var(--accent)" : "2px solid transparent",
            transition: "background 120ms",
          }}
          onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "color-mix(in srgb, var(--accent-soft) 50%, transparent)"; }}
          onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
            <i data-lucide={t.icon} style={{ width: 16, height: 16 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.label}</span>
            {counts[t.id] !== undefined && (
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, padding: "1px 6px", borderRadius: 2, background: on ? "var(--accent)" : "var(--surface-2)", color: on ? "var(--accent-fg)" : "var(--fg-2)" }}>{counts[t.id]}</span>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: "auto", padding: "14px 12px 8px", borderTop: "1px solid var(--border)", marginLeft: 4, marginRight: 4, fontSize: 10, color: "var(--fg-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <i data-lucide="eye" style={{ width: 11, height: 11 }} />
          <span style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>Viewer</span>
        </div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-2)" }}>Serge · Driver Manager</div>
        <div style={{ fontSize: 10 }}>RBAC : DRV-001 → DRV-015</div>
      </div>
    </aside>
  );
}

function TopBarDM({ theme, onToggleTheme, breadcrumb }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg)", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--fg-3)", fontSize: 12 }}>
        {breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            <span style={{ color: i === breadcrumb.length - 1 ? "var(--fg-1)" : "var(--fg-3)" }}>{b}</span>
            {i < breadcrumb.length - 1 && <span>/</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface)", width: 300 }}>
          <i data-lucide="search" style={{ width: 14, height: 14, color: "var(--fg-3)" }} />
          <input placeholder="Rechercher chauffeur, camion, voyage…" style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: "var(--fg-1)", fontSize: 12, fontFamily: "Inter, sans-serif" }} />
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)", padding: "2px 5px", border: "1px solid var(--border)", borderRadius: 2 }}>⌘K</span>
        </div>
        <IconBtn icon={theme === "dark" ? "sun" : "moon"} onClick={onToggleTheme} label="Bascule thème" />
        <IconBtn icon="bell" label="Notifications" />
        <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--accent-soft)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>SE</div>
      </div>
    </div>
  );
}

/* ---- PillarGaugeBar · 4 piliers gauge 0-100 ---- */
function PillarGaugeBar({ pillars }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)" }}>
      {pillars.map((p, i) => {
        const color = p.score >= 75 ? "var(--ok)" : p.score >= 60 ? "var(--warn)" : "var(--err)";
        return (
          <div key={p.id} style={{
            position: "relative", padding: "14px 20px",
            borderRight: i < 3 ? "1px solid var(--border)" : "none",
            background: p.dominant ? "color-mix(in srgb, var(--accent-soft) 50%, transparent)" : "transparent",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600, color: p.dominant ? "var(--accent)" : "var(--fg-3)", padding: "2px 6px", borderRadius: 2, background: p.dominant ? "var(--accent-soft)" : "var(--surface-2)", letterSpacing: "0.04em", flexShrink: 0 }}>{p.code}</span>
              {p.dominant && (
                <span title="Pilier dominant DM" style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 2, background: "var(--accent)", color: "var(--accent-fg)", letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                  <i data-lucide="star" style={{ width: 9, height: 9 }} /> OPS
                </span>
              )}
              <span style={{ fontSize: 11, color: "var(--fg-2)", fontWeight: 500, minWidth: 0 }}>{p.label}</span>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: color, boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 18%, transparent)`, flexShrink: 0 }} />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 24, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: "var(--fg-1)" }}>{p.score}</span>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>/100 · cible {p.target}</span>
            </div>
            <GaugeBar score={p.score} target={p.target} height={5} />
          </div>
        );
      })}
    </div>
  );
}

/* ---- 5 onglets STRICT canoniques ---- */
const TABS_DM = [
  { id: "vue",    label: "Vue d'ensemble", icon: "layout-dashboard" },
  { id: "scores", label: "Scores",         icon: "target" },
  { id: "carnet", label: "Carnet de bord", icon: "clipboard-list" },
  { id: "doc",    label: "Documentation",  icon: "folder-tree" },
  { id: "profil", label: "Profil",         icon: "user-circle-2" },
];

function CockpitTabsDM({ active, onChange, counts = {} }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", background: "var(--bg)", padding: "0 24px" }}>
      {TABS_DM.map(t => {
        const on = active === t.id;
        return (
          <div key={t.id} onClick={() => onChange(t.id)} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 16px", cursor: "pointer",
            color: on ? "var(--fg-1)" : "var(--fg-3)", borderBottom: on ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -1, fontSize: 13, fontWeight: 500,
          }}>
            <i data-lucide={t.icon} style={{ width: 14, height: 14 }} />
            {t.label}
            {counts[t.id] !== undefined && (
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, padding: "1px 5px", borderRadius: 2, background: "var(--surface-2)", color: "var(--fg-2)" }}>{counts[t.id]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---- FreshStrip ---- */
function FreshStrip({ asof, composite }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 32px", fontSize: 11, background: "var(--bg-elev-1)", color: "var(--fg-2)", borderBottom: "1px solid var(--border-soft)", overflowX: "auto", whiteSpace: "nowrap" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-soft)" }} />
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 500 }}>live</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-1)" }}>{asof}</span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, paddingLeft: 16, borderLeft: "1px solid var(--border)", flexShrink: 0 }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 500 }}>source</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-1)" }}>serge-baked.ts · D90 v3</span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, paddingLeft: 16, borderLeft: "1px solid var(--border)", flexShrink: 0 }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 500 }}>cascade</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-1)" }}>D54 · Joel 25 %</span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0 }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 500 }}>composite DM</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--ok)" }}>{composite} / 100 · vert</span>
      </span>
    </div>
  );
}

Object.assign(window, { SidebarDM, TopBarDM, PillarGaugeBar, CockpitTabsDM, FreshStrip, TABS_DM });
