'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store/useStore';

export function ThemeSync() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    const saved = localStorage.getItem('devtools-theme') as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'dark' : 'light');
    
    const root = document.documentElement;
    if (initialTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, []);

  return null;
}