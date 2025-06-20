import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert } from "@mui/material";
import { useAuthStore } from "../../../services/stores/useAuthStore";

interface StatusDialogProps {
  status: "ACTIVE" | "INACTIVE" | "BANNED";
}

const StatusDialog: React.FC<StatusDialogProps> = ({ status }) => {
  const [open, setOpen] = React.useState(true);
  const { handleLogout } = useAuthStore();
  const handleClose = () => {
    setOpen(false);
    if (status === "BANNED" || status === "INACTIVE") handleLogout();
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
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Account Status"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {ContentSwitch()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;
