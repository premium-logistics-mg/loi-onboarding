import type { OneOnOne, CoachingAction, DevelopmentObjective } from './loi-types'

export const oneOnOnes: OneOnOne[] = [
  {
    lieutenant: 'Andry',
    date: '20 mai 2026',
    sujet: 'Retard rapprochement GALANA',
    decisions: 'Process accelere J+5 max',
    prochaineAction: 'Checklist BC systematique',
    deadline: '27 mai',
    status: 'in_progress'
  },
  {
    lieutenant: 'Feno',
    date: '19 mai 2026',
    sujet: 'Alertes retard non emises a temps (2 cas)',
    decisions: 'Monitoring renforce heures critiques',
    prochaineAction: 'Alarme automatique 30min',
    deadline: '26 mai',
    status: 'in_progress'
  },
  {
    lieutenant: 'Tojo',
    date: '21 mai 2026',
    sujet: 'Plan recuperation CAP ROUGE — Discipline chauffeurs',
    decisions: 'Tournee terrain 3x/semaine + entretiens systematiques',
    prochaineAction: 'Entretien Rakoto + Fidy cette semaine',
    deadline: '06 juin',
    status: 'in_progress'
  },
  {
    lieutenant: 'Naina',
    date: '18 mai 2026',
    sujet: 'Autonomie saisie fuel multi-station',
    decisions: 'Objectif zero erreur saisie',
    prochaineAction: 'Audit 50 saisies aleatoires',
    deadline: '30 mai',
    status: 'in_progress'
  }
]

export const coachingActions: CoachingAction[] = [
  { lieutenant: 'Andry', action: 'Documenter process rapprochement fuel J+5', deadline: '28 mai', completed: false },
  { lieutenant: 'Feno', action: 'Mettre en place alarme automatique retard 30min', deadline: '26 mai', completed: false },
  { lieutenant: 'Tojo', action: 'Conduire entretien Rakoto + plan correction', deadline: '26 mai', completed: false },
  { lieutenant: 'Tojo', action: 'Conduire entretien Fidy + plan correction', deadline: '28 mai', completed: false },
  { lieutenant: 'Naina', action: 'Maitriser saisie GALANA + TOTAL sans erreur', deadline: '02 juin', completed: true }
]

export const developmentObjectives: DevelopmentObjective[] = [
  { lieutenant: 'Andry', objective: 'Autonomie complete rapprochement fuel mensuel (GALANA + TOTAL)', progress: 55 },
  { lieutenant: 'Feno', objective: 'Taux alerte a temps ≥98% + reporting complet J+0', progress: 70 },
  { lieutenant: 'Tojo', objective: 'Sortir du CAP ROUGE — score ≥65 + zero chauffeur score <50', progress: 35 },
  { lieutenant: 'Naina', objective: 'Maitriser 100% saisies multi-station sans supervision', progress: 60 }
]
