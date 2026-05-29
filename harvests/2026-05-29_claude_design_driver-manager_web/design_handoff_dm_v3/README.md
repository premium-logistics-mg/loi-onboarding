# Cockpit Driver Manager (Serge) · Refonte v3 — harvest visual reference

**Cible** · harvest pour Claude Code (Next.js + Tailwind + shadcn/ui)
**Doctrine** · D90 (homogénéité cross-N4) · Design system **D82** strict
**asof mock** · 29 mai 2026 · cohérent cockpits Transit refondus 28 mai

---

## 1. Contenu du bundle

```
design_handoff_dm_v3/
├── DM_Cockpit_v3.html        ← mock interactif · 5 onglets navigables (ouvrir ici)
├── design-tokens.css         ← palette + typo D82 (var --pl-*, --cockpit-*, --fg-*, --accent…)
├── README.md                 ← ce fichier
└── components/
    ├── data.serge.jsx        ← dataset mock (15 chauffeurs · KPIs · M13 · docs · cascade)
    ├── Atoms.jsx             ← Btn · IconBtn · StatusChip · PillarChip · StatusDot ·
    │                            SectionRule · Sparkline · GaugeBar · Modal · Field/Input/Select · Collapsible
    ├── ChromeDM.jsx          ← SidebarDM · TopBarDM · PillarGaugeBar · CockpitTabsDM · FreshStrip
    ├── VueEnsembleDM.jsx     ← ONGLET 1 · 9 sections (composite · banner · 4 hero ·
    │                            rituels M03 · 5 P0 modales · HSE · footer Pacte TER)
    ├── FleetGridDM.jsx       ← Section 1.6 · tableau 15 chauffeurs (tri · sticky · zebra)
    ├── DriverProfile360.jsx  ← Section 1.7 · profil 360° · 7 onglets pills
    ├── ScoresDM.jsx          ← ONGLET 2 · composite détaillé · 6 objectifs TER · 23 KPIs · SO·3
    ├── CarnetDM.jsx          ← ONGLET 3 · M13 (filtres · liste · création · drawer · couplages)
    ├── DocumentationDM.jsx   ← ONGLET 4 · arbre docs chauffeur (statuts · confidentialité · lightbox)
    └── ProfilSerge.jsx       ← ONGLET 5 · identité · leadership · 1-on-1 Édienne · cascade lineage · RBAC
```

---

## 2. 5 onglets STRICT canoniques (Pattern 31 · D90)

`Vue d'ensemble · Scores · Carnet de bord · Documentation · Profil`

État partagé **cross-onglet** : un clic chauffeur dans la Fleet Grid (onglet 1)
présélectionne le même chauffeur dans Documentation (onglet 4). Lifté dans `App`
(`selectedId`) — à reproduire côté CC via store global / URL param `?driver=DRV-XXX`.

---

## 3. Décor RÉEL respecté (audit garde-fous §7)

- Chauffeurs **DRV-001 → DRV-015** uniquement (noms anonymisés en initiales · mock).
- Véhicules **CT-001 → CT-015** · allocation déterministe 1:1 · SCHACMAN F3000 6X4.
- Clients **PENTA_OCEAN** (CT-001..005) + **SC_SERVICES** (CT-006..015) — aucun autre.
- Matières **GRANITE · chrome · mica** · routes **RN44 · IVONDRO · Moramanga**.
- 0 client ban-list · 0 label interne proscrit · 0 push auto · 0 écran > 7 actions · 0 blind POST.

Chiffres cohérents : composite **78/100** vert · 1-on-1 **13/15** · incidents **2** · capacité **13/15**
· médical **93 %** (DRV-008 expirée) · permis **DRV-005** échéance 50 j · cadence dépassée **DRV-004/009**.

---

## 4. Design system D82

- Source de vérité tokens : `design-tokens.css` (1:1 repo `colors_and_type.css`).
  N'inventez pas de couleur — utilisez `var(--accent)`, `var(--ok|warn|err)`, `var(--fg-1..3)`.
- Palette stricte : navy / teal / cream / vert / orange / rouge. **0 cyan · 0 bleu · 0 violet · 0 gradient déco.**
- Typo : Inter (corps) + IBM Plex Mono (tous chiffres · codes · %), `tabular-nums`.
- Règle 3-5-7 · vert silencieux · 1 donnée = 1 domicile · hiérarchie hero = chiffre.

**Note émojis** · le brief listait 7 émojis pour les pills du Profil 360°.
D82 interdit l'émoji UI → remplacés par des **icônes Lucide ligne** (user · bar-chart-2 ·
alert-triangle · heart-handshake · notebook-pen · shield · handshake). Substitution
flaggée — basculer sur émoji si Kenny tranche dans l'autre sens.

---

## 5. Interactions implémentées (mock)

- Navigation 5 onglets · bascule thème dark/light · tri colonnes Fleet Grid.
- 5 cartes P0 → **modales formulaire** (Pattern 9 anti-blind-POST) avec confirmation « tracé M13 ».
- Banner saisonnier → modale « conditions du jour » (3 états Q1-Q2 / Q3 / Q4 supportés via `data.serge.jsx`).
- Profil 360° 7 onglets · Fleet Grid → scroll + ouverture profil.
- Carnet : filtres statut/catégorie/chauffeur · drawer détail · modale création.
- Documentation : arbre collapsible · statuts couleur · lightbox métadonnées.
- Profil : bascules leadership ajustables · cascade lineage · segments paramètres.

---

## 6. Question préalable

**[À VALIDER Kenny]** Onglet **Documentation** = nouveauté vs cockpit DM actuel.
Confirmer qu'il remplace bien l'ancien onglet « Assistant » dans la nav 5-STRICT
des cockpits N4 (cohérence Mohamed/Ando) — ou si l'Assistant doit rester ailleurs.

*Mock produit par Claude Design · 29 mai 2026 · doctrine D90 cohérence cross-N4 LOI.*
