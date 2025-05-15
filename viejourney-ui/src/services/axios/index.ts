import axios from "axios";
import { showSnackbar } from "../snackbar/ShowSnackbar";
import { getAccessToken, isTokenValid } from "../api/token";
import { refreshToken } from "../api";
import { useAuth } from "../contexts";

interface ErrorHandlerOptions {
  redirectOnUnauthorized?: boolean;
  loginRedirectPath?: string;
  defaultSystemErrorMessage?: string;
  logger?: (message: string, error?: any) => void;
  authErrorExceptions?: string[];
}

// Create an Axios instance with default config
const http = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: import.meta.env.VITE_PRIVATE_URL,
});

const createErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    redirectOnUnauthorized = true,
    loginRedirectPath = "/auth/login",
    defaultSystemErrorMessage = "The system is experiencing issues. Please try again later.",
    logger = console.error,
    // List of auth error messages that should NOT trigger a redirect
    authErrorExceptions = ["Invalid credentials", "Invalid email or password"],
  } = options;

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

  const errorHandler = (err: any): Promise<never> => {
    const status = err?.response?.status || err?.status;
    const errorData = err?.response?.data;
    const errorMessage = errorData?.message || errorData?.error || err?.message;

    logger("Error caught:", err);

    if (!status) {
      showSnackbar("Lost connection. Please check the network connection.", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return Promise.reject(err);
    }

    // Handle unauthorized errors with special cases for login attempts
    if (status === 401) {
      // Check if this is a login attempt with invalid credentials
      const isAuthErrorException = authErrorExceptions.some(
        (exceptionMsg) =>
          errorMessage &&
          typeof errorMessage === "string" &&
          errorMessage.toLowerCase().includes(exceptionMsg.toLowerCase())
      );

      if (isAuthErrorException) {
        // For login failures, show the specific message without redirect
        showSnackbar(errorMessage || "Invalid username or password", {
          variant: "error",
          autoHideDuration: 3000,
        });
      } else {
        // For other auth errors (expired token, etc.), clear token and redirect
        localStorage.removeItem("token");

        if (redirectOnUnauthorized) {
          showSnackbar("Your session has expired. Please log in again.", {
            variant: "error",
            autoHideDuration: 3000,
          });

          setTimeout(() => {
            window.location.replace(loginRedirectPath);
          }, 1000);
        }
      }

      return Promise.reject(err);
    }

    // Handle forbidden errors
    if (status === 403) {
      showSnackbar(errorMessage || errorMessages[403], {
        variant: "error",
        autoHideDuration: 3000,
      });

      return Promise.reject(err);
    }

    // Handle specific error status codes
    if (status in errorMessages) {
      showSnackbar(errorMessage || errorMessages[status], {
        variant: "error",
        autoHideDuration: 3000,
      });
      return Promise.reject(err);
    }

    // Handle client-side errors (4xx)
    if (status >= 400 && status < 500) {
      // Try to use more specific error message from server
      const specificError =
        errorMessage || "An error occurred. Please try again.";

      showSnackbar(specificError, {
        variant: "error",
        autoHideDuration: 3000,
      });
      return Promise.reject(err);
    }

    // Handle server-side errors (5xx)
    if (status >= 500) {
      showSnackbar(errorMessage || defaultSystemErrorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
      return Promise.reject(err);
    }

    // Fallback error handling
    showSnackbar(defaultSystemErrorMessage, {
      variant: "error",
      autoHideDuration: 3000,
    });
    return Promise.reject(err);
  };

  return errorHandler;
};

// Usage example
const handleError = createErrorHandler({
  redirectOnUnauthorized: true,
  loginRedirectPath: "/auth/login",
  defaultSystemErrorMessage: "An error occurred. Please try again.",
  // List auth error messages that should not trigger a redirect
  authErrorExceptions: ["Invalid credentials", "Invalid email or password"],
  logger: (message, error) => {
    // Custom logging logic
    console.error(message, error);
  },
});

// Add request interceptor
http.interceptors.request.use(async (config) => {
  // Check if token is valid, redirect if not
  if (!isTokenValid() && window.location.pathname !== "/auth/login") {
    localStorage.removeItem("token");
    await refreshToken();
    return config;
  }

  // Add token to Authorization header if available
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
http.interceptors.response.use(
  (response) => response,
  (error) => handleError(error)
);

export default http;
