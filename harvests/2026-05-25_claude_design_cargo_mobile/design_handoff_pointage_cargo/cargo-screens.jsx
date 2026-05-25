// Pointage Cargo — screens. Themed via `t` prop.
// FR métier · IBM Plex Mono sur chiffres · status = couleur + forme + libellé.
// Données réelles : GRANITE 30T COLAS/Ivondro→Port Toamasina · Chrome APC 22T Moramanga→APC Andriamena RN44.
// Flotte CT-001..015 SCHACMAN F3000 6×4 + KERAX, plaques …TCB · DRV-00X.

// ════════════════════════════════════════════════════════════
// Atoms
// ════════════════════════════════════════════════════════════
function CgChev({ size = 20, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CgArrow({ size = 16, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CgToConfirm({ children = 'À CONFIRMER' }) {
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

function CgSectionLabel({ t, children, right }) {
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

// ─── Status chip = COULEUR + FORME + LIBELLÉ (jamais couleur seule) ──
// À charger      = carré navy (camion vide, en attente)
// En chargement  = sablier teal (en cours)
// En transit     = losange teal (en mouvement)
// À livrer       = triangle teal (pointe → site)
// Livré          = cercle teal (clos / OK)
// Anomalie       = croix rouge dans carré (bloqué)
function CgStatusShape({ kind, color, size = 12 }) {
  const fill = color;
  switch (kind) {
    case 'a-charger':
      return <span style={{ width: size, height: size, border: `2px solid ${fill}`, borderRadius: 2, display: 'inline-block', flexShrink: 0 }}/>;
    case 'en-chargement':
      return (
        <svg width={size + 2} height={size + 2} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <path d="M3 2h8M3 12h8M4 2v2l3 3-3 3v2M10 2v2l-3 3 3 3v2" stroke={fill} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'en-transit':
      return (
        <svg width={size + 2} height={size + 2} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <path d="M7 1l6 6-6 6-6-6 6-6z" fill={fill}/>
        </svg>
      );
    case 'a-livrer':
      return (
        <svg width={size + 2} height={size + 2} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <path d="M2 2l10 5-10 5V2z" fill={fill}/>
        </svg>
      );
    case 'livre':
      return <span style={{ width: size, height: size, background: fill, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}/>;
    case 'anomalie':
      return (
        <svg width={size + 2} height={size + 2} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <rect x="1" y="1" width="12" height="12" rx="1.5" fill={fill}/>
          <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
  }
}

const STATUS_CONFIG = {
  'a-charger':    { color: D82.cream,   onDarkColor: '#9CB3D1', label: 'À CHARGER',     softOnDark: 'rgba(156,179,209,0.16)', softOnLight: 'rgba(11,37,64,0.08)' },
  'en-chargement':{ color: D82.teal,    onDarkColor: '#3EAA9B', label: 'EN CHARGEMENT', softOnDark: 'rgba(62,170,155,0.18)',  softOnLight: 'rgba(26,142,126,0.12)' },
  'en-transit':   { color: D82.teal,    onDarkColor: '#3EAA9B', label: 'EN TRANSIT',    softOnDark: 'rgba(62,170,155,0.18)',  softOnLight: 'rgba(26,142,126,0.12)' },
  'a-livrer':     { color: D82.teal,    onDarkColor: '#3EAA9B', label: 'À LIVRER',      softOnDark: 'rgba(62,170,155,0.18)',  softOnLight: 'rgba(26,142,126,0.12)' },
  'livre':        { color: D82.teal,    onDarkColor: '#3EAA9B', label: 'LIVRÉ',         softOnDark: 'rgba(62,170,155,0.22)',  softOnLight: 'rgba(26,142,126,0.16)' },
  'anomalie':     { color: D82.red,     onDarkColor: '#E96A47', label: 'ANOMALIE',      softOnDark: 'rgba(233,106,71,0.20)',  softOnLight: 'rgba(184,66,30,0.14)' },
};

function CgStatusChip({ t, kind, size = 'md' }) {
  const cfg = STATUS_CONFIG[kind];
  const color = t.mode === 'dark' ? cfg.onDarkColor : cfg.color;
  const bg = t.mode === 'dark' ? cfg.softOnDark : cfg.softOnLight;
  const py = size === 'sm' ? 3 : 5;
  const px = size === 'sm' ? 7 : 9;
  const fs = size === 'sm' ? 10 : 11;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: `${py}px ${px}px`,
      background: bg, border: `1px solid ${color}55`,
      borderRadius: 6,
      fontFamily: D82.ui, fontSize: fs, fontWeight: 800, color,
      letterSpacing: 1, whiteSpace: 'nowrap',
    }}>
      <CgStatusShape kind={kind} color={color} size={size === 'sm' ? 10 : 12}/>
      {cfg.label}
    </div>
  );
}

// ─── Severity chips (anomalies) ────────────────────────────
const SEV_CONFIG = {
  mineure: { color: D82.ok,     onDark: '#3EAA9B', shape: 'circle', label: 'Mineure' },
  majeure: { color: D82.orange, onDark: '#E2A55C', shape: 'tri',    label: 'Majeure' },
  critique:{ color: D82.red,    onDark: '#E96A47', shape: 'sq',     label: 'Critique' },
};
function CgSeverityChip({ t, kind, selected }) {
  const cfg = SEV_CONFIG[kind];
  const c = t.mode === 'dark' ? cfg.onDark : cfg.color;
  return (
    <button style={{
      flex: 1, minHeight: 72, padding: '10px 6px',
      background: selected ? c : t.surface,
      border: `2px solid ${selected ? c : t.line}`,
      borderRadius: 12, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
      color: selected ? '#fff' : t.text, fontFamily: D82.ui,
    }}>
      {cfg.shape === 'circle' && <span style={{ width: 18, height: 18, borderRadius: '50%', background: selected ? '#fff' : c }}/>}
      {cfg.shape === 'tri' && (
        <svg width="20" height="18" viewBox="0 0 20 18"><path d="M10 1l9 16H1L10 1z" fill={selected ? '#fff' : c}/></svg>
      )}
      {cfg.shape === 'sq' && <span style={{ width: 18, height: 18, background: selected ? '#fff' : c, borderRadius: 2 }}/>}
      <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.3 }}>{cfg.label}</span>
    </button>
  );
}

// ─── Filter pill (Missions header) ─────────────────────────
function CgFilterPill({ t, label, count, active, kind }) {
  const cfg = kind ? STATUS_CONFIG[kind] : null;
  const accent = cfg ? (t.mode === 'dark' ? cfg.onDarkColor : cfg.color) : t.text;
  return (
    <button style={{
      flex: '0 0 auto',
      padding: '8px 12px',
      background: active
        ? (t.mode === 'dark' ? 'rgba(255,255,255,0.10)' : '#0B2540')
        : (t.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#FFF'),
      border: `1.5px solid ${active
        ? (t.mode === 'dark' ? '#3EAA9B' : '#0B2540')
        : (t.mode === 'dark' ? '#1E3E66' : t.line)}`,
      color: active ? (t.mode === 'dark' ? '#fff' : '#fff') : t.text,
      borderRadius: 8, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: D82.ui, fontSize: 13, fontWeight: 700,
    }}>
      {kind && <CgStatusShape kind={kind} color={active && t.mode === 'light' ? '#fff' : accent} size={11}/>}
      <span>{label}</span>
      <span style={{
        fontFamily: D82.mono, fontSize: 12, fontWeight: 700,
        color: active ? (t.mode === 'dark' ? '#9CD4C9' : '#9CD4C9') : t.text3,
      }}>{count}</span>
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// 1 · MISSIONS — liste filtrable
// ════════════════════════════════════════════════════════════
const MISSIONS = [
  {
    code: 'MIS-2026-0421', status: 'a-charger',
    truck: 'CT-007', plate: '4271 TCB', model: 'SCHACMAN F3000 6×4',
    driver: 'DRV-007',
    material: 'Granite', grade: '', tonnage: 30,
    from: 'COLAS · Ivondro', to: 'Port Toamasina · PDP',
    eta: '11:20',
  },
  {
    code: 'MIS-2026-0422', status: 'en-chargement',
    truck: 'CT-011', plate: '5602 TCB', model: 'SCHACMAN F3000 6×4',
    driver: 'DRV-011',
    material: 'Chrome APC', grade: 'Lumpy', tonnage: 22,
    from: 'Moramanga · dépôt', to: 'APC Andriamena · RN44',
    eta: '14:05',
  },
  {
    code: 'MIS-2026-0418', status: 'en-transit',
    truck: 'CT-005', plate: '2945 TCB', model: 'SCHACMAN F3000 6×4',
    driver: 'DRV-005',
    material: 'Granite', grade: '', tonnage: 30,
    from: 'COLAS · Ivondro', to: 'Port Toamasina · MOCCO',
    eta: '10:40',
  },
  {
    code: 'MIS-2026-0417', status: 'a-livrer',
    truck: 'CT-003', plate: '1827 TCB', model: 'SCHACMAN F3000 6×4',
    driver: 'DRV-003',
    material: 'Chrome APC', grade: 'Concentrate', tonnage: 22,
    from: 'Moramanga · dépôt', to: 'APC Andriamena · RN44',
    eta: '09:55',
  },
  {
    code: 'MIS-2026-0415', status: 'anomalie',
    truck: 'CT-015', plate: '6118 TCB', model: 'KERAX',
    driver: 'DRV-015',
    material: 'Granite', grade: '', tonnage: 30,
    from: 'COLAS · Ivondro', to: 'Port Toamasina · C4',
    eta: '—',
    flag: 'Bâche déchirée · photo terrain',
  },
];

function CgMissionCard({ t, m }) {
  return (
    <button style={{
      width: '100%', background: t.surface,
      border: `1.5px solid ${t.line}`,
      borderRadius: 12, padding: '12px 14px',
      cursor: 'pointer', textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 10,
      fontFamily: D82.ui,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontFamily: D82.mono, fontSize: 12, fontWeight: 700,
          color: t.text3, letterSpacing: 0.5,
        }}>{m.code}</span>
        <CgStatusChip t={t} kind={m.status} size="sm"/>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, color: t.text3,
            letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 2,
          }}>Origine</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text, lineHeight: 1.25 }}>{m.from}</div>
        </div>
        <div style={{
          flexShrink: 0, color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          marginTop: 14,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div style={{
            fontSize: 10, fontWeight: 800, color: t.text3,
            letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 2,
          }}>Destination</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text, lineHeight: 1.25 }}>{m.to}</div>
        </div>
      </div>

      {/* Material + tonnage band */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 10px', borderRadius: 8,
        background: t.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#FBF7EC',
        border: `1px solid ${t.lineSoft}`,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>
            {m.material}{m.grade && <span style={{ color: t.text3, fontWeight: 600 }}> · {m.grade}</span>}
          </div>
          <div style={{
            fontSize: 11, color: t.text3, marginTop: 1, fontWeight: 600,
          }}>{m.model}</div>
        </div>
        <div style={{
          fontFamily: D82.mono, fontSize: 22, fontWeight: 700,
          color: t.text, letterSpacing: 0.4,
          display: 'flex', alignItems: 'baseline', gap: 3,
        }}>
          {m.tonnage}<span style={{ fontSize: 13, color: t.text3, fontWeight: 600 }}>T</span>
        </div>
      </div>

      {/* Truck + driver footer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: D82.mono, fontSize: 12, color: t.text2, fontWeight: 600,
      }}>
        <span>{m.truck}</span>
        <span style={{ color: t.text4 }}>·</span>
        <span>{m.plate}</span>
        <span style={{ color: t.text4 }}>·</span>
        <span>{m.driver}</span>
        <span style={{ flex: 1 }}/>
        <span style={{ fontSize: 11, color: t.text3 }}>ETA {m.eta}</span>
      </div>

      {m.flag && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', borderRadius: 6,
          background: t.mode === 'dark' ? 'rgba(184,66,30,0.18)' : 'rgba(184,66,30,0.10)',
          border: `1px solid ${t.mode === 'dark' ? 'rgba(233,106,71,0.45)' : 'rgba(184,66,30,0.40)'}`,
          fontSize: 12, fontWeight: 600,
          color: t.mode === 'dark' ? '#F0A88A' : D82.red,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 4l9 16H3L12 4z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M12 10v4M12 17v.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
          </svg>
          {m.flag}
        </div>
      )}
    </button>
  );
}

function CgScreenMissions({ t, filter = 'tous' }) {
  const filtered = filter === 'tous' ? MISSIONS : MISSIONS.filter(m => {
    if (filter === 'a-charger')   return m.status === 'a-charger';
    if (filter === 'en-transit')  return m.status === 'en-chargement' || m.status === 'en-transit';
    if (filter === 'a-livrer')    return m.status === 'a-livrer';
    if (filter === 'anomalies')   return m.status === 'anomalie';
    return true;
  });

  const count = (kind) => MISSIONS.filter(m => kind === 'tous' ? true
    : kind === 'a-charger' ? m.status === 'a-charger'
    : kind === 'en-transit' ? (m.status === 'en-chargement' || m.status === 'en-transit')
    : kind === 'a-livrer' ? m.status === 'a-livrer'
    : kind === 'anomalies' ? m.status === 'anomalie' : false).length;

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {/* Filter rail */}
      <div style={{
        display: 'flex', gap: 8, padding: '14px 14px 10px',
        overflowX: 'auto', flexWrap: 'nowrap',
      }}>
        <CgFilterPill t={t} label="Tous"        count={count('tous')}        active={filter === 'tous'}/>
        <CgFilterPill t={t} label="À charger"   count={count('a-charger')}   active={filter === 'a-charger'} kind="a-charger"/>
        <CgFilterPill t={t} label="En transit"  count={count('en-transit')}  active={filter === 'en-transit'} kind="en-transit"/>
        <CgFilterPill t={t} label="À livrer"    count={count('a-livrer')}    active={filter === 'a-livrer'} kind="a-livrer"/>
        <CgFilterPill t={t} label="Anomalies"   count={count('anomalies')}   active={filter === 'anomalies'} kind="anomalie"/>
      </div>

      <CgSectionLabel t={t} right={`${filtered.length} / ${MISSIONS.length}`}>
        Missions du jour · 25.05
      </CgSectionLabel>

      <div style={{ padding: '0 14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(m => <CgMissionCard key={m.code} t={t} m={m}/>)}
      </div>
    </div>
  );
}

// Empty state
function CgScreenMissionsEmpty({ t }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 36px', textAlign: 'center', gap: 14,
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: 18,
        background: t.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#FFF',
        border: `1.5px dashed ${t.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.text3,
      }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="9" width="11" height="9" rx="1" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M14 12h4l3 3v3h-7M7 18v1.5M17 18v1.5" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="7" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.8"/>
          <circle cx="17" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: -0.3 }}>
        Aucune mission
      </div>
      <div style={{ fontSize: 14, color: t.text3, lineHeight: 1.5, maxWidth: 260 }}>
        Aucune mission ne vous est assignée pour le 25.05.
        Les nouvelles missions arriveront ici dès attribution par le superviseur.
      </div>
      <div style={{ marginTop: 8 }}>
        <button style={{
          height: 48, padding: '0 18px',
          background: 'transparent',
          border: `2px solid ${t.mode === 'dark' ? '#F5F1E8' : '#0B2540'}`,
          color: t.text, borderRadius: 10,
          fontFamily: D82.ui, fontSize: 14, fontWeight: 700, letterSpacing: 0.4,
          textTransform: 'uppercase', cursor: 'pointer',
        }}>Actualiser</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2 · CHARGEMENT — démarrage + numpad + photo
// ════════════════════════════════════════════════════════════

function CgMissionStrip({ t, m, sub }) {
  return (
    <div style={{
      margin: '14px 14px 0',
      padding: '12px 14px',
      background: t.surface, border: `1.5px solid ${t.line}`,
      borderRadius: 12,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: D82.mono, fontSize: 12, fontWeight: 700, color: t.text3, letterSpacing: 0.5 }}>{m.code}</span>
        <span style={{ flex: 1 }}/>
        <CgStatusChip t={t} kind={m.status} size="sm"/>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: t.text, letterSpacing: -0.2 }}>
          {m.material}{m.grade && <span style={{ color: t.text2, fontWeight: 600 }}> · {m.grade}</span>}
        </span>
        <span style={{ flex: 1 }}/>
        <span style={{ fontFamily: D82.mono, fontSize: 18, fontWeight: 700, color: t.text }}>
          {m.tonnage}<span style={{ fontSize: 12, color: t.text3, fontWeight: 600 }}>T prévu</span>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: t.text2 }}>
        <span style={{ fontWeight: 600 }}>{m.from}</span>
        <CgArrow size={14} color={t.mode === 'dark' ? '#3EAA9B' : D82.teal}/>
        <span style={{ fontWeight: 600 }}>{m.to}</span>
      </div>
      <div style={{
        display: 'flex', gap: 10, fontFamily: D82.mono, fontSize: 12, color: t.text3, fontWeight: 600,
        paddingTop: 4, borderTop: `1px dashed ${t.lineSoft}`,
      }}>
        <span>{m.truck}</span><span style={{ color: t.text4 }}>·</span>
        <span>{m.plate}</span><span style={{ color: t.text4 }}>·</span>
        <span>{m.driver}</span>
        {sub && <><span style={{ flex: 1 }}/><span>{sub}</span></>}
      </div>
    </div>
  );
}

function CgScreenChargementStart({ t }) {
  const m = MISSIONS[1]; // en-chargement
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <CgSectionLabel t={t}>Mission active · à charger</CgSectionLabel>
      <CgMissionStrip t={t} m={{ ...m, status: 'a-charger' }}/>

      <div style={{ padding: '18px 14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: t.text3,
          letterSpacing: 1.3, textTransform: 'uppercase', padding: '4px 4px',
        }}>Étapes chargement</div>

        {[
          { n: 1, label: 'Vérifier camion + chauffeur', done: true },
          { n: 2, label: 'Saisir tonnage chargé',       done: false, active: true },
          { n: 3, label: 'Photo preuve · benne pleine', done: false },
          { n: 4, label: 'Envoyer · bascule signée',    done: false },
        ].map(s => (
          <div key={s.n} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px',
            background: s.active
              ? (t.mode === 'dark' ? 'rgba(26,142,126,0.14)' : 'rgba(26,142,126,0.10)')
              : t.surface,
            border: `1.5px solid ${s.active ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal) : t.line}`,
            borderRadius: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: s.done ? D82.teal : (s.active ? 'transparent' : 'transparent'),
              border: s.done ? 'none' : `2px solid ${s.active ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal) : t.text4}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: s.done ? '#fff' : (s.active ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal) : t.text4),
              fontFamily: D82.mono, fontSize: 13, fontWeight: 800,
              flexShrink: 0,
            }}>
              {s.done ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : String(s.n).padStart(2, '0')}
            </div>
            <span style={{
              fontSize: 15, fontWeight: s.active ? 800 : 600,
              color: s.active ? t.text : (s.done ? t.text2 : t.text3),
            }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tonnage numpad ──────────────────────────────
function CgKey({ t, value, label, onTap, kind = 'num' }) {
  const isAction = kind !== 'num';
  return (
    <button style={{
      flex: 1, height: 64,
      background: isAction
        ? (t.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F5F1E8')
        : t.surface,
      border: `1.5px solid ${t.line}`,
      borderRadius: 12, cursor: 'pointer',
      fontFamily: D82.mono, fontSize: 26, fontWeight: 700,
      color: kind === 'back' ? D82.orange : t.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {label || value}
    </button>
  );
}

function CgScreenChargementTonnage({ t, value = '30.12' }) {
  const m = MISSIONS[1];
  const prevu = m.tonnage;
  const real = parseFloat(value);
  const ecart = (real - prevu).toFixed(2);
  const ecartNum = parseFloat(ecart);
  const tol = 0.5; // ±0.5T À CONFIRMER
  const inTol = Math.abs(ecartNum) <= tol;
  const ecartColor = inTol ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal)
    : Math.abs(ecartNum) > tol * 2 ? D82.red : D82.orange;

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Recap mission */}
      <div style={{
        margin: '14px 14px 0', padding: '10px 12px',
        background: t.surface, border: `1.5px solid ${t.line}`, borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>
            {m.material} · {m.grade}
          </div>
          <div style={{ fontSize: 11, color: t.text3, fontFamily: D82.mono, marginTop: 1 }}>
            {m.code} · {m.truck} · {m.plate}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: t.text3, letterSpacing: 1.3, textTransform: 'uppercase' }}>Prévu</div>
          <div style={{ fontFamily: D82.mono, fontSize: 20, fontWeight: 700, color: t.text }}>
            {prevu}<span style={{ fontSize: 12, color: t.text3 }}>T</span>
          </div>
        </div>
      </div>

      {/* Giant tonnage display */}
      <div style={{
        margin: '16px 14px 0', padding: '20px 18px 16px',
        background: t.mode === 'dark' ? 'rgba(26,142,126,0.10)' : '#FFFFFF',
        border: `2px solid ${t.mode === 'dark' ? '#3EAA9B55' : D82.teal}`,
        borderRadius: 14, position: 'relative',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          letterSpacing: 1.6, textTransform: 'uppercase',
        }}>Tonnage chargé · réel</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'center',
          marginTop: 4, gap: 4,
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
            fontFamily: D82.mono, fontSize: 22, fontWeight: 700,
            color: t.text2, marginLeft: 6,
          }}>T</span>
        </div>

        {/* Écart line */}
        <div style={{
          marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${t.lineSoft}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: t.text3, letterSpacing: 1.3, textTransform: 'uppercase' }}>
            Écart prévu / réel
          </span>
          <span style={{
            fontFamily: D82.mono, fontSize: 18, fontWeight: 700,
            color: ecartColor, letterSpacing: 0.3,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {inTol && <span style={{ width: 10, height: 10, borderRadius: '50%', background: ecartColor }}/>}
            {!inTol && <svg width="12" height="11" viewBox="0 0 12 11"><path d="M6 0l6 10H0L6 0z" fill={ecartColor}/></svg>}
            {ecartNum >= 0 ? '+' : ''}{ecart} T · {inTol ? 'DANS TOLÉRANCE' : 'HORS TOLÉRANCE'}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }}/>

      {/* Numpad */}
      <div style={{ padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <CgKey t={t} label="1"/><CgKey t={t} label="2"/><CgKey t={t} label="3"/>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <CgKey t={t} label="4"/><CgKey t={t} label="5"/><CgKey t={t} label="6"/>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <CgKey t={t} label="7"/><CgKey t={t} label="8"/><CgKey t={t} label="9"/>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <CgKey t={t} label="." kind="action"/>
          <CgKey t={t} label="0"/>
          <CgKey t={t} kind="back" label={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 5H10l-7 7 7 7h11a1 1 0 001-1V6a1 1 0 00-1-1z" stroke={D82.orange} strokeWidth="2" strokeLinejoin="round"/>
              <path d="M14 9l4 6M18 9l-4 6" stroke={D82.orange} strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          }/>
        </div>
      </div>
    </div>
  );
}

// ─── Chargement · photo preuve ──────────────────
function CgScreenChargementPhoto({ t }) {
  const m = MISSIONS[1];
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <CgMissionStrip t={t} m={{ ...m, status: 'en-chargement' }}
        sub={<span style={{ color: t.mode === 'dark' ? '#3EAA9B' : D82.teal }}>30,12T saisis</span>}/>

      <div style={{ padding: '16px 14px 0' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: t.text3,
          letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8,
        }}>Photo preuve · benne pleine</div>

        {/* Viewfinder placeholder */}
        <div style={{
          position: 'relative', borderRadius: 14, overflow: 'hidden',
          height: 270, background: '#0E1419',
          border: `1.5px solid ${t.line}`,
        }}>
          {/* Diagonal stripes */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 14px, transparent 14px 28px)',
          }}/>
          {/* Frame brackets */}
          {[
            { top: 14, left: 14, br: '0 0 0 0', tl: true },
            { top: 14, right: 14, tr: true },
            { bottom: 14, left: 14, bl: true },
            { bottom: 14, right: 14, br: true },
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute', top: p.top, left: p.left, right: p.right, bottom: p.bottom,
              width: 28, height: 28,
              borderTop: p.tl || p.tr ? `3px solid #3EAA9B` : 'none',
              borderBottom: p.bl || p.br ? `3px solid #3EAA9B` : 'none',
              borderLeft: p.tl || p.bl ? `3px solid #3EAA9B` : 'none',
              borderRight: p.tr || p.br ? `3px solid #3EAA9B` : 'none',
            }}/>
          ))}
          {/* Center reticle */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#3EAA9B', fontFamily: D82.mono, fontSize: 11, fontWeight: 700,
            letterSpacing: 1.5, textAlign: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="#3EAA9B" strokeWidth="1.8"/>
                <circle cx="12" cy="13.5" r="3.6" stroke="#3EAA9B" strokeWidth="1.8"/>
                <path d="M8 7l1.5-3h5L16 7" stroke="#3EAA9B" strokeWidth="1.8"/>
              </svg>
              <span>VISER LA BENNE PLEINE</span>
            </div>
          </div>
          {/* Bottom metadata */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '10px 14px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: D82.mono, fontSize: 11, fontWeight: 600, color: '#F5F1E8',
          }}>
            <span>COLAS · IVONDRO</span>
            <span>−18.1234, 49.4011</span>
            <span>07:42</span>
          </div>
        </div>

        {/* Big shutter */}
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
          Le scan plaque <span style={{ fontFamily: D82.mono, color: t.text2 }}>{m.plate}</span> sera attaché à la photo.
        </div>
      </div>
    </div>
  );
}

// ─── Chargement · success ─────────────────────
function CgScreenChargementSuccess({ t }) {
  const m = MISSIONS[1];
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        margin: '30px 14px 0',
        padding: '28px 22px',
        background: t.mode === 'dark' ? 'rgba(26,142,126,0.16)' : '#fff',
        border: `2px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
        borderRadius: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: t.tealShadow,
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.text, letterSpacing: -0.3, textAlign: 'center' }}>
          Chargement enregistré
        </div>
        <div style={{
          fontFamily: D82.mono, fontSize: 13, color: t.text3,
          letterSpacing: 0.4,
        }}>
          {m.code} · 30,12 T · 07:42
        </div>
      </div>

      <div style={{ padding: '18px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { k: 'Matériau',  v: `${m.material} · ${m.grade}` },
          { k: 'Camion',    v: `${m.truck} · ${m.plate}` },
          { k: 'Chauffeur', v: m.driver },
          { k: 'Origine',   v: m.from },
          { k: 'Vers',      v: m.to },
          { k: 'Tonnage',   v: '30,12 T (prévu 22 T · +8,12 T)', warn: true },
          { k: 'Photo',     v: '1 fichier · 1.8 Mo · file offline' },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', gap: 12,
            padding: '8px 4px', borderBottom: `1px dashed ${t.lineSoft}`,
            fontSize: 14,
          }}>
            <span style={{ color: t.text3, fontWeight: 600 }}>{r.k}</span>
            <span style={{
              color: r.warn ? D82.orange : t.text, fontWeight: 700,
              fontFamily: /[\d,.]/.test(r.v) ? D82.mono : D82.ui,
              textAlign: 'right',
            }}>{r.v}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 14px 0' }}>
        <div style={{
          padding: '10px 12px', borderRadius: 8,
          background: t.mode === 'dark' ? 'rgba(199,126,42,0.16)' : 'rgba(199,126,42,0.10)',
          border: `1px solid ${D82.orange}55`,
          fontSize: 12.5, color: t.mode === 'dark' ? '#E2A55C' : '#8A5A1F',
          display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M12 4l9 16H3L12 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 10v4M12 17v.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
          <span><b>+8,12 T au-dessus du prévu</b> — anomalie tonnage créée automatiquement (TER notifié).</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3 · LIVRAISON — stepper + vérif poids + signature
// ════════════════════════════════════════════════════════════

const DELIVERY_STEPS = [
  { id: 1, label: 'Arrivé site',          short: 'Arrivée',     desc: 'GPS confirmé · pesée pont 1' },
  { id: 2, label: 'Déchargement démarré', short: 'Déchargement', desc: 'Benne ouverte · témoin client' },
  { id: 3, label: 'Terminé',              short: 'Terminé',     desc: 'Benne vide · pesée pont 2' },
  { id: 4, label: 'Livraison confirmée',  short: 'Confirmée',   desc: 'Signature TER + client' },
];

function CgScreenLivraisonStepper({ t, currentStep = 2 }) {
  const m = MISSIONS[3]; // a-livrer
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <CgMissionStrip t={t} m={m}/>

      <CgSectionLabel t={t} right={`Étape ${currentStep} / 4`}>
        Progression livraison
      </CgSectionLabel>

      <div style={{ padding: '0 14px 16px', position: 'relative' }}>
        {DELIVERY_STEPS.map((s, i) => {
          const done = s.id < currentStep;
          const active = s.id === currentStep;
          const upcoming = s.id > currentStep;
          const dotColor = done ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal)
                         : active ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal)
                         : t.text4;
          const cardBg = active
            ? (t.mode === 'dark' ? 'rgba(26,142,126,0.18)' : 'rgba(26,142,126,0.10)')
            : t.surface;
          const border = active
            ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal)
            : (done ? `${t.mode === 'dark' ? '#3EAA9B' : D82.teal}55` : t.line);

          return (
            <div key={s.id} style={{ display: 'flex', gap: 14, alignItems: 'stretch', minHeight: 80 }}>
              {/* Rail */}
              <div style={{
                width: 36, display: 'flex', flexDirection: 'column',
                alignItems: 'center', flexShrink: 0, position: 'relative',
              }}>
                {/* Line above */}
                {i > 0 && (
                  <div style={{
                    position: 'absolute', top: 0, bottom: '50%',
                    width: 3, background: done || active ? dotColor : t.line,
                  }}/>
                )}
                {/* Line below */}
                {i < DELIVERY_STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: '50%', bottom: 0,
                    width: 3, background: done ? dotColor : t.line,
                  }}/>
                )}
                {/* Dot */}
                <div style={{
                  position: 'relative', zIndex: 1,
                  width: active ? 44 : 32, height: active ? 44 : 32,
                  borderRadius: '50%',
                  background: done || active ? dotColor : 'transparent',
                  border: upcoming ? `2.5px solid ${t.text4}` : 'none',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: D82.mono, fontSize: active ? 16 : 13, fontWeight: 800,
                  alignSelf: 'center',
                  boxShadow: active ? `0 0 0 6px ${t.mode === 'dark' ? 'rgba(62,170,155,0.20)' : 'rgba(26,142,126,0.18)'}` : 'none',
                }}>
                  {done ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{ color: upcoming ? t.text4 : '#fff' }}>{String(s.id).padStart(2, '0')}</span>
                  )}
                </div>
              </div>

              {/* Card */}
              <div style={{
                flex: 1, padding: active ? '14px 14px' : '12px 12px',
                background: cardBg,
                border: `${active ? 2 : 1.5}px solid ${border}`,
                borderRadius: 12, margin: '6px 0',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontSize: active ? 17 : 15, fontWeight: 800,
                    color: upcoming ? t.text3 : t.text, letterSpacing: -0.2,
                  }}>{s.label}</span>
                  {active && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: 1.3,
                      padding: '2px 6px', borderRadius: 3,
                      color: '#fff',
                      background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
                    }}>EN COURS</span>
                  )}
                  {done && (
                    <span style={{
                      fontSize: 11, fontFamily: D82.mono,
                      color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
                    }}>· 09:12</span>
                  )}
                </div>
                <div style={{
                  fontSize: 13, color: upcoming ? t.text4 : t.text2, fontWeight: 500, lineHeight: 1.4,
                }}>{s.desc}</div>
                {active && (
                  <div style={{
                    marginTop: 8, padding: '8px 10px', borderRadius: 8,
                    background: t.mode === 'dark' ? 'rgba(0,0,0,0.20)' : '#FFF',
                    border: `1px solid ${t.line}`,
                    fontSize: 12, color: t.text2, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
                      boxShadow: `0 0 0 4px ${t.mode === 'dark' ? 'rgba(62,170,155,0.30)' : 'rgba(26,142,126,0.18)'}` }}/>
                    Témoin client présent · APC <CgToConfirm>NOM RESP. APC</CgToConfirm>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Livraison · vérification poids (ÉCART) ────
function CgEcartCard({ t, prevu, real, tolPct = 2 }) {
  const ecart = (real - prevu).toFixed(2);
  const ecartNum = parseFloat(ecart);
  const ecartPct = (ecartNum / prevu * 100).toFixed(1);
  const absPct = Math.abs(parseFloat(ecartPct));
  const inTol = absPct <= tolPct;
  const hors = absPct > tolPct * 2;
  const color = inTol ? D82.ok : hors ? D82.red : D82.orange;
  const colorDark = inTol ? '#3EAA9B' : hors ? '#E96A47' : '#E2A55C';
  const c = t.mode === 'dark' ? colorDark : color;

  return (
    <div style={{
      margin: '14px 14px 0',
      borderRadius: 16, overflow: 'hidden',
      border: `2px solid ${c}`,
      background: t.mode === 'dark' ? 'rgba(0,0,0,0.25)' : '#fff',
    }}>
      {/* Header band */}
      <div style={{
        padding: '8px 14px', background: c, color: '#fff',
        fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {inTol && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff' }}/>}
          {!inTol && !hors && <svg width="14" height="13" viewBox="0 0 14 13"><path d="M7 0l7 12H0L7 0z" fill="#fff"/></svg>}
          {hors && <span style={{ width: 12, height: 12, background: '#fff', borderRadius: 2 }}/>}
          Écart prévu / réel
        </span>
        <span style={{ fontFamily: D82.mono, letterSpacing: 0.5 }}>
          {inTol ? `Tol. ±${tolPct}%` : hors ? 'Critique' : 'Alerte'}
        </span>
      </div>

      <div style={{ padding: '18px 18px 16px' }}>
        {/* Comparison row */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: t.text3, letterSpacing: 1.3, textTransform: 'uppercase' }}>Prévu</div>
            <div style={{ fontFamily: D82.mono, fontSize: 26, fontWeight: 700, color: t.text2, lineHeight: 1.05 }}>
              {prevu.toFixed(2)}<span style={{ fontSize: 13, color: t.text3 }}>T</span>
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: t.text3, letterSpacing: 1.3, textTransform: 'uppercase' }}>Réel · pesée site</div>
            <div style={{ fontFamily: D82.mono, fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1.05 }}>
              {real.toFixed(2)}<span style={{ fontSize: 13, color: t.text3 }}>T</span>
            </div>
          </div>
        </div>

        {/* Big écart */}
        <div style={{
          marginTop: 14, padding: '14px 16px',
          background: t.mode === 'dark' ? `${c}22` : `${color}10`,
          borderRadius: 12,
          display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6,
        }}>
          <span style={{
            fontFamily: D82.mono, fontSize: 56, fontWeight: 700,
            color: c, letterSpacing: -1.5, lineHeight: 1,
          }}>
            {ecartNum >= 0 ? '+' : ''}{ecart}
          </span>
          <span style={{ fontFamily: D82.mono, fontSize: 20, fontWeight: 700, color: c }}>T</span>
          <span style={{
            fontFamily: D82.mono, fontSize: 18, fontWeight: 700, color: t.text3,
            marginLeft: 8,
          }}>({ecartNum >= 0 ? '+' : ''}{ecartPct}%)</span>
        </div>

        {/* Verdict */}
        <div style={{
          marginTop: 12, padding: '10px 12px', borderRadius: 8,
          background: t.mode === 'dark' ? 'rgba(0,0,0,0.25)' : '#FBF7EC',
          border: `1px solid ${t.line}`,
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 13, fontWeight: 600, color: t.text,
        }}>
          {inTol ? (
            <>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>Dans tolérance ±{tolPct}%. Livraison conforme — signature autorisée.</span>
            </>
          ) : hors ? (
            <>
              <span style={{ width: 22, height: 22, borderRadius: 4, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ width: 12, height: 12, background: '#fff' }}/>
              </span>
              <span><b>HORS TOLÉRANCE</b> — anomalie tonnage obligatoire avant signature. TER alerté.</span>
            </>
          ) : (
            <>
              <span style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="20" viewBox="0 0 22 20"><path d="M11 1l10 18H1L11 1z" fill={c}/></svg>
              </span>
              <span><b>Au-dessus tolérance</b> — anomalie tonnage suggérée · superviseur informé.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CgScreenLivraisonEcart({ t, kind = 'in' }) {
  const m = MISSIONS[3];
  const prevu = m.tonnage; // 22
  const real = kind === 'in' ? 21.86 : kind === 'warn' ? 22.78 : 24.40;
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <CgMissionStrip t={t} m={m}/>

      <CgSectionLabel t={t} right="Pont 2 · sortie">
        Vérification poids · pesée site
      </CgSectionLabel>

      <CgEcartCard t={t} prevu={prevu} real={real}/>

      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: t.text3,
          letterSpacing: 1.3, textTransform: 'uppercase', padding: '4px 4px',
        }}>Détail pesée</div>
        {[
          { k: 'Pont 1 · entrée',   v: '38,40 T', sub: '07:42 · COLAS Ivondro' },
          { k: 'Pont 2 · sortie',   v: `${real.toFixed(2)} T`, sub: '10:18 · APC Andriamena' },
          { k: 'Tare camion',       v: '16,40 T', sub: 'CT-003 · SCHACMAN F3000 6×4' },
        ].map((r, i) => (
          <div key={i} style={{
            padding: '8px 12px', borderRadius: 8,
            background: t.surface, border: `1px solid ${t.line}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{r.k}</div>
              <div style={{ fontSize: 11, color: t.text3, fontFamily: D82.mono, marginTop: 1 }}>{r.sub}</div>
            </div>
            <div style={{ fontFamily: D82.mono, fontSize: 16, fontWeight: 700, color: t.text }}>{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Livraison · signature ──────────────────
function CgScreenLivraisonSignature({ t }) {
  const m = MISSIONS[3];
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <CgMissionStrip t={t} m={m} sub={<span style={{ color: t.mode === 'dark' ? '#3EAA9B' : D82.teal }}>21,86 T · conforme</span>}/>

      <CgSectionLabel t={t}>Signature de réception</CgSectionLabel>

      {/* Two signers */}
      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* TER */}
        <div style={{
          padding: '12px 14px',
          background: t.surface, border: `1.5px solid ${t.line}`,
          borderRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Pointeur · PL-PTR-007</span>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.3, textTransform: 'uppercase',
              color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
              padding: '2px 7px', borderRadius: 3,
              background: t.mode === 'dark' ? 'rgba(62,170,155,0.20)' : 'rgba(26,142,126,0.14)',
              border: `1px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}55`,
            }}>Signé</span>
          </div>
          <div style={{
            marginTop: 8, height: 80, borderRadius: 8,
            background: t.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#FBF7EC',
            border: `1px dashed ${t.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          }}>
            <svg width="180" height="48" viewBox="0 0 200 50" fill="none">
              <path d="M10 35 Q20 10 35 30 T70 22 Q85 40 100 18 Q120 5 140 30 T180 25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>

        {/* Client */}
        <div style={{
          padding: '12px 14px',
          background: t.surface, border: `1.5px dashed ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
          borderRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>
              Client · APC Andriamena
            </span>
            <CgToConfirm>NOM RESP. APC</CgToConfirm>
          </div>
          <div style={{
            marginTop: 8, height: 110, borderRadius: 8,
            background: t.mode === 'dark' ? 'rgba(0,0,0,0.20)' : '#fff',
            border: `1.5px dashed ${t.line}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: t.text3,
            position: 'relative',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M4 20l6-2 9-9-4-4-9 9-2 6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M14 5l4 4" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            <span style={{ fontSize: 13, marginTop: 4, fontWeight: 600 }}>Tapez ici pour signer</span>
            <div style={{
              position: 'absolute', bottom: 8, left: 16, right: 16,
              height: 1, background: t.line,
            }}/>
          </div>
          <div style={{
            marginTop: 8, display: 'flex', justifyContent: 'space-between',
            fontSize: 11, fontFamily: D82.mono, color: t.text3,
          }}>
            <span>RN44 · APC Andriamena</span>
            <span>25.05.2026 · 10:24</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Livraison success ───────────────────
function CgScreenLivraisonSuccess({ t }) {
  const m = MISSIONS[3];
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        margin: '30px 14px 0', padding: '28px 22px',
        background: t.mode === 'dark' ? 'rgba(26,142,126,0.16)' : '#fff',
        border: `2px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
        borderRadius: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: t.tealShadow,
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.text, letterSpacing: -0.3, textAlign: 'center' }}>
          Livraison confirmée
        </div>
        <div style={{ fontFamily: D82.mono, fontSize: 13, color: t.text3, letterSpacing: 0.4 }}>
          {m.code} · 21,86 T · 10:24
        </div>
        <div style={{
          marginTop: 4, padding: '6px 12px', borderRadius: 6,
          background: t.mode === 'dark' ? 'rgba(62,170,155,0.20)' : 'rgba(26,142,126,0.14)',
          border: `1px solid ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}55`,
          fontSize: 11, fontWeight: 800, letterSpacing: 1.3,
          color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.mode === 'dark' ? '#3EAA9B' : D82.teal }}/>
          ÉCART −0,14 T · DANS TOLÉRANCE
        </div>
      </div>

      <div style={{ padding: '18px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { k: 'Étapes',     v: '4 / 4 validées' },
          { k: 'Pesée pont 1', v: '38,40 T' },
          { k: 'Pesée pont 2', v: '21,86 T' },
          { k: 'Tare camion',  v: '16,40 T' },
          { k: 'Signatures',   v: 'Pointeur + client APC' },
          { k: 'Photos preuve',v: '3 fichiers · 5.2 Mo' },
          { k: 'Sync',         v: 'File offline · envoi auto' },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', gap: 12,
            padding: '8px 4px', borderBottom: `1px dashed ${t.lineSoft}`,
            fontSize: 14,
          }}>
            <span style={{ color: t.text3, fontWeight: 600 }}>{r.k}</span>
            <span style={{
              color: t.text, fontWeight: 700,
              fontFamily: /[\d,.]/.test(r.v) ? D82.mono : D82.ui,
              textAlign: 'right',
            }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4 · ANOMALIES — liste + nouvelle
// ════════════════════════════════════════════════════════════

const ANOMALIES = [
  {
    code: 'ANO-2026-0091', sev: 'critique',
    title: 'Bâche déchirée · perte matière',
    mission: 'MIS-2026-0415', truck: 'CT-015', plate: '6118 TCB',
    where: 'COLAS Ivondro · zone scale', when: '07:18',
    state: 'Ouverte',
  },
  {
    code: 'ANO-2026-0090', sev: 'majeure',
    title: 'Tonnage hors tolérance · +8,12 T',
    mission: 'MIS-2026-0422', truck: 'CT-011', plate: '5602 TCB',
    where: 'COLAS Ivondro · pont 1', when: '07:42',
    state: 'En revue',
  },
  {
    code: 'ANO-2026-0089', sev: 'mineure',
    title: 'Retard chargement · 35 min',
    mission: 'MIS-2026-0421', truck: 'CT-007', plate: '4271 TCB',
    where: 'COLAS Ivondro · file attente', when: '06:55',
    state: 'Clos',
  },
];

function CgScreenAnomalies({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {/* New anomaly hero CTA */}
      <div style={{ padding: '14px 14px 0' }}>
        <button style={{
          width: '100%', minHeight: 72,
          background: D82.red, color: '#fff', border: 0, borderRadius: 14,
          padding: '14px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
          boxShadow: '0 10px 26px rgba(184,66,30,0.45)',
          fontFamily: D82.ui,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: 'rgba(255,255,255,0.20)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.2, lineHeight: 1.15 }}>
              Déclarer une anomalie
            </div>
            <div style={{ fontSize: 12, marginTop: 3, opacity: 0.92, fontWeight: 500 }}>
              Sévérité · photo preuve · mission rattachée
            </div>
          </div>
          <CgChev size={26}/>
        </button>
      </div>

      <CgSectionLabel t={t} right={`${ANOMALIES.length} actives`}>
        Anomalies du jour
      </CgSectionLabel>

      <div style={{ padding: '0 14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ANOMALIES.map(a => {
          const sev = SEV_CONFIG[a.sev];
          const c = t.mode === 'dark' ? sev.onDark : sev.color;
          return (
            <button key={a.code} style={{
              width: '100%', background: t.surface,
              border: `1.5px solid ${t.line}`,
              borderLeft: `4px solid ${c}`,
              borderRadius: 12, padding: '12px 14px',
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 8,
              fontFamily: D82.ui,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Shape badge */}
                <div style={{
                  width: 22, height: 22, flexShrink: 0,
                  borderRadius: sev.shape === 'circle' ? '50%' : sev.shape === 'sq' ? 4 : 0,
                  background: sev.shape !== 'tri' ? c : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {sev.shape === 'tri' && <svg width="22" height="20" viewBox="0 0 22 20"><path d="M11 1l10 18H1L11 1z" fill={c}/></svg>}
                </div>
                <span style={{ fontFamily: D82.mono, fontSize: 12, fontWeight: 700, color: t.text3, letterSpacing: 0.5 }}>
                  {a.code}
                </span>
                <span style={{ flex: 1 }}/>
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: 1.3, textTransform: 'uppercase',
                  color: c, padding: '2px 7px', borderRadius: 3,
                  background: `${c}22`, border: `1px solid ${c}55`,
                }}>{sev.label} · {a.state}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: t.text, lineHeight: 1.3 }}>{a.title}</div>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 8,
                fontFamily: D82.mono, fontSize: 11.5, color: t.text2, fontWeight: 600,
              }}>
                <span>{a.mission}</span>
                <span style={{ color: t.text4 }}>·</span>
                <span>{a.truck}</span>
                <span style={{ color: t.text4 }}>·</span>
                <span>{a.plate}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 12, color: t.text3,
              }}>
                <span>{a.where}</span>
                <span style={{ fontFamily: D82.mono }}>{a.when}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// New anomaly form
function CgScreenAnomalieNouvelle({ t, sev = 'majeure' }) {
  const m = MISSIONS[1];
  const types = [
    { id: 'tonnage',  label: 'Tonnage', icon: 'scale' },
    { id: 'baches',   label: 'Bâche / charge', icon: 'tarp' },
    { id: 'pesee',    label: 'Pesée pont', icon: 'truck' },
    { id: 'retard',   label: 'Retard', icon: 'clock' },
    { id: 'route',    label: 'Route / accès', icon: 'road' },
    { id: 'autre',    label: 'Autre', icon: 'dots' },
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <CgMissionStrip t={t} m={m}/>

      <CgSectionLabel t={t}>Type d'anomalie</CgSectionLabel>
      <div style={{ padding: '0 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {types.map((tp, i) => (
          <button key={tp.id} style={{
            minHeight: 70, padding: '8px 6px',
            background: i === 0
              ? (t.mode === 'dark' ? 'rgba(26,142,126,0.18)' : 'rgba(26,142,126,0.10)')
              : t.surface,
            border: `1.5px solid ${i === 0 ? (t.mode === 'dark' ? '#3EAA9B' : D82.teal) : t.line}`,
            borderRadius: 10, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            color: t.text, fontFamily: D82.ui,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {tp.icon === 'scale' && <><path d="M12 4v16M5 8h14M5 8l-3 6h6L5 8zM19 8l-3 6h6l-3-6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>}
              {tp.icon === 'tarp' && <><path d="M3 8l4-3h10l4 3v10H3V8zM3 8h18M9 5v13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></>}
              {tp.icon === 'truck' && <><rect x="3" y="9" width="11" height="9" rx="1" stroke="currentColor" strokeWidth="1.8"/><path d="M14 12h4l3 3v3h-7" stroke="currentColor" strokeWidth="1.8"/><circle cx="7" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.8"/></>}
              {tp.icon === 'clock' && <><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>}
              {tp.icon === 'road' && <><path d="M6 3l-3 18h18L18 3M11 3v3M11 10v3M11 17v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>}
              {tp.icon === 'dots' && <><circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/></>}
            </svg>
            <span style={{ fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{tp.label}</span>
          </button>
        ))}
      </div>

      <CgSectionLabel t={t}>Sévérité · forme + couleur + libellé</CgSectionLabel>
      <div style={{ padding: '0 14px', display: 'flex', gap: 8 }}>
        <CgSeverityChip t={t} kind="mineure"  selected={sev === 'mineure'}/>
        <CgSeverityChip t={t} kind="majeure"  selected={sev === 'majeure'}/>
        <CgSeverityChip t={t} kind="critique" selected={sev === 'critique'}/>
      </div>

      <CgSectionLabel t={t}>Photo preuve · obligatoire</CgSectionLabel>
      <div style={{ padding: '0 14px 16px', display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, height: 90, borderRadius: 10, cursor: 'pointer',
          background: t.mode === 'dark' ? '#3EAA9B22' : 'rgba(26,142,126,0.10)',
          border: `2px dashed ${t.mode === 'dark' ? '#3EAA9B' : D82.teal}`,
          color: t.mode === 'dark' ? '#3EAA9B' : D82.teal,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          fontFamily: D82.ui, fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
            <circle cx="12" cy="13.5" r="3.6" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M8 7l1.5-3h5L16 7" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
          <span>PRENDRE PHOTO</span>
        </button>
        {/* Already-attached placeholder */}
        <div style={{
          flex: 1, height: 90, borderRadius: 10,
          background: '#0E1419', border: `1.5px solid ${t.line}`,
          position: 'relative', overflow: 'hidden',
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 10px, transparent 10px 20px)',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '4px 8px', background: 'rgba(0,0,0,0.6)',
            fontFamily: D82.mono, fontSize: 10, color: '#F5F1E8',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>BÂCHE.JPG</span>
            <span>1.4 Mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  CgChev, CgArrow, CgToConfirm, CgSectionLabel,
  CgStatusShape, CgStatusChip, CgSeverityChip, CgFilterPill,
  CgMissionCard, CgMissionStrip, CgEcartCard,
  CgScreenMissions, CgScreenMissionsEmpty,
  CgScreenChargementStart, CgScreenChargementTonnage,
  CgScreenChargementPhoto, CgScreenChargementSuccess,
  CgScreenLivraisonStepper, CgScreenLivraisonEcart,
  CgScreenLivraisonSignature, CgScreenLivraisonSuccess,
  CgScreenAnomalies, CgScreenAnomalieNouvelle,
  MISSIONS, ANOMALIES, DELIVERY_STEPS, STATUS_CONFIG, SEV_CONFIG,
});
