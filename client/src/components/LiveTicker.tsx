import { TrendingUp, TrendingDown } from "lucide-react";
import type { TickerItem } from "@shared/schema";

interface LiveTickerProps {
  items: TickerItem[];
}

export function LiveTicker({ items }: LiveTickerProps) {
  if (items.length === 0) {
    return null;
  }

  const duplicatedItems = [...items, ...items];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-12 glass-strong border-t border-white/5 z-40 overflow-hidden"
      data-testid="live-ticker"
    >
      <div className="ticker-scroll flex items-center h-full">
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-4 px-6 border-r border-white/10 shrink-0"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground uppercase">
                {item.symbol}
              </span>
              <span className="font-mono text-sm font-medium">
                {item.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tabular-nums">
                ${item.price.toFixed(2)}
              </span>
              <div
                className={`flex items-center gap-1 ${
                  item.change >= 0 ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="font-mono text-xs tabular-nums">
                  {item.change >= 0 ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TickerSkeleton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 glass-strong border-t border-white/5 z-40">
      <div className="flex items-center h-full px-6 gap-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-16 h-4 shimmer rounded" />
            <div className="w-20 h-4 shimmer rounded" />
            <div className="w-12 h-4 shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
