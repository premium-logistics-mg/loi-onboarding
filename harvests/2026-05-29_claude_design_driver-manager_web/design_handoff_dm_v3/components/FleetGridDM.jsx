/* global React, StatusChip, GaugeBar, docState, sevColor, SOChip, Tooltip */
/* ============================================================
   FleetGridDM.jsx — Section 1.6 · tableau dense 15 chauffeurs
   tri colonnes · header sticky · zebra · clic ligne → sélection
   ============================================================ */
const { useState: useStateFG, useMemo: useMemoFG } = React;

const STAT_KIND = { actif: "ok", conge: "warn", maladie: "err" };

function StatChip({ s }) {
  return <StatusChip kind={STAT_KIND[s] || "neutral"} mono>{s}</StatusChip>;
}

function DocCell({ date, days }) {
  const st = docState(days);
  const color = st === "err" ? "var(--err)" : st === "warn" ? "var(--warn)" : "var(--fg-2)";
  const label = days < 0 ? "expiré" : days < 60 ? `${days} j` : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-1)" }}>{date}</span>
      {label && <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600, color }}>{days < 0 ? "expiré" : `échéance ${days} j`}</span>}
    </div>
  );
}

const COLS = [
  { key: "id",        label: "DRV-ID",      w: 84,  align: "left" },
  { key: "name",      label: "Nom",         w: 92,  align: "left" },
  { key: "statut",    label: "Statut",      w: 96,  align: "left" },
  { key: "ct",        label: "Véhicule",    w: 92,  align: "left" },
  { key: "client",    label: "Client",      w: 124, align: "left" },
  { key: "permisDays",label: "Permis",      w: 128, align: "left" },
  { key: "medDays",   label: "Médical",     w: 128, align: "left" },
  { key: "score",     label: "Score · SO·3", w: 110, align: "left" },
  { key: "inc",       label: "Inc. 30 j",   w: 78,  align: "center" },
  { key: "oooDays",   label: "Dernier 1-on-1", w: 120, align: "left" },
  { key: "action",    label: "",            w: 120, align: "right" },
];

function FleetGridDM({ drivers, selectedId, onSelect }) {
  const [sortKey, setSortKey] = useStateFG("id");
  const [dir, setDir] = useStateFG(1);

  const sorted = useMemoFG(() => {
    const arr = [...drivers];
    arr.sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
    return arr;
  }, [drivers, sortKey, dir]);

  const toggleSort = (k) => {
    if (k === "action") return;
    if (k === sortKey) setDir(d => -d);
    else { setSortKey(k); setDir(1); }
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 1100 }}>
          <thead>
            <tr style={{ position: "sticky", top: 0, zIndex: 2 }}>
              {COLS.map(c => {
                const on = sortKey === c.key;
                return (
                  <th key={c.key} onClick={() => toggleSort(c.key)} style={{
                    textAlign: c.align, padding: "11px 14px", width: c.w,
                    background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)",
                    fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
                    color: on ? "var(--accent)" : "var(--fg-3)", fontWeight: 600,
                    cursor: c.key === "action" ? "default" : "pointer", whiteSpace: "nowrap", userSelect: "none",
                  }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, justifyContent: c.align === "right" ? "flex-end" : c.align === "center" ? "center" : "flex-start" }}>
                      {c.label}
                      {on && c.key !== "action" && <span style={{ fontSize: 9 }}>{dir > 0 ? "▲" : "▼"}</span>}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => {
              const sel = selectedId === d.id;
              const scoreColor = d.score >= 75 ? "var(--ok)" : d.score >= 60 ? "var(--warn)" : "var(--err)";
              return (
                <tr key={d.id} onClick={() => onSelect(d.id)} style={{
                  background: sel ? "var(--accent-soft)" : (i % 2 ? "color-mix(in srgb, var(--bg-elev-1) 45%, transparent)" : "transparent"),
                  borderLeft: sel ? "2px solid var(--accent)" : "2px solid transparent",
                  cursor: "pointer", transition: "background 120ms",
                }}
                onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "var(--bg-elev-1)"; }}
                onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = i % 2 ? "color-mix(in srgb, var(--bg-elev-1) 45%, transparent)" : "transparent"; }}>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)" }}>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, fontWeight: 600, color: sel ? "var(--accent)" : "var(--fg-1)" }}>{d.id}</span>
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)", color: "var(--fg-2)" }}>{d.name}</td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)" }}><StatChip s={d.statut} /></td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)" }}>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-1)" }}>{d.ct}</span>
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)" }}>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-2)" }}>{d.client}</span>
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)" }}><DocCell date={d.permisExp} days={d.permisDays} /></td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)" }}><DocCell date={d.medExp} days={d.medDays} /></td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)" }}>
                    <Tooltip width={250} content={
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--fg-1)" }}><span style={{ fontFamily: "IBM Plex Mono, monospace" }}>{d.id}</span> · composante SO·3 dispo</div>
                        {[["statut", d.statut], ["permis", d.permisDays < 0 ? "expiré" : d.permisDays < 60 ? `${d.permisDays} j` : "valide"], ["médical", d.medDays < 0 ? "expiré" : "à jour"], ["score chauffeur", `${d.score}/100`]].map((r, k) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>{r[0]}</span><span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-1)" }}>{r[1]}</span></div>
                        ))}
                      </div>
                    }>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "help" }}>
                        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 14, fontWeight: 500, color: scoreColor, width: 24 }}>{d.score}</span>
                        <div style={{ width: 40 }}><GaugeBar score={d.score} target={75} height={4} /></div>
                      </div>
                    </Tooltip>
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)", textAlign: "center" }}>
                    {d.inc > 0
                      ? <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, fontWeight: 600, color: "var(--err)", background: "var(--err-soft)", padding: "2px 8px", borderRadius: 2 }}>{d.inc}</span>
                      : <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-3)" }}>0</span>}
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)" }}>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-1)" }}>{d.oneOnOne}</span>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600, color: d.oooDays > 35 ? "var(--err)" : "var(--fg-3)" }}>
                        {d.oooDays > 35 ? `${d.oooDays} j · retard` : `${d.oooDays} j`}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-soft)", textAlign: "right" }}>
                    <button onClick={(e) => { e.stopPropagation(); onSelect(d.id); }} style={{
                      fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500, padding: "6px 10px", borderRadius: 4, lineHeight: 1, cursor: "pointer", whiteSpace: "nowrap",
                      background: sel ? "var(--accent)" : "transparent", color: sel ? "var(--accent-fg)" : "var(--fg-1)",
                      border: `1px solid ${sel ? "transparent" : "var(--border)"}`,
                    }}>Profil 360°</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.FleetGridDM = FleetGridDM;
