import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BasketSidebar } from "@/components/BasketSidebar";
import { GlobeMap } from "@/components/GlobeMap";
import { HeatmapLegend } from "@/components/HeatmapLegend";
import { CountryInfoPanel } from "@/components/CountryInfoPanel";
import { LiveTicker, TickerSkeleton } from "@/components/LiveTicker";
import { LocationIndicator } from "@/components/LocationIndicator";
import type { ShadowPriceResult, TickerItem } from "@shared/schema";

export default function Dashboard() {
  const [results, setResults] = useState<ShadowPriceResult[] | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<ShadowPriceResult | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [customTicker, setCustomTicker] = useState<TickerItem[] | null>(null);

  const tickerQuery = useQuery<TickerItem[]>({
    queryKey: ["/api/ticker"],
    refetchInterval: 30000,
  });

  const handleResultsChange = (newResults: ShadowPriceResult[] | null, ticker?: TickerItem[]) => {
    setResults(newResults);
    if (ticker) {
      setCustomTicker(ticker);
    }
  };

  const tickerItems = customTicker || tickerQuery.data || [];

  return (
    <div className="flex h-screen overflow-hidden bg-background" data-testid="dashboard">
      <BasketSidebar
        onResultsChange={handleResultsChange}
        onTickerChange={setCustomTicker}
        userLocation={userLocation}
        onLocationChange={setUserLocation}
      />

      <main className="flex-1 relative">
        <GlobeMap
          results={results}
          userLocation={userLocation}
          onCountrySelect={setSelectedCountry}
        />

        <LocationIndicator location={userLocation} />

        {results && <HeatmapLegend />}

        {selectedCountry && (
          <CountryInfoPanel
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
          />
        )}

        {!results && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-md p-8 glass rounded-lg pointer-events-auto">
              <h2 className="font-mono text-xl font-bold mb-4">
                Welcome to Parity Pulse
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Enter 1-5 items in your lifestyle basket to see where your money
                goes further around the world. We'll calculate the purchasing
                power parity adjusted cost for every major country.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Start by detecting your location</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {tickerQuery.isLoading && !customTicker ? (
        <TickerSkeleton />
      ) : tickerItems.length > 0 ? (
        <LiveTicker items={tickerItems} />
      ) : null}
    </div>
  );
}
