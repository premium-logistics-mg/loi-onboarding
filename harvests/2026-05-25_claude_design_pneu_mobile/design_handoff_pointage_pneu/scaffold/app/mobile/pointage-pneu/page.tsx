'use client';

import * as React from 'react';
import { WizardProvider, useWizard } from './_state';
import { AppBar, StatusBar, StepsBar, ActionBar, MatChip, TruckChip, GestureNav } from './_components/Shell';
import { Step1Vehicle } from './_components/Step1Vehicle';
import { Step2Position } from './_components/Step2Position';
import { Step3Event } from './_components/Step3Event';
import { Step4Details } from './_components/Step4Details';
import { Step5Confirm } from './_components/Step5Confirm';
import { buildLocalRef } from './_data';

export default function PointagePneuPage() {
  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  );
}

function WizardShell() {
  const { state, dispatch, canContinue, hint } = useWizard();
  const { step, vehicle } = state;

  // Action bar config per step
  const action = (() => {
    switch (step) {
      case 1:
        return { primary: 'Continuer', secondary: undefined, onPrimary: next };
      case 2: case 3:
        return { primary: 'Continuer', secondary: 'Retour', onPrimary: next, onSecondary: back };
      case 4:
        return { primary: 'Valider', secondary: 'Retour', onPrimary: commit, onSecondary: back };
      case 5:
        return { primary: 'Nouveau pointage', secondary: 'Terminer', onPrimary: resetWizard };
      default: return { primary: 'Continuer' };
    }
  })();

  function next() { if (canContinue) dispatch({ type: 'next' }); }
  function back() { dispatch({ type: 'back' }); }
  function commit() {
    if (!canContinue) return;
    // TODO write-path : queueOffline(payload). MOBILE_WRITES_LIVE === false → IndexedDB only.
    const ref = buildLocalRef(42); // séquence locale réelle à câbler
    dispatch({ type: 'commit', localRef: ref });
  }
  function resetWizard() { dispatch({ type: 'reset' }); }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <StatusBar offline />
      <AppBar
        crumb="Premium Logistics · Atelier"
        title="Pointage pneu"
        showBack={step > 1 && step < 5}
        onBack={back}
        right={step === 1 || !vehicle
          ? <MatChip matricule="PL-MEC-007" />
          : <TruckChip code={vehicle.code} plate={vehicle.plate} />}
      />
      {step < 5 && <StepsBar step={step} />}

      <main className="flex flex-1 flex-col overflow-y-auto bg-[var(--cockpit-paper)]">
        {step === 1 && <Step1Vehicle />}
        {step === 2 && <Step2Position />}
        {step === 3 && <Step3Event />}
        {step === 4 && <Step4Details />}
        {step === 5 && <Step5Confirm />}
      </main>

      <ActionBar
        primary={action.primary}
        secondary={action.secondary}
        primaryEnabled={step === 5 ? true : canContinue}
        hint={step === 5 ? undefined : hint}
        onPrimary={action.onPrimary}
        onSecondary={action.onSecondary}
      />
      <GestureNav />
    </div>
  );
}
