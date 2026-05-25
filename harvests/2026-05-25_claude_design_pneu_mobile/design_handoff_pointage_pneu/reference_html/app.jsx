// App — Design canvas hosting the 5 screen artboards.

function Note({ children }) {
  return (
    <DCPostIt width={220} rotate={-1.5} top={-44} left={4}>
      {children}
    </DCPostIt>
  );
}

function App() {
  // The chip on the right of the app bar varies per screen
  const chipMec = <LOIMatChip matricule="PL-MEC-007" />;
  const chipTruck = <LOITruckChip code="CT-007" plate="4271 TCB" />;

  return (
    <DesignCanvas
      title="LOI · Pointage Pneu — Mobile (D82)"
      subtitle="Refonte mécano terrain · 5 écrans · SCHACMAN F3000 6×4 · CT-007"
    >
      <DCSection
        id="flow"
        title="Flux complet · 3-5 taps par écran"
        subtitle="Light cream (D82) · navy header · teal action · zéro cyan/bleu · taille primaire 64px · saisie ZÉRO texte libre"
      >
        <DCArtboard id="s1" label="01 · Véhicule" width={412} height={892}>
          <LOIPhone
            step={1}
            right={chipMec}
            showBack={false}
            body={<Screen1Vehicle/>}
            action={
              <LOIActionBar
                primary="Continuer"
                primaryEnabled={true}
                hint="CT-007 · 4271 TCB sélectionné"
              />
            }
          />
        </DCArtboard>

        <DCArtboard id="s2" label="02 · Position essieu" width={412} height={892}>
          <LOIPhone
            step={2}
            right={chipTruck}
            body={<Screen2Position/>}
            action={
              <LOIActionBar
                primary="Continuer"
                secondary="Retour"
                primaryEnabled={true}
                hint="Position MOT 2ESS-EXT-G enregistrée"
              />
            }
          />
        </DCArtboard>

        <DCArtboard id="s3" label="03 · Type d'événement" width={412} height={892}>
          <LOIPhone
            step={3}
            right={chipTruck}
            body={<Screen3Event/>}
            action={
              <LOIActionBar
                primary="Continuer"
                secondary="Retour"
                primaryEnabled={true}
                hint="Événement : Montage"
              />
            }
          />
        </DCArtboard>

        <DCArtboard id="s4" label="04 · Détails" width={412} height={892}>
          <LOIPhone
            step={4}
            right={chipTruck}
            body={<Screen4Details/>}
            action={
              <LOIActionBar
                primary="Valider"
                secondary="Retour"
                primaryEnabled={true}
                hint="4 / 4 champs renseignés"
              />
            }
          />
        </DCArtboard>

        <DCArtboard id="s5" label="05 · Confirmation" width={412} height={892}>
          <LOIPhone
            step={5}
            right={chipTruck}
            body={<Screen5Confirm/>}
            action={
              <LOIActionBar
                primary="Nouveau pointage"
                secondary="Terminer"
                primaryEnabled={true}
              />
            }
          />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="notes"
        title="Notes terrain · décisions de design"
        subtitle="Pourquoi cette forme — extraits §2 et §7 du contexte LOI"
      >
        <DCArtboard id="n1" label="Système" width={520} height={620}>
          <DesignNotes/>
        </DCArtboard>
        <DCArtboard id="n2" label="Schéma essieux" width={420} height={620}>
          <AxleNotes/>
        </DCArtboard>
        <DCArtboard id="n3" label="À CONFIRMER avec LOI" width={460} height={620}>
          <OpenQuestions/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// ─── Side notes (kept simple) ────────────────────────────────
function NoteCard({ children, color = LOI.navy, bg = LOI.card }) {
  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box',
      background: bg, color, padding: '22px 24px',
      fontFamily: LOI.ui, fontSize: 14, lineHeight: 1.5,
      borderRadius: 12, border: `1px solid ${LOI.line}`,
      overflow: 'auto',
    }}>
      {children}
    </div>
  );
}

function Bullet({ children, color = LOI.teal }) {
  return (
    <li style={{
      display: 'flex', gap: 10, padding: '6px 0',
      listStyle: 'none',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: color,
        marginTop: 9, flexShrink: 0,
      }}/>
      <span style={{ flex: 1 }}>{children}</span>
    </li>
  );
}

function H({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
      color: LOI.steel, textTransform: 'uppercase',
      marginTop: 14, marginBottom: 6,
    }}>{children}</div>
  );
}

function Mono({ children }) {
  return (
    <span style={{
      fontFamily: LOI.mono, fontSize: 12, fontWeight: 600,
      background: LOI.lineSoft, padding: '1px 5px', borderRadius: 3,
      color: LOI.navy,
    }}>{children}</span>
  );
}

function DesignNotes() {
  return (
    <NoteCard>
      <div style={{ fontSize: 20, fontWeight: 800, color: LOI.navy, letterSpacing: -0.3 }}>
        Système (D82 light · sun mode)
      </div>
      <div style={{ fontSize: 13, color: LOI.steel, marginTop: 4 }}>
        Choix assumés pour le mécanicien en plein soleil, avec gants, sans réseau.
      </div>
      <H>Thème</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet><b>Light cream</b> (<Mono>#F5F1E8</Mono> / texte navy <Mono>#0B2540</Mono>) — meilleur que dark sous soleil direct (anti-miroir).</Bullet>
        <Bullet><b>Header navy</b> pour la hiérarchie et le repérage instantané du module.</Bullet>
        <Bullet>Accent <b>teal</b> <Mono>#1A8E7E</Mono> exclusivement sur l'action primaire et la validation. Zéro cyan, zéro bleu vif.</Bullet>
      </ul>
      <H>Typographie</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet><b>Inter</b> pour l'UI. Titres 22px, body 14-16px, libellés caps 10-11px / letter-spacing 1.5.</Bullet>
        <Bullet><b>IBM Plex Mono</b> sur tout chiffre/code : plaques, codes véhicule, code position, n° série, km, heures.</Bullet>
      </ul>
      <H>Targets terrain (§7)</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Action primaire <b>64px</b> · secondaire 60px · cartes 72-92px de haut.</Bullet>
        <Bullet>Espacement généreux (gap 10), pas de cibles serrées.</Bullet>
        <Bullet>Status par <b>couleur + forme + libellé</b> (jamais couleur seule).</Bullet>
      </ul>
    </NoteCard>
  );
}

function AxleNotes() {
  return (
    <NoteCard>
      <div style={{ fontSize: 20, fontWeight: 800, color: LOI.navy, letterSpacing: -0.3 }}>
        Schéma essieux · 6×4
      </div>
      <div style={{ fontSize: 13, color: LOI.steel, marginTop: 4 }}>
        Vue plongeante. Le mécano voit son camion comme s'il marchait autour.
      </div>
      <H>Conventions</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Avant en haut, repère <Mono>← GAUCHE · DROITE →</Mono> en bas pour annuler toute ambiguïté.</Bullet>
        <Bullet>Essieu 1 : 2 pneus simples (directeur).</Bullet>
        <Bullet>Essieux 2 &amp; 3 : 4 pneus jumelés (motrices). Ext / Int marqués par la position.</Bullet>
      </ul>
      <H>Code position</H>
      <div style={{
        background: LOI.navy, color: '#fff', padding: '12px 14px',
        borderRadius: 8, fontFamily: LOI.mono, marginTop: 4,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.5 }}>MOT 2ESS-EXT-G</div>
        <div style={{ fontSize: 11, color: '#9CD4C9', marginTop: 4, fontFamily: LOI.ui }}>
          MOT = motrice (vs REM remorque) · 2ESS = essieu 2 · EXT = extérieur · G = gauche
        </div>
      </div>
      <H>Variantes config</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>4×2 (2 essieux), 6×2, 8×4 — <ToConfirm>parc exact LOI</ToConfirm> à valider pour la flotte KERAX.</Bullet>
        <Bullet>Le schéma s'adapte selon le code véhicule choisi à l'écran 1.</Bullet>
      </ul>
    </NoteCard>
  );
}

function OpenQuestions() {
  return (
    <NoteCard>
      <div style={{ fontSize: 20, fontWeight: 800, color: LOI.navy, letterSpacing: -0.3 }}>
        À CONFIRMER avec LOI
      </div>
      <div style={{ fontSize: 13, color: LOI.steel, marginTop: 4 }}>
        Aucune donnée inventée. Voici les zones qui attendent validation produit.
      </div>
      <H>Plaques &amp; codes</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Format exact plaque (les exemples utilisent suffixe <Mono>TCB</Mono> mentionné §3).</Bullet>
        <Bullet>Format n° série pneu (DOT vs QR LOI propre). Exemple affiché : <Mono>Y82C19A2387</Mono>.</Bullet>
        <Bullet>Référence locale du pointage (format <Mono>PNEU-AAAA-MMDD-####</Mono> proposé).</Bullet>
      </ul>
      <H>Liste marques pneu</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Liste autorisée à figer dans <Mono>lib/loi-master-dataset</Mono>. Exemple : Michelin XZA2 utilisé ici.</Bullet>
        <Bullet>Tailles supportées (315/80 R22.5 affiché à titre d'exemple).</Bullet>
      </ul>
      <H>Hiérarchie essieux par modèle</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Mapping <Mono>CT-###</Mono> → config essieux (6×4 / 6×2 / autres).</Bullet>
        <Bullet>Convention <Mono>MOT</Mono> / <Mono>REM</Mono> si remorques entrent dans le scope.</Bullet>
      </ul>
      <H>Workflow post-MVP</H>
      <ul style={{ padding: 0, margin: 0 }}>
        <Bullet>Signature TER mentionnée §4 — non incluse dans ces 5 écrans.</Bullet>
        <Bullet>Cas dégradés : pneu inconnu, écart km, photo refusée. À cadrer dans une v1.1.</Bullet>
      </ul>
    </NoteCard>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
