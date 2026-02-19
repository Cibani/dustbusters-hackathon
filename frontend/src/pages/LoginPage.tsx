import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wind, Mail, Lock, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRole, UserRole, roleLabels, roleDefaults } from "@/contexts/RoleContext";

const roles: { value: UserRole; icon: string; desc: string }[] = [
  { value: "analyst", icon: "📊", desc: "Charts & Analytics" },
  { value: "policymaker", icon: "🏛️", desc: "Policy Insights" },
  { value: "fieldofficer", icon: "🗺️", desc: "Map & Alerts" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Please fill in all fields");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        role
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed");
      setLoading(false);
      return;
    }

    // Save token
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    setLoading(false);

    // Redirect based on backend role
    navigate(roleDefaults[data.role]);

  } catch (err) {
    setError("Server error. Please try again.");
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center mb-4">
              <Wind className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AI Pollution Intelligence</h1>
            <p className="text-sm text-muted-foreground mt-1">Environmental Monitoring System</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" /> Select Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                    role === r.value
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-lg">{r.icon}</span>
                  <span className="text-[10px] font-semibold text-foreground leading-tight">{roleLabels[r.value]}</span>
                  <span className="text-[9px] text-muted-foreground">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="analyst@cpcb.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
                {error}
              </motion.p>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me</label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Government of India · CPCB Authorized Access Only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
