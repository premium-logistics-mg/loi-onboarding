// Types métier — Pointage Pneu.
// À aligner avec lib/loi-master-dataset au moment du branchement.

export type VehicleCode = `CT-${string}` | `S${string}`;

export type AxleConfig = '4x2' | '6x2' | '6x4' | '8x4';

export type SiteName =
  | 'Port Toamasina · PDP'
  | 'Port Toamasina · MOCCO'
  | 'Port Toamasina · C4'
  | 'Garage Betainomby'
  | 'Moramanga · relais'
  | 'APC Andriamena · RN44'
  | 'COLAS · Ivondro';

export interface Vehicle {
  code: VehicleCode;
  plate: string;                 // ex: '4271 TCB' — format À CONFIRMER LOI
  model: 'SCHACMAN F3000 6X4' | 'RENAULT KERAX';
  config: AxleConfig;
  homeSite: SiteName;
  lastUsedAt?: string;           // ISO
}

// Wheel positions, full code = `${prefix} ${pos}`
export type WheelSide = 'G' | 'D';
export type WheelLane = 'EXT' | 'INT';
export type AxleIndex = 1 | 2 | 3 | 4;

export type WheelPositionSimple = `${AxleIndex}ESS-${WheelSide}`;
export type WheelPositionDual   = `${AxleIndex}ESS-${WheelLane}-${WheelSide}`;
export type WheelPosition = WheelPositionSimple | WheelPositionDual;

export type Prefix = 'MOT' | 'REM';   // motrice (porteur) ou remorque
export type PositionCode = `${Prefix} ${WheelPosition}`;

export type TireEvent =
  | 'inspection'
  | 'montage'
  | 'depose'
  | 'reparation'
  | 'remplacement';

export interface TireBrand {
  // Liste fermée — À CONFIRMER avec LOI.
  // Pas de texte libre côté terrain.
  name: string;                       // ex: 'Michelin XZA2'
  sizes: string[];                    // ex: ['315/80 R22.5 · 154/150 M']
}

export interface TireSelection {
  brand: string;
  size: string;
}

export interface CapturedPhoto {
  blobId: string;                     // id local avant sync
  capturedAt: string;                 // ISO
}

export interface TireLoggingPayload {
  localRef: string;                   // ex: 'PNEU-2026-0524-0042' — format À CONFIRMER
  vehicle: Vehicle;
  position: PositionCode;             // ex: 'MOT 2ESS-EXT-G'
  event: TireEvent;
  brand?: TireSelection;
  serial?: string;                    // n° série pneu — format À CONFIRMER (DOT vs QR LOI)
  km?: number;                        // kilométrage véhicule au pointage
  photos: CapturedPhoto[];
  mechanic: string;                   // matricule PL-MEC-XXX
  createdAt: string;                  // ISO
  syncedAt?: string;                  // null tant que offline
}
