'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getJobs,
  getCockpitStats,
  getMechanicWorkloads,
  getRecentEvents,
  subscribeToEvents,
} from '@/lib/store';
import type { MaintenanceJob, MaintenanceEvent, CockpitStats, MechanicWorkload, JobStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Package,
  CircleDot,
  RefreshCw,
  Truck,
  Activity,
} from 'lucide-react';

const statusConfig: Record<JobStatus, { label: string; color: string; bgColor: string }> = {
  pending: {
    label: 'Pending',
    color: 'text-[oklch(0.65_0.15_85)]',
    bgColor: 'bg-[oklch(0.65_0.15_85/0.2)]',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-[oklch(0.55_0.18_250)]',
    bgColor: 'bg-[oklch(0.55_0.18_250/0.2)]',
  },
  blocked: {
    label: 'Blocked',
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
  },
  completed: {
    label: 'Completed',
    color: 'text-primary',
    bgColor: 'bg-primary/20',
  },
};

const eventTypeLabels: Record<string, string> = {
  maintenance_job_assigned: 'Job Assigned',
  maintenance_job_started: 'Job Started',
  vehicle_inspected: 'Vehicle Inspected',
  diagnosis_added: 'Diagnosis Added',
  maintenance_job_blocked: 'Job Blocked',
  maintenance_job_completed: 'Job Completed',
  parts_used: 'Parts Used',
  tire_action_recorded: 'Tire Action',
  fuel_system_observation_added: 'Fuel Observation',
  photo_attached: 'Photo Attached',
  mechanic_note_added: 'Note Added',
};

export default function CockpitPage() {
  const router = useRouter();
  const [stats, setStats] = useState<CockpitStats>(getCockpitStats());
  const [jobs, setJobs] = useState<MaintenanceJob[]>(getJobs());
  const [workloads, setWorkloads] = useState<MechanicWorkload[]>(getMechanicWorkloads());
  const [events, setEvents] = useState<MaintenanceEvent[]>(getRecentEvents(15));
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'mechanics' | 'activity'>('overview');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = useCallback(() => {
    setStats(getCockpitStats());
    setJobs(getJobs());
    setWorkloads(getMechanicWorkloads());
    setEvents(getRecentEvents(15));
    setLastUpdate(new Date());
  }, []);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubscribe = subscribeToEvents(() => {
      refreshData();
    });
    return unsubscribe;
  }, [refreshData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const openJobs = jobs.filter((j) => j.status === 'pending' || j.status === 'in_progress');
  const blockedJobs = jobs.filter((j) => j.status === 'blocked');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="touch-target"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Maintenance Cockpit</h1>
              <p className="text-xs text-muted-foreground">meca-001</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {lastUpdate.toLocaleTimeString()}
            </span>
            <Button variant="ghost" size="icon" onClick={refreshData} className="touch-target">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-border">
          {(['overview', 'jobs', 'mechanics', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} blockedJobs={blockedJobs} recentEvents={events.slice(0, 5)} />
        )}
        {activeTab === 'jobs' && <JobsTab jobs={jobs} />}
        {activeTab === 'mechanics' && <MechanicsTab workloads={workloads} />}
        {activeTab === 'activity' && <ActivityTab events={events} />}
      </main>
    </div>
  );
}

function OverviewTab({
  stats,
  blockedJobs,
  recentEvents,
}: {
  stats: CockpitStats;
  blockedJobs: MaintenanceJob[];
  recentEvents: MaintenanceEvent[];
}) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Wrench className="w-5 h-5" />}
          label="Open Jobs"
          value={stats.openJobs}
          color="text-[oklch(0.55_0.18_250)]"
          bgColor="bg-[oklch(0.55_0.18_250/0.2)]"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Blocked"
          value={stats.blockedJobs}
          color="text-destructive"
          bgColor="bg-destructive/20"
          alert={stats.blockedJobs > 0}
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Completed Today"
          value={stats.completedToday}
          color="text-primary"
          bgColor="bg-primary/20"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Avg Time"
          value={`${stats.avgCompletionTime}m`}
          color="text-muted-foreground"
          bgColor="bg-secondary"
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="Parts Used"
          value={stats.partsUsedToday}
          color="text-accent"
          bgColor="bg-accent/20"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Active Mechanics"
          value={stats.mechanicsActive}
          color="text-primary"
          bgColor="bg-primary/20"
        />
      </div>

      {/* Blocked Jobs Alert */}
      {blockedJobs.length > 0 && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Blocked Jobs Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {blockedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-card/50 rounded-lg p-3 border border-destructive/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.vehiclePlate}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {job.assignedMechanicName}
                  </span>
                </div>
                {job.blockedReason && (
                  <p className="text-sm text-destructive mt-2">{job.blockedReason}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            recentEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function JobsTab({ jobs }: { jobs: MaintenanceJob[] }) {
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');

  const filteredJobs = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);
  const statusCounts = {
    all: jobs.length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    in_progress: jobs.filter((j) => j.status === 'in_progress').length,
    blocked: jobs.filter((j) => j.status === 'blocked').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
  };

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'in_progress', 'blocked', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? status === 'all'
                  ? 'bg-foreground text-background'
                  : `${statusConfig[status as JobStatus].bgColor} ${statusConfig[status as JobStatus].color}`
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {status === 'all' ? 'All' : statusConfig[status].label} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No jobs found</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </div>
  );
}

function JobCard({ job }: { job: MaintenanceJob }) {
  const status = statusConfig[job.status];

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                {status.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                job.priority === 'critical' ? 'bg-destructive/20 text-destructive' :
                job.priority === 'high' ? 'bg-accent/20 text-accent' :
                'bg-secondary text-muted-foreground'
              }`}>
                {job.priority}
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{job.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Truck className="w-4 h-4" />
              <span>{job.vehiclePlate}</span>
              <span>-</span>
              <span>{job.vehicleModel}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Assigned to: {job.assignedMechanicName}
            </p>
          </div>
        </div>
        {job.status === 'blocked' && job.blockedReason && (
          <div className="mt-3 p-2 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive">{job.blockedReason}</p>
          </div>
        )}
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span>Parts: {job.partsUsed.length}</span>
          <span>Photos: {job.photos.length}</span>
          <span>Notes: {job.notes.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MechanicsTab({ workloads }: { workloads: MechanicWorkload[] }) {
  return (
    <div className="space-y-3">
      {workloads.map((workload) => (
        <Card key={workload.mechanicId} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{workload.mechanicName}</h3>
                <p className="text-sm text-muted-foreground">
                  {workload.activeJob ? (
                    <span className="text-[oklch(0.55_0.18_250)]">Working on: {workload.activeJob}</span>
                  ) : (
                    <span>Available</span>
                  )}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                workload.activeJob ? 'bg-[oklch(0.55_0.18_250)]' : 'bg-primary'
              }`} />
            </div>
            <div className="mt-3 flex gap-4">
              <div className="flex-1 bg-secondary rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-foreground">{workload.completedToday}</p>
                <p className="text-xs text-muted-foreground">Completed Today</p>
              </div>
              <div className="flex-1 bg-secondary rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-foreground">
                  {workload.avgCompletionTime > 0 ? `${workload.avgCompletionTime}m` : '-'}
                </p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActivityTab({ events }: { events: MaintenanceEvent[] }) {
  return (
    <div className="space-y-2">
      {events.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No activity recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        events.map((event) => (
          <EventRow key={event.id} event={event} expanded />
        ))
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
  alert = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  alert?: boolean;
}) {
  return (
    <Card className={`bg-card border-border ${alert ? 'ring-2 ring-destructive/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
            <span className={color}>{icon}</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventRow({ event, expanded = false }: { event: MaintenanceEvent; expanded?: boolean }) {
  const isAlert = event.type === 'maintenance_job_blocked';
  const isComplete = event.type === 'maintenance_job_completed';

  return (
    <div
      className={`p-3 rounded-lg ${
        isAlert
          ? 'bg-destructive/10 border border-destructive/20'
          : isComplete
          ? 'bg-primary/10 border border-primary/20'
          : 'bg-secondary/50 border border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${isAlert ? 'text-destructive' : isComplete ? 'text-primary' : 'text-foreground'}`}>
            {eventTypeLabels[event.type] || event.type}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {event.mechanicName} - {event.vehiclePlate}
          </p>
          {expanded && event.payload && Object.keys(event.payload).length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {Object.entries(event.payload).map(([key, value]) => (
                <p key={key}>
                  <span className="capitalize">{key.replace(/_/g, ' ')}</span>:{' '}
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </p>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(event.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
