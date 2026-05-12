<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DevTools Pro — Agent Instructions

## Tech Stack

| Concern        | Technology                                                                 |
|----------------|----------------------------------------------------------------------------|
| Framework      | **Next.js 16.2.6** (App Router) — consult `node_modules/next/dist/docs/` before assuming any API |
| Language       | **TypeScript 5**, strict mode                                              |
| React          | **React 19.2.4**                                                           |
| Styling        | **Tailwind CSS v4** — no `tailwind.config.*`; all tokens defined via `@theme` in `src/app/globals.css` |
| Animations     | Framer Motion ^12                                                          |
| Global state   | Zustand ^5 with `persist` middleware (`src/lib/store/useStore.ts`)         |
| Validation     | Zod ^4                                                                     |
| Icons          | Lucide React ^1.14 (primary), React Icons ^5 (GitHub icon in Header only) |
| Utility        | `clsx` ^2 via `cn()` wrapper in `src/lib/utils/index.ts`                  |
| Linting        | ESLint v9 flat config (`eslint.config.mjs`)                                |

## Build / Lint / Test Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server (requires build first)
npm run start

# Lint the entire project
npm run lint
```

**There is no test runner installed.** Do not add Jest, Vitest, or any test framework unless explicitly requested. If tests are ever added, place them alongside the source file as `*.test.ts` / `*.test.tsx`.

## Directory Structure

```
src/
  app/                    # Next.js App Router pages
    globals.css           # Tailwind v4 @theme tokens + global styles
    layout.tsx            # Root layout (fonts, metadata, providers)
    page.tsx              # Homepage
    tools/
      <tool-name>/
        page.tsx          # One directory per tool — no dynamic [toolId] routing
  components/
    homepage/             # Hero, ToolGrid, Categories, Features
    layout/               # Header, Footer, CommandPalette, ThemeSync
    tool/                 # ToolLayout (shared wrapper for all tool pages)
    ui/                   # Button, Card, GradientBox, Input, Modal, Select, Toast
  lib/
    hooks/useTheme.tsx    # ThemeProvider + useTheme context
    store/useStore.ts     # Zustand global store
    utils/index.ts        # cn, formatDate, formatTime, debounce, throttle
  tools/                  # Pure utility logic (no React) — one dir per tool
    <tool-name>/utils.ts
  types/index.ts          # Shared type aliases
```

## Adding a New Tool — Checklist

1. Create `src/tools/<name>/utils.ts` — pure functions only, no React imports.
2. Create `src/app/tools/<name>/page.tsx` — `'use client'` page that wires state to the utils.
3. Register the tool in the tools registry (check `src/components/homepage/ToolGrid.tsx` and `CommandPalette.tsx`).

## Code Style

### TypeScript

- Strict mode is enforced. Never use `any`; prefer `unknown` for parsed/external data.
- Use `interface` for component props; use `type` for unions and aliases.
- Extend native HTML attributes when wrapping HTML elements:
  ```ts
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { ... }
  ```
- Use discriminated unions for operation results — do not throw from utility functions:
  ```ts
  type Result = { success: true; data: unknown } | { success: false; error: string };
  ```
- Cast caught errors explicitly: `(e as Error).message`, `(e as SyntaxError).message`.
- Use `for...of` over `Array.forEach` for iteration with side effects.

### Imports

- Use `import * as React from 'react'` — not `import React from 'react'`.
- Use the `@/` path alias for all internal imports (`@/components/...`, `@/lib/...`, `@/tools/...`).
- Group imports: external libraries first, then internal `@/` imports.
- Import types inline: `import { type ClassValue } from 'clsx'`.

### React Components

- All interactive / stateful components must have `'use client'` as the first line.
- Use named exports for all shared components: `export { Button, type ButtonProps }`.
- Tool pages use `export default function Page()` (Next.js App Router convention).
- Use `React.forwardRef` for all UI primitives; set `ComponentName.displayName`.
- Prefer `React.useCallback` for handlers passed to `useEffect` deps arrays.
- Debounce reactive processing via `setTimeout` in `useEffect` with cleanup (100 ms default):
  ```ts
  React.useEffect(() => {
    const timer = setTimeout(handleProcess, 100);
    return () => clearTimeout(timer);
  }, [handleProcess]);
  ```

### Styling

- **Tailwind utility classes only** — no CSS modules, no inline `style` props.
- Use `cn()` (from `@/lib/utils`) for all conditional class merging.
- Use the design token class names defined in `globals.css`:
  - Backgrounds: `bg-bg-primary`, `bg-bg-secondary`, `bg-bg-tertiary`, `bg-bg-hover`
  - Text: `text-text-primary`, `text-text-secondary`, `text-text-muted`
  - Borders: `border-border`, `border-border-hover`
  - Accent: `text-accent`, `bg-accent`, `bg-accent-hover`
  - Status: `text-success`, `text-warning`, `text-error`
- Fonts: `font-outfit` for headings/brand copy; `font-mono` for code/output.
- Tailwind v4 has **no `tailwind.config.*`**. To add new tokens, edit the `@theme` block in `src/app/globals.css`.

### State Management

- **Local state:** `React.useState` + `React.useEffect` for component-level reactivity.
- **Global state:** Zustand `useAppStore` from `src/lib/store/useStore.ts` for theme, recent tools, favorites, and command palette visibility.
- Do not create new Zustand slices without a strong reason; prefer collocating state in the page component.

### Error Handling

- Utility functions (`src/tools/*/utils.ts`) must **never throw** to the UI. Return a result object instead.
- Page components catch errors from utils in a try/catch and store them in `error` state.
- Render errors inline using styled status banners (see `src/app/tools/json/page.tsx` for the pattern).
- Use `toast({ type: 'success' | 'error', message: '...' })` from `@/components/ui/Toast` for ephemeral user feedback (e.g. copy-to-clipboard confirmation).

### Naming Conventions

| Thing                  | Convention                          | Example                          |
|------------------------|-------------------------------------|----------------------------------|
| Components / files     | PascalCase                          | `ToolLayout.tsx`, `Button.tsx`   |
| Hooks                  | camelCase, `use` prefix             | `useTheme`, `useAppStore`        |
| Utility functions      | camelCase                           | `parseJson`, `formatDate`        |
| Type unions / aliases  | PascalCase                          | `JsonAction`, `HashAlgorithm`    |
| Boolean props          | Adjective, no `is` prefix required  | `loading`, `disabled`, `monospace` |
| Event handlers         | `handle` prefix                     | `handleProcess`, `handleCopy`    |
| Constants (module-level) | camelCase array/object literals   | `const actions = [...]`          |

## Tailwind v4 Notes

- **No `tailwind.config.ts`** — all customisation lives in the `@theme { }` block inside `src/app/globals.css`.
- The PostCSS plugin is `@tailwindcss/postcss` (configured in `postcss.config.mjs`).
- Dark mode is the default (`:root`); light mode overrides use the `.light` class on `<html>`.
- Custom utilities (`.glass`, `.gradient-text`, `.glow-accent`, `.scrollbar-hide`) and keyframes (`float`, `pulse-glow`, `slide-up`, `fade-in`) are declared in `globals.css` via `@layer utilities` / `@keyframes`.
- Do **not** use `@apply` — compose utility classes directly in JSX.
