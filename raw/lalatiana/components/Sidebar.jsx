/* global React */

const LL_TABS = [
  { id: "vue",     label: "Vue d'ensemble",  icon: "layout-dashboard" },
  { id: "scores",  label: "Scores",          icon: "target" },
  { id: "carnet",  label: "Carnet de bord",  icon: "clipboard-list" },
  { id: "docs",    label: "Documentation",   icon: "folder-open" },
  { id: "profil",  label: "Profil",          icon: "user-circle-2" },
];

function LalatianaSidebar({ active, onChange, counts = {} }) {
  return (
    <aside style={{
      width: 220, background: "var(--sidebar-bg, var(--bg-elev-1))",
      borderRight: "1px solid var(--border)",
      padding: "16px 8px", display: "flex", flexDirection: "column",
      height: "100%", flexShrink: 0, overflowY: "auto",
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px 18px" }}>
        <div style={{
          width: 30, height: 30, background: "var(--accent)", borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--accent-fg)", fontFamily: "IBM Plex Mono, monospace",
          fontWeight: 600, fontSize: 14,
        }}>L</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.02em", color: "var(--fg-1)" }}>LOI</div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-3)" }}>Premium Logistics</div>
        </div>
      </div>

      {/* Persona card */}
      <div style={{
        margin: "0 4px 14px", padding: "12px 14px",
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999,
          background: "var(--accent-soft)", color: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 600, fontFamily: "IBM Plex Mono, monospace",
        }}>LL</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Lalatiana</div>
          <div style={{ fontSize: 10.5, color: "var(--fg-3)" }}>CS Supervisor · Transit</div>
        </div>
        <span style={{
          fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700,
          padding: "2px 6px", borderRadius: 2, letterSpacing: "0.08em",
          background: "var(--accent-soft)", color: "var(--accent)",
        }}>N3</span>
      </div>

      {/* Section label */}
      <div style={{
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
        color: "var(--fg-3)", padding: "4px 14px 8px", fontWeight: 500,
      }}>Cockpit</div>

      {/* Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {LL_TABS.map(t => {
          const on = active === t.id;
          const ct = counts[t.id];
          return (
            <div key={t.id} onClick={() => onChange(t.id)} style={{
              display: "grid", gridTemplateColumns: "16px 1fr auto",
              alignItems: "center", gap: 12, padding: "10px 14px",
              borderRadius: 4, cursor: "pointer",
              background: on ? "var(--accent-soft)" : "transparent",
              color: on ? "var(--accent)" : "var(--fg-2)",
              fontSize: 13, fontWeight: on ? 600 : 500,
              borderLeft: on ? "2px solid var(--accent)" : "2px solid transparent",
              marginLeft: 2,
            }}>
              <i data-lucide={t.icon} style={{ width: 15, height: 15 }} />
              <span>{t.label}</span>
              {ct !== undefined && ct > 0 && (
                <span style={{
                  fontFamily: "IBM Plex Mono, monospace", fontSize: 10,
                  padding: "1px 6px", borderRadius: 2,
                  background: on ? "var(--accent)" : "var(--surface-2)",
                  color: on ? "var(--accent-fg)" : "var(--fg-2)",
                }}>{ct}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Drill-up footer */}
      <div style={{
        marginTop: "auto", padding: "14px 14px 10px",
        borderTop: "1px solid var(--border)", marginLeft: 4, marginRight: 4,
      }}>
        <div style={{
          fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em",
          color: "var(--fg-3)", marginBottom: 6, fontWeight: 500,
        }}>Drill-up</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
          borderRadius: 4, border: "1px solid var(--border)", background: "var(--surface)",
          cursor: "pointer",
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 999,
            background: "var(--surface-2)", color: "var(--fg-1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9.5, fontWeight: 600, fontFamily: "IBM Plex Mono, monospace",
          }}>TD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--fg-1)" }}>Tudi</div>
            <div style={{ fontSize: 10, color: "var(--fg-3)" }}>Resp Transit · N3</div>
          </div>
          <i data-lucide="arrow-up-right" style={{ width: 12, height: 12, color: "var(--accent)" }} />
        </div>
      </div>
    </aside>
  );
}

window.LalatianaSidebar = LalatianaSidebar;
