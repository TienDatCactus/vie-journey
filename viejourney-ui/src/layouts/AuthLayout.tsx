import React, { useEffect } from "react";
import { useAuthStore } from "../services/stores/useAuthStore";
import StatusDialog from "../components/Auth/elements/StatusDialog";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loadUserFromToken, credential, loadUserInfo, info } =
    useAuthStore();
  useEffect(() => {
    if (credential?.userId && !user) {
      loadUserFromToken();
    }
  }, [credential, user, loadUserFromToken]);

  useEffect(() => {
    if (user && !info) {
      loadUserInfo();
    }
  }, [user, info, loadUserInfo]);

  return (
    <>
      {user?.status &&
        React.createElement(() => {
          const [shown, setShown] = React.useState(false);

          React.useEffect(() => {
            if (user.status && !shown) {
              setShown(true);
            }
          }, [user.status]);

          return !shown ? <StatusDialog status={user?.status} /> : null;
        })}
      {children}
    </>
  );
};

export default AuthLayout;
