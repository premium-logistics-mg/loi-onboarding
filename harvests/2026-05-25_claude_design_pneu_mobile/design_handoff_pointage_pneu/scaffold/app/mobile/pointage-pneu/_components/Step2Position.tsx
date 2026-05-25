'use client';

import * as React from 'react';
import { useWizard } from '../_state';
import { decodePositionCode, getAxleConfigForVehicle } from '../_data';
import type { AxleConfig, PositionCode } from '../_types';
import { TruckDiagram } from './TruckDiagram';
import { CheckMark } from './ToConfirmBadge';

export function Step2Position() {
  const { state, dispatch } = useWizard();
  const vehicle = state.vehicle;
  const [config, setConfig] = React.useState<AxleConfig>(vehicle?.config ?? '6x4');

  React.useEffect(() => {
    if (!vehicle) return;
    let cancel = false;
    getAxleConfigForVehicle(vehicle.code).then(c => { if (!cancel) setConfig(c); });
    return () => { cancel = true; };
  }, [vehicle]);

  const selected = state.position;
  const decoded = selected ? decodePositionCode(selected) : null;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Instruction strip */}
      <div className="flex items-center gap-2.5 border-b border-[var(--cockpit-line)] bg-[var(--cockpit-teal-soft)] px-4 py-2.5">
        <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--cockpit-teal)] font-mono text-[14px] font-bold text-white">
          2
        </div>
        <div className="flex-1 text-[14px] font-semibold text-[var(--cockpit-navy)]">
          Tape sur le pneu concerné
        </div>
        <span className="font-mono text-[11px] font-bold tracking-[0.5px] text-[var(--cockpit-navy-3)]">
          {(vehicle?.model ?? 'SCHACMAN 6×4').replace('SCHACMAN F3000 6X4', 'SCHACMAN 6×4')}
        </span>
      </div>

      {/* Diagram */}
      <div className="flex-1 px-3 pt-1">
        <TruckDiagram
          config={config}
          selected={selected}
          onSelect={(code: PositionCode) => dispatch({ type: 'setPosition', position: code })}
        />
      </div>

      {/* Code badge */}
      <div className={`mx-4 mb-3 flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-white ${
        selected ? 'bg-[var(--cockpit-navy)]' : 'bg-[var(--cockpit-navy-2)]/80'
      }`}>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
          selected ? 'bg-[var(--cockpit-teal)]' : 'bg-white/10'
        }`}>
          {selected
            ? <CheckMark size={24} />
            : <span className="font-mono text-[18px] font-bold opacity-60">?</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-extrabold uppercase tracking-[1.6px] text-[#9CD4C9]">
            Code position
          </div>
          <div className="mt-px font-mono text-[22px] font-bold tracking-[0.5px]">
            {selected ?? '— — —'}
          </div>
          <div className="mt-0.5 text-[12px] text-[var(--cockpit-on-navy-soft)]">
            {decoded ?? 'Tape un pneu pour activer'}
          </div>
        </div>
      </div>
    </div>
  );
}
