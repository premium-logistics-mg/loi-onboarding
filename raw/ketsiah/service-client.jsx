/* global React */
// Service client — revisions
// Three takes on the broken CS dashboard. Same data, cleaner hierarchy,
// no KPI duplication, risk visualised, single primary action per row.

// ────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────
const CS_KPI = {
  hero:       { label: "Tranquillité client · score moyen 90j", value: "69,8", unit: "/100", target: "≥ 75", status: "warn",
                spark: [72, 71, 73, 70, 69, 68, 70, 69.8] },
  satisfaction: { label: "Satisfaction top 5 clients", value: "84", unit: "%", target: "≥ 95 % (rolling 7j)", status: "warn",
                spark: [88, 89, 86, 85, 84, 86, 85, 84] },
  delai:        { label: "Délai moyen réponse client", value: "1,4", unit: "j", target: "≤ 2h SLA INVISO", status: "err",
                spark: [0.8, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.4] },
  reclamations: { label: "Réclamations actives non-résolues", value: "4", unit: "", target: "0 · zéro tolérance Pacte TER", status: "err",
                spark: [2, 3, 3, 4, 5, 4, 4, 4] },
};

const CS_DOSSIERS = [
  { client: "KERRYSON-MINE",  raison: "Inspection bloquée — dossier FAE260017", risk: 95, age: "2h", action: "Tranquillité client" },
  { client: "MG-MINE",        raison: "Retard paiement 50j — FAE260010 · 3 relances", risk: 90, age: "5h", action: "Escalade" },
  { client: "PENTA-OCEAN",    raison: "Promis 24h non tenu — attente paiement fret", risk: 85, age: "1j", action: "Tranquillité client" },
  { client: "NS-ENTREPRISES", raison: "Facturation J+2 · livraison J-1", risk: 65, age: "3j", action: "Régulariser" },
  { client: "INVISO-GROUP",   raison: "SLA director reply 1h · message client sans réponse 2h", risk: 55, age: "2h", action: "Répondre" },
];

const RECLAMATIONS = {
  total: 4,
  ouvertes: 4,
  resolueATemps: 2,
  enRetard: 2,
  cashImpact: "22,3 MMGA",
};

const STATUS_COLOR_CS = {
  ok:   "var(--ok)",
  warn: "var(--warn)",
  err:  "var(--err)",
};

// ────────────────────────────────────────────────────────────
// Atoms
// ────────────────────────────────────────────────────────────
function MiniSparkline({ values, status, width = 110, height = 28 }) {
  if (!values || values.length < 2) return null;
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const last = pts[pts.length - 1];
  const color = STATUS_COLOR_CS[status];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={color} opacity="0.10" />
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  );
}

function CSPageHeader({ title = "Service client", icon = "i" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 10,
      fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
      color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em",
    }}>
      <span>{title}</span>
      <span style={{
        width: 14, height: 14, borderRadius: 999,
        border: "1px solid var(--border)", color: "var(--fg-3)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 600,
      }}>{icon}</span>
    </div>
  );
}

function RiskBar({ value, max = 100, status = "err", width = 120 }) {
  // Visual heat: red 80+ / orange 60-79 / fg-3 below.
  const color =
    value >= 80 ? "var(--err)" :
    value >= 60 ? "var(--warn)" :
    "var(--fg-3)";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8, width,
    }}>
      <div style={{
        flex: 1, height: 4, borderRadius: 2,
        background: "var(--surface-2)", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${(value / max) * 100}%`, background: color,
        }} />
      </div>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500,
        fontVariantNumeric: "tabular-nums",
        color, minWidth: 26, textAlign: "right",
      }}>{value}</span>
    </div>
  );
}

function Pill({ kind = "neutral", children }) {
  const map = {
    ok:   { bg: "var(--ok-soft)",   fg: "var(--ok)" },
    warn: { bg: "var(--warn-soft)", fg: "var(--warn)" },
    err:  { bg: "var(--err-soft)",  fg: "var(--err)" },
    neutral: { bg: "var(--surface-2)", fg: "var(--fg-2)" },
  };
  const s = map[kind];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
      padding: "3px 8px", borderRadius: 2,
      background: s.bg, color: s.fg, textTransform: "uppercase", letterSpacing: "0.04em",
      lineHeight: 1.4,
    }}>{children}</span>
  );
}

function GhostBtn({ children, primary }) {
  return (
    <button style={{
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
      padding: "5px 10px", borderRadius: 4,
      background: primary ? "var(--accent)" : "transparent",
      color: primary ? "var(--accent-fg)" : "var(--accent)",
      border: `1px solid ${primary ? "var(--accent)" : "var(--accent)"}`,
      cursor: "pointer", letterSpacing: "0",
    }}>{children}</button>
  );
}

// ────────────────────────────────────────────────────────────
// CS-A · Pulse — single hero + supporting KPIs + risk-ranked list + funnel
// ────────────────────────────────────────────────────────────
function CSVariantA() {
  return (
    <div className="frame">
      <CSPageHeader />
      <div className="card" style={{ overflow: "hidden" }}>
        {/* HERO: one big number, sparkline beside, secondary KPIs on right */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24,
          padding: "24px 28px", alignItems: "center",
          borderBottom: "1px solid var(--border)",
        }}>
          {/* hero number */}
          <div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
              color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em",
              marginBottom: 8,
            }}>Tranquillité client · score moyen 90 jours</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 56, fontWeight: 500,
                color: STATUS_COLOR_CS.warn, lineHeight: 1, letterSpacing: "-0.02em",
              }}>69,8</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--fg-3)" }}>/100</span>
              <span style={{ marginLeft: 4 }}>
                <Pill kind="warn">cible ≥ 75</Pill>
              </span>
            </div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)",
              marginTop: 8,
            }}>recalcul J+2 · innovation native LOI D64</div>
          </div>
          {/* sparkline */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <MiniSparkline values={CS_KPI.hero.spark} status="warn" width={160} height={44} />
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 9, color: "var(--fg-3)",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>8 semaines</span>
          </div>
          {/* actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <GhostBtn>Envoyer Tranquillité client</GhostBtn>
            <GhostBtn primary>Escalader · Tudi</GhostBtn>
          </div>
        </div>

        {/* Supporting KPIs strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
          background: "var(--border)",
          borderBottom: "1px solid var(--border)",
        }}>
          {["satisfaction", "delai", "reclamations"].map((k) => {
            const x = CS_KPI[k];
            return (
              <div key={k} style={{
                background: "var(--surface)", padding: "18px 24px",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500,
                    color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em",
                    marginBottom: 6,
                  }}>{x.label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 500,
                      color: STATUS_COLOR_CS[x.status], lineHeight: 1,
                    }}>{x.value}</span>
                    {x.unit && <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{x.unit}</span>}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
                    marginTop: 4,
                  }}>cible {x.target.split("·")[0].trim()}</div>
                </div>
                <MiniSparkline values={x.spark} status={x.status} width={80} height={28} />
              </div>
            );
          })}
        </div>

        {/* Top dossiers — risk-ranked */}
        <div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 24px", borderBottom: "1px solid var(--border)",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
              color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              <span style={{ color: "var(--fg-1)" }}>{CS_DOSSIERS.length}</span>&nbsp; dossiers à risque
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)" }}>
              tri par risque · click pour drill CS-Admin
            </span>
          </div>
          {CS_DOSSIERS.map((d, i) => (
            <div key={d.client} style={{
              display: "grid",
              gridTemplateColumns: "150px 1fr 60px 160px 130px",
              alignItems: "center", gap: 16,
              padding: "12px 24px",
              borderTop: i === 0 ? 0 : "1px solid var(--border)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "color-mix(in srgb, var(--accent-soft) 50%, transparent)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-1)", fontWeight: 500 }}>{d.client}</span>
              <span style={{ fontSize: 13, color: "var(--fg-2)" }}>{d.raison}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>{d.age}</span>
              <RiskBar value={d.risk} width={160} />
              <div style={{ justifySelf: "end" }}>
                <GhostBtn>{d.action}</GhostBtn>
              </div>
            </div>
          ))}
        </div>

        {/* Réclamations funnel */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          padding: "16px 24px",
          gap: 24,
          borderTop: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--bg) 80%, var(--surface))",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500,
              color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>Réclamations actives</div>
            <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500, marginTop: 4 }}>
              <span className="num" style={{ fontFamily: "var(--font-mono)" }}>4</span> non-résolues
              <span style={{ color: "var(--fg-mute)", margin: "0 8px" }}>·</span>
              <span style={{ color: "var(--err)" }}>zéro tolérance Pacte TER</span>
            </div>
          </div>
          {/* funnel */}
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {[
              { k: "Ouvertes", v: 4, c: "var(--warn)" },
              { k: "Résolues à temps", v: 2, c: "var(--ok)" },
              { k: "En retard", v: 2, c: "var(--err)" },
              { k: "Cash impact", v: "22,3", u: " MMGA", c: "var(--fg-1)" },
            ].map((f, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: "var(--fg-mute)", fontSize: 14 }}>→</span>}
                <div style={{
                  padding: "8px 14px", borderRadius: 4,
                  background: "var(--surface)", border: "1px solid var(--border)",
                  minWidth: 120, textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 500,
                    color: f.c, lineHeight: 1,
                  }}>{f.v}{f.u && <span style={{ fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-sans)", marginLeft: 2 }}>{f.u}</span>}</div>
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 9, color: "var(--fg-3)",
                    textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4,
                  }}>{f.k}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <GhostBtn>Drill réclamations</GhostBtn>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CS-B · Triage — most-urgent dossier first, KPIs become rail
// ────────────────────────────────────────────────────────────
function CSVariantB() {
  const top = CS_DOSSIERS[0];
  return (
    <div className="frame">
      <CSPageHeader />
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 320px", gap: 16,
      }}>
        {/* main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Urgent callout */}
          <div className="card" style={{
            padding: 0, overflow: "hidden",
            borderLeft: "3px solid var(--err)",
          }}>
            <div style={{
              padding: "20px 24px",
              display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start",
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
                }}>
                  <Pill kind="err">à traiter maintenant</Pill>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>
                    ouvert depuis {top.age}
                  </span>
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-1)",
                  fontWeight: 500, marginBottom: 4,
                }}>{top.client}</div>
                <div style={{ fontSize: 17, color: "var(--fg-1)", fontWeight: 600, lineHeight: 1.3 }}>
                  {top.raison}
                </div>
                <div style={{
                  display: "flex", gap: 16, marginTop: 12,
                  fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)",
                }}>
                  <span>risque <b style={{ color: "var(--err)", fontWeight: 500 }}>{top.risk}/100</b></span>
                  <span>SLA dépassé <b style={{ color: "var(--err)", fontWeight: 500 }}>2h</b></span>
                  <span>impact estimé <b style={{ color: "var(--fg-1)", fontWeight: 500 }}>8,2 MMGA</b></span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                <GhostBtn>Envoyer Tranquillité</GhostBtn>
                <GhostBtn primary>Escalader · Tudi</GhostBtn>
              </div>
            </div>
          </div>

          {/* Rest of risk list */}
          <div className="card">
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 20px", borderBottom: "1px solid var(--border)",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
                color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                <span style={{ color: "var(--fg-1)" }}>4</span>&nbsp; autres dossiers à risque
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)" }}>
                tri par risque
              </span>
            </div>
            {CS_DOSSIERS.slice(1).map((d, i) => (
              <div key={d.client} style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 50px 140px 100px",
                alignItems: "center", gap: 14,
                padding: "11px 20px",
                borderTop: i === 0 ? 0 : "1px solid var(--border)",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-1)", fontWeight: 500 }}>{d.client}</span>
                <span style={{ fontSize: 12, color: "var(--fg-2)" }}>{d.raison}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>{d.age}</span>
                <RiskBar value={d.risk} width={140} />
                <div style={{ justifySelf: "end" }}>
                  <GhostBtn>{d.action}</GhostBtn>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right rail: KPIs stacked vertical */}
        <div className="card" style={{ padding: 0, overflow: "hidden", alignSelf: "start" }}>
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid var(--border)",
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
            color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            Pulse client
          </div>
          {[
            { ...CS_KPI.hero,         key: "hero" },
            { ...CS_KPI.satisfaction, key: "sat" },
            { ...CS_KPI.delai,        key: "delai" },
            { ...CS_KPI.reclamations, key: "rec" },
          ].map((x, i) => (
            <div key={x.key} style={{
              padding: "14px 18px",
              borderTop: i === 0 ? 0 : "1px solid var(--border)",
              display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center",
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500,
                  color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em",
                  marginBottom: 4,
                }}>{x.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 500,
                    color: STATUS_COLOR_CS[x.status], lineHeight: 1,
                  }}>{x.value}</span>
                  {x.unit && <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{x.unit}</span>}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
                  marginTop: 4,
                }}>cible {x.target.split("·")[0].trim()}</div>
              </div>
              <MiniSparkline values={x.spark} status={x.status} width={60} height={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CS-C · Health-strip — minimal hero, all 4 KPIs as a strip, dense table
// ────────────────────────────────────────────────────────────
function CSVariantC() {
  return (
    <div className="frame">
      <CSPageHeader />
      {/* Single horizontal pulse strip — 4 KPIs equal weight, hero distinguished */}
      <div className="card" style={{
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
        gap: 1, background: "var(--border)", marginBottom: 16, overflow: "hidden",
      }}>
        {/* Hero KPI cell */}
        <div style={{
          background: "var(--surface)", padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500,
              color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em",
            }}>Tranquillité client · 90j</span>
            <Pill kind="warn">amber</Pill>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 42, fontWeight: 500,
              color: STATUS_COLOR_CS.warn, lineHeight: 1,
            }}>69,8</span>
            <span style={{ fontSize: 13, color: "var(--fg-3)" }}>/100</span>
            <span style={{ marginLeft: "auto", color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
              cible ≥ 75
            </span>
          </div>
          <MiniSparkline values={CS_KPI.hero.spark} status="warn" width={260} height={32} />
        </div>
        {/* 3 KPI cells */}
        {["satisfaction", "delai", "reclamations"].map((k) => {
          const x = CS_KPI[k];
          return (
            <div key={k} style={{
              background: "var(--surface)", padding: "20px 20px",
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500,
                color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em",
              }}>{x.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 500,
                  color: STATUS_COLOR_CS[x.status], lineHeight: 1,
                }}>{x.value}</span>
                {x.unit && <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{x.unit}</span>}
              </div>
              <MiniSparkline values={x.spark} status={x.status} width={140} height={26} />
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)", marginTop: "auto",
              }}>cible {x.target.split("·")[0].trim()}</div>
            </div>
          );
        })}
      </div>

      {/* Dense dossiers table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 20px", borderBottom: "1px solid var(--border)",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
            color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            <span style={{ color: "var(--fg-1)" }}>{CS_DOSSIERS.length}</span>&nbsp; dossiers à risque
          </span>
          <GhostBtn>Couverture exhaustive · CS-Admin</GhostBtn>
        </div>
        <table style={{
          width: "100%", borderCollapse: "collapse", fontSize: 12,
        }}>
          <thead>
            <tr>
              {["Client", "Raison", "Âge", "Risque", "Action"].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 3 ? "left" : "left",
                  fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 500,
                  color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em",
                  padding: "10px 16px",
                  borderBottom: "1px solid var(--border)",
                  background: "color-mix(in srgb, var(--bg) 60%, var(--surface))",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CS_DOSSIERS.map((d) => (
              <tr key={d.client}>
                <td style={{
                  padding: "12px 16px", borderTop: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-1)", fontWeight: 500,
                }}>{d.client}</td>
                <td style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", color: "var(--fg-2)" }}>{d.raison}</td>
                <td style={{
                  padding: "12px 16px", borderTop: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)",
                }}>{d.age}</td>
                <td style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                  <RiskBar value={d.risk} width={150} />
                </td>
                <td style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", textAlign: "right" }}>
                  <GhostBtn>{d.action}</GhostBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Expose for the canvas file
Object.assign(window, { CSVariantA, CSVariantB, CSVariantC });
