interface TokenData {
  accessToken: string;
  expiresAt: string;
  expiresIn: number;
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
  if (!token) return false;

  const { expiresAt } = token;
  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();

  // Consider token invalid if it expires in less than a minute
  const isValid = expirationTime > currentTime + 60000;
  return isValid;
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
 * Clear the stored token
 */
export const clearToken = (): void => {
  localStorage.removeItem("token");
};
