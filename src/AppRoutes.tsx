import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";

import Layout from "./layouts/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              {" "}
              {/* Hide Navbar on the homepage */}
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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
