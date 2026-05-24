import type { OneOnOne, CoachingAction, DevelopmentObjective } from './loi-types'

export const oneOnOnes: OneOnOne[] = [
  { 
    lieutenant: 'Mamy', 
    date: '20 mai 2026', 
    sujet: 'Retards planification OT — 2 dépassements ce mois', 
    decisions: 'Anticiper J-3 minimum, planning glissant', 
    prochaineAction: 'Revoir planning S22 avec pré-alertes', 
    deadline: '27 mai', 
    status: 'in_progress' 
  },
  { 
    lieutenant: 'Lova', 
    date: '19 mai 2026', 
    sujet: 'Diagnostic 7046TCB — Qualité documentation', 
    decisions: 'Photos + checklist systématique', 
    prochaineAction: 'Template diagnostic standardisé', 
    deadline: '26 mai', 
    status: 'in_progress' 
  },
  { 
    lieutenant: 'Dina', 
    date: '21 mai 2026', 
    sujet: 'Plan récupération CAP ROUGE — Traçabilité pneus défaillante', 
    decisions: 'Inventaire physique complet + mise à jour fiches', 
    prochaineAction: 'Inventaire 100% pneus stock + montés', 
    deadline: '28 mai', 
    status: 'in_progress' 
  },
  { 
    lieutenant: 'Rado', 
    date: '18 mai 2026', 
    sujet: 'Autonomie clôture OT', 
    decisions: 'Test 5 OT sans supervision cette semaine', 
    prochaineAction: 'Valider qualité des 5 OT', 
    deadline: '25 mai', 
    status: 'done' 
  }
]

export const coachingActions: CoachingAction[] = [
  { lieutenant: 'Mamy', action: 'Mettre en place planning glissant J-7 avec alertes automatiques', deadline: '28 mai', completed: false },
  { lieutenant: 'Lova', action: 'Créer template diagnostic avec photos + checklist', deadline: '26 mai', completed: false },
  { lieutenant: 'Dina', action: 'Inventaire physique 100% pneus (stock + montés sur camions)', deadline: '30 mai', completed: false },
  { lieutenant: 'Dina', action: 'Mettre à jour toutes les fiches pneus avec km réels', deadline: '02 juin', completed: false },
  { lieutenant: 'Rado', action: 'Clôturer 5 OT seul sans supervision', deadline: '25 mai', completed: true }
]

export const developmentObjectives: DevelopmentObjective[] = [
  { lieutenant: 'Mamy', objective: 'Zéro OT en retard — planification anticipée systématique J-7', progress: 50 },
  { lieutenant: 'Lova', objective: 'Réduire temps moyen diagnostic de 30% (documentation structurée)', progress: 65 },
  { lieutenant: 'Dina', objective: 'Sortir du CAP ROUGE — traçabilité 100% pneus + stock à jour', progress: 30 },
  { lieutenant: 'Rado', objective: 'Autonomie complète saisie et clôture OT sans supervision', progress: 70 }
]
