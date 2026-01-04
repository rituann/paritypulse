import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Calculator,
  Plus,
  X,
  Globe2,
  MapPin,
  Briefcase,
  FlaskConical,
  Users,
  Info,
  Search,
  BookOpen,
} from "lucide-react";
import type { ShadowPriceResult, TickerItem, WageType } from "@shared/schema";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const DEFAULT_LOCATION = { lat: 26.2285, lng: 50.5860, name: "Manama, Bahrain" };

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

const basketSchema = z.object({
  item: z.string().min(1, "Enter an item"),
});

interface BasketSidebarProps {
  onResultsChange: (results: ShadowPriceResult[] | null) => void;
  onTickerChange: (ticker: TickerItem[]) => void;
  userLocation: { lat: number; lng: number } | null;
  onLocationChange: (location: { lat: number; lng: number } | null) => void;
  tariffSensitivity: number;
  onTariffChange: (value: number) => void;
  wageType: WageType;
  onWageTypeChange: (value: WageType) => void;
}

export function BasketSidebar({
  onResultsChange,
  onTickerChange,
  userLocation,
  onLocationChange,
  tariffSensitivity,
  onTariffChange,
  wageType,
  onWageTypeChange,
}: BasketSidebarProps) {
  const [items, setItems] = useState<string[]>([]);
  const [locationName, setLocationName] = useState<string>(DEFAULT_LOCATION.name);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userLocation) {
      onLocationChange({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng });
      setLocationName(DEFAULT_LOCATION.name);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      if (!MAPBOX_TOKEN) {
        console.warn("Mapbox token not configured - location search unavailable");
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&types=place,locality,region,country&limit=5`
        );
        if (!response.ok) {
          console.error("Geocoding API error:", response.status);
          return;
        }
        const data = await response.json();
        setSearchResults(data.features || []);
        setShowResults(true);
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const selectLocation = (result: SearchResult) => {
    onLocationChange({ lat: result.center[1], lng: result.center[0] });
    setLocationName(result.place_name);
    setSearchQuery("");
    setShowResults(false);
    toast({
      title: "Location Set",
      description: result.place_name,
    });
  };

  const form = useForm<z.infer<typeof basketSchema>>({
    resolver: zodResolver(basketSchema),
    defaultValues: { item: "" },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: { items: string[]; location: { lat: number; lng: number } | null; tariffSensitivity: number; wageType: WageType }) => {
      const response = await apiRequest("POST", "/api/calculate-shadow-price", data);
      const json = await response.json();
      return json as { results: ShadowPriceResult[]; ticker: any[] };
    },
    onSuccess: (data) => {
      onResultsChange(data.results);
      if (data.ticker && data.ticker.length > 0) {
        onTickerChange(data.ticker);
      }
      toast({
        title: "Analysis Complete",
        description: `Calculated Parity Pulse Index for ${data.results.length} countries`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addItem = (data: z.infer<typeof basketSchema>) => {
    if (items.length >= 5) {
      toast({
        title: "Maximum Items Reached",
        description: "You can add up to 5 items in your basket",
        variant: "destructive",
      });
      return;
    }
    if (!items.includes(data.item.trim())) {
      setItems([...items, data.item.trim()]);
    }
    form.reset();
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    if (items.length === 0) {
      toast({
        title: "No Items",
        description: "Add at least one item to your basket",
        variant: "destructive",
      });
      return;
    }
    calculateMutation.mutate({ items, location: userLocation, tariffSensitivity, wageType });
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onLocationChange({ lat, lng });
          
          if (MAPBOX_TOKEN) {
            try {
              const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=place,locality&limit=1`
              );
              if (response.ok) {
                const data = await response.json();
                if (data.features && data.features[0]) {
                  setLocationName(data.features[0].place_name);
                } else {
                  setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                }
              } else {
                setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
              }
            } catch {
              setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
          } else {
            setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
          
          toast({
            title: "Location Detected",
            description: "Your current location has been set",
          });
        },
        () => {
          onLocationChange({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng });
          setLocationName(DEFAULT_LOCATION.name);
          toast({
            title: "Using Default Location",
            description: DEFAULT_LOCATION.name,
          });
        }
      );
    } else {
      onLocationChange({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng });
      setLocationName(DEFAULT_LOCATION.name);
    }
  };

  return (
    <aside className="w-96 h-screen bg-sidebar flex flex-col border-r border-border z-50">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded bg-primary/10">
            <Globe2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1
              className="font-logo text-xl font-bold tracking-tight text-foreground"
              data-testid="text-title"
            >
              ParityPulse
            </h1>
            <p className="text-xs text-muted-foreground tracking-wide">
              Global Economic Resilience Engine
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Your Location
            <span 
              className="ml-auto cursor-help relative group"
              title="Default base is set to Manama, Bahrain"
            >
              <Info className="w-3 h-3 text-muted-foreground" />
            </span>
          </h2>
          
          <div ref={searchRef} className="relative mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
                data-testid="input-location-search"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-50 max-h-48 overflow-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    className="w-full px-3 py-2 text-left text-sm hover-elevate flex items-center gap-2"
                    onClick={() => selectLocation(result)}
                    data-testid={`search-result-${result.id}`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{result.place_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 justify-start gap-2 text-xs"
              onClick={detectLocation}
              data-testid="button-detect-location"
            >
              <MapPin className="w-3.5 h-3.5" />
              Detect My Location
            </Button>
          </div>
          
          <div className="mt-3 p-2 rounded bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Current base:</p>
            <p className="text-sm font-medium truncate" data-testid="text-current-location">
              {locationName}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" />
            Lifestyle Basket
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(addItem)}
              className="flex gap-2 mb-4"
            >
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="e.g. Rent, Eggs, Netflix..."
                        className="text-sm"
                        data-testid="input-basket-item"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="icon"
                variant="secondary"
                disabled={items.length >= 5}
                data-testid="button-add-item"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </Form>

          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded">
                Add 1-5 items to compare global prices
              </p>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded bg-muted/50 border border-border"
                  data-testid={`basket-item-${index}`}
                >
                  <span className="text-sm font-medium">{item}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(index)}
                    data-testid={`button-remove-item-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">
              {items.length}/5 items
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < items.length ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded bg-card border border-border">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <FlaskConical className="w-3.5 h-3.5" />
            The Policy Lab
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">
                Tariff Sensitivity
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={tariffSensitivity}
                onChange={(e) => onTariffChange(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                data-testid="slider-tariff"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Baseline</span>
                <span className="font-medium text-foreground">+{tariffSensitivity}%</span>
                <span>+50%</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Global Wage Toggle
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={wageType === "professional" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onWageTypeChange("professional")}
                  className="text-xs"
                  data-testid="button-wage-professional"
                >
                  Professional
                </Button>
                <Button
                  variant={wageType === "minimum" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onWageTypeChange("minimum")}
                  className="text-xs"
                  data-testid="button-wage-minimum"
                >
                  Minimum Wage
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {wageType === "professional" 
                  ? "Senior Tech professional salaries" 
                  : "Local minimum wage workers"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5" />
            Coverage
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-1">
                Countries
              </p>
              <p className="text-2xl font-bold text-primary">50+</p>
            </div>
            <div className="p-4 rounded bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-1">
                Data Points
              </p>
              <p className="text-2xl font-bold">2.4K</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-border space-y-3">
        <Button
          className="w-full tracking-wide"
          size="lg"
          onClick={handleCalculate}
          disabled={calculateMutation.isPending || items.length === 0}
          data-testid="button-calculate"
        >
          {calculateMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Parity Index
            </>
          )}
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-muted-foreground gap-1.5"
              data-testid="button-methodology"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Methodology
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif">Methodology</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Weighted Consumer Basket</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Items are categorized into economic buckets (housing, transport, staples, utilities, healthcare, luxury) with fixed weights reflecting typical household expenditure patterns.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Tariff Sensitivity</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Simulates how import taxes increase the "Adjusted Cost" of goods, reducing the purchasing power of local labor. Higher tariffs mean goods cost more relative to local wages.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Parity Indicators</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                    <span>
                      <strong>Value</strong> (Index &lt; 0.9): High labor-time efficiency; your money goes further than in your base location.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
                    <span>
                      <strong>Parity</strong> (0.9 - 1.1): Similar purchasing power to your base location.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                    <span>
                      <strong>Premium</strong> (Index &gt; 1.1): Low labor-time efficiency; goods are expensive relative to local wages.
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Stability Indicators</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-medium">Stable</span>
                    <span className="text-muted-foreground">- Low exposure to inflation or exchange rate risk.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 font-medium">Moderate</span>
                    <span className="text-muted-foreground">- Some price volatility expected.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-medium">Volatile</span>
                    <span className="text-muted-foreground">- High exposure to inflation or exchange rate risk.</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}
