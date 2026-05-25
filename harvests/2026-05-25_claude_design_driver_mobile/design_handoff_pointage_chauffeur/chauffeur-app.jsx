// Chauffeur — Design canvas: dark (par défaut) puis light en bas.
// Plus 3 variantes de détails (Départ / Incident / Contrôle pré-départ).

function ChauffeurApp() {
  const chipDriver = <CDriverChip matricule="PL-CHF-007" />;
  const chipTruck  = <CTruckChip code="CT-007" plate="4271 TCB" />;

  const renderFlow = (theme) => (
    <>
      <DCArtboard id={`${theme}-s1`} label="01 · Véhicule" width={395} height={832}>
        <CPhone theme={theme} step={1} right={chipDriver} showBack={false}
          body={<ChScreen1Vehicle/>}
          action={<CActionBar primary="Continuer" primaryEnabled hint="CT-007 · pré-assigné aujourd'hui"/>}
        />
      </DCArtboard>
      <DCArtboard id={`${theme}-s2`} label="02 · Type d'événement" width={395} height={832}>
        <CPhone theme={theme} step={2} right={chipTruck}
          body={<ChScreen2Event selected="depart"/>}
          action={<CActionBar primary="Continuer" secondary="Retour" primaryEnabled hint="Événement : Départ voyage"/>}
        />
      </DCArtboard>
      <DCArtboard id={`${theme}-s3`} label="03 · Détails · Départ" width={395} height={832}>
        <CPhone theme={theme} step={3} right={chipTruck}
          body={<ChScreen3Depart/>}
          action={<CActionBar primary="Continuer" secondary="Retour" primaryEnabled hint="4 / 4 champs renseignés"/>}
        />
      </DCArtboard>
      <DCArtboard id={`${theme}-s4`} label="04 · Confirmation + signature" width={395} height={832}>
        <CPhone theme={theme} step={4} right={chipTruck}
          body={<ChScreen4Confirm/>}
          action={<CActionBar primary="Envoyer" secondary="Retour" primaryEnabled primaryIcon="check" hint="Signature présente · prêt à envoyer"/>}
        />
      </DCArtboard>
      <DCArtboard id={`${theme}-s5`} label="05 · Résumé enregistré" width={395} height={832}>
        <CPhone theme={theme} step={5} right={chipTruck} showBack={false}
          body={<ChScreen5Done/>}
          action={<CActionBar primary="Nouveau pointage" secondary="Fermer" primaryEnabled primaryIcon="plus"/>}
        />
      </DCArtboard>
    </>
  );

  return (
    <DesignCanvas
      title="LOI · Pointage Chauffeur — Mobile (D82)"
      subtitle="5 écrans · 375px · dark par défaut + light · SCHACMAN F3000 6×4 · CT-001..015 + KERAX"
    >
      <DCSection
        id="dark"
        title="Flux complet · DARK (par défaut)"
        subtitle="Soleil indirect / cabine · 3-5 taps · saisie zéro libre · primaire 64px · IBM Plex Mono sur tout chiffre"
      >
        {renderFlow('dark')}
      </DCSection>

      <DCSection
        id="light"
        title="Flux complet · LIGHT (plein soleil)"
        subtitle="Anti-miroir sous lumière directe — header navy conservé pour repérage"
      >
        {renderFlow('light')}
      </DCSection>

      <DCSection
        id="variants"
        title="Variantes Écran 03 · selon le type d'événement"
        subtitle="Le contenu de Détails change avec l'événement choisi en écran 02"
      >
        <DCArtboard id="v-incident" label="03b · Incident · Panne" width={395} height={832}>
          <CPhone theme="dark" step={3} right={chipTruck}
            body={<ChScreen3Incident/>}
            action={<CActionBar primary="Continuer" secondary="Retour" primaryEnabled hint="Gravité : Bloquant — TER alerté" />}
          />
        </DCArtboard>
        <DCArtboard id="v-controle" label="03c · Contrôle pré-départ" width={395} height={832}>
          <CPhone theme="dark" step={3} right={chipTruck}
            body={<ChScreen3Controle/>}
            action={<CActionBar primary="Envoyer au mécano" secondary="Retour" primaryEnabled hint="1 défaut bloquant · 1 attention"/>}
          />
        </DCArtboard>
        <DCArtboard id="v-controle-light" label="03c · Contrôle (light)" width={395} height={832}>
          <CPhone theme="light" step={3} right={chipTruck}
            body={<ChScreen3Controle/>}
            action={<CActionBar primary="Envoyer au mécano" secondary="Retour" primaryEnabled hint="1 défaut bloquant · 1 attention"/>}
          />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="notes"
        title="Notes de conception · décisions terrain"
        subtitle="Pourquoi cette forme — chauffeur SCHACMAN, plein soleil, gants, faible familiarité tech"
      >
        <DCArtboard id="n-system" label="Système" width={520} height={620}>
          <ChauffeurNotes/>
        </DCArtboard>
        <DCArtboard id="n-flow" label="Pourquoi 5 écrans" width={460} height={620}>
          <FlowNotes/>
        </DCArtboard>
        <DCArtboard id="n-open" label="À CONFIRMER avec LOI" width={460} height={620}>
          <OpenNotes/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// ─── Notes ──────────────────────────────────────────────────
function NoteShell({ children }) {
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
function H({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
      color: '#5E6B7C', textTransform: 'uppercase',
      marginTop: 14, marginBottom: 6,
    }}>{children}</div>
  );
}
function Bullet({ children }) {
  return (
    <li style={{ display: 'flex', gap: 10, padding: '6px 0', listStyle: 'none' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: D82.teal, marginTop: 9, flexShrink: 0 }}/>
      <span style={{ flex: 1 }}>{children}</span>
    </li>
  );
}
function Mono({ children }) {
  return (
    <span style={{
      fontFamily: D82.mono, fontSize: 12, fontWeight: 600,
      background: '#EDE8D8', padding: '1px 5px', borderRadius: 3, color: '#0B2540',
    }}>{children}</span>
  );
}

function ChauffeurNotes() {
  return (
    <NoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Système D82 · chauffeur
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Hypothèses : une main · gants · soleil intermittent · réseau intermittent · faible familiarité tech.
      </div>
      <H>Thème</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet><b>Dark par défaut</b> (<Mono>#061629</Mono>) — cabine la journée, glare réduit. <b>Light</b> (<Mono>#F5F1E8</Mono>) sous lumière directe.</Bullet>
        <Bullet>Header navy <Mono>#0B2540</Mono> dans les deux modes — repérage instantané du module.</Bullet>
        <Bullet>Accent <Mono>#1A8E7E</Mono> exclusivement sur l'action primaire et la validation. Zéro cyan, zéro bleu vif, zéro violet.</Bullet>
      </ul>
      <H>Typographie</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet><b>Inter</b> pour l'UI · body ≥16px · titres 22px · libellés caps 10-11px / letter-spacing 1.5.</Bullet>
        <Bullet><b>IBM Plex Mono</b> pour TOUT chiffre / code : plaques, codes véhicule, km, tonnage, heures, référence, n° série.</Bullet>
      </ul>
      <H>Targets terrain</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Action primaire <b>64px</b> · secondaire 56px · cartes 72-92px de haut. Gap 10. Gants OK.</Bullet>
        <Bullet>Status par <b>couleur + forme + libellé</b> (jamais couleur seule). Triangle = attention, carré = bloquant, rond = OK.</Bullet>
        <Bullet>Saisie : scan plaque · photo compteur (OCR corrigeable) · photo preuve · voix · pavé numérique · listes. <b>Zéro champ texte libre</b> quand évitable.</Bullet>
      </ul>
    </NoteShell>
  );
}

function FlowNotes() {
  return (
    <NoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        Pourquoi 5 écrans
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Un seul axe à la fois pour décider. Pas de tableau de KPIs.
      </div>
      <H>01 · Véhicule</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Pré-rempli avec le camion assigné du jour — le chauffeur valide en 1 tap.</Bullet>
        <Bullet>Fallback : scan plaque (caméra HTML5) ou liste CT-001..015 + KERAX.</Bullet>
      </ul>
      <H>02 · Type d'événement</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>7 tuiles · icône + libellé court FR. Incident en bas, accent orange pour le distinguer.</Bullet>
      </ul>
      <H>03 · Détails (selon type)</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Départ/Arrivée : site (liste réelle) · km (photo compteur OCR) · matière · tonnage.</Bullet>
        <Bullet>Incident/Panne : type (pills) · photo preuve · note vocale · gravité (couleur + forme + libellé).</Bullet>
        <Bullet>Contrôle pré-départ : 5 bascules · vert silencieux si OK · orange/rouge + icône si défaut.</Bullet>
      </ul>
      <H>04 · Confirmation + signature</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Récap clair + zone signature TER · effaçable.</Bullet>
      </ul>
      <H>05 · Résumé enregistré</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>« Enregistré » net · référence locale · file de sync visible · suggestion d'événement suivant.</Bullet>
      </ul>
    </NoteShell>
  );
}

function OpenNotes() {
  return (
    <NoteShell>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0B2540', letterSpacing: -0.3 }}>
        À CONFIRMER avec LOI
      </div>
      <div style={{ fontSize: 13, color: '#5E6B7C', marginTop: 4 }}>
        Aucune donnée inventée. Voici les zones qui attendent validation produit.
      </div>
      <H>Plaques &amp; matricule</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Masque exact plaque · suffixe <Mono>TCB</Mono> mentionné, format complet à figer.</Bullet>
        <Bullet>Format matricule chauffeur · <Mono>PL-CHF-XXX</Mono> proposé.</Bullet>
      </ul>
      <H>Sites &amp; matières</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Liste sites figée : Port Toamasina (PDP/MOCCO/C4) · Betainomby · Moramanga · APC Andriamena · COLAS/Ivondro. Autres ?</Bullet>
        <Bullet>Liste matières : granite (30T) · chrome APC (22T). Autres références ?</Bullet>
        <Bullet>Tonnages standards par matière vs. saisie libre.</Bullet>
      </ul>
      <H>Référence pointage</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Format <Mono>PNT-AAAA-MMDD-####</Mono> proposé · numéroteur local + reconciliation serveur.</Bullet>
      </ul>
      <H>Caméra HTML5</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Permissions caméra demandées au premier scan · fallback si refus.</Bullet>
        <Bullet>Modèle OCR pour le compteur · seuil de confiance pour basculer en saisie manuelle.</Bullet>
      </ul>
      <H>Workflow post-MVP</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Signature TER · destinataire (papier vs. backend).</Bullet>
        <Bullet>Cas dégradés : plaque illisible · OCR raté · photo refusée. À cadrer en v1.1.</Bullet>
      </ul>
    </NoteShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ChauffeurApp />);
