import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Fallback from "../handlers/loading/Fallback";
import { useAuthStore } from "../../services/stores/useAuthStore";
import { PageTitle } from "./PageTitle";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const location = useLocation();

  const { isLoading, credential, user } = useAuthStore();
  const isAuthenticated = !!credential?.userId;
  const isVerified = !!user?.active;

  useEffect(() => {
    if (!requireAuth) return;

    if (user && !isAuthenticated) {
      enqueueSnackbar("You need to be logged in to access this page.", {
        variant: "warning",
      });
    } else if (user && !isVerified) {
      enqueueSnackbar(
        "Please verify your email to access this page. Login again to resend the verification email.",
        { variant: "error" }
      );
    }
  }, [requireAuth, isAuthenticated, isVerified]);

  if (isLoading) {
    return <Fallback />;
  }

  if (requireAuth && user && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireAuth && user && isAuthenticated && !isVerified) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      <PageTitle />
      {children || <Outlet />}
    </>
  );
};

export default ProtectedRoute;
