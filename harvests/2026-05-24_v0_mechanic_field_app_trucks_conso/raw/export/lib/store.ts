// LOI Mechanics Field App - In-Memory Event Store
// In production, this would connect to a real database

import type {
  MaintenanceEvent,
  MaintenanceJob,
  Mechanic,
  Vehicle,
  JobStatus,
  EventType,
  CockpitStats,
  MechanicWorkload,
  InspectionItem,
} from './types';

// Simulated mechanics
const mechanics: Mechanic[] = [
  { id: 'mech-001', name: 'Carlos Rodriguez', badge: 'CR-2847', specialization: 'Heavy Vehicles' },
  { id: 'mech-002', name: 'Ahmed Hassan', badge: 'AH-3921', specialization: 'Electrical Systems' },
  { id: 'mech-003', name: 'Maria Santos', badge: 'MS-1456', specialization: 'Engine Diagnostics' },
];

// Simulated vehicles
const vehicles: Vehicle[] = [
  { id: 'veh-001', plate: 'LOI-4521', type: 'truck', model: 'Volvo FH16', year: 2021, status: 'in_maintenance' },
  { id: 'veh-002', plate: 'LOI-3298', type: 'van', model: 'Mercedes Sprinter', year: 2022, status: 'operational' },
  { id: 'veh-003', plate: 'LOI-7845', type: 'trailer', model: 'Krone Mega Liner', year: 2020, status: 'operational' },
  { id: 'veh-004', plate: 'LOI-9012', type: 'forklift', model: 'Toyota 8FBE18', year: 2023, status: 'in_maintenance' },
  { id: 'veh-005', plate: 'LOI-5634', type: 'truck', model: 'Scania R500', year: 2022, status: 'out_of_service' },
];

// Initial jobs
const initialJobs: MaintenanceJob[] = [
  {
    id: 'job-001',
    vehicleId: 'veh-001',
    vehiclePlate: 'LOI-4521',
    vehicleType: 'truck',
    vehicleModel: 'Volvo FH16',
    assignedMechanicId: 'mech-001',
    assignedMechanicName: 'Carlos Rodriguez',
    status: 'in_progress',
    priority: 'high',
    title: 'Brake System Overhaul',
    description: 'Complete brake pad replacement and rotor inspection. Check brake fluid levels.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 180,
    inspectionCompleted: true,
    diagnosis: 'Front brake pads worn to 15%. Rear rotors showing scoring.',
    partsUsed: [],
    tireActions: [],
    fuelObservations: [],
    photos: [],
    notes: [],
  },
  {
    id: 'job-002',
    vehicleId: 'veh-004',
    vehiclePlate: 'LOI-9012',
    vehicleType: 'forklift',
    vehicleModel: 'Toyota 8FBE18',
    assignedMechanicId: 'mech-001',
    assignedMechanicName: 'Carlos Rodriguez',
    status: 'pending',
    priority: 'medium',
    title: 'Hydraulic System Check',
    description: 'Routine hydraulic fluid check and seal inspection.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estimatedDuration: 60,
    inspectionCompleted: false,
    partsUsed: [],
    tireActions: [],
    fuelObservations: [],
    photos: [],
    notes: [],
  },
  {
    id: 'job-003',
    vehicleId: 'veh-005',
    vehiclePlate: 'LOI-5634',
    vehicleType: 'truck',
    vehicleModel: 'Scania R500',
    assignedMechanicId: 'mech-002',
    assignedMechanicName: 'Ahmed Hassan',
    status: 'blocked',
    priority: 'critical',
    title: 'Engine Diagnostics',
    description: 'Check engine warning light. Vehicle not starting.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 240,
    inspectionCompleted: true,
    diagnosis: 'ECU fault detected. Requires specialist diagnostic tool.',
    blockedReason: 'Waiting for specialized ECU diagnostic equipment from supplier.',
    partsUsed: [],
    tireActions: [],
    fuelObservations: [],
    photos: [],
    notes: [
      {
        id: 'note-001',
        content: 'Waiting for specialized ECU diagnostic equipment from supplier.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isBlockerReason: true,
      },
    ],
  },
  {
    id: 'job-004',
    vehicleId: 'veh-002',
    vehiclePlate: 'LOI-3298',
    vehicleType: 'van',
    vehicleModel: 'Mercedes Sprinter',
    assignedMechanicId: 'mech-003',
    assignedMechanicName: 'Maria Santos',
    status: 'pending',
    priority: 'low',
    title: 'Routine Oil Change',
    description: 'Standard 15,000km oil change service.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 45,
    inspectionCompleted: false,
    partsUsed: [],
    tireActions: [],
    fuelObservations: [],
    photos: [],
    notes: [],
  },
];

// Event store
let events: MaintenanceEvent[] = [];
let jobs: MaintenanceJob[] = [...initialJobs];
let eventListeners: ((event: MaintenanceEvent) => void)[] = [];

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Subscribe to events (for real-time updates)
export function subscribeToEvents(callback: (event: MaintenanceEvent) => void): () => void {
  eventListeners.push(callback);
  return () => {
    eventListeners = eventListeners.filter((cb) => cb !== callback);
  };
}

// Emit event to all listeners
function emitEvent(event: MaintenanceEvent): void {
  eventListeners.forEach((callback) => callback(event));
}

// Create and store an event
export function createEvent(
  type: EventType,
  mechanicId: string,
  mechanicName: string,
  jobId: string,
  vehicleId: string,
  vehiclePlate: string,
  payload: Record<string, unknown>
): MaintenanceEvent {
  const event: MaintenanceEvent = {
    id: generateId(),
    type,
    timestamp: new Date().toISOString(),
    mechanicId,
    mechanicName,
    jobId,
    vehicleId,
    vehiclePlate,
    payload,
  };
  events.push(event);
  emitEvent(event);
  return event;
}

// Get all events
export function getEvents(): MaintenanceEvent[] {
  return [...events];
}

// Get events for cockpit (recent activity)
export function getRecentEvents(limit: number = 20): MaintenanceEvent[] {
  return [...events].reverse().slice(0, limit);
}

// Get mechanics
export function getMechanics(): Mechanic[] {
  return [...mechanics];
}

// Get mechanic by ID
export function getMechanic(id: string): Mechanic | undefined {
  return mechanics.find((m) => m.id === id);
}

// Get vehicles
export function getVehicles(): Vehicle[] {
  return [...vehicles];
}

// Get vehicle by ID
export function getVehicle(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

// Get all jobs
export function getJobs(): MaintenanceJob[] {
  return [...jobs];
}

// Get job by ID
export function getJob(id: string): MaintenanceJob | undefined {
  return jobs.find((j) => j.id === id);
}

// Get jobs for a mechanic
export function getJobsForMechanic(mechanicId: string): MaintenanceJob[] {
  return jobs.filter((j) => j.assignedMechanicId === mechanicId);
}

// Update job status
export function updateJobStatus(jobId: string, status: JobStatus, reason?: string): MaintenanceJob | null {
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return null;

  const job = jobs[jobIndex];
  const updatedJob = { ...job, status };

  if (status === 'in_progress' && !job.startedAt) {
    updatedJob.startedAt = new Date().toISOString();
  }

  if (status === 'completed') {
    updatedJob.completedAt = new Date().toISOString();
    if (job.startedAt) {
      updatedJob.actualDuration = Math.round(
        (new Date().getTime() - new Date(job.startedAt).getTime()) / 60000
      );
    }
  }

  if (status === 'blocked' && reason) {
    updatedJob.blockedReason = reason;
    updatedJob.notes = [
      ...job.notes,
      {
        id: generateId(),
        content: reason,
        timestamp: new Date().toISOString(),
        isBlockerReason: true,
      },
    ];
  }

  jobs[jobIndex] = updatedJob;
  return updatedJob;
}

// Update job inspection
export function updateJobInspection(jobId: string): MaintenanceJob | null {
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return null;

  jobs[jobIndex] = { ...jobs[jobIndex], inspectionCompleted: true };
  return jobs[jobIndex];
}

// Update job diagnosis
export function updateJobDiagnosis(jobId: string, diagnosis: string): MaintenanceJob | null {
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return null;

  jobs[jobIndex] = { ...jobs[jobIndex], diagnosis };
  return jobs[jobIndex];
}

// Add parts to job
export function addPartsToJob(
  jobId: string,
  partNumber: string,
  partName: string,
  quantity: number
): MaintenanceJob | null {
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return null;

  const part = {
    id: generateId(),
    partNumber,
    partName,
    quantity,
    timestamp: new Date().toISOString(),
  };

  jobs[jobIndex] = {
    ...jobs[jobIndex],
    partsUsed: [...jobs[jobIndex].partsUsed, part],
  };
  return jobs[jobIndex];
}

// Add tire action to job
export function addTireAction(
  jobId: string,
  position: string,
  action: 'replace' | 'rotate' | 'repair' | 'inflate',
  notes?: string
): MaintenanceJob | null {
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return null;

  const tireAction = {
    id: generateId(),
    position,
    action,
    notes,
    timestamp: new Date().toISOString(),
  };

  jobs[jobIndex] = {
    ...jobs[jobIndex],
    tireActions: [...jobs[jobIndex].tireActions, tireAction],
  };
  return jobs[jobIndex];
}

// Add fuel observation to job
export function addFuelObservation(
  jobId: string,
  type: 'leak' | 'contamination' | 'low_level' | 'filter_issue' | 'other',
  description: string,
  severity: 'low' | 'medium' | 'high'
): MaintenanceJob | null {
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return null;

  const observation = {
    id: generateId(),
    type,
    description,
    severity,
    timestamp: new Date().toISOString(),
  };

  jobs[jobIndex] = {
    ...jobs[jobIndex],
    fuelObservations: [...jobs[jobIndex].fuelObservations, observation],
  };
  return jobs[jobIndex];
}

// Add photo to job
export function addPhotoToJob(
  jobId: string,
  url: string,
  type: 'before' | 'after' | 'issue' | 'part',
  caption?: string
): MaintenanceJob | null {
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return null;

  const photo = {
    id: generateId(),
    url,
    type,
    caption,
    timestamp: new Date().toISOString(),
  };

  jobs[jobIndex] = {
    ...jobs[jobIndex],
    photos: [...jobs[jobIndex].photos, photo],
  };
  return jobs[jobIndex];
}

// Add note to job
export function addNoteToJob(jobId: string, content: string, isBlockerReason: boolean = false): MaintenanceJob | null {
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) return null;

  const note = {
    id: generateId(),
    content,
    timestamp: new Date().toISOString(),
    isBlockerReason,
  };

  jobs[jobIndex] = {
    ...jobs[jobIndex],
    notes: [...jobs[jobIndex].notes, note],
  };
  return jobs[jobIndex];
}

// Calculate cockpit stats from events and jobs
export function getCockpitStats(): CockpitStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayJobs = jobs.filter((j) => {
    const createdAt = new Date(j.createdAt);
    return createdAt >= today;
  });

  const completedToday = jobs.filter((j) => {
    if (!j.completedAt) return false;
    const completedAt = new Date(j.completedAt);
    return completedAt >= today;
  });

  const avgCompletionTime =
    completedToday.length > 0
      ? Math.round(
          completedToday.reduce((sum, j) => sum + (j.actualDuration || 0), 0) / completedToday.length
        )
      : 0;

  const partsUsedToday = jobs.reduce((sum, j) => {
    return (
      sum +
      j.partsUsed.filter((p) => {
        const timestamp = new Date(p.timestamp);
        return timestamp >= today;
      }).length
    );
  }, 0);

  const tireIssues = jobs.reduce((sum, j) => sum + j.tireActions.length, 0);

  const mechanicsActive = new Set(
    jobs.filter((j) => j.status === 'in_progress').map((j) => j.assignedMechanicId)
  ).size;

  return {
    openJobs: jobs.filter((j) => j.status === 'pending' || j.status === 'in_progress').length,
    blockedJobs: jobs.filter((j) => j.status === 'blocked').length,
    completedToday: completedToday.length,
    avgCompletionTime,
    partsUsedToday,
    tireIssues,
    mechanicsActive,
  };
}

// Get mechanic workloads
export function getMechanicWorkloads(): MechanicWorkload[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return mechanics.map((mechanic) => {
    const mechanicJobs = jobs.filter((j) => j.assignedMechanicId === mechanic.id);
    const activeJob = mechanicJobs.find((j) => j.status === 'in_progress');
    const completedToday = mechanicJobs.filter((j) => {
      if (!j.completedAt) return false;
      const completedAt = new Date(j.completedAt);
      return completedAt >= today;
    });

    const avgCompletionTime =
      completedToday.length > 0
        ? Math.round(
            completedToday.reduce((sum, j) => sum + (j.actualDuration || 0), 0) / completedToday.length
          )
        : 0;

    return {
      mechanicId: mechanic.id,
      mechanicName: mechanic.name,
      activeJob: activeJob?.title,
      completedToday: completedToday.length,
      avgCompletionTime,
    };
  });
}

// Default inspection checklist
export function getDefaultInspectionChecklist(): InspectionItem[] {
  return [
    { id: 'insp-001', category: 'Exterior', item: 'Body Condition', status: 'not_checked' },
    { id: 'insp-002', category: 'Exterior', item: 'Lights & Signals', status: 'not_checked' },
    { id: 'insp-003', category: 'Exterior', item: 'Mirrors', status: 'not_checked' },
    { id: 'insp-004', category: 'Exterior', item: 'Windows & Wipers', status: 'not_checked' },
    { id: 'insp-005', category: 'Tires', item: 'Front Left Tire', status: 'not_checked' },
    { id: 'insp-006', category: 'Tires', item: 'Front Right Tire', status: 'not_checked' },
    { id: 'insp-007', category: 'Tires', item: 'Rear Left Tire', status: 'not_checked' },
    { id: 'insp-008', category: 'Tires', item: 'Rear Right Tire', status: 'not_checked' },
    { id: 'insp-009', category: 'Engine', item: 'Oil Level', status: 'not_checked' },
    { id: 'insp-010', category: 'Engine', item: 'Coolant Level', status: 'not_checked' },
    { id: 'insp-011', category: 'Engine', item: 'Belt Condition', status: 'not_checked' },
    { id: 'insp-012', category: 'Brakes', item: 'Brake Fluid', status: 'not_checked' },
    { id: 'insp-013', category: 'Brakes', item: 'Brake Pads', status: 'not_checked' },
    { id: 'insp-014', category: 'Fluids', item: 'Transmission Fluid', status: 'not_checked' },
    { id: 'insp-015', category: 'Fluids', item: 'Power Steering Fluid', status: 'not_checked' },
  ];
}
