# Design Guidelines: The Shadow Price Dashboard

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Bloomberg Terminal, Refinitiv Eikon, and modern FinTech dashboards (Robinhood, Stripe Dashboard). The aesthetic combines financial sophistication with modern glassmorphism and data visualization clarity.

**Core Principles**: 
- Information density with breathing room
- Professional credibility through restraint
- Real-time data emphasis
- Scannable hierarchy for rapid decision-making

---

## Typography System

**Primary Font**: 
- Headings: `font-mono` (JetBrains Mono or IBM Plex Mono via Google Fonts)
- Body/Data: `font-sans` (Inter or Poppins for readability)

**Hierarchy**:
- Dashboard Title: `text-xl md:text-2xl font-mono font-bold tracking-tight`
- Section Headers: `text-sm font-mono uppercase tracking-widest`
- Data Labels: `text-xs font-mono uppercase tracking-wide opacity-60`
- Primary Data Values: `text-3xl md:text-4xl font-mono font-bold tabular-nums`
- Secondary Data: `text-lg font-mono tabular-nums`
- Body Text: `text-sm font-sans leading-relaxed`

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16** (e.g., p-4, gap-8, mb-12)

**Grid Structure**:
- Desktop: Sidebar (w-80 to w-96) + Main Content Area (flex-1)
- Mobile: Stack vertically, collapsible sidebar drawer
- Dashboard Layout: `min-h-screen` with fixed sidebar, scrollable content

**Component Spacing**:
- Card padding: `p-6`
- Section gaps: `gap-8`
- Form element spacing: `space-y-4`
- Ticker item gaps: `gap-6`

---

## Component Library

### Bloomberg-Style Sidebar
- Fixed position: `fixed left-0 h-screen w-80`
- Glassmorphism treatment: backdrop-blur with semi-transparent background
- Sections: Logo/Title (h-16), User Input Form, Quick Stats, Action Button
- Form inputs: Borderless with bottom accent line, focused state glows
- Calculate button: Full-width, prominent with neon accent

### 3D Globe Container
- Main content area: `flex-1 relative`
- Globe wrapper: `w-full h-screen` (fills viewport for immersive experience)
- Overlay UI: Absolute positioned legend, zoom controls (top-right), location indicator (top-left)

### Data Cards (for country details on globe interaction)
- Glassmorphism panels: `backdrop-blur-lg` with border accent
- Layout: `p-6 rounded-lg` with internal grid for label-value pairs
- Comparison metrics: Side-by-side columns on desktop

### Live Ticker Bar
- Fixed bottom position: `fixed bottom-0 w-full h-12`
- Auto-scrolling horizontal marquee
- Item structure: Icon → Label → Value → Change % (with directional indicator)
- Separator between items: Vertical divider

### Legend & Controls
- Heatmap legend: Gradient bar with min/max labels, positioned `absolute top-6 right-6`
- Compact card: `p-4 rounded-lg backdrop-blur-md`
- Value range indicators: Color stops with numerical thresholds

### Country Info Panel (popup on click)
- Modal/Drawer hybrid: Slides in from right on desktop, bottom sheet on mobile
- Header: Country flag + name + "Shadow Price Index" score (large, prominent)
- Sections: Cost breakdown table, PPP comparison chart, "Value Lines" explanation
- Close button: Top-right with subtle hover state

---

## Visual Hierarchy & Data Display

**Data Presentation**:
- Primary metrics: Emphasized size + neon accent glow
- Positive changes: Neon green indicator (↑)
- Negative changes: Neon red indicator (↓)
- Neutral/loading: Pulsing animation on skeleton loaders

**Tables & Lists**:
- Zebra striping: Subtle alternating row backgrounds
- Headers: Sticky on scroll, uppercase mono font
- Numerical alignment: Right-aligned, tabular-nums
- Row hover: Subtle glow effect

---

## Glassmorphism Implementation

**Base Treatment**:
- Background: Semi-transparent dark layer (`bg-black/40` to `bg-black/60`)
- Backdrop blur: `backdrop-blur-lg` or `backdrop-blur-xl`
- Border: `border border-white/10`
- Shadow: `shadow-2xl` with neon accent shadow on interactive elements

**Layering**:
- Sidebar: Highest opacity for focus
- Floating cards: Medium opacity
- Overlay elements: Lowest opacity to maintain globe visibility

---

## Animations

**Minimal & Purposeful**:
- Globe rotation: Smooth, continuous slow spin when idle
- Data updates: Subtle pulse on value changes
- Ticker scroll: Smooth CSS animation, infinite loop
- Panel transitions: Slide-in/out (300ms ease-out)
- Loading states: Shimmer effect on skeletons

**Avoid**: Excessive parallax, bouncy animations, distracting hover effects

---

## Responsive Behavior

**Mobile Adaptations**:
- Sidebar: Drawer/hamburger menu
- Globe: Touch-optimized controls, smaller viewport height (60vh)
- Ticker: Single-line scroll, smaller font
- Data cards: Full-width stacked layout
- Touch targets: Minimum 44px for all interactive elements

**Breakpoints**:
- Mobile: Base (< 768px)
- Desktop: md: and above (768px+)

---

## Accessibility

- Maintain WCAG AA contrast ratios (critical for neon on dark)
- All interactive map elements have keyboard navigation
- Screen reader labels for data visualizations
- Focus indicators visible on all interactive elements
- Form inputs with associated labels

---

## Images

**Not Applicable**: This dashboard is data-visualization focused. No hero images needed. All visual interest comes from the 3D globe, glassmorphism effects, and live data displays.