/* global React, SERGE, Btn, StatusChip, SectionRule */
/* ============================================================
   ProfilSerge.jsx — ONGLET 5 · Profil Serge
   5.1 identité · 5.2 6 bascules leadership · 5.3 1-on-1 Édienne ·
   5.4 cascade lineage · 5.5 coaching reçu · 5.6 RBAC · 5.7 paramètres
   ============================================================ */
const { useState: useStatePR, useEffect: useEffectPR } = React;

function LeadershipBar({ axe, score, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 13, color: "var(--fg-1)", fontWeight: 500 }}>{axe}</span>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{score}/5</span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => onChange(n)} aria-label={`${axe} ${n}`} style={{
            flex: 1, height: 8, borderRadius: 2, cursor: "pointer", border: 0, padding: 0,
            background: n <= score ? "var(--accent)" : "var(--surface-2)", transition: "background 120ms",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ---- 5.4 Cascade lineage ---- */
function CascadeLineage() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 0 }}>
      {SERGE.lineage.map((l, i, arr) => (
        <React.Fragment key={i}>
          <div style={{
            display: "grid", gridTemplateColumns: "52px 1fr auto", gap: 16, alignItems: "center",
            padding: "14px 16px", borderRadius: 6,
            background: l.me ? "var(--accent-soft)" : l.leaf ? "var(--bg-elev-1)" : "transparent",
            border: l.me ? "1px solid var(--accent)" : l.leaf ? "1px solid var(--border-soft)" : "1px solid transparent",
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, fontWeight: 600, color: l.me ? "var(--accent)" : "var(--fg-3)" }}>{l.lvl}</span>
              <span style={{
                width: 36, height: 36, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                background: l.me ? "var(--accent)" : "var(--surface-2)", border: l.me ? "none" : "1px solid var(--border)",
                fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 12, color: l.me ? "var(--accent-fg)" : "var(--fg-2)",
              }}>
                {l.leaf ? <i data-lucide="users" style={{ width: 16, height: 16 }} /> : l.me ? <i data-lucide="star" style={{ width: 16, height: 16 }} /> : l.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>{l.name}</span>
                {l.me && <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 2, background: "var(--accent)", color: "var(--accent-fg)", letterSpacing: "0.08em" }}>MOI</span>}
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>{l.role}</div>
            </div>
          </div>
          {i < arr.length - 1 && (
            <div style={{ display: "flex", justifyContent: "center", color: "var(--fg-mute)", padding: "2px 0" }}>
              <i data-lucide="chevron-up" style={{ width: 18, height: 18 }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ProfilSerge() {
  const [leadership, setLeadership] = useStatePR(SERGE.leadership.map(l => l.score));
  const [lang, setLang] = useStatePR("FR");
  const [notif, setNotif] = useStatePR("explicit");
  const [dark, setDark] = useStatePR(true);

  useEffectPR(() => { const t = setTimeout(() => window.lucide && lucide.createIcons(), 40); return () => clearTimeout(t); }, [leadership, lang, notif, dark]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30, padding: "26px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* 5.1 identité */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Identité" />
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 22, display: "grid", gridTemplateColumns: "72px 1fr", gap: 20, alignItems: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--accent-soft)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 600, color: "var(--accent)" }}>SE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "var(--fg-1)" }}>{SERGE.persona}</div>
            <div style={{ fontSize: 13, color: "var(--fg-2)" }}>{SERGE.role}</div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{SERGE.email} · sous {SERGE.manager} · cascade D54 25 %</div>
          </div>
        </div>
      </section>

      {/* 5.2 leadership */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Leadership · auto-évaluation" meta="6 axes · ajustables" />
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 40px" }}>
          {SERGE.leadership.map((l, i) => (
            <LeadershipBar key={i} axe={l.axe} score={leadership[i]} onChange={(n) => setLeadership(prev => prev.map((v, j) => j === i ? n : v))} />
          ))}
        </div>
      </section>

      {/* 5.3 1-on-1 Édienne */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="1-on-1 trimestriel · Serge ↔ Édienne" meta="différencié W16 mensuel chauffeur" />
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 22, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Cadence", SERGE.oneOnOneEdienne.cadence], ["Agenda", SERGE.oneOnOneEdienne.agenda], ["Prochain 1-on-1", SERGE.oneOnOneEdienne.prochain]].map((r, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600 }}>{r[0]}</span>
                <span style={{ fontSize: 13, color: "var(--fg-1)", fontFamily: i === 2 ? "IBM Plex Mono, monospace" : "Inter" }}>{r[1]}</span>
              </div>
            ))}
          </div>
          <div>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--fg-3)", fontWeight: 600 }}>Historique · 4 derniers</span>
            <div style={{ marginTop: 10 }}>
              {SERGE.oneOnOneEdienne.historique.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--border-soft)" }}>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)", width: 80, flexShrink: 0 }}>{h.d}</span>
                  <span style={{ fontSize: 12, color: "var(--fg-1)" }}>{h.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5.4 cascade lineage */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Cascade lineage" meta="Kenny ← Fabry ← Joel ← Serge ← 15 chauffeurs" />
        <CascadeLineage />
      </section>

      {/* 5.5 coaching reçu */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionRule label="Coaching reçu · Serge" meta="pas seulement donné" />
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
          {SERGE.coaching.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "92px 80px 1fr auto", gap: 14, alignItems: "center", padding: "12px 18px", borderBottom: i < SERGE.coaching.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--fg-3)" }}>{c.d}</span>
              <StatusChip kind="accent" dot={false}>{c.from}</StatusChip>
              <span style={{ fontSize: 13, color: "var(--fg-1)" }}>{c.note}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--accent)" }}><i data-lucide="link" style={{ width: 12, height: 12 }} /> M13</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5.6 RBAC + 5.7 paramètres */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionRule label="Permissions RBAC" />
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--fg-1)" }}>
              <i data-lucide="check-circle-2" style={{ width: 15, height: 15, color: "var(--ok)" }} /> DRV-001 → DRV-015 · nominatif
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--fg-2)" }}>
              <i data-lucide="x-circle" style={{ width: 15, height: 15, color: "var(--err)" }} /> Pas d'accès autres N4 (Mohamed · Ando · MM)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--fg-2)" }}>
              <i data-lucide="lock" style={{ width: 15, height: 15, color: "var(--fg-mute)" }} /> Médical chauffeurs · RBAC Édienne (RLS B17)
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionRule label="Paramètres" />
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
            <SettingRow label="Langue">
              <Segmented value={lang} onChange={setLang} options={["FR", "MG"]} />
            </SettingRow>
            <SettingRow label="Notifications">
              <Segmented value={notif} onChange={setNotif} options={[["explicit", "explicit only"], ["off", "0 push auto"]]} />
            </SettingRow>
            <SettingRow label="Mode sombre (D82)">
              <Segmented value={dark ? "on" : "off"} onChange={(v) => setDark(v === "on")} options={[["on", "Dark"], ["off", "Light"]]} />
            </SettingRow>
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 13, color: "var(--fg-1)" }}>{label}</span>
      {children}
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  const opts = options.map(o => Array.isArray(o) ? o : [o, o]);
  return (
    <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
      {opts.map(([v, l], i) => (
        <button key={v} onClick={() => onChange(v)} style={{
          fontFamily: "Inter", fontSize: 12, fontWeight: 500, padding: "6px 12px", cursor: "pointer", border: 0,
          borderLeft: i > 0 ? "1px solid var(--border-soft)" : "none",
          background: value === v ? "var(--accent)" : "transparent", color: value === v ? "var(--accent-fg)" : "var(--fg-2)",
        }}>{l}</button>
      ))}
    </div>
  );
}

window.ProfilSerge = ProfilSerge;
