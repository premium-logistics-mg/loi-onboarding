// LOI Fleet Maintenance Data - Pneus & Carburant
// Based on FICHE_PNEU_MMG-ATS.xlsx + Suivit fuel AVRIL 2026.xlsx

// Prix de référence pneus (MGA)
export const prixRefPneus = [
  { marque: "ONYX", type: "Motrice", prix: 850000 },
  { marque: "ONYX", type: "Directionnel", prix: 850000 },
  { marque: "LONG MARCH", type: "Motrice", prix: 1200000 },
  { marque: "LONG MARCH", type: "Directionnel", prix: 1200000 },
  { marque: "HONSWAY", type: "Motrice", prix: 850000 },
  { marque: "HONSWAY", type: "Directionnel", prix: 850000 },
  { marque: "GENCOTIRE", type: "Motrice", prix: 1120000 },
  { marque: "GENCOTIRE", type: "Directionnel", prix: 1120000 },
  { marque: "GOLDEN", type: "Motrice", prix: 950000 },
  { marque: "GOLDEN", type: "Directionnel", prix: 950000 },
];

// Pneus montés avec durée de vie calculée
export const pneusMontés = [
  { vehicule: "S001", plaque: "6843TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 1ESS-INT-D", kmMontage: 45230, dernierKm: 58340, etat: "ok" },
  { vehicule: "S001", plaque: "6843TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 1ESS-INT-G", kmMontage: 45230, dernierKm: 58340, etat: "ok" },
  { vehicule: "S001", plaque: "6843TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 1ESS-EXT-D", kmMontage: 45230, dernierKm: 58340, etat: "ok" },
  { vehicule: "S001", plaque: "6843TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 1ESS-EXT-G", kmMontage: 45230, dernierKm: 58340, etat: "ok" },
  { vehicule: "S001", plaque: "6843TCB", reference: "12R22,5", marque: "LONG MARCH", position: "DIR-D", kmMontage: 34610, dernierKm: 58340, etat: "ok" },
  { vehicule: "S001", plaque: "6843TCB", reference: "12R22,5", marque: "LONG MARCH", position: "DIR-G", kmMontage: 34610, dernierKm: 58340, etat: "ok" },
  { vehicule: "S002", plaque: "6846TCB", reference: "315/80R22,5", marque: "HONSWAY", position: "MOT 2ESS-INT-D", kmMontage: 52100, dernierKm: 68900, etat: "ok" },
  { vehicule: "S002", plaque: "6846TCB", reference: "315/80R22,5", marque: "HONSWAY", position: "MOT 2ESS-INT-G", kmMontage: 52100, dernierKm: 68900, etat: "ok" },
  { vehicule: "S002", plaque: "6846TCB", reference: "315/80R22,5", marque: "GENCOTIRE", position: "MOT 2ESS-EXT-D", kmMontage: 48500, dernierKm: 68900, etat: "surveiller" },
  { vehicule: "S002", plaque: "6846TCB", reference: "315/80R22,5", marque: "GENCOTIRE", position: "MOT 2ESS-EXT-G", kmMontage: 48500, dernierKm: 68900, etat: "surveiller" },
  { vehicule: "S003", plaque: "6851TCB", reference: "315/80R22,5", marque: "GOLDEN", position: "MOT 1ESS-INT-D", kmMontage: 38200, dernierKm: 55600, etat: "ok" },
  { vehicule: "S003", plaque: "6851TCB", reference: "315/80R22,5", marque: "GOLDEN", position: "MOT 1ESS-INT-G", kmMontage: 38200, dernierKm: 55600, etat: "ok" },
  { vehicule: "S004", plaque: "7124TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 2ESS-INT-D", kmMontage: 62300, dernierKm: 74500, etat: "surveiller" },
  { vehicule: "S004", plaque: "7124TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 2ESS-INT-G", kmMontage: 62300, dernierKm: 74500, etat: "surveiller" },
  { vehicule: "S005", plaque: "7156TCB", reference: "315/80R22,5", marque: "LONG MARCH", position: "MOT 1ESS-INT-D", kmMontage: 28400, dernierKm: 58900, etat: "ok" },
  { vehicule: "S005", plaque: "7156TCB", reference: "315/80R22,5", marque: "LONG MARCH", position: "MOT 1ESS-INT-G", kmMontage: 28400, dernierKm: 58900, etat: "ok" },
  { vehicule: "S006", plaque: "7178TCB", reference: "12R22,5", marque: "LONG MARCH", position: "DIR-D", kmMontage: 34610, dernierKm: 65745, etat: "ok" },
  { vehicule: "S006", plaque: "7178TCB", reference: "12R22,5", marque: "LONG MARCH", position: "DIR-G", kmMontage: 34610, dernierKm: 65745, etat: "ok" },
  { vehicule: "S007", plaque: "7195TCB", reference: "315/80R22,5", marque: "HONSWAY", position: "MOT 2ESS-INT-D", kmMontage: 41200, dernierKm: 52800, etat: "ok" },
  { vehicule: "S007", plaque: "7195TCB", reference: "315/80R22,5", marque: "HONSWAY", position: "MOT 2ESS-INT-G", kmMontage: 41200, dernierKm: 52800, etat: "ok" },
  { vehicule: "S008", plaque: "7229TCB", reference: "315/80R22,5", marque: "GOLDEN", position: "MOT 1ESS-INT-D", kmMontage: 55800, dernierKm: 72100, etat: "surveiller" },
  { vehicule: "S008", plaque: "7229TCB", reference: "315/80R22,5", marque: "GOLDEN", position: "MOT 1ESS-INT-G", kmMontage: 55800, dernierKm: 72100, etat: "surveiller" },
  { vehicule: "S009", plaque: "7245TCB", reference: "315/80R22,5", marque: "GENCOTIRE", position: "MOT 2ESS-INT-D", kmMontage: 36500, dernierKm: 61200, etat: "ok" },
  { vehicule: "S009", plaque: "7245TCB", reference: "315/80R22,5", marque: "GENCOTIRE", position: "MOT 2ESS-INT-G", kmMontage: 36500, dernierKm: 61200, etat: "ok" },
  { vehicule: "S010", plaque: "7267TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 1ESS-INT-D", kmMontage: 48900, dernierKm: 62100, etat: "ok" },
  { vehicule: "S010", plaque: "7267TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 1ESS-INT-G", kmMontage: 48900, dernierKm: 62100, etat: "ok" },
];

// Pneus éclatés / usés
export const pneusEclates = [
  { vehicule: "S020", plaque: "6892TCB", reference: "315/80R22,5", marque: "ONYX", position: "MOT 2ESS-INT-D", kmMontage: 68927, dernierKm: 82026, cause: "Éclaté", date: "2026-04-15" },
  { vehicule: "S006", plaque: "7178TCB", reference: "12R22,5", marque: "LONG MARCH", position: "DIR-D", kmMontage: 34610, dernierKm: 65745, cause: "Usé", date: "2026-04-08" },
  { vehicule: "S012", plaque: "7312TCB", reference: "315/80R22,5", marque: "HONSWAY", position: "MOT 1ESS-EXT-G", kmMontage: 42300, dernierKm: 54800, cause: "Éclaté", date: "2026-04-22" },
  { vehicule: "S015", plaque: "7398TCB", reference: "315/80R22,5", marque: "GOLDEN", position: "MOT 2ESS-INT-D", kmMontage: 51200, dernierKm: 68900, cause: "Usé", date: "2026-04-05" },
  { vehicule: "S018", plaque: "7456TCB", reference: "315/80R22,5", marque: "GENCOTIRE", position: "MOT 1ESS-INT-G", kmMontage: 38700, dernierKm: 61500, cause: "Éclaté", date: "2026-04-18" },
];

// Permutations récentes
export const permutations = [
  { vehicule: "P008", plaque: "7229TCB", marque: "GOLDEN", position: "MOT 2ESS-INT-G", kmPermutation: 98975, date: "2026-04-12" },
  { vehicule: "P003", plaque: "6851TCB", marque: "ONYX", position: "MOT 1ESS-EXT-D", kmPermutation: 67890, date: "2026-04-08" },
  { vehicule: "P011", plaque: "7312TCB", marque: "LONG MARCH", position: "DIR-G", kmPermutation: 54320, date: "2026-04-20" },
  { vehicule: "P005", plaque: "7156TCB", marque: "HONSWAY", position: "MOT 2ESS-EXT-G", kmPermutation: 72150, date: "2026-04-15" },
];

// Stock pneus par site
export const stockPneus = [
  { site: "MMG", marque: "ONYX", quantite: 12 },
  { site: "MMG", marque: "LONG MARCH", quantite: 8 },
  { site: "MMG", marque: "HONSWAY", quantite: 6 },
  { site: "ITALYA", marque: "ONYX", quantite: 4 },
  { site: "ITALYA", marque: "GENCOTIRE", quantite: 10 },
  { site: "ITALYA", marque: "GOLDEN", quantite: 5 },
  { site: "ATS", marque: "LONG MARCH", quantite: 3 },
  { site: "ATS", marque: "HONSWAY", quantite: 7 },
  { site: "ATS", marque: "GOLDEN", quantite: 4 },
];

// Statistiques calculées par marque
export const statsParMarque = [
  { marque: "ONYX", prixMoyen: 850000, dureeVieMoyenne: 13100, coutParKm: 64.89, nbPneus: 18, tauxEclatement: 5.6 },
  { marque: "LONG MARCH", prixMoyen: 1200000, dureeVieMoyenne: 31100, coutParKm: 38.59, nbPneus: 14, tauxEclatement: 2.1 },
  { marque: "HONSWAY", prixMoyen: 850000, dureeVieMoyenne: 12500, coutParKm: 68.00, nbPneus: 12, tauxEclatement: 8.3 },
  { marque: "GENCOTIRE", prixMoyen: 1120000, dureeVieMoyenne: 24700, coutParKm: 45.34, nbPneus: 10, tauxEclatement: 4.0 },
  { marque: "GOLDEN", prixMoyen: 950000, dureeVieMoyenne: 17400, coutParKm: 54.60, nbPneus: 8, tauxEclatement: 6.2 },
];

// ============ CARBURANT ============

// Détail des pleins - Avril 2026
export const detailFuel = [
  { date: "2026-04-01", station: "GALANA TMM", vehicule: "6851TCB", litres: 20, voyage: "TMM", trajet: "DEPOT ITALYA-PORT", bc: "BC ENLEVEMENT CAH" },
  { date: "2026-04-01", station: "GALANA MMG", vehicule: "6846TCB", litres: 350, voyage: "ADM", trajet: "MANGORO-TANA", bc: "BC LIVRAISON" },
  { date: "2026-04-02", station: "TOTAL ENERGIES", vehicule: "6843TCB", litres: 280, voyage: "TMM", trajet: "TMM-PORT", bc: "BC TRANSPORT" },
  { date: "2026-04-02", station: "GALANA TMM", vehicule: "7124TCB", litres: 315, voyage: "TANA", trajet: "TMM-TANA", bc: "BC LIVRAISON" },
  { date: "2026-04-03", station: "GALANA MMG", vehicule: "7156TCB", litres: 420, voyage: "ADM", trajet: "MANGORO-ADM", bc: "BC ENLEVEMENT" },
  { date: "2026-04-03", station: "TOTAL ENERGIES", vehicule: "7178TCB", litres: 290, voyage: "TMM", trajet: "PORT-DEPOT", bc: "BC TRANSPORT" },
  { date: "2026-04-04", station: "GALANA TMM", vehicule: "7195TCB", litres: 380, voyage: "TANA", trajet: "TMM-TANA", bc: "BC LIVRAISON" },
  { date: "2026-04-04", station: "GALANA MMG", vehicule: "7229TCB", litres: 445, voyage: "ADM", trajet: "MANGORO-ADM", bc: "BC ENLEVEMENT" },
  { date: "2026-04-05", station: "TOTAL ENERGIES", vehicule: "7245TCB", litres: 310, voyage: "TMM", trajet: "TMM-PORT", bc: "BC TRANSPORT" },
  { date: "2026-04-05", station: "GALANA TMM", vehicule: "7267TCB", litres: 365, voyage: "TANA", trajet: "TMM-TANA", bc: "BC LIVRAISON" },
  { date: "2026-04-06", station: "GALANA MMG", vehicule: "6851TCB", litres: 398, voyage: "ADM", trajet: "MANGORO-TANA", bc: "BC LIVRAISON" },
  { date: "2026-04-07", station: "TOTAL ENERGIES", vehicule: "6846TCB", litres: 275, voyage: "TMM", trajet: "PORT-DEPOT", bc: "BC TRANSPORT" },
  { date: "2026-04-08", station: "GALANA TMM", vehicule: "6843TCB", litres: 340, voyage: "TANA", trajet: "TMM-TANA", bc: "BC LIVRAISON" },
  { date: "2026-04-09", station: "GALANA MMG", vehicule: "7124TCB", litres: 425, voyage: "ADM", trajet: "MANGORO-ADM", bc: "BC ENLEVEMENT" },
  { date: "2026-04-10", station: "TOTAL ENERGIES", vehicule: "7156TCB", litres: 295, voyage: "TMM", trajet: "TMM-PORT", bc: "BC TRANSPORT" },
];

// Consommation par camion - Avril 2026
export const consommationCamions = [
  { vehicule: "S001", plaque: "6843TCB", kmEffectues: 5305, litres: 3680, lParKm: 0.694, voyagesADM: 8, voyagesTMM: 12, voyagesTANA: 6 },
  { vehicule: "S002", plaque: "6846TCB", kmEffectues: 6814, litres: 4725, lParKm: 0.693, voyagesADM: 10, voyagesTMM: 15, voyagesTANA: 8 },
  { vehicule: "S003", plaque: "6851TCB", kmEffectues: 6014, litres: 4175, lParKm: 0.694, voyagesADM: 9, voyagesTMM: 14, voyagesTANA: 7 },
  { vehicule: "S004", plaque: "7124TCB", kmEffectues: 5890, litres: 4245, lParKm: 0.721, voyagesADM: 7, voyagesTMM: 13, voyagesTANA: 5 },
  { vehicule: "S005", plaque: "7156TCB", kmEffectues: 5420, litres: 3756, lParKm: 0.693, voyagesADM: 8, voyagesTMM: 11, voyagesTANA: 6 },
  { vehicule: "S006", plaque: "7178TCB", kmEffectues: 6210, litres: 4472, lParKm: 0.720, voyagesADM: 9, voyagesTMM: 14, voyagesTANA: 7 },
  { vehicule: "S007", plaque: "7195TCB", kmEffectues: 5780, litres: 3985, lParKm: 0.689, voyagesADM: 8, voyagesTMM: 12, voyagesTANA: 6 },
  { vehicule: "S008", plaque: "7229TCB", kmEffectues: 6450, litres: 4708, lParKm: 0.730, voyagesADM: 10, voyagesTMM: 15, voyagesTANA: 8 },
  { vehicule: "S009", plaque: "7245TCB", kmEffectues: 5650, litres: 3898, lParKm: 0.690, voyagesADM: 8, voyagesTMM: 13, voyagesTANA: 6 },
  { vehicule: "S010", plaque: "7267TCB", kmEffectues: 5980, litres: 4186, lParKm: 0.700, voyagesADM: 9, voyagesTMM: 14, voyagesTANA: 7 },
  { vehicule: "S011", plaque: "7289TCB", kmEffectues: 5125, litres: 3537, lParKm: 0.690, voyagesADM: 7, voyagesTMM: 11, voyagesTANA: 5 },
  { vehicule: "S012", plaque: "7312TCB", kmEffectues: 6320, litres: 4614, lParKm: 0.730, voyagesADM: 10, voyagesTMM: 15, voyagesTANA: 8 },
  { vehicule: "S013", plaque: "7334TCB", kmEffectues: 5540, litres: 3823, lParKm: 0.690, voyagesADM: 8, voyagesTMM: 12, voyagesTANA: 6 },
  { vehicule: "S014", plaque: "7356TCB", kmEffectues: 5890, litres: 4123, lParKm: 0.700, voyagesADM: 9, voyagesTMM: 13, voyagesTANA: 7 },
  { vehicule: "S015", plaque: "7398TCB", kmEffectues: 6180, litres: 4513, lParKm: 0.730, voyagesADM: 10, voyagesTMM: 14, voyagesTANA: 8 },
];

// Kilométrage odomètre
export const kilometrage = [
  { vehicule: "S001", plaque: "6843TCB", odometre: 68896, distanceParcourue: 5305 },
  { vehicule: "S002", plaque: "6846TCB", odometre: 72450, distanceParcourue: 6814 },
  { vehicule: "S003", plaque: "6851TCB", odometre: 65230, distanceParcourue: 6014 },
  { vehicule: "S004", plaque: "7124TCB", odometre: 58920, distanceParcourue: 5890 },
  { vehicule: "S005", plaque: "7156TCB", odometre: 52180, distanceParcourue: 5420 },
  { vehicule: "S006", plaque: "7178TCB", odometre: 61450, distanceParcourue: 6210 },
  { vehicule: "S007", plaque: "7195TCB", odometre: 55780, distanceParcourue: 5780 },
  { vehicule: "S008", plaque: "7229TCB", odometre: 49823, distanceParcourue: 6450 },
  { vehicule: "S009", plaque: "7245TCB", odometre: 54650, distanceParcourue: 5650 },
  { vehicule: "S010", plaque: "7267TCB", odometre: 57980, distanceParcourue: 5980 },
  { vehicule: "S011", plaque: "7289TCB", odometre: 48125, distanceParcourue: 5125 },
  { vehicule: "S012", plaque: "7312TCB", odometre: 62320, distanceParcourue: 6320 },
  { vehicule: "S013", plaque: "7334TCB", odometre: 51540, distanceParcourue: 5540 },
  { vehicule: "S014", plaque: "7356TCB", odometre: 56890, distanceParcourue: 5890 },
  { vehicule: "S015", plaque: "7398TCB", odometre: 59180, distanceParcourue: 6180 },
];

// Recap par station
export const recapStation = [
  { station: "GALANA TMM", litresTotal: 18450, depot: "TSIMISARAKA" },
  { station: "GALANA MMG", litresTotal: 24680, depot: "MANGORO" },
  { station: "TOTAL ENERGIES", litresTotal: 15320, depot: "MULTI-SITE" },
];

// Barème cible consommation
export const BAREME_CIBLE_L_PAR_100KM = 70; // 0.70 L/km = 70 L/100km
export const PRIX_CARBURANT_MGA = 5200; // Prix au litre en MGA

// Calculer les totaux
export const totalLitresMois = consommationCamions.reduce((acc, c) => acc + c.litres, 0);
export const totalKmMois = consommationCamions.reduce((acc, c) => acc + c.kmEffectues, 0);
export const coutCarburantMois = totalLitresMois * PRIX_CARBURANT_MGA;

// Véhicules en surconsommation (> barème)
export const vehiculesSurconso = consommationCamions.filter(c => c.lParKm > 0.70);

// Flotte info
export const flotte = {
  total: 15,
  modele: "SCHACMAN F3000 6X4 + KERAX",
  activite: "Mining",
};

// ============ SUIVI USURE - POINTAGES ÉPAISSEUR ============

// Relevés d'épaisseur (pointeurs) avec seuils d'alerte
export const wearMeasurements = [
  // Véhicules critiques (nécessitant action immédiate)
  { id: "W001", vehicule: "S004", plaque: "7124TCB", position: "MOT 2ESS-INT-D", marque: "ONYX", epaisseurInitiale: 18, epaisseurActuelle: 2.8, kmMontage: 62300, kmActuel: 79500, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "Usure anormale flanc intérieur - vérifier parallélisme" },
  { id: "W002", vehicule: "S008", plaque: "7229TCB", position: "MOT 1ESS-INT-G", marque: "GOLDEN", epaisseurInitiale: 18, epaisseurActuelle: 3.2, kmMontage: 55800, kmActuel: 74100, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "Gonflage anormal constaté (5.8 bar au lieu de 8.5)" },
  
  // Véhicules en alerte (à lubrifier/surveiller de près)
  { id: "W003", vehicule: "S002", plaque: "6846TCB", position: "MOT 2ESS-EXT-D", marque: "GENCOTIRE", epaisseurInitiale: 18, epaisseurActuelle: 5.1, kmMontage: 48500, kmActuel: 68900, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "Usure en dents de scie - équilibrage recommandé" },
  { id: "W004", vehicule: "S012", plaque: "7312TCB", position: "MOT 2ESS-INT-D", marque: "HONSWAY", epaisseurInitiale: 18, epaisseurActuelle: 4.8, kmMontage: 42300, kmActuel: 62320, derniereReleve: "2026-04-23", seuilAlerte: 6, seuilCritique: 3, commentaire: "Traces de chauffage sur flanc" },
  { id: "W005", vehicule: "S006", plaque: "7178TCB", position: "DIR-D", marque: "LONG MARCH", epaisseurInitiale: 16, epaisseurActuelle: 5.5, kmMontage: 34610, kmActuel: 61450, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "" },
  
  // Véhicules à surveiller (usure modérée mais tendance élevée)
  { id: "W006", vehicule: "S001", plaque: "6843TCB", position: "MOT 1ESS-INT-D", marque: "ONYX", epaisseurInitiale: 18, epaisseurActuelle: 8.2, kmMontage: 45230, kmActuel: 68896, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "Légère usure centrale - pression à vérifier" },
  { id: "W007", vehicule: "S003", plaque: "6851TCB", position: "MOT 1ESS-INT-G", marque: "GOLDEN", epaisseurInitiale: 18, epaisseurActuelle: 9.1, kmMontage: 38200, kmActuel: 65230, derniereReleve: "2026-04-23", seuilAlerte: 6, seuilCritique: 3, commentaire: "" },
  { id: "W008", vehicule: "S015", plaque: "7398TCB", position: "MOT 2ESS-INT-D", marque: "GENCOTIRE", epaisseurInitiale: 18, epaisseurActuelle: 7.8, kmMontage: 51200, kmActuel: 68900, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "Petite coupure superficielle flanc extérieur" },
  
  // Véhicules OK (usure normale)
  { id: "W009", vehicule: "S005", plaque: "7156TCB", position: "MOT 1ESS-INT-D", marque: "LONG MARCH", epaisseurInitiale: 18, epaisseurActuelle: 12.4, kmMontage: 28400, kmActuel: 52180, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "" },
  { id: "W010", vehicule: "S007", plaque: "7195TCB", position: "MOT 2ESS-INT-D", marque: "HONSWAY", epaisseurInitiale: 18, epaisseurActuelle: 11.8, kmMontage: 41200, kmActuel: 55780, derniereReleve: "2026-04-23", seuilAlerte: 6, seuilCritique: 3, commentaire: "RAS - usure uniforme" },
  { id: "W011", vehicule: "S009", plaque: "7245TCB", position: "MOT 2ESS-INT-D", marque: "GENCOTIRE", epaisseurInitiale: 18, epaisseurActuelle: 10.5, kmMontage: 36500, kmActuel: 54650, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "" },
  { id: "W012", vehicule: "S010", plaque: "7267TCB", position: "MOT 1ESS-INT-D", marque: "ONYX", epaisseurInitiale: 18, epaisseurActuelle: 13.2, kmMontage: 48900, kmActuel: 57980, derniereReleve: "2026-04-24", seuilAlerte: 6, seuilCritique: 3, commentaire: "" },
];
