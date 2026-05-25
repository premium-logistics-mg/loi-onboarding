// HSE Terrain — 6 onglets + flux déclaration + détail inspection. Themed via `t` prop.
// FR métier, IBM Plex Mono sur tout chiffre, status = couleur + forme + libellé.

// ════════════════════════════════════════════════════════════
// Atoms
// ════════════════════════════════════════════════════════════
function HCheck({ size = 22, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function HChev({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function HToConfirm({ children = 'À CONFIRMER' }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
      color: D82.orange, background: 'rgba(199,126,42,0.14)',
      border: `1px solid rgba(199,126,42,0.45)`,
      padding: '2px 6px', borderRadius: 3,
      fontFamily: D82.ui, textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}
function HSectionLabel({ t, children, right }) {
  return (
    <div style={{
      padding: '14px 18px 8px',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 800, color: t.text2,
        letterSpacing: 1.5, textTransform: 'uppercase',
      }}>{children}</span>
      {right && <span style={{ fontSize: 11, color: t.text3, fontFamily: D82.mono, letterSpacing: 0.5 }}>{right}</span>}
    </div>
  );
}

// ─── Status pastille (4 états INSPECTION) ──────────────────
// OK = rond teal · Alerte = triangle orange · Critique = carré rouge · Non vérifié = losange navy
function HStatus({ kind, size = 22, withRing = false }) {
  const stroke = '#fff';
  const inner = (() => {
    switch (kind) {
      case 'ok':
        return { color: D82.ok, shape: <circle cx="11" cy="11" r="7" fill="#fff"/>, label: 'OK' };
      case 'alerte':
        return { color: D82.orange, shape: <path d="M11 4l8 14H3L11 4z" fill="#fff"/>, label: 'ALERTE' };
      case 'critique':
        return { color: D82.red, shape: <rect x="4" y="4" width="14" height="14" rx="1.5" fill="#fff"/>, label: 'CRITIQUE' };
      case 'nonverif':
        return { color: D82.navy, shape: <path d="M11 3l8 8-8 8-8-8z" stroke="#fff" strokeWidth="2.2" fill="none"/>, label: 'NON VÉRIFIÉ' };
    }
  })();
  return (
    <div style={{
      width: size, height: size, borderRadius: kind === 'ok' ? '50%' : 5,
      background: inner.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: withRing ? `0 0 0 4px ${inner.color}33` : 'none',
      flexShrink: 0,
    }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 22 22">
        {inner.shape}
      </svg>
    </div>
  );
}

// Severity pill — used in incident declare
// mineure = rond teal · majeure = triangle orange · critique = carré rouge
function HSeverityChip({ kind, selected, t }) {
  const config = {
    mineure: { color: D82.ok,     label: 'Mineure',  shape: 'circle' },
    majeure: { color: D82.orange, label: 'Majeure',  shape: 'tri' },
    critique:{ color: D82.red,    label: 'Critique', shape: 'sq' },
  }[kind];
  return (
    <button style={{
      flex: 1, minHeight: 72, padding: '10px 6px',
      background: selected ? config.color : t.surface,
      border: `2px solid ${selected ? config.color : t.line}`,
      borderRadius: 12, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
      color: selected ? '#fff' : t.text,
    }}>
      {config.shape === 'circle' && <span style={{ width: 18, height: 18, borderRadius: '50%', background: selected ? '#fff' : config.color }}/>}
      {config.shape === 'tri' && (
        <svg width="20" height="18" viewBox="0 0 20 18"><path d="M10 1l9 16H1L10 1z" fill={selected ? '#fff' : config.color}/></svg>
      )}
      {config.shape === 'sq' && <span style={{ width: 18, height: 18, background: selected ? '#fff' : config.color }}/>}
      <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.3 }}>{config.label}</span>
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// 1 · ACCUEIL — 2 héros + compteurs + worklist
// ════════════════════════════════════════════════════════════
function HHero({ t, tone, title, sub, icon }) {
  // tone: 'red' (incident) | 'teal' (observation)
  const bg = tone === 'red' ? D82.red : D82.teal;
  const shadow = tone === 'red'
    ? '0 12px 32px rgba(184,66,30,0.50)'
    : '0 12px 32px rgba(26,142,126,0.40)';
  return (
    <button style={{
      width: '100%', minHeight: 96,
      background: bg, color: '#fff', border: 0, borderRadius: 14,
      padding: '16px 18px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
      boxShadow: shadow,
      fontFamily: D82.ui,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 14, flexShrink: 0,
        background: 'rgba(255,255,255,0.18)',
        border: '1.5px solid rgba(255,255,255,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 13, marginTop: 4, opacity: 0.92, fontWeight: 500 }}>{sub}</div>
      </div>
      <HChev size={26}/>
    </button>
  );
}

function HCounter({ t, label, value, tone = 'neutral' }) {
  // tone: neutral (text), red (critique), orange (warn), teal (good)
  const accent = {
    neutral: t.text,
    red:     D82.red,
    orange:  D82.orange,
    teal:    D82.ok,
  }[tone];
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: t.surface, border: `1.5px solid ${t.line}`,
      borderRadius: 10, padding: '10px 12px',
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: 1.3,
        color: t.text3, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        fontFamily: D82.mono, fontSize: 28, fontWeight: 700,
        color: accent, letterSpacing: 0.5, lineHeight: 1.1,
      }}>{value}</div>
    </div>
  );
}

function HScreenAccueil({ t }) {
  const inspections = [
    { code: 'INSP-2026-0517', site: 'Port Toamasina · PDP',     veh: 'CT-007 · 4271 TCB', status: 'pending' },
    { code: 'INSP-2026-0518', site: 'APC Andriamena · RN44',    veh: 'CT-011 · 5602 TCB', status: 'urgent'  },
    { code: 'INSP-2026-0519', site: 'Garage Betainomby',        veh: 'CT-005 · 2945 TCB', status: 'pending' },
    { code: 'INSP-2026-0520', site: 'Moramanga · relais',       veh: 'CT-003 · 1827 TCB', status: 'pending' },
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {/* Héros — les 2 plus gros éléments de l'écran */}
      <div style={{ padding: '16px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <HHero t={t} tone="red"
          title="Signaler incident"
          sub="Sévérité · photo preuve · vocal · cascade HSE"
          icon={
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l10 17H2L12 3z" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"/>
              <path d="M12 10v5M12 18v.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/>
            </svg>
          }
        />
        <HHero t={t} tone="teal"
          title="Observation / Toolbox QSHE"
          sub="Geste sûr · presque-accident · briefing"
          icon={
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M3 5h14l4 4v8a2 2 0 01-2 2H3V5z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M7 11h10M7 14h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
        />
      </div>

      <HSectionLabel t={t} right="25 mai · 07:42">Worklist</HSectionLabel>

      <div style={{ padding: '0 14px', display: 'flex', gap: 8 }}>
        <HCounter t={t} label="À faire"   value="12"/>
        <HCounter t={t} label="En cours"  value="03" tone="orange"/>
        <HCounter t={t} label="Critiques" value="02" tone="red"/>
        <HCounter t={t} label="Du jour"   value="08" tone="teal"/>
      </div>

      <HSectionLabel t={t} right="4 sites">Inspections du jour</HSectionLabel>

      <div style={{ padding: '0 12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {inspections.map((it) => {
          const urgent = it.status === 'urgent';
          return (
            <button key={it.code} style={{
              width: '100%', background: t.surface,
              border: `1.5px solid ${urgent ? D82.red : t.line}`,
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              minHeight: 72, cursor: 'pointer', textAlign: 'left',
              color: t.text,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: urgent ? D82.redSoft : t.surfaceMute,
                border: urgent ? `1.5px solid ${D82.red}` : `1.5px solid ${t.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {urgent ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="5" width="14" height="14" rx="1.5" fill={D82.red}/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="4" width="14" height="17" rx="2" stroke={t.text2} strokeWidth="1.8"/>
                    <rect x="9" y="2" width="6" height="4" rx="1" stroke={t.text2} strokeWidth="1.8"/>
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: D82.mono, fontSize: 13, fontWeight: 700, color: t.text }}>{it.code}</span>
                  {urgent && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
                      padding: '2px 6px', borderRadius: 3,
                      background: D82.redSoft, color: D82.red,
                      border: `1px solid ${D82.red}`,
                    }}>RETARD</span>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginTop: 2 }}>{it.site}</div>
                <div style={{ fontSize: 12, color: t.text3, marginTop: 1, fontFamily: D82.mono }}>{it.veh}</div>
              </div>
              <HChev color={t.text3}/>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2 · CAPTURE — viewfinder caméra HTML5 + label preuve
// ════════════════════════════════════════════════════════════
function HScreenCapture({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Viewfinder */}
      <div style={{
        flex: 1, minHeight: 0, position: 'relative',
        background: '#0A0F18',
        backgroundImage: `
          radial-gradient(circle at 30% 40%, rgba(255,255,255,0.04) 0%, transparent 50%),
          repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 14px, transparent 14px 28px)
        `,
        overflow: 'hidden',
      }}>
        {/* Corner guides */}
        {[
          { top: 18, left: 18, rot: 0 },
          { top: 18, right: 18, rot: 90 },
          { bottom: 18, right: 18, rot: 180 },
          { bottom: 18, left: 18, rot: 270 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', ...c,
            width: 32, height: 32,
            transform: `rotate(${c.rot}deg)`,
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 3, background: D82.teal }}/>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: 32, background: D82.teal }}/>
          </div>
        ))}

        {/* Center crosshair */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 56, height: 56, borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }}/>
        </div>

        {/* Top overlay — label entry */}
        <div style={{
          position: 'absolute', top: 12, left: 12, right: 12,
          background: 'rgba(11,37,64,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '10px 12px',
        }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
            color: '#9CB3D1', textTransform: 'uppercase',
          }}>Label de la preuve</div>
          <div style={{
            fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            Fuite hydraulique
            <span style={{
              width: 1.5, height: 16, background: D82.teal,
              animation: 'caret 1s steps(2) infinite',
            }}/>
          </div>
          <div style={{
            display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap',
          }}>
            {['Pneu', 'Fuite', 'EPI', 'Charge', 'Route', 'Autre'].map((tag, i) => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 600,
                padding: '4px 8px', borderRadius: 999,
                background: i === 1 ? D82.teal : 'rgba(255,255,255,0.10)',
                color: i === 1 ? '#fff' : '#B7C9E0',
                border: i === 1 ? `1px solid ${D82.teal}` : '1px solid rgba(255,255,255,0.18)',
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Bottom overlay — metadata */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
        }}>
          {[
            { k: 'Site',    v: 'APC Andriamena' },
            { k: 'GPS',     v: '−17.5841, 47.0319', mono: true },
            { k: 'Horaire', v: '07:42:14', mono: true },
          ].map((m) => (
            <span key={m.k} style={{
              fontSize: 11, fontWeight: 600,
              padding: '4px 9px', borderRadius: 6,
              background: 'rgba(11,37,64,0.8)',
              color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
              fontFamily: m.mono ? D82.mono : D82.ui,
              letterSpacing: m.mono ? 0.3 : 0,
            }}>
              <span style={{ color: '#9CB3D1', marginRight: 6, textTransform: 'uppercase', letterSpacing: 1, fontSize: 9, fontWeight: 800 }}>{m.k}</span>
              {m.v}
            </span>
          ))}
        </div>
      </div>

      {/* Camera controls */}
      <div style={{
        padding: '14px 14px 8px',
        background: t.mode === 'dark' ? '#0A1A2E' : t.surface,
        borderTop: `1px solid ${t.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <button style={{
          width: 56, height: 56, borderRadius: 12,
          background: t.surfaceMute, border: `1.5px solid ${t.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="6" height="6" rx="1" stroke={t.text2} strokeWidth="1.8"/>
            <rect x="3" y="14" width="6" height="6" rx="1" stroke={t.text2} strokeWidth="1.8"/>
            <rect x="15" y="4" width="6" height="6" rx="1" fill={t.text2}/>
            <rect x="15" y="14" width="6" height="6" rx="1" fill={t.text2}/>
          </svg>
        </button>

        <button style={{
          width: 76, height: 76, borderRadius: '50%',
          background: '#fff', border: `4px solid ${D82.teal}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(26,142,126,0.40)',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: D82.teal }}/>
        </button>

        <button style={{
          width: 56, height: 56, borderRadius: 12,
          background: t.surfaceMute, border: `1.5px solid ${t.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M4 7L12 14L20 7" stroke={t.text2} strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M4 13L12 20L20 13" stroke={t.text2} strokeWidth="1.8" strokeLinejoin="round" opacity="0.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3 · INSPECTION — checklist site/véhicule à 4 états
// ════════════════════════════════════════════════════════════
const INSP_ITEMS = [
  { group: 'Véhicule',     label: 'Pneus · pression · état',       status: 'ok' },
  { group: 'Véhicule',     label: 'Feux · phares + clignotants',   status: 'ok' },
  { group: 'Véhicule',     label: 'Niveaux · huile + eau',         status: 'alerte' },
  { group: 'Véhicule',     label: 'Freins · niveau pédale',        status: 'critique' },
  { group: 'Charge',       label: 'Arrimage · sangles',            status: 'ok' },
  { group: 'Charge',       label: 'Bâche · état couverture',       status: 'alerte' },
  { group: 'Site',         label: 'Zone manœuvre dégagée',         status: 'nonverif' },
  { group: 'Site',         label: 'Signalisation chantier',        status: 'ok' },
  { group: 'Documents',    label: 'Carte grise + permis',          status: 'nonverif' },
];

function HInspRow({ t, item, idx }) {
  const status = item.status;
  const stColor = {
    ok: D82.ok, alerte: D82.orange, critique: D82.red, nonverif: '#5B7398',
  }[status];
  const stLabel = {
    ok: 'OK', alerte: 'ALERTE', critique: 'CRITIQUE', nonverif: 'NON VÉRIFIÉ',
  }[status];
  return (
    <div style={{
      background: t.surface,
      border: `1.5px solid ${status === 'critique' ? D82.red : (status === 'alerte' ? D82.orange : t.line)}`,
      borderRadius: 10, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12, minHeight: 64,
    }}>
      <span style={{
        fontFamily: D82.mono, fontSize: 11, color: t.text3,
        fontWeight: 700, width: 22, flexShrink: 0,
      }}>{String(idx).padStart(2, '0')}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{item.label}</div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: stColor, marginTop: 2,
          letterSpacing: 1, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {/* Forme + libellé — jamais couleur seule */}
          {status === 'ok'       && <span style={{ width: 10, height: 10, borderRadius: '50%', background: stColor }}/>}
          {status === 'alerte'   && (
            <svg width="12" height="11" viewBox="0 0 12 11"><path d="M6 0.5l5.5 9.5h-11L6 0.5z" fill={stColor}/></svg>
          )}
          {status === 'critique' && <span style={{ width: 10, height: 10, background: stColor }}/>}
          {status === 'nonverif' && (
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 0.5l5.5 5.5L6 11.5 0.5 6z" stroke={stColor} strokeWidth="1.5" fill="none"/></svg>
          )}
          {stLabel}
        </div>
      </div>
      <HChev color={t.text3} size={18}/>
    </div>
  );
}

function HScreenInspection({ t }) {
  // Cascade: 1 critique → bandeau cascade HSE
  const ok = INSP_ITEMS.filter(i => i.status === 'ok').length;
  const al = INSP_ITEMS.filter(i => i.status === 'alerte').length;
  const cr = INSP_ITEMS.filter(i => i.status === 'critique').length;
  const nv = INSP_ITEMS.filter(i => i.status === 'nonverif').length;

  // Group by section
  const groups = ['Véhicule', 'Charge', 'Site', 'Documents'];

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header inspection */}
      <div style={{
        padding: '10px 14px',
        background: t.mode === 'dark' ? 'rgba(26,142,126,0.14)' : 'rgba(26,142,126,0.10)',
        borderBottom: `1px solid ${t.line}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
            color: t.text2, textTransform: 'uppercase',
          }}>Inspection en cours</div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: t.text, marginTop: 2,
            fontFamily: D82.mono, letterSpacing: 0.3,
          }}>INSP-2026-0518 · CT-011</div>
          <div style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>APC Andriamena · RN44</div>
        </div>
        <div style={{
          fontFamily: D82.mono, fontSize: 22, fontWeight: 700, color: t.text,
        }}>{ok + al + cr}<span style={{ fontSize: 13, color: t.text3 }}> / {INSP_ITEMS.length}</span></div>
      </div>

      {/* Legend / counters */}
      <div style={{ padding: '10px 14px 0', display: 'flex', gap: 6 }}>
        {[
          { k: 'OK',          v: ok, color: D82.ok,     shape: 'circle' },
          { k: 'Alerte',      v: al, color: D82.orange, shape: 'tri' },
          { k: 'Critique',    v: cr, color: D82.red,    shape: 'sq' },
          { k: 'Non vérifié', v: nv, color: '#5B7398',  shape: 'rhombus' },
        ].map((s) => (
          <div key={s.k} style={{
            flex: 1, minWidth: 0,
            background: t.surface, border: `1.5px solid ${t.line}`,
            borderRadius: 8, padding: '8px 8px',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {s.shape === 'circle' && <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }}/>}
              {s.shape === 'tri' && (
                <svg width="11" height="10" viewBox="0 0 11 10"><path d="M5.5 0.5l5 9h-10L5.5 0.5z" fill={s.color}/></svg>
              )}
              {s.shape === 'sq' && <span style={{ width: 10, height: 10, background: s.color }}/>}
              {s.shape === 'rhombus' && (
                <svg width="11" height="11" viewBox="0 0 11 11"><path d="M5.5 0.5l5 5-5 5-5-5z" stroke={s.color} strokeWidth="1.6" fill="none"/></svg>
              )}
              <span style={{
                fontSize: 9, fontWeight: 800, color: t.text3,
                letterSpacing: 1, textTransform: 'uppercase',
              }}>{s.k}</span>
            </div>
            <div style={{ fontFamily: D82.mono, fontSize: 18, fontWeight: 700, color: t.text }}>{String(s.v).padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      {/* Cascade banner */}
      {cr > 0 && (
        <div style={{
          margin: '10px 14px 4px',
          padding: '12px 14px', borderRadius: 10,
          background: D82.redSoft,
          border: `1.5px solid ${D82.red}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="1.5" fill={D82.red}/>
            <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: D82.red, letterSpacing: 0.3 }}>
              {cr} item critique · cascade HSE
            </div>
            <div style={{ fontSize: 12, color: t.text2, marginTop: 1, fontWeight: 500 }}>
              Une action ACT-2026 sera créée à l'envoi
            </div>
          </div>
        </div>
      )}

      {/* Items grouped */}
      <div style={{ padding: '8px 12px 16px' }}>
        {groups.map((g) => {
          const rows = INSP_ITEMS.filter(i => i.group === g);
          if (!rows.length) return null;
          return (
            <div key={g}>
              <HSectionLabel t={t}>{g}</HSectionLabel>
              <div style={{ padding: '0 2px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map((r, i) => (
                  <HInspRow key={r.label} t={t} item={r}
                    idx={INSP_ITEMS.indexOf(r) + 1}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4 · ACTIONS — liste ACT-2026 avec « Clôturer »
// ════════════════════════════════════════════════════════════
const ACTIONS_LIST = [
  { code: 'ACT-2026-0142', label: 'Remplacer disque frein arrière', src: 'INSP-2026-0518', site: 'APC Andriamena', due: '26 mai', sev: 'critique', open: true },
  { code: 'ACT-2026-0141', label: 'Recharger extincteur cabine',    src: 'EPI · CT-007',     site: 'Port Toamasina', due: '27 mai', sev: 'majeure', open: true },
  { code: 'ACT-2026-0140', label: 'Rafraîchir signalétique zone PDP', src: 'EVT-2026-0204', site: 'Port Toamasina', due: '30 mai', sev: 'mineure', open: true },
  { code: 'ACT-2026-0138', label: 'Nettoyer fuite hydraulique',     src: 'EVT-2026-0201', site: 'Garage Betainomby', due: '24 mai · clos', sev: 'majeure', open: false },
];

function HActionRow({ t, a }) {
  const cfg = {
    critique: { color: D82.red,    shape: 'sq',  label: 'Critique' },
    majeure:  { color: D82.orange, shape: 'tri', label: 'Majeure' },
    mineure:  { color: D82.ok,     shape: 'dot', label: 'Mineure' },
  }[a.sev];
  return (
    <div style={{
      background: t.surface,
      border: `1.5px solid ${a.open && a.sev === 'critique' ? D82.red : t.line}`,
      borderRadius: 12, padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 10,
      opacity: a.open ? 1 : 0.7,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: D82.mono, fontSize: 12, fontWeight: 700,
          color: t.text2, letterSpacing: 0.4,
        }}>{a.code}</span>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
          padding: '2px 6px', borderRadius: 3,
          background: a.open ? `${cfg.color}22` : t.surfaceMute,
          color: a.open ? cfg.color : t.text3,
          border: `1px solid ${a.open ? cfg.color : t.line}`,
          textTransform: 'uppercase',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          {cfg.shape === 'dot' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.open ? cfg.color : t.text3 }}/>}
          {cfg.shape === 'tri' && (
            <svg width="8" height="7" viewBox="0 0 8 7"><path d="M4 0.4l3.6 6.2H0.4L4 0.4z" fill={a.open ? cfg.color : t.text3}/></svg>
          )}
          {cfg.shape === 'sq' && <span style={{ width: 7, height: 7, background: a.open ? cfg.color : t.text3 }}/>}
          {cfg.label}
        </span>
        {!a.open && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
            padding: '2px 6px', borderRadius: 3,
            background: D82.okSoft, color: D82.ok,
            border: `1px solid ${D82.ok}`,
            textTransform: 'uppercase',
          }}>Clos</span>
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: t.text, lineHeight: 1.25 }}>
        {a.label}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        fontSize: 12, color: t.text3, fontWeight: 500,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" stroke={t.text3} strokeWidth="1.8"/>
            <circle cx="12" cy="9" r="2.4" stroke={t.text3} strokeWidth="1.8"/>
          </svg>
          {a.site}
        </span>
        <span style={{ color: t.text4 }}>·</span>
        <span style={{ fontFamily: D82.mono, letterSpacing: 0.3 }}>Source {a.src}</span>
        <span style={{ color: t.text4 }}>·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="5.5" width="17" height="15" rx="2" stroke={t.text3} strokeWidth="1.8"/>
            <path d="M3.5 10h17M8 3v4M16 3v4" stroke={t.text3} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          {a.due}
        </span>
      </div>
      {a.open && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            flex: 1, height: 44, minHeight: 44,
            background: D82.teal, border: 0, color: '#fff', borderRadius: 8,
            fontFamily: D82.ui, fontSize: 13, fontWeight: 800,
            letterSpacing: 0.5, textTransform: 'uppercase', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <HCheck size={16}/> Clôturer
          </button>
          <button style={{
            flex: '0 0 44%', height: 44, minHeight: 44,
            background: 'transparent', color: t.text,
            border: `1.5px solid ${t.line}`, borderRadius: 8,
            fontFamily: D82.ui, fontSize: 13, fontWeight: 700,
            letterSpacing: 0.4, cursor: 'pointer',
          }}>Détails</button>
        </div>
      )}
    </div>
  );
}

function HScreenActions({ t }) {
  const open = ACTIONS_LIST.filter(a => a.open).length;
  const closed = ACTIONS_LIST.length - open;
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ padding: '14px 14px 0', display: 'flex', gap: 8 }}>
        {[
          { k: 'Ouvertes',  v: open,   active: true },
          { k: 'Clos',      v: closed, active: false },
          { k: 'Toutes',    v: ACTIONS_LIST.length, active: false },
        ].map((seg) => (
          <button key={seg.k} style={{
            flex: 1, minHeight: 44, padding: '8px 6px',
            background: seg.active ? D82.teal : t.surface,
            border: `1.5px solid ${seg.active ? D82.teal : t.line}`,
            borderRadius: 8, color: seg.active ? '#fff' : t.text,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
            cursor: 'pointer',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
              textTransform: 'uppercase', opacity: 0.9,
            }}>{seg.k}</span>
            <span style={{
              fontFamily: D82.mono, fontSize: 16, fontWeight: 700,
            }}>{String(seg.v).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      <HSectionLabel t={t} right="ACT-2026">Actions correctives</HSectionLabel>

      <div style={{ padding: '0 12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ACTIONS_LIST.map((a) => (
          <HActionRow key={a.code} t={t} a={a}/>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 5 · FEED — fil compact des événements récents
// ════════════════════════════════════════════════════════════
const FEED = [
  { code: 'EVT-2026-0207', time: '07:38', kind: 'incident', sev: 'critique', who: 'PL-HSE-007', label: 'Freins défaillants', site: 'APC Andriamena', via: 'INSP-2026-0518' },
  { code: 'EVT-2026-0206', time: '07:24', kind: 'observ',   sev: 'mineure',  who: 'PL-HSE-007', label: 'Geste sûr · arrimage', site: 'Port Toamasina · PDP', via: null },
  { code: 'EVT-2026-0205', time: '06:55', kind: 'epi',      sev: 'majeure',  who: 'PL-HSE-007', label: 'Casque manquant CT-005', site: 'Garage Betainomby', via: 'EPI · CT-005' },
  { code: 'EVT-2026-0204', time: 'Hier · 17:12', kind: 'incident', sev: 'majeure', who: 'PL-HSE-003', label: 'Bâche déchirée', site: 'Moramanga · relais', via: 'INSP-2026-0517' },
  { code: 'EVT-2026-0203', time: 'Hier · 14:08', kind: 'observ', sev: 'mineure', who: 'PL-HSE-007', label: 'Toolbox briefing matinal', site: 'Garage Betainomby', via: null },
];

function HFeedItem({ t, e, isLast }) {
  const cfg = {
    critique: { color: D82.red,    shape: 'sq',  label: 'Critique' },
    majeure:  { color: D82.orange, shape: 'tri', label: 'Majeure' },
    mineure:  { color: D82.ok,     shape: 'dot', label: 'Mineure' },
  }[e.sev];
  const kindLabel = { incident: 'Incident', observ: 'Observation', epi: 'EPI' }[e.kind];
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {/* Rail */}
      <div style={{ width: 28, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
        <div style={{
          width: 18, height: 18, borderRadius: cfg.shape === 'sq' ? 3 : (cfg.shape === 'tri' ? 0 : '50%'),
          background: cfg.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...(cfg.shape === 'tri' ? { background: 'transparent' } : {}),
        }}>
          {cfg.shape === 'tri' && (
            <svg width="18" height="16" viewBox="0 0 18 16"><path d="M9 0.5l8.5 15h-17L9 0.5z" fill={cfg.color}/></svg>
          )}
        </div>
        {!isLast && <div style={{ flex: 1, width: 2, background: t.line, marginTop: 4 }}/>}
      </div>
      {/* Card */}
      <div style={{
        flex: 1, minWidth: 0,
        background: t.surface, border: `1.5px solid ${t.line}`,
        borderRadius: 10, padding: '10px 12px',
        marginBottom: 10,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
        }}>
          <span style={{ color: cfg.color }}>{kindLabel}</span>
          <span style={{ color: t.text4 }}>·</span>
          <span style={{ color: t.text3 }}>{cfg.label}</span>
          <span style={{ color: t.text4, marginLeft: 'auto' }}>·</span>
          <span style={{ color: t.text3, fontFamily: D82.mono, letterSpacing: 0.3 }}>{e.time}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginTop: 4, lineHeight: 1.25 }}>{e.label}</div>
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6,
          fontSize: 11, color: t.text3, marginTop: 4, fontWeight: 500,
        }}>
          <span style={{ fontFamily: D82.mono }}>{e.code}</span>
          <span style={{ color: t.text4 }}>·</span>
          <span>{e.site}</span>
          <span style={{ color: t.text4 }}>·</span>
          <span style={{ fontFamily: D82.mono }}>{e.who}</span>
          {e.via && <>
            <span style={{ color: t.text4 }}>·</span>
            <span style={{ fontFamily: D82.mono }}>{e.via}</span>
          </>}
        </div>
      </div>
    </div>
  );
}

function HScreenFeed({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <HSectionLabel t={t} right="5 derniers">Fil des événements</HSectionLabel>
      <div style={{ padding: '0 12px 16px' }}>
        {FEED.map((e, i) => (
          <HFeedItem key={e.code} t={t} e={e} isLast={i === FEED.length - 1}/>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 6 · EPI — check-list à bascule + compteur conformes
// ════════════════════════════════════════════════════════════
const EPI_ITEMS = [
  { label: 'Casque de chantier',             conformite: true,  detail: 'Porté · état OK' },
  { label: 'Chaussures de sécurité',         conformite: true,  detail: 'S3 anti-perforation' },
  { label: 'Gilet haute-visibilité',         conformite: true,  detail: 'Classe 2 · propre' },
  { label: 'Gants de manutention',           conformite: true,  detail: 'Cuir · taille L' },
  { label: 'Lunettes de protection',         conformite: false, detail: 'Cassées · à remplacer' },
  { label: 'Bouchons d\'oreilles',           conformite: true,  detail: 'SNR 32 · jetables' },
  { label: 'Masque anti-poussière FFP2',     conformite: true,  detail: 'Stock OK · 3 boîtes' },
];

function HEpiRow({ t, item, idx }) {
  const ok = item.conformite;
  return (
    <div style={{
      background: t.surface,
      border: `1.5px solid ${ok ? t.line : D82.red}`,
      borderRadius: 10, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12, minHeight: 64,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: ok ? D82.okSoft : D82.redSoft,
        border: `1.5px solid ${ok ? D82.ok : D82.red}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ok ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke={D82.ok} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="1.5" fill={D82.red}/>
            <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{item.label}</div>
        <div style={{ fontSize: 12, color: ok ? t.text3 : D82.red, marginTop: 2, fontWeight: 600 }}>
          {item.detail}
        </div>
      </div>
      {/* Bascule */}
      <div style={{
        width: 48, height: 28, borderRadius: 14, flexShrink: 0,
        background: ok ? D82.teal : t.surfaceMute,
        border: `1.5px solid ${ok ? D82.teal : t.line}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 1.5, left: ok ? 22 : 2,
          width: 22, height: 22, borderRadius: '50%', background: '#fff',
        }}/>
      </div>
    </div>
  );
}

function HScreenEpi({ t }) {
  const conf = EPI_ITEMS.filter(i => i.conformite).length;
  const total = EPI_ITEMS.length;
  const allConf = conf === total;
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Compteur de conformité — hero */}
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{
          background: allConf ? D82.teal : (t.mode === 'dark' ? t.surface2 : t.surface),
          color: allConf ? '#fff' : t.text,
          border: `2px solid ${allConf ? D82.teal : D82.red}`,
          borderRadius: 14, padding: 16,
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: t.mode === 'dark' ? '0 8px 20px rgba(0,0,0,0.30)' : '0 8px 18px rgba(11,37,64,0.10)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 14, flexShrink: 0,
            background: allConf ? 'rgba(255,255,255,0.18)' : D82.redSoft,
            border: `1.5px solid ${allConf ? 'rgba(255,255,255,0.4)' : D82.red}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
              <path d="M4 16a8 8 0 0116 0v2H4v-2z" stroke={allConf ? '#fff' : D82.red} strokeWidth="2"/>
              <path d="M9 9V6.5a3 3 0 016 0V9" stroke={allConf ? '#fff' : D82.red} strokeWidth="2"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
              opacity: allConf ? 0.92 : 0.8, textTransform: 'uppercase',
              color: allConf ? '#fff' : (t.mode === 'dark' ? t.text2 : t.text3),
            }}>Conformité EPI · agent</div>
            <div style={{
              fontFamily: D82.mono, fontSize: 38, fontWeight: 700,
              marginTop: 2, letterSpacing: 0.5, lineHeight: 1,
              color: allConf ? '#fff' : (t.text),
            }}>{conf}<span style={{ fontSize: 22, opacity: 0.65 }}> / {total}</span></div>
            <div style={{
              fontSize: 13, marginTop: 4, fontWeight: 600,
              color: allConf ? 'rgba(255,255,255,0.92)' : D82.red,
            }}>{allConf ? 'Conforme · prêt à valider' : `${total - conf} EPI non conforme`}</div>
          </div>
        </div>
      </div>

      <HSectionLabel t={t} right="Bascule chaque ligne">Check-list</HSectionLabel>

      <div style={{ padding: '0 12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {EPI_ITEMS.map((e, i) => (
          <HEpiRow key={e.label} t={t} item={e} idx={i + 1}/>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// FLUX · DÉCLARATION INCIDENT — sévérité + photo + vocal
// ════════════════════════════════════════════════════════════
function HScreenDeclare({ t, severity = 'critique' }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Context strip */}
      <div style={{
        padding: '10px 14px',
        background: D82.redSoft,
        borderBottom: `1px solid ${D82.red}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l10 17H2L12 3z" stroke={D82.red} strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M12 10v5M12 18v.5" stroke={D82.red} strokeWidth="2.4" strokeLinecap="round"/>
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
            color: D82.red, textTransform: 'uppercase',
          }}>Déclaration incident</div>
          <div style={{ fontSize: 13, color: t.text, marginTop: 1, fontWeight: 600 }}>
            EVT-2026 · numéro local · sync auto
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Type */}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
            color: t.text3, textTransform: 'uppercase', marginBottom: 8,
          }}>Type d'incident</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { l: 'Véhicule · panne', sel: true },
              { l: 'Personne · blessure' },
              { l: 'Charge · perte' },
              { l: 'Environnement' },
              { l: 'Route' },
              { l: 'Autre' },
            ].map((p) => (
              <button key={p.l} style={{
                minHeight: 44, padding: '8px 14px',
                background: p.sel ? (t.mode === 'dark' ? 'rgba(26,142,126,0.25)' : 'rgba(26,142,126,0.12)') : t.surface,
                border: `1.5px solid ${p.sel ? D82.teal : t.line}`,
                borderRadius: 999, cursor: 'pointer',
                color: t.text, fontSize: 14, fontWeight: p.sel ? 700 : 600,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {p.sel && <HCheck size={14} color={D82.teal}/>}
                {p.l}
              </button>
            ))}
          </div>
        </div>

        {/* Sévérité — couleur + forme + libellé */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
              color: t.text3, textTransform: 'uppercase',
            }}>Sévérité</div>
            <div style={{ fontSize: 10, color: t.text3, letterSpacing: 0.5 }}>
              Forme + couleur + libellé
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <HSeverityChip t={t} kind="mineure"  selected={severity === 'mineure'}/>
            <HSeverityChip t={t} kind="majeure"  selected={severity === 'majeure'}/>
            <HSeverityChip t={t} kind="critique" selected={severity === 'critique'}/>
          </div>
          {severity === 'critique' && (
            <div style={{
              marginTop: 8, padding: '10px 12px', borderRadius: 8,
              background: D82.redSoft,
              border: `1px solid ${D82.red}`,
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: t.text, fontWeight: 600,
            }}>
              <span style={{ width: 8, height: 8, background: D82.red, flexShrink: 0 }}/>
              Cascade automatique · TER + ACT-2026 créés à l'envoi
            </div>
          )}
        </div>

        {/* Photo preuve */}
        <div style={{
          background: t.surface, border: `1.5px solid ${t.line}`, borderRadius: 12,
          padding: 12, display: 'flex', alignItems: 'center', gap: 12, minHeight: 88,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 8, flexShrink: 0,
            background: t.mode === 'dark'
              ? `repeating-linear-gradient(45deg, #1A3556 0 8px, #15304F 8px 16px)`
              : `repeating-linear-gradient(45deg, ${t.lineSoft} 0 8px, ${t.line} 8px 16px)`,
            border: `1.5px solid ${t.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: D82.mono, fontSize: 9, color: t.text3,
          }}>preuve</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
              color: t.text3, textTransform: 'uppercase',
            }}>Photo preuve</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginTop: 2 }}>2 photos · 07:39</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>Plaquette frein arrière · vue rapprochée</div>
          </div>
          <button style={{
            background: 'transparent', border: `1.5px solid ${t.line}`,
            color: t.text, fontSize: 12, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase',
            padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
            minHeight: 36, flexShrink: 0,
          }}>+ Photo</button>
        </div>

        {/* Note vocale */}
        <div style={{
          background: t.surface, border: `1.5px solid ${t.line}`, borderRadius: 12,
          padding: 12, display: 'flex', alignItems: 'center', gap: 12, minHeight: 76,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22, flexShrink: 0,
            background: D82.red, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="3" width="6" height="13" rx="3" fill="#fff"/>
              <path d="M6 12a6 6 0 0012 0M12 18v3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
              color: t.text3, textTransform: 'uppercase',
            }}>Note vocale</div>
            <div style={{
              fontSize: 15, fontWeight: 700, color: t.text, marginTop: 2,
              fontFamily: D82.mono, letterSpacing: 0.5,
            }}>00:24</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>
              {[6,10,14,8,12,18,14,10,16,12,8,6,10,14,8,4,8,12,10,6,4,8,10,14,12,8].map((h,i) => (
                <span key={i} style={{
                  width: 3, height: h, borderRadius: 1.5,
                  background: i < 18 ? D82.teal : t.text4,
                }}/>
              ))}
            </div>
          </div>
          <button style={{
            background: 'transparent', border: `1.5px solid ${t.line}`,
            color: t.text, fontSize: 12, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase',
            padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
            minHeight: 36, flexShrink: 0,
          }}>Ré-enr.</button>
        </div>

        {/* Localisation */}
        <div style={{
          background: t.surface, border: `1.5px solid ${t.line}`, borderRadius: 12,
          padding: 12, display: 'flex', alignItems: 'center', gap: 12, minHeight: 60,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: D82.okSoft, border: `1px solid ${D82.ok}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" stroke={D82.ok} strokeWidth="2"/>
              <circle cx="12" cy="9" r="2.4" stroke={D82.ok} strokeWidth="2"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>APC Andriamena · RN44</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 1, fontFamily: D82.mono, letterSpacing: 0.3 }}>
              −17.5841, 47.0319 · GPS verrouillé
            </div>
          </div>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
            padding: '2px 6px', borderRadius: 3,
            background: D82.okSoft, color: D82.ok,
            border: `1px solid ${D82.ok}`,
            textTransform: 'uppercase',
          }}>Auto</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SUCCESS — Enregistré
// ════════════════════════════════════════════════════════════
function HScreenSaved({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: '#0B2540', color: '#fff',
        padding: '24px 18px 26px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: `1px solid ${t.line}`,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: D82.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 6px rgba(26,142,126,0.30)',
          flexShrink: 0,
        }}><HCheck size={38}/></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.3 }}>Enregistré</div>
          <div style={{ fontSize: 13, color: '#B7C9E0', marginTop: 4 }}>
            Incident dans la file locale · cascade lancée
          </div>
        </div>
      </div>

      <div style={{
        padding: '12px 18px',
        background: t.mode === 'dark' ? 'rgba(26,142,126,0.16)' : 'rgba(26,142,126,0.10)',
        borderBottom: `1px solid ${t.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
          color: t.text2, textTransform: 'uppercase',
        }}>Référence locale</span>
        <span style={{
          fontFamily: D82.mono, fontSize: 15, fontWeight: 700, color: t.text,
        }}>EVT-2026-0207</span>
      </div>

      {/* Cascade */}
      <div style={{ padding: '14px 14px 6px' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
          color: t.text2, textTransform: 'uppercase', padding: '0 2px 8px',
        }}>Cascade automatique</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'TER alerté · Port Toamasina',     code: 'PL-TER-002',        kind: 'alert' },
            { label: 'Action corrective créée',          code: 'ACT-2026-0143',     kind: 'act'   },
            { label: 'Inspection rattachée',             code: 'INSP-2026-0518',    kind: 'insp'  },
          ].map((c) => (
            <div key={c.code} style={{
              background: t.surface, border: `1.5px solid ${t.line}`,
              borderRadius: 10, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: D82.okSoft, border: `1px solid ${D82.ok}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <HCheck size={18} color={D82.ok}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{c.label}</div>
                <div style={{ fontSize: 12, color: t.text3, marginTop: 1, fontFamily: D82.mono }}>{c.code}</div>
              </div>
              <HCheck size={20} color={D82.ok}/>
            </div>
          ))}
        </div>
      </div>

      {/* Sync queue */}
      <div style={{ padding: '8px 14px 16px' }}>
        <div style={{
          padding: '12px 14px',
          background: t.surface, borderRadius: 10,
          border: `1px dashed ${t.line}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(199,126,42,0.18)',
            border: `1.5px solid ${D82.orange}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 12a8 8 0 0114-5.3L20 5M20 12a8 8 0 01-14 5.3L4 19"
                stroke={D82.orange} strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 5v4h-4M4 19v-4h4" stroke={D82.orange} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>3 événements en file</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>
              Envoi auto dès le retour du réseau
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// EMPTY · Rien d'urgent
// ════════════════════════════════════════════════════════════
function HScreenEmpty({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Garder héros */}
      <div style={{ padding: '16px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <HHero t={t} tone="red"
          title="Signaler incident"
          sub="Sévérité · photo preuve · vocal · cascade HSE"
          icon={
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l10 17H2L12 3z" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"/>
              <path d="M12 10v5M12 18v.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/>
            </svg>
          }
        />
        <HHero t={t} tone="teal"
          title="Observation / Toolbox QSHE"
          sub="Geste sûr · presque-accident · briefing"
          icon={
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M3 5h14l4 4v8a2 2 0 01-2 2H3V5z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M7 11h10M7 14h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
        />
      </div>

      <HSectionLabel t={t} right="25 mai · 07:42">Worklist</HSectionLabel>

      <div style={{ padding: '0 14px', display: 'flex', gap: 8 }}>
        <HCounter t={t} label="À faire"   value="00"/>
        <HCounter t={t} label="En cours"  value="00"/>
        <HCounter t={t} label="Critiques" value="00"/>
        <HCounter t={t} label="Du jour"   value="00"/>
      </div>

      {/* Empty hero */}
      <div style={{
        margin: '16px 14px', flex: 1,
        background: t.surface, border: `1.5px dashed ${t.line}`,
        borderRadius: 14, padding: '32px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
        textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: D82.okSoft,
          border: `1.5px solid ${D82.ok}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HCheck size={36} color={D82.ok}/>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: -0.2 }}>Rien d'urgent</div>
        <div style={{ fontSize: 13, color: t.text3, fontWeight: 500, maxWidth: 240 }}>
          Aucune inspection en retard ni action critique ouverte sur ta tournée.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HCheck, HChev, HToConfirm, HSectionLabel, HStatus, HSeverityChip, HHero, HCounter,
  HScreenAccueil, HScreenCapture, HScreenInspection, HScreenActions,
  HScreenFeed, HScreenEpi, HScreenDeclare, HScreenSaved, HScreenEmpty,
});
