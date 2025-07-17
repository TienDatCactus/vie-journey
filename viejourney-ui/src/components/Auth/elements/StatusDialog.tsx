import { Alert, CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useAuthStore } from "../../../services/stores/useAuthStore";

interface StatusDialogProps {
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  shown: boolean;
  setShown: (shown: boolean) => void;
}

const StatusDialog: React.FC<StatusDialogProps> = ({
  status,
  shown,
  setShown,
}) => {
  const { handleLogout } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const handleClose = async () => {
    try {
      setLoading(true);
      if (status === "BANNED" || status === "INACTIVE") await handleLogout();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setShown(false);
    }
  };
  const ContentSwitch = () => {
    switch (status) {
      case "BANNED":
        return (
          <Alert severity="error">
            Your account has been banned. Please contact support for more
            information.
          </Alert>
        );
      case "INACTIVE":
        return (
          <Alert severity="warning">
            Your account is inactive. Please verify your email to activate your
            account.
          </Alert>
        );
      default:
        return (
          <Alert severity="info">
            Your account is active. You can continue using the application.
          </Alert>
        );
    }
  };
  return (
    <Dialog
      open={shown}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Account Status"}</DialogTitle>
      {loading ? (
        <DialogContent>
          <CircularProgress size={24} />
          Loading...
        </DialogContent>
      ) : (
        <DialogContent>{ContentSwitch()}</DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;
