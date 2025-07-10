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
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

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
  message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
  loading = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="warning" />
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            {message}
          </Typography>
        </Alert>
        
        <Typography variant="body2" color="text.secondary">
          Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="error"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
