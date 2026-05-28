/* global React, DOC_PIECES, KPIS, EtapeChip */

// ============== DOCUMENTATION ==============
function DocPieceRow({ pieceId, label, actor, state, sub }) {
  const stateLook = ({
    ok:      { icon: "check",     fg: "var(--ok)",   label: "reçue" },
    pending: { icon: "clock",     fg: "var(--warn)", label: "attendue" },
    missing: { icon: "alert-triangle", fg: "var(--err)", label: "manquante" },
    none:    { icon: "circle",    fg: "var(--fg-mute)", label: "non démarrée" },
  })[state] || { icon: "circle", fg: "var(--fg-mute)", label: "—" };

  const cta = state === "ok" ? "Voir" : state === "missing" ? "Joindre" : state === "pending" ? "Suivre" : "—";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "24px 1fr auto auto", gap: 14,
      padding: "14px 16px", alignItems: "center",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: state === "none" ? "transparent" : `color-mix(in srgb, ${stateLook.fg} 14%, transparent)`,
        color: stateLook.fg, border: state === "none" ? "1px dashed var(--border)" : "none",
      }}>
        <i data-lucide={stateLook.icon} style={{ width: 12, height: 12 }} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>
          acteur · {actor}{sub ? <> · <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>{sub}</span></> : null}
        </div>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 2,
        letterSpacing: "0.08em", textTransform: "uppercase",
        background: state === "none" ? "var(--surface-2)" : `color-mix(in srgb, ${stateLook.fg} 14%, transparent)`,
        color: state === "none" ? "var(--fg-mute)" : stateLook.fg,
      }}>{stateLook.label}</span>
      {cta !== "—" ? (
        <button style={{
          fontSize: 11.5, fontWeight: 500,
          padding: "5px 11px", borderRadius: 4, cursor: "pointer",
          background: "var(--surface-2)", color: "var(--fg-1)", border: "1px solid var(--border)",
        }}>{cta}</button>
      ) : <span style={{ color: "var(--fg-mute)", fontSize: 11 }}>—</span>}
    </div>
  );
}

// Determine state for each piece based on dossier data
function computeDocStates(d) {
  if (!d) return {};
  const docs = d.docs || {};
  const hasMandate = (d.files || []).some(f => f.pieceId === "mandate");
  return {
    mandate:  hasMandate ? "ok" : "missing",
    bl:       docs.bl  ? "ok" : "missing",
    fc:       docs.fc  ? "ok" : "missing",
    pl:       docs.pl  ? "ok" : "missing",
    bsc:      docs.bsc ? "ok" : "missing",
    cotation: d.cotation ? "ok" : "none",
    dauBr:    d.dauRef ? "ok" : (d.cotation ? "pending" : "none"),
    dauSb:    ["DAU soumise", "Circuit Vert", "Circuit Jaune", "Circuit Rouge", "Liquidée DGD", "Facturée"].includes(d.etape) ? "ok" :
              ["DAU brouillon"].includes(d.etape) ? "pending" : "none",
    liq:      ["Liquidée DGD", "Facturée"].includes(d.etape) ? "ok" :
              ["Circuit Vert", "Circuit Jaune", "Circuit Rouge"].includes(d.etape) ? "pending" : "none",
    fac:      d.etape === "Facturée" ? "ok" :
              d.etape === "Liquidée DGD" ? "pending" : "none",
  };
}

function DocSubLabel(pieceId, d) {
  if (pieceId === "cotation" && d.cotation) return d.cotation;
  if (pieceId === "dauBr" && d.dauRef) return d.dauRef + " (brouillon)";
  if (pieceId === "dauSb" && d.dauRef && d.etape !== "DAU brouillon") return d.dauRef + " · circuit " + (d.etape.startsWith("Circuit") ? d.etape.split(" ")[1].toLowerCase() : "à déterminer");
  return null;
}

function Documentation({ dossiers, selectedRef, onSelect, claims = [] }) {
  const dossier = dossiers.find(d => d.ref === selectedRef) || dossiers[0];
  const states = computeDocStates(dossier);

  // Header global counts
  const totalFiles = dossiers.reduce((sum, d) => sum + (d.files?.length || 0), 0);
  const totalMandates = dossiers.filter(d => d.files?.some(f => f.pieceId === "mandate" && f.signed)).length;

  // Index attached files by pieceId for the selected dossier
  const fileByPiece = {};
  (dossier?.files || []).forEach(f => { fileByPiece[f.pieceId] = f; });
  const mandateFile = fileByPiece["mandate"];

  // Claims liées au dossier
  const relatedClaims = dossier ? claims.filter(c => c.dossier === dossier.ref) : [];

  return (
    <div style={{ padding: "20px 28px" }}>
      {/* Hub header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)" }}>Hub documentaire</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)" }}>Toutes les pièces attachées par dossier · mandat signé en preuve d'ouverture.</div>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {[
            { label: "Dossiers", value: dossiers.length, color: "var(--fg-1)" },
            { label: "Pièces attachées", value: totalFiles, color: "var(--fg-1)" },
            { label: "Mandats signés", value: `${totalMandates} / ${dossiers.length}`, color: totalMandates === dossiers.length ? "var(--ok)" : "var(--warn)" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "right", paddingLeft: 18, borderLeft: "1px solid var(--border)" }}>
              <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 4, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 18, fontWeight: 500, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 18, alignItems: "start" }}>
        {/* LEFT · Dossier list */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{
            padding: "12px 14px", borderBottom: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "var(--bg-elev-1)",
          }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Dossiers ouverts</span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>{dossiers.length}</span>
          </div>
          <div style={{ maxHeight: 720, overflowY: "auto" }}>
            {dossiers.map(d => {
              const on = d.ref === dossier?.ref;
              const nFiles = d.files?.length || 0;
              const hasMandate = d.files?.some(f => f.pieceId === "mandate" && f.signed);
              return (
                <div key={d.ref} onClick={() => onSelect(d.ref)} style={{
                  padding: "11px 14px", cursor: "pointer",
                  borderBottom: "1px solid var(--border)",
                  background: on ? "var(--accent-soft)" : "transparent",
                  borderLeft: on ? "2px solid var(--accent)" : "2px solid transparent",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{
                      fontFamily: "IBM Plex Mono, monospace", fontSize: 12.5, fontWeight: 500,
                      color: on ? "var(--accent)" : "var(--fg-1)",
                    }}>{d.ref}</span>
                    <span title={hasMandate ? "Mandat signé" : "Mandat manquant"} style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      fontSize: 9.5, fontWeight: 600,
                      padding: "2px 6px", borderRadius: 2, letterSpacing: "0.04em",
                      background: hasMandate ? "color-mix(in srgb, var(--ok) 14%, transparent)" : "var(--err-soft)",
                      color: hasMandate ? "var(--ok)" : "var(--err)",
                    }}>
                      <i data-lucide={hasMandate ? "file-check-2" : "file-x"} style={{ width: 10, height: 10 }} />
                      {hasMandate ? "signé" : "absent"}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-2)", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.client}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "var(--fg-3)" }}>{d.etape}</span>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>
                      <i data-lucide="paperclip" style={{ width: 9, height: 9, verticalAlign: "-1px", marginRight: 2 }} />{nFiles}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT · Selected dossier detail */}
        {!dossier ? (
          <div style={{
            padding: "80px 24px", background: "var(--surface)",
            border: "1px dashed var(--border)", borderRadius: 12,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center",
          }}>
            <i data-lucide="folder-search" style={{ width: 28, height: 28, color: "var(--fg-mute)" }} />
            <div style={{ fontSize: 13, color: "var(--fg-2)" }}>Sélectionner un dossier à gauche pour voir ses pièces.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Bandeau dossier */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "18px 22px",
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
              gap: 24, flexWrap: "wrap",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22, fontWeight: 500, color: "var(--fg-1)", letterSpacing: "-0.01em" }}>{dossier.ref}</span>
                  <EtapeChip etape={dossier.etape} />
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-2)" }}>{dossier.client} · {dossier.cargo}</div>
                <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>
                  navire · {dossier.navire || "—"} · mode {dossier.mode} · owner aval {dossier.owner}
                </div>
              </div>
              {dossier.marge && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 4 }}>Marge cotation</div>
                  <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22, fontWeight: 500, color: dossier.marge >= 7 ? "var(--ok)" : "var(--err)" }}>
                    {dossier.marge.toString().replace(".", ",")}<span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--fg-3)", marginLeft: 4 }}>%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mandat signé bloc */}
            <div style={{
              padding: "18px 22px",
              background: mandateFile ? "color-mix(in srgb, var(--ok) 6%, var(--surface))" : "var(--surface)",
              border: `1px solid ${mandateFile ? "color-mix(in srgb, var(--ok) 35%, transparent)" : "var(--border)"}`,
              borderRadius: 12,
              display: "flex", gap: 16, alignItems: "center",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 8,
                background: mandateFile ? "color-mix(in srgb, var(--ok) 16%, transparent)" : "var(--err-soft)",
                color: mandateFile ? "var(--ok)" : "var(--err)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <i data-lucide={mandateFile ? "file-signature" : "file-x"} style={{ width: 22, height: 22 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
                    color: mandateFile ? "var(--ok)" : "var(--err)", fontWeight: 600,
                  }}>Mandat signé client</span>
                  {mandateFile && (
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, padding: "2px 6px", borderRadius: 2,
                      background: "var(--ok)", color: "#07140F",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>signé</span>
                  )}
                </div>
                {mandateFile ? (
                  <>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: "var(--fg-1)" }}>{mandateFile.name}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 3 }}>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>{mandateFile.size}</span> · attaché par {mandateFile.by} · {mandateFile.ts}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: "var(--fg-1)" }}>Mandat manquant · à régulariser auprès du client.</div>
                )}
              </div>
              {mandateFile && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{
                    fontSize: 11.5, padding: "6px 12px", borderRadius: 4, cursor: "pointer",
                    background: "var(--surface-2)", color: "var(--fg-1)", border: "1px solid var(--border)",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}><i data-lucide="eye" style={{ width: 12, height: 12 }} />Voir</button>
                  <button style={{
                    fontSize: 11.5, padding: "6px 12px", borderRadius: 4, cursor: "pointer",
                    background: "var(--surface-2)", color: "var(--fg-1)", border: "1px solid var(--border)",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}><i data-lucide="download" style={{ width: 12, height: 12 }} />Télécharger</button>
                </div>
              )}
            </div>

            {/* Files attachés */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{
                padding: "12px 16px", borderBottom: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "var(--bg-elev-1)",
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Pièces attachées au dossier</span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>
                  {dossier.files?.length || 0} fichier{(dossier.files?.length || 0) > 1 ? "s" : ""}
                </span>
              </div>
              {(dossier.files || []).filter(f => f.pieceId !== "mandate").length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--fg-3)", fontSize: 12 }}>
                  Aucune pièce opérationnelle attachée · seul le mandat est présent.
                </div>
              ) : (
                (dossier.files || []).filter(f => f.pieceId !== "mandate").map(f => {
                  const piece = window.DOC_PIECES.find(p => p.id === f.pieceId);
                  return (
                    <div key={f.id} style={{
                      display: "grid", gridTemplateColumns: "28px 1fr auto auto auto",
                      gap: 14, padding: "12px 16px", alignItems: "center",
                      borderBottom: "1px solid var(--border)",
                    }}>
                      <div style={{
                        width: 26, height: 30, borderRadius: 3,
                        background: "var(--surface-2)", border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "IBM Plex Mono, monospace", fontSize: 8, fontWeight: 600,
                        color: "var(--fg-3)", letterSpacing: "0.04em",
                      }}>{f.ext?.toUpperCase()}</div>
                      <div>
                        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-1)" }}>{f.name}</div>
                        <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 2 }}>
                          {piece?.label} · par {f.by} · {f.ts}
                        </div>
                      </div>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, color: "var(--fg-3)" }}>{f.size}</span>
                      <button style={{
                        fontSize: 11, padding: "4px 9px", borderRadius: 4, cursor: "pointer",
                        background: "transparent", color: "var(--fg-2)", border: "1px solid var(--border)",
                      }}>Voir</button>
                      <button style={{
                        fontSize: 11, padding: "4px 9px", borderRadius: 4, cursor: "pointer",
                        background: "transparent", color: "var(--fg-2)", border: "1px solid var(--border)",
                      }}>↓</button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Tree canonique */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{
                padding: "12px 16px", borderBottom: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "var(--bg-elev-1)",
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Arbre documentaire canonique</span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>
                  {Object.values(states).filter(s => s === "ok").length} / {window.DOC_PIECES.length} reçues
                </span>
              </div>
              {window.DOC_PIECES.map(p => (
                <DocPieceRow
                  key={p.id}
                  pieceId={p.id}
                  label={p.label}
                  actor={p.actor}
                  state={states[p.id]}
                  sub={DocSubLabel(p.id, dossier) || (fileByPiece[p.id]?.name)}
                />
              ))}
            </div>

            {/* Réclamations liées au dossier */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{
                padding: "12px 16px", borderBottom: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "var(--bg-elev-1)",
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--fg-1)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <i data-lucide="message-square-warning" style={{ width: 13, height: 13, color: "var(--accent)" }} />
                  Réclamations liées au dossier
                </span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>
                  {relatedClaims.length} claim{relatedClaims.length > 1 ? "s" : ""}
                </span>
              </div>
              {relatedClaims.length === 0 ? (
                <div style={{ padding: "24px 18px", fontSize: 12, color: "var(--fg-3)", textAlign: "center" }}>
                  Aucune réclamation sur ce dossier · client serein.
                </div>
              ) : (
                relatedClaims.map(c => {
                  const sevC = (window.SEVERITE_COLORS || {})[c.severite] || { fg: "var(--fg-2)", bg: "var(--surface-2)" };
                  const etpC = (window.CLAIM_ETAPES || {})[c.etape] || { fg: "var(--fg-2)", bg: "var(--surface-2)" };
                  return (
                    <div key={c.ref} style={{
                      display: "grid", gridTemplateColumns: "110px 100px 90px 1fr auto",
                      gap: 14, padding: "12px 16px", alignItems: "center",
                      borderBottom: "1px solid var(--border)",
                    }}>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>{c.ref}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 500, padding: "2px 7px", borderRadius: 2, background: "var(--surface-2)", color: "var(--fg-2)", border: "1px solid var(--border)", justifySelf: "start" }}>{c.type}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 2, background: sevC.bg, color: sevC.fg, textTransform: "capitalize", justifySelf: "start" }}>{c.severite}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 2, background: etpC.bg, color: etpC.fg, justifySelf: "start" }}>{c.etape}</span>
                      <button style={{
                        fontSize: 11, padding: "4px 9px", borderRadius: 4, cursor: "pointer",
                        background: "transparent", color: "var(--fg-2)", border: "1px solid var(--border)",
                        display: "inline-flex", alignItems: "center", gap: 5,
                      }}>
                        Voir <i data-lucide="arrow-up-right" style={{ width: 10, height: 10 }} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* References */}
            <div style={{
              padding: "14px 16px",
              background: "var(--bg-elev-1)", border: "1px solid var(--border)", borderRadius: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-1)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Références utiles</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {[
                  { label: "Tarif 2026 · filtré sur HS du dossier", icon: "book-open" },
                  { label: "Règles du régime · mode " + dossier.mode, icon: "scale" },
                  { label: "SOP PL applicable au mode " + dossier.mode, icon: "file-text" },
                  { label: "Historique d'erreurs · " + dossier.client, icon: "history" },
                ].map(r => (
                  <div key={r.label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 0",
                    fontSize: 12, color: "var(--fg-2)", cursor: "pointer",
                  }}>
                    <i data-lucide={r.icon} style={{ width: 13, height: 13, color: "var(--accent)" }} />
                    <span>{r.label}</span>
                    <i data-lucide="external-link" style={{ width: 11, height: 11, color: "var(--fg-mute)", marginLeft: "auto" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============== SCORES ==============
function Scores() {
  const statusDot = (s) => ({
    ok:   { bg: "var(--ok)",   label: "Conforme" },
    warn: { bg: "var(--warn)", label: "À surveiller" },
    red:  { bg: "var(--err)",  label: "Alerte" },
  }[s] || { bg: "var(--fg-mute)", label: "—" });

  const primary = KPIS.filter(k => k.primary);
  const secondary = KPIS.filter(k => !k.primary);

  const Row = ({ k, hero }) => {
    const s = statusDot(k.status);
    return (
      <div style={{
        display: "grid", gridTemplateColumns: hero ? "100px 1fr 140px 120px 160px" : "100px 1fr 120px 120px 160px",
        gap: 14, padding: hero ? "20px 18px" : "14px 18px", alignItems: "center",
        borderBottom: "1px solid var(--border)",
        background: hero ? "color-mix(in srgb, var(--accent) 4%, transparent)" : "transparent",
      }}>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11.5, color: hero ? "var(--accent)" : "var(--fg-3)", fontWeight: 600 }}>{k.code}</span>
        <div>
          <div style={{ fontSize: hero ? 14 : 13, color: "var(--fg-1)", fontWeight: hero ? 600 : 400 }}>{k.label}</div>
          {k.hint && <div style={{ fontSize: 10.5, color: "var(--fg-mute)", marginTop: 3 }}>{k.hint}</div>}
        </div>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: hero ? 22 : 14, fontWeight: 500, color: "var(--fg-1)", textAlign: "right" }}>{k.actual}</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-3)", textAlign: "right" }}>{k.target}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, color: "var(--fg-2)" }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: s.bg, boxShadow: `0 0 0 3px color-mix(in srgb, ${s.bg} 18%, transparent)` }} />
          {s.label} · <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-3)" }}>{k.ecart}</span>
        </span>
      </div>
    );
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)" }}>Scores Lalatiana</div>
        <div style={{ fontSize: 12, color: "var(--fg-3)" }}>{primary.length} KPI primaires (P3 dominant · pulse réclamations) · {secondary.length} KPI secondaires.</div>
      </div>

      {/* Primary */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>KPI primaires</div>
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--accent)", borderRadius: 12, overflow: "hidden" }}>
          {primary.map(k => <Row key={k.code} k={k} hero />)}
        </div>
      </div>

      {/* Secondary */}
      <div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 600, marginBottom: 8 }}>KPI secondaires · dossiers & process</div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {secondary.map(k => <Row key={k.code} k={k} />)}
        </div>
      </div>
    </div>
  );
}

// ============== CARNET DE BORD ==============
const CAT_COLORS = {
  "Ouverture":      { bg: "var(--accent-soft)", fg: "var(--accent)" },
  "Cotation":       { bg: "color-mix(in srgb, #5BB8C7 14%, transparent)", fg: "#5BB8C7" },
  "Relance":        { bg: "var(--warn-soft)", fg: "var(--warn)" },
  "Escalade":       { bg: "var(--err-soft)",  fg: "var(--err)" },
  "Accusé":         { bg: "color-mix(in srgb, var(--ok) 14%, transparent)", fg: "var(--ok)" },
  "Investigation":  { bg: "color-mix(in srgb, #5BB8C7 14%, transparent)", fg: "#5BB8C7" },
  "Proposition":    { bg: "var(--accent-soft)", fg: "var(--accent)" },
  "Clôture":        { bg: "color-mix(in srgb, var(--ok) 12%, transparent)", fg: "var(--ok)" },
  "Escalade claim": { bg: "var(--err-soft)",  fg: "var(--err)" },
  "Note":           { bg: "var(--surface-2)", fg: "var(--fg-2)" },
};

const otherUseState = React.useState;

function Carnet({ items }) {
  const [filter, setFilter] = otherUseState("Tous");
  const cats = window.CARNET_CATEGORIES || ["Tous"];
  const filtered = filter === "Tous" ? items : items.filter(it => it.cat === filter);

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)" }}>Carnet de bord</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)" }}>
            {filtered.length} entrée{filtered.length > 1 ? "s" : ""}
            {filter !== "Tous" ? <> · filtre <span style={{ color: "var(--accent)", fontWeight: 500 }}>{filter}</span></> : null}
            · ordre chronologique inverse.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {cats.map(c => {
            const on = filter === c;
            const cc = c !== "Tous" ? (CAT_COLORS[c] || CAT_COLORS["Note"]) : null;
            return (
              <button key={c} onClick={() => setFilter(c)} style={{
                fontSize: 11, fontWeight: 500, letterSpacing: 0,
                padding: "5px 10px", borderRadius: 4, cursor: "pointer",
                background: on ? (cc ? cc.bg : "var(--accent-soft)") : "var(--surface)",
                color: on ? (cc ? cc.fg : "var(--accent)") : "var(--fg-2)",
                border: `1px solid ${on ? (cc ? cc.fg : "var(--accent)") : "var(--border)"}`,
              }}>
                {c}
                <span style={{
                  marginLeft: 6, fontFamily: "IBM Plex Mono, monospace", fontSize: 9.5,
                  opacity: 0.7,
                }}>
                  {c === "Tous" ? items.length : items.filter(it => it.cat === c).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--fg-3)", fontSize: 12 }}>
            Aucune entrée pour ce filtre.
          </div>
        ) : filtered.map((it, i) => {
          const c = CAT_COLORS[it.cat] || CAT_COLORS["Note"];
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "130px 140px 120px 1fr 110px",
              gap: 14, padding: "14px 18px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11.5, color: "var(--fg-3)" }}>{it.ts}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 2,
                letterSpacing: "0.08em", textTransform: "uppercase",
                background: c.bg, color: c.fg, justifySelf: "start",
              }}>{it.cat}</span>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-1)" }}>{it.ref}</span>
              <span style={{ fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.4 }}>{it.text}</span>
              <span style={{ fontSize: 11.5, color: "var(--fg-3)", textAlign: "right" }}>{it.owner}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============== PROFIL ==============
function Profil() {
  return (
    <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 980 }}>
      <div style={{ padding: 22, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 999,
            background: "var(--accent-soft)", color: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 600, fontFamily: "IBM Plex Mono, monospace",
          }}>LL</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "var(--fg-1)" }}>Lalatiana</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)" }}>CS Supervisor · Transit · Premium Logistics</div>
          </div>
          <span style={{
            marginLeft: "auto",
            fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 700,
            padding: "3px 7px", borderRadius: 2, letterSpacing: "0.08em",
            background: "var(--accent-soft)", color: "var(--accent)",
          }}>N3</span>
        </div>
        {[
          ["Rattachement", "Tudi · Resp Transit (N3)"],
          ["Scope",        "Dossiers clients · cotations · disputes · escalades"],
          ["Pilier dominant", "P3 · Fidélité & diversification client"],
          ["Périmètre clients", "10 comptes actifs (allow-list)"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "140px 1fr", padding: "10px 0", borderTop: "1px dashed var(--border)" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 500 }}>{k}</span>
            <span style={{ fontSize: 13, color: "var(--fg-1)" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: 22, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)", marginBottom: 14 }}>Drill-up</div>
        <div style={{
          display: "flex", gap: 14, alignItems: "center", padding: "12px 14px",
          borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-elev-1)",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 999,
            background: "var(--surface-2)", color: "var(--fg-1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, fontFamily: "IBM Plex Mono, monospace",
          }}>TD</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>Tudi · Resp Transit</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>Manager direct · arbitre les escalades</div>
          </div>
          <i data-lucide="arrow-up-right" style={{ width: 14, height: 14, color: "var(--accent)" }} />
        </div>
      </div>
    </div>
  );
}

window.Documentation = Documentation;
window.Scores = Scores;
window.Carnet = Carnet;
window.Profil = Profil;
