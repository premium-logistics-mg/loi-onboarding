// LOI shell — D82 tokens, light-cream body for sun readability,
// navy app bar for hierarchy. Big targets (≥56px primary, ≥48px secondary).

const LOI = {
  // D82 light (chosen for under-sun readability per §7)
  paper:     '#F5F1E8',   // cream background
  card:      '#FFFFFF',
  navy:      '#0B2540',   // primary text + app bar
  navy2:     '#142F4F',
  navy3:     '#1E3E66',
  // Accent
  teal:      '#1A8E7E',
  tealDeep:  '#0F6E60',
  tealSoft:  '#D3E8E2',
  tealOnDark:'#3EAA9B',
  // Status (D82)
  green:     '#2D8659',
  orange:    '#C77E2A',
  red:       '#B8421E',
  // Neutrals
  ink:       '#0B2540',
  ink2:      '#384A63',
  steel:     '#5E6B7C',
  steel2:    '#8A95A3',
  line:      '#D7D2C2',
  lineSoft:  '#E6E1D2',
  divider:   '#CFC9B6',
  // Type
  ui:   'Inter, system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
};

const LOI_STEPS = ['Véhicule', 'Position', 'Événement', 'Détails', 'Confirmer'];

// ─── Status bar (navy, white icons) ─────────────────────────
function LOIStatusBar({ offline = true }) {
  return (
    <div style={{
      height: 30, background: LOI.navy, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      fontFamily: LOI.ui, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: LOI.mono }}>07:42</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {offline && (
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.5,
            padding: '2px 7px', borderRadius: 3,
            background: 'rgba(199,126,42,0.22)',
            color: '#E8B97A',
            border: '1px solid rgba(232,185,122,0.45)',
            fontFamily: LOI.ui,
          }}>HORS LIGNE</span>
        )}
        <svg width="14" height="11" viewBox="0 0 14 11" aria-hidden="true">
          <path d="M7 9.5l5.5-5.5a7.78 7.78 0 00-11 0L7 9.5z" fill="#fff" opacity="0.95"/>
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden="true">
          <rect x="0.5" y="0.5" width="18" height="10" rx="1.5" fill="none" stroke="#fff" opacity="0.85"/>
          <rect x="2" y="2" width="9" height="7" fill="#fff"/>
          <rect x="19" y="3.5" width="2" height="4" rx="0.5" fill="#fff" opacity="0.85"/>
        </svg>
      </div>
    </div>
  );
}

// ─── App bar — back chevron + module crumb + matricule ───────
function LOIAppBar({ crumb, title, right, showBack = true }) {
  return (
    <div style={{
      background: LOI.navy, color: '#fff', padding: '6px 6px 12px',
      fontFamily: LOI.ui,
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
          }}>{crumb || 'Premium Logistics · Atelier'}</div>
          <div style={{
            fontSize: 22, fontWeight: 700, marginTop: 2,
            letterSpacing: -0.3,
          }}>{title || 'Pointage pneu'}</div>
        </div>
        {right}
      </div>
    </div>
  );
}

// ─── Matricule chip (right side of app bar) ─────────────────
function LOIMatChip({ matricule = 'PL-MEC-007' }) {
  return (
    <div style={{
      marginRight: 4, padding: '6px 10px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.16)',
      borderRadius: 8,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      lineHeight: 1.1,
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 1.3,
        color: '#8FA5C3', textTransform: 'uppercase',
      }}>Mécanicien</span>
      <span style={{
        fontFamily: LOI.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{matricule}</span>
    </div>
  );
}

// ─── Truck chip (right side, when a vehicle is locked) ──────
function LOITruckChip({ code, plate }) {
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
        fontFamily: LOI.mono, fontSize: 13, fontWeight: 600,
        color: '#fff', marginTop: 2,
      }}>{code || plate}</span>
    </div>
  );
}

// ─── Step indicator ─────────────────────────────────────────
function LOISteps({ step }) {
  return (
    <div style={{ background: LOI.navy, padding: '0 14px 14px', fontFamily: LOI.ui }}>
      <div style={{ display: 'flex', gap: 5, alignItems: 'stretch' }}>
        {LOI_STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          const filled = done || active;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{
                height: 4, borderRadius: 2,
                background: filled ? LOI.teal : 'rgba(255,255,255,0.16)',
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
function LOIActionBar({
  primary = 'Continuer', secondary, primaryEnabled = true,
  hint, hintColor,
}) {
  return (
    <div style={{
      background: LOI.card, borderTop: `1px solid ${LOI.line}`,
      padding: '12px 14px 14px', fontFamily: LOI.ui,
      boxShadow: '0 -10px 24px -16px rgba(11,37,64,0.18)',
    }}>
      {hint && (
        <div style={{
          fontSize: 13, color: hintColor || LOI.steel, marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: primaryEnabled ? LOI.teal : LOI.steel2,
            boxShadow: primaryEnabled ? `0 0 0 4px ${LOI.tealSoft}` : 'none',
          }} />
          {hint}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        {secondary && (
          <button style={{
            flex: '0 0 38%', height: 60, minHeight: 60,
            border: `2px solid ${LOI.navy}`,
            background: 'transparent', color: LOI.navy,
            fontFamily: LOI.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.3,
            textTransform: 'uppercase', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke={LOI.navy} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {secondary}
          </button>
        )}
        <button disabled={!primaryEnabled} style={{
          flex: 1, height: 64, minHeight: 64,
          background: primaryEnabled ? LOI.teal : LOI.lineSoft,
          color: primaryEnabled ? '#fff' : LOI.steel2,
          border: 0, borderRadius: 10,
          cursor: primaryEnabled ? 'pointer' : 'not-allowed',
          fontFamily: LOI.ui, fontSize: 18, fontWeight: 800, letterSpacing: 0.5,
          textTransform: 'uppercase',
          boxShadow: primaryEnabled
            ? '0 1px 0 rgba(0,0,0,0.04), 0 8px 20px rgba(26,142,126,0.28)'
            : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          {primary}
          {primaryEnabled && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Phone composer ─────────────────────────────────────────
function LOIPhone({ step, crumb, title, right, showBack = true, body, action, bodyBg }) {
  return (
    <div style={{
      width: 412, height: 892, borderRadius: 18, overflow: 'hidden',
      background: LOI.paper,
      border: `8px solid rgba(60,66,78,0.55)`,
      boxShadow: '0 30px 80px rgba(11,37,64,0.28)',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      fontFamily: LOI.ui,
    }}>
      <LOIStatusBar />
      <LOIAppBar crumb={crumb} title={title} right={right} showBack={showBack} />
      {step !== undefined && <LOISteps step={step} />}
      <div style={{
        flex: 1, overflow: 'hidden',
        background: bodyBg || LOI.paper,
        display: 'flex', flexDirection: 'column',
      }}>
        {body}
      </div>
      {action}
      <div style={{
        height: 16, background: LOI.card, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 108, height: 4, borderRadius: 2, background: LOI.ink, opacity: 0.4 }} />
      </div>
    </div>
  );
}

Object.assign(window, {
  LOI, LOI_STEPS,
  LOIStatusBar, LOIAppBar, LOISteps, LOIActionBar, LOIPhone,
  LOIMatChip, LOITruckChip,
});
