# Handoff — Atelier Méca (mobile N5 LOI)

Cible : `loi-cockpit/app/mobile/atelier-meca/` · Next.js 14 App Router · TypeScript · Tailwind · shadcn/ui · données depuis `lib/loi-master-dataset`.

---

## 1 · À propos des fichiers fournis

Les fichiers `reference_html/*` sont des **prototypes HTML/React (Babel inline)** servant de **référence visuelle hi-fi**. Ils ne se copient pas tels quels : le but est de **reproduire à l'identique** ce design dans la stack LOI (Next.js + Tailwind + shadcn), en mappant les tokens D82 sur les variables repo `--cockpit-*` / classes `pl-*` existantes.

Le dossier `scaffold/` contient une **structure de fichiers TypeScript prête à coller** dans `app/mobile/atelier-meca/` : composants, types, hooks. Tous les libellés FR sont en clair, prêts pour i18n plus tard.

**Fidélité : hi-fi** sur toutes les dimensions visibles (couleurs, type, espacement, targets terrain, états). Les comportements de navigation et d'écriture sont **stubbés** (`MOBILE_WRITES_LIVE=false` — conforme §4 LOI).

> **Si tu pars d'un v0 codebase déjà fourni (ex. `mechanic-field-app`)** : sa structure (`MaintenanceJob`, `createEvent()`, sections par modal) est bonne à garder, **mais corrige les violations LOI** listées en §11 avant d'intégrer (Volvo/Mercedes/Scania/Carlos → INTERDIT).

---

## 2 · Charte respectée

| Règle (contexte LOI v1) | Implémenté |
|---|---|
| §2 · Couleurs D82 strictes (navy / teal / cream · zéro cyan/bleu vif/violet/vert-générique) | ✅ |
| §2 · Inter (UI) + IBM Plex Mono (chiffres) — **aucune autre police** | ✅ |
| §2 · Cibles tactiles ≥44×44 — ici tête d'accordéon 64px · Bloquer 60px · Terminer 60px | ✅ |
| §3 · Données réelles SCHACMAN F3000 6×4 · KERAX · sites Madagascar · plaques `…TCB` · CT-001..015 · PL-MEC-XXX | ✅ |
| §3 · Aucun Volvo/HINO/Toyota/Kolwezi/Carlos/Mukendi/cuivre | ✅ |
| §4 · Login universel matricule + PIN (pas re-design ici — déjà couvert ailleurs) | ✅ (renvoi) |
| §7 · Action primaire ≥56 (ici 60-64) · espacement généreux · saisie minimale · 3-5 taps · confirmation avant Terminer/Bloquer · gros chiffres mono · statut couleur+forme | ✅ |
| Brief méca v0 · 2 vues · accordéon · renvois `/mobile/pneu` + `/mobile/fuel` · 2 actions dominantes en bas | ✅ |

---

## 3 · Thème

**Dark par défaut** (cabine / atelier couvert) + **light** disponible (sortie plein soleil, atelier ouvert). Header navy `#0B2540` dans les deux modes — repérage instantané du module.

Bascule via le `theme-provider` du repo : le Shell prend `theme="dark" | "light"`.

---

## 4 · Tokens D82 (à mapper sur le repo)

```css
/* Couleurs LOI D82 utilisées par Atelier Méca — à mapper sur --cockpit-* */
--cockpit-navy:           #0B2540;  /* texte primaire + app bar (les 2 modes) */
--cockpit-teal:           #1A8E7E;  /* primaire · En cours · Terminer · OK */
--cockpit-teal-deep:      #0F6E60;
--cockpit-teal-soft:      rgba(26,142,126,0.18);
--cockpit-cream:          #F5F1E8;  /* fond light · texte sur dark */

--cockpit-status-green:   #2D8659;  /* signal Terminé uniquement */
--cockpit-status-orange:  #C77E2A;  /* Bloquer · Bloqué · En attente · alerte */
--cockpit-status-orange-soft: rgba(199,126,42,0.20);
--cockpit-status-red:     #B8421E;  /* critique uniquement (point inspection) */
--cockpit-status-red-soft: rgba(184,66,30,0.20);

/* Dark mode */
--cockpit-paper-dark:     #061629;
--cockpit-surface-dark:   #0F2A47;
--cockpit-surface2-dark:  #173659;
--cockpit-surface-mute-dark: #0B2540;
--cockpit-line-dark:      #1E3E66;
--cockpit-text-dark:      #F5F1E8;
--cockpit-text2-dark:     #B7C9E0;
--cockpit-text3-dark:     #7E94B5;
--cockpit-text4-dark:     #56708F;

/* Light mode */
--cockpit-paper-light:    #F5F1E8;
--cockpit-surface-light:  #FFFFFF;
--cockpit-surface2-light: #FBF7EC;
--cockpit-line-light:     #D7D2C2;
--cockpit-text-light:     #0B2540;
--cockpit-text2-light:    #384A63;
--cockpit-text3-light:    #5E6B7C;
--cockpit-text4-light:    #8A95A3;
```

**Polices** : `font-sans` = Inter ; `font-mono` = IBM Plex Mono. Toute valeur chiffrée (code OT, code véhicule, plaque, durée, DTC, références pièces, GPS, horaires) **doit** être en `font-mono tabular-nums`.

---

## 5 · Master dataset — `lib/loi-master-dataset`

Aucune donnée inventée. Le scaffold importe depuis un module typé :

```ts
import { getJobsForMechanic, getMechanic, getVehicle, type Job, type Mechanic } from '@/lib/loi-master-dataset';
```

Données réelles utilisées par ce module :

- **Flotte** : `CT-001`…`CT-015` — SCHACMAN F3000 6×4 + Renault Kerax. Plaques en suffixe `TCB`.
- **Sites** : Atelier Betainomby (par défaut pour ce module) · autres possibles si OT externe.
- **Matricule méca** : `PL-MEC-007` (session).
- **Codes OT atelier** : `OT-A-2026-####` — À CONFIRMER avec LOI (cohérent avec INSP-2026 · EVT-2026 · ACT-2026).

---

## 6 · Architecture du module

```
app/mobile/atelier-meca/
├── layout.tsx                  # Shell mobile + theme provider
├── page.tsx                    # VUE 1 · Liste « Mes interventions »
├── [jobId]/
│   └── page.tsx                # VUE 2 · Détail intervention (accordéon)
├── tokens.css                  # Variables D82 locales (peut être global)
├── _types.ts                   # MaintenanceJob, JobStatus, EventType…
├── _data.ts                    # Stubs avant branchement master dataset
├── _state.tsx                  # useAccordionState, useConfirmSheet
└── _components/
    ├── Shell.tsx               # StatusBar · AppBar · MecChip · TruckChip
    ├── JobCard.tsx             # Carte OT (liste)
    ├── JobHeader.tsx           # Header véhicule (détail)
    ├── StatusBadge.tsx         # Pastille couleur+forme+libellé
    ├── Accordion.tsx           # Bloc accordéon générique
    ├── InspectionSection.tsx   # Checklist 4 états
    ├── DiagnosticSection.tsx   # Système → DTC → sévérité → vocal + texte
    ├── PartsSection.tsx        # Liste + stepper + scan
    ├── HandoffSection.tsx      # Renvoi /mobile/pneu et /mobile/fuel
    ├── PhotosSection.tsx       # Grille preuves
    ├── NotesSection.tsx        # Texte libre
    ├── ActionBar.tsx           # Bloquer (orange) + Terminer (teal)
    ├── ConfirmSheet.tsx        # Bottom-sheet confirmation
    ├── EmptyState.tsx          # « Aucune intervention »
    └── SuccessState.tsx        # « Intervention terminée »
```

---

## 7 · VUE 1 · Mes interventions (`page.tsx`)

**Route** : `/mobile/atelier-meca`

### Layout (top → bottom)

1. **Status bar** navy · `07:42` mono + `HORS LIGNE` chip orange (si offline) + icônes wifi/batterie.
2. **App bar** navy 56px : back chevron (désactivé sur la liste) · crumb « LOI · Atelier Méca » · titre `Mes interventions` (22px / 800) · chip Mécanicien `PL-MEC-007` mono.
3. **Bandeau atelier** : icône pin trait fin + « Atelier Betainomby · 25 mai 2026 » (mono pour la date).
4. **3 compteurs** (cards 1.5px border) : En cours · En attente · Bloqué — chiffres 24px mono colorés (teal · orange · orange) avec forme à côté (rond · triangle · carré).
5. **Section label** « Mes interventions » + `${total} OT` à droite (mono).
6. **Liste de `<JobCard>`** scrollables.

### Carte OT (`JobCard`)

- Border 1.5px ; teal si « En cours », orange si « Bloqué », `--cockpit-line` sinon.
- Si « En cours » : barre teal 3px en haut + shadow teal 18px.
- Si « Terminé » : opacity 0.78.
- **Row 1** : code OT mono 13px/700 · `<StatusBadge>` à droite.
- **Row 2** : avatar truck 44px (icône ligne) · `CT-007 · 4271 TCB` mono 20px/700 + `SCHACMAN F3000 6X4` 11px/600 caps · à droite « Durée est. » 9px caps + `02:30` mono 22px/700.
- **Row 3** : description 15px/700 — « Remplacement plaquettes frein AR ».
- **Row 4** : source mono 11px (`INSP-2026-0518 · ACT-2026-0142`) · si bloqué, ajouter motif orange.

### États

- **Vide** : icône wrench 88px + titre 22px « Aucune intervention » + sous-texte + bouton « Rafraîchir » + bandeau « Synchronisé · file vide » en bas.
- **Succès** (après Terminer) : route séparée ou modal pleine page — voir §10.

---

## 8 · VUE 2 · Détail intervention (`[jobId]/page.tsx`)

**Route** : `/mobile/atelier-meca/[jobId]`

### Layout

1. **App bar** navy 56px : **back chevron actif** · crumb `OT-A-2026-0142` mono · titre `Intervention` 22px/800 · chip Véhicule teal `CT-007` mono.
2. **`<JobHeader>`** : avatar truck 52px · `CT-007 · 4271 TCB` mono 22px + model 11px caps · `<StatusBadge>` à droite. Sous : description 16px/700 + ligne meta (code OT · source · durée mono).
3. **Section label** « Sections de l'intervention · 7 sections » (ou « 1 ouverte »).
4. **7 `<Accordion>`** en colonne, gap 8px. Une seule ouverte à la fois (`useAccordionState`).
5. **`<ActionBar>` fixe en bas** : `Bloquer` (orange, flex 0 42%) + `Terminer` (teal, flex 1).

### Accordéon (`Accordion`)

- Tête 64px · padding `12 14` · gap 12 :
  - Icône (40px box, teal-fill si open) · titre 17px/800 · summary 12px text3 · count badge mono 16px (couleur selon `countTone`) · chevron rotatif.
- Ouverte : border-color teal · shadow 8/24 dark ou 6/18 light · header background teal-10%.

### Sections

| ID | Titre | Count | Tone | Notes |
|---|---|---|---|---|
| `inspection` | Inspection | `${ok+al+cr}/${total}` ex `4/6` | `red` si critiques | 4 états (OK/Alerte/Critique/Non vérifié) — couleur+forme |
| `diagnostic` | Diagnostic | `OK` / `REC` / `—` | `teal` / `red` / `orange` | Système → pièce → DTC → sévérité → vocal + texte. **3 états** (vide / recording / rich) |
| `pieces` | Pièces utilisées | `${count}` mono | `teal` | Liste avec stepper + scan |
| `pneus` | Pneus | `—` | `neutral` | **Renvoi `/mobile/pneu`** · jamais re-dessiné. Badge « Module dédié ». |
| `carburant` | Carburant / Système | `—` | `neutral` | **Renvoi `/mobile/fuel`** · idem. |
| `photos` | Photos | `${count}` mono | `teal` | Grille 3 col · « + Photo » dashed teal |
| `notes` | Notes | `${count}` mono | `teal` | Texte libre |

---

## 9 · Section Diagnostic · structuré (focus)

C'est la section la plus riche — **garde sa structure exacte** (cf. `_components/DiagnosticSection.tsx`).

### Champs

1. **Système touché** — chips radio (1 seul actif). Liste fermée : `Freinage · Moteur · Transmission · Suspension · Électrique · Carrosserie`. Chip actif = border teal + check.
2. **Pièce / sous-système** — field row (label 9px caps · valeur 14px) · clic ouvre une liste filtrée (ou saisie courte). Placeholder en italique italic + dashed border si vide.
3. **Code défaut (DTC)** — field row mono · accepte OBD-II (`C0040`, `P0301`…) + label libre. Bouton scanner si OBD-II disponible (À CONFIRMER avec LOI — pas tous les SCHACMAN ont OBD-II accessible).
4. **Sévérité** — 3 boutons côte-à-côte 54px : Mineure (rond teal) · Majeure (triangle orange) · Critique (carré rouge). Couleur + forme + libellé.
5. **Note vocale** — voir §9.bis.
6. **Texte court** — textarea 64px min, placeholder italique si vide.

### 9.bis · Note vocale · 3 états

| État | Visuel |
|---|---|
| `idle` (rien) | Card border dashed · bouton mic rouge 56px + halo · texte « Tape pour parler · 60s max » |
| `recording` | Card border rouge solid + redSoft bg · bouton stop rouge 56px avec halo pulsant · label rouge clignotant « ● Enregistrement » · chrono `00:08` mono 18px · waveform live (≈11 barres rouges actives, reste muet) |
| `done` | Card border solid · bouton play teal 48px · chrono `00:32` mono 14px · waveform full teal (18 actives sur 25) · bouton « Ré-enr. » outline |

### Summary affiché dans la tête d'accordéon

```
empty     → 'À renseigner · système → pièce → DTC' · count '—' · tone orange
recording → 'Enregistrement en cours · 00:08'        · count 'REC' · tone red
rich      → 'Freinage · Majeure · DTC C0040 · vocal 00:32' · count 'OK' · tone teal
```

---

## 10 · Bottom sheets · Bloquer / Terminer

Ouvre depuis l'ActionBar. Backdrop `rgba(6,12,22,0.62)` + blur 2px. Sheet : top-radius 22px · border-top 4px accent · shadow `0 -22px 60px rgba(0,0,0,0.45)`.

### Sheet « Bloquer » (accent `#C77E2A`)

- Header : icône cercle barré orange 44px · tag caps « Confirmer le blocage » · titre « Bloquer l'intervention ? »
- Lead : « Le véhicule reste en file atelier. Indique au chef d'atelier ce qui te bloque — il pourra commander la pièce ou réassigner. »
- Récap (4 lignes) : OT · Véhicule · Motif (liste fermée — À CONFIRMER) · Référence pièce mono.
- Bandeau orange : « Le chef d'atelier reçoit une notification immédiate. »
- Boutons : Annuler outline · **Bloquer** orange 60px.

### Sheet « Terminer » (accent `#1A8E7E`)

- Header : icône check teal 44px · tag « Confirmer la clôture » · titre « Terminer l'intervention ? »
- Lead : « Vérifie le récap avant clôture · l'OT passe en « Terminé » et le véhicule sort de la file atelier. »
- Récap (6 lignes) : OT · Véhicule · Inspection X/Y · Pièces nb · Photos nb · Durée réelle mono.
- Boutons : Annuler outline · **Terminer** teal 60px.

### Écran succès (après Terminer)

Plein écran (peut être route `[jobId]/done` ou state local) :

- Avatar check vert 112px · shadow `0 14px 36px rgba(45,134,89,0.40)`.
- Label caps « Succès » + titre « Intervention terminée » 26px/800.
- Récap card (4 lignes mono) : OT · Véhicule · Clôturé à (`08:14 · PL-MEC-007`) · **Durée réelle** (vert · 16px mono).
- Bouton primaire « Retour à la liste » teal 64px.

---

## 11 · Si tu pars du codebase v0 `mechanic-field-app`

Sa structure (`lib/store.ts` event-store + `lib/types.ts` `MaintenanceJob` + sections par modal full-screen) **est solide à reprendre**, mais il y a des violations LOI à corriger **avant** intégration :

| Violation v0 | Correction LOI |
|---|---|
| `Volvo FH16` · `Mercedes Sprinter` · `Scania R500` · `Toyota 8FBE18` | **INTERDIT**. Master dataset = SCHACMAN F3000 6×4 + Renault Kerax uniquement. |
| Plaques `LOI-4521` · `LOI-3298`… | **INTERDIT**. Format réel : suffixe `…TCB` (ex `4271 TCB`). |
| Noms méca codés en dur : `Carlos Rodriguez` · `Ahmed Hassan` · `Maria Santos` | **INTERDIT**. Pas de noms — uniquement matricule `PL-MEC-XXX`. Pas de sélecteur de profils fictifs au login. |
| Codes job `job-001` · `mech-001` · `veh-001` | À renommer : OT `OT-A-2026-####` · méca `PL-MEC-###` · véhicule `CT-###`. |
| `EventType` en anglais (`maintenance_job_assigned`…) | Renommer en FR : `job_assigne` · `diagnostic_ajoute` · `piece_consommee` · `bloque` · `termine`… |
| Aucune notion de site / atelier | Câbler `Atelier Betainomby` par défaut + autres sites du master dataset si OT externe. |
| Sections par **full-screen modal** | Brief LOI exige **accordéon** (jamais long scroll). On garde l'accordéon. La modale reste OK comme fallback si tap-target trop serré sur certains items (ex : sélection système diagnostic). |
| `Cockpit` / dashboard chef d'atelier | **Hors-brief mobile méca**. Ne pas redessiner tant que LOI n'a pas confirmé le périmètre cockpit web. |

À l'inverse, **garder** :
- `MaintenanceJob` interface (renommer en `Intervention`).
- `createEvent()` + listeners pattern → bon socle pour audit + sync offline.
- `getDefaultInspectionChecklist()` — mais réécrire les items pour SCHACMAN / Kerax (freins tambour, soufflets cardan, etc.) — **À CONFIRMER avec LOI**.

---

## 12 · Types métier — `_types.ts`

```ts
export type JobStatus = 'cours' | 'attente' | 'bloque' | 'termine';
export type Severity  = 'mineure' | 'majeure' | 'critique';
export type InspectionStatus = 'ok' | 'alerte' | 'critique' | 'nonverif';

export type VehicleCode = `CT-${string}`;
export type VehicleModel = 'SCHACMAN F3000 6X4' | 'RENAULT KERAX';

export type SiteName =
  | 'Atelier Betainomby'
  | 'Port Toamasina · PDP' | 'Port Toamasina · MOCCO' | 'Port Toamasina · C4'
  | 'Moramanga · relais' | 'APC Andriamena · RN44' | 'COLAS · Ivondro';

export type MechSystem = 'Freinage' | 'Moteur' | 'Transmission' | 'Suspension' | 'Électrique' | 'Carrosserie';

export interface Vehicle {
  code: VehicleCode;             // 'CT-007'
  plate: string;                 // '4271 TCB' — format À CONFIRMER LOI
  model: VehicleModel;
  homeSite: SiteName;
}

export interface InspectionItem {
  id: string;
  group: 'Vehicule' | 'Charge' | 'Site' | 'Documents';
  label: string;                 // ex 'Plaquette frein arrière · état'
  status: InspectionStatus;
}

export interface Diagnostic {
  system?: MechSystem;
  subSystem?: string;            // 'Plaquettes & disque AR'
  dtc?: string;                  // 'C0040'  — OBD-II ou code interne
  severity?: Severity;
  voiceNoteBlobId?: string;
  voiceDurationSec?: number;
  text?: string;
}

export interface PartUsage {
  ref: string;                   // 'BRK-PLQ-AR-SCH' — catalogue magasin Betainomby À CONFIRMER
  label: string;
  qty: number;
  unit: 'pc' | 'jeu' | 'L' | 'kg';
  consumedAt: string;            // ISO
}

export interface Photo {
  blobId: string;
  label: string;                 // 'Plaquette AR · côté int.'
  capturedAt: string;            // ISO
  gps?: { lat: number; lng: number };
}

export interface JobNote {
  id: string;
  content: string;
  createdAt: string;
  isBlocker: boolean;
}

export type BlockMotif =
  | 'piece_manquante'
  | 'outillage_indispo'
  | 'securite'
  | 'attente_validation'
  | 'autre';                     // liste À CONFIRMER avec LOI

export interface BlockedState {
  motif: BlockMotif;
  partRef?: string;              // si piece_manquante
  freeText?: string;
}

export interface Intervention {
  id: string;                    // 'OT-A-2026-0142'  — format À CONFIRMER
  vehicle: Vehicle;
  label: string;                 // 'Remplacement plaquettes frein AR'
  source: string;                // 'INSP-2026-0518 · ACT-2026-0142'
  site: SiteName;                // 'Atelier Betainomby' default
  estimatedDurationMin: number;  // 150  → affiché '02:30'
  actualDurationMin?: number;

  status: JobStatus;
  assignedMechanic: string;      // 'PL-MEC-007'
  createdAt: string;             // ISO
  startedAt?: string;
  completedAt?: string;
  blocked?: BlockedState;

  inspection: InspectionItem[];
  diagnostic: Diagnostic;
  parts: PartUsage[];
  photos: Photo[];
  notes: JobNote[];

  // Renvois — pas de structure interne. On stocke juste les events sortants.
  tireHandoffEventIds: string[];   // EVT-2026-####  retournés par /mobile/pneu
  fuelHandoffEventIds: string[];   // EVT-2026-####  retournés par /mobile/fuel
}

export type EventType =
  | 'job_assigne'        | 'job_demarre'       | 'job_bloque'      | 'job_termine'
  | 'inspection_validee' | 'inspection_item_change'
  | 'diagnostic_systeme' | 'diagnostic_dtc'    | 'diagnostic_severite'
  | 'diagnostic_vocal'   | 'diagnostic_texte'
  | 'piece_consommee'    | 'photo_jointe'      | 'note_ajoutee'
  | 'pneu_renvoi_ouvert' | 'fuel_renvoi_ouvert';

export interface InterventionEvent {
  id: string;
  type: EventType;
  jobId: Intervention['id'];
  mechanic: string;       // 'PL-MEC-007'
  vehicleCode: VehicleCode;
  occurredAt: string;     // ISO
  payload: Record<string, unknown>;
  syncedAt?: string;
}
```

---

## 13 · Routing & navigation

| De → Vers | Mécanisme |
|---|---|
| Liste → Détail | `router.push('/mobile/atelier-meca/' + job.id)` |
| Détail → Liste | `router.push('/mobile/atelier-meca')` (chevron arrière) |
| Détail → `/mobile/pneu` | `router.push('/mobile/pneu?ot=' + job.id + '&veh=' + job.vehicle.code)` — **deep-link contextuel À CONFIRMER** |
| Détail → `/mobile/fuel` | idem |
| `/mobile/pneu` → retour Détail | au submit, le module pneu écrit un `tire_handoff_event` rattaché à `job.id`, le détail le détecte au remount (revalidate). |
| Détail → Succès | route `/mobile/atelier-meca/[jobId]/done` OU state local (au choix selon pattern repo). |

---

## 14 · État local — `_state.tsx`

```ts
'use client';
import { useState, useCallback } from 'react';

export type AccordionId =
  | 'inspection' | 'diagnostic' | 'pieces'
  | 'pneus' | 'carburant' | 'photos' | 'notes';

export function useAccordionState() {
  const [open, setOpen] = useState<AccordionId | null>(null);
  const toggle = useCallback(
    (id: AccordionId) => setOpen((cur) => (cur === id ? null : id)),
    [],
  );
  return { open, toggle, close: () => setOpen(null) };
}

export type SheetKind = 'bloquer' | 'terminer' | null;

export function useConfirmSheet() {
  const [sheet, setSheet] = useState<SheetKind>(null);
  return {
    sheet,
    openBloquer: () => setSheet('bloquer'),
    openTerminer: () => setSheet('terminer'),
    close: () => setSheet(null),
  };
}
```

---

## 15 · Comportements terrain

- **Saisie minimale** : 6/7 sections n'ont pas de champ texte libre par défaut (steppers / chips / scan / mic).
- **Une main, gants gras** : aucune cible &lt;44 px. Tête d'accordéon 64, Bloquer/Terminer 60, mic enregistrement 56.
- **Offline-first** : chaque event est créé localement, queue par `lib/loi-master-dataset/queue` (cf. autres modules), sync silencieuse au retour réseau. Bandeau « HORS LIGNE » orange dans status bar.
- **3-5 taps pour clôturer** : Liste → Carte → Terminer → Confirmer → Succès. **4 taps** end-to-end.
- **Confirmation obligatoire** avant Bloquer **et** Terminer (bottom sheet).
- **Pas d'icône emoji nulle part**. SVG line uniquement, stroke 1.8.
- **Status = couleur + forme + libellé** partout (jamais couleur seule — WCAG AA + soleil).

---

## 16 · Fichiers prototype HTML — `reference_html/`

Lit-les dans cet ordre pour comprendre la composition :

1. `atelier-shell.jsx` — tokens D82, themes dark/light, StatusBar, AppBar, MecChip, TruckChip, ActionBar, MPhone.
2. `atelier-screens-list.jsx` — VUE 1 (liste · empty · success) + atomes (StatusBadge, Icon set ligne).
3. `atelier-screens-detail.jsx` — VUE 2 (accordéon · 7 sections · 3 états de Diagnostic · ConfirmSheet bloquer/terminer).
4. `atelier-app.jsx` — composition du canvas (regroupe les sections en artboards par scénario) + notes de conception.
5. `Atelier Méca.html` — entry point (charge les 4 fichiers ci-dessus dans l'ordre).

Pour les ouvrir en local, sers le dossier `reference_html/` derrière n'importe quel `static-server` (les scripts Babel inline ne tournent pas via `file://`).

---

## 17 · Points À CONFIRMER avec LOI avant intégration

Ces zones n'ont aucune donnée inventée — elles ont besoin d'une décision produit :

1. **Format `OT-A-2026-####`** : confirmer le préfixe (`OT-A` ou autre) et la stratégie de numérotation (local + reconciliation serveur).
2. **PIN universel** : longueur, durée de session, biométrie.
3. **Catalogue pièces magasin Betainomby** : format réel des `partNumber` (`BRK-PLQ-AR-SCH` est illustratif).
4. **Code défaut DTC** : SCHACMAN expose-t-il OBD-II ? Code interne à la place ? Pas de scan si pas disponible.
5. **Liste fermée des motifs Bloquer** : `piece_manquante / outillage_indispo / securite / attente_validation / autre` proposé.
6. **Liste exacte items d'inspection** par type d'intervention (freinage, distribution, hydraulique…).
7. **Cascade Bloquer** : qui est notifié ? Chef d'atelier seul, ou cascade magasin ?
8. **Deep-link OT vers `/mobile/pneu`** : le module pneu reçoit-il `?ot=OT-A-2026-0142` ou démarre-t-il vierge ? Au retour, marque-t-il la section comme « Pointage pneu fait — voir EVT-2026-#### » ?
9. **Délai d'inactivité** auto-sortie de session (sécurité atelier).
10. **Format plaque** : `4271 TCB` (avec espace) ou `4271TCB` ? Master dataset fait foi.

---

## 18 · Comment intégrer dans le repo `loi-cockpit`

```bash
# 1. Coller le scaffold dans le repo
cp -R design_handoff_atelier_meca/scaffold/app/mobile/atelier-meca \
      loi-cockpit/app/mobile/atelier-meca

# 2. Ajouter les tokens D82 (si pas déjà fait par un autre module)
cat design_handoff_atelier_meca/scaffold/app/mobile/atelier-meca/tokens.css \
    >> loi-cockpit/app/globals.css   # ou via un import scopé au layout

# 3. Lier au master dataset
#    Remplace les imports de '_data.ts' par '@/lib/loi-master-dataset'
#    Tous les TODO write-path sont marqués `// TODO write-path` dans le scaffold.

# 4. Lancer
pnpm dev
# → http://localhost:3000/mobile/atelier-meca
```

Tant que `MOBILE_WRITES_LIVE=false` dans `.env.local`, toutes les actions (Démarrer · Bloquer · Terminer · Ajouter pièce…) restent en mémoire et n'écrivent pas en base. Voir `lib/loi-master-dataset/queue` (pattern des autres modules N5).
