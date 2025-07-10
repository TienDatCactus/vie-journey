import React, { useEffect } from "react";
import StatusDialog from "../components/Auth/elements/StatusDialog";
import { useAuthStore } from "../services/stores/useAuthStore";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loadCurrentUser, credential } = useAuthStore();
  useEffect(() => {
    const run = async () => {
      if (!credential?.token || user) return;
      await loadCurrentUser();
    };
    run();
  }, [credential?.token]);

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
