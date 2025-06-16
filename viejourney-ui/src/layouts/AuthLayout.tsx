import React, { useEffect } from "react";
import { useAuthStore } from "../services/stores/useAuthStore";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loadUserFromToken, credential } = useAuthStore();

  useEffect(() => {
    if (credential?.userId && !user) {
      loadUserFromToken();
    }
  }, [credential, user, loadUserFromToken]);

  return <>{children}</>;
};

export default AuthLayout;
