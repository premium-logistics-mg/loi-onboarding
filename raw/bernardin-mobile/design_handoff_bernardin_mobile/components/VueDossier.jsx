/* global React, PhoneShell, AppHeader, Chip, TouchButton, SectionLabel */
// VueDossier.jsx — Screen 2 · Vue dossier sélectionné (with timeline + 3 big actions)

function VueDossier() {
  return (
    <PhoneShell screenLabel="02 · Vue dossier">
      <AppHeader
        onBack={() => {}}
        title="FAI 2026 0414"
        subtitle="ANDIS MADAGASCAR · Mode A"
        right={
          <Chip kind="warn" compact mono>ETA+2</Chip>
        }
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <CrossLinkNav />
        <TimelineBlock />
        <ActionsBlock />
        <DocumentationBlock />
      </div>
    </PhoneShell>
  );
}

function CrossLinkNav() {
  return (
    <div
      style={{
        margin: "12px 18px 0",
        padding: "8px 12px",
        background: "rgba(62, 170, 155, 0.08)",
        border: "1px solid rgba(62, 170, 155, 0.22)",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 11,
        color: "rgba(240,238,235,0.7)",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3EAA9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" />
      </svg>
      <span style={{ flex: 1 }}>
        Vue web supervisée par Tudi · <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "#3EAA9B" }}>/cockpit/tudi</span>
      </span>
    </div>
  );
}

function TimelineBlock() {
  // Mode A · 3 Bernardin steps (13a, 15, 16). Current is 13a Visite Rouge.
  // Upstream steps from the 19-step canonical: 1..13 (déclaration, paiement, etc.)
  // Downstream: 17 (caution Mohamed), 18, 19.
  const steps = [
    { id: "11", label: "Paiement", state: "done" },
    { id: "12", label: "BAE", state: "done" },
    { id: "13", label: "Sortie douane", state: "done", note: "Circuit Rouge" },
    { id: "13a", label: "Visite douanière", state: "current", owner: "Bernardin" },
    { id: "15", label: "Livraison", state: "pending", owner: "Bernardin" },
    { id: "16", label: "Restitution vide", state: "pending", owner: "Bernardin" },
    { id: "17", label: "Caution", state: "pending", owner: "Mohamed" },
  ];

  return (
    <div style={{ padding: "16px 0 6px" }}>
      <SectionLabel>Étapes du dossier</SectionLabel>
      <div
        style={{
          padding: "0 18px",
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, minWidth: "min-content", paddingBottom: 6 }}>
          {steps.map((s, i) => (
            <TimelineStep key={s.id} step={s} last={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ step, last }) {
  const palettes = {
    done:    { dot: "#2D8659", text: "rgba(240,238,235,0.55)", weight: 500 },
    current: { dot: "#3EAA9B", text: "#F0EEEB", weight: 600 },
    pending: { dot: "#3A4154", text: "rgba(240,238,235,0.40)", weight: 500 },
  };
  const p = palettes[step.state];
  const isBernardin = step.owner === "Bernardin";
  const isCurrent = step.state === "current";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", minWidth: isCurrent ? 130 : 78 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div
          style={{
            width: isCurrent ? 26 : 18,
            height: isCurrent ? 26 : 18,
            borderRadius: 999,
            background: isCurrent ? p.dot : "transparent",
            border: `2px solid ${p.dot}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isCurrent ? "#07140F" : p.dot,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: isCurrent ? 11 : 9,
            fontWeight: 600,
          }}
        >
          {step.state === "done" ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2D8659" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            step.id
          )}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: isCurrent ? 12 : 10.5,
            fontWeight: p.weight,
            color: p.text,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: isCurrent ? 120 : 72,
            padding: "0 4px",
          }}
        >
          {step.label}
        </div>
        {isBernardin && (
          <div
            style={{
              marginTop: 4,
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 8.5,
              color: isCurrent ? "#3EAA9B" : "rgba(62,170,155,0.45)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Bernardin
          </div>
        )}
        {step.note && isCurrent && (
          <div
            style={{
              marginTop: 4,
              fontSize: 9.5,
              color: "#E4734D",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {step.note}
          </div>
        )}
      </div>
      {!last && (
        <div
          style={{
            flex: 1,
            height: 2,
            background: step.state === "done" ? "#2D8659" : "#242835",
            marginTop: isCurrent ? 13 : 9,
            marginLeft: -1,
            marginRight: -1,
            minWidth: 24,
          }}
        />
      )}
    </div>
  );
}

function ActionsBlock() {
  return (
    <div style={{ padding: "12px 18px 0" }}>
      <SectionLabel>Action en cours</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: -4 }}>
        <a
          href="Modale visite douane.html"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <BigActionButton
            kind="primary"
            title="Ouvrir visite douanière Rouge"
            subtitle="Étape 13a · capture + signature officier"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h3l2-3h8l2 3h3v13H3z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            }
          />
        </a>
        <BigActionButton
          kind="warn"
          title="Escalader Mohamed / Tudi"
          subtitle="Anomalie · blocage · dérive timing"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <circle cx="12" cy="17" r="0.5" />
            </svg>
          }
        />
        <BigActionButton
          kind="ghost"
          title="Voir documentation"
          subtitle="BL · OT · packing · BAD · DAU"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="14" y2="17" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

function BigActionButton({ kind, title, subtitle, icon }) {
  const palettes = {
    primary: { bg: "#1A8E7E", color: "#07140F", border: "transparent", iconBg: "rgba(7,20,15,0.12)" },
    warn:    { bg: "rgba(199, 126, 42, 0.08)", color: "#E3A053", border: "rgba(199, 126, 42, 0.4)", iconBg: "rgba(199, 126, 42, 0.16)" },
    ghost:   { bg: "#161A24", color: "#F0EEEB", border: "#242835", iconBg: "rgba(255,255,255,0.04)" },
  };
  const p = palettes[kind];
  return (
    <div
      style={{
        minHeight: 64,
        padding: "12px 14px",
        background: p.bg,
        color: p.color,
        border: `1px solid ${p.border}`,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: p.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.005em" }}>{title}</div>
        <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 3, letterSpacing: "0", lineHeight: 1.3 }}>
          {subtitle}
        </div>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.75 }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

function DocumentationBlock() {
  return (
    <div style={{ padding: "16px 18px 32px" }}>
      <SectionLabel>Récap dossier</SectionLabel>
      <div
        style={{
          background: "#161A24",
          border: "1px solid #242835",
          borderRadius: 6,
          padding: "12px 14px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 16px",
        }}
      >
        <Row label="Conteneur" value="GESU 5118402" mono />
        <Row label="Type" value="40' HC" mono />
        <Row label="BL" value="MAEU 234810" mono />
        <Row label="Ligne" value="Maersk" />
        <Row label="Marchandise" value="Riz long grain" />
        <Row label="Poids" value="22,4 t" mono />
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, color: "rgba(240,238,235,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#F0EEEB",
          marginTop: 2,
          fontFamily: mono ? "IBM Plex Mono, monospace" : "Inter, sans-serif",
          fontWeight: 500,
          letterSpacing: mono ? "-0.01em" : "0",
        }}
      >
        {value}
      </div>
    </div>
  );
}

window.VueDossier = VueDossier;
