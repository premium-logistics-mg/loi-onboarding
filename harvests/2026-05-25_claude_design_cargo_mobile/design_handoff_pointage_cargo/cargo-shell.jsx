// Pointage Cargo shell — D82 tokens, themed (dark default + light).
// 375 × 812 mobile · pointeur cargo (PL-PTR-XXX) · une main, plein soleil, port/site, sous pression.
// 4 onglets bas (barre pouce) : Missions · Chargement · Livraison · Anomalies.
// Action, pas de KPI. Statut = couleur + FORME + libellé (jamais couleur seule).

const D82 = {
  navy:      '#0B2540',
  teal:      '#1A8E7E',
  cream:     '#F5F1E8',

  // Status — D82 strict (orange = Warn UNIQUEMENT · rouge = critique)
  ok:        '#1A8E7E',
  okSoft:    'rgba(26,142,126,0.18)',
  orange:    '#C77E2A',
  orangeSoft:'rgba(199,126,42,0.18)',
  red:       '#B8421E',
  redSoft:   'rgba(184,66,30,0.20)',

  ui:   'Inter, system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
};

const CG_DARK = {
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

const CG_LIGHT = {
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

const CG_TABS = [
  { id: 'missions',    label: 'Missions',    icon: 'list' },
  { id: 'chargement',  label: 'Chargement',  icon: 'load' },
  { id: 'livraison',   label: 'Livraison',   icon: 'deliver' },
  { id: 'anomalies',   label: 'Anomalies',   icon: 'warning' },
];

// ─── Status bar ─────────────────────────────────────────────
function CgStatusBar({ offline = true, time = '07:42' }) {
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

// ─── App bar ────────────────────────────────────────────────
function CgAppBar({ crumb, title, right, showBack = false }) {
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
          }}>{crumb || 'LOI · Pointage cargo'}</div>
          <div style={{
            fontSize: 22, fontWeight: 800, marginTop: 2,
            letterSpacing: -0.3,
          }}>{title || 'Pointage cargo'}</div>
        </div>
        {right}
      </div>
    </div>
  );
}

function CgPointeurChip({ matricule = 'PL-PTR-007' }) {
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
      }}>Pointeur</span>
      <span style={{
        fontFamily: D82.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{matricule}</span>
    </div>
  );
}

function CgMissionChip({ code }) {
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
      }}>Mission</span>
      <span style={{
        fontFamily: D82.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{code}</span>
    </div>
  );
}

// ─── Tab icons (line, trait fin) ───────────────────────────
function CgTabIcon({ kind, color, size = 22 }) {
  const s = { stroke: color, strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  switch (kind) {
    case 'list': return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h10" {...s}/>
        <circle cx="20" cy="18" r="2" {...s}/>
      </svg>);
    case 'load': return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect x="3" y="9" width="11" height="9" rx="1" {...s}/>
        <path d="M14 12h4l3 3v3h-7M7 18v1.5M17 18v1.5" {...s}/>
        <circle cx="7" cy="20" r="1.5" {...s}/>
        <circle cx="17" cy="20" r="1.5" {...s}/>
        <path d="M8.5 5l0 4M6 7l5 0" {...s}/>
      </svg>);
    case 'deliver': return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M4 7h10v8H4z" {...s}/>
        <path d="M14 10h4l3 3v2h-7" {...s}/>
        <circle cx="8" cy="17" r="1.8" {...s}/>
        <circle cx="17" cy="17" r="1.8" {...s}/>
        <path d="M14 15l1.5 1.5" {...s}/>
      </svg>);
    case 'warning': return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 4l9 16H3L12 4z" {...s}/>
        <path d="M12 10v4M12 17v.5" {...s}/>
      </svg>);
  }
}

// ─── Bottom tab bar (4 tabs) ───────────────────────────────
function CgTabBar({ t, active = 'missions', alert }) {
  return (
    <div style={{
      background: t.mode === 'dark' ? '#0B2540' : '#FFFFFF',
      borderTop: `1px solid ${t.mode === 'dark' ? '#15304F' : t.line}`,
      padding: '8px 6px 10px',
      display: 'flex', alignItems: 'stretch', gap: 0,
      fontFamily: D82.ui,
    }}>
      {CG_TABS.map((tab) => {
        const isActive = tab.id === active;
        const color = isActive
          ? (t.mode === 'dark' ? '#fff' : D82.teal)
          : (t.mode === 'dark' ? '#7E94B5' : t.text3);
        const showAlert = alert && tab.id === alert.id;
        return (
          <button key={tab.id} style={{
            flex: 1, minWidth: 0, padding: '6px 2px 4px',
            background: 'transparent', border: 0, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            position: 'relative',
            color,
          }}>
            <div style={{
              width: 44, height: 30, borderRadius: 8,
              background: isActive
                ? (t.mode === 'dark' ? 'rgba(26,142,126,0.22)' : 'rgba(26,142,126,0.12)')
                : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <CgTabIcon kind={tab.icon} color={color} size={24}/>
              {showAlert && (
                <span style={{
                  position: 'absolute', top: 1, right: 6,
                  minWidth: 14, height: 14, borderRadius: 7,
                  background: D82.red, color: '#fff',
                  fontFamily: D82.mono, fontSize: 9, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 3px',
                  border: `1.5px solid ${t.mode === 'dark' ? '#0B2540' : '#fff'}`,
                }}>{alert.count}</span>
              )}
            </div>
            <span style={{
              fontSize: 10.5, fontWeight: isActive ? 800 : 600,
              letterSpacing: 0.2,
            }}>{tab.label}</span>
            {isActive && (
              <span style={{
                position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                width: 34, height: 3, borderRadius: 2, background: D82.teal,
              }}/>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Bottom action bar ─────────────────────────────────────
function CgActionBar({
  t, primary = 'Continuer', secondary, primaryEnabled = true,
  hint, primaryIcon = 'arrow', primaryTone = 'teal',
}) {
  const bg = primaryTone === 'red' ? D82.red : D82.teal;
  const shadow = primaryTone === 'red' ? t.redShadow : t.tealShadow;
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
            background: primaryEnabled ? bg : t.text4,
            boxShadow: primaryEnabled ? `0 0 0 4px ${primaryTone === 'red' ? D82.redSoft : D82.okSoft}` : 'none',
          }} />
          {hint}
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
        </button>
      </div>
    </div>
  );
}

// ─── Phone composer ─────────────────────────────────────────
function CgPhone({ theme = 'dark', tab, crumb, title, right, showBack = false, body, action, tabBar = true, tabAlert }) {
  const t = theme === 'dark' ? CG_DARK : CG_LIGHT;
  return (
    <div style={{
      width: 375, height: 812, borderRadius: 18, overflow: 'hidden',
      background: t.paper,
      border: `8px solid rgba(20,24,32,0.85)`,
      boxShadow: '0 30px 80px rgba(11,37,64,0.32)',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      fontFamily: D82.ui, color: t.text,
    }}>
      <CgStatusBar />
      <CgAppBar crumb={crumb} title={title} right={right} showBack={showBack} />
      <div style={{
        flex: 1, overflow: 'hidden',
        background: t.paper,
        display: 'flex', flexDirection: 'column',
      }}>
        {body && React.cloneElement(body, { t })}
      </div>
      {action && React.cloneElement(action, { t })}
      {tabBar && <CgTabBar t={t} active={tab} alert={tabAlert}/>}
      <div style={{
        height: 16, background: t.mode === 'dark' ? '#0B2540' : '#FFFFFF', display: 'flex',
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
  D82, CG_DARK, CG_LIGHT, CG_TABS,
  CgStatusBar, CgAppBar, CgTabBar, CgActionBar, CgPhone,
  CgPointeurChip, CgMissionChip, CgTabIcon,
});
