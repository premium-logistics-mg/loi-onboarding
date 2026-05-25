// Atelier Méca — VUE 2 : Détail intervention.
// Header véhicule + description · puis SECTIONS MODULAIRES EN ACCORDÉON
// (repliées par défaut, on ouvre celle dont on a besoin).
// Pneus & Carburant = renvois explicites vers les flux /mobile/pneu et /mobile/fuel.

// ─── Header véhicule + description ──────────────────────────
function MJobHeader({ t, j }) {
  return (
    <div style={{
      background: t.mode === 'dark' ? t.surface2 : t.surface,
      borderBottom: `1px solid ${t.line}`,
      padding: '14px 14px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12, flexShrink: 0,
          background: t.surfaceMute, border: `1.5px solid ${t.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MIcon kind="truck" size={30} color={t.text}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontFamily: D82.mono, fontSize: 22, fontWeight: 700,
              color: t.text, letterSpacing: 0.3, lineHeight: 1.05,
            }}>{j.veh}</span>
            <span style={{
              fontFamily: D82.mono, fontSize: 13, fontWeight: 600,
              color: t.text3, letterSpacing: 0.3,
            }}>{j.plate}</span>
          </div>
          <div style={{
            fontSize: 11, color: t.text3, marginTop: 2,
            fontWeight: 600, letterSpacing: 0.3,
          }}>{j.model}</div>
        </div>
        <MStatusBadge kind={j.statut}/>
      </div>

      {/* Description + OT + durée */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text, lineHeight: 1.3 }}>
          {j.label}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6,
          marginTop: 6,
          fontSize: 11, color: t.text3, fontWeight: 500,
        }}>
          <span style={{
            fontFamily: D82.mono, fontSize: 12, fontWeight: 700,
            color: t.text2, letterSpacing: 0.4,
          }}>{j.code}</span>
          <span style={{ color: t.text4 }}>·</span>
          <span style={{ fontFamily: D82.mono }}>{j.source}</span>
          <span style={{ color: t.text4 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <MIcon kind="clock" size={12} color={t.text3}/>
            <span style={{ fontFamily: D82.mono, fontWeight: 700, color: t.text }}>{j.duree}</span>
            <span style={{ color: t.text3 }}>est.</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Bloc accordéon — head cliquable, body conditionnel ─────
function MAccordion({ t, icon, title, summary, count, countTone, open, badge, body, handoff }) {
  // countTone: 'teal' (OK avec contenu), 'orange' (à faire), 'neutral'
  const dotColor = countTone === 'teal' ? D82.teal
                 : countTone === 'orange' ? D82.orange
                 : countTone === 'red' ? D82.red
                 : t.text4;
  return (
    <div style={{
      background: t.surface,
      border: `1.5px solid ${open ? D82.teal : t.line}`,
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: open
        ? (t.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.30)' : '0 6px 18px rgba(11,37,64,0.10)')
        : 'none',
    }}>
      {/* Head — gros · zone de tap large ≥56px */}
      <button style={{
        width: '100%', minHeight: 64,
        background: open ? (t.mode === 'dark' ? 'rgba(26,142,126,0.10)' : 'rgba(26,142,126,0.06)') : 'transparent',
        border: 0, padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', color: t.text, textAlign: 'left',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: open ? D82.teal : t.surfaceMute,
          border: `1.5px solid ${open ? D82.teal : t.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MIcon kind={icon} size={22} color={open ? '#fff' : t.text2}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 17, fontWeight: 800, color: t.text, letterSpacing: -0.2,
            }}>{title}</span>
            {handoff && (
              <span style={{
                fontSize: 8, fontWeight: 800, letterSpacing: 1.2,
                padding: '2px 5px', borderRadius: 3,
                background: D82.okSoft, color: D82.teal,
                border: `1px solid ${D82.teal}`,
                textTransform: 'uppercase',
              }}>Module dédié</span>
            )}
            {badge}
          </div>
          {summary && (
            <div style={{
              fontSize: 12, color: t.text3, marginTop: 2,
              fontWeight: 500, lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{summary}</div>
          )}
        </div>
        {count !== undefined && (
          <span style={{
            fontFamily: D82.mono, fontSize: 16, fontWeight: 700,
            color: dotColor, letterSpacing: 0.3,
            background: t.surfaceMute, border: `1.5px solid ${t.line}`,
            borderRadius: 6, padding: '2px 8px', minWidth: 32, textAlign: 'center',
            flexShrink: 0,
          }}>{count}</span>
        )}
        <MChev color={t.text2} dir={open ? 'down' : 'right'}/>
      </button>

      {/* Body */}
      {open && (
        <div style={{
          borderTop: `1px solid ${t.lineSoft}`,
          padding: '12px 14px 14px',
          background: t.surface,
        }}>
          {body}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Contenu des sections accordéon
// ════════════════════════════════════════════════════════════

// 1 · Inspection — checklist 4 états
const INSP_ROWS = [
  { label: 'Disque frein arrière · usure',  status: 'critique' },
  { label: 'Plaquette frein arrière · état', status: 'critique' },
  { label: 'Niveau liquide de frein',       status: 'alerte' },
  { label: 'Étrier · jeu + axes',           status: 'ok' },
  { label: 'Flexible hydraulique',          status: 'ok' },
  { label: 'Témoin tableau de bord',        status: 'nonverif' },
];

function MInspBody({ t }) {
  const stShape = (s) => ({
    ok:        { color: D82.ok,      shape: 'dot',  label: 'OK' },
    alerte:    { color: D82.orange,  shape: 'tri',  label: 'Alerte' },
    critique:  { color: D82.red,     shape: 'sq',   label: 'Critique' },
    nonverif:  { color: '#5B7398',   shape: 'rh',   label: 'Non vérifié' },
  }[s]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Légende compacte */}
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap',
        gap: 10, padding: '4px 0 8px',
        borderBottom: `1px dashed ${t.lineSoft}`,
      }}>
        {['ok', 'alerte', 'critique', 'nonverif'].map((s) => {
          const cfg = stShape(s);
          return (
            <span key={s} style={{
              fontSize: 10, fontWeight: 700, color: t.text3,
              letterSpacing: 1, textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {cfg.shape === 'dot' && <span style={{ width: 9, height: 9, borderRadius: '50%', background: cfg.color }}/>}
              {cfg.shape === 'tri' && (<svg width="10" height="9" viewBox="0 0 10 9"><path d="M5 0.5l4.5 8h-9L5 0.5z" fill={cfg.color}/></svg>)}
              {cfg.shape === 'sq' && <span style={{ width: 9, height: 9, background: cfg.color }}/>}
              {cfg.shape === 'rh' && (<svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0.5l4.5 4.5L5 9.5 0.5 5z" stroke={cfg.color} strokeWidth="1.6" fill="none"/></svg>)}
              {cfg.label}
            </span>
          );
        })}
      </div>
      {INSP_ROWS.map((r, i) => {
        const cfg = stShape(r.status);
        return (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 4px',
            borderBottom: i === INSP_ROWS.length - 1 ? 0 : `1px solid ${t.lineSoft}`,
            minHeight: 44,
          }}>
            <span style={{
              fontFamily: D82.mono, fontSize: 11, color: t.text3,
              fontWeight: 700, width: 22, flexShrink: 0,
            }}>{String(i + 1).padStart(2, '0')}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text, lineHeight: 1.3 }}>{r.label}</div>
              <div style={{
                fontSize: 10, fontWeight: 800, color: cfg.color, marginTop: 2,
                letterSpacing: 1.2, textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {cfg.shape === 'dot' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }}/>}
                {cfg.shape === 'tri' && (<svg width="9" height="8" viewBox="0 0 9 8"><path d="M4.5 0.5l4 7h-8L4.5 0.5z" fill={cfg.color}/></svg>)}
                {cfg.shape === 'sq' && <span style={{ width: 8, height: 8, background: cfg.color }}/>}
                {cfg.shape === 'rh' && (<svg width="9" height="9" viewBox="0 0 9 9"><path d="M4.5 0.5l4 4-4 4-4-4z" stroke={cfg.color} strokeWidth="1.4" fill="none"/></svg>)}
                {cfg.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 2 · Diagnostic — STRUCTURÉ : système → pièce → DTC → sévérité → vocal + texte.
// 3 états : 'empty' (rien saisi · invite à enregistrer) ·
//           'recording' (vocal en cours · waveform live) ·
//           'rich' (filled · système choisi · DTC · sévérité · vocal terminé · texte)
const M_SYSTEMS = ['Freinage', 'Moteur', 'Transmission', 'Suspension', 'Électrique', 'Carrosserie'];

function MDiagSystemChips({ t, selected = 'Freinage' }) {
  return (
    <div>
      <div style={{
        fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
        color: t.text3, textTransform: 'uppercase', marginBottom: 8,
      }}>Système touché</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {M_SYSTEMS.map((sys) => {
          const sel = sys === selected;
          return (
            <span key={sys} style={{
              fontSize: 13, fontWeight: sel ? 700 : 600,
              padding: '7px 12px', borderRadius: 999, minHeight: 36,
              background: sel ? (t.mode === 'dark' ? 'rgba(26,142,126,0.22)' : 'rgba(26,142,126,0.12)') : t.surface2,
              color: sel ? t.text : t.text2,
              border: `1.5px solid ${sel ? D82.teal : t.line}`,
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              {sel && <MCheck size={12} color={D82.teal} sw={2.6}/>}
              {sys}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MDiagFieldRow({ t, label, value, mono, placeholder }) {
  const filled = !!value;
  return (
    <div style={{
      background: t.surface2, border: `1.5px solid ${t.line}`,
      borderRadius: 10, padding: '10px 12px', minHeight: 56,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
        color: t.text3, textTransform: 'uppercase',
        width: 86, flexShrink: 0,
      }}>{label}</div>
      <div style={{
        flex: 1, minWidth: 0,
        fontSize: 14, fontWeight: filled ? 700 : 500,
        color: filled ? t.text : t.text4,
        fontFamily: mono ? D82.mono : D82.ui,
        letterSpacing: mono ? 0.3 : 0,
      }}>{filled ? value : placeholder}</div>
      <MChev size={16} color={t.text3}/>
    </div>
  );
}

function MDiagSeverity({ t, selected = 'majeure' }) {
  const opts = [
    { id: 'mineure',  label: 'Mineure',  color: D82.ok,     shape: 'dot' },
    { id: 'majeure',  label: 'Majeure',  color: D82.orange, shape: 'tri' },
    { id: 'critique', label: 'Critique', color: D82.red,    shape: 'sq' },
  ];
  return (
    <div>
      <div style={{
        fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
        color: t.text3, textTransform: 'uppercase', marginBottom: 8,
      }}>Sévérité diagnostic</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {opts.map((o) => {
          const sel = o.id === selected;
          return (
            <button key={o.id} style={{
              flex: 1, minHeight: 54, padding: '8px 6px',
              background: sel ? o.color : t.surface2,
              border: `1.5px solid ${sel ? o.color : t.line}`,
              borderRadius: 10, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              color: sel ? '#fff' : t.text,
            }}>
              {o.shape === 'dot' && <span style={{ width: 12, height: 12, borderRadius: '50%', background: sel ? '#fff' : o.color }}/>}
              {o.shape === 'tri' && (<svg width="13" height="11" viewBox="0 0 13 11"><path d="M6.5 0.5l5.5 10h-11L6.5 0.5z" fill={sel ? '#fff' : o.color}/></svg>)}
              {o.shape === 'sq'  && <span style={{ width: 12, height: 12, background: sel ? '#fff' : o.color }}/>}
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3 }}>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MDiagVoice({ t, state = 'idle' }) {
  // 'idle' (rien · gros bouton enregistrer)
  // 'recording' (en cours · 00:08 · waveform live)
  // 'done' (00:32 · waveform lue)
  if (state === 'idle') {
    return (
      <div style={{
        background: t.surface2, border: `1.5px dashed ${t.line}`, borderRadius: 10,
        padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 12, minHeight: 76,
      }}>
        <button style={{
          width: 56, height: 56, borderRadius: 28, flexShrink: 0,
          background: D82.red, color: '#fff', border: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 8px 18px rgba(184,66,30,0.35)',
        }} aria-label="Enregistrer note vocale">
          <MIcon kind="mic" size={26} color="#fff"/>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
            color: t.text3, textTransform: 'uppercase',
          }}>Note vocale</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text2, marginTop: 2 }}>
            Tape pour parler · 60s max
          </div>
        </div>
      </div>
    );
  }
  if (state === 'recording') {
    return (
      <div style={{
        background: D82.redSoft, border: `1.5px solid ${D82.red}`, borderRadius: 10,
        padding: 12, display: 'flex', alignItems: 'center', gap: 12, minHeight: 76,
      }}>
        <button style={{
          width: 56, height: 56, borderRadius: 28, flexShrink: 0,
          background: D82.red, color: '#fff', border: `4px solid rgba(184,66,30,0.45)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 0 0 8px rgba(184,66,30,0.18)',
        }} aria-label="Arrêter">
          <span style={{ width: 18, height: 18, background: '#fff', borderRadius: 3 }}/>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
            color: D82.red, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: D82.red }}/>
            Enregistrement
          </div>
          <div style={{
            fontFamily: D82.mono, fontSize: 18, fontWeight: 700, color: t.text,
            letterSpacing: 0.5, marginTop: 2,
          }}>00:08</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>
            {[4,10,16,12,18,8,14,20,12,8,16,10,18,14,8,12,16,10,4,2].map((h,i) => (
              <span key={i} style={{
                width: 3, height: h, borderRadius: 1.5,
                background: i < 11 ? D82.red : t.text4,
              }}/>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // done
  return (
    <div style={{
      background: t.surface2, border: `1.5px solid ${t.line}`, borderRadius: 10,
      padding: 12, display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <button style={{
        width: 48, height: 48, borderRadius: 24, flexShrink: 0,
        background: D82.teal, color: '#fff', border: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 6px 14px rgba(26,142,126,0.30)',
      }} aria-label="Lire">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 5l12 7-12 7V5z" fill="#fff"/>
        </svg>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
          color: t.text3, textTransform: 'uppercase',
        }}>Note vocale · enregistrée</div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: t.text, marginTop: 2,
          fontFamily: D82.mono, letterSpacing: 0.5,
        }}>00:32</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>
          {[6,10,14,8,12,16,12,10,18,14,8,6,10,14,18,10,8,12,8,4,8,12,10,16,12].map((h,i) => (
            <span key={i} style={{
              width: 3, height: h, borderRadius: 1.5,
              background: i < 18 ? D82.teal : t.text4,
            }}/>
          ))}
        </div>
      </div>
      <button style={{
        background: 'transparent', border: `1.5px solid ${t.line}`,
        color: t.text2, fontSize: 11, fontWeight: 700,
        letterSpacing: 1, textTransform: 'uppercase',
        padding: '6px 10px', borderRadius: 6, cursor: 'pointer',
        minHeight: 34, flexShrink: 0,
      }}>Ré-enr.</button>
    </div>
  );
}

function MDiagBody({ t, state = 'rich' }) {
  // ─── État VIDE ───────────────────────────────────────
  if (state === 'empty') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <MDiagSystemChips t={t} selected={null}/>
        <MDiagFieldRow t={t} label="Pièce / sous-système" placeholder="Ex : Plaquettes AR · joint hydraulique…"/>
        <MDiagFieldRow t={t} label="Code défaut" placeholder="DTC · scanner OBD-II ou saisir" mono/>
        <MDiagVoice t={t} state="idle"/>
        <div>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
            color: t.text3, textTransform: 'uppercase', marginBottom: 6,
          }}>Texte court</div>
          <div style={{
            background: t.surface2, border: `1.5px dashed ${t.line}`,
            borderRadius: 10, padding: '14px 12px', minHeight: 76,
            fontSize: 13, color: t.text4, fontStyle: 'italic', fontWeight: 500,
          }}>
            Décris brièvement le défaut (1-2 lignes)…
          </div>
        </div>
      </div>
    );
  }

  // ─── État ENREGISTREMENT en cours ────────────────────
  if (state === 'recording') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <MDiagSystemChips t={t} selected="Freinage"/>
        <MDiagVoice t={t} state="recording"/>
        <div style={{
          padding: '10px 12px', borderRadius: 8,
          background: t.surface2, border: `1px dashed ${t.line}`,
          fontSize: 12, color: t.text3, fontStyle: 'italic', fontWeight: 500,
          textAlign: 'center',
        }}>
          Parle clairement — transcription automatique au stop.
        </div>
      </div>
    );
  }

  // ─── État RICHE (par défaut) ─────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <MDiagSystemChips t={t} selected="Freinage"/>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MDiagFieldRow t={t} label="Pièce / sous-système" value="Plaquettes & disque AR"/>
        <MDiagFieldRow t={t} label="Code défaut" value="C0040 · capteur ABS AR-D" mono/>
      </div>

      <MDiagSeverity t={t} selected="majeure"/>

      <MDiagVoice t={t} state="done"/>

      {/* Texte court */}
      <div>
        <div style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
          color: t.text3, textTransform: 'uppercase', marginBottom: 6,
        }}>Texte court</div>
        <div style={{
          background: t.surface2, border: `1.5px solid ${t.line}`,
          borderRadius: 10, padding: '10px 12px', minHeight: 64,
          fontSize: 14, color: t.text, lineHeight: 1.4, fontWeight: 500,
        }}>
          Plaquettes AR usées au-delà du témoin · disque rayé côté int.
          Liquide bas. Pas de bruit hors freinage.
        </div>
      </div>
    </div>
  );
}

// 3 · Pièces utilisées
const PIECES = [
  { ref: 'BRK-PLQ-AR-SCH', label: 'Plaquette frein AR · jeu', qty: 1, unit: 'jeu' },
  { ref: 'BRK-DSQ-AR-SCH', label: 'Disque frein AR Ø430', qty: 2, unit: 'pc' },
  { ref: 'FLD-FRN-DOT4',   label: 'Liquide frein DOT4',     qty: 1, unit: 'L' },
];
function MPiecesBody({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Rechercher / Scanner */}
      <div style={{
        background: t.surface2, border: `1.5px solid ${t.line}`, borderRadius: 10,
        padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, minHeight: 48,
      }}>
        <MIcon kind="search" size={20} color={t.text3}/>
        <span style={{ flex: 1, fontSize: 14, color: t.text3, fontWeight: 500 }}>
          Rechercher · réf. ou nom de pièce
        </span>
        <button style={{
          height: 32, padding: '0 10px', borderRadius: 6,
          background: D82.teal, color: '#fff', border: 0,
          fontFamily: D82.ui, fontSize: 11, fontWeight: 800,
          letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
        }}>Scanner</button>
      </div>

      {/* Liste pièces */}
      {PIECES.map((p, i) => (
        <div key={p.ref} style={{
          background: t.surface2, border: `1.5px solid ${t.line}`,
          borderRadius: 10, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 10, minHeight: 56,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text, lineHeight: 1.3 }}>{p.label}</div>
            <div style={{
              fontFamily: D82.mono, fontSize: 11, color: t.text3,
              fontWeight: 600, marginTop: 2, letterSpacing: 0.3,
            }}>{p.ref}</div>
          </div>
          {/* Stepper */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            background: t.surfaceMute, borderRadius: 8,
            border: `1.5px solid ${t.line}`, height: 40, flexShrink: 0,
          }}>
            <button style={{
              width: 36, height: 36, border: 0, background: 'transparent', color: t.text,
              fontSize: 18, fontWeight: 800, cursor: 'pointer',
            }}>−</button>
            <span style={{
              fontFamily: D82.mono, fontSize: 15, fontWeight: 700, color: t.text,
              minWidth: 36, textAlign: 'center', letterSpacing: 0.3,
            }}>{p.qty}</span>
            <button style={{
              width: 36, height: 36, border: 0, background: 'transparent', color: t.text,
              fontSize: 18, fontWeight: 800, cursor: 'pointer',
            }}>+</button>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, color: t.text3,
            letterSpacing: 1, textTransform: 'uppercase',
            width: 26, textAlign: 'right',
          }}>{p.unit}</span>
        </div>
      ))}

      {/* Ajouter */}
      <button style={{
        background: 'transparent', border: `1.5px dashed ${t.line}`,
        borderRadius: 10, padding: '12px', minHeight: 48,
        color: t.text2, fontFamily: D82.ui, fontSize: 13, fontWeight: 700,
        letterSpacing: 0.5, textTransform: 'uppercase', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <MIcon kind="plus" size={18} color={t.text2}/>
        Ajouter une pièce
      </button>
    </div>
  );
}

// 4 · Pneus — renvoi vers /mobile/pneu
// 5 · Carburant — renvoi vers /mobile/fuel
function MHandoffBody({ t, route, label, hint, ctaLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        background: t.surface2, border: `1.5px solid ${t.line}`,
        borderRadius: 10, padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: D82.okSoft, border: `1.5px solid ${D82.teal}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MIcon kind="arrowExt" size={20} color={D82.teal}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.3,
            color: D82.teal, textTransform: 'uppercase',
          }}>Module dédié · composant partagé</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginTop: 4, lineHeight: 1.35 }}>
            {label}
          </div>
          <div style={{ fontSize: 12, color: t.text3, marginTop: 4, fontWeight: 500, lineHeight: 1.4 }}>
            {hint}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            marginTop: 6,
            fontFamily: D82.mono, fontSize: 11, fontWeight: 700,
            color: t.text2, letterSpacing: 0.3,
            background: t.surfaceMute, padding: '3px 6px', borderRadius: 4,
            border: `1px solid ${t.line}`,
          }}>{route}</div>
        </div>
      </div>

      <button style={{
        background: D82.teal, color: '#fff', border: 0, borderRadius: 10,
        padding: '0 14px', minHeight: 52,
        fontFamily: D82.ui, fontSize: 15, fontWeight: 800,
        letterSpacing: 0.5, textTransform: 'uppercase', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: t.tealShadow,
      }}>
        {ctaLabel}
        <MIcon kind="arrowExt" size={18} color="#fff"/>
      </button>
    </div>
  );
}

// 6 · Photos — vignettes + bouton appareil
function MPhotosBody({ t }) {
  const PHOTOS = [
    { label: 'Plaquette AR · côté int.', time: '07:48' },
    { label: 'Disque AR · rayure',       time: '07:51' },
    { label: 'Réservoir liquide frein',  time: '07:53' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {PHOTOS.map((p, i) => (
          <div key={i} style={{
            aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden',
            background: t.mode === 'dark'
              ? `repeating-linear-gradient(45deg, #1A3556 0 8px, #15304F 8px 16px)`
              : `repeating-linear-gradient(45deg, ${t.lineSoft} 0 8px, ${t.line} 8px 16px)`,
            border: `1.5px solid ${t.line}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: 6,
          }}>
            <span style={{
              fontFamily: D82.mono, fontSize: 9, fontWeight: 700,
              color: t.mode === 'dark' ? '#7E94B5' : t.text3,
              background: t.surfaceMute, padding: '1px 4px', borderRadius: 3,
              alignSelf: 'flex-start',
              border: `1px solid ${t.line}`,
            }}>{p.time}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, color: '#fff',
              background: 'rgba(11,37,64,0.78)',
              padding: '3px 5px', borderRadius: 3,
              lineHeight: 1.2,
            }}>{p.label}</span>
          </div>
        ))}
        {/* Ajouter photo */}
        <button style={{
          aspectRatio: '1/1', borderRadius: 10,
          background: t.surfaceMute, border: `1.5px dashed ${D82.teal}`,
          cursor: 'pointer', color: D82.teal,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <MIcon kind="photos" size={22} color={D82.teal}/>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase' }}>+ Photo</span>
        </button>
      </div>
      <div style={{
        fontSize: 11, color: t.text3, fontWeight: 500, lineHeight: 1.4,
      }}>
        Une preuve par pièce · GPS + horodatage attachés automatiquement.
      </div>
    </div>
  );
}

// 7 · Notes — texte libre
function MNotesBody({ t }) {
  return (
    <div style={{
      background: t.surface2, border: `1.5px solid ${t.line}`,
      borderRadius: 10, padding: '12px 14px', minHeight: 110,
      fontSize: 14, color: t.text, fontWeight: 500, lineHeight: 1.45,
    }}>
      Demander à passer un coup de souffleur sur l'étrier avant remontage —
      poussière de plaquettes très présente côté int. Penser à reposer le capteur
      d'usure dans le bon sens.
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// VUE 2 — écran complet · sections accordéon
// `open` = id de la section ouverte ('inspection'|'diagnostic'|'pieces'|'pneus'|'carburant'|'photos'|'notes'|null)
// ════════════════════════════════════════════════════════════
function MScreenDetail({ t, open = null, job, diagState = 'rich' }) {
  const j = job || INTERVENTIONS[0]; // OT-A-2026-0142

  const diagSummary = {
    empty:     'À renseigner · système → pièce → DTC',
    recording: 'Enregistrement en cours · 00:08',
    rich:      'Freinage · Majeure · DTC C0040 · vocal 00:32',
  }[diagState];
  const diagCount = { empty: '—', recording: 'REC', rich: 'OK' }[diagState];
  const diagTone  = { empty: 'orange', recording: 'red', rich: 'teal' }[diagState];

  const sections = [
    {
      id: 'inspection', icon: 'inspection', title: 'Inspection',
      summary: '6 points · 2 critiques · 1 alerte',
      count: '4/6', countTone: 'red',
      body: <MInspBody t={t}/>,
    },
    {
      id: 'diagnostic', icon: 'diagnostic', title: 'Diagnostic',
      summary: diagSummary,
      count: diagCount, countTone: diagTone,
      body: <MDiagBody t={t} state={diagState}/>,
    },
    {
      id: 'pieces', icon: 'pieces', title: 'Pièces utilisées',
      summary: '3 références consommées',
      count: '03', countTone: 'teal',
      body: <MPiecesBody t={t}/>,
    },
    {
      id: 'pneus', icon: 'pneus', title: 'Pneus', handoff: true,
      summary: 'Renvoi vers module Pointage pneu',
      count: '—', countTone: 'neutral',
      body: <MHandoffBody t={t}
        route="/mobile/pneu"
        label="Pointage pneu pour CT-007"
        hint="Schéma essieux · code position (MOT 2ESS-EXT-G) · photo série · compteur OCR. Ouvre le module dédié — composant partagé, jamais re-dessiné ici."
        ctaLabel="Ouvrir Pointage pneu"
      />,
    },
    {
      id: 'carburant', icon: 'carburant', title: 'Carburant / Système', handoff: true,
      summary: 'Renvoi vers module Carburant',
      count: '—', countTone: 'neutral',
      body: <MHandoffBody t={t}
        route="/mobile/fuel"
        label="Pointage carburant pour CT-007"
        hint="Plein gasoil · litres + compteur OCR + photo pistolet. Ouvre le module dédié — composant partagé, jamais re-dessiné ici."
        ctaLabel="Ouvrir Carburant"
      />,
    },
    {
      id: 'photos', icon: 'photos', title: 'Photos',
      summary: '3 preuves · caméra par pièce',
      count: '03', countTone: 'teal',
      body: <MPhotosBody t={t}/>,
    },
    {
      id: 'notes', icon: 'notes', title: 'Notes',
      summary: 'Texte libre — pour le prochain méca',
      count: '01', countTone: 'teal',
      body: <MNotesBody t={t}/>,
    },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <MJobHeader t={t} j={j}/>

      <MSectionLabel t={t} right={open ? '1 ouverte' : '7 sections'}>
        Sections de l'intervention
      </MSectionLabel>

      <div style={{ padding: '0 12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sections.map((s) => (
          <MAccordion key={s.id} t={t}
            icon={s.icon} title={s.title} summary={s.summary}
            count={s.count} countTone={s.countTone}
            open={open === s.id}
            handoff={s.handoff}
            body={s.body}
          />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Modale confirmation — Bloquer (orange) / Terminer (teal)
// Affichée par-dessus le détail (overlay) avant l'action irréversible.
// ════════════════════════════════════════════════════════════
function MConfirmSheet({ t, tone = 'teal', title, lead, summary, primaryLabel, secondaryLabel = 'Annuler', extra }) {
  const accent = tone === 'orange' ? D82.orange : D82.teal;
  const shadow = tone === 'orange' ? t.orangeShadow : t.tealShadow;
  const tag = tone === 'orange' ? 'Confirmer le blocage' : 'Confirmer la clôture';
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(6,12,22,0.62)',
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(2px)',
      zIndex: 10,
    }}>
      <div style={{
        width: '100%',
        background: t.surface,
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '14px 16px 16px',
        borderTop: `4px solid ${accent}`,
        boxShadow: '0 -22px 60px rgba(0,0,0,0.45)',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* Grip */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -4, marginBottom: 4 }}>
          <span style={{ width: 44, height: 4, borderRadius: 2, background: t.line }}/>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: accent, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {tone === 'orange'
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2.4"/><path d="M6 6l12 12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
              : <MCheck size={26} color="#fff"/>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
              color: accent, textTransform: 'uppercase',
            }}>{tag}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginTop: 2, lineHeight: 1.2, letterSpacing: -0.2 }}>
              {title}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, color: t.text2, fontWeight: 500, lineHeight: 1.45 }}>
          {lead}
        </div>

        {summary && (
          <div style={{
            background: t.surface2, border: `1.5px solid ${t.line}`,
            borderRadius: 10, padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {summary.map((r) => (
              <div key={r.k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8,
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
                  color: t.text3, textTransform: 'uppercase',
                }}>{r.k}</span>
                <span style={{
                  fontFamily: r.mono ? D82.mono : D82.ui,
                  fontSize: 13, fontWeight: 700, color: t.text,
                  letterSpacing: 0.3, textAlign: 'right',
                }}>{r.v}</span>
              </div>
            ))}
          </div>
        )}

        {extra}

        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            flex: '0 0 38%', height: 56, minHeight: 56,
            border: `2px solid ${t.mode === 'dark' ? '#F5F1E8' : '#0B2540'}`,
            background: 'transparent',
            color: t.mode === 'dark' ? '#F5F1E8' : '#0B2540',
            fontFamily: D82.ui, fontSize: 15, fontWeight: 700, letterSpacing: 0.4,
            textTransform: 'uppercase', borderRadius: 10, cursor: 'pointer',
          }}>{secondaryLabel}</button>
          <button style={{
            flex: 1, height: 60, minHeight: 60,
            background: accent, color: '#fff', border: 0, borderRadius: 10,
            fontFamily: D82.ui, fontSize: 17, fontWeight: 800, letterSpacing: 0.5,
            textTransform: 'uppercase', cursor: 'pointer',
            boxShadow: shadow,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {tone === 'orange'
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2.4"/><path d="M6 6l12 12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></svg>
              : <MCheck size={22} color="#fff"/>}
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function MScreenDetailWithSheet({ t, sheet }) {
  return (
    <>
      <MScreenDetail t={t} open={null}/>
      {sheet === 'bloquer' && (
        <MConfirmSheet t={t} tone="orange"
          title="Bloquer l'intervention ?"
          lead="Le véhicule reste en file atelier. Indique au chef d'atelier ce qui te bloque — il pourra commander la pièce ou réassigner."
          summary={[
            { k: 'OT atelier', v: 'OT-A-2026-0142', mono: true },
            { k: 'Véhicule',   v: 'CT-007 · 4271 TCB', mono: true },
            { k: 'Motif',      v: 'Pièce manquante' },
            { k: 'Référence',  v: 'BRK-DSQ-AR-SCH', mono: true },
          ]}
          primaryLabel="Bloquer"
          extra={
            <div style={{
              padding: '8px 12px', borderRadius: 8,
              background: D82.orangeSoft, border: `1px solid ${D82.orange}`,
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: t.text, fontWeight: 600,
            }}>
              <span style={{ width: 8, height: 8, background: D82.orange, flexShrink: 0 }}/>
              Le chef d'atelier reçoit une notification immédiate.
            </div>
          }
        />
      )}
      {sheet === 'terminer' && (
        <MConfirmSheet t={t} tone="teal"
          title="Terminer l'intervention ?"
          lead="Vérifie le récap avant clôture · l'OT passe en « Terminé » et le véhicule sort de la file atelier."
          summary={[
            { k: 'OT atelier',    v: 'OT-A-2026-0142', mono: true },
            { k: 'Véhicule',      v: 'CT-007 · 4271 TCB', mono: true },
            { k: 'Inspection',    v: '6/6 vérifiés' },
            { k: 'Pièces',        v: '03 consommées' },
            { k: 'Photos',        v: '03 preuves' },
            { k: 'Durée réelle',  v: '02:18', mono: true },
          ]}
          primaryLabel="Terminer"
        />
      )}
    </>
  );
}

Object.assign(window, {
  MJobHeader, MAccordion,
  MInspBody, MDiagBody, MPiecesBody, MHandoffBody, MPhotosBody, MNotesBody,
  MScreenDetail, MConfirmSheet, MScreenDetailWithSheet,
});
