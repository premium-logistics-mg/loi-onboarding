// Types pour le workspace Admin-Fi Sarobidy
// Personnes réelles uniquement: Sarobidy, Belaza, Christine, Lynda, Rico, Haja, Édienne, Ketsiah

export type RealPerson = 
  | 'Sarobidy' 
  | 'Belaza' 
  | 'Christine' 
  | 'Lynda' 
  | 'Rico' 
  | 'Haja' 
  | 'Édienne' 
  | 'Ketsiah'

export type DDVType = 
  | 'facturation' 
  | 'cnaps' 
  | 'achat' 
  | 'stc'

export type DDVStep = 
  | 'demande' 
  | 'matrice' 
  | 'haja' 
  | 'paye'

export type Department = 
  | 'Transit' 
  | 'Comptabilité' 
  | 'RH' 
  | 'Achat' 
  | 'Commercial'

export interface DDVItem {
  id: string
  type: DDVType
  montant: string // "À CONFIRMER" par défaut
  demandeur: RealPerson
  departement: Department
  etape: DDVStep
  ageJours: number
  slaCible: string // "À CONFIRMER" par défaut
  selected?: boolean
}

export interface Pillar {
  id: 'p1' | 'p2' | 'p3' | 'p4'
  name: string
  shortName: string
  score: number // 0-100
  trend: 'up' | 'down' | 'stable'
  isFocus?: boolean
}

export interface Objective {
  id: string
  label: string
  current: string // "À CONFIRMER" par défaut
  cible: string // "À CONFIRMER" par défaut
  unit?: string
}

export interface CoachingSignal {
  id: string
  cause: string
  levier: string
  gainEstime: string // "À CONFIRMER" par défaut
  sourcePersonne?: RealPerson
}

export interface CarnetEntry {
  id: string
  date: string
  type: 'decision' | 'escalade'
  description: string
  personneSource?: RealPerson
}

// Labels FR
export const DDV_TYPE_LABELS: Record<DDVType, string> = {
  facturation: 'Facturation Vente',
  cnaps: 'CNAPS',
  achat: 'Achat',
  stc: 'STC',
}

export const DDV_STEP_LABELS: Record<DDVStep, string> = {
  demande: 'Demande',
  matrice: 'Matrice',
  haja: 'Haja',
  paye: 'Payé',
}

export const PILLAR_NAMES: Record<string, string> = {
  p1: 'Exécution',
  p2: 'Cash',
  p3: 'Fidélité client',
  p4: 'Fluidité',
}

// Formulaires - Types
export type ModePaiement = 'appro_caisse' | 'especes' | 'cheque' | 'virement'
export type NatureMatriceV4 = 
  | 'achat_fournitures' 
  | 'achat_materiel' 
  | 'appro_caisse'
  | 'frais_transit'
  | 'frais_personnel'
  | 'autres'

export type DeclarationType = 'CNAPS' | 'OMSI' | 'FMFP'

export interface DDVFormData {
  numeroSerie: string
  date: string
  modePaiement: ModePaiement
  dateLivraison: string // obligatoire
  objet: string
  natureMatrice: NatureMatriceV4
  montantEstime: string // MGA - "À CONFIRMER"
  details: string // max 4 lignes
}

export interface FactureVenteFormData {
  client: string
  refDossier: string
  piecesRecues: boolean // verif obligatoire
  lignes: { libelle: string; montant: string }[]
  montantTotal: string
}

export interface DeclarationFormData {
  type: DeclarationType
  periode: string
  assiette: string
  taux: string
  montantDu: string
  dateLimiteLegale: string
}

export interface STCFormData {
  matricule: string
  nom: string // RH only - confidentiel
  elementsSolde: string
  net: string
  visas: string[]
}

export const MODE_PAIEMENT_LABELS: Record<ModePaiement, string> = {
  appro_caisse: 'Appro caisse',
  especes: 'Espèces',
  cheque: 'Chèque',
  virement: 'Virement',
}

export const NATURE_MATRICE_LABELS: Record<NatureMatriceV4, string> = {
  achat_fournitures: 'Achat fournitures',
  achat_materiel: 'Achat matériel',
  appro_caisse: 'Appro caisse',
  frais_transit: 'Frais transit',
  frais_personnel: 'Frais personnel',
  autres: 'Autres',
}

export const DECLARATION_TYPE_LABELS: Record<DeclarationType, string> = {
  CNAPS: 'CNAPS',
  OMSI: 'OMSI',
  FMFP: 'FMFP',
}

// Work Item for the queue (expanded from DDVItem)
export interface WorkItem {
  id: string
  type: DDVType
  ref: string
  montant: string
  demandeur: RealPerson
  etape: DDVStep
  ageJours: number
  slaCible: string
  actionLabel: string
}
