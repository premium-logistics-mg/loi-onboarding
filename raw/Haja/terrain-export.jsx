/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard,
          Icon, T, NavBar, MicroLabel, Chip, PrimaryBtn, GhostBtn,
          ConfirmBadge, PhoneFrame */

// ════════════════════════════════════════════════════════════════
// LOI · Terrain Export — Module mobile (375 × 812)
// Bernardin · Mode E mining · Transit · Port de Toamasina
// 5 écrans + 4 variantes d'écran 3 · dark défaut + light
// ════════════════════════════════════════════════════════════════

// ───── Data réelle (zéro invention) ─────
const ACTIVE = {
  ref: "FAE260017",
  matiere: "Chrome Concentrate",
  matCode: "CHR-C",
  quai: "MOCCO",
  closingLbl: "jeu 28 mai",
  jrel: 2,
};
const RECENTS = [
  { ref: "FAE260002", matiere: "Chrome Lumpy", matCode: "CHR-L", quai: "PDP", closingLbl: "mar 02 juin", jrel: 7 },
  { ref: "FAE260011", matiere: "Mica",         matCode: "MICA",  quai: "C4",  closingLbl: "mar 09 juin", jrel: 14 },
];
const CABINETS = [
  { id: "herizo", name: "Herizo" },
  { id: "toky",   name: "Toky"   },
];
const EVENT_TYPES = [
  { id: "empotage",  label: "Empotage",          icon: "container", sub: "n° conteneur · tonnage" },
  { id: "quai",      label: "Mise à quai",       icon: "anchor",    sub: "position · closing" },
  { id: "pvcc",      label: "PV-CC",             icon: "clipboard", sub: "photo + référence" },
  { id: "inspect",   label: "Inspection",        icon: "shield",    sub: "Herizo · Toky" },
  { id: "photo",     label: "Photo preuve",      icon: "camera",    sub: "caméra simple" },
  { id: "anomalie",  label: "Anomalie",          icon: "alert",     sub: "alerte Ando" },
];

// ────────────────────────────────────────────────────────────────
// Atomes spécifiques au module
// ────────────────────────────────────────────────────────────────

// Big J-X (closing date relative)
function BigJ({ value, status = "warn", size = 56 }) {
  const col = status === "err" ? T.err : status === "ok" ? T.ok : T.warn;
  return (
    <div style={{
      fontFamily: T.mono, fontWeight: 500, fontSize: size, lineHeight: 1,
      letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums",
      color: col, display: "inline-flex", alignItems: "baseline",
    }}>
      <span style={{ fontSize: size * 0.55, marginRight: 2, fontWeight: 500 }}>J-</span>
      {value}
    </div>
  );
}

// Carte dossier
function DossierCard({ d, active, status }) {
  const st = status ?? (d.jrel <= 3 ? "warn" : d.jrel <= 7 ? "warn" : "ok");
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${active ? T.accent : T.border}`,
      borderRadius: 10,
      padding: active ? 18 : 14,
      display: "flex", flexDirection: "column", gap: active ? 14 : 8,
      boxShadow: active ? "var(--shadow-1)" : "none",
      position: "relative",
    }}>
      {active && (
        <div style={{
          position: "absolute", top: -1, right: -1,
          fontFamily: T.mono, fontSize: 9, fontWeight: 600,
          color: T.accentFg, background: T.accent,
          padding: "3px 8px", borderRadius: "0 9px 0 6px",
          letterSpacing: "0.08em",
        }}>EN COURS</div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{
          fontFamily: T.mono, fontWeight: 500,
          fontSize: active ? 22 : 16, color: T.fg1,
          letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums",
        }}>{d.ref}</div>
        {!active && <BigJ value={d.jrel} status={st} size={28}/>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Chip kind="accent">{d.matiere}</Chip>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.fg3 }}>
          {d.quai} · Toamasina
        </span>
      </div>

      {active && (
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: 12, paddingTop: 10, borderTop: `1px solid ${T.border}`,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <MicroLabel>Closing</MicroLabel>
            <div style={{ fontFamily: T.mono, fontSize: 13, color: T.fg1, fontVariantNumeric: "tabular-nums" }}>
              {d.closingLbl}
            </div>
            <div style={{ marginTop: 2 }}>
              <ConfirmBadge>destination à confirmer</ConfirmBadge>
            </div>
          </div>
          <BigJ value={d.jrel} status={st} size={56}/>
        </div>
      )}
    </div>
  );
}

// Strip contextuelle (dossier + matière, en haut de l'étape ≥ 2)
function ContextStrip({ d = ACTIVE }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 10, padding: "10px 12px",
      background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8,
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <Icon name="container" size={18} color={T.accent}/>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 500, color: T.fg1, letterSpacing: "-0.01em" }}>
            {d.ref}
          </span>
          <span style={{ fontSize: 11, color: T.fg3 }}>
            {d.matiere} · {d.quai}
          </span>
        </div>
      </div>
      <BigJ value={d.jrel} status="warn" size={26}/>
    </div>
  );
}

// Tile (gros bouton tap target) — type d'événement
function EventTile({ t, primary }) {
  return (
    <button style={{
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      alignItems: "flex-start", textAlign: "left",
      background: primary ? T.accentSoft : T.surface,
      border: `1px solid ${primary ? "transparent" : T.border}`,
      borderRadius: 10,
      padding: 14,
      height: 124, width: "100%",
      cursor: "pointer", color: T.fg1,
      fontFamily: T.sans,
    }}>
      <Icon name={t.icon} size={28} stroke={1.6} color={primary ? T.accent : T.fg1}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{t.label}</span>
        <span style={{ fontSize: 11, color: T.fg3 }}>{t.sub}</span>
      </div>
    </button>
  );
}

// Numpad (3 colonnes × 4 rangées)
function Numpad({ active = "7" }) {
  const keys = [
    "1","2","3",
    "4","5","6",
    "7","8","9",
    ",","0","⌫",
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
      gap: 6, width: "100%",
    }}>
      {keys.map((k) => {
        const isBack = k === "⌫";
        const isHot  = k === active;
        return (
          <div key={k} style={{
            height: 52, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: isHot ? T.accentSoft : T.surface,
            border: `1px solid ${isHot ? T.accent : T.border}`,
            fontFamily: T.mono, fontSize: 22, fontWeight: 500,
            color: isHot ? T.accent : T.fg1,
            fontVariantNumeric: "tabular-nums",
          }}>
            {isBack ? <Icon name="backspace" size={22} color={T.fg2}/> : k}
          </div>
        );
      })}
    </div>
  );
}

// Field row (label + valeur + bouton scan optionnel)
function ScanField({ label, value, placeholder, icon = "scan", confirmed }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <MicroLabel>{label}</MicroLabel>
      <div style={{
        display: "flex", alignItems: "stretch", gap: 8,
      }}>
        <div style={{
          flex: 1,
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "0 14px",
          display: "flex", alignItems: "center",
          fontFamily: T.mono, fontSize: 18, fontWeight: 500,
          letterSpacing: "0.02em", color: value ? T.fg1 : T.fg3,
          minHeight: 56,
        }}>
          {value || placeholder}
          {confirmed && <Icon name="check" size={16} color={T.ok} style={{ marginLeft: "auto" }}/>}
        </div>
        <button style={{
          width: 56, minHeight: 56, borderRadius: 8,
          background: T.accentSoft, border: `1px solid transparent`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: T.accent, cursor: "pointer",
        }}>
          <Icon name={icon} size={22} stroke={1.8}/>
        </button>
      </div>
    </div>
  );
}

// Photo placeholder (tap pour caméra)
function PhotoSlot({ label = "Photo preuve", filled = false, height = 100 }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <MicroLabel>{label}</MicroLabel>
      <div style={{
        height,
        border: `1.5px dashed ${filled ? T.accent : T.border}`,
        borderRadius: 8,
        background: filled ? T.accentSoft : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        color: filled ? T.accent : T.fg2,
        fontFamily: T.sans, fontSize: 14, fontWeight: 500,
      }}>
        <Icon name="camera" size={22} stroke={1.6}/>
        <span>{filled ? "1 photo · taper pour relancer" : "Toucher pour photographier"}</span>
      </div>
    </div>
  );
}

// Bandeau session agent
function AgentBar() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingBottom: 6, marginBottom: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 999,
          background: T.surface2, border: `1px solid ${T.border}`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: T.fg2,
        }}>
          <Icon name="user" size={16}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.fg1 }}>Bernardin</span>
          <span style={{ fontSize: 10, color: T.fg3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Mode E · Transit
          </span>
        </div>
      </div>
      <Chip kind="ok" icon="circle">en ligne</Chip>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 1 — Dossier export (sélection / scan)
// ════════════════════════════════════════════════════════════════
function Screen1Dossier() {
  return (
    <>
      <NavBar onBack="" step={1} total={5} right="01 · 05"/>
      <AgentBar/>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: T.fg1, letterSpacing: "-0.015em", margin: 0 }}>
        Dossier export
      </h2>
      <p style={{ color: T.fg2, fontSize: 13, marginTop: 4, marginBottom: 14 }}>
        Choisir le dossier en cours.
      </p>

      <DossierCard d={ACTIVE} active/>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 10px" }}>
        <div style={{ flex: 1, height: 1, background: T.border }}/>
        <MicroLabel style={{ fontSize: 9 }}>autres dossiers</MicroLabel>
        <div style={{ flex: 1, height: 1, background: T.border }}/>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {RECENTS.map((d) => <DossierCard key={d.ref} d={d}/>)}
      </div>

      <div style={{ flex: 1 }}/>

      <PrimaryBtn icon="qr">Scanner QR dossier</PrimaryBtn>
      <div style={{ height: 12 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 2 — Type d'événement
// ════════════════════════════════════════════════════════════════
function Screen2Type() {
  return (
    <>
      <NavBar step={2} total={5}/>
      <ContextStrip/>

      <h2 style={{ fontSize: 22, fontWeight: 600, color: T.fg1, letterSpacing: "-0.015em", margin: 0 }}>
        Type d'événement
      </h2>
      <p style={{ color: T.fg2, fontSize: 13, marginTop: 4, marginBottom: 14 }}>
        Que capturer maintenant ?
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 10, flex: 1, alignContent: "start",
      }}>
        {EVENT_TYPES.map((t, i) => (
          <EventTile key={t.id} t={t} primary={i === 0}/>
        ))}
      </div>

      <div style={{ height: 8 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 3 — Détails · EMPOTAGE (variante principale)
// ════════════════════════════════════════════════════════════════
function Screen3Empotage() {
  return (
    <>
      <NavBar step={3} total={5} right="empotage"/>
      <ContextStrip/>

      <ScanField label="N° conteneur" value="MSCU 723 941 1" icon="scan" confirmed/>

      <div style={{ height: 14 }}/>

      <MicroLabel>Tonnage chargé</MicroLabel>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 6,
        marginTop: 2, marginBottom: 10,
        paddingBottom: 8, borderBottom: `1px solid ${T.border}`,
      }}>
        <span style={{
          fontFamily: T.mono, fontSize: 56, fontWeight: 500,
          color: T.fg1, lineHeight: 1, letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}>27,4</span>
        <span style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 500, color: T.fg3, marginLeft: 4 }}>
          t
        </span>
        <span style={{ marginLeft: "auto", color: T.fg3, fontFamily: T.mono, fontSize: 11 }}>
          ø max 28,0 t
        </span>
      </div>

      <Numpad/>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 10px" }}>
        <MicroLabel>matière</MicroLabel>
        <Chip kind="accent" icon="check">Chrome Concentrate</Chip>
        <span style={{ marginLeft: "auto", color: T.fg3, fontSize: 11 }}>verrouillée · dossier</span>
      </div>

      <PhotoSlot height={80}/>

      <div style={{ flex: 1 }}/>
      <PrimaryBtn icon="chevron-right">Continuer</PrimaryBtn>
      <div style={{ height: 10 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 4 — Confirmation + Signature
// ════════════════════════════════════════════════════════════════
function RecapRow({ k, v, mono }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "10px 0", borderTop: `1px solid ${T.border}`, gap: 12,
    }}>
      <span style={{ fontSize: 12, color: T.fg3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {k}
      </span>
      <span style={{
        fontSize: 13, color: T.fg1, fontWeight: mono ? 500 : 500,
        fontFamily: mono ? T.mono : T.sans, textAlign: "right",
        fontVariantNumeric: "tabular-nums",
      }}>{v}</span>
    </div>
  );
}

function SignaturePad() {
  return (
    <div style={{ marginTop: 4 }}>
      <MicroLabel>Signature agent terrain</MicroLabel>
      <div style={{
        marginTop: 6, height: 110, borderRadius: 8,
        border: `1.5px dashed ${T.border}`,
        background: T.surface, position: "relative",
        display: "flex", alignItems: "flex-end", padding: 12,
      }}>
        {/* Squiggle */}
        <svg viewBox="0 0 320 70" width="100%" height="70" style={{ position: "absolute", inset: 12, right: 12, bottom: 12, left: 12 }}>
          <path d="M10 50 Q 40 10 70 35 T 130 30 Q 170 60 200 25 T 280 35 L 305 35"
                stroke={T.fg1} strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
        <div style={{
          position: "relative", display: "flex", justifyContent: "space-between",
          width: "100%", alignItems: "baseline",
        }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.fg3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Bernardin
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.fg3 }}>26/05/26 · 14:32</span>
        </div>
      </div>
    </div>
  );
}

function Screen4Confirmation() {
  return (
    <>
      <NavBar step={4} total={5} right="confirmation"/>

      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
        padding: "4px 16px 8px", marginBottom: 14,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0",
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 500, color: T.fg1, letterSpacing: "-0.01em" }}>
              {ACTIVE.ref}
            </span>
            <span style={{ fontSize: 11, color: T.fg3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              événement · empotage
            </span>
          </div>
          <Chip kind="accent" icon="container">empotage</Chip>
        </div>
        <RecapRow k="Conteneur" v="MSCU 723 941 1" mono/>
        <RecapRow k="Tonnage"   v="27,4 t" mono/>
        <RecapRow k="Matière"   v="Chrome Concentrate"/>
        <RecapRow k="Photo"     v="1 fichier · 2,4 Mo" mono/>
        <RecapRow k="Position"  v="Port Toamasina · MOCCO"/>
        <RecapRow k="Heure"     v="26/05/26 · 14:32" mono/>
      </div>

      <SignaturePad/>

      <div style={{ flex: 1 }}/>

      <PrimaryBtn icon="send">Envoyer · Ando</PrimaryBtn>
      <div style={{ height: 8 }}/>
      <button style={{
        height: 44, background: "transparent", border: 0,
        color: T.fg2, fontSize: 13, fontFamily: T.sans, fontWeight: 500,
        textDecoration: "underline", cursor: "pointer",
      }}>
        Modifier les détails
      </button>
      <div style={{ height: 4 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 5 — Résumé enregistré
// ════════════════════════════════════════════════════════════════
function Screen5Resume() {
  return (
    <>
      <NavBar onBack="Menu" step={5} total={5} right="enregistré"/>

      <div style={{ flex: 0.4 }}/>

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        gap: 16,
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 999,
          background: T.accentSoft, color: T.accent,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${T.accent}`,
        }}>
          <Icon name="check" size={42} stroke={2.2}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: T.fg1, letterSpacing: "-0.02em", margin: 0 }}>
            Enregistré
          </h2>
          <p style={{ color: T.fg2, fontSize: 14, margin: 0 }}>
            Transmis à Ando · Resp. Op. Export
          </p>
        </div>
      </div>

      <div style={{
        marginTop: 24,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
        padding: "4px 16px 8px",
      }}>
        <RecapRow k="Référence"  v="EVT-260526-0142" mono/>
        <RecapRow k="Dossier"    v={ACTIVE.ref} mono/>
        <RecapRow k="Type"       v="Empotage · 27,4 t"/>
        <RecapRow k="Horodatage" v="26/05/26 · 14:32" mono/>
        <RecapRow k="Cabinet"    v={<><span>Herizo</span> <ConfirmBadge>en file</ConfirmBadge></>} mono/>
      </div>

      <div style={{ flex: 1 }}/>

      <PrimaryBtn icon="plus">Nouveau · {ACTIVE.ref}</PrimaryBtn>
      <div style={{ height: 8 }}/>
      <GhostBtn icon="refresh">Changer de dossier</GhostBtn>
      <div style={{ height: 6 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 3 — Variante PV-CC (constat)
// ════════════════════════════════════════════════════════════════
function Screen3PVCC() {
  return (
    <>
      <NavBar step={3} total={5} right="PV-CC"/>
      <ContextStrip/>

      <MicroLabel>Procès-verbal de constat</MicroLabel>

      <div style={{
        marginTop: 8, height: 240, borderRadius: 10,
        border: `1.5px dashed ${T.accent}`, background: T.accentSoft,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
        color: T.accent,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999, background: T.surface,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="camera" size={28} stroke={1.6}/>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Photographier le PV</div>
        <div style={{ fontSize: 11, color: T.fg2 }}>recto · vignettes auto</div>
      </div>

      <div style={{ height: 14 }}/>
      <ScanField label="Référence PV" value="" placeholder="PV-CC-…" icon="scan"/>

      <div style={{ height: 12 }}/>
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
        padding: 12, display: "flex", alignItems: "center", gap: 10,
      }}>
        <Icon name="send" size={18} color={T.accent}/>
        <span style={{ fontSize: 12, color: T.fg2, lineHeight: 1.4 }}>
          Envoi pour validation <b style={{ color: T.fg1 }}>Ando</b> dès enregistrement.
        </span>
      </div>

      <div style={{ flex: 1 }}/>
      <PrimaryBtn icon="chevron-right">Continuer</PrimaryBtn>
      <div style={{ height: 10 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 3 — Variante MISE À QUAI
// ════════════════════════════════════════════════════════════════
function QuaiOption({ code, label, selected }) {
  return (
    <button style={{
      flex: 1, height: 92, borderRadius: 10,
      background: selected ? T.accentSoft : T.surface,
      border: `1.5px solid ${selected ? T.accent : T.border}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 4, cursor: "pointer", color: T.fg1, fontFamily: T.sans,
    }}>
      <span style={{
        fontFamily: T.mono, fontSize: 26, fontWeight: 500,
        color: selected ? T.accent : T.fg1, letterSpacing: "-0.01em",
      }}>{code}</span>
      <span style={{ fontSize: 11, color: T.fg3, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </span>
    </button>
  );
}

function Screen3MiseAQuai() {
  return (
    <>
      <NavBar step={3} total={5} right="mise à quai"/>
      <ContextStrip/>

      <MicroLabel>Position quai</MicroLabel>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <QuaiOption code="PDP"   label="poste principal"/>
        <QuaiOption code="MOCCO" label="conteneurs" selected/>
        <QuaiOption code="C4"    label="vrac"/>
      </div>

      <div style={{ height: 18 }}/>

      <MicroLabel>Vérification closing</MicroLabel>
      <div style={{
        marginTop: 6,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
        padding: 16, display: "flex", flexDirection: "column", gap: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: T.fg3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Closing prévu
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 13, color: T.fg1 }}>{ACTIVE.closingLbl}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BigJ value={ACTIVE.jrel} status="warn" size={64}/>
          <Chip kind="warn" icon="alert">marge serrée</Chip>
        </div>
        <div style={{ paddingTop: 8, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: T.fg2 }}>Confirmer la date à quai ?</span>
          <div style={{ display: "flex", gap: 6 }}>
            <Chip kind="ok" icon="check">conforme</Chip>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }}/>
      <PhotoSlot label="Photo quai" height={88}/>

      <div style={{ flex: 1 }}/>
      <PrimaryBtn icon="chevron-right">Continuer</PrimaryBtn>
      <div style={{ height: 10 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 3 — Variante INSPECTION CABINET
// ════════════════════════════════════════════════════════════════
function CabinetRow({ c, present }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
      padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 999,
          background: T.surface2, border: `1px solid ${T.border}`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: T.fg2,
        }}>
          <Icon name="shield" size={20}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: T.fg1 }}>{c.name}</span>
          <span style={{ fontSize: 11, color: T.fg3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Cabinet Mines/Forêts
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button style={{
          minWidth: 56, height: 44, padding: "0 12px", borderRadius: 8,
          background: present ? T.ok : "transparent",
          border: `1px solid ${present ? "transparent" : T.border}`,
          color: present ? "#fff" : T.fg2,
          fontFamily: T.sans, fontSize: 13, fontWeight: 600,
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
          cursor: "pointer",
        }}>
          {present && <Icon name="check" size={14} stroke={2.4}/>}
          oui
        </button>
        <button style={{
          minWidth: 56, height: 44, padding: "0 12px", borderRadius: 8,
          background: present === false ? T.err : "transparent",
          border: `1px solid ${present === false ? "transparent" : T.border}`,
          color: present === false ? "#fff" : T.fg2,
          fontFamily: T.sans, fontSize: 13, fontWeight: 600,
          cursor: "pointer",
        }}>
          non
        </button>
      </div>
    </div>
  );
}

function Screen3Inspection() {
  return (
    <>
      <NavBar step={3} total={5} right="inspection"/>
      <ContextStrip/>

      <MicroLabel>Cabinet présent sur site</MicroLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        <CabinetRow c={CABINETS[0]} present={true}/>
        <CabinetRow c={CABINETS[1]} present={false}/>
      </div>

      <div style={{ height: 14 }}/>
      <PhotoSlot label="Photo inspection" height={110}/>

      <div style={{ height: 10 }}/>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: 12,
        background: T.warnSoft, borderRadius: 8,
      }}>
        <Icon name="alert" size={18} color={T.warn} stroke={1.8}/>
        <span style={{ fontSize: 12, color: T.warn, lineHeight: 1.35 }}>
          Toky <b>absent</b> — note auto à Ando pour relance.
        </span>
      </div>

      <div style={{ flex: 1 }}/>
      <PrimaryBtn icon="chevron-right">Continuer</PrimaryBtn>
      <div style={{ height: 10 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉCRAN 3 — Variante ANOMALIE
// ════════════════════════════════════════════════════════════════
function SeverityChip({ icon, label, color, soft, selected }) {
  return (
    <button style={{
      flex: 1, height: 70, borderRadius: 10,
      background: selected ? soft : T.surface,
      border: `1.5px solid ${selected ? color : T.border}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
      color: selected ? color : T.fg2,
      cursor: "pointer",
      fontFamily: T.sans,
    }}>
      <Icon name={icon} size={22} stroke={selected ? 2 : 1.6}/>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </span>
    </button>
  );
}

function Screen3Anomalie() {
  return (
    <>
      <NavBar step={3} total={5} right="anomalie"/>
      <ContextStrip/>

      <MicroLabel>Type d'anomalie</MicroLabel>
      <div style={{
        marginTop: 6,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
        padding: "0 14px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 15, color: T.fg1, fontWeight: 500 }}>
          Bâche déchirée
        </span>
        <Icon name="chevron-down" size={20} color={T.fg3}/>
      </div>

      <div style={{ height: 14 }}/>
      <MicroLabel>Sévérité</MicroLabel>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <SeverityChip icon="circle"   label="mineure"   color={T.ok}   soft={T.okSoft}/>
        <SeverityChip icon="triangle" label="majeure"   color={T.warn} soft={T.warnSoft} selected/>
        <SeverityChip icon="square"   label="critique"  color={T.err}  soft={T.errSoft}/>
      </div>

      <div style={{ height: 14 }}/>
      <PhotoSlot label="Photo preuve" height={88}/>

      <div style={{ height: 12 }}/>
      <MicroLabel>Note vocale</MicroLabel>
      <div style={{
        marginTop: 6,
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
        padding: 12, display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 999,
          background: T.warnSoft, color: T.warn,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${T.warn}`,
        }}>
          <Icon name="mic" size={22} stroke={1.8}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {/* fake waveform */}
          <svg height="22" viewBox="0 0 200 22" style={{ width: "100%" }}>
            {[6,12,4,18,10,16,8,20,14,6,12,18,10,4,8,16,12,6,10,14].map((h, i) => (
              <rect key={i} x={i * 10} y={11 - h/2} width="4" height={h}
                    fill={i < 12 ? T.warn : T.border} rx="1"/>
            ))}
          </svg>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.fg3 }}>0:07 · enregistrement…</span>
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <PrimaryBtn icon="chevron-right" style={{ background: T.warn, color: "#fff" }}>
        Envoyer alerte · Ando
      </PrimaryBtn>
      <div style={{ height: 10 }}/>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// Wrapping helper — un PhoneFrame qui rend un écran donné
// ════════════════════════════════════════════════════════════════
function Phone({ dark, children }) {
  return <PhoneFrame dark={dark}>{children}</PhoneFrame>;
}

// ════════════════════════════════════════════════════════════════
// App — Canvas
// ════════════════════════════════════════════════════════════════
function App() {
  const W = 375, H = 812;
  return (
    <DesignCanvas
      title="Terrain Export — module mobile"
      subtitle="LOI · agent terrain Bernardin · Port Toamasina · D82"
    >
      <DCSection id="dark-flow"
        title="Flux principal · dark"
        subtitle="Capture rapide d'un empotage, du scan dossier à la transmission Ando. 5 écrans, 3-5 taps chacun.">
        <DCArtboard id="d1" label="01 · Dossier export" width={W} height={H}>
          <Phone dark><Screen1Dossier/></Phone>
        </DCArtboard>
        <DCArtboard id="d2" label="02 · Type d'événement" width={W} height={H}>
          <Phone dark><Screen2Type/></Phone>
        </DCArtboard>
        <DCArtboard id="d3" label="03 · Détails · empotage" width={W} height={H}>
          <Phone dark><Screen3Empotage/></Phone>
        </DCArtboard>
        <DCArtboard id="d4" label="04 · Confirmation + signature" width={W} height={H}>
          <Phone dark><Screen4Confirmation/></Phone>
        </DCArtboard>
        <DCArtboard id="d5" label="05 · Enregistré · Ando" width={W} height={H}>
          <Phone dark><Screen5Resume/></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="details-variants"
        title="Écran 3 · détails — par type d'événement"
        subtitle="Quatre variantes du même slot, optimisées pour le geste terrain : photo, scan, sélection rapide, voix.">
        <DCArtboard id="v-pvcc" label="3b · PV-CC (constat)" width={W} height={H}>
          <Phone dark><Screen3PVCC/></Phone>
        </DCArtboard>
        <DCArtboard id="v-quai" label="3c · Mise à quai" width={W} height={H}>
          <Phone dark><Screen3MiseAQuai/></Phone>
        </DCArtboard>
        <DCArtboard id="v-insp" label="3d · Inspection cabinet" width={W} height={H}>
          <Phone dark><Screen3Inspection/></Phone>
        </DCArtboard>
        <DCArtboard id="v-anom" label="3e · Anomalie" width={W} height={H}>
          <Phone dark><Screen3Anomalie/></Phone>
        </DCArtboard>
      </DCSection>

      <DCSection id="light-flow"
        title="Flux principal · light"
        subtitle="Variante light haute lisibilité plein soleil — pour cas où le dark perd en contraste sur quai.">
        <DCArtboard id="l1" label="01 · Dossier export" width={W} height={H}>
          <Phone><Screen1Dossier/></Phone>
        </DCArtboard>
        <DCArtboard id="l2" label="02 · Type d'événement" width={W} height={H}>
          <Phone><Screen2Type/></Phone>
        </DCArtboard>
        <DCArtboard id="l3" label="03 · Détails · empotage" width={W} height={H}>
          <Phone><Screen3Empotage/></Phone>
        </DCArtboard>
        <DCArtboard id="l4" label="04 · Confirmation + signature" width={W} height={H}>
          <Phone><Screen4Confirmation/></Phone>
        </DCArtboard>
        <DCArtboard id="l5" label="05 · Enregistré · Ando" width={W} height={H}>
          <Phone><Screen5Resume/></Phone>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
