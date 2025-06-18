import { showDebouncedSnackbar } from "./snackbar";
import type { ErrorHandlerOptions } from "./types";

export const createErrorHandler = (options: ErrorHandlerOptions) => {
  const {
    redirectOnUnauthorized = true,
    loginRedirectPath = "/auth/login",
    defaultSystemErrorMessage = "An unexpected error occurred.",
    logger = console.error,
    authErrorExceptions = [],
  } = options;

  const messages: Record<number, string> = {
    401: "Session expired. Please login again.",
    403: "Access denied.",
    404: "Resource not found.",
    500: "Server error. Try again later.",
    // add more as needed
  };

  return async (error: any): Promise<never> => {
    logger("HTTP Error:", error);

    const status = error?.response?.status;
    const msg = error?.response?.data?.message || error?.message;
    const details = error?.response?.data?.errors;

    if (!status) {
      showDebouncedSnackbar("Network error. Please check your connection.", {
        variant: "error",
      });
      return Promise.reject(error);
    }

    if (status === 401) {
      const isException = authErrorExceptions.some((ex) =>
        msg?.toLowerCase().includes(ex.toLowerCase())
      );

      if (isException) {
        showDebouncedSnackbar(msg, { variant: "error" });
      } else if (redirectOnUnauthorized) {
        showDebouncedSnackbar("Session expired. Redirecting...", {
          variant: "error",
        });
        localStorage.removeItem("token");
        setTimeout(() => window.location.replace(loginRedirectPath), 1000);
      }

      return Promise.reject(error);
    }

    const detailMsg = Array.isArray(details)
      ? details.join(", ")
      : typeof details === "object"
      ? Object.values(details).join(", ")
      : details;

    const finalMsg = msg
      ? `${msg}${detailMsg ? `: ${detailMsg}` : ""}`
      : messages[status] || defaultSystemErrorMessage;

    showDebouncedSnackbar(finalMsg, { variant: "error" });
    return Promise.reject(error);
  };
};
