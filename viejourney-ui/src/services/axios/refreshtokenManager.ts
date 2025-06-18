import { refreshToken } from "../api";
import type { RefreshResult } from "./types";

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

export const subscribeToRefresh = (cb: (token: string) => void) =>
  subscribers.push(cb);

export const notifySubscribers = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

export const resetSubscribers = () => {
  subscribers = [];
};

export const handleTokenRefresh = async (): Promise<RefreshResult | null> => {
  if (isRefreshing)
    return new Promise((resolve) => {
      subscribeToRefresh((token) => resolve({ accessToken: token }));
    });

  isRefreshing = true;

  try {
    const result = await refreshToken(); // <- your API
    if (result?.accessToken) {
      notifySubscribers(result.accessToken);
      return result;
    }
  } catch {
    resetSubscribers();
  } finally {
    isRefreshing = false;
  }

  return null;
};
