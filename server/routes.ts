import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { z } from "zod";
import { storage } from "./storage";
import type { ShadowPriceResult, TickerItem, MappedCommodity } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const COUNTRY_DATA = [
  { code: "USA", name: "United States", lat: 37.0902, lng: -95.7129, ppp: 1.0, professionalWage: 120000, minimumWage: 31200 },
  { code: "GBR", name: "United Kingdom", lat: 55.3781, lng: -3.436, ppp: 0.69, professionalWage: 85000, minimumWage: 24000 },
  { code: "DEU", name: "Germany", lat: 51.1657, lng: 10.4515, ppp: 0.74, professionalWage: 95000, minimumWage: 26000 },
  { code: "FRA", name: "France", lat: 46.2276, lng: 2.2137, ppp: 0.73, professionalWage: 80000, minimumWage: 22000 },
  { code: "JPN", name: "Japan", lat: 36.2048, lng: 138.2529, ppp: 0.96, professionalWage: 90000, minimumWage: 20000 },
  { code: "CHN", name: "China", lat: 35.8617, lng: 104.1954, ppp: 0.42, professionalWage: 45000, minimumWage: 5500 },
  { code: "IND", name: "India", lat: 20.5937, lng: 78.9629, ppp: 0.24, professionalWage: 35000, minimumWage: 2400 },
  { code: "BRA", name: "Brazil", lat: -14.235, lng: -51.9253, ppp: 0.37, professionalWage: 40000, minimumWage: 4800 },
  { code: "CAN", name: "Canada", lat: 56.1304, lng: -106.3468, ppp: 0.81, professionalWage: 110000, minimumWage: 32000 },
  { code: "AUS", name: "Australia", lat: -25.2744, lng: 133.7751, ppp: 0.96, professionalWage: 115000, minimumWage: 42000 },
  { code: "MEX", name: "Mexico", lat: 23.6345, lng: -102.5528, ppp: 0.45, professionalWage: 45000, minimumWage: 4200 },
  { code: "KOR", name: "South Korea", lat: 35.9078, lng: 127.7669, ppp: 0.76, professionalWage: 85000, minimumWage: 22000 },
  { code: "ESP", name: "Spain", lat: 40.4637, lng: -3.7492, ppp: 0.62, professionalWage: 60000, minimumWage: 16000 },
  { code: "ITA", name: "Italy", lat: 41.8719, lng: 12.5674, ppp: 0.66, professionalWage: 65000, minimumWage: 14000 },
  { code: "RUS", name: "Russia", lat: 61.524, lng: 105.3188, ppp: 0.28, professionalWage: 35000, minimumWage: 3600 },
  { code: "NLD", name: "Netherlands", lat: 52.1326, lng: 5.2913, ppp: 0.77, professionalWage: 100000, minimumWage: 28000 },
  { code: "CHE", name: "Switzerland", lat: 46.8182, lng: 8.2275, ppp: 1.24, professionalWage: 150000, minimumWage: 52000 },
  { code: "SWE", name: "Sweden", lat: 60.1282, lng: 18.6435, ppp: 0.89, professionalWage: 95000, minimumWage: 28000 },
  { code: "NOR", name: "Norway", lat: 60.472, lng: 8.4689, ppp: 1.18, professionalWage: 120000, minimumWage: 42000 },
  { code: "DNK", name: "Denmark", lat: 56.2639, lng: 9.5018, ppp: 0.92, professionalWage: 105000, minimumWage: 38000 },
  { code: "POL", name: "Poland", lat: 51.9194, lng: 19.1451, ppp: 0.45, professionalWage: 50000, minimumWage: 10000 },
  { code: "ARG", name: "Argentina", lat: -38.4161, lng: -63.6167, ppp: 0.28, professionalWage: 30000, minimumWage: 3600 },
  { code: "TUR", name: "Turkey", lat: 38.9637, lng: 35.2433, ppp: 0.35, professionalWage: 35000, minimumWage: 6000 },
  { code: "THA", name: "Thailand", lat: 15.87, lng: 100.9925, ppp: 0.36, professionalWage: 40000, minimumWage: 5000 },
  { code: "VNM", name: "Vietnam", lat: 14.0583, lng: 108.2772, ppp: 0.31, professionalWage: 30000, minimumWage: 3600 },
  { code: "IDN", name: "Indonesia", lat: -0.7893, lng: 113.9213, ppp: 0.33, professionalWage: 35000, minimumWage: 4200 },
  { code: "MYS", name: "Malaysia", lat: 4.2105, lng: 101.9758, ppp: 0.46, professionalWage: 50000, minimumWage: 7200 },
  { code: "SGP", name: "Singapore", lat: 1.3521, lng: 103.8198, ppp: 0.85, professionalWage: 130000, minimumWage: 18000 },
  { code: "PHL", name: "Philippines", lat: 12.8797, lng: 121.774, ppp: 0.36, professionalWage: 30000, minimumWage: 3600 },
  { code: "ZAF", name: "South Africa", lat: -30.5595, lng: 22.9375, ppp: 0.35, professionalWage: 50000, minimumWage: 5400 },
  { code: "EGY", name: "Egypt", lat: 26.8206, lng: 30.8025, ppp: 0.22, professionalWage: 25000, minimumWage: 2400 },
  { code: "NGA", name: "Nigeria", lat: 9.082, lng: 8.6753, ppp: 0.28, professionalWage: 30000, minimumWage: 1800 },
  { code: "ISR", name: "Israel", lat: 31.0461, lng: 34.8516, ppp: 0.82, professionalWage: 110000, minimumWage: 22000 },
  { code: "UAE", name: "UAE", lat: 23.4241, lng: 53.8478, ppp: 0.72, professionalWage: 100000, minimumWage: 9600 },
  { code: "BHR", name: "Bahrain", lat: 26.2285, lng: 50.5860, ppp: 0.65, professionalWage: 75000, minimumWage: 9000 },
  { code: "SAU", name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, ppp: 0.54, professionalWage: 80000, minimumWage: 12000 },
  { code: "NZL", name: "New Zealand", lat: -40.9006, lng: 174.886, ppp: 0.91, professionalWage: 95000, minimumWage: 36000 },
  { code: "IRL", name: "Ireland", lat: 53.1424, lng: -7.6921, ppp: 0.84, professionalWage: 100000, minimumWage: 26000 },
  { code: "PRT", name: "Portugal", lat: 39.3999, lng: -8.2245, ppp: 0.54, professionalWage: 50000, minimumWage: 11000 },
  { code: "GRC", name: "Greece", lat: 39.0742, lng: 21.8243, ppp: 0.52, professionalWage: 45000, minimumWage: 10000 },
  { code: "CZE", name: "Czech Republic", lat: 49.8175, lng: 15.473, ppp: 0.48, professionalWage: 55000, minimumWage: 12000 },
  { code: "HUN", name: "Hungary", lat: 47.1625, lng: 19.5033, ppp: 0.42, professionalWage: 45000, minimumWage: 9000 },
  { code: "AUT", name: "Austria", lat: 47.5162, lng: 14.5501, ppp: 0.78, professionalWage: 95000, minimumWage: 24000 },
  { code: "BEL", name: "Belgium", lat: 50.5039, lng: 4.4699, ppp: 0.76, professionalWage: 90000, minimumWage: 24000 },
  { code: "FIN", name: "Finland", lat: 61.9241, lng: 25.7482, ppp: 0.88, professionalWage: 90000, minimumWage: 26000 },
  { code: "CHL", name: "Chile", lat: -35.6751, lng: -71.543, ppp: 0.48, professionalWage: 50000, minimumWage: 7200 },
  { code: "COL", name: "Colombia", lat: 4.5709, lng: -74.2973, ppp: 0.35, professionalWage: 35000, minimumWage: 3600 },
  { code: "PER", name: "Peru", lat: -9.19, lng: -75.0152, ppp: 0.38, professionalWage: 40000, minimumWage: 4200 },
  { code: "PAK", name: "Pakistan", lat: 30.3753, lng: 69.3451, ppp: 0.24, professionalWage: 25000, minimumWage: 1800 },
  { code: "BGD", name: "Bangladesh", lat: 23.685, lng: 90.3563, ppp: 0.28, professionalWage: 20000, minimumWage: 1200 },
  { code: "UKR", name: "Ukraine", lat: 48.3794, lng: 31.1656, ppp: 0.28, professionalWage: 35000, minimumWage: 4800 },
];

type WageType = "professional" | "minimum";

const COMMODITY_PRICES: Record<string, { name: string; category: string; price: number }> = {
  gasoline: { name: "Gasoline (gallon)", category: "transport", price: 3.85 },
  eggs: { name: "Eggs (dozen)", category: "staples", price: 4.25 },
  rent: { name: "Rent (1br apt)", category: "housing", price: 1500 },
  netflix: { name: "Netflix Sub", category: "luxury", price: 15.49 },
  milk: { name: "Milk (gallon)", category: "staples", price: 4.15 },
  bread: { name: "Bread (loaf)", category: "staples", price: 2.85 },
  coffee: { name: "Coffee (lb)", category: "staples", price: 8.50 },
  electricity: { name: "Electricity (kWh)", category: "utilities", price: 0.16 },
  internet: { name: "Internet (monthly)", category: "utilities", price: 65 },
  beer: { name: "Beer (6-pack)", category: "luxury", price: 9.50 },
  rice: { name: "Rice (5lb)", category: "staples", price: 5.25 },
  chicken: { name: "Chicken (lb)", category: "staples", price: 4.75 },
  gym: { name: "Gym Membership", category: "luxury", price: 45 },
  transit: { name: "Monthly Transit", category: "transport", price: 100 },
  dining: { name: "Dining Out (meal)", category: "luxury", price: 18 },
  spotify: { name: "Spotify Sub", category: "luxury", price: 10.99 },
  phone: { name: "Phone Plan", category: "utilities", price: 75 },
  insurance: { name: "Health Insurance", category: "healthcare", price: 450 },
};

const CATEGORY_WEIGHTS: Record<string, number> = {
  housing: 0.40,
  transport: 0.15,
  staples: 0.10,
  utilities: 0.10,
  healthcare: 0.10,
  luxury: 0.05,
  other: 0.10,
};

async function mapItemsToCommodities(items: string[]): Promise<MappedCommodity[]> {
  const categoryList = Object.keys(CATEGORY_WEIGHTS).join(", ");
  const prompt = `You are a commodities and consumer price analyst. Map the following user inputs to standardized commodity categories and economic buckets.

User inputs: ${JSON.stringify(items)}

Available commodity symbols: ${Object.keys(COMMODITY_PRICES).join(", ")}

Economic categories (use these exact names): ${categoryList}

For each user input:
1. Return the best matching commodity symbol from the available list
2. Categorize into one of these economic buckets: housing, transport, staples, utilities, healthcare, luxury, other
3. Estimate the base USD price for this item

Respond with JSON in format:
{"items": [{"userInput": "original input", "symbol": "commodity_symbol", "category": "housing|transport|staples|utilities|healthcare|luxury|other", "basePrice": estimated_usd_price}]}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    
    const mappedItems = parsed.items || parsed.mappings || parsed;
    
    if (Array.isArray(mappedItems)) {
      return mappedItems.map((item: any) => {
        const category = item.category?.toLowerCase() || "other";
        const categoryWeight = CATEGORY_WEIGHTS[category] || CATEGORY_WEIGHTS.other;
        return {
          userInput: item.userInput || item.user_input || "",
          symbol: item.symbol || "gasoline",
          category: category,
          basePrice: item.basePrice || item.base_price || COMMODITY_PRICES[item.symbol]?.price || 10,
          weight: categoryWeight,
        };
      });
    }
    
    return items.map((item) => {
      const key = item.toLowerCase().replace(/\s+/g, "");
      const matchedKey = Object.keys(COMMODITY_PRICES).find((k) => 
        k.includes(key) || key.includes(k)
      );
      const commodity = matchedKey ? COMMODITY_PRICES[matchedKey] : COMMODITY_PRICES.gasoline;
      const categoryWeight = CATEGORY_WEIGHTS[commodity.category] || CATEGORY_WEIGHTS.other;
      return {
        userInput: item,
        symbol: matchedKey || "gasoline",
        category: commodity.category,
        basePrice: commodity.price,
        weight: categoryWeight,
      };
    });
  } catch (error) {
    console.error("AI mapping error:", error);
    return items.map((item) => {
      const key = item.toLowerCase().replace(/\s+/g, "");
      const matchedKey = Object.keys(COMMODITY_PRICES).find((k) => 
        k.includes(key) || key.includes(k)
      );
      const commodity = matchedKey ? COMMODITY_PRICES[matchedKey] : COMMODITY_PRICES.gasoline;
      const categoryWeight = CATEGORY_WEIGHTS[commodity.category] || CATEGORY_WEIGHTS.other;
      return {
        userInput: item,
        symbol: matchedKey || "gasoline",
        category: commodity.category,
        basePrice: commodity.price,
        weight: categoryWeight,
      };
    });
  }
}

function calculateShadowPriceIndex(
  mappedCommodities: MappedCommodity[],
  userLocation: { lat: number; lng: number } | null,
  tariffSensitivity: number = 0,
  wageType: WageType = "professional"
): ShadowPriceResult[] {
  const userCountry = userLocation
    ? COUNTRY_DATA.reduce((closest, country) => {
        const dist = Math.hypot(
          country.lat - userLocation.lat,
          country.lng - userLocation.lng
        );
        const closestDist = Math.hypot(
          closest.lat - userLocation.lat,
          closest.lng - userLocation.lng
        );
        return dist < closestDist ? country : closest;
      }, COUNTRY_DATA[0])
    : COUNTRY_DATA[0];

  const categoryGroups: Record<string, MappedCommodity[]> = {};
  for (const c of mappedCommodities) {
    const cat = c.category || "other";
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(c);
  }
  
  let userBasketCost = 0;
  for (const [category, items] of Object.entries(categoryGroups)) {
    const categoryWeight = CATEGORY_WEIGHTS[category] || CATEGORY_WEIGHTS.other;
    const categoryTotalPrice = items.reduce((sum, c) => sum + c.basePrice, 0);
    userBasketCost += categoryTotalPrice * categoryWeight;
  }
  
  const homeWage = wageType === "professional" ? userCountry.professionalWage : userCountry.minimumWage;
  const homeHourlyWage = homeWage / 2080;
  const homeAffordability = userBasketCost / homeHourlyWage;

  const results: ShadowPriceResult[] = COUNTRY_DATA.map((country) => {
    const pppRatio = country.ppp / userCountry.ppp;
    
    const importDependency = country.ppp < 0.5 ? 0.7 : country.ppp < 0.8 ? 0.4 : 0.2;
    const tariffImpact = (tariffSensitivity / 100) * importDependency;
    const tariffMultiplier = 1 + tariffImpact;
    
    const adjustedCost = userBasketCost * pppRatio * tariffMultiplier;
    
    const targetWage = wageType === "professional" ? country.professionalWage : country.minimumWage;
    const targetHourlyWage = targetWage / 2080;
    const targetAffordability = adjustedCost / targetHourlyWage;
    
    const parityIndex = targetAffordability / homeAffordability;
    
    const workHours = Math.min(targetAffordability, 999);
    
    let macroStability: "Stable" | "Moderate" | "Volatile";
    if (parityIndex >= 0.8 && parityIndex <= 1.2 && country.ppp >= 0.5) {
      macroStability = "Stable";
    } else if (parityIndex > 2.0 || country.ppp < 0.3) {
      macroStability = "Volatile";
    } else {
      macroStability = "Moderate";
    }

    return {
      countryCode: country.code,
      countryName: country.name,
      shadowPriceIndex: Math.max(0.3, Math.min(3.0, parityIndex)),
      basketCost: userBasketCost,
      adjustedCost: adjustedCost,
      latitude: country.lat,
      longitude: country.lng,
      isValueDeal: parityIndex < 0.8,
      workHours: Math.round(workHours * 10) / 10,
      annualWage: targetWage,
      macroStability,
    };
  });

  return results.sort((a, b) => a.shadowPriceIndex - b.shadowPriceIndex);
}

function generateTickerData(mappedCommodities: MappedCommodity[]): TickerItem[] {
  return mappedCommodities.map((commodity) => {
    const change = (Math.random() - 0.5) * 2;
    const changePercent = (change / commodity.basePrice) * 100;
    return {
      symbol: commodity.symbol.toUpperCase().slice(0, 4),
      name: commodity.userInput,
      price: commodity.basePrice + change,
      change: change,
      changePercent: changePercent,
    };
  });
}

const calculateSchema = z.object({
  items: z.array(z.string().min(1)).min(1).max(5),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .nullable(),
  tariffSensitivity: z.number().min(0).max(50).default(0),
  wageType: z.enum(["professional", "minimum"]).default("professional"),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/calculate-shadow-price", async (req, res) => {
    try {
      const parsed = calculateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { items, location, tariffSensitivity, wageType } = parsed.data;

      const mappedCommodities = await mapItemsToCommodities(items);
      const results = calculateShadowPriceIndex(mappedCommodities, location, tariffSensitivity || 0, wageType);
      const ticker = generateTickerData(mappedCommodities);

      res.json({ results, ticker, mappedCommodities });
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(500).json({ error: "Failed to calculate parity pulse index" });
    }
  });

  app.get("/api/ticker", (req, res) => {
    const defaultItems: TickerItem[] = [
      { symbol: "WTI", name: "Crude Oil", price: 78.45, change: 1.23, changePercent: 1.59 },
      { symbol: "XAU", name: "Gold", price: 2045.80, change: -12.50, changePercent: -0.61 },
      { symbol: "EUR", name: "EUR/USD", price: 1.0856, change: 0.0023, changePercent: 0.21 },
      { symbol: "BTC", name: "Bitcoin", price: 67234.00, change: 1234.00, changePercent: 1.87 },
      { symbol: "SPX", name: "S&P 500", price: 5234.56, change: 45.23, changePercent: 0.87 },
      { symbol: "VIX", name: "Volatility", price: 13.25, change: -0.45, changePercent: -3.28 },
      { symbol: "NGS", name: "Natural Gas", price: 2.156, change: 0.045, changePercent: 2.13 },
      { symbol: "CRN", name: "Corn", price: 456.75, change: -3.25, changePercent: -0.71 },
    ];
    res.json(defaultItems);
  });

  app.get("/api/countries", (req, res) => {
    res.json(
      COUNTRY_DATA.map((c) => ({
        code: c.code,
        name: c.name,
        latitude: c.lat,
        longitude: c.lng,
        pppFactor: c.ppp,
      }))
    );
  });

  app.post("/api/consultant-brief", async (req, res) => {
    try {
      const { countryName, shadowPriceIndex, basketCost, adjustedCost, workHours, macroStability, annualWage } = req.body;
      
      const prompt = `You are an elite McKinsey consultant providing a brief executive analysis. 
Given the following data for ${countryName}:
- Parity Pulse Index: ${shadowPriceIndex}x (1.0 = parity with user's location)
- Basket Cost (PPP adjusted): $${adjustedCost?.toFixed(2)}
- Work Hours to Afford Basket: ${workHours} hours
- Macro-Stability Assessment: ${macroStability}
- Average Annual Wage: $${annualWage?.toLocaleString()}

Provide exactly 3 bullet points in this JSON format:
{
  "economicOpportunity": "One concise sentence about cost arbitrage or value proposition",
  "laborRisks": "One concise sentence about workforce or operational considerations",
  "policyImplications": "One concise sentence about regulatory or trade policy factors"
}

Be specific, data-driven, and actionable. Avoid generic statements.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: 300,
      });

      const content = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      
      res.json({
        economicOpportunity: parsed.economicOpportunity || "Analysis unavailable",
        laborRisks: parsed.laborRisks || "Analysis unavailable",
        policyImplications: parsed.policyImplications || "Analysis unavailable",
      });
    } catch (error) {
      console.error("Consultant brief error:", error);
      res.status(500).json({ 
        error: "Failed to generate brief",
        economicOpportunity: "Economic analysis temporarily unavailable",
        laborRisks: "Labor risk assessment pending",
        policyImplications: "Policy analysis in progress"
      });
    }
  });

  return httpServer;
}
