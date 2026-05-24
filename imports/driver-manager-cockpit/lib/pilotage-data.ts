import type { Pipeline, Indicateur } from './loi-types'

export const pipelines: Pipeline[] = [
  {
    name: 'Cycle Fuel par Chauffeur',
    stages: [
      { label: 'Affectation voyage', icon: '📥', count: 5 },
      { label: 'Livraison GO (BC)', icon: '⛽', count: 4 },
      { label: 'Suivi GPS trajet', icon: '📡', count: 8 },
      { label: 'Calcul conso L/km', icon: '📊', count: 3 },
      { label: 'Detection ecart', icon: '⚠️', count: 2 },
      { label: 'Cloture voyage', icon: '✅', count: 12 }
    ]
  },
  {
    name: 'Gestion Incident Chauffeur',
    stages: [
      { label: 'Detection anomalie', icon: '🚨', count: 3 },
      { label: 'Documentation cause', icon: '📝', count: 2 },
      { label: 'Entretien chauffeur', icon: '👤', count: 2 },
      { label: 'Plan d\'action', icon: '📋', count: 4 },
      { label: 'Suivi 30j', icon: '✅', count: 6 }
    ]
  },
  {
    name: 'Rapprochement GO Livre vs Facture',
    stages: [
      { label: 'Collecte BC internes', icon: '📥', count: 2 },
      { label: 'Reception factures', icon: '📄', count: 3 },
      { label: 'Rapprochement litres', icon: '🔍', count: 1 },
      { label: 'Detection ecart >1%', icon: '⚠️', count: 1 },
      { label: 'Reclamation / Cloture', icon: '✅', count: 0 }
    ]
  }
]

export const indicateurs: Indicateur[] = [
  {
    label: 'Conso moyenne flotte (L/km)',
    value: '0.69 L/km',
    status: 'yellow',
    detail: 'Objectif 0.65 — Top 5 surconso: Rakoto, Bema, Doda, Fidy, Zo'
  },
  {
    label: 'Conformite trajet TMM→MMG (12h)',
    value: '88%',
    status: 'red',
    detail: '3 retards / 25 trajets ce mois'
  },
  {
    label: 'Conformite trajet MMG→ADM (14h)',
    value: '94%',
    status: 'yellow',
    detail: '1 retard / 18 trajets'
  },
  {
    label: 'Ecart GO livre vs facture',
    value: '1 247 L / 4.8M Ar',
    status: 'red',
    detail: 'GALANA TMM +850L, TOTAL MMG +397L'
  },
  {
    label: 'Alertes retard emises a temps',
    value: '96%',
    status: 'yellow',
    detail: 'Cible ≥98% — 2 retards non signales a temps'
  },
  {
    label: 'Chauffeurs score < 60',
    value: '4 chauffeurs',
    status: 'red',
    detail: 'Rakoto (48), Fidy (52), Doda (55), Faniry (56)'
  },
  {
    label: 'Trajets sans suivi GPS',
    value: '2 cette semaine',
    status: 'red',
    detail: '6846TCB (panne tracker), 7057TCB (zone blanche)'
  }
]

export const ranking = {
  top5: [
    { rank: 1, nom: 'Tiana', score: 95, camion: '7066TCB' },
    { rank: 2, nom: 'Vola', score: 92, camion: '6839TCB' },
    { rank: 3, nom: 'Njaka', score: 91, camion: '7049TCB' },
    { rank: 4, nom: 'Nary', score: 90, camion: '6840TCB' },
    { rank: 5, nom: 'Aina', score: 88, camion: '6842TCB' }
  ],
  bottom5: [
    { rank: 14, nom: 'Faniry', score: 56, camion: '6845TCB' },
    { rank: 15, nom: 'Doda', score: 55, camion: '7003TCB' },
    { rank: 16, nom: 'Fidy', score: 52, camion: '6838TCB' },
    { rank: 17, nom: 'Bema', score: 58, camion: '6846TCB' },
    { rank: 18, nom: 'Rakoto', score: 48, camion: '6851TCB', critical: true }
  ]
}

export const standards = {
  corridors: [
    { corridor: 'TMM → MMG', sens: 'Aller', tempsStandard: '12h max' },
    { corridor: 'MMG → TMM', sens: 'Retour', tempsStandard: '12h max' },
    { corridor: 'MMG → ADM', sens: 'Aller', tempsStandard: '14h max' },
    { corridor: 'ADM → MMG', sens: 'Retour', tempsStandard: '16h max' }
  ],
  consommation: [
    { type: 'Mixte', objectif: '≤ 0.65 L/km' },
    { type: 'Plein aller / plein retour', objectif: '≤ 0.75 L/km' }
  ]
}
