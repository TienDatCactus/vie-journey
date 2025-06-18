import { showDebouncedSnackbar } from "./snackbar";

const pendingMessages = new Map<string, number>();
let activeCount = 0;

export const trackStart = () => ++activeCount;

export const trackEnd = () => {
  if (--activeCount === 0) {
    const successes = [...pendingMessages.entries()].filter(([msg]) =>
      msg.includes("success")
    );

    if (successes.length === 1) {
      showDebouncedSnackbar(successes[0][0], { variant: "success" });
    } else if (successes.length > 1) {
      showDebouncedSnackbar(`${successes.length} operations succeeded`, {
        variant: "success",
      });
    }

    pendingMessages.clear();
  }
};

export const trackSuccessMessage = (msg: string) => {
  pendingMessages.set(msg, (pendingMessages.get(msg) || 0) + 1);
};
