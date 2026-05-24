# LOI Onboarding Harvest — `trucks.conso@premiumlogistics.mg` and v0 Pneus/Carburant Dashboard

Date: 2026-05-24  
Scope: onboarding harvest only; no merge into `loi-cockpit`; no PR; no RBAC mutation executed.

## 1. Executive position

[FAIT] Kenny requested that `trucks.conso@premiumlogistics.mg` be prepared as a new LOI persona candidate linked to the v0 dashboard named **dashboard pneus carburant**. [FAIT] Kenny also specified that this persona is under the **Maintenance Manager** team and is one of the Maintenance Manager’s lieutenants. [FAIT] The current LOI canonical persona registry previously inspected contains `meca-001` as the Maintenance Manager / Sup Méca persona, so the clean candidate reporting line is **`managerId = meca-001`**.

[FAIT] This document is a **harvest note** for `loi-onboarding`, not a code integration plan for `loi-cockpit`. [FAIT] Adding a new official persona affects identity, routing, access, audit, and possibly RBAC; therefore it must not be silently inserted into the runtime registry without explicit approval.

[HYPOTHÈSE] The cleanest candidate persona ID is **`trucks-conso-001`**, not `trucks.conso`, because existing LOI `PersonaId` values use lowercase kebab-style identifiers such as `meca-001`, `hse-001`, `transport-001`, and `chauffeurs-001`. [À CONFIRMER] Kenny or CC must confirm the final display name, exact job title, access level, and whether the persona can see only tyres/fuel or also maintenance cost, driver behavior, and fleet intervention data.

| Field | Proposed value | Tag |
|---|---|---|
| Email | `trucks.conso@premiumlogistics.mg` | [FAIT] requested by Kenny |
| Candidate Persona ID | `trucks-conso-001` | [HYPOTHÈSE] naming aligned to current LOI style |
| Display Name | Trucks Conso | [À CONFIRMER] human name not provided |
| Functional Role | Pointeur / analyste consommation pneus & carburant | [HYPOTHÈSE] inferred from dashboard scope |
| Department | Transport / Maintenance | [HYPOTHÈSE] under Maintenance Manager team |
| Level | N5 | [HYPOTHÈSE] lieutenant under `meca-001` N4 |
| Manager ID | `meca-001` | [FAIT] requested hierarchy points to Maintenance Manager |
| Main Pillar | P4, Transport Discipline & Asset Health | [HYPOTHÈSE] tyres/fuel primarily concern fleet health and operational discipline |
| Initial status | Onboarding candidate only | [FAIT] no runtime mutation executed |

## 2. What the attached v0 export contains

[FAIT] The attached ZIP was extracted and inspected as a standalone v0/Next prototype. [FAIT] Its package manifest identifies a self-contained Next/React project with a generic project name and shadcn/Radix UI-style dependencies. [FAIT] It is therefore not an LOI-native module yet.

[FAIT] The dashboard includes two operational surfaces: **Suivi Consommation Carburant** and **Suivi Usure Pneus**. [FAIT] The fuel table calculates L/100km, variance versus a target barème, monthly cost, potential savings, and severity states. [FAIT] The tyre table calculates thickness consumption, remaining kilometres, critical/alert/watch status, and intervention actions.

[FAIT] The browser URL could not be inspected as a public dashboard because it redirected to v0/Vercel sign-in. [FAIT] The ZIP export is therefore the usable source of truth for the harvest.

| Module | Observed concepts | Onboarding value |
|---|---|---|
| Fuel tracking | L/100km, variance vs target, fuel cost, potential savings, comments, actions | Strong candidate for `trucks.conso` daily control panel |
| Tyre wear tracking | Thickness, mm/1000 km, remaining kilometres, status thresholds, comments, actions | Strong candidate for tyre inspection and intervention workflow |
| Fuel detail table | Date, station, vehicle, litres, voyage, trajet, BC | Useful event grain for future Postgres staging |
| Recent tyre events | éclaté and permutation history | Useful supporting timeline for maintenance traceability |
| Stock by site | tyre stock aggregation by site and brand | Useful for inventory visibility, but secondary to persona MVP |
| Brand comparison | tyre lifetime and cost/km by brand | Useful later for purchasing and asset strategy |

## 3. Prototype limitations that CC must not ignore

[FAIT] The v0 prototype presents “En direct” indicators, but the inspected components keep interaction state locally in React and use pseudo-refresh behavior. [FAIT] The comments and action triggers are not yet connected to a durable event store. [FAIT] The dashboard contains static or prototype data structures rather than a verified LOI Postgres pipeline.

[FAIT] The action menus are valuable as workflow vocabulary, but they are not yet LOI work-object transitions. [HYPOTHÈSE] The correct integration path is to harvest vocabulary and data grains first, then make CC create a real persona interface that writes auditable events.

| Area | Prototype behavior | Required LOI behavior before production |
|---|---|---|
| Identity | No confirmed LOI persona binding inside export | Resolve `trucks.conso@premiumlogistics.mg` to confirmed PersonaId |
| Comments | Local state in the UI | Persist comments as auditable event notes |
| Fuel actions | Menu callbacks such as `blocage_carte`, `audit_trajets`, `controle_mecanique` | Map to LOI intervention events and permissions |
| Tyre actions | Menu callbacks such as `demontage_immediat`, `recreusage`, `permutation_croisee` | Map to maintenance work objects and stock movements |
| Data | Static prototype dataset | Pull from staged Jan→24 May 2026 simulation dataset, then future live feeds |
| “Live” status | Visual indicator / timer refresh | Real ingestion status and timestamped source health |

## 4. Action vocabulary harvested for CC

[FAIT] The fuel action menu includes critical actions such as **convoquer chauffeur**, **bloquer carte carburant**, **audit trajets GPS**, and **contrôle mécanique urgent**. [FAIT] It also includes preventive or technical actions such as **formation éco-conduite**, **révision itinéraires**, **vérifier injecteurs**, **contrôle pression pneus**, **vérifier filtres air/carburant**, **relevé compteur**, **rapport consommation**, and **planifier entretien préventif**.

[FAIT] The tyre action menu includes **démontage immédiat**, **émettre bon de sortie**, **recreusage**, **planifier remplacement**, **permutation croisée AV/AR**, **inversion jumelé INT/EXT**, **graissage/lubrification**, **contrôle pression**, **équilibrage roue**, **vérifier parallélisme**, **nouveau pointage épaisseur**, and **inspection visuelle**.

[HYPOTHÈSE] CC should not implement these as arbitrary UI buttons only. [HYPOTHÈSE] They should become typed LOI events with actor, vehicle, tyre position or fuel event, reason code, severity, timestamp, and review status.

## 5. Recommended onboarding folder placement

[FAIT] The harvest should live in the separate repository/folder **`loi-onboarding`**, not in `loi-cockpit`. [FAIT] This keeps the prototype, documentation, and CC brief separate from runtime code.

Recommended folder:

```text
loi-onboarding/harvests/2026-05-24_v0_pneus_carburant_trucks_conso/
```

Recommended contents:

```text
README.md
TRUCKS_CONSO_PERSONA_AND_DASHBOARD_HARVEST_NOTE_20260524.md
POWERSHELL_EXPORT_NO_PR_NO_MERGE_20260524.ps1
raw/dashboard-pneus-carburant(2).zip
raw/export/...   # generated by the PowerShell script from the ZIP, not manually edited
```

## 6. 3-2-1 stress-test before making `trucks.conso` official

### 3 counter-arguments

[HYPOTHÈSE] First counter-argument: creating a dedicated persona may fragment the maintenance team interface if `meca-001` can already handle pneus/carburant work through filtered views.  
[HYPOTHÈSE] Second counter-argument: the dashboard combines fuel discipline, driver behavior, tyre inspection, maintenance, and inventory; one lieutenant may not have legitimate authority over all those decisions.  
[HYPOTHÈSE] Third counter-argument: if the prototype is adopted too literally, LOI may inherit static KPI logic and non-auditable UI actions instead of event-driven operations.

### 2 hidden risks

[HYPOTHÈSE] Hidden risk 1: `trucks.conso` may need access to sensitive driver/fuel-card data; this creates RBAC and accountability implications beyond a simple dashboard page.  
[HYPOTHÈSE] Hidden risk 2: tyre and fuel anomalies can trigger disciplinary or financial consequences; if actions are not logged as auditable events, LOI will create operational disputes rather than clarity.

### 1 alternative option

[HYPOTHÈSE] Alternative: keep `trucks.conso@premiumlogistics.mg` initially as an **email alias / trial user under `meca-001`**, with a filtered onboarding interface, and promote it to official persona only after the 5-sample falsification test and RBAC review.

## 7. Binary approvals required before CC creates the persona

| # | Question | Required answer before runtime mutation |
|---:|---|---|
| 1 | Should `trucks.conso@premiumlogistics.mg` become an official LOI persona, not only a trial alias? | YES/NO |
| 2 | Is the final persona ID approved as `trucks-conso-001`? | YES/NO |
| 3 | Is the manager confirmed as `meca-001`? | YES/NO |
| 4 | Is the access level limited to tyres/fuel/maintenance events only, excluding financial approvals and HR/disciplinary decisions? | YES/NO |
| 5 | Should all actions create auditable LOI events instead of local UI state? | YES/NO |
| 6 | Should the first interface be built in onboarding/trial mode before touching `loi-cockpit` production routes? | YES/NO |

## 8. Instruction for CC

[FAIT] CC should treat the v0 export as a **concept harvest**, not as production code. [HYPOTHÈSE] The first CC task should be: create the `trucks-conso-001` onboarding persona interface in the onboarding environment, using the harvested dashboard vocabulary, but backed by typed event structures and explicit simulation/live source labels.

[À CONFIRMER] Kenny must confirm the six binary approvals above before CC updates canonical persona registries, email mappings, RBAC, or any production LOI cockpit route.
