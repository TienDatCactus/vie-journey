import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Account } from "../../utils/interfaces";
import {
  doForgotPassword,
  doGetUser,
  doLogin,
  doLoginWithGoogle,
  doLogout,
  doRegister,
  doResendVerificationEmail,
  doSendForgotPasswordEmail,
  doValidateAccessToken,
} from "../api";
import { LoginRespDTO } from "../api/dto";

const AuthContext = createContext({
  user: null as Account | null,
  setUser: (user: Account | null) => {},
  credential: {} as { userId: string },
  setCredential: (credential: { userId: string }) => {},
  isAuthenticated: false,
  isVerified: false,
  isAdmin: false,
  isLoading: true,
  // Add form handlers here
  handleLogin: async (email: string, password: string) =>
    ({ success: false } as AuthResponse),
  handleRegister: async (email: string, password: string, rePassword: string) =>
    ({ success: false } as AuthResponse),
  handleLogout: async () => ({ success: false } as AuthResponse),
  handleGoogleLogin: async () => {},
  handleSendForgotPasswordEmail: async (email: string) =>
    ({ success: false } as AuthResponse),
  handleResendVerificationEmail: async (email: string) =>
    ({ success: false } as AuthResponse),
  handleResetPassword: async (token: string, password: string) =>
    ({ success: false } as AuthResponse),
});

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Account | null>(null);
  const [credential, setCredential] = useState<{ userId: string }>(
    {} as { userId: string }
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form handler implementations
  const handleLogin = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      try {
        setIsLoading(true);
        const loginResp = (await doLogin({ email, password })) as
          | LoginRespDTO
          | undefined;

        if (loginResp && loginResp?.accessToken) {
          setCredential({ userId: loginResp?.userId || "" });
          return { success: true, data: loginResp };
        }

        return { success: false, message: "Login failed" };
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An error occurred during login",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleRegister = useCallback(
    async (
      email: string,
      password: string,
      rePassword: string
    ): Promise<AuthResponse> => {
      try {
        setIsLoading(true);
        if (password !== rePassword) {
          return {
            success: false,
            message: "Password and confirm password do not match",
          };
        }

        const resp = await doRegister({ email, password, rePassword });
        return {
          success: !!resp,
          message: resp
            ? "Registration successful. Please check your email."
            : "Registration failed",
          data: resp,
        };
      } catch (error) {
        console.error("Registration error:", error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Registration failed",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleLogout = useCallback(async (): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      await doLogout({ userId: credential?.userId || "" });

      // Clear user and credential state
      setUser(null);
      setCredential({} as { userId: string });

      // Remove token from local storage
      localStorage.removeItem("token");

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, we should still clear local state
      setUser(null);
      setCredential({} as { userId: string });
      localStorage.removeItem("token");

      return {
        success: true, // Consider logout successful even if API fails
        message: "Logged out with warnings",
      };
    } finally {
      setIsLoading(false);
    }
  }, [credential?.userId]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      await doLoginWithGoogle();
      // Note: The actual setting of user/credential happens when the OAuth callback occurs
    } catch (error) {
      console.error("Google login error:", error);
    }
  }, []);

  const handleSendForgotPasswordEmail = useCallback(
    async (email: string): Promise<AuthResponse> => {
      try {
        setIsLoading(true);
        const result = await doSendForgotPasswordEmail(email);
        return {
          success: !!result,
          message: result
            ? "Password reset link sent to your email"
            : "Failed to send reset link",
        };
      } catch (error) {
        console.error("Send forgot password email error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to send reset link",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleResendVerificationEmail = useCallback(
    async (email: string): Promise<AuthResponse> => {
      try {
        setIsLoading(true);
        const result = await doResendVerificationEmail(email);
        return {
          success: !!result,
          message: result
            ? "Verification email sent successfully"
            : "Failed to send verification email",
        };
      } catch (error) {
        console.error("Resend verification email error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to send verification email",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleResetPassword = useCallback(
    async (token: string, password: string): Promise<AuthResponse> => {
      try {
        setIsLoading(true);
        const result = await doForgotPassword(token, password);
        return {
          success: !!result,
          message: result
            ? "Password reset successfully"
            : "Failed to reset password",
        };
      } catch (error) {
        console.error("Reset password error:", error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Failed to reset password",
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Keep your existing useEffects for token loading, event handling, etc.
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
    isAdmin: user?.role === "ADMIN" || false,
    isLoading,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGoogleLogin,
    handleSendForgotPasswordEmail,
    handleResendVerificationEmail,
    handleResetPassword,
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
