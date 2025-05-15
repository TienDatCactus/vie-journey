import axios from "axios";
import { showSnackbar } from "../snackbar/ShowSnackbar";
interface ErrorHandlerOptions {
  redirectOnUnauthorized?: boolean;
  loginRedirectPath?: string;
  defaultSystemErrorMessage?: string;
  logger?: (message: string, error?: any) => void;
}
// Create an Axios instance with default config
const http = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: import.meta.env.VITE_PRIVATE_URL,
});

// const bodyParse = (resp: any) => {
//   const respData = resp.data;
//   console.log(resp?.status);
//   if (+resp?.status >= 500) {
//     return showSnackbar(
//       `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`
//     );
//   }
//   if (+resp?.status < 500 && +resp?.status !== 200) {
//     return showSnackbar(
//       "Hệ thống xảy ra lỗi. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ "
//     );
//   }
//   if (respData?.statusCode === 401) {
//     localStorage.removeItem("edu-token");
//     return window.location.replace("/auth/login");
//   }
//   return resp;
// };

const createErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    redirectOnUnauthorized = true,
    loginRedirectPath = "/login",
    defaultSystemErrorMessage = "The system is experiencing issues. Please try again later.",
    logger = console.error,
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
    422: "Unimport.meta.able entity. Please check the information.",
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
    const errorMessage = err?.message;

    logger("Error caught:", err);

    if (!status) {
      showSnackbar("Lost connection. Please check the network connection.", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return Promise.reject(err);
    }

    // Handle unauthorized errors
    if (status === 401 || status === 403) {
      localStorage.removeItem("edu-token");
      if (redirectOnUnauthorized) {
        showSnackbar(errorMessages[401], {
          variant: "error",
          autoHideDuration: 3000,
        });
        setTimeout(() => {
          window.location.replace(loginRedirectPath);
        }, 1000);
      }

      return Promise.reject(err);
    }

    // Handle specific error status codes
    if (status in errorMessages) {
      showSnackbar(errorMessages[status], {
        variant: "error",
        autoHideDuration: 3000,
      });
      return Promise.reject(err);
    }

    // Handle client-side errors (4xx)
    if (status >= 400 && status < 500) {
      // Try to use more specific error message from server
      const specificError =
        errorData?.message ||
        errorMessage ||
        "An error occurred. Please try again.";

      showSnackbar(specificError, {
        variant: "error",
        autoHideDuration: 3000,
      });
      return Promise.reject(err);
    }

    // Handle server-side errors (5xx)
    if (status >= 500) {
      showSnackbar(defaultSystemErrorMessage, {
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
  loginRedirectPath: "/login",
  defaultSystemErrorMessage: "An error occurred. Please try again.",
  logger: (message, error) => {
    // Custom logging logic (e.g., send to monitoring service)
    console.error(message, error);
  },
});

// Add request interceptor
http.interceptors.request.use((config) => {
  const tokenString = localStorage.getItem("edu-token");
  const token: {
    accessToken: string;
    refreshToken: string;
  } | null = tokenString ? JSON.parse(tokenString) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token?.accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => handleError(error)
);
export default http;
