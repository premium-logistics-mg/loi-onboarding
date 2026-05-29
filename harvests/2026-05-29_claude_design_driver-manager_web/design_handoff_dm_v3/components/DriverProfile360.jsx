/* global React, StatusChip, PillarChip, StatusDot, GaugeBar, Sparkline, docState, sevColor */
/* ============================================================
   DriverProfile360.jsx — Section 1.7 · profil 360° chauffeur · 7 tabs
   pills horizontaux (Lucide line icons · D82 no-emoji)
   ============================================================ */
const { useState: useStateDP, useEffect: useEffectDP } = React;

const P360_TABS = [
  { id: "identite",   label: "Identité",            icon: "user" },
  { id: "perf",       label: "Performance",         icon: "bar-chart-2" },
  { id: "safety",     label: "Safety",              icon: "alert-triangle" },
  { id: "wellness",   label: "Wellness & Coaching", icon: "heart-handshake" },
  { id: "m13",        label: "M13 filtré",          icon: "notebook-pen" },
  { id: "vehicule",   label: "Véhicule alloué",     icon: "shield" },
  { id: "client",     label: "Performance client",  icon: "handshake" },
];

const STAT_KIND = { actif: "ok", conge: "warn", maladie: "err" };

function Row({ k, v, mono = true, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "9px 0", borderBottom: "1px solid var(--border-soft)", gap: 16 }}>
      <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{k}</span>
      <span style={{ fontFamily: mono ? "IBM Plex Mono, monospace" : "Inter", fontSize: 13, color: color || "var(--fg-1)", textAlign: "right", fontWeight: 500 }}>{v}</span>
    </div>
  );
}

function MiniKpi({ label, value, unit, status, spark }) {
  const color = status === "ok" ? "var(--ok)" : status === "warn" ? "var(--warn)" : status === "err" ? "var(--err)" : "var(--fg-1)";
  return (
    <div style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 6, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 24, fontWeight: 500, color, lineHeight: 1 }}>{value}<span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--fg-3)", marginLeft: 3 }}>{unit}</span></span>
        {spark && <Sparkline points={spark} width={70} height={26} color={color} showEndpoint />}
      </div>
    </div>
  );
}

function P360Body({ tab, d }) {
  if (tab === "identite") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
      <div>
        <Row k="Matricule PL" v={`PL-CHF-${d.id.slice(4)}`} />
        <Row k="Identité (mock)" v={d.name} mono={false} />
        <Row k="Permis · catégorie" v={d.cat} />
        <Row k="Permis · échéance" v={`${d.permisExp}${d.permisDays < 60 ? ` · ${d.permisDays} j` : ""}`} color={d.permisDays < 60 ? "var(--warn)" : undefined} />
        <Row k="Ancienneté" v={`${d.anc} ans`} />
      </div>
      <div>
        <Row k="Visite médicale" v={d.medExp} color={d.medDays < 0 ? "var(--err)" : d.medDays < 60 ? "var(--warn)" : undefined} />
        <Row k="Statut médical" v={d.medDays < 0 ? "expirée · à convoquer" : "à jour"} mono={false} color={d.medDays < 0 ? "var(--err)" : "var(--ok)"} />
        <div style={{ paddingTop: 14 }}>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600 }}>Habilitations</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {d.habilitations.map((h, i) => <StatusChip key={i} kind="accent" dot={false}>{h}</StatusChip>)}
          </div>
        </div>
      </div>
    </div>
  );

  if (tab === "perf") return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      <MiniKpi label="Départs à l'heure" value="95" unit="%" status="ok" spark={[91,92,93,94,95,94,95]} />
      <MiniKpi label="Voyages clôturés propres" value={String(34 + (d.permisDays % 9))} unit="" status="ok" spark={[28,30,31,33,32,34,34]} />
      <MiniKpi label="Incidents 30 j" value={String(d.inc)} unit="" status={d.inc > 0 ? "warn" : "ok"} spark={d.inc > 0 ? [0,1,0,1,1,1,1] : [0,0,0,0,0,0,0]} />
      <MiniKpi label="Tonnage respecté" value="98" unit="%" status="ok" spark={[96,97,97,98,97,98,98]} />
      <MiniKpi label="Km parcourus / mois" value={(7100 + d.permisDays * 3).toLocaleString("fr-FR")} unit="km" status="neutral" />
      <MiniKpi label="Score perso mensuel" value={String(d.score)} unit="/100" status={d.score >= 75 ? "ok" : d.score >= 60 ? "warn" : "err"} spark={[d.score-4,d.score-2,d.score-3,d.score-1,d.score-2,d.score-1,d.score]} />
      <div style={{ gridColumn: "1 / -1", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>cumul W02 + W07 · cascade D54</div>
    </div>
  );

  if (tab === "safety") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <MiniKpi label="MTV urgent · 30 j" value="0" unit="" status="ok" />
        <MiniKpi label="MTV probleme · 30 j" value={d.id === "DRV-012" ? "1" : "0"} unit="" status={d.id === "DRV-012" ? "warn" : "ok"} />
        <MiniKpi label="Presque-accidents" value={d.inc > 0 ? "1" : "0"} unit="" status={d.inc > 0 ? "warn" : "ok"} />
      </div>
      <div style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 6, padding: 16 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600, marginBottom: 10 }}>Plan sécurité</div>
        {d.inc > 0 || d.id === "DRV-012" ? (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <i data-lucide="shield-alert" style={{ width: 16, height: 16, color: "var(--warn)", marginTop: 2 }} />
            <div style={{ fontSize: 13, color: "var(--fg-1)", lineHeight: 1.5 }}>Plan actif · briefing renforcé descente RN44 · revue en 1-on-1 W16 sous 24 h.</div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ok)", fontSize: 13 }}>
            <i data-lucide="check-circle-2" style={{ width: 16, height: 16 }} /> Aucun plan sécurité actif · RAS sur 30 j.
          </div>
        )}
      </div>
    </div>
  );

  if (tab === "wellness") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <MiniKpi label="Dernier 1-on-1" value={d.oooDays} unit="j" status={d.oooDays > 35 ? "err" : "ok"} />
        <MiniKpi label="Cadence M03" value="mensuelle" unit="" status="neutral" />
        <MiniKpi label="Actions ouvertes" value={d.oooDays > 35 ? "2" : "1"} unit="" status={d.oooDays > 35 ? "warn" : "ok"} />
      </div>
      <div style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 6, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <Row k="Dernier 1-on-1" v={d.oneOnOne} />
        <Row k="Prochain 1-on-1" v={d.oooDays > 35 ? "à programmer · RETARD" : "cycle suivant"} color={d.oooDays > 35 ? "var(--err)" : undefined} />
        <Row k="Cadence dépassée" v={d.oooDays > 35 ? `${d.oooDays} j (> 35 j)` : "non"} color={d.oooDays > 35 ? "var(--err)" : "var(--ok)"} />
      </div>
    </div>
  );

  if (tab === "m13") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border-soft)", borderRadius: 6, overflow: "hidden" }}>
      {(window.SERGE.m13.filter(m => m.driver === d.id).length
        ? window.SERGE.m13.filter(m => m.driver === d.id)
        : [{ ts: "—", cat: "voyage", note: "Aucune entrée M13 spécifique sur 30 j", owner: "Serge", statut: "closed" }]
      ).map((m, i, arr) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid var(--border-soft)" : "none", alignItems: "center" }}>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>{m.ts}</span>
          <span style={{ fontSize: 12, color: "var(--fg-1)" }}>{m.note}</span>
          <StatusChip kind={m.statut === "open" ? "warn" : m.statut === "in_progress" ? "accent" : "ok"} mono>{m.statut}</StatusChip>
        </div>
      ))}
    </div>
  );

  if (tab === "vehicule") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 6, padding: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="truck" style={{ width: 22, height: 22, color: "var(--accent)" }} />
        </div>
        <div>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 18, fontWeight: 600, color: "var(--fg-1)" }}>{d.ct}</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)" }}>SCHACMAN F3000 6X4 · benne 20 m³ · allocation 1:1</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
        <div>
          <Row k="Kilométrage" v={`${d.km.toLocaleString("fr-FR")} km`} />
          <Row k="Charge utile" v="25 – 40 T" />
          <Row k="Matière transportée" v={d.matiere} mono={false} />
        </div>
        <div>
          <Row k="État véhicule" v="opérationnel" mono={false} color="var(--ok)" />
          <Row k="Dégâts en cours" v={d.inc > 0 ? "1 · en revue MM" : "aucun"} color={d.inc > 0 ? "var(--warn)" : "var(--ok)"} />
          <Row k="Responsabilité dégât" v={d.inc > 0 ? "à statuer" : "—"} />
        </div>
      </div>
    </div>
  );

  if (tab === "client") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <PillarChip pillar="P3" />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>{d.client}</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>· {d.route}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <MiniKpi label={d.client === "PENTA_OCEAN" ? "Voyages PENTA · mois" : "Forfait SC · mois"} value={d.client === "PENTA_OCEAN" ? String(18 + (d.permisDays % 6)) : "100"} unit={d.client === "PENTA_OCEAN" ? "voyages" : "%"} status="ok" />
        <MiniKpi label="Consignes dispatch" value="respectées" unit="" status="ok" />
        <MiniKpi label="Feedback client" value={d.score >= 80 ? "positif" : "neutre"} unit="" status={d.score >= 80 ? "ok" : "neutral"} />
      </div>
      <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>
        {d.client === "PENTA_OCEAN" ? "PENTA_OCEAN · granulats · facturation variable voyages" : "SC_SERVICES · forfait 20 M MGA / mois"}
      </div>
    </div>
  );

  return null;
}

function DriverProfile360({ driver, onClose }) {
  const [tab, setTab] = useStateDP("identite");
  useEffectDP(() => { const t = setTimeout(() => window.lucide && lucide.createIcons(), 30); return () => clearTimeout(t); }, [tab, driver]);
  if (!driver) return null;
  const d = driver;
  const scoreColor = d.score >= 75 ? "var(--ok)" : d.score >= 60 ? "var(--warn)" : "var(--err)";

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--accent)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-2)" }}>
      {/* Header drawer */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border-soft)", flexWrap: "wrap" }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: "var(--accent-soft)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "IBM Plex Mono, monospace", fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{d.id.slice(4)}</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 16, fontWeight: 600, color: "var(--fg-1)" }}>{d.id}</span>
            <StatusChip kind={STAT_KIND[d.statut]} mono>{d.statut}</StatusChip>
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-3)" }}>{d.name} · véhicule alloué {d.ct} · {d.client}</div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginLeft: 12 }}>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600 }}>Score</span>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 22, fontWeight: 600, color: scoreColor }}>{d.score}<span style={{ fontFamily: "Inter", fontSize: 11, color: "var(--fg-3)" }}>/100</span></span>
        </div>
        <span style={{ flex: 1 }} />
        <button onClick={onClose} aria-label="Fermer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid var(--border)", color: "var(--fg-2)", cursor: "pointer", padding: "7px 12px", borderRadius: 4, fontSize: 12 }}>
          <i data-lucide="x" style={{ width: 14, height: 14 }} /> Fermer
        </button>
      </div>

      {/* 7 tabs pills */}
      <div style={{ display: "flex", gap: 6, padding: "12px 22px", borderBottom: "1px solid var(--border-soft)", overflowX: "auto" }}>
        {P360_TABS.map(t => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500,
              background: on ? "var(--accent)" : "var(--bg-elev-1)", color: on ? "var(--accent-fg)" : "var(--fg-2)",
              border: `1px solid ${on ? "transparent" : "var(--border)"}`, transition: "all 120ms",
            }}>
              <i data-lucide={t.icon} style={{ width: 13, height: 13 }} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 22 }}><P360Body tab={tab} d={d} /></div>
    </div>
  );
}

window.DriverProfile360 = DriverProfile360;
