// Types métier — Atelier Méca. À aligner avec lib/loi-master-dataset au branchement.

export type JobStatus = 'cours' | 'attente' | 'bloque' | 'termine';
export type Severity  = 'mineure' | 'majeure' | 'critique';
export type InspectionStatus = 'ok' | 'alerte' | 'critique' | 'nonverif';

export type VehicleCode = `CT-${string}`;
export type VehicleModel = 'SCHACMAN F3000 6X4' | 'RENAULT KERAX';

export type SiteName =
  | 'Atelier Betainomby'
  | 'Port Toamasina · PDP' | 'Port Toamasina · MOCCO' | 'Port Toamasina · C4'
  | 'Moramanga · relais'   | 'APC Andriamena · RN44'  | 'COLAS · Ivondro';

export type MechSystem =
  | 'Freinage' | 'Moteur' | 'Transmission'
  | 'Suspension' | 'Électrique' | 'Carrosserie';

export interface Vehicle {
  code: VehicleCode;
  plate: string;          // ex '4271 TCB' — format À CONFIRMER LOI
  model: VehicleModel;
  homeSite: SiteName;
}

export interface InspectionItem {
  id: string;
  group: 'Vehicule' | 'Charge' | 'Site' | 'Documents';
  label: string;
  status: InspectionStatus;
}

export interface Diagnostic {
  system?: MechSystem;
  subSystem?: string;
  dtc?: string;
  severity?: Severity;
  voiceNoteBlobId?: string;
  voiceDurationSec?: number;
  text?: string;
}

export interface PartUsage {
  ref: string;
  label: string;
  qty: number;
  unit: 'pc' | 'jeu' | 'L' | 'kg';
  consumedAt: string;
}

export interface Photo {
  blobId: string;
  label: string;
  capturedAt: string;
  gps?: { lat: number; lng: number };
}

export interface JobNote {
  id: string;
  content: string;
  createdAt: string;
  isBlocker: boolean;
}

export type BlockMotif =
  | 'piece_manquante'
  | 'outillage_indispo'
  | 'securite'
  | 'attente_validation'
  | 'autre'; // liste À CONFIRMER avec LOI

export interface BlockedState {
  motif: BlockMotif;
  partRef?: string;
  freeText?: string;
}

export interface Intervention {
  id: string;               // 'OT-A-2026-0142' — format À CONFIRMER
  vehicle: Vehicle;
  label: string;
  source: string;           // 'INSP-2026-0518 · ACT-2026-0142'
  site: SiteName;
  estimatedDurationMin: number;
  actualDurationMin?: number;
  status: JobStatus;
  assignedMechanic: string; // 'PL-MEC-007'
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  blocked?: BlockedState;

  inspection: InspectionItem[];
  diagnostic: Diagnostic;
  parts: PartUsage[];
  photos: Photo[];
  notes: JobNote[];

  tireHandoffEventIds: string[]; // EVT-2026-#### du module pneu
  fuelHandoffEventIds: string[]; // EVT-2026-#### du module fuel
}

export type EventType =
  | 'job_assigne' | 'job_demarre' | 'job_bloque' | 'job_termine'
  | 'inspection_validee' | 'inspection_item_change'
  | 'diagnostic_systeme' | 'diagnostic_dtc' | 'diagnostic_severite'
  | 'diagnostic_vocal'   | 'diagnostic_texte'
  | 'piece_consommee'    | 'photo_jointe'   | 'note_ajoutee'
  | 'pneu_renvoi_ouvert' | 'fuel_renvoi_ouvert';

export interface InterventionEvent {
  id: string;
  type: EventType;
  jobId: Intervention['id'];
  mechanic: string;
  vehicleCode: VehicleCode;
  occurredAt: string;
  payload: Record<string, unknown>;
  syncedAt?: string;
}

export function durationFromMin(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
