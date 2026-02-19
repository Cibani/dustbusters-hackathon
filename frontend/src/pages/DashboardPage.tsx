import { motion } from "framer-motion";
import { currentAQI, previousDayAQI, processSteps, activityTimeline, healthRiskLevels } from "@/data/mockData";
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

  const pollutants = [
    { label: "PM2.5", value: currentAQI.pollutants.PM25, prev: previousDayAQI.pollutants.PM25, unit: "µg/m³", icon: Wind },
    { label: "PM10", value: currentAQI.pollutants.PM10, prev: previousDayAQI.pollutants.PM10, unit: "µg/m³", icon: Droplets },
    { label: "NO₂", value: currentAQI.pollutants.NO2, prev: previousDayAQI.pollutants.NO2, unit: "ppb", icon: Thermometer },
    { label: "SO₂", value: currentAQI.pollutants.SO2, prev: previousDayAQI.pollutants.SO2, unit: "ppb", icon: Thermometer },
    { label: "CO", value: currentAQI.pollutants.CO, prev: previousDayAQI.pollutants.CO, unit: "mg/m³", icon: Wind },
    { label: "O₃", value: currentAQI.pollutants.O3, prev: previousDayAQI.pollutants.O3, unit: "ppb", icon: Droplets },
  ];

  // Find current health risk level
  const healthLevel = currentAQI.value > 200 ? healthRiskLevels[3]
    : currentAQI.value > 100 ? healthRiskLevels[2]
    : currentAQI.value > 50 ? healthRiskLevels[1]
    : healthRiskLevels[0];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time pollution monitoring & AI analysis</p>
      </motion.div>

      {/* AQI Card + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={fadeUp} className="lg:col-span-1 rounded-2xl p-6 aqi-severe flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Air Quality Index</span>
          </div>
          <div>
            <p className="text-7xl font-black tracking-tight">{currentAQI.value}</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-lg font-semibold">{currentAQI.zone} Zone</p>
              <ChangeIndicator current={currentAQI.value} previous={previousDayAQI.value} />
            </div>
            <p className="text-xs opacity-70 mt-1">vs yesterday: {previousDayAQI.value} ({previousDayAQI.zone})</p>
          </div>
          <p className="text-sm opacity-90">{currentAQI.message}</p>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pollutants.map((p) => (
            <div key={p.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <p.icon className="h-4 w-4" />
                <span className="text-xs font-medium">{p.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-foreground">{p.value}</p>
                <ChangeIndicator current={p.value} previous={p.prev} />
              </div>
              <p className="text-xs text-muted-foreground">{p.unit}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Health Risk + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Health Impact Panel */}
        <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <HeartPulse className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Health Risk Index</h3>
              <p className="text-xs text-muted-foreground">Current risk assessment</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {healthRiskLevels.map((h) => (
              <div
                key={h.level}
                className={`flex-1 rounded-lg p-2 text-center text-xs font-semibold transition-all ${
                  h.level === healthLevel.level ? "ring-2 ring-foreground/20 scale-105" : "opacity-50"
                }`}
                style={{ backgroundColor: h.color, color: "white" }}
              >
                {h.level}
              </div>
            ))}
          </div>

          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="text-sm text-foreground font-medium">{healthLevel.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span><span className="font-medium text-foreground">At-risk groups:</span> {healthLevel.groups}</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">System Activity Log</h3>
              <p className="text-xs text-muted-foreground">Latest processing timeline</p>
            </div>
          </div>

          <div className="space-y-0">
            {activityTimeline.map((entry, i) => (
              <div key={i} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {i < activityTimeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-4">
                  <p className="text-xs font-semibold text-foreground">{entry.event}</p>
                  <p className="text-[10px] text-muted-foreground">{entry.time} · {entry.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Process Flow */}
      <motion.div variants={fadeUp}>
        <h3 className="text-lg font-semibold text-foreground mb-4">System Process Flow</h3>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {processSteps.map((step, i) => {
            const Icon = iconMap[step.icon] || Database;
            return (
              <div key={step.title} className="flex-1 flex items-center gap-3">
                <motion.div variants={fadeUp} className="flex-1 bg-card border border-border rounded-xl p-4 text-center">
                  <div className="mx-auto h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </motion.div>
                {i < processSteps.length - 1 && (
                  <ArrowDown className="h-5 w-5 text-muted-foreground flex-shrink-0 rotate-0 md:-rotate-90" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
