'use client';

import { AppProvider } from '@/lib/app-context';
import { EpiContent } from '@/components/epi-content';

export default function EpiPage() {
  return (
    <AppProvider>
      <EpiContent />
    </AppProvider>
  );
}
