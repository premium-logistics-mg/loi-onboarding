// HSE Terrain — Design canvas : 6 onglets + flux déclaration + détails + light + notes.

function HseApp() {
  const chip = <HAgentChip matricule="PL-HSE-007" />;

  const tab = (name, body, opts = {}) => (
    <HPhone theme={opts.theme || 'dark'} tab={name}
      crumb={opts.crumb || 'LOI · HSE Terrain'}
      title={opts.title}
      right={chip}
      body={body}
      action={opts.action}
      tabAlert={opts.tabAlert}
    />
  );

  return (
    <DesignCanvas
      title="LOI · HSE Terrain — Mobile (D82)"
      subtitle="Agent HSE · une main · gants · plein soleil · parfois sans réseau · sécurité = rapidité d'action"
    >

      {/* ─── DARK · 6 onglets ────────────────────────────── */}
      <DCSection
        id="dark"
        title="6 onglets · DARK (par défaut)"
        subtitle="Cabine / véhicule de service · glare réduit · barre pouce 6 modules · 1 alerte critique sur Actions"
      >
        <DCArtboard id="d-accueil" label="01 · Accueil · 2 héros + worklist" width={395} height={832}>
          {tab('accueil',
            <HScreenAccueil/>,
            { title: 'Accueil', tabAlert: { id: 'actions', count: 2 } }
          )}
        </DCArtboard>

        <DCArtboard id="d-capture" label="02 · Capture · viewfinder" width={395} height={832}>
          {tab('capture',
            <HScreenCapture/>,
            {
              title: 'Capture preuve',
              action: <HActionBar primary="Enregistrer la preuve" primaryEnabled hint="Label : « Fuite hydraulique »" primaryIcon="check"/>,
            }
          )}
        </DCArtboard>

        <DCArtboard id="d-inspection" label="03 · Inspection · 4 états" width={395} height={832}>
          {tab('inspection',
            <HScreenInspection/>,
            {
              title: 'Inspection',
              action: <HActionBar primary="Envoyer inspection" secondary="+ Item" primaryEnabled hint="1 critique · 2 alerte · 2 non vérifié" primaryIcon="send" primaryTone="red"/>,
            }
          )}
        </DCArtboard>

        <DCArtboard id="d-actions" label="04 · Actions ACT-2026 · Clôturer" width={395} height={832}>
          {tab('actions',
            <HScreenActions/>,
            { title: 'Actions', tabAlert: { id: 'actions', count: 2 } }
          )}
        </DCArtboard>

        <DCArtboard id="d-feed" label="05 · Feed · fil compact" width={395} height={832}>
          {tab('feed',
            <HScreenFeed/>,
            { title: 'Feed' }
          )}
        </DCArtboard>

        <DCArtboard id="d-epi" label="06 · EPI · bascule + compteur" width={395} height={832}>
          {tab('epi',
            <HScreenEpi/>,
            {
              title: 'EPI',
              action: <HActionBar primary="Valider conformité EPI" secondary="Réinit." primaryEnabled={false} hint="1 EPI non conforme · à régler avant validation" primaryIcon="check"/>,
            }
          )}
        </DCArtboard>
      </DCSection>

      {/* ─── Flux déclaration ────────────────────────────── */}
      <DCSection
        id="declare"
        title="Flux déclaration · incident → enregistré"
        subtitle="Lancé depuis le héros rouge de l'Accueil · 3-5 taps · sévérité = couleur + forme + libellé · critique = cascade HSE"
      >
        <DCArtboard id="dc-1" label="Étape · Sévérité critique" width={395} height={832}>
          <HPhone theme="dark" tab="accueil" tabBar={false}
            crumb="EVT-2026 · cascade"
            title="Déclaration incident"
            right={chip}
            showBack
            body={<HScreenDeclare severity="critique"/>}
            action={<HActionBar primary="Envoyer incident" secondary="Retour" primaryEnabled hint="Critique · cascade TER + ACT-2026" primaryIcon="send" primaryTone="red"/>}
          />
        </DCArtboard>

        <DCArtboard id="dc-2" label="Étape · Sévérité majeure" width={395} height={832}>
          <HPhone theme="dark" tab="accueil" tabBar={false}
            crumb="EVT-2026 · alerte"
            title="Déclaration incident"
            right={chip}
            showBack
            body={<HScreenDeclare severity="majeure"/>}
            action={<HActionBar primary="Envoyer incident" secondary="Retour" primaryEnabled hint="Majeure · TER notifié" primaryIcon="send"/>}
          />
        </DCArtboard>

        <DCArtboard id="dc-saved" label="État · Enregistré + cascade" width={395} height={832}>
          <HPhone theme="dark" tab="feed" tabBar={false}
            crumb="EVT-2026-0207 · file"
            title="Enregistré"
            right={chip}
            showBack={false}
            body={<HScreenSaved/>}
            action={<HActionBar primary="Nouvel événement" secondary="Fermer" primaryEnabled primaryIcon="check"/>}
          />
        </DCArtboard>
      </DCSection>

      {/* ─── LIGHT · plein soleil ────────────────────────── */}
      <DCSection
        id="light"
        title="LIGHT · plein soleil"
        subtitle="Anti-miroir sous lumière directe — header navy conservé pour repérage instantané du module"
      >
        <DCArtboard id="l-accueil" label="01 · Accueil (light)" width={395} height={832}>
          {tab('accueil',
            <HScreenAccueil/>,
            { theme: 'light', title: 'Accueil', tabAlert: { id: 'actions', count: 2 } }
          )}
        </DCArtboard>

        <DCArtboard id="l-inspection" label="03 · Inspection (light)" width={395} height={832}>
          {tab('inspection',
            <HScreenInspection/>,
            {
              theme: 'light', title: 'Inspection',
              action: <HActionBar primary="Envoyer inspection" secondary="+ Item" primaryEnabled hint="1 critique · 2 alerte · 2 non vérifié" primaryIcon="send" primaryTone="red"/>,
            }
          )}
        </DCArtboard>

        <DCArtboard id="l-epi" label="06 · EPI (light)" width={395} height={832}>
          {tab('epi',
            <HScreenEpi/>,
            {
              theme: 'light', title: 'EPI',
              action: <HActionBar primary="Valider conformité EPI" secondary="Réinit." primaryEnabled={false} hint="1 EPI non conforme · à régler avant validation" primaryIcon="check"/>,
            }
          )}
        </DCArtboard>
      </DCSection>

      {/* ─── États ───────────────────────────────────────── */}
      <DCSection
        id="states"
        title="États clairs · vide & succès"
        subtitle="« Rien d'urgent » et « Enregistré » — l'agent voit immédiatement le résultat de son action"
      >
        <DCArtboard id="s-empty" label="Accueil · Rien d'urgent" width={395} height={832}>
          {tab('accueil',
            <HScreenEmpty/>,
            { title: 'Accueil' }
          )}
        </DCArtboard>

        <DCArtboard id="s-empty-light" label="Accueil · Rien d'urgent (light)" width={395} height={832}>
          {tab('accueil',
            <HScreenEmpty/>,
            { theme: 'light', title: 'Accueil' }
          )}
        </DCArtboard>
      </DCSection>

      {/* ─── Notes ───────────────────────────────────────── */}
      <DCSection
        id="notes"
        title="Notes de conception · décisions terrain"
        subtitle="Pourquoi cette forme — agent HSE, une main, gants, soleil, pression, parfois sans réseau"
      >
        <DCArtboard id="n-system" label="Système D82 appliqué" width={520} height={620}>
          <HseNotesSystem/>
        </DCArtboard>
        <DCArtboard id="n-rules" label="Règles métier verrouillées" width={460} height={620}>
          <HseNotesRules/>
        </DCArtboard>
        <DCArtboard id="n-open" label="À CONFIRMER avec LOI" width={460} height={620}>
          <HseNotesOpen/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

// ─── Notes ──────────────────────────────────────────────────
function HNoteShell({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box',
      background: '#FFFFFF', color: '#0B2540', padding: '22px 24px',
      fontFamily: D82.ui, fontSize: 14, lineHeight: 1.5,
      borderRadius: 12, border: `1px solid #D7D2C2`,
      overflow: 'auto',
    }}>{children}</div>
  );
}
function HNH({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
      color: '#5E6B7C', textTransform: 'uppercase',
      marginTop: 14, marginBottom: 6,
    }}>{children}</div>
  );
}
function HNBullet({ children }) {
  return (
    <li style={{ display: 'flex', gap: 10, padding: '6px 0', listStyle: 'none' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: D82.teal, marginTop: 9, flexShrink: 0 }}/>
      <span style={{ flex: 1 }}>{children}</span>
    </li>
  );
}
function HNMono({ children }) {
  return (
    <span style={{
      fontFamily: D82.mono, fontSize: 12, fontWeight: 600,
      background: '#EDE8D8', padding: '1px 5px', borderRadius: 3, color: '#0B2540',
    }}>{children}</span>
  );
}

function HseNotesSystem() {
  return (
    <HNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Système D82 · agent HSE
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Sécurité = rapidité d'action. Module orienté action, pas tableau analytique.
      </div>
      <HNH>Couleur — D82 strict</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Navy <HNMono>#0B2540</HNMono> header dans les deux modes · repérage instantané du module.</HNBullet>
        <HNBullet>Teal <HNMono>#1A8E7E</HNMono> = action primaire, OK, validation. Rouge <HNMono>#B8421E</HNMono> = incident + critique uniquement. Orange <HNMono>#C77E2A</HNMono> = alerte.</HNBullet>
        <HNBullet>Interdit : cyan · bleu accent · violet · vert générique. Rouge ne s'utilise jamais en chrome ou en accent décoratif.</HNBullet>
      </ul>
      <HNH>Forme — jamais couleur seule</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Inspection : 4 états avec <b>pastille + forme + libellé</b>. Rond = OK · Triangle = Alerte · Carré = Critique · Losange = Non vérifié.</HNBullet>
        <HNBullet>Sévérité incident reprise du module chauffeur : Rond / Triangle / Carré.</HNBullet>
      </ul>
      <HNH>Typographie</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet><b>Inter</b> body 15-16 / titres 22 · libellés caps 10-11 / letter-spacing 1.5.</HNBullet>
        <HNBullet><b>IBM Plex Mono</b> sur TOUT chiffre : compteurs (28-38px), codes <HNMono>INSP-2026</HNMono> <HNMono>EVT-2026</HNMono> <HNMono>ACT-2026</HNMono>, horaires, GPS, plaques.</HNBullet>
      </ul>
      <HNH>Targets terrain</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Héros Accueil <b>96px</b> · primaire d'envoi <b>64px</b> · bouton Clôturer 44px · onglets bas 56px. Gants OK.</HNBullet>
        <HNBullet>Icônes <b>trait fin</b> partout. Zéro emoji.</HNBullet>
      </ul>
    </HNoteShell>
  );
}

function HseNotesRules() {
  return (
    <HNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Logique métier · verrouillée
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Reprise telle quelle du brief. Aucune réinterprétation produit.
      </div>
      <HNH>Accueil</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet><b>2 héros dominants en haut</b> ≥88px : « Signaler incident » rouge · « Observation / Toolbox QSHE » teal. Pas de dashboard avant.</HNBullet>
        <HNBullet>4 compteurs worklist : À faire · En cours · Critiques · Du jour · gros chiffres mono.</HNBullet>
        <HNBullet>File des inspections du jour · l'item en retard est entouré rouge + carré + libellé.</HNBullet>
      </ul>
      <HNH>Déclaration</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Type d'incident en pills (6 options) · photo preuve · note vocale · GPS auto · sévérité.</HNBullet>
        <HNBullet>Critique = cascade auto : TER alerté + ACT-2026 créée + INSP rattachée si applicable. Affichage explicite avant envoi.</HNBullet>
      </ul>
      <HNH>Capture</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Viewfinder caméra HTML5 natif · label requis avant l'enregistrement · tags rapides (6 options).</HNBullet>
        <HNBullet>Métadonnées attachées : Site · GPS · Horaire — visibles en pied de viseur.</HNBullet>
      </ul>
      <HNH>Inspection</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>4 états par item · pastille forme + couleur + libellé. Items groupés par section (Véhicule, Charge, Site, Documents).</HNBullet>
        <HNBullet>≥1 item critique → bandeau « cascade HSE » + bouton d'envoi rouge.</HNBullet>
      </ul>
      <HNH>Actions / Feed / EPI</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet><b>Actions</b> : segments Ouvertes / Clos / Toutes · bouton Clôturer 44px sur chaque carte ouverte · code <HNMono>ACT-2026</HNMono> en mono.</HNBullet>
        <HNBullet><b>Feed</b> : rail vertical avec pastille forme/couleur · 5 derniers events · code <HNMono>EVT-2026</HNMono>.</HNBullet>
        <HNBullet><b>EPI</b> : 7 bascules · compteur conformes X/total en hero (38px mono) · « Valider conformité EPI » désactivé si ≠ total.</HNBullet>
      </ul>
    </HNoteShell>
  );
}

function HseNotesOpen() {
  return (
    <HNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        À CONFIRMER avec LOI
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Aucune donnée inventée. Zones en attente de validation produit.
      </div>
      <HNH>Identifiants &amp; login</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Format matricule agent : <HNMono>PL-HSE-XXX</HNMono> proposé · à figer.</HNBullet>
        <HNBullet>PIN universel : longueur, durée de session, déverrouillage biométrique optionnel.</HNBullet>
      </ul>
      <HNH>Catalogue HSE</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Liste exacte des types d'incident · 6 catégories proposées (Véhicule · Personne · Charge · Environnement · Route · Autre).</HNBullet>
        <HNBullet>Items inspection officiels par type (site / véhicule / charge / documents) — version v1 à valider.</HNBullet>
        <HNBullet>Catalogue EPI obligatoires par poste / chantier — 7 EPI montrés ici sont indicatifs.</HNBullet>
      </ul>
      <HNH>Cascade HSE</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Critique → TER notifié : canal (push, SMS, radio) à confirmer.</HNBullet>
        <HNBullet>Règles de création auto <HNMono>ACT-2026</HNMono> : délai par défaut, responsable, gabarits par type d'incident.</HNBullet>
      </ul>
      <HNH>Codes &amp; numérotation</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Format <HNMono>INSP-2026-####</HNMono> · <HNMono>EVT-2026-####</HNMono> · <HNMono>ACT-2026-####</HNMono> · numéroteur local + reconciliation serveur.</HNBullet>
      </ul>
      <HNH>Caméra &amp; offline</HNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <HNBullet>Permission caméra refusée → fallback (uploader photo, dessiner) ?</HNBullet>
        <HNBullet>Plafond file offline : nombre d'événements + taille des médias avant alerte stockage.</HNBullet>
      </ul>
    </HNoteShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HseApp />);
