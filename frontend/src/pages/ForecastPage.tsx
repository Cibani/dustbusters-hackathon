import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForecastPage() {

  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any[]>([]);
  const [showChart, setShowChart] = useState(false);

  const fetchForecast = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/forecast", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      const data = await response.json();

      if (data.status === "success") {

        const formatted = data.forecast.map((item: any) => ({
  hour: new Date(item.timestamp * 1000).getHours() + ":00",
  aqi: item.pm25
}));


        setForecast(formatted);
        setShowChart(true);
      }

    } catch (error) {
      console.error("Forecast error:", error);
    } finally {
      setLoading(false);
    }
  };

  const peak = forecast.length
    ? forecast.reduce((max, d) => (d.aqi > max.aqi ? d : max), forecast[0])
    : null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">24-Hour AQI Forecast</h2>
          <p className="text-sm text-muted-foreground mt-1">Live OpenWeather forecast integration</p>
        </div>

        <Button onClick={fetchForecast} disabled={loading} variant="outline">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
          Generate Forecast
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" className="flex flex-col items-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Fetching live forecast...</p>
          </motion.div>
        ) : showChart && forecast.length > 0 ? (
          <motion.div key="chart" className="space-y-4">

            {peak && (
              <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Peak AQI: {peak.aqi} at {peak.hour}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Severe conditions expected during this hour
                  </p>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <ReferenceLine y={300} stroke="red" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
