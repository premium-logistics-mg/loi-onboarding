/* global React, PhoneShell, AppHeader, BottomNav, Chip, MiniGauge, SectionLabel */
// HomeJour.jsx — Screen 1 · Home jour (Bernardin's day list)

function HomeJour() {
  return (
    <PhoneShell screenLabel="01 · Home jour">
      <HomeHeader />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <HomeContent />
      </div>
      <BottomNav active="home" />
      <SyncFAB />
    </PhoneShell>
  );
}

function HomeHeader() {
  return (
    <div style={{ padding: "8px 18px 12px", borderBottom: "1px solid #1A1F2E" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "rgba(240,238,235,0.55)", letterSpacing: "0.04em" }}>
            Bonjour
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#F0EEEB", letterSpacing: "-0.015em", lineHeight: 1.15 }}>
            Bernardin
          </div>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "rgba(240,238,235,0.6)" }}>
            28 mai 2026
          </span>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: "rgba(240,238,235,0.65)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Agent terrain · port Toamasina
          </span>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* KPIs hero — règle 3-5-7, ici 4 mini-gauges */}
      <SectionLabel>Mes scores du moment</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 18px" }}>
        <MiniGauge code="B-K01" label="Délai ATA → livraison Mode A" value="3,2" unit="j" target="≤ ETA+4" pct={0.85} status="ok" />
        <MiniGauge code="B-K02" label="Livraison → restitution vide" value="28" unit="h" target="≤ 24h" pct={0.55} status="warn" />
        <MiniGauge code="B-K03" label="Empotages dans timing closing" value="100" unit="%" target="100 %" pct={1.0} status="ok" />
        <MiniGauge code="B-K04" label="Visites Rouge clôturées même jour" value="72" unit="%" target="≥ 80 %" pct={0.72} status="warn" />
      </div>

      <SectionLabel count="6 dossiers" right={
        <span style={{ fontSize: 11, color: "#3EAA9B", fontWeight: 500 }}>Filtrer</span>
      }>
        Dossiers du jour
      </SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 18px 32px" }}>
        <DossierCard
          mode="A"
          dossierNo="FAI 2026 0418"
          client="PENTA-OCEAN"
          etape="Livraison marchandise"
          stepCode="15"
          timing="ETA+3"
          prio="ok"
          containerNo="MSCU 4729183"
        />
        <DossierCard
          mode="A"
          dossierNo="FAI 2026 0414"
          client="ANDIS MADAGASCAR"
          etape="Visite douanière Rouge"
          stepCode="13a"
          timing="ETA+2"
          prio="warn"
          containerNo="GESU 5118402"
        />
        <DossierCard
          mode="E"
          dossierNo="FAE 2026 0207"
          client="MG-MINE"
          etape="Empotage marchandise"
          stepCode="15"
          timing="J+1"
          prio="ok"
          containerNo="MSCU 9134721"
        />
        <DossierCard
          mode="A"
          dossierNo="FAI 2026 0411"
          client="NS ENTREPRISE"
          etape="Restitution vide"
          stepCode="16"
          timing="ETA+5"
          prio="err"
          containerNo="TGHU 6204880"
          late="dérive 6h"
        />
        <DossierCard
          mode="E"
          dossierNo="FAE 2026 0208"
          client="YUE FENG"
          etape="Réservation camions"
          stepCode="10"
          timing="J−2"
          prio="ok"
          containerNo="3 × 20'"
        />
        <DossierCard
          mode="E"
          dossierNo="FAE 2026 0205"
          client="MG NEW DEAL"
          etape="Mise à quai"
          stepCode="16"
          timing="J+2"
          prio="ok"
          containerNo="MSCU 9132018"
        />
      </div>
    </div>
  );
}

function DossierCard({ mode, dossierNo: ref, client, etape, stepCode, timing, prio, containerNo, late }) {
  const prioColor = prio === "ok" ? "#5BC58B" : prio === "warn" ? "#E3A053" : "#E4734D";

  return (
    <a
      href={ref === "FAI 2026 0414" ? "Vue dossier.html" : "#"}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        background: "#161A24",
        border: "1px solid #242835",
        borderLeft: `3px solid ${prioColor}`,
        borderRadius: 6,
        padding: "12px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <Chip kind={mode === "A" ? "navy" : "cream"} compact mono>
            Mode {mode}
          </Chip>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 12,
              color: "rgba(240,238,235,0.85)",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {ref}
          </span>
        </div>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 12,
            fontWeight: 600,
            color: prioColor,
            letterSpacing: "-0.01em",
          }}
        >
          {timing}
        </span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#F0EEEB", letterSpacing: "-0.005em", marginBottom: 6 }}>
        {client}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              color: "rgba(240,238,235,0.45)",
              padding: "2px 5px",
              border: "1px solid #2A3145",
              borderRadius: 2,
            }}
          >
            étape {stepCode}
          </span>
          <span style={{ fontSize: 12, color: "rgba(240,238,235,0.75)" }}>{etape}</span>
        </div>
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #1F2433", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "rgba(240,238,235,0.55)", letterSpacing: "-0.01em" }}>
          {containerNo}
        </span>
        {late && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#E4734D",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {late}
          </span>
        )}
        {!late && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,238,235,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </div>
    </a>
  );
}

function SyncFAB() {
  return (
    <div
      style={{
        position: "absolute",
        right: 16,
        bottom: 86,
        background: "#1A8E7E",
        color: "#07140F",
        boxShadow: "0 6px 18px rgba(0,0,0,0.45), 0 0 0 1px rgba(62,170,155,0.4)",
        borderRadius: 999,
        height: 52,
        padding: "0 22px 0 18px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
        <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
      </svg>
      Synchroniser
    </div>
  );
}

window.HomeJour = HomeJour;
