import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "analyst" | "policymaker" | "fieldofficer";

export const roleLabels: Record<UserRole, string> = {
  analyst: "Environmental Analyst",
  policymaker: "Policy Maker",
  fieldofficer: "Field Officer",
};

export const roleDefaults: Record<UserRole, string> = {
  analyst: "/dashboard",
  policymaker: "/policy-insights",
  fieldofficer: "/map-view",
};

interface RoleContextType {
  role: UserRole;
  setRole: (r: UserRole) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const RoleContext = createContext<RoleContextType>({
  role: "analyst",
  setRole: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("analyst");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <RoleContext.Provider value={{ role, setRole, darkMode, toggleDarkMode }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
