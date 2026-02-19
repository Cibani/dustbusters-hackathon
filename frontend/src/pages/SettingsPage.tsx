import { motion } from "framer-motion";
import { User, Building, Briefcase, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { userProfile } from "@/data/mockData";
import { useRole, roleLabels } from "@/contexts/RoleContext";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { role, darkMode, toggleDarkMode } = useRole();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings & Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Account information and preferences</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{userProfile.name}</h3>
            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: Building, label: "Organization", value: userProfile.organization },
            { icon: Briefcase, label: "Role", value: roleLabels[role] },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-28">{item.label}</span>
              <span className="text-sm font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Preferences</h3>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm text-foreground">Dark Mode</span>
          </div>
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    </motion.div>
  );
}
