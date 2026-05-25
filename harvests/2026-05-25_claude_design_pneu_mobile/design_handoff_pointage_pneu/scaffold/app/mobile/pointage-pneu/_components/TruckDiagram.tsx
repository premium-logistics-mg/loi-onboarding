'use client';

import * as React from 'react';
import type { AxleConfig, PositionCode, WheelPosition } from '../_types';

// SVG view-port + wheel layout per axle config. Each wheel is a tappable
// rounded-rect. Selection state is owned by parent.

interface Wheel {
  pos: WheelPosition;
  x: number; y: number; w: number; h: number;
}

interface AxleSpec {
  index: number;
  y: number;
  label: string;
  bar: { x: number; w: number };
  wheels: Wheel[];
}

function specFor(config: AxleConfig): { width: number; height: number; axles: AxleSpec[] } {
  const W = 360;
  const wheelW = 46, wheelH = 64;
  const ySimple = 188, yMot1 = 322, yMot2 = 440;

  const simpleAxle = (index: number, y: number, label: string): AxleSpec => ({
    index, y, label,
    bar: { x: 60, w: 240 },
    wheels: [
      { pos: `${index as 1|2|3|4}ESS-G`, x: 28,  y, w: wheelW, h: wheelH },
      { pos: `${index as 1|2|3|4}ESS-D`, x: 286, y, w: wheelW, h: wheelH },
    ],
  });
  const dualAxle = (index: number, y: number, label: string): AxleSpec => ({
    index, y, label,
    bar: { x: 22, w: 316 },
    wheels: [
      { pos: `${index as 1|2|3|4}ESS-EXT-G`, x: 12,  y, w: wheelW, h: wheelH },
      { pos: `${index as 1|2|3|4}ESS-INT-G`, x: 66,  y, w: wheelW, h: wheelH },
      { pos: `${index as 1|2|3|4}ESS-INT-D`, x: 248, y, w: wheelW, h: wheelH },
      { pos: `${index as 1|2|3|4}ESS-EXT-D`, x: 302, y, w: wheelW, h: wheelH },
    ],
  });

  switch (config) {
    case '4x2':
      return { width: W, height: 460,
        axles: [
          simpleAxle(1, ySimple, 'ESSIEU 1 · directeur'),
          dualAxle (2, yMot1,    'ESSIEU 2 · motrice'),
        ]};
    case '6x2':
      return { width: W, height: 540,
        axles: [
          simpleAxle(1, ySimple, 'ESSIEU 1 · directeur'),
          dualAxle (2, yMot1,    'ESSIEU 2 · motrice'),
          simpleAxle(3, yMot2,   'ESSIEU 3 · relevable'),
        ]};
    case '8x4':
      return { width: W, height: 600,
        axles: [
          simpleAxle(1, 156, 'ESSIEU 1 · directeur'),
          simpleAxle(2, 268, 'ESSIEU 2 · directeur'),
          dualAxle (3, 400, 'ESSIEU 3 · motrice'),
          dualAxle (4, 510, 'ESSIEU 4 · motrice'),
        ]};
    case '6x4':
    default:
      return { width: W, height: 560,
        axles: [
          simpleAxle(1, ySimple, 'ESSIEU 1 · directeur'),
          dualAxle (2, yMot1,    'ESSIEU 2 · motrice'),
          dualAxle (3, yMot2,    'ESSIEU 3 · motrice'),
        ]};
  }
}

export interface TruckDiagramProps {
  config: AxleConfig;
  prefix?: 'MOT' | 'REM';
  selected?: PositionCode;
  onSelect?: (code: PositionCode) => void;
}

export function TruckDiagram({
  config, prefix = 'MOT', selected, onSelect,
}: TruckDiagramProps) {
  const { width, height, axles } = specFor(config);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label={`Schéma essieux ${config}`}>
      {/* Front marker */}
      <text x={width/2} y={20} textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="800"
            letterSpacing="2" fill="var(--cockpit-steel)">AVANT</text>
      <path d={`M${width/2 - 10} 28 L${width/2} 36 L${width/2 + 10} 28`}
            stroke="var(--cockpit-steel-2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Cab */}
      <rect x="100" y="48" width="160" height="100" rx="14" fill="var(--cockpit-navy)"/>
      <rect x="116" y="62" width="128" height="44" rx="6" fill="var(--cockpit-navy-3)" opacity="0.7"/>
      <rect x="120" y="118" width="48" height="22" rx="4" fill="var(--cockpit-navy-3)" opacity="0.5"/>
      <rect x="192" y="118" width="48" height="22" rx="4" fill="var(--cockpit-navy-3)" opacity="0.5"/>

      {/* Chassis */}
      <rect x="130" y="148" width="100" height={height - 188} rx="4"
            fill="var(--cockpit-navy-2)" opacity="0.85"/>
      <line x1="148" y1="148" x2="148" y2={height - 32}
            stroke="var(--cockpit-navy)" strokeWidth="1" opacity="0.5"/>
      <line x1="212" y1="148" x2="212" y2={height - 32}
            stroke="var(--cockpit-navy)" strokeWidth="1" opacity="0.5"/>

      {/* Rear bumper */}
      <rect x="116" y={height - 32} width="128" height="14" rx="3" fill="var(--cockpit-navy)"/>

      {/* Axles */}
      {axles.map((ax) => (
        <g key={ax.index}>
          <rect x={ax.bar.x} y={ax.y + 28} width={ax.bar.w} height="8" rx="2"
                fill="#1B2B3F" opacity="0.8"/>
          <text x={width/2} y={ax.y - 16} textAnchor="middle"
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
                fontSize="11" fontWeight="700" fill="var(--cockpit-steel)">
            {ax.label}
          </text>
          {ax.wheels.map((w) => {
            const code = `${prefix} ${w.pos}` as PositionCode;
            const isSel = selected === code;
            return (
              <g key={w.pos} onClick={() => onSelect?.(code)} style={{ cursor: 'pointer' }}>
                <rect
                  x={w.x} y={w.y} width={w.w} height={w.h} rx={10}
                  fill={isSel ? 'var(--cockpit-teal)' : '#23303F'}
                  stroke={isSel ? 'var(--cockpit-teal)' : '#101820'}
                  strokeWidth={isSel ? 3 : 1.5}
                />
                {[0,1,2,3].map((i) => (
                  <rect key={i}
                    x={w.x + 6} y={w.y + 10 + i * 12}
                    width={w.w - 12} height={4} rx={1}
                    fill={isSel ? 'var(--cockpit-teal-deep)' : '#0B1018'}
                    opacity={isSel ? 0.65 : 0.85}
                  />
                ))}
                {isSel && (
                  <>
                    <rect x={w.x - 6} y={w.y - 6}
                          width={w.w + 12} height={w.h + 12} rx={14}
                          fill="none" stroke="var(--cockpit-teal)" strokeWidth="2"
                          strokeDasharray="3 4" opacity="0.65"/>
                    <circle cx={w.x + w.w/2} cy={w.y + w.h + 16} r="11"
                            fill="var(--cockpit-teal)"/>
                    <path d={`M${w.x + w.w/2 - 4} ${w.y + w.h + 16} l3 3 l6 -6`}
                          stroke="#fff" strokeWidth="2.4" fill="none"
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                )}
                {/* invisible expanded hit zone */}
                <rect x={w.x - 8} y={w.y - 8} width={w.w + 16} height={w.h + 16}
                      fill="transparent">
                  <title>{code}</title>
                </rect>
              </g>
            );
          })}
        </g>
      ))}

      {/* G / D markers */}
      <g fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="800"
         fill="var(--cockpit-steel-2)" letterSpacing="1.5">
        <text x="14" y={height} textAnchor="start">← GAUCHE</text>
        <text x={width - 14} y={height} textAnchor="end">DROITE →</text>
      </g>
    </svg>
  );
}
