import type {
  Inspection,
  HSEEvent,
  EPICheck,
  SiteInspection,
  CorrectiveAction,
  ManagerFeedItem,
} from './types'

// Use fixed dates to avoid hydration mismatch
const TODAY = new Date('2026-05-25T08:00:00')
const HOUR_AGO = new Date('2026-05-25T07:00:00')
const TWO_HOURS_AGO = new Date('2026-05-25T06:00:00')
const THREE_HOURS_AGO = new Date('2026-05-25T05:00:00')
const YESTERDAY = new Date('2026-05-24T08:00:00')
const TOMORROW = new Date('2026-05-26T08:00:00')
const IN_TWO_DAYS = new Date('2026-05-27T08:00:00')
const IN_THREE_DAYS = new Date('2026-05-28T08:00:00')
const IN_FIVE_DAYS = new Date('2026-05-30T08:00:00')
const IN_WEEK = new Date('2026-06-01T08:00:00')

// Mock Inspections
export const mockInspections: Inspection[] = [
  {
    id: 'INS-001',
    siteName: 'Mine Khouribga - Zone A',
    siteType: 'mine_loading',
    missionId: 'MIS-2024-0156',
    truckId: 'TRK-042',
    priority: 'critique',
    status: 'a_faire',
    syncStatus: 'synced',
    scheduledDate: TODAY,
    lastUpdated: TODAY,
  },
  {
    id: 'INS-002',
    siteName: 'Dépôt Casablanca Est',
    siteType: 'delivery',
    missionId: 'MIS-2024-0157',
    truckId: 'TRK-018',
    priority: 'attention',
    status: 'en_cours',
    syncStatus: 'pending',
    scheduledDate: TODAY,
    lastUpdated: HOUR_AGO,
  },
  {
    id: 'INS-003',
    siteName: 'Base Logistique Marrakech',
    siteType: 'parking_base',
    priority: 'normal',
    status: 'a_faire',
    syncStatus: 'synced',
    scheduledDate: TODAY,
    lastUpdated: TWO_HOURS_AGO,
  },
  {
    id: 'INS-004',
    siteName: 'Atelier Mécanique Fès',
    siteType: 'workshop',
    truckId: 'TRK-007',
    priority: 'attention',
    status: 'en_attente_correction',
    syncStatus: 'synced',
    scheduledDate: TODAY,
    lastUpdated: HOUR_AGO,
  },
  {
    id: 'INS-005',
    siteName: 'Point Contrôle RN9 - Km 145',
    siteType: 'route_checkpoint',
    missionId: 'MIS-2024-0158',
    truckId: 'TRK-031',
    priority: 'normal',
    status: 'cloture',
    syncStatus: 'synced',
    scheduledDate: YESTERDAY,
    lastUpdated: YESTERDAY,
  },
]

// Mock HSE Events
export const mockHSEEvents: HSEEvent[] = [
  {
    id: 'EVT-001',
    eventType: 'incident',
    dateTime: TODAY,
    location: 'Mine Khouribga - Zone A',
    gpsCoords: { lat: 32.8854, lng: -6.9063 },
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone A',
    truckId: 'TRK-042',
    driverName: 'Mohamed Benali',
    driverId: 'DRV-015',
    missionId: 'MIS-2024-0156',
    severity: 'eleve',
    immediateAction: 'Zone sécurisée, conducteur retiré',
    operationalImpact: 'arret_mission',
    notes: 'Collision mineure avec borne de signalisation lors de manœuvre',
    syncStatus: 'synced',
    escalated: true,
  },
  {
    id: 'EVT-002',
    eventType: 'near_miss',
    dateTime: TODAY,
    location: 'Dépôt Casablanca Est',
    siteId: 'SITE-002',
    siteName: 'Dépôt Casablanca Est',
    truckId: 'TRK-018',
    driverName: 'Youssef Amrani',
    missionId: 'MIS-2024-0157',
    severity: 'moyen',
    immediateAction: 'Briefing sécurité effectué',
    operationalImpact: 'retard',
    notes: 'Piéton a traversé zone de manœuvre sans autorisation',
    syncStatus: 'synced',
    escalated: false,
  },
  {
    id: 'EVT-003',
    eventType: 'non_conformite_epi',
    dateTime: TODAY,
    location: 'Base Logistique Marrakech',
    siteId: 'SITE-003',
    siteName: 'Base Logistique Marrakech',
    driverName: 'Karim Tazi',
    driverId: 'DRV-022',
    severity: 'faible',
    immediateAction: 'EPI fournis sur place',
    operationalImpact: 'aucun',
    notes: 'Absence de gilet haute visibilité',
    syncStatus: 'pending',
    escalated: false,
  },
  {
    id: 'EVT-004',
    eventType: 'fatigue_conducteur',
    dateTime: TODAY,
    location: 'Point Contrôle RN9 - Km 145',
    siteId: 'SITE-005',
    siteName: 'Point Contrôle RN9 - Km 145',
    truckId: 'TRK-031',
    driverName: 'Rachid Ouahbi',
    driverId: 'DRV-008',
    missionId: 'MIS-2024-0158',
    severity: 'critique',
    immediateAction: 'Conducteur mis au repos obligatoire',
    operationalImpact: 'arret_mission',
    notes: 'Conducteur présentant signes de fatigue avancée après 14h de conduite',
    syncStatus: 'synced',
    escalated: true,
  },
  {
    id: 'EVT-005',
    eventType: 'condition_dangereuse',
    dateTime: TODAY,
    location: 'Mine Khouribga - Zone B',
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone B',
    severity: 'eleve',
    immediateAction: 'Zone balisée et signalée',
    operationalImpact: 'blocage_chargement',
    notes: 'Affaissement de terrain sur voie d\'accès chargement',
    syncStatus: 'error',
    escalated: true,
  },
]

// Mock EPI Checks
export const mockEPIChecks: EPICheck[] = [
  {
    id: 'EPI-001',
    personName: 'Mohamed Benali',
    personId: 'DRV-015',
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone A',
    dateTime: TODAY,
    items: [
      { id: 'item-1', name: 'Casque', status: 'conforme', isCritical: true },
      { id: 'item-2', name: 'Gilet haute visibilité', status: 'conforme', isCritical: true },
      { id: 'item-3', name: 'Chaussures de sécurité', status: 'conforme', isCritical: true },
      { id: 'item-4', name: 'Gants', status: 'non_conforme', comment: 'Gants usés', isCritical: false },
      { id: 'item-5', name: 'Lunettes', status: 'conforme', isCritical: false },
      { id: 'item-6', name: 'Protection auditive', status: 'non_applicable', isCritical: false },
      { id: 'item-7', name: 'Masque / respirateur', status: 'conforme', isCritical: false },
      { id: 'item-8', name: 'Harnais', status: 'non_applicable', isCritical: false },
    ],
    complianceScore: 86,
    syncStatus: 'synced',
  },
]

// Mock Site Inspections (Truck/Dumptruck focused)
export const mockSiteInspections: SiteInspection[] = [
  {
    id: 'SINSP-001',
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone A',
    siteType: 'mine_loading',
    dateTime: HOUR_AGO,
    inspector: 'Ahmed Fassi',
    items: [
      { id: 'mi-1', label: 'Zone de chargement balisée', status: 'conforme' },
      { id: 'mi-2', label: 'Circulation camions sécurisée', status: 'conforme' },
      { id: 'mi-3', label: 'Distance de sécurité respectée', status: 'non_conforme', comment: 'Camions trop proches' },
      { id: 'mi-4', label: 'Communication avec opérateur chargeuse', status: 'conforme' },
      { id: 'mi-5', label: 'Poussière / visibilité acceptable', status: 'non_conforme', comment: 'Niveau poussière élevé' },
      { id: 'mi-6', label: 'Déversement ou pollution absent', status: 'conforme' },
      { id: 'mi-7', label: 'File d\'attente maîtrisée', status: 'conforme' },
      { id: 'mi-8', label: 'Procédure de chargement respectée', status: 'conforme' },
    ],
    score: 75,
    mainRiskDetected: 'Visibilité réduite et distances de sécurité non respectées',
    correctiveAction: 'Renforcer arrosage zone et briefing conducteurs',
    responsiblePerson: 'Chef de site Mine',
    dueDate: TOMORROW,
    syncStatus: 'synced',
  },
]

// Truck Inspection Templates - Inspection items by category
export const truckInspectionCategories = {
  cabine_exterieur: {
    label: 'Cabine & Extérieur',
    items: [
      { id: 'cab-1', label: 'État général carrosserie (bosses, rayures)', isCritical: false },
      { id: 'cab-2', label: 'Rétroviseurs intacts et bien fixés', isCritical: true },
      { id: 'cab-3', label: 'Pare-brise sans fissures majeures', isCritical: true },
      { id: 'cab-4', label: 'Essuie-glaces fonctionnels', isCritical: true },
      { id: 'cab-5', label: 'Portes et serrures fonctionnelles', isCritical: false },
      { id: 'cab-6', label: 'Marchepied en bon état', isCritical: false },
      { id: 'cab-7', label: 'Avertisseur sonore (klaxon)', isCritical: true },
      { id: 'cab-8', label: 'Propreté cabine', isCritical: false },
    ],
  },
  eclairage_signalisation: {
    label: 'Éclairage & Signalisation',
    items: [
      { id: 'ecl-1', label: 'Phares avant (codes/routes)', isCritical: true },
      { id: 'ecl-2', label: 'Feux de position avant', isCritical: true },
      { id: 'ecl-3', label: 'Feux stop arrière', isCritical: true },
      { id: 'ecl-4', label: 'Clignotants avant/arrière', isCritical: true },
      { id: 'ecl-5', label: 'Feux de recul', isCritical: true },
      { id: 'ecl-6', label: 'Gyrophare / feux de travail', isCritical: false },
      { id: 'ecl-7', label: 'Catadioptre et réflecteurs', isCritical: false },
      { id: 'ecl-8', label: 'Alarme de recul', isCritical: true },
    ],
  },
  pneumatiques: {
    label: 'Pneumatiques',
    items: [
      { id: 'pneu-1', label: 'Pression pneus avant', isCritical: true },
      { id: 'pneu-2', label: 'Pression pneus arrière', isCritical: true },
      { id: 'pneu-3', label: 'Usure bande de roulement avant', isCritical: true },
      { id: 'pneu-4', label: 'Usure bande de roulement arrière', isCritical: true },
      { id: 'pneu-5', label: 'Absence de coupures/hernies', isCritical: true },
      { id: 'pneu-6', label: 'Écrous de roue serrés', isCritical: true },
      { id: 'pneu-7', label: 'Roue de secours présente et état', isCritical: false },
      { id: 'pneu-8', label: 'Cales de roue présentes', isCritical: false },
    ],
  },
  freinage: {
    label: 'Système de Freinage',
    items: [
      { id: 'frein-1', label: 'Freins de service fonctionnels', isCritical: true },
      { id: 'frein-2', label: 'Frein de parking/stationnement', isCritical: true },
      { id: 'frein-3', label: 'Niveau liquide de frein', isCritical: true },
      { id: 'frein-4', label: 'Pression circuit pneumatique', isCritical: true },
      { id: 'frein-5', label: 'Témoin frein au tableau de bord', isCritical: true },
      { id: 'frein-6', label: 'Flexibles de frein (état)', isCritical: true },
      { id: 'frein-7', label: 'Ralentisseur/retarder (si équipé)', isCritical: false },
    ],
  },
  moteur_mecanique: {
    label: 'Moteur & Mécanique',
    items: [
      { id: 'mot-1', label: 'Niveau huile moteur', isCritical: true },
      { id: 'mot-2', label: 'Niveau liquide refroidissement', isCritical: true },
      { id: 'mot-3', label: 'Niveau AdBlue (si équipé)', isCritical: false },
      { id: 'mot-4', label: 'Fuites huile/carburant visibles', isCritical: true },
      { id: 'mot-5', label: 'État courroies (si visible)', isCritical: false },
      { id: 'mot-6', label: 'Batterie et connexions', isCritical: false },
      { id: 'mot-7', label: 'Filtre à air (si accessible)', isCritical: false },
      { id: 'mot-8', label: 'Démarrage moteur normal', isCritical: true },
    ],
  },
  benne_dumptruck: {
    label: 'Benne (Dumptruck)',
    items: [
      { id: 'ben-1', label: 'État général caisson/benne', isCritical: false },
      { id: 'ben-2', label: 'Vérins hydrauliques (fuites)', isCritical: true },
      { id: 'ben-3', label: 'Système de levage fonctionnel', isCritical: true },
      { id: 'ben-4', label: 'Verrouillage benne en position basse', isCritical: true },
      { id: 'ben-5', label: 'Hayon arrière (si équipé)', isCritical: false },
      { id: 'ben-6', label: 'Bâche/couverture présente', isCritical: false },
      { id: 'ben-7', label: 'Fissures/déformations caisson', isCritical: false },
      { id: 'ben-8', label: 'Charnières et fixations', isCritical: true },
    ],
  },
  hydraulique: {
    label: 'Système Hydraulique',
    items: [
      { id: 'hyd-1', label: 'Niveau huile hydraulique', isCritical: true },
      { id: 'hyd-2', label: 'Fuites circuit hydraulique', isCritical: true },
      { id: 'hyd-3', label: 'Flexibles hydrauliques (usure)', isCritical: true },
      { id: 'hyd-4', label: 'Commande de levage', isCritical: true },
      { id: 'hyd-5', label: 'Vitesse de levage/descente', isCritical: false },
      { id: 'hyd-6', label: 'Bruits anormaux pompe', isCritical: false },
    ],
  },
  securite_equipements: {
    label: 'Sécurité & Équipements',
    items: [
      { id: 'sec-1', label: 'Extincteur présent et valide', isCritical: true },
      { id: 'sec-2', label: 'Triangle de signalisation', isCritical: true },
      { id: 'sec-3', label: 'Trousse de premiers secours', isCritical: false },
      { id: 'sec-4', label: 'Gilet haute visibilité', isCritical: true },
      { id: 'sec-5', label: 'Ceinture de sécurité fonctionnelle', isCritical: true },
      { id: 'sec-6', label: 'Documents véhicule à bord', isCritical: true },
      { id: 'sec-7', label: 'Kit anti-pollution (absorbant)', isCritical: false },
      { id: 'sec-8', label: 'Lampe torche', isCritical: false },
    ],
  },
  transmission_direction: {
    label: 'Transmission & Direction',
    items: [
      { id: 'trans-1', label: 'Jeu direction acceptable', isCritical: true },
      { id: 'trans-2', label: 'Niveau huile direction assistée', isCritical: true },
      { id: 'trans-3', label: 'Embrayage fonctionnel', isCritical: true },
      { id: 'trans-4', label: 'Boîte de vitesses (passages)', isCritical: true },
      { id: 'trans-5', label: 'Cardans et soufflets', isCritical: false },
      { id: 'trans-6', label: 'Fuites transmission', isCritical: false },
    ],
  },
}

// Vehicle types for inspection
export const vehicleTypes = {
  camion_benne: 'Camion benne',
  dumptruck: 'Dumptruck minier',
  semi_remorque: 'Semi-remorque',
  porteur: 'Porteur',
  tracteur: 'Tracteur routier',
}

// Mock Fleet - Trucks / Dumptrucks
export type TruckStatus = 'disponible' | 'en_mission' | 'en_maintenance' | 'hors_service'
export type TruckType = 'camion_benne' | 'dumptruck' | 'semi_remorque' | 'porteur' | 'tracteur'

export interface Truck {
  id: string
  immatriculation: string
  type: TruckType
  marque: string
  modele: string
  km: number
  status: TruckStatus
  driverName?: string
  driverId?: string
  currentMission?: string
  currentSite?: string
  lastInspectionDate: Date
  lastInspectionScore: number
  nextInspectionDue: Date
  alertCount: number
  fuelLevel: number // 0-100
}

export const mockTrucks: Truck[] = [
  {
    id: 'TRK-042',
    immatriculation: '12345-A-78',
    type: 'dumptruck',
    marque: 'Caterpillar',
    modele: '775G',
    km: 145230,
    status: 'en_mission',
    driverName: 'Mohamed Benali',
    driverId: 'DRV-015',
    currentMission: 'MIS-2024-0156',
    currentSite: 'Mine Khouribga - Zone A',
    lastInspectionDate: YESTERDAY,
    lastInspectionScore: 92,
    nextInspectionDue: TOMORROW,
    alertCount: 1,
    fuelLevel: 65,
  },
  {
    id: 'TRK-018',
    immatriculation: '54321-B-12',
    type: 'camion_benne',
    marque: 'Volvo',
    modele: 'FMX 460',
    km: 89540,
    status: 'en_mission',
    driverName: 'Youssef Amrani',
    driverId: 'DRV-022',
    currentMission: 'MIS-2024-0157',
    currentSite: 'Dépôt Casablanca Est',
    lastInspectionDate: YESTERDAY,
    lastInspectionScore: 100,
    nextInspectionDue: IN_TWO_DAYS,
    alertCount: 0,
    fuelLevel: 45,
  },
  {
    id: 'TRK-007',
    immatriculation: '78901-C-34',
    type: 'semi_remorque',
    marque: 'Mercedes',
    modele: 'Actros 2545',
    km: 234100,
    status: 'en_maintenance',
    lastInspectionDate: new Date('2026-05-20T08:00:00'),
    lastInspectionScore: 68,
    nextInspectionDue: TODAY,
    alertCount: 3,
    fuelLevel: 30,
  },
  {
    id: 'TRK-031',
    immatriculation: '24680-D-56',
    type: 'porteur',
    marque: 'Renault',
    modele: 'T480',
    km: 178650,
    status: 'hors_service',
    driverName: 'Rachid Ouahbi',
    driverId: 'DRV-008',
    currentMission: 'MIS-2024-0158',
    currentSite: 'Point Contrôle RN9 - Km 145',
    lastInspectionDate: new Date('2026-05-23T08:00:00'),
    lastInspectionScore: 85,
    nextInspectionDue: IN_THREE_DAYS,
    alertCount: 2,
    fuelLevel: 80,
  },
  {
    id: 'TRK-055',
    immatriculation: '13579-E-90',
    type: 'tracteur',
    marque: 'Scania',
    modele: 'R500',
    km: 312800,
    status: 'disponible',
    lastInspectionDate: YESTERDAY,
    lastInspectionScore: 95,
    nextInspectionDue: IN_FIVE_DAYS,
    alertCount: 0,
    fuelLevel: 90,
  },
]

export const truckStatusLabels: Record<TruckStatus, string> = {
  disponible: 'Disponible',
  en_mission: 'En mission',
  en_maintenance: 'En maintenance',
  hors_service: 'Hors service',
}

// Quick inspection checklist for daily departure
export const dailyDepartureChecklist = [
  { id: 'dep-1', label: 'Tour du véhicule effectué', isCritical: true },
  { id: 'dep-2', label: 'Niveaux vérifiés (huile, eau, frein)', isCritical: true },
  { id: 'dep-3', label: 'Pneus contrôlés visuellement', isCritical: true },
  { id: 'dep-4', label: 'Éclairage testé', isCritical: true },
  { id: 'dep-5', label: 'Freins testés (parking + service)', isCritical: true },
  { id: 'dep-6', label: 'Rétroviseurs réglés', isCritical: true },
  { id: 'dep-7', label: 'Documents à bord', isCritical: true },
  { id: 'dep-8', label: 'EPI conducteur complets', isCritical: true },
  { id: 'dep-9', label: 'Benne/caisson vérifié', isCritical: false },
  { id: 'dep-10', label: 'Alarme de recul fonctionnelle', isCritical: true },
]

// Mock Corrective Actions
export const mockCorrectiveActions: CorrectiveAction[] = [
  {
    id: 'ACT-001',
    title: 'Réparer borne de signalisation endommagée',
    sourceEventId: 'EVT-001',
    sourceEventType: 'incident',
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone A',
    responsiblePerson: 'Équipe maintenance site',
    dueDate: IN_TWO_DAYS,
    priority: 'attention',
    status: 'en_cours',
    evidenceRequired: true,
    createdAt: HOUR_AGO,
  },
  {
    id: 'ACT-002',
    title: 'Former conducteur sur procédures manœuvre',
    sourceEventId: 'EVT-001',
    sourceEventType: 'incident',
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone A',
    responsiblePerson: 'Responsable formation HSE',
    dueDate: IN_WEEK,
    priority: 'normal',
    status: 'a_faire',
    evidenceRequired: true,
    createdAt: HOUR_AGO,
  },
  {
    id: 'ACT-003',
    title: 'Installer barrière piéton zone manœuvre',
    sourceEventId: 'EVT-002',
    sourceEventType: 'near_miss',
    siteId: 'SITE-002',
    siteName: 'Dépôt Casablanca Est',
    responsiblePerson: 'Chef dépôt',
    dueDate: YESTERDAY,
    priority: 'critique',
    status: 'en_retard',
    evidenceRequired: true,
    createdAt: new Date('2026-05-22T08:00:00'),
  },
  {
    id: 'ACT-004',
    title: 'Renforcer contrôle temps de conduite',
    sourceEventId: 'EVT-004',
    sourceEventType: 'fatigue_conducteur',
    siteId: 'SITE-005',
    siteName: 'Point Contrôle RN9 - Km 145',
    responsiblePerson: 'Exploitation Manager',
    dueDate: IN_THREE_DAYS,
    priority: 'critique',
    status: 'en_cours',
    evidenceRequired: false,
    createdAt: TWO_HOURS_AGO,
  },
  {
    id: 'ACT-005',
    title: 'Réparer affaissement voie accès',
    sourceEventId: 'EVT-005',
    sourceEventType: 'condition_dangereuse',
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone B',
    responsiblePerson: 'Travaux publics mine',
    dueDate: IN_FIVE_DAYS,
    priority: 'critique',
    status: 'a_faire',
    evidenceRequired: true,
    createdAt: THREE_HOURS_AGO,
  },
]

// Mock Manager Feed Items
export const mockManagerFeedItems: ManagerFeedItem[] = [
  {
    id: 'FEED-001',
    timestamp: HOUR_AGO,
    type: 'hse',
    title: 'Incident collision signalisation',
    description: 'Collision mineure avec borne de signalisation - TRK-042 - Mine Khouribga',
    severity: 'eleve',
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone A',
    truckId: 'TRK-042',
    missionId: 'MIS-2024-0156',
    syncStatus: 'synced',
    escalated: true,
  },
  {
    id: 'FEED-002',
    timestamp: TWO_HOURS_AGO,
    type: 'exploitation',
    title: 'Mission bloquée - Fatigue conducteur',
    description: 'Conducteur TRK-031 mis au repos - Mission MIS-2024-0158 en attente',
    severity: 'critique',
    siteId: 'SITE-005',
    siteName: 'Point Contrôle RN9 - Km 145',
    truckId: 'TRK-031',
    missionId: 'MIS-2024-0158',
    syncStatus: 'synced',
    escalated: true,
  },
  {
    id: 'FEED-003',
    timestamp: TWO_HOURS_AGO,
    type: 'hse',
    title: 'Non-conformité EPI détectée',
    description: 'Gants usés - Conducteur Karim Tazi - Base Marrakech',
    severity: 'faible',
    siteId: 'SITE-003',
    siteName: 'Base Logistique Marrakech',
    syncStatus: 'pending',
    escalated: false,
  },
  {
    id: 'FEED-004',
    timestamp: THREE_HOURS_AGO,
    type: 'exploitation',
    title: 'Blocage chargement - Condition dangereuse',
    description: 'Affaissement terrain voie accès - Mine Khouribga Zone B bloquée',
    severity: 'eleve',
    siteId: 'SITE-001',
    siteName: 'Mine Khouribga - Zone B',
    syncStatus: 'error',
    escalated: true,
  },
  {
    id: 'FEED-005',
    timestamp: THREE_HOURS_AGO,
    type: 'hse',
    title: 'Presqu\'accident piéton',
    description: 'Intrusion piéton zone manœuvre - Dépôt Casablanca Est',
    severity: 'moyen',
    siteId: 'SITE-002',
    siteName: 'Dépôt Casablanca Est',
    truckId: 'TRK-018',
    missionId: 'MIS-2024-0157',
    syncStatus: 'synced',
    escalated: false,
  },
]

// Helper data
export const siteTypes: Record<string, string> = {
  mine_loading: 'Site chargement mine',
  delivery: 'Site livraison',
  parking_base: 'Parking / Base',
  workshop: 'Atelier',
  route_checkpoint: 'Point contrôle route',
}

export const eventTypes: Record<string, string> = {
  incident: 'Incident',
  near_miss: 'Presqu\'accident',
  acte_dangereux: 'Acte dangereux',
  condition_dangereuse: 'Condition dangereuse',
  non_conformite_epi: 'Non-conformité EPI',
  fuite_pollution: 'Fuite / Pollution',
  fatigue_conducteur: 'Fatigue conducteur',
  exces_vitesse: 'Excès vitesse observé',
  chargement_dangereux: 'Chargement dangereux',
  zone_non_securisee: 'Zone non sécurisée',
  vehicule_non_conforme: 'Véhicule non conforme',
  autre: 'Autre observation',
}

export const severityLabels: Record<string, string> = {
  faible: 'Faible',
  moyen: 'Moyen',
  eleve: 'Élevé',
  critique: 'Critique',
}

export const operationalImpactLabels: Record<string, string> = {
  aucun: 'Aucun',
  retard: 'Retard',
  arret_mission: 'Arrêt mission',
  blocage_chargement: 'Blocage chargement',
  blocage_livraison: 'Blocage livraison',
  escalade_manager: 'Escalade manager',
}

export const priorityLabels: Record<string, string> = {
  normal: 'Normal',
  attention: 'Attention',
  critique: 'Critique',
}

export const statusLabels: Record<string, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  en_attente_correction: 'En attente correction',
  cloture: 'Clôturé',
  en_retard: 'En retard',
  termine: 'Terminé',
  verifie: 'Vérifié',
}

export const syncStatusLabels: Record<string, string> = {
  synced: 'Synchronisé',
  pending: 'En attente',
  error: 'Erreur sync',
}
