interface TokenData {
  accessToken: string;
  expiresAt: string;
  expiresIn: number;
  refreshToken?: string; // Optional refresh token field
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
 * Check if the token is valid and not expired
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token?.accessToken) return false;

  if (!token.expiresAt) return false;

  const expirationTime = new Date(token.expiresAt).getTime();
  const currentTime = new Date().getTime();

  // Consider token valid if it expires in more than 30 seconds
  return expirationTime > currentTime + 30000;
};

/**
 * Check if token should be refreshed soon (less than 2 minutes remaining)
 */
export const shouldRefreshToken = (): boolean => {
  const token = getToken();
  if (!token?.accessToken) return false;

  if (!token.expiresAt) return false;

  const expirationTime = new Date(token.expiresAt).getTime();
  const currentTime = new Date().getTime();

  // Refresh if less than 2 minutes remaining
  return expirationTime > currentTime && expirationTime - currentTime < 120000;
};

/**
 * Get remaining time until token expiration in seconds
 */
export const getTokenRemainingTime = (): number => {
  const token = getToken();
  if (!token) return 0;

  const { expiresAt } = token;
  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();

  // Return remaining time in seconds, minimum 0
  return Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
};

/**
 * Get the access token string
 */
export const getAccessToken = (): string | null => {
  const token = getToken();
  return token?.accessToken || null;
};

/**
 * Check if refresh token is available
 */
export const hasRefreshToken = (): boolean => {
  const token = getToken();
  return !!token?.refreshToken;
};

/**
 * Clear the stored token
 */
export const clearToken = (): void => {
  localStorage.removeItem("token");
};
