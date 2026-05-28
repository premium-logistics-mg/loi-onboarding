// LOI D82 · module pneu terrain (trucks-conso · N5)
// Types + données canoniques. AUCUNE donnée inventée.

// 5 types d'événement canoniques
export type EventType =
  | 'montage' // Montage
  | 'depose' // Dépose (remove) — photo obligatoire
  | 'inspection' // Inspection
  | 'reparation' // Réparation
  | 'remplacement' // Remplacement

export type UrgencyLevel = 'immediate' | 'today' | 'week' | 'next_visit'
export type EscalationTarget = 'vulca_lucas' | 'chef_parc' | 'direction' | 'fournisseur'

export interface TreadMeasurement {
  exterior: number // mm
  center: number // mm
  interior: number // mm
}

export interface DecisionNote {
  observation: string
  escalation?: EscalationTarget
  urgency: UrgencyLevel
  customComment?: string
}

export interface TireEvent {
  id: string
  type: EventType
  vehicleCode: string
  vehiclePlate: string
  axlePosition: string
  brand: string
  serialNumber: string
  reference: string
  profile?: string
  currentKm: number
  wear?: boolean // usure signalée — photo obligatoire si vrai
  photo?: string
  proofPhotos?: string[] // photos preuve (data URL via input file natif)
  treadDepth?: TreadMeasurement
  decisionNote?: DecisionNote
  timestamp: Date
  synced: boolean
}

export interface Vehicle {
  code: string
  plate: string
  type: 'SCHACMAN' | 'KERAX'
}

// TODO réconcilier master dataset CT-001..CT-015 / S00x — une seule source de vérité
// MVP : un seul véhicule seed (le sélecteur affiche recherche + cet item).
export const VEHICLES: Vehicle[] = [
  { code: 'PNE-001', plate: '1234', type: 'SCHACMAN' },
]

// 5 marques canoniques uniquement
export const BRANDS = [
  'ONYX',
  'LONG MARCH',
  'HONSWAY',
  'GENCOTIRE',
  'GOLDEN',
] as const

// Références canoniques (2)
export const REFERENCES = [
  '315/80R22,5',
  '12R22,5',
] as const

// Positions pneu — codes canoniques :
// famille MOT (moteur) / DIR (direction) / REM (remorque)
// + essieu (ESS1/ESS2/ESS3) + EXT/INT + G/D
// ex. "MOT 2ESS-EXT-G", "DIR-D"
export interface AxlePosition {
  id: string
  label: string
  axle: 'DIR' | 'MOT' | 'REM'
  position: 'G' | 'D' | 'INT-G' | 'INT-D' | 'EXT-G' | 'EXT-D'
  essieu: number
}

export const AXLE_POSITIONS: AxlePosition[] = [
  // Direction (essieu avant)
  { id: 'DIR-1ESS-G', label: 'DIR 1ESS-G', axle: 'DIR', position: 'G', essieu: 1 },
  { id: 'DIR-1ESS-D', label: 'DIR 1ESS-D', axle: 'DIR', position: 'D', essieu: 1 },

  // Moteur (essieux tracteurs · roues jumelées)
  { id: 'MOT-2ESS-INT-G', label: 'MOT 2ESS-INT-G', axle: 'MOT', position: 'INT-G', essieu: 2 },
  { id: 'MOT-2ESS-INT-D', label: 'MOT 2ESS-INT-D', axle: 'MOT', position: 'INT-D', essieu: 2 },
  { id: 'MOT-2ESS-EXT-G', label: 'MOT 2ESS-EXT-G', axle: 'MOT', position: 'EXT-G', essieu: 2 },
  { id: 'MOT-2ESS-EXT-D', label: 'MOT 2ESS-EXT-D', axle: 'MOT', position: 'EXT-D', essieu: 2 },
  { id: 'MOT-3ESS-INT-G', label: 'MOT 3ESS-INT-G', axle: 'MOT', position: 'INT-G', essieu: 3 },
  { id: 'MOT-3ESS-INT-D', label: 'MOT 3ESS-INT-D', axle: 'MOT', position: 'INT-D', essieu: 3 },
  { id: 'MOT-3ESS-EXT-G', label: 'MOT 3ESS-EXT-G', axle: 'MOT', position: 'EXT-G', essieu: 3 },
  { id: 'MOT-3ESS-EXT-D', label: 'MOT 3ESS-EXT-D', axle: 'MOT', position: 'EXT-D', essieu: 3 },

  // Remorque (essieux remorque)
  { id: 'REM-1ESS-G', label: 'REM 1ESS-G', axle: 'REM', position: 'G', essieu: 1 },
  { id: 'REM-1ESS-D', label: 'REM 1ESS-D', axle: 'REM', position: 'D', essieu: 1 },
  { id: 'REM-2ESS-G', label: 'REM 2ESS-G', axle: 'REM', position: 'G', essieu: 2 },
  { id: 'REM-2ESS-D', label: 'REM 2ESS-D', axle: 'REM', position: 'D', essieu: 2 },
  { id: 'REM-3ESS-G', label: 'REM 3ESS-G', axle: 'REM', position: 'G', essieu: 3 },
  { id: 'REM-3ESS-D', label: 'REM 3ESS-D', axle: 'REM', position: 'D', essieu: 3 },
]

export const EVENT_LABELS: Record<EventType, { label: string; icon: string; description: string }> = {
  montage: {
    label: 'Montage',
    icon: '🔧',
    description: 'Poser un pneu sur le camion',
  },
  depose: {
    label: 'Dépose',
    icon: '⬇️',
    description: 'Retirer un pneu (photo obligatoire)',
  },
  inspection: {
    label: 'Inspection',
    icon: '🔍',
    description: 'Contrôle visuel du pneu',
  },
  reparation: {
    label: 'Réparation',
    icon: '🛠️',
    description: 'Réparer un pneu en place',
  },
  remplacement: {
    label: 'Remplacement',
    icon: '🔄',
    description: 'Changer un pneu usé',
  },
}

export const URGENCY_LABELS: Record<UrgencyLevel, { label: string; color: string }> = {
  immediate: { label: 'Tout de suite', color: 'destructive' },
  today: { label: "Aujourd'hui", color: 'warning' },
  week: { label: 'Cette semaine', color: 'primary' },
  next_visit: { label: 'Prochaine visite', color: 'muted' },
}

export const ESCALATION_LABELS: Record<EscalationTarget, string> = {
  vulca_lucas: 'Vulca Lucas',
  chef_parc: 'Chef de parc',
  direction: 'Direction',
  fournisseur: 'Fournisseur',
}

export const PRESET_OBSERVATIONS = [
  'Besoin de gonflage',
  'Usure côté extérieur',
  'Usure côté intérieur',
  'Usure au centre',
  'Hernie',
  'Coupure sur le flanc',
  'Crevaison réparable',
  'Crevaison non réparable',
  'À recreuser',
  'À rechaper',
  'Pression insuffisante',
  'Valve défectueuse',
] as const
