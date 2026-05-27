/* global React, AfIcon */
// ════════════════════════════════════════════════════════════════
// LOI · Admin-Fi — Modales D82
// 4 modales formulaires : DDV / Facture / Déclaration / STC
// Validation visuelle, bouton Soumettre, état succès.
// FR métier · zéro invention · « À CONFIRMER » par défaut.
// ════════════════════════════════════════════════════════════════
const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Primitifs de formulaire — D82
// ─────────────────────────────────────────────────────────────
function Field({ label, required, hint, children, span = 6, error }) {
  return (
    <div style={{ gridColumn: `span ${span}`, display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 6,
      }}>
        {label}
        {required && <span style={{ color: "var(--err)", letterSpacing: 0 }}>*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{hint}</div>}
      {error && (
        <div style={{ fontSize: 11, color: "var(--err)", display: "flex", alignItems: "center", gap: 4 }}>
          <AfIcon name="alert" size={12} /> {error}
        </div>
      )}
    </div>
  );
}

const inputBase = {
  width: "100%", boxSizing: "border-box",
  background: "var(--surface)", color: "var(--fg-1)",
  border: "1px solid var(--border)", borderRadius: 6,
  padding: "10px 12px", fontSize: 13, fontFamily: "var(--font-sans)",
  outline: "none", transition: "border-color 120ms, box-shadow 120ms",
};
function Input({ mono, error, ...props }) {
  const ref = useRef(null);
  return (
    <input
      ref={ref}
      {...props}
      style={{
        ...inputBase,
        fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
        fontVariantNumeric: mono ? "tabular-nums" : "normal",
        borderColor: error ? "var(--err)" : "var(--border)",
        ...(props.style || {}),
      }}
      onFocus={(e) => { e.target.style.borderColor = error ? "var(--err)" : "var(--accent)"; e.target.style.boxShadow = "var(--focus-ring)"; props.onFocus && props.onFocus(e); }}
      onBlur={(e)  => { e.target.style.borderColor = error ? "var(--err)" : "var(--border)"; e.target.style.boxShadow = "none"; props.onBlur && props.onBlur(e); }}
    />
  );
}
function Textarea(props) {
  return (
    <textarea
      {...props}
      style={{ ...inputBase, resize: "vertical", minHeight: 92, lineHeight: 1.5, ...(props.style || {}) }}
      onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "var(--focus-ring)"; }}
      onBlur={(e)  => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
    />
  );
}
function Select({ value, onChange, options, placeholder }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputBase, appearance: "none", paddingRight: 32, cursor: "pointer",
          color: value ? "var(--fg-1)" : "var(--fg-3)",
        }}
        onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "var(--focus-ring)"; }}
        onBlur={(e)  => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
      >
        <option value="" disabled>{placeholder || "Sélectionner…"}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--fg-3)" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  );
}
function SegControl({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 6, padding: 2, background: "var(--bg-elev-1)" }}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{
              padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 4,
              background: active ? "var(--accent)" : "transparent",
              color: active ? "var(--accent-fg)" : "var(--fg-2)",
              border: "none", cursor: "pointer", transition: "all 100ms",
              fontFamily: "var(--font-sans)", letterSpacing: "0.02em",
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Shell modal D82 (overlay + carte)
// ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, badge, subtitle, children, footer, width = 640, confidential }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(6, 24, 41, 0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "6vh 16px",
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: width, background: "var(--surface)",
          borderRadius: 12, border: "1px solid var(--border)",
          boxShadow: "0 24px 60px rgba(6,24,41,0.35), 0 2px 8px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", maxHeight: "88vh", overflow: "hidden",
          animation: "afModalIn 180ms cubic-bezier(.2,.7,.2,1)",
        }}>
        {/* Header */}
        <div style={{
          padding: "18px 22px 14px",
          borderBottom: "1px solid var(--border-soft)",
          background: confidential ? "color-mix(in srgb, var(--err) 6%, var(--surface))" : "var(--surface)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              {confidential
                ? <div style={{ width: 30, height: 30, borderRadius: 6, background: "var(--err-soft)", color: "var(--err)", display: "grid", placeItems: "center" }}><AfIcon name="lock" size={16}/></div>
                : <div style={{ width: 30, height: 30, borderRadius: 6, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}><AfIcon name="plus" size={16}/></div>}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)", margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
                  {badge}
                </div>
                {subtitle && <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{subtitle}</div>}
              </div>
            </div>
            <button onClick={onClose} aria-label="Fermer"
              style={{ width: 28, height: 28, borderRadius: 6, background: "transparent", border: "1px solid var(--border)", color: "var(--fg-2)", cursor: "pointer", display: "grid", placeItems: "center" }}>
              <AfIcon name="x" size={14}/>
            </button>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: "18px 22px", overflowY: "auto", flex: 1 }}>{children}</div>
        {/* Footer */}
        {footer && (
          <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border-soft)", background: "var(--bg-elev-1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Footer helper
function ModalFooter({ leftHint, onCancel, submitLabel, onSubmit, disabled, danger, busy }) {
  return (
    <>
      <div style={{ fontSize: 11, color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 6 }}>
        {leftHint}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={onCancel}
          style={{
            padding: "9px 16px", fontSize: 13, fontWeight: 500,
            background: "transparent", color: "var(--fg-2)",
            border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer",
          }}>
          Annuler
        </button>
        <button type="button" onClick={onSubmit} disabled={disabled || busy}
          style={{
            padding: "9px 18px", fontSize: 13, fontWeight: 600,
            background: disabled ? "color-mix(in srgb, var(--fg-3) 30%, transparent)" : (danger ? "var(--err)" : "var(--accent)"),
            color: disabled ? "var(--fg-3)" : "var(--accent-fg)",
            border: "none", borderRadius: 6,
            cursor: disabled ? "not-allowed" : "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
            opacity: busy ? 0.7 : 1,
          }}>
          {busy ? "Envoi…" : submitLabel}
          {!busy && <AfIcon name="arrow-right" size={14}/>}
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 1) Créer DDV (ref-001)
// ─────────────────────────────────────────────────────────────
const MODE_PAIEMENT = [
  { value: "appro_caisse", label: "Appro caisse" },
  { value: "especes",      label: "Espèces" },
  { value: "cheque",       label: "Chèque" },
  { value: "virement",     label: "Virement" },
];
const NATURE_MATRICE = [
  { value: "achat_fournitures", label: "Achat fournitures" },
  { value: "achat_materiel",    label: "Achat matériel" },
  { value: "appro_caisse",      label: "Appro caisse" },
  { value: "frais_transit",     label: "Frais transit" },
  { value: "frais_personnel",   label: "Frais personnel" },
  { value: "autres",            label: "Autres" },
];

function DDVModal({ open, onClose, onSubmit }) {
  const today = new Date().toISOString().slice(0, 10);
  const [serie, setSerie] = useState("");
  const [date, setDate] = useState(today);
  const [mode, setMode] = useState("");
  const [dateLivraison, setDateLivraison] = useState("");
  const [objet, setObjet] = useState("");
  const [nature, setNature] = useState("");
  const [montant, setMontant] = useState("");
  const [details, setDetails] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setSerie(""); setDate(today); setMode(""); setDateLivraison(""); setObjet("");
      setNature(""); setMontant(""); setDetails(""); setTouched(false);
    }
  }, [open]);

  const autoSerie = useMemo(() => `DDV-${(Date.now() % 1000000).toString().padStart(6, "0")}`, [open]);
  const livreOk = !!dateLivraison;
  const errDateLivraison = touched && !livreOk ? "Date livraison obligatoire" : "";
  const canSubmit = livreOk;

  return (
    <Modal
      open={open} onClose={onClose}
      title="Créer DDV — Demande de Validation"
      subtitle="Form-config ref-001 · valide via matrice V4 → Haja"
      badge={<span className="confirm-badge">ref-001</span>}
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="info" size={12}/> Trace M13 simulée · WRITES_LIVE=false</>}
          onCancel={onClose}
          submitLabel="Créer DDV"
          onSubmit={() => {
            setTouched(true);
            if (!canSubmit) return;
            onSubmit({
              numeroSerie: serie || autoSerie,
              date, modePaiement: mode || "virement",
              dateLivraison, objet, natureMatrice: nature || "autres",
              montantEstime: montant || "À CONFIRMER",
              details,
            });
          }}
          disabled={touched && !canSubmit}
        />
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        <Field label="N° série" span={6}>
          <Input value={serie} onChange={(e) => setSerie(e.target.value)} placeholder={autoSerie} mono />
        </Field>
        <Field label="Date demande" span={6}>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} mono />
        </Field>

        <Field label="Mode de paiement" span={6}>
          <Select value={mode} onChange={setMode} options={MODE_PAIEMENT} placeholder="Sélectionner mode…" />
        </Field>
        <Field label="Date livraison" required span={6} error={errDateLivraison}>
          <Input type="date" value={dateLivraison} onChange={(e) => setDateLivraison(e.target.value)} mono error={!!errDateLivraison}/>
        </Field>

        <Field label="Objet" span={12}>
          <Input value={objet} onChange={(e) => setObjet(e.target.value)} placeholder="Objet métier de la demande…" />
        </Field>

        <Field label="Nature matrice V4" span={6}>
          <Select value={nature} onChange={setNature} options={NATURE_MATRICE} placeholder="Sélectionner nature…" />
        </Field>
        <Field label="Montant estimé" span={6} hint="MGA · À CONFIRMER tant que non chiffré">
          <div style={{ position: "relative" }}>
            <Input value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="À CONFIRMER" mono />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>MGA</span>
          </div>
        </Field>

        <Field label="Détails" span={12} hint="4 lignes maximum">
          <Textarea rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Précisions, références dossier, contexte opérationnel…" />
        </Field>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// 2) Émettre facture vente
// ─────────────────────────────────────────────────────────────
function FactureModal({ open, onClose, onSubmit }) {
  const [client, setClient] = useState("");
  const [refDossier, setRefDossier] = useState("");
  const [pieces, setPieces] = useState(true);     // toggle simulé "pièces reçues" — par défaut OK
  const [lignes, setLignes] = useState([
    { libelle: "", montant: "" },
    { libelle: "", montant: "" },
  ]);

  useEffect(() => {
    if (open) {
      setClient(""); setRefDossier(""); setPieces(true);
      setLignes([{ libelle: "", montant: "" }, { libelle: "", montant: "" }]);
    }
  }, [open]);

  const total = useMemo(() => lignes.reduce((s, l) => s + (parseFloat((l.montant || "0").toString().replace(/[\s,]/g, "")) || 0), 0), [lignes]);
  const totalFmt = total > 0 ? total.toLocaleString("fr-FR") : "—";

  const updLigne = (i, key, v) => setLignes((prev) => prev.map((l, idx) => idx === i ? { ...l, [key]: v } : l));
  const addLigne = () => setLignes((prev) => [...prev, { libelle: "", montant: "" }]);
  const rmLigne  = (i) => setLignes((prev) => prev.filter((_, idx) => idx !== i));

  const canSubmit = pieces && client.trim() && refDossier.trim() && total > 0;

  return (
    <Modal
      open={open} onClose={onClose}
      title="Émettre facture vente"
      subtitle="Émis → transmis Haja pour validation B17"
      width={720}
      footer={
        <ModalFooter
          leftHint={pieces
            ? <><AfIcon name="check" size={12} color="var(--ok)"/> <span style={{ color: "var(--ok)" }}>Pièces dossier reçues</span></>
            : <><AfIcon name="alert" size={12} color="var(--err)"/> <span style={{ color: "var(--err)" }}>Pièces manquantes — bouton désactivé</span></>}
          onCancel={onClose}
          submitLabel="Émettre facture"
          disabled={!canSubmit}
          onSubmit={() => onSubmit({ client, refDossier, piecesRecues: pieces, lignes, montantTotal: totalFmt })}
        />
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        <Field label="Client" required span={7}>
          <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Raison sociale client" />
        </Field>
        <Field label="Réf. dossier" required span={5}>
          <Input value={refDossier} onChange={(e) => setRefDossier(e.target.value)} placeholder="DOS-2024-…" mono />
        </Field>

        <Field label="État pièces dossier" span={12} hint="Bascule la valeur pour simuler un dossier incomplet">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" onClick={() => setPieces((v) => !v)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 999,
                border: `1px solid ${pieces ? "var(--ok)" : "var(--err)"}`,
                background: pieces ? "var(--ok-soft)" : "var(--err-soft)",
                color: pieces ? "var(--ok)" : "var(--err)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
              <AfIcon name={pieces ? "check-circle" : "alert"} size={14}/>
              {pieces ? "Pièces reçues" : "Pièces manquantes"}
            </button>
            <span style={{ fontSize: 11, color: "var(--fg-3)" }}>
              {pieces ? "BC, BL, AR fournisseur présents au dossier." : "Bouton Émettre désactivé tant que pièces non remontées."}
            </span>
          </div>
        </Field>

        {/* Lignes */}
        <div style={{ gridColumn: "span 12", borderTop: "1px dashed var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div className="label">Lignes de facture</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{lignes.length} ligne(s)</div>
          </div>
          {lignes.map((l, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 180px 32px", gap: 8 }}>
              <Input value={l.libelle} onChange={(e) => updLigne(i, "libelle", e.target.value)} placeholder={`Libellé ligne ${i + 1}`} />
              <div style={{ position: "relative" }}>
                <Input value={l.montant} onChange={(e) => updLigne(i, "montant", e.target.value)} placeholder="0" mono />
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>MGA</span>
              </div>
              <button type="button" onClick={() => rmLigne(i)} disabled={lignes.length <= 1}
                style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 6, cursor: lignes.length <= 1 ? "not-allowed" : "pointer", color: "var(--fg-3)", display: "grid", placeItems: "center", opacity: lignes.length <= 1 ? 0.4 : 1 }}>
                <AfIcon name="x" size={12}/>
              </button>
            </div>
          ))}
          <button type="button" onClick={addLigne}
            style={{ alignSelf: "flex-start", background: "transparent", border: "1px dashed var(--border)", borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "var(--accent)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <AfIcon name="plus" size={12}/> Ajouter une ligne
          </button>
        </div>

        {/* Total */}
        <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 10, paddingTop: 8, borderTop: "1px solid var(--border-soft)" }}>
          <span className="label" style={{ marginRight: 4 }}>Montant total</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 500, color: "var(--fg-1)", fontVariantNumeric: "tabular-nums" }}>{totalFmt}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>MGA</span>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// 3) Soumettre déclaration
// ─────────────────────────────────────────────────────────────
const DECLARATION_TYPES = [
  { value: "CNAPS", label: "CNAPS · Caisse nationale" },
  { value: "OMSI",  label: "OMSI · Org. médecine sociale interentreprises" },
  { value: "FMFP",  label: "FMFP · Fonds formation prof." },
];

function DeclarationModal({ open, onClose, onSubmit }) {
  const [type, setType] = useState("CNAPS");
  const [periode, setPeriode] = useState("");
  const [assiette, setAssiette] = useState("");
  const [taux, setTaux] = useState("");
  const [dateLimite, setDateLimite] = useState("");

  useEffect(() => {
    if (open) { setType("CNAPS"); setPeriode(""); setAssiette(""); setTaux(""); setDateLimite(""); }
  }, [open]);

  const montantDu = useMemo(() => {
    const a = parseFloat((assiette || "0").toString().replace(/[\s,]/g, ""));
    const t = parseFloat((taux || "0").toString().replace(",", "."));
    if (!a || !t) return null;
    return Math.round(a * t / 100);
  }, [assiette, taux]);
  const montantFmt = montantDu != null ? montantDu.toLocaleString("fr-FR") : "—";

  const canSubmit = type && periode && assiette && taux && dateLimite;

  return (
    <Modal
      open={open} onClose={onClose}
      title="Soumettre déclaration"
      subtitle="Soumis → transmis à Lynda (RH) pour validation"
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="info" size={12}/> Taux & assiette · saisis manuellement</>}
          onCancel={onClose}
          submitLabel="Soumettre déclaration"
          disabled={!canSubmit}
          onSubmit={() => onSubmit({ type, periode, assiette, taux, montantDu: montantFmt, dateLimiteLegale: dateLimite })}
        />
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        <Field label="Type de déclaration" span={12}>
          <SegControl value={type} onChange={setType} options={DECLARATION_TYPES.map(o => ({ value: o.value, label: o.value }))} />
          <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>
            {DECLARATION_TYPES.find(t => t.value === type)?.label}
          </div>
        </Field>

        <Field label="Période" span={6} hint="Mois concerné">
          <Input type="month" value={periode} onChange={(e) => setPeriode(e.target.value)} mono />
        </Field>
        <Field label="Date limite légale" required span={6}>
          <Input type="date" value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} mono />
        </Field>

        <Field label="Assiette" span={6} hint="MGA · masse salariale ou base">
          <div style={{ position: "relative" }}>
            <Input value={assiette} onChange={(e) => setAssiette(e.target.value)} placeholder="0" mono />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>MGA</span>
          </div>
        </Field>
        <Field label="Taux" span={6} hint="% · selon type de déclaration">
          <div style={{ position: "relative" }}>
            <Input value={taux} onChange={(e) => setTaux(e.target.value)} placeholder="À CONFIRMER" mono />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>%</span>
          </div>
        </Field>

        {/* Computed Montant dû */}
        <div style={{ gridColumn: "span 12", marginTop: 4, padding: "14px 16px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Montant dû — calculé</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>assiette × taux</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 500, color: "var(--fg-1)", fontVariantNumeric: "tabular-nums" }}>{montantFmt}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>MGA</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// 4) Établir STC — confidentiel RH (B17)
// ─────────────────────────────────────────────────────────────
const VISA_OPTIONS = [
  { value: "rh",    label: "Lynda — RH" },
  { value: "haja",  label: "Haja — DG" },
  { value: "b17",   label: "B17 — Direction" },
];

function STCModal({ open, onClose, onSubmit }) {
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [elements, setElements] = useState([
    { libelle: "Salaire de base", montant: "" },
    { libelle: "Congés payés", montant: "" },
    { libelle: "Indemnité préavis", montant: "" },
    { libelle: "Retenue avances", montant: "" },
  ]);
  const [visas, setVisas] = useState([]);

  useEffect(() => {
    if (open) {
      setMatricule(""); setNom("");
      setElements([
        { libelle: "Salaire de base", montant: "" },
        { libelle: "Congés payés", montant: "" },
        { libelle: "Indemnité préavis", montant: "" },
        { libelle: "Retenue avances", montant: "" },
      ]);
      setVisas([]);
    }
  }, [open]);

  const net = useMemo(() => elements.reduce((s, e) => s + (parseFloat((e.montant || "0").toString().replace(/[\s,]/g, "")) || 0), 0), [elements]);
  const netFmt = net !== 0 ? net.toLocaleString("fr-FR") : "—";

  const updElt = (i, key, v) => setElements((prev) => prev.map((e, idx) => idx === i ? { ...e, [key]: v } : e));
  const toggleVisa = (v) => setVisas((prev) => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const canSubmit = matricule.trim() && nom.trim() && net !== 0 && visas.length > 0;

  return (
    <Modal
      open={open} onClose={onClose}
      title="Établir STC — Solde de Tout Compte"
      subtitle="Confidentiel RH · droits B17 requis"
      width={720}
      confidential
      badge={<span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, background: "var(--err-soft)", color: "var(--err)", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}><AfIcon name="lock" size={10}/> B17</span>}
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="lock" size={12} color="var(--err)"/> <span style={{ color: "var(--err)" }}>Trace M13 chiffrée · visas obligatoires</span></>}
          onCancel={onClose}
          submitLabel="Établir STC"
          disabled={!canSubmit}
          onSubmit={() => onSubmit({ matricule, nom, elementsSolde: elements, net: netFmt, visas })}
        />
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        <Field label="Matricule" required span={4}>
          <Input value={matricule} onChange={(e) => setMatricule(e.target.value)} placeholder="MAT-…" mono />
        </Field>
        <Field label="Nom collaborateur" required span={8} hint="Visible aux profils RH uniquement">
          <div style={{ position: "relative" }}>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom Prénom" />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--err)" }}><AfIcon name="lock" size={12}/></span>
          </div>
        </Field>

        {/* Éléments de solde */}
        <div style={{ gridColumn: "span 12", borderTop: "1px dashed var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="label">Éléments de solde</div>
          {elements.map((el, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 8 }}>
              <Input value={el.libelle} onChange={(e) => updElt(i, "libelle", e.target.value)} />
              <div style={{ position: "relative" }}>
                <Input value={el.montant} onChange={(e) => updElt(i, "montant", e.target.value)} placeholder="0" mono />
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>MGA</span>
              </div>
            </div>
          ))}
        </div>

        {/* Net */}
        <div style={{ gridColumn: "span 12", padding: "14px 16px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Net à verser</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>somme des éléments (retenues en négatif)</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 500, color: "var(--fg-1)", fontVariantNumeric: "tabular-nums" }}>{netFmt}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>MGA</span>
          </div>
        </div>

        {/* Visas */}
        <Field label="Visas requis" span={12} hint="Au minimum un visa pour soumission">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {VISA_OPTIONS.map((v) => {
              const active = visas.includes(v.value);
              return (
                <button key={v.value} type="button" onClick={() => toggleVisa(v.value)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 12px", borderRadius: 999,
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    background: active ? "var(--accent-soft)" : "transparent",
                    color: active ? "var(--accent)" : "var(--fg-2)",
                    fontSize: 12, fontWeight: 500, cursor: "pointer",
                  }}>
                  <AfIcon name={active ? "check-circle" : "circle"} size={12}/> {v.label}
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

// Animations CSS injection
if (typeof document !== "undefined" && !document.getElementById("af-modal-anim")) {
  const s = document.createElement("style"); s.id = "af-modal-anim";
  s.textContent = `
    @keyframes afModalIn { from { opacity: 0; transform: translateY(-8px) scale(.98); } to { opacity: 1; transform: none; } }
    @keyframes afToastIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
    @keyframes afPulse   { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 40%, transparent); } 100% { box-shadow: 0 0 0 12px transparent; } }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  DDVModal, FactureModal, DeclarationModal, STCModal,
  // Primitives D82 — réutilisables par Haja (arbitrage) et autres workspaces
  Modal, ModalFooter, Field, Input, Textarea, Select, SegControl,
});
