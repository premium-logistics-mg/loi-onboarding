/* global React, PhoneShell, AppHeader, Chip, TouchButton, SectionLabel, PhotoSlot, SignaturePad, TextInput, MicroTrace, SegmentedChoice */
// Modales.jsx — Screens 3..6 · 4 detailed modales (Visite Rouge, Livraison, Restitution, Empotage)
// + Screen "extras" with the 3 Mode E placeholder modales

/* ─── helpers shared by modales ──────────────────────────────────────── */

function ModaleHeader({ title, sub, mode, stepCode }) {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: "14px 18px",
        background: "#0B2540",
        borderBottom: "1px solid #1A2D4B",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <button
          aria-label="Fermer"
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F0EEEB",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Chip kind={mode === "A" ? "navy" : "cream"} compact mono>Mode {mode}</Chip>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              color: "rgba(240,238,235,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 2,
              padding: "2px 6px",
              letterSpacing: "0.04em",
            }}
          >
            étape {stepCode}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#F0EEEB", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
        {title}
      </div>
      <div style={{ fontSize: 12, color: "rgba(240,238,235,0.65)", marginTop: 3, fontFamily: "IBM Plex Mono, monospace" }}>
        {sub}
      </div>
    </div>
  );
}

function ModaleFooter({ primary, primaryKind = "success", secondary, secondaryKind = "warn", disabled = false }) {
  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: "1px solid #1A1F2E",
        background: "#0B0F1A",
        padding: "12px 16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <TouchButton kind={primaryKind} disabled={disabled}>{primary}</TouchButton>
      {secondary && (
        <TouchButton kind={secondaryKind}>{secondary}</TouchButton>
      )}
    </div>
  );
}

/* ─── Screen 3 — Visite douanière Rouge (Mode A · 13a) ───────────────── */

function ModaleVisiteDouane() {
  return (
    <PhoneShell screenLabel="03 · Modale visite douane">
      <ModaleHeader
        title="Visite douanière · Circuit Rouge"
        sub="FAI 2026 0414 · ANDIS MADAGASCAR"
        mode="A"
        stepCode="13a"
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 8px" }}>
        <FieldGroup>
          <SectionTitle>Capture photo · 2 à 4 clichés</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <PhotoSlot label="Zone de fouille" filled />
            <PhotoSlot label="Marchandise" filled />
            <PhotoSlot label="Scellés cassés" />
            <PhotoSlot label="État conteneur" />
          </div>
        </FieldGroup>

        <FieldGroup>
          <SectionTitle>Signature officier douane</SectionTitle>
          <SignaturePad filled />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(240,238,235,0.6)" }}>
              Officier · <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "#F0EEEB" }}>RAKOTO H.</span>
            </span>
            <span style={{ fontSize: 11, color: "#3EAA9B", fontWeight: 500 }}>Effacer</span>
          </div>
        </FieldGroup>

        <FieldGroup>
          <SectionTitle optional>Anomalie observée</SectionTitle>
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid #242835",
              borderRadius: 4,
              minHeight: 70,
              padding: "10px 14px",
              fontSize: 13,
              color: "rgba(240,238,235,0.45)",
            }}
          >
            Décrire si la marchandise ou les scellés présentent une anomalie…
          </div>
        </FieldGroup>

        <MicroTrace gps="−18.1492, 49.4023" time="28 mai · 09:14" owner="Bernardin" />
      </div>
      <ModaleFooter
        primary="Visite OK"
        primaryKind="success"
        secondary="Visite + anomalie"
        secondaryKind="warn"
      />
    </PhoneShell>
  );
}

/* ─── Screen 4 — Livraison client (Mode A · 15) ──────────────────────── */

function ModaleLivraison() {
  return (
    <PhoneShell screenLabel="04 · Modale livraison">
      <ModaleHeader
        title="Livraison marchandise"
        sub="FAI 2026 0418 · PENTA-OCEAN"
        mode="A"
        stepCode="15"
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 8px" }}>
        <FieldGroup>
          <SectionTitle>Signature client</SectionTitle>
          <SignaturePad />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "rgba(240,238,235,0.55)" }}>
              En attente · signature obligatoire
            </span>
          </div>
        </FieldGroup>

        <FieldGroup>
          <SectionTitle>BL signé + tamponné</SectionTitle>
          <PhotoSlot label="Cliché du BL" />
        </FieldGroup>

        <FieldGroup>
          <SectionTitle optional>État marchandise général</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <PhotoSlot label="Vue d'ensemble" small filled />
            <PhotoSlot label="Détail" small />
          </div>
        </FieldGroup>

        <FieldGroup>
          <SectionTitle>État conteneur post-livraison</SectionTitle>
          <SegmentedChoice options={["Bon", "Légères", "Majeures"]} value="Bon" />
        </FieldGroup>

        <MicroTrace gps="−18.1455, 49.4108" time="28 mai · 14:02" owner="Bernardin" />
      </div>
      <ModaleFooter
        primary="Livré · OK"
        primaryKind="success"
        disabled
      />
    </PhoneShell>
  );
}

/* ─── Screen 5 — Restitution conteneur vide (Mode A · 16) ────────────── */

function ModaleRestitution() {
  return (
    <PhoneShell screenLabel="05 · Modale restitution vide">
      <ModaleHeader
        title="Restitution conteneur vide"
        sub="FAI 2026 0411 · ligne maritime"
        mode="A"
        stepCode="16"
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 8px" }}>
        <FieldGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <TextInput label="N° conteneur" value="TGHU 6204880" mono />
            <TextInput label="Ligne maritime" value="MSC" />
          </div>
        </FieldGroup>

        <FieldGroup>
          <SectionTitle>État conteneur final</SectionTitle>
          <SegmentedChoice options={["Bon", "À noter", "Endommagé"]} value="À noter" />
        </FieldGroup>

        <FieldGroup>
          <SectionTitle>Photos</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <PhotoSlot label="Scellés (vide)" filled />
            <PhotoSlot label="Conteneur global" filled />
          </div>
        </FieldGroup>

        <FieldGroup>
          <SectionTitle optional>Note dépôt</SectionTitle>
          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid #242835",
              borderRadius: 4,
              minHeight: 56,
              padding: "10px 14px",
              fontSize: 13,
              color: "#F0EEEB",
            }}
          >
            Légère bosselure paroi droite · à signaler ligne avant remise.
          </div>
        </FieldGroup>

        <MicroTrace gps="−18.1338, 49.4181" time="28 mai · 15:48" owner="Bernardin" />
      </div>
      <ModaleFooter primary="Restitué" primaryKind="success" />
    </PhoneShell>
  );
}

/* ─── Screen 6 — Empotage (Mode E · 15) ──────────────────────────────── */

function ModaleEmpotage() {
  return (
    <PhoneShell screenLabel="06 · Modale empotage">
      <ModaleHeader
        title="Empotage marchandise"
        sub="FAE 2026 0207 · MG-MINE"
        mode="E"
        stepCode="15"
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 8px" }}>
        <FieldGroup>
          <SectionTitle>Empotage en cours</SectionTitle>
          <PhotoSlot label="Chargement conteneur" filled />
        </FieldGroup>

        <FieldGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <TextInput label="Poids final" value="24,8" suffix="t" mono />
            <TextInput label="N° scellés posés" value="MSC 11820" mono />
          </div>
        </FieldGroup>

        <FieldGroup>
          <SectionTitle>Preuve photo</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <PhotoSlot label="Scellés posés" small filled />
            <PhotoSlot label="BL endossé" small />
          </div>
        </FieldGroup>

        <FieldGroup>
          <SectionTitle>Closing date</SectionTitle>
          <div
            style={{
              background: "rgba(45, 134, 89, 0.12)",
              border: "1px solid rgba(45, 134, 89, 0.35)",
              borderRadius: 4,
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 12, color: "rgba(240,238,235,0.85)" }}>
              Closing · <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "#F0EEEB" }}>30/05/26 12:00</span>
            </span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "#5BC58B", fontWeight: 600 }}>
              dans timing · −38 h
            </span>
          </div>
        </FieldGroup>

        <MicroTrace gps="−18.1518, 49.3978" time="29 mai · 11:42" owner="Bernardin" />
      </div>
      <ModaleFooter primary="Empotage OK" primaryKind="success" />
    </PhoneShell>
  );
}

/* ─── Small helpers ──────────────────────────────────────────────────── */

function FieldGroup({ children }) {
  return <div style={{ marginBottom: 18 }}>{children}</div>;
}

function SectionTitle({ children, optional = false }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        color: "rgba(240,238,235,0.6)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 8,
        display: "flex",
        alignItems: "baseline",
        gap: 8,
      }}
    >
      <span>{children}</span>
      {optional && (
        <span
          style={{
            fontSize: 9,
            color: "rgba(240,238,235,0.4)",
            fontWeight: 500,
            letterSpacing: "0.06em",
          }}
        >
          optionnel
        </span>
      )}
    </div>
  );
}

window.ModaleVisiteDouane = ModaleVisiteDouane;
window.ModaleLivraison = ModaleLivraison;
window.ModaleRestitution = ModaleRestitution;
window.ModaleEmpotage = ModaleEmpotage;
