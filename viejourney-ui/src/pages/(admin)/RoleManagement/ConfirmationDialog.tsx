import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Are you sure you want to proceed with this action? This action cannot be undone.",
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "300px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: "#fff3e0",
              color: "#f57c00",
              width: 48,
              height: 48,
            }}
          >
            <WarningIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="300" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please confirm your action
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 1,
            "& .MuiAlert-message": {
              fontWeight: 400,
            },
          }}
        >
          <Typography variant="body2">{message}</Typography>
        </Alert>

        <Box
          sx={{
            p: 2,
            bgcolor: "#fafafa",
            borderRadius: 1,
            border: "1px solid #f0f0f0",
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            ⚠️ Important Notice
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action will change the roles of the selected users. Please
            ensure you have the necessary permissions and that this action is
            intended.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          startIcon={<CancelIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 1,
            fontWeight: 500,
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": {
              borderColor: "text.secondary",
              bgcolor: "grey.50",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="warning"
          disabled={loading}
          startIcon={loading ? undefined : <CheckIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 1,
            fontWeight: 500,
            minWidth: 120,
          }}
        >
          {loading ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
