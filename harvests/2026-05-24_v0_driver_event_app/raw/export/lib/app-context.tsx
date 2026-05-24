'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DriverEvent, Mission, Driver, Vehicle, Severity, EventType, severityConfig } from '@/lib/types';
import { mockDriver, mockVehicle, mockMission, generateEventId, addEvent } from '@/lib/mock-data';

interface AppState {
  driver: Driver;
  vehicle: Vehicle;
  currentMission: Mission;
  events: DriverEvent[];
  missionStarted: boolean;
}

interface AppContextType extends AppState {
  submitEvent: (params: {
    event_type: EventType;
    severity: Severity;
    description: string;
    photo_url?: string;
    voice_note_url?: string;
  }) => DriverEvent;
  startMission: (odometer: number) => void;
  endMission: (odometer: number) => void;
  updateOdometer: (odometer: number) => void;
  getLocation: () => Promise<{ lat: number; lng: number } | null>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    driver: mockDriver,
    vehicle: mockVehicle,
    currentMission: mockMission,
    events: [],
    missionStarted: false,
  });

  const getLocation = useCallback(async (): Promise<{ lat: number; lng: number } | null> => {
    if (!navigator.geolocation) return null;
    
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve(null),
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }, []);

  const submitEvent = useCallback(
    ({
      event_type,
      severity,
      description,
      photo_url,
      voice_note_url,
    }: {
      event_type: EventType;
      severity: Severity;
      description: string;
      photo_url?: string;
      voice_note_url?: string;
    }): DriverEvent => {
      const event: DriverEvent = {
        id: generateEventId(),
        driver_id: state.driver.id,
        vehicle_id: state.vehicle.id,
        mission_id: state.currentMission.id,
        timestamp: new Date().toISOString(),
        event_type,
        severity,
        severity_value: severityConfig[severity].value,
        captured_by: 'self_pwa',
        description,
        photo_url,
        voice_note_url,
        acknowledged: false,
      };

      addEvent(event);
      setState((prev) => ({
        ...prev,
        events: [...prev.events, event],
      }));

      return event;
    },
    [state.driver.id, state.vehicle.id, state.currentMission.id]
  );

  const startMission = useCallback(
    (odometer: number) => {
      submitEvent({
        event_type: 'mission_started',
        severity: 'ok',
        description: `Mission démarrée. Kilométrage départ: ${odometer} km`,
      });

      setState((prev) => ({
        ...prev,
        missionStarted: true,
        currentMission: {
          ...prev.currentMission,
          status: 'in_progress',
          departure_time: new Date().toISOString(),
          current_odometer: odometer,
        },
        vehicle: {
          ...prev.vehicle,
          current_odometer: odometer,
        },
      }));
    },
    [submitEvent]
  );

  const endMission = useCallback(
    (odometer: number) => {
      submitEvent({
        event_type: 'mission_completed',
        severity: 'ok',
        description: `Mission terminée. Kilométrage arrivée: ${odometer} km`,
      });

      setState((prev) => ({
        ...prev,
        missionStarted: false,
        currentMission: {
          ...prev.currentMission,
          status: 'completed',
          arrival_time: new Date().toISOString(),
          current_odometer: odometer,
        },
        vehicle: {
          ...prev.vehicle,
          current_odometer: odometer,
        },
      }));
    },
    [submitEvent]
  );

  const updateOdometer = useCallback(
    (odometer: number) => {
      submitEvent({
        event_type: 'odometer_updated',
        severity: 'ok',
        description: `Kilométrage mis à jour: ${odometer} km`,
      });

      setState((prev) => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          current_odometer: odometer,
        },
      }));
    },
    [submitEvent]
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        submitEvent,
        startMission,
        endMission,
        updateOdometer,
        getLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
