/* global React */

// ============== BREADCRUMB ==============
function Breadcrumb() {
  return (
    <div style={{
      padding: "14px 28px 6px",
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 12, color: "var(--fg-3)",
    }}>
      <a href="#" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color: "var(--accent)", textDecoration: "none",
        padding: "4px 8px", borderRadius: 4,
        background: "var(--accent-soft)",
      }}>
        <i data-lucide="arrow-left" style={{ width: 12, height: 12 }} />
        Tudi · Resp Transit
      </a>
      <span style={{ color: "var(--fg-mute)" }}>/</span>
      <span style={{ color: "var(--fg-1)" }}>Lalatiana · CS Supervisor</span>
      <span style={{ marginLeft: "auto", fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>
        28 mai 2026 · 11:42
      </span>
    </div>
  );
}

// ============== TOAST ==============
function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 100,
      display: "flex", flexDirection: "column", gap: 10, maxWidth: 380,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: `3px solid ${t.tone === "warn" ? "var(--warn)" : t.tone === "err" ? "var(--err)" : "var(--accent)"}`,
          borderRadius: 8, padding: "12px 14px",
          boxShadow: "var(--shadow-2)",
          display: "flex", gap: 12, alignItems: "flex-start",
          animation: "ll-toast-in 180ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}>
          <i data-lucide={t.icon || "check-circle-2"} style={{ width: 16, height: 16, color: t.tone === "warn" ? "var(--warn)" : t.tone === "err" ? "var(--err)" : "var(--accent)", flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1, fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.4 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.title}</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{t.body}</div>
          </div>
          <button onClick={() => onDismiss(t.id)} style={{
            background: "transparent", border: 0, color: "var(--fg-3)", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center",
          }}>
            <i data-lucide="x" style={{ width: 12, height: 12 }} />
          </button>
        </div>
      ))}
    </div>
  );
}

window.Breadcrumb = Breadcrumb;
window.Toast = Toast;
