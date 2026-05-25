// Pointage Cargo — Design canvas
// DARK (par défaut) · flux Chargement · flux Livraison · LIGHT · états · notes

function CargoApp() {
  const chip       = <CgPointeurChip matricule="PL-PTR-007"/>;
  const missionChip = <CgMissionChip code="MIS-2026-0422"/>;
  const livMissionChip = <CgMissionChip code="MIS-2026-0417"/>;

  return (
    <DesignCanvas
      title="LOI · Pointage Cargo — Mobile (D82)"
      subtitle="Pointeur (PL-PTR-XXX) · une main · plein soleil · port / site · sous pression · 3-5 taps par pointage"
    >

      {/* ─── DARK · 4 onglets ─────────────────────────────── */}
      <DCSection
        id="dark"
        title="4 onglets bas · DARK (par défaut)"
        subtitle="Missions · Chargement · Livraison · Anomalies — barre pouce, action, pas de KPI"
      >
        <DCArtboard id="d-missions" label="01 · Missions · liste filtrable" width={395} height={832}>
          <CgPhone theme="dark" tab="missions" right={chip}
            title="Missions"
            body={<CgScreenMissions filter="tous"/>}
            tabAlert={{ id: 'anomalies', count: 1 }}
          />
        </DCArtboard>

        <DCArtboard id="d-missions-filt" label="01b · Missions · filtre « À charger »" width={395} height={832}>
          <CgPhone theme="dark" tab="missions" right={chip}
            title="Missions"
            body={<CgScreenMissions filter="a-charger"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-charg-start" label="02 · Chargement · démarrer" width={395} height={832}>
          <CgPhone theme="dark" tab="chargement" right={missionChip}
            title="Chargement"
            showBack
            body={<CgScreenChargementStart/>}
            action={<CgActionBar primary="Saisir le tonnage" primaryEnabled hint="Étape 2 / 4 · MIS-2026-0422 · Chrome APC Lumpy"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-charg-numpad" label="03 · Tonnage · pavé numérique" width={395} height={832}>
          <CgPhone theme="dark" tab="chargement" right={missionChip}
            title="Tonnage chargé"
            showBack
            body={<CgScreenChargementTonnage value="30.12"/>}
            action={<CgActionBar primary="Continuer · photo preuve" secondary="Retour" primaryEnabled
              hint="Hors tolérance · +8,12 T → anomalie créée à l'envoi" primaryTone="teal"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-charg-photo" label="04 · Chargement · photo preuve" width={395} height={832}>
          <CgPhone theme="dark" tab="chargement" right={missionChip}
            title="Photo preuve"
            showBack
            body={<CgScreenChargementPhoto/>}
            action={<CgActionBar primary="Envoyer chargement" secondary="Retour" primaryEnabled hint="1 photo · GPS + horaire attachés" primaryIcon="send"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-charg-done" label="05 · Chargement enregistré" width={395} height={832}>
          <CgPhone theme="dark" tab="chargement" right={missionChip}
            title="Chargement enregistré"
            body={<CgScreenChargementSuccess/>}
            action={<CgActionBar primary="Mission suivante" secondary="Fermer" primaryEnabled primaryIcon="plus"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-liv-stepper" label="06 · Livraison · stepper 4 étapes" width={395} height={832}>
          <CgPhone theme="dark" tab="livraison" right={livMissionChip}
            title="Livraison"
            showBack
            body={<CgScreenLivraisonStepper currentStep={2}/>}
            action={<CgActionBar primary="Marquer · Terminé" secondary="Retour" primaryEnabled hint="Étape 02 · déchargement en cours" primaryIcon="check"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-liv-ecart-ok" label="07 · Vérif poids · DANS tolérance" width={395} height={832}>
          <CgPhone theme="dark" tab="livraison" right={livMissionChip}
            title="Vérification poids"
            showBack
            body={<CgScreenLivraisonEcart kind="in"/>}
            action={<CgActionBar primary="Continuer · signature" secondary="Retour" primaryEnabled hint="Conforme · ±2% respecté"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-liv-ecart-warn" label="07b · Vérif poids · HORS tolérance" width={395} height={832}>
          <CgPhone theme="dark" tab="livraison" right={<CgMissionChip code="MIS-2026-0422"/>}
            title="Vérification poids"
            showBack
            body={<CgScreenLivraisonEcart kind="critique"/>}
            action={<CgActionBar primary="Créer anomalie tonnage" secondary="Retour" primaryEnabled primaryTone="red"
              hint="Critique · +2,40 T (+10,9%) — signature bloquée tant qu'anomalie non créée" primaryIcon="send"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-liv-sign" label="08 · Signature double" width={395} height={832}>
          <CgPhone theme="dark" tab="livraison" right={livMissionChip}
            title="Signature"
            showBack
            body={<CgScreenLivraisonSignature/>}
            action={<CgActionBar primary="Confirmer livraison" secondary="Retour" primaryEnabled={false} hint="Signature client manquante" primaryIcon="check"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-liv-done" label="09 · Livraison confirmée" width={395} height={832}>
          <CgPhone theme="dark" tab="livraison" right={livMissionChip}
            title="Livraison confirmée"
            body={<CgScreenLivraisonSuccess/>}
            action={<CgActionBar primary="Mission suivante" secondary="Fermer" primaryEnabled primaryIcon="plus"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-ano-list" label="10 · Anomalies · liste" width={395} height={832}>
          <CgPhone theme="dark" tab="anomalies" right={chip}
            title="Anomalies"
            body={<CgScreenAnomalies/>}
            tabAlert={{ id: 'anomalies', count: 2 }}
          />
        </DCArtboard>

        <DCArtboard id="d-ano-new" label="11 · Anomalies · nouvelle" width={395} height={832}>
          <CgPhone theme="dark" tab="anomalies" right={missionChip}
            title="Nouvelle anomalie"
            showBack
            body={<CgScreenAnomalieNouvelle sev="majeure"/>}
            action={<CgActionBar primary="Envoyer anomalie" secondary="Retour" primaryEnabled hint="Tonnage · Majeure · 1 photo" primaryIcon="send" primaryTone="red"/>}
          />
        </DCArtboard>
      </DCSection>

      {/* ─── LIGHT · plein soleil ─────────────────────────── */}
      <DCSection
        id="light"
        title="LIGHT · plein soleil"
        subtitle="Anti-miroir sous lumière directe — header navy conservé pour repérage instantané du module"
      >
        <DCArtboard id="l-missions" label="01 · Missions (light)" width={395} height={832}>
          <CgPhone theme="light" tab="missions" right={chip}
            title="Missions"
            body={<CgScreenMissions filter="tous"/>}
            tabAlert={{ id: 'anomalies', count: 1 }}
          />
        </DCArtboard>

        <DCArtboard id="l-numpad" label="03 · Numpad tonnage (light)" width={395} height={832}>
          <CgPhone theme="light" tab="chargement" right={missionChip}
            title="Tonnage chargé"
            showBack
            body={<CgScreenChargementTonnage value="30.12"/>}
            action={<CgActionBar primary="Continuer · photo preuve" secondary="Retour" primaryEnabled
              hint="Hors tolérance · +8,12 T → anomalie créée à l'envoi"/>}
          />
        </DCArtboard>

        <DCArtboard id="l-stepper" label="06 · Stepper livraison (light)" width={395} height={832}>
          <CgPhone theme="light" tab="livraison" right={livMissionChip}
            title="Livraison"
            showBack
            body={<CgScreenLivraisonStepper currentStep={2}/>}
            action={<CgActionBar primary="Marquer · Terminé" secondary="Retour" primaryEnabled hint="Étape 02 · déchargement en cours" primaryIcon="check"/>}
          />
        </DCArtboard>

        <DCArtboard id="l-ecart" label="07 · Écart conforme (light)" width={395} height={832}>
          <CgPhone theme="light" tab="livraison" right={livMissionChip}
            title="Vérification poids"
            showBack
            body={<CgScreenLivraisonEcart kind="in"/>}
            action={<CgActionBar primary="Continuer · signature" secondary="Retour" primaryEnabled hint="Conforme · ±2% respecté"/>}
          />
        </DCArtboard>
      </DCSection>

      {/* ─── États clairs ─────────────────────────────────── */}
      <DCSection
        id="states"
        title="États clairs · vide & succès"
        subtitle="Le pointeur voit immédiatement le résultat. Pas de mur de chargement."
      >
        <DCArtboard id="s-empty" label="Vide · aucune mission" width={395} height={832}>
          <CgPhone theme="dark" tab="missions" right={chip}
            title="Missions"
            body={<CgScreenMissionsEmpty/>}
          />
        </DCArtboard>

        <DCArtboard id="s-empty-light" label="Vide · aucune mission (light)" width={395} height={832}>
          <CgPhone theme="light" tab="missions" right={chip}
            title="Missions"
            body={<CgScreenMissionsEmpty/>}
          />
        </DCArtboard>

        <DCArtboard id="s-charg-warn" label="Succès chargement · alerte écart" width={395} height={832}>
          <CgPhone theme="light" tab="chargement" right={missionChip}
            title="Chargement enregistré"
            body={<CgScreenChargementSuccess/>}
            action={<CgActionBar primary="Mission suivante" secondary="Fermer" primaryEnabled primaryIcon="plus"/>}
          />
        </DCArtboard>
      </DCSection>

      {/* ─── Notes de conception ─────────────────────────── */}
      <DCSection
        id="notes"
        title="Notes de conception · décisions terrain"
        subtitle="Pourquoi cette forme — pointeur cargo, port / site, plein soleil, sous pression, parfois sans réseau"
      >
        <DCArtboard id="n-system" label="Système D82 · pointeur" width={520} height={680}>
          <CargoNotesSystem/>
        </DCArtboard>
        <DCArtboard id="n-rules" label="Logique métier verrouillée" width={460} height={680}>
          <CargoNotesRules/>
        </DCArtboard>
        <DCArtboard id="n-open" label="À CONFIRMER avec LOI" width={460} height={680}>
          <CargoNotesOpen/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

// ─── Notes shell + helpers ────────────────────────────────
function CgNoteShell({ children }) {
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
function CgNH({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
      color: '#5E6B7C', textTransform: 'uppercase',
      marginTop: 14, marginBottom: 6,
    }}>{children}</div>
  );
}
function CgNBullet({ children }) {
  return (
    <li style={{ display: 'flex', gap: 10, padding: '6px 0', listStyle: 'none' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: D82.teal, marginTop: 9, flexShrink: 0 }}/>
      <span style={{ flex: 1 }}>{children}</span>
    </li>
  );
}
function CgNMono({ children }) {
  return (
    <span style={{
      fontFamily: D82.mono, fontSize: 12, fontWeight: 600,
      background: '#EDE8D8', padding: '1px 5px', borderRadius: 3, color: '#0B2540',
    }}>{children}</span>
  );
}

function CargoNotesSystem() {
  return (
    <CgNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Système D82 · pointeur cargo
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Module orienté <b>action terrain</b> — pas de KPI, pas de dashboard. 3-5 taps par pointage.
      </div>

      <CgNH>Couleur — D82 STRICT</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Navy <CgNMono>#0B2540</CgNMono> header dans les deux modes · repérage instantané.</CgNBullet>
        <CgNBullet>Teal <CgNMono>#1A8E7E</CgNMono> = action primaire, statut conforme, écart dans tolérance, livré.</CgNBullet>
        <CgNBullet>Orange <CgNMono>#C77E2A</CgNMono> = <b>Warn UNIQUEMENT</b> (écart limite, hors-ligne, à confirmer). Rouge <CgNMono>#B8421E</CgNMono> = critique uniquement (anomalie, écart hors tolérance).</CgNBullet>
        <CgNBullet>Interdit : cyan · bleu accent · violet · vert générique · orange comme accent.</CgNBullet>
      </ul>

      <CgNH>Forme — jamais couleur seule</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet><b>Statut mission</b> : carré (à charger) · sablier (en chargement) · losange (en transit) · triangle (à livrer) · rond (livré) · croix-carré (anomalie).</CgNBullet>
        <CgNBullet><b>Sévérité anomalie</b> : rond teal (mineure) · triangle orange (majeure) · carré rouge (critique).</CgNBullet>
        <CgNBullet><b>Écart prévu/réel</b> : rond (conforme) · triangle (alerte) · carré (critique) — toujours accompagné du libellé « DANS TOLÉRANCE » / « HORS TOLÉRANCE ».</CgNBullet>
      </ul>

      <CgNH>Typographie</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet><b>Inter</b> 14-22px UI · libellés caps 10-11px / letter-spacing 1.5.</CgNBullet>
        <CgNBullet><b>IBM Plex Mono</b> sur TOUT chiffre : tonnage géant (64px), écart géant (56px), codes <CgNMono>MIS-2026</CgNMono> <CgNMono>ANO-2026</CgNMono>, plaques <CgNMono>4271 TCB</CgNMono>, GPS, horaires.</CgNBullet>
      </ul>

      <CgNH>Targets terrain (gants OK)</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Action primaire <b>64px</b> · secondaire 56px · onglets bas 56px · pavé numérique <b>64px par touche</b>.</CgNBullet>
        <CgNBullet>Icônes <b>trait fin</b> partout · zéro emoji · zéro illustration.</CgNBullet>
        <CgNBullet>Carte mission ≥120px de haut · zone tap pleine carte.</CgNBullet>
      </ul>

      <CgNH>Saisie</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Tonnage = <b>pavé numérique géant</b>, chiffre mono 64px. Matériau + tonnage prévu rappelés au-dessus.</CgNBullet>
        <CgNBullet>Photo preuve via caméra HTML5 natif · cadrage + GPS + plaque + horaire attachés automatiquement.</CgNBullet>
        <CgNBullet>Aucun champ texte libre dans la version v1 · sites, matériaux, types d'anomalie en listes.</CgNBullet>
      </ul>
    </CgNoteShell>
  );
}

function CargoNotesRules() {
  return (
    <CgNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Logique métier · verrouillée
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Reprise du brief, validée par le pointeur v0. Aucune réinterprétation.
      </div>

      <CgNH>4 onglets bas (barre pouce)</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet><b>Missions</b> · <b>Chargement</b> · <b>Livraison</b> · <b>Anomalies</b>. Pas d'onglet « Manager » / pas de feed KPI.</CgNBullet>
      </ul>

      <CgNH>Missions</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Liste filtrable : Tous · À charger · En transit · À livrer · Anomalies.</CgNBullet>
        <CgNBullet>Carte mission : <CgNMono>MIS-2026-####</CgNMono> · camion SCHACMAN/KERAX · plaque <CgNMono>… TCB</CgNMono> · chauffeur <CgNMono>DRV-00X</CgNMono> · matériau + tonnage · Origine → Destination · ETA · chip statut.</CgNBullet>
      </ul>

      <CgNH>Chargement</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Étapes : Vérifier camion + chauffeur → <b>Saisir tonnage</b> (pavé numérique géant) → <b>Photo preuve</b> benne pleine → Envoyer.</CgNBullet>
        <CgNBullet>Écart prévu/réel calculé en temps réel pendant la saisie · feedback couleur immédiat.</CgNBullet>
      </ul>

      <CgNH>Livraison</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Stepper 4 étapes : <b>Arrivé site</b> → <b>Déchargement démarré</b> → <b>Terminé</b> → <b>Livraison confirmée</b>. Étape courante mise en avant (dot 44px + halo + libellé « EN COURS »).</CgNBullet>
        <CgNBullet>Vérification poids = pesée pont 2 vs prévu · écart géant + couleur + forme + libellé.</CgNBullet>
        <CgNBullet>Hors tolérance critique → signature bloquée · anomalie tonnage obligatoire.</CgNBullet>
        <CgNBullet>Signature double : pointeur (PL-PTR-007) + responsable client (À CONFIRMER format).</CgNBullet>
      </ul>

      <CgNH>Anomalies</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Hero rouge « Déclarer une anomalie » en haut · liste en dessous.</CgNBullet>
        <CgNBullet>Formulaire : type (6 options) · sévérité (3 chips forme+couleur) · photo preuve <b>obligatoire</b> · mission rattachée auto si en cours.</CgNBullet>
        <CgNBullet>Code <CgNMono>ANO-2026-####</CgNMono> · état (Ouverte / En revue / Clos).</CgNBullet>
      </ul>

      <CgNH>Données réelles · zéro invention</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>GRANITE 30T : COLAS/Ivondro → Port Toamasina (PDP, MOCCO, C4).</CgNBullet>
        <CgNBullet>Chrome APC Lumpy/Concentrate 22T : Moramanga → APC Andriamena (RN44).</CgNBullet>
        <CgNBullet>Flotte CT-001..015 SCHACMAN F3000 6×4 + KERAX · plaques …TCB · chauffeurs DRV-00X (zéro nom).</CgNBullet>
        <CgNBullet>Login universel PL-PTR-XXX + PIN (master dataset).</CgNBullet>
      </ul>
    </CgNoteShell>
  );
}

function CargoNotesOpen() {
  return (
    <CgNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        À CONFIRMER avec LOI
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Aucune donnée inventée. Zones en attente de validation produit.
      </div>

      <CgNH>Tolérances tonnage</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet><b>Seuil ±2 % par défaut</b> proposé · « Alerte » entre 2 % et 4 % · « Critique » au-delà. À figer par matériau (granite vs chrome).</CgNBullet>
        <CgNBullet>Comportement si chargement chez COLAS &gt; capacité benne SCHACMAN F3000 — accepter ou refuser ?</CgNBullet>
      </ul>

      <CgNH>Identifiants &amp; codes</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Format matricule pointeur <CgNMono>PL-PTR-XXX</CgNMono> proposé · longueur PIN, durée session.</CgNBullet>
        <CgNBullet><CgNMono>MIS-2026-####</CgNMono>, <CgNMono>ANO-2026-####</CgNMono> · numéroteur local + reconciliation serveur.</CgNBullet>
      </ul>

      <CgNH>Catalogue anomalies</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>6 types proposés : Tonnage · Bâche / charge · Pesée pont · Retard · Route / accès · Autre. À valider par QSHE / opérations.</CgNBullet>
        <CgNBullet>Workflow « Ouverte → En revue → Clos » · responsable, SLA, escalade.</CgNBullet>
      </ul>

      <CgNH>Signature client</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Champ identité du receveur côté client (APC, Port Toamasina) — nom, fonction, matricule client ?</CgNBullet>
        <CgNBullet>Cas dégradés : client refuse de signer · client absent · PDA hors ligne au moment du point. À cadrer en v1.1.</CgNBullet>
      </ul>

      <CgNH>Caméra &amp; offline</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Permission caméra refusée → fallback uploader photo galerie ? Ou bloquer le pointage ?</CgNBullet>
        <CgNBullet>Plafond file offline : nombre de pointages + taille des médias avant alerte stockage.</CgNBullet>
        <CgNBullet>OCR pesée pont (afficher le ticket pesée) : optionnel v1.1.</CgNBullet>
      </ul>

      <CgNH>Hors-périmètre</CgNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <CgNBullet>Vue superviseur (KPI tonnage jour, écart cumulé, anomalies) = <b>module séparé</b>, web cockpit, hors pointeur.</CgNBullet>
      </ul>
    </CgNoteShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CargoApp/>);
