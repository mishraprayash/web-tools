# DevTools Pro - Developer Utilities Platform

## Project Overview

**Project Name:** DevTools Pro  
**Type:** Web Application (Next.js App Router)  
**Core Functionality:** A premium, production-grade developer utilities platform featuring 20+ interactive tools for encoding, decoding, formatting, hashing, and API testing.  
**Target Users:** Backend engineers, frontend developers, DevOps engineers, security engineers, and computer science students.

---

## Technical Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Validation:** Zod
- **Code Editor:** Monaco Editor (@monaco-editor/react)
- **Icons:** Lucide React
- **UI Components:** Custom (shadcn/ui inspired)

---

## UI/UX Specification

### Color Palette

```css
/* Dark Theme (Default) */
--bg-primary: #0a0a0b;        /* Main background */
--bg-secondary: #111113;        /* Card backgrounds */
--bg-tertiary: #18181b;        /* Elevated surfaces */
--bg-hover: #1f1f23;          /* Hover states */

--text-primary: #fafafa;        /* Primary text */
--text-secondary: #a1a1aa;     /* Secondary text */
--text-muted: #71717a;          /* Muted text */

--border: #27272a;              /* Borders */
--border-hover: #3f3f46;        /* Hover borders */

--accent: #22d3ee;             /* Cyan accent */
--accent-hover: #06b6d4;       /* Hover accent */
--accent-muted: rgba(34, 211, 238, 0.1);

--success: #10b981;            /* Green */
--warning: #f59e0b;           /* Amber */
--error: #ef4444;               /* Red */

/* Light Theme */
--light-bg-primary: #ffffff;
--light-bg-secondary: #fafafa;
--light-bg-tertiary: #f4f4f5;
--light-text-primary: #18181b;
--light-text-secondary: #52525b;
--light-border: #e4e4e7;
```

### Typography

- **Font Family:**
  - Headings: "Outfit", sans-serif
  - Body: "IBM Plex Sans", sans-serif
  - Code: "JetBrains Mono", monospace
- **Font Sizes:**
  - Display: 4rem (64px)
  - H1: 2.5rem (40px)
  - H2: 1.875rem (30px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)
  - XS: 0.75rem (12px)
- **Line Heights:** 1.2 (tight), 1.5 (normal), 1.75 (relaxed)

### Spacing System

- Base unit: 4px
- Spacing scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64

### Border Radius

- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- full: 9999px

### Shadows & Effects

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 40px rgba(34, 211, 238, 0.15);

/* Glassmorphism */
--glass: rgba(17, 17, 19, 0.8);
--glass-border: rgba(255, 255, 255, 0.08);
```

### Layout Structure

- **Max Content Width:** 1440px
- **Grid:** 12-column for desktop, 6-column for tablet, 4-column for mobile
- **Responsive Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

---

## Homepage Structure

### 1. Navigation Bar (Fixed)
- Logo (left)
- Tool categories dropdown
- Search trigger button (Cmd+K)
- Theme toggle
- GitHub link

### 2. Hero Section
- **Headline:** "DevTools Pro" with gradient text
- **Subheadline:** "20+ production-grade developer utilities in one beautiful platform"
- **CTA Buttons:** "Start Building" (primary), "Browse Tools" (secondary)
- **Animated background:** Floating geometric shapes with blur

### 3. Popular Tools Grid
- 6 tool cards displayed in a responsive grid
- Each card: Icon, title, description, hover animation
- Tools: JSON Beautifier, Base64 Encoder, JWT Decoder, Hash Generator, Timestamp Converter, Regex Tester

### 4. Categories Section
- 6 category cards: Encoding, Security, Formatting, Text, API, Date/Time
- Each shows tool count and icons

### 5. Features Section
- 4 feature highlights with icons:
  - "Instant Processing" - All tools run locally in your browser
  - "Privacy First" - Your data never leaves your device
  - "Keyboard Driven" - Cmd+K search, keyboard shortcuts
  - "Open Source" - Free forever, no registration

### 6. Footer
- Links: GitHub, Changelog, Privacy, Categories
- Copyright

---

## Tool Page Architecture

### Layout
```
┌─────────────────────────────────────────────┐
│ Header (Tool name + category breadcrumb)       │
├─────────────────────────────────────────────┤
│ Description + Use Cases                  │
├─────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────────────┐ │
│ │ Input      │ │ Output                  │ │
│ │ Panel     │ │ Panel                  │ │
│ │           │ │                         │ │
│ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Action Buttons: Copy | Clear | Download    │
├─────────────────────────────────────────────┤
│ Examples (Collapsible)                     │
└─────────────────────────────────────────────┘
```

### Features Per Tool
- Monaco Editor for input/output
- Copy to clipboard button
- Download as file button
- Clear/reset button
- Keyboard shortcuts
- URL state persistence
- Error display with highlighting

---

## Tools Specification

### 1. JSON Beautifier & Validator
- **Input:** Text area / file upload
- **Actions:**
  - Beautify (2/4 space indent)
  - Minify
  - Validate JSON
  - Sort keys
- **Output:** Formatted JSON with syntax highlighting
- **Features:** Error line highlighting

### 2. Base64 Encoder/Decoder
- **Input:** Text / file
- **Actions:**
  - Encode (Standard + URL-safe)
  - Decode
- **Output:** Encoded/decoded string

### 3. JWT Decoder
- **Input:** JWT token
- **Output:**
  - Header (JSON)
  - Payload (JSON)
  - Signature
- **Features:**
  - Expiry status (valid/expired)
  - Issued-at timestamp
  - Human-readable timestamps

### 4. Hash Generator
- **Input:** Text / file
- **Algorithms:** MD5, SHA1, SHA256, SHA512
- **Output:** Hash in lowercase hex

### 5. Unix Timestamp Converter
- **Input:** Timestamp or date string
- **Output:** Both formats with timezone
- **Features:**
  - Current timestamp (live)
  - Relative time display

### 6. Regex Tester
- **Input:** Pattern + Test string
- **Output:** Highlighted matches
- **Features:**
  - Flags (g, i, m, s)
  - Match groups

### 7. UUID Generator
- **Versions:** v1, v4, v7
- **Actions:** Generate (bulk support)
- **Output:** UUID(s)

### 8. URL Encoder/Decoder
- **Input:** URL string
- **Actions:** Encode / Decode
- **Output:** Encoded/decoded URL

### 9. Cron Expression Parser
- **Input:** Cron expression
- **Output:** Human-readable description
- **Features:** Next 5 execution times

---

## Component Specifications

### Button
- Variants: primary, secondary, ghost, danger
- Sizes: sm, md, lg
- States: default, hover, active, disabled, loading
- Keyboard shortcut badge support

### Input/TextArea
- Monospace font for code areas
- Line numbers for code
- Syntax highlighting where applicable
- Auto-resize option

### Card
- Glassmorphism background option
- Hover lift animation
- Gradient border on hover

### Tool Card (Homepage)
- Icon with gradient background
- Title + description
- Hover: scale(1.02), shadow increase, border glow

### Modal/Dialog
- Backdrop blur
- Slide-up animation
- Focus trap

### Toast
- Position: bottom-right
- Auto-dismiss (5s)
- Types: success, error, warning, info

### Command Palette
- Trigger: Cmd+K / Ctrl+K
- Search tools and categories
- Keyboard navigation
- Recent tools section

---

## Animation Specifications

### Page Transitions
- Fade + slide (150ms ease-out)

### Tool Cards
- Hover: scale(1.02) + translateY(-4px)
- Transition: 200ms ease-out

### Buttons
- Hover: brightness increase + scale(0.98)
- Click: scale(0.95)
- Transition: 100ms

### Input Focus
- Border color transition: 150ms
- Glow effect: 200ms

### Loading States
- Skeleton pulse animation
- Spinner rotation

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Stacked tool panels
- Bottom navigation
- Full-width buttons
- Collapsible sections

### Tablet (640px - 1024px)
- 2-column grid
- Side-by-side panels (if space allows)
- Condensed navigation

### Desktop (> 1024px)
- Full grid layout
- Side-by-side tool panels
- Keyboard shortcuts enabled
- Command palette

---

## Performance Targets

- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **Lighthouse Score:** > 95
- **Bundle Size:** < 500KB (initial)
- **Memory:** < 100MB (idle)

---

## State Management (Zustand)

```typescript
interface AppStore {
  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  
  // Tools
  recentTools: string[];
  addRecentTool: (toolId: string) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  
  // History (per tool)
  history: Record<string, string[]>;
  addToHistory: (toolId: string, value: string) => void;
  clearHistory: (toolId: string) => void;
}
```

---

## File Structure

```
/app
  /layout.tsx              # Root layout
  /page.tsx               # Homepage
  /globals.css            # Global styles
  /tools
    /[toolId]
      /page.tsx           # Tool page
  /api
    /health               # Health check
/components
  /ui
    /Button.tsx
    /Input.tsx
    /Card.tsx
    /Toast.tsx
    /Modal.tsx
    /Skeleton.tsx
  /layout
    /Header.tsx
    /Footer.tsx
    /CommandPalette.tsx
  /homepage
    /Hero.tsx
    /ToolGrid.tsx
    /Categories.tsx
    /Features.tsx
  /tool
    /ToolLayout.tsx
    /Editor.tsx
    /ActionBar.tsx
    /Examples.tsx
/lib
  /hooks
    /useTheme.ts
    /useKeyboard.ts
    /useLocalStorage.ts
  /utils
    /cn.ts
    /theme.ts
  /store
    /useStore.ts
/tools
  /json
    /schema.ts            # Zod schemas
    /utils.ts            # Tool logic
  /base64
  /jwt
  /hash
  ... (each tool in its own folder)
/public
  /fonts
/types
  /index.d.ts

```

---

## Acceptance Criteria

1. ✅ Homepage loads in < 2 seconds
2. ✅ Tool pages are accessible and functional
3. ✅ All tools produce correct output
4. ✅ Dark/light theme toggle works
5. ✅ Command palette opens with Cmd+K
6. ✅ Mobile responsive layout works
7. ✅ No console errors
8. ✅ Build passes without errors
9. ✅ TypeScript strict mode passes
10. ✅ Keyboard shortcuts functional