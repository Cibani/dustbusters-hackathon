import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Building, Zap, Factory, Loader2, TrendingDown, Shield, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { policyRecommendations, currentAQI } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  car: Car, building: Building, zap: Zap, factory: Factory,
};

const severityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-warning/10 text-warning-foreground",
  medium: "bg-info/10 text-info",
};

export default function PolicyInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [trafficReduction, setTrafficReduction] = useState([30]);
  const [constructionHalt, setConstructionHalt] = useState([50]);
  const [industrialControl, setIndustrialControl] = useState([20]);

  const totalImpact = policyRecommendations.reduce((sum, p) => sum + p.impact, 0);

  const projectedAQI = useMemo(() => {
    const trafficEffect = (trafficReduction[0] / 100) * 0.45 * currentAQI.value * 0.3;
    const constructionEffect = (constructionHalt[0] / 100) * 0.12 * currentAQI.value * 0.3;
    const industrialEffect = (industrialControl[0] / 100) * 0.30 * currentAQI.value * 0.3;
    return Math.round(currentAQI.value - trafficEffect - constructionEffect - industrialEffect);
  }, [trafficReduction, constructionHalt, industrialControl]);

  const reductionPct = (((currentAQI.value - projectedAQI) / currentAQI.value) * 100).toFixed(1);

  const handleSimulate = () => {
    setLoading(true);
    setShowImpact(false);
    setTimeout(() => {
      setLoading(false);
      setShowImpact(true);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Policy Recommendations</h2>
          <p className="text-sm text-muted-foreground mt-1">AI-driven actionable policy suggestions</p>
        </div>
        <Button onClick={handleSimulate} disabled={loading} variant="outline">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
          Simulate Policy Impact
        </Button>
      </div>

      {/* Interactive Policy Simulator */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Interactive Policy Simulator</h3>
            <p className="text-xs text-muted-foreground">Adjust parameters to see projected AQI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reduce Traffic</span>
              <span className="font-bold text-foreground">{trafficReduction[0]}%</span>
            </div>
            <Slider value={trafficReduction} onValueChange={setTrafficReduction} max={100} step={5} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Halt Construction</span>
              <span className="font-bold text-foreground">{constructionHalt[0]}%</span>
            </div>
            <Slider value={constructionHalt} onValueChange={setConstructionHalt} max={100} step={5} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Industrial Control</span>
              <span className="font-bold text-foreground">{industrialControl[0]}%</span>
            </div>
            <Slider value={industrialControl} onValueChange={setIndustrialControl} max={100} step={5} />
          </div>
        </div>

        <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current AQI</p>
            <p className="text-2xl font-black text-foreground">{currentAQI.value}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Reduction</p>
            <p className="text-lg font-bold text-success">↓ {reductionPct}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Projected AQI</p>
            <p className="text-2xl font-black text-primary">{projectedAQI}</p>
          </div>
        </div>
      </div>

      {/* Impact Banner */}
      <AnimatePresence>
        {showImpact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary rounded-2xl p-6 text-primary-foreground"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="h-6 w-6" />
              <h3 className="text-lg font-bold">Projected Impact Analysis</h3>
            </div>
            <p className="text-sm opacity-90">
              Implementing all recommendations could reduce AQI by an estimated <span className="font-bold text-xl">{totalImpact}%</span> over 72 hours.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policyRecommendations.map((policy, i) => {
          const Icon = iconMap[policy.icon] || Shield;
          return (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{policy.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${severityColors[policy.severity]}`}>
                      {policy.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{policy.description}</p>
                  {showImpact && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium text-primary mt-2">
                      Estimated AQI reduction: {policy.impact}%
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
