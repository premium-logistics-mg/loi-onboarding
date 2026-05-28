/* global window */

// Allow-list clients
window.CLIENTS = [
  "PENTA-OCEAN",
  "NS ENTREPRISE",
  "ANDIS MADAGASCAR",
  "M'LAY DISTRIBUTION",
  "SPAT",
  "MG-MINE",
  "KERRYSON",
  "YUE FENG",
  "AS DISTRIBUTION",
  "MV MARIA",
];

window.MODES = [
  { id: "A",   label: "Mode A · import direct" },
  { id: "B",   label: "Mode B · cession docs" },
  { id: "E",   label: "Mode E · export" },
  { id: "ATS", label: "ATS" },
  { id: "Air", label: "Air" },
  { id: "Vrac",label: "Vrac" },
];

window.OWNERS = ["Lalatiana", "Déclarante", "Mohamed BAD", "Ando", "Bernardin", "Facturation"];

// Étapes → couleurs
window.ETAPE_COLORS = {
  "Docs en attente":    { fg: "var(--warn)", bg: "var(--warn-soft)" },
  "Cotation émise":     { fg: "#5BB8C7",     bg: "color-mix(in srgb, #5BB8C7 14%, transparent)" }, // bleu-teal discret (allowed neutral, not bright cyan)
  "DAU brouillon":      { fg: "var(--accent)", bg: "var(--accent-soft)" },
  "DAU soumise":        { fg: "var(--accent)", bg: "var(--accent-soft)" },
  "Circuit Vert":       { fg: "var(--ok)",   bg: "var(--ok-soft)" },
  "Circuit Jaune":      { fg: "var(--warn)", bg: "var(--warn-soft)" },
  "Circuit Rouge":      { fg: "var(--err)",  bg: "var(--err-soft)" },
  "Liquidée DGD":       { fg: "var(--ok)",   bg: "color-mix(in srgb, var(--pl-green) 8%, transparent)" },
  "Facturée":           { fg: "var(--fg-3)", bg: "color-mix(in srgb, var(--fg-3) 10%, transparent)" },
};

// Action contextuelle par étape
window.ACTION_BY_ETAPE = {
  "Docs en attente":  "Compléter docs",
  "Cotation émise":   "Suivre",
  "DAU brouillon":    "Suivre",
  "DAU soumise":      "Suivre",
  "Circuit Vert":     "Suivre",
  "Circuit Jaune":    "Suivre",
  "Circuit Rouge":    "Escalader",
  "Liquidée DGD":     "Suivre",
  "Facturée":         null,
};

// Ordre de priorité pour tri (alertes/retards en premier)
window.ETAPE_PRIORITY = {
  "Circuit Rouge":   0,
  "Docs en attente": 1,
  "Circuit Jaune":   2,
  "Cotation émise":  3,
  "DAU brouillon":   4,
  "DAU soumise":     5,
  "Circuit Vert":    6,
  "Liquidée DGD":    7,
  "Facturée":        8,
};

window.SEED_DOSSIERS = [
  { ref: "FAI260015", client: "PENTA-OCEAN",       cargo: "Acier PDJV MV PACIFIC",     mode: "A", etape: "Docs en attente", owner: "Lalatiana",   age: "1h",   escalated: false, navire: "MV PACIFIC", docs: { bl: true,  fc: true,  pl: false, bsc: false }, cotation: null,    dauRef: null,     marge: null, type: "Import" },
  { ref: "FAI250030", client: "ANDIS MADAGASCAR",  cargo: "1 000 T riz",               mode: "A", etape: "Cotation émise",   owner: "Lalatiana",   age: "6h",   escalated: false, navire: "MV INDIAN STAR", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260112", dauRef: null, marge: 7.4, type: "Import" },
  { ref: "FAI250007", client: "NS ENTREPRISE",     cargo: "11 836 T ciment TAM124",    mode: "A", etape: "DAU brouillon",    owner: "Déclarante",  age: "4h",   escalated: false, navire: "MV TAM124", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260098", dauRef: "DAU-260204", marge: 8.1, type: "Import" },
  { ref: "FAI250013", client: "NS ENTREPRISE",     cargo: "13 TCs fer",                mode: "A", etape: "Circuit Rouge",    owner: "Bernardin",   age: "14h",  escalated: false, navire: "MV TANJONA", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260091", dauRef: "DAU-260181", marge: 6.2, type: "Import" },
  { ref: "FAI250019", client: "SPAT",              cargo: "ship spares",               mode: "A", etape: "DAU soumise",      owner: "Mohamed BAD", age: "8h",   escalated: false, navire: "MV SPAT-OPS", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260100", dauRef: "DAU-260219", marge: 9.0, type: "Import" },
  { ref: "FAI250014", client: "YUE FENG",          cargo: "motos + pièces",            mode: "A", etape: "Circuit Vert",     owner: "Mohamed BAD", age: "22h",  escalated: false, navire: "MV YUE FENG", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260087", dauRef: "DAU-260175", marge: 7.8, type: "Import" },
  { ref: "FAE260204", client: "MG-MINE",           cargo: "8 TCs chrome",              mode: "E", etape: "Cotation émise",   owner: "Lalatiana",   age: "18h",  escalated: false, navire: "MV CHROME-X", docs: { bl: false, fc: true, pl: true, bsc: false }, cotation: "COT-260118", dauRef: null, marge: 11.2, type: "Export" },
  { ref: "FAI250017", client: "M'LAY DISTRIBUTION",cargo: "carrelage",                 mode: "A", etape: "Liquidée DGD",     owner: "Facturation", age: "28h",  escalated: false, navire: "MV MLAY-7", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260080", dauRef: "DAU-260160", marge: 8.5, type: "Import" },
  { ref: "FAI250020", client: "M'LAY DISTRIBUTION",cargo: "fer rond",                  mode: "A", etape: "Circuit Jaune",    owner: "Mohamed BAD", age: "9h",   escalated: false, navire: "MV TANJONA", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260104", dauRef: "DAU-260208", marge: 7.0, type: "Import" },
  { ref: "FAI250028", client: "NS ENTREPRISE",     cargo: "891 T riz",                 mode: "A", etape: "Facturée",         owner: "—",           age: "5j",   escalated: false, navire: "MV INDIAN STAR", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260052", dauRef: "DAU-260121", marge: 7.6, type: "Import" },
  { ref: "FAI250004", client: "AS DISTRIBUTION",   cargo: "875 T riz TAM132",          mode: "A", etape: "DAU brouillon",    owner: "Déclarante",  age: "3h",   escalated: false, navire: "MV TAM132", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260109", dauRef: "DAU-260221", marge: 7.2, type: "Import" },
  { ref: "FAE260201", client: "MG-MINE",           cargo: "mica brut",                 mode: "E", etape: "Liquidée DGD",     owner: "Facturation", age: "32h",  escalated: false, navire: "MV CHROME-X", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260079", dauRef: "DAU-260158", marge: 10.4, type: "Export" },
  { ref: "FAI250029", client: "MV MARIA",          cargo: "ship spares",               mode: "A", etape: "Docs en attente",  owner: "Lalatiana",   age: "5h",   escalated: false, navire: "MV MARIA", docs: { bl: true, fc: false, pl: false, bsc: false }, cotation: null, dauRef: null, marge: null, type: "Import" },
  { ref: "FAI250023", client: "NS ENTREPRISE",     cargo: "9 000 T ciment",            mode: "A", etape: "Cotation émise",   owner: "Lalatiana",   age: "10h",  escalated: false, navire: "MV TAM124", docs: { bl: true, fc: true, pl: true, bsc: true }, cotation: "COT-260116", dauRef: null, marge: 7.8, type: "Import" },
];

// Carnet de bord — seed (entrées passées plausibles · mai 2026)
window.SEED_CARNET = [
  { ts: "28 mai · 09:14", cat: "Cotation",      ref: "FAI250023", owner: "Lalatiana", text: "Cotation émise · marge 7,8 % · règlement 45j" },
  { ts: "28 mai · 08:42", cat: "Relance",       ref: "FAI260015", owner: "Lalatiana", text: "Relance pièces manquantes · canal téléphone · contact Penta-Ocean Tana" },
  { ts: "28 mai · 08:12", cat: "Accusé",        ref: "CLM260011", owner: "Lalatiana", text: "Accusé réception · canal email · template envoyé sous 45 min" },
  { ts: "27 mai · 17:30", cat: "Proposition",   ref: "CLM260011", owner: "Lalatiana", text: "Proposition envoyée · avoir 1 200 000 MGA sur retard de 6 j" },
  { ts: "27 mai · 16:50", cat: "Ouverture",     ref: "FAI260015", owner: "Lalatiana", text: "Dossier ouvert · PENTA-OCEAN · Acier PDJV · MV PACIFIC" },
  { ts: "27 mai · 14:08", cat: "Ouverture",     ref: "FAE260204", owner: "Lalatiana", text: "Dossier ouvert · MG-MINE · 8 TCs chrome · export Mode E" },
  { ts: "27 mai · 11:30", cat: "Escalade",      ref: "FAI250013", owner: "Lalatiana", text: "Escalade Tudi · Circuit Rouge persistant · urgence rouge" },
  { ts: "27 mai · 10:20", cat: "Escalade claim",ref: "CLM260009", owner: "Lalatiana", text: "Escalade Tudi · différend cargo · urgence rouge" },
  { ts: "27 mai · 09:50", cat: "Investigation", ref: "CLM260012", owner: "Lalatiana", text: "Investigation · assignée Facturation · délai retour 48 h" },
  { ts: "26 mai · 17:22", cat: "Relance",       ref: "FAE260204", owner: "Lalatiana", text: "Relance pièces manquantes · BL + BSC manquants · canal email" },
  { ts: "26 mai · 14:10", cat: "Investigation", ref: "CLM260008", owner: "Lalatiana", text: "Investigation · différend marge · assignée Facturation" },
  { ts: "26 mai · 10:15", cat: "Cotation",      ref: "FAI250030", owner: "Lalatiana", text: "Cotation émise · marge 7,4 % · règlement 30j" },
  { ts: "25 mai · 15:48", cat: "Ouverture",     ref: "FAI250029", owner: "Lalatiana", text: "Dossier ouvert · MV MARIA · ship spares" },
  { ts: "25 mai · 11:20", cat: "Clôture",       ref: "CLM260007", owner: "Lalatiana", text: "Clôturée · acceptée par client · sans avoir" },
  { ts: "23 mai · 16:30", cat: "Clôture",       ref: "CLM260006", owner: "Lalatiana", text: "Clôturée · acceptée par client · avoir 450 000 MGA" },
];

// ============ RÉCLAMATIONS ============
window.CLAIM_TYPES = ["Facturation", "Délai", "Documentation", "Cargo", "Marge", "Autre"];

window.CLAIM_ETAPES = {
  "Reçue · accusé pending": { fg: "var(--warn)", bg: "var(--warn-soft)" },
  "Accusée":                 { fg: "var(--accent)", bg: "var(--accent-soft)" },
  "Investigation":           { fg: "#5BB8C7",     bg: "color-mix(in srgb, #5BB8C7 14%, transparent)" },
  "Proposition envoyée":     { fg: "var(--accent)", bg: "var(--accent-soft)" },
  "Acceptée":                { fg: "var(--ok)",   bg: "var(--ok-soft)" },
  "Refusée":                 { fg: "var(--err)",  bg: "var(--err-soft)" },
  "Escaladée Tudi":          { fg: "var(--err)",  bg: "var(--err-soft)" },
};

window.SEVERITE_COLORS = {
  vert:   { fg: "var(--ok)",   bg: "var(--ok-soft)" },
  orange: { fg: "var(--warn)", bg: "var(--warn-soft)" },
  rouge:  { fg: "var(--err)",  bg: "var(--err-soft)" },
};

window.SEED_CLAIMS = [
  { ref: "CLM260012", client: "NS ENTREPRISE",      dossier: "FAI250007", type: "Facturation",   severite: "rouge",  etape: "Investigation",       slaAccuse: { hours: 1.2,  ok: true },  slaReponse: { hours: 36, total: 48, ok: true },  ownerAval: "Facturation", opened: "2 j", closed: false },
  { ref: "CLM260011", client: "PENTA-OCEAN",        dossier: "FAI260015", type: "Délai",         severite: "orange", etape: "Proposition envoyée", slaAccuse: { hours: 0.75, ok: true },  slaReponse: { hours: 28, total: 48, ok: true },  ownerAval: "Déclarante",  opened: "1 j", closed: false },
  { ref: "CLM260010", client: "MG-MINE",            dossier: "FAE260204", type: "Documentation", severite: "orange", etape: "Reçue · accusé pending", slaAccuse: { hours: 2.13, ok: false }, slaReponse: null,                                  ownerAval: "Lalatiana",   opened: "3 h", closed: false },
  { ref: "CLM260009", client: "M'LAY DISTRIBUTION", dossier: "FAI250020", type: "Cargo",         severite: "rouge",  etape: "Escaladée Tudi",      slaAccuse: { hours: 0.5,  ok: true },  slaReponse: { hours: 52, total: 48, ok: false }, ownerAval: "Tudi",        opened: "3 j", closed: false },
  { ref: "CLM260008", client: "NS ENTREPRISE",      dossier: "FAI250013", type: "Marge",         severite: "orange", etape: "Investigation",       slaAccuse: { hours: 1.08, ok: true },  slaReponse: { hours: 41, total: 48, ok: true },  ownerAval: "Facturation", opened: "2 j", closed: false },
  { ref: "CLM260007", client: "YUE FENG",           dossier: "FAI250014", type: "Documentation", severite: "vert",   etape: "Acceptée",            slaAccuse: { hours: 0.6,  ok: true },  slaReponse: { hours: 22, total: 48, ok: true },  ownerAval: "—",           opened: "5 j", closed: true },
  { ref: "CLM260006", client: "SPAT",               dossier: "FAI250019", type: "Délai",         severite: "vert",   etape: "Acceptée",            slaAccuse: { hours: 0.8,  ok: true },  slaReponse: { hours: 30, total: 48, ok: true },  ownerAval: "—",           opened: "7 j", closed: true },
];

window.CLAIM_PRIORITY = {
  "Reçue · accusé pending": 0,
  "Escaladée Tudi":          1,
  "Investigation":           2,
  "Proposition envoyée":     3,
  "Accusée":                 4,
  "Refusée":                 5,
  "Acceptée":                6,
};

window.CARNET_CATEGORIES = ["Tous", "Ouverture", "Cotation", "Relance", "Escalade", "Accusé", "Investigation", "Proposition", "Clôture", "Escalade claim"];

// KPIs Lalatiana (onglet Scores) — claims-first, dossier-related en secondaire
window.KPIS = [
  { code: "T-K10", label: "Délai accusé réception réclamation", actual: "1h32", target: "< 2h",   status: "ok",   ecart: "28 min sous cible", primary: true },
  { code: "T-K11", label: "Réclamations résolues < 48h",        actual: "78 %", target: "≥ 90 %", status: "warn", ecart: "écart -12 pts",     primary: true },
  { code: "T-K12", label: "Concentration top client",           actual: "28,5 %", target: "≤ 25 %", status: "warn", ecart: "écart +3,5 pts",   primary: true, hint: "PENTA-OCEAN · lecture seule · owner CEO/SO·4" },
  { code: "T-K13", label: "Délai ouverture dossier",            actual: "3h12", target: "≤ 4h",   status: "ok",   ecart: "48 min sous cible" },
  { code: "T-K14", label: "Disputes résolues < 30j",            actual: "75 %", target: "≥ 90 %", status: "warn", ecart: "-15 pts" },
  { code: "T-K15", label: "Taux de réponse < 24h",              actual: "92 %", target: "≥ 95 %", status: "warn", ecart: "-3 pts" },
  { code: "T-K16", label: "Cotations acceptées",                actual: "68 %", target: "≥ 70 %", status: "warn", ecart: "-2 pts" },
  { code: "T-K17", label: "Dossiers ouverts / mois",            actual: "47",   target: "≥ 40",  status: "ok",   ecart: "+7" },
];

// Pillars (bandeau haut)
window.PILLARS = [
  { id: "p1", code: "P1", label: "Exécution & discipline",         value: 78, status: "warn", dominant: false },
  { id: "p2", code: "P2", label: "Cash & rentabilité",              value: 65, status: "warn", dominant: false, focus: true },
  { id: "p3", code: "P3", label: "Fidélité & diversification",      value: 82, status: "ok",   dominant: true,  focus: true },
  { id: "p4", code: "P4", label: "Fluidité & productivité",         value: 71, status: "warn", dominant: false },
];

// Documentation : pièces canoniques d'un dossier
window.DOC_PIECES = [
  { id: "mandate",  label: "Mandat signé client",          actor: "Client",      ext: "pdf" },
  { id: "bl",       label: "BL · Bill of Lading",          actor: "Client",      ext: "pdf" },
  { id: "fc",       label: "Facture commerciale",          actor: "Client",      ext: "pdf" },
  { id: "pl",       label: "Packing list",                 actor: "Client",      ext: "xlsx" },
  { id: "bsc",      label: "BSC · GasyNet",                actor: "Client",      ext: "pdf" },
  { id: "cotation", label: "Cotation Lalatiana",           actor: "Lalatiana",   ext: "pdf" },
  { id: "dauBr",    label: "DAU brouillon",                actor: "Déclarante",  ext: "xml" },
  { id: "dauSb",    label: "DAU soumise Sydonia",          actor: "Déclarante",  ext: "xml" },
  { id: "liq",      label: "Bon de liquidation DGD",       actor: "DGD",         ext: "pdf" },
  { id: "fac",      label: "Facture vente PL",             actor: "Facturation", ext: "pdf" },
];

// Helper: synthesize a file record for a piece on a dossier
window.makeFile = function makeFile(pieceId, dossierRef, opts = {}) {
  const piece = window.DOC_PIECES.find(p => p.id === pieceId) || {};
  const ext = opts.ext || piece.ext || "pdf";
  const labelSlug = (piece.label || pieceId).replace(/[^A-Za-z]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").substring(0, 20);
  const sizeKb = opts.sizeKb || (120 + Math.floor(Math.abs(hashStr(dossierRef + pieceId)) % 480));
  return {
    id: dossierRef + "-" + pieceId,
    pieceId,
    name: `${labelSlug}_${dossierRef}.${ext}`,
    size: `${sizeKb} Kb`,
    ts: opts.ts || "27 mai · 09:30",
    by: opts.by || (piece.actor || "Lalatiana"),
    signed: !!opts.signed,
    ext,
  };
};

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

// Seed: build files[] for every existing dossier based on its docs flags + etape
window.SEED_DOSSIERS = window.SEED_DOSSIERS.map(d => {
  const files = [];
  // Mandat signé : présent pour TOUS les dossiers ouverts (preuve légale)
  files.push(window.makeFile("mandate", d.ref, { signed: true, by: d.client, ts: "27 mai · 08:14" }));
  if (d.docs && d.docs.bl)  files.push(window.makeFile("bl",  d.ref, { by: d.client, ts: "27 mai · 09:42" }));
  if (d.docs && d.docs.fc)  files.push(window.makeFile("fc",  d.ref, { by: d.client, ts: "27 mai · 10:08" }));
  if (d.docs && d.docs.pl)  files.push(window.makeFile("pl",  d.ref, { by: d.client, ts: "27 mai · 10:12" }));
  if (d.docs && d.docs.bsc) files.push(window.makeFile("bsc", d.ref, { by: d.client, ts: "27 mai · 11:20" }));
  if (d.cotation) files.push(window.makeFile("cotation", d.ref, { by: "Lalatiana", ts: "27 mai · 14:30" }));
  if (d.dauRef && ["DAU brouillon"].includes(d.etape)) files.push(window.makeFile("dauBr", d.ref, { by: "Déclarante 298", ts: "27 mai · 15:48" }));
  if (d.dauRef && ["DAU soumise", "Circuit Vert", "Circuit Jaune", "Circuit Rouge", "Liquidée DGD", "Facturée"].includes(d.etape)) {
    files.push(window.makeFile("dauSb", d.ref, { by: "Déclarante 298", ts: "27 mai · 16:20" }));
  }
  if (["Liquidée DGD", "Facturée"].includes(d.etape)) {
    files.push(window.makeFile("liq", d.ref, { by: "DGD inspecteur", ts: "28 mai · 09:10", signed: true }));
  }
  if (d.etape === "Facturée") {
    files.push(window.makeFile("fac", d.ref, { by: "Facturation", ts: "28 mai · 10:45" }));
  }
  return { ...d, files };
});
