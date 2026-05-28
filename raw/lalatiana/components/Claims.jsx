/* global React, Dialog, FormSection, Field, TextInput, TextArea, Select, Radio, PrimaryBtn, GhostBtn, DangerBtn, CLAIM_ETAPES, SEVERITE_COLORS, CLAIM_PRIORITY, CLAIM_TYPES */
const { useState: clmUseState, useMemo: clmUseMemo } = React;

// ───────── CHIPS ─────────
function ClaimTypeChip({ type }) {
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 500, padding: "2px 7px", borderRadius: 2,
      background: "var(--surface-2)", color: "var(--fg-2)",
      border: "1px solid var(--border)",
      letterSpacing: 0, whiteSpace: "nowrap",
    }}>{type}</span>
  );
}
function ClaimSeveriteChip({ s }) {
  const c = SEVERITE_COLORS[s] || { fg: "var(--fg-2)", bg: "var(--surface-2)" };
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 2,
      background: c.bg, color: c.fg, textTransform: "capitalize", letterSpacing: 0,
    }}>{s}</span>
  );
}
function ClaimEtapeChip({ etape }) {
  const c = CLAIM_ETAPES[etape] || { fg: "var(--fg-2)", bg: "var(--surface-2)" };
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 500, padding: "3px 8px", borderRadius: 2,
      background: c.bg, color: c.fg, whiteSpace: "nowrap", letterSpacing: 0,
    }}>{etape}</span>
  );
}

function SlaPill({ sla, label, target }) {
  if (!sla) return <span style={{ fontSize: 10.5, color: "var(--fg-mute)" }}>—</span>;
  const fg = sla.ok ? "var(--ok)" : "var(--err)";
  const bg = sla.ok ? "color-mix(in srgb, var(--ok) 12%, transparent)" : "color-mix(in srgb, var(--err) 14%, transparent)";
  const hours = sla.hours !== undefined
    ? (sla.hours < 1 ? `${Math.round(sla.hours * 60)} min` : `${sla.hours}h`.replace(".", ","))
    : `${sla.hours || 0}h`;
  const text = sla.total
    ? `${sla.hours}h${sla.total ? ` / ${sla.total}h` : ""}`
    : hours;
  return (
    <span title={`${label} · cible ${target}`} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, fontWeight: 500,
      padding: "2px 7px", borderRadius: 2,
      background: bg, color: fg, letterSpacing: 0, whiteSpace: "nowrap",
    }}>
      <i data-lucide={sla.ok ? "clock" : "alarm-clock-off"} style={{ width: 10, height: 10 }} />
      {text}
    </span>
  );
}

// Action contextuelle par étape
function nextActionFor(claim) {
  if (claim.closed) return null;
  if (claim.etape === "Reçue · accusé pending") return { key: "accuser",  label: "Accuser réception", tone: "primary" };
  if (claim.etape === "Accusée")                 return { key: "investiguer", label: "Investiguer",  tone: "primary" };
  if (claim.etape === "Investigation")           return { key: "proposer", label: "Proposer résolution", tone: "primary" };
  if (claim.etape === "Proposition envoyée")     return { key: "cloturer", label: "Clôturer",         tone: "primary" };
  if (claim.etape === "Escaladée Tudi")          return { key: "cloturer", label: "Clôturer",         tone: "ghost" };
  return null;
}

// ============== LIST BLOC ==============
function ClaimsBloc({ claims, onAction }) {
  const sorted = clmUseMemo(() => [...claims].sort((a, b) => {
    if (a.closed !== b.closed) return a.closed ? 1 : -1;
    const pa = CLAIM_PRIORITY[a.etape] ?? 99;
    const pb = CLAIM_PRIORITY[b.etape] ?? 99;
    if (pa !== pb) return pa - pb;
    if (a.severite !== b.severite) {
      const order = { rouge: 0, orange: 1, vert: 2 };
      return (order[a.severite] || 9) - (order[b.severite] || 9);
    }
    return 0;
  }), [claims]);

  const slaDepasse = claims.filter(c => !c.closed && (
    (c.slaAccuse && !c.slaAccuse.ok) || (c.slaReponse && !c.slaReponse.ok)
  )).length;
  const openCount = claims.filter(c => !c.closed).length;

  const cellPad = "12px 14px";
  const headerCell = {
    fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
    color: "var(--fg-3)", fontWeight: 600, padding: cellPad,
    textAlign: "left", background: "var(--bg-elev-1)",
    borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
  };

  return (
    <div style={{
      padding: 24, marginBottom: 18,
      background: "var(--surface)",
      border: "1.5px solid var(--accent)",
      borderRadius: 12,
      boxShadow: "0 0 0 4px color-mix(in srgb, var(--accent) 8%, transparent)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <i data-lucide="message-square-warning" style={{ width: 16, height: 16, color: "var(--accent)" }} />
            <span style={{ fontSize: 17, fontWeight: 600, color: "var(--fg-1)" }}>Mes réclamations clients</span>
            <span style={{
              fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
              padding: "2px 7px", borderRadius: 2, letterSpacing: "0.08em",
              background: "var(--accent)", color: "var(--accent-fg)", textTransform: "uppercase",
            }}>Pulse</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-3)" }}>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-1)" }}>{openCount}</span> ouvertes
            {slaDepasse > 0 && (
              <> · <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--err)" }}>{slaDepasse}</span> SLA dépassé</>
            )}
          </div>
        </div>
        <span style={{ fontSize: 11, color: "var(--fg-mute)" }}>Tri · accusé pending et escalades en tête</span>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
          <thead>
            <tr>
              <th style={headerCell}>N° claim</th>
              <th style={headerCell}>Client · dossier</th>
              <th style={headerCell}>Type</th>
              <th style={headerCell}>Sév.</th>
              <th style={headerCell}>Étape</th>
              <th style={headerCell}>SLA accusé</th>
              <th style={headerCell}>SLA réponse</th>
              <th style={headerCell}>Owner aval</th>
              <th style={{ ...headerCell, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(c => {
              const action = nextActionFor(c);
              return (
                <tr key={c.ref} style={{
                  borderBottom: "1px solid var(--border)",
                  background: c.closed ? "color-mix(in srgb, var(--fg-3) 5%, transparent)" : "transparent",
                  opacity: c.closed ? 0.65 : 1,
                }}>
                  <td style={{ padding: cellPad, fontFamily: "IBM Plex Mono, monospace", fontSize: 12.5, fontWeight: 500, color: "var(--fg-1)" }}>{c.ref}</td>
                  <td style={{ padding: cellPad, fontSize: 12, color: "var(--fg-2)" }}>
                    <div style={{ color: "var(--fg-1)", fontSize: 12.5 }}>{c.client}</div>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, color: "var(--accent)", marginTop: 2 }}>{c.dossier}</div>
                  </td>
                  <td style={{ padding: cellPad }}><ClaimTypeChip type={c.type} /></td>
                  <td style={{ padding: cellPad }}><ClaimSeveriteChip s={c.severite} /></td>
                  <td style={{ padding: cellPad }}><ClaimEtapeChip etape={c.etape} /></td>
                  <td style={{ padding: cellPad }}><SlaPill sla={c.slaAccuse} label="Accusé" target="< 2h" /></td>
                  <td style={{ padding: cellPad }}><SlaPill sla={c.slaReponse} label="Réponse" target="< 48h" /></td>
                  <td style={{ padding: cellPad, fontSize: 12, color: "var(--fg-2)", whiteSpace: "nowrap" }}>{c.ownerAval}</td>
                  <td style={{ padding: cellPad, textAlign: "right", whiteSpace: "nowrap" }}>
                    {action ? (
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button onClick={() => onAction(c, action.key)} style={{
                          fontSize: 11.5, fontWeight: 600,
                          padding: "5px 11px", borderRadius: 4, cursor: "pointer",
                          background: action.tone === "ghost" ? "transparent" : "var(--accent)",
                          color: action.tone === "ghost" ? "var(--fg-2)" : "var(--accent-fg)",
                          border: action.tone === "ghost" ? "1px solid var(--border)" : "1px solid var(--accent)",
                          whiteSpace: "nowrap",
                        }}>{action.label}</button>
                        {c.etape !== "Escaladée Tudi" && (
                          <button onClick={() => onAction(c, "escalader")} title="Escalader Tudi" style={{
                            fontSize: 11, padding: "5px 8px", borderRadius: 4, cursor: "pointer",
                            background: "color-mix(in srgb, var(--warn) 12%, transparent)",
                            color: "var(--warn)",
                            border: "1px solid color-mix(in srgb, var(--warn) 40%, transparent)",
                          }}>
                            <i data-lucide="alert-triangle" style={{ width: 11, height: 11 }} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: "var(--fg-mute)", fontSize: 12 }}>clôturée</span>
                    )}
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

// ============== 5 DIALOGS ==============

// 1. Accuser réception
function AccuserDialog({ open, onClose, claim, onSubmit }) {
  const [canal, setCanal] = clmUseState("email");
  const [tpl, setTpl] = clmUseState("");
  React.useEffect(() => {
    if (!claim) return;
    setTpl(`Bonjour, nous accusons réception de votre réclamation référencée ${claim.ref} portant sur le dossier ${claim.dossier} (${claim.type}). Notre équipe l'étudie immédiatement et reviendra vers vous sous 48h.`);
  }, [claim?.ref]);
  if (!claim) return null;
  return (
    <Dialog open={open} onClose={onClose}
      title="Accuser réception"
      sub={`Claim ${claim.ref} · ${claim.client} · SLA cible < 2h`}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn icon="send" onClick={() => { onSubmit({ canal }); onClose(); }}>Envoyer l'accusé</PrimaryBtn>
      </>}
    >
      <FormSection tag="A" title="Canal de l'accusé">
        <Radio name="cnl" value={canal} onChange={setCanal} options={["email", "téléphone"]} />
      </FormSection>
      <FormSection tag="B" title="Template prérempli" hint="éditable">
        <TextArea value={tpl} onChange={(e) => setTpl(e.target.value)} rows={5} />
      </FormSection>
    </Dialog>
  );
}

// 2. Investiguer
function InvestiguerDialog({ open, onClose, claim, onSubmit }) {
  const [dept, setDept] = clmUseState("Facturation");
  const [motif, setMotif] = clmUseState("");
  const [delai, setDelai] = clmUseState("48h");
  if (!claim) return null;
  return (
    <Dialog open={open} onClose={onClose}
      title="Investiguer · assigner un département"
      sub={`Claim ${claim.ref} · ${claim.client} · dossier ${claim.dossier}`}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn icon="search" onClick={() => { if (!motif) return; onSubmit({ dept, motif, delai }); onClose(); }}>Lancer l'investigation</PrimaryBtn>
      </>}
    >
      <FormSection tag="A" title="Département assigné">
        <Select value={dept} onChange={setDept} options={["Facturation", "Déclarante", "Bernardin (terrain)", "Mohamed BAD", "Ando", "Tudi"]} />
      </FormSection>
      <FormSection tag="B" title="Motif d'investigation" hint="obligatoire">
        <TextArea value={motif} onChange={(e) => setMotif(e.target.value)} rows={4} placeholder="Décrire ce qui doit être vérifié, les pièces à comparer, l'historique pertinent…" />
      </FormSection>
      <FormSection tag="C" title="Délai retour demandé">
        <Select value={delai} onChange={setDelai} options={["24h", "48h", "72h", "1 semaine"]} />
      </FormSection>
    </Dialog>
  );
}

// 3. Proposer résolution
function ProposerDialog({ open, onClose, claim, onSubmit }) {
  const [typeProp, setTypeProp] = clmUseState("avoir");
  const [texte, setTexte] = clmUseState("");
  const [impact, setImpact] = clmUseState("");
  if (!claim) return null;
  return (
    <Dialog open={open} onClose={onClose}
      title="Proposer une résolution"
      sub={`Claim ${claim.ref} · ${claim.client}`}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn icon="send-horizontal" onClick={() => { if (!texte) return; onSubmit({ typeProp, texte, impact }); onClose(); }}>Envoyer la proposition</PrimaryBtn>
      </>}
    >
      <FormSection tag="A" title="Type de proposition">
        <Radio name="tp" value={typeProp} onChange={setTypeProp} options={[
          { value: "avoir",     label: "Avoir financier" },
          { value: "correction",label: "Correction" },
          { value: "refus",     label: "Refus motivé" },
          { value: "arbitrage", label: "Arbitrage Tudi" },
        ]} />
      </FormSection>
      <FormSection tag="B" title="Texte de la proposition" hint="adressé au client">
        <TextArea value={texte} onChange={(e) => setTexte(e.target.value)} rows={5} placeholder="Détail de la résolution proposée…" />
      </FormSection>
      {(typeProp === "avoir" || typeProp === "correction") && (
        <FormSection tag="C" title="Impact financier" hint="MGA · optionnel">
          <div style={{ position: "relative" }}>
            <TextInput value={impact} onChange={(e) => setImpact(e.target.value)} placeholder="ex. 1 200 000" style={{ paddingRight: 50, fontFamily: "IBM Plex Mono, monospace" }} />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>MGA</span>
          </div>
        </FormSection>
      )}
    </Dialog>
  );
}

// 4. Clôturer
function CloturerDialog({ open, onClose, claim, onSubmit }) {
  const [issue, setIssue] = clmUseState("acceptée");
  const [note, setNote] = clmUseState("");
  if (!claim) return null;
  return (
    <Dialog open={open} onClose={onClose}
      title="Clôturer la réclamation"
      sub={`Claim ${claim.ref} · ${claim.client}`}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn icon="check-circle-2" onClick={() => { onSubmit({ issue, note }); onClose(); }}>Clôturer</PrimaryBtn>
      </>}
    >
      <FormSection tag="A" title="Issue">
        <Radio name="iss" value={issue} onChange={setIssue} options={[
          { value: "acceptée", label: "Acceptée par client" },
          { value: "refusée",  label: "Refusée par client" },
          { value: "arbitrage",label: "Arbitrage Tudi" },
        ]} />
      </FormSection>
      <FormSection tag="B" title="Note de clôture">
        <TextArea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Décision finale, montant retenu, leçon apprise…" />
      </FormSection>
    </Dialog>
  );
}

// 5. Escalader Tudi
function EscaladerClaimDialog({ open, onClose, claim, onSubmit }) {
  const [motif, setMotif] = clmUseState("");
  const [urgence, setUrgence] = clmUseState("orange");
  if (!claim) return null;
  return (
    <Dialog open={open} onClose={onClose}
      title="Escalader la réclamation à Tudi"
      sub={`Claim ${claim.ref} · ${claim.client} · ${claim.type}`}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn icon="alert-triangle" style={{ background: "var(--warn)", borderColor: "var(--warn)", color: "#1a0f00" }} onClick={() => { if (!motif) return; onSubmit({ motif, urgence }); onClose(); }}>Escalader à Tudi</PrimaryBtn>
      </>}
    >
      <FormSection tag="A" title="Motif d'escalade" hint="obligatoire">
        <TextArea value={motif} onChange={(e) => setMotif(e.target.value)} rows={4} placeholder="Pourquoi cette réclamation nécessite un arbitrage Tudi…" />
      </FormSection>
      <FormSection tag="B" title="Urgence">
        <Radio name="urg" value={urgence} onChange={setUrgence} options={[
          { value: "vert",   label: "Vert · à surveiller" },
          { value: "orange", label: "Orange · sous 24 h" },
          { value: "rouge",  label: "Rouge · immédiat" },
        ]} />
      </FormSection>
    </Dialog>
  );
}

Object.assign(window, {
  ClaimsBloc, ClaimTypeChip, ClaimSeveriteChip, ClaimEtapeChip,
  AccuserDialog, InvestiguerDialog, ProposerDialog, CloturerDialog, EscaladerClaimDialog,
});
