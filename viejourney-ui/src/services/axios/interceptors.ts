import { AxiosInstance } from "axios";
import { getToken } from "../api/token";
import { trackStart, trackEnd, trackSuccessMessage } from "./operationTracker";
import { createErrorHandler } from "./errorHandler";
import type { CustomAxiosRequestConfig } from "./types";
import { handleTokenRefresh } from "./refreshtokenManager";

export const attachInterceptors = (http: AxiosInstance) => {
  const errorHandler = createErrorHandler({});

  http.interceptors.request.use(
    (config) => {
      trackStart();

      const token = getToken();
      if (token && !config.url?.includes("/auth/")) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      trackEnd();
      return Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    (response) => {
      trackEnd();

      const { data } = response;
      if (data?.status === "success" && data?.message) {
        trackSuccessMessage(data.message);
      }

      return response;
    },
    async (error) => {
      trackEnd();

      const original = error.config as CustomAxiosRequestConfig;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        const refreshResult = await handleTokenRefresh();
        if (refreshResult?.accessToken && original?.headers) {
          original.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
          return http(original);
        }
      }

      return errorHandler(error);
    }
  );
};
