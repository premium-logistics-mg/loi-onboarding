import Link from 'next/link';
import { ChevronLeft, Wifi, BatteryFull } from 'lucide-react';
import { type ReactNode } from 'react';

export function Shell({
  crumb = 'LOI · Atelier Méca',
  title = 'Atelier Méca',
  showBack = false,
  backHref = '/mobile/atelier-meca',
  right,
  children,
}: {
  crumb?: string;
  title?: string;
  showBack?: boolean;
  backHref?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--cockpit-paper)]">
      <StatusBar offline />
      <AppBar crumb={crumb} title={title} showBack={showBack} backHref={backHref} right={right} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function StatusBar({ offline = false }: { offline?: boolean }) {
  return (
    <div className="flex h-8 items-center justify-between bg-[#0B2540] px-4 text-white">
      <span className="font-mono text-[13px] font-semibold tabular-nums">07:42</span>
      <div className="flex items-center gap-2">
        {offline && (
          <span className="rounded-sm border border-[#E8B97A]/50 bg-[#C77E2A]/25 px-1.5 py-0.5 text-[9px] font-extrabold tracking-[1.6px] text-[#E8B97A]">
            HORS LIGNE
          </span>
        )}
        <Wifi className="h-3.5 w-3.5 stroke-[1.8]" aria-hidden />
        <BatteryFull className="h-3.5 w-3.5 stroke-[1.8]" aria-hidden />
      </div>
    </div>
  );
}

function AppBar({
  crumb, title, showBack, backHref, right,
}: { crumb: string; title: string; showBack: boolean; backHref: string; right?: ReactNode }) {
  return (
    <header className="bg-[#0B2540] px-1.5 pt-1.5 pb-3.5 text-white">
      <div className="flex min-h-14 items-center gap-1">
        {showBack ? (
          <Link
            href={backHref}
            aria-label="Retour"
            className="flex h-14 w-14 items-center justify-center rounded-lg"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.4]" />
          </Link>
        ) : (
          <span className="h-14 w-14 opacity-15">
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </span>
        )}
        <div className="min-w-0 flex-1 pl-1">
          <div className="text-[10px] font-bold uppercase tracking-[2px] text-[#8FA5C3]">{crumb}</div>
          <h1 className="-tracking-[0.3px] text-[22px] font-extrabold leading-tight">{title}</h1>
        </div>
        {right}
      </div>
    </header>
  );
}
