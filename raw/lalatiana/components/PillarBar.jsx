/* global React */

const LL_PILLARS = [
  { id: "p1", code: "P1", label: "Exécution & discipline",        value: 78, status: "warn", dominant: false, focus: false },
  { id: "p2", code: "P2", label: "Cash & rentabilité",             value: 65, status: "warn", dominant: false, focus: true  },
  { id: "p3", code: "P3", label: "Fidélité & diversification",     value: 82, status: "ok",   dominant: true,  focus: true  },
  { id: "p4", code: "P4", label: "Fluidité & productivité",        value: 71, status: "warn", dominant: false, focus: false },
];

const LL_STATUS_COLOR = {
  ok:    "var(--ok)",
  warn:  "var(--warn)",
  red:   "var(--err)",
};

function LalatianaPillarBar() {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)",
      minHeight: 72,
    }}>
      {LL_PILLARS.map((p, i) => {
        const dominant = p.dominant;
        const sColor = LL_STATUS_COLOR[p.status] || "var(--fg-mute)";
        return (
          <div key={p.id} style={{
            position: "relative",
            padding: "12px 20px",
            borderRight: i < 3 ? "1px solid var(--border)" : "none",
            background: dominant ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent",
            borderBottom: dominant ? "2px solid var(--accent)" : "2px solid transparent",
            display: "flex", flexDirection: "column", gap: 8,
            marginBottom: -1,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }}>
              <span style={{
                fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
                color: dominant ? "var(--accent)" : "var(--fg-3)",
                padding: "2px 6px", borderRadius: 2,
                background: dominant ? "var(--accent-soft)" : "var(--surface-2)",
                letterSpacing: "0.04em", flexShrink: 0,
              }}>{p.code}</span>

              {p.focus && (
                <span title="Focus pilier" style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.12em",
                  padding: "2px 5px", borderRadius: 2,
                  background: dominant ? "var(--accent)" : "var(--surface-2)",
                  color: dominant ? "var(--accent-fg)" : "var(--fg-3)",
                  textTransform: "uppercase",
                  border: dominant ? "none" : "1px solid var(--border)",
                  flexShrink: 0,
                }}>{dominant ? "Focus · dominant" : "Focus"}</span>
              )}

              <span style={{ fontSize: 11.5, color: "var(--fg-2)", fontWeight: 500, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.label}</span>

              <span style={{
                marginLeft: "auto",
                fontFamily: "IBM Plex Mono, monospace", fontSize: 18, fontWeight: 500,
                letterSpacing: "-0.01em", lineHeight: 1, color: "var(--fg-1)",
              }}>{p.value}</span>
            </div>

            {/* horizontal gauge */}
            <div style={{ position: "relative", height: 6, background: "var(--surface-2)", borderRadius: 999 }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${p.value}%`,
                background: dominant ? "var(--accent)" : sColor,
                borderRadius: 999,
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.LalatianaPillarBar = LalatianaPillarBar;
