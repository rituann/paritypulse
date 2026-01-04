import { X, TrendingDown, TrendingUp, Minus, DollarSign, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ShadowPriceResult } from "@shared/schema";

interface CountryInfoPanelProps {
  country: ShadowPriceResult;
  onClose: () => void;
}

export function CountryInfoPanel({ country, onClose }: CountryInfoPanelProps) {
  const indexStatus = country.shadowPriceIndex < 0.9
    ? { label: "Great Value", icon: TrendingDown, color: "text-neon-green" }
    : country.shadowPriceIndex > 1.1
    ? { label: "Expensive", icon: TrendingUp, color: "text-neon-red" }
    : { label: "Similar", icon: Minus, color: "text-muted-foreground" };

  const StatusIcon = indexStatus.icon;

  return (
    <div
      className="absolute right-0 top-0 h-full w-96 glass-strong z-20 flex flex-col animate-in slide-in-from-right duration-300"
      data-testid="country-info-panel"
    >
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <div>
          <h2
            className="font-mono text-xl font-bold tracking-tight"
            data-testid="text-country-name"
          >
            {country.countryName}
          </h2>
          <p className="text-xs text-muted-foreground font-mono">
            {country.countryCode}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          data-testid="button-close-panel"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="text-center p-6 rounded-md bg-muted/20 border border-white/5">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Shadow Price Index
          </p>
          <p
            className={`text-5xl font-mono font-bold tabular-nums ${
              country.shadowPriceIndex < 0.9
                ? "text-neon-green"
                : country.shadowPriceIndex > 1.1
                ? "text-neon-red"
                : ""
            }`}
            data-testid="text-shadow-index"
          >
            {country.shadowPriceIndex.toFixed(2)}x
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <StatusIcon className={`w-4 h-4 ${indexStatus.color}`} />
            <span className={`text-sm font-mono ${indexStatus.color}`}>
              {indexStatus.label}
            </span>
          </div>
        </div>

        {country.isValueDeal && (
          <Badge
            variant="outline"
            className="w-full justify-center py-2 border-primary/50 text-primary"
          >
            Top Value Destination
          </Badge>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Cost Breakdown
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-md bg-muted/20 border border-white/5">
              <span className="text-sm text-muted-foreground">
                Basket Cost (USD)
              </span>
              <span className="font-mono font-bold" data-testid="text-basket-cost">
                ${country.basketCost.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-md bg-muted/20 border border-white/5">
              <span className="text-sm text-muted-foreground">
                PPP Adjusted Cost
              </span>
              <span
                className={`font-mono font-bold ${
                  country.adjustedCost < country.basketCost
                    ? "text-neon-green"
                    : country.adjustedCost > country.basketCost
                    ? "text-neon-red"
                    : ""
                }`}
                data-testid="text-adjusted-cost"
              >
                ${country.adjustedCost.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-md bg-primary/10 border border-primary/20">
              <span className="text-sm text-muted-foreground">
                {country.adjustedCost < country.basketCost ? "You Save" : "Extra Cost"}
              </span>
              <span
                className={`font-mono font-bold ${
                  country.adjustedCost < country.basketCost
                    ? "text-neon-green"
                    : "text-neon-red"
                }`}
              >
                ${Math.abs(country.adjustedCost - country.basketCost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Scale className="w-4 h-4" />
            What This Means
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {country.shadowPriceIndex < 0.9 ? (
              <>
                Your lifestyle basket costs{" "}
                <span className="text-neon-green font-semibold">
                  {((1 - country.shadowPriceIndex) * 100).toFixed(0)}% less
                </span>{" "}
                in {country.countryName} compared to your current location when
                adjusted for local purchasing power.
              </>
            ) : country.shadowPriceIndex > 1.1 ? (
              <>
                Your lifestyle basket costs{" "}
                <span className="text-neon-red font-semibold">
                  {((country.shadowPriceIndex - 1) * 100).toFixed(0)}% more
                </span>{" "}
                in {country.countryName} compared to your current location when
                adjusted for local purchasing power.
              </>
            ) : (
              <>
                Your lifestyle basket costs about the same in{" "}
                {country.countryName} as in your current location when adjusted
                for local purchasing power.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">
            {country.latitude.toFixed(2)}, {country.longitude.toFixed(2)}
          </span>
          <span className="font-mono">Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
}
