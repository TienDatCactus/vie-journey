import React, { useEffect } from "react";
import StatusDialog from "../components/Auth/elements/StatusDialog";
import { useAuthStore } from "../services/stores/useAuthStore";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loadUserFromToken, credential, loadUserInfo, info } =
    useAuthStore();
  // In AuthLayout.tsx
  useEffect(() => {
    const initializeAuth = async () => {
      if (credential?.userId && !user) {
        await loadUserFromToken();
      }
      if (user && !info) {
        await loadUserInfo();
      }
    };
    initializeAuth();
  }, [credential?.userId, user, info, loadUserFromToken, loadUserInfo]);
  return (
    <>
      {user?.status &&
        React.createElement(() => {
          const [shown, setShown] = React.useState(false);

          React.useEffect(() => {
            if (user.status && !shown) {
              setShown(true);
            }
          }, [user.status == "INACTIVE" || user.status == "BANNED"]);

          return !shown ? <StatusDialog status={user?.status} /> : null;
        })}
      {children}
    </>
  );
};

export default AuthLayout;
