# Handoff — Bernardin · Module mobile terrain

> **Pour Claude Code :** ce dossier contient un design de référence pour l'app mobile **Bernardin** (agent terrain port Toamasina · Premium Logistics / LOI). À recoder dans l'environnement cible — pas à copier-coller tel quel.

---

## 1. Overview

Bernardin est un **agent transit terrain** sur le port de Toamasina (Madagascar). Son module mobile n'est **pas un dashboard de reporting** : c'est un **outil de travail**, utilisé en gants, plein soleil, jamais devant un PC. Il orchestre les 7 étapes physiques port :

- **Mode A** (import direct conteneurisé) : étapes **13a · 15 · 16** (visite douanière Rouge · livraison client · restitution vide)
- **Mode E** (export mining) : étapes **10 · 14 · 15 · 16** (réservation camions · transfert vers port · empotage · mise à quai)

Pilier métier **P4 fluidité** · objectif **SO·2 Order-to-Cash**.

Le module fait partie d'un système plus large : un **cockpit web TUDI** (chef Transit & Dédouanement) le supervise — le mobile expose un lien `/cockpit/tudi` (cross-link nav), mais n'embarque pas les vues cockpit.

---

## 2. About the design files

Les fichiers de ce bundle sont des **références visuelles créées en HTML/JSX** (React 18 + Babel standalone, rendu in-browser). **Ce n'est pas du code de production.**

La mission : **recréer ces écrans dans l'environnement cible** — vraisemblablement **Next.js + Tailwind + shadcn/ui** (stack confirmée pour LOI) — en utilisant ses patterns établis. Si aucun environnement n'existe encore, choisir le framework adapté (Next.js App Router + Tailwind reste le défaut).

**Le HTML est une référence visuelle, pas un template à dupliquer.** Les styles inline JSX doivent devenir des classes Tailwind ou des composants shadcn. Les `window.X = X` (pattern de partage entre `<script type="text/babel">`) doivent devenir de vrais `export`.

### Fichiers fournis

```
design_handoff_bernardin_mobile/
├── README.md                       ← ce fichier
├── Bernardin Mobile.html           ← entrée — DesignCanvas avec 9 artboards (390×844 each)
├── design-tokens.css               ← TOKENS CSS officiels D82 (à porter en config Tailwind)
├── design-canvas.jsx               ← shell de présentation (ne PAS porter — c'est juste pour grouper les écrans)
└── components/
    ├── MobileChrome.jsx            ← PhoneShell, AppHeader (modale), BottomNav
    ├── Atoms.jsx                   ← Chip, MiniGauge, TouchButton, SectionLabel, Field, MicroTrace, PhotoSlot, SignaturePad, TextInput, SegmentedChoice
    ├── HomeJour.jsx                ← Écran 01
    ├── VueDossier.jsx              ← Écran 02
    ├── Modales.jsx                 ← Écrans 03, 04, 05, 06
    ├── Scorecards.jsx              ← Écran 07
    ├── CarnetProfil.jsx            ← Écran 08
    └── ModaleExtras.jsx            ← Écran 09 (placeholders Mode E)
```

---

## 3. Fidelity

**High-fidelity.** Couleurs, typographie, espacements, et états sont finaux. Recoder pixel-perfect en utilisant les tokens fournis. Les seuls éléments mock sont les datasets (numéros de dossier, clients, GPS) — à brancher sur l'API réelle.

---

## 4. Design tokens (porter d'abord)

Tous les tokens sont dans `design-tokens.css`. **Avant tout autre travail**, les porter dans la config Tailwind (`tailwind.config.ts` → `theme.extend`).

### 4.1 Palette (strictement 6 couleurs + neutres — aucune autre autorisée)

| Token | Hex | Usage |
|---|---|---|
| `pl-navy` | `#0B2540` | Header des **modales uniquement** (différencie le contexte action) |
| `pl-teal` | `#1A8E7E` | Accent UNIQUE — CTA primaires, focus, sélection (light) |
| `pl-teal-light` | `#3EAA9B` | Accent dark · M13 trace · liens |
| `pl-cream` | `#F5F1E8` | Fond éditorial light (non utilisé sur mobile dark) |
| `pl-green` | `#2D8659` | Statut OK / conforme — **vert silencieux** |
| `pl-orange` | `#C77E2A` | Statut attention |
| `pl-error` | `#B8421E` | Statut alerte |

**Dark mode tokens (défaut de cette app)** :

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#080B14` | Fond écran (PhoneShell background) |
| `surface` / `card` | `#161A24` | Cartes dossier, mini-gauges, modale body |
| `border` | `#242835` | 1 px solide partout |
| `text-primary` | `#F0EEEB` | Texte principal |
| `text-secondary` | `rgba(240,238,235,0.78)` | Labels secondaires |
| `text-muted` | `rgba(240,238,235,0.60)` | Hints, micro-labels |

**Couleurs status éclaircies pour le dark (lisibilité)** — utilisées en runtime mais **dérivées** des tokens base :
- OK status text : `#5BC58B`
- Warn status text : `#E3A053`
- Err status text : `#E4734D`

**Interdit :** cyan, bleu vif, orange comme accent, violet, vert Tailwind générique (`emerald-500`, `green-500`). Si tu en vois un, c'est un bug.

### 4.2 Typographie

- **Inter** — corps, titres, UI. Poids 400 / 500 / 600 / 700.
- **IBM Plex Mono** — **tous les chiffres** : numéros de dossier, plaques, BL, KPI, %, kg, MGA, distances, durées, GPS. `font-variant-numeric: tabular-nums` **obligatoire**.

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap");
```

Échelle (réutilisée par les écrans mobile — voir `design-tokens.css` section 5) :

| Rôle | Taille | Poids | Famille |
|---|---|---|---|
| Hero number (scorecards) | 64 px | 500 | Mono |
| Hero secondary | 48 px | 500 | Mono |
| H1 | 32 px | 600 | Sans |
| H2 (header écran) | 24 px | 600 | Sans |
| H3 | 18 px | 600 | Sans |
| Body | 14 px | 400 | Sans |
| Small | 12 px | 400 | Sans |
| Micro label | 11 px | 500 UPPERCASE, tracking 0.08em | Sans |

### 4.3 Spacing

Échelle **stricte** : `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`. Pas de valeurs intermédiaires.

### 4.4 Border-radius

- Chip : 2 px
- Input / bouton : 4 px (TouchButton utilise 6 px, OK)
- Carte : 6–8 px max
- Pill (FAB) : 999 px
- **Jamais > 12 px**

### 4.5 Shadows

Minimal. Le FAB Synchroniser : `0 6px 18px rgba(0,0,0,0.45), 0 0 0 1px rgba(62,170,155,0.4)`. Aucune autre ombre n'est utilisée dans le module mobile.

### 4.6 Animations

- Easing : `cubic-bezier(0.2, 0.7, 0.2, 1)`
- Durées : 120 ms (hover/toggle) · 180 ms (drawer/modale) · 240 ms max (transition vue)
- **Pas de bounce. Pas de spring.** Pas de translation > 8 px.

---

## 5. Content rules (D82 — NON NÉGOCIABLES)

- **Langue : français**. Métier malgache / logistique. **Zéro jargon anglais.** « Tournée » pas *trip*, « pointage » pas *check-in*, « transit » pas *forwarding*.
- **Phrase case partout.** Pas de Title Case anglais. « Tournées du jour » ✅ — « Tournées Du Jour » ❌
- **Voix neutre, impératif court.** « Saisir le compteur », « Confirmer le départ ».
- **Densité 3·5·7** : 3 indicateurs max par groupe d'en-tête · 5 lignes max dans une mini-table · 7 items max dans une nav.
- **Aucun bloc de texte > 15 mots** en surface. Plus long → bouton « Détails ».
- **Émojis : ❌ JAMAIS.** Unicode déco : ❌ jamais.
- **Chiffres : toujours mono, tabular-nums, espace fine en séparateur de milliers, virgule décimale.** `1 248 320 MGA` ✅ · `12,4 t` ✅
- **Allow-list clients** (à respecter — ne pas inventer de noms) : `PENTA-OCEAN` · `ANDIS MADAGASCAR` · `MG-MINE` · `NS ENTREPRISE` · `YUE FENG` · `MG NEW DEAL`
- **Jamais le label « KIORA » en UI** (P30) — on dit « dossier opérationnel ».
- **Pattern P9 anti-blind-POST** : **chaque CTA ouvre une modale formulaire** avec champs, photos, signature. Aucun bouton ne valide une action sans confirmation explicite.

---

## 6. Architecture globale

### 6.1 Viewport cible

Android moyen-gamme **6.1"** · Chrome 100+ · APN moyen · compression photo 1280 px · 70 % (réglable dans Profil).
Mock dimensionné **390 × 844** (iPhone 13 logical pixels, proche d'un Pixel 6).

### 6.2 Navigation

- **BottomNav fixe** (52 px de haut + safe-area) avec 4 onglets : **Accueil · Dossiers · Carnet · Profil**
- **FAB Synchroniser** : pill teal à droite, position absolute, `bottom: 86px right: 16px`. Visible uniquement sur l'écran Home.
- **Header**
  - **Écrans racine** (01, 02, 07, 08) : header transparent ou minimal sur fond `#080B14`
  - **Modales** (03–06, 09) : header **navy `#0B2540`** plein largeur — **c'est ce qui différencie visuellement le contexte action**
- **CrossLinkNav** : sur l'écran **Vue dossier**, un lien discret « Voir dans cockpit TUDI » pointe vers `/cockpit/tudi` (handoff vers la version web).

### 6.3 Routing recommandé (Next.js App Router)

```
app/
├── (mobile)/
│   ├── layout.tsx              ← shell + BottomNav
│   ├── page.tsx                ← Home jour (écran 01)
│   ├── dossier/[ref]/
│   │   ├── page.tsx            ← Vue dossier (écran 02)
│   │   └── action/
│   │       ├── visite-douane/page.tsx     ← écran 03 (modale A·13a)
│   │       ├── livraison/page.tsx         ← écran 04 (modale A·15)
│   │       ├── restitution/page.tsx       ← écran 05 (modale A·16)
│   │       ├── empotage/page.tsx          ← écran 06 (modale E·15)
│   │       ├── reservation/page.tsx       ← écran 09 (modale E·10)
│   │       ├── transfert/page.tsx         ← écran 09 (modale E·14)
│   │       └── mise-a-quai/page.tsx       ← écran 09 (modale E·16)
│   ├── scorecards/page.tsx     ← écran 07
│   └── carnet/page.tsx         ← écran 08 (Carnet + Profil dans une seule vue)
```

Modales = **routes intercept** (`@modal/(.)action/...`) si on veut overlay au-dessus de Vue dossier, sinon page plein écran.

---

## 7. Écrans — détails

### 7.1 Écran 01 — Home jour

**Fichier ref :** `components/HomeJour.jsx`

**Layout** (de haut en bas, padding latéral 18 px) :

1. **HomeHeader** — `padding: 8px 18px 12px`, border-bottom `1px solid #1A1F2E`
   - Gauche : « Bonjour » (11 px, opacity 55 %) au-dessus de « **Bernardin** » (22 px / 600 / -0.015em)
   - Droite : date `28 mai 2026` (mono 11 px) au-dessus de « Agent terrain · port Toamasina » (9.5 px UPPERCASE, tracking 0.08em)

2. **Section « Mes scores du moment »** (SectionLabel)
   - Grid 2 colonnes, gap 8, 4 mini-jauges B-K01 → B-K04
   - Chaque MiniGauge : code chip (teal soft, mono 9px), grand chiffre coloré (mono 16px, color par status), label (10.5px), barre de progression (3px haut), pied « cible X » / « N % »

3. **Section « Dossiers du jour »** count = "6 dossiers", right = « Filtrer » (teal 11px)
   - Stack vertical, gap 8, padding 0 18px 32px

4. **DossierCard** — bord gauche 3 px coloré (prio) :
   ```
   ┌───────────────────────────────────┐
   │ ▎ [Chip Mode A/E] FAI 2026 0418      ETA+3 │
   │ ▎ PENTA-OCEAN                              │
   │ ▎ [étape 15] Livraison marchandise       › │
   │ ▎ ─────────────────────────────────────── │
   │ ▎ MSCU 4729183                             │
   └───────────────────────────────────┘
   ```
   - Background `#161A24`, border `1px solid #242835`, border-left `3px solid {prioColor}`, radius 6, padding 12 14
   - Chip Mode `A` = navy bg `#11203A` / fg `#9EC3FF` ; Mode `E` = cream bg `rgba(245,241,232,0.10)` / fg `#E8DEC8`
   - Référence dossier en mono 12px, opacity 85 %
   - Timing (ETA+3, J-2, etc) en mono 12px 600, coloré par prio
   - Client en 14px / 600 / -0.005em
   - Étape badge : mono 10px, border `1px solid #2A3145`, radius 2, padding 2px 5px
   - Footer en `border-top: 1px dashed #1F2433`, padding-top 8 : numéro conteneur mono 11px + chevron 14px ou tag « dérive 6h » err

5. **SyncFAB** — pill teal `#1A8E7E`, h 52, padding `0 22px 0 18px`, position absolute right 16 bottom 86, icône Lucide `refresh-cw` 18px + « Synchroniser »

6. **BottomNav** — voir `MobileChrome.jsx`. 4 onglets égaux, actif = Home.

**Dataset visible** (à remplacer par fetch réel) :

| Mode | Ref | Client | Étape | Timing | Prio | Conteneur |
|---|---|---|---|---|---|---|
| A | FAI 2026 0418 | PENTA-OCEAN | 15 Livraison marchandise | ETA+3 | ok | MSCU 4729183 |
| A | FAI 2026 0414 | ANDIS MADAGASCAR | 13a Visite douanière Rouge | ETA+2 | warn | GESU 5118402 |
| E | FAE 2026 0207 | MG-MINE | 15 Empotage marchandise | J+1 | ok | MSCU 9134721 |
| A | FAI 2026 0411 | NS ENTREPRISE | 16 Restitution vide | ETA+5 | err | TGHU 6204880 (dérive 6h) |
| E | FAE 2026 0208 | YUE FENG | 10 Réservation camions | J−2 | ok | 3 × 20' |
| E | FAE 2026 0205 | MG NEW DEAL | 16 Mise à quai | J+2 | ok | MSCU 9132018 |

### 7.2 Écran 02 — Vue dossier

**Fichier ref :** `components/VueDossier.jsx`

Détail d'un dossier (ex. FAI 2026 0414 · ANDIS · Visite douanière Rouge). Contient :

- **Header dossier** : retour `‹`, ref mono, chip Mode A
- **Bloc identification** : client, conteneur, BL, ETA, étape courante (gros)
- **Timeline verticale** des 3 étapes Mode A (13a · 15 · 16) — état atteint / en cours / à venir
- **3 CTA d'action** (TouchButton primary, success, ghost selon contexte) — chacun ouvre la modale correspondante (écrans 03 / 04 / 05)
- **CrossLinkNav** discret en bas : « Voir dans cockpit TUDI → »

### 7.3 Écrans 03 / 04 / 05 / 06 — Modales d'action

**Fichier ref :** `components/Modales.jsx`

Toutes les modales suivent le **même pattern P9** :

```
┌───────────────────────────────────┐
│ [HEADER NAVY #0B2540]              │
│  ‹ Visite douanière Rouge          │
│  FAI 2026 0414 · A · étape 13a     │
├───────────────────────────────────┤
│ [BODY scroll · background #080B14] │
│                                   │
│  Sections de champs (Field, TextInput,
│  SegmentedChoice, photos, signature)
│                                   │
│  MicroTrace (M13 GPS + time + owner)
├───────────────────────────────────┤
│ [FOOTER sticky]                    │
│  [Confirmer] [Annuler]             │
└───────────────────────────────────┘
```

- **Header navy `#0B2540`** : 8–12 px padding vertical, chevron retour ‹ à gauche, titre 17px / 600 + sous-titre mono 11px opacity 65 %
- **Body** : padding 18 px latéral, sections espacées de 20 px, chaque section démarre par un SectionLabel
- **PhotoSlot** : max **3 photos par modale**, en grid 3 colonnes gap 8. Dashed quand vide, schematic SVG quand rempli (voir `FilledPhotoArt` dans `Atoms.jsx` pour le pattern visuel)
- **SignaturePad** : 110 px hauteur, fond cream `#F5F1E8` quand signée, dashed beige quand vide. Tracé SVG noir navy
- **SegmentedChoice** : 3-state radio (Bon / Légères / Majeures), background `rgba(255,255,255,0.025)`, segment actif = teal `#1A8E7E` / texte `#07140F`
- **MicroTrace footer** : background `rgba(62,170,155,0.06)`, border teal soft, mono 10px, contient icône Lucide `map-pin`, label « M13 », coordonnées GPS, timestamp, « Bernardin »
- **Footer CTA** : `TouchButton` primary « Confirmer » (52 px min-height) + secondary « Annuler »

**Modales par écran** :

| Écran | Action | Mode·Étape | Champs principaux |
|---|---|---|---|
| 03 | Visite douanière Rouge | A · 13a | Constat (Segmented Bon/Légères/Majeures), 3 photos conteneur (face, scellé, intérieur), observations libres, signature douanier |
| 04 | Livraison client | A · 15 | Heure arrivée site, compteur km, 3 photos (camion sur site, déchargement, conteneur vidé), signature client |
| 05 | Restitution vide | A · 16 | Lieu restitution (dropdown), état conteneur (segmented), 3 photos (extérieur, intérieur, scellé/portes), signature dépôt |
| 06 | Empotage marchandise | E · 15 | Tonnage chargé (mono input), nombre de palettes/big-bags, 3 photos (avant empotage, en cours, scellé final), réf de scellé, signature surveillant |

### 7.4 Écran 07 — Scorecards

**Fichier ref :** `components/Scorecards.jsx`

Vue détail des **4 KPIs B-K01 → B-K04** en plein écran (un par card, pas mini). Chaque card = hero number 64px mono + label + cible + barre + historique 7 jours.

**Banner offline** (mock) en haut si pas de réseau : background `warn-soft`, mono 11px, « Mode hors-ligne · données synchronisées à 09:14 ».

### 7.5 Écran 08 — Carnet de bord + Profil

**Fichier ref :** `components/CarnetProfil.jsx`

Liste verticale des **événements personnels du jour** (« Pointage 06:42 », « Tournée Tana → Tamatave », « Pause 12:15 », etc.) en lecture seule, avec un bouton « Ajouter un événement ».

Sous-section **Profil** : photo placeholder, nom Bernardin, rôle « Agent transit terrain », réglages (compression photo, langue, déconnexion).

### 7.6 Écran 09 — Modales Mode E (placeholders)

**Fichier ref :** `components/ModaleExtras.jsx`

3 placeholders pour les étapes Mode E pas encore détaillées : **10 Réservation camions**, **14 Transfert vers port**, **16 Mise à quai**. Même squelette que les modales 03–06 mais champs simplifiés / `confirm-badge` « à confirmer ».

---

## 8. Composants à recréer (mapping vers shadcn/Tailwind)

### Atoms (Atoms.jsx) → shadcn equivalents

| Composant ref | Équivalent suggéré | Notes |
|---|---|---|
| `Chip` | shadcn `Badge` variant custom | Variants : `ok`, `warn`, `err`, `accent`, `neutral`, `navy`, `cream`. UPPERCASE, tracking 0.04em, radius 2. `mono` prop pour Plex Mono. |
| `MiniGauge` | Composant custom | Pas d'équivalent shadcn direct. Voir Atoms.jsx pour structure. |
| `TouchButton` | shadcn `Button` size `lg` étendu | Min-height **52 px** non-négociable. Variants : primary (teal), secondary (ghost border), success, warn, danger, ghost. Supporte un `subtle` sub-label. |
| `SectionLabel` | Composant custom | Header de section, UPPERCASE 10.5 px tracking 0.10em, slot droit optionnel (action link). |
| `Field` | Composant custom | Read-only key/value pair. Label UPPERCASE micro + valeur. |
| `MicroTrace` | Composant custom | **Toujours en pied de modale.** GPS + timestamp + owner Bernardin. Pin Lucide. |
| `PhotoSlot` | Composant custom | aspect-ratio 4/3 (ou 1/1 si `small`). Dashed vide vs schematic SVG rempli. **Ne PAS générer de fausses photos AI** — utiliser le SVG schematic ou un placeholder neutre. |
| `SignaturePad` | Wrap autour de `react-signature-canvas` | Style cream papier quand signé. Footer mono trace timestamp. |
| `TextInput` | shadcn `Input` étendu | min-height 48 px, mono optionnel pour les codes/nombres. |
| `SegmentedChoice` | shadcn `ToggleGroup` styled | 3-state radio. Segment actif = teal solid. Min-height 42 px. |

### Chrome (MobileChrome.jsx)

| Composant | Notes |
|---|---|
| `PhoneShell` | Container 390×844 avec status bar mock — **à supprimer en prod**, juste pour la démo. En vraie app, c'est `<body>` ou le layout Next. |
| `AppHeader` | Header **navy** pour modales — voir section 7.3. |
| `BottomNav` | Fixed bottom, 4 onglets (Accueil · Dossiers · Carnet · Profil). Icônes Lucide ligne 1.5 px, 22 px. Actif = teal `#3EAA9B`. Safe-area bottom respectée. |

---

## 9. Interactions & comportements

### 9.1 Tap targets

- CTA primaires : **≥ 52 px** de hauteur
- CTA secondaires / onglets nav : **≥ 48 px**
- Liste cards : tappable entière (toute la card est `<a>` ou `<button>`)

### 9.2 États

- **Hover** (web/desktop preview only) : bordure passe à teal, **jamais d'élévation**
- **Press** : background teal saturé, pas de shrink
- **Focus** : anneau 2 px teal `--focus-ring` — **toujours visible au clavier**
- **Disabled** : opacity 0.4, cursor not-allowed

### 9.3 Flux clés

**Flux principal — Visite douanière** :
1. Home jour → tap card ANDIS (FAI 2026 0414)
2. Vue dossier → tap CTA « Visite douanière Rouge »
3. Modale 13a s'ouvre (slide-up 180 ms, easing D82)
4. Agent remplit Segmented + 3 photos + obs + signature douanier
5. Tap « Confirmer » → spinner court 240 ms → toast succès → retour Vue dossier avec timeline 13a marqué ✓

**Anti-pattern à ne pas reproduire :** aucun « tap-to-validate » direct depuis Home ou Vue dossier — **chaque action passe par la modale formulaire** (P9).

### 9.4 Synchronisation / offline

- L'app fonctionne **offline first**. Toute action est mise en queue locale.
- FAB Synchroniser : trigger manuel sync. Pendant sync : spinner inline. Après : toast « 4 actions synchronisées ».
- Banner offline sur Scorecards uniquement (les autres écrans lisent la queue locale).

### 9.5 Photos

- Compression côté client : 1280 px max sur le grand côté, qualité 70 %
- Max **3 photos par modale** (limite UX dure)
- Stockage local IndexedDB jusqu'à sync

### 9.6 Signature

- Capture sur SignaturePad (canvas). Stockage SVG path ou PNG base64.
- Append en footer du PDF généré pour le client (M13 trace).

---

## 10. State management

Stack suggérée (cohérent avec Next.js App Router) :

- **Server state** : TanStack Query (dossiers, KPIs, sync queue status)
- **Client state local** : Zustand pour la queue offline, photos pending, signature blobs
- **Form state** : React Hook Form + Zod pour chaque modale (validations strictes : tonnage > 0, photos ≥ 1, signature obligatoire)
- **Auth** : session JWT, agent identifié par `bernardin@premium-logistics.mg` (ou équivalent)

### Schemas attendus (Zod)

```ts
const VisiteDouaneSchema = z.object({
  dossierRef: z.string().regex(/^FAI \d{4} \d{4}$/),
  constat: z.enum(["bon", "legeres", "majeures"]),
  photos: z.array(z.string()).min(1).max(3),
  observations: z.string().max(500).optional(),
  signatureDouanier: z.string().min(1),
  gps: z.object({ lat: z.number(), lng: z.number() }),
  timestamp: z.string().datetime(),
  ownerId: z.string(),
});
```

(Schemas similaires pour Livraison, Restitution, Empotage.)

---

## 11. Données / API

À brancher (endpoints à définir avec le backend) :

- `GET /api/mobile/dossiers?owner=bernardin&date=today` → array de dossiers du jour
- `GET /api/mobile/dossier/:ref` → détail
- `POST /api/mobile/action/visite-douane` (idem livraison/restitution/empotage) → confirme action + photos + signature
- `GET /api/mobile/kpis/bernardin` → 4 KPIs B-K01..04
- `POST /api/mobile/sync` → batch upload des actions queue offline
- `GET /api/cockpit/tudi-handoff?dossier=:ref` → URL signée vers le cockpit web

---

## 12. Assets

- **Icônes** : **Lucide** (MIT) — `pnpm add lucide-react`. Stroke 1.5 px (déjà par défaut). Tailles : 20 px sur cockpit, 22–24 px sur mobile.
- **Fonts** : Inter + IBM Plex Mono via `next/font` (self-host recommandé pour Madagascar / 2G fallback).
- **Photos schématiques** : voir `FilledPhotoArt` dans `Atoms.jsx` — réutiliser le pattern SVG pour les vues mock / dev.
- **Logo** : placeholder textuel « LOI · Premium Logistics » — à remplacer par le SVG officiel quand fourni.

---

## 13. Accessibilité

- Contraste : tous les paires testées ≥ AA sur fond dark (le vert OK `#5BC58B` sur `#161A24` = ratio 6.8:1).
- Focus ring obligatoire (déjà dans tokens).
- Aria-labels sur tous les boutons icônes-only (Synchroniser, retour, etc.).
- `lang="fr"` sur `<html>`.
- Tap targets ≥ 48 px (déjà couvert).
- Signature : fournir un fallback texte (« Saisir nom + matricule ») si le canvas n'est pas supporté.

---

## 14. Checklist livraison

- [ ] Tokens D82 portés dans `tailwind.config.ts`
- [ ] `Inter` + `IBM Plex Mono` self-hosted via `next/font`
- [ ] BottomNav 4 onglets + safe-area iOS
- [ ] Écran 01 Home jour + 6 cartes dossier (data mock OK)
- [ ] Écran 02 Vue dossier + timeline + 3 CTA
- [ ] 4 modales (03 / 04 / 05 / 06) — pattern P9 strict, M13 trace, ≤ 3 photos, signature
- [ ] Écran 07 Scorecards + banner offline
- [ ] Écran 08 Carnet + Profil
- [ ] Sync queue offline (Zustand + IndexedDB)
- [ ] Compression photo 1280 px / 70 %
- [ ] CrossLinkNav vers `/cockpit/tudi` depuis Vue dossier
- [ ] **Audit anti-AI-slop** : pas de gradient, pas d'emoji, pas de cyan/violet, pas de Title Case anglais, pas de bloc > 15 mots, pas d'invention de client hors allow-list

---

## 15. Questions ouvertes (à clarifier avec le PO Kenny)

1. **Smartphone PL pro vs perso ?** Hypothèse retenue : Android moyen-gamme 6.1" pro fourni. **À confirmer.**
2. **Backend endpoints exacts** — non fournis, à co-définir.
3. **Authentification** — SSO LOI ? Local ? PIN code mobile ?
4. **Notifications push** : explicitement **désactivées** par défaut (D82 — 0 push auto). Banner offline OK sur Scorecards.
5. **Logo officiel** — placeholder en attendant.
6. **Allow-list clients** : pour l'instant 6 noms (PENTA-OCEAN, ANDIS, MG-MINE, NS, YUE FENG, MG NEW DEAL). Source de vérité à brancher.

---

**Bonne livraison.** Le brief D82 est strict ; si quelque chose te semble laisser passer un anti-pattern (gradient, emoji, Title Case anglais, bloc de texte long), c'est probablement un bug — relis cette section 5.
