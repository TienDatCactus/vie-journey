import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";

interface User {
  userId: string;
  accountId: string;
  email: string;
  userName: string;
  role: string;
  status: string;
  phone: string;
  address: string;
  createdAt: Date;
}

interface ChangeRoleDialogProps {
  open: boolean;
  onClose: () => void;
  selectedUsers: User[];
  newRole: string;
  onAccept: () => void;
}

const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({
  open,
  onClose,
  selectedUsers,
  newRole,
  onAccept,
}) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "USER":
        return "User";
      case "MANAGER":
        return "Manager";
      case "ADMIN":
        return "Administrator";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "USER":
        return "primary";
      case "MANAGER":
        return "warning";
      case "ADMIN":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Change all users to role
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Các user này sẽ được chuyển sang role:{" "}
            <Chip 
              label={getRoleLabel(newRole)} 
              color={getRoleColor(newRole) as any}
              size="small"
            />
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Danh sách người dùng ({selectedUsers.length}):
          </Typography>
          
          <List dense>
            {selectedUsers.map((user, index) => (
              <ListItem key={user.userId} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {user.userName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({user.email})
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="caption">
                        Từ: 
                      </Typography>
                      <Chip 
                        label={getRoleLabel(user.role)} 
                        color={getRoleColor(user.role) as any}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption">
                        → 
                      </Typography>
                      <Chip 
                        label={getRoleLabel(newRole)} 
                        color={getRoleColor(newRole) as any}
                        size="small"
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onAccept} 
          variant="contained"
          color="primary"
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeRoleDialog;
