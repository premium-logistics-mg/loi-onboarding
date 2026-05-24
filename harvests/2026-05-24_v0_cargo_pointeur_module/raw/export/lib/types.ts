// Cargo Pointeur - TypeScript Types

export type SyncStatus = 'draft' | 'pending' | 'synced' | 'failed'

export type MissionStatus =
  | 'assigned'
  | 'arrived_loading'
  | 'loading_started'
  | 'loading_completed'
  | 'departed_loading'
  | 'arrived_delivery'
  | 'unloading_started'
  | 'delivered'
  | 'delivered_anomaly'

export type CargoType =
  | 'copper_ore'
  | 'cobalt_ore'
  | 'manganese_ore'
  | 'iron_ore'
  | 'coal'
  | 'limestone'
  | 'other'

export type SealStatus = 'intact' | 'broken' | 'missing' | 'not_applicable'

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical'

export type AnomalyType =
  | 'truck_not_arrived'
  | 'wrong_truck'
  | 'missing_document'
  | 'tonnage_mismatch'
  | 'seal_broken'
  | 'seal_missing'
  | 'cargo_damaged'
  | 'long_waiting'
  | 'site_closed'
  | 'driver_issue'
  | 'safety_incident'
  | 'other'

export type SiteType = 'mine_loading' | 'delivery'

export interface FieldPhoto {
  id: string
  type: 'truck_empty' | 'loading_ticket' | 'loaded_truck' | 'arrival' | 'delivery_ticket' | 'unloading_proof' | 'damage' | 'anomaly'
  url: string
  timestamp: string
  caption?: string
}

export interface GPSLocation {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: string
}

export interface CargoMission {
  id: string
  truckPlate: string
  driverName: string
  driverPhone?: string
  trailerNumber?: string
  cargoType: CargoType
  mineSite: string
  deliverySite: string
  clientName: string
  status: MissionStatus
  syncStatus: SyncStatus
  assignedAt: string
  lastEvent?: string
  lastEventTimestamp?: string
  estimatedTonnage?: number
}

export interface LoadingEvent {
  id: string
  missionId: string
  truckPlate: string
  driverName: string
  arrivalTime: string
  mineSite: string
  cargoType: CargoType
  tonnage: number
  loadingTicketNumber: string
  trailerNumber?: string
  sealNumber?: string
  loadingStartTime?: string
  loadingEndTime?: string
  waitingTime?: number // in minutes
  photos: FieldPhoto[]
  gpsLocation?: GPSLocation
  comments?: string
  status: 'arrived_loading' | 'loading_started' | 'loading_completed' | 'awaiting_departure' | 'departed_loading'
  syncStatus: SyncStatus
  createdAt: string
  createdBy: string
}

export interface DeliveryEvent {
  id: string
  missionId: string
  truckPlate: string
  driverName: string
  arrivalTime: string
  deliverySite: string
  receiverName: string
  deliveryTicketNumber: string
  tonnageReceived: number
  tonnageDifference?: number
  sealStatus: SealStatus
  unloadingStartTime?: string
  unloadingEndTime?: string
  photos: FieldPhoto[]
  gpsLocation?: GPSLocation
  receiverSignature?: string
  comments?: string
  status: 'arrived_delivery' | 'unloading_started' | 'unloading_completed' | 'delivered' | 'delivered_anomaly'
  syncStatus: SyncStatus
  createdAt: string
  createdBy: string
}

export interface CargoAnomaly {
  id: string
  missionId: string
  truckPlate: string
  siteType: SiteType
  anomalyType: AnomalyType
  severity: AnomalySeverity
  description: string
  timestamp: string
  gpsLocation?: GPSLocation
  photos: FieldPhoto[]
  immediateAction?: string
  escalated: boolean
  syncStatus: SyncStatus
  createdAt: string
  createdBy: string
}

export interface CargoCheckpointEvent {
  id: string
  missionId: string
  eventType: 'loading' | 'delivery' | 'anomaly'
  timestamp: string
  status: string
  actor: string
  syncStatus: SyncStatus
}

export interface ManagerFeedStats {
  trucksLoadedToday: number
  trucksDeliveredToday: number
  trucksWaitingMine: number
  trucksWaitingDelivery: number
  averageLoadingTime: number // in minutes
  averageUnloadingTime: number // in minutes
  missionsWithAnomalies: number
  tonnageLoaded: number
  tonnageDelivered: number
  unsyncedEvents: number
}

// French labels for display
export const CARGO_TYPE_LABELS: Record<CargoType, string> = {
  copper_ore: 'Minerai de cuivre',
  cobalt_ore: 'Minerai de cobalt',
  manganese_ore: 'Minerai de manganèse',
  iron_ore: 'Minerai de fer',
  coal: 'Charbon',
  limestone: 'Calcaire',
  other: 'Autre',
}

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  assigned: 'Assigné',
  arrived_loading: 'Arrivé au chargement',
  loading_started: 'Chargement démarré',
  loading_completed: 'Chargement terminé',
  departed_loading: 'Parti du site de chargement',
  arrived_delivery: 'Arrivé à la livraison',
  unloading_started: 'Déchargement démarré',
  delivered: 'Livré',
  delivered_anomaly: 'Livré avec anomalie',
}

export const SYNC_STATUS_LABELS: Record<SyncStatus, string> = {
  draft: 'Brouillon',
  pending: 'En attente de sync',
  synced: 'Synchronisé',
  failed: 'Échec de sync',
}

export const ANOMALY_TYPE_LABELS: Record<AnomalyType, string> = {
  truck_not_arrived: 'Camion non arrivé',
  wrong_truck: 'Mauvais camion',
  missing_document: 'Document manquant',
  tonnage_mismatch: 'Écart de tonnage',
  seal_broken: 'Scellé cassé',
  seal_missing: 'Scellé manquant',
  cargo_damaged: 'Cargaison endommagée',
  long_waiting: 'Temps d\'attente long',
  site_closed: 'Site fermé / indisponible',
  driver_issue: 'Problème chauffeur',
  safety_incident: 'Incident de sécurité',
  other: 'Autre',
}

export const SEVERITY_LABELS: Record<AnomalySeverity, string> = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
  critical: 'Critique',
}

export const SEAL_STATUS_LABELS: Record<SealStatus, string> = {
  intact: 'Intact',
  broken: 'Cassé',
  missing: 'Manquant',
  not_applicable: 'Non applicable',
}

export const SITE_TYPE_LABELS: Record<SiteType, string> = {
  mine_loading: 'Site de chargement (mine)',
  delivery: 'Site de livraison',
}
