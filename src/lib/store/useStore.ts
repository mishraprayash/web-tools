import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        localStorage.setItem('devtools-theme', theme);
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
        set({ theme });
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('devtools-theme', newTheme);
        const root = document.documentElement;
        if (newTheme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
        set({ theme: newTheme });
      },
      recentTools: [],
      addRecentTool: (toolId) => {
        const { recentTools } = get();
        const filtered = recentTools.filter((t) => t !== toolId);
        set({ recentTools: [toolId, ...filtered].slice(0, 6) });
      },
      favorites: [],
      toggleFavorite: (toolId) => {
        const { favorites } = get();
        if (favorites.includes(toolId)) {
          set({ favorites: favorites.filter((t) => t !== toolId) });
        } else {
          set({ favorites: [...favorites, toolId] });
        }
      },
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'devtools-storage',
      partialize: (state) => ({
        theme: state.theme,
        recentTools: state.recentTools,
        favorites: state.favorites,
      }),
    }
  )
);