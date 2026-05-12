'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ToolGrid } from '@/components/homepage/ToolGrid';
import { Toaster } from '@/components/ui/Toast';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <ToolGrid />
      </main>
      <Footer />
      <CommandPalette />
      <Toaster />
    </>
  );
}
