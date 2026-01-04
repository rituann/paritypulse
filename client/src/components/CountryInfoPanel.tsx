import { X, TrendingDown, TrendingUp, Minus, DollarSign, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultantBrief } from "./ConsultantBrief";
import type { ShadowPriceResult } from "@shared/schema";

interface CountryInfoPanelProps {
  country: ShadowPriceResult;
  onClose: () => void;
}

export function CountryInfoPanel({ country, onClose }: CountryInfoPanelProps) {
  const indexStatus = country.shadowPriceIndex < 0.9
    ? { label: "High Value", icon: TrendingDown, color: "text-green-600" }
    : country.shadowPriceIndex > 1.1
    ? { label: "Premium", icon: TrendingUp, color: "text-red-600" }
    : { label: "Parity", icon: Minus, color: "text-muted-foreground" };

  const StatusIcon = indexStatus.icon;
  
  const workHours = country.workHours?.toFixed(1) || "N/A";
  const macroStability = country.macroStability || "Moderate";

  return (
    <div
      className="absolute right-0 top-0 h-full w-[420px] bg-card z-20 flex flex-col animate-in slide-in-from-right duration-300 border-l border-border shadow-lg"
      data-testid="country-info-panel"
    >
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Country Fact Sheet
          </p>
          <h2
            className="font-serif text-2xl font-bold tracking-tight"
            data-testid="text-country-name"
          >
            {country.countryName}
          </h2>
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
        <div className="text-center p-6 rounded bg-muted/50 border border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Parity Pulse Index
          </p>
          <p
            className={`text-5xl font-bold tabular-nums ${
              country.shadowPriceIndex < 0.9
                ? "text-green-600"
                : country.shadowPriceIndex > 1.1
                ? "text-red-600"
                : "text-foreground"
            }`}
            data-testid="text-parity-index"
          >
            {country.shadowPriceIndex.toFixed(2)}x
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <StatusIcon className={`w-4 h-4 ${indexStatus.color}`} />
            <span className={`text-sm font-medium ${indexStatus.color}`}>
              {indexStatus.label}
            </span>
          </div>
        </div>

        {country.isValueDeal && (
          <Badge
            variant="outline"
            className="w-full justify-center py-2 border-primary text-primary"
          >
            Top Value Destination
          </Badge>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Work Hours</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{workHours}</p>
            <p className="text-xs text-muted-foreground">hours to afford basket</p>
          </div>
          
          <div className="p-4 rounded bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Stability</span>
            </div>
            <p className={`text-2xl font-bold ${macroStability === "Stable" ? "text-green-600" : macroStability === "Volatile" ? "text-red-600" : "text-amber-600"}`}>
              {macroStability}
            </p>
            <p className="text-xs text-muted-foreground">macro indicator</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Cost Analysis
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded bg-muted/30 border border-border">
              <span className="text-sm text-muted-foreground">
                Basket Cost (USD)
              </span>
              <span className="font-bold tabular-nums" data-testid="text-basket-cost">
                ${country.basketCost.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded bg-muted/30 border border-border">
              <span className="text-sm text-muted-foreground">
                PPP Adjusted Cost
              </span>
              <span
                className={`font-bold tabular-nums ${
                  country.adjustedCost < country.basketCost
                    ? "text-green-600"
                    : country.adjustedCost > country.basketCost
                    ? "text-red-600"
                    : ""
                }`}
                data-testid="text-adjusted-cost"
              >
                ${country.adjustedCost.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded bg-primary/5 border border-primary/20">
              <span className="text-sm text-muted-foreground">
                {country.adjustedCost < country.basketCost ? "Net Savings" : "Premium"}
              </span>
              <span
                className={`font-bold tabular-nums ${
                  country.adjustedCost < country.basketCost
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${Math.abs(country.adjustedCost - country.basketCost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <ConsultantBrief country={country} />
      </div>

      <div className="p-6 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {country.latitude.toFixed(2)}, {country.longitude.toFixed(2)}
          </span>
          <span>Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
}
