import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  const user = getUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;