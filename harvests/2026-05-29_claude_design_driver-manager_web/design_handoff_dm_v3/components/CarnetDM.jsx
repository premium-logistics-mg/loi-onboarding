/* global React, SERGE, Btn, StatusChip, Modal, Field, Input, Select, SectionRule, sevColor */
/* ============================================================
   CarnetDM.jsx — ONGLET 3 · Carnet de bord (M13 globale Serge)
   3.1 filtres · 3.2 liste · 3.3 création · 3.4 drawer détail ·
   3.5 couplage workflows (arbre décision)
   ============================================================ */
const { useState: useStateCB, useEffect: useEffectCB, useMemo: useMemoCB } = React;

const CAT_COLOR = (id) => {
  const c = SERGE.m13Categories.find(x => x.id === id);
  return c ? c.color : "neutral";
};
const CAT_LABEL = (id) => {
  const c = SERGE.m13Categories.find(x => x.id === id);
  return c ? c.label : id;
};
const STAT_KIND = { open: "warn", in_progress: "accent", closed: "ok" };

function CarnetDM() {
  const [fStatut, setFStatut] = useStateCB("all");
  const [fPeriode, setFPeriode] = useStateCB("all");
  const [fCat, setFCat] = useStateCB("all");
  const [fDriver, setFDriver] = useStateCB("all");
  const [detail, setDetail] = useStateCB(null);
  const [create, setCreate] = useStateCB(false);
  const [created, setCreated] = useStateCB(false);

  useEffectCB(() => { const t = setTimeout(() => window.lucide && lucide.createIcons(), 40); return () => clearTimeout(t); }, [detail, create, fStatut, fCat, fDriver]);

  const filtered = useMemoCB(() => SERGE.m13.filter(m =>
    (fStatut === "all" || m.statut === fStatut) &&
    (fCat === "all" || m.cat === fCat) &&
    (fDriver === "all" || m.driver === fDriver)
  ), [fStatut, fCat, fDriver]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30, padding: "26px 32px", maxWidth: 1520, margin: "0 auto" }}>
      {/* 3.1 + 3.3 */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Carnet de bord M13 · décisions tracées" meta={`${filtered.length} / ${SERGE.m13.length}`} right={<Btn size="sm" kind="primary" icon="plus" onClick={() => { setCreate(true); setCreated(false); }}>Trace nouvelle décision</Btn>} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <FilterGroup label="Statut" value={fStatut} onChange={setFStatut} options={[["all", "Toutes"], ["open", "open"], ["in_progress", "in progress"], ["closed", "closed"]]} />
          <FilterGroup label="Période" value={fPeriode} onChange={setFPeriode} options={[["all", "Toutes"], ["jour", "Aujourd'hui"], ["semaine", "Semaine"], ["mois", "Mois"]]} />
          <Select value={fCat} onChange={(e) => setFCat(e.target.value)}>
            <option value="all">Toutes catégories</option>
            {SERGE.m13Categories.map(c => <option key={c.id} value={c.id}>{c.label} · {c.wf}</option>)}
          </Select>
          <Select value={fDriver} onChange={(e) => setFDriver(e.target.value)}>
            <option value="all">Tous chauffeurs</option>
            {SERGE.drivers.map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
          </Select>
        </div>
      </section>

      {/* 3.2 liste */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
          {filtered.length === 0 && <div style={{ padding: 24, textAlign: "center", color: "var(--fg-3)", fontSize: 13 }}>Aucune entrée pour ce filtre.</div>}
          {filtered.map((m, i) => (
            <div key={i} onClick={() => setDetail(m)} style={{ display: "grid", gridTemplateColumns: "92px 150px 78px 1fr 90px 110px auto", gap: 14, alignItems: "center", padding: "12px 16px", borderBottom: i < filtered.length - 1 ? "1px solid var(--border-soft)" : "none", cursor: "pointer", background: i % 2 ? "color-mix(in srgb, var(--bg-elev-1) 40%, transparent)" : "transparent" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-elev-1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = i % 2 ? "color-mix(in srgb, var(--bg-elev-1) 40%, transparent)" : "transparent"}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>{m.ts}</span>
              <StatusChip kind={CAT_COLOR(m.cat)} dot={false}>{CAT_LABEL(m.cat)}</StatusChip>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: m.driver === "—" ? "var(--fg-3)" : "var(--accent)" }}>{m.driver}</span>
              <span style={{ fontSize: 13, color: "var(--fg-1)" }}>{m.note}</span>
              <span style={{ fontSize: 12, color: "var(--fg-2)" }}>{m.owner}</span>
              <StatusChip kind={STAT_KIND[m.statut]} mono>{m.statut}</StatusChip>
              {m.cadence ? <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 2, background: "var(--accent-soft)", color: "var(--accent)" }}>{m.cadence}</span> : <span />}
            </div>
          ))}
        </div>
      </section>

      {/* 3.5 couplage workflows */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Couplage workflows · arbre de décision" meta={`${SERGE.couplages.length} couplages · README v2 §2`} />
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          {SERGE.couplages.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)", gap: 14, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--fg-1)", background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)", borderRadius: 4, padding: "7px 11px", textAlign: "right" }}>{c.trig}</span>
              </div>
              <i data-lucide="arrow-right" style={{ width: 16, height: 16, color: sevColor(c.sev) }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--fg-1)", background: `color-mix(in srgb, ${sevColor(c.sev)} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${sevColor(c.sev)} 35%, transparent)`, borderRadius: 4, padding: "7px 11px" }}>{c.arrow}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.4 drawer détail */}
      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(7,24,43,0.5)", backdropFilter: "blur(4px)", zIndex: 55, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 460, maxWidth: "92vw", height: "100%", background: "var(--surface)", borderLeft: "1px solid var(--border)", boxShadow: "var(--shadow-2)", display: "flex", flexDirection: "column", animation: "loiSlide 180ms cubic-bezier(0.2,0.7,0.2,1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 22px", borderBottom: "1px solid var(--border-soft)" }}>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 5, fontWeight: 600 }}>{CAT_LABEL(detail.cat)} · {detail.ts}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)", maxWidth: "32ch" }}>{detail.note}</div>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: "transparent", border: 0, color: "var(--fg-2)", cursor: "pointer", padding: 6 }}><i data-lucide="x" style={{ width: 18, height: 18 }} /></button>
            </div>
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <StatusChip kind={STAT_KIND[detail.statut]} mono>{detail.statut}</StatusChip>
                {detail.cadence && <StatusChip kind="accent" dot={false}>{detail.cadence}</StatusChip>}
                {detail.driver !== "—" && <StatusChip kind="neutral" mono>{detail.driver}</StatusChip>}
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", fontWeight: 600, marginBottom: 10 }}>Timeline</div>
                {[
                  { t: detail.ts, e: "Décision tracée par " + detail.owner },
                  { t: "+ liens", e: detail.driver !== "—" ? `chauffeur ${detail.driver} · véhicule ${detail.driver.replace("DRV", "CT")}` : "global équipe DM" },
                  { t: "source", e: "workflow " + (SERGE.m13Categories.find(c => c.id === detail.cat)?.wf || "—") },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--border-soft)" }}>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)", width: 60, flexShrink: 0 }}>{r.t}</span>
                    <span style={{ fontSize: 13, color: "var(--fg-1)" }}>{r.e}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3.3 create modal */}
      <Modal open={create} onClose={() => setCreate(false)} eyebrow="Carnet M13 · nouvelle décision" title="Tracer une décision"
        footer={created
          ? <Btn kind="primary" icon="check" onClick={() => setCreate(false)}>Fermer</Btn>
          : <><Btn kind="ghost" onClick={() => setCreate(false)}>Annuler</Btn><Btn kind="primary" icon="check" onClick={() => setCreated(true)}>Tracer</Btn></>}>
        {created ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--fg-1)", fontSize: 14, fontWeight: 600 }}>Décision tracée au carnet M13 · maquette</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Catégorie"><Select>{SERGE.m13Categories.map(c => <option key={c.id}>{c.label} · {c.wf}</option>)}</Select></Field>
            <Field label="Chauffeur (optionnel)"><Select><option>—</option>{SERGE.drivers.map(d => <option key={d.id}>{d.id}</option>)}</Select></Field>
            <Field label="Note (max 15 mots · D82)"><Input type="text" placeholder="Décision courte…" /></Field>
          </div>
        )}
      </Modal>
    </div>
  );
}

function FilterGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden", background: "var(--surface)" }}>
      <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600, padding: "0 10px" }}>{label}</span>
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} style={{
          fontFamily: "Inter", fontSize: 12, fontWeight: 500, padding: "7px 11px", cursor: "pointer", border: 0, borderLeft: "1px solid var(--border-soft)",
          background: value === v ? "var(--accent-soft)" : "transparent", color: value === v ? "var(--accent)" : "var(--fg-2)",
        }}>{l}</button>
      ))}
    </div>
  );
}

window.CarnetDM = CarnetDM;
