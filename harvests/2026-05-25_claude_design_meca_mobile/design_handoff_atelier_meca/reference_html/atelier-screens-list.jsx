// Atelier Méca — atoms, icônes ligne, statut intervention (couleur + forme + libellé).
// FR métier · IBM Plex Mono sur tout chiffre · zéro emoji.

// ════════════════════════════════════════════════════════════
// Atoms — chevrons, check, etc.
// ════════════════════════════════════════════════════════════
function MCheck({ size = 22, color = '#fff', sw = 2.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function MChev({ size = 20, color = '#fff', dir = 'right' }) {
  const rot = { right: 0, down: 90, up: -90, left: 180 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rot}deg)`, transition: 'transform 160ms ease' }}>
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function MToConfirm({ children = 'À CONFIRMER' }) {
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
function MSectionLabel({ t, children, right }) {
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

// ─── Status intervention — couleur + FORME + libellé ───────
// En cours = rond teal · En attente = triangle orange ·
// Bloqué = carré rouge-orange (Bloquer = orange) · Terminé = check vert
function MStatusBadge({ kind, size = 'lg' }) {
  const cfg = {
    'cours':    { color: D82.teal,   bg: D82.okSoft,     shape: 'dot',   label: 'En cours' },
    'attente':  { color: D82.orange, bg: D82.orangeSoft, shape: 'tri',   label: 'En attente' },
    'bloque':   { color: D82.orange, bg: D82.orangeSoft, shape: 'sq',    label: 'Bloqué' },
    'termine':  { color: D82.green,  bg: D82.greenSoft,  shape: 'check', label: 'Terminé' },
  }[kind];
  const big = size === 'lg';
  const fs = big ? 11 : 9;
  const pad = big ? '4px 9px' : '2px 6px';
  const dot = big ? 11 : 9;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 4,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}`,
      fontFamily: D82.ui, fontSize: fs, fontWeight: 800,
      letterSpacing: 1.2, textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {cfg.shape === 'dot'   && <span style={{ width: dot, height: dot, borderRadius: '50%', background: cfg.color }}/>}
      {cfg.shape === 'tri'   && (
        <svg width={dot + 2} height={dot} viewBox="0 0 12 11"><path d="M6 0.5l5.5 9.5h-11L6 0.5z" fill={cfg.color}/></svg>
      )}
      {cfg.shape === 'sq'    && <span style={{ width: dot, height: dot, background: cfg.color }}/>}
      {cfg.shape === 'check' && (
        <svg width={dot + 2} height={dot + 2} viewBox="0 0 14 14"><path d="M2 7.5l3.5 3.5L12 4" stroke={cfg.color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
      )}
      {cfg.label}
    </span>
  );
}

// ─── Icônes ligne (trait fin) pour sections accordéon ──────
function MIcon({ kind, size = 22, color }) {
  const s = { stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  switch (kind) {
    case 'inspection': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2" {...s}/><rect x="9" y="2" width="6" height="4" rx="1" {...s}/><path d="M9 11l1.6 1.6L14 9M9 16h6" {...s}/></svg>);
    case 'diagnostic': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 6h12l4 4v8a2 2 0 01-2 2H4V6z" {...s}/><path d="M8 11h6M8 14h4" {...s}/></svg>);
    case 'pieces': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" {...s}/><path d="M4 7.5l8 4.5 8-4.5M12 12v9" {...s}/></svg>);
    case 'pneus': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" {...s}/><circle cx="12" cy="12" r="3.2" {...s}/><path d="M12 3.5v3.5M12 17v3.5M3.5 12H7M17 12h3.5M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" {...s}/></svg>);
    case 'carburant': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><rect x="4" y="3.5" width="10" height="17" rx="1.5" {...s}/><path d="M14 8h2.5a2 2 0 012 2v7a2 2 0 01-2 2M14 12h2" {...s}/><path d="M7 7h4M7 11h4" {...s}/></svg>);
    case 'photos': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" {...s}/><circle cx="12" cy="13.5" r="3.6" {...s}/><path d="M8 7l1.5-3h5L16 7" {...s}/></svg>);
    case 'notes': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 4h12l3 3v13H5V4z" {...s}/><path d="M8 9h7M8 13h7M8 17h4" {...s}/></svg>);
    case 'mic': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3" {...s}/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5v3" {...s}/></svg>);
    case 'plus': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" {...s} strokeWidth="2.2"/></svg>);
    case 'arrowExt': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" {...s}/></svg>);
    case 'truck': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M3 6h11v10H3z" {...s}/><path d="M14 9h4l3 3v4h-7V9z" {...s}/><circle cx="7" cy="17.5" r="2" {...s}/><circle cx="17" cy="17.5" r="2" {...s}/></svg>);
    case 'clock': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...s}/><path d="M12 7v5l3.5 2.5" {...s}/></svg>);
    case 'pin': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" {...s}/><circle cx="12" cy="9" r="2.4" {...s}/></svg>);
    case 'refresh': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M20 11a8 8 0 10-2 5.5M20 5v6h-6" {...s}/></svg>);
    case 'check': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" {...s} strokeWidth="2.4"/></svg>);
    case 'cross': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" {...s} strokeWidth="2.4"/></svg>);
    case 'search': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" {...s}/><path d="M16 16l4.5 4.5" {...s}/></svg>);
    case 'wrench': return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M9 4a5 5 0 016.6 6.6l5.4 5.4-3 3-5.4-5.4A5 5 0 014 9.6L7 12V8h4L9 4z" {...s}/></svg>);
  }
}

// ════════════════════════════════════════════════════════════
// VUE 1 · MES INTERVENTIONS — liste de cartes job
// Atelier Betainomby · zéro nom fictif · OT atelier réels
// ════════════════════════════════════════════════════════════
const INTERVENTIONS = [
  {
    code: 'OT-A-2026-0142',
    veh: 'CT-007', plate: '4271 TCB', model: 'SCHACMAN F3000 6X4',
    label: 'Remplacement plaquettes frein AR',
    source: 'INSP-2026-0518 · ACT-2026-0142',
    duree: '02:30',
    statut: 'cours',
    selected: true,
  },
  {
    code: 'OT-A-2026-0143',
    veh: 'CT-011', plate: '5602 TCB', model: 'RENAULT KERAX',
    label: 'Révision · niveaux + courroie distribution',
    source: 'Planning préventif',
    duree: '01:00',
    statut: 'attente',
  },
  {
    code: 'OT-A-2026-0144',
    veh: 'CT-005', plate: '2945 TCB', model: 'SCHACMAN F3000 6X4',
    label: 'Diagnostic boîte de vitesses',
    source: 'EVT-2026-0202',
    duree: '03:00',
    statut: 'attente',
  },
  {
    code: 'OT-A-2026-0141',
    veh: 'CT-003', plate: '1827 TCB', model: 'SCHACMAN F3000 6X4',
    label: 'Fuite circuit hydraulique',
    source: 'EVT-2026-0201',
    duree: '04:00',
    statut: 'bloque',
    bloqueur: 'Pièce manquante · joint hydraulique 32mm',
  },
  {
    code: 'OT-A-2026-0140',
    veh: 'CT-002', plate: '1183 TCB', model: 'SCHACMAN F3000 6X4',
    label: 'Échange filtre à air + filtre gasoil',
    source: 'Planning préventif',
    duree: '00:45',
    statut: 'termine',
    closedAt: 'Hier · 16:22',
  },
];

function MJobCard({ t, j }) {
  const isCours = j.statut === 'cours';
  const isBloque = j.statut === 'bloque';
  const isTermine = j.statut === 'termine';
  const accent = isCours ? D82.teal : (isBloque ? D82.orange : (isTermine ? D82.green : t.line));
  return (
    <button style={{
      width: '100%', textAlign: 'left',
      background: t.surface,
      border: `1.5px solid ${isCours || isBloque ? accent : t.line}`,
      borderRadius: 12,
      padding: '14px 14px',
      cursor: 'pointer', color: t.text,
      display: 'flex', flexDirection: 'column', gap: 10,
      minHeight: 116,
      position: 'relative',
      opacity: isTermine ? 0.78 : 1,
      boxShadow: isCours
        ? (t.mode === 'dark' ? '0 6px 18px rgba(26,142,126,0.18)' : '0 6px 16px rgba(26,142,126,0.10)')
        : 'none',
    }}>
      {/* Accent bar */}
      {(isCours || isBloque) && (
        <span style={{
          position: 'absolute', top: -1, left: 14, right: 14,
          height: 3, borderRadius: 2, background: accent,
        }}/>
      )}

      {/* Row 1 — OT + statut */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: D82.mono, fontSize: 13, fontWeight: 700,
          color: t.text, letterSpacing: 0.4,
        }}>{j.code}</span>
        <span style={{ marginLeft: 'auto' }}>
          <MStatusBadge kind={j.statut}/>
        </span>
      </div>

      {/* Row 2 — Véhicule (gros, mono) + plate */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: t.surfaceMute, border: `1.5px solid ${t.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MIcon kind="truck" size={24} color={t.text2}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: D82.mono, fontSize: 20, fontWeight: 700,
            color: t.text, letterSpacing: 0.3, lineHeight: 1,
          }}>{j.veh}<span style={{ color: t.text3, fontSize: 14, fontWeight: 600 }}> · {j.plate}</span></div>
          <div style={{ fontSize: 11, color: t.text3, marginTop: 3, letterSpacing: 0.3, fontWeight: 600 }}>{j.model}</div>
        </div>
        {/* Durée — gros chiffres mono */}
        <div style={{ textAlign: 'right', minWidth: 70 }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
            color: t.text3, textTransform: 'uppercase',
          }}>Durée est.</div>
          <div style={{
            fontFamily: D82.mono, fontSize: 22, fontWeight: 700,
            color: t.text, letterSpacing: 0.3, lineHeight: 1.1, marginTop: 2,
          }}>{j.duree}</div>
        </div>
      </div>

      {/* Row 3 — Label de l'intervention */}
      <div style={{
        fontSize: 15, fontWeight: 700, color: t.text, lineHeight: 1.25,
      }}>{j.label}</div>

      {/* Row 4 — Source + état spécial */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        fontSize: 11, color: t.text3, fontWeight: 500,
      }}>
        <span style={{ fontFamily: D82.mono }}>{j.source}</span>
        {j.bloqueur && (
          <>
            <span style={{ color: t.text4 }}>·</span>
            <span style={{ color: D82.orange, fontWeight: 700 }}>{j.bloqueur}</span>
          </>
        )}
        {j.closedAt && (
          <>
            <span style={{ color: t.text4 }}>·</span>
            <span style={{ color: t.text3 }}>Clôturé {j.closedAt}</span>
          </>
        )}
      </div>
    </button>
  );
}

function MScreenList({ t, items }) {
  const list = items || INTERVENTIONS;
  const cours = list.filter(j => j.statut === 'cours').length;
  const attente = list.filter(j => j.statut === 'attente').length;
  const bloque = list.filter(j => j.statut === 'bloque').length;
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {/* Bandeau atelier + 3 compteurs : En cours / En attente / Bloqué */}
      <div style={{
        padding: '12px 14px 6px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <MIcon kind="pin" size={16} color={t.text3}/>
        <span style={{
          fontSize: 11, fontWeight: 700, color: t.text2,
          letterSpacing: 0.5,
        }}>Atelier Betainomby</span>
        <span style={{ color: t.text4 }}>·</span>
        <span style={{
          fontFamily: D82.mono, fontSize: 11, color: t.text3,
        }}>25 mai 2026</span>
      </div>

      <div style={{ padding: '0 14px 0', display: 'flex', gap: 8 }}>
        {[
          { k: 'En cours',   v: cours,   color: D82.teal,   shape: 'dot' },
          { k: 'En attente', v: attente, color: D82.orange, shape: 'tri' },
          { k: 'Bloqué',     v: bloque,  color: D82.orange, shape: 'sq' },
        ].map((s) => (
          <div key={s.k} style={{
            flex: 1, minWidth: 0,
            background: t.surface, border: `1.5px solid ${t.line}`,
            borderRadius: 10, padding: '8px 10px',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {s.shape === 'dot' && <span style={{ width: 9, height: 9, borderRadius: '50%', background: s.color }}/>}
              {s.shape === 'tri' && (
                <svg width="10" height="9" viewBox="0 0 10 9"><path d="M5 0.5l4.5 8h-9L5 0.5z" fill={s.color}/></svg>
              )}
              {s.shape === 'sq' && <span style={{ width: 9, height: 9, background: s.color }}/>}
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 1.1,
                color: t.text3, textTransform: 'uppercase',
              }}>{s.k}</span>
            </div>
            <div style={{
              fontFamily: D82.mono, fontSize: 24, fontWeight: 700,
              color: s.color, letterSpacing: 0.5, lineHeight: 1,
            }}>{String(s.v).padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      <MSectionLabel t={t} right={`${list.length} OT`}>Mes interventions</MSectionLabel>

      <div style={{ padding: '0 12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((j) => <MJobCard key={j.code} t={t} j={j}/>)}
      </div>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────
function MScreenEmpty({ t }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '12px 14px 6px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <MIcon kind="pin" size={16} color={t.text3}/>
        <span style={{ fontSize: 11, fontWeight: 700, color: t.text2 }}>Atelier Betainomby</span>
        <span style={{ color: t.text4 }}>·</span>
        <span style={{ fontFamily: D82.mono, fontSize: 11, color: t.text3 }}>25 mai 2026</span>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '20px 36px', gap: 18,
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 22,
          background: t.surface, border: `1.5px solid ${t.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MIcon kind="wrench" size={44} color={t.text3}/>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 22, fontWeight: 800, color: t.text, letterSpacing: -0.3,
          }}>Aucune intervention</div>
          <div style={{
            fontSize: 14, color: t.text3, marginTop: 6, lineHeight: 1.5,
            fontWeight: 500,
          }}>
            Tu n'as pas d'ordre de travail en cours ni en attente. Le chef d'atelier en assignera un nouveau bientôt.
          </div>
        </div>
        <button style={{
          minHeight: 48, padding: '0 18px',
          background: 'transparent', color: t.text,
          border: `1.5px solid ${t.line}`, borderRadius: 10,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: D82.ui, fontSize: 14, fontWeight: 700,
          letterSpacing: 0.5, textTransform: 'uppercase',
          cursor: 'pointer',
        }}>
          <MIcon kind="refresh" size={18} color={t.text}/>
          Rafraîchir
        </button>
      </div>

      <div style={{
        padding: '14px 18px',
        borderTop: `1px solid ${t.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 10,
        background: t.surface2,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: D82.teal, boxShadow: `0 0 0 4px ${D82.okSoft}`, flexShrink: 0,
        }}/>
        <span style={{ fontSize: 12, color: t.text2, fontWeight: 600 }}>
          Synchronisé · file vide
        </span>
      </div>
    </div>
  );
}

// ─── Success state · Intervention terminée ──────────────────
function MScreenSuccess({ t, code = 'OT-A-2026-0142', veh = 'CT-007 · 4271 TCB' }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '20px 28px', gap: 22,
      }}>
        <div style={{
          width: 112, height: 112, borderRadius: 28,
          background: D82.green, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 14px 36px rgba(45,134,89,0.40)`,
        }}>
          <svg width="58" height="58" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
            color: D82.green, textTransform: 'uppercase',
          }}>Succès</div>
          <div style={{
            fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: -0.4,
            marginTop: 4, lineHeight: 1.15,
          }}>Intervention terminée</div>
          <div style={{
            fontSize: 14, color: t.text3, marginTop: 8, lineHeight: 1.5, fontWeight: 500,
          }}>
            Le chef d'atelier reçoit la clôture · le véhicule est sorti de la file atelier.
          </div>
        </div>

        <div style={{
          width: '100%',
          background: t.surface, border: `1.5px solid ${t.line}`,
          borderRadius: 12, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {[
            { k: 'OT atelier',  v: code, mono: true },
            { k: 'Véhicule',    v: veh,  mono: true },
            { k: 'Clôturé à',   v: '08:14 · PL-MEC-007', mono: true },
            { k: 'Durée réelle', v: '02:18', mono: true, accent: true },
          ].map((r) => (
            <div key={r.k} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '4px 0',
              borderBottom: r.k === 'Durée réelle' ? 0 : `1px dashed ${t.lineSoft}`,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 800, color: t.text3,
                letterSpacing: 1.2, textTransform: 'uppercase',
              }}>{r.k}</span>
              <span style={{
                fontFamily: r.mono ? D82.mono : D82.ui,
                fontSize: r.accent ? 16 : 13,
                fontWeight: 700, color: r.accent ? D82.green : t.text,
                letterSpacing: 0.3,
              }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  MCheck, MChev, MToConfirm, MSectionLabel, MStatusBadge, MIcon,
  INTERVENTIONS, MJobCard, MScreenList, MScreenEmpty, MScreenSuccess,
});
