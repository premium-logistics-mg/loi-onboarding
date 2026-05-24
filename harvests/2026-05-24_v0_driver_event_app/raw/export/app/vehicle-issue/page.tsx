'use client';

import { AppProvider } from '@/lib/app-context';
import { VehicleIssueContent } from '@/components/vehicle-issue-content';

export default function VehicleIssuePage() {
  return (
    <AppProvider>
      <VehicleIssueContent />
    </AppProvider>
  );
}
