'use client';

import { AppProvider } from '@/lib/app-context';
import { StartMissionContent } from '@/components/start-mission-content';

export default function StartMissionPage() {
  return (
    <AppProvider>
      <StartMissionContent />
    </AppProvider>
  );
}
