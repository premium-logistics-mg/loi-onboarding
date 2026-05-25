import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Pointage pneu · LOI Mobile',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0B2540', // navy app bar
};

export default function PointagePneuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--cockpit-paper)] font-sans text-[var(--cockpit-text)]">
      {children}
    </div>
  );
}
