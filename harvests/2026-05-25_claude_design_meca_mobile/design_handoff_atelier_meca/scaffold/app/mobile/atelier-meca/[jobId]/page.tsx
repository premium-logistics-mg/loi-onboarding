import { notFound } from 'next/navigation';
import { Shell } from '../_components/Shell';
import { TruckChip } from '../_components/Chips';
import { JobHeader } from '../_components/JobHeader';
import { JobDetailBody } from '../_components/JobDetailBody';
import { getCurrentMechanic, getIntervention } from '../_data';

export default async function JobDetailPage({ params }: { params: { jobId: string } }) {
  const job = await getIntervention(params.jobId);
  if (!job) notFound();
  const matricule = await getCurrentMechanic();

  return (
    <Shell
      crumb={job.id}
      title="Intervention"
      showBack
      backHref="/mobile/atelier-meca"
      right={<TruckChip code={job.vehicle.code} plate={job.vehicle.plate} />}
    >
      <JobHeader job={job} />
      <JobDetailBody job={job} mechanic={matricule} />
    </Shell>
  );
}
