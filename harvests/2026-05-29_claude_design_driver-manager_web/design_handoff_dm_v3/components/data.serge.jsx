/* global React */
/* ============================================================
   data.serge.jsx — dataset mock cockpit Driver Manager (Serge)
   Décor RÉEL Premium Logistics · allow-list STRICT
   - Chauffeurs DRV-001..DRV-015  ·  Véhicules CT-001..CT-015
   - Clients : PENTA_OCEAN (CT-001..005) · SC_SERVICES (CT-006..015)
   - Matières : GRANITE · chrome · mica   ·   Routes : RN44 · IVONDRO · Moramanga
   - Aucune donnée hors allow-list (audit garde-fous brief §7).
   - Noms chauffeurs anonymisés (initiales masquées) pour le mock.
   asof · 29 mai 2026 · 06:10
   ============================================================ */

const MASK = ["R. A.", "J. M.", "T. R.", "H. N.", "F. V.", "S. R.", "L. P.",
              "B. A.", "M. T.", "D. R.", "N. H.", "E. S.", "G. R.", "P. M.", "V. F."];

/* ---- 15 chauffeurs · allocation déterministe DRV-00n → CT-00n ---- */
const DRIVERS = [
  { n: 1,  statut: "actif",   cat: "CE", permisExp: "12/03/2027", permisDays: 287, medExp: "04/11/2026", medDays: 159, score: 84, inc: 0, oneOnOne: "22/05/2026", oooDays: 7,  anc: 4 },
  { n: 2,  statut: "actif",   cat: "CE", permisExp: "08/12/2026", permisDays: 193, medExp: "15/01/2027", medDays: 231, score: 79, inc: 0, oneOnOne: "20/05/2026", oooDays: 9,  anc: 3 },
  { n: 3,  statut: "actif",   cat: "C",  permisExp: "30/06/2027", permisDays: 397, medExp: "22/09/2026", medDays: 116, score: 68, inc: 1, oneOnOne: "19/05/2026", oooDays: 10, anc: 2 },
  { n: 4,  statut: "actif",   cat: "CE", permisExp: "18/02/2027", permisDays: 265, medExp: "10/10/2026", medDays: 134, score: 72, inc: 0, oneOnOne: "21/04/2026", oooDays: 38, anc: 5 },
  { n: 5,  statut: "actif",   cat: "CE", permisExp: "18/07/2026", permisDays: 50,  medExp: "01/12/2026", medDays: 186, score: 81, inc: 0, oneOnOne: "26/05/2026", oooDays: 3,  anc: 6 },
  { n: 6,  statut: "actif",   cat: "CE", permisExp: "22/04/2027", permisDays: 328, medExp: "20/02/2027", medDays: 267, score: 88, inc: 0, oneOnOne: "27/05/2026", oooDays: 2,  anc: 7 },
  { n: 7,  statut: "actif",   cat: "C",  permisExp: "30/01/2027", permisDays: 246, medExp: "18/11/2026", medDays: 173, score: 76, inc: 0, oneOnOne: "23/05/2026", oooDays: 6,  anc: 3 },
  { n: 8,  statut: "maladie", cat: "CE", permisExp: "14/05/2027", permisDays: 350, medExp: "30/04/2026", medDays: -29, score: 70, inc: 0, oneOnOne: "18/05/2026", oooDays: 11, anc: 4 },
  { n: 9,  statut: "actif",   cat: "CE", permisExp: "08/03/2027", permisDays: 283, medExp: "22/12/2026", medDays: 207, score: 74, inc: 0, oneOnOne: "18/04/2026", oooDays: 41, anc: 2 },
  { n: 10, statut: "actif",   cat: "C",  permisExp: "11/07/2027", permisDays: 408, medExp: "05/03/2027", medDays: 280, score: 82, inc: 0, oneOnOne: "24/05/2026", oooDays: 5,  anc: 5 },
  { n: 11, statut: "conge",   cat: "CE", permisExp: "02/02/2027", permisDays: 249, medExp: "08/01/2027", medDays: 224, score: 80, inc: 0, oneOnOne: "15/05/2026", oooDays: 14, anc: 4 },
  { n: 12, statut: "actif",   cat: "CE", permisExp: "25/11/2026", permisDays: 180, medExp: "15/10/2026", medDays: 139, score: 65, inc: 1, oneOnOne: "17/05/2026", oooDays: 12, anc: 1 },
  { n: 13, statut: "actif",   cat: "C",  permisExp: "05/06/2027", permisDays: 372, medExp: "12/04/2027", medDays: 318, score: 83, inc: 0, oneOnOne: "25/05/2026", oooDays: 4,  anc: 6 },
  { n: 14, statut: "actif",   cat: "CE", permisExp: "09/04/2027", permisDays: 315, medExp: "19/12/2026", medDays: 204, score: 77, inc: 0, oneOnOne: "26/05/2026", oooDays: 3,  anc: 3 },
  { n: 15, statut: "actif",   cat: "CE", permisExp: "20/05/2027", permisDays: 356, medExp: "28/02/2027", medDays: 275, score: 86, inc: 0, oneOnOne: "27/05/2026", oooDays: 2,  anc: 5 },
].map((d) => {
  const id = `DRV-${String(d.n).padStart(3, "0")}`;
  const ct = `CT-${String(d.n).padStart(3, "0")}`;
  const client = d.n <= 5 ? "PENTA_OCEAN" : "SC_SERVICES";
  const matiere = d.n <= 5 ? "GRANITE" : (d.n % 3 === 0 ? "chrome" : (d.n % 3 === 1 ? "GRANITE" : "mica"));
  const route = d.n <= 5 ? "RN44 → APC Andriamena"
              : d.n % 2 === 0 ? "Moramanga → APC via RN44"
              : "IVONDRO → Port Toamasina";
  return {
    id, ct, client, matiere, route,
    name: MASK[d.n - 1],
    statut: d.statut, cat: d.cat,
    permisExp: d.permisExp, permisDays: d.permisDays,
    medExp: d.medExp, medDays: d.medDays,
    score: d.score, inc: d.inc,
    oneOnOne: d.oneOnOne, oooDays: d.oooDays, anc: d.anc,
    habilitations: ["Conduite 6X4 dump truck", "Chargement benne 20 m³",
                    d.cat === "CE" ? "Attelage semi" : "Transport vrac mining"],
    km: 142000 + d.n * 7300,
  };
});

/* ---- helper état doc ---- */
function docState(days) {        // jours avant échéance
  if (days === undefined || days === null) return "na";
  if (days < 0) return "err";
  if (days < 60) return "warn";
  return "ok";
}

const SERGE = {
  /* ---------------- PROFIL ---------------- */
  persona: "Serge",
  role: "Driver Manager · N4",
  department: "Transport",
  manager: "Joel · Resp Transport · N3",
  email: "serge@premiumlogistics.mg",
  asof: "29 mai 2026 · 06:10",
  niveau: "N4",

  /* ---------------- PILIERS (gauge 0-100) ---------------- */
  /* vert ≥75 · orange 60-74 · rouge <60 — P4 OPS dominant DM */
  pillars: [
    { id: "p1", code: "P1", label: "Exécution & discipline",   score: 81, target: 75, footer: "départs à l'heure · check-out" },
    { id: "p2", code: "P2", label: "Cash & rentabilité",       score: 72, target: 75, footer: "coût / voyage · marge climat" },
    { id: "p3", code: "P3", label: "Promesse & fidélité",      score: 76, target: 75, footer: "consignes dispatch respectées" },
    { id: "p4", code: "P4", label: "Fluidité & productivité",  score: 84, target: 75, footer: "utilisation flotte · capacité", dominant: true },
  ],

  composite: 78,
  compositePrev: 75,
  cascade: "Cascade D54 · W02 25 % + W07 20 % + W11 15 % + W15 10 % + W16 20 % + W21 10 % = 100 %",
  contribJoel: "contribution Joel · 25 %",

  /* ---------------- F1 · alignement SO (ownership 2 niveaux) ---------------- */
  soAlign: [
    { code: "SO·3", pillar: "P4", title: "Transport Health", contrib: "Disponibilité", actual: 84, goal: 85, unit: "%", owner: "Joel", deadline: "31 déc 2026", gap: true },
    { code: "SO·5", pillar: "P1", title: "Decision Discipline TER", contrib: "1-on-1 cadencés + M13 P0/P1", actual: 87, goal: 100, unit: "%", owner: "Kenny + Édienne", deadline: "30 sept 2026", gap: false },
  ],

  /* trajectoire SO·3 · jan→déc 2026 · position mai · cible 85 % au 31 déc */
  so3Traj: { points: [78, 80, 81, 82, 84, 84, 85, 86, 87, 88, 89, 90], nowIndex: 4, targetIndex: 11, target: 85 },

  /* B2 · cascade Joel D54 (4 lieutenants pondérés) */
  joelCascade: {
    score: 79,
    lieutenants: [
      { who: "Driver Manager · Serge", w: "25 %" },
      { who: "Maintenance Manager · MM", w: "25 %" },
      { who: "HSE Director · Mamy", w: "25 %" },
      { who: "Exploitation · Jimmy", w: "25 %" },
    ],
  },

  /* ---------------- BANNER SAISONNIER ---------------- */
  /* asof fin mai 2026 → Q2 · vigilance pluies RN44 */
  saison: {
    level: "warn",
    periode: "Q2 · saison des pluies",
    titre: "Vigilance pluies RN44",
    detail: "Réduction vitesse + escorte si poussière · route RN44 dégradée · pentes 8-12 % côte Toamasina humide.",
  },

  /* ---------------- 4 HERO CARDS (cascade D54) ---------------- */
  heroCards: [
    { label: "Score composite DM mensuel", value: "78", unit: "/100", target: "≥ 75",      trend: "+3 vs mois préc.", trendPos: true,  status: "ok",   so: "D54 · SO·3 + SO·5", spark: [73, 74, 72, 75, 76, 75, 78] },
    { label: "1-on-1 cadencés · mois",      value: "13", unit: "/15",  target: "100 %",     trend: "-2 vs cible",      trendPos: false, status: "warn", so: "SO·5",            spark: [15, 14, 15, 13, 14, 13, 13] },
    { label: "Incidents ouverts > 30 j",    value: "2",  unit: "",      target: "≤ 2",       trend: "= (limite)",       trendPos: null,  status: "warn", so: "SO·3 dispo",       spark: [3, 3, 2, 2, 3, 2, 2] },
    { label: "Capacité flotte aujourd'hui", value: "13", unit: "/15",  target: "≥ 13/15",   trend: "+1 vs hier",       trendPos: true,  status: "ok",   so: "SO·3 dispo",       spark: [12, 13, 12, 12, 13, 12, 13] },
  ],

  /* ---------------- RITUELS M03 ---------------- */
  rituels: {
    jour: {
      label: "Aujourd'hui", meta: "29 mai · vendredi",
      items: [
        { t: "Briefing départ chauffeurs", h: "05:00 – 06:00", done: true },
        { t: "Point dispatch matin",       h: "06:00 – 06:15", done: true },
        { t: "Check-out fin de poste",     h: "variable",      done: false },
      ],
    },
    semaine: {
      label: "Cette semaine", meta: "S22",
      items: [
        { t: "Brief équipe DM",                  h: "vendredi 16:00", done: false, due: "aujourd'hui" },
        { t: "Revue capacité dispatch",          h: "lundi 08:00",    done: true },
        { t: "Revue MTV incidents",              h: "mercredi 14:00", done: true },
      ],
    },
    mois: {
      label: "Ce mois", meta: "mai 2026",
      items: [
        { t: "1-on-1 chauffeurs",          h: "13/15 réalisés", done: false, late: true },
        { t: "Batch paie",                 h: "J-5 (dans 8 j)", done: false },
        { t: "Revue permis 60 j",          h: "DRV-005 · 50 j", done: false, late: true },
        { t: "Synthèse cascade D54 Joel",  h: "J-2",            done: false },
      ],
    },
  },

  /* ---------------- 5 WORKFLOWS P0 ---------------- */
  p0: [
    { id: "w16", n: 1, title: "Programmer 1-on-1 chauffeur", sub: "2 chauffeurs cadence dépassée · 35 j sans 1-on-1", wf: "W16", icon: "calendar-plus", sev: "warn",
      targets: ["DRV-004 · 38 j", "DRV-009 · 41 j"] },
    { id: "w0207", n: 2, title: "Capturer event MTV", sub: "Choisir « probleme » ou « urgent »", wf: "W02 · W07", icon: "alert-triangle", sev: "err",
      targets: ["MTV probleme", "MTV urgent"] },
    { id: "m03h1", n: 3, title: "Brief équipe hebdo", sub: "Vendredi 16:00 · 4 chauffeurs présents", wf: "M03 H1", icon: "users", sev: "accent",
      targets: ["DRV-006", "DRV-010", "DRV-013", "DRV-015"] },
    { id: "w11", n: 4, title: "Préparer batch paie", sub: "J-3 du cycle · 47 voyages clôturés", wf: "W11", icon: "wallet", sev: "accent",
      targets: ["47 voyages clôturés", "15 chauffeurs"] },
    { id: "esc", n: 5, title: "Escalader Joel · catégorisé", sub: "Capacité · Pattern · Tonnage · DDV cat 13", wf: "cascade D54", icon: "arrow-up-right", sev: "warn",
      targets: ["Capacité flotte", "Pattern récurrent", "Dépassement tonnage", "DDV catégorie 13"] },
  ],

  /* ---------------- HSE FLAGS (resolution_owner = driver_manager) ---------------- */
  hseFlags: [
    { ref: "HSE-2026-05-27-001", driver: "DRV-012", title: "Excès vitesse détecté · descente RN44 km 38", sev: "warn", age: "il y a 2 j" },
    { ref: "HSE-2026-05-25-004", driver: "DRV-003", title: "Presque-accident · croisement Moramanga · pluie", sev: "err",  age: "il y a 4 j" },
    { ref: "HSE-2026-05-22-009", driver: "DRV-008", title: "EPI incomplet relevé au départ · gants manquants", sev: "warn", age: "il y a 7 j" },
  ],

  /* ---------------- SCORES · 6 OBJECTIFS PACTE TER ---------------- */
  objectifs: [
    { obj: "1-on-1 sessions / trimestre",     cible: "45",                reel: "42",          ecart: "-3", ecartK: "warn", note: "4/5", plan: "Programmer 3 1-on-1 manquants S+1" },
    { obj: "Near-miss MTV 30 j",              cible: "≤ 5",               reel: "3",           ecart: "OK", ecartK: "ok",   note: "5/5", plan: "Continuer briefings sécurité" },
    { obj: "Safety events 30 j",              cible: "≤ 5 / 100 voyages", reel: "4 / 100",     ecart: "OK", ecartK: "ok",   note: "5/5", plan: "Maintenir" },
    { obj: "Permis valides",                  cible: "100 %",             reel: "100 %",       ecart: "OK", ecartK: "ok",   note: "5/5", plan: "Surveiller DRV-005 (échéance 50 j)" },
    { obj: "Visites médicales à jour",        cible: "100 %",             reel: "93 % (14/15)", ecart: "-1", ecartK: "warn", note: "4/5", plan: "Convoquer DRV-008" },
    { obj: "Turnover annuel",                 cible: "≤ 20 % (3/15)",     reel: "13 % (2/15)", ecart: "OK", ecartK: "ok",   note: "5/5", plan: "Continuer climat équipe" },
  ],

  /* ---------------- 23 KPIs cascade D54 par workflow ---------------- */
  kpiWorkflows: [
    { wf: "W02", w: "25 %", title: "Discipline départs & voyages", kpis: [
      { k: "Taux départs à l'heure",        v: "94 %", c: "≥ 92 %", e: "ok",   spark: [90,91,92,93,94,93,94] },
      { k: "Voyages clôturés propres",      v: "96 %", c: "≥ 95 %", e: "ok",   spark: [94,95,95,96,95,96,96] },
      { k: "Voyages annulés / fatigue",     v: "2",    c: "≤ 2",    e: "warn", spark: [3,2,3,2,2,2,2] },
      { k: "Tonnage moyen respecté",        v: "98 %", c: "≥ 97 %", e: "ok",   spark: [96,97,97,98,97,98,98] },
      { k: "Retards dispatch matin",        v: "5 %",  c: "≤ 5 %",  e: "warn", spark: [7,6,6,5,6,5,5] },
    ]},
    { wf: "W07", w: "20 %", title: "Sécurité & incidents MTV", kpis: [
      { k: "Near-miss déclarés 30 j",       v: "3",    c: "≤ 5",    e: "ok",   spark: [5,4,4,3,4,3,3] },
      { k: "Safety events / 100 voyages",   v: "4",    c: "≤ 5",    e: "ok",   spark: [6,5,5,4,5,4,4] },
      { k: "Incidents ouverts > 30 j",      v: "2",    c: "≤ 2",    e: "warn", spark: [3,3,2,2,3,2,2] },
      { k: "Délai clôture incident",        v: "9 j",  c: "≤ 10 j", e: "ok",   spark: [12,11,10,9,10,9,9] },
    ]},
    { wf: "W11", w: "15 %", title: "Paie & administration", kpis: [
      { k: "Batch paie dans les délais",    v: "100 %", c: "100 %",  e: "ok",   spark: [100,100,100,100,100,100,100] },
      { k: "Litiges paie ouverts",          v: "1",     c: "≤ 1",    e: "ok",   spark: [2,1,1,1,2,1,1] },
      { k: "Voyages clôturés / cycle",      v: "47",    c: "≥ 45",   e: "ok",   spark: [42,44,45,46,45,47,47] },
    ]},
    { wf: "W15", w: "10 %", title: "Conformité permis & médical", kpis: [
      { k: "Permis valides",                v: "100 %", c: "100 %",  e: "ok",   spark: [100,100,100,100,100,100,100] },
      { k: "Visites médicales à jour",      v: "93 %",  c: "100 %",  e: "warn", spark: [100,100,93,93,100,93,93] },
      { k: "Permis échéance < 60 j",        v: "1",     c: "0",      e: "warn", spark: [0,0,1,1,0,1,1] },
      { k: "Habilitations à jour",          v: "100 %", c: "100 %",  e: "ok",   spark: [100,100,100,100,100,100,100] },
    ]},
    { wf: "W16", w: "20 %", title: "Coaching & 1-on-1", kpis: [
      { k: "1-on-1 cadencés / mois",        v: "87 %", c: "100 %",  e: "warn", spark: [100,93,100,87,93,87,87] },
      { k: "Cadence dépassée > 35 j",       v: "2",    c: "0",      e: "warn", spark: [0,1,0,2,1,2,2] },
      { k: "Actions coaching ouvertes",     v: "5",    c: "≤ 6",    e: "ok",   spark: [7,6,6,5,6,5,5] },
      { k: "Plans sécurité actifs",         v: "2",    c: "—",      e: "ok",   spark: [1,2,2,2,2,2,2] },
      { k: "Climat équipe (auto-éval)",     v: "4,1",  c: "≥ 4,0",  e: "ok",   spark: [3.8,3.9,4.0,4.1,4.0,4.1,4.1] },
    ]},
    { wf: "W21", w: "10 %", title: "Onboarding / Offboarding", kpis: [
      { k: "Onboarding J+90 complétés",     v: "1/1",  c: "100 %",  e: "ok",   spark: [1,1,1,1,1,1,1] },
      { k: "Offboarding W21bis en cours",   v: "1",    c: "—",      e: "ok",   spark: [0,0,1,1,1,1,1] },
    ]},
  ],

  /* ---------------- SO·3 contribution ---------------- */
  so3: {
    title: "SO·3 · Transport Health",
    target: "75 / 18 / 85",
    drivers: [
      { k: "Utilisation flotte",        v: "84 %", c: "≥ 85 %", e: "warn" },
      { k: "Marge via climat",          v: "17 %", c: "≥ 18 %", e: "warn" },
      { k: "Dispo via permis/médical",  v: "93 %", c: "100 %",  e: "warn" },
    ],
  },

  /* ---------------- M13 CARNET ---------------- */
  m13Categories: [
    { id: "driver_1on1",     label: "1-on-1 chauffeur",   wf: "W16", color: "accent" },
    { id: "voyage",          label: "Voyage",             wf: "W02", color: "accent" },
    { id: "driver_payroll",  label: "Paie chauffeur",     wf: "W11", color: "ok" },
    { id: "safety_mtv",      label: "Sécurité MTV",       wf: "W07", color: "err" },
    { id: "permis_medical",  label: "Permis / médical",   wf: "W15", color: "warn" },
    { id: "capacity",        label: "Capacité flotte",    wf: "W02", color: "accent" },
    { id: "onboarding",      label: "Onboarding",         wf: "W21", color: "ok" },
    { id: "escalade",        label: "Escalade Joel",      wf: "D54", color: "warn" },
  ],

  m13: [
    { ts: "29/05 06:08", cat: "voyage",         driver: "DRV-006", note: "Départ confirmé · Moramanga → APC chrome 24 t", owner: "Serge", statut: "closed",      cadence: "M03 H1" },
    { ts: "29/05 05:52", cat: "safety_mtv",     driver: "DRV-012", note: "MTV probleme · excès vitesse descente RN44 km 38", owner: "Serge", statut: "open",        cadence: null },
    { ts: "28/05 17:20", cat: "permis_medical", driver: "DRV-008", note: "Visite médicale expirée · convocation émise", owner: "Édienne", statut: "in_progress", cadence: null },
    { ts: "28/05 14:05", cat: "escalade",       driver: "—",       note: "Escalade Joel · capacité 13/15 · pic granulats PENTA", owner: "Serge", statut: "in_progress", cadence: null },
    { ts: "28/05 09:30", cat: "driver_1on1",    driver: "DRV-013", note: "1-on-1 réalisé · plan sécurité reconduit", owner: "Serge", statut: "closed",      cadence: "M03 M1" },
    { ts: "27/05 16:40", cat: "driver_payroll", driver: "—",       note: "Pré-clôture batch paie · 47 voyages agrégés", owner: "Serge", statut: "in_progress", cadence: null },
    { ts: "27/05 11:15", cat: "safety_mtv",     driver: "DRV-003", note: "Presque-accident croisement Moramanga · pluie", owner: "Mamy", statut: "open",        cadence: null },
    { ts: "26/05 08:00", cat: "capacity",       driver: "—",       note: "DRV-011 en congé · réallocation CT-011 dispatch Jimmy", owner: "Serge", statut: "closed",      cadence: null },
    { ts: "25/05 15:10", cat: "driver_1on1",    driver: "DRV-009", note: "1-on-1 reprogrammé · cadence dépassée 41 j", owner: "Serge", statut: "open",        cadence: "M03 M1" },
    { ts: "24/05 07:45", cat: "onboarding",     driver: "DRV-015", note: "Onboarding J+90 clôturé · titularisation validée", owner: "Serge", statut: "closed",      cadence: null },
  ],

  /* ---------------- COUPLAGES WORKFLOWS ---------------- */
  couplages: [
    { trig: "voyage_annule · motif fatigue", arrow: "W16 1-on-1 < 24 h obligatoire", sev: "err" },
    { trig: "MTV urgent",                    arrow: "escalade Joel + flag HSE Mamy < 2 h", sev: "err" },
    { trig: "near-miss × 3 / chauffeur",     arrow: "plan sécurité W16 + revue Joel", sev: "warn" },
    { trig: "permis échéance < 60 j",        arrow: "convocation renouvellement + alerte RH Édienne", sev: "warn" },
    { trig: "visite médicale expirée",       arrow: "suspension dispatch + RH Édienne (RLS B17)", sev: "err" },
    { trig: "voyage clôturé propre",         arrow: "agrégation batch paie W11", sev: "ok" },
    { trig: "cadence 1-on-1 > 35 j",         arrow: "carte P0 W16 Vue d'ensemble", sev: "warn" },
    { trig: "alerte cyclone rouge",          arrow: "suspension dispatch + plan Madagascar", sev: "err" },
  ],

  /* ---------------- PROFIL SERGE · leadership ---------------- */
  leadership: [
    { axe: "Cadence des rituels",        score: 4 },
    { axe: "Écoute & coaching",          score: 4 },
    { axe: "Discipline sécurité",        score: 5 },
    { axe: "Décision sous pression",     score: 3 },
    { axe: "Délégation dispatch",        score: 3 },
    { axe: "Traçabilité M13",            score: 4 },
  ],

  oneOnOneEdienne: {
    cadence: "Trimestriel · Q1/Q2/Q3/Q4 fixe",
    agenda: "Audit Pacte TER équipe DM (15 chauffeurs) · turnover · climat",
    prochain: "12/06/2026 · 14:00",
    historique: [
      { d: "10/03/2026", note: "Turnover 13 % validé · plan rétention reconduit" },
      { d: "08/12/2025", note: "Climat équipe stable · 2 départs prévus Q1" },
      { d: "15/09/2025", note: "Pacte TER révisé · cibles 1-on-1 relevées à 45/T" },
      { d: "12/06/2025", note: "Onboarding 3 recrues mining validé" },
    ],
  },

  coaching: [
    { d: "26/05/2026", from: "Joel", note: "Cadrage capacité flotte · arbitrage pic granulats PENTA" },
    { d: "10/03/2026", from: "Édienne", note: "1-on-1 trimestriel · audit Pacte TER" },
    { d: "18/02/2026", from: "Joel", note: "Revue incidents MTV · plan sécurité DRV-003" },
  ],

  /* ---------------- CASCADE LINEAGE ---------------- */
  lineage: [
    { lvl: "CEO",  name: "Kenny",  role: "CEO",                   me: false },
    { lvl: "COO",  name: "Fabry",  role: "COO · supervision Joel", me: false },
    { lvl: "N3",   name: "Joel",   role: "Resp Transport · cascade D54 25 %", me: false },
    { lvl: "N4",   name: "Serge",  role: "Driver Manager (MOI)",  me: true },
    { lvl: "—",    name: "15 chauffeurs", role: "DRV-001 → DRV-015 · cumul W02+W07+W11+W15+W16", me: false, leaf: true },
  ],
};

SERGE.drivers = DRIVERS;
SERGE.docState = docState;

window.SERGE = SERGE;
window.docState = docState;
