import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LogBook from "./pages/LogBook";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Admin from "./pages/Admin";
import AdminPanel from "./pages/AdminPanel";

import NotFound from "./components/NotFound";
import Loader from "./components/Loader";

import EmailProtectedRoute from "./components/EmailProtectedRoute"; // ⬅️ NEW

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      {loading && <Loader />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/logbook" element={<LogBook />} />

        {/* Protected by EMAIL */}
        <Route
          path="/login"
          element={
            <EmailProtectedRoute>
              <Login />
            </EmailProtectedRoute>
          }
        />

        <Route
          path="/logout"
          element={
            <EmailProtectedRoute>
              <Logout />
            </EmailProtectedRoute>
          }
        />

        {/* Admin Login */}
        <Route path="/admin" element={<Admin />} />

        {/* Admin Panel (public for now) */}
        <Route path="/panel" element={<AdminPanel />} />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
