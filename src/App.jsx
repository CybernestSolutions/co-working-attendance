import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LogBook from "./pages/LogBook";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NotFound from "./components/NotFound"; // your 404 page
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* ✅ Only accessible if connected to TBIDO WiFi */}
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
  );
}
