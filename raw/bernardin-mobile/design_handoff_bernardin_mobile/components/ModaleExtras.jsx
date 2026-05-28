/* global React, PhoneShell, AppHeader, Chip, PhotoSlot, TextInput, SectionLabel, TouchButton, MicroTrace */
// ModaleExtras.jsx — Mode E placeholder modales (Réservation camions · Enlèvement vides · Mise à quai)
// Single artboard showing all 3 as short stub layouts.

function ModaleExtras() {
  return (
    <PhoneShell screenLabel="09 · Mode E · placeholders">
      <AppHeader
        title="Mode E · 3 modales restantes"
        subtitle="Wireframes courts · à détailler en wave 2"
        right={<Chip kind="cream" compact mono>Mode E</Chip>}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 28px" }}>

        <StubModale
          stepCode="10"
          title="Réservation camions"
          timing="J−2 · J−1"
          fields={[
            { label: "Transporteur", value: "TRC Nord" },
            { label: "Nombre camions", value: "3" },
            { label: "Heure rendez-vous", value: "06:30", mono: true },
          ]}
          photos={[]}
          cta="Réservation OK"
        />

        <StubModale
          stepCode="14"
          title="Enlèvement conteneurs vides"
          subtitle="Chez ligne maritime"
          timing="J0"
          fields={[
            { label: "Ligne maritime", value: "MSC" },
            { label: "N° conteneurs", value: "3 × 20'", mono: true },
            { label: "BAD reçu", value: "Oui · n° MSC-2418" },
          ]}
          photos={["État conteneur 1", "État conteneur 2"]}
          cta="Conteneurs récupérés"
        />

        <StubModale
          stepCode="16"
          title="Mise à quai"
          subtitle="Positionnement quai port"
          timing="J+2"
          fields={[
            { label: "Quai", value: "Q3 nord" },
            { label: "Heure arrivée", value: "08:14", mono: true },
          ]}
          photos={["Position quai"]}
          cta="Camion à quai"
          last
        />

      </div>
    </PhoneShell>
  );
}

function StubModale({ stepCode, title, subtitle, timing, fields, photos, cta, last }) {
  return (
    <div
      style={{
        background: "#161A24",
        border: "1px solid #242835",
        borderRadius: 8,
        padding: "14px 16px",
        marginBottom: last ? 0 : 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            fontWeight: 600,
            color: "#3EAA9B",
            background: "rgba(62, 170, 155, 0.14)",
            padding: "2px 6px",
            borderRadius: 2,
            letterSpacing: "0.04em",
          }}
        >
          étape {stepCode}
        </span>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            color: "rgba(240,238,235,0.55)",
            border: "1px solid #2A3145",
            padding: "1px 5px",
            borderRadius: 2,
            letterSpacing: "0.04em",
          }}
        >
          {timing}
        </span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#F0EEEB", letterSpacing: "-0.005em", lineHeight: 1.2 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 11.5, color: "rgba(240,238,235,0.55)", marginTop: 2 }}>{subtitle}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px", marginTop: 12 }}>
        {fields.map((f, i) => (
          <div key={i}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(240,238,235,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {f.label}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: "#F0EEEB",
                marginTop: 2,
                fontFamily: f.mono ? "IBM Plex Mono, monospace" : "Inter, sans-serif",
                letterSpacing: f.mono ? "-0.01em" : "0",
              }}
            >
              {f.value}
            </div>
          </div>
        ))}
      </div>

      {photos && photos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${photos.length}, 1fr)`, gap: 6, marginTop: 10 }}>
          {photos.map((p, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1 / 1",
                background: "rgba(255,255,255,0.025)",
                border: "1px dashed rgba(240,238,235,0.18)",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 6,
                textAlign: "center",
                fontSize: 9.5,
                color: "rgba(240,238,235,0.45)",
                lineHeight: 1.2,
                letterSpacing: "0.02em",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          minHeight: 40,
          background: "rgba(45, 134, 89, 0.14)",
          border: "1px solid rgba(45, 134, 89, 0.35)",
          color: "#7BD9A4",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {cta}
      </div>
    </div>
  );
}

window.ModaleExtras = ModaleExtras;
