interface TokenData {
  accessToken: string;
  userId: string;
}

/**
 * Get the token from localStorage and parse it
 */
export const getToken = (): TokenData | null => {
  const tokenStr = localStorage.getItem("token");
  if (!tokenStr) return null;

  try {
    const tokenData = JSON.parse(tokenStr);
    return tokenData;
  } catch (error) {
    console.error("Error parsing token:", error);
    localStorage.removeItem("token");
    return null;
  }
};

/**
 * Check if there's a token in localStorage
 * Since we no longer receive expiration time, we can only check if a token exists
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  return !!token?.accessToken && !!token?.userId;
};

/**
 * Get the access token string
 */
export const getAccessToken = (): string | null => {
  const token = getToken();
  return token?.accessToken || null;
};

/**
 * Check if we have authentication credentials with a user ID.
 * This means we likely have an active session.
 */
export const hasAuthCredentials = (): boolean => {
  const token = getToken();
  return !!token?.accessToken && !!token?.userId;
};

/**
 * Clear the stored token
 */
export const clearToken = (): void => {
  localStorage.removeItem("token");
};
