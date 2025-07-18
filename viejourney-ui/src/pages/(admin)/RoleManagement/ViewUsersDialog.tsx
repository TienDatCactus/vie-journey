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
} from "@mui/material";
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
    if (checked) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((u) => u.userId !== user.userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers([...users]);
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

  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "",
      width: 50,
      sortable: false,
      renderHeader: () => (
        <Checkbox
          checked={selectedUsers.length === users.length && users.length > 0}
          indeterminate={
            selectedUsers.length > 0 && selectedUsers.length < users.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedUsers.some((u) => u.userId === params.row.userId)}
          onChange={(e) => handleUserSelect(params.row, e.target.checked)}
        />
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      flex: 1,
    },
    {
      field: "userName",
      headerName: "Username",
      width: 200,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
          overflow: "visible", // Allow dropdown to overflow
        },
      }}
      disableEnforceFocus
      disableAutoFocus
      disableScrollLock
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Danh sách người dùng - {roleData?.role}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {roleData?.description}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ overflow: "visible" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid2 container spacing={2} sx={{ mb: 3 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Chọn role mới</InputLabel>
              <Select
                value={newRole}
                label="Chọn role mới"
                onChange={(e) => setNewRole(e.target.value)}
                sx={{
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
                  disablePortal: true, // Keep dropdown within dialog
                }}
              >
                {roles
                  .filter((role) => role.value !== roleData?.apiRole)
                  .map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
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
              sx={{
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f0f0f0",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#fafafa",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleEdit}
          variant="contained"
          disabled={selectedUsers.length === 0 || !newRole}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUsersDialog;
