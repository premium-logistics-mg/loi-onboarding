// Atelier Méca — Design canvas (D82) · 2 vues + sections accordéon + états + confirmations + light + notes.

function MecaApp() {
  const chipMec = <MMecChip matricule="PL-MEC-007" />;
  const chipTruck = <MTruckChip code="CT-007" plate="4271 TCB" />;

  // ─── Action bars ────────────────────────────────────────
  const detailAction = <MActionBar bloquer hint="Sous-tâches OK · 2 critiques d'inspection à clore"/>;
  const detailActionPart = <MActionBar bloquer hint="Section ouverte · ferme pour finir"/>;
  const listAction = null;

  return (
    <DesignCanvas
      title="LOI · Atelier Méca — Mobile (D82)"
      subtitle="Mécanicien · une main · gants gras · atelier Betainomby · 2 vues · 3-5 taps pour clôturer"
    >

      {/* ─── VUE 1 · DARK ───────────────────────────────── */}
      <DCSection
        id="v1"
        title="VUE 1 · Mes interventions"
        subtitle="Liste de cartes OT — statut couleur+forme · véhicule SCHACMAN/KERAX · OT atelier réel · durée mono · clic → détail"
      >
        <DCArtboard id="v1-dark" label="Liste · DARK (défaut)" width={395} height={832}>
          <MPhone theme="dark" crumb="LOI · Atelier Méca" title="Mes interventions"
            right={chipMec} body={<MScreenList/>} action={listAction}/>
        </DCArtboard>

        <DCArtboard id="v1-empty" label="État vide · « Aucune intervention »" width={395} height={832}>
          <MPhone theme="dark" crumb="LOI · Atelier Méca" title="Mes interventions"
            right={chipMec} body={<MScreenEmpty/>} action={listAction}/>
        </DCArtboard>

        <DCArtboard id="v1-success" label="Succès · « Intervention terminée »" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention terminée" showBack
            right={chipMec}
            body={<MScreenSuccess/>}
            action={<MActionBar primary="Retour à la liste" primaryIcon="check"/>}/>
        </DCArtboard>
      </DCSection>

      {/* ─── VUE 2 · DÉTAIL · accordéon ─────────────────── */}
      <DCSection
        id="v2"
        title="VUE 2 · Détail intervention · accordéon"
        subtitle="Repliée par défaut · on ouvre uniquement la section dont on a besoin · jamais un long scroll"
      >
        <DCArtboard id="v2-closed" label="Aperçu · toutes sections repliées" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open={null}/>}
            action={detailAction}/>
        </DCArtboard>

        <DCArtboard id="v2-insp" label="Inspection ouverte · 4 états" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="inspection"/>}
            action={detailActionPart}/>
        </DCArtboard>

        <DCArtboard id="v2-diag" label="Diagnostic ouvert · structuré (rempli)" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="diagnostic" diagState="rich"/>}
            action={detailActionPart}/>
        </DCArtboard>

        <DCArtboard id="v2-pieces" label="Pièces utilisées ouvert · stepper + scan" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="pieces"/>}
            action={detailActionPart}/>
        </DCArtboard>

        <DCArtboard id="v2-photos" label="Photos ouvert · preuve par pièce" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="photos"/>}
            action={detailActionPart}/>
        </DCArtboard>

        <DCArtboard id="v2-notes" label="Notes ouvert · texte libre" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="notes"/>}
            action={detailActionPart}/>
        </DCArtboard>
      </DCSection>

      {/* ─── Diagnostic · 3 états ──────────────────────── */}
      <DCSection
        id="diag-states"
        title="Diagnostic · structuré + 3 états"
        subtitle="Système touché → pièce → code défaut (DTC) → sévérité → preuve vocale + texte. Vide · en cours d'enregistrement · rempli."
      >
        <DCArtboard id="dg-empty" label="Diagnostic · ÉTAT VIDE" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="diagnostic" diagState="empty"/>}
            action={detailActionPart}/>
        </DCArtboard>

        <DCArtboard id="dg-rec" label="Diagnostic · ENREGISTREMENT en cours" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="diagnostic" diagState="recording"/>}
            action={detailActionPart}/>
        </DCArtboard>

        <DCArtboard id="dg-rich" label="Diagnostic · RICHE (système + DTC + sévérité + vocal)" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="diagnostic" diagState="rich"/>}
            action={detailActionPart}/>
        </DCArtboard>
      </DCSection>

      {/* ─── Renvois Pneus / Carburant ─────────────────── */}
      <DCSection
        id="handoffs"
        title="Renvois · /mobile/pneu &amp; /mobile/fuel"
        subtitle="Les sections Pneus et Carburant REUTILISENT les flux déjà conçus — composants partagés, jamais re-dessinés ici"
      >
        <DCArtboard id="ho-pneus" label="Section Pneus ouverte · renvoi explicite" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="pneus"/>}
            action={detailActionPart}/>
        </DCArtboard>

        <DCArtboard id="ho-fuel" label="Section Carburant ouverte · renvoi explicite" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="carburant"/>}
            action={detailActionPart}/>
        </DCArtboard>
      </DCSection>

      {/* ─── Confirmations Bloquer / Terminer ──────────── */}
      <DCSection
        id="confirm"
        title="Confirmations · Bloquer (orange) &amp; Terminer (teal)"
        subtitle="Action irréversible → bottom sheet avec récap · le brief impose la confirmation avant clôture"
      >
        <DCArtboard id="c-bloquer" label="Bottom sheet · Bloquer" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetailWithSheet sheet="bloquer"/>}
            action={detailAction}/>
        </DCArtboard>

        <DCArtboard id="c-terminer" label="Bottom sheet · Terminer" width={395} height={832}>
          <MPhone theme="dark" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetailWithSheet sheet="terminer"/>}
            action={detailAction}/>
        </DCArtboard>
      </DCSection>

      {/* ─── LIGHT · plein soleil ──────────────────────── */}
      <DCSection
        id="light"
        title="LIGHT · plein soleil (atelier ouvert)"
        subtitle="Quand le mécano sort sous le soleil — cream lisible, header navy conservé pour repérage instantané"
      >
        <DCArtboard id="l-list" label="Liste · LIGHT" width={395} height={832}>
          <MPhone theme="light" crumb="LOI · Atelier Méca" title="Mes interventions"
            right={chipMec} body={<MScreenList/>}/>
        </DCArtboard>

        <DCArtboard id="l-detail" label="Détail · LIGHT (Inspection ouverte)" width={395} height={832}>
          <MPhone theme="light" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetail open="inspection"/>}
            action={detailActionPart}/>
        </DCArtboard>

        <DCArtboard id="l-confirm" label="Confirmation Terminer · LIGHT" width={395} height={832}>
          <MPhone theme="light" crumb="OT-A-2026-0142" title="Intervention" showBack
            right={chipTruck}
            body={<MScreenDetailWithSheet sheet="terminer"/>}
            action={detailAction}/>
        </DCArtboard>
      </DCSection>

      {/* ─── Notes de conception ───────────────────────── */}
      <DCSection
        id="notes"
        title="Notes de conception · décisions atelier"
        subtitle="Pourquoi cette forme — mécanicien, une main, gants gras, sous pression"
      >
        <DCArtboard id="n-system" label="Système D82 appliqué" width={520} height={620}>
          <MecaNotesSystem/>
        </DCArtboard>
        <DCArtboard id="n-rules" label="Règles métier verrouillées" width={460} height={620}>
          <MecaNotesRules/>
        </DCArtboard>
        <DCArtboard id="n-open" label="À CONFIRMER avec LOI" width={460} height={620}>
          <MecaNotesOpen/>
        </DCArtboard>
        <DCArtboard id="n-v0map" label="v0 codebase · mapping &amp; corrections LOI" width={520} height={680}>
          <MecaNotesV0Map/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

// ─── Notes ──────────────────────────────────────────────────
function MNoteShell({ children }) {
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
function MNH({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
      color: '#5E6B7C', textTransform: 'uppercase',
      marginTop: 14, marginBottom: 6,
    }}>{children}</div>
  );
}
function MNBullet({ children }) {
  return (
    <li style={{ display: 'flex', gap: 10, padding: '6px 0', listStyle: 'none' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: D82.teal, marginTop: 9, flexShrink: 0 }}/>
      <span style={{ flex: 1 }}>{children}</span>
    </li>
  );
}
function MNMono({ children }) {
  return (
    <span style={{
      fontFamily: D82.mono, fontSize: 12, fontWeight: 600,
      background: '#EDE8D8', padding: '1px 5px', borderRadius: 3, color: '#0B2540',
    }}>{children}</span>
  );
}

function MecaNotesSystem() {
  return (
    <MNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Système D82 · mécanicien atelier
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Sous pression, une main, gants gras. Module orienté ACTION, pas KPI.
      </div>
      <MNH>Couleur — D82 strict</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Navy <MNMono>#0B2540</MNMono> header dans les deux modes · repérage instantané du module.</MNBullet>
        <MNBullet>Teal <MNMono>#1A8E7E</MNMono> = primaire / OK / En cours / Terminer. Orange <MNMono>#C77E2A</MNMono> = Bloquer / Bloqué / En attente. Vert <MNMono>#2D8659</MNMono> = signal Terminé. Rouge <MNMono>#B8421E</MNMono> = critique uniquement (point d'inspection).</MNBullet>
        <MNBullet>Interdit : cyan · bleu accent · violet · vert générique <MNMono>#22c55e</MNMono>.</MNBullet>
      </ul>
      <MNH>Forme — jamais couleur seule</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Statut intervention : <b>pastille forme + couleur + libellé</b>. Rond teal = En cours · Triangle orange = En attente · Carré orange = Bloqué · Check vert = Terminé.</MNBullet>
        <MNBullet>Inspection à 4 états (Rond / Triangle / Carré / Losange) — repris du module HSE pour cohérence.</MNBullet>
      </ul>
      <MNH>Typographie</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet><b>Inter</b> body 14-15 · titres 17-22 · libellés caps 9-11 / letter-spacing 1.2-1.5.</MNBullet>
        <MNBullet><b>IBM Plex Mono</b> sur TOUT chiffre : <MNMono>OT-A-2026-0142</MNMono>, durée <MNMono>02:30</MNMono>, code véhicule <MNMono>CT-007</MNMono>, plaque <MNMono>4271 TCB</MNMono>, références pièces <MNMono>BRK-PLQ-AR-SCH</MNMono>.</MNBullet>
      </ul>
      <MNH>Targets gants gras</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Tête d'accordéon <b>64px</b> · Bloquer 60px · Terminer 60px · « Ouvrir Pointage pneu » 52px · steppers 40px. Aucune cible &lt;44px.</MNBullet>
        <MNBullet>Icônes <b>trait fin</b> partout (stroke 1.8) · zéro emoji.</MNBullet>
      </ul>
    </MNoteShell>
  );
}

function MecaNotesRules() {
  return (
    <MNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Logique métier · verrouillée (v0 méca)
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Reprise telle quelle du brief. Aucune réinterprétation produit.
      </div>
      <MNH>VUE 1 · Mes interventions</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Liste de cartes OT · <b>statut couleur+forme</b> · véhicule SCHACMAN ou KERAX · n° <MNMono>OT-A-2026-####</MNMono> · durée estimée gros chiffres mono.</MNBullet>
        <MNBullet>3 compteurs en tête : En cours · En attente · Bloqué. Pas de KPI au-delà.</MNBullet>
        <MNBullet>Clic carte → détail. Pas de tri/filtre v0.</MNBullet>
      </ul>
      <MNH>VUE 2 · Détail · accordéon</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Header véhicule + description, puis 7 sections accordéon · <b>repliées par défaut</b>. Jamais un long scroll.</MNBullet>
        <MNBullet>Sections : Inspection · Diagnostic · Pièces utilisées · Pneus · Carburant/Système · Photos · Notes.</MNBullet>
        <MNBullet><b>Pneus &amp; Carburant = renvois</b> vers <MNMono>/mobile/pneu</MNMono> et <MNMono>/mobile/fuel</MNMono>. Composants partagés — ne sont jamais re-dessinés ici.</MNBullet>
      </ul>
      <MNH>Bas d'écran</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>2 actions dominantes thumb-reachable · <b>Bloquer</b> (orange, 42% largeur) + <b>Terminer</b> (teal, 58%). Hauteur 60px.</MNBullet>
        <MNBullet>Confirmation obligatoire en bottom-sheet avant Bloquer ou Terminer · récap mono.</MNBullet>
      </ul>
      <MNH>États clairs</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Vide : « Aucune intervention » + bouton Rafraîchir + bandeau « Synchronisé · file vide ».</MNBullet>
        <MNBullet>Succès : « Intervention terminée » + récap mono · durée réelle vs estimée.</MNBullet>
      </ul>
      <MNH>3-5 taps pour clôturer</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Liste → carte → Terminer → Confirmer → Succès. 4 taps.</MNBullet>
      </ul>
    </MNoteShell>
  );
}

function MecaNotesOpen() {
  return (
    <MNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        À CONFIRMER avec LOI
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Aucune donnée inventée. Zones en attente de validation produit.
      </div>
      <MNH>Identifiants &amp; OT</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Format n° OT atelier : <MNMono>OT-A-2026-####</MNMono> proposé (cohérent avec <MNMono>INSP-2026</MNMono> · <MNMono>ACT-2026</MNMono>) — à figer.</MNBullet>
        <MNBullet>Matricule mécano : <MNMono>PL-MEC-XXX</MNMono> (master dataset). PIN universel : longueur + politique session — <MToConfirm/>.</MNBullet>
      </ul>
      <MNH>Sources OT</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Liens reconnus : <MNMono>INSP-2026</MNMono> (inspection HSE) · <MNMono>ACT-2026</MNMono> (action corrective) · <MNMono>EVT-2026</MNMono> (incident chauffeur) · Planning préventif. Autres sources ? <MToConfirm/></MNBullet>
        <MNBullet>Cascade : « Envoyer au mécano » (chauffeur) ouvre automatiquement un OT atelier ? Règle à fixer.</MNBullet>
      </ul>
      <MNH>Catalogue pièces</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Format réf. pièce : <MNMono>BRK-PLQ-AR-SCH</MNMono> illustratif — vrai catalogue (codes magasin Betainomby) <MToConfirm/>.</MNBullet>
        <MNBullet>Scanner = code-barres pièce ? QR ? Pas de scan v0 → simple recherche texte ?</MNBullet>
      </ul>
      <MNH>Bloquer · motifs</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Liste fermée des motifs (Pièce manquante · Outillage indispo · Sécurité · Autre) ou texte libre ? <MToConfirm/></MNBullet>
        <MNBullet>Bloquer = notifie qui ? Chef d'atelier seulement, ou cascade magasin ?</MNBullet>
      </ul>
      <MNH>Handoffs pneu / carburant</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Le module <MNMono>/mobile/pneu</MNMono> reçoit-il le contexte OT atelier (deep-link <MNMono>?ot=OT-A-2026-0142</MNMono>) ou démarre-t-il vierge ?</MNBullet>
        <MNBullet>Au retour : l'OT marque-t-il la section comme « Pointage pneu fait — voir <MNMono>EVT-2026-####</MNMono> » ? Règle à figer.</MNBullet>
      </ul>
    </MNoteShell>
  );
}

function MecaNotesV0Map() {
  return (
    <MNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Mapping v0 codebase → maquette LOI
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Le codebase Next.js fourni (mechanic-field-app) est <b>structurellement aligné</b> avec cette maquette — mais contient des violations LOI à corriger côté CC.
      </div>

      <MNH>Sections · v0 ↔ ici</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Inspection · Diagnosis · Parts · Tires · Fuel · Photos · Notes · Block · Complete <b>→ tous mappés</b>.</MNBullet>
        <MNBullet>Pattern v0 = full-screen modal par section. <b>Choix LOI : accordéon</b> (brief). On garde l'accordéon, la modale full-screen reste possible si tap-target trop serré sur certains items.</MNBullet>
        <MNBullet>Section <b>Diagnostic</b> v0 = simple <MNMono>&lt;Textarea&gt;</MNMono>. <b>Ici enrichie</b> : Système → Pièce → DTC → Sévérité → Vocal + Texte. 3 états (vide / enregistrement / rempli).</MNBullet>
      </ul>

      <MNH>Violations LOI · à corriger côté CC</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet><b>Flotte</b> : <MNMono>Volvo FH16</MNMono> · <MNMono>Mercedes Sprinter</MNMono> · <MNMono>Scania R500</MNMono> · <MNMono>Toyota 8FBE18</MNMono> → <span style={{ color: D82.red, fontWeight: 700 }}>INTERDIT</span>. Master dataset : SCHACMAN F3000 6×4 + Renault Kerax uniquement.</MNBullet>
        <MNBullet><b>Plaques</b> : <MNMono>LOI-4521</MNMono> → <span style={{ color: D82.red, fontWeight: 700 }}>INTERDIT</span>. Format réel : <MNMono>…TCB</MNMono>.</MNBullet>
        <MNBullet><b>Noms méca</b> : <MNMono>Carlos Rodriguez</MNMono> · <MNMono>Ahmed Hassan</MNMono> · <MNMono>Maria Santos</MNMono> → <span style={{ color: D82.red, fontWeight: 700 }}>INTERDIT</span>. Pas de noms codés en dur — uniquement matricule <MNMono>PL-MEC-XXX</MNMono>.</MNBullet>
        <MNBullet><b>Codes job</b> : <MNMono>job-001</MNMono> → <MNMono>OT-A-2026-####</MNMono>.</MNBullet>
        <MNBullet><b>Sites manquants</b> : v0 sans notion de site. À câbler : Atelier Betainomby, Port Toamasina, APC Andriamena, Moramanga.</MNBullet>
      </ul>

      <MNH>Types &amp; events · à reprendre</MNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <MNBullet>Le typage <MNMono>MaintenanceJob</MNMono> + l'event-store <MNMono>createEvent()</MNMono> du v0 sont solides → garder. Renommer <MNMono>EventType</MNMono> en FR (<MNMono>job_assigne</MNMono> · <MNMono>diagnostic_ajoute</MNMono>…).</MNBullet>
        <MNBullet>Ajouter <MNMono>InterventionEvent</MNMono> : <MNMono>tire_handoff_opened</MNMono> · <MNMono>fuel_handoff_opened</MNMono> · <MNMono>severity_set</MNMono> · <MNMono>system_set</MNMono> · <MNMono>dtc_set</MNMono>.</MNBullet>
        <MNBullet>L'écran <b>Cockpit</b> (vue chef d'atelier) du v0 est hors-brief ici — on ne le redessine pas tant que LOI n'a pas confirmé.</MNBullet>
      </ul>
    </MNoteShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MecaApp />);
