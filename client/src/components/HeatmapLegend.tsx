import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HeatmapLegend() {
  return (
    <div
      className="absolute top-6 right-6 z-10 glass rounded-md p-4"
      data-testid="heatmap-legend"
    >
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Shadow Price Index
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3 h-3 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">
              The Shadow Price Index compares how much your lifestyle basket
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
              "linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444)",
          }}
        />
      </div>

      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span>0.5x</span>
        <span>1.0x</span>
        <span>1.5x+</span>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="text-xs text-muted-foreground">Great value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#eab308]" />
          <span className="text-xs text-muted-foreground">Similar cost</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="text-xs text-muted-foreground">More expensive</span>
        </div>
      </div>
    </div>
  );
}
