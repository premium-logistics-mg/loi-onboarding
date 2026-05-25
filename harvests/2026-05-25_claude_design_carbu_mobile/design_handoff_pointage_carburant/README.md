# Handoff · Pointage Carburant (LOI · Premium Logistics)

Module mobile de pointage **carburant** pour LOI · Premium Logistics (Madagascar). Permet à un **opérateur carburant dédié** (`PL-GAS-XXX`), une main, plein soleil, à la station-service ou au dépôt, sous pression, de pointer un plein en **3 à 5 taps**. Action terrain — pas de KPI, pas de feed manager (la vue superviseur est un module séparé).

## About the Design Files

Les fichiers de ce bundle sont **des références de design réalisées en HTML/JSX (React via Babel inline)** — ce sont des prototypes qui montrent l'apparence et le comportement souhaités, **pas** du code production à copier-coller. La tâche est de **reproduire ces designs dans l'environnement existant du codebase cible** (Next.js + Tailwind + shadcn/ui pour le LOI cockpit web/mobile-web, ou React Native / Flutter si une app native). Si aucun environnement n'existe encore, choisir la stack la plus adaptée — recommandation : **React Native** ou **Flutter** pour cibler iOS + Android offline avec caméra native (scan plaque + scan code-barres + OCR compteur).

## Fidelity

**High-fidelity (hifi)** — mockups pixel-perfect. Couleurs, typographies, espacements, états et flux finalisés. Les valeurs exactes (hex, px, rem) doivent être respectées.

## Persona & contraintes terrain

- **Opérateur carburant DÉDIÉ** (`PL-GAS-XXX`) — login universel matricule + PIN, pas de login propre au module. Une seule personne par poste, dédiée à la pompe / au dépôt.
- Une main · gants · plein soleil · à la station (GALANA TMM Toamasina, GALANA MMG Antananarivo) ou au dépôt · sous pression · réseau parfois absent.
- Doit pointer **un plein** en **3 à 5 taps**.
- Confirmation systématique avant envoi · « Retour » clair · points de progression visibles · file offline avec sync auto.

## Design System · D82 (strict)

### Couleurs de marque (verrouillées)

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#0B2540` | App bar dans dark + light · texte primaire (light) |
| `teal` | `#1A8E7E` | Accent UNIQUE · action primaire · validation · plaque reconnue · station sélectionnée · plein enregistré |
| `cream` | `#F5F1E8` | Background light · texte sur fond sombre |

**Interdits absolus :** cyan, bleu vif, orange-accent, violet, vert générique. Le seul accent est `teal`. Orange (`#C77E2A`) et rouge (`#B8421E`) sont des statuts d'avertissement, jamais des accents décoratifs.

- `orange #C77E2A` = **Warn UNIQUEMENT** (hors-ligne, saisie en repli manuel, "À CONFIRMER", file offline)
- `red #B8421E` = critique UNIQUEMENT (échec d'envoi, anomalie consommation, refus pompe)

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
redShadow   0 8px 20px rgba(184,66,30,0.35)
```

### Statuts ENVOI plein (couleur + FORME + libellé · jamais couleur seule)

| Statut | Couleur | Forme | Libellé |
|---|---|---|---|
| Envoyé | teal | rond plein (●) | "ENVOYÉ" |
| File offline | orange | triangle (▲) | "FILE OFFLINE · ENVOI AUTO" |
| Échec | red | carré (■) | "ÉCHEC ENVOI" |

### Étape du flux (barre de progression linéaire)

| État | Forme | Couleur | Détail |
|---|---|---|---|
| À venir | pastille 14×14 | `rgba(255,255,255,0.16)` | inerte |
| Active | pastille **élargie 28×14** | teal `#3EAA9B` + halo `0 0 0 4px rgba(62,170,155,0.20)` | n° Mono `0X` en navy |
| Passée | pastille 14×14 ronde | teal `#3EAA9B` | check 10×10 navy à l'intérieur |

> Le système est **ordonné, non décoratif** : la position dans la barre indique l'avancement, jamais une simple couleur.

## Typographie

- **Inter** (400, 500, 600, 700, 800) — toute l'UI
- **IBM Plex Mono** (400, 500, 600, 700) — TOUT chiffre / code : litres, km, codes véhicule (`CT-###`), codes plein (`FUEL-2026-####`), codes BC (`BC-2026-#####`), matricules (`PL-GAS-###`), plaques (`#### TCB`), heures, GPS, références

### Échelle

| Rôle | Taille | Poids | Letter-spacing | Notes |
|---|---|---|---|---|
| Titre app bar | 22px | 800 | -0.3 | Inter |
| Titre hero succès | 26px | 800 | -0.4 | Inter |
| Titre tuile station | 22px | 800 | -0.4 | Inter |
| **GO livrée géant** | **64px** | 700 | -1.5 | **Mono** |
| **Km actuel géant** | **52px** | 700 | -1.0 | **Mono** |
| Chiffre vedette card | 22–26px | 700 | 0.4–0.5 | **Mono** |
| Body | 13–16px | 500–700 | 0 | Inter |
| Code plein / BC / plaque | 12–14px | 600–700 | 0.5–1.0 | **Mono** |
| Label de section (caps) | 10–11px | 800 | 1.3–1.6 | Inter, uppercase |

**Body minimum 13px**, lignes interactives minimum 14px.

## Targets terrain (non négociables)

- **Action primaire** : `height: 64px`
- **Action secondaire** : `height: 56px`
- **Touche pavé numérique** : `height: 68px` (≥110×68 avec gap 8)
- **Tuile station** : `min-height: 96px` (3 tuiles tap-larges, surface ≥ 96×~340)
- **CTA hero "Nouveau pointage"** : `min-height: 108px`
- **Carte véhicule (liste flotte)** : `height: ~52px`, plaque Mono 16px lisible à un mètre
- **Cadre scan plaque** : 230×64px dans viseur 220px de haut
- **Cadre scan code-barres** : 260×110px dans viseur 240px de haut
- **Gap entre cibles** : `8–10px` minimum (gants)
- **3 à 5 taps** maximum par plein (le brief impose le bas de la fourchette)

## Frame

- Mobile **375 × 812** (référence iPhone 13 mini / SE).
- Status bar custom (navy `#0B2540`, indicateur `HORS LIGNE` quand applicable).
- App bar navy avec : retour (chevron) ou close (×) selon contexte, breadcrumb (caps 10/700 letter-spacing 2), titre, chip droite (opérateur ou véhicule).
- **Barre de progression linéaire** sous l'app bar (intégrée au header navy) — 6 pastilles + numéro d'étape Mono `0X/06` + nom étape courante + "Suivant · …" à droite.
- Body scrollable.
- Action bar fixe en bas avec **hint contextuel** (dot teal + phrase courte).
- **Pas de tab bar.** Le flux est linéaire et unique.

---

## Flux verrouillé · 6 étapes + succès

```
Accueil
  ↓ tap "Nouveau pointage"
01 · Véhicule        (scan plaque OU liste flotte)
  ↓
02 · Station         (3 tuiles : GALANA TMM · GALANA MMG · TOTAL ENERGIES)
  ↓
03 · Litres          (pavé numérique géant) → photo bon pompe
  ↓
04 · Trajet/Km       (km actuel + trajet auto + photo OCR compteur)
  ↓
05 · N° BC           (scan code-barres OU saisie manuelle)
  ↓
06 · Confirmation    (récap 6 lignes + "Modifier" inline)
  ↓ tap "Envoyer le plein"
Succès               "Plein enregistré" + "Nouveau pointage" / "Fermer"
```

**Aucune dérivation.** Pas de raccourci, pas d'étape sautable. L'opérateur dédié fait une chose : pointer un plein.

---

## Screens

### 0 · Login — matricule + PIN

**Purpose** — Authentifier l'opérateur en début de poste. Pas de login propre au module ; matricule universel LOI + PIN 4 chiffres.

**Layout** (de haut en bas) :

1. **Brand band** — caps 10/800 teal "PREMIUM LOGISTICS · D82", titre 26/800 "Pointage carburant", sous-titre 14px text3 "Opérateur dédié station · accès matricule + PIN".
2. **Matricule field** — bg `surface`, border 2px teal, padding 14/16, radius 12 :
   - Avatar 36×36 radius 8 (bg teal-tinted, icône silhouette stroke 2px teal)
   - Valeur Mono 22/700 `PL-GAS-003` letter-spacing 1
   - Chip caps 10/800 teal "RECONNU" à droite (bg teal-tinted, padding 3/7)
3. **PIN dots** — 4 cases 56×60 radius 12, border 2px (teal si rempli, `line` sinon), pastille interne 14×14 teal quand rempli.
4. **PIN pad** — 4 rangées × 3 colonnes, touches 60px hauteur radius 12 :
   - 1 2 3 / 4 5 6 / 7 8 9
   - Aide (texte caps) · 0 · backspace orange
5. **Action bar** — primaire "Déverrouiller" (icône lock), désactivée tant que PIN incomplet, hint "Saisir les 4 chiffres du PIN".

---

### 1 · Accueil — hero CTA + derniers pleins

**Purpose** — Point d'entrée du module ; lancer un nouveau pointage en 1 tap, voir les pleins du jour, voir la file offline.

**Layout** :

1. **Hero CTA "Nouveau pointage"** — `min-height: 108px`, bg teal, border 0, radius 16, shadow tealShadow.
   - Icône bidon-pompe 34×34 dans cercle blanc-tinted 64×64 border 1.5 translucent
   - Titre 22/800 "Nouveau pointage"
   - Sous-titre 13/500 "6 étapes · 3–5 taps · véhicule → BC"
   - Chevron 28 droit
2. **Bande file offline** (si applicable) — `surface` border `line`, radius 12, padding 12/14 :
   - Icône horloge 20px dans carré orange-tinted 40×40
   - Titre 14/800 "2 pleins en file offline"
   - Sous-titre 12/500 text3 "Envoi automatique au retour réseau · FUEL-0418 · FUEL-0417"
3. **Section "Derniers pleins · 24.05"** + compteur "N aujourd'hui".
4. **Liste cartes plein** (3 max sur l'accueil) — `surface` border `line` radius 12 padding 12/14, gap 8 :
   - Header : code Mono `FUEL-2026-####` text3 + chip caps "ENVOYÉ" rond teal à droite
   - Ligne chiffres : litres Mono 22 + km Mono 14 à droite
   - Footer Mono 11.5 : `CT-007 · 4271 TCB · GALANA TMM    24.05 · 17:42` (séparateur dashed)

**Action primaire** : "Nouveau pointage" + icône plus.

**Données réelles** (mock derniers pleins — uniquement pour démo UI, à remplacer par master dataset) :

| Code | Camion · Plaque | Station | Litres | Km | Quand |
|---|---|---|---|---|---|
| FUEL-2026-0418 | CT-007 · 4271 TCB | GALANA TMM | 285,40 L | 142 380 km | 24.05 · 17:42 |
| FUEL-2026-0417 | CT-011 · 5602 TCB | TOTAL ENERGIES | 310,80 L | 208 145 km | 24.05 · 16:20 |
| FUEL-2026-0416 | CT-003 · 1827 TCB | GALANA MMG | 264,00 L | 188 720 km | 24.05 · 14:55 |

---

### 2 · Véhicule — scan plaque + liste flotte

**Purpose** — Identifier le camion qui se présente à la pompe. Scan plaque par défaut, liste flotte en repli.

**Layout (mode scan)** :

1. **Viseur caméra** (height 220px, radius 14, bg `#0E1419`, stripes diagonaux subtils 45°) :
   - Cadre 230×64 radius 6 border 3px teal, centré, avec `box-shadow: 0 0 0 9999px rgba(0,0,0,0.35)` (masque sombre autour)
   - Plate mock au centre : Mono 22/800 teal letter-spacing 4 `4271 TCB`
   - Footer overlay gradient + Mono 11/700 teal caps "VISER LA PLAQUE · CADRE TURQUOISE"
2. **Bande "plaque reconnue"** — bg teal-tinted, border `teal55`, radius 10 padding 10/12 :
   - Cercle teal 22×22 + check blanc 14
   - "CT-007 · `4271 TCB`" 14/800 text + "SCHACMAN F3000 6×4 · reconnu" 12/500 text3
3. **Section "Ou sélectionner manuellement"** + compteur "15 véhicules".
4. **Liste flotte compacte** (4 premiers visibles) — chaque ligne 52px :
   - Code Mono 13/800 (60px largeur) · plaque Mono 16/700 letter-spacing 0.8 · spacer · "SCHACMAN" / "KERAX" 11/600 text3
   - Tap = sélection ; check rond teal 22 à droite si sélectionné

**Layout (mode list — caméra refusée)** : pas de viseur, liste complète (8+ véhicules visibles), une ligne sélectionnée par défaut.

**Données réelles · master dataset flotte** (ne JAMAIS inventer) :

| Code | Plaque | Modèle |
|---|---|---|
| CT-001 | 1042 TCB | SCHACMAN F3000 6×4 |
| CT-002 | 1187 TCB | SCHACMAN F3000 6×4 |
| CT-003 | 1827 TCB | SCHACMAN F3000 6×4 |
| CT-004 | 2418 TCB | KERAX |
| CT-005 | 2945 TCB | SCHACMAN F3000 6×4 |
| CT-006 | 3261 TCB | SCHACMAN F3000 6×4 |
| CT-007 | 4271 TCB | SCHACMAN F3000 6×4 |
| CT-008 | 4502 TCB | KERAX |
| CT-009 | 4988 TCB | SCHACMAN F3000 6×4 |
| CT-010 | 5340 TCB | SCHACMAN F3000 6×4 |
| CT-011 | 5602 TCB | SCHACMAN F3000 6×4 |
| CT-012 | 5817 TCB | KERAX |
| CT-013 | 5994 TCB | SCHACMAN F3000 6×4 |
| CT-014 | 6045 TCB | SCHACMAN F3000 6×4 |
| CT-015 | 6118 TCB | KERAX |

> Plaques au format `#### TCB`. Modèles SCHACMAN F3000 6×4 (10) + KERAX (5). Master dataset à confirmer côté LOI — voir Open Questions.

**Action primaire** : "Continuer · station" + arrow.

---

### 3 · Station — 3 tuiles canoniques

**Purpose** — Sélectionner LA station de service. **3 stations canoniques uniquement** (réseau LOI). Liste figée, pas de saisie libre.

**Layout** :

1. **Strip véhicule** (`GsVehicleStrip` réutilisable, voir Components) — repère permanent du véhicule actif : icône camion 34 + Mono `CT-007 · 4271 TCB` + sous-libellé modèle, border-left 4px teal.
2. **Section "Choisir la station — 3 stations canoniques"**.
3. **3 tuiles tap-larges** — chacune `min-height: 96px`, padding 14/16, border 2px (teal si sélectionnée, `line` sinon), radius 14, gap 10 :
   - Pictogramme pompe 34×34 dans carré 64×64 radius 14 (bg teal plein si sélectionnée, bg surface2 + border `line` sinon)
   - Libellé caps 11/800 text3 "STATION CARBURANT"
   - Titre **22/800** brand + suffixe site Mono teal 18px (`GALANA` + Mono `TMM`)
   - Sous-titre 12/500 text3 (localisation)
   - Check rond teal 28 à droite si sélectionnée, chevron sinon
4. **Bande "À CONFIRMER"** orange-tinted — "Stations réseau LOI uniquement. Tout autre fournisseur passe par anomalie « Station hors-réseau » `WORKFLOW`."

**Données réelles · 3 stations canoniques uniquement** :

| ID | Brand | Site | Sous-titre |
|---|---|---|---|
| galana-tmm | GALANA | TMM | Toamasina · Marché Mahabibo |
| galana-mmg | GALANA | MMG | Antananarivo · MMG |
| total | TOTAL ENERGIES | — | Réseau national |

**Action primaire** : "Continuer · litres" + arrow.

---

### 4 · Litres — pavé numérique géant "GO livrée (L)"

**Purpose** — Saisir le volume de gasoil livré à la pompe. **Pavé numérique géant**, chiffre **Mono 64px**, unité L claire et inséparable.

**Layout** (top → bottom) :

1. **Strip véhicule** avec sub "GALANA TMM" en text3.
2. **Display litres** — carte tealtinted (dark) ou `#FFFFFF` (light), border 2px teal, radius 14 padding 18/18 :
   - Header inline : caps 10/800 teal "GO LIVRÉE · RÉEL POMPE" à gauche, "L" Mono 10 à droite
   - Chiffre **Mono 64/700** centré, letter-spacing -1.5, suivi du caret animé (4×56px, anim `caret 1s steps(1) infinite`) puis `L` Mono 28/700 teal
   - Sous-séparateur dashed → ligne "Dernier plein" caps text3 + Mono 14 `248,60 L · 22.05`
3. **Boutons rapides** (`flex: 1` chaque, height 40, border `line`, gap 8) : `+50` · `+100` · `Plein`. Permettent d'ajouter rapidement un volume typique sans tap-tap-tap au pavé.
4. **Pavé numérique** (`GsBigNumpad`) — 4 rangées × 3 colonnes, touches 68px hauteur :
   - 1 2 3 / 4 5 6 / 7 8 9
   - `,` · `0` · backspace orange-tinted (bg `rgba(199,126,42,0.14)`, border `rgba(199,126,42,0.40)`)
   - Chaque touche : bg `surface`, border 1.5px `line`, radius 12, **Mono 28/700**

**Comportement** :
- Saisie locale en string, parse en `float` à chaque tap (séparateur `,` français, conversion `.` côté backend).
- Caret animé purement visuel (pas un vrai input texte — display custom, le numpad est la seule façon de modifier).
- Backspace orange supprime le dernier caractère.
- Boutons rapides ajoutent au volume courant (`+50 L`) ou remplacent (`Plein` = capacité réservoir, À CONFIRMER).
- Délta vs dernier plein affiché silencieusement dans le hint de l'action bar ; aucune alerte rouge tant que dans seuils.

**Action primaire** : "Continuer · photo bon" + arrow.
**Hint** : "285,40 L · +36,80 L vs dernier plein" (ou variante selon écart).

---

### 5 · Litres — photo bon de pompe (obligatoire)

**Purpose** — Capturer le ticket de pompe comme preuve papier.

**Layout** (réutilise le pattern viseur Cargo) :

1. **Strip véhicule** avec sub "GALANA TMM · 285,40 L saisis" en text2.
2. **Viseur caméra** (height 290px, radius 14) :
   - Fond `#0E1419` + stripes diagonaux subtils
   - 4 brackets de cadrage (corners 32×32, stroke 3px teal)
   - Reticle central : icône document 52×52 + caps Mono "CADRER LE TICKET POMPE" + sous-libellé "OCR LITRES + N° BC ATTENDUS"
   - Bottom overlay gradient + Mono 11 `GALANA TMM   −18.1525, 49.4011   06:32`
3. **Bouton shutter** rond 80×80 — fond blanc, border 4px teal, cercle teal intérieur 56×56, shadow.
4. **Note d'aide** 13/500 text3 — "Plaque `4271 TCB` · GPS · horaire attachés."

**Action primaire** : "Continuer · trajet" + arrow.
**Hint** : "1 photo · GPS + horaire attachés".

> Note : l'OCR peut, en best-case, lire le N° BC sur le ticket et le pré-remplir à l'étape 5. À spécifier côté backend OCR.

---

### 6 · Trajet / Km — km actuel géant + trajet calculé + photo OCR

**Purpose** — Capturer le kilométrage au compteur et calculer le trajet effectué depuis le dernier plein.

**Layout** :

1. **Strip véhicule** avec sub "285,40 L · GALANA TMM".
2. **Display km actuel** — carte tealtinted, border 2px teal radius 14 padding 16/18 :
   - Caps 10/800 teal "KM ACTUEL · COMPTEUR"
   - Chiffre **Mono 52/700** centré letter-spacing -1.0 (5–6 chiffres, espace séparateur Mono : `142 628`)
   - Caret animé 4×44px teal
   - Unité `km` Mono 20/700 text2
   - Sous-séparateur dashed → "Trajet effectué · auto" caps text3 + chiffre Mono 22/700 teal `+248 km`
   - Ligne sous-info Mono 11 text3 : "Dernier plein · 142 380 km    22.05 · 17:42"
3. **Bouton "Photo OCR du compteur"** — `min-height: 78px`, bg `surface`, border 2px dashed teal radius 12 padding 10/14 :
   - Icône caméra 24 dans carré teal-tinted 44×44
   - Titre 15/800 "Photo OCR du compteur" + sous-titre 12/500 "Lecture automatique · saisie en repli"
   - Chip caps "RECOMMANDÉ" à droite (teal-tinted)
4. **Pavé numérique** sans décimale (numpad sans `,`) — touches 68px.

**Comportement** :
- `trajet = kmActuel - kmDernierPlein` calculé à chaque tap.
- Si trajet **négatif** → anomalie compteur (À CONFIRMER : bloquer ou warning).
- Photo OCR recommandée mais pas obligatoire ; saisie manuelle au pavé toujours possible (repli).

**Action primaire** : "Continuer · N° BC" + arrow.
**Hint** : "+248 km · 115,1 L/100 km · cohérent flotte".

---

### 7 · N° BC — scan code-barres + saisie manuelle

**Purpose** — Identifier le numéro de bon de commande/livraison de la station. Scan par défaut, manuel en repli.

**Layout (mode scan)** :

1. **Strip véhicule** avec sub "285,40 L · 142 628 km".
2. **Viseur caméra** (height 240px) — même grammaire que scan plaque :
   - Cadre 260×110 radius 8 border 3px teal, masque sombre `0 0 0 9999px`
   - Code-barres mock au centre : 28 barres verticales largeur 1–5px, height 50px, alternance teal/transparent
   - Ligne de scan animée : `linear-gradient` horizontal teal + box-shadow glow teal
   - Footer Mono 11/700 teal "VISER LE CODE-BARRES DU BON"
3. **Bande "N° BC détecté"** — bg `surface`, border 2px teal radius 12 padding 12/14 :
   - Cercle teal 26×26 + check 16
   - Caps 10/800 text3 "N° BC DÉTECTÉ" + Mono 20/700 letter-spacing 1 `BC-2026-08412`
4. **Bande "À CONFIRMER"** orange-tinted — "Si le code-barres est illisible, passer à la saisie manuelle."

**Layout (mode manual)** :

1. Strip véhicule + sub.
2. Caps 11/800 text3 "SAISIE MANUELLE · N° BC".
3. **Field préfixé** — bg `surface`, border 2px teal radius 12 padding 14/16 :
   - Préfixe Mono 22/700 text3 letter-spacing 1 `BC-2026-` (figé, non éditable)
   - 5 chiffres saisis Mono 26/800 text letter-spacing 2 `08412` + caret 3×26 teal
4. **Pavé numérique** sans décimale.
5. Bande "À CONFIRMER" orange — "Saisie en repli. Rebasculer scan dès que possible (caméra arrière)."

**Comportement** :
- Préfixe `BC-2026-` figé en mode manuel — l'opérateur saisit uniquement les 5 derniers chiffres.
- Longueur exacte du N° BC à figer (5 ou 6 chiffres) — voir Open Questions.

**Action primaire** : "Continuer · valider" + arrow.

---

### 8 · Confirmation — récap

**Purpose** — Permettre à l'opérateur de vérifier toutes les saisies en un seul écran avant l'envoi définitif. Chaque ligne est modifiable inline.

**Layout** :

1. **Section "Récapitulatif · vérifier avant envoi"** + compteur "6 / 6 étapes" Mono à droite.
2. **Carte récap** (`surface`, border `line`, radius 12, overflow hidden) — 6 lignes, séparées par border `lineSoft` :

| Ligne | Valeur | Sous-libellé |
|---|---|---|
| Véhicule | `CT-007 · 4271 TCB` | SCHACMAN F3000 6×4 |
| Station | GALANA TMM | Toamasina · Marché Mahabibo |
| **GO livrée** | **`285,40 L`** | Bon pompe attaché · 1.6 Mo |
| Km actuel | `142 628 km` | Photo compteur OCR · 0.9 Mo |
| **Trajet** | **`+248 km`** | Depuis dernier plein · 22.05 17:42 |
| N° BC | `BC-2026-08412` | Scan code-barres |

Chaque ligne :
- Padding 12/14, flex space-between, gap 12
- Caps 10/800 text3 ("VÉHICULE", "STATION", …)
- Valeur Mono (si chiffre) 15–17/700–800 text (les lignes **importantes** comme "GO livrée" et "Trajet" sont **strong** = 17/800)
- Sous-libellé 11.5/500 text3
- Bouton "Modifier" caps 10/800 teal, padding 5/8, border `teal55`, radius 4, à droite — replonge à l'étape correspondante.

3. **Bande cohérence consommation** — bg teal-tinted, border `teal55`, radius 8 padding 10/12 fontsize 12.5 :
   - Cercle teal 16×16 + check
   - "Consommation calculée : **`115,1 L/100 km`** — cohérent avec moyenne flotte SCHACMAN `À CONFIRMER SEUIL`."

4. **Bande trace** — `surface` border dashed `line` radius 8 padding 10/12, Mono 11 text3 :
   - `OP. PL-GAS-003   −18.1525, 49.4011   25.05 · 06:35`

**Action primaire** : "Envoyer le plein" + icône send.
**Action secondaire** : "Retour".
**Hint** : "Vérification possible jusqu'à l'envoi".

---

### 9 · Succès — « Plein enregistré »

**Purpose** — Confirmation visuelle nette. Permet de relancer un nouveau pointage ou fermer.

**Layout** :

1. **Hero succès** (margin 32/14/0, padding 28/22, border 2px teal, radius 16) — centré :
   - Cercle teal **84×84** avec check 50 blanc, shadow teal
   - Titre **26/800** "Plein enregistré"
   - Sous-titre Mono 14 `FUEL-2026-0419 · 285,40 L · 06:35`
   - Si hors ligne : badge `HORS LIGNE · ENVOI AUTO` (forme triangle orange + caps 10/800)

2. **Récap clé/valeur** — `padding 6/4`, séparateur dashed `lineSoft`, 7 lignes :

| Clé | Valeur |
|---|---|
| Véhicule | `CT-007 · 4271 TCB` |
| Station | GALANA TMM |
| GO livrée | `285,40 L` |
| Km actuel | `142 628 km` |
| Trajet | `+248 km · 115,1 L/100` |
| N° BC | `BC-2026-08412` |
| Preuves | 2 photos · 2.5 Mo |

**Action primaire** : "Nouveau pointage" + icône plus.
**Action secondaire** : "Fermer".

---

### États clairs

| État | Quand | UI |
|---|---|---|
| **Accueil vide** | Prise de poste, aucun plein du jour | Hero "Premier pointage" teal full-height + zone vide avec icône pompe dashed 84×84 et "Aucun plein aujourd'hui" |
| **Véhicule · caméra refusée** | Permission caméra refusée à l'étape 1 | Pas de viseur · liste flotte complète 8+ entrées · une sélectionnée par défaut |
| **N° BC · saisie manuelle** | Code-barres illisible | Field préfixé `BC-2026-` figé + numpad sans décimale + bande "À CONFIRMER" orange |
| **Hors ligne** | Réseau absent à la station | Badge `HORS LIGNE` orange dans status bar (toutes pages) + écran succès montre "HORS LIGNE · ENVOI AUTO" + accueil bande "N pleins en file offline" |

---

## Interactions & Behavior

### Navigation linéaire

- **Pas d'onglets en bas.** Le module est un flux unique.
- Étape courante toujours indiquée en haut (barre de progression intégrée à l'app bar navy).
- Chevron retour (`< `) dans l'app bar pour revenir à l'étape précédente — **non destructif** (les saisies passées sont conservées).
- Close (`×`) seulement sur l'écran de succès (sortir du flux).
- "Modifier" inline depuis la confirmation = jump à l'étape correspondante, le reste du récap est conservé.

### Caméra (HTML5 / native)

Trois usages caméra :

1. **Scan plaque** (étape 1) — viseur natif, OCR plaque format `#### TCB`, lookup dans master flotte. Si non-reconnu : carte rouge "Plaque non reconnue", proposer sélection manuelle.
2. **Photo bon de pompe** (étape 3b) — capture standard + GPS + plaque + horaire attachés. **Obligatoire** pour valider l'envoi.
3. **Scan code-barres** (étape 5) — scan natif (ZXing-style), formats Code128 / Code39 attendus.
4. **Photo OCR compteur** (étape 4) — capture + OCR du kilométrage. Pre-remplit le numpad ; opérateur valide ou corrige.

Comportement si permission refusée → **À CONFIRMER** (proposer fallback upload galerie ou bloquer le pointage). Mock actuel passe directement en mode list/manual.

### Numpad (étapes 3, 4, 5)

- Saisie locale en string, parse en `float` (litres) ou `int` (km, BC) à chaque tap.
- Caret animé visuel pur (display custom).
- Backspace orange supprime le dernier caractère.
- Séparateur décimal `,` (français) à l'étape litres uniquement ; max 2 décimales.
- Pas de séparateur pour les km ni le N° BC.
- Touches 68px (litres et km), 60px (PIN) — la PIN n'est pas un numpad de saisie continue mais un sélecteur 4 chiffres.

### Calculs temps réel

| Calcul | Source | Affichage |
|---|---|---|
| Trajet | `kmActuel - kmDernierPlein` | Étape 4, sous le km actuel |
| Délta litres vs dernier plein | `litres - dernierPlein` | Étape 3, dans le hint action bar |
| Consommation L/100 km | `(litres / trajet) * 100` | Étape 6 (confirmation) |

Les calculs sont silencieux — pas d'alerte rouge tant que dans les seuils. Si hors seuils (À CONFIRMER) → bande warning orange ou rouge dans la confirmation.

### Offline-first

- Tout pointage est **enregistré localement immédiatement** dès l'écran de succès.
- Indicateur "HORS LIGNE" dans la status bar (badge orange-tinted, persistant tant que réseau absent).
- Sync auto au retour du réseau, idempotente côté serveur — la référence locale (`FUEL-2026-####`) sert d'idempotency key.
- File de sync visible dans l'accueil ("N pleins en file offline · envoi auto") et dans l'écran succès ("HORS LIGNE · ENVOI AUTO").

### Animations

- Transitions entre étapes : slide horizontal 250ms `ease-out`.
- Caret du numpad : `@keyframes caret { 50% { opacity: 0; } }` — `animation: caret 1s steps(1) infinite`.
- Barre de progression : pastille active s'élargit de 14×14 → 28×14, halo apparaît (150ms ease-out).
- Check de succès : scale 0.6 → 1.0 + halo qui se déploie, 400ms.
- Pas de bounce, pas de parallax — terrain.

### États interactifs

| État | Comportement |
|---|---|
| Action désactivée | bg `surfaceMute`, texte `text4`, no shadow, `cursor: not-allowed` |
| Action activée (primaire teal) | bg `teal`, shadow `tealShadow`, icône arrow/check/plus/send/lock |
| Action critique (primaire red) | bg `red`, shadow `redShadow`, icône send |
| Tuile station sélectionnée | border 2px teal, halo `0 0 0 4px rgba(...)`, pictogramme bg teal plein |
| Carte véhicule sélectionnée | border 2px teal, bg teal-tinted, check rond 22 à droite |
| Étape de progression active | pastille élargie 28×14 + halo + n° Mono interne |
| Étape de progression passée | pastille ronde 14×14 + check 10 interne |
| Étape de progression à venir | pastille 14×14 inerte `rgba(255,255,255,0.16)` |
| Caméra reconnue | bande teal-tinted + cercle check + libellé Mono |
| Caméra non reconnue | (À CONFIRMER) bande rouge + suggestion repli manuel |
| Réseau absent | badge orange-tinted "HORS LIGNE" dans status bar |
| Plein en file offline | chip orange triangle + libellé "FILE OFFLINE" |

---

## Components réutilisables

| Composant | Fichier | Usage |
|---|---|---|
| `GsStatusBar({offline, time})` | `gas-shell.jsx` | Status bar navy + badge "HORS LIGNE" |
| `GsAppBar({crumb, title, right, showBack, showClose})` | `gas-shell.jsx` | App bar navy avec retour/close + breadcrumb + chip droite |
| `GsStepDots({t, current, omit})` | `gas-shell.jsx` | Barre de progression linéaire 6 pastilles + n° + nom étape |
| `GsOperatorChip({matricule})` | `gas-shell.jsx` | Chip "Opérateur · PL-GAS-003" pour app bar |
| `GsVehicleChip({truck, plate})` | `gas-shell.jsx` | Chip vert "CT-007 · 4271 TCB" pour app bar (étapes 2+) |
| `GsActionBar({t, primary, secondary, primaryEnabled, hint, primaryIcon, primaryTone})` | `gas-shell.jsx` | Action bar bas, primaire 64px, secondaire 56px, hint + dot |
| `GsPhone({theme, crumb, title, right, showBack, showClose, body, action, stepDots})` | `gas-shell.jsx` | Phone composer 375×812 (status + appbar + progression + body + action) |
| `GsVehicleStrip({t, truck, plate, model, sub})` | `gas-screens.jsx` | Repère permanent du véhicule actif en tête d'écran (étapes 2+) |
| `GsStationTile({t, station, selected})` | `gas-screens.jsx` | Tuile station 96px (3 instances : GALANA TMM/MMG, TOTAL) |
| `GsBigNumpad({t, showDot})` | `gas-screens.jsx` | Pavé numérique 68px avec/sans décimale + backspace orange |
| `GsToConfirm({children})` | `gas-screens.jsx` | Chip orange caps "À CONFIRMER" pour zones non figées |
| `GsSectionLabel({t, children, right})` | `gas-screens.jsx` | Label de section caps 11/800 + sous-libellé Mono à droite |

## State Management

```ts
type FuelOperator = {
  matricule: string;      // 'PL-GAS-003'
  pin: string;            // 4 digits hashed
  postedAt: ISODate;      // session start
  stationContext?: 'galana-tmm' | 'galana-mmg' | 'total';
};

type FleetVehicle = {
  truck: string;          // 'CT-007'
  plate: string;          // '4271 TCB'
  model: 'SCHACMAN F3000 6X4' | 'KERAX';
};

type FuelStation = {
  id: 'galana-tmm' | 'galana-mmg' | 'total';
  brand: 'GALANA' | 'TOTAL ENERGIES';
  site?: string;          // 'TMM' | 'MMG' | undefined
  sub: string;            // 'Toamasina · Marché Mahabibo'
};

type FuelEntry = {
  code: string;                  // 'FUEL-2026-0419' (numéroteur local)
  operatorMatricule: string;     // 'PL-GAS-003'

  // Step 1
  vehicleTruck: string;          // 'CT-007'
  vehiclePlate: string;          // '4271 TCB'
  vehicleModel: FleetVehicle['model'];
  vehicleSource: 'scan' | 'manual';

  // Step 2
  stationId: FuelStation['id'];

  // Step 3
  litres: number;                // float L (séparateur , côté UI, . côté backend)
  litresDeltaVsLast?: number;    // litres - lastFill.litres
  pumpReceiptPhotoUri: string;   // obligatoire

  // Step 4
  kmActuel: number;              // int km
  trajet: number;                // kmActuel - lastFill.kmActuel
  consommation: number;          // (litres / trajet) * 100 — L/100 km
  counterPhotoUri?: string;      // OCR optional
  kmSource: 'ocr' | 'manual';

  // Step 5
  bcNumber: string;              // 'BC-2026-08412'
  bcSource: 'scan' | 'manual';

  // Metadata
  geo: { lat: number; lng: number };
  capturedAt: ISODate;
  syncStatus: 'pending' | 'sending' | 'sent' | 'failed';
};

type FuelSyncQueueEntry = {
  entry: FuelEntry;
  retries: number;
  lastAttempt?: ISODate;
  failureReason?: string;
};
```

## Design Tokens (résumé)

### Spacing

```
4, 6, 8, 10, 12, 14, 16, 18, 22, 24, 28, 30, 32
```

### Border-radius

```
3   /* badge / pill micro */
6   /* small chips, plate frame */
8   /* small buttons / icon containers / chips */
10  /* secondary button, list rows */
12  /* card, PIN box, numpad key */
14  /* hero card / viewfinder / station tile / display géant */
16  /* hero success / CTA accueil */
18  /* phone frame */
```

### Shadows

```
card                0 1px 0 rgba(0,0,0,0.04)
primary teal dark   0 8px 20px rgba(26,142,126,0.45)
primary teal light  0 8px 20px rgba(26,142,126,0.30)
primary red dark    0 8px 20px rgba(184,66,30,0.50)
primary red light   0 8px 20px rgba(184,66,30,0.35)
hero CTA accueil    0 8px 20px rgba(26,142,126,0.45)
shutter caméra      0 8px 22px rgba(0,0,0,0.35)
action-bar dark     0 -12px 30px rgba(0,0,0,0.40)
action-bar light    0 -10px 24px -16px rgba(11,37,64,0.20)
phone frame         0 30px 80px rgba(11,37,64,0.32)
step active halo    0 0 0 4px rgba(62,170,155,0.20)
tile selected halo  0 0 0 4px rgba(62,170,155,0.18)  /* dark */
                    0 0 0 4px rgba(26,142,126,0.10)  /* light */
```

### Animations

```
caret:        @keyframes caret { 50% { opacity: 0; } }
              animation: caret 1s steps(1) infinite
slide-in:     250ms ease-out
step active:  150ms ease-out  /* pastille width transition */
toggle:       180ms ease-out
success-check: 400ms (scale 0.6 → 1.0 + halo expand)
```

## Assets

- **Polices** : Google Fonts — `Inter` (400/500/600/700/800), `IBM Plex Mono` (400/500/600/700).
- **Icônes** : toutes en SVG inline, dessinées dans la grammaire D82 (stroke 1.8–2.4, linecap/linejoin round). À remplacer par un set cohérent côté codebase (recommandation : Lucide ou Phosphor en variante "regular" stroke 2). Aucune dépendance icône externe dans le mock.
- **Images** : aucune photo réelle ; les viewfinders (plaque, ticket pompe, code-barres) utilisent des placeholders `repeating-linear-gradient` à 45° sur fond `#0E1419`. À remplacer par les vraies captures caméra / scans au runtime.
- **Pictogramme pompe** dans les tuiles station : SVG inline générique (jamais le logo client / GALANA / TOTAL — on évite les logos de marque externe pour des raisons IP).

## Open Questions · `À CONFIRMER`

Zones en attente de validation produit avant développement final :

1. **Format matricule opérateur** — `PL-GAS-XXX` proposé. Longueur PIN (4 chiffres par défaut), durée session, déverrouillage biométrique optionnel, gestion oubli PIN.
2. **Format références** — `FUEL-2026-####` proposé pour le plein, `BC-2026-#####` pour le N° BC pompe. Longueur exacte du N° BC (5 ou 6 chiffres ?), masque complet.
3. **Master dataset flotte** — mapping CT-### → modèle + plaque dans le mock. Liste exhaustive (15 véhicules visibles) à valider, ajout/retrait par superviseur ?
4. **Stations canoniques** — GALANA TMM / GALANA MMG / TOTAL ENERGIES uniquement confirmé ? Workflow pour ajouter / retirer une station du réseau.
5. **Capacité réservoir SCHACMAN F3000 / KERAX** — pour le bouton "Plein" rapide et pour bloquer les saisies aberrantes (ex : 500 L sur un réservoir 400 L).
6. **Seuils consommation** — moyenne L/100 km par modèle (SCHACMAN F3000 6×4 vs KERAX), seuil d'alerte « anormale » avant blocage envoi. Ex : > 150 L/100 km → bande rouge confirmation, force vérification ?
7. **Trajet négatif** — km actuel < km dernier plein : anomalie compteur, autorisation superviseur, ou bloquer ?
8. **Stations hors-réseau** — workflow anomalie « Station hors-réseau » (v1.1) avec photo justificative + commentaire libre obligatoire ?
9. **Caméra** — comportement si permission refusée ? Fallback upload galerie ou bloquer ?
10. **OCR ticket pompe** — extraire litres + N° BC du ticket pour pré-remplir étapes 3 et 5 ? Seuil de confiance avant validation auto vs revue manuelle.
11. **OCR compteur** — seuil de confiance avant validation auto, fallback saisie manuelle.
12. **Offline** — plafond file de sync (nombre + taille médias) avant alerte stockage local plein.
13. **Lien plein ↔ mission** — réconciliation `FUEL-2026-####` ↔ `MIS-2026-####` côté backend après v1 (un plein peut couvrir 1..N missions).
14. **Anomalie consommation** — workflow si consommation hors seuil après envoi (anomalie auto ou revue superviseur) ?

## Hors-périmètre

- Vue **superviseur** (KPI litres jour, consommation cumulée par véhicule, alerte fraude, performance flotte) = **module séparé**, web cockpit LOI, hors opérateur carburant.
- Création / édition de bons (BC) = côté superviseur web, l'opérateur lit/scanne seulement.
- Gestion stocks station (volume restant à la cuve) = hors scope opérateur — module gestion station séparé.

## Files

Dans ce bundle :

- `Pointage Carburant.html` — point d'entrée
- `gas-shell.jsx` — tokens D82, palettes dark/light, status bar, app bar, barre de progression linéaire, action bar, phone composer
- `gas-screens.jsx` — atomes (chev, arrow, to-confirm, section label), composants réutilisables (vehicle strip, station tile, big numpad), tous les écrans (login, accueil, véhicule × 2, station, litres × 2, km, BC × 2, confirmation, succès, états vides)
- `gas-app.jsx` — orchestration design canvas (toutes les variations côte-à-côte) + notes de conception (système D82, logique métier verrouillée, À CONFIRMER)
- `design-canvas.jsx` — composant utilitaire de présentation (NON destiné à être porté dans le codebase ; sert uniquement à la mise en regard des variations dans la review)

Le code à porter est dans `gas-shell.jsx` et `gas-screens.jsx`. `gas-app.jsx` et `design-canvas.jsx` sont des outils de review, à ignorer côté implémentation.

Pour le LOI cockpit (Next.js + Tailwind + shadcn) :
- Cible d'intégration : `loi-cockpit/app/mobile/pointage-carburant/`
- Composants atomiques → `loi-cockpit/components/mobile/carburant/`
- Tokens D82 → mapper sur les variables CSS du repo (`--cockpit-*`) et classes `pl-*` — partager la même base D82 que le module Cargo (la palette est strictement identique).
- Données → `lib/loi-master-dataset` (jamais de mock inventé en runtime — flotte CT-001..015, 3 stations canoniques).

Pour une app native (React Native recommandé) :
- Naviguer le flux linéaire via React Navigation stack — chaque étape = un écran, **pas de tabs**.
- Caméra : `react-native-vision-camera` + OCR (`vision-camera-text-recognition`) + Barcode (`vision-camera-code-scanner`).
- Stockage offline : `WatermelonDB` ou `MMKV` + queue de sync custom idempotente.
- Persister `FuelEntry` complet à chaque étape (résilience aux interruptions de session — l'opérateur peut être interrompu et reprendre).

## Partage avec le module Cargo

Ce module partage avec `Pointage Cargo` :
- **La palette D82 exacte** (`navy`, `teal`, `cream`, palettes dark/light identiques).
- **Le phone composer** (375×812, status bar, app bar navy).
- **Le pattern viseur caméra** (brackets corners 32×32, ligne de scan teal, footer Mono GPS/horaire).
- **Le pattern action bar** (primaire 64, secondaire 56, hint avec dot).
- **Le pattern hero succès** (cercle teal 72–84, check 44–50, titre 22–26).
- **La grammaire mono** (tous les chiffres en IBM Plex Mono, codes en `XXX-2026-####`).
- **L'écosystème `À CONFIRMER`** (chip orange caps pour zones non figées).

Ce module DIFFÈRE de `Pointage Cargo` sur :
- **Pas de tab bar 4 onglets** — flux linéaire unique remplacé par barre de progression 6 pastilles en haut.
- **Pas de stepper vertical complexe** — la progression est horizontale et compacte (le flux est plus court et plus régulier).
- **Tuiles station 3-tap** — pattern UI nouveau, à factoriser si d'autres modules ont des choix limités similaires.
- **Pavé numérique avec décimale** (litres `,`) vs sans décimale (km, BC).
- **Pas de signature client** — l'opérateur dédié est la source de vérité, pas de double signature.

Mutualiser autant que possible : tokens D82, phone composer, viseurs caméra, action bar, hero succès, numpad.
