// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useRef } from "react";
import { getUserInfo } from "../services/user";
import { refreshToken } from "../services/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Replace with your user type
  login: () => void;
  logout: () => void;
  refreshAuth: () => Promise<void>; // Add refreshAuth function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null); // Replace with your user type
  const hasFetched = useRef(false); // Track whether the request has been made

  const login = () => {
    setIsAuthenticated(true);
    // Fetch user info after login
    getUserInfo().then((data) => setUser(data));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshAuth = async () => {
    if (hasFetched.current) return; // Skip if already fetched
    hasFetched.current = true; // Mark as fetched

    try {
      await refreshToken(); // Refresh the token
      const userData = await getUserInfo(); // Fetch updated user info
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to refresh token:", err);
      logout(); // Logout if token refresh fails
      throw err; // Rethrow the error to trigger a redirect in ProtectedRoute
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, refreshAuth }}
    >
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
