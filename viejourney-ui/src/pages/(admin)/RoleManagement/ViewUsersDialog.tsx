import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
import {
  People as PeopleIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { doFilterUsers } from "../../../services/api";

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

interface ViewUsersDialogProps {
  open: boolean;
  onClose: () => void;
  roleData: {
    id: number;
    role: string;
    apiRole: string;
    description: string;
    users: number;
  } | null;
  onChangeRole: (selectedUsers: User[], newRole: string) => void;
}

const ViewUsersDialog: React.FC<ViewUsersDialogProps> = ({
  open,
  onClose,
  roleData,
  onChangeRole,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState("");

  // Create and manage style element for z-index override
  useEffect(() => {
    let styleElement: HTMLStyleElement | null = null;

    if (open) {
      // Create style element when dialog opens
      styleElement = document.createElement("style");
      styleElement.id = "view-users-dialog-styles";
      styleElement.textContent = `
        .MuiDialog-root .MuiPopover-root {
          z-index: 1400 !important;
        }
        .MuiDialog-root .MuiMenu-root {
          z-index: 1400 !important;
        }
        .MuiDialog-root .MuiSelect-root .MuiMenu-paper {
          z-index: 1400 !important;
        }
        .MuiDialog-root .MuiMenu-paper {
          z-index: 1400 !important;
        }
        .MuiDialog-root .MuiPopover-paper {
          z-index: 1400 !important;
        }
      `;
      document.head.appendChild(styleElement);
    }

    return () => {
      // Cleanup style element when dialog closes or component unmounts
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
      // Also remove any existing style with the same ID
      const existingStyle = document.getElementById("view-users-dialog-styles");
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [open]);

  const roles = [
    { value: "USER", label: "User" },
    { value: "MANAGER", label: "Manager" },
    { value: "ADMIN", label: "Administrator" },
  ];

  useEffect(() => {
    if (open && roleData) {
      fetchUsersByRole();
    }
  }, [open, roleData]);

  const fetchUsersByRole = async () => {
    if (!roleData) return;

    setLoading(true);
    setError("");
    try {
      const response = await doFilterUsers({
        role: roleData.apiRole,
      });

      if (response.status === "success") {
        setUsers(response.data.users);
      } else {
        setError("Không thể tải danh sách người dùng");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User, checked: boolean) => {
    if (user.role === "ADMIN") return; // Prevent selecting ADMIN users
    if (checked) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((u) => u.userId !== user.userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.filter((u) => u.role !== "ADMIN")); // Only non-ADMIN users
    } else {
      setSelectedUsers([]);
    }
  };

  const handleEdit = () => {
    if (selectedUsers.length === 0) {
      setError("Vui lòng chọn ít nhất một người dùng");
      return;
    }
    if (!newRole) {
      setError("Vui lòng chọn role mới");
      return;
    }
    onChangeRole(selectedUsers, newRole);
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setNewRole("");
    setError("");
    onClose();
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

  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "",
      width: 50,
      sortable: false,
      renderHeader: () => (
        <Checkbox
          checked={
            selectedUsers.length ===
              users.filter((u) => u.role !== "ADMIN").length &&
            users.filter((u) => u.role !== "ADMIN").length > 0
          }
          indeterminate={
            selectedUsers.length > 0 &&
            selectedUsers.length <
              users.filter((u) => u.role !== "ADMIN").length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedUsers.some((u) => u.userId === params.row.userId)}
          onChange={(e) => handleUserSelect(params.row, e.target.checked)}
          disabled={params.row.role === "ADMIN"} // Disable for ADMIN users
        />
      ),
    },
    {
      field: "user",
      headerName: "USER",
      width: 280,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {stringAvatar(params.row.userName || params.row.email)}
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {params.row.email || params.row.userName}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "role",
      headerName: "ROLE",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getRoleColor(params.value) as any}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 500,
            opacity: params.value === "ADMIN" ? 0.6 : 1, // visually dim ADMIN
          }}
        />
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "ACTIVE" ? "success" : "default"}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "CREATED AT",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : "-"}
        </Typography>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{
        zIndex: 1300,
        "& .MuiDialog-container": {
          zIndex: 1300,
        },
        "& .MuiBackdrop-root": {
          zIndex: 1299,
        },
      }}
      PaperProps={{
        sx: {
          zIndex: 1301,
          position: "relative",
          overflow: "visible",
          borderRadius: 2,
          minHeight: "600px",
        },
      }}
      disableEnforceFocus
      disableAutoFocus
      disableScrollLock
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
            <PeopleIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="300" sx={{ mb: 0.5 }}>
              Users in {roleData?.role} Role
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {roleData?.description}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 1,
              "& .MuiAlert-message": {
                fontWeight: 400,
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Role Change Section */}
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
          <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
            Bulk Role Change
          </Typography>

          <Grid2 container spacing={3} alignItems="center">
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Select New Role</InputLabel>
                <Select
                  value={newRole}
                  label="Select New Role"
                  onChange={(e) => setNewRole(e.target.value)}
                  sx={{
                    borderRadius: 1,
                    "& .MuiSelect-select": {
                      zIndex: 1,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        zIndex: 1400,
                        position: "absolute",
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    disablePortal: true,
                  }}
                >
                  {roles
                    .filter(
                      (role) =>
                        role.value !== "ADMIN" &&
                        role.value !== roleData?.apiRole
                    )
                    .map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  <MenuItem value="ADMIN" disabled>
                    Administrator (readonly)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Selected Users:{" "}
                <Chip
                  label={selectedUsers.length}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Button
                variant="contained"
                onClick={handleEdit}
                disabled={selectedUsers.length === 0 || !newRole}
                startIcon={<EditIcon />}
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: 1,
                  fontWeight: 500,
                }}
              >
                Change Role
              </Button>
            </Grid2>
          </Grid2>
        </Paper>

        {/* Users List */}
        <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
          Users List ({users.length})
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select users to change their roles. Use the checkboxes to select
          individual users or all users.
        </Typography>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ py: 8 }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Loading users...
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGridPremium
              rows={users}
              columns={columns}
              getRowId={(row) => row.userId}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              disableColumnMenu
              hideFooterSelectedRowCount
              sx={{
                "& .MuiDataGrid-cell": {
                  borderBottom: "0.0625rem solid #f0f0f0",
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#fafafa",
                  fontWeight: "500",
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none",
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<CancelIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 1,
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleEdit}
          variant="contained"
          disabled={selectedUsers.length === 0 || !newRole}
          startIcon={<EditIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 1,
            fontWeight: 500,
          }}
        >
          Apply Changes ({selectedUsers.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUsersDialog;
