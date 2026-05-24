'use client';

import { AppProvider } from '@/lib/app-context';
import { RouteDeviationContent } from '@/components/route-deviation-content';

export default function RouteDeviationPage() {
  return (
    <AppProvider>
      <RouteDeviationContent />
    </AppProvider>
  );
}
