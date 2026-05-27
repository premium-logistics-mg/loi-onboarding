/* global React, AfIcon, Modal, ModalFooter, Field, Input, Textarea, SegControl */
// ════════════════════════════════════════════════════════════════
// LOI · Haja — Modales arbitrage D82
// 3 modales pour la bande "À ARBITRER" (Pattern 9 · anti-blind-POST)
//   1. ArbitrerModal              — décision + note obligatoire
//   2. ArbitrerEscaladerModal     — Arbitrer-moi-même OU Escalader Ketsiah
//   3. ApprouverModal             — routage Authority Matrix par montant
// Réutilise le shell Modal/Field/Input/Textarea/SegControl du kit Admin-Fi.
// ════════════════════════════════════════════════════════════════
const { useState, useEffect, useMemo } = React;

// Authority Matrix — routage par seuil (M Ar)
function authorityRoute(montantM) {
  if (montantM == null || isNaN(montantM)) return { tier: "?", label: "Hors Authority Matrix", who: "—", tone: "info", forceEscalade: false };
  if (montantM < 1)  return { tier: "<1M",   label: "Agent autonome",            who: "Agent",          tone: "ok",     forceEscalade: false };
  if (montantM <= 3) return { tier: "1–3M",  label: "Haja · décision solo",       who: "Haja",           tone: "accent", forceEscalade: false };
  if (montantM <= 5) return { tier: "3–5M",  label: "Haja + co-validation",       who: "Haja + Ketsiah", tone: "warn",   forceEscalade: false };
  return                    { tier: ">5M",   label: "Ketsiah obligatoire · Haja route",  who: "Ketsiah", tone: "err",    forceEscalade: true };
}

// ────────────────────────────────────────────────────────────
// SubjectCard — bandeau récap commun en tête de modale
// ────────────────────────────────────────────────────────────
function SubjectCard({ ctx }) {
  if (!ctx) return null;
  return (
    <div style={{
      padding: "12px 14px", borderRadius: 8,
      background: "var(--bg-elev-1)", border: "1px solid var(--border-soft)",
      display: "flex", flexDirection: "column", gap: 6, marginBottom: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 9px", borderRadius: 999,
          background: "var(--accent-soft)", color: "var(--accent)",
          fontSize: 11, fontWeight: 700,
          border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
        }}>
          <AfIcon name="user" size={11}/> {ctx.source}
        </span>
        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", letterSpacing: "0.06em" }}>{ctx.seuil}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.35 }}>{ctx.subject}</div>
      <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.45 }}>{ctx.detail}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{ctx.montantLabel} ·</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: "var(--fg-1)", letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>{ctx.montantValue}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 1) ArbitrerModal — décision + note obligatoire
// ────────────────────────────────────────────────────────────
const DECISIONS = [
  { value: "valider",  label: "Valider",          icon: "check-circle", tone: "ok" },
  { value: "rejeter",  label: "Rejeter",          icon: "x",            tone: "err" },
  { value: "reprise",  label: "Demander reprise", icon: "trend-flat",   tone: "warn" },
];

function ArbitrerModal({ open, onClose, onSubmit, ctx }) {
  const [decision, setDecision] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => { if (open) { setDecision(""); setNote(""); setTouched(false); } }, [open]);

  const noteOk = note.trim().length >= 8;
  const canSubmit = !!decision && noteOk;
  const errNote = touched && !noteOk ? "Note d'arbitrage obligatoire (min. 8 caractères)" : "";

  return (
    <Modal
      open={open} onClose={onClose}
      title="Arbitrer · décision Haja"
      subtitle="Trace M13 · event = arbitrage_haja"
      badge={<span className="confirm-badge">Pattern 9</span>}
      width={620}
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="info" size={12}/> Trace M13 simulée · WRITES_LIVE=false</>}
          onCancel={onClose}
          submitLabel={decision === "rejeter" ? "Rejeter & tracer" : decision === "reprise" ? "Demander reprise" : "Valider & tracer"}
          danger={decision === "rejeter"}
          disabled={touched && !canSubmit}
          onSubmit={() => {
            setTouched(true);
            if (!canSubmit) return;
            onSubmit({ event: "arbitrage_haja", decision, note, ctx });
          }}
        />
      }
    >
      <SubjectCard ctx={ctx}/>

      <Field label="Décision" required span={12}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DECISIONS.map((d) => {
            const active = decision === d.value;
            const tone = d.tone === "ok" ? "var(--ok)" : d.tone === "err" ? "var(--err)" : "var(--warn)";
            return (
              <button key={d.value} type="button" onClick={() => setDecision(d.value)}
                style={{
                  flex: "1 1 160px", padding: "12px 14px", borderRadius: 8,
                  background: active ? `color-mix(in srgb, ${tone} 14%, var(--surface))` : "var(--surface)",
                  border: `1.5px solid ${active ? tone : "var(--border)"}`,
                  color: active ? tone : "var(--fg-2)",
                  cursor: "pointer", fontSize: 13, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                  transition: "all 120ms",
                }}>
                <AfIcon name={d.icon} size={16}/> {d.label}
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ marginTop: 14 }}>
        <Field label="Note d'arbitrage" required span={12} hint="Visible dans le carnet de bord · transmise au lieutenant source" error={errNote}>
          <Textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Motif, contraintes, conditions de reprise…"/>
        </Field>
      </div>
    </Modal>
  );
}

// ────────────────────────────────────────────────────────────
// 2) ArbitrerEscaladerModal — Arbitrer moi-même OU Escalader Ketsiah
// ────────────────────────────────────────────────────────────
function ArbitrerEscaladerModal({ open, onClose, onSubmit, ctx }) {
  const route = useMemo(() => authorityRoute(ctx?.amount), [ctx]);
  const forced = route.forceEscalade;

  const [mode, setMode] = useState(forced ? "escalader" : "arbitrer");
  const [decision, setDecision] = useState("");
  const [note, setNote] = useState("");
  const [motif, setMotif] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(forced ? "escalader" : "arbitrer");
      setDecision(""); setNote(""); setMotif(""); setTouched(false);
    }
  }, [open, forced]);

  const arbitrerOk = !!decision && note.trim().length >= 8;
  const escaladerOk = motif.trim().length >= 12;
  const canSubmit = mode === "arbitrer" ? arbitrerOk : escaladerOk;

  return (
    <Modal
      open={open} onClose={onClose}
      title="Arbitrer ou escalader"
      subtitle={`Authority Matrix · ${route.tier} · ${route.label}`}
      badge={forced ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, background: "var(--err-soft)", color: "var(--err)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}><AfIcon name="alert" size={10}/> Escalade forcée</span> : <span className="confirm-badge">Pattern 9</span>}
      width={680}
      footer={
        <ModalFooter
          leftHint={mode === "escalader"
            ? <><AfIcon name="arrow-right" size={12} color="var(--accent)"/> <span>Cascade M13 → Ketsiah · CFO</span></>
            : <><AfIcon name="info" size={12}/> <span>Trace M13 · arbitrage_haja</span></>}
          onCancel={onClose}
          submitLabel={mode === "escalader" ? "Escalader Ketsiah" : "Arbitrer & tracer"}
          disabled={touched && !canSubmit}
          onSubmit={() => {
            setTouched(true);
            if (!canSubmit) return;
            if (mode === "arbitrer") onSubmit({ event: "arbitrage_haja", decision, note, ctx });
            else                     onSubmit({ event: "cascade_ketsiah", motif, route: route.tier, ctx });
          }}
        />
      }
    >
      <SubjectCard ctx={ctx}/>

      <div style={{
        padding: "10px 14px", borderRadius: 8, marginBottom: 14,
        background: route.tone === "err" ? "var(--err-soft)" : route.tone === "warn" ? "var(--warn-soft)" : "var(--accent-soft)",
        border: `1px solid color-mix(in srgb, ${route.tone === "err" ? "var(--err)" : route.tone === "warn" ? "var(--warn)" : "var(--accent)"} 30%, transparent)`,
        display: "flex", alignItems: "flex-start", gap: 8,
        fontSize: 12, color: "var(--fg-1)", lineHeight: 1.45,
      }}>
        <AfIcon name={forced ? "alert" : "shield"} size={14} color={route.tone === "err" ? "var(--err)" : route.tone === "warn" ? "var(--warn)" : "var(--accent)"} style={{ marginTop: 2, flexShrink: 0 }}/>
        <div>
          <strong style={{ fontWeight: 700 }}>Authority Matrix · {route.tier}</strong> — {route.label}. {forced && <span style={{ color: "var(--err)", fontWeight: 600 }}>Montant &gt; 5 M Ar · Haja ne peut pas arbitrer seul · escalade obligatoire.</span>}
        </div>
      </div>

      <Field label="Mode" span={12}>
        <SegControl
          value={mode} onChange={(v) => { if (!(forced && v === "arbitrer")) setMode(v); }}
          options={[
            { value: "arbitrer",  label: forced ? "Arbitrer (verrouillé)" : "Arbitrer moi-même" },
            { value: "escalader", label: "Escalader Ketsiah" },
          ]}/>
      </Field>

      {mode === "arbitrer" && !forced && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Décision" required span={12}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DECISIONS.map((d) => {
                const active = decision === d.value;
                const tone = d.tone === "ok" ? "var(--ok)" : d.tone === "err" ? "var(--err)" : "var(--warn)";
                return (
                  <button key={d.value} type="button" onClick={() => setDecision(d.value)}
                    style={{
                      flex: "1 1 160px", padding: "12px 14px", borderRadius: 8,
                      background: active ? `color-mix(in srgb, ${tone} 14%, var(--surface))` : "var(--surface)",
                      border: `1.5px solid ${active ? tone : "var(--border)"}`,
                      color: active ? tone : "var(--fg-2)",
                      cursor: "pointer", fontSize: 13, fontWeight: 600,
                      display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
                    }}>
                    <AfIcon name={d.icon} size={16}/> {d.label}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Note d'arbitrage" required span={12} hint="Min. 8 caractères · visible carnet de bord"
            error={touched && !arbitrerOk && (!decision ? "Décision requise" : note.trim().length < 8 ? "Note trop courte" : "")}>
            <Textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Motivation de l'arbitrage…"/>
          </Field>
        </div>
      )}

      {mode === "escalader" && (
        <div style={{ marginTop: 14 }}>
          <Field label="Motif d'escalade vers Ketsiah" required span={12} hint="Min. 12 caractères · cascade visible CFO"
            error={touched && !escaladerOk ? "Motif trop court — préciser le contexte" : ""}>
            <Textarea rows={5} value={motif} onChange={(e) => setMotif(e.target.value)}
              placeholder="Pourquoi cette décision dépasse le périmètre Haja · enjeu cash · enjeu réglementaire…"/>
          </Field>
        </div>
      )}
    </Modal>
  );
}

// ────────────────────────────────────────────────────────────
// 3) ApprouverModal — routage Authority Matrix par montant
// ────────────────────────────────────────────────────────────
function ApprouverModal({ open, onClose, onSubmit, ctx }) {
  const route = useMemo(() => authorityRoute(ctx?.amount), [ctx]);
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => { if (open) { setNote(""); setTouched(false); } }, [open]);

  const noteOk = note.trim().length >= 6;
  const canSubmit = noteOk;
  const errNote = touched && !noteOk ? "Note obligatoire (min. 6 caractères)" : "";

  // Libellé bouton + comportement par tier
  const submitLabel =
    route.tier === "<1M"   ? "Notifier agent (autonome)" :
    route.tier === "1–3M"  ? "Approuver (solo Haja)" :
    route.tier === "3–5M"  ? "Co-approuver + ouvrir Ketsiah" :
    route.tier === ">5M"   ? "Router Ketsiah (obligatoire)" :
                              "Router";
  const eventName =
    route.tier === "<1M"   ? "notif_agent" :
    route.tier === "1–3M"  ? "approve_haja_solo" :
    route.tier === "3–5M"  ? "approve_haja_co_route_ketsiah" :
    route.tier === ">5M"   ? "route_ketsiah" :
                              "route_unknown";

  return (
    <Modal
      open={open} onClose={onClose}
      title="Approbation · routée Authority Matrix"
      subtitle={`Routage automatique selon montant · ${ctx?.montantValue || "—"}`}
      badge={<span className="confirm-badge">Pattern 9</span>}
      width={680}
      footer={
        <ModalFooter
          leftHint={<><AfIcon name="shield" size={12}/> <span>{route.tier} · {route.who}</span></>}
          onCancel={onClose}
          submitLabel={submitLabel}
          disabled={touched && !canSubmit}
          onSubmit={() => {
            setTouched(true);
            if (!canSubmit) return;
            onSubmit({ event: eventName, tier: route.tier, route: route.who, note, ctx });
          }}
        />
      }
    >
      <SubjectCard ctx={ctx}/>

      {/* Visualisation des 4 tiers · highlight tier actif */}
      <Field label="Authority Matrix · routage" span={12}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
          {[
            { tier: "<1M",   label: "Agent autonome",       who: "Agent",          tone: "ok"     },
            { tier: "1–3M",  label: "Haja solo",            who: "Haja",           tone: "accent" },
            { tier: "3–5M",  label: "Haja + co-valid.",     who: "Haja + Ketsiah", tone: "warn"   },
            { tier: ">5M",   label: "Ketsiah obligatoire",  who: "Ketsiah",        tone: "err"    },
          ].map((t) => {
            const active = t.tier === route.tier;
            const c = t.tone === "ok" ? "var(--ok)" : t.tone === "err" ? "var(--err)" : t.tone === "warn" ? "var(--warn)" : "var(--accent)";
            return (
              <div key={t.tier} style={{
                padding: "10px 12px", borderRadius: 8,
                background: active ? `color-mix(in srgb, ${c} 18%, var(--surface))` : "var(--bg-elev-1)",
                border: `1.5px solid ${active ? c : "var(--border-soft)"}`,
                opacity: active ? 1 : 0.6,
                position: "relative",
              }}>
                {active && (
                  <span style={{ position: "absolute", top: 6, right: 6, color: c }}>
                    <AfIcon name="check-circle" size={14}/>
                  </span>
                )}
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: active ? c : "var(--fg-2)", letterSpacing: "-0.01em" }}>{t.tier}</div>
                <div style={{ fontSize: 11, color: "var(--fg-2)", fontWeight: 600, marginTop: 2 }}>{t.label}</div>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--fg-3)", marginTop: 2 }}>{t.who}</div>
              </div>
            );
          })}
        </div>
      </Field>

      {route.forceEscalade && (
        <div style={{
          marginTop: 14, padding: "10px 14px", borderRadius: 8,
          background: "var(--err-soft)", border: "1px solid color-mix(in srgb, var(--err) 30%, transparent)",
          display: "flex", alignItems: "flex-start", gap: 8,
          fontSize: 12, color: "var(--fg-1)", lineHeight: 1.45,
        }}>
          <AfIcon name="alert" size={14} color="var(--err)" style={{ marginTop: 2, flexShrink: 0 }}/>
          <span><strong style={{ color: "var(--err)" }}>Montant &gt; 5 M Ar</strong> — Haja <strong>route</strong> vers Ketsiah, l'approbation finale est obligatoirement CFO. Aucun "Approuver solo" possible à ce seuil.</span>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <Field label="Note de routage" required span={12}
          hint="Visible dans la cascade Ketsiah / le carnet de bord" error={errNote}>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Contexte transmis · pièces vérifiées · urgence…"/>
        </Field>
      </div>
    </Modal>
  );
}

Object.assign(window, { ArbitrerModal, ArbitrerEscaladerModal, ApprouverModal, authorityRoute });
