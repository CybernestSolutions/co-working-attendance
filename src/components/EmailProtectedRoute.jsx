import { Navigate, useLocation } from "react-router-dom";

export default function EmailProtectedRoute({ children }) {
  const location = useLocation();

  // Must have email in navigation state
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/logbook" replace />;
  }

  return children;
}
