/* global React, AfIcon */
// ════════════════════════════════════════════════════════════════
// LOI · Ketsiah CFO — Modale DDV (Valider · Refuser · Renvoyer Haja)
// WRITES_LIVE=false · trace M13 simulée.
// ════════════════════════════════════════════════════════════════
const { useState: useStateK, useEffect: useEffectK } = React;

function DdvValidateModal({ open, onClose, ddv, onAction }) {
  const [choice, setChoice]   = useStateK("valider");
  const [motif, setMotif]     = useStateK("");
  const [comment, setComment] = useStateK("");

  useEffectK(() => {
    if (open) {
      setChoice("valider"); setMotif(""); setComment("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !ddv) return null;

  const submit = () => {
    if (choice === "refuser" && motif.trim().length < 4) return;
    onAction({ choice, motif: motif.trim(), comment: comment.trim() });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "color-mix(in srgb, var(--pl-navy-deep) 70%, transparent)",
        backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 24,
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(640px, 100%)", maxHeight: "92vh", overflow: "auto",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 14, boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
          display: "flex", flexDirection: "column",
        }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
          background: "linear-gradient(135deg, var(--pl-navy) 0%, var(--pl-navy-deep) 100%)",
          color: "var(--pl-cream)", borderRadius: "14px 14px 0 0",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14,
        }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--pl-teal-light)", fontWeight: 700, marginBottom: 6 }}>DDV · seuil CFO · décision requise</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.015em" }}>{ddv.ref} · {ddv.fournisseur}</div>
            <div style={{ fontSize: 13, marginTop: 6, color: "color-mix(in srgb, var(--pl-cream) 75%, transparent)" }}>{ddv.nature}</div>
          </div>
          <button onClick={onClose}
            style={{ background: "transparent", border: "1px solid color-mix(in srgb, var(--pl-cream) 20%, transparent)", color: "var(--pl-cream)", borderRadius: 8, padding: 6, cursor: "pointer" }}>
            <AfIcon name="x" size={16}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Récap */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Tile label="Montant"        value={ddv.montant}  mono accent/>
            <Tile label="Niveau matrice" value={ddv.niveau}   tone="err"/>
            <Tile label="Demandeur"      value={ddv.demandeur}/>
            <Tile label="Département"    value={ddv.dept}/>
            <Tile label="SLA"            value={ddv.sla}      tone={ddv.slaTone}/>
            <Tile label="Cause threshold" value={ddv.cross}   tone="warn"/>
          </div>

          {/* Choix */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 8 }}>Décision *</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              <ChoiceBtn id="valider" active={choice === "valider"} onClick={() => setChoice("valider")}
                bg="var(--ok)" fg="white" label="Valider" icon="check"/>
              <ChoiceBtn id="refuser" active={choice === "refuser"} onClick={() => setChoice("refuser")}
                bg="var(--err)" fg="white" label="Refuser (motif)" icon="x"/>
              <ChoiceBtn id="renvoyer" active={choice === "renvoyer"} onClick={() => setChoice("renvoyer")}
                bg="var(--pl-navy)" fg="var(--pl-cream)" label="Renvoyer Haja" icon="arrow-right"/>
            </div>
          </div>

          {choice === "refuser" && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 6 }}>Motif de refus *</div>
              <textarea value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Motif court · transmis à Haja + tracé M13"
                style={{
                  width: "100%", boxSizing: "border-box", minHeight: 72,
                  background: "var(--bg-elev-1)", color: "var(--fg-1)",
                  border: `1px solid ${motif.trim().length < 4 && motif.length ? "var(--err)" : "var(--border)"}`,
                  borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none", resize: "vertical",
                }}/>
            </div>
          )}

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 6 }}>Commentaire (optionnel)</div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Note pour Haja ou trace décision"
              style={{
                width: "100%", boxSizing: "border-box", minHeight: 60,
                background: "var(--bg-elev-1)", color: "var(--fg-1)",
                border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px",
                fontSize: 14, fontFamily: "var(--font-sans)", outline: "none", resize: "vertical",
              }}/>
          </div>

          <div style={{
            padding: "10px 14px", borderRadius: 8,
            background: "color-mix(in srgb, var(--warn) 10%, var(--bg-elev-1))",
            border: "1px dashed color-mix(in srgb, var(--warn) 30%, var(--border))",
            color: "var(--warn)", fontSize: 12, display: "flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.04em",
          }}>
            <AfIcon name="info" size={14}/> WRITES_LIVE=false · simulation · trace M13 horodatée
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px", borderTop: "1px solid var(--border)",
          background: "var(--bg-elev-1)", borderRadius: "0 0 14px 14px",
          display: "flex", justifyContent: "flex-end", gap: 10,
        }}>
          <button onClick={onClose}
            style={{ padding: "10px 18px", borderRadius: 8, background: "transparent", border: "1px solid var(--border)", color: "var(--fg-2)", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Annuler
          </button>
          <button onClick={submit}
            disabled={choice === "refuser" && motif.trim().length < 4}
            style={{
              padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
              background: choice === "valider" ? "var(--ok)" : choice === "refuser" ? "var(--err)" : "var(--pl-navy)",
              color: choice === "renvoyer" ? "var(--pl-cream)" : "white",
              opacity: (choice === "refuser" && motif.trim().length < 4) ? 0.5 : 1,
            }}>
            Confirmer · trace M13
          </button>
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, mono, tone, accent }) {
  const c = tone === "err"  ? "var(--err)"
          : tone === "warn" ? "var(--warn)"
          : tone === "ok"   ? "var(--ok)"
          : accent           ? "var(--accent)"
          : "var(--fg-1)";
  return (
    <div style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, color: c, fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)", letterSpacing: mono ? "-0.015em" : 0 }}>{value}</div>
    </div>
  );
}

function ChoiceBtn({ active, onClick, bg, fg, label, icon }) {
  return (
    <button onClick={onClick}
      style={{
        padding: "12px 10px", borderRadius: 8, cursor: "pointer",
        border: active ? `1px solid ${bg}` : "1px solid var(--border)",
        background: active ? bg : "var(--bg-elev-1)",
        color: active ? fg : "var(--fg-2)",
        fontSize: 13, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 120ms",
      }}>
      <AfIcon name={icon} size={14}/> {label}
    </button>
  );
}

window.DdvValidateModal = DdvValidateModal;
