import { MapPin } from "lucide-react";

interface LocationIndicatorProps {
  location: { lat: number; lng: number } | null;
}

export function LocationIndicator({ location }: LocationIndicatorProps) {
  if (!location) return null;

  return (
    <div
      className="absolute top-6 left-6 z-10 bg-card border border-border rounded shadow-sm p-3 flex items-center gap-3"
      data-testid="location-indicator"
    >
      <div className="relative">
        <MapPin className="w-4 h-4 text-primary" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Your Location</p>
        <p className="text-sm font-medium tabular-nums">
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
