'use client';

import { Camera } from 'lucide-react';
import type { Photo } from '../../_types';

export function PhotosSection({ photos }: { photos: Photo[] }) {
  const list = photos.length > 0
    ? photos
    : [
        { blobId: 'a', label: 'Plaquette AR · côté int.', capturedAt: new Date().toISOString() } as Photo,
        { blobId: 'b', label: 'Disque AR · rayure',       capturedAt: new Date().toISOString() } as Photo,
        { blobId: 'c', label: 'Réservoir liquide frein',  capturedAt: new Date().toISOString() } as Photo,
      ];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-2">
        {list.map((p) => (
          <div
            key={p.blobId}
            className="flex aspect-square flex-col justify-between rounded-[10px] border-[1.5px] p-1.5"
            style={{
              background: 'repeating-linear-gradient(45deg, #1A3556 0 8px, #15304F 8px 16px)',
              borderColor: 'var(--cockpit-line)',
            }}
          >
            <span className="self-start rounded-sm border bg-[var(--cockpit-surface-mute)] px-1 py-0.5 font-mono text-[9px] font-bold tabular-nums text-[var(--cockpit-text-3)]" style={{ borderColor: 'var(--cockpit-line)' }}>
              {new Date(p.capturedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="rounded-sm bg-black/75 px-1.5 py-1 text-[9px] font-bold leading-tight text-white">
              {p.label}
            </span>
          </div>
        ))}
        <button
          type="button"
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] border-dashed bg-[var(--cockpit-surface-mute)]"
          style={{ borderColor: 'var(--cockpit-teal)' }}
        >
          <Camera className="h-5.5 w-5.5 stroke-[1.8]" style={{ color: 'var(--cockpit-teal)' }} aria-hidden />
          <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: 'var(--cockpit-teal)' }}>+ Photo</span>
        </button>
      </div>
      <p className="text-[11px] font-medium leading-snug text-[var(--cockpit-text-3)]">
        Une preuve par pièce · GPS + horodatage attachés automatiquement.
      </p>
    </div>
  );
}
