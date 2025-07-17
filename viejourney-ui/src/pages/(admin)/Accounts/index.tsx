import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Grid2,
  InputAdornment,
  FormControl,
  Select,
  Button,
} from "@mui/material";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  doGetAllUsers,
  doFilterUsers,
  doUpdateAccountStatus,
  doDeleteUser,
  doUpdateUserInfo,
} from "../../../services/api";
import { Link } from "react-router-dom";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import EditAccountDialog from "./EditAccountDialog";

function stringAvatar(name: string) {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length === 1) return words[0][0];
  return words[0][0] + words[1][0];
}

// Action Menu Component
const ActionMenu = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit();
  };

  const handleDelete = () => {
    handleClose();
    onDelete();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

// DataGrid columns definition - will be created inside component to access handlers

function Accounts() {
  const [users, setUsers] = useState<unknown[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
    { value: "MANAGER", label: "Manager" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "BANNED", label: "Banned" },
  ];
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  const fetchAccounts = async (params?: {
    search?: string;
    roleFilter?: string;
    statusFilter?: string;
  }) => {
    setLoading(true);
    try {
      // Check if any filter is applied
      const hasFilters =
        params?.search ||
        search ||
        params?.roleFilter ||
        roleFilter ||
        params?.statusFilter ||
        statusFilter;

      let res;

      if (hasFilters) {
        // Use filter API when filters are applied
        const filterParams: any = {};

        if (params?.search || search) {
          const searchTerm = params?.search || search;
          // Detect if search term looks like email (contains @)
          if (searchTerm.includes("@")) {
            filterParams.email = searchTerm;
          } else {
            filterParams.username = searchTerm;
          }
        }
        if (params?.roleFilter || roleFilter) {
          filterParams.role = params?.roleFilter || roleFilter;
        }
        if (params?.statusFilter || statusFilter) {
          filterParams.status = params?.statusFilter || statusFilter;
        }

        res = await doFilterUsers(filterParams);
      } else {
        // Use regular GET API when no filters
        res = await doGetAllUsers();
      }

      if (res.status === "success" && res.data?.users) {
        const transformedUsers = res.data.users.map((user: any) => ({
          _id: user.userId,
          fullName: user.userName,
          userId: {
            _id: user.accountId,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
          },
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt,
          flaggedCount: 0,
        }));
        setUsers(transformedUsers);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts({ search: debouncedSearch, roleFilter, statusFilter });
    // eslint-disable-next-line
  }, [debouncedSearch, roleFilter, statusFilter]);

  const rows = users.map((user: any, index) => ({
    id: user._id || index,
    ...user,
  }));

  // Handle status change
  const handleStatusChange = async (accountId: string, newStatus: string) => {
    try {
      // Update UI first (optimistic update)
      setUsers((prev) =>
        prev.map((u: any) =>
          u.userId._id === accountId
            ? {
                ...u,
                userId: {
                  ...u.userId,
                  status: newStatus === "Active" ? "ACTIVE" : "INACTIVE",
                },
              }
            : u
        )
      );

      // Call API to update on server
      const active = newStatus === "Active";

      await doUpdateAccountStatus(accountId, active);
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert on error by refetching data
      fetchAccounts({ search: debouncedSearch, roleFilter, statusFilter });
    }
  };

  // DataGrid columns definition
  const columns = [
    {
      field: "user",
      headerName: "CUSTOMER",
      flex: 1,
      minWidth: 250,
      renderCell: (params: any) => (
        <Link
          to={`detail/${params.row.userId._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {stringAvatar(
                params.row.fullName || params.row.userId?.email || "U"
              )}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              {params.row.fullName || params.row.userId?.email || "No Name"}
            </Typography>
          </Stack>
        </Link>
      ),
    },
    {
      field: "email",
      headerName: "EMAIL",
      flex: 1,
      minWidth: 200,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {params.row.userId?.email || "-"}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "ROLE",
      flex: 0.6,
      minWidth: 100,
      renderCell: (params: any) => (
        <Chip
          label={params.row.userId?.role || "USER"}
          size="small"
          color={
            params.row.userId?.role === "ADMIN"
              ? "error"
              : params.row.userId?.role === "MANAGER"
              ? "warning"
              : "default"
          }
          variant="outlined"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "CREATED AT",
      flex: 0.6,
      minWidth: 120,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : "-"}
        </Typography>
      ),
    },
    {
      field: "flaggedCount",
      headerName: "FLAG",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params: any) => (
        <Chip
          label={params.row.flaggedCount || 0}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params: any) => (
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={
              params.row.userId?.status === "ACTIVE" ? "Active" : "Inactive"
            }
            onChange={(e) =>
              handleStatusChange(params.row.userId._id, e.target.value)
            }
            sx={{
              fontWeight: 500,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
            }}
            renderValue={(selected: any) => (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor:
                      selected === "Active" ? "success.main" : "error.main",
                    mr: 1,
                  }}
                />
                {selected}
              </Box>
            )}
          >
            <MenuItem value="Active">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    mr: 1,
                  }}
                />
                Active
              </Box>
            </MenuItem>
            <MenuItem value="Inactive">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "error.main",
                    mr: 1,
                  }}
                />
                Inactive
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      flex: 0.8,
      minWidth: 150,
      sortable: false,
      renderCell: (params: any) => (
        <ActionMenu
          onEdit={() => {
            const userIndex = users.findIndex(
              (u: any) => (u as any)._id === params.row._id
            );
            setEditIdx(userIndex);
            setOpenEdit(true);
          }}
          onDelete={() => {
            const userIndex = users.findIndex(
              (u: any) => (u as any)._id === params.row._id
            );
            setDeleteIdx(userIndex);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  const handleDelete = async () => {
    if (deleteIdx === null) return;
    const user = users[deleteIdx] as Record<string, any>;
    setLoadingDelete(true);
    try {
      await doDeleteUser(user._id);
      // Refresh data after delete
      fetchAccounts({ search: debouncedSearch, roleFilter, statusFilter });
      setOpenDelete(false);
      setLoadingDelete(false);
      setDeleteIdx(null);
    } catch (err) {
      setLoadingDelete(false);
    }
  };

  const handleEdit = async (data: {
    fullName: string;
    dob: string;
    phone: string;
    address: string;
  }) => {
    if (editIdx === null) return;
    const user = users[editIdx] as Record<string, any>;
    setLoadingEdit(true);
    try {
      await doUpdateUserInfo(user._id, data);
      // Refresh data after edit
      fetchAccounts({ search: debouncedSearch, roleFilter, statusFilter });
      setLoadingEdit(false);
      setOpenEdit(false);
      setEditIdx(null);
    } catch (err) {
      setLoadingEdit(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              User Management
            </Typography>
            <Typography color="text.secondary">
              View, search, update and restrict user accounts
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Chip
              label="5 Active"
              color="success"
              variant="outlined"
              size="small"
            />
            <Chip
              label="1 Banned"
              color="error"
              variant="outlined"
              size="small"
            />
          </Stack>
        </Stack>

        {/* Search & Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <SearchIcon color="action" />
            <Typography variant="h6" fontWeight="bold">
              Search & Filters
            </Typography>
          </Stack>

          <Grid2 container spacing={3}>
            {/* Search Users */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} mb={1}>
                Search Users
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: search !== debouncedSearch && (
                    <InputAdornment position="end">
                      <Typography variant="caption" color="text.secondary">
                        Searching...
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            {/* Filter by Role */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} mb={1}>
                Filter by Role
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  displayEmpty
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>

            {/* Filter by Status */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} mb={1}>
                Filter by Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  displayEmpty
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>
        </Paper>
        {/* Users Table */}
        <Paper sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6" fontWeight="bold">
              Users ({users.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              sx={{ textTransform: "none" }}
            >
              Export Users
            </Button>
          </Stack>

          <Typography color="text.secondary" mb={3}>
            Manage user accounts and permissions
          </Typography>

          <Box sx={{ height: 600, width: "100%" }}>
            <DataGridPremium
              rows={rows}
              columns={columns}
              getRowId={(row) => row._id || row.id}
              loading={loading}
              disableRowSelectionOnClick
              disableColumnMenu
              hideFooterSelectedRowCount
              hideFooter
              checkboxSelection={false}
              disableColumnSelector
              disableColumnFilter
              disableColumnResize
              sx={{
                "& .MuiDataGrid-cell": {
                  borderBottom: "0.0625rem solid #f0f0f0",
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#fafafa",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none",
                },
                "& .MuiDataGrid-checkboxInput": {
                  display: "none",
                },
                "& .MuiDataGrid-columnHeaderCheckbox": {
                  display: "none",
                },
                "& .MuiDataGrid-cellCheckbox": {
                  display: "none",
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
      <ConfirmDeleteDialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setDeleteIdx(null);
        }}
        onConfirm={handleDelete}
        loading={loadingDelete}
        userName={deleteIdx !== null ? (users[deleteIdx] as any)?.fullName : ""}
      />
      <EditAccountDialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditIdx(null);
        }}
        onSave={handleEdit}
        loading={loadingEdit}
        user={
          editIdx !== null
            ? (users[editIdx] as {
                fullName?: string;
                dob?: string;
                phone?: string;
                address?: string;
              })
            : undefined
        }
      />
    </AdminLayout>
  );
}

export default Accounts;
