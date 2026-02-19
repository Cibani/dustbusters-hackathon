import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AQIPredictionPage from "./pages/AQIPredictionPage";
import SourceAnalysisPage from "./pages/SourceAnalysisPage";
import ForecastPage from "./pages/ForecastPage";
import PolicyInsightsPage from "./pages/PolicyInsightsPage";
import MapViewPage from "./pages/MapViewPage";
import SettingsPage from "./pages/SettingsPage";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function LayoutRoute({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<LayoutRoute><DashboardPage /></LayoutRoute>} />
            <Route path="/aqi-prediction" element={<LayoutRoute><AQIPredictionPage /></LayoutRoute>} />
            <Route path="/source-analysis" element={<LayoutRoute><SourceAnalysisPage /></LayoutRoute>} />
            <Route path="/forecast" element={<LayoutRoute><ForecastPage /></LayoutRoute>} />
            <Route path="/policy-insights" element={<LayoutRoute><PolicyInsightsPage /></LayoutRoute>} />
            <Route path="/map-view" element={<LayoutRoute><MapViewPage /></LayoutRoute>} />
            <Route path="/settings" element={<LayoutRoute><SettingsPage /></LayoutRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
