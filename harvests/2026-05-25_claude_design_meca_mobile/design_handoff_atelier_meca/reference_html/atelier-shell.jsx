// Atelier Méca — shell mobile D82 (dark défaut + light).
// Mécanicien · une main · gants gras · atelier Betainomby · sous pression.
// 375 × 812 — pas de tab bar (le brief = 2 vues : liste & détail).
// Header navy dans les deux modes pour repérage instantané.

const D82 = {
  navy:      '#0B2540',
  teal:      '#1A8E7E',
  cream:     '#F5F1E8',

  ok:        '#1A8E7E',
  okSoft:    'rgba(26,142,126,0.18)',
  green:     '#2D8659',   // signal vert · Terminé
  greenSoft: 'rgba(45,134,89,0.20)',
  orange:    '#C77E2A',   // Bloquer / alerte / En attente
  orangeSoft:'rgba(199,126,42,0.20)',
  red:       '#B8421E',   // Critique uniquement
  redSoft:   'rgba(184,66,30,0.20)',

  ui:   'Inter, system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
};

const M_DARK = {
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
  orangeShadow:'0 8px 20px rgba(199,126,42,0.45)',
};

const M_LIGHT = {
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
  orangeShadow:'0 8px 20px rgba(199,126,42,0.30)',
};

// ─── Status bar (navy + HORS LIGNE) ─────────────────────────
function MStatusBar({ offline = true, time = '07:42' }) {
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

// ─── App bar — back chevron + module crumb + matricule chip ──
function MAppBar({ crumb, title, right, showBack = false }) {
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
          opacity: showBack ? 1 : 0.15,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 2,
            color: '#8FA5C3', textTransform: 'uppercase',
          }}>{crumb || 'LOI · Atelier Méca'}</div>
          <div style={{
            fontSize: 22, fontWeight: 800, marginTop: 2,
            letterSpacing: -0.3,
          }}>{title || 'Atelier Méca'}</div>
        </div>
        {right}
      </div>
    </div>
  );
}

// ─── Chips header droite ────────────────────────────────────
function MMecChip({ matricule = 'PL-MEC-007' }) {
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
      }}>Mécanicien</span>
      <span style={{
        fontFamily: D82.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{matricule}</span>
    </div>
  );
}

function MTruckChip({ code, plate }) {
  return (
    <div style={{
      marginRight: 4, padding: '6px 10px',
      background: 'rgba(26,142,126,0.22)',
      border: '1px solid rgba(62,170,155,0.4)',
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
      }}>{code || plate}</span>
    </div>
  );
}

// ─── Action bar — variantes single / dual-Bloquer-Terminer ──
function MActionBar({ t, primary, primaryTone = 'teal', primaryEnabled = true,
                     primaryIcon = 'arrow', secondary, hint,
                     bloquer = false }) {
  // bloquer = mode dual : « Bloquer » (orange, 40%) + « Terminer » (teal, 60%)
  const primaryBg = primaryTone === 'red' ? D82.red
                  : primaryTone === 'orange' ? D82.orange
                  : D82.teal;
  const shadow = primaryTone === 'orange' ? t.orangeShadow
               : primaryTone === 'red' ? '0 8px 20px rgba(184,66,30,0.50)'
               : t.tealShadow;

  if (bloquer) {
    return (
      <div style={{
        background: t.surface, borderTop: `1px solid ${t.line}`,
        padding: '12px 14px 14px', fontFamily: D82.ui,
        boxShadow: t.mode === 'dark'
          ? '0 -12px 30px rgba(0,0,0,0.40)'
          : '0 -10px 24px -16px rgba(11,37,64,0.20)',
      }}>
        {hint && (
          <div style={{
            fontSize: 12, color: t.text3, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: D82.teal, boxShadow: `0 0 0 4px ${D82.okSoft}`,
            }} />
            {hint}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            flex: '0 0 42%', height: 60, minHeight: 60,
            background: D82.orange, color: '#fff', border: 0, borderRadius: 12,
            cursor: 'pointer',
            fontFamily: D82.ui, fontSize: 16, fontWeight: 800, letterSpacing: 0.5,
            textTransform: 'uppercase',
            boxShadow: t.orangeShadow,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2.4"/>
              <path d="M6 6l12 12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/>
            </svg>
            Bloquer
          </button>
          <button style={{
            flex: 1, height: 60, minHeight: 60,
            background: D82.teal, color: '#fff', border: 0, borderRadius: 12,
            cursor: 'pointer',
            fontFamily: D82.ui, fontSize: 17, fontWeight: 800, letterSpacing: 0.5,
            textTransform: 'uppercase',
            boxShadow: t.tealShadow,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Terminer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: t.surface, borderTop: `1px solid ${t.line}`,
      padding: '12px 14px 14px', fontFamily: D82.ui,
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
            background: primaryEnabled ? primaryBg : t.text4,
            boxShadow: primaryEnabled ? `0 0 0 4px ${primaryBg}33` : 'none',
          }} />
          {hint}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        {secondary && (
          <button style={{
            flex: '0 0 38%', height: 56, minHeight: 56,
            border: `2px solid ${t.mode === 'dark' ? '#F5F1E8' : '#0B2540'}`,
            background: 'transparent',
            color: t.mode === 'dark' ? '#F5F1E8' : '#0B2540',
            fontFamily: D82.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.3,
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
          background: primaryEnabled ? primaryBg : t.surfaceMute,
          color: primaryEnabled ? '#fff' : t.text4,
          border: 0, borderRadius: 12,
          cursor: primaryEnabled ? 'pointer' : 'not-allowed',
          fontFamily: D82.ui, fontSize: 18, fontWeight: 800, letterSpacing: 0.5,
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
        </button>
      </div>
    </div>
  );
}

// ─── Phone composer ─────────────────────────────────────────
function MPhone({ theme = 'dark', crumb, title, right, showBack = false, body, action, footerInk = 'bar' }) {
  const t = theme === 'dark' ? M_DARK : M_LIGHT;
  return (
    <div style={{
      width: 375, height: 812, borderRadius: 18, overflow: 'hidden',
      background: t.paper,
      border: `8px solid rgba(20,24,32,0.85)`,
      boxShadow: '0 30px 80px rgba(11,37,64,0.32)',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      fontFamily: D82.ui, color: t.text,
    }}>
      <MStatusBar />
      <MAppBar crumb={crumb} title={title} right={right} showBack={showBack} />
      <div style={{
        flex: 1, overflow: 'hidden',
        background: t.paper,
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        {body && React.cloneElement(body, { t })}
      </div>
      {action && React.cloneElement(action, { t })}
      <div style={{
        height: 16, background: action
          ? (t.mode === 'dark' ? t.surface : '#FFFFFF')
          : (t.mode === 'dark' ? '#0B2540' : '#FFFFFF'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
  D82, M_DARK, M_LIGHT,
  MStatusBar, MAppBar, MMecChip, MTruckChip, MActionBar, MPhone,
});
