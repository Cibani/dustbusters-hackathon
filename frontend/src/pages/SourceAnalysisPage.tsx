import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Loader2, Search, Car, Factory, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sources } from "@/data/mockData";

const sourceIcons: Record<string, React.ElementType> = {
  Traffic: Car,
  Industry: Factory,
  Dust: Wind,
};

export default function SourceAnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  const handleAnalyze = () => {
    setLoading(true);
    setAnalyzed(false);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Source Classification</h2>
          <p className="text-sm text-muted-foreground mt-1">ML-based pollution source attribution</p>
        </div>
        <Button onClick={handleAnalyze} disabled={loading} variant="outline">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Analyze Sources
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Classifying pollution sources...</p>
          </motion.div>
        ) : analyzed ? (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Source Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={sources} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} strokeWidth={2}>
                      {sources.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => `${val}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Contribution Breakdown</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={sources} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} width={80} />
                    <Tooltip formatter={(val: number) => `${val}%`} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {sources.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Source Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sources.map((source) => {
                const Icon = sourceIcons[source.name] || Wind;
                return (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: source.color + "22" }}>
                        <Icon className="h-5 w-5" style={{ color: source.color }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{source.name}</h4>
                        <p className="text-2xl font-bold text-foreground">{source.value}%</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {source.name === "Traffic" && "Vehicular emissions from 11M+ registered vehicles in NCR."}
                      {source.name === "Industry" && "Industrial emissions from manufacturing units and power plants."}
                      {source.name === "Dust" && "Road dust, construction activities, and natural wind erosion."}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
