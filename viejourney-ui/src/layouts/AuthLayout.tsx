import React, { useEffect } from "react";
import { useAuthStore } from "../services/stores/useAuthStore";
import StatusDialog from "../components/Auth/elements/StatusDialog";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loadUserFromToken, credential, loadUserInfo, info } =
    useAuthStore();
  useEffect(() => {
    const initUser = async () => {
      if (credential?.userId && !user) {
        await loadUserFromToken();
      }
    };
    initUser();
  }, [credential?.userId != null, user == null, loadUserFromToken]);

  useEffect(() => {
    const fetchInfo = async () => {
      if (user && !info) {
        await loadUserInfo();
      }
    };
    fetchInfo();
  }, [user != null, info == null, loadUserInfo]);

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
