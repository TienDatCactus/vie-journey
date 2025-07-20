import { create } from "zustand";
import { getDashboardAnalytics } from "../api";
import { DashboardAnalyticsResponse } from "../../utils/interfaces/admin";

interface AdminAnalyticsState {
  // Loading states
  loading: boolean;
  error: string | null;

  // Analytics data
  analytics: DashboardAnalyticsResponse | null;
  timeRange: "7d" | "30d" | "90d" | "1y";

  // Actions
  fetchAnalytics: (timeRange?: "7d" | "30d" | "90d" | "1y") => Promise<void>;
  setTimeRange: (timeRange: "7d" | "30d" | "90d" | "1y") => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  loading: false,
  error: null,
  analytics: null,
  timeRange: "30d" as const,
};

export const useAdminAnalyticsStore = create<AdminAnalyticsState>(
  (set, get) => ({
    ...initialState,

    fetchAnalytics: async (timeRange) => {
      const currentTimeRange = timeRange || get().timeRange;

      set({ loading: true, error: null });

      try {
        const data = await getDashboardAnalytics(currentTimeRange);

        if (data) {
          set({
            analytics: data,
            timeRange: currentTimeRange,
            loading: false,
            error: null,
          });
        } else {
          set({
            loading: false,
            error: "No data received from analytics API",
          });
        }
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch analytics data",
        });
      }
    },

    setTimeRange: (timeRange) => {
      set({ timeRange });
      // Automatically fetch new data when time range changes
      get().fetchAnalytics(timeRange);
    },

    clearError: () => {
      set({ error: null });
    },

    reset: () => {
      set(initialState);
    },
  })
);

// Selector hooks for better performance
export const useAnalyticsData = () =>
  useAdminAnalyticsStore((state) => state.analytics);
export const useAnalyticsLoading = () =>
  useAdminAnalyticsStore((state) => state.loading);
export const useAnalyticsError = () =>
  useAdminAnalyticsStore((state) => state.error);
export const useAnalyticsTimeRange = () =>
  useAdminAnalyticsStore((state) => state.timeRange);
