/* global React */

function LalatianaTopBar() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 24px", borderBottom: "1px solid var(--border)",
      background: "var(--bg)", gap: 16, minHeight: 52, boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          fontFamily: "IBM Plex Mono, monospace", fontSize: 11, fontWeight: 600,
          padding: "3px 7px", borderRadius: 2, letterSpacing: "0.04em",
          background: "var(--surface-2)", color: "var(--fg-2)",
          border: "1px solid var(--border)",
        }}>LOI</span>
        <span style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>
          Transit · Customer Service
        </span>
        <span style={{ color: "var(--fg-3)", fontSize: 13 }}>·</span>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>
          Premium Logistics
        </span>
        <span style={{
          marginLeft: 8,
          fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 700,
          padding: "2px 6px", borderRadius: 2, letterSpacing: "0.08em",
          background: "var(--accent-soft)", color: "var(--accent)",
        }}>N3</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 10px", borderRadius: 4, border: "1px solid var(--border)",
          background: "var(--surface)", width: 260,
        }}>
          <i data-lucide="search" style={{ width: 13, height: 13, color: "var(--fg-3)" }} />
          <input placeholder="Rechercher dossier, client, ref…" style={{
            flex: 1, background: "transparent", border: 0, outline: "none",
            color: "var(--fg-1)", fontSize: 12, fontFamily: "Inter, sans-serif",
          }} />
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)", padding: "1px 5px", border: "1px solid var(--border)", borderRadius: 2 }}>⌘K</span>
        </div>
        <button title="Notifications" style={{
          width: 32, height: 32, borderRadius: 4, border: "1px solid var(--border)",
          background: "var(--surface)", color: "var(--fg-2)", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <i data-lucide="bell" style={{ width: 14, height: 14 }} />
        </button>
        <div style={{
          width: 32, height: 32, borderRadius: 999, background: "var(--accent-soft)",
          border: "1px solid var(--border)", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--accent)",
          fontFamily: "IBM Plex Mono, monospace",
        }}>LL</div>
        <span style={{
          fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
          padding: "3px 8px", borderRadius: 2, letterSpacing: "0.12em",
          background: "var(--warn-soft)", color: "var(--warn)",
        }}>DEMO</span>
      </div>
    </div>
  );
}

window.LalatianaTopBar = LalatianaTopBar;
