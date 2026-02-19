import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, X } from "lucide-react";
import { mapMarkers } from "@/data/mockData";

const getMarkerColor = (aqi: number) => {
  if (aqi <= 50) return "hsl(var(--aqi-good))";
  if (aqi <= 100) return "hsl(var(--aqi-moderate))";
  if (aqi <= 200) return "hsl(var(--aqi-unhealthy))";
  if (aqi <= 300) return "hsl(var(--aqi-very-unhealthy))";
  return "hsl(var(--aqi-severe))";
};

export default function MapViewPage() {
  const [selected, setSelected] = useState<typeof mapMarkers[0] | null>(null);

  // Map bounds for positioning markers on a fake map
  const minLat = 28.4, maxLat = 28.75, minLng = 76.9, maxLng = 77.55;

  const toPercent = (lat: number, lng: number) => ({
    top: `${((maxLat - lat) / (maxLat - minLat)) * 100}%`,
    left: `${((lng - minLng) / (maxLng - minLng)) * 100}%`,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Map View — Delhi NCR</h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time AQI monitoring stations</p>
      </div>

      <div className="relative bg-card border border-border rounded-2xl overflow-hidden" style={{ height: "500px" }}>
        {/* Fake map background */}
        <div className="absolute inset-0 bg-muted" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, hsl(var(--border)) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, hsl(var(--border)) 0%, transparent 50%),
            linear-gradient(hsl(var(--muted)), hsl(var(--secondary)))
          `,
        }}>
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {Array.from({ length: 10 }, (_, i) => (
              <g key={i}>
                <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
                <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="hsl(var(--foreground))" strokeWidth="0.5" />
              </g>
            ))}
          </svg>
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground font-medium bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border">
            Delhi NCR Region
          </div>
        </div>

        {/* Markers */}
        {mapMarkers.map((marker) => {
          const pos = toPercent(marker.lat, marker.lng);
          return (
            <button
              key={marker.id}
              onClick={() => setSelected(marker)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="relative">
                <div
                  className="h-5 w-5 rounded-full border-2 border-card shadow-lg animate-pulse"
                  style={{ backgroundColor: getMarkerColor(marker.aqi) }}
                />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground bg-card/90 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {marker.aqi}
                </span>
              </div>
            </button>
          );
        })}

        {/* Popup */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-card border border-border rounded-xl shadow-lg p-4 w-64 z-20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">{selected.name}</h4>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AQI</span>
                <span className="font-bold text-foreground">{selected.aqi}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zone</span>
                <span className="font-medium text-foreground">{selected.zone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Top Source</span>
                <span className="font-medium text-foreground">{selected.topSource}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 z-10">
          <p className="text-xs font-medium text-foreground mb-1.5">AQI Legend</p>
          <div className="flex gap-2">
            {[
              { label: "Good", color: "hsl(var(--aqi-good))" },
              { label: "Moderate", color: "hsl(var(--aqi-moderate))" },
              { label: "Unhealthy", color: "hsl(var(--aqi-unhealthy))" },
              { label: "Severe", color: "hsl(var(--aqi-severe))" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
