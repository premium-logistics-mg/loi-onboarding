# Handoff · Pointage Chauffeur (LOI · Premium Logistics)

Module mobile de pointage pour les chauffeurs poids-lourds de **LOI · Premium Logistics** (Madagascar). Permet à un chauffeur (PL-CHF-XXX) en cabine SCHACMAN F3000 6×4 / KERAX de pointer ses événements de transport (départ, arrivée, chargement, déchargement, incident, contrôle pré-départ, pause) avec une saisie minimale, en conditions terrain difficiles : plein soleil, gants, faible familiarité tech, réseau intermittent.

## About the Design Files

Les fichiers de ce bundle sont **des références de design réalisées en HTML/JSX (React via Babel inline)** — ce sont des prototypes qui montrent l'apparence et le comportement souhaités, **pas** du code production à copier-coller. La tâche est de **reproduire ces designs dans l'environnement existant du codebase cible** (React Native / Flutter / SwiftUI / Kotlin Compose / etc.) en utilisant ses patterns et sa stack établis. Si aucun environnement n'existe encore, choisir la stack la plus adaptée (recommandation : **React Native** ou **Flutter** pour cibler iOS + Android, étant donné que tout doit fonctionner offline et accéder à la caméra native).

## Fidelity

**High-fidelity (hifi)** — mockups pixel-perfect. Couleurs, typographies, espacements, états et flux finalisés. Les valeurs exactes (hex, px, rem) doivent être respectées.

## Design System · D82 (strict)

### Couleurs de marque (verrouillées)

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#0B2540` | App bar, hero sombre, texte primaire (light) |
| `teal` | `#1A8E7E` | Accent unique · action primaire · validation · sélection |
| `cream` | `#F5F1E8` | Background light · texte sur fond sombre |

**Interdits absolus :** cyan, bleu vif, orange-accent, violet, vert générique. Le seul accent est `teal`. Le statut peut utiliser orange (`#C77E2A`) et rouge (`#B8421E`) UNIQUEMENT pour avertir / signaler un défaut, jamais comme accent décoratif.

### Palette dark (mode par défaut · cabine)

```
paper        #061629   /* background page */
surface      #0F2A47   /* cards */
surface2     #173659   /* cards en relief */
surfaceMute  #0B2540
line         #1E3E66
lineSoft     #15304F
divider      #1A3556
text         #F5F1E8
text2        #B7C9E0
text3        #7E94B5
text4        #56708F
header       #0B2540   /* navy (inchangé) */
headerInk    #FFFFFF
primaryBg    #1A8E7E   /* teal */
primaryShadow  0 8px 20px rgba(26,142,126,0.45)
```

### Palette light (plein soleil)

```
paper        #F5F1E8
surface      #FFFFFF
surface2     #FBF7EC
surfaceMute  #EDE8D8
line         #D7D2C2
lineSoft     #E6E1D2
divider      #CFC9B6
text         #0B2540
text2        #384A63
text3        #5E6B7C
text4        #8A95A3
header       #0B2540   /* navy conservé pour repérage instantané */
primaryShadow  0 8px 20px rgba(26,142,126,0.30)
```

### Statuts (couleur + forme + libellé · jamais couleur seule)

| Statut | Couleur | Forme | Libellé |
|---|---|---|---|
| OK | `#2D8659` (green) | rond (●) | "OK" |
| Attention | `#C77E2A` (orange) | triangle (▲) | "À surveiller" |
| Défaut/Bloquant | `#B8421E` (red) | carré (■) ou croix (✕) | "Défaut" / "Bloquant" |

## Typographie

- **Inter** (400, 500, 600, 700, 800) — toute l'UI
- **IBM Plex Mono** (500, 600, 700) — TOUT chiffre / code : plaques, codes véhicule (CT-###), matricule chauffeur (PL-CHF-XXX), km, tonnage, heures, références de pointage, numéros de série

### Échelle

| Rôle | Taille | Poids | Letter-spacing | Notes |
|---|---|---|---|---|
| Titre app bar | 22px | 800 | -0.3 | Inter |
| Titre hero (succès) | 26px | 800 | -0.3 | Inter |
| Chiffre vedette (km, code) | 22–26px | 700 | 0.4–0.5 | **Mono** |
| Body | 16px min | 500–600 | 0 | Inter |
| Label de carte | 17px | 700 | -0.2 | Inter |
| Label de section (caps) | 10–11px | 800 | 1.5 | Inter, uppercase |
| Sous-libellé | 12–13px | 500 | 0 | Inter |

**Body minimum 16px** non négociable.

## Targets terrain (non négociables)

- **Action primaire** : `height: 64px`
- **Action secondaire** : `height: 56px`
- **Cartes interactives** : `min-height: 72–92px`
- **Pills / chips tappables** : `min-height: 48px`
- **Gap entre cibles** : `10px` minimum (gants compatibles)
- **3 à 5 taps maximum** par tâche
- **Hit slop** : prévoir 8–12px invisibles autour des petits boutons

## Frame

- Mobile **375 × 812** (référence iPhone 13 mini / SE).
- Status bar custom (navy `#0B2540`, indicateur HORS LIGNE quand applicable).
- App bar navy avec : retour, breadcrumb, titre, chip droite (matricule ou véhicule).
- Indicateur d'étapes (5 segments) directement sous l'app bar.
- Body scrollable.
- Action bar fixe en bas avec hint contextuel.

---

## Screens

### Screen 1 · Véhicule

**Purpose** — Confirmer ou choisir le véhicule. Le chauffeur connecté (`PL-CHF-007`) a un véhicule **pré-assigné aujourd'hui** (`CT-007 · 4271 TCB · SCHACMAN F3000 6×4`). Le but : valider en 1 tap, fallback rapide en cas de changement.

**Layout** (de haut en bas) :
1. Hero "Assigné aujourd'hui" — carte teal-bordered avec icône camion (64×64 teal), code véhicule en Mono 26px, plaque Mono 16px, modèle 13px.
2. Bouton "Scanner une autre plaque" — fallback caméra, bordure dashed.
3. Section "Autres véhicules de la flotte" — liste boutons (3 derniers utilisés).
4. Note `À CONFIRMER` : format plaque + mapping CT-### → modèle.

**Données réelles** :
- Codes véhicule : `CT-001` à `CT-015`
- Modèles : `SCHACMAN F3000 6X4` (principal), `RENAULT KERAX`
- Plaques se terminant en `…TCB` (suffixe confirmé, format exact à valider)
- Matricule chauffeur : `PL-CHF-XXX`

**Action primaire** : "Continuer" — activée immédiatement (pré-rempli).

---

### Screen 2 · Type d'événement

**Purpose** — Choisir un événement parmi 7. Pas de combo, pas de menu — toutes les options visibles d'un coup.

**Layout** — Liste verticale de 7 tuiles (`min-height: 84px`), chaque tuile = icône SVG (52×52) + label + description courte + chevron (ou checkmark si sélectionné).

**Les 7 événements** (ordre exact) :

1. **Départ voyage** — "Quitte un site avec chargement"
2. **Arrivée** — "Arrive sur site destination"
3. **Chargement** — "Matière chargée sur le camion"
4. **Déchargement** — "Matière déposée sur site"
5. **Contrôle pré-départ** — "Check-list avant de rouler"
6. **Pause** — "Arrêt repas · repos"
7. **Incident · Panne** — "Problème route · véhicule · charge" — accent **orange** (`#C77E2A`) pour le distinguer

L'incident est placé en bas et codé orange (couleur + position) pour réduire les mis-taps.

---

### Screen 3 · Détails (3 variantes selon le type)

#### 3a · Départ / Arrivée

**Champs** (cartes empilées, chaque carte ≈ 76px) :

1. **Site** — choisi dans la liste figée des sites LOI :
   - Port Toamasina (`PDP`, `MOCCO`, `C4`)
   - Garage Betainomby
   - Moramanga (relais)
   - APC Andriamena (via RN44)
   - COLAS / Ivondro

2. **Kilométrage** — carte plus grande avec :
   - Chiffre Mono 26px (`184 350 km`)
   - Photo compteur en thumbnail (56×36) avec hatch placeholder
   - Badge teal "OCR 98%" indiquant le niveau de confiance
   - Texte d'aide : "Touche le chiffre pour le corriger" (OCR corrigeable)
   - Bouton "Modifier"

3. **Matière** — liste fermée :
   - Granite (blocs) · standard 30T
   - Chrome APC · standard 22T

4. **Tonnage** — Mono, ajustable, pré-rempli selon la matière.

**Footer** : hint "Enregistré localement · envoi auto au réseau" + check vert.

#### 3b · Incident / Panne

**Champs** :

1. **Type d'incident** — pills (`min-height: 48px`, `border-radius: 999px`) :
   `Panne véhicule` (sélectionné), `Accident`, `Route RN44`, `Contrôle`, `Autre`.

2. **Photo preuve** — carte avec thumbnail hatch placeholder + bouton "+ Photo".

3. **Note vocale** — carte avec :
   - Bouton mic rond rouge 44×44
   - Durée Mono `00:18`
   - Waveform fake (23 barres de hauteurs variables, premières barres en teal, fin en text4)
   - Bouton "Ré-enr."

4. **Gravité** — 3 pills côte à côte (`flex: 1`, `min-height: 64px`) :
   - **Mineur** — green `#2D8659` + rond
   - **Gênant** — orange `#C77E2A` + triangle
   - **Bloquant** — red `#B8421E` + carré (sélectionné dans le mock)

   Note d'accompagnement : "Couleur + forme + libellé — jamais couleur seule"

#### 3c · Contrôle pré-départ

**Layout** — 5 lignes de check (`min-height: 64px` chacune), chaque ligne :
- Icône à gauche (36×36, bordée par la couleur du statut)
- Label : `Pneus · pression · état` / `Freins · niveau pédale` / `Niveaux · huile + eau` / `Feux · phares + clignotants` / `Documents · carte grise + permis`
- Sous-label en caps : `OK` / `À surveiller` / `Défaut` (couleur correspondante)
- Toggle iOS-style à droite (48×28)

**Comportement** : vert silencieux si OK (toggle teal activé) ; orange/rouge + icône triangle/croix si défaut. Une ligne mappée à `defaut` déclenche un encart d'alerte en bas :

> ▲ Défaut bloquant détecté — Va voir le mécano avant de rouler

L'action primaire devient **"Envoyer au mécano"** au lieu de "Continuer".

---

### Screen 4 · Confirmation + Signature TER

**Purpose** — Vérifier le récap et signer avant envoi.

**Layout** :

1. Label section "Vérifie avant d'envoyer".
2. **Carte récap** — clés en caps 11px à gauche, valeurs en Mono ou Inter à droite, séparateurs `lineSoft` :
   - Véhicule (mono)
   - Événement
   - Site
   - Matière (mono pour le tonnage)
   - Kilométrage (mono)
   - Chauffeur · heure (mono)
3. **Zone signature** — fond clair (`rgba(245,241,232,0.94)` en dark, `#FFFFFF` en light), 150px de haut :
   - Baseline horizontale gris
   - SVG path imitant une signature manuscrite (couleur navy)
   - Étiquette en bas-gauche `X · PL-CHF-007` (Mono 10px)
   - Bouton "Effacer" en haut-droite

**Action primaire** : "Envoyer" + icône check.

---

### Screen 5 · Résumé enregistré

**Purpose** — Confirmer l'enregistrement, montrer la file de sync, proposer la suite.

**Layout** :

1. **Hero navy** plein-large — cercle teal 64×64 avec check 38px, halo `0 0 0 6px rgba(26,142,126,0.30)`, titre "Enregistré" 26/800, sous-titre "Pointage dans la file locale · sync au réseau".
2. **Bande référence** — bg teal-tinted, label caps "Référence locale" + valeur Mono `PNT-2026-0525-0087`.
3. **Carte récap mini** — icône événement (teal 48×48), label "Départ voyage", sous-ligne Mono `CT-007 · 184 350 km · 30 T granite`.
4. **Indicateur file de sync** — carte dashed, cercle orange avec icône refresh, "2 pointages en file · envoi auto dès le retour du réseau".
5. **Section "Prochain pointage probable"** — suggestion contextuelle "Arrivée · APC Andriamena · ~5h de route via RN44".

**Action primaire** : "Nouveau pointage" + icône `+`. **Action secondaire** : "Fermer".

---

## Interactions & Behavior

### Navigation

- **Retour** (chevron app bar) à toutes les étapes sauf 1 et 5.
- **Indicateur d'étapes** (5 segments) — segment rempli teal = fait/en cours, ghost = à venir.
- Tap sur un véhicule de la liste écran 1 → applique et avance.
- Tap sur une tuile écran 2 → applique le type, met à jour la variante écran 3.
- Validation écran 4 → écran 5 avec animation de check (à définir, doux, ~300ms).

### Caméra (HTML5 / native)

Trois usages caméra distincts :

1. **Scan plaque** (écran 1) — frame visée + crop + OCR plaque. Si succès → applique automatiquement le véhicule. Si échec → bascule liste.
2. **Photo compteur** (écran 3a) — capture + OCR chiffres. Affiche niveau de confiance (`OCR 98%`). Si confiance < 80% → pousse l'utilisateur vers édition manuelle. La saisie reste **toujours corrigeable** par tap sur le chiffre.
3. **Photo preuve** (écran 3b) — capture standard, persistée localement, attachée au pointage.

### Note vocale (écran 3b)

- Permission micro demandée au premier usage.
- Maximum suggéré : 60s (à confirmer avec LOI).
- Compression côté device avant queueing offline.

### Offline-first

- Tout pointage est **enregistré localement immédiatement**.
- Indicateur "HORS LIGNE" dans la status bar quand pas de réseau.
- File de sync visible en écran 5 ("N pointages en file").
- Sync auto au retour du réseau, idempotente côté serveur (référence locale = idempotency key).

### Animations

- Transitions entre écrans : slide horizontal 250ms `ease-out`.
- Toggles checklist : 180ms.
- Check de succès écran 5 : scale 0.6 → 1.0 avec halo qui se déploie, 400ms total.
- Pas de parallax, pas de bounce excessif — terrain.

### États

| État | Comportement |
|---|---|
| Action désactivée | bg `surfaceMute`, texte `text4`, pas de shadow, cursor not-allowed |
| Action activée | bg `teal`, shadow primaire, icône arrow/check/plus |
| Carte sélectionnée | border 2px teal, shadow teal subtile |
| Carte non sélectionnée | border 1.5px `line`, pas de shadow |
| OCR confiance haute | badge teal "OCR 98%" |
| OCR confiance basse | À CONFIRMER — proposer "Corrige le chiffre" en accent |
| Réseau présent | pas d'indicateur HORS LIGNE |
| Réseau absent | badge orange "HORS LIGNE" dans status bar |

## State Management

Variables d'état attendues :

```ts
type PointageDraft = {
  vehicleCode: string;          // 'CT-007'
  plate: string;                // '4271 TCB'
  model: 'SCHACMAN F3000 6X4' | 'RENAULT KERAX';
  eventType: 'depart' | 'arrivee' | 'chargement' | 'dechargement'
           | 'controle' | 'pause' | 'incident';
  // Variant fields (présents selon eventType)
  site?: SiteId;                // pour depart / arrivee / chargement / dechargement
  kmDepart?: number;
  kmDepartOcrConfidence?: number;
  kmDepartPhotoUri?: string;
  matiere?: 'granite' | 'chrome-apc';
  tonnage?: number;             // T
  incidentType?: 'panne' | 'accident' | 'route-rn44' | 'controle' | 'autre';
  incidentPhotos?: string[];
  incidentVoiceUri?: string;
  incidentVoiceDuration?: number;
  gravite?: 'mineur' | 'gene' | 'bloquant';
  checklist?: Record<ChecklistItem, 'ok' | 'attention' | 'defaut'>;
  signatureSvgPath?: string;
  driverMatricule: string;      // 'PL-CHF-007'
  capturedAt: ISODate;
  localRef: string;             // 'PNT-AAAA-MMDD-####' — généré local
};

type SyncQueueEntry = PointageDraft & { syncStatus: 'pending' | 'sending' | 'failed' };
```

## Design Tokens (résumé)

### Spacing

```
4, 6, 8, 10, 12, 14, 16, 18, 22, 24
```

### Border-radius

```
3   /* badge / pill micro */
6   /* small chips */
8   /* small buttons / icon containers */
10  /* secondary button */
12  /* card */
14  /* hero card */
18  /* phone frame */
999 /* full pill */
```

### Shadows

```
card-active dark   0 6px 18px rgba(0,0,0,0.40)
card-active light  0 6px 16px rgba(26,142,126,0.20)
primary dark       0 8px 20px rgba(26,142,126,0.45)
primary light      0 8px 20px rgba(26,142,126,0.30)
action-bar dark    0 -12px 30px rgba(0,0,0,0.40)
action-bar light   0 -10px 24px -16px rgba(11,37,64,0.20)
phone frame        0 30px 80px rgba(11,37,64,0.32)
```

## Assets

- **Polices** : Google Fonts — `Inter` (400/500/600/700/800), `IBM Plex Mono` (400/500/600/700).
- **Icônes** : toutes en SVG inline, dessinées dans la grammaire D82 (stroke 2.2, linecap/linejoin round). À remplacer par un set cohérent côté codebase (recommandation : Lucide ou Phosphor en variante "regular" stroke 2). Aucune dépendance icône externe dans le mock.
- **Images** : aucune photo réelle ; thumbnails compteur et preuve sont des placeholders `repeating-linear-gradient` à 45°. À remplacer par les vraies captures caméra au runtime.

## Open Questions · `À CONFIRMER`

Les zones suivantes attendent validation produit avant développement :

1. **Format exact des plaques** — suffixe `TCB` confirmé, masque complet à figer (ex: `\d{4}\s*TCB` ?).
2. **Mapping CT-### → modèle** — CT-007 = SCHACMAN, CT-011 = KERAX dans le mock. Liste exhaustive de la flotte à fournir.
3. **Liste figée des sites LOI** — 5 sites principaux dans le mock. Sites complémentaires + capacité d'ajouter à la volée vs. liste verrouillée.
4. **Liste figée des matières** — granite et chrome APC dans le mock. Autres références ? Tonnages standards par matière ?
5. **Format référence pointage** — `PNT-AAAA-MMDD-####` proposé. Numéroteur local + reconciliation serveur.
6. **OCR compteur** — moteur (Tesseract / cloud) + seuil de confiance pour basculer en saisie manuelle.
7. **Caméra** — comportement si permission refusée. Fallback ?
8. **Signature TER** — destinataire (PDF papier vs. backend uniquement) ; conservation.
9. **Note vocale** — durée max ; codec ; comportement si stockage local plein.
10. **Cas dégradés** — plaque illisible, photo refusée, OCR raté, écart km invraisemblable. À cadrer en v1.1.

## Files

Dans ce bundle :

- `Pointage Chauffeur.html` — point d'entrée
- `chauffeur-shell.jsx` — tokens D82, palettes dark/light, status bar, app bar, indicateur d'étapes, action bar, phone composer
- `chauffeur-screens.jsx` — les 5 écrans + 3 variantes du Détails
- `chauffeur-app.jsx` — orchestration design canvas (toutes les variations côte-à-côte)
- `design-canvas.jsx` — composant utilitaire de présentation (NON destiné à être porté dans le codebase ; sert uniquement à la mise en regard des variations dans la review)

Le code à porter est dans `chauffeur-shell.jsx` et `chauffeur-screens.jsx`. `design-canvas.jsx` est un outil de review, à ignorer côté implémentation.
