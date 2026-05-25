'use client';

import { useState, useCallback } from 'react';

export type AccordionId =
  | 'inspection' | 'diagnostic' | 'pieces'
  | 'pneus' | 'carburant' | 'photos' | 'notes';

export function useAccordionState() {
  const [open, setOpen] = useState<AccordionId | null>(null);
  const toggle = useCallback(
    (id: AccordionId) => setOpen((cur) => (cur === id ? null : id)),
    [],
  );
  return { open, toggle, close: () => setOpen(null) };
}

export type SheetKind = 'bloquer' | 'terminer' | null;

export function useConfirmSheet() {
  const [sheet, setSheet] = useState<SheetKind>(null);
  return {
    sheet,
    openBloquer: () => setSheet('bloquer'),
    openTerminer: () => setSheet('terminer'),
    close: () => setSheet(null),
  };
}
