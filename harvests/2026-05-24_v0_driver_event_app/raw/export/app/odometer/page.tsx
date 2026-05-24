'use client';

import { AppProvider } from '@/lib/app-context';
import { OdometerContent } from '@/components/odometer-content';

export default function OdometerPage() {
  return (
    <AppProvider>
      <OdometerContent />
    </AppProvider>
  );
}
