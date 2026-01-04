# Design Guidelines: ParityPulse Executive Dashboard

## Design Philosophy

**Modern Minimalist Executive** - A boardroom-ready consulting tool inspired by McKinsey presentations, The Economist white papers, and elite financial advisory dashboards.

**Core Principles**: 
- White-space heavy for reduced cognitive load
- Professional credibility through restraint
- Information hierarchy via typography
- Subtle shadows and refined borders
- Clean data visualization

---

## Color Palette

**Primary Colors**:
- Background: Pure White to Light Grey (#FFFFFF to #F8FAFC)
- Foreground: Professional Navy (#0F172A)
- Text Secondary: Slate (#475569)

**Accent Colors**:
- Primary Action: Success Blue (#2563EB)
- Positive: Professional Green (#16A34A)
- Warning: Amber (#CA8A04)
- Negative: Professional Red (#DC2626)

**Border & Subtle Elements**:
- Border: Light Slate (#E2E8F0)
- Muted Background: (#F1F5F9)

---

## Typography System

**Primary Font**: 
- UI Elements: `Inter` (sans-serif) - modern, clean, highly legible
- Headlines/Titles: `Georgia` (serif) - creates "The Economist" white paper aesthetic

**Hierarchy**:
- Page Title: `text-2xl font-serif font-bold text-navy`
- Section Headers: `text-sm font-sans uppercase tracking-widest text-slate`
- Data Labels: `text-xs font-sans uppercase tracking-wide text-muted-foreground`
- Primary Data Values: `text-3xl md:text-4xl font-sans font-bold tabular-nums`
- Secondary Data: `text-lg font-sans tabular-nums`
- Body Text: `text-sm font-sans leading-relaxed text-slate`

---

## Layout System

**Spacing Primitives**: Tailwind units of **3, 4, 6, 8, 12, 16** (e.g., p-4, gap-8, mb-12)

**Grid Structure**:
- Desktop: Sidebar (w-80 to w-96) + Main Content Area (flex-1)
- White-space heavy: generous padding throughout

**Component Spacing**:
- Card padding: `p-6`
- Section gaps: `gap-8`
- Form element spacing: `space-y-4`

---

## Component Library

### Executive Sidebar
- Clean white/light grey background
- Subtle right border
- Sections: Logo/Title, User Input Form, Policy Controls, Action Button
- Form inputs: Clean borders, focused state with blue ring
- Calculate button: Full-width, Success Blue with white text

### 3D Globe Container
- Main content area: `flex-1 relative`
- Light Mapbox style: `mapbox://styles/mapbox/light-v11`
- Clean overlay UI: Legend and controls in white cards with subtle shadows

### Data Cards
- Pure white background with subtle border
- Layout: `p-6 rounded shadow-sm` 
- Refined border: `border border-border`

### Country Info Panel (Fact Sheet)
- Slides in from right
- Header: Country name + Parity Pulse Index score
- Sections: PPP Score, Annual Work-Hours, Macro-Stability Score
- Professional data table layout

### Consultant's Brief Panel
- AI-generated summary in 3 bullet points
- Focus on: Economic Opportunity, Labor Risks, Policy Implications
- Styled as executive briefing card

---

## Visual Hierarchy & Data Display

**Data Presentation**:
- Primary metrics: Large, bold, navy text
- Positive values: Professional green (#16A34A)
- Negative values: Professional red (#DC2626)
- Neutral/loading: Subtle shimmer animation

**Tables & Lists**:
- Clean alternating row backgrounds (white/light grey)
- Headers: Uppercase, small text, tracking-widest
- Numerical alignment: Right-aligned, tabular-nums

---

## Shadows & Borders

**Shadow System**:
- Cards: `shadow-sm` (subtle elevation)
- Popovers/Dropdowns: `shadow-md`
- Modals: `shadow-lg`

**Border Radius**:
- Standard: `rounded` (4px) - subtle, professional
- Buttons/Inputs: `rounded` (4px)

---

## Watermark

Fixed position in bottom-right corner:
- Text: "CONCEPT BY RITU ANN ROY"
- Style: Small uppercase, tracking-widest, slate color
- Class: `watermark`

---

## Animations

**Minimal & Purposeful**:
- Globe rotation: Smooth, continuous slow spin when idle
- Data updates: Subtle fade transitions
- Panel transitions: Slide-in/out (300ms ease-out)
- Loading states: Subtle shimmer effect

---

## Key UI Patterns

1. **White-space heavy layout** - Generous padding and margins
2. **Serif headlines** - Georgia for that "Economist" feel
3. **Tabular data** - Clean, aligned, professional
4. **Status colors** - Green for positive, red for negative, slate for neutral
5. **Subtle shadows** - Minimal elevation, clean lines
