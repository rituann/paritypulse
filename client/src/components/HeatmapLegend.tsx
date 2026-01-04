import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HeatmapLegend() {
  return (
    <div
      className="absolute top-6 right-6 z-10 bg-card border border-border rounded shadow-sm p-4"
      data-testid="heatmap-legend"
    >
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
          Parity Pulse Index
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3 h-3 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">
              The Parity Pulse Index compares how much your lifestyle basket
              costs in each country relative to your location, adjusted for
              purchasing power.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div
          className="h-3 flex-1 rounded-sm"
          style={{
            background:
              "linear-gradient(to right, #16A34A, #65A30D, #CA8A04, #EA580C, #DC2626)",
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0.3x</span>
        <span>1.0x</span>
        <span>2.0x</span>
      </div>

      <div className="mt-3 pt-3 border-t border-border space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
          <span className="text-xs text-muted-foreground">High Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#CA8A04]" />
          <span className="text-xs text-muted-foreground">Parity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
          <span className="text-xs text-muted-foreground">Premium</span>
        </div>
      </div>
    </div>
  );
}
