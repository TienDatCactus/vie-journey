import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

const DisconnectedDialog: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    window.location.reload();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Network Status"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          The server connection has been lost. Please check your internet
          connection or try again later.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisconnectedDialog;
