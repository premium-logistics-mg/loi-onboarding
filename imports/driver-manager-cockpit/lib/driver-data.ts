import type { Driver, Pillar, KPICard, SOTracker, Alert, Arbitrage, TeamMember, DriverDetail } from './loi-types'

export const pillars: Pillar[] = [
  {
    code: 'P1',
    label: 'EXECUTION',
    score: 68,
    tooltip: 'SO·5 Decisions tracees · leaders actifs hebdo + M13 P0/P1 cloturees'
  },
  {
    code: 'P2',
    label: 'FUEL',
    score: 61,
    tooltip: 'SO·2 Fuel maitrise · conso ≤0.65 L/km + ecart livre/facture ≤1%'
  },
  {
    code: 'P3',
    label: 'FLOTTE',
    score: 72,
    tooltip: 'SO·2 Flotte productive · conformite trajet ≥95% + suivi GPS 100%'
  },
  {
    code: 'P4',
    label: 'SECURITE',
    score: 65,
    tooltip: 'SO·2 Zero incident · respect vitesse + reporting chauffeur complet'
  }
]

export const kpiCards: KPICard[] = [
  {
    label: 'CONSO FUEL FLOTTE',
    value: '0.69 L/km',
    delta: '+0.04',
    target: 'Cible ≤0.65',
    status: 'yellow'
  },
  {
    label: 'CONFORMITE TRAJET',
    value: '91%',
    delta: '-2%',
    target: 'Cible ≥95%',
    status: 'red'
  },
  {
    label: 'ECART GO LIVRE/FACTURE',
    value: '2.3%',
    delta: '+0.8%',
    target: 'Cible ≤1%',
    status: 'red'
  },
  {
    label: 'CHAUFFEURS EN ALERTE',
    value: '4 / 18',
    delta: '+1',
    target: 'Cible 0',
    status: 'red'
  }
]

export const soTracker: SOTracker = {
  soCode: 'SO·2',
  soNumber: '#2',
  owner: 'RIJA',
  deadline: '31/08/26',
  score: 66,
  title: 'Flotte productive & fuel maitrise',
  target: 'Conso ≤0.65 L/km',
  current: 'Conso 0.69 L/km',
  forecastStatus: 'warning',
  alertCount: 7
}

export const drivers: Driver[] = [
  {
    id: 'DRV-001',
    nom: 'Rakoto',
    camion: '6851TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.694,
    consoObjectif: 0.65,
    conformiteTrajet: 82,
    voyagesMois: 13,
    kmMois: 6014,
    goConsomme: 4175,
    incidents: 3,
    score: 48,
    status: 'red',
    alertes: ['Surconsommation +7%', 'Retard 4h corridor TMM→MMG', 'Arret non autorise 2h']
  },
  {
    id: 'DRV-002',
    nom: 'Bema',
    camion: '6846TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.693,
    consoObjectif: 0.65,
    conformiteTrajet: 91,
    voyagesMois: 11,
    kmMois: 6814,
    goConsomme: 4725,
    incidents: 1,
    score: 58,
    status: 'yellow',
    alertes: ['Surconsommation +7%']
  },
  {
    id: 'DRV-003',
    nom: 'Haja R.',
    camion: '7057TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.625,
    consoObjectif: 0.65,
    conformiteTrajet: 96,
    voyagesMois: 14,
    kmMois: 6578,
    goConsomme: 4110,
    incidents: 0,
    score: 82,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-004',
    nom: 'Tsiry',
    camion: '7052TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.660,
    consoObjectif: 0.65,
    conformiteTrajet: 92,
    voyagesMois: 13,
    kmMois: 6314,
    goConsomme: 4170,
    incidents: 1,
    score: 65,
    status: 'yellow',
    alertes: ['Surconsommation legere +2%']
  },
  {
    id: 'DRV-005',
    nom: 'Fidy',
    camion: '6838TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.679,
    consoObjectif: 0.65,
    conformiteTrajet: 88,
    voyagesMois: 12,
    kmMois: 6104,
    goConsomme: 4145,
    incidents: 2,
    score: 52,
    status: 'red',
    alertes: ['Surconsommation +4%', 'Arret non autorise 2h']
  },
  {
    id: 'DRV-006',
    nom: 'Lanto',
    camion: '7046TCB',
    corridor: 'MMG→ADM',
    consoLkm: 0.676,
    consoObjectif: 0.75,
    conformiteTrajet: 100,
    voyagesMois: 6,
    kmMois: 3432,
    goConsomme: 2320,
    incidents: 0,
    score: 78,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-007',
    nom: 'Koto',
    camion: '6844TCB',
    corridor: 'MMG→ADM',
    consoLkm: 0.644,
    consoObjectif: 0.75,
    conformiteTrajet: 100,
    voyagesMois: 6,
    kmMois: 3539,
    goConsomme: 2280,
    incidents: 0,
    score: 88,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-008',
    nom: 'Nary',
    camion: '6840TCB',
    corridor: 'MMG→ADM',
    consoLkm: 0.634,
    consoObjectif: 0.75,
    conformiteTrajet: 100,
    voyagesMois: 4,
    kmMois: 2399,
    goConsomme: 1520,
    incidents: 0,
    score: 90,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-009',
    nom: 'Solo',
    camion: '7054TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.644,
    consoObjectif: 0.65,
    conformiteTrajet: 95,
    voyagesMois: 14,
    kmMois: 7087,
    goConsomme: 4565,
    incidents: 0,
    score: 85,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-010',
    nom: 'Doda',
    camion: '7003TCB',
    corridor: 'MMG→ADM',
    consoLkm: 0.693,
    consoObjectif: 0.75,
    conformiteTrajet: 83,
    voyagesMois: 5,
    kmMois: 3837,
    goConsomme: 2660,
    incidents: 2,
    score: 55,
    status: 'yellow',
    alertes: ['2 retards corridor MMG→ADM']
  },
  {
    id: 'DRV-011',
    nom: 'Misa',
    camion: '7004TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.640,
    consoObjectif: 0.65,
    conformiteTrajet: 97,
    voyagesMois: 13,
    kmMois: 6375,
    goConsomme: 4080,
    incidents: 0,
    score: 87,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-012',
    nom: 'Njaka',
    camion: '7049TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.616,
    consoObjectif: 0.65,
    conformiteTrajet: 98,
    voyagesMois: 11,
    kmMois: 5749,
    goConsomme: 3540,
    incidents: 0,
    score: 91,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-013',
    nom: 'Tiana',
    camion: '7066TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.578,
    consoObjectif: 0.65,
    conformiteTrajet: 100,
    voyagesMois: 11,
    kmMois: 5025,
    goConsomme: 2905,
    incidents: 0,
    score: 95,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-014',
    nom: 'Vola',
    camion: '6839TCB',
    corridor: 'MMG→ADM',
    consoLkm: 0.608,
    consoObjectif: 0.75,
    conformiteTrajet: 100,
    voyagesMois: 7,
    kmMois: 3748,
    goConsomme: 2280,
    incidents: 0,
    score: 92,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-015',
    nom: 'Aina',
    camion: '6842TCB',
    corridor: 'MMG→ADM',
    consoLkm: 0.606,
    consoObjectif: 0.75,
    conformiteTrajet: 95,
    voyagesMois: 6,
    kmMois: 3133,
    goConsomme: 1900,
    incidents: 0,
    score: 88,
    status: 'green',
    alertes: []
  },
  {
    id: 'DRV-016',
    nom: 'Faniry',
    camion: '6845TCB',
    corridor: 'MMG→ADM',
    consoLkm: 0.664,
    consoObjectif: 0.75,
    conformiteTrajet: 80,
    voyagesMois: 5,
    kmMois: 3436,
    goConsomme: 2280,
    incidents: 2,
    score: 56,
    status: 'yellow',
    alertes: ['2 retards corridor MMG→ADM', 'Vitesse excessive detectee']
  },
  {
    id: 'DRV-017',
    nom: 'Hasina',
    camion: '7045TCB',
    corridor: 'MMG→ADM',
    consoLkm: 0.660,
    consoObjectif: 0.75,
    conformiteTrajet: 83,
    voyagesMois: 6,
    kmMois: 3453,
    goConsomme: 2280,
    incidents: 1,
    score: 62,
    status: 'yellow',
    alertes: ['1 retard corridor MMG→ADM']
  },
  {
    id: 'DRV-018',
    nom: 'Zo',
    camion: '6843TCB',
    corridor: 'TMM→MMG',
    consoLkm: 0.659,
    consoObjectif: 0.65,
    conformiteTrajet: 90,
    voyagesMois: 11,
    kmMois: 5305,
    goConsomme: 3495,
    incidents: 1,
    score: 63,
    status: 'yellow',
    alertes: ['Surconsommation legere +1%']
  }
]

export const alerts: Alert[] = [
  { type: 'red', message: 'Rakoto (6851TCB) — Arret non autorise 2h + retard 4h le 22 mai', ref: 'DRV-001' },
  { type: 'red', message: 'Ecart GO > 500L — GALANA TMM Avril (850L non justifies)', ref: 'FUEL-042' },
  { type: 'red', message: 'Fidy (6838TCB) — 2eme arret non autorise ce mois', ref: 'DRV-005' },
  { type: 'yellow', message: 'Bema (6846TCB) — Tracker GPS HS depuis 48h', ref: 'DRV-002' },
  { type: 'yellow', message: 'Conformite TMM→MMG < 90% — tendance baissiere', ref: null },
  { type: 'yellow', message: 'Faniry (6845TCB) — Vitesse excessive detectee 2x cette semaine', ref: 'DRV-016' },
  { type: 'yellow', message: 'Rapport GPS J-1 non transmis par agent Feno', ref: null }
]

export const arbitrages: Arbitrage[] = [
  { description: 'Sanction Rakoto — 3 incidents consecutifs (arret + retard + surconso)', action: 'Decider sanction', actionType: 'approve' },
  { description: 'Reclamation GALANA TMM — 850L ecart non justifie', montant: '3.4M Ar', action: 'Valider reclamation', actionType: 'approve' },
  { description: 'Remplacement tracker GPS 6846TCB (Bema)', montant: '1.2M Ar', action: 'Approuver achat', actionType: 'approve' },
  { description: 'Reaffectation Fidy — Corridor TMM→MMG vers MMG→ADM (moins exigeant)', action: 'Valider transfert', actionType: 'approve' }
]

export const teamMembers: TeamMember[] = [
  {
    initials: 'AN',
    name: 'Andry',
    level: 'N4',
    role: 'Resp Fuel & Rapprochement',
    subLabel: '30j',
    score: 64,
    trend: 'down',
    trendPeriod: '30j',
    isCapRouge: false,
    metrics: [
      { label: 'EXECUTION', score: 62 },
      { label: 'QUALITE DONNEES', score: 68 },
      { label: 'RESPECT DELAIS', score: 60 },
      { label: 'ALIGNEMENT ER', score: 66 }
    ],
    tasksCount: 6,
    workloadStatus: 'yellow'
  },
  {
    initials: 'FE',
    name: 'Feno',
    level: 'N4',
    role: 'Agent GPS Tracker & Reporting',
    subLabel: '30j',
    score: 71,
    trend: 'up',
    trendPeriod: '30j',
    isCapRouge: false,
    metrics: [
      { label: 'EXECUTION', score: 74 },
      { label: 'REACTIVITE ALERTES', score: 72 },
      { label: 'QUALITE REPORTING', score: 68 },
      { label: 'ALIGNEMENT ER', score: 70 }
    ],
    tasksCount: 5,
    workloadStatus: 'green'
  },
  {
    initials: 'TO',
    name: 'Tojo',
    level: 'N4',
    role: 'Superviseur Chauffeurs',
    subLabel: '30j',
    score: 58,
    trend: 'down',
    trendPeriod: '30j',
    isCapRouge: true,
    metrics: [
      { label: 'EXECUTION', score: 55 },
      { label: 'DISCIPLINE CHAUFFEURS', score: 52 },
      { label: 'SUIVI TERRAIN', score: 62 },
      { label: 'ALIGNEMENT ER', score: 60 }
    ],
    tasksCount: 4,
    workloadStatus: 'red'
  },
  {
    initials: 'NA',
    name: 'Naina',
    level: 'N5',
    role: 'Assistant Saisie Fuel & BC',
    subLabel: '30j',
    score: 66,
    trend: 'stable',
    trendPeriod: '30j',
    isCapRouge: false,
    metrics: [
      { label: 'EXECUTION', score: 68 },
      { label: 'QUALITE SAISIE', score: 70 },
      { label: 'RESPECT DELAIS', score: 62 },
      { label: 'ALIGNEMENT ER', score: 64 }
    ],
    tasksCount: 3,
    workloadStatus: 'green'
  }
]

export function getDriverDetail(driverId: string): DriverDetail | null {
  const driver = drivers.find(d => d.id === driverId)
  if (!driver) return null

  // Generate mock detail data based on driver
  const ecartPourcent = ((driver.consoLkm - driver.consoObjectif) / driver.consoObjectif) * 100

  if (driverId === 'DRV-001') {
    return {
      nom: 'Rakoto',
      camion: '6851TCB',
      corridor: 'TMM→MMG',
      score: 48,
      status: 'red',
      kpis: {
        consoLkm: 0.694,
        consoObjectif: 0.65,
        ecartPourcent: 6.8,
        conformiteTrajet: 82,
        voyagesMois: 13,
        kmMois: 6014,
        goConsomme: 4175,
        coutFuelMois: '12.5M Ar',
        incidents: 3
      },
      trajetsRecents: [
        { date: '22 mai', corridor: 'TMM→MMG', dureeReelle: '16h', dureeStandard: '12h', ecart: '+4h', status: 'retard', cause: 'Arret non autorise 2h + embouteillage' },
        { date: '20 mai', corridor: 'MMG→TMM', dureeReelle: '11h30', dureeStandard: '12h', ecart: '-30min', status: 'conforme' },
        { date: '18 mai', corridor: 'TMM→MMG', dureeReelle: '13h', dureeStandard: '12h', ecart: '+1h', status: 'retard', cause: 'Deviation route' },
        { date: '16 mai', corridor: 'MMG→TMM', dureeReelle: '11h', dureeStandard: '12h', ecart: '-1h', status: 'conforme' },
        { date: '14 mai', corridor: 'TMM→MMG', dureeReelle: '12h30', dureeStandard: '12h', ecart: '+30min', status: 'retard', cause: 'Attente dechargement' }
      ],
      fuelRecent: [
        { date: '22 mai', station: 'GALANA TMM', litres: 400, voyage: 'TMM→MMG', bc: 'BC-2026-0412' },
        { date: '20 mai', station: 'GALANA MMG', litres: 380, voyage: 'MMG→TMM', bc: 'BC-2026-0398' },
        { date: '18 mai', station: 'GALANA TMM', litres: 400, voyage: 'TMM→MMG', bc: 'BC-2026-0385' },
        { date: '16 mai', station: 'GALANA MMG', litres: 400, voyage: 'MMG→TMM', bc: 'BC-2026-0371' },
        { date: '14 mai', station: 'GALANA TMM', litres: 400, voyage: 'TMM→MMG', bc: 'BC-2026-0358' }
      ],
      alertes: [
        'Surconsommation +7% vs objectif (0.694 vs 0.65 L/km)',
        'Retard 4h corridor TMM→MMG le 22 mai',
        'Arret non autorise 2h detecte GPS le 22 mai'
      ],
      actions: [
        { label: 'Entretien disciplinaire', responsable: 'Rija', deadline: '26 mai', status: 'pending' },
        { label: 'Plan correction conduite', responsable: 'Tojo', deadline: '30 mai', status: 'pending' },
        { label: 'Suivi GPS renforce 30j', responsable: 'Feno', deadline: '22 juin', status: 'in_progress' }
      ]
    }
  }

  // Generate generic detail for other drivers
  return {
    nom: driver.nom,
    camion: driver.camion,
    corridor: driver.corridor,
    score: driver.score,
    status: driver.status,
    kpis: {
      consoLkm: driver.consoLkm,
      consoObjectif: driver.consoObjectif,
      ecartPourcent: Math.round(ecartPourcent * 10) / 10,
      conformiteTrajet: driver.conformiteTrajet,
      voyagesMois: driver.voyagesMois,
      kmMois: driver.kmMois,
      goConsomme: driver.goConsomme,
      coutFuelMois: `${Math.round(driver.goConsomme * 3 / 1000)}M Ar`,
      incidents: driver.incidents
    },
    trajetsRecents: [
      { date: '22 mai', corridor: driver.corridor, dureeReelle: '12h', dureeStandard: '12h', ecart: '0', status: 'conforme' },
      { date: '20 mai', corridor: driver.corridor.split('→').reverse().join('→'), dureeReelle: '11h30', dureeStandard: '12h', ecart: '-30min', status: 'conforme' },
      { date: '18 mai', corridor: driver.corridor, dureeReelle: '12h30', dureeStandard: '12h', ecart: '+30min', status: driver.conformiteTrajet >= 95 ? 'conforme' : 'retard' }
    ],
    fuelRecent: [
      { date: '22 mai', station: 'GALANA TMM', litres: 350, voyage: driver.corridor, bc: 'BC-2026-0410' },
      { date: '20 mai', station: 'GALANA MMG', litres: 340, voyage: driver.corridor.split('→').reverse().join('→'), bc: 'BC-2026-0395' }
    ],
    alertes: driver.alertes,
    actions: driver.incidents > 0 ? [
      { label: 'Suivi renforce', responsable: 'Tojo', deadline: '30 mai', status: 'in_progress' }
    ] : []
  }
}
