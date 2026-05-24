// Types for HSE Pointeur / Inspecteur Module

export type SyncStatus = 'synced' | 'pending' | 'error'
export type Priority = 'normal' | 'attention' | 'critique'
export type InspectionStatus = 'a_faire' | 'en_cours' | 'en_attente_correction' | 'cloture'
export type Severity = 'faible' | 'moyen' | 'eleve' | 'critique'
export type CheckStatus = 'conforme' | 'non_conforme' | 'non_applicable'
export type ActionStatus = 'a_faire' | 'en_cours' | 'en_retard' | 'termine' | 'verifie'
export type IncidentFollowUp = 'ouvert' | 'en_analyse' | 'action_assignee' | 'resolu' | 'cloture'

export type SiteType = 
  | 'mine_loading' 
  | 'delivery' 
  | 'parking_base' 
  | 'workshop' 
  | 'route_checkpoint'

export type EventType =
  | 'incident'
  | 'near_miss'
  | 'acte_dangereux'
  | 'condition_dangereuse'
  | 'non_conformite_epi'
  | 'fuite_pollution'
  | 'fatigue_conducteur'
  | 'exces_vitesse'
  | 'chargement_dangereux'
  | 'zone_non_securisee'
  | 'vehicule_non_conforme'
  | 'autre'

export type OperationalImpact =
  | 'aucun'
  | 'retard'
  | 'arret_mission'
  | 'blocage_chargement'
  | 'blocage_livraison'
  | 'escalade_manager'

export interface Inspection {
  id: string
  siteName: string
  siteType: SiteType
  missionId?: string
  truckId?: string
  priority: Priority
  status: InspectionStatus
  syncStatus: SyncStatus
  scheduledDate: Date
  lastUpdated: Date
}

export interface HSEEvent {
  id: string
  eventType: EventType
  dateTime: Date
  location: string
  gpsCoords?: { lat: number; lng: number }
  siteId: string
  siteName: string
  truckId?: string
  driverName?: string
  driverId?: string
  missionId?: string
  severity: Severity
  immediateAction?: string
  operationalImpact: OperationalImpact
  photoEvidence?: string[]
  voiceNote?: string
  notes?: string
  syncStatus: SyncStatus
  escalated: boolean
}

export interface EPIItem {
  id: string
  name: string
  status: CheckStatus
  photoProof?: string
  comment?: string
  isCritical: boolean
}

export interface EPICheck {
  id: string
  personName: string
  personId: string
  siteId: string
  siteName: string
  dateTime: Date
  items: EPIItem[]
  complianceScore: number
  syncStatus: SyncStatus
}

export interface SiteInspectionItem {
  id: string
  label: string
  status: CheckStatus
  comment?: string
}

export interface SiteInspection {
  id: string
  siteId: string
  siteName: string
  siteType: SiteType
  dateTime: Date
  inspector: string
  items: SiteInspectionItem[]
  score: number
  mainRiskDetected?: string
  correctiveAction?: string
  responsiblePerson?: string
  dueDate?: Date
  syncStatus: SyncStatus
}

export interface CorrectiveAction {
  id: string
  title: string
  sourceEventId: string
  sourceEventType: EventType
  siteId: string
  siteName: string
  responsiblePerson: string
  dueDate: Date
  priority: Priority
  status: ActionStatus
  evidenceRequired: boolean
  evidencePhoto?: string
  createdAt: Date
}

export interface ManagerFeedItem {
  id: string
  timestamp: Date
  type: 'hse' | 'exploitation'
  title: string
  description: string
  severity: Severity
  siteId: string
  siteName: string
  truckId?: string
  missionId?: string
  syncStatus: SyncStatus
  escalated: boolean
}
