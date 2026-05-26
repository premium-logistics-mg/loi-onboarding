/* LOI · Cockpit Édienne — Resp RH & Pacte TER Pilote · Transit/Admin-Fi
   Visual-First · D82 strict · même système premium que l'ancre Tudi.
   5 onglets : Vue d'ensemble · Assistant · Scores · Carnet de bord · Profil.
   Rôle Pacte TER Pilote → P1 EN FOCUS sur la pillar bar. */

const { useState, useEffect } = React;

// ── Pillars ─────────────────────────────────────────────────────────────
// P1 EN FOCUS — rôle Pacte TER Pilote.
const PILLARS = [
  { code: 'P1', name: 'Exécution & discipline',          score: 64, status: 'warn', focus: true  },
  { code: 'P2', name: 'Cash & rentabilité',              score: 41, status: 'alert' },
  { code: 'P3', name: 'Fidélité & diversification client', score: 58, status: 'warn' },
  { code: 'P4', name: 'Fluidité & productivité',         score: 76, status: 'ok'   },
];

// SO·5 (hero) — sous-SO + données pouls RH.
// Toutes les actuelles → "À CONFIRMER" (signalé via tbc).
const SOUS_SO = [
  {
    key: 'leaders',
    label: '% leaders actifs / semaine',
    sublabel: 'Connexion + 1 action M13 sous 7j',
    actual: null, target: 90, unit: '%',
    series: [],
    invert: false,
  },
  {
    key: 'm13',
    label: '% M13 P0/P1 clôturées',
    sublabel: 'Décisions priorité haute · sous 30j',
    actual: null, target: 80, unit: '%',
    series: [],
    invert: false,
  },
  {
    key: 'rbac',
    label: 'Incidents RBAC',
    sublabel: 'Accès non conforme · 7 derniers jours',
    actual: null, target: 0, unit: '',
    series: [],
    invert: true,
  },
];

// Pouls RH (manuel, source RH hebdo)
const CLIMAT_LEVELS = ['Tendu', 'Vigilant', 'Stable', 'Bon', 'Très bon'];
const CLIMAT_CURRENT = 2; // index — "Stable" — manuel hebdo

const CONGES = {
  active: 4,           // en cours cette semaine
  total: 60,           // effectif
  list: [
    { who: 'R. Andriana',  role: 'Atelier',    from: '24 mai', to: '02 jun' },
    { who: 'S. Rakoto',    role: 'Transit',    from: '25 mai', to: '29 mai' },
    { who: 'H. Ravelo',    role: 'Compta',     from: '26 mai', to: '06 jun' },
    { who: 'F. Razafy',    role: 'Conducteur', from: '27 mai', to: '03 jun' },
  ],
};

// Aggregate tile — M13 P0/P1 à clôturer
const M13 = {
  total: 7,
  p0: 2,
  p1: 5,
  leadersInactifs: [
    { name: 'RAF',  role: 'Trésorerie',  lastSeen: 'J−11', status: 'alert' },
    { name: 'Joel', role: 'Commerce',    lastSeen: 'J−8',  status: 'alert' },
    { name: 'COO',  role: 'Opérations',  lastSeen: 'J−6',  status: 'warn'  },
  ],
  decisions: [
    { id: 'M13·D041', prio: 'P0', title: 'Refinancement marge BGFI',          owner: 'CFO',  age: 32, status: 'alert' },
    { id: 'M13·D047', prio: 'P0', title: 'Arbitrage concentration PENTA',     owner: 'Joel', age: 28, status: 'alert' },
    { id: 'M13·D039', prio: 'P1', title: 'Plan de relance DSO grands comptes', owner: 'CFO',  age: 24, status: 'warn'  },
    { id: 'M13·D044', prio: 'P1', title: 'Renouvellement contrat SCHACMAN',   owner: 'Tudi', age: 19, status: 'warn'  },
    { id: 'M13·D046', prio: 'P1', title: 'Politique avances conducteurs',     owner: 'RAF',  age: 17, status: 'warn'  },
    { id: 'M13·D049', prio: 'P1', title: 'Cadre RBAC mobile terrain',         owner: 'RH',   age: 12, status: 'ok'    },
    { id: 'M13·D051', prio: 'P1', title: 'Cycle 1:1 lieutenants — S22+',      owner: 'CEO',  age: 8,  status: 'ok'    },
  ],
};

// Carnet de bord — file actionnable
const CARNET = [
  { kind: 'conge',   sev: 'warn',  object: 'Demande de congé · H. Ravelo (Compta)',  sub: '26 mai → 06 jun · 8 jours ouvrés',  meta: 'Solde 14j', action: 'Valider',  actionKind: 'primary' },
  { kind: 'conge',   sev: 'ok',    object: 'Demande de congé · F. Razafy (Conducteur)', sub: '27 mai → 03 jun · 5 jours ouvrés', meta: 'Solde 22j', action: 'Valider',  actionKind: 'primary' },
  { kind: 'coach',   sev: 'alert', object: 'Friction terrain · équipe Transit',     sub: 'Surcharge S20 → S21 · 3 signaux convergents', meta: 'Source : M07 mobile', action: 'Traiter',  actionKind: 'primary' },
  { kind: 'escal',   sev: 'alert', object: 'Escalade RH · litige conducteur',       sub: 'F. Andry · sanction proposée niveau 2',     meta: 'Délai légal J+5', action: 'Traiter', actionKind: 'primary' },
  { kind: 'coach',   sev: 'warn',  object: 'Signal coaching · RAF (Trésorerie)',    sub: 'Score composite −7 · 1:1 demandé',          meta: 'Cascade S21', action: 'Voir', actionKind: 'ghost' },
  { kind: 'conge',   sev: 'ok',    object: 'Demande de congé · M. Ratsima (Transit)', sub: '01 jun → 05 jun · 5 jours ouvrés',        meta: 'Solde 18j', action: 'Valider', actionKind: 'primary' },
  { kind: 'escal',   sev: 'warn',  object: 'Escalade RH · arrêt maladie prolongé',  sub: 'P. Hery · 14j cumulés · médecine du travail', meta: 'À déclarer', action: 'Traiter', actionKind: 'primary' },
  { kind: 'coach',   sev: 'warn',  object: 'Friction terrain · atelier mécanique',  sub: 'Délais pièces · 2 signaux S21',             meta: 'Source : M07 mobile', action: 'Voir',     actionKind: 'ghost' },
];

// ── Sidebar ─────────────────────────────────────────────────────────────
function Sidebar({ tab, setTab }) {
  const items = [
    { key: 'overview', label: "Vue d'ensemble", icon: <Icon.Cockpit/> },
    { key: 'scores',   label: 'Scores',          icon: <Icon.Award/>   },
    { key: 'carnet',   label: 'Carnet de bord',  icon: <Icon.Book/>    },
    { key: 'profil',   label: 'Profil',          icon: <Icon.User/>    },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">LOI</div>
        <div>
          <div className="brand-name">Cockpit Édienne</div>
          <div className="brand-sub">RH · Pacte TER Pilote</div>
        </div>
      </div>

      <div className="nav-section">Pilotage</div>
      {items.map(it => (
        <div key={it.key}
             className={`nav-item ${tab === it.key ? 'active' : ''}`}
             onClick={() => setTab(it.key)}>
          <span className="nav-icon">{it.icon}</span> {it.label}
        </div>
      ))}

      <div className="persona">
        <div className="persona-avatar">ÉR</div>
        <div>
          <div className="persona-name">Édienne R.</div>
          <div className="persona-role">Lundi 25 mai 2026</div>
        </div>
      </div>
    </aside>
  );
}

// ── Topbar ──────────────────────────────────────────────────────────────
const TAB_TITLES = {
  overview: "Vue d'ensemble",
  scores:   "Scores",
  carnet:   "Carnet de bord",
  profil:   "Profil",
};

function Topbar({ tab, theme, setTheme }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div>
          <div className="h-eyebrow">Cockpit Édienne · RH · Pacte TER Pilote</div>
          <div className="h-title">{TAB_TITLES[tab]}</div>
        </div>
        <div className="h-meta" style={{ marginLeft: 20 }}>
          <span className="dot"/> <span style={{ marginLeft: 6 }}>Données fraîches · sync 06:12</span>
        </div>
      </div>
      <div className="topbar-right">
        <span className="sim-badge">Simulation · Digital Twin v3</span>
        <span className="mono" style={{ color: 'var(--ink-3)' }}>S21 · J·142/365</span>
        <div className="nav-item" style={{ padding: '6px 10px' }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Icon.Sun/> : <Icon.Moon/>}
        </div>
        <div className="nav-item" style={{ padding: '6px 10px' }}><Icon.Bell/></div>
      </div>
    </div>
  );
}

// ── Pillar bar with P1 focus ────────────────────────────────────────────
function PillarBar() {
  return (
    <div className="card">
      <div style={{ padding: '12px 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <div className="sec-label">4 piliers · santé globale</div>
        <div className="sec-aux">P1 en focus · rôle Pacte TER Pilote</div>
      </div>
      <div className="pillar-bar">
        {PILLARS.map(p => (
          <div key={p.code} style={{
            position: 'relative',
            background: p.focus ? 'var(--teal-soft)' : 'transparent',
            borderTop: p.focus ? '2px solid var(--teal)' : '2px solid transparent',
          }}>
            {p.focus && (
              <div style={{
                position: 'absolute', top: 6, right: 14,
                fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em',
                color: 'var(--teal)', textTransform: 'uppercase',
                fontFamily: "'IBM Plex Mono', monospace",
              }}>
                ◆ Focus
              </div>
            )}
            <PillarGauge {...p}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SO·5 hero + 3 sous-SO ───────────────────────────────────────────────
function So5Section() {
  return (
    <div>
      <div className="sec-head">
        <div className="sec-label">01 · SO·5 · Décisions tracées & clôturées <span style={{ color: 'var(--ink-3)', marginLeft: 8, fontWeight: 400 }}>· P1</span></div>
        <div className="sec-aux">3 sous-objectifs · chiffre vs cible</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {SOUS_SO.map(s => <SousSoCard key={s.key} {...s}/>)}
      </div>
    </div>
  );
}

function SousSoCard({ label, sublabel, actual, target, unit, invert }) {
  const hasData = actual != null;
  const status = !hasData ? 'warn' : (invert ? (actual <= target ? 'ok' : 'alert') : (actual >= target ? 'ok' : 'alert'));
  const color = !hasData ? 'var(--ink-3)' : (status === 'ok' ? 'var(--ok)' : status === 'alert' ? 'var(--alert)' : 'var(--warn)');

  return (
    <div className="card metric-compact">
      <div className="mc-head">
        <div>
          <div className="mc-label">{label}</div>
          {sublabel && <div className="mc-sublabel">{sublabel}</div>}
        </div>
        <StatusGlyph status={status}/>
      </div>

      <div>
        <div className="mono mc-num" style={{ color }}>
          {hasData ? actual : '—'}
          <span className="mc-unit">{unit || (hasData ? '' : '')}</span>
        </div>
        <div className="mc-sub" style={{ marginTop: 6 }}>
          {hasData
            ? <span className="mono" style={{ color: 'var(--ink-3)' }}>cible {invert ? '≤' : '≥'} {target}{unit}</span>
            : <span className="tbc">À confirmer · source M13</span>}
        </div>
      </div>

      <div className="mc-spacer"/>

      <div>
        {/* Target reference — invariant display: shows the goal even when actual is missing */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>
          <span>Cible</span>
          <span className="mono" style={{ color: 'var(--ink-2)' }}>{invert ? '≤' : '≥'} {target}{unit}</span>
        </div>
        <div style={{ position: 'relative', height: 14, background: 'var(--card-2)', borderRadius: 3, overflow: 'hidden' }}>
          {/* zone "à atteindre" */}
          <div style={{
            position: 'absolute',
            left: invert ? 0 : `${Math.min(target, 95)}%`,
            width: invert ? `${Math.min(target, 95)}%` : `${100 - Math.min(target, 95)}%`,
            top: 0, bottom: 0,
            background: 'var(--ok-soft)',
          }}/>
          {/* target marker */}
          <div style={{
            position: 'absolute',
            left: `${invert ? Math.min(target, 95) : Math.min(target, 95)}%`,
            top: -3, bottom: -3, width: 2, background: 'var(--ink)',
          }}/>
          {/* dashed hatch over actual to indicate missing */}
          {!hasData && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 6px, var(--border-strong) 6px 7px)',
              opacity: 0.45,
            }}/>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pouls RH — climat hebdo + congés en cours ───────────────────────────
function PoulsRH() {
  return (
    <div>
      <div className="sec-head">
        <div className="sec-label">02 · Pouls RH · hebdo</div>
        <div className="sec-aux">Climat social · saisie manuelle S21 · congés à date</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <ClimatCard/>
        <CongesCard/>
      </div>
    </div>
  );
}

function ClimatCard() {
  return (
    <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="mc-label">Climat social hebdo</div>
          <div className="mc-sublabel">Saisie manuelle · cascade lieutenants S21</div>
        </div>
        <StatusGlyph status="ok"/>
      </div>
      <div>
        <div className="mono" style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--ok)' }}>
          {CLIMAT_LEVELS[CLIMAT_CURRENT]}
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
          {CLIMAT_CURRENT + 1} / 5 · stable vs S20
        </div>
      </div>
      {/* 5 step scale */}
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        {CLIMAT_LEVELS.map((lv, i) => (
          <div key={lv} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{
              height: 8, borderRadius: 2,
              background: i <= CLIMAT_CURRENT ? 'var(--ok)' : 'var(--card-2)',
              opacity: i === CLIMAT_CURRENT ? 1 : (i < CLIMAT_CURRENT ? 0.55 : 1),
            }}/>
            <div style={{ fontSize: 10, color: i === CLIMAT_CURRENT ? 'var(--ink)' : 'var(--ink-3)', textAlign: 'center', fontWeight: i === CLIMAT_CURRENT ? 500 : 400 }}>
              {lv}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CongesCard() {
  return (
    <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="mc-label">Congés en cours</div>
          <div className="mc-sublabel">Salariés absents cette semaine · effectif {CONGES.total}</div>
        </div>
        <StatusGlyph status="ok"/>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <div className="mono" style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {CONGES.active}
        </div>
        <div className="mono" style={{ fontSize: 14, color: 'var(--ink-3)' }}>/ {CONGES.total}</div>
        <div className="mono" style={{ fontSize: 13, color: 'var(--ink-2)', marginLeft: 6 }}>
          {Math.round(CONGES.active / CONGES.total * 100)}% absent
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CONGES.list.map(c => (
          <div key={c.who} style={{
            display: 'grid', gridTemplateColumns: '1fr 90px 110px',
            alignItems: 'center', gap: 10,
            padding: '7px 0', borderTop: '1px solid var(--border)', fontSize: 12.5,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--ink)' }}>{c.who}</span>
              <span style={{ color: 'var(--ink-3)', fontSize: 10.5 }}>{c.role}</span>
            </div>
            <div className="mono" style={{ color: 'var(--ink-2)', fontSize: 12 }}>{c.from}</div>
            <div className="mono" style={{ color: 'var(--ink-2)', fontSize: 12, textAlign: 'right' }}>→ {c.to}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Aggregate tile + Modal ──────────────────────────────────────────────
function M13Tile({ onOpen }) {
  return (
    <div>
      <div className="sec-head">
        <div className="sec-label">03 · Décisions M13 · à clôturer</div>
        <div className="sec-aux">P0 / P1 ouvertes · cible 0 sous 30j</div>
      </div>
      <div className="agg-tile" onClick={onOpen} role="button" tabIndex={0}
           onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}>
        <div className="agg-left">
          <div className="hero-label">M13 P0/P1 à clôturer</div>
          <div className="mono agg-num" style={{ color: M13.p0 > 0 ? 'var(--alert)' : 'var(--ink)' }}>
            {M13.total}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            Cible <span className="mono">0</span> · décisions priorité haute ouvertes &gt;30j
          </div>
          <div className="agg-cta">
            <span>Voir la situation actuelle</span>
            <Icon.Arrow/>
          </div>
        </div>
        <div className="agg-right">
          <BreakdownLine kind="P0" count={M13.p0} sub="critiques · refinancement, arbitrage"/>
          <BreakdownLine kind="P1" count={M13.p1} sub="hautes · DSO, flotte, RBAC"/>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 2 }}>
            <BreakdownLine kind="LI" count={M13.leadersInactifs.length} sub="leaders inactifs cette semaine"/>
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownLine({ kind, count, sub }) {
  const colors = {
    P0: { bg: 'var(--alert-soft)', fg: 'var(--alert)', shape: 'tri' },
    P1: { bg: 'var(--warn-soft)',  fg: 'var(--warn)',  shape: 'sq'  },
    LI: { bg: 'var(--teal-soft)',  fg: 'var(--teal)',  shape: 'dot' },
  }[kind];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 9px', borderRadius: 4,
        background: colors.bg, color: colors.fg,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
        minWidth: 46, justifyContent: 'center',
      }}>
        {kind}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="mono" style={{ fontSize: 18, fontWeight: 500 }}>{count}</span>
        <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{sub}</span>
      </div>
    </div>
  );
}

function M13Modal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">M13 · situation actuelle</div>
            <div className="modal-title">Décisions P0/P1 ouvertes · leaders inactifs · S21</div>
          </div>
          <div className="modal-close" onClick={onClose}><Icon.X/></div>
        </div>

        <div className="modal-toolbar">
          <div className="stat"><span>Total</span><span className="mono">{M13.total}</span></div>
          <div className="stat"><span>P0</span><span className="mono" style={{ color: 'var(--alert)' }}>{M13.p0}</span></div>
          <div className="stat"><span>P1</span><span className="mono" style={{ color: 'var(--warn)' }}>{M13.p1}</span></div>
          <div className="stat"><span>Leaders inactifs</span><span className="mono">{M13.leadersInactifs.length}</span></div>
          <div style={{ marginLeft: 'auto' }} className="stat"><span>Cible</span><span className="mono">0 ouvertes &gt;30j</span></div>
        </div>

        <div className="modal-body">
          {/* Leaders inactifs */}
          <div style={{ padding: '16px 24px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="sec-label" style={{ marginBottom: 0 }}>Leaders inactifs · cette semaine</div>
            <div className="sec-aux mono">{M13.leadersInactifs.length} / 6</div>
          </div>
          <div>
            {M13.leadersInactifs.map(l => (
              <div key={l.name} style={{
                display: 'grid',
                gridTemplateColumns: '36px 1fr 140px 90px 80px',
                gap: 16, alignItems: 'center',
                padding: '11px 24px',
                borderBottom: '1px solid var(--border)', fontSize: 12.5,
              }}>
                <StatusGlyph status={l.status}/>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{l.role}</div>
                </div>
                <div style={{ color: 'var(--ink-2)' }}>Aucune action M13</div>
                <div className="mono" style={{ color: l.status === 'alert' ? 'var(--alert)' : 'var(--warn)' }}>{l.lastSeen}</div>
                <div style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm ghost"><Icon.Send/> Relancer</button>
                </div>
              </div>
            ))}
          </div>

          {/* Décisions */}
          <div style={{ padding: '20px 24px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="sec-label" style={{ marginBottom: 0 }}>Décisions P0/P1 ouvertes</div>
            <div className="sec-aux mono">{M13.total} ouvertes</div>
          </div>
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '90px 56px 1fr 100px 70px 100px',
              gap: 14, padding: '11px 24px',
              fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600,
              borderBottom: '1px solid var(--border)', background: 'var(--bg-elev)',
            }}>
              <span>ID</span><span>Prio</span><span>Objet</span><span>Owner</span><span>Âge</span><span style={{ textAlign: 'right' }}>Action</span>
            </div>
            {M13.decisions.map(d => (
              <div key={d.id} style={{
                display: 'grid',
                gridTemplateColumns: '90px 56px 1fr 100px 70px 100px',
                gap: 14, padding: '11px 24px',
                alignItems: 'center', fontSize: 12.5,
                borderBottom: '1px solid var(--border)',
              }}>
                <span className="mono" style={{ fontWeight: 500 }}>{d.id}</span>
                <span className="mono" style={{
                  display: 'inline-block', padding: '2px 6px', borderRadius: 3, fontSize: 11, fontWeight: 600,
                  background: d.prio === 'P0' ? 'var(--alert-soft)' : 'var(--warn-soft)',
                  color: d.prio === 'P0' ? 'var(--alert)' : 'var(--warn)',
                  width: 'fit-content', textAlign: 'center',
                }}>{d.prio}</span>
                <span>{d.title}</span>
                <span style={{ color: 'var(--ink-2)' }}>{d.owner}</span>
                <span className="mono" style={{ color: d.age > 30 ? 'var(--alert)' : d.age > 14 ? 'var(--warn)' : 'var(--ink-2)' }}>
                  J+{d.age}
                </span>
                <span style={{ textAlign: 'right' }}>
                  <button className="btn btn-sm ghost"><Icon.Eye/> Voir</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Carnet de bord ──────────────────────────────────────────────────────
const CARNET_FILTERS = [
  { key: 'all',   label: 'Tout',         count: CARNET.length },
  { key: 'conge', label: 'Congés',       count: CARNET.filter(r => r.kind === 'conge').length },
  { key: 'coach', label: 'Coaching',     count: CARNET.filter(r => r.kind === 'coach').length },
  { key: 'escal', label: 'Escalades RH', count: CARNET.filter(r => r.kind === 'escal').length },
];

function CarnetView() {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? CARNET : CARNET.filter(r => r.kind === filter);
  const critical = CARNET.filter(r => r.sev === 'alert').length;
  return (
    <div className="content">
      {/* Header line */}
      <div>
        <div className="sec-head">
          <div className="sec-label">Carnet de bord · file actionnable</div>
          <div className="sec-aux mono">{CARNET.length} entrées · {critical} critiques</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="seg">
            {CARNET_FILTERS.map(f => (
              <div key={f.key}
                   className={`seg-item ${filter === f.key ? 'active' : ''}`}
                   onClick={() => setFilter(f.key)}>
                {f.label}
                <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 11 }}>{f.count}</span>
              </div>
            ))}
          </div>
          <button className="btn ghost"><Icon.Filter/> Filtrer</button>
        </div>

        <div className="worklist">
          {rows.map((r, i) => (
            <div key={i} className="wl-row">
              <div className="wl-glyph"><StatusGlyph status={r.sev}/></div>
              <div>
                <div className="wl-object">{r.object}</div>
                <div className="wl-object-sub">{r.sub}</div>
              </div>
              <div className="wl-subject">
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace",
                  background: r.kind === 'conge' ? 'var(--teal-soft)' : r.kind === 'coach' ? 'var(--warn-soft)' : 'var(--alert-soft)',
                  color:      r.kind === 'conge' ? 'var(--teal)'       : r.kind === 'coach' ? 'var(--warn)'      : 'var(--alert)',
                  marginRight: 8,
                }}>
                  {r.kind === 'conge' ? 'CONGÉ' : r.kind === 'coach' ? 'COACH' : 'ESCAL'}
                </span>
              </div>
              <div className="wl-meta">{r.meta}</div>
              <div className="wl-action">
                <button className={`btn ${r.actionKind === 'primary' ? 'primary' : 'ghost'}`}>
                  {r.action === 'Valider' ? <Icon.Check/> : r.action === 'Voir' ? <Icon.Eye/> : <Icon.Escalate/>}
                  {r.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Scores ──────────────────────────────────────────────────────────────
const SCORES = [
  { name: 'Discipline M13',          desc: 'Décisions tracées & clôturées',     score: 64, target: 80, status: 'warn' },
  { name: 'Pouls RH',                desc: 'Climat hebdo + congés gérés',        score: 78, target: 75, status: 'ok'   },
  { name: 'RBAC',                    desc: 'Accès conformes · 30 j',             score: 92, target: 95, status: 'warn' },
  { name: 'Coaching · friction',     desc: 'Signaux traités sous 7 j',           score: 58, target: 70, status: 'alert'},
  { name: 'Pacte TER · adhésion',    desc: 'Lieutenants engagés cascade',        score: 67, target: 80, status: 'warn' },
  { name: 'Admin-Fi · délai',        desc: 'Traitements RH-Fi sous 5 j',         score: 81, target: 80, status: 'ok'   },
];

function ScoresView() {
  return (
    <div className="content">
      <div>
        <div className="sec-head">
          <div className="sec-label">Scores · composite Édienne</div>
          <div className="sec-aux">S21 · 6 composantes · pondération M13</div>
        </div>

        <div className="card card-pad" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <div>
              <div className="hero-label">Score composite</div>
              <div className="mono" style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>
                73<span style={{ fontSize: 18, color: 'var(--ink-2)', marginLeft: 6 }}>/100</span>
              </div>
              <div className="mc-sub" style={{ marginTop: 6 }}>
                <span className="delta up"><Icon.ArrowUp/><span className="mono">+2 vs S20</span></span>
                <span style={{ color: 'var(--ink-3)' }}>rang : 3 / 6 lieutenants</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', flex: 1, maxWidth: 320 }}>
              <Sparkline values={[68, 70, 71, 69, 72, 71, 73, 73]} width={320} height={56} color="var(--teal)" target={80}/>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>8 semaines · cible 80</div>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          {SCORES.map(s => (
            <div key={s.name} className="score-row">
              <div>
                <div style={{ fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.desc}</div>
              </div>
              <div className="score-bar-wrap">
                <div className="score-bar-fill" style={{
                  width: `${s.score}%`,
                  background: s.status === 'alert' ? 'var(--alert)' : s.status === 'warn' ? 'var(--warn)' : 'var(--ok)',
                }}/>
                <div style={{ position: 'absolute', left: `${s.target}%`, top: -3, bottom: -3, width: 1.5, background: 'var(--ink)' }}/>
              </div>
              <div className="mono score-num" style={{ fontWeight: 500 }}>{s.score}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>cible {s.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Profil ──────────────────────────────────────────────────────────────
function ProfilView() {
  return (
    <div className="content">
      <div className="sec-head">
        <div className="sec-label">Profil · Édienne R.</div>
        <div className="sec-aux">RH & Pacte TER Pilote · Transit/Admin-Fi</div>
      </div>
      <div className="prof-grid">
        <div className="card prof-card">
          <div className="prof-avatar">ÉR</div>
          <div className="prof-name">Édienne R.</div>
          <div className="prof-role">RH · Pacte TER Pilote</div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button className="btn ghost btn-sm">Cascade S21</button>
            <button className="btn ghost btn-sm">1:1</button>
          </div>
        </div>
        <div className="card card-pad">
          <div className="prof-kv-row"><div className="k">Rôle</div><div>Responsable RH · Pacte TER Pilote</div></div>
          <div className="prof-kv-row"><div className="k">Périmètre</div><div>Transit · Admin-Fi · 60 collaborateurs</div></div>
          <div className="prof-kv-row"><div className="k">Pilier focus</div><div><span style={{ color: 'var(--teal)', fontWeight: 500 }}>P1 · Exécution &amp; discipline</span></div></div>
          <div className="prof-kv-row"><div className="k">SO référent</div><div>SO·5 · Décisions tracées &amp; clôturées</div></div>
          <div className="prof-kv-row"><div className="k">Cascade</div><div>Hebdomadaire · lundi 07:30 · 6 lieutenants</div></div>
          <div className="prof-kv-row"><div className="k">Accès RBAC</div><div className="mono">RH · CONGÉS · M13 (lecture+écriture) · Trésorerie (lecture)</div></div>
          <div className="prof-kv-row"><div className="k">Téléphone</div><div className="mono"><span className="tbc">+261 · à confirmer</span></div></div>
          <div className="prof-kv-row"><div className="k">Email</div><div className="mono">edienne@loi.mg</div></div>
        </div>
      </div>
    </div>
  );
}

// ── Overview wrapper ────────────────────────────────────────────────────
function OverviewView({ openModal }) {
  return (
    <div className="content">
      <PillarBar/>
      <So5Section/>
      <PoulsRH/>
      <M13Tile onOpen={openModal}/>
    </div>
  );
}

// ── App root ────────────────────────────────────────────────────────────
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "density": "comfortable",
  "tab": "overview"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);
  const [tab, setTab] = useState(t.tab || 'overview');
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setModal(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar tab={tab} setTab={setTab}/>
      <main className="main">
        <Topbar tab={tab} theme={t.theme} setTheme={(v) => setTweak('theme', v)}/>
        {tab === 'overview' && <OverviewView openModal={() => setModal(true)}/>}
        {tab === 'scores'   && <ScoresView/>}
        {tab === 'carnet'   && <CarnetView/>}
        {tab === 'profil'   && <ProfilView/>}
      </main>

      {modal && <M13Modal onClose={() => setModal(false)}/>}

      <TweaksPanel title="Tweaks · cockpit Édienne">
        <TweakSection label="Apparence"/>
        <TweakRadio label="Thème"   value={t.theme}   options={['dark', 'light']}        onChange={v => setTweak('theme', v)}/>
        <TweakSection label="Navigation"/>
        <TweakSelect label="Onglet par défaut" value={tab} options={['overview','scores','carnet','profil']} onChange={setTab}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
