export function MecChip({ matricule }: { matricule: string }) {
  return (
    <div className="mr-1 flex flex-col items-end gap-0.5 rounded-lg border border-white/[0.18] bg-white/[0.06] px-2.5 py-1.5 leading-[1.1]">
      <span className="text-[9px] font-bold uppercase tracking-[1.3px] text-[#9CB3D1]">Mécanicien</span>
      <span className="font-mono text-[13px] font-semibold text-white tabular-nums">{matricule}</span>
    </div>
  );
}

export function TruckChip({ code, plate }: { code: string; plate?: string }) {
  return (
    <div className="mr-1 flex flex-col items-end gap-0.5 rounded-lg border border-[#3EAA9B]/40 bg-[#1A8E7E]/[0.22] px-2.5 py-1.5 leading-[1.1]">
      <span className="text-[9px] font-bold uppercase tracking-[1.3px] text-[#9CD4C9]">Véhicule</span>
      <span className="font-mono text-[13px] font-semibold text-white tabular-nums">{code || plate}</span>
    </div>
  );
}
