import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Account, User } from "../../utils/interfaces";
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

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface AuthCredential {
  userId: string;
  token: string;
}

interface AuthState {
  user: User | null;
  credential: AuthCredential | null;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setCredential: (credential: AuthCredential | null) => void;
  setLoading: (isLoading: boolean) => void;

  // Auth handlers
  handleLogin: (email: string, password: string) => Promise<AuthResponse>;
  handleRegister: (
    email: string,
    password: string,
    rePassword: string
  ) => Promise<AuthResponse>;
  handleLogout: () => Promise<AuthResponse>;
  handleGoogleLogin: () => Promise<void>;
  handleSendForgotPasswordEmail: (email: string) => Promise<AuthResponse>;
  handleResendVerificationEmail: (email: string) => Promise<AuthResponse>;
  handleResetPassword: (
    token: string,
    password: string
  ) => Promise<AuthResponse>;

  // Initialization
  loadUserFromToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        credential: null,
        isLoading: false,

        setUser: (user) => set({ user }),
        setCredential: (credential) => set({ credential }),
        setLoading: (isLoading) => set({ isLoading }),

        handleLogin: async (email, password) => {
          try {
            set({ isLoading: true });
            const loginResp = (await doLogin({
              email,
              password,
            })) as LoginRespDTO;

            if (loginResp?.accessToken && loginResp?.userId) {
              set({
                credential: {
                  userId: loginResp.userId,
                  token: loginResp.accessToken,
                },
              });

              const user = await doGetUser({ userId: loginResp.userId });
              set({ user });

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
            set({ isLoading: false });
          }
        },

        handleRegister: async (email, password, rePassword) => {
          try {
            set({ isLoading: true });

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
            set({ isLoading: false });
          }
        },

        handleLogout: async () => {
          try {
            set({ isLoading: true });

            const cred = get().credential;
            if (cred?.userId) {
              await doLogout({ userId: cred.userId });
            }

            set({ user: null, credential: null });

            return { success: true, message: "Logged out successfully" };
          } catch (error) {
            console.error("Logout error:", error);
            set({ user: null, credential: null });

            return {
              success: true,
              message: "Logged out with warnings",
            };
          } finally {
            set({ isLoading: false });
          }
        },

        handleGoogleLogin: async () => {
          try {
            doLoginWithGoogle();
          } catch (error) {
            console.error("Google login error:", error);
          }
        },

        handleSendForgotPasswordEmail: async (email) => {
          try {
            set({ isLoading: true });
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
            set({ isLoading: false });
          }
        },

        handleResendVerificationEmail: async (email) => {
          try {
            set({ isLoading: true });
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
            set({ isLoading: false });
          }
        },

        handleResetPassword: async (token, password) => {
          try {
            set({ isLoading: true });
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
                error instanceof Error
                  ? error.message
                  : "Failed to reset password",
            };
          } finally {
            set({ isLoading: false });
          }
        },

        loadUserFromToken: async () => {
          const cred = get().credential;
          if (!cred?.token || get().user) return;

          try {
            set({ isLoading: true });

            const resp = await doValidateAccessToken(cred.token);
            if (resp?.userId) {
              const user = await doGetUser({ userId: resp.userId });
              set({ user });
            } else {
              set({ credential: null });
            }
          } catch (error) {
            console.error("Token validation failed:", error);
            set({ credential: null });
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          credential: state.credential,
        }),
      }
    )
  )
);
