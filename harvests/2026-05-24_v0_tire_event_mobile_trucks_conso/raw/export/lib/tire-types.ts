export type EventType = 'montage' | 'permutation' | 'eclatement' | 'reception'

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
  photo?: string
  proofPhotos?: string[] // Multiple proof photos
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

export const VEHICLES: Vehicle[] = [
  { code: 'S001', plate: '1234 TCB', type: 'SCHACMAN' },
  { code: 'S002', plate: '5678 TCB', type: 'SCHACMAN' },
  { code: 'S003', plate: '9012 TCB', type: 'KERAX' },
  { code: 'S004', plate: '3456 TCB', type: 'KERAX' },
  { code: 'S005', plate: '7890 TCB', type: 'SCHACMAN' },
  { code: 'S006', plate: '1357 TCB', type: 'SCHACMAN' },
  { code: 'S007', plate: '2468 TCB', type: 'KERAX' },
  { code: 'S008', plate: '9753 TCB', type: 'SCHACMAN' },
  { code: 'S009', plate: '8642 TCB', type: 'KERAX' },
  { code: 'S010', plate: '1928 TCB', type: 'SCHACMAN' },
  { code: 'S011', plate: '3746 TCB', type: 'KERAX' },
  { code: 'S012', plate: '5564 TCB', type: 'SCHACMAN' },
  { code: 'S013', plate: '7382 TCB', type: 'KERAX' },
  { code: 'S014', plate: '9100 TCB', type: 'SCHACMAN' },
  { code: 'S015', plate: '2819 TCB', type: 'SCHACMAN' },
  { code: 'S016', plate: '4637 TCB', type: 'KERAX' },
  { code: 'S017', plate: '6455 TCB', type: 'SCHACMAN' },
  { code: 'S018', plate: '8273 TCB', type: 'KERAX' },
  { code: 'S019', plate: '0091 TCB', type: 'SCHACMAN' },
  { code: 'S020', plate: '1809 TCB', type: 'KERAX' },
]

export const BRANDS = [
  'ONYX',
  'LONG MARCH',
  'HONSWAY',
  'GENCOTIRE',
  'GOLDEN',
] as const

export const REFERENCES = [
  '315/80R22,5',
  '12R22,5',
  '385/65R22,5',
  '295/80R22,5',
  '13R22,5',
] as const

// Axle positions for a typical truck configuration
export interface AxlePosition {
  id: string
  label: string
  axle: 'DIR' | 'MOT' | 'REM'
  position: 'G' | 'D' | 'INT-G' | 'INT-D' | 'EXT-G' | 'EXT-D'
  essieu: number
}

export const AXLE_POSITIONS: AxlePosition[] = [
  // Direction (front axle)
  { id: 'DIR-1ESS-G', label: 'DIR 1ESS-G', axle: 'DIR', position: 'G', essieu: 1 },
  { id: 'DIR-1ESS-D', label: 'DIR 1ESS-D', axle: 'DIR', position: 'D', essieu: 1 },
  
  // Moteur (drive axles - dual wheels)
  { id: 'MOT-2ESS-INT-G', label: 'MOT 2ESS-INT-G', axle: 'MOT', position: 'INT-G', essieu: 2 },
  { id: 'MOT-2ESS-INT-D', label: 'MOT 2ESS-INT-D', axle: 'MOT', position: 'INT-D', essieu: 2 },
  { id: 'MOT-2ESS-EXT-G', label: 'MOT 2ESS-EXT-G', axle: 'MOT', position: 'EXT-G', essieu: 2 },
  { id: 'MOT-2ESS-EXT-D', label: 'MOT 2ESS-EXT-D', axle: 'MOT', position: 'EXT-D', essieu: 2 },
  { id: 'MOT-3ESS-INT-G', label: 'MOT 3ESS-INT-G', axle: 'MOT', position: 'INT-G', essieu: 3 },
  { id: 'MOT-3ESS-INT-D', label: 'MOT 3ESS-INT-D', axle: 'MOT', position: 'INT-D', essieu: 3 },
  { id: 'MOT-3ESS-EXT-G', label: 'MOT 3ESS-EXT-G', axle: 'MOT', position: 'EXT-G', essieu: 3 },
  { id: 'MOT-3ESS-EXT-D', label: 'MOT 3ESS-EXT-D', axle: 'MOT', position: 'EXT-D', essieu: 3 },
  
  // Remorque (trailer axles)
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
    description: 'Installation d\'un nouveau pneu',
  },
  permutation: {
    label: 'Permutation',
    icon: '🔄',
    description: 'Rotation de pneus entre positions',
  },
  eclatement: {
    label: 'Éclatement / Usure',
    icon: '💥',
    description: 'Pneu hors service (preuve photo requise)',
  },
  reception: {
    label: 'Réception',
    icon: '📦',
    description: 'Entrée en stock d\'un pneu neuf',
  },
}

export const URGENCY_LABELS: Record<UrgencyLevel, { label: string; color: string }> = {
  immediate: { label: 'Immédiat', color: 'destructive' },
  today: { label: 'Aujourd\'hui', color: 'warning' },
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
  'Pneu besoin de gonflage',
  'Usure anormale côté extérieur',
  'Usure anormale côté intérieur',
  'Usure au centre',
  'Hernie détectée',
  'Coupure sur le flanc',
  'Crevaison - réparable',
  'Crevaison - non réparable',
  'À recreuser',
  'À rechaper',
  'Pression insuffisante',
  'Valve défectueuse',
] as const
