# Handoff · Pointage Cargo (LOI · Premium Logistics)

Module mobile de pointage **cargo** pour LOI · Premium Logistics (Madagascar). Permet à un **pointeur** (`PL-PTR-XXX`), une main, plein soleil, sur le port ou au site, sous pression, de pointer un tonnage / une livraison en **3 à 5 taps**. Action terrain — pas de KPI, pas de feed manager (la vue superviseur est un module séparé).

## About the Design Files

Les fichiers de ce bundle sont **des références de design réalisées en HTML/JSX (React via Babel inline)** — ce sont des prototypes qui montrent l'apparence et le comportement souhaités, **pas** du code production à copier-coller. La tâche est de **reproduire ces designs dans l'environnement existant du codebase cible** (Next.js + Tailwind + shadcn/ui pour le LOI cockpit web/mobile-web, ou React Native / Flutter si une app native). Si aucun environnement n'existe encore, choisir la stack la plus adaptée — recommandation : **React Native** ou **Flutter** pour cibler iOS + Android offline avec caméra native.

## Fidelity

**High-fidelity (hifi)** — mockups pixel-perfect. Couleurs, typographies, espacements, états et flux finalisés. Les valeurs exactes (hex, px, rem) doivent être respectées.

## Persona & contraintes terrain

- **Pointeur cargo** (`PL-PTR-XXX`) — login universel matricule + PIN, pas de login propre.
- Une main · gants · plein soleil · au port de Toamasina ou sur site (APC Andriamena via RN44, COLAS/Ivondro, Moramanga) · sous pression · réseau parfois absent.
- Doit pointer un **tonnage chargé** ou une **livraison terminée** en **3 à 5 taps**.
- Confirmation systématique avant envoi · « Retour » clair · file offline avec sync auto.

## Design System · D82 (strict)

### Couleurs de marque (verrouillées)

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#0B2540` | App bar dans dark + light · texte primaire (light) |
| `teal` | `#1A8E7E` | Accent UNIQUE · action primaire · validation · conforme · livré |
| `cream` | `#F5F1E8` | Background light · texte sur fond sombre |

**Interdits absolus :** cyan, bleu vif, orange-accent, violet, vert générique. Le seul accent est `teal`. Orange (`#C77E2A`) et rouge (`#B8421E`) sont des statuts d'avertissement, jamais des accents décoratifs.

- `orange #C77E2A` = **Warn UNIQUEMENT** (écart limite, hors-ligne, "À CONFIRMER")
- `red #B8421E` = critique UNIQUEMENT (anomalie déclarée, écart hors tolérance, signature client refusée)

### Palette dark (mode par défaut)

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
tealOnDark   #3EAA9B   /* teal légèrement éclairci pour lisibilité sur paper sombre */
tealShadow   0 8px 20px rgba(26,142,126,0.45)
redShadow    0 8px 20px rgba(184,66,30,0.50)
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
tealShadow   0 8px 20px rgba(26,142,126,0.30)
redShadow    0 8px 20px rgba(184,66,30,0.35)
```

### Statuts MISSIONS (couleur + FORME + libellé · jamais couleur seule)

| Statut | Couleur | Forme | Libellé |
|---|---|---|---|
| À charger | navy / cream | carré ouvert (□) | "À CHARGER" |
| En chargement | teal | sablier (⌛) | "EN CHARGEMENT" |
| En transit | teal | losange (◆) | "EN TRANSIT" |
| À livrer | teal | triangle (▶) | "À LIVRER" |
| Livré | teal | rond plein (●) | "LIVRÉ" |
| Anomalie | red | carré + croix (✕) | "ANOMALIE" |

### Statuts SÉVÉRITÉ ANOMALIE

| Sévérité | Couleur | Forme | Libellé |
|---|---|---|---|
| Mineure | teal (`#1A8E7E`) | rond (●) | "Mineure" |
| Majeure | orange (`#C77E2A`) | triangle (▲) | "Majeure" |
| Critique | red (`#B8421E`) | carré (■) | "Critique" |

### Statuts ÉCART poids prévu/réel

| Verdict | Couleur | Forme | Libellé |
|---|---|---|---|
| Dans tolérance (±2%) | teal | rond | "DANS TOLÉRANCE" |
| Alerte (±2–4%) | orange | triangle | "ALERTE · au-dessus tolérance" |
| Critique (>±4%) | red | carré | "HORS TOLÉRANCE" |

> Les seuils ±2 % / ±4 % sont **proposés**. À confirmer par matériau (granite vs. chrome APC) — voir Open Questions.

## Typographie

- **Inter** (400, 500, 600, 700, 800) — toute l'UI
- **IBM Plex Mono** (400, 500, 600, 700) — TOUT chiffre / code : tonnage, écart, plaques, codes véhicule (`CT-###`), codes mission (`MIS-2026-####`), codes anomalie (`ANO-2026-####`), matricules (`PL-PTR-###`, `DRV-###`), heures, GPS, références

### Échelle

| Rôle | Taille | Poids | Letter-spacing | Notes |
|---|---|---|---|---|
| Titre app bar | 22px | 800 | -0.3 | Inter |
| Titre hero succès | 22px | 800 | -0.3 | Inter |
| Tonnage géant (numpad) | **64px** | 700 | -1.5 | **Mono** |
| Écart géant (livraison) | **56px** | 700 | -1.5 | **Mono** |
| Chiffre vedette mission | 22–26px | 700 | 0.4–0.5 | **Mono** |
| Body | 14–16px | 500–700 | 0 | Inter |
| Code mission / plaque | 12–13px | 600–700 | 0.5 | **Mono** |
| Label de section (caps) | 10–11px | 800 | 1.3–1.6 | Inter, uppercase |

**Body minimum 14px**, lignes interactives minimum 16px.

## Targets terrain (non négociables)

- **Action primaire** : `height: 64px`
- **Action secondaire** : `height: 56px`
- **Touche pavé numérique** : `height: 64px` (≥88×64 avec gap 10)
- **Onglets bas (4 onglets)** : zone de 56px minimum, icône line 24px, label 10.5px
- **Cartes mission** : `min-height: 120–140px`, zone tap pleine carte
- **Gap entre cibles** : `8–10px` minimum (gants)
- **3 à 5 taps** maximum par pointage

## Frame

- Mobile **375 × 812** (référence iPhone 13 mini / SE).
- Status bar custom (navy `#0B2540`, indicateur HORS LIGNE quand applicable).
- App bar navy avec : retour (chevron), breadcrumb (caps 10/700 letter-spacing 2), titre, chip droite (pointeur ou mission).
- Body scrollable.
- Optionnelle action bar fixe en bas avec hint contextuel.
- **Tab bar 4 onglets** (Missions · Chargement · Livraison · Anomalies) — indicateur d'onglet actif = pill teal-tinted + barre 3px teal sous le label.

---

## Tabs (4, verrouillés)

| Onglet | Icône | Rôle |
|---|---|---|
| Missions | liste avec puce | Liste filtrable des missions du jour |
| Chargement | camion + chargement | Démarrer / poursuivre un chargement |
| Livraison | camion en route | Stepper de progression + vérification poids + signature |
| Anomalies | triangle alerte | Liste + déclaration d'anomalie |

> **Aucun onglet "Manager" / "Feed KPI".** La vue superviseur est un module web séparé.

---

## Screens

### 1 · Missions — liste filtrable

**Purpose** — Voir et choisir une mission du jour, filtrée par état.

**Layout** (de haut en bas) :

1. **Filter rail** scrollable horizontal — pills `min-height: 36–40px` avec icône-forme du statut + label + count Mono :
   - Tous (5)
   - À charger (1) — carré navy
   - En transit (2) — losange teal
   - À livrer (1) — triangle teal
   - Anomalies (1) — carré rouge croix
   La pill active : bg teal-tinted / dark navy-tinted, border teal/navy.

2. **Section label** : "Missions du jour · 25.05" + compteur "filtré / total".

3. **Liste de cartes mission** (`min-height: 140px` chacune), chaque carte :
   - Header : code `MIS-2026-####` Mono 12px + chip statut (forme+couleur+libellé) à droite
   - Route : libellé "ORIGINE" + nom site, flèche teal centrale, "DESTINATION" + nom site
   - Bande matériau/tonnage : `{Material} · {Grade}` à gauche, `{Tonnage}T` Mono 22px à droite, fond `surface2` border `lineSoft`
   - Footer Mono 12px : `CT-007 · 4271 TCB · DRV-007 — ETA 11:20`
   - Optionnelle bande rouge "flag" si mission flaggée anomalie (icône triangle + texte rouge)

**Données réelles** (zéro invention) :

| Code | Statut | Camion · Plaque · Modèle | Chauffeur | Matériau · Tonnage | Origine → Destination | ETA |
|---|---|---|---|---|---|---|
| MIS-2026-0421 | À charger | CT-007 · 4271 TCB · SCHACMAN F3000 6×4 | DRV-007 | Granite · 30T | COLAS · Ivondro → Port Toamasina · PDP | 11:20 |
| MIS-2026-0422 | En chargement | CT-011 · 5602 TCB · SCHACMAN F3000 6×4 | DRV-011 | Chrome APC · Lumpy · 22T | Moramanga · dépôt → APC Andriamena · RN44 | 14:05 |
| MIS-2026-0418 | En transit | CT-005 · 2945 TCB · SCHACMAN F3000 6×4 | DRV-005 | Granite · 30T | COLAS · Ivondro → Port Toamasina · MOCCO | 10:40 |
| MIS-2026-0417 | À livrer | CT-003 · 1827 TCB · SCHACMAN F3000 6×4 | DRV-003 | Chrome APC · Concentrate · 22T | Moramanga · dépôt → APC Andriamena · RN44 | 09:55 |
| MIS-2026-0415 | Anomalie | CT-015 · 6118 TCB · KERAX | DRV-015 | Granite · 30T | COLAS · Ivondro → Port Toamasina · C4 | — |

**Action** — tap sur une carte mission → bascule sur l'onglet contextuel (Chargement / Livraison / Anomalies) en pré-sélectionnant la mission.

**État vide** : "Aucune mission" — icône camion vide 84×84 (dashed border `line`), titre Inter 20/800, sous-titre 14px text3, bouton secondaire "Actualiser" (height 48).

---

### 2 · Chargement — démarrage

**Purpose** — Voir le récap de la mission sélectionnée et lancer la saisie tonnage.

**Layout** :

1. **Bande mission active** (`CgMissionStrip` réutilisable, voir Components) — code + chip statut, ligne matériau + tonnage prévu Mono, route avec flèche teal, footer Mono camion · plaque · chauffeur.
2. **Section "Étapes chargement"** — 4 lignes de checklist visuelle (`min-height: 56px`) :
   1. Vérifier camion + chauffeur — **fait** (rond teal plein + check)
   2. Saisir tonnage chargé — **actif** (rond border teal, halo teal-tinted, libellé "EN COURS")
   3. Photo preuve · benne pleine
   4. Envoyer · bascule signée

**Action primaire** : "Saisir le tonnage" + arrow.

---

### 3 · Chargement — pavé numérique tonnage

**Purpose** — Saisie du tonnage chargé via un **gros pavé numérique mono**, avec écart prévu/réel calculé en temps réel.

**Layout** (top → bottom) :

1. **Mini-récap mission** — `surface` `border line`, ligne 1 matériau + grade, ligne 2 Mono code + camion + plaque ; à droite "PRÉVU" caps + Mono 20px `{tonnage}T`.

2. **Display tonnage chargé** — carte tealtinted ou cream, border teal :
   - Label caps "TONNAGE CHARGÉ · RÉEL" en teal/3EAA9B
   - Chiffre **Mono 64px** centré, letter-spacing -1.5, suivi du caret animé (4×56px, anim `caret 1s steps(1) infinite`) puis `T` Mono 22px text2
   - Sous-séparateur dashed → ligne **Écart prévu/réel** : label caps + valeur Mono 18px `+0.12 T · DANS TOLÉRANCE` (couleur + forme correspondante au verdict)

3. **Pavé numérique** — 4 rangées × 3 colonnes (`flex: 1` chaque touche, height 64, gap 10) :
   - 1 2 3
   - 4 5 6
   - 7 8 9
   - `.` · `0` · backspace (icône SVG, stroke orange)
   Chaque touche : background `surface`, border 1.5px `line`, radius 12, Mono 26/700.

**Comportement** :
- Calcul temps réel : `écart = réel − prévu`. Update couleur/forme du chip d'écart à chaque tap.
- Si écart hors tolérance → hint dans l'action bar avertit : "Hors tolérance · +X T → anomalie créée à l'envoi".
- L'action primaire **reste activable** (le pointeur peut toujours envoyer ; une anomalie tonnage est créée auto à l'envoi). Pas de blocage à ce stade — le blocage est sur la livraison.

**Action primaire** : "Continuer · photo preuve" + arrow.
**Action secondaire** : "Retour".

---

### 4 · Chargement — photo preuve (viseur caméra)

**Purpose** — Capturer une photo de la benne pleine comme preuve.

**Layout** :

1. **Bande mission active** + sous-pied avec sub `30,12T saisis` en teal.
2. **Viseur caméra** (`height: 270px`, radius 14) :
   - Fond `#0E1419` + stripes diagonaux subtils 45° (`repeating-linear-gradient`)
   - 4 brackets de cadrage en angles (corners 28px, stroke 3px teal `#3EAA9B`)
   - Reticle central : icône caméra 48px teal + label caps Mono 11px "VISER LA BENNE PLEINE"
   - Bottom overlay : gradient sombre + Mono 11px `SITE · GPS · HORAIRE` (ex : `COLAS · IVONDRO   −18.1234, 49.4011   07:42`)
3. **Bouton shutter** (rond 80×80) — fond blanc, border 4px teal, cercle teal intérieur 56px, shadow 0 8px 22px.
4. **Note d'aide** 13px text3 — "Le scan plaque `{plate}` sera attaché à la photo."

**Action primaire** : "Envoyer chargement" + icône send.
**Action secondaire** : "Retour".
**Hint** : "1 photo · GPS + horaire attachés".

---

### 5 · Chargement — succès enregistré

**Purpose** — Confirmation visuelle nette, récap, signaler les écarts s'il y en a.

**Layout** :

1. **Hero succès** (margin 30/14/0, padding 28/22, border 2px teal, radius 16) — centré :
   - Cercle teal 72×72 avec check 44px, shadow teal
   - Titre 22/800 "Chargement enregistré"
   - Sous-titre Mono 13 "MIS-2026-0422 · 30,12 T · 07:42"

2. **Récap clé/valeur** — `padding 8px 4px`, séparateur dashed `lineSoft`, labels text3 14/600 à gauche, valeurs text 14/700 à droite (Mono si chiffre) :
   - Matériau · Camion · Chauffeur · Origine · Vers · Tonnage (orange si hors prévu) · Photo

3. **Bande warning si écart** — bg orangetinted, border `orange55`, fontsize 12.5, icône triangle, texte :
   `+8,12 T au-dessus du prévu — anomalie tonnage créée automatiquement (TER notifié).`

**Action primaire** : "Mission suivante" + icône plus.
**Action secondaire** : "Fermer".

---

### 6 · Livraison — stepper 4 étapes

**Purpose** — Voir la progression de la livraison et avancer l'étape courante. **C'est l'écran central du module.**

**Stepper** — 4 étapes verticales, chaque étape = rail à gauche (dot + lignes de raccord) + carte à droite. État courant (`active`) **prééminent visuellement** :

| État | Dot | Carte |
|---|---|---|
| `done` | Cercle 32×32 teal plein avec check 18px blanc | Border `teal55`, label text2, sous-libellé text2, heure Mono à droite |
| `active` | Cercle **44×44** teal plein avec n° Mono 16/800, **halo `box-shadow: 0 0 0 6px rgba(62,170,155,0.20)`** | Bg teal-tinted (`rgba(26,142,126,0.18)`), border 2px teal, label 17/800 text, badge "EN COURS" 9/800 teal, sous-card "Témoin client présent · APC NOM RESP. APC `À CONFIRMER`" |
| `upcoming` | Cercle 32×32 transparent, border 2.5px text4, n° Mono 13/800 text4 | Background `surface`, border `line`, label 15/800 text3, sous-libellé text4 |

**Lignes de raccord** entre dots : 3px de large, couleur teal si done, `line` sinon. La ligne au-dessus d'une étape `active` est teal jusqu'au centre du dot.

**Les 4 étapes** (ordre figé, libellés et descriptions à respecter) :

| # | Label | Description courte |
|---|---|---|
| 01 | Arrivé site | GPS confirmé · pesée pont 1 |
| 02 | Déchargement démarré | Benne ouverte · témoin client |
| 03 | Terminé | Benne vide · pesée pont 2 |
| 04 | Livraison confirmée | Signature TER + client |

**Action primaire** : varie selon l'étape courante (`Marquer · Arrivée` → `Marquer · Déchargement` → `Marquer · Terminé` → `Continuer · vérif poids` → `Continuer · signature` → `Confirmer livraison`).

---

### 7 · Livraison — vérification poids (ÉCART)

**Purpose** — Comparer le tonnage prévu vs. pesée pont 2 réelle, avec verdict tolérance.

**Layout** :

1. **Bande mission active**.
2. **Section "Vérification poids · pesée site"** (caps 11/800).
3. **Carte écart** (`CgEcartCard` réutilisable) :
   - **Bande verdict colorée** (couleur dynamique selon tolérance) : forme + libellé caps "ÉCART PRÉVU / RÉEL" à gauche, "Tol. ±2%" / "Alerte" / "Critique" Mono à droite.
   - **Comparaison Prévu vs. Réel** — deux colonnes, chiffres Mono 26/700, labels caps 10/800 text3.
   - **Écart géant** — bg verdict-tinted, chiffre **Mono 56/700** color verdict letter-spacing -1.5, signe explicite (`+` ou `−`), suivi de `T` Mono 20/700, puis `(±X.X%)` Mono 18/700 text3.
   - **Verdict block** — bg `surface2` border `line`, icône-forme 22px verdict + libellé :
     - Conforme : "Dans tolérance ±2%. Livraison conforme — signature autorisée."
     - Alerte : "Au-dessus tolérance — anomalie tonnage suggérée · superviseur informé."
     - Critique : "**HORS TOLÉRANCE** — anomalie tonnage obligatoire avant signature. TER alerté."

4. **Détail pesée** — 3 lignes (Pont 1 entrée, Pont 2 sortie, Tare camion) en cartes `surface`, libellé + sous-libellé Mono, valeur Mono 16px à droite.

**Comportement** :
- Si verdict = critique → **signature bloquée** (Action primaire bascule sur "Créer anomalie tonnage" rouge avec icône send).
- Si verdict = alerte → signature autorisée mais hint suggérant la création d'anomalie.
- Si verdict = conforme → "Continuer · signature".

---

### 8 · Livraison — signature double

**Purpose** — Recueillir la signature du pointeur **et** du client réceptionnaire.

**Layout** :

1. **Bande mission** avec sub `21,86 T · conforme` en teal.
2. **Carte pointeur** (`surface` border `line`) :
   - Header : "Pointeur · PL-PTR-007" + chip teal "Signé".
   - Zone signature 80px, bg cream/dashed, déjà remplie d'un path SVG simulant la signature du pointeur (stroke teal 2.4 round, qui imite le geste manuscrit).

3. **Carte client** (`surface` border dashed teal — état "à signer") :
   - Header : "Client · APC Andriamena" + chip orange `À CONFIRMER NOM RESP. APC`.
   - Zone signature **110px**, bg blanc/dashed, contenu vide : icône stylo 32px + texte "Tapez ici pour signer" + baseline horizontale en bas.
   - Footer Mono : site `RN44 · APC Andriamena` + horodatage `25.05.2026 · 10:24`.

**Action primaire** : "Confirmer livraison" + check — **désactivée tant que la signature client est vide**.
**Action secondaire** : "Retour".
**Hint** : "Signature client manquante".

---

### 9 · Livraison — succès confirmée

**Layout** — identique au pattern Chargement succès (hero teal centré, récap clé/valeur). Différences :

- Chip écart en bas du hero : "ÉCART −0,14 T · DANS TOLÉRANCE" en teal avec forme rond.
- Récap : 4/4 étapes · pesée pont 1/2 · tare · signatures · photos · sync.

---

### 10 · Anomalies — liste

**Purpose** — Voir les anomalies actives et en déclarer une nouvelle.

**Layout** :

1. **Hero rouge** (`min-height: 72px`, bg `#B8421E`, shadow 0 10px 26px `rgba(184,66,30,0.45)`) :
   - Icône `+` 26px dans cercle blanc-tinted 48×48 border 1.5px translucent
   - Titre 18/800 "Déclarer une anomalie"
   - Sous-titre 12/500 92% opacity "Sévérité · photo preuve · mission rattachée"
   - Chevron 26 droit

2. **Section "Anomalies du jour"** + compteur "N actives".

3. **Cartes anomalie** — `surface` border `line` + **border-left 4px** color sévérité, padding 12/14, radius 12 :
   - Header : badge-forme 22×22 (rond/triangle/carré color sévérité) + code Mono `ANO-2026-####` text3 + chip caps "Sévérité · État"
   - Titre 15/800 (ex : "Bâche déchirée · perte matière")
   - Ligne Mono 11.5 : `MIS-2026-XXXX · CT-XXX · {plate}`
   - Ligne 12px : lieu à gauche, horaire Mono à droite

**Données réelles** (mock) :

| Code | Sévérité | Titre | Mission · Camion | Lieu · Horaire | État |
|---|---|---|---|---|---|
| ANO-2026-0091 | Critique | Bâche déchirée · perte matière | MIS-2026-0415 · CT-015 · 6118 TCB | COLAS Ivondro · 07:18 | Ouverte |
| ANO-2026-0090 | Majeure | Tonnage hors tolérance · +8,12 T | MIS-2026-0422 · CT-011 · 5602 TCB | COLAS Ivondro · 07:42 | En revue |
| ANO-2026-0089 | Mineure | Retard chargement · 35 min | MIS-2026-0421 · CT-007 · 4271 TCB | COLAS Ivondro · 06:55 | Clos |

---

### 11 · Anomalies — nouvelle anomalie

**Layout** :

1. **Bande mission** (auto-rattachée si mission en cours).
2. **Section "Type d'anomalie"** — grille `1fr × 3` × 2 rows, 6 tuiles `min-height: 70px` :
   - Tonnage (icône balance)
   - Bâche / charge (icône bâche)
   - Pesée pont (icône camion)
   - Retard (icône horloge)
   - Route / accès (icône route)
   - Autre (icône points)
   Tuile sélectionnée : bg teal-tinted, border 2px teal.
3. **Section "Sévérité · forme + couleur + libellé"** — 3 chips côte à côte (`flex:1`, `min-height: 72px`) :
   - Mineure (rond teal) · Majeure (triangle orange) · Critique (carré rouge)
   - Chip sélectionné : bg color sévérité, texte blanc.
4. **Section "Photo preuve · obligatoire"** — 2 cartes `flex: 1` `height: 90` :
   - Bouton dashed teal "PRENDRE PHOTO" (icône caméra 28)
   - Thumbnail photo déjà attachée — placeholder hatch + footer Mono 10 `BÂCHE.JPG · 1.4 Mo`.

**Action primaire** : "Envoyer anomalie" + icône send, **tone red**.
**Action secondaire** : "Retour".
**Hint** : `{Type} · {Sévérité} · {N} photo(s)`.

---

## Interactions & Behavior

### Navigation

- Onglets en bas (4) — la cible tap entière (icône + label) doit faire ≥56px de hauteur. Indicateur d'onglet actif = pill teal + barre 3px sous le label.
- Tap sur carte mission (onglet Missions) → ouvre l'onglet contextuel approprié avec la mission pré-sélectionnée (Chargement / Livraison / Anomalies).
- "Retour" (chevron app bar) à toutes les sous-étapes ; jamais sur les écrans-onglets racines.

### Caméra (HTML5 / native)

Deux usages caméra :

1. **Photo preuve chargement** (écran 4) — viseur natif, capture, attache GPS + plaque + horaire en metadata. Persistée localement, queue offline.
2. **Photo preuve anomalie** (écran 11) — capture standard, **obligatoire** pour valider l'envoi.

Comportement si permission refusée → **À CONFIRMER** (proposer fallback upload galerie ou bloquer le pointage).

### Numpad tonnage (écran 3)

- Saisie locale en string, parse en `float` à chaque tap.
- Recalcul écart à chaque tap, update display et chip.
- Le caret animé est purement visuel (pas un vrai input texte — c'est un display custom, le numpad est la seule façon de modifier la valeur).
- Backspace orange supprime le dernier caractère.
- `.` accepte une décimale (max 2 décimales).

### Écart tonnage / poids

Logique générique (réutilisable chargement + livraison) :

```ts
function computeVerdict(prevu: number, real: number, tolPct = 2) {
  const ecart = real - prevu;
  const pct = (ecart / prevu) * 100;
  const abs = Math.abs(pct);
  if (abs <= tolPct) return { kind: 'in',       color: 'teal',   shape: 'circle' };
  if (abs <= tolPct * 2) return { kind: 'warn', color: 'orange', shape: 'triangle' };
  return { kind: 'critique', color: 'red', shape: 'square' };
}
```

- `tolPct` par défaut **2 %** (proposé — voir Open Questions, à confirmer par matériau).
- Verdict critique en livraison → **bloque la signature** ; verdict alerte → signature autorisée mais suggère anomalie.

### Stepper livraison (écran 6)

- Une seule étape `active` à la fois.
- Avancer une étape = appel `nextStep()`, persistance locale immédiate, push offline queue.
- Reculer une étape (correction) = action longue (long-press) ? **À CONFIRMER**.
- Étape `done` affiche un horodatage Mono (`· 09:12`).

### Signature (écran 8)

- Canvas signature standard (lib recommandée : `react-native-signature-canvas` en RN, `react-signature-canvas` en web).
- Output sérialisé en SVG path (string) — stocké dans le pointage.
- "Effacer" remet le canvas à zéro.
- Signature client → champ texte d'identité du receveur (nom + fonction) avant validation — **format À CONFIRMER**.

### Offline-first

- Tout pointage est **enregistré localement immédiatement**.
- Indicateur "HORS LIGNE" dans la status bar (badge orange-tinted).
- Sync auto au retour du réseau, idempotente côté serveur — la référence locale (`MIS-2026-####`, `ANO-2026-####`, etc.) sert d'idempotency key.
- File de sync visible dans l'écran succès ("File offline · envoi auto").

### Animations

- Transitions entre écrans : slide horizontal 250ms `ease-out`.
- Caret du numpad : `@keyframes caret { 50% { opacity: 0; } }` — `animation: caret 1s steps(1) infinite`.
- Check de succès : scale 0.6 → 1.0 + halo qui se déploie, 400ms.
- Pas de bounce, pas de parallax — terrain.

### États

| État | Comportement |
|---|---|
| Action désactivée | bg `surfaceMute`, texte `text4`, no shadow, `cursor: not-allowed` |
| Action activée (primaire teal) | bg `teal`, shadow `tealShadow`, icône arrow/check/plus/send |
| Action critique (primaire red) | bg `red`, shadow `redShadow`, icône send |
| Carte sélectionnée | border 2px teal, bg teal-tinted léger |
| Filter pill active (dark) | bg `rgba(255,255,255,0.10)`, border `#3EAA9B` |
| Filter pill active (light) | bg `#0B2540`, texte blanc |
| Réseau absent | badge orange-tinted "HORS LIGNE" dans status bar |
| Étape stepper active | dot 44×44, halo `0 0 0 6px rgba(62,170,155,0.20)`, badge "EN COURS" |
| Verdict écart conforme | rond teal + libellé "DANS TOLÉRANCE" |
| Verdict écart alerte | triangle orange + libellé "ALERTE" |
| Verdict écart critique | carré rouge + libellé "HORS TOLÉRANCE", signature bloquée |

## Components réutilisables

| Composant | Usage |
|---|---|
| `CgStatusShape({kind, color, size})` | Forme SVG du statut mission (carré / sablier / losange / triangle / rond / croix-carré) |
| `CgStatusChip({t, kind, size})` | Chip couleur + forme + libellé pour cartes mission et filter pills |
| `CgSeverityChip({t, kind, selected})` | Chip sévérité anomalie (rond/triangle/carré) en mode tap-to-select |
| `CgFilterPill({t, label, count, active, kind})` | Pill filtre avec count Mono et forme statut |
| `CgMissionCard({t, m})` | Carte mission complète (header, route, matériau/tonnage, footer, flag) |
| `CgMissionStrip({t, m, sub})` | Bande mission compacte pour entête d'écran (Chargement / Livraison / Anomalies) |
| `CgEcartCard({t, prevu, real, tolPct})` | Carte écart avec bande verdict, comparaison, écart géant, verdict block |
| `CgPhone({theme, tab, body, action, ...})` | Phone composer 375×812 (status bar + app bar + body + action bar + tab bar) |
| `CgActionBar({t, primary, secondary, ...})` | Action bar bas, primaire 64px, secondaire 56px, hint + dot |
| `CgTabBar({t, active, alert})` | Tab bar 4 onglets + alert badge optionnel |

## State Management

```ts
type MissionStatus =
  | 'a-charger' | 'en-chargement' | 'en-transit'
  | 'a-livrer'  | 'livre'         | 'anomalie';

type Material = 'granite' | 'chrome-apc';
type ChromeGrade = 'lumpy' | 'concentrate';

type Mission = {
  code: string;                  // 'MIS-2026-0422'
  status: MissionStatus;
  truck: string;                 // 'CT-007'
  plate: string;                 // '4271 TCB'
  model: 'SCHACMAN F3000 6X4' | 'KERAX';
  driver: string;                // 'DRV-007'
  material: Material;
  grade?: ChromeGrade;
  tonnage: number;               // T prévu
  origin: SiteRef;
  destination: SiteRef;
  eta?: string;                  // 'HH:mm'
  flag?: string;                 // si attachée à une anomalie
};

type LoadingRecord = {
  missionCode: string;
  realTonnage: number;           // T réel saisi au numpad
  ecart: number;                 // calculated
  verdict: 'in' | 'warn' | 'critique';
  proofPhotoUri: string;
  geo: { lat: number; lng: number; site: string };
  pointeurMatricule: string;     // 'PL-PTR-007'
  capturedAt: ISODate;
  autoAnomalyCode?: string;      // si verdict !== 'in', ANO-2026-####
};

type DeliveryStep = 'arrive' | 'dechargement' | 'termine' | 'confirmee';

type DeliveryRecord = {
  missionCode: string;
  currentStep: DeliveryStep;
  stepTimestamps: Record<DeliveryStep, ISODate | null>;
  weighIn?: number;              // pont 1 entrée
  weighOut?: number;             // pont 2 sortie
  truckTare?: number;            // tare camion
  ecartT: number;
  ecartPct: number;
  verdict: 'in' | 'warn' | 'critique';
  signaturePointeurSvg: string;
  signatureClientSvg?: string;
  clientName?: string;           // À CONFIRMER format
  pointeurMatricule: string;
  confirmedAt?: ISODate;
};

type AnomalySeverity = 'mineure' | 'majeure' | 'critique';
type AnomalyType =
  | 'tonnage' | 'baches' | 'pesee'
  | 'retard'  | 'route' | 'autre';
type AnomalyState = 'ouverte' | 'en-revue' | 'clos';

type Anomaly = {
  code: string;                  // 'ANO-2026-0091'
  type: AnomalyType;
  severity: AnomalySeverity;
  title: string;                 // composé ou libre
  missionCode?: string;
  truck?: string;
  plate?: string;
  where: string;
  proofPhotoUris: string[];      // ≥1 obligatoire
  state: AnomalyState;
  createdBy: string;             // 'PL-PTR-007'
  createdAt: ISODate;
};

type SyncQueueEntry =
  ({ kind: 'loading';  data: LoadingRecord  } |
   { kind: 'delivery'; data: DeliveryRecord } |
   { kind: 'anomaly';  data: Anomaly        }) & {
    syncStatus: 'pending' | 'sending' | 'failed';
  };
```

## Design Tokens (résumé)

### Spacing

```
4, 6, 8, 10, 12, 14, 16, 18, 22, 24, 28, 30
```

### Border-radius

```
3   /* badge / pill micro */
6   /* small chips */
8   /* small buttons / icon containers */
10  /* secondary button */
12  /* card */
14  /* hero card / viewfinder */
16  /* success hero */
18  /* phone frame */
```

### Shadows

```
card                0 1px 0 rgba(0,0,0,0.04)
primary teal dark   0 8px 20px rgba(26,142,126,0.45)
primary teal light  0 8px 20px rgba(26,142,126,0.30)
primary red dark    0 8px 20px rgba(184,66,30,0.50)
primary red light   0 8px 20px rgba(184,66,30,0.35)
hero red anomaly    0 10px 26px rgba(184,66,30,0.45)
action-bar dark     0 -12px 30px rgba(0,0,0,0.40)
action-bar light    0 -10px 24px -16px rgba(11,37,64,0.20)
phone frame         0 30px 80px rgba(11,37,64,0.32)
stepper halo        0 0 0 6px rgba(62,170,155,0.20)  /* dark */
                    0 0 0 6px rgba(26,142,126,0.18)  /* light */
```

### Animations

```
caret: @keyframes caret { 50% { opacity: 0; } }
       animation: caret 1s steps(1) infinite
slide-in:  250ms ease-out
toggle:    180ms ease-out
success-check: 400ms (scale 0.6 → 1.0 + halo expand)
```

## Assets

- **Polices** : Google Fonts — `Inter` (400/500/600/700/800), `IBM Plex Mono` (400/500/600/700).
- **Icônes** : toutes en SVG inline, dessinées dans la grammaire D82 (stroke 1.9–2.4, linecap/linejoin round). À remplacer par un set cohérent côté codebase (recommandation : Lucide ou Phosphor en variante "regular" stroke 2). Aucune dépendance icône externe dans le mock.
- **Images** : aucune photo réelle ; les viewfinders et thumbnails preuve utilisent des placeholders `repeating-linear-gradient` à 45° sur fond `#0E1419`. À remplacer par les vraies captures caméra au runtime.

## Open Questions · `À CONFIRMER`

Zones en attente de validation produit avant développement final :

1. **Tolérance tonnage** — `±2 %` proposé par défaut, alerte entre 2–4 %, critique au-delà. **À figer par matériau** (granite 30T vs. chrome APC 22T peuvent demander des seuils différents). Comportement si saisie > capacité benne SCHACMAN F3000 ?
2. **Format matricule pointeur** — `PL-PTR-XXX` proposé. Longueur PIN, durée session, déverrouillage biométrique optionnel.
3. **Format plaques** — suffixe `TCB` confirmé, masque complet à figer.
4. **Mapping CT-### → modèle** — CT-007/011/005/003 = SCHACMAN, CT-015 = KERAX dans le mock. Liste exhaustive de la flotte à fournir.
5. **Liste figée des sites & matières** — 5 sites principaux + granite/chrome APC dans le mock. Sites complémentaires ? Tonnages standards par matière vs saisie libre ?
6. **Catalogue d'anomalies** — 6 types proposés (Tonnage · Bâche/charge · Pesée pont · Retard · Route/accès · Autre). À valider par QSHE et opérations.
7. **Workflow anomalies** — `Ouverte → En revue → Clos` proposé. Responsable, SLA, escalade par sévérité.
8. **Signature client** — format d'identité du receveur (nom + fonction + matricule client APC, Port Toamasina ?). Cas dégradés : refus signature, client absent, PDA hors-ligne au moment de signer.
9. **Caméra** — comportement si permission refusée ? Fallback upload galerie ou bloquer ?
10. **Offline** — plafond file de sync (nombre + taille médias) avant alerte stockage local plein.
11. **OCR pesée pont** — afficher le ticket pesée pour OCR optionnel en v1.1 ?
12. **Reculer une étape stepper** (correction pointeur) — long-press ? code superviseur ? interdit ?
13. **Cascade anomalies** — Critique → TER notifié : canal exact (push, SMS, radio) ?
14. **Format références** — `MIS-2026-####` · `ANO-2026-####` : numéroteur local + reconciliation serveur.

## Hors-périmètre

- Vue **superviseur** (KPI tonnage jour, écart cumulé, anomalies, performance flotte) = **module séparé**, web cockpit LOI, hors pointeur.
- Login / PIN / sélection profil = patron mobile partagé LOI (réutiliser `MobileLogin` du Mobile Kit).
- Édition de mission (création / modification) = côté superviseur web, le pointeur lit seulement.

## Files

Dans ce bundle :

- `Pointage Cargo.html` — point d'entrée
- `cargo-shell.jsx` — tokens D82, palettes dark/light, status bar, app bar, action bar, tab bar 4 onglets, phone composer
- `cargo-screens.jsx` — atomes (formes statut/sévérité, chips, filter pill), composants réutilisables (mission card / strip, écart card), tous les écrans (missions, chargement × 4, livraison × 4, anomalies × 2)
- `cargo-app.jsx` — orchestration design canvas (toutes les variations côte-à-côte) + notes de conception
- `design-canvas.jsx` — composant utilitaire de présentation (NON destiné à être porté dans le codebase ; sert uniquement à la mise en regard des variations dans la review)

Le code à porter est dans `cargo-shell.jsx` et `cargo-screens.jsx`. `cargo-app.jsx` et `design-canvas.jsx` sont des outils de review, à ignorer côté implémentation.

Pour le LOI cockpit (Next.js + Tailwind + shadcn) :
- Cible d'intégration : `loi-cockpit/app/mobile/pointage-cargo/`
- Composants atomiques → `loi-cockpit/components/mobile/cargo/`
- Tokens D82 → mapper sur les variables CSS du repo (`--cockpit-*`) et classes `pl-*`
- Données → `lib/loi-master-dataset` (jamais de mock inventé en runtime)
