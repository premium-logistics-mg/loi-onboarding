// Chauffeur shell — D82 tokens, themed (dark default + light).
// 375 × 812 mobile, chauffeur with gloves, plein soleil, faible familiarité tech.
// Primary ≥56px, secondary ≥48px, body ≥16px, IBM Plex Mono on every digit.

const D82 = {
  // Brand (locked by §)
  navy:      '#0B2540',
  teal:      '#1A8E7E',
  cream:     '#F5F1E8',

  // Status (D82 — couleur + forme/icône, jamais couleur seule)
  green:     '#2D8659',
  greenSoft: 'rgba(45,134,89,0.18)',
  orange:    '#C77E2A',
  orangeSoft:'rgba(199,126,42,0.18)',
  red:       '#B8421E',
  redSoft:   'rgba(184,66,30,0.20)',

  ui:   'Inter, system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
};

// ── Theme palettes ─────────────────────────────────────────
const DARK = {
  mode: 'dark',
  // Canvas
  paper:      '#061629',
  surface:    '#0F2A47',   // cards
  surface2:   '#173659',   // raised cards
  surfaceMute:'#0B2540',
  // Lines
  line:       '#1E3E66',
  lineSoft:   '#15304F',
  divider:    '#1A3556',
  // Text
  text:       '#F5F1E8',
  text2:      '#B7C9E0',
  text3:      '#7E94B5',
  text4:      '#56708F',
  inkOn:      '#FFFFFF',
  // Header
  header:     '#0B2540',
  headerInk:  '#FFFFFF',
  headerMute: '#9CB3D1',
  // Chip on dark
  chipBg:     'rgba(255,255,255,0.06)',
  chipBd:     'rgba(255,255,255,0.18)',
  // Action
  primaryBg:  D82.teal,
  primaryInk: '#FFFFFF',
  primaryShadow:'0 8px 20px rgba(26,142,126,0.45)',
  secondaryBd:'#F5F1E8',
  secondaryInk:'#F5F1E8',
  // Status
  good:       '#3EAA9B',
  goodSoft:   'rgba(62,170,155,0.22)',
};

const LIGHT = {
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
  inkOn:      '#FFFFFF',
  header:     '#0B2540',     // Header stays navy in both themes — repérage instantané
  headerInk:  '#FFFFFF',
  headerMute: '#9CB3D1',
  chipBg:     'rgba(255,255,255,0.06)',
  chipBd:     'rgba(255,255,255,0.18)',
  primaryBg:  D82.teal,
  primaryInk: '#FFFFFF',
  primaryShadow:'0 8px 20px rgba(26,142,126,0.30)',
  secondaryBd:'#0B2540',
  secondaryInk:'#0B2540',
  good:       D82.teal,
  goodSoft:   'rgba(26,142,126,0.18)',
};

const CHAUFFEUR_STEPS = ['Véhicule', 'Événement', 'Détails', 'Confirmer', 'Fini'];

// ─── Status bar (navy in both modes) ─────────────────────────
function CStatusBar({ offline = true }) {
  return (
    <div style={{
      height: 32, background: '#0B2540', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      fontFamily: D82.ui, fontSize: 13, fontWeight: 600,
    }}>
      <span style={{ fontFamily: D82.mono, fontVariantNumeric: 'tabular-nums' }}>07:42</span>
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

// ─── App bar ────────────────────────────────────────────────
function CAppBar({ crumb, title, right, showBack = true }) {
  return (
    <div style={{
      background: '#0B2540', color: '#fff', padding: '6px 6px 14px',
      fontFamily: D82.ui,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 56 }}>
        <button aria-label="Retour" style={{
          width: 56, height: 56, border: 0, background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', borderRadius: 8,
          opacity: showBack ? 1 : 0.2,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 2,
            color: '#8FA5C3', textTransform: 'uppercase',
          }}>{crumb || 'LOI · Pointage chauffeur'}</div>
          <div style={{
            fontSize: 22, fontWeight: 800, marginTop: 2,
            letterSpacing: -0.3,
          }}>{title || 'Pointage'}</div>
        </div>
        {right}
      </div>
    </div>
  );
}

// ─── Driver chip (right of app bar) ─────────────────────────
function CDriverChip({ matricule = 'PL-CHF-007' }) {
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
      }}>Chauffeur</span>
      <span style={{
        fontFamily: D82.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{matricule}</span>
    </div>
  );
}

function CTruckChip({ code, plate }) {
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
      }}>Véhicule</span>
      <span style={{
        fontFamily: D82.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{code}</span>
    </div>
  );
}

// ─── Step indicator ─────────────────────────────────────────
function CSteps({ step }) {
  return (
    <div style={{ background: '#0B2540', padding: '0 14px 14px', fontFamily: D82.ui }}>
      <div style={{ display: 'flex', gap: 5, alignItems: 'stretch' }}>
        {CHAUFFEUR_STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          const filled = done || active;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{
                height: 4, borderRadius: 2,
                background: filled ? D82.teal : 'rgba(255,255,255,0.18)',
              }} />
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 1,
                textTransform: 'uppercase',
                color: active ? '#fff' : (done ? '#9CC8C0' : '#6E84A3'),
                textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {String(n).padStart(2, '0')} · {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Bottom action bar ──────────────────────────────────────
function CActionBar({ t, primary = 'Continuer', secondary, primaryEnabled = true, hint, hintIcon, primaryIcon = 'arrow' }) {
  return (
    <div style={{
      background: t.surface, borderTop: `1px solid ${t.line}`,
      padding: '14px 14px 16px', fontFamily: D82.ui,
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
            background: primaryEnabled ? D82.teal : t.text4,
            boxShadow: primaryEnabled ? `0 0 0 4px ${t.goodSoft}` : 'none',
          }} />
          {hint}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        {secondary && (
          <button style={{
            flex: '0 0 38%', height: 56, minHeight: 56,
            border: `2px solid ${t.secondaryBd}`,
            background: 'transparent', color: t.secondaryInk,
            fontFamily: D82.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.4,
            textTransform: 'uppercase', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke={t.secondaryInk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {secondary}
          </button>
        )}
        <button disabled={!primaryEnabled} style={{
          flex: 1, height: 64, minHeight: 64,
          background: primaryEnabled ? t.primaryBg : t.surfaceMute,
          color: primaryEnabled ? t.primaryInk : t.text4,
          border: 0, borderRadius: 10,
          cursor: primaryEnabled ? 'pointer' : 'not-allowed',
          fontFamily: D82.ui, fontSize: 18, fontWeight: 800, letterSpacing: 0.5,
          textTransform: 'uppercase',
          boxShadow: primaryEnabled ? t.primaryShadow : 'none',
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
          {primaryEnabled && primaryIcon === 'plus' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Phone composer ─────────────────────────────────────────
function CPhone({ theme = 'dark', step, crumb, title, right, showBack = true, body, action }) {
  const t = theme === 'dark' ? DARK : LIGHT;
  return (
    <div style={{
      width: 375, height: 812, borderRadius: 18, overflow: 'hidden',
      background: t.paper,
      border: `8px solid rgba(20,24,32,0.85)`,
      boxShadow: '0 30px 80px rgba(11,37,64,0.32)',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      fontFamily: D82.ui, color: t.text,
    }}>
      <CStatusBar />
      <CAppBar crumb={crumb} title={title} right={right} showBack={showBack} />
      {step !== undefined && <CSteps step={step} />}
      <div style={{
        flex: 1, overflow: 'hidden',
        background: t.paper,
        display: 'flex', flexDirection: 'column',
      }}>
        {body && React.cloneElement(body, { t })}
      </div>
      {action && React.cloneElement(action, { t })}
      <div style={{
        height: 16, background: t.surface, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 108, height: 4, borderRadius: 2,
          background: t.text, opacity: t.mode === 'dark' ? 0.55 : 0.4,
        }} />
      </div>
    </div>
  );
}

Object.assign(window, {
  D82, DARK, LIGHT, CHAUFFEUR_STEPS,
  CStatusBar, CAppBar, CSteps, CActionBar, CPhone,
  CDriverChip, CTruckChip,
});
