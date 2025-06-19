import axios from "axios";
import { enqueueSnackbar, SnackbarKey } from "notistack";
import { refreshToken } from "../api";
import { getToken } from "../api/token";

// Helper function to trim data before sending
const trimData = (data: any): any => {
  if (!data) return data;
  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map((item) => trimData(item));
  }

  const result: Record<string, any> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (typeof value === "string") {
        result[key] = value.trim();
      } else if (typeof value === "object" && value !== null) {
        result[key] = trimData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
};

interface ErrorHandlerOptions {
  redirectOnUnauthorized?: boolean;
  loginRedirectPath?: string;
  defaultSystemErrorMessage?: string;
  logger?: (message: string, error?: any) => void;
  authErrorExceptions?: string[];
}

// Track recent snackbar messages to prevent duplicates
const recentMessages = new Map<
  string,
  { key: SnackbarKey; timestamp: number }
>();
const MESSAGE_DEBOUNCE_TIME = 3000; // 3 seconds

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to add request to queue
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to resolve all queued requests after token refresh
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const onRefreshFailure = () => {
  refreshSubscribers = [];
};

/**
 * Show snackbar message with debouncing to prevent duplicates
 * @param message The message to display
 * @param options Snackbar options
 * @returns The snackbar key if shown, null if debounced
 */
const showDebouncedSnackbar = (message: string, options: any = {}) => {
  const messageKey = `${message}-${options.variant || "default"}`;
  const now = Date.now();
  const recent = recentMessages.get(messageKey);
  if (recent && now - recent.timestamp < MESSAGE_DEBOUNCE_TIME) {
    return null;
  }
  const key = enqueueSnackbar(message, options);
  recentMessages.set(messageKey, { key, timestamp: now });
  setTimeout(() => {
    if (recentMessages.has(messageKey)) {
      recentMessages.delete(messageKey);
    }
  }, MESSAGE_DEBOUNCE_TIME + 1000);

  return key;
};

const http = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: import.meta.env.VITE_PRIVATE_URL,
  withCredentials: true,
  timeout: 60000,
});

let currentOperationCount = 0;
let pendingMessages = new Map<string, number>(); // message -> count

/**
 * Tracks the start of an operation that might produce a snackbar
 */
const trackOperationStart = () => {
  currentOperationCount++;
  return currentOperationCount;
};

const trackOperationEnd = () => {
  currentOperationCount--;

  // When all operations complete, show consolidated messages
  if (currentOperationCount === 0 && pendingMessages.size > 0) {
    // Show consolidated success message if there are multiple
    const successMessages = [...pendingMessages.entries()]
      .filter(([message]) => message.includes("success"))
      .sort((a, b) => b[1] - a[1]); // Sort by count descending

    if (successMessages.length === 1) {
      // Single success message
      showDebouncedSnackbar(successMessages[0][0], {
        variant: "success",
        autoHideDuration: 3000,
      });
    } else if (successMessages.length > 1) {
      // Multiple success messages, consolidate them
      showDebouncedSnackbar(
        `${successMessages.length} operations completed successfully`,
        {
          variant: "success",
          autoHideDuration: 3000,
        }
      );
    }

    // Clear pending messages
    pendingMessages.clear();
  }
};

// Parse response body for custom API status codes
const parseBody = (response: any) => {
  const resData = response.data;

  if (response?.status === 200) {
    if (resData.StatusCode === 401) {
      localStorage.removeItem("token");
      window.location.replace("/auth/login");
      return;
    }

    // Handle custom status codes
    if (resData.Status === -2) return resData; // ma sp, ten sp ton tai
    if (resData.Status === 0) return resData; // API tra ve success

    if (resData.Status !== -1 && resData.Object) {
      showDebouncedSnackbar(resData.Object, { variant: "error" });
    }

    if (resData.Status !== 1 && resData.Object) {
      return {
        ...resData,
        object: resData.Object,
      };
    }
  }

  return response;
};

const createErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    redirectOnUnauthorized = window.location.pathname !== "/auth/login",
    loginRedirectPath = "/auth/login",
    defaultSystemErrorMessage = "Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc liên hệ với quản trị viên.",
    logger = console.error,
    authErrorExceptions = [
      "Invalid credentials",
      "Invalid email or password",
      "Thông tin đăng nhập không chính xác",
    ],
  } = options;

  // Vietnamese error messages by status code
  const errorMessages: Record<number, string> = {
    400: "Invalid request. Please check the information.",
    401: "Session has expired. Please log in again.",
    403: "You do not have access. Please contact the administrator.",
    404: "Requested resource not found.",
    405: "Method not allowed.",
    406: "Not acceptable format.",
    408: "Request timeout. Please try again.",
    409: "Data conflict. Please check the information.",
    422: "Unprocessable entity. Please check the information.",
    429: "Too many requests. Please wait and try again.",
    500: "Internal server error. Please try again later.",
    501: "Not implemented.",
    502: "Server is having issues. Please try again later.",
    503: "Service unavailable. Please try again later.",
    504: "Gateway timeout. Please try again.",
  };

  const errorHandler = async (err: any): Promise<never> => {
    logger("Error caught:", err);
    const responseData = err?.response?.data;
    const status =
      err?.response?.statusCode || err?.response?.status || err?.status;

    // Extract error message from response data with priority order
    let errorMessage = null;

    // First check for API-specific error formats
    if (responseData) {
      if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.Object) {
        errorMessage = responseData.Object;
      } else if (
        err.message &&
        !err.message.includes("Network Error") &&
        !err.message.includes("timeout")
      ) {
        errorMessage = err.message;
      }
    }

    // Get validation errors if any
    const errors = responseData?.errors;

    // Network or connection errors
    if (err.code === "ECONNABORTED" || (!status && !errorMessage)) {
      showDebouncedSnackbar(
        "Lost connection. Please check the network connection.",
        {
          variant: "error",
          autoHideDuration: 3000,
        }
      );
      return Promise.reject(err);
    }

    // Handle 401 unauthorized errors specially
    if (status === 401) {
      // Check if this is a login attempt with invalid credentials
      const isAuthErrorException = authErrorExceptions.some(
        (exceptionMsg) =>
          errorMessage &&
          typeof errorMessage === "string" &&
          errorMessage.toLowerCase().includes(exceptionMsg.toLowerCase())
      );

      if (isAuthErrorException) {
        showDebouncedSnackbar(errorMessage || "Invalid username or password", {
          variant: "error",
          autoHideDuration: 3000,
        });
      } else {
        localStorage.removeItem("token");
        if (redirectOnUnauthorized) {
          showDebouncedSnackbar(
            "Your session has expired. Please log in again.",
            {
              variant: "error",
              autoHideDuration: 3000,
            }
          );
          if (
            window.location.pathname !== loginRedirectPath &&
            window.location.pathname !== "/"
          ) {
            setTimeout(() => {
              window.location.replace(loginRedirectPath);
            }, 1000);
          }
        }
      }

      return Promise.reject(err);
    }

    // Server errors (500+)
    if (status >= 500 && !errorMessage) {
      showDebouncedSnackbar(
        `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc liên hệ với quản trị viên. (SC${status})`,
        { variant: "error", autoHideDuration: 5000 }
      );
      return Promise.reject(err);
    }

    // Priority order for error messages:
    // 1. Use message from response if available
    // 2. If error has validation errors, include those details
    // 3. If no message, use status code based message
    // 4. Fall back to default message

    if (errorMessage) {
      // If we have specific validation errors, include those details
      if (errors) {
        const errorDetails = Array.isArray(errors)
          ? errors.join(", ")
          : typeof errors === "object"
          ? Object.values(errors).join(", ")
          : errors.toString();

        showDebouncedSnackbar(`${errorMessage}: ${errorDetails}`, {
          variant: "error",
          autoHideDuration: 5000,
        });
      } else {
        // Just show the error message from response
        showDebouncedSnackbar(errorMessage, {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    } else if (status && status in errorMessages) {
      // No message from response, use status code based message
      showDebouncedSnackbar(errorMessages[status], {
        variant: "error",
        autoHideDuration: 3000,
      });
    } else {
      // Last resort: default error message
      showDebouncedSnackbar(defaultSystemErrorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }

    return Promise.reject(err);
  };

  return errorHandler;
};

// Usage example
const handleError = createErrorHandler({
  redirectOnUnauthorized: true,
  loginRedirectPath: "/auth/login",
  defaultSystemErrorMessage:
    "Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc liên hệ với quản trị viên.",
  authErrorExceptions: [
    "Invalid credentials",
    "Invalid email or password",
    "Thông tin đăng nhập không chính xác",
  ],
  logger: (message, error) => {
    console.error(message, error);
  },
});

// Success response interceptor
http.interceptors.response.use(
  (response) => {
    // Parse response for custom status codes
    const parsedResponse = parseBody(response);
    if (!parsedResponse) return;

    // Handle success messages
    const { data } = parsedResponse;
    if (data && data.status === "success" && data.message) {
      if (currentOperationCount > 1) {
        const message = data.message;
        pendingMessages.set(message, (pendingMessages.get(message) || 0) + 1);
      } else {
        showDebouncedSnackbar(data.message, {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
    }

    trackOperationEnd();
    return parsedResponse;
  },
  async (error) => {
    trackOperationEnd();

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
      ].some((endpoint) => originalRequest.url?.includes(endpoint));

      if (isAuthEndpoint) {
        console.log(
          "Auth endpoint returned 401, not attempting refresh",
          originalRequest.url
        );
        return handleError(error);
      }

      console.log("Received 401 error, attempting token refresh", {
        url: originalRequest.url,
        method: originalRequest.method,
      });

      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(http(originalRequest));
            });
          });
        }

        isRefreshing = true;
        const refreshResult = await refreshToken();
        if (refreshResult && refreshResult.accessToken) {
          // Update Authorization header
          originalRequest.headers.Authorization = `Bearer ${refreshResult.accessToken}`;

          console.log("Token refresh successful, retrying original request", {
            url: originalRequest.url,
            method: originalRequest.method,
          });

          // Notify subscribers
          onTokenRefreshed(refreshResult.accessToken);

          // Reset refreshing state
          isRefreshing = false;

          // Retry original request
          return http(originalRequest);
        } else {
          // If refresh failed, redirect
          console.log("Token refresh failed, redirecting to login");
          onRefreshFailure();
          isRefreshing = false;
          return handleError(error);
        }
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshFailure();
        return handleError(error);
      }
    }

    return handleError(error);
  }
);

// Request interceptor for token checking and tracking operations
http.interceptors.request.use(
  async (config) => {
    // Track the start of this operation
    const operationId = trackOperationStart();
    config.headers["X-Operation-ID"] = operationId;

    // Trim request data if it's not a FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.data = trimData(config.data);
    }

    // Add upload progress tracking if needed
    if (config.data instanceof FormData) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.floor(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        // You can dispatch progress updates here if needed
        console.debug(`Upload progress: ${percentCompleted}%`);
      };
    }

    const isAuthEndpoint = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
    ].some((endpoint) => config.url?.includes(endpoint));

    if (!isAuthEndpoint) {
      const accessToken = getToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    // Track operation completion even on request error
    trackOperationEnd();
    return Promise.reject(error);
  }
);

// Export file download utility
export const httpGetFile = (path = "", optionalHeader = {}) =>
  http({
    method: "GET",
    url: path,
    responseType: "blob",
    headers: { ...optionalHeader },
  });

// Export the enhanced methods for use in components
export const enhancedHttp = {
  ...http,
  /**
   * Group multiple operations to show single consolidated snackbar
   * @param callback Function containing multiple API calls
   * @returns Result from the callback function
   */
  bulkOperations: async <T>(callback: () => Promise<T>): Promise<T> => {
    // Force operation count to at least 2 to trigger batching
    trackOperationStart();
    try {
      return await callback();
    } finally {
      trackOperationEnd();
    }
  },
  /**
   * Download a file and save it with the specified filename
   * @param url The URL to download from
   * @param filename The name to save the file as
   * @returns Promise that resolves when download completes
   */
  downloadFile: async (url: string, filename: string) => {
    try {
      const response = await httpGetFile(url);
      // Create blob link to download
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  },
};

export default http;
