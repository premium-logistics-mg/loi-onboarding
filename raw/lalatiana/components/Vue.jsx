/* global React, DossierTable */

// ============== BLOC 1 · ORIENTATION ==============
function OrientationStrip() {
  const kpis = [
    { label: "Délai accusé réclamation",    actual: "1h32", target: "< 2h",  pct: 76, status: "ok",   ecart: "28 min sous cible" },
    { label: "Réclamations résolues < 48h", actual: "78",   target: "≥ 90 %", pct: 78, status: "warn", ecart: "écart -12 pts", unit: "%" },
    { label: "Concentration top client",    actual: "28,5", target: "≤ 25 %", pct: 88, status: "warn", ecart: "écart +3,5 pts", unit: "%", hint: "PENTA-OCEAN · lecture seule · owner CEO/SO·4" },
  ];
  const sColor = (s) => s === "ok" ? "var(--ok)" : s === "warn" ? "var(--warn)" : s === "red" ? "var(--err)" : "var(--fg-mute)";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "minmax(360px, 1fr) auto",
      gap: 32, padding: "24px 28px", marginBottom: 18,
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
    }}>
      {/* Left: pilier + headline */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{
            fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
            padding: "3px 8px", borderRadius: 2, letterSpacing: "0.08em",
            background: "var(--accent-soft)", color: "var(--accent)", textTransform: "uppercase",
          }}>P3 · Fidélité & diversification client</span>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: "3px 7px", borderRadius: 2, letterSpacing: "0.12em",
            background: "var(--accent)", color: "var(--accent-fg)", textTransform: "uppercase",
          }}>Dominant</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3, color: "var(--fg-1)", marginBottom: 8, maxWidth: 480 }}>
          Objectif rattaché · Résilience portefeuille (top client ≤ 25 %) + qualité du traitement des réclamations
        </div>
        <div style={{ fontSize: 12.5, color: "var(--fg-3)", maxWidth: 520, lineHeight: 1.5 }}>
          Pulse système · accuser, investiguer, proposer, clôturer. Le dossier reste l'objet, la réclamation est le signal.
        </div>
      </div>

      {/* Right: 3 KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 200px)", gap: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{
            padding: "0 0 0 20px",
            borderLeft: "1px solid var(--border)",
          }}>
            <div style={{
              fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
              color: "var(--fg-3)", marginBottom: 8, fontWeight: 500,
              minHeight: 14,
            }}>{k.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{
                fontFamily: "IBM Plex Mono, monospace", fontSize: 28, fontWeight: 500,
                lineHeight: 1, color: "var(--fg-1)", letterSpacing: "-0.01em",
              }}>{k.actual}</span>
              {k.unit && <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "Inter" }}>{k.unit}</span>}
            </div>
            <div style={{ position: "relative", height: 4, background: "var(--surface-2)", borderRadius: 999, marginBottom: 6 }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${k.pct}%`, background: sColor(k.status), borderRadius: 999,
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--fg-3)" }}>cible {k.target}</span>
              <span style={{ fontSize: 10, color: sColor(k.status), fontWeight: 600 }}>{k.ecart}</span>
            </div>
            {k.hint && <div style={{ fontSize: 10, color: "var(--fg-mute)", marginTop: 6, lineHeight: 1.4 }}>{k.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== BLOC 2 · OUTILS DE TRAVAIL ==============
function ToolPanel({ tag, dominant, accent, title, sub, icon, count, onOpen, ctaIcon = "arrow-right", ctaLabel = "Ouvrir l'outil" }) {
  return (
    <div style={{
      padding: 22,
      borderRadius: 8,
      border: dominant ? "1.5px solid var(--accent)" : "1px solid var(--border)",
      background: dominant ? "color-mix(in srgb, var(--accent) 5%, var(--bg))" : "var(--bg-elev-1)",
      display: "flex", flexDirection: "column", gap: 14,
      position: "relative",
    }}>
      {dominant && (
        <span style={{
          position: "absolute", top: 16, right: 16,
          fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 2, letterSpacing: "0.12em",
          background: "var(--accent)", color: "var(--accent-fg)", textTransform: "uppercase",
        }}>Outil principal</span>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: accent === "warn" ? "var(--warn-soft)" : "var(--accent-soft)",
          color: accent === "warn" ? "var(--warn)" : "var(--accent)",
        }}>
          <i data-lucide={icon} style={{ width: 16, height: 16 }} />
        </div>
        <span style={{
          fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
          padding: "2px 6px", borderRadius: 2, letterSpacing: "0.08em",
          background: "var(--surface-2)", color: "var(--fg-3)",
        }}>{tag}</span>
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.3, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.5 }}>{sub}</div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        {count !== undefined && (
          <span style={{ fontSize: 11, color: "var(--fg-3)" }}>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--fg-1)", fontWeight: 500 }}>{count}</span> ce mois-ci
          </span>
        )}
        <button onClick={onOpen} style={{
          marginLeft: "auto",
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: dominant ? "10px 16px" : "8px 14px",
          borderRadius: 4,
          background: dominant ? "var(--accent)" : (accent === "warn" ? "color-mix(in srgb, var(--warn) 14%, transparent)" : "var(--surface)"),
          color: dominant ? "var(--accent-fg)" : (accent === "warn" ? "var(--warn)" : "var(--fg-1)"),
          border: dominant ? "1px solid var(--accent)" : `1px solid ${accent === "warn" ? "color-mix(in srgb, var(--warn) 40%, transparent)" : "var(--border)"}`,
          fontWeight: 600, fontSize: 12.5, cursor: "pointer",
          fontFamily: "Inter, sans-serif",
        }}>
          {ctaLabel}
          <i data-lucide={ctaIcon} style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

function ToolsBloc({ onOpen, counts }) {
  return (
    <div style={{
      padding: 24, marginBottom: 18,
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--fg-1)", marginBottom: 4 }}>Mes outils de travail</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)" }}>4 gestes. Chacun ouvre un formulaire et trace au carnet.</div>
        </div>
        <span style={{
          fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
          padding: "3px 8px", borderRadius: 2, letterSpacing: "0.08em",
          background: "var(--accent-soft)", color: "var(--accent)",
        }}>Bloc · dominant</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ToolPanel
          tag="1 · OUVERTURE"
          dominant
          icon="folder-plus"
          title="Ouvrir un nouveau dossier"
          sub="Point d'entrée Transit. Génère FAI / FAE et démarre la cascade aval."
          count={counts.ouvertures}
          ctaLabel="Ouvrir un dossier"
          ctaIcon="plus"
          onOpen={() => onOpen("ouvrir")}
        />
        <ToolPanel
          tag="2 · COTATION"
          icon="file-text"
          title="Émettre une cotation"
          sub="Devis client · marge cible ≥ 7 % PDJV · règlement 30j / 45j / comptant."
          count={counts.cotations}
          ctaLabel="Émettre une cotation"
          onOpen={() => onOpen("cotation")}
        />
        <ToolPanel
          tag="3 · RELANCE"
          icon="phone-call"
          title="Relancer le client · demander pièces"
          sub="Template prérempli · email, téléphone ou visite. Trace écrite."
          count={counts.relances}
          ctaLabel="Lancer une relance"
          onOpen={() => onOpen("relance")}
        />
        <ToolPanel
          tag="4 · ESCALADE"
          accent="warn"
          icon="alert-triangle"
          title="Escalader à Tudi · arbitrage"
          sub="Motif obligatoire · urgence vert / orange / rouge. Badge sur le dossier."
          count={counts.escalades}
          ctaLabel="Escalader à Tudi"
          onOpen={() => onOpen("escalade")}
        />
      </div>

      <div style={{
        marginTop: 16, paddingTop: 14, borderTop: "1px dashed var(--border)",
        fontSize: 11, color: "var(--fg-mute)", display: "flex", alignItems: "center", gap: 8,
      }}>
        <i data-lucide="info" style={{ width: 12, height: 12 }} />
        Toute action est tracée dans le Carnet de bord avec owner et timestamp.
      </div>
    </div>
  );
}

// ============== BLOC 4 · SIGNAUX D'ATTENTION ==============
function Signal({ tone, cause, levier, gain }) {
  const fg = tone === "warn" ? "var(--warn)" : tone === "err" ? "var(--err)" : "var(--ok)";
  const bg = tone === "warn" ? "var(--warn-soft)" : tone === "err" ? "var(--err-soft)" : "var(--ok-soft)";
  return (
    <div style={{
      padding: 18, borderRadius: 8,
      background: "var(--bg-elev-1)", border: "1px solid var(--border)",
      borderLeft: `2px solid ${fg}`,
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600,
          padding: "2px 7px", borderRadius: 2, letterSpacing: "0.08em",
          background: bg, color: fg, textTransform: "uppercase",
        }}>Signal</span>
      </div>
      <div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 4, fontWeight: 500 }}>Cause</div>
        <div style={{ fontSize: 13, color: "var(--fg-1)", lineHeight: 1.4 }}>{cause}</div>
      </div>
      <div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 4, fontWeight: 500 }}>Levier</div>
        <div style={{ fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.45 }}>{levier}</div>
      </div>
      <div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginBottom: 4, fontWeight: 500 }}>Gain</div>
        <div style={{ fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.45 }}>{gain}</div>
      </div>
    </div>
  );
}

function SignalsBloc() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-1)" }}>Signaux d'attention</div>
          <div style={{ fontSize: 12, color: "var(--fg-3)" }}>Cause → Levier → Gain. Pulse réclamations cette semaine.</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <Signal
          tone="err"
          cause="3 réclamations NS ENTREPRISE en 60 j (Facturation · Marge · Délai)."
          levier="Revue compte client + arbitrage Tudi sur la relation commerciale."
          gain="Préserver client #2 du portefeuille."
        />
        <Signal
          tone="warn"
          cause="5 réclamations Facturation ce trimestre · récurrence cross-clients."
          levier="Signal qualité à Haja · revue du process pré-facturation."
          gain="Réduire le bruit aval et le DSO."
        />
        <Signal
          tone="err"
          cause="2 SLA accusé réception dépassés cette semaine."
          levier="Surveillance inbox matin/midi/soir · règle « accusé d'abord, fond ensuite »."
          gain="Confiance client préservée."
        />
      </div>
    </div>
  );
}

window.OrientationStrip = OrientationStrip;
window.ToolsBloc = ToolsBloc;
window.SignalsBloc = SignalsBloc;
