import type { 
  Pipeline, 
  Indicator, 
  Deadline, 
  Alert, 
  Arbitrage,
  TireBrandComparison,
  TruckRanking 
} from './loi-types'

export const pipelines: Pipeline[] = [
  {
    id: 'periodique',
    title: 'Maintenance Périodique',
    steps: [
      { icon: '⚠️', label: 'Pré-alerte 90%', count: 5 },
      { icon: '📋', label: 'Planification', count: 4 },
      { icon: '🚫', label: 'Immobilisation', count: 2 },
      { icon: '🔧', label: 'Exécution', count: 2 },
      { icon: '✅', label: 'Contrôle', count: 1 },
      { icon: '🚛', label: 'Remise service', count: 0 }
    ]
  },
  {
    id: 'curatif',
    title: 'Maintenance Curative / Pannes',
    steps: [
      { icon: '🚨', label: 'Signalement', count: 1 },
      { icon: '📋', label: 'Ouverture OT', count: 1 },
      { icon: '🔍', label: 'Diagnostic', count: 2 },
      { icon: '📦', label: 'Commande pièces', count: 1 },
      { icon: '🔧', label: 'Réparation', count: 1 },
      { icon: '✅', label: 'Test qualité', count: 0 },
      { icon: '🚛', label: 'Remise service', count: 0 }
    ]
  },
  {
    id: 'pneumatique',
    title: 'Gestion Pneumatique',
    steps: [
      { icon: '📥', label: 'Réception stock', count: 2 },
      { icon: '🔧', label: 'Montage/Permutation', count: 3 },
      { icon: '📊', label: 'Pointage garage', count: 5 },
      { icon: '⚠️', label: 'Alerte usure', count: 2 },
      { icon: '📝', label: 'Analyse sortie', count: 1 },
      { icon: '✅', label: 'Clôture fiche', count: 0 }
    ]
  }
]

export const indicators: Indicator[] = [
  { label: 'Disponibilité technique flotte', value: '92% (2 immobilisés / 18)', status: 'yellow', detail: '7046TCB (panne transmission), 6851TCB (retard vidange)' },
  { label: 'OT ouverts total', value: '6 OT', status: 'yellow', detail: '3 préventifs, 2 curatifs, 1 pneu' },
  { label: 'OT en retard (>48h)', value: '2 OT', status: 'red', detail: 'OT-187 (vidange 6851TCB), OT-188 (transmission 7046TCB)' },
  { label: 'Coût maintenance/km moyen flotte', value: '105 Ar/km', status: 'yellow', detail: 'Budget 120 Ar/km — 3 camions au-dessus' },
  { label: 'Coût pneu moyen/km flotte', value: '21.4 Ar/km', status: 'green', detail: 'Cible ≤50 Ar/km — Bien en dessous' },
  { label: 'Taux préventif vs curatif', value: '72% / 28%', status: 'yellow', detail: 'Cible ≥80% préventif' },
  { label: 'Pneus à remplacer (flotte)', value: '10 pneus', status: 'yellow', detail: 'Répartis sur 5 camions' },
  { label: 'Pneus éclatés ce mois', value: '4', status: 'red', detail: '2 GENCOTIRE, 1 HONSWAY, 1 ONYX' },
  { label: 'Stock pièces sous seuil', value: '3 références', status: 'yellow', detail: 'Filtre gasoil (2), plaquettes frein (1), courroie (0)' }
]

export const deadlines: Deadline[] = [
  { date: '23 mai', objet: 'Diagnostic transmission', camion: '7046TCB', responsable: 'Lova', jMoins: 'J-0', status: 'in_progress' },
  { date: '24 mai', objet: 'Vidange moteur (retard !)', camion: '6851TCB', responsable: 'Mamy', jMoins: 'J-1', status: 'todo' },
  { date: '25 mai', objet: 'Pointage garage hebdo pneus', camion: 'Tous', responsable: 'Dina', jMoins: 'J-2', status: 'todo' },
  { date: '26 mai', objet: 'Commande filtres gasoil', camion: '—', responsable: 'Dina', jMoins: 'J-3', status: 'in_progress' },
  { date: '27 mai', objet: 'Permutation pneus', camion: 'S001 (6843TCB)', responsable: 'Dina', jMoins: 'J-4', status: 'todo' },
  { date: '28 mai', objet: 'Contrôle freins (préventif)', camion: '6838TCB', responsable: 'Lova', jMoins: 'J-5', status: 'todo' },
  { date: '30 mai', objet: 'Rapport mensuel maintenance', camion: '—', responsable: 'Hery', jMoins: 'J-7', status: 'todo' }
]

export const alerts: Alert[] = [
  { type: 'red', message: '6851TCB — Dépassement 800km vidange moteur sans intervention', ref: 'TRK-005' },
  { type: 'red', message: '7046TCB — Immobilisé panne transmission depuis 24h', ref: 'TRK-008' },
  { type: 'red', message: '4 pneus éclatés ce mois — Taux anormal (+100% vs mois précédent)', ref: null },
  { type: 'yellow', message: '6846TCB — Contrôle freins seuil imminent (500km restants)', ref: 'TRK-004' },
  { type: 'yellow', message: '7052TCB — Pré-alerte vidange moteur (700km restants)', ref: 'TRK-010' },
  { type: 'yellow', message: 'Stock filtre gasoil critique — 2 unités restantes (seuil = 5)', ref: null },
  { type: 'yellow', message: '7045TCB + 7003TCB — Coût maintenance/km > budget 120 Ar', ref: null }
]

export const arbitrages: Arbitrage[] = [
  { description: 'Remplacement boîte vitesse 7046TCB — Réparation (5.2M) vs échange standard (8.5M)', montant: '5.2M — 8.5M Ar', action: 'Choisir option', actionType: 'approve' },
  { description: 'Changement politique marque pneu — Abandonner HONSWAY/GOLDEN (taux éclatement >49%)', action: 'Valider nouvelle politique', actionType: 'approve' },
  { description: 'Commande urgente plaquettes frein — Fournisseur habituel en rupture, alternatif +15%', montant: '2.1M Ar', action: 'Approuver fournisseur alternatif', actionType: 'approve' },
  { description: 'Immobilisation planifiée 6845TCB — 2 pneus + vidange pont (2j atelier)', action: 'Planifier date', actionType: 'approve' }
]

export const tireBrandComparison: TireBrandComparison[] = [
  { marque: 'KAPSEN', kmMoyenAvantHS: '38 421 km', tauxEclatement: '0%', coutKmEstime: '~22 Ar/km', verdict: 'Meilleur' },
  { marque: 'LONG MARCH', kmMoyenAvantHS: '37 266 km', tauxEclatement: '1.3%', coutKmEstime: '~32 Ar/km', verdict: 'Bon (cher)' },
  { marque: 'ONYX', kmMoyenAvantHS: '30 091 km', tauxEclatement: '17%', coutKmEstime: '~28 Ar/km', verdict: 'Standard' },
  { marque: 'GENCOTIRE', kmMoyenAvantHS: '31 800 km', tauxEclatement: '17%', coutKmEstime: '~35 Ar/km', verdict: 'Moyen' },
  { marque: 'HONSWAY', kmMoyenAvantHS: '19 030 km', tauxEclatement: '49%', coutKmEstime: '~45 Ar/km', verdict: 'Éviter' },
  { marque: 'GOLDEN', kmMoyenAvantHS: '21 810 km', tauxEclatement: '60%', coutKmEstime: '~40 Ar/km', verdict: 'Éviter' },
  { marque: 'TRACMAX', kmMoyenAvantHS: '23 066 km', tauxEclatement: '50%', coutKmEstime: '~37 Ar/km', verdict: 'Éviter' }
]

export const topCostTrucks: TruckRanking[] = [
  { position: 1, immatriculation: '7066TCB', coutKm: '68 Ar/km', code: 'S023' },
  { position: 2, immatriculation: '7057TCB', coutKm: '72 Ar/km', code: 'S025' },
  { position: 3, immatriculation: '7054TCB', coutKm: '78 Ar/km', code: 'S013' },
  { position: 4, immatriculation: '6839TCB', coutKm: '82 Ar/km', code: 'S027' },
  { position: 5, immatriculation: '7049TCB', coutKm: '85 Ar/km', code: 'S016' }
]

export const worstCostTrucks: TruckRanking[] = [
  { position: 14, immatriculation: '7003TCB', coutKm: '128 Ar/km', code: 'S009' },
  { position: 15, immatriculation: '7045TCB', coutKm: '132 Ar/km', code: 'S020' },
  { position: 16, immatriculation: '6845TCB', coutKm: '135 Ar/km', code: 'S003' },
  { position: 17, immatriculation: '6851TCB', coutKm: '102 Ar/km', code: 'S008', alert: 'retard' },
  { position: 18, immatriculation: '7046TCB', coutKm: '185 Ar/km', code: 'S019', alert: 'panne' }
]

export const tireStats = {
  total: 480,
  bon: 282,
  moyen: 91,
  aRemplacer: 47,
  nonEvalue: 60,
  kmMoyenEffectue: 9743,
  resteMoyenPourcent: 74
}
