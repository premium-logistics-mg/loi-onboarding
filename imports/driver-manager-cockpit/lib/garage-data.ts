import type { 
  FleetDriverCard, 
  OverviewKPICard, 
  Workflow, 
  SignauxHSEData,
  DriverProfile360 
} from './garage-types'

export const overviewCardsRow1: OverviewKPICard[] = [
  {
    title: 'Top 5 chauffeurs economes',
    subtitle: 'vs flotte 31.2 L/100km',
    icon: '⛽',
    color: 'green',
    data: [
      { ref: 'DRV-001', value: '28.5 L/100km', delta: '-8.7%' },
      { ref: 'DRV-005', value: '29.1 L/100km', delta: '-6.7%' },
      { ref: 'DRV-008', value: '29.8 L/100km', delta: '-4.5%' },
      { ref: 'DRV-013', value: '30.2 L/100km', delta: '-3.2%' },
      { ref: 'DRV-002', value: '30.5 L/100km', delta: '-2.2%' }
    ]
  },
  {
    title: 'Top 5 safety events 7j',
    subtitle: '10 events flotte',
    icon: '⚠️',
    color: 'yellow',
    data: [
      { ref: 'DRV-007', value: '3 events' },
      { ref: 'DRV-006', value: '2 events' },
      { ref: 'DRV-010', value: '2 events' },
      { ref: 'DRV-012', value: '2 events' },
      { ref: 'DRV-009', value: '1 event' }
    ]
  },
  {
    title: 'Alignment score flotte',
    subtitle: 'cible ≥80%',
    icon: '●',
    color: 'green',
    mainValue: '84%',
    detail: 'Quiz Q1 2026 · 15 chauffeurs'
  },
  {
    title: 'Wellness pulse flotte 30j',
    subtitle: 'NPS · +39',
    icon: '💚',
    color: 'green',
    detail: '87% repondants · cible >+30'
  },
  {
    title: 'Top 5 preservateurs',
    subtitle: 'Asset Preservation YTD',
    icon: '●',
    color: 'teal',
    data: [
      { ref: 'DRV-001', value: '92/100' },
      { ref: 'DRV-008', value: '90/100' },
      { ref: 'DRV-002', value: '89/100' },
      { ref: 'DRV-013', value: '89/100' },
      { ref: 'DRV-005', value: '88/100' }
    ]
  }
]

export const overviewCardsRow2: OverviewKPICard[] = [
  {
    title: '1-on-1 backlog',
    subtitle: 'cible 100% / trimestre',
    icon: '■',
    color: 'neutral',
    mainValue: '8/13',
    detail: '5 chauffeurs J-90+'
  },
  {
    title: 'Permis & medicales J-60/J-30',
    subtitle: '3 permis · 1 medicales',
    color: 'red',
    data: [
      { icon: '📜', ref: 'DRV-010', value: 'J-37' },
      { icon: '📜', ref: 'DRV-007', value: 'J-45' },
      { icon: '🩺', ref: 'DRV-014', value: 'J-6' }
    ]
  },
  {
    title: 'Voice of Driver 30j',
    subtitle: '5 frustrations · 3 idees',
    icon: '🗣️',
    color: 'yellow',
    detail: '2/5 actions COO',
    secondLine: 'Status · envoye'
  },
  {
    title: 'Video CEO trimestrielle',
    subtitle: 'cible >80% vues',
    icon: '🎬',
    color: 'green',
    mainValue: '87%',
    detail: 'Q1-2026 · 13/15 vues'
  },
  {
    title: 'Service Client flotte',
    subtitle: 'NPS retours 8/10',
    icon: '💛',
    color: 'green',
    detail: 'Top · PENTA-OCEAN · APC · JIRAMA',
    secondLine: '0 incident comportement 30j'
  }
]

export const workflows: Workflow[] = [
  {
    icon: '📋',
    title: 'Programmer 1-on-1',
    description: 'Date · format · agenda IA suggere'
  },
  {
    icon: '⚠',
    title: 'Capturer safety event M13',
    description: 'Type · severite · photo · cascade auto ≥4'
  },
  {
    icon: '📢',
    title: 'Lancer brief equipe lundi',
    description: '3 messages max · canal · preuve photo'
  },
  {
    icon: '🔁',
    title: 'Creer une passation',
    description: 'Sortant · entrant · vehicule · client · notes'
  },
  {
    icon: '⬆',
    title: 'Escalation Joel',
    description: 'Demande aide coach OU cascade severity ≥4'
  }
]

export const signauxHSE: SignauxHSEData = {
  title: 'Trace M13',
  subtitle: '3 near-miss 30j',
  rightLabel: '1 signal(s) DM',
  filter: ['Tous', '🔴 Open', '🟡 Acknowledged'],
  signals: [
    {
      id: 'oublie_systematique',
      severity: 'warning',
      description: 'Chauffeurs verifient ceinture seulement 22% sur 30j (cible >70%) · briefing requis',
      status: 'open'
    }
  ],
  bascule: {
    label: '💚 Bascule 3 · Pulse near-miss chauffeurs 30j · INCITATION (PAS SANCTION)',
    detail: '3 declarations chauffeurs 30j · culture_score_bonus +3 agrege anonyme · target ≥0.5 / chauffeur (13 actifs).'
  }
}

export const fleetGrid: FleetDriverCard[] = [
  {
    code: 'DRV-001',
    score: 92,
    statusEmoji: '🟢',
    nom: 'Rakotoarisoa',
    prenom: 'Hery',
    vehicule: 'CT-001',
    badges: [
      { type: 'top5_econome', label: '🥇 TOP5 ECONOME' },
      { type: 'preservateur', label: '🛡 PRESERVATEUR' }
    ]
  },
  {
    code: 'DRV-002',
    score: 87,
    statusEmoji: '🟢',
    nom: 'Andrianjafy',
    prenom: 'Naina',
    vehicule: 'CT-002',
    badges: [
      { type: 'top5_econome', label: '🥇 TOP5 ECONOME' },
      { type: 'preservateur', label: '🛡 PRESERVATEUR' }
    ]
  },
  {
    code: 'DRV-003',
    score: 83,
    statusEmoji: '🟢',
    nom: 'Rasoanaivo',
    prenom: 'Tahiry',
    vehicule: 'CT-003',
    badges: [
      { type: 'preservateur', label: '🛡 PRESERVATEUR' }
    ]
  },
  {
    code: 'DRV-004',
    score: 86,
    statusEmoji: '🟢',
    nom: 'Ramanantsoa',
    prenom: 'Tojo',
    vehicule: 'CT-004',
    badges: [
      { type: 'preservateur', label: '🛡 PRESERVATEUR' }
    ]
  },
  {
    code: 'DRV-005',
    score: 82,
    statusEmoji: '🟢',
    nom: 'Razafindrakoto',
    prenom: 'Mamy',
    vehicule: 'CT-005',
    badges: [
      { type: 'top5_econome', label: '🥇 TOP5 ECONOME' },
      { type: 'preservateur', label: '🛡 PRESERVATEUR' },
      { type: 'permis_alerte', label: '📜 PERMIS J-49', jours: 49 }
    ]
  },
  {
    code: 'DRV-006',
    score: 78,
    statusEmoji: '🟢',
    nom: 'Andriamampianina',
    prenom: 'Tovo',
    vehicule: 'CT-006',
    badges: []
  },
  {
    code: 'DRV-007',
    score: 67,
    statusEmoji: '🟢',
    nom: 'Rakotomalala',
    prenom: 'Eladrano',
    vehicule: 'CT-007',
    badges: [
      { type: 'permis_alerte', label: '📜 PERMIS J-45', jours: 45 }
    ]
  },
  {
    code: 'DRV-008',
    score: 91,
    statusEmoji: '🟢',
    nom: 'Ranaivoson',
    prenom: 'Fanja',
    vehicule: 'CT-008',
    badges: [
      { type: 'top5_econome', label: '🥇 TOP5 ECONOME' },
      { type: 'preservateur', label: '🛡 PRESERVATEUR' }
    ]
  },
  {
    code: 'DRV-009',
    score: 83,
    statusEmoji: '🟢',
    nom: 'Rabe',
    prenom: 'Lalaina',
    vehicule: 'CT-009',
    badges: []
  },
  {
    code: 'DRV-010',
    score: 75,
    statusEmoji: '🟢',
    nom: 'Andriananavalona',
    prenom: 'Soa',
    vehicule: 'CT-010',
    badges: [
      { type: 'permis_alerte', label: '📜 PERMIS J-37', jours: 37 }
    ]
  },
  {
    code: 'DRV-011',
    score: null,
    statusEmoji: '🚌',
    nom: 'Rajaonarisoa',
    prenom: 'Toky',
    vehicule: 'CT-011',
    badges: []
  },
  {
    code: 'DRV-012',
    score: 81,
    statusEmoji: '🟢',
    nom: 'Ratsimba',
    prenom: 'Mahery',
    vehicule: 'CT-012',
    badges: []
  },
  {
    code: 'DRV-013',
    score: 88,
    statusEmoji: '🟢',
    nom: 'Andriamanantsoa',
    prenom: 'Hasina',
    vehicule: 'CT-013',
    badges: [
      { type: 'top5_econome', label: '🥇 TOP5 ECONOME' },
      { type: 'preservateur', label: '🛡 PRESERVATEUR' }
    ]
  },
  {
    code: 'DRV-014',
    score: null,
    statusEmoji: '🤒',
    nom: 'Ratsimbazafy',
    prenom: 'Heritiana',
    vehicule: 'CT-014',
    badges: [
      { type: 'medicale_alerte', label: '🩺 MEDICALE J-6', jours: 6 }
    ]
  },
  {
    code: 'DRV-015',
    score: 84,
    statusEmoji: '🟢',
    nom: 'Rakotonirina',
    prenom: 'Rojo',
    vehicule: 'CT-015',
    badges: [
      { type: 'preservateur', label: '🛡 PRESERVATEUR' }
    ]
  }
]

// Full driver profiles for 360° view
export const driverProfiles: Record<string, DriverProfile360> = {
  'DRV-002': {
    code: 'DRV-002',
    nom: 'Andrianjafy',
    prenom: 'Naina',
    vehicule: 'CT-002',
    statut: 'actif',
    consentM13: true,
    identite: {
      matricule: 'PL-CHF-002',
      typeContrat: 'CDI',
      permis: 'CE · expire 2030-09-03',
      medicaleProchaine: '2026-12-05',
      dateEmbauche: '2021-03-15',
      anciennete: '5 ans 2 mois',
      vehiculePrincipal: 'CT-002',
      corridor: 'TMM → MMG (principal)',
      telephone: '+261 34 12 345 67',
      contactUrgence: 'Rakoto Marie · +261 34 98 765 43',
      adresse: 'Antananarivo',
      formations: ['Conduite defensive 2024', 'Eco-driving 2025']
    },
    performance: {
      scoreGlobal: 87,
      trend: 'up',
      consoL100km: 30.5,
      consoObjectif: 31.2,
      ecartFuel: '-2.2% vs flotte',
      rankFuel: 5,
      conformiteTrajet: 94,
      retards30j: 1,
      voyagesMois: 11,
      kmMois: 6814,
      historiqueScore: [
        { mois: 'Jan', score: 82 },
        { mois: 'Fev', score: 84 },
        { mois: 'Mar', score: 85 },
        { mois: 'Avr', score: 87 }
      ],
      percentile: 78
    },
    safety: {
      safetyScore: 85,
      events30j: 1,
      events90j: 3,
      eventsYTD: 5,
      safetyEvents: [
        {
          date: '2026-05-18',
          type: 'near_miss',
          severity: 2,
          description: 'Evitement obstacle RN7 km 234',
          status: 'closed',
          actionPrise: 'Debriefing effectue'
        },
        {
          date: '2026-04-25',
          type: 'incident',
          severity: 3,
          description: 'Freinage urgence - pieton',
          status: 'closed',
          actionPrise: 'Formation rappel vigilance'
        }
      ],
      ceinture30j: 98,
      vitesse30j: 95,
      reposRespecte: true,
      consentM13: true
    },
    wellness: {
      npsIndividuel: 45,
      dernierPulse: '2026-05-15',
      frustrations: ['Attente dechargement trop longue', 'Route RN7 degradee'],
      idees: ['Pause dejeuner fixe a Antsirabe'],
      dernierOneOnOne: '2026-05-10',
      prochainOneOnOne: '2026-06-07',
      backlogJours: 43,
      coachingActions: [
        { action: 'Reduire temps moteur au ralenti', deadline: '2026-06-15', status: 'in_progress' },
        { action: 'Participer formation eco-conduite avancee', deadline: '2026-07-01', status: 'pending' }
      ],
      objectif90j: 'Reduire conso de 5% sur corridor TMM→MMG',
      objectifProgress: 60
    },
    carnetDeBord: {
      entries: [
        { date: '22 mai', type: 'note', auteur: 'Serge', contenu: 'Bon retour client PENTA-OCEAN sur livraison J-2', tags: ['client', 'positif'] },
        { date: '18 mai', type: 'decision', auteur: 'Serge', contenu: 'Affecte corridor MMG→ADM pour 2 semaines (test)', tags: ['affectation'] },
        { date: '15 mai', type: 'event', auteur: 'Systeme', contenu: 'Retard 45min corridor TMM→MMG — cause embouteillage RN2', tags: ['retard'] },
        { date: '10 mai', type: 'feedback', auteur: 'Serge', contenu: '1-on-1 positif, motivation elevee', tags: ['coaching'] }
      ]
    },
    assetPreservation: {
      scorePreservation: 89,
      rankFlotte: 3,
      vehicule: 'CT-002',
      kmDepuisAffectation: 42000,
      pneusEclatesDepuisAffect: 1,
      pannesCauseConduite: 0,
      accidentsResponsable: 0,
      freinagesBrusques30j: 3,
      accelerationsBrusques30j: 2,
      moyenneFlotte: 85,
      ecart: '+4 vs flotte',
      historiquePreservation: [
        { mois: 'Jan', score: 86 },
        { mois: 'Fev', score: 87 },
        { mois: 'Mar', score: 88 },
        { mois: 'Avr', score: 89 }
      ]
    },
    ambassadeClient: {
      npsClient: 8,
      clientsServis30j: ['PENTA-OCEAN', 'APC', 'JIRAMA'],
      retours: [
        { date: '2026-05-20', client: 'PENTA-OCEAN', note: 9, commentaire: 'Livraison impeccable, chauffeur courtois', type: 'positif' },
        { date: '2026-05-12', client: 'APC', note: 8, commentaire: 'RAS', type: 'positif' },
        { date: '2026-04-28', client: 'JIRAMA', note: 7, commentaire: 'Leger retard mais bien communique', type: 'neutre' }
      ],
      incidentsComportement30j: 0,
      incidentsComportementYTD: 1,
      scoreAmbassadeur: 88
    }
  },
  'DRV-001': {
    code: 'DRV-001',
    nom: 'Rakotoarisoa',
    prenom: 'Hery',
    vehicule: 'CT-001',
    statut: 'actif',
    consentM13: true,
    identite: {
      matricule: 'PL-CHF-001',
      typeContrat: 'CDI',
      permis: 'CE · expire 2029-06-15',
      medicaleProchaine: '2026-11-20',
      dateEmbauche: '2019-08-01',
      anciennete: '6 ans 9 mois',
      vehiculePrincipal: 'CT-001',
      corridor: 'TMM → TLR (principal)',
      telephone: '+261 34 11 222 33',
      contactUrgence: 'Rabe Voahangy · +261 34 44 555 66',
      adresse: 'Toamasina',
      formations: ['Conduite defensive 2023', 'Eco-driving 2024', 'Securite avancee 2025']
    },
    performance: {
      scoreGlobal: 92,
      trend: 'stable',
      consoL100km: 28.5,
      consoObjectif: 31.2,
      ecartFuel: '-8.7% vs flotte',
      rankFuel: 1,
      conformiteTrajet: 98,
      retards30j: 0,
      voyagesMois: 14,
      kmMois: 8200,
      historiqueScore: [
        { mois: 'Jan', score: 90 },
        { mois: 'Fev', score: 91 },
        { mois: 'Mar', score: 92 },
        { mois: 'Avr', score: 92 }
      ],
      percentile: 95
    },
    safety: {
      safetyScore: 94,
      events30j: 0,
      events90j: 1,
      eventsYTD: 2,
      safetyEvents: [
        {
          date: '2026-03-10',
          type: 'near_miss',
          severity: 1,
          description: 'Animal sur la route - evitement reussi',
          status: 'closed',
          actionPrise: 'Aucune action requise'
        }
      ],
      ceinture30j: 100,
      vitesse30j: 99,
      reposRespecte: true,
      consentM13: true
    },
    wellness: {
      npsIndividuel: 52,
      dernierPulse: '2026-05-18',
      frustrations: ['Paperasse administrative'],
      idees: ['Application mobile pour rapports'],
      dernierOneOnOne: '2026-05-15',
      prochainOneOnOne: '2026-06-12',
      backlogJours: 8,
      coachingActions: [
        { action: 'Mentor pour nouveaux chauffeurs', deadline: '2026-06-01', status: 'done' }
      ],
      objectif90j: 'Maintenir excellence et former 2 nouveaux',
      objectifProgress: 80
    },
    carnetDeBord: {
      entries: [
        { date: '20 mai', type: 'note', auteur: 'Serge', contenu: 'Excellent mentor pour DRV-011', tags: ['coaching', 'positif'] },
        { date: '15 mai', type: 'feedback', auteur: 'Serge', contenu: 'Chauffeur exemplaire, reference equipe', tags: ['performance'] }
      ]
    },
    assetPreservation: {
      scorePreservation: 92,
      rankFlotte: 1,
      vehicule: 'CT-001',
      kmDepuisAffectation: 85000,
      pneusEclatesDepuisAffect: 0,
      pannesCauseConduite: 0,
      accidentsResponsable: 0,
      freinagesBrusques30j: 1,
      accelerationsBrusques30j: 1,
      moyenneFlotte: 85,
      ecart: '+7 vs flotte',
      historiquePreservation: [
        { mois: 'Jan', score: 91 },
        { mois: 'Fev', score: 91 },
        { mois: 'Mar', score: 92 },
        { mois: 'Avr', score: 92 }
      ]
    },
    ambassadeClient: {
      npsClient: 9,
      clientsServis30j: ['HOLCIM', 'STAR', 'TOTAL'],
      retours: [
        { date: '2026-05-19', client: 'HOLCIM', note: 10, commentaire: 'Exemplaire comme toujours', type: 'positif' },
        { date: '2026-05-10', client: 'STAR', note: 9, commentaire: 'Tres professionnel', type: 'positif' }
      ],
      incidentsComportement30j: 0,
      incidentsComportementYTD: 0,
      scoreAmbassadeur: 95
    }
  }
}

// Generate basic profiles for other drivers
const baseDrivers = fleetGrid.filter(d => !['DRV-001', 'DRV-002'].includes(d.code))
baseDrivers.forEach(driver => {
  const score = driver.score || 75
  driverProfiles[driver.code] = {
    code: driver.code,
    nom: driver.nom,
    prenom: driver.prenom,
    vehicule: driver.vehicule,
    statut: driver.statusEmoji === '🟢' ? 'actif' : driver.statusEmoji === '🚌' ? 'en_route' : driver.statusEmoji === '🤒' ? 'malade' : 'inactif',
    consentM13: true,
    identite: {
      matricule: `PL-CHF-${driver.code.split('-')[1]}`,
      typeContrat: 'CDI',
      permis: 'CE · expire 2028-12-31',
      medicaleProchaine: '2026-10-15',
      dateEmbauche: '2022-01-15',
      anciennete: '4 ans 4 mois',
      vehiculePrincipal: driver.vehicule,
      corridor: 'TMM → ANT (principal)',
      telephone: '+261 34 XX XXX XX',
      contactUrgence: 'Contact urgence',
      adresse: 'Antananarivo',
      formations: ['Conduite defensive 2024']
    },
    performance: {
      scoreGlobal: score,
      trend: score > 80 ? 'up' : score > 70 ? 'stable' : 'down',
      consoL100km: 31.2 - (score - 75) * 0.1,
      consoObjectif: 31.2,
      ecartFuel: `${score > 80 ? '-' : '+'}${Math.abs((score - 80) * 0.2).toFixed(1)}% vs flotte`,
      rankFuel: Math.floor(16 - score / 6),
      conformiteTrajet: Math.min(100, score + 5),
      retards30j: Math.max(0, Math.floor((90 - score) / 10)),
      voyagesMois: 10 + Math.floor(score / 10),
      kmMois: 5000 + score * 30,
      historiqueScore: [
        { mois: 'Jan', score: score - 3 },
        { mois: 'Fev', score: score - 2 },
        { mois: 'Mar', score: score - 1 },
        { mois: 'Avr', score }
      ],
      percentile: score
    },
    safety: {
      safetyScore: Math.min(100, score + 5),
      events30j: Math.max(0, Math.floor((85 - score) / 15)),
      events90j: Math.max(0, Math.floor((85 - score) / 10)),
      eventsYTD: Math.max(0, Math.floor((85 - score) / 5)),
      safetyEvents: [],
      ceinture30j: Math.min(100, score + 10),
      vitesse30j: Math.min(100, score + 8),
      reposRespecte: score > 75,
      consentM13: true
    },
    wellness: {
      npsIndividuel: score - 50,
      dernierPulse: '2026-05-10',
      frustrations: [],
      idees: [],
      dernierOneOnOne: '2026-04-15',
      prochainOneOnOne: '2026-06-15',
      backlogJours: 40,
      coachingActions: [],
      objectif90j: 'Amelioration continue',
      objectifProgress: 50
    },
    carnetDeBord: {
      entries: []
    },
    assetPreservation: {
      scorePreservation: score - 3,
      rankFlotte: Math.floor(16 - score / 6),
      vehicule: driver.vehicule,
      kmDepuisAffectation: 30000,
      pneusEclatesDepuisAffect: Math.max(0, Math.floor((85 - score) / 20)),
      pannesCauseConduite: 0,
      accidentsResponsable: 0,
      freinagesBrusques30j: Math.max(0, Math.floor((90 - score) / 5)),
      accelerationsBrusques30j: Math.max(0, Math.floor((90 - score) / 5)),
      moyenneFlotte: 85,
      ecart: `${score > 85 ? '+' : ''}${score - 85} vs flotte`,
      historiquePreservation: [
        { mois: 'Jan', score: score - 6 },
        { mois: 'Fev', score: score - 5 },
        { mois: 'Mar', score: score - 4 },
        { mois: 'Avr', score: score - 3 }
      ]
    },
    ambassadeClient: {
      npsClient: Math.floor(score / 10),
      clientsServis30j: ['CLIENT A', 'CLIENT B'],
      retours: [],
      incidentsComportement30j: 0,
      incidentsComportementYTD: Math.max(0, Math.floor((80 - score) / 20)),
      scoreAmbassadeur: score
    }
  }
})
