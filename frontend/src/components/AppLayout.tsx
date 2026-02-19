import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Activity, PieChart, TrendingUp, Shield, Map, Settings,
  LogOut, Menu, X, Wind, User, Bell, Moon, Sun, Download, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole, roleLabels } from "@/contexts/RoleContext";
import { alerts, currentAQI } from "@/data/mockData";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "AQI Prediction", path: "/aqi-prediction", icon: Activity },
  { title: "Source Analysis", path: "/source-analysis", icon: PieChart },
  { title: "Forecast", path: "/forecast", icon: TrendingUp },
  { title: "Policy Insights", path: "/policy-insights", icon: Shield },
  { title: "Map View", path: "/map-view", icon: Map },
  { title: "Settings", path: "/settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAlertBanner, setShowAlertBanner] = useState(currentAQI.value > 250);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, darkMode, toggleDarkMode } = useRole();

  const criticalCount = alerts.filter((a) => a.critical).length;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      {/* Alert Banner */}
      <AnimatePresence>
        {showAlertBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-between text-sm flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive-foreground animate-pulse" />
              <span className="font-medium">⚠ SEVERE AQI ALERT: Anand Vihar station recording AQI 346. Immediate action recommended.</span>
            </div>
            <button onClick={() => setShowAlertBanner(false)} className="hover:opacity-75">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-0 md:w-16"} flex-shrink-0 bg-sidebar text-sidebar-foreground transition-all duration-300 overflow-hidden flex flex-col`}
        >
          <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
            <Wind className="h-7 w-7 text-sidebar-primary flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-bold tracking-tight whitespace-nowrap">Pollution Intelligence</span>
            )}
          </div>

          <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                  {sidebarOpen && <span className="whitespace-nowrap">{item.title}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Role badge */}
          {sidebarOpen && (
            <div className="px-3 py-2 border-t border-sidebar-border">
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">Role</span>
              <p className="text-xs font-medium text-sidebar-primary">{roleLabels[role]}</p>
            </div>
          )}

          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
            >
              <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground">
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-sm font-semibold text-foreground hidden md:block">AI Pollution Intelligence System</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Export */}
              <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4" />
              </Button>

              {/* Dark mode */}
              <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setNotifOpen(!notifOpen)}>
                  <Bell className="h-4 w-4" />
                  {criticalCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                      {criticalCount}
                    </span>
                  )}
                </Button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <h4 className="text-sm font-semibold text-foreground">Alerts</h4>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {alerts.map((a) => (
                          <div key={a.id} className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start gap-2">
                              {a.critical && <span className="mt-1 h-2 w-2 rounded-full bg-destructive flex-shrink-0" />}
                              <div>
                                <p className="text-xs text-foreground font-medium">{a.message}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="text-xs text-muted-foreground hidden sm:block">Dr. Priya Sharma</span>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Export Report</h3>
                  <p className="text-xs text-muted-foreground">Generate official AQI analysis report</p>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Report Type</span><span className="font-medium text-foreground">Daily AQI Summary</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Region</span><span className="font-medium text-foreground">Delhi NCR</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Date</span><span className="font-medium text-foreground">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Format</span><span className="font-medium text-foreground">PDF (Mock)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowExportModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={() => { setShowExportModal(false); }}>
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
