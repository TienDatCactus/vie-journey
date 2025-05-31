import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../services/contexts/auth/AuthContext";
import Fallback from "../handlers/loading/Fallback";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, isVerified, isLoading } = useAuth();
  const location = useLocation();

  // Make sure all hooks are called unconditionally at the top level
  useEffect(() => {
    // Handle notification for unverified users
    if (requireAuth && isAuthenticated && !isVerified) {
      enqueueSnackbar(
        "Please verify your email to access this page. Login again to resend the verification email.",
        { variant: "error" }
      );
    }
  }, [requireAuth, isAuthenticated, isVerified]);

  // All rendering logic should come after hooks
  if (isLoading) {
    return <Fallback />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAuth && isAuthenticated && !isVerified) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
