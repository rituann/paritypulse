import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const countryData = pgTable("country_data", {
  id: serial("id").primaryKey(),
  countryCode: varchar("country_code", { length: 3 }).notNull().unique(),
  countryName: text("country_name").notNull(),
  pppFactor: real("ppp_factor"),
  exchangeRate: real("exchange_rate"),
  averageWage: real("average_wage"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertCountryDataSchema = createInsertSchema(countryData).omit({
  id: true,
  updatedAt: true,
});

export type InsertCountryData = z.infer<typeof insertCountryDataSchema>;
export type CountryData = typeof countryData.$inferSelect;

export const commodityPrices = pgTable("commodity_prices", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceUsd: real("price_usd").notNull(),
  change24h: real("change_24h"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertCommodityPriceSchema = createInsertSchema(commodityPrices).omit({
  id: true,
  updatedAt: true,
});

export type InsertCommodityPrice = z.infer<typeof insertCommodityPriceSchema>;
export type CommodityPrice = typeof commodityPrices.$inferSelect;

export const userBaskets = pgTable("user_baskets", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  items: jsonb("items").$type<string[]>().notNull(),
  mappedCommodities: jsonb("mapped_commodities").$type<MappedCommodity[]>(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertUserBasketSchema = createInsertSchema(userBaskets).omit({
  id: true,
  createdAt: true,
});

export type InsertUserBasket = z.infer<typeof insertUserBasketSchema>;
export type UserBasket = typeof userBaskets.$inferSelect;

export interface MappedCommodity {
  userInput: string;
  symbol: string;
  category: string;
  basePrice: number;
}

export interface ShadowPriceResult {
  countryCode: string;
  countryName: string;
  shadowPriceIndex: number;
  basketCost: number;
  adjustedCost: number;
  latitude: number;
  longitude: number;
  isValueDeal: boolean;
  workHours?: number;
  annualWage?: number;
  macroStability?: "Stable" | "Moderate" | "Volatile";
}

export interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const basketItemSchema = z.object({
  items: z.array(z.string().min(1)).min(1).max(5),
});

export type BasketItemInput = z.infer<typeof basketItemSchema>;
