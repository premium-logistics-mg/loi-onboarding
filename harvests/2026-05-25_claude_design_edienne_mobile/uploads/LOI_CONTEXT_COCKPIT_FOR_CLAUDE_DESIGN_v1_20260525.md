# LOI — Contexte cockpit web (à fournir à Claude Design)
*Pendant cette passe "premium / Visual-First", déposer ce fichier dans Claude Design en plus du contexte mobile. But : que les refontes d'onglets cockpit sortent on-brand D82 + Visual-First (chiffres/indicateurs, pas de blog), et codables directement par CC dans `loi-cockpit` (Next.js · Library V2).*

## 1 · Produit & cible
**LOI** = cockpit/ERP de pilotage de **Premium Logistics** (Madagascar). On refond ici les **cockpits web** (vues leaders : CEO, CFO, COO, Tudi, Joel, etc.) — pas le mobile terrain.
**Stack** : Next.js 14 App Router + TypeScript + Tailwind + shadcn + **Library V2** (`components/cockpit/library-v2`). Données depuis **`lib/loi-master-dataset/`** (jamais de chiffre inventé). Cible d'intégration : `app/cockpit/<persona>/`.

## 2 · Objectif de la passe (Visual-First · D89)
Transformer des onglets **text/blog-style** en **chiffres + indicateurs** :
- **Héros = chiffre** (gros, IBM Plex Mono), jamais une phrase.
- **0 bloc de texte > 15 mots en surface.** La prose (narratif M09, explications) passe en **tooltip / section repliable**.
- Above-the-fold = cartes/chiffres/jauges, pas de paragraphes.
- Indicateurs : jauges, bullet charts (réel vs cible), sparklines (tendance), chips de statut couleur+forme, mini-charts (waterfall, heatmap).
- **Mesurer le RENDU**, pas le code : un onglet ouvert montre ≤5 sections, Tier-2 replié par défaut.

## 3 · Design system D82 (STRICT · identique au mobile)
Couleurs : navy `#0B2540` · teal `#1A8E7E` (accent) · cream `#F5F1E8` · texte secondaire `#4A5568` · beige `#E8E2D6`. Statuts : vert `#2D8659` · orange `#C77E2A` · rouge `#B8421E`. Dark : fond `#080B14` · carte `#161A24` · bordure `#242835` · texte `#F0EEEB` · accent dark `#3EAA9B`.
**INTERDIT** : cyan, bleu vif, orange-comme-accent, violet, vert générique Tailwind. **Vert silencieux.**
Polices : **Inter** (texte) + **IBM Plex Mono** (chiffres · `tabular-nums`). Règle **3-5-7** (≤3 chiffres/section · ≤5 sections visibles · ≤7 actions). FR simple métier, zéro jargon anglais. Light + dark, WCAG AA.

## 4 · Benchmark & homogénéité
Le **cockpit CFO** est le **benchmark golden validé**. Tout onglet refondu se mesure contre lui (même squelette, seul le contenu change). Layout canonique : **sidebar gauche** (CockpitLayout) + **pillar bar haut** (4 piliers) + sections empilées. Pas de nav horizontale en doublon, pas de simulateur dupliqué (1 donnée = 1 domicile).

## 5 · Vocabulaire à produire (réutilisable · cascade)
Claude Design doit dessiner un **kit d'indicateurs premium** réutilisable, pas un one-off :
- **MetricCardHero** : gros chiffre mono + tendance (sparkline) + vs-cible (bullet/flèche) + label court.
- **PillarGauge** : jauge par pilier (P1-P4) pour la pillar bar.
- **TargetBullet** : réel vs cible (ex DSO 78j → 60j).
- **ConcentrationGauge** : part top client vs plafond (ex PENTA 28,5% vs ≤25%).
- **TrajectorySparkline** : trajectoire SO 12 mois + forecast.
- **CompositeScoreChip** : score lieutenant (couleur + forme).
+ **3 archétypes d'onglet** : *Scorecard* (KPIs+jauges) · *File de travail* (worklist actionnable) · *Drill* (détail + graphes).

## 6 · Piliers & SO réels (zéro invention)
**4 piliers (affichés)** : P1 **Exécution & discipline** · P2 **Cash & rentabilité** · P3 **Fidélité & diversification client** · P4 **Fluidité & productivité**.
**5 SO** : SO·1 Encaissement accéléré & dette réduite (P2) · SO·2 Cycle commande→facture maîtrisé (P4) · SO·3 Flotte productive & rentable 75/18/85 (P4) · SO·4 Portefeuille équilibré & diversifié (P3) · SO·5 Décisions tracées & clôturées (P1).

## 7 · KPIs canoniques réels (à utiliser tels quels · master dataset)
- Trésorerie : 6 banques + caisse · **BGFI découvert -1,97 Md MGA** · total disponible ~1,1 Md MGA.
- **DSO 78j → cible 60j** (SO·1). **PENTA-OCEAN 28,5%** concentration → cible **≤25%** (SO·4).
- **Transport 75/18/85** (utilisation % / marge % / dispo %) (SO·3). Effectifs ~60.
- Flotte 15 SCHACMAN F3000. **Claude Design : si un chiffre manque, écrire « À CONFIRMER », ne jamais inventer.** CC rebind sur `lib/loi-master-dataset`.

## 8 · Handoff CC
Sortir en **composants React/Tailwind autonomes** mappables sur Library V2 + tokens `--cockpit-*`. CC rebind les données sur le master dataset, préserve testids/fetchers/RBAC (refonte présentation seule). Gate : 0 cyan · 0 chiffre inventé · 0 bloc texte >15 mots en surface · dark+light.

---
*Si un design enfreint §3 (tokens), §2 (Visual-First) ou §7 (KPIs réels), il est hors-charte → corriger avant intégration.*
