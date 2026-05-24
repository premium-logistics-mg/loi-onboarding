// LOI Driver Mobile App - Event Types and Models

export type Severity = 'ok' | 'probleme' | 'urgent';

export type EventType =
  | 'mission_started'
  | 'mission_completed'
  | 'odometer_updated'
  | 'fatigue_alert'
  | 'near_miss_declared'
  | 'incident_reported'
  | 'route_deviation'
  | 'epi_non_compliant'
  | 'vehicle_issue_reported'
  | 'breakdown_reported'
  | 'photo_attached'
  | 'voice_note_attached';

export interface DriverEvent {
  id: string;
  driver_id: string;
  vehicle_id: string;
  mission_id: string;
  timestamp: string;
  location_approx?: {
    lat: number;
    lng: number;
    address?: string;
  };
  event_type: EventType;
  severity: Severity;
  severity_value: 1 | 2 | 3 | 4 | 5;
  captured_by: 'self_pwa';
  description: string;
  photo_url?: string;
  voice_note_url?: string;
  acknowledged: boolean;
}

export interface Mission {
  id: string;
  date: string;
  origin: string;
  destination: string;
  client: string;
  cargo: string;
  vehicle_id: string;
  vehicle_plate: string;
  distance_km: number;
  status: 'pending' | 'in_progress' | 'completed';
  departure_time?: string;
  arrival_time?: string;
  current_odometer?: number;
}

export interface Driver {
  id: string;
  name: string;
  badge_number: string;
  phone: string;
  photo_url?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  type: string;
  current_odometer: number;
}

// Severity mapping helper
export const severityConfig = {
  ok: {
    label: 'OK',
    value: 1 as const,
    color: 'bg-severity-ok',
    textColor: 'text-severity-ok',
  },
  probleme: {
    label: 'Problème',
    value: 3 as const,
    color: 'bg-severity-problem',
    textColor: 'text-severity-problem',
  },
  urgent: {
    label: 'Urgent',
    value: 5 as const,
    color: 'bg-severity-urgent',
    textColor: 'text-severity-urgent',
  },
} as const;

// Event type labels (French)
export const eventTypeLabels: Record<EventType, string> = {
  mission_started: 'Mission démarrée',
  mission_completed: 'Mission terminée',
  odometer_updated: 'Kilométrage mis à jour',
  fatigue_alert: 'Alerte fatigue',
  near_miss_declared: 'Quasi-accident déclaré',
  incident_reported: 'Incident signalé',
  route_deviation: 'Déviation de route',
  epi_non_compliant: 'EPI non conforme',
  vehicle_issue_reported: 'Problème véhicule',
  breakdown_reported: 'Panne signalée',
  photo_attached: 'Photo jointe',
  voice_note_attached: 'Note vocale jointe',
};
