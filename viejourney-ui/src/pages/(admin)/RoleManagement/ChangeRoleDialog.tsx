import {
  CheckCircle as CheckIcon,
  People as PeopleIcon,
  SwapHoriz as SwapIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

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

  const stringAvatar = (name: string) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length === 1) return words[0][0];
    return words[0][0] + words[1][0];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "500px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              width: 48,
              height: 48,
            }}
          >
            <SwapIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="300" sx={{ mb: 0.5 }}>
              Bulk Role Change
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update role assignments for selected users
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Role Change Summary */}
        <Paper
          elevation={0}
          className="shadow-sm"
          sx={{
            p: 3,
            mb: 3,
            bgcolor: "#f8f9fa",
            borderRadius: 1,
            border: "1px solid #e3f2fd",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <PeopleIcon color="primary" />
            <Typography variant="h6" fontWeight="500">
              Change Summary
            </Typography>
          </Stack>

          <Typography variant="body1" sx={{ mb: 2 }}>
            The following users will be assigned to the{" "}
            <Chip
              label={getRoleLabel(newRole)}
              color={getRoleColor(newRole) as any}
              size="small"
              sx={{ fontWeight: 500 }}
            />{" "}
            role.
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              bgcolor: "white",
              borderRadius: 1,
              border: "1px solid #f0f0f0",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total Users:
            </Typography>
            <Chip
              label={selectedUsers.length}
              color="primary"
              variant="filled"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* Users List */}
        <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
          Affected Users ({selectedUsers.length})
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Review the list of users who will have their roles changed
        </Typography>

        <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
          <List dense>
            {selectedUsers.map((user, index) => (
              <Paper
                key={index}
                elevation={0}
                className="shadow-sm"
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  border: "1px solid #f0f0f0",
                }}
              >
                <ListItem sx={{ py: 2 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    width="100%"
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {stringAvatar(user.userName || user.email)}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {user.userName || "No Name"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        label={getRoleLabel(user.role)}
                        color={getRoleColor(user.role) as any}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                      <SwapIcon fontSize="small" color="action" />
                      <Chip
                        label={getRoleLabel(newRole)}
                        color={getRoleColor(newRole) as any}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Stack>
                  </Stack>
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 1,
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onAccept}
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 1,
            fontWeight: 500,
          }}
        >
          Confirm Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeRoleDialog;
