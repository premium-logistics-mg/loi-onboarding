'use client';

import { useAccordionState, useConfirmSheet, type AccordionId } from '../_state';
import { Accordion } from './Accordion';
import { ActionBar } from './ActionBar';
import { ConfirmSheet } from './ConfirmSheet';
import { InspectionSection } from './sections/InspectionSection';
import { DiagnosticSection } from './sections/DiagnosticSection';
import { PartsSection } from './sections/PartsSection';
import { HandoffSection } from './sections/HandoffSection';
import { PhotosSection } from './sections/PhotosSection';
import { NotesSection } from './sections/NotesSection';
import {
  ClipboardCheck, Stethoscope, Boxes, Disc3, Fuel, Camera, FileText,
} from 'lucide-react';
import type { Intervention } from '../_types';

export function JobDetailBody({ job, mechanic }: { job: Intervention; mechanic: string }) {
  const acc = useAccordionState();
  const sheet = useConfirmSheet();

  const inspectionCount =
    `${job.inspection.filter((i) => i.status !== 'nonverif').length}/${job.inspection.length || 6}`;
  const inspCritiques = job.inspection.filter((i) => i.status === 'critique').length;

  const diagSummary = (() => {
    const d = job.diagnostic;
    if (!d.system && !d.dtc && !d.voiceNoteBlobId && !d.text) return 'À renseigner · système → pièce → DTC';
    const parts: string[] = [];
    if (d.system) parts.push(d.system);
    if (d.severity) parts.push(({ mineure: 'Mineure', majeure: 'Majeure', critique: 'Critique' } as const)[d.severity]);
    if (d.dtc) parts.push(`DTC ${d.dtc}`);
    if (d.voiceDurationSec) parts.push(`vocal ${formatSec(d.voiceDurationSec)}`);
    return parts.join(' · ');
  })();

  type SectionDef = {
    id: AccordionId;
    icon: React.ReactNode;
    title: string;
    summary?: string;
    count?: string;
    countTone: 'teal' | 'orange' | 'red' | 'neutral';
    handoff?: boolean;
    body: React.ReactNode;
  };

  const sections: SectionDef[] = [
    {
      id: 'inspection',
      icon: <ClipboardCheck className="h-5 w-5 stroke-[1.8]" aria-hidden />,
      title: 'Inspection',
      summary: `${job.inspection.length || 6} points · ${inspCritiques} critiques`,
      count: inspectionCount,
      countTone: inspCritiques > 0 ? 'red' : 'teal',
      body: <InspectionSection items={job.inspection} />,
    },
    {
      id: 'diagnostic',
      icon: <Stethoscope className="h-5 w-5 stroke-[1.8]" aria-hidden />,
      title: 'Diagnostic',
      summary: diagSummary,
      count: job.diagnostic.text || job.diagnostic.dtc ? 'OK' : '—',
      countTone: job.diagnostic.text || job.diagnostic.dtc ? 'teal' : 'orange',
      body: <DiagnosticSection value={job.diagnostic} />,
    },
    {
      id: 'pieces',
      icon: <Boxes className="h-5 w-5 stroke-[1.8]" aria-hidden />,
      title: 'Pièces utilisées',
      summary: `${job.parts.length} référence(s) consommée(s)`,
      count: String(job.parts.length).padStart(2, '0'),
      countTone: 'teal',
      body: <PartsSection parts={job.parts} />,
    },
    {
      id: 'pneus',
      icon: <Disc3 className="h-5 w-5 stroke-[1.8]" aria-hidden />,
      title: 'Pneus',
      summary: 'Renvoi vers module Pointage pneu',
      count: '—',
      countTone: 'neutral',
      handoff: true,
      body: (
        <HandoffSection
          route={`/mobile/pneu?ot=${job.id}&veh=${job.vehicle.code}`}
          label={`Pointage pneu pour ${job.vehicle.code}`}
          hint="Schéma essieux · code position (MOT 2ESS-EXT-G) · photo série · compteur OCR. Ouvre le module dédié — composant partagé, jamais re-dessiné ici."
          ctaLabel="Ouvrir Pointage pneu"
        />
      ),
    },
    {
      id: 'carburant',
      icon: <Fuel className="h-5 w-5 stroke-[1.8]" aria-hidden />,
      title: 'Carburant / Système',
      summary: 'Renvoi vers module Carburant',
      count: '—',
      countTone: 'neutral',
      handoff: true,
      body: (
        <HandoffSection
          route={`/mobile/fuel?ot=${job.id}&veh=${job.vehicle.code}`}
          label={`Pointage carburant pour ${job.vehicle.code}`}
          hint="Plein gasoil · litres + compteur OCR + photo pistolet. Ouvre le module dédié — composant partagé, jamais re-dessiné ici."
          ctaLabel="Ouvrir Carburant"
        />
      ),
    },
    {
      id: 'photos',
      icon: <Camera className="h-5 w-5 stroke-[1.8]" aria-hidden />,
      title: 'Photos',
      summary: `${job.photos.length} preuve(s) · caméra par pièce`,
      count: String(job.photos.length).padStart(2, '0'),
      countTone: 'teal',
      body: <PhotosSection photos={job.photos} />,
    },
    {
      id: 'notes',
      icon: <FileText className="h-5 w-5 stroke-[1.8]" aria-hidden />,
      title: 'Notes',
      summary: 'Texte libre — pour le prochain méca',
      count: String(job.notes.length).padStart(2, '0'),
      countTone: 'teal',
      body: <NotesSection notes={job.notes} />,
    },
  ];

  return (
    <>
      <div className="flex items-baseline justify-between px-4 pt-3 pb-2">
        <span className="text-[11px] font-extrabold tracking-[1.5px] uppercase text-[var(--cockpit-text-2)]">
          Sections de l'intervention
        </span>
        <span className="font-mono text-[11px] tracking-wide text-[var(--cockpit-text-3)]">
          {acc.open ? '1 ouverte' : `${sections.length} sections`}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-3 pb-44">
        {sections.map((s) => (
          <Accordion
            key={s.id}
            icon={s.icon}
            title={s.title}
            summary={s.summary}
            count={s.count}
            countTone={s.countTone}
            handoff={s.handoff}
            open={acc.open === s.id}
            onToggle={() => acc.toggle(s.id)}
          >
            {s.body}
          </Accordion>
        ))}
      </div>

      <ActionBar
        onBloquer={sheet.openBloquer}
        onTerminer={sheet.openTerminer}
        hint={acc.open ? 'Section ouverte · ferme pour finir' : 'Sous-tâches OK · 2 critiques d\'inspection à clore'}
      />

      {sheet.sheet === 'bloquer' && (
        <ConfirmSheet
          tone="orange"
          job={job}
          mechanic={mechanic}
          onClose={sheet.close}
          onConfirm={(payload) => {
            // TODO write-path : updateJobStatus(job.id, 'bloque', payload)
            console.log('block', payload);
            sheet.close();
          }}
        />
      )}
      {sheet.sheet === 'terminer' && (
        <ConfirmSheet
          tone="teal"
          job={job}
          mechanic={mechanic}
          onClose={sheet.close}
          onConfirm={() => {
            // TODO write-path : updateJobStatus(job.id, 'termine')
            console.log('complete');
            sheet.close();
          }}
        />
      )}
    </>
  );
}

function formatSec(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
