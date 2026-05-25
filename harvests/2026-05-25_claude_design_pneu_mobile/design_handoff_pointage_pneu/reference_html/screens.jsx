// LOI Pointage Pneu — Five screens. Static-ish content, designed
// for under-pressure field use. All data is real Premium Logistics
// (SCHACMAN F3000 6X4 / KERAX · CT-001..CT-015 · sites Madagascar).

// ════════════════════════════════════════════════════════════
// Shared atoms
// ════════════════════════════════════════════════════════════

function PencilEdit({ size = 18, color = LOI.steel }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M14 4l6 6-11 11H3v-6L14 4z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon({ size = 22, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StatusDot({ color, ring }) {
  return (
    <span style={{
      width: 10, height: 10, borderRadius: '50%',
      background: color, flexShrink: 0,
      boxShadow: ring ? `0 0 0 3px ${ring}` : 'none',
    }} />
  );
}

function ToConfirm({ children = 'À CONFIRMER' }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
      color: LOI.orange, background: 'rgba(199,126,42,0.10)',
      border: `1px solid rgba(199,126,42,0.40)`,
      padding: '2px 6px', borderRadius: 3,
      fontFamily: LOI.ui, textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ════════════════════════════════════════════════════════════
// 1 · VÉHICULE — search + scan plate + recent list
// ════════════════════════════════════════════════════════════
function Screen1Vehicle() {
  const recents = [
    { code: 'CT-007', plate: '4271 TCB', model: 'SCHACMAN F3000 6X4',
      site: 'Garage Betainomby', lastUsed: 'aujourd\'hui · 06:18', selected: true },
    { code: 'CT-002', plate: '1183 TCB', model: 'SCHACMAN F3000 6X4',
      site: 'Toamasina · PDP', lastUsed: 'hier · 17:42' },
    { code: 'CT-011', plate: '5602 TCB', model: 'RENAULT KERAX',
      site: 'APC Andriamena · RN44', lastUsed: '22 mai · 11:05' },
    { code: 'CT-005', plate: '2945 TCB', model: 'SCHACMAN F3000 6X4',
      site: 'Moramanga · relais', lastUsed: '21 mai · 14:30' },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Hero: Scan plaque — biggest target */}
      <div style={{ padding: '16px 16px 0' }}>
        <button style={{
          width: '100%', minHeight: 92, padding: '14px 18px',
          background: LOI.navy, color: '#fff', border: 0, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 8px 20px rgba(11,37,64,0.22)',
          textAlign: 'left',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 10,
            background: LOI.teal, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {/* Camera + frame icon */}
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="#fff" strokeWidth="2"/>
              <circle cx="12" cy="13.5" r="3.5" stroke="#fff" strokeWidth="2"/>
              <path d="M8 7l1.5-3h5L16 7" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 1.6,
              color: '#9CD4C9', textTransform: 'uppercase',
            }}>Action recommandée</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 3, letterSpacing: -0.2 }}>
              Scanner la plaque
            </div>
            <div style={{ fontSize: 13, color: '#B7C9E0', marginTop: 2 }}>
              Pointe l'appareil sur la plaque arrière
            </div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* OR divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px 8px',
      }}>
        <div style={{ flex: 1, height: 1, background: LOI.divider }} />
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
          color: LOI.steel, textTransform: 'uppercase',
        }}>ou</span>
        <div style={{ flex: 1, height: 1, background: LOI.divider }} />
      </div>

      {/* Search field */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          minHeight: 56, background: LOI.card, border: `1.5px solid ${LOI.line}`,
          borderRadius: 10, padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.5" stroke={LOI.steel} strokeWidth="2"/>
            <path d="M16 16l4 4" stroke={LOI.steel} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ flex: 1, color: LOI.steel2, fontSize: 16 }}>
            Code véhicule ou plaque
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: LOI.steel,
            letterSpacing: 1, padding: '4px 8px', borderRadius: 4,
            background: LOI.lineSoft,
          }}>CT-…</span>
        </div>
      </div>

      {/* Recents header */}
      <div style={{
        padding: '20px 18px 8px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 11, fontWeight: 800, color: LOI.ink,
          letterSpacing: 1.5, textTransform: 'uppercase',
        }}>Tes véhicules récents</span>
        <span style={{ fontSize: 12, color: LOI.steel }}>4 derniers</span>
      </div>

      {/* Recents list */}
      <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recents.map((v) => (
          <div key={v.code} style={{
            background: LOI.card,
            border: v.selected ? `2px solid ${LOI.teal}` : `1px solid ${LOI.line}`,
            borderRadius: 10, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
            minHeight: 72,
            boxShadow: v.selected ? '0 6px 16px rgba(26,142,126,0.18)' : 'none',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
              background: v.selected ? LOI.teal : LOI.lineSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {v.selected ? <CheckIcon size={26} /> : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M3 16V7h11l4 4v5" stroke={LOI.navy} strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="7" cy="17" r="2.2" stroke={LOI.navy} strokeWidth="2"/>
                  <circle cx="16" cy="17" r="2.2" stroke={LOI.navy} strokeWidth="2"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontFamily: LOI.mono, fontSize: 16, fontWeight: 700, color: LOI.navy,
                }}>{v.code}</span>
                <span style={{
                  fontFamily: LOI.mono, fontSize: 13, color: LOI.steel,
                }}>·</span>
                <span style={{
                  fontFamily: LOI.mono, fontSize: 14, color: LOI.ink2, letterSpacing: 0.5,
                }}>{v.plate}</span>
              </div>
              <div style={{ fontSize: 13, color: LOI.ink2, marginTop: 2, fontWeight: 500 }}>
                {v.model}
              </div>
              <div style={{
                fontSize: 12, color: LOI.steel, marginTop: 2,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z" stroke={LOI.steel} strokeWidth="1.8"/>
                  <circle cx="12" cy="9" r="2.2" stroke={LOI.steel} strokeWidth="1.8"/>
                </svg>
                {v.site} <span style={{ color: LOI.steel2 }}>· {v.lastUsed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        padding: '0 18px 12px', fontSize: 11, color: LOI.steel2,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <ToConfirm>Format plaque</ToConfirm>
        <span>masque exact à valider avec LOI</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2 · POSITION ESSIEU — top-down truck schematic, tap a wheel
// ════════════════════════════════════════════════════════════
function TruckDiagram({ selected = '2ESS-EXT-G' }) {
  // 6x4: axle 1 directrice (2 wheels simples), axles 2 & 3 motrices (4 wheels jumelées)
  const wheels = [
    // axle 1
    { code: '1ESS-G',     x: 28,  y: 188, w: 46, h: 64, axle: 1 },
    { code: '1ESS-D',     x: 286, y: 188, w: 46, h: 64, axle: 1 },
    // axle 2 (jumelées)
    { code: '2ESS-EXT-G', x: 12,  y: 322, w: 46, h: 64, axle: 2 },
    { code: '2ESS-INT-G', x: 66,  y: 322, w: 46, h: 64, axle: 2 },
    { code: '2ESS-INT-D', x: 248, y: 322, w: 46, h: 64, axle: 2 },
    { code: '2ESS-EXT-D', x: 302, y: 322, w: 46, h: 64, axle: 2 },
    // axle 3 (jumelées)
    { code: '3ESS-EXT-G', x: 12,  y: 440, w: 46, h: 64, axle: 3 },
    { code: '3ESS-INT-G', x: 66,  y: 440, w: 46, h: 64, axle: 3 },
    { code: '3ESS-INT-D', x: 248, y: 440, w: 46, h: 64, axle: 3 },
    { code: '3ESS-EXT-D', x: 302, y: 440, w: 46, h: 64, axle: 3 },
  ];

  return (
    <svg viewBox="0 0 360 540" style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* FRONT marker */}
      <text x="180" y="20" textAnchor="middle"
        fontFamily={LOI.ui} fontSize="11" fontWeight="800"
        letterSpacing="2" fill={LOI.steel}>AVANT</text>
      <path d="M170 28 L180 36 L190 28" stroke={LOI.steel2} strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Cab */}
      <rect x="100" y="48" width="160" height="100" rx="14"
        fill={LOI.navy} />
      <rect x="116" y="62" width="128" height="44" rx="6" fill={LOI.navy3} opacity="0.7"/>
      <rect x="120" y="118" width="48" height="22" rx="4" fill={LOI.navy3} opacity="0.5"/>
      <rect x="192" y="118" width="48" height="22" rx="4" fill={LOI.navy3} opacity="0.5"/>

      {/* Chassis */}
      <rect x="130" y="148" width="100" height="360" rx="4" fill={LOI.navy2} opacity="0.85"/>
      {/* Subtle chassis rails */}
      <line x1="148" y1="148" x2="148" y2="508" stroke={LOI.navy} strokeWidth="1" opacity="0.5"/>
      <line x1="212" y1="148" x2="212" y2="508" stroke={LOI.navy} strokeWidth="1" opacity="0.5"/>

      {/* Rear bumper */}
      <rect x="116" y="508" width="128" height="14" rx="3" fill={LOI.navy} />

      {/* Axle bars */}
      <rect x="60"  y="216" width="240" height="8"  rx="2" fill={LOI.ink2} opacity="0.8"/>
      <rect x="22"  y="350" width="316" height="8"  rx="2" fill={LOI.ink2} opacity="0.8"/>
      <rect x="22"  y="468" width="316" height="8"  rx="2" fill={LOI.ink2} opacity="0.8"/>

      {/* Axle labels */}
      <g fontFamily={LOI.mono} fontSize="11" fontWeight="700" fill={LOI.steel}>
        <text x="180" y="172" textAnchor="middle">ESSIEU 1 · directeur</text>
        <text x="180" y="306" textAnchor="middle">ESSIEU 2 · motrice</text>
        <text x="180" y="424" textAnchor="middle">ESSIEU 3 · motrice</text>
      </g>

      {/* Wheels */}
      {wheels.map((w) => {
        const isSel = w.code === selected;
        return (
          <g key={w.code}>
            <rect
              x={w.x} y={w.y} width={w.w} height={w.h} rx={10}
              fill={isSel ? LOI.teal : '#23303F'}
              stroke={isSel ? LOI.teal : '#101820'}
              strokeWidth={isSel ? 3 : 1.5}
            />
            {/* tread bars */}
            {[0, 1, 2, 3].map((i) => (
              <rect key={i}
                x={w.x + 6}
                y={w.y + 10 + i * 12}
                width={w.w - 12}
                height={4}
                rx={1}
                fill={isSel ? '#0F6E60' : '#0B1018'}
                opacity={isSel ? 0.65 : 0.85}
              />
            ))}
            {isSel && (
              <>
                {/* selection halo */}
                <rect
                  x={w.x - 6} y={w.y - 6}
                  width={w.w + 12} height={w.h + 12} rx={14}
                  fill="none" stroke={LOI.teal} strokeWidth="2"
                  strokeDasharray="3 4" opacity="0.65"
                />
                {/* check badge */}
                <circle cx={w.x + w.w / 2} cy={w.y + w.h + 16} r="11" fill={LOI.teal}/>
                <path d={`M${w.x + w.w / 2 - 4} ${w.y + w.h + 16} l3 3 l6 -6`}
                  stroke="#fff" strokeWidth="2.4" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </>
            )}
          </g>
        );
      })}

      {/* G / D markers */}
      <g fontFamily={LOI.ui} fontSize="11" fontWeight="800" fill={LOI.steel2} letterSpacing="1.5">
        <text x="14" y="540" textAnchor="start">← GAUCHE</text>
        <text x="346" y="540" textAnchor="end">DROITE →</text>
      </g>
    </svg>
  );
}

function Screen2Position() {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Instruction strip */}
      <div style={{
        background: LOI.tealSoft, padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${LOI.line}`,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%', background: LOI.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: LOI.mono, fontSize: 14, fontWeight: 700,
          flexShrink: 0,
        }}>2</div>
        <div style={{ flex: 1, fontSize: 14, color: LOI.navy, fontWeight: 600 }}>
          Tape sur le pneu concerné
        </div>
        <span style={{
          fontFamily: LOI.mono, fontSize: 11, fontWeight: 700,
          color: LOI.navy3, letterSpacing: 0.5,
        }}>SCHACMAN 6×4</span>
      </div>

      {/* Diagram */}
      <div style={{ padding: '4px 12px 0', flex: 1 }}>
        <TruckDiagram selected="2ESS-EXT-G" />
      </div>

      {/* Code badge */}
      <div style={{
        margin: '0 16px 12px', padding: '14px 16px',
        background: LOI.navy, color: '#fff',
        borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 8, background: LOI.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckIcon size={24}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.6,
            color: '#9CD4C9', textTransform: 'uppercase',
          }}>Code position</div>
          <div style={{
            fontFamily: LOI.mono, fontSize: 22, fontWeight: 700, letterSpacing: 0.5,
            marginTop: 1,
          }}>MOT 2ESS-EXT-G</div>
          <div style={{ fontSize: 12, color: '#B7C9E0', marginTop: 2 }}>
            Essieu 2 · Extérieur · Gauche
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3 · TYPE D'ÉVÉNEMENT — 5 big tiles
// ════════════════════════════════════════════════════════════
function EventTile({ icon, label, desc, selected, accent = LOI.teal }) {
  return (
    <button style={{
      width: '100%', minHeight: 88, padding: '14px 16px',
      background: LOI.card,
      border: selected ? `2px solid ${accent}` : `1.5px solid ${LOI.line}`,
      borderRadius: 12, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
      boxShadow: selected ? `0 6px 18px rgba(26,142,126,0.20)` : 'none',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 10, flexShrink: 0,
        background: selected ? accent : LOI.lineSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon(selected ? '#fff' : LOI.navy)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 18, fontWeight: 800, color: LOI.navy,
          letterSpacing: -0.2,
        }}>{label}</div>
        <div style={{ fontSize: 13, color: LOI.steel, marginTop: 2, fontWeight: 500 }}>
          {desc}
        </div>
      </div>
      {selected ? (
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}><CheckIcon size={20}/></div>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke={LOI.steel2} strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

function Screen3Event() {
  const iconInspection = (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke={c} strokeWidth="2.2"/>
      <path d="M16 16l5 5" stroke={c} strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  );
  const iconMontage = (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v18M3 12h18" stroke={c} strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/>
    </svg>
  );
  const iconDepose = (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/>
      <path d="M7 12h10" stroke={c} strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  );
  const iconReparation = (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M14 4l6 6-9 9-6 1 1-6 8-10z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 6l6 6" stroke={c} strokeWidth="2"/>
    </svg>
  );
  const iconRemplacement = (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M4 8h12l-3-3M20 16H8l3 3" stroke={c} strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px 16px' }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: LOI.steel,
        letterSpacing: 1.5, textTransform: 'uppercase',
        padding: '0 4px 10px',
      }}>Que fais-tu sur ce pneu ?</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <EventTile icon={iconInspection} label="Inspection"
          desc="Contrôle visuel · pression · état" />
        <EventTile icon={iconMontage} label="Montage"
          desc="Pose d'un pneu neuf ou recreusé" selected />
        <EventTile icon={iconDepose} label="Dépose"
          desc="Retrait sans remplacement immédiat" />
        <EventTile icon={iconReparation} label="Réparation"
          desc="Plug · vulcanisation · valve" />
        <EventTile icon={iconRemplacement} label="Remplacement"
          desc="Dépose + montage d'un autre pneu" accent={LOI.orange}/>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4 · DÉTAILS — marque · n° série · km · photo
// ════════════════════════════════════════════════════════════
function DetailCard({ idx, label, value, sub, action, status = 'done', accent, mono = false }) {
  // status: 'done' | 'active' | 'todo'
  const isDone = status === 'done';
  const isActive = status === 'active';
  const ringColor = isDone ? LOI.teal : (isActive ? LOI.navy : LOI.line);
  return (
    <div style={{
      background: LOI.card,
      border: `1.5px solid ${isActive ? LOI.navy : LOI.line}`,
      borderRadius: 12,
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      minHeight: 76,
      boxShadow: isActive ? `0 4px 14px rgba(11,37,64,0.12)` : 'none',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: isDone ? LOI.teal : (isActive ? LOI.navy : LOI.lineSoft),
        color: isDone || isActive ? '#fff' : LOI.steel,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: LOI.mono, fontWeight: 700, fontSize: 14,
      }}>
        {isDone ? <CheckIcon size={18}/> : idx}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
          color: LOI.steel, textTransform: 'uppercase',
        }}>{label}</div>
        <div style={{
          fontSize: mono ? 17 : 17,
          fontFamily: mono ? LOI.mono : LOI.ui,
          fontWeight: 700, color: LOI.navy,
          marginTop: 2, letterSpacing: mono ? 0.5 : -0.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{value}</div>
        {sub && (
          <div style={{ fontSize: 12, color: LOI.steel, marginTop: 2 }}>{sub}</div>
        )}
      </div>
      {action}
    </div>
  );
}

function Screen4Details() {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Top context strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', background: LOI.tealSoft,
        borderRadius: 8, border: `1px solid rgba(26,142,126,0.20)`,
      }}>
        <StatusDot color={LOI.teal} ring="rgba(26,142,126,0.20)"/>
        <span style={{ fontSize: 12, color: LOI.navy, fontWeight: 600 }}>
          CT-007 · <span style={{ fontFamily: LOI.mono }}>MOT 2ESS-EXT-G</span> · Montage
        </span>
      </div>

      <DetailCard
        idx={1} label="Marque pneu"
        value="Michelin XZA2"
        sub="315/80 R22.5 · 154/150 M"
        status="done"
        action={<button style={editBtn}>Modifier</button>}
      />
      <DetailCard
        idx={2} label="N° série pneu" mono
        value="Y82C19A2387"
        sub={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Scanné via DOT/QR <ToConfirm>format à valider</ToConfirm>
        </span>}
        status="done"
        action={<button style={editBtn}>Rescan</button>}
      />
      <DetailCard
        idx={3} label="Kilométrage véhicule" mono
        value="184 350 km"
        sub="Saisi via pavé numérique"
        status="done"
        action={<button style={editBtn}>Modifier</button>}
      />

      {/* Photo card — has a thumbnail */}
      <div style={{
        background: LOI.card, border: `1.5px solid ${LOI.line}`, borderRadius: 12,
        padding: 12, display: 'flex', alignItems: 'center', gap: 12, minHeight: 92,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: LOI.teal, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><CheckIcon size={18}/></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
            color: LOI.steel, textTransform: 'uppercase',
          }}>Photo preuve</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: LOI.navy, marginTop: 2 }}>
            1 photo · 07:39
          </div>
          <div style={{ fontSize: 12, color: LOI.steel, marginTop: 2 }}>
            Pneu en place · gauche essieu 2
          </div>
        </div>
        {/* Thumbnail placeholder — diagonal stripes */}
        <div style={{
          width: 64, height: 64, borderRadius: 8, flexShrink: 0,
          background: `repeating-linear-gradient(45deg, ${LOI.lineSoft} 0 8px, ${LOI.line} 8px 16px)`,
          border: `1.5px solid ${LOI.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <span style={{
            fontFamily: LOI.mono, fontSize: 9, color: LOI.steel,
            background: 'rgba(245,241,232,0.85)', padding: '2px 4px', borderRadius: 3,
          }}>photo</span>
        </div>
      </div>

      {/* Auto-saved hint */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginTop: 2,
        fontSize: 12, color: LOI.steel,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M20 7L9 18l-5-5" stroke={LOI.green} strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Enregistré localement · sera envoyé dès le réseau
      </div>
    </div>
  );
}

const editBtn = {
  border: `1.5px solid ${LOI.line}`,
  background: LOI.card, color: LOI.navy,
  fontFamily: LOI.ui, fontSize: 12, fontWeight: 700,
  letterSpacing: 1, textTransform: 'uppercase',
  padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
  minHeight: 36, flexShrink: 0,
};

// ════════════════════════════════════════════════════════════
// 5 · CONFIRMATION — saved · summary · next
// ════════════════════════════════════════════════════════════
function SummaryRow({ k, v, mono }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 12, padding: '10px 0',
      borderBottom: `1px solid ${LOI.lineSoft}`,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
        color: LOI.steel, textTransform: 'uppercase', flexShrink: 0,
      }}>{k}</span>
      <span style={{
        fontSize: 14, fontWeight: 600, color: LOI.navy,
        fontFamily: mono ? LOI.mono : LOI.ui,
        textAlign: 'right', letterSpacing: mono ? 0.3 : 0,
      }}>{v}</span>
    </div>
  );
}

function Screen5Confirm() {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Hero success */}
      <div style={{
        background: LOI.navy, color: '#fff',
        padding: '20px 18px 22px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: `1px solid ${LOI.navy2}`,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: LOI.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 6px rgba(26,142,126,0.25)',
          flexShrink: 0,
        }}>
          <CheckIcon size={34}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.3 }}>
            Enregistré
          </div>
          <div style={{ fontSize: 13, color: '#B7C9E0', marginTop: 3 }}>
            Pointage ajouté à la file locale · sync au réseau
          </div>
        </div>
      </div>

      {/* Reference number */}
      <div style={{
        padding: '12px 18px',
        background: LOI.tealSoft,
        borderBottom: `1px solid ${LOI.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
          color: LOI.navy, textTransform: 'uppercase',
        }}>Référence locale</span>
        <span style={{
          fontFamily: LOI.mono, fontSize: 15, fontWeight: 700, color: LOI.navy,
        }}>PNEU-2026-0524-0042</span>
      </div>

      {/* Summary card */}
      <div style={{ padding: '14px 16px 8px' }}>
        <div style={{
          background: LOI.card, border: `1.5px solid ${LOI.line}`,
          borderRadius: 12, padding: '8px 16px 10px',
        }}>
          <SummaryRow k="Véhicule" v="CT-007 · 4271 TCB" mono/>
          <SummaryRow k="Modèle" v="SCHACMAN F3000 6×4"/>
          <SummaryRow k="Position" v="MOT 2ESS-EXT-G" mono/>
          <SummaryRow k="Événement" v="Montage"/>
          <SummaryRow k="Marque" v="Michelin XZA2 · 315/80 R22.5"/>
          <SummaryRow k="N° série" v="Y82C19A2387" mono/>
          <SummaryRow k="Kilométrage" v="184 350 km" mono/>
          <SummaryRow k="Photo" v="1 jointe"/>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 12, padding: '10px 0 4px',
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
              color: LOI.steel, textTransform: 'uppercase',
            }}>Mécanicien · heure</span>
            <span style={{
              fontSize: 14, fontWeight: 600, color: LOI.navy,
              fontFamily: LOI.mono,
            }}>PL-MEC-007 · 07:42</span>
          </div>
        </div>
      </div>

      {/* Sync queue indicator */}
      <div style={{
        margin: '6px 16px 0',
        padding: '12px 14px',
        background: LOI.card, borderRadius: 10,
        border: `1px dashed ${LOI.line}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(199,126,42,0.14)',
          border: `1.5px solid rgba(199,126,42,0.40)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 12a8 8 0 0114-5.3L20 5M20 12a8 8 0 01-14 5.3L4 19"
              stroke={LOI.orange} strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M20 5v4h-4M4 19v-4h4"
              stroke={LOI.orange} strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: LOI.navy }}>
            3 pointages en file
          </div>
          <div style={{ fontSize: 12, color: LOI.steel, marginTop: 1 }}>
            Envoi automatique dès le retour du réseau
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Screen1Vehicle, Screen2Position, Screen3Event, Screen4Details, Screen5Confirm,
  TruckDiagram,
});
