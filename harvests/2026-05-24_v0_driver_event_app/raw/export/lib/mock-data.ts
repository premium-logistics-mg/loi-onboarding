// LOI Driver Mobile App - Mock Data for Development

import { Mission, Driver, Vehicle, DriverEvent } from './types';

export const mockDriver: Driver = {
  id: 'chauffeurs-001',
  name: 'Jean Rakoto',
  badge_number: 'DRV-2024-001',
  phone: '+261 34 00 00 001',
  photo_url: undefined,
};

export const mockVehicle: Vehicle = {
  id: 'VH-001',
  plate: '1234 TAN',
  model: 'HINO 500',
  type: 'Camion 10T',
  current_odometer: 125430,
};

export const mockMission: Mission = {
  id: 'MSN-2024-0524-001',
  date: new Date().toISOString().split('T')[0],
  origin: 'Antananarivo',
  destination: 'Toamasina',
  client: 'STAR Madagascar',
  cargo: 'Boissons - 8 palettes',
  vehicle_id: mockVehicle.id,
  vehicle_plate: mockVehicle.plate,
  distance_km: 356,
  status: 'pending',
};

export const mockEvents: DriverEvent[] = [];

// Helper to generate event ID
export function generateEventId(): string {
  return `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Simulate offline storage
let storedEvents: DriverEvent[] = [];

export function addEvent(event: DriverEvent): void {
  storedEvents.push(event);
  // In production, this would sync to the Driver Manager cockpit
  console.log('[v0] Event added to queue:', event);
}

export function getStoredEvents(): DriverEvent[] {
  return [...storedEvents];
}

export function clearStoredEvents(): void {
  storedEvents = [];
}
