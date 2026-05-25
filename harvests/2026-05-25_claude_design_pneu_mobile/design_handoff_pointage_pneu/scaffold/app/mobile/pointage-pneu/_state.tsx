'use client';

import * as React from 'react';
import type {
  Vehicle, PositionCode, TireEvent, TireSelection, CapturedPhoto,
} from './_types';

export type StepIndex = 1 | 2 | 3 | 4 | 5;

export interface WizardState {
  step: StepIndex;
  vehicle?: Vehicle;
  position?: PositionCode;
  event?: TireEvent;
  brand?: TireSelection;
  serial?: string;
  km?: number;
  photos: CapturedPhoto[];
  /** Référence locale générée à la validation de l'étape 4 (offline-first). */
  localRef?: string;
}

type Action =
  | { type: 'goto'; step: StepIndex }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'setVehicle'; vehicle: Vehicle }
  | { type: 'setPosition'; position: PositionCode }
  | { type: 'setEvent'; event: TireEvent }
  | { type: 'setBrand'; brand: TireSelection }
  | { type: 'setSerial'; serial: string }
  | { type: 'setKm'; km: number }
  | { type: 'addPhoto'; photo: CapturedPhoto }
  | { type: 'commit'; localRef: string }
  | { type: 'reset' };

const initial: WizardState = { step: 1, photos: [] };

function clamp(n: number): StepIndex {
  return Math.min(5, Math.max(1, n)) as StepIndex;
}

function reducer(s: WizardState, a: Action): WizardState {
  switch (a.type) {
    case 'goto': return { ...s, step: a.step };
    case 'next': return { ...s, step: clamp(s.step + 1) };
    case 'back': return { ...s, step: clamp(s.step - 1) };
    case 'setVehicle':  return { ...s, vehicle: a.vehicle };
    case 'setPosition': return { ...s, position: a.position };
    case 'setEvent':    return { ...s, event: a.event };
    case 'setBrand':    return { ...s, brand: a.brand };
    case 'setSerial':   return { ...s, serial: a.serial };
    case 'setKm':       return { ...s, km: a.km };
    case 'addPhoto':    return { ...s, photos: [...s.photos, a.photo] };
    case 'commit':      return { ...s, localRef: a.localRef, step: 5 };
    case 'reset':       return initial;
    default:            return s;
  }
}

interface Ctx {
  state: WizardState;
  dispatch: React.Dispatch<Action>;
  canContinue: boolean;
  hint?: string;
}

const WizardCtx = React.createContext<Ctx | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initial);

  const { canContinue, hint } = React.useMemo(() => {
    switch (state.step) {
      case 1: return state.vehicle
        ? { canContinue: true,  hint: `${state.vehicle.code} · ${state.vehicle.plate} sélectionné` }
        : { canContinue: false, hint: 'Sélectionne un véhicule' };
      case 2: return state.position
        ? { canContinue: true,  hint: `Position ${state.position} enregistrée` }
        : { canContinue: false, hint: 'Tape sur le pneu concerné' };
      case 3: return state.event
        ? { canContinue: true,  hint: `Événement : ${labelForEvent(state.event)}` }
        : { canContinue: false, hint: 'Choisis le type d\u2019événement' };
      case 4: {
        const filled =
          (state.brand ? 1 : 0) + (state.serial ? 1 : 0) +
          (state.km !== undefined ? 1 : 0) + (state.photos.length ? 1 : 0);
        return {
          canContinue: filled === 4,
          hint: `${filled} / 4 champs renseignés`,
        };
      }
      case 5: return { canContinue: true, hint: undefined };
      default: return { canContinue: false, hint: undefined };
    }
  }, [state]);

  return (
    <WizardCtx.Provider value={{ state, dispatch, canContinue, hint }}>
      {children}
    </WizardCtx.Provider>
  );
}

export function useWizard(): Ctx {
  const ctx = React.useContext(WizardCtx);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}

function labelForEvent(e: TireEvent): string {
  return { inspection: 'Inspection', montage: 'Montage', depose: 'Dépose',
    reparation: 'Réparation', remplacement: 'Remplacement' }[e];
}

export { labelForEvent };
