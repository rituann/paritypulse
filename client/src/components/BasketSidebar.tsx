import { useState } from "react";
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
} from "lucide-react";
import type { ShadowPriceResult, TickerItem, WageType } from "@shared/schema";

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
  const { toast } = useToast();

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
        (position) => {
          onLocationChange({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location Detected",
            description: "Your location has been set",
          });
        },
        () => {
          onLocationChange({ lat: 40.7128, lng: -74.006 });
          toast({
            title: "Using Default Location",
            description: "Set to New York, NY",
          });
        }
      );
    } else {
      onLocationChange({ lat: 40.7128, lng: -74.006 });
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
          </h2>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={detectLocation}
            data-testid="button-detect-location"
          >
            <MapPin className="w-4 h-4" />
            {userLocation
              ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`
              : "Detect My Location"}
          </Button>
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

      <div className="p-6 border-t border-border">
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
        <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
          <Info className="w-3 h-3" />
          Calculated using a Weighted Consumer Basket model
        </p>
      </div>
    </aside>
  );
}
