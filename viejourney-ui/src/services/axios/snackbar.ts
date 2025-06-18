import { enqueueSnackbar, SnackbarKey } from "notistack";

const MESSAGE_DEBOUNCE_TIME = 3000;
const recentMessages = new Map<
  string,
  { key: SnackbarKey; timestamp: number }
>();

export const showDebouncedSnackbar = (message: string, options: any = {}) => {
  const key = `${message}-${options.variant || "default"}`;
  const now = Date.now();
  const lastShown = recentMessages.get(key);

  if (lastShown && now - lastShown.timestamp < MESSAGE_DEBOUNCE_TIME)
    return null;

  const snackbarKey = enqueueSnackbar(message, options);
  recentMessages.set(key, { key: snackbarKey, timestamp: now });

  setTimeout(() => recentMessages.delete(key), MESSAGE_DEBOUNCE_TIME + 1000);
  return snackbarKey;
};
