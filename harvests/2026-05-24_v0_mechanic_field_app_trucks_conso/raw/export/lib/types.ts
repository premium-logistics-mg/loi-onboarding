// LOI Mechanics Field App - Event Types and Data Models

export type JobStatus = 'pending' | 'in_progress' | 'blocked' | 'completed';

export type EventType =
  | 'maintenance_job_assigned'
  | 'maintenance_job_started'
  | 'vehicle_inspected'
  | 'diagnosis_added'
  | 'maintenance_job_blocked'
  | 'maintenance_job_completed'
  | 'parts_used'
  | 'tire_action_recorded'
  | 'fuel_system_observation_added'
  | 'photo_attached'
  | 'mechanic_note_added';

export interface MaintenanceEvent {
  id: string;
  type: EventType;
  timestamp: string;
  mechanicId: string;
  mechanicName: string;
  jobId: string;
  vehicleId: string;
  vehiclePlate?: string;
  payload: Record<string, unknown>;
}

export interface Mechanic {
  id: string;
  name: string;
  badge: string;
  specialization: string;
  activeJobId?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: 'truck' | 'van' | 'trailer' | 'forklift';
  model: string;
  year: number;
  lastMaintenanceDate?: string;
  status: 'operational' | 'in_maintenance' | 'out_of_service';
}

export interface MaintenanceJob {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleType: Vehicle['type'];
  vehicleModel: string;
  assignedMechanicId: string;
  assignedMechanicName: string;
  status: JobStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  blockedReason?: string;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  inspectionCompleted: boolean;
  diagnosis?: string;
  partsUsed: PartUsage[];
  tireActions: TireAction[];
  fuelObservations: FuelObservation[];
  photos: Photo[];
  notes: JobNote[];
}

export interface InspectionItem {
  id: string;
  category: string;
  item: string;
  status: 'ok' | 'warning' | 'critical' | 'not_checked';
  notes?: string;
}

export interface PartUsage {
  id: string;
  partNumber: string;
  partName: string;
  quantity: number;
  timestamp: string;
}

export interface TireAction {
  id: string;
  position: string;
  action: 'replace' | 'rotate' | 'repair' | 'inflate';
  notes?: string;
  timestamp: string;
}

export interface FuelObservation {
  id: string;
  type: 'leak' | 'contamination' | 'low_level' | 'filter_issue' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface Photo {
  id: string;
  url: string;
  type: 'before' | 'after' | 'issue' | 'part';
  caption?: string;
  timestamp: string;
}

export interface JobNote {
  id: string;
  content: string;
  timestamp: string;
  isBlockerReason: boolean;
}

// Cockpit derived types
export interface CockpitStats {
  openJobs: number;
  blockedJobs: number;
  completedToday: number;
  avgCompletionTime: number;
  partsUsedToday: number;
  tireIssues: number;
  mechanicsActive: number;
}

export interface MechanicWorkload {
  mechanicId: string;
  mechanicName: string;
  activeJob?: string;
  completedToday: number;
  avgCompletionTime: number;
}
