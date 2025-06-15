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
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: TokenData): void => {
  if (!token || !token.accessToken) {
    console.error("Invalid token data provided");
    return;
  }
  try {
    localStorage.setItem("token", token.accessToken);
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

export const clearToken = (): void => {
  localStorage.removeItem("token");
};
