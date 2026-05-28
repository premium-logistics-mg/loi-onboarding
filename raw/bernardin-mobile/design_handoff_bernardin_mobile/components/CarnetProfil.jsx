/* global React, PhoneShell, AppHeader, BottomNav, SectionLabel, Chip */
// CarnetProfil.jsx — Screen 8 · Carnet de bord (M13 trace) + Profil

function CarnetProfil() {
  return (
    <PhoneShell screenLabel="08 · Carnet + Profil">
      <AppHeader
        title="Carnet de bord"
        subtitle="Actions tracées M13"
      />
      <FilterBar />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <CarnetList />
        <ProfilBlock />
      </div>
      <BottomNav active="carnet" />
    </PhoneShell>
  );
}

function FilterBar() {
  const items = ["Toutes", "Aujourd'hui", "Cette semaine"];
  return (
    <div style={{ padding: "12px 18px", display: "flex", gap: 6, borderBottom: "1px solid #1A1F2E", flexShrink: 0 }}>
      {items.map((it, i) => (
        <div
          key={it}
          style={{
            flex: 1,
            minHeight: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
            background: i === 1 ? "#1A8E7E" : "transparent",
            color: i === 1 ? "#07140F" : "rgba(240,238,235,0.65)",
            border: `1px solid ${i === 1 ? "transparent" : "#242835"}`,
            borderRadius: 4,
            letterSpacing: "0.02em",
          }}
        >
          {it}
        </div>
      ))}
    </div>
  );
}

function CarnetList() {
  const events = [
    { time: "15:48", step: "16", dossier: "FAI 0411", action: "Restitution conteneur vide", note: "TGHU 6204880 · MSC · à noter", status: "ok" },
    { time: "14:02", step: "15", dossier: "FAI 0418", action: "Livraison marchandise", note: "PENTA-OCEAN · signé · état bon", status: "ok" },
    { time: "11:42", step: "15", dossier: "FAE 0207", action: "Empotage marchandise", note: "MG-MINE · 24,8 t · scellés MSC 11820", status: "ok" },
    { time: "10:35", step: "—", dossier: "FAI 0414", action: "Escalade Tudi", note: "Anomalie scellés cassés · Circuit Rouge", status: "warn" },
    { time: "09:14", step: "13a", dossier: "FAI 0414", action: "Visite douanière Rouge", note: "ANDIS MADAGASCAR · 4 photos · officier RAKOTO", status: "warn" },
    { time: "08:30", step: "10", dossier: "FAE 0208", action: "Réservation camions", note: "YUE FENG · 3 × 20' · transporteur TRC Nord", status: "ok" },
  ];

  return (
    <div style={{ padding: "0 18px" }}>
      <SectionLabel count="6 actions">28 mai 2026</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {events.map((e, i) => (
          <CarnetRow key={i} {...e} />
        ))}
      </div>
    </div>
  );
}

function CarnetRow({ time, step, dossier, action, note, status }) {
  const dotColor = status === "ok" ? "#5BC58B" : status === "warn" ? "#E3A053" : "#E4734D";
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid #1A1F2E",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "rgba(240,238,235,0.7)", fontWeight: 500, letterSpacing: "-0.01em" }}>
          {time}
        </span>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: dotColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 9.5,
              color: "rgba(240,238,235,0.55)",
              border: "1px solid #2A3145",
              padding: "1px 5px",
              borderRadius: 2,
              letterSpacing: "0.04em",
            }}
          >
            {step === "—" ? "—" : `étape ${step}`}
          </span>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, color: "rgba(240,238,235,0.6)" }}>
            {dossier}
          </span>
        </div>
        <div style={{ fontSize: 13.5, color: "#F0EEEB", fontWeight: 500, letterSpacing: "-0.005em" }}>
          {action}
        </div>
        <div style={{ fontSize: 11.5, color: "rgba(240,238,235,0.6)", marginTop: 3, lineHeight: 1.35 }}>
          {note}
        </div>
      </div>
    </div>
  );
}

function ProfilBlock() {
  return (
    <div style={{ padding: "20px 18px 32px", borderTop: "1px solid #1A1F2E", marginTop: 18, background: "rgba(255,255,255,0.012)" }}>
      <SectionLabel>Profil</SectionLabel>
      <div
        style={{
          background: "#161A24",
          border: "1px solid #242835",
          borderRadius: 8,
          padding: "14px 16px",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "#0B2540",
            color: "#3EAA9B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "IBM Plex Mono, monospace",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "-0.01em",
            border: "1px solid rgba(62, 170, 155, 0.3)",
          }}
        >
          BR
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#F0EEEB", letterSpacing: "-0.005em" }}>
            Bernardin
          </div>
          <div style={{ fontSize: 11, color: "rgba(240,238,235,0.55)", marginTop: 2 }}>
            Agent terrain · Agent liquidateur
          </div>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10.5, color: "rgba(240,238,235,0.45)", marginTop: 3 }}>
            sous Tudi · T&D N3
          </div>
        </div>
      </div>

      <Setting label="Mode hors-ligne" right={<Switch on />} />
      <Setting label="Notifications" hint="Rappels manuels uniquement" right={<Switch />} />
      <Setting label="Langue" right={
        <span style={{ fontSize: 12, color: "rgba(240,238,235,0.7)" }}>
          Français <span style={{ color: "rgba(240,238,235,0.4)" }}>· FR / MG</span>
        </span>
      } />
      <Setting label="Compression photo" right={
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "rgba(240,238,235,0.7)" }}>
          1280 px · 70 %
        </span>
      } />
    </div>
  );
}

function Setting({ label, hint, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid #1A1F2E",
        minHeight: 48,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: "#F0EEEB", fontWeight: 500 }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: "rgba(240,238,235,0.5)", marginTop: 2 }}>{hint}</div>}
      </div>
      {right}
    </div>
  );
}

function Switch({ on = false }) {
  return (
    <div
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        background: on ? "#1A8E7E" : "rgba(255,255,255,0.08)",
        position: "relative",
        flexShrink: 0,
        border: on ? "1px solid #3EAA9B" : "1px solid #242835",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: on ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: 999,
          background: on ? "#07140F" : "rgba(240,238,235,0.85)",
        }}
      />
    </div>
  );
}

window.CarnetProfil = CarnetProfil;
