import type { Metadata, Viewport } from 'next';
import './tokens.css';

export const metadata: Metadata = {
  title: 'Atelier Méca · LOI Mobile',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0B2540', // navy app bar (dark + light)
};

export default function AtelierMecaLayout({ children }: { children: React.ReactNode }) {
  // Le repo expose un theme-provider — ce module accepte 'dark' (par défaut) ou 'light'.
  // Le composant <Shell> propage la classe utilitaire dans son arbre.
  return (
    <div className="min-h-dvh bg-[var(--cockpit-paper)] font-sans text-[var(--cockpit-text)] [color-scheme:dark]">
      {children}
    </div>
  );
}
