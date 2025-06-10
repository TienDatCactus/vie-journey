import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";

interface EditAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    fullName: string;
    dob: string;
    phone: string;
    address: string;
  }) => void;
  loading?: boolean;
  user?: {
    fullName?: string;
    dob?: string;
    phone?: string;
    address?: string;
  };
}

const EditAccountDialog: React.FC<EditAccountDialogProps> = ({
  open,
  onClose,
  onSave,
  loading = false,
  user,
}) => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState<Dayjs | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setFullName(user?.fullName || "");
    setDob(user?.dob ? dayjs(user.dob) : null);
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
  }, [user, open]);

  const handleSave = () => {
    onSave({
      fullName,
      dob: dob ? dob.toISOString() : "",
      phone,
      address,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
          />
          <DatePicker
            label="Date of Birth"
            value={dob}
            onChange={setDob}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountDialog;
