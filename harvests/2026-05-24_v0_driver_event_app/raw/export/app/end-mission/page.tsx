'use client';

import { AppProvider } from '@/lib/app-context';
import { EndMissionContent } from '@/components/end-mission-content';

export default function EndMissionPage() {
  return (
    <AppProvider>
      <EndMissionContent />
    </AppProvider>
  );
}
