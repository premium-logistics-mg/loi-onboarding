/* global React, SERGE, StatusChip, PillarChip, Sparkline, GaugeBar, SectionRule, Collapsible, sevColor */
/* ============================================================
   ScoresDM.jsx — ONGLET 2 · Scores
   2.1 composite détaillé · 2.2 6 objectifs Pacte TER ·
   2.3 23 KPIs par workflow · 2.4 SO·3 contribution
   ============================================================ */
const { useEffect: useEffectSC } = React;

const WEIGHTS = [
  { wf: "W02", w: 25, score: 88, label: "Discipline départs" },
  { wf: "W07", w: 20, score: 80, label: "Sécurité MTV" },
  { wf: "W11", w: 15, score: 82, label: "Paie" },
  { wf: "W15", w: 10, score: 70, label: "Permis / médical" },
  { wf: "W16", w: 20, score: 72, label: "Coaching 1-on-1" },
  { wf: "W21", w: 10, score: 90, label: "Onboarding" },
];

function CompositeDetail() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 600 }}>Composite DM mensuel</span>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 64, fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.02em", color: "var(--ok)" }}>
          {SERGE.composite}<span style={{ fontFamily: "Inter", fontSize: 16, color: "var(--fg-3)", marginLeft: 6, verticalAlign: 16 }}>/ 100</span>
        </div>
        <StatusChip kind="ok">vert · dans la cible ≥ 75</StatusChip>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>{SERGE.cascade}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 600 }}>Décomposition pondérée</span>
        <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)" }}>
          {WEIGHTS.map((w, i) => {
            const c = w.score >= 75 ? "var(--ok)" : w.score >= 60 ? "var(--warn)" : "var(--err)";
            return <div key={i} style={{ width: `${w.w}%`, background: `color-mix(in srgb, ${c} 70%, transparent)`, borderRight: i < WEIGHTS.length - 1 ? "1px solid var(--bg)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600, color: "var(--fg-1)" }} title={`${w.wf} ${w.w}%`}>{w.wf}</div>;
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          {WEIGHTS.map((w, i) => {
            const c = w.score >= 75 ? "var(--ok)" : w.score >= 60 ? "var(--warn)" : "var(--err)";
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>{w.wf} · {w.w}%</span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 20, fontWeight: 500, color: c }}>{w.score}</span>
                <span style={{ fontSize: 10, color: "var(--fg-3)", lineHeight: 1.3 }}>{w.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ObjectivesTable() {
  const cols = ["Objectif", "Cible v2", "Réel", "Écart", "Note", "Plan d'action"];
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={i} style={{ textAlign: i >= 1 && i <= 4 ? "center" : "left", padding: "11px 16px", background: "var(--bg-elev-1)", borderBottom: "1px solid var(--border)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 600, whiteSpace: "nowrap" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SERGE.objectifs.map((o, i) => (
            <tr key={i} style={{ background: i % 2 ? "color-mix(in srgb, var(--bg-elev-1) 45%, transparent)" : "transparent" }}>
              <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", color: "var(--fg-1)", fontWeight: 500 }}>{o.obj}</td>
              <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", textAlign: "center", fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-2)" }}>{o.cible}</td>
              <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", textAlign: "center", fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-1)", fontWeight: 600 }}>{o.reel}</td>
              <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", textAlign: "center" }}><StatusChip kind={o.ecartK} mono dot={false}>{o.ecart}</StatusChip></td>
              <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", textAlign: "center", fontFamily: "IBM Plex Mono, monospace", color: o.note === "5/5" ? "var(--ok)" : "var(--warn)" }}>{o.note}</td>
              <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-soft)", color: "var(--fg-2)", fontSize: 12 }}>{o.plan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KpiBreakdown() {
  const total = SERGE.kpiWorkflows.reduce((s, w) => s + w.kpis.length, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {SERGE.kpiWorkflows.map((wf, i) => (
        <Collapsible key={i} title={`${wf.wf} · ${wf.title}`} meta={`pondération ${wf.w} · ${wf.kpis.length} KPIs`} defaultOpen={i === 0}
          badge={<PillarChip pillar="P4" />}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 0 }}>
            {wf.kpis.map((k, j) => {
              const c = k.e === "ok" ? "var(--ok)" : k.e === "warn" ? "var(--warn)" : "var(--err)";
              return (
                <div key={j} style={{ padding: "13px 16px", borderBottom: "1px solid var(--border-soft)", borderRight: "1px solid var(--border-soft)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--fg-2)", lineHeight: 1.3 }}>{k.k}</span>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 20, fontWeight: 500, color: c }}>{k.v}</span>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>cible {k.c}</span>
                    </div>
                    <Sparkline points={k.spark} width={56} height={22} color={c} showEndpoint />
                  </div>
                </div>
              );
            })}
          </div>
        </Collapsible>
      ))}
      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)", alignSelf: "flex-end" }}>{total} KPIs · trajectoire 7 mois · cascade D54</span>
    </div>
  );
}

function SO3Tracker() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>{SERGE.so3.title}</span>
          <PillarChip pillar="P4" />
        </div>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: "var(--accent)" }}>cible {SERGE.so3.target}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {SERGE.so3.drivers.map((d, i) => {
          const c = d.e === "ok" ? "var(--ok)" : d.e === "warn" ? "var(--warn)" : "var(--err)";
          return (
            <div key={i} style={{ background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 6, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{d.k}</span>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 24, fontWeight: 500, color: c }}>{d.v}</span>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>cible {d.c}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--accent)" }}>
        <i data-lucide="arrow-up-right" style={{ width: 14, height: 14 }} /> drill-up Joel · Resp Transport · contribution DM à SO·3
      </div>
    </div>
  );
}

function ScoresDM() {
  useEffectSC(() => { const t = setTimeout(() => window.lucide && lucide.createIcons(), 40); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30, padding: "26px 32px", maxWidth: 1520, margin: "0 auto" }}>
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Composite DM mensuel · détaillé" meta="pondération W02·W07·W11·W15·W16" />
        <CompositeDetail />
      </section>
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="6 objectifs Pacte TER · cibles v2" meta="cible · réel · écart · note · plan" />
        <ObjectivesTable />
      </section>
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="KPIs détaillés cascade D54 · par workflow" meta="déplier chaque workflow" />
        <KpiBreakdown />
      </section>
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="SO·3 · contribution Serge" meta="Transport Health · drill-up Joel" />
        <SO3Tracker />
      </section>
    </div>
  );
}

window.ScoresDM = ScoresDM;
