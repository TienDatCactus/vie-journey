import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { doDeleteHotel } from "../../../services/api";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void; // For backward compatibility
  onDelete?: () => void; // Callback after successful delete
  loading?: boolean;
  hotelId: string;
  hotelName: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  onDelete,
  loading = false,
  hotelId,
  hotelName,
}) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setApiLoading(true);
    setError(null);

    try {
      await doDeleteHotel(hotelId);

      // Call onConfirm if provided (for backward compatibility)
      if (onConfirm) {
        await onConfirm();
      }

      // Call onDelete callback
      if (onDelete) {
        onDelete();
      }

      onClose();
    } catch (err: any) {
      console.error("Error deleting hotel:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete hotel. Please try again."
      );
    } finally {
      setApiLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <WarningIcon color="error" />
          <Typography variant="h5" fontWeight="bold">
            Delete Hotel
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* Error Display */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Typography variant="body1">
            Are you sure you want to delete this hotel?
          </Typography>

          <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Hotel Name:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {hotelName}
            </Typography>
          </Box>

          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Warning:</strong> This action cannot be undone. All hotel
              data, including bookings and reviews, will be permanently deleted.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading || apiLoading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading || apiLoading}
          variant="contained"
          color="error"
          startIcon={loading || apiLoading ? undefined : <DeleteIcon />}
        >
          {loading || apiLoading ? "Deleting..." : "Delete Hotel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
