// src/app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Ganjifa — Traditional Indian Card Game',
  description: 'Play Dashavatara, Ramayana & Modern Warfare Ganjifa online. Ancient Mughal card game, revived.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="text-center text-xs text-gold/20 py-3 border-t border-gold/10 font-mughal tracking-wider">
          GANJIFA · गंजिफा · THE ROYAL CARD GAME OF INDIA
        </footer>
        <Toaster position="top-center" toastOptions={{
          style: { background:'#0F2419', border:'1px solid rgba(218,165,32,0.4)', color:'#FFFFF0' }
        }}/>
      </body>
    </html>
  );
}
