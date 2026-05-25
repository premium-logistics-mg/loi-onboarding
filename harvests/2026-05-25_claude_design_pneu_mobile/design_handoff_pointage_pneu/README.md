# Handoff — Pointage Pneu (mobile N5)

Cible : `loi-cockpit/app/mobile/pointage-pneu/` · Next.js 14 App Router · TypeScript · Tailwind · shadcn/ui · données depuis `lib/loi-master-dataset`.

## 1 · À propos des fichiers fournis

Les fichiers `reference_html/*` sont des **prototypes HTML/React (Babel inline)** servant de **référence visuelle hi-fi**. Ils ne se copient pas tels quels : le but est de **reproduire à l'identique** ce design dans la stack LOI (Next.js + Tailwind + shadcn), en mappant les tokens D82 sur les variables repo `--cockpit-*` / classes `pl-*` existantes.

Le dossier `scaffold/` contient une **structure de fichiers TypeScript prête à coller** dans `app/mobile/pointage-pneu/` : composants par étape, shell partagé, types, state du wizard. Tous les libellés FR sont en clair, prêts pour i18n plus tard.

Fidélité : **hi-fi** sur toutes les dimensions visibles (couleurs, type, espacement, targets terrain). Les comportements de navigation sont **stubbés** (pas de write-path tant que `MOBILE_WRITES_LIVE=false`, conforme §4).

## 2 · Charte respectée

| Règle (contexte LOI v1) | Implémenté |
|---|---|
| §2 · Couleurs D82 strictes (navy / teal / cream · zéro cyan/bleu vif/orange-accent/lavande) | ✅ |
| §2 · Inter (UI) + IBM Plex Mono (chiffres) — **aucune autre police** | ✅ |
| §2 · Cibles tactiles ≥44×44 — ici ≥56-64 px (action primaire) | ✅ |
| §3 · Données réelles SCHACMAN F3000 6×4 · KERAX · sites Madagascar · plaques `…TCB` · CT-001..015 · PL-MEC-XXX | ✅ |
| §3 · Aucun Volvo/HINO/Toyota/Kolwezi/Carlos/Mukendi/cuivre | ✅ |
| §4 · `MobileCaptureWizard` 5 étapes · Retour · progression · Continuer | ✅ |
| §4 · `VehicleSelector` · `AxlePositionPicker` (→ code `MOT 2ESS-EXT-G`) · `CameraCapture` · `EventConfirm` · `EventSummary` | ✅ |
| §7 · Action primaire ≥56 (ici 64) · espacement généreux · saisie minimale · 3-5 taps · gros Retour · progression · feedback immédiat · file offline + sync | ✅ |

## 3 · Thème

**D82 light cream** retenu (et non dark défaut) parce que le mécanicien travaille en **plein soleil** — un écran dark devient un miroir, le cream reste lisible (§7). Le header reste navy pour la hiérarchie module.

Garde la possibilité de basculer en dark (D82 default) via le `theme-provider` du repo — le composant Shell prend `theme="light" | "dark"`.

## 4 · Tokens (à mapper sur le repo)

```css
/* Couleurs LOI D82 utilisées par ce module — à mapper sur --cockpit-* */
--cockpit-paper:        #F5F1E8;  /* fond cream */
--cockpit-card:         #FFFFFF;
--cockpit-navy:         #0B2540;  /* texte primaire + app bar */
--cockpit-navy-2:       #142F4F;
--cockpit-navy-3:       #1E3E66;
--cockpit-teal:         #1A8E7E;  /* accent strict — action primaire/validation */
--cockpit-teal-deep:    #0F6E60;
--cockpit-teal-soft:    #D3E8E2;
--cockpit-teal-on-dark: #3EAA9B;
--cockpit-status-green: #2D8659;
--cockpit-status-orange:#C77E2A;  /* file d'attente / "À CONFIRMER" */
--cockpit-status-red:   #B8421E;  /* incidents · jamais cyan/bleu */
--cockpit-steel:        #5E6B7C;
--cockpit-steel-2:      #8A95A3;
--cockpit-line:         #D7D2C2;
--cockpit-line-soft:    #E6E1D2;
```

Polices : `font-sans` = Inter ; `font-mono` = IBM Plex Mono. Toute valeur chiffrée (plaques, codes véhicule, code position, n° série, km, heures, références) **doit** être en `font-mono tabular-nums`.

## 5 · Données — `lib/loi-master-dataset`

Aucune donnée n'est inventée. Le scaffold importe depuis un module typé :

```ts
// lib/loi-master-dataset/index.ts (extrait attendu — adapter au repo)
export type VehicleCode = `CT-${string}` | `S${string}`;
export type TirePosition =
  | `${1|2|3|4}ESS-G` | `${1|2|3|4}ESS-D`            // simple
  | `${1|2|3|4}ESS-EXT-${'G'|'D'}`
  | `${1|2|3|4}ESS-INT-${'G'|'D'}`;
export type PositionCode = `MOT ${TirePosition}` | `REM ${TirePosition}`;

export interface Vehicle {
  code: VehicleCode;            // CT-007
  plate: string;                // 4271 TCB  · format à confirmer LOI
  model: 'SCHACMAN F3000 6X4' | 'RENAULT KERAX';
  config: '6x4' | '6x2' | '4x2' | '8x4';
  homeSite: SiteName;
}

export type SiteName =
  | 'Port Toamasina · PDP'  | 'Port Toamasina · MOCCO' | 'Port Toamasina · C4'
  | 'Garage Betainomby' | 'Moramanga · relais'
  | 'APC Andriamena · RN44' | 'COLAS · Ivondro';

export type TireEvent = 'inspection' | 'montage' | 'depose' | 'reparation' | 'remplacement';
export interface TireBrand { name: string; sizes: string[]; }   // À CONFIRMER liste fermée LOI
```

**Stubs à remplacer** par les vrais accesseurs `lib/loi-master-dataset` :
- `getRecentVehiclesForMechanic(matricule)` → 4 derniers
- `getAxleConfigForVehicle(code)` → renvoie le `config` pour piloter le `TruckDiagram`
- `getTireBrands()` → liste fermée (À CONFIRMER)
- `getMechanicMatricule()` → depuis la session

## 6 · Écrans (1-indexés, conformes au flux §4)

### 01 · `Step1Vehicle`
Sélection véhicule. Hiérarchie : **action primaire « Scanner la plaque »** (camera native via `<input type="file" capture="environment">`), **fallback** champ recherche (`CT-…` / plaque), **liste** des 4 derniers du mécano.
- Item véhicule sélectionné : bordure 2px teal + ombre 0 6px 16px rgba(26,142,126,.18).
- État vide possible (pas de récents) : afficher uniquement le tile scan + champ.
- Continuer désactivé tant qu'aucun véhicule.

### 02 · `Step2Position`
`AxlePositionPicker` SVG plongeant, taillé pour la **config du véhicule**. Pour 6×4 :
- Essieu 1 directeur : 2 pneus simples (`1ESS-G`, `1ESS-D`).
- Essieux 2 & 3 motrices jumelées : 4 pneus chacun (`2ESS-EXT-G/INT-G/INT-D/EXT-D`).
- Pneu sélectionné : remplissage teal + halo dashé + badge ✓.
- Repère « AVANT » en haut, « ← GAUCHE · DROITE → » en bas (anti-erreur sous pression).
- Badge code position en pavé navy sous le schéma : `MOT 2ESS-EXT-G` mono 22px + décodage humain « Essieu 2 · Extérieur · Gauche » 12px.
- Config 4×2 / 6×2 / 8×4 : géométrie à déduire du dataset, **À CONFIRMER** la liste exhaustive du parc.

### 03 · `Step3Event`
5 tiles plein-largeur 88-96 px de haut, gap 10 px. Ordre canonique : Inspection · Montage · Dépose · Réparation · Remplacement. Icône 28 px monochrome (devient blanche sur tile sélectionnée), label 18/800, descriptif 13/500. **Remplacement** prend l'accent orange `--cockpit-status-orange` au lieu du teal (action plus coûteuse — signal différencié, conforme §7 « status par couleur + forme »).

### 04 · `Step4Details`
4 cartes verticales `DetailCard` (numérotées 1-4) :
1. **Marque pneu** — sélection dans liste fermée (`getTireBrands`). Modal/sheet shadcn.
2. **N° série pneu** — scan QR/DOT (`<input capture>`). Mono.
3. **Kilométrage véhicule** — pavé numérique custom (jamais clavier alpha). Mono.
4. **Photo preuve** — `<input type="file" capture="environment">`, vignette 64×64.
Chaque carte affiche sa valeur saisie en mono navy 17 px + descripteur 12 px steel. Bouton « Modifier » / « Rescan » 36 px secondaire. Strip context en haut (CT-007 · MOT 2ESS-EXT-G · Montage) avec dot teal. Bande inférieure « Enregistré localement · envoi au réseau » avec ✓ vert (§7 rassurance).

### 05 · `Step5Confirm`
Hero navy avec rond teal 60 px + ✓ blanc 34 px + halo `rgba(26,142,126,.25)` 6 px. Titre « Enregistré » 24/800. Sous-titre « Pointage ajouté à la file locale · sync au réseau ». Bande teal-soft avec **référence locale** mono `PNEU-AAAA-MMDD-####` (format **À CONFIRMER**). Carte récap (8 lignes mono où chiffres). Bloc « 3 pointages en file » avec icône cycle orange (file offline). Action primaire « Nouveau pointage » (teal), secondaire « Terminer » (ghost navy).

## 7 · Shell partagé (`Shell.tsx`)

- `<StatusBar offline />` 30 px navy · heure mono à gauche · pill « HORS LIGNE » orange + icônes wifi/batterie blancs.
- `<AppBar crumb title right showBack />` 76 px navy. Chevron retour 56×56. Sur les écrans 2-5, le slot `right` reçoit `<TruckChip code plate />` (teal-glow). Sur écran 1, `<MatChip matricule />`.
- `<StepsBar step={1..5} />` 5 colonnes égales · barre 4 px (teal si done/active) + libellé mono caps 9/700.
- `<ActionBar primary secondary onPrimary onSecondary hint primaryEnabled />`. Hauteur primaire **64 px** (au-delà des 56 demandés). Secondaire **60 px**, ghost border 2 px navy. Hint avec dot teal au-dessus.
- Gesture pill Android 16 px en bas.

## 8 · State du wizard

`useTireLoggingWizard()` (Context + reducer ou Zustand store local) :

```ts
interface WizardState {
  step: 1 | 2 | 3 | 4 | 5;
  vehicle?: Vehicle;
  position?: PositionCode;            // 'MOT 2ESS-EXT-G'
  event?: TireEvent;
  details: {
    brand?: { name: string; size: string };
    serial?: string;                  // À CONFIRMER format
    km?: number;
    photoBlobIds: string[];           // local IDs avant sync
  };
  localRef?: string;                  // PNEU-AAAA-MMDD-####
}
```

**Write-path** : `MOBILE_WRITES_LIVE === false` → tout passe par `queueOffline()` qui pousse dans IndexedDB. Sync au reconnect via service worker. **Pas de blind POST** (§4). Ajouter `// TODO write-path Postgres` aux points d'appel.

## 9 · Accessibilité & terrain

- WCAG AA vérifié : navy `#0B2540` sur cream `#F5F1E8` = ratio 11.5, teal `#1A8E7E` sur blanc = 3.8 (suffisant pour grandes typographies bold ≥18 px et icônes 4×4, conforme AA non-text).
- Tous les status redondent **couleur + forme + libellé** (jamais couleur seule, §2/§7).
- Lang : `<html lang="fr">`. Labels FR simples sans jargon EN.
- Targets : action primaire 64, secondaire 60, items liste 72, tiles événement 88-96, chips 36+. Tout au-dessus des 44 minimum.

## 10 · À confirmer avec LOI avant intégration

| Item | Pourquoi |
|---|---|
| Format exact des plaques (suffixe `TCB` mentionné §3, masque complet ?) | Validation regex `VehicleSelector` |
| Format n° série pneu (DOT raw vs QR LOI propre) | Validation `Step4Details` champ 2 |
| Format référence locale `PNEU-AAAA-MMDD-####` | Génération offline, collisions à éviter |
| Liste fermée marques pneu + tailles supportées | `getTireBrands()` |
| Mapping `CT-###` → config essieux (6×4 / 6×2 / 8×4) | `TruckDiagram` adaptatif |
| Convention `MOT` / `REM` si remorques entrent dans le scope | Préfixe code position |
| Signature TER mentionnée §4 | Étape additionnelle 5b, hors scope V1 |
| Comportement cas dégradés (pneu inconnu, écart km, photo refusée) | États V1.1 |

## 11 · Fichiers fournis

```
design_handoff_pointage_pneu/
├── README.md                              ← ce fichier
├── reference_html/                        ← prototype hi-fi (référence visuelle)
│   ├── index.html
│   ├── design-canvas.jsx
│   ├── loi-shell.jsx
│   ├── screens.jsx
│   └── app.jsx
└── scaffold/                              ← à coller dans loi-cockpit/
    └── app/mobile/pointage-pneu/
        ├── page.tsx                       ← entrée wizard
        ├── layout.tsx                     ← lang fr · viewport mobile
        ├── _state.tsx                     ← Context + reducer
        ├── _types.ts                      ← types métier
        ├── _data.ts                       ← shims vers lib/loi-master-dataset
        ├── _components/
        │   ├── Shell.tsx                  ← StatusBar · AppBar · StepsBar · ActionBar · MatChip · TruckChip
        │   ├── Step1Vehicle.tsx
        │   ├── Step2Position.tsx
        │   ├── Step3Event.tsx
        │   ├── Step4Details.tsx
        │   ├── Step5Confirm.tsx
        │   ├── TruckDiagram.tsx           ← SVG adaptatif par config
        │   ├── NumericPad.tsx             ← pavé custom km · zéro clavier alpha
        │   └── ToConfirmBadge.tsx
        └── tokens.css                     ← --cockpit-* si pas déjà dans le repo
```

## 12 · Pour démarrer côté CC

```bash
# Depuis loi-cockpit/
cp -r design_handoff_pointage_pneu/scaffold/app/mobile/pointage-pneu \
      app/mobile/pointage-pneu

# Si --cockpit-* n'existe pas déjà, importer une fois :
#   app/globals.css → @import "./mobile/pointage-pneu/tokens.css";

# Vérifier que lib/loi-master-dataset expose getRecentVehiclesForMechanic / getAxleConfigForVehicle / getTireBrands
# Adapter les imports dans _data.ts.

pnpm dev
# → http://localhost:3000/mobile/pointage-pneu
```
