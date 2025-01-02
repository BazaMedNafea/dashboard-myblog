// src/contexts/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import { getUserInfo } from "../services/user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Replace with your user type
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null); // Replace with your user type

  const login = () => {
    setIsAuthenticated(true);
    // Fetch user info after login
    getUserInfo().then((data) => setUser(data));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
