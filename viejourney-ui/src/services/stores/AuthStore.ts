import { create } from "zustand";
import { persist } from "zustand/middleware";
import { doGetUser, doValidateAccessToken } from "../api";

interface User {
  userId: string;
  email: string;
  role: string;
  active: boolean;
}

interface Credential {
  userId: string;
}

interface AuthState {
  // State
  user: User | null;
  credential: Credential;
  isLoading: boolean;

  // Computed properties
  isAuthenticated: boolean;
  isVerified: boolean;
  isAdmin: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setCredential: (credential: Credential) => void;
  setLoading: (isLoading: boolean) => void;

  // Thunks (async actions)
  validateToken: (token: string) => Promise<void>;
  fetchUser: (userId: string) => Promise<void>;
  initialize: () => Promise<void>;
  logout: () => void;
}

// Create the store with persist middleware for token storage
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      credential: {} as Credential,
      isLoading: true,

      // Computed properties using getters
      get isAuthenticated() {
        return !!get().user;
      },

      get isVerified() {
        return get().user?.active || false;
      },

      get isAdmin() {
        return get().user?.role === "admin" || false;
      },

      // Actions
      setUser: (user) => set({ user }),
      setCredential: (credential) => set({ credential }),
      setLoading: (isLoading) => set({ isLoading }),

      // Thunks
      validateToken: async (tokenString) => {
        set({ isLoading: true });
        try {
          const parsedToken = JSON.parse(tokenString);
          if (parsedToken.accessToken) {
            const resp = await doValidateAccessToken(parsedToken.accessToken);
            if (resp?.userId) {
              set({ credential: { userId: resp.userId } });
              return;
            }
          }
          // If we get here, token is invalid
          get().logout();
        } catch (error) {
          console.error("Error validating token:", error);
          // Clear invalid token
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUser: async (userId) => {
        set({ isLoading: true });
        try {
          const response = await doGetUser({ userId });
          if (response) {
            set({ user: response });
          } else {
            get().logout();
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          get().logout();
        } finally {
          set({ isLoading: false });
        }
      },

      initialize: async () => {
        set({ isLoading: true });
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          set({ isLoading: false });
          return;
        }

        try {
          await get().validateToken(storedToken);

          // If we have a userId, fetch the user
          const { userId } = get().credential;
          if (userId && userId.length > 0) {
            await get().fetchUser(userId);
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Error during initialization:", error);
          get().logout();
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          credential: {} as Credential,
          isLoading: false,
        });
        window.dispatchEvent(new Event("auth:logout"));
      },
    }),
    {
      // Persist options
      name: "auth-storage",
      partialize: (state) => ({
        credential: state.credential,
      }),
    }
  )
);

export default useAuthStore;
