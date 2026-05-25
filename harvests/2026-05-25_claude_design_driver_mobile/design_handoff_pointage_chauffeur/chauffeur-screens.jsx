// Chauffeur — 5 screens + 3 detail variants. Themed via `t` prop.
// Tous les chiffres en IBM Plex Mono. Aucun champ texte libre quand évitable.

// ════════════════════════════════════════════════════════════
// Shared atoms
// ════════════════════════════════════════════════════════════

function CCheck({ size = 22, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CChevron({ size = 22, color = '#fff', dir = 'right' }) {
  const path = dir === 'right' ? 'M9 6l6 6-6 6' : 'M15 5l-7 7 7 7';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d={path} stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ToConfirm({ children = 'À CONFIRMER' }) {
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

function SectionLabel({ t, children, right }) {
  return (
    <div style={{
      padding: '16px 18px 8px',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 800, color: t.text2,
        letterSpacing: 1.5, textTransform: 'uppercase',
      }}>{children}</span>
      {right && <span style={{ fontSize: 12, color: t.text3 }}>{right}</span>}
    </div>
  );
}

function ContextStrip({ t, items }) {
  // breadcrumb of validated context at top of details / confirm
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      padding: '10px 14px', background: t.mode === 'dark' ? 'rgba(26,142,126,0.14)' : 'rgba(26,142,126,0.10)',
      borderBottom: `1px solid ${t.line}`,
    }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: t.text4 }}>·</span>}
          <span style={{
            fontSize: 12, color: t.text, fontWeight: 600,
            fontFamily: it.mono ? D82.mono : D82.ui,
            letterSpacing: it.mono ? 0.3 : 0,
          }}>{it.label}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 1 · VÉHICULE
// ════════════════════════════════════════════════════════════
function ChScreen1Vehicle({ t }) {
  // Driver PL-CHF-007 is pre-assigned to CT-007 today (the warm path).
  // Recents fall back to manual pick. Plate scan = biggest target.
  const others = [
    { code: 'CT-007', plate: '4271 TCB', model: 'SCHACMAN F3000 6X4', site: 'Garage Betainomby', assigned: true },
    { code: 'CT-002', plate: '1183 TCB', model: 'SCHACMAN F3000 6X4', site: 'Port Toamasina · PDP' },
    { code: 'CT-011', plate: '5602 TCB', model: 'RENAULT KERAX',        site: 'APC Andriamena · RN44' },
    { code: 'CT-005', plate: '2945 TCB', model: 'SCHACMAN F3000 6X4', site: 'Moramanga · relais' },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {/* Pre-assigned hero — confirms the daily camion in one tap */}
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{
          position: 'relative',
          background: t.mode === 'dark' ? t.surface2 : t.surface,
          border: `2px solid ${D82.teal}`,
          borderRadius: 14,
          padding: 16,
          boxShadow: t.mode === 'dark'
            ? '0 8px 24px rgba(0,0,0,0.40)'
            : '0 8px 20px rgba(26,142,126,0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
              color: D82.teal, textTransform: 'uppercase',
            }}>Assigné aujourd'hui</span>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
              padding: '2px 6px', borderRadius: 3,
              background: t.goodSoft, color: D82.teal,
              border: `1px solid ${D82.teal}`,
            }}>PRÉ-REMPLI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 10, flexShrink: 0,
              background: D82.teal,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path d="M2 16V8h11l4 4v4h4v3h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H2v-3z"
                  stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
                <circle cx="7" cy="19" r="1.6" fill="#fff"/>
                <circle cx="17" cy="19" r="1.6" fill="#fff"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: D82.mono, fontSize: 26, fontWeight: 700,
                color: t.text, letterSpacing: 0.5,
              }}>CT-007</div>
              <div style={{
                fontFamily: D82.mono, fontSize: 16, fontWeight: 600,
                color: t.text2, marginTop: 2,
              }}>4271 TCB</div>
              <div style={{ fontSize: 13, color: t.text3, marginTop: 4, fontWeight: 500 }}>
                SCHACMAN F3000 6×4
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan plaque — fallback */}
      <div style={{ padding: '14px 14px 0' }}>
        <button style={{
          width: '100%', minHeight: 64, padding: '12px 16px',
          background: 'transparent',
          color: t.text,
          border: `1.5px dashed ${t.line}`,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          textAlign: 'left',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            background: t.mode === 'dark' ? 'rgba(26,142,126,0.22)' : 'rgba(26,142,126,0.14)',
            border: `1px solid ${D82.teal}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="2.5" stroke={D82.teal} strokeWidth="2"/>
              <circle cx="12" cy="13.5" r="3.5" stroke={D82.teal} strokeWidth="2"/>
              <path d="M8 7l1.5-3h5L16 7" stroke={D82.teal} strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Scanner une autre plaque</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>Si tu prends un camion différent</div>
          </div>
          <CChevron color={t.text3}/>
        </button>
      </div>

      <SectionLabel t={t} right="Plaques en … TCB">Autres véhicules de la flotte</SectionLabel>

      <div style={{ padding: '0 12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {others.slice(1).map((v) => (
          <button key={v.code} style={{
            width: '100%',
            background: t.surface,
            border: `1.5px solid ${t.line}`,
            borderRadius: 10, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
            minHeight: 72, cursor: 'pointer', textAlign: 'left',
            color: t.text,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
              background: t.surfaceMute,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 16V7h11l4 4v5" stroke={t.text2} strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="7" cy="17" r="2.2" stroke={t.text2} strokeWidth="2"/>
                <circle cx="16" cy="17" r="2.2" stroke={t.text2} strokeWidth="2"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: D82.mono, fontSize: 17, fontWeight: 700, color: t.text }}>{v.code}</span>
                <span style={{ color: t.text4 }}>·</span>
                <span style={{ fontFamily: D82.mono, fontSize: 14, color: t.text2 }}>{v.plate}</span>
              </div>
              <div style={{ fontSize: 13, color: t.text2, marginTop: 2, fontWeight: 500 }}>{v.model}</div>
              <div style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>{v.site}</div>
            </div>
            <CChevron color={t.text3}/>
          </button>
        ))}
      </div>

      <div style={{
        padding: '0 18px 14px', fontSize: 11, color: t.text3,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <ToConfirm/>
        <span>format plaque + mapping CT-### → modèle à valider</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2 · TYPE D'ÉVÉNEMENT — 7 tuiles
// ════════════════════════════════════════════════════════════
function EvIcon({ kind, color }) {
  const s = { stroke: color, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  switch (kind) {
    case 'depart': return (
      <svg width="32" height="32" viewBox="0 0 24 24"><path d="M4 12h13M12 6l6 6-6 6" {...s}/><path d="M3 20V4" {...s}/></svg>);
    case 'arrivee': return (
      <svg width="32" height="32" viewBox="0 0 24 24"><path d="M21 12H8M14 6l-6 6 6 6" {...s}/><path d="M22 20V4" {...s}/></svg>);
    case 'chargement': return (
      <svg width="32" height="32" viewBox="0 0 24 24"><path d="M4 20h16M6 12V8h12v4" {...s}/><path d="M12 3v9M8 9l4 4 4-4" {...s}/></svg>);
    case 'dechargement': return (
      <svg width="32" height="32" viewBox="0 0 24 24"><path d="M4 20h16M6 16v-8h12v8" {...s}/><path d="M12 21v-9M8 15l4-4 4 4" {...s}/></svg>);
    case 'incident': return (
      <svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 3l10 17H2L12 3z" {...s}/><path d="M12 10v5M12 18v.5" stroke={color} strokeWidth="2.4" strokeLinecap="round"/></svg>);
    case 'controle': return (
      <svg width="32" height="32" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" {...s}/><path d="M9 9l1.8 2 3.2-4M9 16h6" {...s}/></svg>);
    case 'pause': return (
      <svg width="32" height="32" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.2" stroke={color} strokeWidth="2.2" fill="none"/><rect x="14" y="5" width="4" height="14" rx="1.2" stroke={color} strokeWidth="2.2" fill="none"/></svg>);
  }
}

function EventTile({ t, icon, label, desc, selected, accent = D82.teal }) {
  return (
    <button style={{
      width: '100%', minHeight: 84, padding: '14px 16px',
      background: t.surface,
      border: selected ? `2px solid ${accent}` : `1.5px solid ${t.line}`,
      borderRadius: 12, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
      color: t.text,
      boxShadow: selected
        ? (t.mode === 'dark' ? '0 6px 18px rgba(0,0,0,0.40)' : '0 6px 16px rgba(26,142,126,0.20)')
        : 'none',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 10, flexShrink: 0,
        background: selected ? accent
          : (t.mode === 'dark' ? 'rgba(255,255,255,0.06)' : t.surfaceMute),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <EvIcon kind={icon} color={selected ? '#fff' : (t.mode === 'dark' ? t.text : t.text)}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.2, color: t.text }}>{label}</div>
        <div style={{ fontSize: 13, color: t.text3, marginTop: 2, fontWeight: 500 }}>{desc}</div>
      </div>
      {selected ? (
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}><CCheck size={20}/></div>
      ) : <CChevron color={t.text3}/>}
    </button>
  );
}

function ChScreen2Event({ t, selected = 'depart' }) {
  const tiles = [
    { k: 'depart',       label: 'Départ voyage',     desc: 'Quitte un site avec chargement' },
    { k: 'arrivee',      label: 'Arrivée',           desc: 'Arrive sur site destination' },
    { k: 'chargement',   label: 'Chargement',        desc: 'Matière chargée sur le camion' },
    { k: 'dechargement', label: 'Déchargement',      desc: 'Matière déposée sur site' },
    { k: 'controle',     label: 'Contrôle pré-départ', desc: 'Check-list avant de rouler' },
    { k: 'pause',        label: 'Pause',             desc: 'Arrêt repas · repos' },
    { k: 'incident',     label: 'Incident · Panne',  desc: 'Problème route · véhicule · charge', accent: D82.orange },
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px 16px' }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: t.text2,
        letterSpacing: 1.5, textTransform: 'uppercase',
        padding: '0 4px 10px',
      }}>Que pointes-tu ?</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tiles.map((tile) => (
          <EventTile key={tile.k}
            t={t} icon={tile.k} label={tile.label} desc={tile.desc}
            accent={tile.accent}
            selected={tile.k === selected}/>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3a · DÉTAILS DÉPART — site, km (photo OCR), matière, tonnage
// ════════════════════════════════════════════════════════════
function FieldCard({ t, idx, label, value, sub, action, mono = false, status = 'done' }) {
  const isDone = status === 'done';
  const isActive = status === 'active';
  return (
    <div style={{
      background: t.surface,
      border: `1.5px solid ${isActive ? D82.teal : t.line}`,
      borderRadius: 12, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      minHeight: 76,
      boxShadow: isActive
        ? (t.mode === 'dark' ? '0 6px 18px rgba(0,0,0,0.40)' : '0 6px 16px rgba(26,142,126,0.20)')
        : 'none',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: isDone ? D82.teal : (isActive ? '#0B2540' : t.surfaceMute),
        color: isDone || isActive ? '#fff' : t.text3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: D82.mono, fontWeight: 700, fontSize: 14,
      }}>
        {isDone ? <CCheck size={18}/> : idx}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
          color: t.text3, textTransform: 'uppercase',
        }}>{label}</div>
        <div style={{
          fontSize: 17, fontWeight: 700, color: t.text, marginTop: 2,
          fontFamily: mono ? D82.mono : D82.ui,
          letterSpacing: mono ? 0.4 : -0.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function MiniBtn({ t, children, kind = 'ghost' }) {
  const styles = kind === 'solid' ? {
    border: 0, background: D82.teal, color: '#fff',
  } : {
    border: `1.5px solid ${t.line}`,
    background: 'transparent',
    color: t.text,
  };
  return (
    <button style={{
      ...styles,
      fontFamily: D82.ui, fontSize: 12, fontWeight: 700,
      letterSpacing: 1, textTransform: 'uppercase',
      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
      minHeight: 36, flexShrink: 0, whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

function ChScreen3Depart({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <ContextStrip t={t} items={[
        { label: 'CT-007' , mono: true },
        { label: 'Départ voyage' },
      ]}/>

      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Site */}
        <FieldCard t={t} idx={1}
          label="Site de départ"
          value="Port Toamasina · PDP"
          sub="Choisi dans la liste · 5 sites favoris"
          action={<MiniBtn t={t}>Changer</MiniBtn>}
          status="done"
        />

        {/* KM with OCR thumbnail */}
        <div style={{
          background: t.surface, border: `1.5px solid ${t.line}`,
          borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: D82.teal, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><CCheck size={18}/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
                color: t.text3, textTransform: 'uppercase',
              }}>Kilométrage départ</div>
              <div style={{
                fontFamily: D82.mono, fontSize: 26, fontWeight: 700,
                color: t.text, marginTop: 2, letterSpacing: 0.5,
              }}>184 350<span style={{ fontSize: 14, fontWeight: 600, color: t.text3, marginLeft: 4 }}> km</span></div>
            </div>
            <MiniBtn t={t}>Modifier</MiniBtn>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderTop: `1px dashed ${t.line}`,
          }}>
            {/* Tiny meter thumbnail */}
            <div style={{
              width: 56, height: 36, borderRadius: 6, flexShrink: 0,
              background: t.mode === 'dark'
                ? `repeating-linear-gradient(45deg, #1A3556 0 6px, #15304F 6px 12px)`
                : `repeating-linear-gradient(45deg, ${t.lineSoft} 0 6px, ${t.line} 6px 12px)`,
              border: `1px solid ${t.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: D82.mono, fontSize: 9, color: t.text3,
            }}>compteur</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: t.text2, fontWeight: 600 }}>
                Photo compteur · OCR lu
              </div>
              <div style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>
                Touche le chiffre pour le corriger
              </div>
            </div>
            <div style={{
              fontFamily: D82.mono, fontSize: 11, fontWeight: 700,
              padding: '3px 7px', borderRadius: 4,
              background: t.goodSoft, color: D82.teal,
              border: `1px solid ${D82.teal}`,
            }}>OCR 98%</div>
          </div>
        </div>

        {/* Matière */}
        <FieldCard t={t} idx={3}
          label="Matière transportée"
          value="Granite · blocs"
          sub="Choisie dans la liste produits LOI"
          action={<MiniBtn t={t}>Changer</MiniBtn>}
          status="done"
        />

        {/* Tonnage */}
        <FieldCard t={t} idx={4} mono
          label="Tonnage"
          value="30 T"
          sub="Standard pour granite · ajustable"
          action={<MiniBtn t={t}>Modifier</MiniBtn>}
          status="done"
        />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 2,
          fontSize: 12, color: t.text3,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M20 7L9 18l-5-5" stroke={D82.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Enregistré localement · envoi auto au réseau
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3b · DÉTAILS INCIDENT — type, photo, vocal, gravité
// ════════════════════════════════════════════════════════════
function GravityPill({ t, kind, selected }) {
  // kind: 'mineur' | 'gene' | 'bloquant'
  const config = {
    mineur:   { color: D82.green,  label: 'Mineur',     shape: 'dot' },
    gene:     { color: D82.orange, label: 'Gênant',     shape: 'tri' },
    bloquant: { color: D82.red,    label: 'Bloquant',   shape: 'sq'  },
  }[kind];
  return (
    <button style={{
      flex: 1, minHeight: 64, padding: '8px 6px',
      background: selected ? config.color : t.surface,
      border: `2px solid ${selected ? config.color : t.line}`,
      borderRadius: 10, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
      color: selected ? '#fff' : t.text,
    }}>
      {config.shape === 'dot' && <span style={{ width: 14, height: 14, borderRadius: '50%', background: selected ? '#fff' : config.color }}/>}
      {config.shape === 'tri' && (
        <svg width="16" height="14" viewBox="0 0 16 14"><path d="M8 1l7 12H1L8 1z" fill={selected ? '#fff' : config.color}/></svg>
      )}
      {config.shape === 'sq' && <span style={{ width: 14, height: 14, background: selected ? '#fff' : config.color }}/>}
      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.3 }}>{config.label}</span>
    </button>
  );
}

function IncidentTypeBtn({ t, label, selected }) {
  return (
    <button style={{
      minHeight: 48, padding: '10px 14px',
      background: selected ? (t.mode === 'dark' ? 'rgba(26,142,126,0.25)' : 'rgba(26,142,126,0.12)') : t.surface,
      border: `1.5px solid ${selected ? D82.teal : t.line}`,
      borderRadius: 999, cursor: 'pointer',
      color: t.text, fontSize: 14, fontWeight: selected ? 700 : 600,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {selected && <CCheck size={14} color={D82.teal}/>}
      {label}
    </button>
  );
}

function ChScreen3Incident({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <ContextStrip t={t} items={[
        { label: 'CT-007', mono: true },
        { label: 'Incident · Panne' },
      ]}/>

      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
            color: t.text3, textTransform: 'uppercase', marginBottom: 8,
          }}>Type d'incident</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <IncidentTypeBtn t={t} label="Panne véhicule" selected/>
            <IncidentTypeBtn t={t} label="Accident"/>
            <IncidentTypeBtn t={t} label="Route RN44"/>
            <IncidentTypeBtn t={t} label="Contrôle"/>
            <IncidentTypeBtn t={t} label="Autre"/>
          </div>
        </div>

        {/* Photo preuve */}
        <div style={{
          background: t.surface, border: `1.5px solid ${t.line}`, borderRadius: 12,
          padding: 12, display: 'flex', alignItems: 'center', gap: 12, minHeight: 92,
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
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginTop: 2 }}>1 photo · 14:08</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>Roue arrière gauche éclatée</div>
          </div>
          <MiniBtn t={t}>+ Photo</MiniBtn>
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
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginTop: 2,
              fontFamily: D82.mono, letterSpacing: 0.5,
            }}>00:18</div>
            {/* fake waveform */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>
              {[6,10,14,8,12,18,14,10,16,12,8,6,10,14,8,4,8,12,10,6,4,8,10].map((h,i) => (
                <span key={i} style={{
                  width: 3, height: h, borderRadius: 1.5,
                  background: i < 12 ? D82.teal : t.text4,
                }}/>
              ))}
            </div>
          </div>
          <MiniBtn t={t}>Ré-enr.</MiniBtn>
        </div>

        {/* Gravité — couleur + forme + libellé */}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
            color: t.text3, textTransform: 'uppercase', marginBottom: 8,
          }}>Gravité</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <GravityPill t={t} kind="mineur"/>
            <GravityPill t={t} kind="gene"/>
            <GravityPill t={t} kind="bloquant" selected/>
          </div>
          <div style={{ fontSize: 11, color: t.text3, marginTop: 6 }}>
            Couleur + forme + libellé — jamais couleur seule
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3c · CONTRÔLE PRÉ-DÉPART — checklist toggles
// ════════════════════════════════════════════════════════════
function CheckRow({ t, label, status }) {
  // status: 'ok' (silencieux vert), 'attention' (orange + icône), 'defaut' (rouge + icône)
  const config = {
    ok:        { color: D82.green,  bg: t.mode === 'dark' ? 'rgba(45,134,89,0.20)' : 'rgba(45,134,89,0.10)', label: 'OK',          shape: 'check' },
    attention: { color: D82.orange, bg: 'rgba(199,126,42,0.18)',  label: 'À surveiller', shape: 'tri' },
    defaut:    { color: D82.red,    bg: 'rgba(184,66,30,0.18)',   label: 'Défaut',       shape: 'x'   },
  }[status];
  return (
    <div style={{
      background: t.surface, border: `1.5px solid ${status === 'ok' ? t.line : config.color}`,
      borderRadius: 12, padding: '14px 14px',
      display: 'flex', alignItems: 'center', gap: 12, minHeight: 64,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: config.bg, color: config.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${config.color}`,
      }}>
        {config.shape === 'check' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke={config.color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {config.shape === 'tri' && (
          <svg width="20" height="18" viewBox="0 0 24 22" fill="none">
            <path d="M12 2l11 18H1L12 2z" stroke={config.color} strokeWidth="2.4" strokeLinejoin="round" fill="none"/>
            <path d="M12 9v5M12 17v.5" stroke={config.color} strokeWidth="2.6" strokeLinecap="round"/>
          </svg>
        )}
        {config.shape === 'x' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke={config.color} strokeWidth="2.8" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{label}</div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: config.color, marginTop: 2,
          letterSpacing: 1, textTransform: 'uppercase',
        }}>{config.label}</div>
      </div>
      {/* toggle indicator */}
      <div style={{
        width: 48, height: 28, borderRadius: 14, flexShrink: 0,
        background: status === 'ok' ? D82.teal : t.surfaceMute,
        border: `1.5px solid ${status === 'ok' ? D82.teal : t.line}`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 1.5, left: status === 'ok' ? 22 : 2,
          width: 22, height: 22, borderRadius: '50%', background: '#fff',
        }}/>
      </div>
    </div>
  );
}

function ChScreen3Controle({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <ContextStrip t={t} items={[
        { label: 'CT-007', mono: true },
        { label: 'Contrôle pré-départ' },
      ]}/>
      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: t.text3,
          letterSpacing: 1.5, textTransform: 'uppercase',
          padding: '0 4px 4px',
        }}>5 vérifications · bascule chaque ligne</div>

        <CheckRow t={t} label="Pneus · pression · état" status="ok"/>
        <CheckRow t={t} label="Freins · niveau pédale" status="ok"/>
        <CheckRow t={t} label="Niveaux · huile + eau" status="attention"/>
        <CheckRow t={t} label="Feux · phares + clignotants" status="ok"/>
        <CheckRow t={t} label="Documents · carte grise + permis" status="defaut"/>

        <div style={{
          marginTop: 4, padding: 12, borderRadius: 10,
          background: 'rgba(184,66,30,0.10)',
          border: `1.5px solid ${D82.red}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l10 17H2L12 3z" stroke={D82.red} strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
            <path d="M12 10v5M12 18v.5" stroke={D82.red} strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: D82.red, letterSpacing: 0.3 }}>
              Défaut bloquant détecté
            </div>
            <div style={{ fontSize: 12, color: t.text2, marginTop: 1, fontWeight: 500 }}>
              Va voir le mécano avant de rouler
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4 · CONFIRMATION + SIGNATURE
// ════════════════════════════════════════════════════════════
function SummaryRow({ t, k, v, mono }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 12, padding: '10px 0',
      borderBottom: `1px solid ${t.lineSoft}`,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
        color: t.text3, textTransform: 'uppercase', flexShrink: 0,
      }}>{k}</span>
      <span style={{
        fontSize: 14, fontWeight: 600, color: t.text,
        fontFamily: mono ? D82.mono : D82.ui,
        textAlign: 'right', letterSpacing: mono ? 0.3 : 0,
      }}>{v}</span>
    </div>
  );
}

function ChScreen4Confirm({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '14px 16px 6px',
        fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
        color: t.text2, textTransform: 'uppercase',
      }}>Vérifie avant d'envoyer</div>

      {/* Recap card */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          background: t.surface, border: `1.5px solid ${t.line}`,
          borderRadius: 12, padding: '8px 16px 12px',
        }}>
          <SummaryRow t={t} k="Véhicule"   v="CT-007 · 4271 TCB" mono/>
          <SummaryRow t={t} k="Événement"  v="Départ voyage"/>
          <SummaryRow t={t} k="Site"       v="Port Toamasina · PDP"/>
          <SummaryRow t={t} k="Matière"    v="Granite · 30 T" mono/>
          <SummaryRow t={t} k="Kilométrage" v="184 350 km" mono/>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 12, padding: '10px 0 4px',
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
              color: t.text3, textTransform: 'uppercase',
            }}>Chauffeur · heure</span>
            <span style={{
              fontSize: 14, fontWeight: 600, color: t.text,
              fontFamily: D82.mono,
            }}>PL-CHF-007 · 07:42</span>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
          color: t.text2, textTransform: 'uppercase', marginBottom: 8,
        }}>Signature chauffeur</div>
        <div style={{
          background: t.mode === 'dark' ? 'rgba(245,241,232,0.94)' : '#FFFFFF',
          border: `1.5px solid ${t.line}`,
          borderRadius: 12, padding: 12,
          height: 150, position: 'relative', overflow: 'hidden',
        }}>
          {/* baseline */}
          <div style={{
            position: 'absolute', left: 16, right: 16, bottom: 28,
            height: 1, background: '#9CA9BC',
          }}/>
          {/* fake signature path */}
          <svg viewBox="0 0 320 120" style={{ width: '100%', height: '100%' }}>
            <path d="M20 70 Q 36 38 60 72 T 110 64 Q 130 36 158 70 Q 178 100 210 60 Q 240 28 270 72"
              stroke="#0B2540" strokeWidth="2.4" fill="none"
              strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M210 62 Q 218 90 240 92" stroke="#0B2540" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{
            position: 'absolute', left: 16, bottom: 8,
            fontFamily: D82.mono, fontSize: 10, color: '#5E6B7C',
            letterSpacing: 1, textTransform: 'uppercase',
          }}>X · PL-CHF-007</div>
          <button style={{
            position: 'absolute', right: 10, top: 10,
            border: `1px solid #CFC9B6`, background: '#FFFFFF',
            color: '#0B2540', padding: '4px 8px', borderRadius: 6,
            fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
            cursor: 'pointer',
          }}>Effacer</button>
        </div>
        <div style={{ fontSize: 11, color: t.text3, marginTop: 6 }}>
          Signature TER · valant accusé de pointage
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 5 · RÉSUMÉ ENREGISTRÉ
// ════════════════════════════════════════════════════════════
function ChScreen5Done({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
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
        }}><CCheck size={38}/></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.3 }}>Enregistré</div>
          <div style={{ fontSize: 13, color: '#B7C9E0', marginTop: 4 }}>
            Pointage dans la file locale · sync au réseau
          </div>
        </div>
      </div>

      {/* Reference */}
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
        }}>PNT-2026-0525-0087</span>
      </div>

      {/* Recap mini */}
      <div style={{ padding: '14px 16px 6px' }}>
        <div style={{
          background: t.surface, border: `1.5px solid ${t.line}`,
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
            background: D82.teal,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <EvIcon kind="depart" color="#fff"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
              color: t.text3, textTransform: 'uppercase',
            }}>Événement</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: t.text, marginTop: 2 }}>Départ voyage</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 1, fontFamily: D82.mono }}>
              CT-007 · 184 350 km · 30 T granite
            </div>
          </div>
        </div>
      </div>

      {/* Sync queue */}
      <div style={{ padding: '10px 16px 8px' }}>
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
                strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M20 5v4h-4M4 19v-4h4" stroke={D82.orange} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>2 pointages en file</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>
              Envoi auto dès le retour du réseau
            </div>
          </div>
        </div>
      </div>

      {/* Next actions hint */}
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
          color: t.text3, textTransform: 'uppercase', padding: '8px 4px',
        }}>Prochain pointage probable</div>
        <button style={{
          width: '100%', minHeight: 60, padding: '10px 14px',
          background: t.surface, border: `1.5px solid ${t.line}`,
          borderRadius: 10, cursor: 'pointer', color: t.text, textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: t.surfaceMute,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <EvIcon kind="arrivee" color={t.text2}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Arrivée · APC Andriamena</div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 1 }}>
              Estimé · ~5h de route via RN44
            </div>
          </div>
          <CChevron color={t.text3}/>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  ChScreen1Vehicle, ChScreen2Event,
  ChScreen3Depart, ChScreen3Incident, ChScreen3Controle,
  ChScreen4Confirm, ChScreen5Done,
  CCheck, CChevron, ToConfirm, EvIcon,
});
