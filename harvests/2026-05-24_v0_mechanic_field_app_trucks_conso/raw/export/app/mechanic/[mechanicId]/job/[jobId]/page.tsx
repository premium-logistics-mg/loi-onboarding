'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getJob,
  getMechanic,
  updateJobStatus,
  updateJobInspection,
  updateJobDiagnosis,
  addPartsToJob,
  addTireAction,
  addFuelObservation,
  addPhotoToJob,
  addNoteToJob,
  createEvent,
  getDefaultInspectionChecklist,
} from '@/lib/store';
import type { JobStatus, InspectionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ClipboardCheck,
  Stethoscope,
  Cog,
  Circle as TireIcon,
  Fuel,
  Camera,
  MessageSquare,
  ChevronRight,
  X,
  Plus,
  Check,
  AlertCircle,
} from 'lucide-react';

type ActiveSection = 
  | null 
  | 'inspection' 
  | 'diagnosis' 
  | 'parts' 
  | 'tires' 
  | 'fuel' 
  | 'photos' 
  | 'notes' 
  | 'block' 
  | 'complete';

const statusColors: Record<JobStatus, string> = {
  pending: 'bg-[oklch(0.65_0.15_85/0.2)] text-[oklch(0.65_0.15_85)]',
  in_progress: 'bg-[oklch(0.55_0.18_250/0.2)] text-[oklch(0.55_0.18_250)]',
  blocked: 'bg-destructive/20 text-destructive',
  completed: 'bg-primary/20 text-primary',
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mechanicId = params.mechanicId as string;
  const jobId = params.jobId as string;

  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const mechanic = getMechanic(mechanicId);
  const job = getJob(jobId);

  const refreshJob = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  if (!mechanic || !job) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const handleStartJob = () => {
    updateJobStatus(jobId, 'in_progress');
    createEvent(
      'maintenance_job_started',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { previousStatus: job.status }
    );
    refreshJob();
  };

  const handleBlockJob = (reason: string) => {
    updateJobStatus(jobId, 'blocked', reason);
    createEvent(
      'maintenance_job_blocked',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { reason }
    );
    setActiveSection(null);
    refreshJob();
  };

  const handleCompleteJob = () => {
    updateJobStatus(jobId, 'completed');
    createEvent(
      'maintenance_job_completed',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      {
        partsUsed: job.partsUsed.length,
        tireActions: job.tireActions.length,
        duration: job.startedAt
          ? Math.round((Date.now() - new Date(job.startedAt).getTime()) / 60000)
          : 0,
      }
    );
    setActiveSection(null);
    refreshJob();
  };

  const handleSaveInspection = () => {
    updateJobInspection(jobId);
    createEvent(
      'vehicle_inspected',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { completed: true }
    );
    setActiveSection(null);
    refreshJob();
  };

  const handleSaveDiagnosis = (diagnosis: string) => {
    updateJobDiagnosis(jobId, diagnosis);
    createEvent(
      'diagnosis_added',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { diagnosis }
    );
    setActiveSection(null);
    refreshJob();
  };

  const handleAddPart = (partNumber: string, partName: string, quantity: number) => {
    addPartsToJob(jobId, partNumber, partName, quantity);
    createEvent(
      'parts_used',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { partNumber, partName, quantity }
    );
    refreshJob();
  };

  const handleAddTireAction = (
    position: string,
    action: 'replace' | 'rotate' | 'repair' | 'inflate',
    notes?: string
  ) => {
    addTireAction(jobId, position, action, notes);
    createEvent(
      'tire_action_recorded',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { position, action, notes }
    );
    refreshJob();
  };

  const handleAddFuelObservation = (
    type: 'leak' | 'contamination' | 'low_level' | 'filter_issue' | 'other',
    description: string,
    severity: 'low' | 'medium' | 'high'
  ) => {
    addFuelObservation(jobId, type, description, severity);
    createEvent(
      'fuel_system_observation_added',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { type, description, severity }
    );
    refreshJob();
  };

  const handleAddPhoto = (type: 'before' | 'after' | 'issue' | 'part', caption?: string) => {
    // In production, this would handle actual file upload
    const mockUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    addPhotoToJob(jobId, mockUrl, type, caption);
    createEvent(
      'photo_attached',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { type, caption }
    );
    refreshJob();
  };

  const handleAddNote = (content: string) => {
    addNoteToJob(jobId, content);
    createEvent(
      'mechanic_note_added',
      mechanicId,
      mechanic.name,
      jobId,
      job.vehicleId,
      job.vehiclePlate,
      { content }
    );
    refreshJob();
  };

  return (
    <div className="min-h-screen bg-background" key={refreshKey}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/mechanic/${mechanicId}/jobs`)}
            className="touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">{job.title}</h1>
            <p className="text-sm text-muted-foreground">{job.vehiclePlate}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
            {job.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-4 pb-32">
        {/* Vehicle Info */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{job.vehicleModel}</p>
                <p className="text-sm text-muted-foreground">
                  {job.vehiclePlate} - {job.vehicleType}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{job.description}</p>
          </CardContent>
        </Card>

        {/* Status Actions */}
        {job.status === 'pending' && (
          <Button
            onClick={handleStartJob}
            className="w-full h-14 text-lg font-semibold touch-target-lg"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Job
          </Button>
        )}

        {/* Action Sections */}
        {job.status !== 'completed' && (
          <div className="grid grid-cols-2 gap-3">
            <ActionButton
              icon={<ClipboardCheck className="w-5 h-5" />}
              label="Inspection"
              completed={job.inspectionCompleted}
              onClick={() => setActiveSection('inspection')}
            />
            <ActionButton
              icon={<Stethoscope className="w-5 h-5" />}
              label="Diagnosis"
              completed={!!job.diagnosis}
              onClick={() => setActiveSection('diagnosis')}
            />
            <ActionButton
              icon={<Cog className="w-5 h-5" />}
              label="Parts Used"
              count={job.partsUsed.length}
              onClick={() => setActiveSection('parts')}
            />
            <ActionButton
              icon={<TireIcon className="w-5 h-5" />}
              label="Tires"
              count={job.tireActions.length}
              onClick={() => setActiveSection('tires')}
            />
            <ActionButton
              icon={<Fuel className="w-5 h-5" />}
              label="Fuel/System"
              count={job.fuelObservations.length}
              onClick={() => setActiveSection('fuel')}
            />
            <ActionButton
              icon={<Camera className="w-5 h-5" />}
              label="Photos"
              count={job.photos.length}
              onClick={() => setActiveSection('photos')}
            />
            <ActionButton
              icon={<MessageSquare className="w-5 h-5" />}
              label="Notes"
              count={job.notes.length}
              onClick={() => setActiveSection('notes')}
              className="col-span-2"
            />
          </div>
        )}

        {/* Job Summary for Completed */}
        {job.status === 'completed' && (
          <Card className="bg-primary/10 border-primary/30">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Job Completed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {job.actualDuration && (
                <p>Duration: {job.actualDuration} minutes</p>
              )}
              {job.diagnosis && <p>Diagnosis: {job.diagnosis}</p>}
              <p>Parts Used: {job.partsUsed.length}</p>
              <p>Tire Actions: {job.tireActions.length}</p>
              <p>Photos: {job.photos.length}</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Bottom Actions for In Progress */}
      {job.status === 'in_progress' && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveSection('block')}
              className="flex-1 h-12 touch-target border-destructive text-destructive hover:bg-destructive/10"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Block
            </Button>
            <Button
              onClick={() => setActiveSection('complete')}
              className="flex-1 h-12 touch-target"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Complete
            </Button>
          </div>
        </div>
      )}

      {/* Modal Overlays */}
      {activeSection === 'inspection' && (
        <InspectionModal onClose={() => setActiveSection(null)} onSave={handleSaveInspection} />
      )}
      {activeSection === 'diagnosis' && (
        <DiagnosisModal
          initialValue={job.diagnosis || ''}
          onClose={() => setActiveSection(null)}
          onSave={handleSaveDiagnosis}
        />
      )}
      {activeSection === 'parts' && (
        <PartsModal
          parts={job.partsUsed}
          onClose={() => setActiveSection(null)}
          onAdd={handleAddPart}
        />
      )}
      {activeSection === 'tires' && (
        <TiresModal
          tireActions={job.tireActions}
          onClose={() => setActiveSection(null)}
          onAdd={handleAddTireAction}
        />
      )}
      {activeSection === 'fuel' && (
        <FuelModal
          observations={job.fuelObservations}
          onClose={() => setActiveSection(null)}
          onAdd={handleAddFuelObservation}
        />
      )}
      {activeSection === 'photos' && (
        <PhotosModal
          photos={job.photos}
          onClose={() => setActiveSection(null)}
          onAdd={handleAddPhoto}
        />
      )}
      {activeSection === 'notes' && (
        <NotesModal
          notes={job.notes}
          onClose={() => setActiveSection(null)}
          onAdd={handleAddNote}
        />
      )}
      {activeSection === 'block' && (
        <BlockModal onClose={() => setActiveSection(null)} onBlock={handleBlockJob} />
      )}
      {activeSection === 'complete' && (
        <CompleteModal
          job={job}
          onClose={() => setActiveSection(null)}
          onComplete={handleCompleteJob}
        />
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  completed,
  count,
  onClick,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  completed?: boolean;
  count?: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors touch-target ${className}`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          completed ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-foreground">{label}</p>
        {completed !== undefined && (
          <p className="text-xs text-muted-foreground">
            {completed ? 'Completed' : 'Not completed'}
          </p>
        )}
        {count !== undefined && (
          <p className="text-xs text-muted-foreground">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}

function ModalWrapper({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex flex-col">
      <header className="bg-card border-b border-border p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose} className="touch-target">
          <X className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}

function InspectionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: () => void;
}) {
  const [items, setItems] = useState<InspectionItem[]>(getDefaultInspectionChecklist());

  const handleStatusChange = (id: string, status: InspectionItem['status']) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const allChecked = items.every((item) => item.status !== 'not_checked');

  const categories = [...new Set(items.map((item) => item.category))];

  return (
    <ModalWrapper title="Vehicle Inspection" onClose={onClose}>
      <div className="space-y-6 pb-24">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"
                  >
                    <span className="text-foreground">{item.item}</span>
                    <div className="flex gap-1">
                      <StatusButton
                        active={item.status === 'ok'}
                        color="bg-primary text-primary-foreground"
                        onClick={() => handleStatusChange(item.id, 'ok')}
                      >
                        <Check className="w-4 h-4" />
                      </StatusButton>
                      <StatusButton
                        active={item.status === 'warning'}
                        color="bg-[oklch(0.65_0.15_85)] text-[oklch(0.13_0.01_250)]"
                        onClick={() => handleStatusChange(item.id, 'warning')}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </StatusButton>
                      <StatusButton
                        active={item.status === 'critical'}
                        color="bg-destructive text-destructive-foreground"
                        onClick={() => handleStatusChange(item.id, 'critical')}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </StatusButton>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button onClick={onSave} disabled={!allChecked} className="w-full h-12 touch-target">
          Save Inspection
        </Button>
      </div>
    </ModalWrapper>
  );
}

function StatusButton({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
        active ? color : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
      }`}
    >
      {children}
    </button>
  );
}

function DiagnosisModal({
  initialValue,
  onClose,
  onSave,
}: {
  initialValue: string;
  onClose: () => void;
  onSave: (diagnosis: string) => void;
}) {
  const [diagnosis, setDiagnosis] = useState(initialValue);

  return (
    <ModalWrapper title="Diagnosis" onClose={onClose}>
      <div className="space-y-4 pb-24">
        <Textarea
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter your diagnosis findings..."
          className="min-h-[200px] bg-card border-border"
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button
          onClick={() => onSave(diagnosis)}
          disabled={!diagnosis.trim()}
          className="w-full h-12 touch-target"
        >
          Save Diagnosis
        </Button>
      </div>
    </ModalWrapper>
  );
}

function PartsModal({
  parts,
  onClose,
  onAdd,
}: {
  parts: { id: string; partNumber: string; partName: string; quantity: number }[];
  onClose: () => void;
  onAdd: (partNumber: string, partName: string, quantity: number) => void;
}) {
  const [partNumber, setPartNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleAdd = () => {
    if (partNumber && partName && parseInt(quantity) > 0) {
      onAdd(partNumber, partName, parseInt(quantity));
      setPartNumber('');
      setPartName('');
      setQuantity('1');
    }
  };

  return (
    <ModalWrapper title="Parts Used" onClose={onClose}>
      <div className="space-y-4 pb-24">
        {/* Existing Parts */}
        {parts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Added Parts</h3>
            {parts.map((part) => (
              <div
                key={part.id}
                className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{part.partName}</p>
                  <p className="text-sm text-muted-foreground">{part.partNumber}</p>
                </div>
                <span className="text-foreground font-semibold">x{part.quantity}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add New Part */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Add Part</h3>
          <Input
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            placeholder="Part Number"
            className="bg-card border-border"
          />
          <Input
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            placeholder="Part Name"
            className="bg-card border-border"
          />
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            min="1"
            className="bg-card border-border"
          />
          <Button onClick={handleAdd} className="w-full h-12 touch-target" variant="secondary">
            <Plus className="w-5 h-5 mr-2" />
            Add Part
          </Button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button onClick={onClose} className="w-full h-12 touch-target">
          Done
        </Button>
      </div>
    </ModalWrapper>
  );
}

function TiresModal({
  tireActions,
  onClose,
  onAdd,
}: {
  tireActions: { id: string; position: string; action: string; notes?: string }[];
  onClose: () => void;
  onAdd: (position: string, action: 'replace' | 'rotate' | 'repair' | 'inflate', notes?: string) => void;
}) {
  const [position, setPosition] = useState('');
  const [action, setAction] = useState<'replace' | 'rotate' | 'repair' | 'inflate'>('replace');
  const [notes, setNotes] = useState('');

  const positions = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right', 'Spare'];
  const actions: ('replace' | 'rotate' | 'repair' | 'inflate')[] = ['replace', 'rotate', 'repair', 'inflate'];

  const handleAdd = () => {
    if (position) {
      onAdd(position, action, notes || undefined);
      setPosition('');
      setNotes('');
    }
  };

  return (
    <ModalWrapper title="Tire Actions" onClose={onClose}>
      <div className="space-y-4 pb-24">
        {/* Existing Actions */}
        {tireActions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Recorded Actions</h3>
            {tireActions.map((ta) => (
              <div key={ta.id} className="bg-card border border-border rounded-lg p-3">
                <div className="flex justify-between">
                  <p className="font-medium text-foreground">{ta.position}</p>
                  <span className="text-sm text-muted-foreground capitalize">{ta.action}</span>
                </div>
                {ta.notes && <p className="text-sm text-muted-foreground mt-1">{ta.notes}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Add New Action */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Add Tire Action</h3>
          
          <div className="grid grid-cols-2 gap-2">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setPosition(pos)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors touch-target ${
                  position === pos
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:bg-secondary'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {actions.map((act) => (
              <button
                key={act}
                onClick={() => setAction(act)}
                className={`p-2 rounded-lg border text-xs font-medium capitalize transition-colors touch-target ${
                  action === act
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:bg-secondary'
                }`}
              >
                {act}
              </button>
            ))}
          </div>

          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="bg-card border-border"
          />
          
          <Button onClick={handleAdd} disabled={!position} className="w-full h-12 touch-target" variant="secondary">
            <Plus className="w-5 h-5 mr-2" />
            Add Tire Action
          </Button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button onClick={onClose} className="w-full h-12 touch-target">
          Done
        </Button>
      </div>
    </ModalWrapper>
  );
}

function FuelModal({
  observations,
  onClose,
  onAdd,
}: {
  observations: { id: string; type: string; description: string; severity: string }[];
  onClose: () => void;
  onAdd: (
    type: 'leak' | 'contamination' | 'low_level' | 'filter_issue' | 'other',
    description: string,
    severity: 'low' | 'medium' | 'high'
  ) => void;
}) {
  const [type, setType] = useState<'leak' | 'contamination' | 'low_level' | 'filter_issue' | 'other'>('leak');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const types: ('leak' | 'contamination' | 'low_level' | 'filter_issue' | 'other')[] = [
    'leak',
    'contamination',
    'low_level',
    'filter_issue',
    'other',
  ];
  const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  const handleAdd = () => {
    if (description) {
      onAdd(type, description, severity);
      setDescription('');
    }
  };

  return (
    <ModalWrapper title="Fuel/System Observations" onClose={onClose}>
      <div className="space-y-4 pb-24">
        {/* Existing Observations */}
        {observations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Recorded Observations</h3>
            {observations.map((obs) => (
              <div key={obs.id} className="bg-card border border-border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-foreground capitalize">{obs.type.replace('_', ' ')}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      obs.severity === 'high'
                        ? 'bg-destructive/20 text-destructive'
                        : obs.severity === 'medium'
                        ? 'bg-[oklch(0.65_0.15_85/0.2)] text-[oklch(0.65_0.15_85)]'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {obs.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{obs.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add New Observation */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Add Observation</h3>

          <div className="grid grid-cols-2 gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors touch-target ${
                  type === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:bg-secondary'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            className="bg-card border-border"
          />

          <div className="flex gap-2">
            {severities.map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`flex-1 p-2 rounded-lg border text-sm font-medium capitalize transition-colors touch-target ${
                  severity === s
                    ? s === 'high'
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : s === 'medium'
                      ? 'border-[oklch(0.65_0.15_85)] bg-[oklch(0.65_0.15_85/0.1)] text-[oklch(0.65_0.15_85)]'
                      : 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:bg-secondary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Button
            onClick={handleAdd}
            disabled={!description}
            className="w-full h-12 touch-target"
            variant="secondary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Observation
          </Button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button onClick={onClose} className="w-full h-12 touch-target">
          Done
        </Button>
      </div>
    </ModalWrapper>
  );
}

function PhotosModal({
  photos,
  onClose,
  onAdd,
}: {
  photos: { id: string; url: string; type: string; caption?: string }[];
  onClose: () => void;
  onAdd: (type: 'before' | 'after' | 'issue' | 'part', caption?: string) => void;
}) {
  const [type, setType] = useState<'before' | 'after' | 'issue' | 'part'>('before');
  const [caption, setCaption] = useState('');

  const types: ('before' | 'after' | 'issue' | 'part')[] = ['before', 'after', 'issue', 'part'];

  const handleCapture = () => {
    onAdd(type, caption || undefined);
    setCaption('');
  };

  return (
    <ModalWrapper title="Photos" onClose={onClose}>
      <div className="space-y-4 pb-24">
        {/* Existing Photos */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Captured Photos</h3>
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
                  <img
                    src={photo.url}
                    alt={photo.caption || photo.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <span className="text-xs text-white capitalize">{photo.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Photo */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Capture Photo</h3>

          <div className="grid grid-cols-4 gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`p-2 rounded-lg border text-xs font-medium capitalize transition-colors touch-target ${
                  type === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:bg-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="bg-card border-border"
          />

          <Button onClick={handleCapture} className="w-full h-14 touch-target-lg" variant="secondary">
            <Camera className="w-6 h-6 mr-2" />
            Capture Photo
          </Button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button onClick={onClose} className="w-full h-12 touch-target">
          Done
        </Button>
      </div>
    </ModalWrapper>
  );
}

function NotesModal({
  notes,
  onClose,
  onAdd,
}: {
  notes: { id: string; content: string; timestamp: string; isBlockerReason: boolean }[];
  onClose: () => void;
  onAdd: (content: string) => void;
}) {
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (content.trim()) {
      onAdd(content);
      setContent('');
    }
  };

  return (
    <ModalWrapper title="Notes" onClose={onClose}>
      <div className="space-y-4 pb-24">
        {/* Existing Notes */}
        {notes.length > 0 && (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`bg-card border rounded-lg p-3 ${
                  note.isBlockerReason ? 'border-destructive' : 'border-border'
                }`}
              >
                <p className="text-foreground">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(note.timestamp).toLocaleString()}
                  {note.isBlockerReason && (
                    <span className="ml-2 text-destructive">Blocker</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add New Note */}
        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note..."
            className="min-h-[120px] bg-card border-border"
          />
          <Button
            onClick={handleAdd}
            disabled={!content.trim()}
            className="w-full h-12 touch-target"
            variant="secondary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Note
          </Button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button onClick={onClose} className="w-full h-12 touch-target">
          Done
        </Button>
      </div>
    </ModalWrapper>
  );
}

function BlockModal({
  onClose,
  onBlock,
}: {
  onClose: () => void;
  onBlock: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');

  return (
    <ModalWrapper title="Block Job" onClose={onClose}>
      <div className="space-y-4 pb-24">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Mark as Blocked</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Blocking this job will notify the maintenance manager and add it to the blocked jobs queue.
          </p>
        </div>

        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason for blocking (required)..."
          className="min-h-[150px] bg-card border-border"
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button
          onClick={() => onBlock(reason)}
          disabled={!reason.trim()}
          className="w-full h-12 touch-target bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          Block Job
        </Button>
      </div>
    </ModalWrapper>
  );
}

function CompleteModal({
  job,
  onClose,
  onComplete,
}: {
  job: ReturnType<typeof getJob>;
  onClose: () => void;
  onComplete: () => void;
}) {
  if (!job) return null;

  const warnings: string[] = [];
  if (!job.inspectionCompleted) warnings.push('Inspection not completed');
  if (!job.diagnosis) warnings.push('No diagnosis recorded');

  return (
    <ModalWrapper title="Complete Job" onClose={onClose}>
      <div className="space-y-4 pb-24">
        {warnings.length > 0 && (
          <div className="bg-[oklch(0.65_0.15_85/0.1)] border border-[oklch(0.65_0.15_85/0.3)] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[oklch(0.65_0.15_85)] mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Warnings</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              {warnings.map((w, i) => (
                <li key={i}>- {w}</li>
              ))}
            </ul>
          </div>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Work Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <SummaryRow label="Vehicle" value={`${job.vehiclePlate} - ${job.vehicleModel}`} />
            <SummaryRow label="Inspection" value={job.inspectionCompleted ? 'Completed' : 'Not done'} />
            <SummaryRow label="Diagnosis" value={job.diagnosis || 'None recorded'} />
            <SummaryRow label="Parts Used" value={`${job.partsUsed.length} items`} />
            <SummaryRow label="Tire Actions" value={`${job.tireActions.length} actions`} />
            <SummaryRow label="Photos" value={`${job.photos.length} photos`} />
            <SummaryRow label="Notes" value={`${job.notes.length} notes`} />
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button onClick={onComplete} className="w-full h-12 touch-target">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Confirm Completion
        </Button>
      </div>
    </ModalWrapper>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
