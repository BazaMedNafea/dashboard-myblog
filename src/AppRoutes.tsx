// src/AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Homepage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout hideNavbar>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout hideNavbar>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
