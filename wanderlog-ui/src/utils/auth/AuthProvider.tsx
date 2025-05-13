import { createContext, useContext, useState } from "react";
import axios from "axios";
import { ReactNode } from "react";

const AuthContext = createContext({});

interface User {
  email: string;
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  axios.defaults.baseURL = "http://localhost:8080/api/v1";
  const [user, setUser] = useState<User | null>(null);
  const login = async (email: string, password: string) => {
    const resp = await axios.post("user/login", { email, password });
    const token = resp.data;
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    window.localStorage.setItem("jwt", token);
    setUser({ email });
  };
  const register = async (email: string, password: string) => {
    const resp = await axios.post("user/register", { email, password });
    const token = resp.data;
    console.log("DEBUG: confirmation token = ", token);
  };
  const logout = () => {
    window.localStorage.removeItem("jwt");
    setUser(null);
  };

  const context = { user, login, register, logout };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
