// Fleet Grid Types
export type DriverStatusEmoji = '🟢' | '🚌' | '🤒' | '🔴'

export interface Badge {
  type: 'top5_econome' | 'preservateur' | 'permis_alerte' | 'medicale_alerte'
  label: string
  jours?: number
}

export interface FleetDriverCard {
  code: string
  score: number | null
  statusEmoji: DriverStatusEmoji
  nom: string
  prenom: string
  vehicule: string
  badges: Badge[]
}

// Overview KPI Types
export interface OverviewKPICard {
  title: string
  subtitle: string
  icon?: string
  color: 'green' | 'yellow' | 'red' | 'teal' | 'neutral' | 'amber'
  mainValue?: string
  detail?: string
  secondLine?: string
  data?: { ref?: string; icon?: string; value: string; delta?: string }[]
}

// Workflow Types
export interface Workflow {
  icon: string
  title: string
  description: string
}

// Signaux HSE Types
export interface SignalHSE {
  id: string
  severity: 'warning' | 'critical'
  description: string
  status: 'open' | 'acknowledged' | 'closed'
}

export interface SignauxHSEData {
  title: string
  subtitle: string
  rightLabel: string
  filter: string[]
  signals: SignalHSE[]
  bascule: {
    label: string
    detail: string
  }
}

// Driver Profile 360° Types
export interface DriverIdentity {
  matricule: string
  typeContrat: string
  permis: string
  medicaleProchaine: string
  dateEmbauche: string
  anciennete: string
  vehiculePrincipal: string
  corridor: string
  telephone: string
  contactUrgence: string
  adresse: string
  formations: string[]
}

export interface DriverPerformance {
  scoreGlobal: number
  trend: 'up' | 'down' | 'stable'
  consoL100km: number
  consoObjectif: number
  ecartFuel: string
  rankFuel: number
  conformiteTrajet: number
  retards30j: number
  voyagesMois: number
  kmMois: number
  historiqueScore: { mois: string; score: number }[]
  percentile: number
}

export interface SafetyEvent {
  date: string
  type: 'near_miss' | 'incident' | 'accident'
  severity: number
  description: string
  status: 'open' | 'acknowledged' | 'closed'
  actionPrise: string
}

export interface DriverSafety {
  safetyScore: number
  events30j: number
  events90j: number
  eventsYTD: number
  safetyEvents: SafetyEvent[]
  ceinture30j: number
  vitesse30j: number
  reposRespecte: boolean
  consentM13: boolean
}

export interface CoachingActionItem {
  action: string
  deadline: string
  status: 'done' | 'in_progress' | 'pending'
}

export interface DriverWellness {
  npsIndividuel: number
  dernierPulse: string
  frustrations: string[]
  idees: string[]
  dernierOneOnOne: string
  prochainOneOnOne: string
  backlogJours: number
  coachingActions: CoachingActionItem[]
  objectif90j: string
  objectifProgress: number
}

export interface CarnetEntry {
  date: string
  type: 'note' | 'decision' | 'event' | 'feedback'
  auteur: string
  contenu: string
  tags: string[]
}

export interface DriverCarnetDeBord {
  entries: CarnetEntry[]
}

export interface DriverAssetPreservation {
  scorePreservation: number
  rankFlotte: number
  vehicule: string
  kmDepuisAffectation: number
  pneusEclatesDepuisAffect: number
  pannesCauseConduite: number
  accidentsResponsable: number
  freinagesBrusques30j: number
  accelerationsBrusques30j: number
  moyenneFlotte: number
  ecart: string
  historiquePreservation: { mois: string; score: number }[]
}

export interface ClientRetour {
  date: string
  client: string
  note: number
  commentaire: string
  type: 'positif' | 'neutre' | 'negatif'
}

export interface DriverAmbassadeClient {
  npsClient: number
  clientsServis30j: string[]
  retours: ClientRetour[]
  incidentsComportement30j: number
  incidentsComportementYTD: number
  scoreAmbassadeur: number
}

export interface DriverProfile360 {
  code: string
  nom: string
  prenom: string
  photo?: string
  vehicule: string
  statut: 'actif' | 'inactif' | 'en_route' | 'malade'
  consentM13: boolean
  identite: DriverIdentity
  performance: DriverPerformance
  safety: DriverSafety
  wellness: DriverWellness
  carnetDeBord: DriverCarnetDeBord
  assetPreservation: DriverAssetPreservation
  ambassadeClient: DriverAmbassadeClient
}
