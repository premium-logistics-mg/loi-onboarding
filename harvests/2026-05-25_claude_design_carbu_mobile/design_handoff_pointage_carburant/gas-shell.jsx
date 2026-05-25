// Pointage Carburant — shell. D82 tokens, themed (dark default + light).
// 375 × 812 mobile · opérateur carburant DÉDIÉ (PL-GAS-XXX) · une main, plein soleil, station/dépôt, sous pression.
// FLUX LINÉAIRE — pas de tab bar : Véhicule → Station → Litres → Trajet/Km → N° BC → Confirmation → Succès.
// Action, pas de KPI. Statut = couleur + FORME + libellé.

const D82 = {
  navy:      '#0B2540',
  teal:      '#1A8E7E',
  cream:     '#F5F1E8',

  ok:        '#1A8E7E',
  okSoft:    'rgba(26,142,126,0.18)',
  orange:    '#C77E2A',   // Warn UNIQUEMENT
  orangeSoft:'rgba(199,126,42,0.18)',
  red:       '#B8421E',   // Critique UNIQUEMENT
  redSoft:   'rgba(184,66,30,0.20)',

  ui:   'Inter, system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
};

const GS_DARK = {
  mode: 'dark',
  paper:      '#061629',
  surface:    '#0F2A47',
  surface2:   '#173659',
  surfaceMute:'#0B2540',
  line:       '#1E3E66',
  lineSoft:   '#15304F',
  divider:    '#1A3556',
  text:       '#F5F1E8',
  text2:      '#B7C9E0',
  text3:      '#7E94B5',
  text4:      '#56708F',
  header:     '#0B2540',
  headerInk:  '#FFFFFF',
  headerMute: '#9CB3D1',
  tealShadow: '0 8px 20px rgba(26,142,126,0.45)',
  redShadow:  '0 8px 20px rgba(184,66,30,0.50)',
};

const GS_LIGHT = {
  mode: 'light',
  paper:      '#F5F1E8',
  surface:    '#FFFFFF',
  surface2:   '#FBF7EC',
  surfaceMute:'#EDE8D8',
  line:       '#D7D2C2',
  lineSoft:   '#E6E1D2',
  divider:    '#CFC9B6',
  text:       '#0B2540',
  text2:      '#384A63',
  text3:      '#5E6B7C',
  text4:      '#8A95A3',
  header:     '#0B2540',
  headerInk:  '#FFFFFF',
  headerMute: '#9CB3D1',
  tealShadow: '0 8px 20px rgba(26,142,126,0.30)',
  redShadow:  '0 8px 20px rgba(184,66,30,0.35)',
};

// 6 étapes du plein (succès n'est pas une étape)
const GS_STEPS = [
  { id: 1, key: 'vehicule', label: 'Véhicule' },
  { id: 2, key: 'station',  label: 'Station' },
  { id: 3, key: 'litres',   label: 'Litres' },
  { id: 4, key: 'km',       label: 'Trajet' },
  { id: 5, key: 'bc',       label: 'N° BC' },
  { id: 6, key: 'conf',     label: 'Valider' },
];

// ─── Status bar ─────────────────────────────────────────────
function GsStatusBar({ offline = true, time = '06:18' }) {
  return (
    <div style={{
      height: 32, background: '#0B2540', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      fontFamily: D82.ui, fontSize: 13, fontWeight: 600,
    }}>
      <span style={{ fontFamily: D82.mono, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {offline && (
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.6,
            padding: '2px 7px', borderRadius: 3,
            background: 'rgba(199,126,42,0.25)',
            color: '#E8B97A',
            border: '1px solid rgba(232,185,122,0.5)',
          }}>HORS LIGNE</span>
        )}
        <svg width="14" height="11" viewBox="0 0 14 11" aria-hidden="true">
          <path d="M7 9.5l5.5-5.5a7.78 7.78 0 00-11 0L7 9.5z" fill="#fff" opacity="0.95"/>
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden="true">
          <rect x="0.5" y="0.5" width="18" height="10" rx="1.5" fill="none" stroke="#fff" opacity="0.85"/>
          <rect x="2" y="2" width="11" height="7" fill="#fff"/>
          <rect x="19" y="3.5" width="2" height="4" rx="0.5" fill="#fff" opacity="0.85"/>
        </svg>
      </div>
    </div>
  );
}

// ─── App bar (navy, conservé clair + sombre) ────────────────
function GsAppBar({ crumb, title, right, showBack = false, showClose = false }) {
  return (
    <div style={{
      background: '#0B2540', color: '#fff', padding: '6px 6px 12px',
      fontFamily: D82.ui,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 56 }}>
        <button aria-label={showClose ? 'Fermer' : 'Retour'} style={{
          width: 56, height: 56, border: 0, background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', borderRadius: 8,
          opacity: (showBack || showClose) ? 1 : 0.15,
        }}>
          {showClose ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 2,
            color: '#8FA5C3', textTransform: 'uppercase',
          }}>{crumb || 'LOI · Pointage carburant'}</div>
          <div style={{
            fontSize: 22, fontWeight: 800, marginTop: 2,
            letterSpacing: -0.3,
          }}>{title || 'Pointage carburant'}</div>
        </div>
        {right}
      </div>
    </div>
  );
}

// ─── Operator chip (PL-GAS-XXX) ────────────────────────────
function GsOperatorChip({ matricule = 'PL-GAS-003' }) {
  return (
    <div style={{
      marginRight: 4, padding: '6px 10px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 8,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      lineHeight: 1.1,
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 1.3,
        color: '#9CB3D1', textTransform: 'uppercase',
      }}>Opérateur</span>
      <span style={{
        fontFamily: D82.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{matricule}</span>
    </div>
  );
}

// ─── Vehicle chip (visible dès l'étape 2) ──────────────────
function GsVehicleChip({ truck = 'CT-007', plate = '4271 TCB' }) {
  return (
    <div style={{
      marginRight: 4, padding: '6px 10px',
      background: 'rgba(26,142,126,0.25)',
      border: '1px solid rgba(62,170,155,0.45)',
      borderRadius: 8,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      lineHeight: 1.1,
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 1.3,
        color: '#9CD4C9', textTransform: 'uppercase',
      }}>{truck}</span>
      <span style={{
        fontFamily: D82.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{plate}</span>
    </div>
  );
}

// ─── Step dots — barre de progression linéaire ─────────────
function GsStepDots({ t, current = 1, omit = false }) {
  if (omit) return null;
  return (
    <div style={{
      background: '#0B2540',
      padding: '10px 14px 14px',
      fontFamily: D82.ui,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {GS_STEPS.map((s, i) => {
          const done   = s.id < current;
          const active = s.id === current;
          const color  = (done || active) ? '#3EAA9B' : 'rgba(255,255,255,0.16)';
          return (
            <React.Fragment key={s.id}>
              <div style={{
                position: 'relative',
                width: active ? 28 : 14, height: 14,
                borderRadius: 7,
                background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? '0 0 0 4px rgba(62,170,155,0.20)' : 'none',
                transition: 'width .15s',
              }}>
                {done && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7" stroke="#0B2540" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {active && (
                  <span style={{
                    fontFamily: D82.mono, fontSize: 9, fontWeight: 800,
                    color: '#0B2540', letterSpacing: 0.2,
                  }}>{String(s.id).padStart(2, '0')}</span>
                )}
              </div>
              {i < GS_STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, borderRadius: 1,
                  background: s.id < current ? '#3EAA9B' : 'rgba(255,255,255,0.12)',
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{
        marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        fontFamily: D82.ui, color: '#fff',
      }}>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.1 }}>
          <span style={{ fontFamily: D82.mono, fontSize: 13, color: '#3EAA9B', marginRight: 8 }}>
            {String(current).padStart(2, '0')}/{String(GS_STEPS.length).padStart(2, '0')}
          </span>
          {GS_STEPS[current - 1]?.label}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
          color: '#9CB3D1', textTransform: 'uppercase',
        }}>
          {current < GS_STEPS.length ? `Suivant · ${GS_STEPS[current]?.label}` : 'Dernière étape'}
        </span>
      </div>
    </div>
  );
}

// ─── Bottom action bar ─────────────────────────────────────
function GsActionBar({
  t, primary = 'Continuer', secondary, primaryEnabled = true,
  hint, primaryIcon = 'arrow', primaryTone = 'teal',
}) {
  const bg = primaryTone === 'red' ? D82.red : D82.teal;
  const shadow = primaryTone === 'red' ? t.redShadow : t.tealShadow;
  return (
    <div style={{
      background: t.surface, borderTop: `1px solid ${t.line}`,
      padding: '14px 14px 18px', fontFamily: D82.ui,
      boxShadow: t.mode === 'dark'
        ? '0 -12px 30px rgba(0,0,0,0.40)'
        : '0 -10px 24px -16px rgba(11,37,64,0.20)',
    }}>
      {hint && (
        <div style={{
          fontSize: 13, color: t.text2, marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: primaryEnabled ? bg : t.text4,
            boxShadow: primaryEnabled ? `0 0 0 4px ${primaryTone === 'red' ? D82.redSoft : D82.okSoft}` : 'none',
            flexShrink: 0,
          }} />
          <span>{hint}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        {secondary && (
          <button style={{
            flex: '0 0 36%', height: 56, minHeight: 56,
            border: `2px solid ${t.mode === 'dark' ? '#F5F1E8' : '#0B2540'}`,
            background: 'transparent', color: t.mode === 'dark' ? '#F5F1E8' : '#0B2540',
            fontFamily: D82.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.4,
            textTransform: 'uppercase', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke={t.mode === 'dark' ? '#F5F1E8' : '#0B2540'} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {secondary}
          </button>
        )}
        <button disabled={!primaryEnabled} style={{
          flex: 1, height: 64, minHeight: 64,
          background: primaryEnabled ? bg : t.surfaceMute,
          color: primaryEnabled ? '#fff' : t.text4,
          border: 0, borderRadius: 10,
          cursor: primaryEnabled ? 'pointer' : 'not-allowed',
          fontFamily: D82.ui, fontSize: 17, fontWeight: 800, letterSpacing: 0.5,
          textTransform: 'uppercase',
          boxShadow: primaryEnabled ? shadow : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          {primary}
          {primaryEnabled && primaryIcon === 'arrow' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {primaryEnabled && primaryIcon === 'check' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {primaryEnabled && primaryIcon === 'send' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l16-8-5 18-4-7-7-3z" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round"/>
            </svg>
          )}
          {primaryEnabled && primaryIcon === 'plus' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
            </svg>
          )}
          {primaryEnabled && primaryIcon === 'lock' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="#fff" strokeWidth="2.2"/>
              <path d="M8 11V8a4 4 0 018 0v3" stroke="#fff" strokeWidth="2.2"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Phone composer ─────────────────────────────────────────
function GsPhone({
  theme = 'dark', crumb, title, right, showBack = false, showClose = false,
  body, action, stepDots,
  hideAppBar = false,
}) {
  const t = theme === 'dark' ? GS_DARK : GS_LIGHT;
  return (
    <div style={{
      width: 375, height: 812, borderRadius: 18, overflow: 'hidden',
      background: t.paper,
      border: `8px solid rgba(20,24,32,0.85)`,
      boxShadow: '0 30px 80px rgba(11,37,64,0.32)',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      fontFamily: D82.ui, color: t.text,
    }}>
      <GsStatusBar />
      {!hideAppBar && <GsAppBar crumb={crumb} title={title} right={right} showBack={showBack} showClose={showClose} />}
      {stepDots && <GsStepDots t={t} current={stepDots}/>}
      <div style={{
        flex: 1, overflow: 'hidden',
        background: t.paper,
        display: 'flex', flexDirection: 'column',
      }}>
        {body && React.cloneElement(body, { t })}
      </div>
      {action && React.cloneElement(action, { t })}
      <div style={{
        height: 16, background: t.mode === 'dark' ? '#0B2540' : '#FFFFFF', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 108, height: 4, borderRadius: 2,
          background: t.text, opacity: t.mode === 'dark' ? 0.55 : 0.4,
        } }/>
      </div>
    </div>
  );
}

Object.assign(window, {
  D82, GS_DARK, GS_LIGHT, GS_STEPS,
  GsStatusBar, GsAppBar, GsStepDots, GsActionBar, GsPhone,
  GsOperatorChip, GsVehicleChip,
});
