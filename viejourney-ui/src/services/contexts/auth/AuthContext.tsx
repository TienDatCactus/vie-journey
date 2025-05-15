import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { doGetUser } from "../../api";

const AuthContext = createContext({
  user: null as User | null,
  setUser: (user: User | null) => {},
});

interface User {
  _id: string;
  email: string;
  role: string;
  active: boolean;
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>();

  useEffect(() => {
    console.log(token);
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const resp = await doGetUser();
          if (resp) {
            setUser(resp?.data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserProfile();
    }
  }, []);
  const context = {
    user,
    setUser,
  };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
