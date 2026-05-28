/* global React, Dialog, FormSection, Field, TextInput, TextArea, Select, Radio, Checkbox, PrimaryBtn, SecondaryBtn, GhostBtn, CLIENTS, MODES */
const { useState: toolUseState, useMemo: toolUseMemo } = React;

// Helper: generate next dossier ref. import → FAI26NNNN, export → FAE26NNNN
function nextRef(type, dossiers) {
  const prefix = type === "Export" ? "FAE26" : "FAI26";
  // find max serial among existing of that prefix
  let max = 0;
  dossiers.forEach(d => {
    if (d.ref.startsWith(prefix)) {
      const n = parseInt(d.ref.slice(prefix.length), 10);
      if (!isNaN(n) && n > max) max = n;
    }
  });
  return prefix + String(max + 1).padStart(4, "0");
}
window.nextRef = nextRef;

// ============== OUVRIR UN NOUVEAU DOSSIER ==============
function OuvrirDossierDialog({ open, onClose, dossiers, onCreate }) {
  const [client, setClient] = toolUseState("");
  const [type, setType] = toolUseState("Import");
  const [cargo, setCargo] = toolUseState("");
  const [docs, setDocs] = toolUseState({ bl: false, fc: false, pl: false, bsc: false });
  const [navire, setNavire] = toolUseState("");
  const [mode, setMode] = toolUseState("A");
  const [notes, setNotes] = toolUseState("");
  const [mandateFile, setMandateFile] = toolUseState(null); // { name, size }

  const generatedRef = toolUseMemo(() => nextRef(type, dossiers), [type, dossiers]);
  const docCount = Object.values(docs).filter(Boolean).length;

  function reset() {
    setClient(""); setType("Import"); setCargo("");
    setDocs({ bl: false, fc: false, pl: false, bsc: false });
    setNavire(""); setMode("A"); setNotes("");
    setMandateFile(null);
  }
  function attachMandate() {
    const clientSlug = (client || "client").replace(/[^A-Za-z]/g, "-").toUpperCase();
    setMandateFile({
      name: `Mandat-${generatedRef}-${clientSlug}-signe.pdf`,
      size: `${380 + Math.floor(Math.random() * 80)} Kb`,
    });
  }
  function submit() {
    if (!client || !cargo || !mandateFile) return;
    // Build files[] from checked docs + the mandate
    const now = "28 mai · 11:42";
    const files = [
      window.makeFile("mandate", generatedRef, { signed: true, by: client, ts: now }),
    ];
    if (docs.bl)  files.push(window.makeFile("bl",  generatedRef, { by: client, ts: now }));
    if (docs.fc)  files.push(window.makeFile("fc",  generatedRef, { by: client, ts: now }));
    if (docs.pl)  files.push(window.makeFile("pl",  generatedRef, { by: client, ts: now }));
    if (docs.bsc) files.push(window.makeFile("bsc", generatedRef, { by: client, ts: now }));

    const newDoss = {
      ref: generatedRef, client, type, cargo, mode,
      etape: "Docs en attente", owner: "Lalatiana", age: "0h",
      escalated: false, navire,
      docs: { ...docs }, cotation: null, dauRef: null, marge: null,
      files,
    };
    onCreate(newDoss, notes);
    reset();
    onClose();
  }

  const canSubmit = client && cargo && mandateFile;

  return (
    <Dialog
      open={open} onClose={onClose}
      title="Ouvrir un nouveau dossier"
      sub="Point d'entrée Transit. Cette saisie démarre la chaîne Transit → Facturation → Encaissement."
      maxWidth={780}
      footer={
        <>
          <GhostBtn onClick={onClose}>Annuler</GhostBtn>
          <PrimaryBtn onClick={submit} icon="check" style={canSubmit ? null : { opacity: 0.5, cursor: "not-allowed" }}>
            Ouvrir le dossier · générer {type === "Export" ? "FAE" : "FAI"}
          </PrimaryBtn>
        </>
      }
    >
      {/* Ref preview banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginBottom: 18,
        padding: "12px 16px", borderRadius: 8, background: "var(--accent-soft)",
        border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
      }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", fontWeight: 600 }}>Référence générée</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22, color: "var(--fg-1)", fontWeight: 500, letterSpacing: "-0.01em" }}>{generatedRef}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-3)" }}>type · {type} · préfixe automatique</span>
      </div>

      <FormSection tag="A" title="Client">
        <Select value={client} onChange={setClient} options={CLIENTS} placeholder="Sélectionner client (allow-list)" />
      </FormSection>

      <FormSection tag="B" title="Type">
        <Radio name="type" value={type} onChange={setType} options={["Import", "Export"]} />
      </FormSection>

      <FormSection tag="C" title="Marchandise">
        <TextInput value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="ex. 11 836 T ciment vrac TAM124" />
      </FormSection>

      <FormSection
        tag="D" title="Documents reçus"
        hint={
          <span style={{
            fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
            padding: "2px 7px", borderRadius: 2, letterSpacing: "0.08em",
            background: docCount === 4 ? "var(--ok-soft)" : "var(--warn-soft)",
            color: docCount === 4 ? "var(--ok)" : "var(--warn)",
          }}>
            {docCount === 4 ? "Documents complets" : `Pièces manquantes · ${4 - docCount}/4`}
          </span>
        }
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Checkbox checked={docs.bl}  onChange={(v) => setDocs({ ...docs, bl: v })}  label="BL · Bill of Lading" />
          <Checkbox checked={docs.fc}  onChange={(v) => setDocs({ ...docs, fc: v })}  label="Facture commerciale" />
          <Checkbox checked={docs.pl}  onChange={(v) => setDocs({ ...docs, pl: v })}  label="Packing list" />
          <Checkbox checked={docs.bsc} onChange={(v) => setDocs({ ...docs, bsc: v })} label="BSC · GasyNet" />
        </div>
      </FormSection>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormSection tag="E" title="Navire / voyage">
          <TextInput value={navire} onChange={(e) => setNavire(e.target.value)} placeholder="ex. MV PACIFIC" />
        </FormSection>
        <FormSection tag="F" title="Mode">
          <Select value={mode} onChange={setMode} options={MODES.map(m => ({ value: m.id, label: m.label }))} />
        </FormSection>
      </div>

      <FormSection
        tag="G" title="Mandat signé client"
        hint={
          <span style={{ fontSize: 11, color: mandateFile ? "var(--ok)" : "var(--err)", fontWeight: 600 }}>
            {mandateFile ? "joint ·  signé" : "obligatoire"}
          </span>
        }
      >
        {!mandateFile ? (
          <div onClick={attachMandate} style={{
            padding: "16px 18px", borderRadius: 8,
            border: "1.5px dashed var(--border)", cursor: "pointer",
            background: "var(--bg)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 6,
              background: "var(--accent-soft)", color: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i data-lucide="file-signature" style={{ width: 18, height: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>Joindre le mandat de transit signé</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>PDF · scan signé du client · preuve légale d'ouverture du dossier</div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 4,
              background: "var(--accent)", color: "var(--accent-fg)",
            }}>Joindre</span>
          </div>
        ) : (
          <div style={{
            padding: "12px 14px", borderRadius: 8,
            background: "color-mix(in srgb, var(--ok) 8%, var(--bg))",
            border: "1px solid color-mix(in srgb, var(--ok) 35%, transparent)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: "color-mix(in srgb, var(--ok) 18%, transparent)", color: "var(--ok)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i data-lucide="file-check-2" style={{ width: 16, height: 16 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: "var(--fg-1)", fontFamily: "IBM Plex Mono, monospace" }}>{mandateFile.name}</div>
              <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 2 }}>
                <span style={{ fontFamily: "IBM Plex Mono, monospace" }}>{mandateFile.size}</span> · scan signé · sera attaché à <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-2)" }}>{generatedRef}</span>
              </div>
            </div>
            <button onClick={() => setMandateFile(null)} style={{
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--fg-3)", borderRadius: 4, padding: "5px 10px",
              fontSize: 11, cursor: "pointer",
            }}>Remplacer</button>
          </div>
        )}
      </FormSection>

      <FormSection tag="H" title="Notes initiales" hint="optionnel">
        <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contexte client, urgence, références internes…" />
      </FormSection>
    </Dialog>
  );
}

// ============== COTATION ==============
function CotationDialog({ open, onClose, dossiers, onSubmit }) {
  // Ses dossiers en cours = ceux dont owner=Lalatiana ou stade pré-DAU
  const candidates = dossiers.filter(d => !d.cotation && ["Docs en attente"].includes(d.etape))
    .concat(dossiers.filter(d => d.cotation && d.etape === "Cotation émise"));
  const seen = new Set();
  const list = candidates.filter(d => seen.has(d.ref) ? false : (seen.add(d.ref), true));

  const [ref, setRef] = toolUseState(list[0]?.ref || "");
  const [cost, setCost] = toolUseState("");
  const [marge, setMarge] = toolUseState("8");
  const [reglement, setReglement] = toolUseState("30j");
  const [validite, setValidite] = toolUseState("");

  const margeNum = parseFloat(marge.replace(",", "."));
  const margeAlert = !isNaN(margeNum) && margeNum < 7;

  function submit() {
    if (!ref || !cost) return;
    onSubmit({ ref, cost, marge: margeNum, reglement, validite });
    onClose();
  }

  return (
    <Dialog
      open={open} onClose={onClose}
      title="Émettre une cotation client"
      sub="Devis adressé au client. La cible PL est ≥ 7 % de marge PDJV."
      footer={
        <>
          <GhostBtn onClick={onClose}>Annuler</GhostBtn>
          <PrimaryBtn onClick={submit} icon="send">Émettre la cotation</PrimaryBtn>
        </>
      }
    >
      <FormSection tag="A" title="Dossier concerné">
        <Select
          value={ref} onChange={setRef}
          options={list.map(d => ({ value: d.ref, label: `${d.ref} · ${d.client} · ${d.cargo}` }))}
          placeholder="Choisir un dossier en cours"
        />
      </FormSection>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormSection tag="B" title="Coûts opérationnels estimés">
          <div style={{ position: "relative" }}>
            <TextInput value={cost} onChange={(e) => setCost(e.target.value)} placeholder="ex. 42 500 000" style={{ paddingRight: 50, fontFamily: "IBM Plex Mono, monospace" }} />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>MGA</span>
          </div>
        </FormSection>
        <FormSection tag="C" title="Marge cible" hint={margeAlert ? <span style={{ color: "var(--err)" }}>alerte · &lt; 7 %</span> : null}>
          <div style={{ position: "relative" }}>
            <TextInput value={marge} onChange={(e) => setMarge(e.target.value)} placeholder="8" style={{ paddingRight: 28, fontFamily: "IBM Plex Mono, monospace", borderColor: margeAlert ? "var(--err)" : undefined }} />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--fg-3)" }}>%</span>
          </div>
        </FormSection>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormSection tag="D" title="Conditions de règlement">
          <Select value={reglement} onChange={setReglement} options={["comptant", "30j", "45j"]} />
        </FormSection>
        <FormSection tag="E" title="Validité offre">
          <TextInput value={validite} onChange={(e) => setValidite(e.target.value)} placeholder="ex. 15 j" />
        </FormSection>
      </div>
    </Dialog>
  );
}

// ============== RELANCE CLIENT ==============
const TEMPLATES = {
  "pièces manquantes": "Bonjour, dans le cadre du dossier {REF} ({CARGO}), nous restons en attente des pièces suivantes pour démarrer la déclaration. Merci de les transmettre dans la journée afin d'éviter tout démurrage.",
  "paiement":          "Bonjour, sauf erreur, le règlement de la facture afférente au dossier {REF} reste à recevoir. Pouvez-vous nous confirmer la date prévue d'encaissement ?",
  "info attendue":     "Bonjour, suite à notre échange concernant le dossier {REF}, nous restons dans l'attente de votre retour pour avancer sur les prochaines étapes.",
};

function RelanceDialog({ open, onClose, dossiers, onSubmit }) {
  const list = dossiers;
  const [ref, setRef] = toolUseState(list[0]?.ref || "");
  const [type, setType] = toolUseState("pièces manquantes");
  const [canal, setCanal] = toolUseState("email");
  const dossier = list.find(d => d.ref === ref);
  const initial = (TEMPLATES[type] || "").replace("{REF}", ref || "—").replace("{CARGO}", dossier?.cargo || "—");
  const [tpl, setTpl] = toolUseState(initial);

  React.useEffect(() => { setTpl((TEMPLATES[type] || "").replace("{REF}", ref || "—").replace("{CARGO}", dossier?.cargo || "—")); }, [type, ref]);

  function submit() {
    if (!ref) return;
    onSubmit({ ref, type, canal });
    onClose();
  }

  return (
    <Dialog
      open={open} onClose={onClose}
      title="Relancer le client · demander pièces"
      sub="Trace écrite + canal. Toute relance entre au carnet de bord."
      footer={
        <>
          <GhostBtn onClick={onClose}>Annuler</GhostBtn>
          <PrimaryBtn onClick={submit} icon="send-horizontal">Envoyer la relance</PrimaryBtn>
        </>
      }
    >
      <FormSection tag="A" title="Dossier concerné">
        <Select
          value={ref} onChange={setRef}
          options={list.map(d => ({ value: d.ref, label: `${d.ref} · ${d.client} · ${d.cargo}` }))}
        />
      </FormSection>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormSection tag="B" title="Type de relance">
          <Select value={type} onChange={setType} options={Object.keys(TEMPLATES)} />
        </FormSection>
        <FormSection tag="C" title="Canal">
          <Radio name="canal" value={canal} onChange={setCanal} options={["email", "téléphone", "visite"]} />
        </FormSection>
      </div>

      <FormSection tag="D" title="Template prérempli" hint="éditable">
        <TextArea value={tpl} onChange={(e) => setTpl(e.target.value)} rows={5} />
      </FormSection>
    </Dialog>
  );
}

// ============== ESCALADER À TUDI ==============
function EscaladeDialog({ open, onClose, dossiers, onSubmit }) {
  const list = dossiers;
  const [ref, setRef] = toolUseState(list[0]?.ref || "");
  const [motif, setMotif] = toolUseState("");
  const [urgence, setUrgence] = toolUseState("orange");

  function submit() {
    if (!ref || !motif) return;
    onSubmit({ ref, motif, urgence });
    onClose();
  }

  const urgenceOpts = [
    { value: "vert",   label: "Vert · à surveiller" },
    { value: "orange", label: "Orange · sous 24 h" },
    { value: "rouge",  label: "Rouge · immédiat" },
  ];

  return (
    <Dialog
      open={open} onClose={onClose}
      title="Escalader à Tudi · arbitrage"
      sub="Tudi reçoit la demande. Une étiquette « escaladé » apparaît sur la ligne du dossier."
      footer={
        <>
          <GhostBtn onClick={onClose}>Annuler</GhostBtn>
          <PrimaryBtn onClick={submit} icon="alert-triangle" style={{ background: "var(--warn)", borderColor: "var(--warn)", color: "#1a0f00" }}>
            Escalader à Tudi
          </PrimaryBtn>
        </>
      }
    >
      <FormSection tag="A" title="Dossier concerné">
        <Select
          value={ref} onChange={setRef}
          options={list.map(d => ({ value: d.ref, label: `${d.ref} · ${d.client} · ${d.etape}` }))}
        />
      </FormSection>

      <FormSection tag="B" title="Motif" hint="obligatoire">
        <TextArea value={motif} onChange={(e) => setMotif(e.target.value)} rows={4} placeholder="Décrire le blocage, l'arbitrage attendu, les pièces nécessaires…" />
      </FormSection>

      <FormSection tag="C" title="Urgence">
        <Radio name="urgence" value={urgence} onChange={setUrgence} options={urgenceOpts} />
      </FormSection>
    </Dialog>
  );
}

Object.assign(window, { OuvrirDossierDialog, CotationDialog, RelanceDialog, EscaladeDialog });
