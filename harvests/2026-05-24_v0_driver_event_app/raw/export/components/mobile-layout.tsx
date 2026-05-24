'use client';

import { ReactNode } from 'react';
import { Truck, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';

interface MobileLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  backHref?: string;
}

export function MobileLayout({
  children,
  title,
  showBack = false,
  backHref = '/',
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        {showBack ? (
          <Link
            href={backHref}
            className="touch-target flex items-center justify-center -ml-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
        ) : (
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
            <Truck className="h-5 w-5 text-primary" />
          </div>
        )}
        <h1 className="text-lg font-semibold flex-1 truncate">{title}</h1>
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
