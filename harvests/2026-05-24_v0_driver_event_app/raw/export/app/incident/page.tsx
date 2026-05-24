'use client';

import { AppProvider } from '@/lib/app-context';
import { IncidentContent } from '@/components/incident-content';

export default function IncidentPage() {
  return (
    <AppProvider>
      <IncidentContent />
    </AppProvider>
  );
}
