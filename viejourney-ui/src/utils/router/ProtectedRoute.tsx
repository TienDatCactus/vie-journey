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
  const isVerified = user?.status === "ACTIVE";
  console.log(isAuthenticated);
  console.log(requireAuth);
  useEffect(() => {
    if (!requireAuth) return;
    if (!isAuthenticated) {
      enqueueSnackbar("You need to be logged in to access this page.", {
        variant: "warning",
      });
    } else if (user && !isVerified) {
      enqueueSnackbar(
        "Please verify your email to access this page. Login again to resend the verification email.",
        { variant: "error" }
      );
    }
  }, [requireAuth, isAuthenticated, isVerified, user]);

  if (isLoading) {
    return <Fallback />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireAuth && isAuthenticated && user && !isVerified) {
    // Authenticated but not verified
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
