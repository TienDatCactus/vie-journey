import { useEffect } from "react";
import useAuthStore from "./AuthStore";

export const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();

    // Handle auth events (logout and refresh-failed)
    const handleRefreshFailure = () => {
      console.log("Handling auth:refresh-failed event");
      useAuthStore.getState().logout();
    };

    window.addEventListener("auth:refresh-failed", handleRefreshFailure);

    return () => {
      window.removeEventListener("auth:refresh-failed", handleRefreshFailure);
    };
  }, [initialize]);

  // Option 1: Show nothing during initialization
  // if (isLoading) return null;

  // Option 2: Show loading spinner
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return <>{children}</>;
};

export default AuthInitializer;
