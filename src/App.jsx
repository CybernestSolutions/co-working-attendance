import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LogBook from "./pages/LogBook";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader"; 

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      {loading && <Loader />} {/* ✅ Correct component */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/logbook"
          element={
            <ProtectedRoute>
              <LogBook />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
