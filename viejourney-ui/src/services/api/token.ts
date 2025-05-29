/**
 * Authentication has been updated to use HTTP-only cookies for refresh tokens
 * and to not include expiration times in access tokens.
 *
 * Key changes:
 * 1. Refresh tokens are sent automatically via HTTP-only cookies (secure from JS access)
 * 2. Access tokens no longer include expiration information
 * 3. Token validity is determined by the server - on 401 response, we attempt refresh
 * 4. No proactive token refresh - we rely on 401 responses to trigger token refresh
 */

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

export const setToken = (token: TokenData): void => {
  if (!token || !token.accessToken || !token.userId) {
    console.error("Invalid token data provided");
    return;
  }
  try {
    localStorage.setItem("token", JSON.stringify(token));
  } catch (error) {
    console.error("Error setting token:", error);
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
 * Check if we likely have a refresh token cookie
 * Note: We can't directly access the HTTP-only cookie contents from JavaScript
 * This is just a best guess based on auth state - the server will validate the actual cookie
 */
export const hasRefreshTokenCookie = (): boolean => {
  return !!getToken()?.userId;
};

/**
 * Clear the stored token
 */
export const clearToken = (): void => {
  localStorage.removeItem("token");
};
