# ParityPulse - Calculation Methodology

> **Last Updated:** January 2026  
> **Concept By:** Ritu Ann Roy

---

## Overview

The ParityPulse engine uses a multi-layered calculation system to determine the "Parity Pulse Index" for each country. This document explains every formula, data source, and algorithmic decision in detail.

---

## Table of Contents

1. [Core Concepts](#1-core-concepts)
2. [Data Sources & Benchmarks](#2-data-sources--benchmarks)
3. [Step-by-Step Calculation Flow](#3-step-by-step-calculation-flow)
4. [Category Weights](#4-category-weights)
5. [Parity Pulse Index Formula](#5-parity-pulse-index-formula)
6. [Work-Hour Exchange Calculation](#6-work-hour-exchange-calculation)
7. [Tariff Sensitivity Adjustment](#7-tariff-sensitivity-adjustment)
8. [Macro-Stability Scoring](#8-macro-stability-scoring)
9. [AI Item Categorization](#9-ai-item-categorization)
10. [Color-Coded Indicators](#10-color-coded-indicators)
11. [Example Walkthrough](#11-example-walkthrough)

---

## 1. Core Concepts

### What is Purchasing Power Parity (PPP)?

PPP measures how much a "basket" of goods costs in different countries when converted to a common currency. A PPP index of **0.5** means goods cost **half** what they do in the reference country.

### The ParityPulse Approach

Traditional PPP uses fixed baskets (e.g., Big Mac Index). ParityPulse lets users define their **own** lifestyle basket, then:

1. **Categorizes** each item into economic buckets using GPT-4o
2. **Applies fixed weights** based on standard household expenditure patterns
3. **Adjusts for local wages** to show labor-equivalent affordability
4. **Simulates tariffs** to model trade policy impacts

---

## 2. Data Sources & Benchmarks

### Country Economic Data

Each country in the system has the following baseline data:

| Field | Description | Source Inspiration |
|-------|-------------|-------------------|
| `ppp` | Purchasing Power Parity index (USD = 1.0) | World Bank ICP |
| `professionalWage` | Average annual salary for skilled workers (USD) | ILO, local statistics |
| `minimumWage` | Annual minimum wage (USD) | ILO, local labor laws |

> **Note:** `macroStability` is NOT stored in country data. It is calculated dynamically based on the resulting Parity Index and PPP value (see Section 8).

### Reference Location

- **Default Base:** Manama, Bahrain (26.2285, 50.5860)
- **Bahrain Benchmarks:**
  - PPP Index: 0.65
  - Professional Wage: $75,000/year
  - Minimum Wage: $9,000/year

### Sample Country Data

```typescript
{ code: "USA", ppp: 1.0, professionalWage: 120000, minimumWage: 31200 }
{ code: "IND", ppp: 0.24, professionalWage: 35000, minimumWage: 2400 }
{ code: "CHE", ppp: 1.24, professionalWage: 150000, minimumWage: 52000 }
{ code: "BRA", ppp: 0.37, professionalWage: 40000, minimumWage: 4800 }
{ code: "BHR", ppp: 0.65, professionalWage: 75000, minimumWage: 9000 }
```

---

## 3. Step-by-Step Calculation Flow

### Input

User provides:
- **Basket Items:** 1-5 lifestyle items (e.g., "monthly rent", "gym membership")
- **Home Location:** Base country for comparison (default: Bahrain)
- **Wage Type:** "professional" or "minimum" wage comparison
- **Tariff Sensitivity:** 0-50% adjustment for import costs

### Process

```
┌─────────────────────────────────────────────────────────────────┐
│  USER INPUT: Items + Location + Wage Type + Tariff %            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: AI CATEGORIZATION                                      │
│  GPT-4o assigns each item to an economic category               │
│  → housing, transport, staples, utilities, healthcare, luxury   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: PRICE LOOKUP                                           │
│  Match items to static COMMODITY_PRICES table (hardcoded USD)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: CATEGORY WEIGHT APPLICATION                            │
│  Items grouped by category, total multiplied by category weight │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: PPP ADJUSTMENT                                         │
│  Weighted total × country PPP index = local cost                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: TARIFF SENSITIVITY                                     │
│  Apply import cost multiplier (0-50% increase)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: PARITY INDEX CALCULATION                               │
│  Compare (local cost / local wage) vs (home cost / home wage)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: WORK HOURS CALCULATION                                 │
│  Local cost ÷ (local annual wage ÷ 2080 hours) = work hours     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  OUTPUT: Per-country results with index, cost, hours, stability │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Category Weights

### Fixed Economic Category Weights

Based on standard household expenditure patterns from economic research:

| Category | Weight | Typical Items |
|----------|--------|---------------|
| **Housing** | 40% | Rent, mortgage, property taxes |
| **Transport** | 15% | Car payment, fuel, public transit |
| **Staples** | 10% | Groceries, household essentials |
| **Utilities** | 10% | Electricity, water, internet, phone |
| **Healthcare** | 10% | Insurance, medications, doctor visits |
| **Luxury** | 5% | Entertainment, dining out, vacations |
| **Other** | 10% | Miscellaneous, uncategorized items |

### Why Fixed Weights?

Fixed weights ensure:
1. **Consistency:** Same methodology across all calculations
2. **Economic validity:** Reflects actual spending patterns
3. **Comparability:** Results are meaningful across countries

### Weight Application Formula

```
Weighted Basket Cost = Σ (Category Total × Category Weight)

Where:
- Category Total = Sum of all item prices in that category
- Category Weight = Fixed weight from table above
```

### Example

```
User enters: "rent", "groceries", "gym membership"

AI categorizes:
- rent → housing ($1500)
- groceries → staples ($400)
- gym membership → luxury ($50)

Weighted calculation:
- Housing contribution: $1500 × 0.40 = $600
- Staples contribution: $400 × 0.10 = $40
- Luxury contribution: $50 × 0.05 = $2.50

Weighted Basket Total: $642.50
```

---

## 5. Parity Pulse Index Formula

### Core Formula

```
Parity Index = (Target Affordability Ratio) / (Home Affordability Ratio)

Where:
- Affordability Ratio = Weighted Basket Cost / Annual Wage
```

### Expanded Formula

```
                    (Adjusted Cost in Target Country / Target Wage)
Parity Index = ─────────────────────────────────────────────────────
                    (Adjusted Cost in Home Country / Home Wage)
```

### Interpretation

| Index Value | Meaning | Color |
|-------------|---------|-------|
| **< 0.9** | **Value** - Cheaper relative to wages | Green |
| **0.9 - 1.1** | **Parity** - Similar affordability | Yellow |
| **> 1.1** | **Premium** - More expensive relative to wages | Red |

### Example Calculation (0% Tariff)

```
Home (Bahrain) - Baseline:
- Weighted Basket: $642.50
- PPP: 0.65
- Home Wage: $75,000/year
- Hourly Wage: $75,000 / 2080 = $36.06/hour
- Home Affordability: $642.50 / $36.06 = 17.82 hours
  (No tariff applied to baseline)

Target (India) - With 0% Tariff:
- PPP: 0.24
- PPP Ratio: 0.24 / 0.65 = 0.369
- Adjusted Cost: $642.50 × 0.369 = $237.08
- Professional Wage: $35,000/year
- Hourly Wage: $35,000 / 2080 = $16.83/hour
- Target Affordability: $237.08 / $16.83 = 14.09 hours

Parity Index = 14.09 / 17.82 = 0.79x (Value - Green)
```

### Important Notes

- The formula compares **work hours needed**, not absolute costs
- A lower Parity Index means the target country is a better value
- The Parity Index is clamped between 0.3x and 3.0x for display purposes
- Home Affordability (baseline) never includes tariff - only target countries get tariff adjustments

---

## 6. Work-Hour Exchange Calculation

### Formula

```
Work Hours = Adjusted Basket Cost / Hourly Wage

Where:
- Hourly Wage = Annual Wage / 2080 hours (40 hrs/week × 52 weeks)
```

### Example

```
India:
- Adjusted Basket Cost: $179.90
- Professional Wage: $25,000/year
- Hourly Wage: $25,000 / 2080 = $12.02/hour
- Work Hours: $179.90 / $12.02 = 14.97 hours

Bahrain:
- Adjusted Basket Cost: $417.63
- Professional Wage: $75,000/year
- Hourly Wage: $75,000 / 2080 = $36.06/hour
- Work Hours: $417.63 / $36.06 = 11.58 hours
```

### Interpretation

Even though India has lower absolute costs, a worker needs **more hours** (14.97 vs 11.58) to afford the same basket due to lower wages.

---

## 7. Tariff Sensitivity Adjustment

### Purpose

Simulates the impact of import tariffs and trade policies on consumer goods prices. The adjustment accounts for how import-dependent different economies are.

### Import Dependency Factor

Countries with lower PPP indices are assumed to be more import-dependent:

```javascript
if (country.ppp < 0.5) {
  importDependency = 0.7;  // 70% of goods imported
} else if (country.ppp < 0.8) {
  importDependency = 0.4;  // 40% of goods imported
} else {
  importDependency = 0.2;  // 20% of goods imported
}
```

### Formula

```
Tariff Impact = (Tariff Sensitivity / 100) × Import Dependency
Tariff Multiplier = 1 + Tariff Impact
Adjusted Cost = Base Cost × PPP Ratio × Tariff Multiplier
```

### Example

```
India (PPP 0.24, high import dependency 70%):
- Tariff Sensitivity: 25%
- Tariff Impact: (25 / 100) × 0.7 = 0.175
- Tariff Multiplier: 1 + 0.175 = 1.175

Switzerland (PPP 1.24, low import dependency 20%):
- Tariff Sensitivity: 25%
- Tariff Impact: (25 / 100) × 0.2 = 0.05
- Tariff Multiplier: 1 + 0.05 = 1.05
```

### Use Cases

- **0%:** Free trade scenario, minimal import restrictions
- **10-20%:** Typical developing country tariff levels
- **30-50%:** Protectionist policies, high import duties

### Key Insight

Tariffs have a **larger impact on lower-PPP countries** because they import more goods. This reflects real-world trade dynamics.

---

## 8. Macro-Stability Scoring

### Categories

| Score | Meaning | Indicators |
|-------|---------|------------|
| **Stable** | Low economic risk | Low inflation, stable currency, strong institutions |
| **Moderate** | Medium risk | Some volatility, moderate inflation |
| **Volatile** | High risk | High inflation, currency fluctuations, political instability |

### Dynamic Assignment Logic

Stability is calculated dynamically based on the country's PPP and resulting Parity Index:

```javascript
if (parityIndex >= 0.8 && parityIndex <= 1.2 && country.ppp >= 0.5) {
  macroStability = "Stable";
} else if (parityIndex > 2.0 || country.ppp < 0.3) {
  macroStability = "Volatile";
} else {
  macroStability = "Moderate";
}
```

### Criteria Breakdown

| Condition | Result |
|-----------|--------|
| Parity Index 0.8-1.2 AND PPP >= 0.5 | Stable |
| Parity Index > 2.0 OR PPP < 0.3 | Volatile |
| All other cases | Moderate |

### Key Insight

Stability scoring is **relative to the user's basket and location**, not a fixed country attribute. The same country may show different stability depending on what items are being compared.

---

## 9. AI Item Categorization & Price Lookup

### How Items Are Mapped

When users enter items, the system uses a two-step process:

**Step 1: GPT-4o Mapping (AI)**
The AI maps user input to standardized commodity symbols and categories:

```
You are a commodities analyst. Map user inputs to:
1. A commodity symbol from: gasoline, eggs, rent, netflix, milk, 
   bread, coffee, electricity, internet, beer, rice, chicken, 
   gym, transit, dining, spotify, phone, insurance
2. An economic category: housing, transport, staples, utilities, 
   healthcare, luxury, other

Return: { symbol: "rent", category: "housing", basePrice: 1500 }
```

**Step 2: Price Lookup (Hardcoded)**
Prices come from a static `COMMODITY_PRICES` table, NOT AI estimation:

```typescript
const COMMODITY_PRICES = {
  gasoline: { category: "transport", price: 3.85 },
  eggs: { category: "staples", price: 4.25 },
  rent: { category: "housing", price: 1500 },
  netflix: { category: "luxury", price: 15.49 },
  gym: { category: "luxury", price: 45 },
  insurance: { category: "healthcare", price: 450 },
  // ... etc
};
```

### Fallback Behavior

If AI mapping fails:
- Items are matched by keyword to `COMMODITY_PRICES` keys
- Unmatched items default to "gasoline" symbol (transport category)
- Category weight comes from `CATEGORY_WEIGHTS` table

### Key Point

The AI only determines **which category** an item belongs to. Actual prices are hardcoded benchmarks, not real-time market data.

---

## 10. Color-Coded Indicators

### Map Markers & Status Dots

| Condition | Color | Hex Code | Meaning |
|-----------|-------|----------|---------|
| `index < 0.9` | Green | `#16A34A` | Value - Good affordability |
| `0.9 ≤ index ≤ 1.1` | Yellow/Amber | `#CA8A04` | Parity - Similar to home |
| `index > 1.1` | Red | `#DC2626` | Premium - More expensive |

### Implementation

```typescript
function getHeatColor(index: number): string {
  if (index < 0.9) return "#16A34A";   // Green
  if (index <= 1.1) return "#CA8A04";  // Yellow
  return "#DC2626";                     // Red
}
```

### Stability Indicators

| Status | Display |
|--------|---------|
| Stable | Green text: "Stable" |
| Moderate | Yellow text: "Moderate" |
| Volatile | Red text: "Volatile" |

---

## 11. Example Walkthrough

### Scenario

**User Input:**
- Location: Manama, Bahrain
- Items: "monthly rent", "groceries", "gym membership"
- Wage Type: Professional
- Tariff Sensitivity: 10%

### Step 1: AI Categorization

```json
[
  { "item": "monthly rent", "category": "housing", "estimatedPrice": 1500 },
  { "item": "groceries", "category": "staples", "estimatedPrice": 400 },
  { "item": "gym membership", "category": "luxury", "estimatedPrice": 50 }
]
```

### Step 2: Calculate Weighted Basket

```
Housing: $1500 × 0.40 = $600.00
Staples: $400 × 0.10 = $40.00
Luxury: $50 × 0.05 = $2.50

Weighted Basket Total: $642.50
```

### Step 3: Calculate for Each Country

**Home Baseline (Bahrain) - Calculated First:**
```
Weighted Basket Cost: $642.50
Home Wage: $75,000/year
Home Hourly Wage: $75,000 / 2080 = $36.06/hour
Home Affordability: $642.50 / $36.06 = 17.82 hours

IMPORTANT: Home Affordability does NOT include tariff adjustment.
It serves as the baseline for all comparisons.
```

**Switzerland (CHE):**
```
PPP: 1.24
PPP Ratio: 1.24 / 0.65 = 1.908
Import Dependency: 0.2 (PPP >= 0.8)
Tariff Impact: (10 / 100) × 0.2 = 0.02
Tariff Multiplier: 1.02
Adjusted Cost: $642.50 × 1.908 × 1.02 = $1251.24
Professional Wage: $150,000
Hourly Wage: $150,000 / 2080 = $72.12

Target Affordability: $1251.24 / $72.12 = 17.35 hours

Parity Index = 17.35 / 17.82 = 0.97x (Parity - Yellow)
```

**India (IND):**
```
PPP: 0.24
PPP Ratio: 0.24 / 0.65 = 0.369
Import Dependency: 0.7 (PPP < 0.5)
Tariff Impact: (10 / 100) × 0.7 = 0.07
Tariff Multiplier: 1.07
Adjusted Cost: $642.50 × 0.369 × 1.07 = $253.66
Professional Wage: $35,000
Hourly Wage: $35,000 / 2080 = $16.83

Target Affordability: $253.66 / $16.83 = 15.07 hours

Parity Index = 15.07 / 17.82 = 0.85x (Value - Green)
```

**Saudi Arabia (SAU):**
```
PPP: 0.54
PPP Ratio: 0.54 / 0.65 = 0.831
Import Dependency: 0.4 (0.5 <= PPP < 0.8)
Tariff Impact: (10 / 100) × 0.4 = 0.04
Tariff Multiplier: 1.04
Adjusted Cost: $642.50 × 0.831 × 1.04 = $555.30
Professional Wage: $80,000
Hourly Wage: $80,000 / 2080 = $38.46

Target Affordability: $555.30 / $38.46 = 14.44 hours

Parity Index = 14.44 / 17.82 = 0.81x (Value - Green)
```

**Bahrain (BHR) - As Target Country:**
```
PPP: 0.65
PPP Ratio: 0.65 / 0.65 = 1.0
Import Dependency: 0.4 (0.5 <= PPP < 0.8)
Tariff Impact: (10 / 100) × 0.4 = 0.04
Tariff Multiplier: 1.04
Adjusted Cost: $642.50 × 1.0 × 1.04 = $668.20
Professional Wage: $75,000
Hourly Wage: $75,000 / 2080 = $36.06

Target Affordability: $668.20 / $36.06 = 18.53 hours

Parity Index = 18.53 / 17.82 = 1.04x (Parity - Yellow)
```

### Results Summary

| Country | Parity Index | Status | Work Hours | Stability |
|---------|--------------|--------|------------|-----------|
| Saudi Arabia | 0.81x | Value | 14.44 hrs | Stable |
| India | 0.85x | Value | 15.07 hrs | Volatile |
| Switzerland | 0.97x | Parity | 17.35 hrs | Stable |
| Bahrain (Home) | 1.04x | Parity | 18.53 hrs | Stable |

> **Key Insight:** When tariff sensitivity > 0, even the home country shows a Parity Index slightly above 1.0 because tariffs are applied to all target countries in the comparison, but the baseline (homeAffordability) is calculated without tariffs. At 0% tariff, the home country would show exactly 1.00x.

---

## Key Insights

1. **Low PPP doesn't always mean value:** India has low costs but also low wages, resulting in more work hours needed.

2. **High-wage countries can be value:** Saudi Arabia's combination of moderate PPP and high wages makes it "Value" despite higher absolute costs.

3. **Tariffs amplify differences:** A 10% tariff increases the spread between Value and Premium countries.

4. **Category weights matter:** Housing at 40% dominates the calculation, so rent-heavy baskets show larger regional differences.

---

## Future Enhancements

1. **Real-time PPP data:** Integration with World Bank API
2. **Dynamic wage data:** Country-specific salary databases
3. **Inflation adjustment:** Year-over-year PPP changes
4. **Industry-specific wages:** Tech, healthcare, finance benchmarks
5. **Regional granularity:** City-level PPP (NYC vs rural Iowa)
