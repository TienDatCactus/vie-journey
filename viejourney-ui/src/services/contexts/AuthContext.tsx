import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { doGetUser, doValidateAccessToken } from "../api";

const AuthContext = createContext({
  user: null as User | null,
  setUser: (user: User | null) => {},
  credential: {} as { userId: string },
  setCredential: (credential: { userId: string }) => {},
  isAuthenticated: false,
  isVerified: false,
  isAdmin: false,
  isLoading: true, // Add loading state
});

interface User {
  userId: string;
  email: string;
  role: string;
  active: boolean;
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credential, setCredential] = useState<{ userId: string }>(
    {} as { userId: string }
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const parsedToken = JSON.parse(storedToken);
          if (parsedToken.accessToken) {
            const resp = await doValidateAccessToken(parsedToken.accessToken);
            setCredential({
              userId: resp?.userId || "",
            });
          } else {
            console.log("Stored token missing userId");
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error parsing stored token:", error);
          localStorage.removeItem("token"); // Remove invalid token
          setIsLoading(false);
        }
      } else {
        console.log("No stored token found");
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Handle auth events (logout and refresh-failed)
  useEffect(() => {
    const handleRefreshFailure = () => {
      console.log("Handling auth:refresh-failed event");
      setUser(null);
      setCredential({} as { userId: string });
      setIsLoading(false);
    };

    const handleLogout = () => {
      console.log("Handling auth:logout event");
      setUser(null);
      setCredential({} as { userId: string });
      setIsLoading(false);
    };

    window.addEventListener("auth:refresh-failed", handleRefreshFailure);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:refresh-failed", handleRefreshFailure);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  useEffect(() => {
    if (credential?.userId && credential.userId.length > 0) {
      const fetchUser = async () => {
        try {
          setIsLoading(true);
          const response = await doGetUser({ userId: credential.userId });
          if (response) {
            setUser(response);
          } else {
            setUser(null);
            setCredential({} as { userId: string });
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    } else if (Object.keys(credential).length > 0) {
      setIsLoading(false);
    }
  }, [credential?.userId]);
  const context = {
    user,
    setUser,
    credential,
    setCredential,
    isAuthenticated: !!user,
    isVerified: user?.active || false,
    isAdmin: user?.role === "admin" || false,
    isLoading,
  };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
export default AuthProvider;
