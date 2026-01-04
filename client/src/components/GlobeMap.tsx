import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Globe2, AlertTriangle } from "lucide-react";
import type { ShadowPriceResult } from "@shared/schema";

interface GlobeMapProps {
  results: ShadowPriceResult[] | null;
  userLocation: { lat: number; lng: number } | null;
  onCountrySelect: (country: ShadowPriceResult | null) => void;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function getHeatColor(index: number): string {
  if (index <= 0.6) return "#22c55e";
  if (index <= 0.8) return "#84cc16";
  if (index <= 1.0) return "#eab308";
  if (index <= 1.2) return "#f97316";
  return "#ef4444";
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

function FallbackGlobe({ results, onCountrySelect }: { results: ShadowPriceResult[] | null; onCountrySelect: (country: ShadowPriceResult | null) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-8" data-testid="globe-fallback">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
          <Globe2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-mono text-xl font-bold mb-3">3D Globe Unavailable</h2>
        <p className="text-muted-foreground text-sm mb-6">
          WebGL is required to display the interactive 3D globe. Your browser or environment doesn't support WebGL.
        </p>
        
        {results && results.length > 0 && (
          <div className="mt-6 border border-white/10 rounded-md overflow-hidden">
            <div className="bg-muted/20 px-4 py-2 border-b border-white/10">
              <h3 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                Top Value Countries
              </h3>
            </div>
            <div className="max-h-64 overflow-auto">
              {results.slice(0, 10).map((result) => (
                <button
                  key={result.countryCode}
                  className="w-full px-4 py-3 flex items-center justify-between border-b border-white/5 hover-elevate text-left"
                  onClick={() => onCountrySelect(result)}
                  data-testid={`fallback-country-${result.countryCode}`}
                >
                  <div>
                    <span className="font-medium">{result.countryName}</span>
                    <span className="text-muted-foreground text-sm ml-2">({result.countryCode})</span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      result.shadowPriceIndex < 0.9
                        ? "text-neon-green"
                        : result.shadowPriceIndex > 1.1
                        ? "text-neon-red"
                        : ""
                    }`}
                  >
                    {result.shadowPriceIndex.toFixed(2)}x
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function GlobeMap({ results, userLocation, onCountrySelect }: GlobeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [webglSupported] = useState(() => checkWebGLSupport());

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN || !webglSupported) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [0, 20],
        zoom: 1.5,
        projection: "globe",
        accessToken: MAPBOX_TOKEN,
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
        setHasError(true);
      });

      map.current.on("style.load", () => {
        if (!map.current) return;

        map.current.setFog({
          color: "rgb(10, 15, 20)",
          "high-color": "rgb(20, 30, 45)",
          "horizon-blend": 0.1,
          "space-color": "rgb(5, 8, 12)",
          "star-intensity": 0.15,
        });

        setIsLoaded(true);
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "top-right"
      );

      let rotationAnimation: number;
      const rotateGlobe = () => {
        if (!map.current) return;
        const center = map.current.getCenter();
        center.lng += 0.02;
        map.current.setCenter(center);
        rotationAnimation = requestAnimationFrame(rotateGlobe);
      };

      const startRotation = () => {
        rotationAnimation = requestAnimationFrame(rotateGlobe);
      };

      const stopRotation = () => {
        cancelAnimationFrame(rotationAnimation);
      };

      map.current.on("mousedown", stopRotation);
      map.current.on("touchstart", stopRotation);

      startRotation();

      return () => {
        stopRotation();
        map.current?.remove();
      };
    } catch (error) {
      console.error("Failed to initialize map:", error);
      setHasError(true);
    }
  }, [webglSupported]);

  useEffect(() => {
    if (!map.current || !isLoaded || !results) return;

    try {
      if (map.current.getSource("country-heat")) {
        map.current.removeLayer("country-heat-layer");
        map.current.removeSource("country-heat");
      }

      if (map.current.getSource("value-lines")) {
        map.current.removeLayer("value-lines-layer");
        map.current.removeSource("value-lines");
      }

      const geojsonData: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: results.map((result) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [result.longitude, result.latitude],
          },
          properties: {
            countryCode: result.countryCode,
            countryName: result.countryName,
            shadowPriceIndex: result.shadowPriceIndex,
            basketCost: result.basketCost,
            adjustedCost: result.adjustedCost,
            latitude: result.latitude,
            longitude: result.longitude,
            isValueDeal: result.isValueDeal,
            color: getHeatColor(result.shadowPriceIndex),
          },
        })),
      };

      map.current.addSource("country-heat", {
        type: "geojson",
        data: geojsonData,
      });

      map.current.addLayer({
        id: "country-heat-layer",
        type: "circle",
        source: "country-heat",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            1, 8,
            3, 15,
            6, 25,
          ],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.75,
          "circle-blur": 0.3,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255, 255, 255, 0.3)",
        },
      });

      map.current.on("click", "country-heat-layer", (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          if (props) {
            onCountrySelect({
              countryCode: props.countryCode,
              countryName: props.countryName,
              shadowPriceIndex: props.shadowPriceIndex,
              basketCost: props.basketCost,
              adjustedCost: props.adjustedCost,
              latitude: props.latitude,
              longitude: props.longitude,
              isValueDeal: props.isValueDeal,
            });
          }
        }
      });

      map.current.on("mouseenter", "country-heat-layer", () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "pointer";
        }
      });

      map.current.on("mouseleave", "country-heat-layer", () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = "";
        }
      });

      if (userLocation) {
        const topDeals = results
          .filter((r) => r.isValueDeal)
          .sort((a, b) => a.shadowPriceIndex - b.shadowPriceIndex)
          .slice(0, 3);

        const arcData: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: topDeals.map((deal) => ({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [userLocation.lng, userLocation.lat],
                [deal.longitude, deal.latitude],
              ],
            },
            properties: {
              countryName: deal.countryName,
            },
          })),
        };

        map.current.addSource("value-lines", {
          type: "geojson",
          data: arcData,
        });

        map.current.addLayer({
          id: "value-lines-layer",
          type: "line",
          source: "value-lines",
          paint: {
            "line-color": "#22c55e",
            "line-width": 2,
            "line-opacity": 0.7,
            "line-dasharray": [2, 2],
          },
        });
      }
    } catch (error) {
      console.error("Error updating map layers:", error);
    }
  }, [results, userLocation, isLoaded, onCountrySelect]);

  useEffect(() => {
    if (!map.current || !isLoaded || !userLocation) return;

    const markers = document.querySelectorAll(".user-marker");
    markers.forEach((m) => m.remove());

    const el = document.createElement("div");
    el.className = "user-marker";
    el.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background: #22c55e;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
        animation: pulse 2s infinite;
      "></div>
    `;

    new mapboxgl.Marker(el)
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map.current);
  }, [userLocation, isLoaded]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background" data-testid="globe-container">
        <div className="text-center p-8">
          <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">
            Mapbox token not configured
          </p>
        </div>
      </div>
    );
  }

  if (!webglSupported || hasError) {
    return <FallbackGlobe results={results} onCountrySelect={onCountrySelect} />;
  }

  return (
    <div className="flex-1 relative globe-container" data-testid="globe-container">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-sm text-muted-foreground">
              Loading Globe...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
