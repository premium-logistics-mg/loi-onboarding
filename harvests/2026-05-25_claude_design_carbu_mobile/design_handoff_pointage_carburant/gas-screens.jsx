// Pointage Carburant — screens. Themed via `t` prop.
// FR métier · IBM Plex Mono sur chiffres · status = couleur + forme + libellé.
// Flotte CT-001..015 SCHACMAN F3000 6×4 + KERAX, plaques …TCB.
// Stations canoniques : GALANA TMM · GALANA MMG · TOTAL ENERGIES.

// ════════════════════════════════════════════════════════════
// Atomes partagés
// ════════════════════════════════════════════════════════════
function GsChev({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GsArrow({ size = 16, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GsToConfirm({ children = 'À CONFIRMER' }) {
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

function GsSectionLabel({ t, children, right }) {
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

// ════════════════════════════════════════════════════════════
// Données réelles · master dataset
// ════════════════════════════════════════════════════════════

const FLEET = [
  { truck: 'CT-001', plate: '1042 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-002', plate: '1187 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-003', plate: '1827 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-004', plate: '2418 TCB', model: 'KERAX' },
  { truck: 'CT-005', plate: '2945 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-006', plate: '3261 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-007', plate: '4271 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-008', plate: '4502 TCB', model: 'KERAX' },
  { truck: 'CT-009', plate: '4988 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-010', plate: '5340 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-011', plate: '5602 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-012', plate: '5817 TCB', model: 'KERAX' },
  { truck: 'CT-013', plate: '5994 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-014', plate: '6045 TCB', model: 'SCHACMAN F3000 6×4' },
  { truck: 'CT-015', plate: '6118 TCB', model: 'KERAX' },
];

const STATIONS = [
  { id: 'galana-tmm', brand: 'GALANA',         site: 'TMM',           sub: 'Toamasina · Marché Mahabibo' },
  { id: 'galana-mmg', brand: 'GALANA',         site: 'MMG',           sub: 'Antananarivo · MMG' },
  { id: 'total',      brand: 'TOTAL ENERGIES', site: '',              sub: 'Réseau national' },
];

// ════════════════════════════════════════════════════════════
// 0 · LOGIN — matricule + PIN
// ════════════════════════════════════════════════════════════

function GsScreenLogin({ t, pinLength = 3 }) {
  const dots = Array.from({ length: 4 }, (_, i) => i < pinLength);
  return (
    <div style={{
      flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column',
      background: t.paper, padding: '0 0 8px',
    }}>
      {/* Brand band */}
      <div style={{
        padding: '28px 24px 18px', textAlign: 'left',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 2,
          color: t.mode === 'dark' ? '#3EAA9B' : D82.teal, textTransform: 'uppercase',
        }}>Premium Logistics · D82</div>
        <div style={{
          fontSize: 26, fontWeight: 800, color: t.text,
          letterSpacing: -0.4, marginTop: 6, lineHeight: 1.15,
        }}>Pointage carburant</div>
        <div style={{ fontSize: 14, color: t.text3, marginTop: 4, fontWeight: 500 }}>
          Opérateur dédié station · accès matricule + PIN
        </div>
      </div>

      {/* Matricule field */}
      <div style={{ padding: '0 22px' }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: t.text3,
          letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 6,
        }}>Matricule opérateur</div>
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: t.surface, border: `2px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: t.mode === 'dark' ? 'rgba(62,170,155,0.20)' : 'rgba(26,142,126,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: t.mode === 'dark' ? '#3EAA9B' : D82.teal, flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{
            flex: 1, fontFamily: D82.mono, fontSize: 22, fontWeight: 700,
            color: t.text, letterSpacing: 1,
          }}>PL-GAS-003</span>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.3,
            color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
            padding: '3px 7px', borderRadius: 3,
            background: t.mode === 'dark' ? 'rgba(62,170,155,0.20)' : 'rgba(26,142,126,0.14)',
          }}>RECONNU</span>
        </div>
      </div>

      {/* PIN */}
      <div style={{ padding: '20px 22px 0' }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: t.text3,
          letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 10,
        }}>Code PIN · 4 chiffres</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {dots.map((filled, i) => (
            <div key={i} style={{
              width: 56, height: 60, borderRadius: 12,
              background: filled
                ? (t.mode === 'dark' ? 'rgba(62,170,155,0.22)' : 'rgba(26,142,126,0.12)')
                : t.surface,
              border: `2px solid ${filled
                ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal)
                : t.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {filled && (
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
                }}/>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PIN pad */}
      <div style={{ flex: 1 }}/>
      <div style={{ padding: '14px 22px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[['1','2','3'], ['4','5','6'], ['7','8','9']].map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 10 }}>
            {row.map(k => (
              <button key={k} style={{
                flex: 1, height: 60, borderRadius: 12,
                background: t.surface, border: `1.5px solid ${t.line}`,
                fontFamily: D82.mono, fontSize: 26, fontWeight: 700, color: t.text,
                cursor: 'pointer',
              }}>{k}</button>
            ))}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            flex: 1, height: 60, borderRadius: 12,
            background: 'transparent', border: `1.5px solid transparent`,
            fontFamily: D82.ui, fontSize: 12, fontWeight: 700, color: t.text3,
            letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
          }}>Aide</button>
          <button style={{
            flex: 1, height: 60, borderRadius: 12,
            background: t.surface, border: `1.5px solid ${t.line}`,
            fontFamily: D82.mono, fontSize: 26, fontWeight: 700, color: t.text,
            cursor: 'pointer',
          }}>0</button>
          <button style={{
            flex: 1, height: 60, borderRadius: 12,
            background: t.mode === 'dark' ? 'rgba(199,126,42,0.14)' : 'rgba(199,126,42,0.08)',
            border: `1.5px solid rgba(199,126,42,0.40)`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 5H10l-7 7 7 7h11a1 1 0 001-1V6a1 1 0 00-1-1z" stroke={D82.orange} strokeWidth="2" strokeLinejoin="round"/>
              <path d="M14 9l4 6M18 9l-4 6" stroke={D82.orange} strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 1 · ACCUEIL — hero "Nouveau pointage" + derniers pleins
// ════════════════════════════════════════════════════════════

const RECENT_FILLS = [
  { code: 'FUEL-2026-0418', truck: 'CT-007', plate: '4271 TCB', station: 'GALANA TMM',     litres: '285,40', km: '142 380', when: '24.05 · 17:42' },
  { code: 'FUEL-2026-0417', truck: 'CT-011', plate: '5602 TCB', station: 'TOTAL ENERGIES', litres: '310,80', km: '208 145', when: '24.05 · 16:20' },
  { code: 'FUEL-2026-0416', truck: 'CT-003', plate: '1827 TCB', station: 'GALANA MMG',     litres: '264,00', km: '188 720', when: '24.05 · 14:55' },
];

function GsScreenAccueil({ t, hasPending = true }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Big primary CTA */}
      <div style={{ padding: '16px 14px 0' }}>
        <button style={{
          width: '100%', minHeight: 108,
          background: D82.teal, color: '#fff', border: 0, borderRadius: 16,
          padding: '16px 18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
          boxShadow: t.tealShadow, fontFamily: D82.ui,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, flexShrink: 0,
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.32)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M4 21V5a2 2 0 012-2h6a2 2 0 012 2v16M4 21h10M7 9h4M7 13h4" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M14 9l4 0M16 9v8a2 2 0 002 2 2 2 0 002-2v-9l-3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.1 }}>
              Nouveau pointage
            </div>
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.92, fontWeight: 500 }}>
              6 étapes · 3–5 taps · véhicule → BC
            </div>
          </div>
          <GsChev size={28}/>
        </button>
      </div>

      {/* Tonight quick stats — actionable, pas KPI feed */}
      <div style={{
        margin: '14px 14px 0', padding: '12px 14px',
        background: t.surface, border: `1.5px solid ${t.line}`,
        borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: t.mode === 'dark' ? 'rgba(199,126,42,0.18)' : 'rgba(199,126,42,0.10)',
          border: `1px solid ${D82.orange}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: D82.orange, flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: t.text }}>
            {hasPending ? '2 pleins en file offline' : 'Aucun envoi en attente'}
          </div>
          <div style={{ fontSize: 12, color: t.text3, marginTop: 2, fontWeight: 500 }}>
            {hasPending
              ? 'Envoi automatique au retour réseau · FUEL-0418 · FUEL-0417'
              : 'Tous les pleins synchronisés à 06:12'}
          </div>
        </div>
      </div>

      <GsSectionLabel t={t} right={`${RECENT_FILLS.length} aujourd'hui`}>
        Derniers pleins · 24.05
      </GsSectionLabel>

      <div style={{ padding: '0 14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RECENT_FILLS.map(f => (
          <div key={f.code} style={{
            padding: '12px 14px', background: t.surface,
            border: `1.5px solid ${t.line}`, borderRadius: 12,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: D82.mono, fontSize: 12, fontWeight: 700,
                color: t.text3, letterSpacing: 0.5,
              }}>{f.code}</span>
              <span style={{ flex: 1 }}/>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 1.3,
                color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
                padding: '2px 7px', borderRadius: 3,
                background: t.mode === 'dark' ? 'rgba(62,170,155,0.18)' : 'rgba(26,142,126,0.14)',
                border: `1px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}55`,
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.mode === 'dark' ? '#3EAA9B' : D82.teal }}/>
                ENVOYÉ
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: D82.mono, fontSize: 22, fontWeight: 700, color: t.text }}>
                {f.litres}<span style={{ fontSize: 13, color: t.text3, fontWeight: 600 }}> L</span>
              </span>
              <span style={{ flex: 1 }}/>
              <span style={{ fontFamily: D82.mono, fontSize: 14, color: t.text2, fontWeight: 600 }}>
                {f.km}<span style={{ fontSize: 11, color: t.text3 }}> km</span>
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: D82.mono, fontSize: 11.5, color: t.text3, fontWeight: 600,
              paddingTop: 4, borderTop: `1px dashed ${t.lineSoft}`,
            }}>
              <span>{f.truck}</span><span style={{ color: t.text4 }}>·</span>
              <span>{f.plate}</span><span style={{ color: t.text4 }}>·</span>
              <span style={{ fontFamily: D82.ui, fontWeight: 700, color: t.text2 }}>{f.station}</span>
              <span style={{ flex: 1 }}/>
              <span>{f.when}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2 · VÉHICULE — scan plaque + liste flotte
// ════════════════════════════════════════════════════════════

function GsScreenVehicule({ t, mode = 'scan' }) {
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {mode === 'scan' && (
        <div style={{ padding: '14px 14px 0' }}>
          <div style={{
            position: 'relative', borderRadius: 14, overflow: 'hidden',
            height: 220, background: '#0E1419',
            border: `1.5px solid ${t.line}`,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 14px, transparent 14px 28px)',
            }}/>
            {/* Plate framing */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 230, height: 64, borderRadius: 6,
              border: `3px solid #3EAA9B`,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
            }}/>
            {/* Plate text mock */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: D82.mono, fontSize: 22, fontWeight: 800,
              color: '#3EAA9B', letterSpacing: 4,
            }}>4271&nbsp;TCB</div>
            {/* Bottom hint */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '10px 14px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
              fontFamily: D82.mono, fontSize: 11, fontWeight: 700,
              color: '#3EAA9B', letterSpacing: 1.5, textAlign: 'center',
            }}>VISER LA PLAQUE · CADRE TURQUOISE</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginTop: 12, padding: '10px 12px', borderRadius: 10,
            background: t.mode === 'dark' ? 'rgba(62,170,155,0.14)' : 'rgba(26,142,126,0.10)',
            border: `1px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}55`,
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%',
              background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: t.text }}>
                CT-007 · <span style={{ fontFamily: D82.mono }}>4271 TCB</span>
              </div>
              <div style={{ fontSize: 12, color: t.text3, fontWeight: 500 }}>SCHACMAN F3000 6×4 · reconnu</div>
            </div>
          </div>
        </div>
      )}

      <GsSectionLabel t={t} right={`${FLEET.length} véhicules`}>
        {mode === 'scan' ? 'Ou sélectionner manuellement' : 'Sélectionner un véhicule'}
      </GsSectionLabel>

      <div style={{ padding: '0 14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {FLEET.slice(0, mode === 'scan' ? 4 : 8).map((v, i) => {
          const selected = mode === 'list' && v.truck === 'CT-007';
          return (
            <button key={v.truck} style={{
              width: '100%', padding: '12px 14px',
              background: selected
                ? (t.mode === 'dark' ? 'rgba(26,142,126,0.18)' : 'rgba(26,142,126,0.10)')
                : t.surface,
              border: `1.5px solid ${selected ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal) : t.line}`,
              borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: D82.ui,
            }}>
              <div style={{
                fontFamily: D82.mono, fontSize: 13, fontWeight: 800, color: t.text,
                width: 60, flexShrink: 0,
              }}>{v.truck}</div>
              <div style={{
                fontFamily: D82.mono, fontSize: 16, fontWeight: 700, color: t.text,
                letterSpacing: 0.8,
              }}>{v.plate}</div>
              <span style={{ flex: 1 }}/>
              <span style={{ fontSize: 11, color: t.text3, fontWeight: 600 }}>
                {v.model.startsWith('SCHACMAN') ? 'SCHACMAN' : 'KERAX'}
              </span>
              {selected && (
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Strip "véhicule actif" — repère permanent au-dessus des écrans suivants
// ════════════════════════════════════════════════════════════

function GsVehicleStrip({ t, truck = 'CT-007', plate = '4271 TCB', model = 'SCHACMAN F3000 6×4', sub }) {
  return (
    <div style={{
      margin: '14px 14px 0',
      padding: '10px 14px',
      background: t.surface, border: `1.5px solid ${t.line}`,
      borderLeft: `4px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
      borderRadius: 10,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
        background: t.mode === 'dark' ? 'rgba(62,170,155,0.18)' : 'rgba(26,142,126,0.10)',
        border: `1px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}55`,
        color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="9" width="11" height="9" rx="1" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M14 12h4l3 3v3h-7" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="7" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="17" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'baseline',
          fontFamily: D82.mono, fontSize: 14, fontWeight: 700, color: t.text,
        }}>
          <span>{truck}</span>
          <span style={{ color: t.text4 }}>·</span>
          <span>{plate}</span>
        </div>
        <div style={{ fontSize: 11, color: t.text3, fontWeight: 600, marginTop: 1 }}>
          {model}{sub && <span> · {sub}</span>}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3 · STATION — 3 grosses tuiles (TAP-large)
// ════════════════════════════════════════════════════════════

function GsStationTile({ t, station, selected = false }) {
  const isTotal = station.id === 'total';
  return (
    <button style={{
      width: '100%', minHeight: 96,
      padding: '14px 16px',
      background: selected
        ? (t.mode === 'dark' ? 'rgba(26,142,126,0.20)' : '#fff')
        : t.surface,
      border: `2px solid ${selected ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal) : t.line}`,
      borderRadius: 14,
      cursor: 'pointer', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: selected ? (t.mode === 'dark' ? '0 0 0 4px rgba(62,170,155,0.18)' : '0 0 0 4px rgba(26,142,126,0.10)') : 'none',
      fontFamily: D82.ui,
    }}>
      {/* Pictogram — forme PROPRE par station (pas d'emoji, pas de logo client) */}
      <div style={{
        width: 64, height: 64, borderRadius: 14, flexShrink: 0,
        background: selected
          ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal)
          : (t.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#FBF7EC'),
        color: selected ? '#fff' : (t.mode === 'dark' ? '#3EAA9B' : D82.teal),
        border: selected ? 'none' : `1.5px solid ${t.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Pump icon */}
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path d="M4 20V5a1 1 0 011-1h7a1 1 0 011 1v15M4 20h10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 8h5M6 12h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/>
          <path d="M13 9l3 0M16 9v9a1.5 1.5 0 003 0V8l-2.5-2.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: 1.4,
          color: t.text3, textTransform: 'uppercase',
        }}>Station carburant</div>
        <div style={{
          fontSize: 22, fontWeight: 800, color: t.text,
          letterSpacing: -0.4, marginTop: 2, lineHeight: 1.05,
        }}>
          {station.brand}
          {station.site && <span style={{
            fontFamily: D82.mono, fontSize: 18, color: t.mode === 'dark' ? '#3EAA9B' : D82.teal, marginLeft: 8,
          }}>{station.site}</span>}
        </div>
        <div style={{ fontSize: 12, color: t.text3, marginTop: 3, fontWeight: 500 }}>
          {station.sub}
        </div>
      </div>

      {selected ? (
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      ) : (
        <GsChev size={22} color={t.text3}/>
      )}
    </button>
  );
}

function GsScreenStation({ t, selected = 'galana-tmm' }) {
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <GsVehicleStrip t={t}/>

      <GsSectionLabel t={t}>Choisir la station — 3 stations canoniques</GsSectionLabel>

      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {STATIONS.map(s => (
          <GsStationTile key={s.id} t={t} station={s} selected={s.id === selected}/>
        ))}
      </div>

      <div style={{
        margin: '0 14px 14px', padding: '10px 12px', borderRadius: 8,
        background: t.mode === 'dark' ? 'rgba(199,126,42,0.14)' : 'rgba(199,126,42,0.08)',
        border: `1px solid rgba(199,126,42,0.40)`,
        fontSize: 12, color: t.mode === 'dark' ? '#E2A55C' : '#8A5A1F',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M12 4l9 16H3L12 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M12 10v4M12 17v.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
        </svg>
        <span>Stations réseau LOI uniquement. Tout autre fournisseur passe par anomalie « Station hors-réseau » <GsToConfirm>WORKFLOW</GsToConfirm>.</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4 · LITRES — pavé numérique géant, chiffre mono "GO livrée (L)"
// ════════════════════════════════════════════════════════════

function GsKey({ t, label, kind = 'num', big = false }) {
  return (
    <button style={{
      flex: 1, height: big ? 68 : 60,
      background: t.surface,
      border: `1.5px solid ${t.line}`,
      borderRadius: 12, cursor: 'pointer',
      fontFamily: D82.mono, fontSize: big ? 28 : 26, fontWeight: 700,
      color: kind === 'back' ? D82.orange : t.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{label}</button>
  );
}

function GsBigNumpad({ t, showDot = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[['1','2','3'], ['4','5','6'], ['7','8','9']].map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 8 }}>
          {row.map(k => <GsKey key={k} t={t} label={k} big/>)}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <GsKey t={t} label={showDot ? ',' : ''} kind="action" big/>
        <GsKey t={t} label="0" big/>
        <button style={{
          flex: 1, height: 68, borderRadius: 12,
          background: t.mode === 'dark' ? 'rgba(199,126,42,0.14)' : 'rgba(199,126,42,0.08)',
          border: `1.5px solid rgba(199,126,42,0.40)`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 5H10l-7 7 7 7h11a1 1 0 001-1V6a1 1 0 00-1-1z" stroke={D82.orange} strokeWidth="2" strokeLinejoin="round"/>
            <path d="M14 9l4 6M18 9l-4 6" stroke={D82.orange} strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function GsScreenLitres({ t, value = '285,40', station = 'GALANA TMM' }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <GsVehicleStrip t={t} sub={station}/>

      {/* Giant litres display */}
      <div style={{
        margin: '14px 14px 0', padding: '18px 18px 16px',
        background: t.mode === 'dark' ? 'rgba(26,142,126,0.10)' : '#FFFFFF',
        border: `2px solid ${t.mode === 'dark' ? '#3EAA9B55' : D82.teal}`,
        borderRadius: 14, position: 'relative',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 800, color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
            letterSpacing: 1.6, textTransform: 'uppercase',
          }}>GO livrée · réel pompe</div>
          <div style={{
            fontSize: 10, fontWeight: 800, color: t.text3, letterSpacing: 1.3,
            fontFamily: D82.mono,
          }}>L</div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'center',
          marginTop: 6, gap: 6,
        }}>
          <span style={{
            fontFamily: D82.mono, fontSize: 64, fontWeight: 700, letterSpacing: -1.5,
            color: t.text, lineHeight: 1,
            display: 'inline-flex', alignItems: 'baseline',
          }}>
            {value}
            <span style={{
              display: 'inline-block', width: 4, height: 56,
              background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
              marginLeft: 4, animation: 'caret 1s steps(1) infinite',
              verticalAlign: 'middle',
            }}/>
          </span>
          <span style={{
            fontFamily: D82.mono, fontSize: 28, fontWeight: 700,
            color: t.mode === 'dark' ? '#3EAA9B' : D82.teal, marginLeft: 6,
          }}>L</span>
        </div>

        <div style={{
          marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${t.lineSoft}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: t.text3, letterSpacing: 1.3, textTransform: 'uppercase' }}>
            Dernier plein
          </span>
          <span style={{
            fontFamily: D82.mono, fontSize: 14, fontWeight: 700, color: t.text2,
          }}>248,60 L · 22.05</span>
        </div>
      </div>

      {/* Quick-add buttons */}
      <div style={{
        margin: '12px 14px 0', display: 'flex', gap: 8,
      }}>
        {['+50', '+100', 'Plein'].map((q, i) => (
          <button key={q} style={{
            flex: 1, height: 40, borderRadius: 8,
            background: 'transparent',
            border: `1.5px solid ${t.line}`,
            color: t.text2, fontFamily: D82.ui,
            fontSize: 13, fontWeight: 700, letterSpacing: 0.4,
            cursor: 'pointer',
          }}>{q}</button>
        ))}
      </div>

      <div style={{ flex: 1 }}/>

      <div style={{ padding: '14px 14px 8px' }}>
        <GsBigNumpad t={t}/>
      </div>
    </div>
  );
}

// ─── Litres · photo bon de pompe ─────────────────
function GsScreenLitresPhoto({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <GsVehicleStrip t={t} sub="GALANA TMM · 285,40 L saisis"/>

      <div style={{ padding: '14px 14px 0' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: t.text3,
          letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8,
        }}>Photo bon de pompe · obligatoire</div>

        <div style={{
          position: 'relative', borderRadius: 14, overflow: 'hidden',
          height: 290, background: '#0E1419',
          border: `1.5px solid ${t.line}`,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 14px, transparent 14px 28px)',
          }}/>
          {/* Frame brackets */}
          {[
            { top: 14, left: 14, tl: true },
            { top: 14, right: 14, tr: true },
            { bottom: 14, left: 14, bl: true },
            { bottom: 14, right: 14, br: true },
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute', top: p.top, left: p.left, right: p.right, bottom: p.bottom,
              width: 32, height: 32,
              borderTop: p.tl || p.tr ? `3px solid #3EAA9B` : 'none',
              borderBottom: p.bl || p.br ? `3px solid #3EAA9B` : 'none',
              borderLeft: p.tl || p.bl ? `3px solid #3EAA9B` : 'none',
              borderRight: p.tr || p.br ? `3px solid #3EAA9B` : 'none',
            }}/>
          ))}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#3EAA9B', fontFamily: D82.mono, fontSize: 11, fontWeight: 700,
            letterSpacing: 1.5, textAlign: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                <path d="M6 3h9l3 3v15H6V3z" stroke="#3EAA9B" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M15 3v3h3" stroke="#3EAA9B" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 11h6M9 14h6M9 17h4" stroke="#3EAA9B" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <span>CADRER LE TICKET POMPE</span>
              <span style={{ fontSize: 10, opacity: 0.85, letterSpacing: 1 }}>OCR LITRES + N° BC ATTENDUS</span>
            </div>
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '10px 14px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: D82.mono, fontSize: 11, fontWeight: 600, color: '#F5F1E8',
          }}>
            <span>GALANA TMM</span>
            <span>−18.1525, 49.4011</span>
            <span>06:32</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <button style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#fff',
            border: `4px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 22px rgba(0,0,0,0.35)',
          }}>
            <span style={{
              width: 56, height: 56, borderRadius: '50%',
              background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
            }}/>
          </button>
        </div>

        <div style={{
          fontSize: 13, color: t.text3, textAlign: 'center',
          marginTop: 10, fontWeight: 500,
        }}>
          Plaque <span style={{ fontFamily: D82.mono, color: t.text2 }}>4271 TCB</span> · GPS · horaire attachés.
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 5 · TRAJET / KM — km actuel géant + trajet calculé + photo OCR compteur
// ════════════════════════════════════════════════════════════

function GsScreenKm({ t, kmActuel = '142 628', kmPrec = 142380 }) {
  const real = parseInt(kmActuel.replace(/\s/g, ''), 10);
  const trajet = real - kmPrec;
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <GsVehicleStrip t={t} sub="285,40 L · GALANA TMM"/>

      {/* Km actuel — input géant */}
      <div style={{
        margin: '14px 14px 0', padding: '16px 18px 14px',
        background: t.mode === 'dark' ? 'rgba(26,142,126,0.10)' : '#FFFFFF',
        border: `2px solid ${t.mode === 'dark' ? '#3EAA9B55' : D82.teal}`,
        borderRadius: 14,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          letterSpacing: 1.6, textTransform: 'uppercase',
        }}>Km actuel · compteur</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'center',
          marginTop: 4, gap: 4,
        }}>
          <span style={{
            fontFamily: D82.mono, fontSize: 52, fontWeight: 700, letterSpacing: -1,
            color: t.text, lineHeight: 1,
            display: 'inline-flex', alignItems: 'baseline',
          }}>
            {kmActuel}
            <span style={{
              display: 'inline-block', width: 4, height: 44,
              background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
              marginLeft: 4, animation: 'caret 1s steps(1) infinite',
            }}/>
          </span>
          <span style={{
            fontFamily: D82.mono, fontSize: 20, fontWeight: 700,
            color: t.text2, marginLeft: 6,
          }}>km</span>
        </div>

        {/* Trajet calculé */}
        <div style={{
          marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${t.lineSoft}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: t.text3, letterSpacing: 1.3, textTransform: 'uppercase' }}>
            Trajet effectué · auto
          </span>
          <span style={{
            fontFamily: D82.mono, fontSize: 22, fontWeight: 700,
            color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
            display: 'inline-flex', alignItems: 'baseline', gap: 4,
          }}>
            +{trajet}<span style={{ fontSize: 13, color: t.text3 }}>km</span>
          </span>
        </div>
        <div style={{
          marginTop: 4, fontSize: 11, color: t.text3, fontFamily: D82.mono,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>Dernier plein · {kmPrec.toLocaleString('fr').replace(/,/g, ' ')} km</span>
          <span>22.05 · 17:42</span>
        </div>
      </div>

      {/* Photo OCR du compteur — bouton compact */}
      <div style={{ padding: '12px 14px 0' }}>
        <button style={{
          width: '100%', minHeight: 78,
          background: t.surface,
          border: `2px dashed ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
          borderRadius: 12, cursor: 'pointer',
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: D82.ui,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: t.mode === 'dark' ? 'rgba(62,170,155,0.18)' : 'rgba(26,142,126,0.10)',
            color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="12" cy="13.5" r="3.6" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M8 7l1.5-3h5L16 7" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: t.text }}>
              Photo OCR du compteur
            </div>
            <div style={{ fontSize: 12, color: t.text3, fontWeight: 500, marginTop: 1 }}>
              Lecture automatique · saisie en repli
            </div>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.3,
            color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
            padding: '3px 7px', borderRadius: 3,
            background: t.mode === 'dark' ? 'rgba(62,170,155,0.20)' : 'rgba(26,142,126,0.14)',
          }}>RECOMMANDÉ</span>
        </button>
      </div>

      <div style={{ flex: 1 }}/>

      {/* Compact numpad */}
      <div style={{ padding: '12px 14px 8px' }}>
        <GsBigNumpad t={t} showDot={false}/>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 6 · N° BC — scan code-barres + saisie manuelle
// ════════════════════════════════════════════════════════════

function GsScreenBC({ t, mode = 'scan', value = 'BC-2026-08412' }) {
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <GsVehicleStrip t={t} sub="285,40 L · 142 628 km"/>

      {mode === 'scan' && (
        <div style={{ padding: '14px 14px 0' }}>
          <div style={{
            position: 'relative', borderRadius: 14, overflow: 'hidden',
            height: 240, background: '#0E1419',
            border: `1.5px solid ${t.line}`,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 14px, transparent 14px 28px)',
            }}/>
            {/* Scan frame */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 260, height: 110, borderRadius: 8,
              border: `3px solid #3EAA9B`,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.40)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Mock barcode */}
              <div style={{
                width: 200, height: 56, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center',
              }}>
                {[2,4,2,1,3,5,2,4,1,3,2,5,3,2,4,2,1,3,5,2,4,1,3,2,5,3,2,4].map((w, i) => (
                  <div key={i} style={{ width: w, height: 50, background: i % 2 ? '#3EAA9B' : 'transparent' }}/>
                ))}
              </div>
            </div>
            {/* Scan line */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 260, height: 2,
              background: 'linear-gradient(to right, transparent, #3EAA9B, transparent)',
              boxShadow: '0 0 10px #3EAA9B',
            }}/>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '10px 14px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
              fontFamily: D82.mono, fontSize: 11, fontWeight: 700,
              color: '#3EAA9B', letterSpacing: 1.5, textAlign: 'center',
            }}>VISER LE CODE-BARRES DU BON</div>
          </div>

          {/* Detected line */}
          <div style={{
            marginTop: 12, padding: '12px 14px', borderRadius: 12,
            background: t.surface, border: `2px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: '50%',
              background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: t.text3,
                letterSpacing: 1.3, textTransform: 'uppercase',
              }}>N° BC détecté</div>
              <div style={{
                fontFamily: D82.mono, fontSize: 20, fontWeight: 700,
                color: t.text, letterSpacing: 1, marginTop: 1,
              }}>{value}</div>
            </div>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <div style={{ padding: '14px 14px 0' }}>
          <div style={{
            fontSize: 11, fontWeight: 800, color: t.text3,
            letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8,
          }}>Saisie manuelle · N° BC</div>
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: t.surface, border: `2px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
            display: 'flex', alignItems: 'baseline', gap: 6,
          }}>
            <span style={{
              fontFamily: D82.mono, fontSize: 22, fontWeight: 700,
              color: t.text3, letterSpacing: 1,
            }}>BC-2026-</span>
            <span style={{
              fontFamily: D82.mono, fontSize: 26, fontWeight: 800,
              color: t.text, letterSpacing: 2,
              display: 'inline-flex', alignItems: 'baseline',
            }}>
              08412
              <span style={{
                display: 'inline-block', width: 3, height: 26,
                background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
                marginLeft: 4, animation: 'caret 1s steps(1) infinite',
              }}/>
            </span>
          </div>
          <div style={{ marginTop: 14 }}>
            <GsBigNumpad t={t} showDot={false}/>
          </div>
        </div>
      )}

      <div style={{
        margin: '14px 14px 14px', padding: '10px 12px', borderRadius: 8,
        background: t.mode === 'dark' ? 'rgba(199,126,42,0.14)' : 'rgba(199,126,42,0.08)',
        border: `1px solid rgba(199,126,42,0.40)`,
        fontSize: 12, color: t.mode === 'dark' ? '#E2A55C' : '#8A5A1F',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M12 4l9 16H3L12 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M12 10v4M12 17v.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
        </svg>
        <span>
          {mode === 'scan'
            ? 'Si le code-barres est illisible, passer à la saisie manuelle.'
            : 'Saisie en repli. Rebasculer scan dès que possible (caméra arrière).'}
        </span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 7 · CONFIRMATION — récap
// ════════════════════════════════════════════════════════════

function GsScreenConfirmation({ t }) {
  const rows = [
    { k: 'Véhicule',      v: 'CT-007 · 4271 TCB',   sub: 'SCHACMAN F3000 6×4' },
    { k: 'Station',       v: 'GALANA TMM',          sub: 'Toamasina · Marché Mahabibo' },
    { k: 'GO livrée',     v: '285,40 L',            sub: 'Bon pompe attaché · 1.6 Mo', strong: true },
    { k: 'Km actuel',     v: '142 628 km',          sub: 'Photo compteur OCR · 0.9 Mo' },
    { k: 'Trajet',        v: '+248 km',             sub: 'Depuis dernier plein · 22.05 17:42', strong: true },
    { k: 'N° BC',         v: 'BC-2026-08412',       sub: 'Scan code-barres' },
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <GsSectionLabel t={t} right="6 / 6 étapes">Récapitulatif · vérifier avant envoi</GsSectionLabel>

      <div style={{
        margin: '0 14px', padding: '0',
        background: t.surface, border: `1.5px solid ${t.line}`,
        borderRadius: 12, overflow: 'hidden',
      }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            borderBottom: i < rows.length - 1 ? `1px solid ${t.lineSoft}` : 'none',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: t.text3,
                letterSpacing: 1.4, textTransform: 'uppercase',
              }}>{r.k}</div>
              <div style={{
                fontSize: r.strong ? 17 : 15, fontWeight: r.strong ? 800 : 700,
                color: t.text, marginTop: 2,
                fontFamily: /[\d,. ]/.test(r.v.slice(0, 1)) || /[\d]/.test(r.v) ? D82.mono : D82.ui,
              }}>{r.v}</div>
              <div style={{ fontSize: 11.5, color: t.text3, marginTop: 2, fontWeight: 500 }}>
                {r.sub}
              </div>
            </div>
            <button style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
              color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
              padding: '5px 8px', borderRadius: 4,
              background: 'transparent',
              border: `1px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}55`,
              cursor: 'pointer', textTransform: 'uppercase',
              fontFamily: D82.ui, flexShrink: 0,
            }}>Modifier</button>
          </div>
        ))}
      </div>

      <div style={{
        margin: '12px 14px 14px', padding: '10px 12px', borderRadius: 8,
        background: t.mode === 'dark' ? 'rgba(62,170,155,0.14)' : 'rgba(26,142,126,0.10)',
        border: `1px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}55`,
        fontSize: 12.5, color: t.text2,
        display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <span style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
          marginTop: 2,
          background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span>
          Consommation calculée : <b style={{ fontFamily: D82.mono }}>115,1 L/100 km</b> — cohérent avec moyenne flotte SCHACMAN <GsToConfirm>SEUIL</GsToConfirm>.
        </span>
      </div>

      <div style={{
        margin: '0 14px 14px', padding: '10px 12px',
        background: t.surface, border: `1px dashed ${t.line}`, borderRadius: 8,
        fontSize: 11, color: t.text3, fontFamily: D82.mono,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>OP. PL-GAS-003</span>
        <span>−18.1525, 49.4011</span>
        <span>25.05 · 06:35</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 8 · SUCCÈS — « Plein enregistré »
// ════════════════════════════════════════════════════════════

function GsScreenSucces({ t, offline = true }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        margin: '32px 14px 0', padding: '28px 22px',
        background: t.mode === 'dark' ? 'rgba(26,142,126,0.16)' : '#fff',
        border: `2px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
        borderRadius: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: '50%',
          background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: t.tealShadow,
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: -0.4, textAlign: 'center' }}>
          Plein enregistré
        </div>
        <div style={{
          fontFamily: D82.mono, fontSize: 14, color: t.text3, letterSpacing: 0.5,
        }}>
          FUEL-2026-0419 · 285,40 L · 06:35
        </div>
        {offline && (
          <div style={{
            marginTop: 2, padding: '6px 12px', borderRadius: 6,
            background: 'rgba(199,126,42,0.18)',
            border: `1px solid rgba(199,126,42,0.45)`,
            fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
            color: D82.orange,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="12" height="11" viewBox="0 0 14 13"><path d="M7 1l6 11H1L7 1z" fill={D82.orange}/></svg>
            HORS LIGNE · ENVOI AUTO
          </div>
        )}
      </div>

      <div style={{ padding: '18px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { k: 'Véhicule',  v: 'CT-007 · 4271 TCB' },
          { k: 'Station',   v: 'GALANA TMM' },
          { k: 'GO livrée', v: '285,40 L' },
          { k: 'Km actuel', v: '142 628 km' },
          { k: 'Trajet',    v: '+248 km · 115,1 L/100' },
          { k: 'N° BC',     v: 'BC-2026-08412' },
          { k: 'Preuves',   v: '2 photos · 2.5 Mo' },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', gap: 12,
            padding: '6px 4px', borderBottom: `1px dashed ${t.lineSoft}`,
            fontSize: 13.5,
          }}>
            <span style={{ color: t.text3, fontWeight: 600 }}>{r.k}</span>
            <span style={{
              color: t.text, fontWeight: 700,
              fontFamily: /[\d]/.test(r.v) ? D82.mono : D82.ui,
              textAlign: 'right',
            }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// État · accueil vide (premier login)
// ════════════════════════════════════════════════════════════

function GsScreenAccueilEmpty({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 14px 0' }}>
        <button style={{
          width: '100%', minHeight: 108,
          background: D82.teal, color: '#fff', border: 0, borderRadius: 16,
          padding: '16px 18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
          boxShadow: t.tealShadow, fontFamily: D82.ui,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14, flexShrink: 0,
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.32)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>Premier pointage</div>
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.92, fontWeight: 500 }}>
              Commencez par scanner la plaque
            </div>
          </div>
          <GsChev size={28}/>
        </button>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '24px 36px', gap: 14,
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: 18,
          background: t.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#FFF',
          border: `1.5px dashed ${t.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.text3,
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M4 21V5a2 2 0 012-2h6a2 2 0 012 2v16M4 21h10M14 9h4l3 3v9h-7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M7 9h4M7 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: -0.3 }}>
          Aucun plein aujourd'hui
        </div>
        <div style={{ fontSize: 14, color: t.text3, lineHeight: 1.5, maxWidth: 260 }}>
          Vos pointages du jour apparaîtront ici dès le premier plein enregistré.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  GsChev, GsArrow, GsToConfirm, GsSectionLabel,
  GsVehicleStrip, GsKey, GsBigNumpad,
  GsScreenLogin, GsScreenAccueil, GsScreenAccueilEmpty,
  GsScreenVehicule, GsScreenStation, GsStationTile,
  GsScreenLitres, GsScreenLitresPhoto,
  GsScreenKm, GsScreenBC,
  GsScreenConfirmation, GsScreenSucces,
  FLEET, STATIONS, RECENT_FILLS,
});
