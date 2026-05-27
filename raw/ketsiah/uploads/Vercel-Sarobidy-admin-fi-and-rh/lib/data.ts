import type { DDVItem, Pillar, Objective, CoachingSignal, CarnetEntry } from './types'

// Données de démonstration - Master Dataset LOI
// Note: Montants/SLA = "À CONFIRMER" tant que non fournis

export const pillars: Pillar[] = [
  { id: 'p1', name: 'Exécution', shortName: 'P1', score: 78, trend: 'up' },
  { id: 'p2', name: 'Cash', shortName: 'P2', score: 65, trend: 'down', isFocus: true },
  { id: 'p3', name: 'Fidélité client', shortName: 'P3', score: 82, trend: 'stable' },
  { id: 'p4', name: 'Fluidité', shortName: 'P4', score: 71, trend: 'up' },
]

export const objectives: Objective[] = [
  {
    id: 'obj-1',
    label: 'Factures vente émises sous 72h',
    current: 'À CONFIRMER',
    cible: 'À CONFIRMER',
    unit: '%',
  },
  {
    id: 'obj-2',
    label: 'Déclarations CNAPS à temps',
    current: 'À CONFIRMER',
    cible: 'À CONFIRMER',
    unit: '%',
  },
]

export const ddvQueue: DDVItem[] = [
  {
    id: 'ddv-001',
    type: 'facturation',
    montant: 'À CONFIRMER',
    demandeur: 'Christine',
    departement: 'Transit',
    etape: 'demande',
    ageJours: 2,
    slaCible: 'À CONFIRMER',
  },
  {
    id: 'ddv-002',
    type: 'cnaps',
    montant: 'À CONFIRMER',
    demandeur: 'Lynda',
    departement: 'RH',
    etape: 'matrice',
    ageJours: 1,
    slaCible: 'À CONFIRMER',
  },
  {
    id: 'ddv-003',
    type: 'achat',
    montant: 'À CONFIRMER',
    demandeur: 'Rico',
    departement: 'Achat',
    etape: 'haja',
    ageJours: 4,
    slaCible: 'À CONFIRMER',
  },
  {
    id: 'ddv-004',
    type: 'facturation',
    montant: 'À CONFIRMER',
    demandeur: 'Belaza',
    departement: 'Commercial',
    etape: 'demande',
    ageJours: 1,
    slaCible: 'À CONFIRMER',
  },
  {
    id: 'ddv-005',
    type: 'stc',
    montant: 'À CONFIRMER',
    demandeur: 'Ketsiah',
    departement: 'RH',
    etape: 'matrice',
    ageJours: 3,
    slaCible: 'À CONFIRMER',
  },
  {
    id: 'ddv-006',
    type: 'facturation',
    montant: 'À CONFIRMER',
    demandeur: 'Édienne',
    departement: 'Transit',
    etape: 'demande',
    ageJours: 5,
    slaCible: 'À CONFIRMER',
  },
]

export const coachingSignals: CoachingSignal[] = [
  {
    id: 'sig-1',
    cause: '3 factures vente bloquées faute de pièces amont (Transit)',
    levier: 'Escalade vers Haja pour déblocage Transit',
    gainEstime: 'À CONFIRMER',
    sourcePersonne: 'Christine',
  },
  {
    id: 'sig-2',
    cause: 'Déclaration CNAPS en attente de validation RH',
    levier: 'Relance Lynda pour compléter le dossier',
    gainEstime: 'À CONFIRMER',
    sourcePersonne: 'Lynda',
  },
]

export const carnetEntries: CarnetEntry[] = [
  {
    id: 'carnet-1',
    date: '2024-01-15',
    type: 'decision',
    description: 'Validation prioritaire des factures Transit > 72h',
    personneSource: 'Haja',
  },
  {
    id: 'carnet-2',
    date: '2024-01-14',
    type: 'escalade',
    description: 'Blocage paiement fournisseur - en attente BC validé',
    personneSource: 'Rico',
  },
]

// Profil Sarobidy
export const userProfile = {
  name: 'Sarobidy',
  role: 'Admin-Fi',
  fonctions: ['Déclaration CNAPS/OMSI/FMFP', 'Facturation Vente', 'STC débauche RH', 'Achat'],
  entreprise: 'Premium Logistics',
  location: 'Madagascar',
}
