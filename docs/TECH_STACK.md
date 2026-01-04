# ParityPulse - Technical Stack Documentation

> **Last Updated:** January 2026  
> **Version:** 1.0.0  
> **Concept By:** Ritu Ann Roy

---

## Overview

ParityPulse is a full-stack web application that visualizes global Purchasing Power Parity (PPP) on an interactive 3D globe. This document provides a comprehensive breakdown of all technologies, frameworks, databases, APIs, and architectural decisions used to build the application.

---

## Programming Languages

| Language | Version | Purpose |
|----------|---------|---------|
| **TypeScript** | 5.6.3 | Primary language for frontend and backend (strict mode enabled) |
| **JavaScript** | ESNext | Runtime target for Node.js and browser |
| **HTML5** | - | Markup structure |
| **CSS3** | - | Styling via Tailwind utility classes |

### TypeScript Configuration
- **Module System:** ESNext
- **JSX:** Preserve (handled by Vite)
- **Strict Mode:** Enabled
- **Module Resolution:** Bundler
- **Path Aliases:** `@/*` for client, `@shared/*` for shared types

---

## Frontend Stack

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| **React** | 18.3.1 | Component-based UI library |
| **Vite** | 7.3.0 | Build tool, development server, and HMR |
| **@vitejs/plugin-react** | 4.7.0 | React integration for Vite |

### Routing

| Package | Version | Purpose |
|---------|---------|---------|
| **Wouter** | 3.3.5 | Lightweight client-side routing (~2KB) |

### State Management & Data Fetching

| Package | Version | Purpose |
|---------|---------|---------|
| **TanStack React Query** | 5.60.5 | Server state, caching, and API calls |
| **React Hook Form** | 7.55.0 | Form state management |
| **@hookform/resolvers** | 3.10.0 | Zod validation integration |

### UI Component Library

**shadcn/ui** - A collection of accessible, customizable components built on:

| Package | Version | Purpose |
|---------|---------|---------|
| **@radix-ui/react-dialog** | 1.1.7 | Modal dialogs |
| **@radix-ui/react-dropdown-menu** | 2.1.7 | Dropdown menus |
| **@radix-ui/react-tooltip** | 1.2.0 | Tooltips |
| **@radix-ui/react-slider** | 1.2.4 | Slider controls |
| **@radix-ui/react-select** | 2.1.7 | Select dropdowns |
| **@radix-ui/react-tabs** | 1.1.4 | Tab navigation |
| **@radix-ui/react-toast** | 1.2.7 | Toast notifications |
| **@radix-ui/react-popover** | 1.1.7 | Popovers |
| **@radix-ui/react-switch** | 1.1.4 | Toggle switches |
| **class-variance-authority** | 0.7.1 | Component variant management |

### Styling

| Package | Version | Purpose |
|---------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **tailwindcss-animate** | 1.0.7 | Animation utilities |
| **@tailwindcss/typography** | 0.5.15 | Prose styling |
| **PostCSS** | 8.4.47 | CSS processing pipeline |
| **Autoprefixer** | 10.4.20 | Automatic vendor prefixes |
| **tailwind-merge** | 2.6.0 | Intelligent class merging |
| **clsx** | 2.1.1 | Conditional classnames |

### Design Theme
- **Aesthetic:** Modern Minimalist Executive (McKinsey/Economist-inspired)
- **Primary Colors:** Navy (#0F172A), Slate (#475569), Success Blue (#2563EB)
- **Typography:** Playfair Display (logo), Georgia (headlines), Inter (UI)
- **Dark Mode:** Supported via class-based toggle

### Mapping & Visualization

| Package | Version | Purpose |
|---------|---------|---------|
| **Mapbox GL JS** | 3.17.0 | 3D globe rendering, interactive maps (actively used) |
| **@types/mapbox-gl** | 3.4.1 | TypeScript definitions |

### Icons

| Package | Version | Purpose |
|---------|---------|---------|
| **Lucide React** | 0.453.0 | Primary icon library (actively used) |

### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| **Zod** | 3.25.76 | Schema validation (actively used) |

> **Note:** Many additional UI packages are installed (Framer Motion, Recharts, react-resizable-panels, etc.) but are not actively used in the current implementation. They are available for future enhancements.

---

## Backend Stack

### Runtime & Framework

| Package | Version | Purpose |
|---------|---------|---------|
| **Node.js** | (Replit NixOS) | JavaScript runtime |
| **Express.js** | 4.21.2 | Web server framework |
| **tsx** | 4.20.5 | TypeScript execution (no compilation step) |

### Data Storage

**Current Implementation: In-Memory Storage**

The application currently uses in-memory storage (`MemStorage` class in `server/storage.ts`) for user session data. The economic calculations use hardcoded country data in `server/routes.ts`.

**Available but not actively used:**

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | (Neon-backed) | Relational database via Replit (available) |
| **Drizzle ORM** | 0.39.3 | Type-safe SQL query builder (installed) |
| **Drizzle Kit** | 0.31.8 | Database migrations (installed) |
| **drizzle-zod** | 0.7.1 | Schema-to-Zod validation (installed) |
| **pg** | 8.16.3 | PostgreSQL client driver (installed) |

> **Note:** Database packages are installed and configured for future persistence needs but the current MVP uses in-memory storage for simplicity.

### Session Management (Available but not used)

The following packages are installed but not actively used in the current MVP:

| Package | Version | Purpose |
|---------|---------|---------|
| **express-session** | 1.18.1 | Session middleware (installed) |
| **Passport.js** | 0.7.0 | Authentication middleware (installed) |

> **Note:** Authentication and session management are available for future user account features.

### AI Integration

| Package | Version | Purpose |
|---------|---------|---------|
| **OpenAI SDK** | 6.15.0 | GPT-4o API access |

The AI integration is managed through Replit's built-in AI Integrations system, which automatically handles:
- API key rotation
- Secret management
- Rate limiting
- Proxy routing

### Async Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| **p-limit** | 7.2.0 | Concurrency control |
| **p-retry** | 7.1.1 | Retry with exponential backoff |
| **ws** | 8.18.0 | WebSocket support |
| **zod-validation-error** | 3.5.4 | Human-readable Zod errors |

---

## Build & Development Tools

### Build System

| Tool | Version | Purpose |
|------|---------|---------|
| **Vite** | 7.3.0 | Frontend bundler (dev + production) |
| **esbuild** | 0.25.0 | Server-side bundling |
| **tsx** | 4.20.5 | TypeScript runtime execution |

### Replit-Specific Plugins

| Plugin | Version | Purpose |
|--------|---------|---------|
| **@replit/vite-plugin-runtime-error-modal** | 0.0.3 | Error overlay in development |
| **@replit/vite-plugin-cartographer** | 0.4.4 | File mapping |
| **@replit/vite-plugin-dev-banner** | 0.1.1 | Development mode indicator |

### Type Definitions

| Package | Version |
|---------|---------|
| **@types/node** | 20.19.27 |
| **@types/react** | 18.3.11 |
| **@types/react-dom** | 18.3.1 |
| **@types/express** | 4.17.21 |
| **@types/express-session** | 1.18.0 |
| **@types/passport** | 1.0.16 |
| **@types/passport-local** | 1.0.38 |
| **@types/ws** | 8.5.13 |
| **@types/connect-pg-simple** | 7.0.3 |

---

## External APIs & Services

| Service | Purpose | Authentication |
|---------|---------|----------------|
| **Mapbox Geocoding API** | Location search, reverse geocoding | `VITE_MAPBOX_TOKEN` |
| **Mapbox GL** | 3D globe visualization | `VITE_MAPBOX_TOKEN` |
| **OpenAI GPT-4o** | Item categorization, consultant briefs | Replit AI Integrations |
| **PostgreSQL (Neon)** | Data persistence | `DATABASE_URL` |

---

## Environment Variables

### Required Secrets

| Variable | Purpose | Management |
|----------|---------|------------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-provisioned by Replit |
| `VITE_MAPBOX_TOKEN` | Mapbox API access | User-provided secret |
| `SESSION_SECRET` | Express session encryption | User-provided secret |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key | Auto-managed by Replit |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI proxy URL | Auto-managed by Replit |

---

## Project Structure

```
paritypulse/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # UI components
│   │   │   ├── ui/              # shadcn/ui primitives
│   │   │   ├── BasketSidebar.tsx    # Item input, location search, policy controls
│   │   │   ├── GlobeMap.tsx         # 3D Mapbox globe visualization
│   │   │   ├── CountryInfoPanel.tsx # Country fact sheet sidebar
│   │   │   ├── ConsultantBrief.tsx  # AI-generated executive summary
│   │   │   ├── LiveTicker.tsx       # Scrolling commodity ticker
│   │   │   ├── HeatmapLegend.tsx    # Color legend for map
│   │   │   └── LocationIndicator.tsx # User location display
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx    # Main application page
│   │   │   └── not-found.tsx    # 404 page
│   │   ├── hooks/
│   │   │   └── use-toast.ts     # Toast notification hook
│   │   ├── lib/
│   │   │   ├── queryClient.ts   # TanStack Query config
│   │   │   └── utils.ts         # Utility functions
│   │   ├── App.tsx              # Root component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles & CSS variables
│   └── index.html
│
├── server/                      # Express backend
│   ├── index.ts                 # Server entry point
│   ├── routes.ts                # API endpoints + calculation logic
│   ├── storage.ts               # In-memory storage interface
│   ├── vite.ts                  # Vite middleware integration
│   └── replit_integrations/     # AI service wrappers
│       ├── chat.ts              # GPT-4o chat integration
│       ├── imageGen.ts          # Image generation
│       └── batch.ts             # Batch processing
│
├── shared/                      # Shared between client/server
│   └── schema.ts                # Type definitions + Zod schemas
│
├── docs/                        # Documentation
│   ├── TECH_STACK.md            # This file
│   └── CALCULATION_METHODOLOGY.md
│
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
├── tailwind.config.ts           # Tailwind config
├── drizzle.config.ts            # Drizzle ORM config
├── postcss.config.js            # PostCSS config
├── design_guidelines.md         # UI/UX design system
└── replit.md                    # Project documentation
```

---

## NPM Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema changes |

---

## Hosting & Deployment

- **Platform:** Replit
- **Frontend Hosting:** Vite dev server (development), static files (production)
- **Backend Hosting:** Express.js on Node.js
- **Database:** Replit-managed PostgreSQL (Neon)
- **Domain:** `.replit.app` subdomain or custom domain
- **SSL/TLS:** Automatic via Replit

---

## Browser Compatibility

- **Chrome/Edge:** Full support (WebGL required for 3D globe)
- **Firefox:** Full support
- **Safari:** Full support
- **Mobile:** Responsive design, touch-enabled globe
- **Fallback:** When WebGL unavailable, displays scrollable country list

---

## Performance Considerations

1. **TanStack Query** caches API responses to minimize network requests
2. **Mapbox GL** uses WebGL for GPU-accelerated 3D rendering
3. **Vite** provides fast HMR in development and optimized builds
4. **Tree-shaking** removes unused code from production bundles
5. **Lazy loading** available for route-based code splitting

---

## Security Measures

1. **Environment Variables:** Secrets never exposed to client
2. **CORS:** Configured for same-origin requests
3. **Session Security:** Secure cookies, HTTP-only flags
4. **Input Validation:** Zod schemas validate all API inputs
5. **API Keys:** Managed via Replit's secret management
