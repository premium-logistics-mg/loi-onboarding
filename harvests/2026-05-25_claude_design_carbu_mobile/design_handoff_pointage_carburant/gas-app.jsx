// Pointage Carburant — Design canvas
// LOGIN · ACCUEIL · FLUX DARK 6 étapes · FLUX LIGHT · ÉTATS · NOTES

function GasApp() {
  const op    = <GsOperatorChip matricule="PL-GAS-003"/>;
  const truck = <GsVehicleChip truck="CT-007" plate="4271 TCB"/>;

  return (
    <DesignCanvas
      title="LOI · Pointage carburant — Mobile (D82)"
      subtitle="Opérateur dédié station (PL-GAS-XXX) · une main · plein soleil · station / dépôt · 3-5 taps par plein · flux linéaire 6 étapes"
    >

      {/* ─── ACCÈS ──────────────────────────────────────────── */}
      <DCSection
        id="login"
        title="Accès · matricule + PIN"
        subtitle="Login universel opérateur carburant dédié. Pas de login propre au module."
      >
        <DCArtboard id="login" label="00 · Login PL-GAS-XXX + PIN" width={395} height={832}>
          <GsPhone theme="dark"
            crumb="LOI · Pointage carburant"
            title="Connexion"
            body={<GsScreenLogin pinLength={3}/>}
            action={<GsActionBar primary="Déverrouiller" primaryEnabled={false} hint="Saisir les 4 chiffres du PIN" primaryIcon="lock"/>}
          />
        </DCArtboard>

        <DCArtboard id="accueil" label="01 · Accueil opérateur" width={395} height={832}>
          <GsPhone theme="dark" right={op}
            crumb="PL-GAS-003 · station GALANA TMM"
            title="Pointage carburant"
            body={<GsScreenAccueil hasPending/>}
            action={<GsActionBar primary="Nouveau pointage" primaryEnabled primaryIcon="plus" hint="6 étapes · 3-5 taps · véhicule → BC"/>}
          />
        </DCArtboard>
      </DCSection>

      {/* ─── FLUX DARK (par défaut) · 6 étapes ──────────────── */}
      <DCSection
        id="flux-dark"
        title="Flux · DARK (par défaut)"
        subtitle="Véhicule → Station → Litres → Trajet/Km → N° BC → Confirmation → Succès"
      >
        <DCArtboard id="d-vehicule" label="02 · Étape 1 · Véhicule (scan + liste)" width={395} height={832}>
          <GsPhone theme="dark" right={op} showBack stepDots={1}
            title="Véhicule"
            body={<GsScreenVehicule mode="scan"/>}
            action={<GsActionBar primary="Continuer · station" primaryEnabled hint="CT-007 · 4271 TCB · plaque reconnue"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-station" label="03 · Étape 2 · Station (3 tuiles)" width={395} height={832}>
          <GsPhone theme="dark" right={truck} showBack stepDots={2}
            title="Station"
            body={<GsScreenStation selected="galana-tmm"/>}
            action={<GsActionBar primary="Continuer · litres" primaryEnabled hint="GALANA TMM · Toamasina · sélectionnée"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-litres" label="04 · Étape 3 · Litres (pavé géant)" width={395} height={832}>
          <GsPhone theme="dark" right={truck} showBack stepDots={3}
            title="GO livrée"
            body={<GsScreenLitres value="285,40"/>}
            action={<GsActionBar primary="Continuer · photo bon" primaryEnabled hint="285,40 L · +36,80 L vs dernier plein"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-litres-photo" label="05 · Étape 3b · Photo bon pompe" width={395} height={832}>
          <GsPhone theme="dark" right={truck} showBack stepDots={3}
            title="Photo bon pompe"
            body={<GsScreenLitresPhoto/>}
            action={<GsActionBar primary="Continuer · trajet" primaryEnabled hint="1 photo · GPS + horaire attachés"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-km" label="06 · Étape 4 · Trajet & km actuel" width={395} height={832}>
          <GsPhone theme="dark" right={truck} showBack stepDots={4}
            title="Trajet · km"
            body={<GsScreenKm kmActuel="142 628"/>}
            action={<GsActionBar primary="Continuer · N° BC" primaryEnabled hint="+248 km · 115,1 L/100 km · cohérent flotte"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-bc-scan" label="07 · Étape 5 · N° BC scan" width={395} height={832}>
          <GsPhone theme="dark" right={truck} showBack stepDots={5}
            title="N° bon livraison"
            body={<GsScreenBC mode="scan" value="BC-2026-08412"/>}
            action={<GsActionBar primary="Continuer · valider" primaryEnabled hint="BC-2026-08412 · scan code-barres"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-bc-manual" label="07b · Étape 5 · N° BC saisie manuelle" width={395} height={832}>
          <GsPhone theme="dark" right={truck} showBack stepDots={5}
            title="N° BC · manuel"
            body={<GsScreenBC mode="manual"/>}
            action={<GsActionBar primary="Continuer · valider" primaryEnabled hint="Repli manuel · scan dès que possible"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-conf" label="08 · Étape 6 · Confirmation" width={395} height={832}>
          <GsPhone theme="dark" right={truck} showBack stepDots={6}
            title="Vérifier · envoyer"
            body={<GsScreenConfirmation/>}
            action={<GsActionBar primary="Envoyer le plein" secondary="Retour" primaryEnabled primaryIcon="send" hint="Vérification possible jusqu'à l'envoi"/>}
          />
        </DCArtboard>

        <DCArtboard id="d-succes" label="09 · Succès · plein enregistré" width={395} height={832}>
          <GsPhone theme="dark" right={op} showClose
            title="Plein enregistré"
            body={<GsScreenSucces offline/>}
            action={<GsActionBar primary="Nouveau pointage" secondary="Fermer" primaryEnabled primaryIcon="plus"/>}
          />
        </DCArtboard>
      </DCSection>

      {/* ─── LIGHT · plein soleil ──────────────────────────── */}
      <DCSection
        id="flux-light"
        title="LIGHT · plein soleil"
        subtitle="Anti-miroir sous lumière directe — header navy conservé pour repérage instantané du module."
      >
        <DCArtboard id="l-accueil" label="01 · Accueil (light)" width={395} height={832}>
          <GsPhone theme="light" right={op}
            crumb="PL-GAS-003 · station GALANA TMM"
            title="Pointage carburant"
            body={<GsScreenAccueil hasPending/>}
            action={<GsActionBar primary="Nouveau pointage" primaryEnabled primaryIcon="plus" hint="6 étapes · 3-5 taps · véhicule → BC"/>}
          />
        </DCArtboard>

        <DCArtboard id="l-station" label="03 · Station (light)" width={395} height={832}>
          <GsPhone theme="light" right={truck} showBack stepDots={2}
            title="Station"
            body={<GsScreenStation selected="galana-tmm"/>}
            action={<GsActionBar primary="Continuer · litres" primaryEnabled hint="GALANA TMM · Toamasina · sélectionnée"/>}
          />
        </DCArtboard>

        <DCArtboard id="l-litres" label="04 · Litres (light)" width={395} height={832}>
          <GsPhone theme="light" right={truck} showBack stepDots={3}
            title="GO livrée"
            body={<GsScreenLitres value="285,40"/>}
            action={<GsActionBar primary="Continuer · photo bon" primaryEnabled hint="285,40 L · +36,80 L vs dernier plein"/>}
          />
        </DCArtboard>

        <DCArtboard id="l-km" label="06 · Trajet & km (light)" width={395} height={832}>
          <GsPhone theme="light" right={truck} showBack stepDots={4}
            title="Trajet · km"
            body={<GsScreenKm kmActuel="142 628"/>}
            action={<GsActionBar primary="Continuer · N° BC" primaryEnabled hint="+248 km · 115,1 L/100 km · cohérent flotte"/>}
          />
        </DCArtboard>

        <DCArtboard id="l-conf" label="08 · Confirmation (light)" width={395} height={832}>
          <GsPhone theme="light" right={truck} showBack stepDots={6}
            title="Vérifier · envoyer"
            body={<GsScreenConfirmation/>}
            action={<GsActionBar primary="Envoyer le plein" secondary="Retour" primaryEnabled primaryIcon="send" hint="Vérification possible jusqu'à l'envoi"/>}
          />
        </DCArtboard>

        <DCArtboard id="l-succes" label="09 · Succès (light)" width={395} height={832}>
          <GsPhone theme="light" right={op} showClose
            title="Plein enregistré"
            body={<GsScreenSucces offline/>}
            action={<GsActionBar primary="Nouveau pointage" secondary="Fermer" primaryEnabled primaryIcon="plus"/>}
          />
        </DCArtboard>
      </DCSection>

      {/* ─── ÉTATS CLAIRS ───────────────────────────────────── */}
      <DCSection
        id="states"
        title="États clairs · vide & repli"
        subtitle="L'opérateur voit immédiatement quoi faire ensuite."
      >
        <DCArtboard id="s-empty" label="Accueil vide · prise de poste" width={395} height={832}>
          <GsPhone theme="dark" right={op}
            crumb="PL-GAS-003 · début de poste"
            title="Pointage carburant"
            body={<GsScreenAccueilEmpty/>}
            action={<GsActionBar primary="Commencer" primaryEnabled primaryIcon="arrow" hint="Aucun plein aujourd'hui"/>}
          />
        </DCArtboard>

        <DCArtboard id="s-vehicule-list" label="Véhicule · liste complète (caméra refusée)" width={395} height={832}>
          <GsPhone theme="dark" right={op} showBack stepDots={1}
            title="Choisir véhicule"
            body={<GsScreenVehicule mode="list"/>}
            action={<GsActionBar primary="Continuer · station" primaryEnabled hint="Caméra refusée · sélection manuelle CT-007"/>}
          />
        </DCArtboard>

        <DCArtboard id="s-bc-manual-light" label="N° BC · saisie manuelle (light)" width={395} height={832}>
          <GsPhone theme="light" right={truck} showBack stepDots={5}
            title="N° BC · manuel"
            body={<GsScreenBC mode="manual"/>}
            action={<GsActionBar primary="Continuer · valider" primaryEnabled hint="Repli manuel · scan dès que possible"/>}
          />
        </DCArtboard>
      </DCSection>

      {/* ─── NOTES DE CONCEPTION ───────────────────────────── */}
      <DCSection
        id="notes"
        title="Notes de conception · décisions terrain"
        subtitle="Pourquoi cette forme — opérateur dédié station, plein soleil, sous pression, parfois sans réseau."
      >
        <DCArtboard id="n-system" label="Système D82 · opérateur carburant" width={520} height={680}>
          <GasNotesSystem/>
        </DCArtboard>
        <DCArtboard id="n-rules" label="Logique métier verrouillée" width={460} height={680}>
          <GasNotesRules/>
        </DCArtboard>
        <DCArtboard id="n-open" label="À CONFIRMER avec LOI" width={460} height={680}>
          <GasNotesOpen/>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

// ─── Notes shell + helpers ─────────────────────────────────
function GsNoteShell({ children }) {
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
function GsNH({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
      color: '#5E6B7C', textTransform: 'uppercase',
      marginTop: 14, marginBottom: 6,
    }}>{children}</div>
  );
}
function GsNBullet({ children }) {
  return (
    <li style={{ display: 'flex', gap: 10, padding: '6px 0', listStyle: 'none' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: D82.teal, marginTop: 9, flexShrink: 0 }}/>
      <span style={{ flex: 1 }}>{children}</span>
    </li>
  );
}
function GsNMono({ children }) {
  return (
    <span style={{
      fontFamily: D82.mono, fontSize: 12, fontWeight: 600,
      background: '#EDE8D8', padding: '1px 5px', borderRadius: 3, color: '#0B2540',
    }}>{children}</span>
  );
}

function GasNotesSystem() {
  return (
    <GsNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Système D82 · opérateur carburant
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Module orienté <b>action terrain</b> — pas de KPI, pas de dashboard. 3-5 taps par plein.
      </div>

      <GsNH>Couleur — D82 STRICT</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Navy <GsNMono>#0B2540</GsNMono> header dans les deux modes · repérage instantané du module.</GsNBullet>
        <GsNBullet>Teal <GsNMono>#1A8E7E</GsNMono> = action primaire, plaque reconnue, station sélectionnée, plein enregistré.</GsNBullet>
        <GsNBullet>Orange <GsNMono>#C77E2A</GsNMono> = <b>Warn UNIQUEMENT</b> (hors-ligne, repli manuel, à confirmer). Rouge <GsNMono>#B8421E</GsNMono> = critique uniquement (échec envoi, anomalie consommation).</GsNBullet>
        <GsNBullet>Interdit : cyan · bleu-accent · violet · vert générique · orange-accent.</GsNBullet>
      </ul>

      <GsNH>Forme · jamais couleur seule</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Statut plein : rond teal (envoyé) · triangle orange (file offline) · carré rouge (échec).</GsNBullet>
        <GsNBullet>Étape active = pastille élargie 28×14px + halo + numéro <GsNMono>0X</GsNMono>. Étape passée = check, à venir = pastille grise.</GsNBullet>
      </ul>

      <GsNH>Typographie</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet><b>Inter</b> 14-22px UI · libellés caps 10-11px letter-spacing 1.5.</GsNBullet>
        <GsNBullet><b>IBM Plex Mono</b> sur TOUT chiffre : litres géant 64px, km géant 52px, codes <GsNMono>FUEL-2026</GsNMono> <GsNMono>BC-2026</GsNMono>, plaques <GsNMono>4271 TCB</GsNMono>, matricule, GPS.</GsNBullet>
      </ul>

      <GsNH>Targets terrain (gants OK)</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Action primaire <b>64px</b> · pavé numérique <b>68px par touche</b> · tuile station <b>96px</b>.</GsNBullet>
        <GsNBullet>Icônes <b>trait fin</b> partout · zéro emoji · zéro illustration.</GsNBullet>
        <GsNBullet>Cible scan plaque/BC ≥ 220px de haut · cadre turquoise + ligne de scan.</GsNBullet>
      </ul>

      <GsNH>Saisie</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Litres = <b>pavé numérique géant</b>, chiffre mono 64px, unité "L" claire à droite + boutons rapides +50 / +100 / Plein.</GsNBullet>
        <GsNBullet>Km actuel = mono 52px (5-6 chiffres lisibles en plein soleil) · trajet calculé auto vs dernier plein.</GsNBullet>
        <GsNBullet>Plaque et N° BC = scan caméra par défaut · saisie manuelle en repli (préfixe figé <GsNMono>BC-2026-</GsNMono>).</GsNBullet>
        <GsNBullet>Aucun champ texte libre dans la v1 · stations, véhicules en listes.</GsNBullet>
      </ul>

      <GsNH>Repère permanent</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Strip véhicule (camion + plaque + modèle) visible dès l'étape 2 — l'opérateur sait toujours sur quoi il pointe.</GsNBullet>
        <GsNBullet>Chip "PL-GAS-003" en haut · chip mission verte "CT-007 · 4271 TCB" pendant le flux.</GsNBullet>
      </ul>
    </GsNoteShell>
  );
}

function GasNotesRules() {
  return (
    <GsNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Logique métier · verrouillée
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Reprise du brief fuel v0. Aucune réinterprétation.
      </div>

      <GsNH>Flux unique · 6 étapes + succès</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet><b>Accueil</b> → <b>Véhicule</b> → <b>Station</b> → <b>Litres</b> (+ photo bon) → <b>Trajet/Km</b> (+ photo compteur) → <b>N° BC</b> → <b>Confirmation</b> → <b>Succès</b>.</GsNBullet>
        <GsNBullet>Pas de 4 onglets bas. Pas d'onglet manager / pas de feed KPI. 3-5 taps par plein.</GsNBullet>
      </ul>

      <GsNH>Accès</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Login universel matricule <GsNMono>PL-GAS-XXX</GsNMono> + PIN 4 chiffres. Opérateur DÉDIÉ station/dépôt — pas de login propre au module.</GsNBullet>
      </ul>

      <GsNH>Véhicule</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Scan plaque par défaut · liste flotte CT-001..015 en repli. SCHACMAN F3000 6×4 + KERAX · plaques <GsNMono>…TCB</GsNMono>.</GsNBullet>
        <GsNBullet>Pas de saisie libre · véhicule hors flotte = anomalie « Véhicule inconnu » <GsToConfirm>WORKFLOW</GsToConfirm>.</GsNBullet>
      </ul>

      <GsNH>Station</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>3 tuiles tap-larges 96px : <b>GALANA TMM</b> · <b>GALANA MMG</b> · <b>TOTAL ENERGIES</b>. Une seule sélection · pas de liste déroulante.</GsNBullet>
        <GsNBullet>Hors-réseau = anomalie « Station hors-réseau » (v1.1).</GsNBullet>
      </ul>

      <GsNH>Litres · GO livrée</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Pavé numérique 68px par touche · chiffre géant mono 64px · unité "L" inséparable.</GsNBullet>
        <GsNBullet>Photo du bon de pompe = <b>obligatoire</b> · GPS + plaque + horaire attachés automatiquement.</GsNBullet>
        <GsNBullet>Rappel "dernier plein" sous le chiffre · délta calculé silencieusement (pas d'alerte rouge tant que dans seuils).</GsNBullet>
      </ul>

      <GsNH>Trajet · km actuel</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Km actuel mono 52px (5-6 chiffres) · trajet = (km actuel − km dernier plein) calculé auto.</GsNBullet>
        <GsNBullet>Photo OCR du compteur recommandée · saisie manuelle si caméra refusée ou OCR échoue.</GsNBullet>
        <GsNBullet>Consommation L/100 km affichée en confirmation · alerte si hors moyenne flotte <GsToConfirm>SEUIL</GsToConfirm>.</GsNBullet>
      </ul>

      <GsNH>N° BC</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Scan code-barres par défaut · saisie manuelle en repli (préfixe <GsNMono>BC-2026-</GsNMono> figé, 5 chiffres restants).</GsNBullet>
      </ul>

      <GsNH>Confirmation · envoi</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Récap 6 lignes + "Modifier" inline sur chaque · indicateur cohérence consommation · GPS + matricule + horaire affichés.</GsNBullet>
        <GsNBullet>Hors ligne · plein mis en file · envoi auto au retour réseau · badge orange "HORS LIGNE · ENVOI AUTO" sur écran succès.</GsNBullet>
      </ul>
    </GsNoteShell>
  );
}

function GasNotesOpen() {
  return (
    <GsNoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        À CONFIRMER avec LOI
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Aucune donnée inventée. Zones en attente de validation produit.
      </div>

      <GsNH>Identifiants &amp; codes</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Format matricule opérateur <GsNMono>PL-GAS-XXX</GsNMono> proposé · longueur PIN (4 chiffres par défaut), durée session, gestion oubli PIN.</GsNBullet>
        <GsNBullet><GsNMono>FUEL-2026-####</GsNMono> · numéroteur local + reconciliation serveur.</GsNBullet>
        <GsNBullet><GsNMono>BC-2026-#####</GsNMono> · longueur exacte du numéro pompe (5 ou 6 chiffres ?).</GsNBullet>
      </ul>

      <GsNH>Seuils consommation</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Moyenne L/100 km par modèle (SCHACMAN F3000 6×4 vs KERAX) · seuil d'alerte « anormale » avant blocage envoi.</GsNBullet>
        <GsNBullet>Comportement si trajet négatif (km actuel &lt; dernier plein) — anomalie compteur ou autorisation ?</GsNBullet>
        <GsNBullet>Volume max par plein (capacité réservoir SCHACMAN F3000) — bloquer si saisie aberrante ?</GsNBullet>
      </ul>

      <GsNH>Stations &amp; réseau</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Liste GALANA TMM / GALANA MMG / TOTAL ENERGIES confirmée canonique · ajout/retrait par superviseur ?</GsNBullet>
        <GsNBullet>Cas véhicule rechargé hors-réseau (urgence, panne) — workflow anomalie « Station hors-réseau » + photo justificative.</GsNBullet>
      </ul>

      <GsNH>Caméra &amp; offline</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Permission caméra refusée → fallback uploader photo galerie ? Ou bloquer le pointage tant que photo manquante ?</GsNBullet>
        <GsNBullet>OCR compteur · seuil de confiance avant validation auto vs revue manuelle.</GsNBullet>
        <GsNBullet>Plafond file offline : nombre de pleins + taille des médias avant alerte stockage.</GsNBullet>
      </ul>

      <GsNH>Hors-périmètre</GsNH>
      <ul style={{ padding: 0, margin: 0 }}>
        <GsNBullet>Vue superviseur (KPI litres jour, consommation cumulée, alerte fraude) = <b>module séparé</b>, web cockpit, hors opérateur.</GsNBullet>
        <GsNBullet>Lien plein ↔ mission (réconciliation FUEL ↔ MIS) à câbler côté backend après v1.</GsNBullet>
      </ul>
    </GsNoteShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<GasApp/>);
