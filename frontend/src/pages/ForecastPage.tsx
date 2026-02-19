import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, Loader2, AlertTriangle, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { forecastData, previousForecastData } from "@/data/mockData";

export default function ForecastPage() {
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [compareMode, setCompareMode] = useState(false);

  const peak = forecastData.reduce((max, d) => (d.aqi > max.aqi ? d : max), forecastData[0]);

  const combinedData = forecastData.map((d, i) => ({
    ...d,
    previousAqi: previousForecastData[i]?.aqi,
  }));

  const handleGenerate = () => {
    setLoading(true);
    setShowChart(false);
    setTimeout(() => {
      setLoading(false);
      setShowChart(true);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">24-Hour AQI Forecast</h2>
          <p className="text-sm text-muted-foreground mt-1">Predictive model with 92% accuracy</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
            <GitCompareArrows className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Compare Previous Day</span>
            <Switch checked={compareMode} onCheckedChange={setCompareMode} />
          </div>
          <Button onClick={handleGenerate} disabled={loading} variant="outline">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
            Generate Forecast
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Generating forecast model...</p>
          </motion.div>
        ) : showChart ? (
          <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Peak AQI: {peak.aqi} at {peak.hour}</p>
                <p className="text-xs text-muted-foreground">Expect severe conditions during afternoon hours</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              {compareMode && (
                <div className="flex items-center gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-6 rounded bg-primary" />
                    <span className="text-muted-foreground">Today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-6 rounded bg-muted-foreground/30" style={{ borderStyle: "dashed" }} />
                    <span className="text-muted-foreground">Previous Day</span>
                  </div>
                </div>
              )}
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={2} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} domain={[100, 400]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <ReferenceLine y={300} stroke="hsl(var(--aqi-severe))" strokeDasharray="5 5" label={{ value: "Severe", fill: "hsl(var(--aqi-severe))", fontSize: 11 }} />
                  <Line type="monotone" dataKey="aqi" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "hsl(var(--primary))" }} name="Today" />
                  {compareMode && (
                    <Line type="monotone" dataKey="previousAqi" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Previous Day" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
