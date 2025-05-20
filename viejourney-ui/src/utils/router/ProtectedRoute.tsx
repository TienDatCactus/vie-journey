import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../services/contexts/auth/AuthContext";
import { enqueueSnackbar } from "notistack";
import RefreshIcon from "@mui/icons-material/Refresh";
import Fallback from "../handlers/loading/Fallback";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, isVerified, user, credential, isLoading } =
    useAuth();
  const location = useLocation();

  // Show loading spinner when authentication is still in progress
  if (isLoading) {
    console.log("Auth is loading - showing spinner");
    return <Fallback />;
  }

  // Redirect unauthenticated users to login
  if (requireAuth && !isAuthenticated) {
    console.log("User is not authenticated");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect verified users away from login/register
  if (!requireAuth && isAuthenticated) {
    console.log("User is authenticated");
    return <Navigate to="/" replace />;
  }

  // Show warning and redirect if user is not verified
  useEffect(() => {
    if (requireAuth && isAuthenticated && !isVerified) {
      enqueueSnackbar(
        "Please verify your email to access this page. Login again to resend the verification email.",
        { variant: "error" }
      );
    }
  }, [requireAuth, isAuthenticated, isVerified]);

  if (requireAuth && isAuthenticated && !isVerified) {
    console.log("User is not verified");
    enqueueSnackbar(
      "Please verify your email to access this page. Login again to resend the verification email.",
      { variant: "error" }
    );
    return <Navigate to="/auth/login" replace />;
  }

  // Authorized and verified
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
