import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, RefreshCw, Loader2, AlertTriangle, Heart, Brain, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { currentAQI } from "@/data/mockData";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [value]);
  return <span>{display}</span>;
}

export default function AQIPredictionPage() {
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const confidence = 87;

  const handleRecalculate = () => {
    setLoading(true);
    setShowResult(false);
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Current AQI Prediction</h2>
          <p className="text-sm text-muted-foreground mt-1">AI-powered air quality assessment</p>
        </div>
        <Button onClick={handleRecalculate} disabled={loading} variant="outline">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Recalculate
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Running AI prediction model...</p>
          </motion.div>
        ) : showResult ? (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
            {/* AQI Card */}
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium mb-4">
                <AlertTriangle className="h-4 w-4" />
                {currentAQI.zone}
              </div>
              <div className="text-8xl font-black text-foreground mb-2">
                <AnimatedNumber value={currentAQI.value} />
              </div>
              <p className="text-lg text-muted-foreground">Air Quality Index</p>
            </div>

            {/* AI Confidence Score */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Model Confidence</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Confidence score represents the model's certainty in its prediction, calculated from ensemble agreement across LSTM, XGBoost, and Random Forest models. Higher scores indicate more reliable predictions.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">LSTM + XGBoost Ensemble</p>
                </div>
                <span className="text-2xl font-black text-primary">{confidence}%</span>
              </div>
              <div className="relative">
                <Progress value={confidence} className="h-3" />
                <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                  <span>Low Confidence</span>
                  <span>High Confidence</span>
                </div>
              </div>
            </div>

            {/* Health Advisory */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground">Health Advisory</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{currentAQI.message}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Wear N95 masks outdoors", "Keep windows closed", "Use air purifiers indoors"].map((tip) => (
                  <div key={tip} className="bg-muted rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground">{tip}</div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
