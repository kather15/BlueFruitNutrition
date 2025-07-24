import { useAuth } from "../../global/hooks/useAuth.js";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

function RouteProtected({ children }) {
  const { user } = useAuth();

  if (!user) {
    toast.error("You must be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  return children;
}