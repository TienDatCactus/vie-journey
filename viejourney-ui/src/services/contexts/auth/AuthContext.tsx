import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { doGetUser } from "../../api";
import { useLocation } from "react-router-dom";

const AuthContext = createContext({
  user: null as User | null,
  setUser: (user: User | null) => {},
  credential: {} as { userId: string },
  setCredential: (credential: { userId: string }) => {},
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
  useEffect(() => {
    if (!!credential?.userId?.length && credential?.userId !== "") {
      const fetchUser = async () => {
        try {
          const response = await doGetUser({ userId: credential.userId });
          if (response) {
            setUser(response);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };
      fetchUser();
    }
  }, [credential]);
  const context = {
    user,
    setUser,
    credential,
    setCredential,
  };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
