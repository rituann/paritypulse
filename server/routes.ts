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
  { code: "USA", name: "United States", lat: 37.0902, lng: -95.7129, ppp: 1.0, wage: 65000 },
  { code: "GBR", name: "United Kingdom", lat: 55.3781, lng: -3.436, ppp: 0.69, wage: 42000 },
  { code: "DEU", name: "Germany", lat: 51.1657, lng: 10.4515, ppp: 0.74, wage: 53000 },
  { code: "FRA", name: "France", lat: 46.2276, lng: 2.2137, ppp: 0.73, wage: 45000 },
  { code: "JPN", name: "Japan", lat: 36.2048, lng: 138.2529, ppp: 0.96, wage: 41000 },
  { code: "CHN", name: "China", lat: 35.8617, lng: 104.1954, ppp: 0.42, wage: 15000 },
  { code: "IND", name: "India", lat: 20.5937, lng: 78.9629, ppp: 0.24, wage: 6500 },
  { code: "BRA", name: "Brazil", lat: -14.235, lng: -51.9253, ppp: 0.37, wage: 12000 },
  { code: "CAN", name: "Canada", lat: 56.1304, lng: -106.3468, ppp: 0.81, wage: 52000 },
  { code: "AUS", name: "Australia", lat: -25.2744, lng: 133.7751, ppp: 0.96, wage: 55000 },
  { code: "MEX", name: "Mexico", lat: 23.6345, lng: -102.5528, ppp: 0.45, wage: 16000 },
  { code: "KOR", name: "South Korea", lat: 35.9078, lng: 127.7669, ppp: 0.76, wage: 42000 },
  { code: "ESP", name: "Spain", lat: 40.4637, lng: -3.7492, ppp: 0.62, wage: 32000 },
  { code: "ITA", name: "Italy", lat: 41.8719, lng: 12.5674, ppp: 0.66, wage: 35000 },
  { code: "RUS", name: "Russia", lat: 61.524, lng: 105.3188, ppp: 0.28, wage: 14000 },
  { code: "NLD", name: "Netherlands", lat: 52.1326, lng: 5.2913, ppp: 0.77, wage: 56000 },
  { code: "CHE", name: "Switzerland", lat: 46.8182, lng: 8.2275, ppp: 1.24, wage: 78000 },
  { code: "SWE", name: "Sweden", lat: 60.1282, lng: 18.6435, ppp: 0.89, wage: 52000 },
  { code: "NOR", name: "Norway", lat: 60.472, lng: 8.4689, ppp: 1.18, wage: 65000 },
  { code: "DNK", name: "Denmark", lat: 56.2639, lng: 9.5018, ppp: 0.92, wage: 58000 },
  { code: "POL", name: "Poland", lat: 51.9194, lng: 19.1451, ppp: 0.45, wage: 18000 },
  { code: "ARG", name: "Argentina", lat: -38.4161, lng: -63.6167, ppp: 0.28, wage: 9000 },
  { code: "TUR", name: "Turkey", lat: 38.9637, lng: 35.2433, ppp: 0.35, wage: 12000 },
  { code: "THA", name: "Thailand", lat: 15.87, lng: 100.9925, ppp: 0.36, wage: 14000 },
  { code: "VNM", name: "Vietnam", lat: 14.0583, lng: 108.2772, ppp: 0.31, wage: 6000 },
  { code: "IDN", name: "Indonesia", lat: -0.7893, lng: 113.9213, ppp: 0.33, wage: 8000 },
  { code: "MYS", name: "Malaysia", lat: 4.2105, lng: 101.9758, ppp: 0.46, wage: 18000 },
  { code: "SGP", name: "Singapore", lat: 1.3521, lng: 103.8198, ppp: 0.85, wage: 72000 },
  { code: "PHL", name: "Philippines", lat: 12.8797, lng: 121.774, ppp: 0.36, wage: 7000 },
  { code: "ZAF", name: "South Africa", lat: -30.5595, lng: 22.9375, ppp: 0.35, wage: 16000 },
  { code: "EGY", name: "Egypt", lat: 26.8206, lng: 30.8025, ppp: 0.22, wage: 5000 },
  { code: "NGA", name: "Nigeria", lat: 9.082, lng: 8.6753, ppp: 0.28, wage: 6000 },
  { code: "ISR", name: "Israel", lat: 31.0461, lng: 34.8516, ppp: 0.82, wage: 48000 },
  { code: "UAE", name: "UAE", lat: 23.4241, lng: 53.8478, ppp: 0.72, wage: 58000 },
  { code: "SAU", name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, ppp: 0.54, wage: 32000 },
  { code: "NZL", name: "New Zealand", lat: -40.9006, lng: 174.886, ppp: 0.91, wage: 48000 },
  { code: "IRL", name: "Ireland", lat: 53.1424, lng: -7.6921, ppp: 0.84, wage: 52000 },
  { code: "PRT", name: "Portugal", lat: 39.3999, lng: -8.2245, ppp: 0.54, wage: 24000 },
  { code: "GRC", name: "Greece", lat: 39.0742, lng: 21.8243, ppp: 0.52, wage: 20000 },
  { code: "CZE", name: "Czech Republic", lat: 49.8175, lng: 15.473, ppp: 0.48, wage: 22000 },
  { code: "HUN", name: "Hungary", lat: 47.1625, lng: 19.5033, ppp: 0.42, wage: 18000 },
  { code: "AUT", name: "Austria", lat: 47.5162, lng: 14.5501, ppp: 0.78, wage: 52000 },
  { code: "BEL", name: "Belgium", lat: 50.5039, lng: 4.4699, ppp: 0.76, wage: 50000 },
  { code: "FIN", name: "Finland", lat: 61.9241, lng: 25.7482, ppp: 0.88, wage: 48000 },
  { code: "CHL", name: "Chile", lat: -35.6751, lng: -71.543, ppp: 0.48, wage: 18000 },
  { code: "COL", name: "Colombia", lat: 4.5709, lng: -74.2973, ppp: 0.35, wage: 8000 },
  { code: "PER", name: "Peru", lat: -9.19, lng: -75.0152, ppp: 0.38, wage: 9000 },
  { code: "PAK", name: "Pakistan", lat: 30.3753, lng: 69.3451, ppp: 0.24, wage: 4000 },
  { code: "BGD", name: "Bangladesh", lat: 23.685, lng: 90.3563, ppp: 0.28, wage: 3500 },
  { code: "UKR", name: "Ukraine", lat: 48.3794, lng: 31.1656, ppp: 0.28, wage: 8000 },
];

const COMMODITY_PRICES: Record<string, { name: string; category: string; price: number }> = {
  gasoline: { name: "Gasoline (gallon)", category: "fuel", price: 3.85 },
  eggs: { name: "Eggs (dozen)", category: "food", price: 4.25 },
  rent: { name: "Rent (1br apt)", category: "housing", price: 1500 },
  netflix: { name: "Netflix Sub", category: "entertainment", price: 15.49 },
  milk: { name: "Milk (gallon)", category: "food", price: 4.15 },
  bread: { name: "Bread (loaf)", category: "food", price: 2.85 },
  coffee: { name: "Coffee (lb)", category: "food", price: 8.50 },
  electricity: { name: "Electricity (kWh)", category: "utilities", price: 0.16 },
  internet: { name: "Internet (monthly)", category: "utilities", price: 65 },
  beer: { name: "Beer (6-pack)", category: "food", price: 9.50 },
  rice: { name: "Rice (5lb)", category: "food", price: 5.25 },
  chicken: { name: "Chicken (lb)", category: "food", price: 4.75 },
  gym: { name: "Gym Membership", category: "fitness", price: 45 },
  transit: { name: "Monthly Transit", category: "transport", price: 100 },
  dining: { name: "Dining Out (meal)", category: "food", price: 18 },
  spotify: { name: "Spotify Sub", category: "entertainment", price: 10.99 },
  phone: { name: "Phone Plan", category: "utilities", price: 75 },
  insurance: { name: "Health Insurance", category: "healthcare", price: 450 },
};

async function mapItemsToCommodities(items: string[]): Promise<MappedCommodity[]> {
  const prompt = `You are a commodities and consumer price analyst. Map the following user inputs to standardized commodity or consumer price categories.

User inputs: ${JSON.stringify(items)}

Available commodity symbols: ${Object.keys(COMMODITY_PRICES).join(", ")}

For each user input, return the best matching commodity symbol. If no exact match exists, pick the closest category.

Respond with JSON array in format:
[{"userInput": "original input", "symbol": "commodity_symbol", "category": "category_name", "basePrice": estimated_usd_price}]`;

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
      return mappedItems.map((item: any) => ({
        userInput: item.userInput || item.user_input || "",
        symbol: item.symbol || "gasoline",
        category: item.category || "general",
        basePrice: item.basePrice || item.base_price || COMMODITY_PRICES[item.symbol]?.price || 10,
      }));
    }
    
    return items.map((item) => {
      const key = item.toLowerCase().replace(/\s+/g, "");
      const matchedKey = Object.keys(COMMODITY_PRICES).find((k) => 
        k.includes(key) || key.includes(k)
      );
      const commodity = matchedKey ? COMMODITY_PRICES[matchedKey] : COMMODITY_PRICES.gasoline;
      return {
        userInput: item,
        symbol: matchedKey || "gasoline",
        category: commodity.category,
        basePrice: commodity.price,
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
      return {
        userInput: item,
        symbol: matchedKey || "gasoline",
        category: commodity.category,
        basePrice: commodity.price,
      };
    });
  }
}

function calculateShadowPriceIndex(
  mappedCommodities: MappedCommodity[],
  userLocation: { lat: number; lng: number } | null
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

  const userBasketCost = mappedCommodities.reduce(
    (sum, c) => sum + c.basePrice,
    0
  );

  const results: ShadowPriceResult[] = COUNTRY_DATA.map((country) => {
    const pppRatio = country.ppp / userCountry.ppp;
    const wageRatio = country.wage / userCountry.wage;
    
    const adjustedCost = userBasketCost * pppRatio;
    const shadowPriceIndex = adjustedCost / userBasketCost * (1 / wageRatio) * wageRatio;
    
    const normalizedIndex = pppRatio;

    return {
      countryCode: country.code,
      countryName: country.name,
      shadowPriceIndex: Math.max(0.3, Math.min(2.0, normalizedIndex)),
      basketCost: userBasketCost,
      adjustedCost: adjustedCost,
      latitude: country.lat,
      longitude: country.lng,
      isValueDeal: normalizedIndex < 0.7,
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

      const { items, location } = parsed.data;

      const mappedCommodities = await mapItemsToCommodities(items);
      const results = calculateShadowPriceIndex(mappedCommodities, location);
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

  return httpServer;
}
