// Stubs · à remplacer par lib/loi-master-dataset au branchement.
// AUCUNE donnée inventée — tous les véhicules / sites / matricule proviennent
// du master dataset LOI (cf. uploads/LOI_CONTEXT_FOR_CLAUDE_DESIGN_v1).

import type { Intervention } from './_types';

export async function getCurrentMechanic(): Promise<string> {
  // TODO write-path : récupérer depuis la session.
  return 'PL-MEC-007';
}

export async function getInterventionsForMechanic(matricule: string): Promise<Intervention[]> {
  // TODO write-path : import { getJobsForMechanic } from '@/lib/loi-master-dataset';
  const now = new Date();
  const iso = (offsetMin: number) =>
    new Date(now.getTime() - offsetMin * 60_000).toISOString();

  return [
    {
      id: 'OT-A-2026-0142',
      vehicle: { code: 'CT-007', plate: '4271 TCB', model: 'SCHACMAN F3000 6X4', homeSite: 'Atelier Betainomby' },
      label: 'Remplacement plaquettes frein AR',
      source: 'INSP-2026-0518 · ACT-2026-0142',
      site: 'Atelier Betainomby',
      estimatedDurationMin: 150,
      status: 'cours',
      assignedMechanic: matricule,
      createdAt: iso(90),
      startedAt: iso(40),
      inspection: [],
      diagnostic: {
        system: 'Freinage',
        subSystem: 'Plaquettes & disque AR',
        dtc: 'C0040',
        severity: 'majeure',
        voiceDurationSec: 32,
        text: 'Plaquettes AR usées au-delà du témoin · disque rayé côté int. Liquide bas. Pas de bruit hors freinage.',
      },
      parts: [
        { ref: 'BRK-PLQ-AR-SCH', label: 'Plaquette frein AR · jeu', qty: 1, unit: 'jeu', consumedAt: iso(20) },
        { ref: 'BRK-DSQ-AR-SCH', label: 'Disque frein AR Ø430',     qty: 2, unit: 'pc',  consumedAt: iso(15) },
        { ref: 'FLD-FRN-DOT4',   label: 'Liquide frein DOT4',       qty: 1, unit: 'L',   consumedAt: iso(10) },
      ],
      photos: [],
      notes: [],
      tireHandoffEventIds: [],
      fuelHandoffEventIds: [],
    },
    {
      id: 'OT-A-2026-0143',
      vehicle: { code: 'CT-011', plate: '5602 TCB', model: 'RENAULT KERAX', homeSite: 'APC Andriamena · RN44' },
      label: 'Révision · niveaux + courroie distribution',
      source: 'Planning préventif',
      site: 'Atelier Betainomby',
      estimatedDurationMin: 60,
      status: 'attente',
      assignedMechanic: matricule,
      createdAt: iso(60),
      inspection: [], diagnostic: {}, parts: [], photos: [], notes: [],
      tireHandoffEventIds: [], fuelHandoffEventIds: [],
    },
    {
      id: 'OT-A-2026-0144',
      vehicle: { code: 'CT-005', plate: '2945 TCB', model: 'SCHACMAN F3000 6X4', homeSite: 'Atelier Betainomby' },
      label: 'Diagnostic boîte de vitesses',
      source: 'EVT-2026-0202',
      site: 'Atelier Betainomby',
      estimatedDurationMin: 180,
      status: 'attente',
      assignedMechanic: matricule,
      createdAt: iso(45),
      inspection: [], diagnostic: {}, parts: [], photos: [], notes: [],
      tireHandoffEventIds: [], fuelHandoffEventIds: [],
    },
    {
      id: 'OT-A-2026-0141',
      vehicle: { code: 'CT-003', plate: '1827 TCB', model: 'SCHACMAN F3000 6X4', homeSite: 'Port Toamasina · PDP' },
      label: 'Fuite circuit hydraulique',
      source: 'EVT-2026-0201',
      site: 'Atelier Betainomby',
      estimatedDurationMin: 240,
      status: 'bloque',
      assignedMechanic: matricule,
      createdAt: iso(240),
      blocked: { motif: 'piece_manquante', partRef: 'HYD-JNT-32MM', freeText: 'Joint hydraulique 32mm en attente' },
      inspection: [], diagnostic: {}, parts: [], photos: [], notes: [],
      tireHandoffEventIds: [], fuelHandoffEventIds: [],
    },
    {
      id: 'OT-A-2026-0140',
      vehicle: { code: 'CT-002', plate: '1183 TCB', model: 'SCHACMAN F3000 6X4', homeSite: 'Port Toamasina · MOCCO' },
      label: 'Échange filtre à air + filtre gasoil',
      source: 'Planning préventif',
      site: 'Atelier Betainomby',
      estimatedDurationMin: 45,
      actualDurationMin: 38,
      status: 'termine',
      assignedMechanic: matricule,
      createdAt: iso(60 * 24),
      completedAt: iso(60 * 16),
      inspection: [], diagnostic: {}, parts: [], photos: [], notes: [],
      tireHandoffEventIds: [], fuelHandoffEventIds: [],
    },
  ];
}

export async function getIntervention(jobId: string): Promise<Intervention | null> {
  const list = await getInterventionsForMechanic('PL-MEC-007');
  return list.find((j) => j.id === jobId) ?? null;
}

// Liste fermée — À CONFIRMER avec LOI
export const SYSTEMS = ['Freinage', 'Moteur', 'Transmission', 'Suspension', 'Électrique', 'Carrosserie'] as const;

export const BLOCK_MOTIFS = [
  { id: 'piece_manquante',     label: 'Pièce manquante' },
  { id: 'outillage_indispo',   label: 'Outillage indispo' },
  { id: 'securite',            label: 'Sécurité' },
  { id: 'attente_validation',  label: 'Attente validation' },
  { id: 'autre',               label: 'Autre' },
] as const;
