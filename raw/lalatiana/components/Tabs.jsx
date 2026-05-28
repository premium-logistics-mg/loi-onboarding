/* global React */

const LL_TABS = [
  { id: "vue",     label: "Vue d'ensemble",  icon: "layout-dashboard" },
  { id: "scores",  label: "Scores",          icon: "target" },
  { id: "carnet",  label: "Carnet de bord",  icon: "clipboard-list" },
  { id: "docs",    label: "Documentation",   icon: "folder-open" },
  { id: "profil",  label: "Profil",          icon: "user-circle-2" },
];

function LalatianaTabs({ active, onChange, counts = {} }) {
  return (
    <div style={{
      display: "flex", gap: 0, borderBottom: "1px solid var(--border)",
      background: "var(--bg)", padding: "0 24px",
    }}>
      {LL_TABS.map(t => {
        const on = active === t.id;
        return (
          <div key={t.id} onClick={() => onChange(t.id)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 16px", cursor: "pointer",
            color: on ? "var(--fg-1)" : "var(--fg-3)",
            borderBottom: on ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -1, fontSize: 13, fontWeight: 500,
          }}>
            <i data-lucide={t.icon} style={{ width: 14, height: 14 }} />
            {t.label}
            {counts[t.id] !== undefined && (
              <span style={{
                fontFamily: "IBM Plex Mono, monospace", fontSize: 10,
                padding: "1px 5px", borderRadius: 2,
                background: "var(--surface-2)", color: "var(--fg-2)",
              }}>{counts[t.id]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

window.LalatianaTabs = LalatianaTabs;
