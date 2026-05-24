'use client';

import { AppProvider } from '@/lib/app-context';
import { FatigueContent } from '@/components/fatigue-content';

export default function FatiguePage() {
  return (
    <AppProvider>
      <FatigueContent />
    </AppProvider>
  );
}
