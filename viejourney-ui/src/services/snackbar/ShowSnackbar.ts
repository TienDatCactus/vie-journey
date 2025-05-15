// snackbarService.ts
import { enqueueSnackbar } from "notistack";

// You can create a function that triggers the snackbar with required options
export const showSnackbar = (message: string, options: any) => {
  enqueueSnackbar(message, options);
};
