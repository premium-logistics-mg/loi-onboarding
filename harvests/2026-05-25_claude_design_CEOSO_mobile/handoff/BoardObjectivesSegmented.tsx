/**
 * BoardObjectivesSegmented — Cockpit "5 objectifs du board"
 *
 * Variant E4 · Anneau segmenté (deciles).
 * Stack: Next.js · React · Tailwind · D82 tokens (--cockpit-*, --pl-*).
 *
 * Each objective is rendered as a tile with a closed SVG ring cut into
 * `segs` segments. Filled segments = round(pct / 100 * segs).
 *
 * Tokens used (already in your repo):
 *   --surface · --surface-2 · --border · --fg-1 · --fg-3 · --fg-mute
 *   --ok · --warn · --err   (status colors)
 *   --font-mono             (IBM Plex Mono for all numerics)
 *
 * Usage:
 *   <BoardObjectivesSegmented items={objectives} />
 */

import * as React from "react";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export type ObjectiveStatus = "ok" | "warn" | "err";

export interface Objective {
  id: number | string;
  so: string;            // "SO-1"
  owner: string;         // "KETSIAH"
  due: string;           // "31/12/26"
  title: string;         // "Encaissement accéléré & dette réduite"
  target: string;        // "60 j"
  actual: string;        // "68 j"
  pct: number;           // 0..100
  status: ObjectiveStatus;   // bar / number color
  deltaKind?: ObjectiveStatus; // color of the `actual` value (defaults to status)
}

interface BoardObjectivesSegmentedProps {
  items: Objective[];
  /** Card header title; defaults to "Objectifs du board". */
  title?: string;
  /** Show outer "Pilotage PL" micro-label above the card. */
  showPageHeader?: boolean;
  className?: string;
}

const STATUS_VAR: Record<ObjectiveStatus, string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  err: "var(--err)",
};

// ────────────────────────────────────────────────────────────
// SegmentedDonut — pure SVG, no deps
// ────────────────────────────────────────────────────────────

interface SegmentedDonutProps {
  pct: number;                  // 0..100
  status: ObjectiveStatus;
  size?: number;                // px
  stroke?: number;              // px
  segs?: number;                // segment count (default 10 = deciles)
  gap?: number;                 // px arc-length gap between segments
}

export function SegmentedDonut({
  pct,
  status,
  size = 92,
  stroke = 8,
  segs = 10,
  gap = 3,
}: SegmentedDonutProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = Math.round((Math.max(0, Math.min(100, pct)) / 100) * segs);
  const segLen = (c - segs * gap) / segs;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      {Array.from({ length: segs }).map((_, i) => {
        const offset = -i * (segLen + gap);
        const active = i < filled;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={active ? STATUS_VAR[status] : "var(--surface-2)"}
            strokeWidth={stroke}
            strokeDasharray={`${segLen} ${c - segLen}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// ObjectiveTile — one cell in the 5-up grid
// ────────────────────────────────────────────────────────────

function ObjectiveTile({ o }: { o: Objective }) {
  const deltaKind = o.deltaKind ?? o.status;
  return (
    <div
      className="flex min-h-[180px] flex-col gap-2 p-4"
      style={{ background: "var(--surface)" }}
    >
      {/* meta row */}
      <div
        className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.04em]"
        style={{ color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}
      >
        <span>{o.so}</span>
        <span>{o.owner}</span>
      </div>

      {/* donut + centered number */}
      <div className="flex justify-center py-1">
        <div className="relative h-[92px] w-[92px]">
          <SegmentedDonut pct={o.pct} status={o.status} size={92} stroke={8} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="leading-none"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                fontSize: 22,
                color: STATUS_VAR[o.status],
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {o.pct}
            </span>
            <span
              className="mt-0.5 text-[9px] uppercase tracking-[0.08em]"
              style={{ color: "var(--fg-3)" }}
            >
              %
            </span>
          </div>
        </div>
      </div>

      {/* title */}
      <div
        className="min-h-[30px] text-center text-[12px] font-semibold leading-snug"
        style={{ color: "var(--fg-1)" }}
      >
        {o.title}
      </div>

      {/* footer: cible · actuel */}
      <div
        className="mt-auto border-t pt-1.5 text-center"
        style={{
          borderColor: "var(--border)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--fg-3)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>cible {o.target}</span>
        <span className="mx-1.5" style={{ color: "var(--fg-mute)" }}>·</span>
        <span style={{ color: STATUS_VAR[deltaKind] }}>{o.actual}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Card chrome + 5-up grid
// ────────────────────────────────────────────────────────────

export default function BoardObjectivesSegmented({
  items,
  title = "Objectifs du board",
  showPageHeader = false,
  className,
}: BoardObjectivesSegmentedProps) {
  return (
    <div className={className}>
      {showPageHeader && (
        <div
          className="mb-2.5 flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
        >
          <span>Pilotage PL</span>
        </div>
      )}

      <div
        className="rounded-lg border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between border-b px-5 py-3.5"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            <span style={{ color: "var(--fg-1)" }}>{items.length}</span>
            &nbsp; {title}
          </div>
        </div>

        {/* 5-up grid — 1px hairlines between tiles via background bleed */}
        <div
          className="grid grid-cols-5 gap-px"
          style={{ background: "var(--border)" }}
        >
          {items.map((o) => (
            <ObjectiveTile key={o.id} o={o} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Example data shape (delete in your app)
// ────────────────────────────────────────────────────────────

export const EXAMPLE_OBJECTIVES: Objective[] = [
  { id: 1, so: "SO-1", owner: "KETSIAH", due: "31/12/26",
    title: "Encaissement accéléré & dette réduite",
    target: "60 j", actual: "68 j", pct: 22, status: "err", deltaKind: "err" },
  { id: 2, so: "SO-2", owner: "TUDI", due: "31/08/26",
    title: "Cycle commande → facture maîtrisé",
    target: "< 10", actual: "14", pct: 78, status: "ok", deltaKind: "warn" },
  { id: 3, so: "SO-3", owner: "JOEL", due: "31/12/26",
    title: "Flotte productive & rentable",
    target: "75 %", actual: "71 %", pct: 50, status: "warn", deltaKind: "warn" },
  { id: 4, so: "SO-4", owner: "KENNY", due: "31/12/26",
    title: "Portefeuille équilibré & diversifié",
    target: "≤ 25 %", actual: "28,5 %", pct: 40, status: "err", deltaKind: "err" },
  { id: 5, so: "SO-5", owner: "KENNY", due: "30/09/26",
    title: "Décisions tracées & clôturées",
    target: "≥ 90 %", actual: "85 %", pct: 80, status: "ok", deltaKind: "warn" },
];
