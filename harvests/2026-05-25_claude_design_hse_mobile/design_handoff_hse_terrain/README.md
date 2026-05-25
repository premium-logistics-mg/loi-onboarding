# Handoff · LOI HSE Terrain — Mobile (D82)

## Overview

Module mobile « HSE Terrain » pour **LOI · Premium Logistics (Madagascar)**.

Utilisateur cible : **agent HSE** sur le terrain (matricule `PL-HSE-XXX`), souvent avec une seule main libre, gants, plein soleil, sous pression et parfois sans réseau. Le module est **orienté action**, pas tableau analytique : sécurité = rapidité d'action.

L'application contient 6 onglets bas (barre pouce) :

1. **Accueil** — 2 actions héros + worklist + inspections du jour
2. **Capture** — viewfinder caméra HTML5 + label preuve
3. **Inspection** — checklist site / véhicule à 4 états avec cascade HSE
4. **Actions** — liste des actions correctives `ACT-2026` + bouton « Clôturer »
5. **Feed** — fil compact des événements récents
6. **EPI** — check-list de conformité à bascule + compteur conformes X/total

Plus un **flux déclaration** lancé depuis le héros rouge de l'Accueil (incident) ou teal (observation/toolbox).

## About the Design Files

Les fichiers de ce bundle sont des **références de design produites en HTML** : des prototypes haute-fidélité montrant l'apparence visée, la copie FR métier et le comportement attendu. **Ce ne sont pas des fichiers de production à copier-coller**.

La mission consiste à **reconstruire ces écrans dans l'environnement cible** (React Native, Flutter, Ionic/Capacitor, ou WebView selon la stack LOI déjà en place) en utilisant les patterns, composants et bibliothèques existants. Si aucun environnement n'est encore fixé, choisir le framework le plus adapté à la cible (le module est mobile-first, 375×812, offline-friendly — React Native ou Flutter sont les meilleurs choix).

Le système D82 doit être appliqué **strictement** :
- Couleurs : navy `#0B2540`, teal `#1A8E7E`, cream `#F5F1E8`, rouge `#B8421E` (incident/critique uniquement), orange `#C77E2A` (alerte)
- Interdit : cyan, bleu accent, violet, vert générique
- Typo : **Inter** UI + **IBM Plex Mono** sur tout chiffre / code
- Status = **couleur + forme + libellé**, jamais couleur seule

## Fidelity

**Haute-fidélité (hifi).** Les écrans incluent les couleurs, tailles, espacements et copy définitifs. À reproduire au pixel près en utilisant la bibliothèque UI du codebase cible.

## Files

- `HSE Terrain.html` — page d'entrée (charge React 18 + Babel standalone + 4 JSX)
- `design-canvas.jsx` — chrome du canvas Figma-like (à **ignorer** côté implémentation produit, c'est uniquement pour la présentation des écrans)
- `hse-shell.jsx` — tokens D82 (`D82`, `HSE_DARK`, `HSE_LIGHT`, `HSE_TABS`) + status bar + app bar + barre d'onglets bas + action bar + composer phone
- `hse-screens.jsx` — 9 écrans : Accueil, Capture, Inspection, Actions, Feed, EPI + Déclaration incident + Enregistré + Empty state
- `hse-app.jsx` — composition des artboards par section (Dark, Déclaration, Light, États, Notes)

## Design Tokens

Tokens définis dans `hse-shell.jsx` au début du fichier (objets `D82`, `HSE_DARK`, `HSE_LIGHT`).

### Brand (D82 verrouillé)

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#0B2540` | Header dans **les deux modes** · texte principal en light · ancrage repère |
| `teal` | `#1A8E7E` | Action primaire · OK · validation · accent positif |
| `cream` | `#F5F1E8` | Fond paper en mode light · texte principal en mode dark |

### Status (couleur + forme + libellé)

| État | Hex | Forme | Soft (overlay) | Usage |
|---|---|---|---|---|
| OK | `#1A8E7E` (`teal`) | Rond | `rgba(26,142,126,0.18)` | Inspection OK · EPI conforme · validations |
| Alerte | `#C77E2A` (`orange`) | Triangle | `rgba(199,126,42,0.18)` | Sévérité majeure · « à surveiller » · « HORS LIGNE » |
| Critique / Incident | `#B8421E` (`red`) | Carré | `rgba(184,66,30,0.20)` | Incident · sévérité critique · cascade HSE **uniquement** |
| Non vérifié | `#5B7398` | Losange (outline) | — | Inspection : item pas encore évalué |

### Palettes thème

**Dark (`HSE_DARK`)** — défaut, cabine / véhicule, glare réduit
- `paper #061629`, `surface #0F2A47`, `surface2 #173659`, `surfaceMute #0B2540`
- `line #1E3E66`, `lineSoft #15304F`, `divider #1A3556`
- `text #F5F1E8`, `text2 #B7C9E0`, `text3 #7E94B5`, `text4 #56708F`
- Header reste navy `#0B2540`

**Light (`HSE_LIGHT`)** — plein soleil, anti-miroir
- `paper #F5F1E8`, `surface #FFFFFF`, `surface2 #FBF7EC`, `surfaceMute #EDE8D8`
- `line #D7D2C2`, `lineSoft #E6E1D2`, `divider #CFC9B6`
- `text #0B2540`, `text2 #384A63`, `text3 #5E6B7C`, `text4 #8A95A3`
- **Header navy `#0B2540` conservé** (repérage instantané du module)

### Typography

- **Inter** (400, 500, 600, 700, 800) — UI / body / titres
- **IBM Plex Mono** (400, 500, 600, 700) — **TOUT** chiffre, code, plaque, horaire, GPS, coord, référence

Échelle utilisée :
- Compteur géant (EPI hero) : **38px / 700 mono** + sub 22px
- Compteur worklist : **28px / 700 mono**
- Titre app bar : **22px / 800 Inter**, letter-spacing −0.3
- Hero action : **22px / 800 Inter**, sub 13px / 500
- Body : **15-16px / 600-700 Inter**
- Caption / meta : **12-13px / 500-600 Inter**, mono pour codes
- Libellé caps : **10-11px / 800 Inter**, letter-spacing 1.3-1.5, uppercase
- Status libellé caps : **11-12px / 700-800**, letter-spacing 1.0-1.2, uppercase

### Spacing / Sizing

- Hero Accueil : **min-height 96px**, padding 16/18, border-radius 14
- Action primaire (envoi) : **height 64px**, border-radius 10
- Action secondaire (retour, +Item, Réinit.) : **height 56px**, border-radius 10
- Bouton « Clôturer » dans carte : **height 44px**
- Onglet bas : **48-56px** zone tappable
- Carte standard : padding 12-14, border-radius 10-12, border 1.5px solid
- Gap entre cartes : **8-10px**
- Padding écran : **14px horizontal** sur le contenu, 12px pour grilles serrées

### Border radius

- Pastilles status : `50%` pour rond, `5px` pour triangle/carré
- Boutons d'action : `10-12px`
- Cartes : `10-12px`
- Hero : `14px`
- Tag/chip arrondi (pills) : `999px`
- Petits chips (PRÉ-REMPLI, HORS LIGNE) : `3-4px`

### Shadows

- Hero rouge : `0 12px 32px rgba(184,66,30,0.50)`
- Hero teal : `0 12px 32px rgba(26,142,126,0.40)`
- Action primaire (teal) : `0 8px 20px rgba(26,142,126,0.45)` dark · `0.30` light
- Action primaire (red) : `0 8px 20px rgba(184,66,30,0.50)` dark · `0.35` light
- Action bar : `0 -12px 30px rgba(0,0,0,0.40)` dark · `0 -10px 24px -16px rgba(11,37,64,0.20)` light
- Phone bezel : `0 30px 80px rgba(11,37,64,0.32)`

## Screens / Views

Tous les écrans sont **375 × 812** (iPhone X-class), avec une status bar 32px + app bar (≈70-86px selon contenu) + zone content + éventuelle action bar + barre d'onglets bas 56px + home indicator 16px.

### Status bar (`HStatusBar`, `hse-shell.jsx`)

Hauteur 32px, fond navy `#0B2540`, texte blanc.
- Gauche : heure en mono (ex. `07:42`)
- Droite : badge « HORS LIGNE » orange si offline (`bg rgba(199,126,42,0.25)`, ink `#E8B97A`, border `rgba(232,185,122,0.5)`), icône wifi, icône batterie

### App bar (`HAppBar`, `hse-shell.jsx`)

Fond navy `#0B2540`. Padding 6/6/14.
- Bouton retour (chevron gauche) 56×56, opacity 0.15 si non affiché
- Crumb (caps 10px, ls 2, `#8FA5C3`) + titre (22px/800, ls −0.3, blanc)
- Slot droite : `HAgentChip` (encadré 6×10, mode column, label « AGENT HSE » caps + matricule mono `PL-HSE-007` 13px)

### Barre d'onglets bas (`HTabBar`, `hse-shell.jsx`)

6 onglets : Accueil, Capture, Inspection, Actions, Feed, EPI.
- Fond navy en dark / blanc en light
- Border-top `#15304F` en dark, `lineSoft` en light
- Chaque onglet : icône **line style** 22px + label 10px (700 inactif, 800 actif)
- Onglet actif : pastille fond teal soft (`rgba(26,142,126,0.22)`) sous l'icône + barre indicatrice 3px teal sous le label (centrée 32px de large)
- Couleur active : blanc en dark / teal en light · inactive : `#7E94B5` / `text3`
- Badge alerte : pastille rouge en haut-droite de l'icône, chiffre mono 9px/800, border 1.5px de la couleur du fond pour découpe propre

Les icônes sont définies dans `HTabIcon` (`home`, `camera`, `clipboard`, `wrench`, `feed`, `helmet`) — line style, stroke 1.9, line-cap/join round.

---

### 1. Accueil (`HScreenAccueil`)

**Purpose** : point d'entrée du module. L'agent voit immédiatement les **2 actions héros**, ses compteurs et la file d'inspections du jour.

**Layout** (vertical scroll) :
1. Padding 16/14/0 — **2 héros** empilés gap 12
2. Section label « Worklist » + date (caps 11px/800, ls 1.5)
3. 4 compteurs en row, gap 8, padding horizontal 14
4. Section label « Inspections du jour » · « 4 sites »
5. Liste de cartes inspection, gap 8, padding 0/12/16

**Hero (`HHero`)** :
- min-height 96px, border-radius 14, padding 16/18
- Fond plein (`red` ou `teal`), texte blanc
- Tile icône 64×64 (radius 14, fond `rgba(255,255,255,0.18)`, border `rgba(255,255,255,0.35)`)
- Title 22px/800 ls −0.3, sub 13px/500 opacity 0.92
- Chevron droite 26px à droite
- Shadow forte (cf. tokens)

Hero 1 — `Signaler incident` (rouge), icône triangle d'alerte
- Sub : « Sévérité · photo preuve · vocal · cascade HSE »

Hero 2 — `Observation / Toolbox QSHE` (teal), icône clipboard
- Sub : « Geste sûr · presque-accident · briefing »

**Compteurs (`HCounter`)** : flex 1 chacun, fond surface, border 1.5px line, radius 10, padding 10/12.
- Label caps 10px/800, ls 1.3, `text3`
- Valeur **28px/700 mono**, ls 0.5
- 4 tones : neutral (text), red (critique), orange (warn), teal (good)

Données présentes : À faire `12` neutral · En cours `03` orange · Critiques `02` red · Du jour `08` teal

**Carte inspection** : 72px min-height, fond surface, border 1.5px (rouge si urgent), radius 10, padding 12/14, row gap 12.
- Tile gauche 40×40 (radius 8). Si urgent : fond `redSoft` + border red + carré rouge 14×14. Sinon : fond `surfaceMute` + clipboard outline `text2`.
- Stack code mono 13px/700 + badge « RETARD » si urgent (caps 9px/800, ls 1.2, bg `redSoft`, ink red, border red)
- Site 14px/700, véhicule 12px/500 mono `text3`
- Chevron droite `text3`

---

### 2. Capture (`HScreenCapture`)

**Purpose** : prendre une photo preuve avec un label court. Caméra HTML5 native.

**Layout** : viewfinder plein écran (flex 1) + bandeau commandes bas.

**Viewfinder** :
- Fond `#0A0F18` + overlay subtil (radial gradient + diagonal stripes 14px)
- 4 guides d'angle en L (32×32, trait 3px teal) dans les coins, padding 18
- Crosshair central : cercle 56×56 border 1.5px `rgba(255,255,255,0.35)` + point central 6×6
- **Top overlay** (12/12 from top/sides) : carte glassmorphic `rgba(11,37,64,0.85)` + blur 8 + border `rgba(255,255,255,0.12)`, radius 10, padding 10/12
  - Label caps 9px/800 ls 1.4 « LABEL DE LA PREUVE »
  - Texte saisi 16px/700 blanc + caret animé 1.5×16 teal (animation `caret 1s steps(2) infinite` — keyframes dans `<style>` du HTML)
  - Tags suggérés en pills 11px/600 ls 0 — actif teal, inactif `rgba(255,255,255,0.10)` border `rgba(255,255,255,0.18)`
- **Bottom overlay** (12/12 from bottom/sides) : meta chips inline avec label caps 9px/800 + valeur 11px/600 (mono pour GPS/horaire)
  - Site / GPS `−17.5841, 47.0319` / Horaire `07:42:14`

**Commandes (bandeau bas)** :
- Padding 14/14/8, fond `#0A1A2E` dark / `surface` light, border-top line
- Row space-between :
  - Gauche : 56×56 radius 12 — icône **galerie** (4 carrés)
  - Centre : **bouton shutter 76×76 radius 50%** — blanc, border 4px teal, dot 56×56 teal au centre, shadow teal forte
  - Droite : 56×56 radius 12 — icône **basculer caméra** (deux chevrons)

**Action bar** (en bas avant onglets) : `Enregistrer la preuve` (teal, 64px, icon check) · hint « Label : « Fuite hydraulique » »

---

### 3. Inspection (`HScreenInspection`)

**Purpose** : passer une checklist site/véhicule. Chaque item a 4 états → si ≥1 critique, cascade HSE déclenchée.

**Layout** :
1. **Header inspection** (10/14, fond `rgba(26,142,126,0.14)` dark / 0.10 light, border-bottom line)
   - Stack gauche : label caps « Inspection en cours », code mono 14px/700 `INSP-2026-0518 · CT-011`, site 12px `text3`
   - Droite : ratio **22px/700 mono** : 7 + « / 9 » 13px text3
2. **Legend / 4 compteurs** (10/14/0, row gap 6) — un par état, mêmes formes que pastilles inline
3. **Bandeau cascade** (10/14/4 margin, padding 12/14, fond `redSoft`, border red 1.5) — affiché si ≥1 critique
   - Icône carré rouge 22 + croix blanche
   - Stack : « N item critique · cascade HSE » 13/800 red + « Une action ACT-2026 sera créée à l'envoi » 12/500
4. **Items groupés** par section (Véhicule, Charge, Site, Documents) — chaque groupe avec section label caps 11/800 ls 1.5 et liste gap 8

**Item (`HInspRow`)** : 64px min-height, fond surface, border 1.5 (rouge si critique, orange si alerte, sinon line), radius 10, padding 12/14, row gap 12.
- Index mono 11px/700 `text3` width 22 (ex. `04`)
- Stack flex 1 : label 15/700 + status row caps 11/700 ls 1, lettre couleur de l'état
- Pastille **forme + couleur** précédant le libellé status :
  - OK = cercle 10×10 teal
  - Alerte = triangle 12×11 SVG orange
  - Critique = carré 10×10 rouge
  - Non vérifié = losange 12×12 outline `#5B7398`
- Chevron droite 18px `text3`

**Items présents** :
1. Pneus · pression · état — OK
2. Feux · phares + clignotants — OK
3. Niveaux · huile + eau — ALERTE
4. Freins · niveau pédale — CRITIQUE
5. Arrimage · sangles — OK
6. Bâche · état couverture — ALERTE
7. Zone manœuvre dégagée — NON VÉRIFIÉ
8. Signalisation chantier — OK
9. Carte grise + permis — NON VÉRIFIÉ

**Action bar** : `Envoyer inspection` rouge (tone='red'), 64px, icon send · secondary « + Item » 56px · hint « 1 critique · 2 alerte · 2 non vérifié »

---

### 4. Actions (`HScreenActions`)

**Purpose** : liste des actions correctives ouvertes (codes `ACT-2026`), avec bouton **Clôturer** par carte.

**Layout** :
1. **Segments** (14/14/0, row gap 8) — 3 boutons flex 1, 44px min-height, radius 8
   - Actif : fond teal, ink blanc · Inactif : fond surface, border line, ink text
   - Stack : label caps 10/800 + valeur mono 16/700
   - Segments : `Ouvertes 03` (actif) · `Clos 01` · `Toutes 04`
2. Section label « Actions correctives » · « ACT-2026 »
3. **Liste de cartes** (0/12/16, gap 10)

**Carte action (`HActionRow`)** : fond surface, border 1.5 (rouge si ouverte ET critique, sinon line), radius 12, padding 12/14, opacity 0.7 si close.
- **Row 1** (header) :
  - Code mono 12/700 `text2`
  - Badge sévérité (forme + libellé) — 9/800 ls 1.2 caps, padding 2/6 radius 3, fond `cfg.color}22`, ink couleur, border couleur, pastille forme prefix
  - Si close : badge « CLOS » teal aligné droite
- **Row 2** : label de l'action 16/700, line-height 1.25
- **Row 3** (meta) : 12/500 `text3` — icône **pin** + site · icône **calendar** + due · `Source EVT-2026-xxxx` mono · séparé par `·` `text4`
- **Row 4** (si ouverte) : 2 boutons row gap 8
  - `Clôturer` (flex 1, 44px, fond teal, blanc, 13/800 caps ls 0.5, icon check 16)
  - `Détails` (flex 0 0 44%, 44px, transparent, border 1.5 line, ink text)

**Données présentes** :
1. `ACT-2026-0142` — Critique — Remplacer disque frein arrière — `INSP-2026-0518` — APC Andriamena — 26 mai
2. `ACT-2026-0141` — Majeure — Recharger extincteur cabine — `EPI · CT-007` — Port Toamasina — 27 mai
3. `ACT-2026-0140` — Mineure — Rafraîchir signalétique zone PDP — `EVT-2026-0204` — Port Toamasina — 30 mai
4. `ACT-2026-0138` — Majeure — Nettoyer fuite hydraulique — `EVT-2026-0201` — Garage Betainomby — clos

---

### 5. Feed (`HScreenFeed`)

**Purpose** : fil compact des 5 derniers événements (incidents, observations, EPI).

**Layout** : section label « Fil des événements » · « 5 derniers », puis liste avec rail timeline gauche.

**Item (`HFeedItem`)** : row gap 12.
- **Rail gauche** : col width 28, align center
  - Pastille forme + couleur 18×18 (rond/triangle/carré selon sévérité)
  - Trait 2px line qui descend jusqu'au prochain item (sauf dernier)
- **Carte droite** : flex 1, fond surface, border line, radius 10, padding 10/12, mb 10
  - **Row meta** : caps 10/800 ls 1.2 — kind (couleur de sévérité) `Incident|Observation|EPI` · `·` `text4` · `Critique|Majeure|Mineure` `text3` · push droite : horaire mono `text3`
  - **Label** 15/700, line-height 1.25, mt 4
  - **Row meta bas** : 11/500 `text3` — code mono `EVT-2026-####` · site · matricule mono · code source (INSP/EPI) si présent

**Événements présents** :
1. `EVT-2026-0207` — Incident · Critique · 07:38 — « Freins défaillants » — APC Andriamena — `PL-HSE-007` — `INSP-2026-0518`
2. `EVT-2026-0206` — Observation · Mineure · 07:24 — « Geste sûr · arrimage » — Port Toamasina · PDP — `PL-HSE-007`
3. `EVT-2026-0205` — EPI · Majeure · 06:55 — « Casque manquant CT-005 » — Garage Betainomby — `PL-HSE-007` — `EPI · CT-005`
4. `EVT-2026-0204` — Incident · Majeure · Hier 17:12 — « Bâche déchirée » — Moramanga · relais — `PL-HSE-003` — `INSP-2026-0517`
5. `EVT-2026-0203` — Observation · Mineure · Hier 14:08 — « Toolbox briefing matinal » — Garage Betainomby — `PL-HSE-007`

---

### 6. EPI (`HScreenEpi`)

**Purpose** : check-list de conformité EPI à bascule. Compteur conformes X/total en gros, bouton « Valider conformité EPI » désactivé tant que ≠ total.

**Layout** :
1. **Hero conformité** (14/14/0)
   - Si tout conforme : fond teal `bg`, ink blanc, border teal 2
   - Sinon : fond surface (dark : `surface2`), border rouge 2
   - Padding 16, row gap 14
   - Tile icône **casque** 72×72 radius 14 (fond `rgba(255,255,255,0.18)` si conforme / `redSoft` sinon)
   - Stack : caps « Conformité EPI · agent » + ratio mono `06 / 07` 38/700 (sub 22 opacity 0.65) + line de statut 13/600 (« Conforme · prêt à valider » ou « 1 EPI non conforme »)
2. Section label « Check-list » · « Bascule chaque ligne »
3. **Liste bascules** (0/12/16, gap 8)

**Bascule (`HEpiRow`)** : 64px min-height, fond surface, border 1.5 (red si non conforme, sinon line), radius 10, padding 12/14, row gap 12.
- Tile 36×36 radius 8 (fond `okSoft` + border teal si conforme · fond `redSoft` + border red + croix carré blanc si non)
- Stack : label 15/700 + détail 12/600 (text3 si OK, red si non)
- Toggle 48×28 radius 14 (fond teal si on, surfaceMute si off, border 1.5 matching, knob 22×22 blanc absolute)

**EPI présents** :
1. Casque de chantier — conforme — « Porté · état OK »
2. Chaussures de sécurité — conforme — « S3 anti-perforation »
3. Gilet haute-visibilité — conforme — « Classe 2 · propre »
4. Gants de manutention — conforme — « Cuir · taille L »
5. **Lunettes de protection** — NON conforme — « Cassées · à remplacer »
6. Bouchons d'oreilles — conforme — « SNR 32 · jetables »
7. Masque anti-poussière FFP2 — conforme — « Stock OK · 3 boîtes »

**Action bar** : `Valider conformité EPI` (teal, 64px, icon check) **disabled** car 1 non conforme. Hint : « 1 EPI non conforme · à régler avant validation ». Secondary `Réinit.` 56px.

---

### Flux Déclaration Incident (`HScreenDeclare`)

**Purpose** : déclarer un incident en 3-5 taps. Lancé depuis le héros rouge de l'Accueil.

**Layout** :
1. **Context strip** rouge (10/14, fond `redSoft`, border-bottom red) — icône triangle red + caps « DÉCLARATION INCIDENT » red + sub mono « EVT-2026 · numéro local · sync auto »
2. **Type d'incident** (caps + pills row wrap gap 8)
   - 6 catégories : Véhicule · panne (sélectionné) · Personne · blessure · Charge · perte · Environnement · Route · Autre
   - Pill : 44px min, padding 8/14, radius 999, fond `rgba(26,142,126,0.25)` si sélectionné, sinon surface ; border 1.5 teal si sélectionné, sinon line ; check 14 teal prefix si sélectionné
3. **Sévérité** (caps + row gap 8) — `HSeverityChip` flex 1 chacun
   - 3 chips 72px : Mineure (rond teal) · Majeure (triangle orange) · Critique (carré rouge)
   - Sélectionné : fond couleur, ink blanc, forme `#fff` ; sinon : fond surface, border line, forme couleur
   - **Si critique** : bandeau alerte sous les chips — fond `redSoft`, border red, padding 10/12, radius 8 — carré rouge 8×8 + « Cascade automatique · TER + ACT-2026 créés à l'envoi »
4. **Photo preuve** : carte 88px, surface, line — thumbnail 64×64 stripes + label + sub + bouton « + Photo » 36px caps
5. **Note vocale** : carte 76px — bouton mic rouge 44×44 radius 50% (rect + arc + tige) + label + durée mono `00:24` + faux waveform (26 barres width 3 height var, teal les 18 premières puis text4)
6. **Localisation** : carte 60px — tile teal 36×36 (icône pin) + site + GPS mono + badge « AUTO » teal

**Action bar** : `Envoyer incident` rouge (tone='red'), 64px, icon send · secondary `Retour` · hint « Critique · cascade TER + ACT-2026 »

---

### État · Enregistré (`HScreenSaved`)

**Purpose** : confirmation que l'événement est enregistré, cascade lancée.

**Layout** :
1. **Hero navy** (24/18/26) — fond `#0B2540`, ink blanc, border-bottom line
   - Cercle teal 64×64 + check 38 + ring `rgba(26,142,126,0.30)`
   - Stack : « Enregistré » 26/800 ls −0.3 + sub 13 `#B7C9E0` « Incident dans la file locale · cascade lancée »
2. **Ref locale** strip (12/18, fond `rgba(26,142,126,0.16)` dark / 0.10 light, border-bottom line) — caps « RÉFÉRENCE LOCALE » + code mono 15/700 `EVT-2026-0207`
3. **Cascade automatique** (caps + 3 cartes gap 8)
   - Chaque carte : 10/12, surface, line, radius 10 — tile teal 36×36 (`okSoft` + border teal + check 18) + label 14/700 + code mono 12 `text3` + check droite 20 teal
   - 3 cartes : TER alerté (`PL-TER-002`) · Action créée (`ACT-2026-0143`) · Inspection rattachée (`INSP-2026-0518`)
4. **Sync queue** dashed card — orange icône sync + « 3 événements en file » + « Envoi auto dès le retour du réseau »

**Action bar** : `Nouvel événement` teal, icon check · secondary `Fermer`

---

### État · Rien d'urgent (`HScreenEmpty`)

**Purpose** : Accueil sans rien à traiter. Garde les 2 héros et compteurs à zéro, ajoute un panneau vide.

**Layout** :
1. 2 héros identiques à l'Accueil
2. Worklist counters tous à `00` neutral
3. **Panneau vide** dashed (margin 16/14, flex 1, fond surface, border 1.5 dashed line, radius 14, padding 32/20, center)
   - Cercle 72×72 `okSoft` border teal + check 36 teal
   - Titre 20/800 « Rien d'urgent »
   - Sub 13/500 `text3` max-width 240 — « Aucune inspection en retard ni action critique ouverte sur ta tournée. »

---

## Interactions & Behavior

Les prototypes ne montrent pas d'animations complexes — comportement attendu :

- **Tap héros rouge Accueil** → ouvre Déclaration incident (slide horizontal). Conserver le header sub remplacé par crumb « EVT-2026 · cascade » + titre « Déclaration incident ».
- **Tap héros teal Accueil** → ouvre Déclaration observation (même structure, sans cascade obligatoire, palette teal au lieu de rouge).
- **Tap onglet bas** → switch écran avec ripple discret sur la pastille active. Pas de transition page.
- **Tap item inspection** → ouvre modale détail item (4 boutons radio états + photo + note vocale + sauvegarder). À spécifier côté produit.
- **Tap segment Actions** → filtre la liste, animation de comptage du badge.
- **Tap « Clôturer » sur action** → modale confirmation « Clôturer ACT-2026-XXXX ? » avec note libre optionnelle + photo. À spécifier.
- **Tap bascule EPI** → toggle conformité, recompte le hero, bouton « Valider conformité » s'active si tous conformes.
- **Tap shutter Capture** → flash blanc 80ms, vibration légère, screen freeze ~300ms, photo apparaît en thumbnail mini sur le bouton galerie. Si label vide, focus le champ avant capture.
- **Critique → cascade** : bandeau visible avant l'envoi · TER notifié + ACT-2026 créée + INSP rattachée à l'envoi · cartes de cascade visibles dans `HScreenSaved`.
- **Hors ligne** : badge « HORS LIGNE » orange dans la status bar reste visible jusqu'à reconnection. Tous les écrans fonctionnent identiquement, sync différé. File visible dans `HScreenSaved`.

### Boutons primaire / secondaire

Tout `HActionBar` :
- Bouton primaire : flex 1, **64px**, radius 10, 18/800 caps ls 0.5, icône suffix (arrow / check / send)
- Bouton secondaire (si présent) : flex 0 0 36%, **56px**, transparent, border 2px (cream en dark, navy en light), même couleur ink, chevron gauche prefix
- Hint (optionnel) : 13/500 `text2`, dot 8×8 couleur primaire + ring 4px soft
- État disabled : fond `surfaceMute`, ink `text4`, pas de shadow

### Empty et succès systèmes

- Empty pattern : cercle teal soft + icône check + titre 20/800 + sub 13/500 max 240px center
- Succès pattern : hero navy plein + cercle teal 64 + ring soft + titre 26/800 + sub

## State Management

Variables minimum :
- `theme: 'dark' | 'light'` — peut être auto (détection ambient light) ou toggle utilisateur
- `offline: boolean` — détection navigator.onLine
- `agent: { matricule, name }` — depuis login PIN
- `activeTab: 'accueil' | 'capture' | 'inspection' | 'actions' | 'feed' | 'epi'`
- `worklist: { aFaire, enCours, critiques, duJour }`
- `inspections: Inspection[]` (chaque item a `status: 'ok' | 'alerte' | 'critique' | 'nonverif'`)
- `actions: Action[]` (chaque a `code ACT-2026-####`, `sev`, `open`, `source`, `due`)
- `feed: Event[]` (chaque a `code EVT-2026-####`, `kind`, `sev`, `who`, `site`, `via?`)
- `epi: EpiItem[]` (chaque a `label`, `conformite`, `detail`)
- `queue: { count, lastSync }` — événements en attente de sync

Transitions clés :
- Nouvel incident critique → push dans `feed` + `actions` (auto ACT-2026 generated locally) + flag pour TER notification (à envoyer dès reconnexion)
- Toggle EPI → recalcule conformes, bloque/débloque le bouton de validation
- Clôturer action → mute la carte (opacity 0.7), badge `CLOS`, désactive les boutons
- Reconnexion → drainer la queue dans l'ordre, badge HORS LIGNE disparaît

## Assets

- **Inter** + **IBM Plex Mono** via Google Fonts (préchargés dans le HTML head)
- Toutes les icônes sont **SVG inline** dans `hse-shell.jsx` (`HTabIcon`) et `hse-screens.jsx`. Trait fin, stroke 1.8-2.2, line-cap/join round. Aucun emoji.
- Aucune image bitmap utilisée. Les placeholders « preuve » et « compteur » sont des `repeating-linear-gradient` 45deg en stripes.

## Données réelles à câbler (LOI)

- **Sites** : Garage Betainomby · Port Toamasina (PDP / MOCCO / C4) · Moramanga · APC Andriamena (RN44) · COLAS/Ivondro
- **Flotte** : CT-001…015 — SCHACMAN F3000 6×4 + Renault Kerax · plaques en suffixe `TCB`
- **Codes** : `INSP-2026-####` · `EVT-2026-####` · `ACT-2026-####`
- **Matricules** : `PL-HSE-XXX` (agent HSE), `PL-TER-XXX` (TER)
- **Login** : matricule + PIN, pas de SSO. À CONFIRMER : longueur PIN, durée session, biométrie optionnelle.

## À CONFIRMER avec LOI (non inventé dans le design)

- Format matricule agent HSE exact
- Catalogue officiel types d'incident (6 montrés en placeholder)
- Items inspection officiels par type (site / véhicule / charge / documents)
- Catalogue EPI obligatoires par poste / chantier (7 montrés en placeholder)
- Canal cascade TER (push / SMS / radio)
- Règles de création auto ACT-2026 : délai par défaut, responsable, gabarits
- Format de numérotation final (séquence locale + reconciliation serveur)
- Permission caméra refusée → fallback (uploader photo, dessiner)
- Plafond file offline (nombre d'événements + taille des médias)

## Autres modules livrés dans le même projet

Voir les dossiers `design_handoff_pointage_chauffeur` et `design_handoff_pointage_pneu` pour les deux autres modules LOI utilisant le **même système D82**. Les tokens, le shell (status bar, app bar, action bar, phone composer), et l'aesthetic doivent rester cohérents entre tous les modules.
