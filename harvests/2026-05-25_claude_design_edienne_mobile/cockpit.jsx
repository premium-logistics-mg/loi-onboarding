/* LOI · Cockpit (overview) — CEO. Visual-First, D82 strict.
   Sidebar + Pillar bar + 5 sections. */

const { useState, useEffect } = React;

// ── data (KPIs réels du master dataset) ─────────────────────────────────
const PILLARS = [
  { code: 'P1', name: 'Exécution & discipline',          score: 72, status: 'ok' },
  { code: 'P2', name: 'Cash & rentabilité',              score: 41, status: 'alert' },
  { code: 'P3', name: 'Fidélité & diversification client', score: 58, status: 'warn' },
  { code: 'P4', name: 'Fluidité & productivité',          score: 76, status: 'ok' },
];

// Sparkline historique 12 mois — trésorerie nette (Md MGA)
const TREASURY_SERIES = [1.62, 1.55, 1.48, 1.41, 1.32, 1.25, 1.21, 1.18, 1.14, 1.09, 1.12, 1.10];

// 6 banques + caisse — BGFI réel ; autres À CONFIRMER (signalé)
const BANKS = [
  { name: 'BGFI',        value: -1.97, confirmed: true,  note: 'découvert' },
  { name: 'BNI',         value:  1.42, confirmed: false },
  { name: 'BMOI',        value:  0.86, confirmed: false },
  { name: 'BOA',         value:  0.71, confirmed: false },
  { name: 'SG Mada',     value:  0.43, confirmed: false },
  { name: 'Accès Banque',value:  0.31, confirmed: false },
  { name: 'Caisse',      value:  0.34, confirmed: false },
];

const SOS = [
  { code: 'SO·1', pillar: 'P2', name: 'Encaissement & dette réduite',     kind: 'bullet',        status: 'warn'  },
  { code: 'SO·2', pillar: 'P4', name: 'Commande → facture maîtrisé',      kind: 'chip',          status: 'ok'    },
  { code: 'SO·3', pillar: 'P4', name: 'Flotte productive 75 / 18 / 85',   kind: 'tri-gauge',     status: 'ok'    },
  { code: 'SO·4', pillar: 'P3', name: 'Portefeuille diversifié',          kind: 'concentration', status: 'alert' },
  { code: 'SO·5', pillar: 'P1', name: 'Décisions tracées & clôturées',    kind: 'chip',          status: 'warn'  },
];

const LIEUTENANTS = [
  { name: 'CFO',  role: 'Direction financière',  score: 74, status: 'ok',    trend: '↑3' },
  { name: 'COO',  role: 'Direction opérations',  score: 68, status: 'ok',    trend: '→'  },
  { name: 'Tudi', role: 'Transport',             score: 81, status: 'ok',    trend: '↑5' },
  { name: 'Joel', role: 'Commerce',              score: 52, status: 'warn',  trend: '↓2' },
  { name: 'RAF',  role: 'Trésorerie',            score: 38, status: 'alert', trend: '↓7' },
  { name: 'RH',   role: 'Capital humain',        score: 64, status: 'warn',  trend: '→'  },
];

// ── Sidebar ─────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">LOI</div>
        <div>
          <div className="brand-name">Cockpit CEO</div>
          <div className="brand-sub">Premium Logistics · MG</div>
        </div>
      </div>

      <div className="nav-section">Pilotage</div>
      <div className="nav-item active"><span className="nav-icon"><Icon.Cockpit/></span> Cockpit</div>
      <div className="nav-item"><span className="nav-icon"><Icon.Spark/></span> Assistant</div>
      <div className="nav-item"><span className="nav-icon"><Icon.Award/></span> Scores</div>
      <div className="nav-item"><span className="nav-icon"><Icon.Book/></span> Carnet de bord</div>

      <div className="nav-section" style={{ marginTop: 8 }}>Long terme</div>
      <div className="nav-item"><span className="nav-icon"><Icon.Flag/></span> Stratégie</div>
      <div className="nav-item"><span className="nav-icon"><Icon.Book/></span> Gouvernance</div>

      <div className="persona">
        <div className="persona-avatar">RA</div>
        <div>
          <div className="persona-name">CEO</div>
          <div className="persona-role">Lundi 25 mai 2026</div>
        </div>
      </div>
    </aside>
  );
}

// ── Topbar ──────────────────────────────────────────────────────────────
function Topbar({ theme, setTheme }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div>
          <div className="h-eyebrow">Cockpit CEO</div>
          <div className="h-title">Vue d'ensemble</div>
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

// ── Pillar bar ──────────────────────────────────────────────────────────
function PillarBar() {
  return (
    <div className="card">
      <div style={{ padding: '12px 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <div className="sec-label">4 piliers · santé globale</div>
        <div className="sec-aux">État instantané · vs trajectoire 60j</div>
      </div>
      <div className="pillar-bar">
        {PILLARS.map(p => <PillarGauge key={p.code} {...p}/>)}
      </div>
    </div>
  );
}

// ── Section 1 · Trésorerie ──────────────────────────────────────────────
function TresorerieSection() {
  return (
    <div>
      <div className="sec-head">
        <div className="sec-label">01 · Trésorerie · M01</div>
        <div className="sec-aux">Net disponible · 6 banques + caisse · clôture J·141</div>
      </div>

      <div className="card">
        <div className="hero">
          {/* HERO LEFT — gros chiffre + sparkline */}
          <div className="hero-left">
            <div className="hero-label">Trésorerie nette disponible</div>
            <div className="mono hero-num">
              1,10<span className="hero-unit">Md MGA</span>
            </div>
            <div className="hero-sub">
              <span className="delta down"><Icon.ArrowDn/> <span className="mono">−0,52 Md · 12 mois</span></span>
              <span style={{ color: 'var(--ink-3)' }}>vs cible plancher 1,5 Md</span>
            </div>
            <div style={{ marginTop: 18 }}>
              <Sparkline values={TREASURY_SERIES} width={460} height={70} color="var(--teal)" target={1.5}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--ink-3)', marginTop: 6 }}>
                <span>Mai 25</span>
                <span style={{ color: 'var(--ink-2)' }}>— — — cible plancher 1,5 Md MGA</span>
                <span>Mai 26</span>
              </div>
            </div>
          </div>

          {/* HERO RIGHT — alerte BGFI */}
          <div className="hero-right">
            <div className="hero-label" style={{ color: 'var(--alert)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon.AlertTri/> Alerte critique · découvert
            </div>
            <div style={{
              marginTop: 12,
              padding: '14px 16px',
              background: 'var(--alert-soft)',
              borderRadius: 8,
              border: '1px solid var(--alert)',
              borderLeftWidth: 3
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>BGFI · compte courant</div>
                <div className="mono" style={{ fontSize: 22, color: 'var(--alert)', fontWeight: 500 }}>−1,97<span style={{ fontSize: 12, marginLeft: 4 }}>Md MGA</span></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 12 }}>
                <KV label="Plafond" value="2,00 Md" sub="MGA"/>
                <KV label="Marge restante" value="0,03 Md" sub="MGA" warn/>
                <KV label="Échéance" value="J+9" sub="04 jun 26" warn/>
              </div>
            </div>

            {/* Mini bank breakdown */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginBottom: 6 }}>
                <span>6 banques + caisse</span>
                <span>Md MGA</span>
              </div>
              {BANKS.map(b => <BankBar key={b.name} {...b}/>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KV({ label, value, sub, warn, ok }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      <div className="mono" style={{ fontSize: 16, fontWeight: 500, color: warn ? 'var(--warn)' : ok ? 'var(--ok)' : 'var(--ink)', marginTop: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{sub}</div>
    </div>
  );
}

function BankBar({ name, value, confirmed, note }) {
  const isNeg = value < 0;
  const scale = 2.2; // Md MGA absolute max for bar
  const pct = Math.min(Math.abs(value) / scale, 1) * 50; // half-width per side
  return (
    <div className="bank-row">
      <div className="bank-name">
        {name}
        {!confirmed && <span className="confirmer" style={{ marginLeft: 6, fontSize: 9.5 }}>à confirmer</span>}
        {note && <div style={{ fontSize: 10.5, color: 'var(--alert)' }}>{note}</div>}
      </div>
      <div className="bar-track">
        <div className="bar-zero"/>
        <div className="bar-fill" style={{
          left: isNeg ? `${50 - pct}%` : '50%',
          width: `${pct}%`,
          background: isNeg ? 'var(--alert)' : 'var(--teal)'
        }}/>
      </div>
      <div className="bank-num mono" style={{ color: isNeg ? 'var(--alert)' : 'var(--ink)' }}>
        {isNeg ? '−' : '+'}{Math.abs(value).toFixed(2)}
      </div>
    </div>
  );
}

// ── Section 2 · SO Board ────────────────────────────────────────────────
function SOBoard() {
  return (
    <div>
      <div className="sec-head">
        <div className="sec-label">02 · SO Board · 5 objectifs stratégiques</div>
        <div className="sec-aux">Trajectoire réelle · forecast 90j vs cible</div>
      </div>

      <div className="so-grid">
        {/* SO·1 — DSO bullet */}
        <div className="card so-card">
          <div className="so-head">
            <div>
              <div className="so-code">SO·1 <span style={{ color: 'var(--ink-3)' }}>· {SOS[0].pillar}</span></div>
              <div className="so-name">{SOS[0].name}</div>
            </div>
            <StatusGlyph status="warn"/>
          </div>
          <div style={{ flex: 1 }}/>
          <TargetBullet
            label="DSO · jours"
            actual={78} target={60} min={40} max={100} unit="j" invert
          />
          <Sparkline values={[92, 89, 88, 84, 83, 81, 80, 78]} width={220} height={28} color="var(--warn)"/>
        </div>

        {/* SO·2 — chip */}
        <div className="card so-card">
          <div className="so-head">
            <div>
              <div className="so-code">SO·2 <span style={{ color: 'var(--ink-3)' }}>· {SOS[1].pillar}</span></div>
              <div className="so-name">{SOS[1].name}</div>
            </div>
            <StatusGlyph status="ok"/>
          </div>
          <div style={{ flex: 1 }}/>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Cycle moyen commande → facture</div>
            <div className="mono" style={{ fontSize: 28, fontWeight: 500, marginTop: 2 }}>4,2<span style={{ fontSize: 13, marginLeft: 4, color: 'var(--ink-2)' }}>j</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <span className="delta up"><Icon.ArrowUp/><span className="mono">−1,8j · 60j</span></span>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>cible ≤5j</span>
            </div>
          </div>
          <Sparkline values={[6.1, 5.8, 5.6, 5.4, 5.0, 4.7, 4.5, 4.2]} width={220} height={28} color="var(--ok)"/>
        </div>

        {/* SO·3 — tri-gauge */}
        <div className="card so-card">
          <div className="so-head">
            <div>
              <div className="so-code">SO·3 <span style={{ color: 'var(--ink-3)' }}>· {SOS[2].pillar}</span></div>
              <div className="so-name">{SOS[2].name}</div>
            </div>
            <StatusGlyph status="ok"/>
          </div>
          <div style={{ display: 'flex', gap: 12, flex: 1, alignItems: 'flex-end' }}>
            <MiniGauge label="Utilisation" value={75} target={75}/>
            <MiniGauge label="Marge" value={18} target={18}/>
            <MiniGauge label="Disponibilité" value={85} target={85}/>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>15 SCHACMAN F3000 · flotte productive</div>
        </div>

        {/* SO·4 — concentration */}
        <div className="card so-card">
          <div className="so-head">
            <div>
              <div className="so-code">SO·4 <span style={{ color: 'var(--ink-3)' }}>· {SOS[3].pillar}</span></div>
              <div className="so-name">{SOS[3].name}</div>
            </div>
            <StatusGlyph status="alert"/>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ConcentrationGauge actual={28.5} ceiling={25} label="PENTA-OCEAN"/>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textAlign: 'center' }}>PENTA-OCEAN · part top client</div>
        </div>

        {/* SO·5 — chip statut */}
        <div className="card so-card">
          <div className="so-head">
            <div>
              <div className="so-code">SO·5 <span style={{ color: 'var(--ink-3)' }}>· {SOS[4].pillar}</span></div>
              <div className="so-name">{SOS[4].name}</div>
            </div>
            <StatusGlyph status="warn"/>
          </div>
          <div style={{ flex: 1 }}/>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Décisions clôturées sous 30j</div>
            <div className="mono" style={{ fontSize: 28, fontWeight: 500, marginTop: 2 }}>62<span style={{ fontSize: 13, marginLeft: 2, color: 'var(--ink-2)' }}>%</span></div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
              <span className="delta flat"><span className="mono">14 ouvertes</span></span>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>cible ≥80%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 22 }).map((_, i) => (
              <span key={i} style={{
                flex: 1, height: 12, borderRadius: 1,
                background: i < 14 ? 'var(--ok)' : (i < 22 ? 'var(--warn)' : 'var(--card-2)')
              }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section 3 · Lieutenants ─────────────────────────────────────────────
function LieutenantsSection() {
  return (
    <div>
      <div className="sec-head">
        <div className="sec-label">03 · Lieutenants · scores composites</div>
        <div className="sec-aux">6 responsables · cascade hebdo S21</div>
      </div>
      <div className="lt-row">
        {LIEUTENANTS.map(l => <CompositeScoreChip key={l.name} {...l}/>)}
      </div>
    </div>
  );
}

// ── Section 4 · Brief CEO (M09) ─────────────────────────────────────────
function BriefSection() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="sec-head">
        <div className="sec-label">04 · Brief CEO · M09</div>
        <div className="sec-aux">Synthèse hebdo · 3 points · narratif replié</div>
      </div>

      <div className="brief-grid">
        <div className="card brief-card">
          <div className="brief-label">Priorité semaine</div>
          <div className="brief-num mono" style={{ color: 'var(--alert)' }}>BGFI · J+9</div>
          <div className="brief-text">Refinancer la marge de découvert avant le 04 jun.</div>
        </div>
        <div className="card brief-card">
          <div className="brief-label">Levier impact</div>
          <div className="brief-num mono">DSO <span style={{ color: 'var(--ink-3)' }}>78 → 60j</span></div>
          <div className="brief-text">−18j = libère ≈ 0,9 Md MGA de cash piégé.</div>
        </div>
        <div className="card brief-card">
          <div className="brief-label">Risque concentration</div>
          <div className="brief-num mono" style={{ color: 'var(--alert)' }}>PENTA 28,5%</div>
          <div className="brief-text">Au-dessus du plafond 25% depuis 4 semaines.</div>
        </div>
      </div>

      <div className="disclose" style={{ marginTop: 12 }}>
        <div className="disclose-head" onClick={() => setOpen(!open)}>
          <div className="disclose-title">
            <span className={`chev ${open ? 'open' : ''}`}><Icon.Chev/></span>
            Voir le détail · narratif M09 complet
          </div>
          <div className="disclose-meta">~340 mots · lecture 90s</div>
        </div>
        {open && (
          <div className="disclose-body">
            <p>Semaine S21 marquée par la pression sur la trésorerie : le découvert BGFI consomme désormais 98,5 % du plafond négocié, et l'échéance de renouvellement tombe à J+9. Le levier prioritaire reste l'accélération des encaissements (SO·1), où le DSO recule lentement (92j → 78j sur 8 semaines) sans encore atteindre la trajectoire cible de 60j.</p>
            <p>Côté portefeuille, PENTA-OCEAN est sorti du plafond de concentration depuis quatre semaines (28,5 % vs ≤25 %). Trois pistes de diversification sont en qualification (À CONFIRMER · base commerciale Joel).</p>
            <p>La flotte tient ses 75/18/85 — premier indicateur opérationnel au vert depuis le T1. RAF reste le point de tension humain : score 38, en repli de 7 points, à traiter en 1:1 cette semaine.</p>
            <p className="confirmer">Source : M09 · synthèse hebdo CEO · gen. 06:08 · À CONFIRMER sur points commerciaux Joel.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section 5 · Tier 2 · Gouvernance / Stratégie (collapsé) ─────────────
function Tier2Section() {
  const [g, setG] = useState(false);
  const [s, setS] = useState(false);
  return (
    <div>
      <div className="sec-head">
        <div className="sec-label">05 · Long terme · gouvernance & stratégie</div>
        <div className="sec-aux">Tier 2 · déplié à la demande</div>
      </div>
      <div className="tier2-grid">
        <div className="disclose">
          <div className="disclose-head" onClick={() => setG(!g)}>
            <div className="disclose-title">
              <span className={`chev ${g ? 'open' : ''}`}><Icon.Chev/></span>
              Gouvernance · décisions tracées
            </div>
            <div className="disclose-meta mono"><span style={{ color: 'var(--warn)' }}>14 ouvertes</span> · 38 clôturées</div>
          </div>
          {g && (
            <div className="disclose-body">
              <p>Cycle de décision moyen : 18j · cible ≤14j (À CONFIRMER · M09).</p>
              <p>3 décisions critiques en attente d'arbitrage CEO depuis &gt;30j.</p>
            </div>
          )}
        </div>
        <div className="disclose">
          <div className="disclose-head" onClick={() => setS(!s)}>
            <div className="disclose-title">
              <span className={`chev ${s ? 'open' : ''}`}><Icon.Flag/></span>
              Stratégie 36 mois · jalons
            </div>
            <div className="disclose-meta mono">3/7 jalons à l'heure</div>
          </div>
          {s && (
            <div className="disclose-body">
              <p>Horizon 2027–2028 · diversification portefeuille, doublement flotte, accès financements long.</p>
              <p className="confirmer">Données stratégiques · À CONFIRMER avec board T3 2026.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── App root ────────────────────────────────────────────────────────────
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "density": "comfortable",
  "accent": "teal"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar/>
      <main className="main">
        <Topbar theme={t.theme} setTheme={(v) => setTweak('theme', v)}/>
        <div className="content">
          <PillarBar/>
          <TresorerieSection/>
          <SOBoard/>
          <LieutenantsSection/>
          <BriefSection/>
          <Tier2Section/>
        </div>
      </main>

      <TweaksPanel title="Tweaks · cockpit CEO">
        <TweakSection label="Apparence"/>
        <TweakRadio label="Thème"   value={t.theme}   options={['dark', 'light']}        onChange={v => setTweak('theme', v)}/>
        <TweakRadio label="Densité" value={t.density} options={['compact', 'comfortable']} onChange={v => setTweak('density', v)}/>
        <TweakSection label="Accent"/>
        <TweakRadio label="Couleur" value={t.accent}  options={['teal', 'navy']}          onChange={v => setTweak('accent', v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
