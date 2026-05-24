export interface Pillar {
  code: string
  label: string
  score: number
  tooltip: string
}

export interface KPICard {
  label: string
  value: string
  delta: string
  target: string
  status: 'green' | 'yellow' | 'red'
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
  forecastStatus: 'green' | 'yellow' | 'red' | 'warning'
  alertCount: number
}

export interface Driver {
  id: string
  nom: string
  camion: string
  corridor: string
  consoLkm: number
  consoObjectif: number
  conformiteTrajet: number
  voyagesMois: number
  kmMois: number
  goConsomme: number
  incidents: number
  score: number
  status: 'green' | 'yellow' | 'red'
  alertes: string[]
}

export interface TrajetRecent {
  date: string
  corridor: string
  dureeReelle: string
  dureeStandard: string
  ecart: string
  status: 'conforme' | 'retard'
  cause?: string
}

export interface FuelRecent {
  date: string
  station: string
  litres: number
  voyage: string
  bc: string
}

export interface ActionDriver {
  label: string
  responsable: string
  deadline: string
  status: 'done' | 'in_progress' | 'pending'
}

export interface DriverDetail {
  nom: string
  camion: string
  corridor: string
  score: number
  status: 'green' | 'yellow' | 'red'
  kpis: {
    consoLkm: number
    consoObjectif: number
    ecartPourcent: number
    conformiteTrajet: number
    voyagesMois: number
    kmMois: number
    goConsomme: number
    coutFuelMois: string
    incidents: number
  }
  trajetsRecents: TrajetRecent[]
  fuelRecent: FuelRecent[]
  alertes: string[]
  actions: ActionDriver[]
}

export interface TeamMember {
  initials: string
  name: string
  level: string
  role: string
  subLabel: string
  score: number
  trend: 'up' | 'down' | 'stable'
  trendPeriod: string
  isCapRouge: boolean
  metrics: { label: string; score: number }[]
  tasksCount: number
  workloadStatus: 'green' | 'yellow' | 'red'
}

export interface Alert {
  type: 'red' | 'yellow'
  message: string
  ref: string | null
}

export interface Arbitrage {
  description: string
  montant?: string
  action: string
  actionType: 'approve' | 'reject'
}

export interface PipelineStage {
  label: string
  icon: string
  count: number
}

export interface Pipeline {
  name: string
  stages: PipelineStage[]
}

export interface Indicateur {
  label: string
  value: string
  status: 'green' | 'yellow' | 'red'
  detail: string
}

export interface OneOnOne {
  lieutenant: string
  date: string
  sujet: string
  decisions: string
  prochaineAction: string
  deadline: string
  status: 'done' | 'in_progress' | 'pending'
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
