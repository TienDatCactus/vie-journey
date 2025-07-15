import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Account, UserInfo } from "../../utils/interfaces";
import {
  doForgotPassword,
  doGetUser,
  doGetUserInfo,
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
  user: Account | null;
  info: UserInfo | null;
  credential: AuthCredential | null;
  isLoading: boolean;

  // Actions
  setUser: (user: Account | null) => void;
  setCredential: (credential: AuthCredential | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInfo: (info: UserInfo | null) => void;
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
  loadCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        info: null,
        credential: null,
        isLoading: false,

        setUser: (user) => set({ user }),
        setInfo: (info) => set({ info }),
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

        loadCurrentUser: async () => {
          const { credential, user } = get();
          if (!credential?.token || user) return;
          try {
            set({ isLoading: true });

            let userId = credential.userId;
            if (!userId) {
              const resp = await doValidateAccessToken(credential.token);
              if (!resp?.userId) {
                set({ credential: null });
                return;
              }
              userId = resp.userId;
            }

            const [user, info] = await Promise.all([
              doGetUser({ userId }),
              doGetUserInfo(userId),
            ]);

            set({ user, info });
          } catch (err) {
            console.error("loadCurrentUser failed:", err);
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
