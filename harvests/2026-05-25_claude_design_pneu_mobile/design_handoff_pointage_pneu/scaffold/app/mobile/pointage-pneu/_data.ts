// Data shims — à remplacer par les accesseurs réels de lib/loi-master-dataset.
// Toute donnée affichée provient (à terme) du master dataset.
// Aucune valeur inventée ne doit traverser cette frontière.

import type { Vehicle, AxleConfig, TireBrand, VehicleCode } from './_types';

// ─────────────────────────────────────────────────────────────
// Accesseurs attendus (signatures stables côté UI)
// ─────────────────────────────────────────────────────────────

export async function getMechanicMatricule(): Promise<string> {
  // TODO write-path : récupérer depuis la session
  return 'PL-MEC-007'; // À CONFIRMER (session réelle)
}

export async function getRecentVehiclesForMechanic(
  matricule: string,
  limit = 4
): Promise<Vehicle[]> {
  // TODO : lib/loi-master-dataset.fleet.recentForMechanic(matricule, limit)
  // Valeurs ci-dessous : modèles/sites tirés du contexte LOI § 3.
  // Plaques d'exemple — format suffixe `TCB` mentionné §3, masque exact À CONFIRMER.
  return [
    {
      code: 'CT-007', plate: '4271 TCB', model: 'SCHACMAN F3000 6X4',
      config: '6x4', homeSite: 'Garage Betainomby',
      lastUsedAt: new Date().toISOString(),
    },
    {
      code: 'CT-002', plate: '1183 TCB', model: 'SCHACMAN F3000 6X4',
      config: '6x4', homeSite: 'Port Toamasina · PDP',
    },
    {
      code: 'CT-011', plate: '5602 TCB', model: 'RENAULT KERAX',
      config: '6x4', homeSite: 'APC Andriamena · RN44',
    },
    {
      code: 'CT-005', plate: '2945 TCB', model: 'SCHACMAN F3000 6X4',
      config: '6x4', homeSite: 'Moramanga · relais',
    },
  ].slice(0, limit);
}

export async function getAxleConfigForVehicle(code: VehicleCode): Promise<AxleConfig> {
  // TODO : depuis le master dataset.
  // Mapping CT-### → config À CONFIRMER côté LOI (parc KERAX notamment).
  void code;
  return '6x4';
}

export async function getTireBrands(): Promise<TireBrand[]> {
  // TODO : liste fermée LOI — pas de texte libre côté terrain.
  // Exemples plausibles PL — À CONFIRMER la liste retenue.
  return [
    { name: 'Michelin XZA2',     sizes: ['315/80 R22.5 · 154/150 M'] },
    { name: 'Michelin X Multi D',sizes: ['315/80 R22.5 · 156/150 L'] },
    { name: 'Bridgestone M729',  sizes: ['315/80 R22.5 · 156/150 K'] },
    { name: 'Continental HDR2',  sizes: ['315/80 R22.5 · 156/150 K'] },
    { name: 'Goodyear KMAX D',   sizes: ['315/80 R22.5 · 156/150 L'] },
  ];
}

// ─────────────────────────────────────────────────────────────
// Helpers UI (purs)
// ─────────────────────────────────────────────────────────────

export function decodePositionCode(code: string): string {
  // 'MOT 2ESS-EXT-G' → 'Essieu 2 · Extérieur · Gauche'
  const m = code.match(/^(MOT|REM)\s+(\d)ESS(?:-(EXT|INT))?-([GD])$/);
  if (!m) return code;
  const [, , axle, lane, side] = m;
  const parts = [`Essieu ${axle}`];
  if (lane) parts.push(lane === 'EXT' ? 'Extérieur' : 'Intérieur');
  parts.push(side === 'G' ? 'Gauche' : 'Droite');
  return parts.join(' · ');
}

export function buildLocalRef(seq: number, now = new Date()): string {
  // PNEU-AAAA-MMDD-####  — format À CONFIRMER
  const y = now.getFullYear();
  const md = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `PNEU-${y}-${md}-${String(seq).padStart(4, '0')}`;
}

export function formatKm(n: number): string {
  return n.toLocaleString('fr-FR') + ' km';
}
