// LOI Cockpit Types - Maintenance Manager Transport

export type Status = 'green' | 'yellow' | 'red'
export type TrendDirection = 'up' | 'down' | 'stable'
export type ActionType = 'approve' | 'review' | 'execute'
export type MaintenanceType = 'préventif' | 'curatif'
export type TireCondition = 'BON' | 'MOYEN' | 'REMPLACER'
export type PreventiveStatus = 'ok' | 'pre_alerte' | 'depassement'
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Pillar {
  code: string
  label: string
  score: number
  tooltip: string
}

export interface KPICard {
  id: string
  label: string
  value: string
  delta: string
  target: string
  status: Status
}

export interface SOTracker {
  soCode: string
  soNumber: string
  owner: string
  deadline: string
  score: number
  title: string
  target: string
  current: string
  forecastStatus: Status | 'warning'
  alertCount: number
}

export interface Truck {
  id: string
  immatriculation: string
  code: string
  kmTotal: number
  kmMois: number
  coutPneuKm: number
  pneusTotal: number
  pneusARemplacer: number
  pneusMoyen: number
  pneusBon: number
  prochaineMaint: string
  kmAvantMaint: number
  otEnCours: number
  disponibilite: number
  coutMaintKm: number
  status: Status
  alertes: string[]
}

export interface TruckTire {
  position: string
  marque: string
  profil: string
  kmEffectue: number
  usurePourcent: number
  etat: TireCondition
}

export interface MaintenanceHistory {
  ref: string
  date: string
  type: MaintenanceType
  description: string
  cout: string
  duree: string
}

export interface PreventivePlan {
  intervention: string
  intervalle: string
  derniereFaite: string
  prochaine: string
  kmRestants: number
  status: PreventiveStatus
}

export interface TruckDetail {
  immatriculation: string
  code: string
  kmTotal: number
  status: Status
  disponibilite: number
  kpis: {
    kmMois: number
    coutMaintKm: number
    coutPneuKm: number
    otOuverts: number
    otClotures30j: number
    tauxPreventif: number
    pneusARemplacer: number
    derniereMaint: string
    prochaineMaint: string
    kmAvantMaint: number
  }
  pneus: TruckTire[]
  historiqueOT: MaintenanceHistory[]
  planPreventif: PreventivePlan[]
  alertes: string[]
}

export interface PipelineStep {
  icon: string
  label: string
  count: number
}

export interface Pipeline {
  id: string
  title: string
  steps: PipelineStep[]
}

export interface Indicator {
  label: string
  value: string
  status: Status
  detail: string
}

export interface Deadline {
  date: string
  objet: string
  camion: string
  responsable: string
  jMoins: string
  status: TaskStatus
}

export interface Alert {
  type: Status
  message: string
  ref: string | null
}

export interface Arbitrage {
  description: string
  montant?: string
  action: string
  actionType: ActionType
}

export interface TeamMember {
  initials: string
  name: string
  level: string
  role: string
  subLabel: string
  score: number
  trend: TrendDirection
  trendPeriod: string
  isCapRouge: boolean
  metrics: {
    label: string
    score: number
  }[]
  tasksCount: number
  workloadStatus: Status
}

export interface OneOnOne {
  lieutenant: string
  date: string
  sujet: string
  decisions: string
  prochaineAction: string
  deadline: string
  status: TaskStatus
}

export interface CoachingAction {
  lieutenant: string
  action: string
  deadline: string
  completed: boolean
}

export interface DevelopmentObjective {
  lieutenant: string
  objective: string
  progress: number
}

export interface TireBrandComparison {
  marque: string
  kmMoyenAvantHS: string
  tauxEclatement: string
  coutKmEstime: string
  verdict: string
}

export interface TruckRanking {
  position: number
  immatriculation: string
  coutKm: string
  code: string
  alert?: string
}
