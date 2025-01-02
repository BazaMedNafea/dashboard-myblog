import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";

import Layout from "./layouts/Layout";

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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
