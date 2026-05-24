import type { 
  Pillar, 
  KPICard, 
  SOTracker, 
  Truck, 
  TruckDetail,
  TeamMember 
} from './loi-types'

export const pillars: Pillar[] = [
  {
    code: 'P1',
    label: 'EXÉCUTION',
    score: 65,
    tooltip: 'SO·5 Décisions tracées · leaders actifs hebdo + M13 P0/P1 clôturées'
  },
  {
    code: 'P2',
    label: 'DISPONIBILITÉ',
    score: 71,
    tooltip: 'SO·4 Dispo technique ≥95% · zéro immobilisation non planifiée'
  },
  {
    code: 'P3',
    label: 'COÛT',
    score: 58,
    tooltip: 'SO·4 Coût maîtrisé · maintenance/km ≤120 Ar + pneu/km ≤50 Ar'
  },
  {
    code: 'P4',
    label: 'PRÉVENTIF',
    score: 63,
    tooltip: 'SO·4 Préventif dominant · taux ≥80% + 0 retard périodique'
  }
]

export const kpiCards: KPICard[] = [
  {
    id: 'disponibilite',
    label: 'DISPONIBILITÉ FLOTTE',
    value: '92%',
    delta: '-1%',
    target: 'Cible ≥95%',
    status: 'yellow'
  },
  {
    id: 'maintenances-retard',
    label: 'MAINTENANCES EN RETARD',
    value: '4',
    delta: '+2',
    target: 'Cible 0',
    status: 'red'
  },
  {
    id: 'cout-pneu',
    label: 'COÛT PNEU MOYEN/KM',
    value: '21.4 Ar/km',
    delta: '+2.1',
    target: 'Cible ≤50 Ar/km',
    status: 'green'
  },
  {
    id: 'taux-preventif',
    label: 'TAUX PRÉVENTIF',
    value: '72%',
    delta: '+5%',
    target: 'Cible ≥80%',
    status: 'yellow'
  }
]

export const soTracker: SOTracker = {
  soCode: 'SO·4',
  soNumber: '#4',
  owner: 'HERY',
  deadline: '31/08/26',
  score: 64,
  title: 'Disponibilité technique maximale & coût maîtrisé',
  target: 'Dispo ≥95%',
  current: 'Dispo 92%',
  forecastStatus: 'warning',
  alertCount: 6
}

export const trucks: Truck[] = [
  {
    id: 'TRK-001',
    immatriculation: '6843TCB',
    code: 'S001',
    kmTotal: 68896,
    kmMois: 5305,
    coutPneuKm: 17.3,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 3,
    pneusBon: 19,
    prochaineMaint: 'Vidange moteur',
    kmAvantMaint: 1200,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 95,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-002',
    immatriculation: '6844TCB',
    code: 'S002',
    kmTotal: 75822,
    kmMois: 3539,
    coutPneuKm: 23.2,
    pneusTotal: 22,
    pneusARemplacer: 1,
    pneusMoyen: 4,
    pneusBon: 17,
    prochaineMaint: 'Filtre gasoil',
    kmAvantMaint: 800,
    otEnCours: 0,
    disponibilite: 97,
    coutMaintKm: 110,
    status: 'yellow',
    alertes: ['Pré-alerte filtre gasoil — 90% seuil atteint']
  },
  {
    id: 'TRK-003',
    immatriculation: '6845TCB',
    code: 'S003',
    kmTotal: 101492,
    kmMois: 3436,
    coutPneuKm: 26.2,
    pneusTotal: 22,
    pneusARemplacer: 2,
    pneusMoyen: 5,
    pneusBon: 15,
    prochaineMaint: 'Vidange pont',
    kmAvantMaint: 2100,
    otEnCours: 1,
    disponibilite: 93,
    coutMaintKm: 135,
    status: 'yellow',
    alertes: ['Coût maintenance/km > budget (+12%)', '2 pneus à remplacer']
  },
  {
    id: 'TRK-004',
    immatriculation: '6846TCB',
    code: 'S004',
    kmTotal: 114084,
    kmMois: 6814,
    coutPneuKm: 21.3,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 2,
    pneusBon: 20,
    prochaineMaint: 'Contrôle freins',
    kmAvantMaint: 500,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 88,
    status: 'yellow',
    alertes: ['Pré-alerte contrôle freins — seuil imminent']
  },
  {
    id: 'TRK-005',
    immatriculation: '6851TCB',
    code: 'S008',
    kmTotal: 102669,
    kmMois: 6014,
    coutPneuKm: 19.3,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 2,
    pneusBon: 20,
    prochaineMaint: 'Vidange moteur',
    kmAvantMaint: -800,
    otEnCours: 1,
    disponibilite: 95,
    coutMaintKm: 102,
    status: 'red',
    alertes: ['DÉPASSEMENT 800km vidange moteur — Intervention urgente']
  },
  {
    id: 'TRK-006',
    immatriculation: '7003TCB',
    code: 'S009',
    kmTotal: 92456,
    kmMois: 3837,
    coutPneuKm: 24.4,
    pneusTotal: 22,
    pneusARemplacer: 3,
    pneusMoyen: 4,
    pneusBon: 15,
    prochaineMaint: 'Graissage général',
    kmAvantMaint: 1800,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 128,
    status: 'yellow',
    alertes: ['3 pneus à remplacer', 'Coût maintenance/km > budget']
  },
  {
    id: 'TRK-007',
    immatriculation: '7004TCB',
    code: 'S010',
    kmTotal: 114643,
    kmMois: 6375,
    coutPneuKm: 22.8,
    pneusTotal: 22,
    pneusARemplacer: 1,
    pneusMoyen: 3,
    pneusBon: 18,
    prochaineMaint: 'Vidange boîte',
    kmAvantMaint: 3200,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 105,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-008',
    immatriculation: '7046TCB',
    code: 'S019',
    kmTotal: 95200,
    kmMois: 3432,
    coutPneuKm: 28.5,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 2,
    pneusBon: 20,
    prochaineMaint: 'Vidange moteur',
    kmAvantMaint: 4500,
    otEnCours: 1,
    disponibilite: 0,
    coutMaintKm: 185,
    status: 'red',
    alertes: ['IMMOBILISÉ — Panne transmission en cours', 'Coût maintenance/km critique (+54%)']
  },
  {
    id: 'TRK-009',
    immatriculation: '7054TCB',
    code: 'S013',
    kmTotal: 126174,
    kmMois: 7087,
    coutPneuKm: 20.4,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 1,
    pneusBon: 21,
    prochaineMaint: 'Filtre air',
    kmAvantMaint: 2800,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 78,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-010',
    immatriculation: '7052TCB',
    code: 'S015',
    kmTotal: 99362,
    kmMois: 6314,
    coutPneuKm: 18.9,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 2,
    pneusBon: 20,
    prochaineMaint: 'Vidange moteur',
    kmAvantMaint: 700,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 92,
    status: 'yellow',
    alertes: ['Pré-alerte vidange moteur — 90% seuil']
  },
  {
    id: 'TRK-011',
    immatriculation: '7057TCB',
    code: 'S025',
    kmTotal: 109977,
    kmMois: 6578,
    coutPneuKm: 16.8,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 1,
    pneusBon: 21,
    prochaineMaint: 'Contrôle suspension',
    kmAvantMaint: 3500,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 72,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-012',
    immatriculation: '7049TCB',
    code: 'S016',
    kmTotal: 92741,
    kmMois: 5749,
    coutPneuKm: 19.1,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 2,
    pneusBon: 20,
    prochaineMaint: 'Vidange moteur',
    kmAvantMaint: 2200,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 85,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-013',
    immatriculation: '7066TCB',
    code: 'S023',
    kmTotal: 102281,
    kmMois: 5025,
    coutPneuKm: 15.2,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 0,
    pneusBon: 22,
    prochaineMaint: 'Filtre gasoil',
    kmAvantMaint: 4100,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 68,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-014',
    immatriculation: '6838TCB',
    code: 'S029',
    kmTotal: 105429,
    kmMois: 6104,
    coutPneuKm: 22.1,
    pneusTotal: 22,
    pneusARemplacer: 1,
    pneusMoyen: 3,
    pneusBon: 18,
    prochaineMaint: 'Vidange moteur',
    kmAvantMaint: 1500,
    otEnCours: 0,
    disponibilite: 97,
    coutMaintKm: 115,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-015',
    immatriculation: '6839TCB',
    code: 'S027',
    kmTotal: 90521,
    kmMois: 3748,
    coutPneuKm: 17.8,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 1,
    pneusBon: 21,
    prochaineMaint: 'Graissage général',
    kmAvantMaint: 2900,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 82,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-016',
    immatriculation: '6840TCB',
    code: 'S028',
    kmTotal: 88934,
    kmMois: 2399,
    coutPneuKm: 19.5,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 2,
    pneusBon: 20,
    prochaineMaint: 'Vidange moteur',
    kmAvantMaint: 3800,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 90,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-017',
    immatriculation: '6842TCB',
    code: 'S026',
    kmTotal: 89218,
    kmMois: 3133,
    coutPneuKm: 20.8,
    pneusTotal: 22,
    pneusARemplacer: 0,
    pneusMoyen: 2,
    pneusBon: 20,
    prochaineMaint: 'Contrôle freins',
    kmAvantMaint: 2400,
    otEnCours: 0,
    disponibilite: 100,
    coutMaintKm: 95,
    status: 'green',
    alertes: []
  },
  {
    id: 'TRK-018',
    immatriculation: '7045TCB',
    code: 'S020',
    kmTotal: 108919,
    kmMois: 3453,
    coutPneuKm: 21.9,
    pneusTotal: 22,
    pneusARemplacer: 2,
    pneusMoyen: 4,
    pneusBon: 16,
    prochaineMaint: 'Vidange pont',
    kmAvantMaint: 1100,
    otEnCours: 0,
    disponibilite: 93,
    coutMaintKm: 132,
    status: 'yellow',
    alertes: ['2 pneus à remplacer', 'Pré-alerte vidange pont']
  }
]

export const truckDetails: Record<string, TruckDetail> = {
  'TRK-005': {
    immatriculation: '6851TCB',
    code: 'S008',
    kmTotal: 102669,
    status: 'red',
    disponibilite: 95,
    kpis: {
      kmMois: 6014,
      coutMaintKm: 102,
      coutPneuKm: 19.3,
      otOuverts: 1,
      otClotures30j: 2,
      tauxPreventif: 75,
      pneusARemplacer: 0,
      derniereMaint: 'Filtre air — 15 avril',
      prochaineMaint: 'Vidange moteur',
      kmAvantMaint: -800
    },
    pneus: [
      { position: 'DIR 1ESS-G', marque: 'ONYX', profil: 'H0301+', kmEffectue: 12500, usurePourcent: 72, etat: 'BON' },
      { position: 'DIR 1ESS-D', marque: 'ONYX', profil: 'H0301+', kmEffectue: 12500, usurePourcent: 70, etat: 'BON' },
      { position: 'MOT 1ESS-INT-G', marque: 'ONYX', profil: 'H0308', kmEffectue: 18200, usurePourcent: 55, etat: 'MOYEN' },
      { position: 'MOT 1ESS-EXT-G', marque: 'ONYX', profil: 'H0308', kmEffectue: 18200, usurePourcent: 58, etat: 'MOYEN' },
      { position: 'MOT 1ESS-INT-D', marque: 'ONYX', profil: 'H0308', kmEffectue: 15800, usurePourcent: 62, etat: 'BON' },
      { position: 'MOT 1ESS-EXT-D', marque: 'ONYX', profil: 'H0308', kmEffectue: 15800, usurePourcent: 65, etat: 'BON' }
    ],
    historiqueOT: [
      { ref: 'OT-2026-172', date: '15 avril', type: 'préventif', description: 'Changement filtre air', cout: '85 000 Ar', duree: '2h' },
      { ref: 'OT-2026-158', date: '28 mars', type: 'préventif', description: 'Vidange moteur + filtre huile', cout: '320 000 Ar', duree: '3h' },
      { ref: 'OT-2026-145', date: '12 mars', type: 'curatif', description: 'Remplacement flexible frein AR', cout: '180 000 Ar', duree: '4h' },
      { ref: 'OT-2026-131', date: '25 fév', type: 'préventif', description: 'Graissage général', cout: '95 000 Ar', duree: '2h' },
      { ref: 'OT-2026-118', date: '08 fév', type: 'préventif', description: 'Contrôle freins + plaquettes', cout: '450 000 Ar', duree: '5h' }
    ],
    planPreventif: [
      { intervention: 'Vidange moteur', intervalle: '7 000 km', derniereFaite: '28 mars (96 655 km)', prochaine: '103 655 km', kmRestants: -800, status: 'depassement' },
      { intervention: 'Filtre gasoil', intervalle: '15 000 km', derniereFaite: '10 jan (88 000 km)', prochaine: '103 000 km', kmRestants: 331, status: 'pre_alerte' },
      { intervention: 'Vidange boîte', intervalle: '30 000 km', derniereFaite: '15 nov (78 000 km)', prochaine: '108 000 km', kmRestants: 5331, status: 'ok' },
      { intervention: 'Vidange pont', intervalle: '40 000 km', derniereFaite: '20 sept (68 000 km)', prochaine: '108 000 km', kmRestants: 5331, status: 'ok' },
      { intervention: 'Contrôle freins', intervalle: '20 000 km', derniereFaite: '08 fév (86 000 km)', prochaine: '106 000 km', kmRestants: 3331, status: 'ok' }
    ],
    alertes: [
      'DÉPASSEMENT 800km vidange moteur — Intervention urgente requise',
      'Pré-alerte filtre gasoil — seuil imminent'
    ]
  }
}

// Generate basic details for other trucks
trucks.forEach(truck => {
  if (!truckDetails[truck.id]) {
    truckDetails[truck.id] = {
      immatriculation: truck.immatriculation,
      code: truck.code,
      kmTotal: truck.kmTotal,
      status: truck.status,
      disponibilite: truck.disponibilite,
      kpis: {
        kmMois: truck.kmMois,
        coutMaintKm: truck.coutMaintKm,
        coutPneuKm: truck.coutPneuKm,
        otOuverts: truck.otEnCours,
        otClotures30j: Math.floor(Math.random() * 4) + 1,
        tauxPreventif: 70 + Math.floor(Math.random() * 20),
        pneusARemplacer: truck.pneusARemplacer,
        derniereMaint: 'Dernière intervention — 10 avril',
        prochaineMaint: truck.prochaineMaint,
        kmAvantMaint: truck.kmAvantMaint
      },
      pneus: [
        { position: 'DIR 1ESS-G', marque: 'ONYX', profil: 'H0301+', kmEffectue: 10000 + Math.floor(Math.random() * 10000), usurePourcent: 60 + Math.floor(Math.random() * 30), etat: truck.pneusBon > 18 ? 'BON' : 'MOYEN' },
        { position: 'DIR 1ESS-D', marque: 'ONYX', profil: 'H0301+', kmEffectue: 10000 + Math.floor(Math.random() * 10000), usurePourcent: 60 + Math.floor(Math.random() * 30), etat: truck.pneusBon > 18 ? 'BON' : 'MOYEN' },
        { position: 'MOT 1ESS-INT-G', marque: 'KAPSEN', profil: 'K12', kmEffectue: 15000 + Math.floor(Math.random() * 15000), usurePourcent: 50 + Math.floor(Math.random() * 40), etat: 'BON' },
        { position: 'MOT 1ESS-EXT-G', marque: 'KAPSEN', profil: 'K12', kmEffectue: 15000 + Math.floor(Math.random() * 15000), usurePourcent: 50 + Math.floor(Math.random() * 40), etat: 'BON' }
      ],
      historiqueOT: [
        { ref: `OT-2026-${100 + Math.floor(Math.random() * 100)}`, date: '10 avril', type: 'préventif', description: 'Vidange moteur', cout: '280 000 Ar', duree: '3h' },
        { ref: `OT-2026-${100 + Math.floor(Math.random() * 100)}`, date: '25 mars', type: 'préventif', description: 'Graissage général', cout: '95 000 Ar', duree: '2h' }
      ],
      planPreventif: [
        { intervention: truck.prochaineMaint, intervalle: '7 000 km', derniereFaite: 'Voir historique', prochaine: `${truck.kmTotal + truck.kmAvantMaint} km`, kmRestants: truck.kmAvantMaint, status: truck.kmAvantMaint < 0 ? 'depassement' : truck.kmAvantMaint < 1000 ? 'pre_alerte' : 'ok' }
      ],
      alertes: truck.alertes
    }
  }
})

export const teamMembers: TeamMember[] = [
  {
    initials: 'MA',
    name: 'Mamy',
    level: 'N4',
    role: 'Chef Atelier & Planification OT',
    subLabel: '30j',
    score: 67,
    trend: 'stable',
    trendPeriod: '30j',
    isCapRouge: false,
    metrics: [
      { label: 'EXÉCUTION', score: 65 },
      { label: 'RESPECT PLANNING', score: 62 },
      { label: 'QUALITÉ OT', score: 72 },
      { label: 'ALIGNEMENT ER', score: 68 }
    ],
    tasksCount: 6,
    workloadStatus: 'yellow'
  },
  {
    initials: 'LO',
    name: 'Lova',
    level: 'N4',
    role: 'Mécanicien Senior & Diagnostic',
    subLabel: '30j',
    score: 72,
    trend: 'up',
    trendPeriod: '30j',
    isCapRouge: false,
    metrics: [
      { label: 'EXÉCUTION', score: 75 },
      { label: 'QUALITÉ RÉPARATION', score: 78 },
      { label: 'TEMPS INTERVENTION', score: 68 },
      { label: 'ALIGNEMENT ER', score: 70 }
    ],
    tasksCount: 4,
    workloadStatus: 'green'
  },
  {
    initials: 'DI',
    name: 'Dina',
    level: 'N4',
    role: 'Resp Pneus & Magasin Pièces',
    subLabel: '30j',
    score: 60,
    trend: 'down',
    trendPeriod: '30j',
    isCapRouge: true,
    metrics: [
      { label: 'EXÉCUTION', score: 58 },
      { label: 'TRAÇABILITÉ PNEUS', score: 55 },
      { label: 'GESTION STOCK', score: 62 },
      { label: 'ALIGNEMENT ER', score: 64 }
    ],
    tasksCount: 5,
    workloadStatus: 'red'
  },
  {
    initials: 'RA',
    name: 'Rado',
    level: 'N5',
    role: 'Assistant Atelier & Saisie OT',
    subLabel: '30j',
    score: 64,
    trend: 'stable',
    trendPeriod: '30j',
    isCapRouge: false,
    metrics: [
      { label: 'EXÉCUTION', score: 66 },
      { label: 'QUALITÉ SAISIE', score: 68 },
      { label: 'RESPECT DÉLAIS', score: 60 },
      { label: 'ALIGNEMENT ER', score: 62 }
    ],
    tasksCount: 3,
    workloadStatus: 'green'
  }
]
