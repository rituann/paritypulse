import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Calculator,
  Plus,
  X,
  TrendingUp,
  Globe2,
  Zap,
  MapPin,
} from "lucide-react";
import type { ShadowPriceResult, TickerItem } from "@shared/schema";

const basketSchema = z.object({
  item: z.string().min(1, "Enter an item"),
});

interface BasketSidebarProps {
  onResultsChange: (results: ShadowPriceResult[] | null) => void;
  onTickerChange: (ticker: TickerItem[]) => void;
  userLocation: { lat: number; lng: number } | null;
  onLocationChange: (location: { lat: number; lng: number } | null) => void;
}

export function BasketSidebar({
  onResultsChange,
  onTickerChange,
  userLocation,
  onLocationChange,
}: BasketSidebarProps) {
  const [items, setItems] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof basketSchema>>({
    resolver: zodResolver(basketSchema),
    defaultValues: { item: "" },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: { items: string[]; location: { lat: number; lng: number } | null }) => {
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
    calculateMutation.mutate({ items, location: userLocation });
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
    <aside className="w-80 h-screen glass-strong flex flex-col border-r border-white/5 z-50">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-primary/20 neon-glow-green">
            <Globe2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1
              className="font-mono text-lg font-bold tracking-tight"
              data-testid="text-title"
            >
              PARITY PULSE
            </h1>
            <p className="text-xs text-muted-foreground font-mono tracking-widest">
              PPP INTELLIGENCE
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Your Location
            </h2>
          </div>
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
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Lifestyle Basket
            </h2>
          </div>

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
                        placeholder="e.g. Gasoline, Eggs, Rent..."
                        className="bg-muted/50 border-white/10 font-mono text-sm"
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
              <p className="text-sm text-muted-foreground text-center py-4">
                Add 1-5 items to compare global prices
              </p>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/30 border border-white/5"
                  data-testid={`basket-item-${index}`}
                >
                  <span className="font-mono text-sm">{item}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => removeItem(index)}
                    data-testid={`button-remove-item-${index}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground font-mono">
              {items.length}/5 items
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < items.length ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-md bg-muted/20 border border-white/5">
              <p className="text-xs text-muted-foreground font-mono mb-1">
                Countries
              </p>
              <p className="text-xl font-mono font-bold text-primary">195</p>
            </div>
            <div className="p-3 rounded-md bg-muted/20 border border-white/5">
              <p className="text-xs text-muted-foreground font-mono mb-1">
                Data Points
              </p>
              <p className="text-xl font-mono font-bold">2.4K</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/5">
        <Button
          className="w-full font-mono tracking-wide neon-glow-green"
          size="lg"
          onClick={handleCalculate}
          disabled={calculateMutation.isPending || items.length === 0}
          data-testid="button-calculate"
        >
          {calculateMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ANALYZING...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              CALCULATE INDEX
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
