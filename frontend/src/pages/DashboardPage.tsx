import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import {
  Database, Cpu, Layers, TrendingUp, Shield, ArrowDown, AlertTriangle,
  Wind, Thermometer, Droplets, ArrowUpRight, ArrowDownRight, Clock,
  HeartPulse, Users,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  database: Database, cpu: Cpu, layers: Layers, "trending-up": TrendingUp, shield: Shield,
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function ChangeIndicator({ current, previous, unit }: { current: number; previous: number; unit?: string }) {
  const diff = current - previous;
  const pct = previous > 0 ? ((diff / previous) * 100).toFixed(1) : "0";
  const isUp = diff > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${isUp ? "text-destructive" : "text-success"}`}>
      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(Number(pct))}%
    </span>
  );
}

export default function DashboardPage() {

  const { role } = useRole();

  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/live-aqi", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });

        const data = await response.json();
        console.log("Backend Data:", data);
        setLiveData(data);
      } catch (error) {
        console.error("Failed to fetch AQI data", error);
      }
    };

    fetchData();
  }, []);

  if (!liveData) {
    return <div className="p-6">Loading AQI data...</div>;
  }

  const pollutants = [
    { label: "PM2.5", value: liveData.pollutants.PM25, unit: "µg/m³", icon: Wind },
    { label: "PM10", value: liveData.pollutants.PM10, unit: "µg/m³", icon: Droplets },
    { label: "NO₂", value: liveData.pollutants.NO2, unit: "ppb", icon: Thermometer },
    { label: "SO₂", value: liveData.pollutants.SO2, unit: "ppb", icon: Thermometer },
    { label: "CO", value: liveData.pollutants.CO, unit: "mg/m³", icon: Wind },
    { label: "O₃", value: liveData.pollutants.O3, unit: "ppb", icon: Droplets },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time pollution monitoring & AI analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <motion.div variants={fadeUp} className="lg:col-span-1 rounded-2xl p-6 aqi-severe flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Air Quality Index</span>
          </div>

          <div>
            <p className="text-7xl font-black tracking-tight">
              {liveData.aqi.value}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-lg font-semibold">
                {liveData.aqi.category}
              </p>
            </div>
          </div>

          <p className="text-sm opacity-90">
            Live data from OpenWeather
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pollutants.map((p) => (
            <div key={p.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <p.icon className="h-4 w-4" />
                <span className="text-xs font-medium">{p.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-foreground">
                  {p.value}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{p.unit}</p>
            </div>
          ))}
        </motion.div>

      </div>

    </motion.div>
  );
}

