# ParityPulse - Global Economic Resilience & Labor Parity Engine

## Overview

ParityPulse is an executive dashboard for analyzing global purchasing power parity (PPP). The application visualizes how much a user's lifestyle costs across 50+ countries using an interactive 3D Mapbox globe with a Modern Minimalist Executive aesthetic (white theme inspired by McKinsey/The Economist).

## Recent Updates (January 2026)

### Design Overhaul
- **Executive White Theme**: Complete redesign from dark FinTech to boardroom-ready white aesthetic
- **Typography**: Georgia (serif) for headlines, Inter (sans-serif) for UI text
- **Color Palette**: Navy (#0F172A), Slate (#475569), Success Blue (#2563EB)
- **Watermark**: "CONCEPT BY RITU ANN ROY" fixed in bottom-right corner

### New Features
- **Tariff Sensitivity Slider**: 0-50% import cost simulation for trade policy analysis
- **Work-Hour Exchange**: Calculate hours of local work to afford basket
- **Macro-Stability Score**: Stable/Moderate/Volatile indicator per country
- **Consultant's Brief**: GPT-4o powered executive summary with Economic Opportunity, Labor Risks, Policy Implications

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with Executive White theme (McKinsey/Economist aesthetic)
- **UI Components**: shadcn/ui component library (Radix UI primitives + Tailwind)
- **Map Visualization**: Mapbox GL for 3D globe rendering with custom heat map overlays

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript throughout (shared types between client/server)
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Build System**: Custom build script using esbuild for server bundling, Vite for client

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Migrations**: Managed via `drizzle-kit` with output to `./migrations`

### Key Design Patterns
- **Shared Schema**: Database schemas and TypeScript types are defined once in `shared/` and imported by both client and server
- **In-Memory Storage Option**: `server/storage.ts` provides a `MemStorage` class for development/testing without database
- **AI Integration Layer**: Replit AI integrations in `server/replit_integrations/` for chat, image generation, and batch processing

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including globe, sidebar, panels
    pages/        # Route components (Dashboard, not-found)
    hooks/        # Custom React hooks
    lib/          # Utilities and query client config
server/           # Express backend
  replit_integrations/  # AI service integrations (chat, image, batch)
shared/           # Shared types and database schema
  schema.ts       # Drizzle table definitions
  models/         # Additional model definitions
```

## External Dependencies

### APIs and Services
- **Mapbox GL**: 3D globe visualization (requires `VITE_MAPBOX_TOKEN` environment variable)
- **OpenAI API**: AI features via Replit AI Integrations (uses `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`)
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)

### Key NPM Packages
- **Frontend**: React, TanStack Query, Mapbox GL, react-hook-form, zod, wouter
- **Backend**: Express, Drizzle ORM, pg (PostgreSQL client), OpenAI SDK
- **Shared**: drizzle-zod for schema-to-validation integration

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_MAPBOX_TOKEN` - Mapbox access token for globe visualization
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key for AI features
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI API base URL (for Replit AI proxy)

## Recent Changes

### January 4, 2026
- **Rebranding**: Renamed "Shadow Price" to "Parity Pulse" throughout the application (UI, documentation, meta tags)
- **WebGL Fallback**: Added graceful fallback UI when WebGL is unavailable (common in headless testing environments). The fallback shows a scrollable list of countries that can be clicked to view details.
- **Bug Fix**: Fixed API response parsing in BasketSidebar - the `apiRequest` function returns a Response object, which now correctly calls `.json()` to parse the response body.
- **Ticker Update**: The calculation results now include custom ticker data that updates the live ticker bar when a calculation completes.
- **Feature Properties**: Added latitude/longitude to GeoJSON feature properties so the click handler receives complete country data.