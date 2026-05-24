'use client';

import { AppProvider } from '@/lib/app-context';
import { NearMissContent } from '@/components/near-miss-content';

export default function NearMissPage() {
  return (
    <AppProvider>
      <NearMissContent />
    </AppProvider>
  );
}
