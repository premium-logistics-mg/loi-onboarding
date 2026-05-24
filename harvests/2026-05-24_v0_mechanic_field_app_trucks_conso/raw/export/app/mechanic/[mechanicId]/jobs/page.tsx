'use client';

import { useParams, useRouter } from 'next/navigation';
import { getJobsForMechanic, getMechanic } from '@/lib/store';
import type { JobStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  LogOut,
  Truck,
  Package,
  CircleDot
} from 'lucide-react';

const statusConfig: Record<JobStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { 
    label: 'Pending', 
    color: 'bg-[oklch(0.65_0.15_85/0.2)] text-[oklch(0.65_0.15_85)]',
    icon: <Clock className="w-4 h-4" />
  },
  in_progress: { 
    label: 'In Progress', 
    color: 'bg-[oklch(0.55_0.18_250/0.2)] text-[oklch(0.55_0.18_250)]',
    icon: <Wrench className="w-4 h-4" />
  },
  blocked: { 
    label: 'Blocked', 
    color: 'bg-destructive/20 text-destructive',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-primary/20 text-primary',
    icon: <CheckCircle2 className="w-4 h-4" />
  },
};

const priorityConfig = {
  low: 'border-l-muted-foreground',
  medium: 'border-l-[oklch(0.65_0.15_85)]',
  high: 'border-l-[oklch(0.55_0.15_45)]',
  critical: 'border-l-destructive',
};

const vehicleIcons = {
  truck: <Truck className="w-5 h-5" />,
  van: <Package className="w-5 h-5" />,
  trailer: <CircleDot className="w-5 h-5" />,
  forklift: <Package className="w-5 h-5" />,
};

export default function MechanicJobsPage() {
  const params = useParams();
  const router = useRouter();
  const mechanicId = params.mechanicId as string;
  
  const mechanic = getMechanic(mechanicId);
  const jobs = getJobsForMechanic(mechanicId);
  
  const activeJobs = jobs.filter((j) => j.status !== 'completed');
  const completedJobs = jobs.filter((j) => j.status === 'completed');

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Mechanic not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">My Jobs</h1>
            <p className="text-sm text-muted-foreground">{mechanic.name}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/')}
            className="touch-target"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-6 pb-24">
        {/* Active Jobs */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Active Jobs ({activeJobs.length})
          </h2>
          <div className="space-y-3">
            {activeJobs.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No active jobs assigned</p>
                </CardContent>
              </Card>
            ) : (
              activeJobs.map((job) => (
                <Card 
                  key={job.id}
                  className={`bg-card border-border border-l-4 ${priorityConfig[job.priority]} cursor-pointer hover:bg-secondary/50 transition-colors`}
                  onClick={() => router.push(`/mechanic/${mechanicId}/job/${job.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[job.status].color}`}>
                            {statusConfig[job.status].icon}
                            {statusConfig[job.status].label}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {vehicleIcons[job.vehicleType]}
                            {job.vehiclePlate}
                          </span>
                          <span>-</span>
                          <span>{job.vehicleModel}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Est. {job.estimatedDuration} min
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Completed Jobs */}
        {completedJobs.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Completed Today ({completedJobs.length})
            </h2>
            <div className="space-y-3">
              {completedJobs.map((job) => (
                <Card 
                  key={job.id}
                  className="bg-card/50 border-border cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => router.push(`/mechanic/${mechanicId}/job/${job.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[job.status].color}`}>
                            {statusConfig[job.status].icon}
                            {statusConfig[job.status].label}
                          </span>
                        </div>
                        <h3 className="font-medium text-foreground truncate">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.vehiclePlate}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
