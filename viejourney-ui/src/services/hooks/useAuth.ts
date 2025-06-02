import useAuthStore from "../stores/AuthStore";

// Compatibility hook that provides the same API as the original useAuth
export function useAuth() {
  const {
    user,
    setUser,
    credential,
    setCredential,
    isAuthenticated,
    isVerified,
    isAdmin,
    isLoading,
  } = useAuthStore();

  return {
    user,
    setUser,
    credential,
    setCredential,
    isAuthenticated,
    isVerified,
    isAdmin,
    isLoading,
  };
}

export default useAuth;
