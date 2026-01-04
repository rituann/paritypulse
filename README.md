# ParityPulse: Global Economic Resilience & Labor Parity Engine

**Redefining global purchasing power through the lens of labor-time and policy volatility.**

**Live Application:** [paritypulse.replit.app](https://paritypulse.replit.app/)  
**Concept by:** Ritu Ann Roy

![ParityPulse Dashboard Screenshot](https://github.com/rituann/paritypulse/blob/main/image.png)

---

## Executive Summary
**ParityPulse** is a high-fidelity economic simulation platform designed for public policy analysts and strategic consultants. While standard cost-of-living indices focus on currency exchange, ParityPulse introduces the **Labor-Time Valuation Model**. 

By anchoring global prices against the "Work-Hour" cost of professional and minimum wage sectors, the platform provides a raw look at socioeconomic resilience and the real-world impact of trade policy shocks.

---

## Strategic Features

### 1. Labor-Hour Valuation Logic
The engine moves beyond nominal prices to calculate the **"Time Cost"** of a lifestyle. 
* **Weighted Basket:** Items are categorized (Housing, Staples, Energy) and assigned economic weights via GPT-4o to reflect realistic expenditure.
* **Base Anchor:** Manama, Bahrain (2026 Professional Benchmark).

### 2. Tariff Sensitivity Simulator (Policy Shock)
A dynamic tool that models how import taxes (tariffs) degrade the purchasing power of local labor.
* **Import Dependency:** The model identifies nations with high import reliance and simulates the "Pass-Through" cost of trade barriers.
* **Real-Time Heatmap:** Visualizes the transition from **Value** to **Premium** as policy volatility increases.

### 3. Professional Data Visualization
* **Executive Dashboard:** A minimalist, high-contrast light theme designed for boardroom presentations.
* **Interactive Tooltips:** Real-time data cards showing **Adjusted Cost**, **Work Hours Required**, and **Stability Ratings**.

---

## Methodology

The platform calculates the **Parity Index** using a proprietary ratio:

> $$Index = \frac{(Local Basket Cost / Local Hourly Wage)}{(Home Basket Cost / Home Hourly Wage)}$$

* **Value (Green):** Indicates high labor-time efficiency; your labor is "stronger" locally than in the base city.
* **Premium (Red):** Indicates an economic premium; the local cost of living outpaces local wage growth.
* **Stability:** Measures price resilience against inflation and exchange rate fluctuations.

---

## Tech Stack
* **UI/UX:** React.js, Tailwind CSS (Consulting-Standard Typography).
* **Mapping:** Mapbox GL JS (Custom light-v11 executive style).
* **Intelligence:** OpenAI GPT-4o for semantic weighting and economic summaries.
* **Data:** World Bank & ILO 2026 data benchmarks cached in PostgreSQL.

---
For any queries, reach out to github.com/rituann
