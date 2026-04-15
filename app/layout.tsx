import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { HydrationGate } from '@/components/providers/HydrationGate';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '10 Regalos',
  description: 'Tu espacio personal de auto-recompensa. Define, sorpréndete y celebra.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '10 Regalos',
  },
};

export const viewport: Viewport = {
  themeColor: '#F59E0B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`${inter.className} min-h-full`}>
        {/*
          HydrationGate blocks rendering until Zustand rehydrates from
          localStorage, preventing a flash of the setup screen for
          returning users.
        */}
        <HydrationGate>{children}</HydrationGate>
      </body>
    </html>
  );
}
