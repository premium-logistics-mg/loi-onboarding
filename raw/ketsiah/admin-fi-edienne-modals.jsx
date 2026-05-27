/* global React, AfIcon, Modal, ModalFooter, Field, Input, Textarea, Select, SegControl */
// ════════════════════════════════════════════════════════════════
// LOI · Admin-Fi ÉDIENNE — Modales RH D82
// 4 modales action-first (Vue d'ensemble) :
//   1. CongeVisaModal       — viser un congé/absence (ref-002, 2 visas hiérarchiques faits → visa RH)
//   2. STCVisaRHModal       — visa RH sur STC (Sarobidy a établi · Haja a confirmé cash)
//   3. ClimatHebdoModal     — saisir le pulse climat hebdomadaire (5 départements)
//   4. OneOnOneTraceModal   — tracer un 1on1 Pacte TER (lieutenant · sujets · suivi)
// B17 strict : noms_prénoms employés visibles ICI uniquement.
// ════════════════════════════════════════════════════════════════
const { useState: useStateEd, useEffect: useEffectEd, useMemo: useMemoEd } = React;

// ─────────────────────────────────────────────────────────────
// Bandeau B17 commun
// ─────────────────────────────────────────────────────────────
function B17Banner({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px", borderRadius: 6, marginBottom: 14,
      background: "color-mix(in srgb, var(--err) 8%, transparent)",
      border: "1px solid color-mix(in srgb, var(--err) 28%, var(--border))",
      color: "var(--err)", fontSize: 11, fontWeight: 600,
    }}>
      <AfIcon name="lock" size={12}/> {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VisaChip — état d'un visa (déjà donné / en attente)
// ─────────────────────────────────────────────────────────────
function VisaChip({ who, date, done }) {
  const tone = done
    ? { bg: "var(--ok-soft)", color: "var(--ok)", border: "color-mix(in srgb, var(--ok) 30%, transparent)" }
    : { bg: "var(--warn-soft)", color: "var(--warn)", border: "color-mix(in srgb, var(--warn) 30%, transparent)" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 8,
      background: tone.bg, border: `1px solid ${tone.border}`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background: tone.color, color: "white",
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <AfIcon name={done ? "check" : "clock"} size={14}/>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>{who}</div>
        <div style={{ fontSize: 11, color: tone.color, fontFamily: "var(--font-mono)" }}>{done ? `Visé · ${date}` : "En attente"}</div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 1) CongeVisaModal — viser un congé/absence (form-config ref-002)
// ═════════════════════════════════════════════════════════════
const MOTIFS_CONGE = [
  { value: "annuel",      label: "Annuel · payé" },
  { value: "exception",   label: "Exception · payé" },
  { value: "sans_solde",  label: "Sans solde" },
  { value: "maladie",     label: "Maladie · justifié" },
  { value: "maternite",   label: "Maternité · légal" },
  { value: "autre",       label: "Autre" },
];

function CongeVisaModal({ open, onClose, onSubmit, prefill }) {
  const [matricule, setMatricule] = useStateEd("");
  const [nom, setNom] = useStateEd("");
  const [rattachement, setRattachement] = useStateEd("");
  const [motif, setMotif] = useStateEd("annuel");
  const [dateDebut, setDateDebut] = useStateEd("");
  const [dateFin, setDateFin] = useStateEd("");
  const [soldeRestant, setSoldeRestant] = useStateEd("");
  const [note, setNote] = useStateEd("");

  useEffectEd(() => {
    if (open) {
      setMatricule(prefill?.matricule || "");
      setNom(prefill?.nom || "");
      setRattachement(prefill?.rattachement || "");
      setMotif(prefill?.motif || "annuel");
      setDateDebut(prefill?.dateDebut || "");
      setDateFin(prefill?.dateFin || "");
      setSoldeRestant(prefill?.soldeRestant || "");
      setNote("");
    }
  }, [open, prefill]);

  const dureeJours = useMemoEd(() => {
    if (!dateDebut || !dateFin) return null;
    const d1 = new Date(dateDebut), d2 = new Date(dateFin);
    if (isNaN(d1) || isNaN(d2) || d2 < d1) return null;
    return Math.round((d2 - d1) / 86400000) + 1;
  }, [dateDebut, dateFin]);

  const canSubmit = matricule.trim() && nom.trim() && dateDebut && dateFin && dureeJours != null;

  return (
    <Modal
      open={open} onClose={onClose}
      title="Viser congé / absence"
      subtitle="Form-config ref-002 · 2 visas hiérarchiques faits → visa RH (Édienne)"
      badge={<span className="confirm-badge">ref-002</span>}
      width={680}
      confidential
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="lock" size={12} color="var(--err)"/> <span style={{ color: "var(--err)" }}>B17 · trace M13 simulée</span></>}
          onCancel={onClose}
          submitLabel="Viser RH & clôturer"
          disabled={!canSubmit}
          onSubmit={() => onSubmit({ event: "visa_rh_conge", matricule, nom, rattachement, motif, dateDebut, dateFin, dureeJours, soldeRestant, note })}
        />
      }
    >
      <B17Banner>Données nominatives RH · visibles Édienne uniquement (Loi 2014-038)</B17Banner>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        <Field label="Matricule" required span={4}>
          <Input value={matricule} onChange={(e) => setMatricule(e.target.value)} placeholder="MAT-…" mono />
        </Field>
        <Field label="Nom collaborateur" required span={8} hint="Visible Édienne uniquement (B17)">
          <div style={{ position: "relative" }}>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom Prénom" />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--err)" }}><AfIcon name="lock" size={12}/></span>
          </div>
        </Field>

        <Field label="Rattachement" span={6}>
          <Input value={rattachement} onChange={(e) => setRattachement(e.target.value)} placeholder="Département / équipe" />
        </Field>
        <Field label="Motif" span={6}>
          <Select value={motif} onChange={setMotif} options={MOTIFS_CONGE} placeholder="Sélectionner motif…"/>
        </Field>

        <Field label="Date début" required span={4}>
          <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} mono />
        </Field>
        <Field label="Date fin" required span={4}>
          <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} mono />
        </Field>
        <Field label="Solde restant" span={4} hint="Jours ouvrés acquis après prise">
          <div style={{ position: "relative" }}>
            <Input value={soldeRestant} onChange={(e) => setSoldeRestant(e.target.value)} placeholder="À CONFIRMER" mono />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>j</span>
          </div>
        </Field>

        {/* Durée calculée */}
        <div style={{ gridColumn: "span 12", padding: "14px 16px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Durée — calculée</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>Jours calendaires entre début et fin (inclus)</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 500, color: dureeJours ? "var(--fg-1)" : "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>{dureeJours ?? "—"}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>jours</span>
          </div>
        </div>

        {/* Visas hiérarchiques pré-acquis */}
        <div style={{ gridColumn: "span 12", borderTop: "1px dashed var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="label">Visas hiérarchiques (acquis avant visa RH)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <VisaChip who={prefill?.visaN1 || "Resp. N+1"} date={prefill?.visaN1Date || "24 mai"} done={true}/>
            <VisaChip who={prefill?.visaN2 || "Resp. N+2"} date={prefill?.visaN2Date || "26 mai"} done={true}/>
            <VisaChip who="RH · Édienne" date="" done={false}/>
          </div>
        </div>

        <Field label="Note d'arbitrage RH" span={12} hint="Facultative · 2 lignes max">
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Conformité solde, charge équipe, etc."/>
        </Field>
      </div>
    </Modal>
  );
}

// ═════════════════════════════════════════════════════════════
// 2) STCVisaRHModal — visa RH sur STC déjà établi (Sarobidy) + cash confirmé (Haja)
// ═════════════════════════════════════════════════════════════
function STCVisaRHModal({ open, onClose, onSubmit, prefill }) {
  const [matricule, setMatricule] = useStateEd("");
  const [nom, setNom] = useStateEd("");
  const [motifRupture, setMotifRupture] = useStateEd("demission");
  const [dateRupture, setDateRupture] = useStateEd("");
  const [montantNet, setMontantNet] = useStateEd("");
  const [conformite, setConformite] = useStateEd(true);
  const [note, setNote] = useStateEd("");

  useEffectEd(() => {
    if (open) {
      setMatricule(prefill?.matricule || "");
      setNom(prefill?.nom || "");
      setMotifRupture(prefill?.motifRupture || "demission");
      setDateRupture(prefill?.dateRupture || "");
      setMontantNet(prefill?.montantNet || "");
      setConformite(true);
      setNote("");
    }
  }, [open, prefill]);

  const canSubmit = matricule.trim() && nom.trim() && dateRupture && montantNet.trim() && conformite;

  return (
    <Modal
      open={open} onClose={onClose}
      title="Viser STC — visa RH Édienne"
      subtitle="STC établi par Sarobidy · cash confirmé Haja · visa RH = clôture B17"
      badge={<span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, background: "var(--err-soft)", color: "var(--err)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}><AfIcon name="lock" size={10}/> B17</span>}
      width={680}
      confidential
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="lock" size={12} color="var(--err)"/> <span style={{ color: "var(--err)" }}>Confidentiel · clôture pacte sortie</span></>}
          onCancel={onClose}
          submitLabel="Viser RH & clôturer STC"
          disabled={!canSubmit}
          onSubmit={() => onSubmit({ event: "visa_rh_stc", matricule, nom, motifRupture, dateRupture, montantNet, note })}
        />
      }
    >
      <B17Banner>Visa RH = dernière étape STC · trace nominative chiffrée M13</B17Banner>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        <Field label="Matricule" required span={4}>
          <Input value={matricule} onChange={(e) => setMatricule(e.target.value)} placeholder="MAT-…" mono />
        </Field>
        <Field label="Nom collaborateur" required span={8}>
          <div style={{ position: "relative" }}>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom Prénom"/>
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--err)" }}><AfIcon name="lock" size={12}/></span>
          </div>
        </Field>

        <Field label="Motif de rupture" span={6}>
          <SegControl value={motifRupture} onChange={setMotifRupture} options={[
            { value: "demission", label: "Démission" },
            { value: "rupture",   label: "Rupture conv." },
            { value: "licenciement", label: "Licenciement" },
          ]}/>
        </Field>
        <Field label="Date effective rupture" required span={6}>
          <Input type="date" value={dateRupture} onChange={(e) => setDateRupture(e.target.value)} mono/>
        </Field>

        <Field label="Net à verser (validé Sarobidy)" span={12} hint="Repris du STC · non modifiable côté RH">
          <div style={{ position: "relative" }}>
            <Input value={montantNet} onChange={(e) => setMontantNet(e.target.value)} placeholder="0" mono disabled={!!prefill?.montantNet} style={prefill?.montantNet ? { background: "var(--bg-elev-1)", color: "var(--fg-2)" } : {}}/>
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>MGA</span>
          </div>
        </Field>

        {/* Chain of visas */}
        <div style={{ gridColumn: "span 12", borderTop: "1px dashed var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="label">Chaîne de visas STC</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <VisaChip who="Sarobidy · STC établi" date={prefill?.dateSarobidy || "22 mai"} done={true}/>
            <VisaChip who="Haja · cash confirmé" date={prefill?.dateHaja || "25 mai"} done={true}/>
            <VisaChip who="RH · Édienne" date="" done={false}/>
          </div>
        </div>

        {/* Conformité check */}
        <Field label="Conformité Loi 2003-044" span={12} hint="Préavis, congés payés, certificat de travail — cocher si conforme">
          <button type="button" onClick={() => setConformite((v) => !v)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 14px", borderRadius: 999, alignSelf: "flex-start",
              border: `1px solid ${conformite ? "var(--ok)" : "var(--err)"}`,
              background: conformite ? "var(--ok-soft)" : "var(--err-soft)",
              color: conformite ? "var(--ok)" : "var(--err)",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
            <AfIcon name={conformite ? "check-circle" : "alert"} size={14}/>
            {conformite ? "Conforme Code du Travail" : "Non-conformité signalée"}
          </button>
        </Field>

        <Field label="Note clôture RH" span={12}>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Préavis effectué, remise certificat, suivi post-départ…"/>
        </Field>
      </div>
    </Modal>
  );
}

// ═════════════════════════════════════════════════════════════
// 3) ClimatHebdoModal — pulse climat (seule donnée RH SYNTH du système)
// ═════════════════════════════════════════════════════════════
const PULSE_OPTIONS = [
  { v: 1, label: "Critique", color: "var(--err)" },
  { v: 2, label: "Tendu",    color: "var(--warn)" },
  { v: 3, label: "Stable",   color: "var(--fg-2)" },
  { v: 4, label: "Bon",      color: "var(--ok)" },
  { v: 5, label: "Excellent",color: "var(--ok)" },
];

const PULSE_DEPTS = [
  "Direction",
  "Admin-Fi",
  "Transit Antananarivo",
  "Transit Toamasina",
  "Achat",
  "Caisse",
];

function PulseSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {PULSE_OPTIONS.map((o) => {
        const active = value === o.v;
        return (
          <button key={o.v} type="button" onClick={() => onChange(o.v)}
            title={o.label}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 6,
              border: `1.5px solid ${active ? o.color : "var(--border)"}`,
              background: active ? `color-mix(in srgb, ${o.color} 16%, var(--surface))` : "var(--surface)",
              color: active ? o.color : "var(--fg-3)",
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
              cursor: "pointer", transition: "all 100ms",
            }}>
            {o.v}
          </button>
        );
      })}
    </div>
  );
}

function ClimatHebdoModal({ open, onClose, onSubmit }) {
  const today = new Date().toISOString().slice(0, 10);
  const [semaine, setSemaine] = useStateEd("");
  const [pulses, setPulses] = useStateEd(() => Object.fromEntries(PULSE_DEPTS.map((d) => [d, 3])));
  const [commentaire, setCommentaire] = useStateEd("");

  useEffectEd(() => {
    if (open) {
      // Semaine ISO courante (approximation)
      const d = new Date(today);
      const week = (function () {
        const target = new Date(d);
        const dayNr = (d.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThu = new Date(target.getFullYear(), 0, 4);
        const diff = target - firstThu;
        return 1 + Math.round(diff / 604800000);
      })();
      setSemaine(`${d.getFullYear()}-W${String(week).padStart(2, "0")}`);
      setPulses(Object.fromEntries(PULSE_DEPTS.map((dep) => [dep, 3])));
      setCommentaire("");
    }
  }, [open]);

  const moyenne = useMemoEd(() => {
    const vals = Object.values(pulses);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }, [pulses]);
  const moyennePct = Math.round((moyenne / 5) * 100);

  const canSubmit = !!semaine && Object.values(pulses).every((v) => v >= 1 && v <= 5);

  return (
    <Modal
      open={open} onClose={onClose}
      title="Saisir climat hebdo"
      subtitle="Pulse 1–5 par département · agrégé anonymisé en remontée Haja"
      width={680}
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="info" size={12}/> Seule mesure RH SYNTH du système · cadence hebdomadaire</>}
          onCancel={onClose}
          submitLabel="Enregistrer pulse climat"
          disabled={!canSubmit}
          onSubmit={() => onSubmit({ event: "climat_hebdo", semaine, pulses, moyenne: moyenne.toFixed(2), moyennePct, commentaire })}
        />
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        <Field label="Semaine ISO" span={6}>
          <Input value={semaine} onChange={(e) => setSemaine(e.target.value)} placeholder="2026-W22" mono/>
        </Field>
        <Field label="Moyenne pondérée" span={6} hint="Calculée · agrégée pour Haja">
          <div style={{ position: "relative", padding: "10px 12px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 6 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600, color: "var(--fg-1)", fontVariantNumeric: "tabular-nums" }}>{moyenne.toFixed(2)}</span>
              <span style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>/ 5</span>
              <span style={{ marginLeft: "auto", fontSize: 12, fontFamily: "var(--font-mono)", color: moyennePct >= 70 ? "var(--ok)" : moyennePct >= 50 ? "var(--warn)" : "var(--err)", fontWeight: 700 }}>{moyennePct}%</span>
            </div>
          </div>
        </Field>

        {/* Pulse par département */}
        <div style={{ gridColumn: "span 12", borderTop: "1px dashed var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="label">Pulse par département (1 = critique · 5 = excellent)</div>
          {PULSE_DEPTS.map((dep) => (
            <div key={dep} style={{ display: "grid", gridTemplateColumns: "200px 1fr 140px", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>{dep}</span>
              <PulseSelector value={pulses[dep]} onChange={(v) => setPulses((p) => ({ ...p, [dep]: v }))}/>
              <span style={{ fontSize: 12, color: PULSE_OPTIONS.find(o => o.v === pulses[dep])?.color, fontWeight: 600, textAlign: "right", fontFamily: "var(--font-mono)" }}>
                {PULSE_OPTIONS.find(o => o.v === pulses[dep])?.label}
              </span>
            </div>
          ))}
        </div>

        <Field label="Commentaire global" span={12} hint="Anonymisé · agrégé pour remontée">
          <Textarea rows={3} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Observations terrain, tendances, signaux faibles…"/>
        </Field>
      </div>
    </Modal>
  );
}

// ═════════════════════════════════════════════════════════════
// 4) OneOnOneTraceModal — tracer un 1on1 Pacte TER
// ═════════════════════════════════════════════════════════════
const LIEUTENANTS_PACTE = [
  { value: "sarobidy",     label: "Sarobidy · Admin-Fi #1" },
  { value: "belaza",       label: "Belaza · TVA & décaissement" },
  { value: "christine",    label: "Christine · caisse" },
  { value: "facturation",  label: "Facturation · Lynda + Rico" },
  { value: "haja",         label: "Haja · DG (1on1 montant)" },
];

function OneOnOneTraceModal({ open, onClose, onSubmit }) {
  const today = new Date().toISOString().slice(0, 10);
  const [lieutenant, setLieutenant] = useStateEd("");
  const [date, setDate] = useStateEd(today);
  const [duree, setDuree] = useStateEd("30");
  const [sujets, setSujets] = useStateEd([
    { libelle: "", priorite: "P1" },
    { libelle: "", priorite: "P1" },
  ]);
  const [actions, setActions] = useStateEd("");
  const [climat, setClimat] = useStateEd(3);
  const [m13, setM13] = useStateEd(true);

  useEffectEd(() => {
    if (open) {
      setLieutenant(""); setDate(today); setDuree("30");
      setSujets([{ libelle: "", priorite: "P1" }, { libelle: "", priorite: "P1" }]);
      setActions(""); setClimat(3); setM13(true);
    }
  }, [open]);

  const updSujet = (i, key, v) => setSujets((prev) => prev.map((s, idx) => idx === i ? { ...s, [key]: v } : s));
  const addSujet = () => setSujets((prev) => [...prev, { libelle: "", priorite: "P1" }]);
  const rmSujet  = (i) => setSujets((prev) => prev.filter((_, idx) => idx !== i));

  const sujetsValides = sujets.filter((s) => s.libelle.trim().length > 0);
  const canSubmit = !!lieutenant && !!date && sujetsValides.length > 0;

  return (
    <Modal
      open={open} onClose={onClose}
      title="Tracer 1on1 · Pacte TER"
      subtitle="Cadence trimestrielle · décisions tracées (SO·5) · co-owner Kenny+Édienne"
      badge={<span className="confirm-badge">Pacte TER</span>}
      width={700}
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="check-circle" size={12} color="var(--ok)"/> M13 {m13 ? "actif" : "désactivé"} · WRITES_LIVE=false</>}
          onCancel={onClose}
          submitLabel="Tracer 1on1 & clôturer"
          disabled={!canSubmit}
          onSubmit={() => onSubmit({ event: "one_on_one", lieutenant, date, duree, sujets: sujetsValides, actions, climat, m13 })}
        />
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
        <Field label="Lieutenant" required span={8}>
          <Select value={lieutenant} onChange={setLieutenant} options={LIEUTENANTS_PACTE} placeholder="Sélectionner lieutenant…"/>
        </Field>
        <Field label="Durée" span={4} hint="Minutes effectives">
          <div style={{ position: "relative" }}>
            <Input value={duree} onChange={(e) => setDuree(e.target.value)} mono/>
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", pointerEvents: "none" }}>min</span>
          </div>
        </Field>

        <Field label="Date 1on1" required span={6}>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} mono/>
        </Field>
        <Field label="Climat ressenti" span={6} hint="Lecture rapide 1–5">
          <PulseSelector value={climat} onChange={setClimat}/>
        </Field>

        {/* Sujets P0/P1 */}
        <div style={{ gridColumn: "span 12", borderTop: "1px dashed var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div className="label">Sujets abordés (P0/P1 · doivent être clôturés en M13)</div>
            <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{sujetsValides.length} sujet(s)</span>
          </div>
          {sujets.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 110px 32px", gap: 8 }}>
              <Input value={s.libelle} onChange={(e) => updSujet(i, "libelle", e.target.value)} placeholder={`Sujet ${i + 1}…`}/>
              <SegControl value={s.priorite} onChange={(v) => updSujet(i, "priorite", v)} options={[
                { value: "P0", label: "P0" },
                { value: "P1", label: "P1" },
                { value: "P2", label: "P2" },
              ]}/>
              <button type="button" onClick={() => rmSujet(i)} disabled={sujets.length <= 1}
                style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 6, cursor: sujets.length <= 1 ? "not-allowed" : "pointer", color: "var(--fg-3)", display: "grid", placeItems: "center", opacity: sujets.length <= 1 ? 0.4 : 1 }}>
                <AfIcon name="x" size={12}/>
              </button>
            </div>
          ))}
          <button type="button" onClick={addSujet}
            style={{ alignSelf: "flex-start", background: "transparent", border: "1px dashed var(--border)", borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "var(--accent)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <AfIcon name="plus" size={12}/> Ajouter un sujet
          </button>
        </div>

        <Field label="Actions à suivre" span={12} hint="Engagements concrets · tracés M13">
          <Textarea rows={3} value={actions} onChange={(e) => setActions(e.target.value)} placeholder="Ex : Belaza ré-aligne check-list 3 points d'ici S22 · revue J+14"/>
        </Field>

        {/* M13 toggle */}
        <div style={{ gridColumn: "span 12", padding: "12px 16px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>Tracer dans M13</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)" }}>Décision tracée & clôturée → compte SO·5</div>
          </div>
          <button type="button" onClick={() => setM13((v) => !v)}
            style={{
              width: 44, height: 24, borderRadius: 999,
              background: m13 ? "var(--accent)" : "var(--border)",
              border: "none", cursor: "pointer", position: "relative", transition: "background 120ms",
            }}>
            <span style={{
              position: "absolute", top: 3, left: m13 ? 23 : 3,
              width: 18, height: 18, borderRadius: "50%", background: "white",
              transition: "left 120ms",
            }}/>
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Export
Object.assign(window, { CongeVisaModal, STCVisaRHModal, ClimatHebdoModal, OneOnOneTraceModal });
