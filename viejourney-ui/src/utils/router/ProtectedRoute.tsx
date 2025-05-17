import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../services/contexts/auth/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component that controls access to routes based on authentication status
 * @param requireAuth - if true, route requires authentication; if false, route requires user to be unauthenticated
 * @param children - optional children to render inside the route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { credential } = useAuth();
  const location = useLocation();

  // If requireAuth is true and user is not logged in, redirect to login
  // if (!requireAuth && !credential) {
  //   return <Navigate to="/landing" state={{ from: location }} replace />;
  // }
  if (requireAuth && !credential) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If requireAuth is false and user is logged in, redirect to home
  // This is for routes like login/register that shouldn't be accessible when logged in
  if (!requireAuth && credential && credential.userId) {
    return <Navigate to="/" replace />;
  }

  // Render children or outlet
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
