/* global React, ETAPE_COLORS, ACTION_BY_ETAPE, ETAPE_PRIORITY */
const { useMemo: tblUseMemo } = React;

function EtapeChip({ etape }) {
  const c = ETAPE_COLORS[etape] || { fg: "var(--fg-2)", bg: "var(--surface-2)" };
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 2,
      background: c.bg, color: c.fg, whiteSpace: "nowrap",
      letterSpacing: 0,
    }}>{etape}</span>
  );
}

function ModeChip({ mode }) {
  return (
    <span style={{
      fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
      padding: "2px 6px", borderRadius: 2, letterSpacing: "0.04em",
      background: "var(--surface-2)", color: "var(--fg-2)",
      border: "1px solid var(--border)",
    }}>{mode}</span>
  );
}

function DossierTable({ dossiers, selected, onSelect, onAction }) {
  const sorted = tblUseMemo(() => {
    return [...dossiers].sort((a, b) => {
      const pa = ETAPE_PRIORITY[a.etape] ?? 99;
      const pb = ETAPE_PRIORITY[b.etape] ?? 99;
      if (pa !== pb) return pa - pb;
      // escalated first within same etape
      if (a.escalated !== b.escalated) return a.escalated ? -1 : 1;
      return 0;
    });
  }, [dossiers]);

  const cellPad = "12px 14px";
  const headerStyle = {
    fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
    color: "var(--fg-3)", fontWeight: 600, padding: cellPad,
    textAlign: "left", background: "var(--bg-elev-1)",
    borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
  };

  return (
    <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid var(--border)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
        <thead>
          <tr>
            <th style={headerStyle}>N° dossier</th>
            <th style={headerStyle}>Client</th>
            <th style={headerStyle}>Marchandise</th>
            <th style={{ ...headerStyle, textAlign: "center" }}>Mode</th>
            <th style={headerStyle}>Étape</th>
            <th style={headerStyle}>Owner aval</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Âge</th>
            <th style={{ ...headerStyle, textAlign: "right" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d) => {
            const isSelected = selected === d.ref;
            const isFinal = d.etape === "Facturée";
            const actionLbl = ACTION_BY_ETAPE[d.etape];
            return (
              <tr
                key={d.ref}
                onClick={() => onSelect(d.ref)}
                style={{
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  background: isSelected ? "var(--accent-soft)" : (isFinal ? "color-mix(in srgb, var(--fg-3) 5%, transparent)" : "transparent"),
                  opacity: isFinal ? 0.65 : 1,
                  transition: "background 120ms cubic-bezier(0.2, 0.7, 0.2, 1)",
                }}
              >
                <td style={{ padding: cellPad, fontFamily: "IBM Plex Mono, monospace", fontSize: 12.5, color: isSelected ? "var(--accent)" : "var(--fg-1)", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {d.ref}
                  {d.escalated && (
                    <span title="Escaladé à Tudi" style={{
                      marginLeft: 6, fontFamily: "Inter", fontSize: 9, fontWeight: 600,
                      padding: "1px 5px", borderRadius: 2, letterSpacing: "0.08em",
                      background: "var(--warn-soft)", color: "var(--warn)", textTransform: "uppercase",
                    }}>esc.</span>
                  )}
                </td>
                <td style={{ padding: cellPad, fontSize: 12.5, color: "var(--fg-1)", whiteSpace: "nowrap" }}>{d.client}</td>
                <td style={{ padding: cellPad, fontSize: 12.5, color: "var(--fg-2)" }}>{d.cargo}</td>
                <td style={{ padding: cellPad, textAlign: "center" }}><ModeChip mode={d.mode} /></td>
                <td style={{ padding: cellPad }}><EtapeChip etape={d.etape} /></td>
                <td style={{ padding: cellPad, fontSize: 12, color: "var(--fg-2)", whiteSpace: "nowrap" }}>{d.owner}</td>
                <td style={{ padding: cellPad, fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-2)", textAlign: "right", whiteSpace: "nowrap" }}>{d.age}</td>
                <td style={{ padding: cellPad, textAlign: "right" }}>
                  {actionLbl ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); onAction(d, actionLbl); }}
                      style={{
                        fontSize: 11.5, fontWeight: 500,
                        padding: "5px 10px", borderRadius: 4, cursor: "pointer",
                        background: actionLbl === "Escalader" ? "color-mix(in srgb, var(--warn) 14%, transparent)" : "var(--surface-2)",
                        color: actionLbl === "Escalader" ? "var(--warn)" : "var(--fg-1)",
                        border: `1px solid ${actionLbl === "Escalader" ? "color-mix(in srgb, var(--warn) 40%, transparent)" : "var(--border)"}`,
                        whiteSpace: "nowrap",
                      }}
                    >{actionLbl}</button>
                  ) : (
                    <span style={{ color: "var(--fg-mute)", fontSize: 12 }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

window.DossierTable = DossierTable;
window.EtapeChip = EtapeChip;
window.ModeChip = ModeChip;
