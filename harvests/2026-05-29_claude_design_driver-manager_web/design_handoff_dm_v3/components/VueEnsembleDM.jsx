/* global React, SERGE, Btn, StatusChip, PillarChip, StatusDot, Sparkline, GaugeBar, Modal, Field, Input, Select, Collapsible, SectionRule, FleetGridDM, DriverProfile360, SOChip, Tooltip, sevColor */
/* ============================================================
   VueEnsembleDM.jsx — ONGLET 1 · Vue d'ensemble (cœur actionnable)
   9 sections : Header composite · Banner saison · 4 hero cards ·
   Rituels M03 · 5 P0 · Fleet Grid · Profil 360° · HSE · Footer
   ============================================================ */
const { useState: useStateVE, useEffect: useEffectVE, useRef: useRefVE } = React;

/* ---------- B1 · trajectoire SO·3 (jan→déc 2026) ---------- */
function SO3Trajectory() {
  const { points, nowIndex, target } = SERGE.so3Traj;
  const W = 220, H = 58, pad = 5;
  const min = Math.min(...points, target), max = Math.max(...points, target), range = max - min || 1;
  const x = (i) => pad + (i / (points.length - 1)) * (W - pad * 2);
  const y = (v) => H - pad - ((v - min) / range) * (H - pad * 2);
  const dPast = points.slice(0, nowIndex + 1).map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const dFut = points.slice(nowIndex).map((v, i) => `${i === 0 ? "M" : "L"}${x(i + nowIndex).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <line x1={pad} x2={W - pad} y1={y(target)} y2={y(target)} stroke="var(--fg-3)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
      <line x1={x(nowIndex)} x2={x(nowIndex)} y1={pad - 2} y2={H - pad} stroke="var(--border)" strokeWidth="1" />
      <path d={dPast} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={dFut} fill="none" stroke="var(--fg-3)" strokeWidth="1.2" strokeDasharray="3 3" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(nowIndex)} cy={y(points[nowIndex])} r="2.6" fill="var(--accent)" />
      <text x={pad} y={H + 9} fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="var(--fg-3)">jan</text>
      <text x={x(nowIndex)} y={H + 9} fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="var(--accent)" textAnchor="middle">mai</text>
      <text x={W - pad} y={H + 9} fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="var(--fg-3)" textAnchor="end">déc</text>
    </svg>
  );
}

/* ---------- F1 · objectifs supérieurs · 2 cartes compactes ---------- */
function SOAlignBanner() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {SERGE.soAlign.map((so, i) => {
        const pct = Math.min(100, Math.round((so.actual / so.goal) * 100));
        const barColor = so.gap ? "var(--warn)" : "var(--ok)";
        return (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 11 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <PillarChip pillar={so.pillar} />
              <SOChip>{so.code}</SOChip>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{so.title}</span>
              <span style={{ flex: 1 }} />
              {so.gap
                ? <StatusChip kind="warn" dot={false}>gap</StatusChip>
                : <StatusChip kind="ok" dot={false}>sur trajectoire</StatusChip>}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--fg-3)" }}>Serge → {so.contrib}</span>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: "var(--fg-1)", whiteSpace: "nowrap" }}>
                {so.actual}{so.unit} <span style={{ color: "var(--fg-3)" }}>→ {so.goal}{so.unit}</span>
              </span>
            </div>
            <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: barColor, transition: "width 240ms cubic-bezier(0.2,0.7,0.2,1)" }} />
            </div>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>owner {so.owner} · {so.deadline}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- 1.1 + composite hero ---------- */
function CompositeHero() {
  const s = SERGE;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "26px 28px", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 28, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PillarChip pillar="P4" />
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-2)", fontWeight: 500 }}>Score composite Driver Manager · mensuel</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 84, fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", color: "var(--ok)" }}>{s.composite}</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 22, color: "var(--fg-3)", fontWeight: 500 }}>/ 100</span>
            <StatusChip kind="ok">dans la cible · ≥ 75</StatusChip>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 24, borderLeft: "1px solid var(--border-soft)" }}>
            <Tooltip width={300} content={
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-1)" }}>Joel · cascade D54 N3 · 4 lieutenants pondérés</div>
                {SERGE.joelCascade.lieutenants.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>{l.who}</span>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--accent)" }}>{l.w}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: "var(--border-soft)" }} />
                <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-1)" }}>Composite Joel {SERGE.joelCascade.score}/100 → contribution {SERGE.joelCascade.score}% à Disponibilité 85 %</div>
              </div>
            }>
              <span style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500, borderBottom: "1px dotted var(--fg-3)", cursor: "help" }}>{s.contribJoel}</span>
            </Tooltip>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--ok)" }}>+{s.composite - s.compositePrev} vs mois précédent</span>
          </div>
        </div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)", lineHeight: 1.5 }}>{s.cascade}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", minWidth: 220 }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 600 }}>Trajectoire SO·3 · disponibilité 2026</span>
        <SO3Trajectory />
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>mai · 84 % → cible 85 % au 31 déc</span>
      </div>
    </div>
  );
}

/* ---------- 1.2 Banner saisonnier Madagascar ---------- */
function SaisonBanner() {
  const [open, setOpen] = useStateVE(false);
  const s = SERGE.saison;
  const c = s.level === "err" ? "var(--err)" : s.level === "warn" ? "var(--warn)" : "var(--ok)";
  const soft = s.level === "err" ? "var(--err-soft)" : s.level === "warn" ? "var(--warn-soft)" : "var(--ok-soft)";
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderRadius: 8, background: soft, border: `1px solid color-mix(in srgb, ${c} 40%, transparent)` }}>
        <i data-lucide="cloud-rain" style={{ width: 18, height: 18, color: c, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>{s.titre}</span>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: c, marginLeft: 10 }}>{s.periode}</span>
          <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>{s.detail}</div>
        </div>
        <span style={{ flex: 1 }} />
        <button onClick={() => setOpen(true)} style={{ fontFamily: "Inter", fontSize: 12, fontWeight: 500, color: c, background: "transparent", border: `1px solid color-mix(in srgb, ${c} 45%, transparent)`, borderRadius: 4, padding: "7px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>Voir conditions du jour</button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} eyebrow="Conditions Madagascar · 29 mai 2026" title="Conditions du jour · RN44 + côte Toamasina">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { z: "RN44 · Moramanga → APC Andriamena", st: "Vigilance", k: "warn", t: "Pluies fortes Q2 · chaussée dégradée km 30-52 · réduction vitesse 40 km/h." },
            { z: "IVONDRO → Port Toamasina", st: "Surveiller", k: "warn", t: "Côte humide · pentes 8-12 % · freinage moteur recommandé." },
            { z: "Alerte météo officielle", st: "Aucune", k: "ok", t: "Pas d'alerte cyclone active · saison cyclone close (nov-mars)." },
            { z: "Plan suspension dispatch", st: "Prêt", k: "ok", t: "Déclenchement automatique si alerte rouge officielle." },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 6 }}>
              <StatusDot status={r.k} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>{r.z}</span>
                  <StatusChip kind={r.k} dot={false}>{r.st}</StatusChip>
                </div>
                <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 3 }}>{r.t}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

/* ---------- 1.3 Hero cards ---------- */
function HeroCard({ c }) {
  const color = c.status === "ok" ? "var(--ok)" : c.status === "warn" ? "var(--warn)" : "var(--err)";
  const trendColor = c.trendPos === true ? "var(--ok)" : c.trendPos === false ? "var(--err)" : "var(--fg-3)";
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `2px solid ${color}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600, lineHeight: 1.3 }}>{c.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {c.so && <SOChip>{c.so}</SOChip>}
          <StatusDot status={c.status} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 40, fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.02em", color: "var(--fg-1)" }}>{c.value}<span style={{ fontFamily: "Inter", fontSize: 15, color: "var(--fg-3)", marginLeft: 3 }}>{c.unit}</span></span>
        <Sparkline points={c.spark} width={72} height={30} color={color} showEndpoint />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>
        <span>cible {c.target}</span>
        <span style={{ color: trendColor }}>{c.trend}</span>
      </div>
    </div>
  );
}

/* ---------- 1.4 Rituels M03 ---------- */
function RitualGroup({ g }) {
  const lateCount = g.items.filter(i => i.late || i.due).length;
  return (
    <Collapsible
      title={g.label}
      meta={g.meta}
      defaultOpen={false}
      badge={lateCount > 0 ? <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 2, background: "var(--err-soft)", color: "var(--err)", letterSpacing: "0.06em" }}>RETARD</span> : <StatusChip kind="ok" dot={false}>{g.items.filter(i=>i.done).length}/{g.items.length}</StatusChip>}
    >
      <div style={{ padding: "4px 0" }}>
        {g.items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: i < g.items.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
            <i data-lucide={it.done ? "check-circle-2" : (it.late || it.due) ? "alert-circle" : "circle"} style={{ width: 15, height: 15, color: it.done ? "var(--ok)" : (it.late || it.due) ? "var(--err)" : "var(--fg-3)" }} />
            <span style={{ fontSize: 13, color: "var(--fg-1)", flex: 1 }}>{it.t}</span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: (it.late || it.due) ? "var(--err)" : "var(--fg-3)" }}>{it.h}</span>
            {(it.late || it.due) && <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 2, background: "var(--err-soft)", color: "var(--err)" }}>RETARD</span>}
            {it.done && <StatusChip kind="ok" dot={false}>DONE</StatusChip>}
          </div>
        ))}
      </div>
    </Collapsible>
  );
}

/* ---------- 1.5 Workflows P0 ---------- */
function P0Card({ c, onOpen }) {
  const color = c.sev === "err" ? "var(--err)" : c.sev === "warn" ? "var(--warn)" : "var(--accent)";
  const soft = c.sev === "err" ? "var(--err-soft)" : c.sev === "warn" ? "var(--warn-soft)" : "var(--accent-soft)";
  const [hov, setHov] = useStateVE(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => onOpen(c)} role="button" tabIndex={0} style={{
      background: "var(--surface)", border: `1px solid ${hov ? color : "var(--border)"}`, borderRadius: 8, padding: 16, cursor: "pointer",
      display: "flex", flexDirection: "column", gap: 12, transition: "border-color 120ms", minHeight: 138,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 32, height: 32, borderRadius: 6, background: soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i data-lucide={c.icon} style={{ width: 17, height: 17, color }} />
        </span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600, color: "var(--fg-3)", marginLeft: "auto" }}>{c.wf}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.3 }}>{c.title}</div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", lineHeight: 1.4, marginTop: -4 }}>{c.sub}</div>
      <div style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color }}>
        Ouvrir le formulaire <i data-lucide="arrow-up-right" style={{ width: 14, height: 14 }} />
      </div>
    </div>
  );
}

function P0Modal({ card, onClose }) {
  const [done, setDone] = useStateVE(false);
  useEffectVE(() => { setDone(false); }, [card]);
  if (!card) return null;
  return (
    <Modal open={!!card} onClose={onClose} eyebrow={`Workflow ${card.wf} · Pattern 9 · formulaire`} title={card.title}
      footer={done
        ? <Btn kind="primary" icon="check" onClick={onClose}>Fermer</Btn>
        : <><Btn kind="ghost" onClick={onClose}>Annuler</Btn><Btn kind="primary" icon="check" onClick={() => setDone(true)}>Valider et tracer M13</Btn></>}>
      {done ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0", textAlign: "center" }}>
          <span style={{ width: 48, height: 48, borderRadius: 999, background: "var(--ok-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i data-lucide="check" style={{ width: 24, height: 24, color: "var(--ok)" }} />
          </span>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)" }}>Action enregistrée · tracée au carnet M13</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "IBM Plex Mono, monospace" }}>maquette · aucun POST réel</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>{card.sub}</div>
          <Field label={card.id === "esc" ? "Catégorie d'escalade" : card.id === "w0207" ? "Type d'event MTV" : "Cible"}>
            <Select>
              {card.targets.map((t, i) => <option key={i}>{t}</option>)}
            </Select>
          </Field>
          {card.id === "w16" && <Field label="Date du 1-on-1"><Input type="text" defaultValue="02/06/2026 · 14:00" /></Field>}
          {card.id === "m03h1" && <Field label="Ordre du jour"><Input type="text" defaultValue="Sécurité RN44 · capacité · climat" /></Field>}
          {card.id === "w11" && <Field label="Période de paie"><Input type="text" defaultValue="cycle mai 2026 · J-3" /></Field>}
          <Field label="Note (max 15 mots · D82)" hint="Tracée au carnet de bord M13">
            <textarea rows={3} placeholder="Décision ou consigne courte…" style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border)", borderRadius: 4, padding: "9px 11px", color: "var(--fg-1)", fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none", resize: "vertical" }} />
          </Field>
        </div>
      )}
    </Modal>
  );
}

/* ---------- 1.8 HSE Cross-Check ---------- */
function HSECrossCheck() {
  return (
    <Collapsible title="Cross-Check HSE · flags Driver Manager" meta={`resolution_owner = driver_manager · ${SERGE.hseFlags.length}`} defaultOpen={false} badge={<StatusChip kind="warn" dot={false}>{SERGE.hseFlags.length} à résoudre</StatusChip>}>
      <div>
        {SERGE.hseFlags.map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto auto 1fr auto auto", gap: 14, alignItems: "center", padding: "12px 18px", borderBottom: i < SERGE.hseFlags.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
            <i data-lucide={f.sev === "err" ? "alert-triangle" : "alert-circle"} style={{ width: 16, height: 16, color: sevColor(f.sev) }} />
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--accent)" }}>{f.driver}</span>
            <span style={{ fontSize: 13, color: "var(--fg-1)" }}>{f.title}</span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>{f.age}</span>
            <Btn size="sm" kind="secondary">Résoudre</Btn>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}

/* ---------- 1.9 Footer ---------- */
function PacteTERFooter() {
  const rows = [
    { k: "T", label: "Terrain", v: "15 chauffeurs · 13/15 actifs · 2 clients PENTA_OCEAN + SC_SERVICES" },
    { k: "E", label: "Équité", v: "Pacte TER cadencé · turnover 13 % · climat 4,1/5" },
    { k: "R", label: "Résultats", v: "composite 78/100 · SO·3 Transport Health · cascade Joel 25 %" },
  ];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {rows.map((r, i) => (
        <div key={r.k} style={{ display: "grid", gridTemplateColumns: "28px 90px 1fr", gap: 14, alignItems: "center", padding: "11px 18px", borderBottom: i < rows.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
          <span style={{ width: 24, height: 24, borderRadius: 4, background: "var(--accent-soft)", color: "var(--accent)", fontFamily: "IBM Plex Mono, monospace", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.k}</span>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600 }}>{r.label}</span>
          <span style={{ fontSize: 12, color: "var(--fg-2)" }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================ MAIN */
function VueEnsembleDM({ selectedId, onSelect }) {
  const [p0, setP0] = useStateVE(null);
  const profileRef = useRefVE(null);
  const driver = SERGE.drivers.find(d => d.id === selectedId);

  useEffectVE(() => {
    const t = setTimeout(() => window.lucide && lucide.createIcons(), 40);
    return () => clearTimeout(t);
  }, [selectedId, p0]);

  useEffectVE(() => {
    if (selectedId && profileRef.current) {
      profileRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30, padding: "26px 32px", maxWidth: 1520, margin: "0 auto" }}>
      {/* 1.1 Composite header */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Commandement · cascade D54" meta="P4 OPS dominant · échéance synthèse Joel J-2" />
        <SOAlignBanner />
        <CompositeHero />
      </section>

      {/* 1.2 Banner */}
      <SaisonBanner />

      {/* 1.3 Hero cards */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Indicateurs cascade D54" meta="4 cartes · mensuel" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14 }}>
          {SERGE.heroCards.map((c, i) => <HeroCard key={i} c={c} />)}
        </div>
      </section>

      {/* 1.4 Rituels */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Rituels M03 · jour · semaine · mois" meta="cliquer pour déplier" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <RitualGroup g={SERGE.rituels.jour} />
          <RitualGroup g={SERGE.rituels.semaine} />
          <RitualGroup g={SERGE.rituels.mois} />
        </div>
      </section>

      {/* 1.5 P0 */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="À valider aujourd'hui · 5 workflows P0" meta="Pattern 9 · clic = formulaire" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 12 }}>
          {SERGE.p0.map(c => <P0Card key={c.id} c={c} onOpen={setP0} />)}
        </div>
      </section>

      {/* 1.6 Fleet Grid */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Flotte · 15 chauffeurs" meta="tri colonnes · clic ligne = profil 360°" right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>noms anonymisés · mock</span>} />
        <FleetGridDM drivers={SERGE.drivers} selectedId={selectedId} onSelect={onSelect} />
      </section>

      {/* 1.7 Profil 360 */}
      <section ref={profileRef} style={{ display: "flex", flexDirection: "column", gap: 12, scrollMarginTop: 12 }}>
        <SectionRule label="Profil 360° · chauffeur sélectionné" meta={driver ? `${driver.id} · 7 onglets` : "sélectionner un chauffeur"} />
        {driver ? (
          <DriverProfile360 driver={driver} onClose={() => onSelect(null)} />
        ) : (
          <div style={{ background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 8, padding: "32px 24px", textAlign: "center", color: "var(--fg-3)", fontSize: 13 }}>
            <i data-lucide="mouse-pointer-click" style={{ width: 20, height: 20, display: "block", margin: "0 auto 8px" }} />
            Cliquer un chauffeur dans la flotte pour ouvrir son profil 360° (7 onglets).
          </div>
        )}
      </section>

      {/* 1.8 HSE */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Cross-Check HSE" meta="flags filtrés Driver Manager" />
        <HSECrossCheck />
      </section>

      {/* 1.9 Footer */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Pacte TER · drill-up cascade" />
        <PacteTERFooter />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid var(--border)", borderRadius: 4, padding: "8px 14px", color: "var(--fg-1)", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            <i data-lucide="arrow-left" style={{ width: 14, height: 14 }} /> Joel · Resp Transport (N3)
          </button>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>cascade D54 · drill-up</span>
        </div>
      </section>

      <P0Modal card={p0} onClose={() => setP0(null)} />
    </div>
  );
}

window.VueEnsembleDM = VueEnsembleDM;
