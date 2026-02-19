export const currentAQI = {
  value: 276,
  zone: "Severe",
  message: "Health alert: everyone may experience serious health effects. Avoid outdoor activity.",
  pollutants: {
    PM25: 156,
    PM10: 298,
    NO2: 82,
    SO2: 45,
    CO: 3.2,
    O3: 28,
  },
};

export const previousDayAQI = {
  value: 241,
  zone: "Very Unhealthy",
  pollutants: {
    PM25: 132,
    PM10: 256,
    NO2: 71,
    SO2: 39,
    CO: 2.8,
    O3: 24,
  },
};

export const sources = [
  { name: "Traffic", value: 45, color: "hsl(220, 60%, 28%)" },
  { name: "Industry", value: 30, color: "hsl(200, 70%, 45%)" },
  { name: "Dust", value: 25, color: "hsl(45, 93%, 47%)" },
];

export const forecastData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  aqi: Math.round(180 + 120 * Math.sin((i - 6) * Math.PI / 12) + Math.random() * 30),
}));

export const previousForecastData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  aqi: Math.round(160 + 100 * Math.sin((i - 6) * Math.PI / 12) + Math.random() * 25),
}));

export const policyRecommendations = [
  {
    id: 1,
    title: "Restrict Peak-Hour Traffic",
    description: "Implement odd-even vehicle restrictions during 8AM-10AM and 5PM-8PM in high-density corridors.",
    severity: "high",
    icon: "car",
    impact: 15,
  },
  {
    id: 2,
    title: "Temporary Halt on Construction",
    description: "Suspend all non-essential construction activities until AQI drops below 200.",
    severity: "critical",
    icon: "building",
    impact: 12,
  },
  {
    id: 3,
    title: "Promote EV Incentives",
    description: "Fast-track EV subsidies and deploy additional charging infrastructure in NCR region.",
    severity: "medium",
    icon: "zap",
    impact: 8,
  },
  {
    id: 4,
    title: "Industrial Emission Caps",
    description: "Enforce stricter emission limits on factories within 50km radius of monitoring stations.",
    severity: "high",
    icon: "factory",
    impact: 18,
  },
];

export const mapMarkers = [
  { id: 1, lat: 28.6139, lng: 77.2090, name: "Connaught Place", aqi: 276, zone: "Severe", topSource: "Traffic" },
  { id: 2, lat: 28.5355, lng: 77.3910, name: "Noida Sector 62", aqi: 245, zone: "Very Unhealthy", topSource: "Industry" },
  { id: 3, lat: 28.7041, lng: 77.1025, name: "Rohini", aqi: 310, zone: "Severe", topSource: "Dust" },
  { id: 4, lat: 28.5672, lng: 77.2100, name: "Saket", aqi: 198, zone: "Unhealthy", topSource: "Traffic" },
  { id: 5, lat: 28.6692, lng: 77.4538, name: "Ghaziabad", aqi: 330, zone: "Severe", topSource: "Industry" },
  { id: 6, lat: 28.4595, lng: 77.0266, name: "Gurugram", aqi: 220, zone: "Very Unhealthy", topSource: "Traffic" },
];

export const processSteps = [
  { title: "Data Collection", description: "Real-time sensor data from 150+ monitoring stations", icon: "database" },
  { title: "AI Model Processing", description: "Deep learning models analyze pollutant patterns", icon: "cpu" },
  { title: "Source Classification", description: "ML-based attribution of pollution sources", icon: "layers" },
  { title: "Forecast Generation", description: "24-hour AQI predictions with 92% accuracy", icon: "trending-up" },
  { title: "Policy Recommendation", description: "AI-driven actionable policy suggestions", icon: "shield" },
];

export const userProfile = {
  name: "Dr. Priya Sharma",
  email: "priya.sharma@cpcb.gov.in",
  organization: "Central Pollution Control Board (CPCB)",
  role: "Environmental Analyst",
  avatar: "",
};

export const alerts = [
  { id: 1, message: "Severe AQI detected in Anand Vihar (346)", time: "2 min ago", critical: true },
  { id: 2, message: "PM2.5 spike in Rohini sector", time: "8 min ago", critical: true },
  { id: 3, message: "Construction dust alert near IGI Airport", time: "15 min ago", critical: false },
  { id: 4, message: "Industrial emission threshold exceeded — Ghaziabad", time: "22 min ago", critical: true },
  { id: 5, message: "Forecast model updated successfully", time: "30 min ago", critical: false },
];

export const activityTimeline = [
  { time: "09:00 AM", event: "Data Collected", detail: "152 stations synced" },
  { time: "09:02 AM", event: "Model Processed", detail: "LSTM + XGBoost ensemble" },
  { time: "09:04 AM", event: "Source Classification", detail: "3 sources identified" },
  { time: "09:05 AM", event: "Forecast Generated", detail: "24-hour prediction ready" },
  { time: "09:06 AM", event: "Alert Issued", detail: "3 critical zones flagged" },
  { time: "09:07 AM", event: "Policy Engine Run", detail: "4 recommendations generated" },
];

export const healthRiskLevels = [
  { level: "Low", range: "0–50", color: "hsl(var(--aqi-good))", description: "Air quality is satisfactory", groups: "None" },
  { level: "Moderate", range: "51–100", color: "hsl(var(--aqi-moderate))", description: "Acceptable air quality", groups: "Unusually sensitive individuals" },
  { level: "High", range: "101–200", color: "hsl(var(--aqi-unhealthy))", description: "Health effects for sensitive groups", groups: "Children, Elderly, Asthma patients" },
  { level: "Severe", range: "201+", color: "hsl(var(--aqi-severe))", description: "Serious health effects for everyone", groups: "All residents, especially Children & Elderly" },
];
