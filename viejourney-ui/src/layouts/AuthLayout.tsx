import React, { useEffect, useState } from "react";
import StatusDialog from "../components/Auth/elements/StatusDialog";
import { useAuthStore } from "../services/stores/useAuthStore";

const StatusHandler = () => {
  const { user } = useAuthStore();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if ((user?.status === "INACTIVE" || user?.status === "BANNED") && !shown) {
      setShown(true);
    }
  }, [user?.status]);
  console.log(user?.status, shown ? "shown" : "not shown");
  if (!shown && (user?.status === "INACTIVE" || user?.status === "BANNED")) {
    return (
      <StatusDialog status={user.status} shown={shown} setShown={setShown} />
    );
  }

  return null;
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loadCurrentUser, loadUserInfo, info, credential } =
    useAuthStore();

  useEffect(() => {
    const run = async () => {
      if (!credential?.token || user) return;
      if (!info) {
        await loadUserInfo();
      }
      await loadCurrentUser();
    };
    run();
  }, [credential?.token, user, loadCurrentUser, loadUserInfo]);

  return (
    <>
      <StatusHandler />
      {children}
    </>
  );
};

export default AuthLayout;
