import { AdminLayout } from "../../../layouts";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ACCOUNTS } from "../../../services/api/url";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import EditAccountDialog from "./EditAccountDialog";
import Pagination from "@mui/material/Pagination";

const statusOptions = [
  { value: "Active", color: "success" },
  { value: "Inactive", color: "warning" },
];

function stringAvatar(name: string) {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length === 1) return words[0][0];
  return words[0][0] + words[1][0];
}

function Accounts() {
  const [users, setUsers] = useState<unknown[]>([]);
  const [anchorEls, setAnchorEls] = useState<(null | HTMLElement)[]>([]);
  const [search, setSearch] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async (params?: {
    page?: number;
    pageSize?: number;
  }) => {
    setLoading(true);
    try {
      const payload = {
        page: params?.page || page,
        pageSize: params?.pageSize || pageSize,
        search: params?.search || search,
      };
      const res = await axios.post(
        import.meta.env.VITE_PRIVATE_URL + ACCOUNTS.PAGINATE_ACCOUNTS,
        payload,
        { withCredentials: true }
      );
      setUsers(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || 0);
      setPage(res.data.currentPage || 1);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts({ page, pageSize });
    // eslint-disable-next-line
  }, [page, pageSize]);

  const handleMenuOpen = (
    index: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    const newAnchors = [...anchorEls];
    newAnchors[index] = event.currentTarget;
    setAnchorEls(newAnchors);
  };
  const handleMenuClose = (index: number) => {
    const newAnchors = [...anchorEls];
    newAnchors[index] = null;
    setAnchorEls(newAnchors);
  };

  const filteredUsers = users.filter((u) => {
    if (typeof u !== "object" || u === null) return false;
    const user = u as Record<string, any>;
    return (
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.toLowerCase().includes(search.toLowerCase()) ||
      user.address?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = async () => {
    if (deleteIdx === null) return;
    const user = filteredUsers[deleteIdx] as Record<string, any>;
    setLoadingDelete(true);
    try {
      await axios.delete(
        import.meta.env.VITE_PRIVATE_URL + ACCOUNTS.GET_ACCOUNTS + user._id,
        { withCredentials: true }
      );
      setUsers((prev) => prev.filter((u: any) => (u as any)._id !== user._id));
      setOpenDelete(false);
      setLoadingDelete(false);
      setDeleteIdx(null);
    } catch (err) {
      setLoadingDelete(false);
      // Có thể hiện toast lỗi ở đây
    }
  };

  const handleEdit = async (data: {
    fullName: string;
    dob: string;
    phone: string;
    address: string;
  }) => {
    if (editIdx === null) return;
    const user = filteredUsers[editIdx] as Record<string, any>;
    setLoadingEdit(true);
    try {
      await axios.patch(
        import.meta.env.VITE_PRIVATE_URL + ACCOUNTS.GET_ACCOUNTS + user._id,
        data,
        { withCredentials: true }
      );
      // Cập nhật lại user trong danh sách
      setUsers((prev) =>
        prev.map((u: any) =>
          (u as any)._id === user._id ? { ...u, ...data } : u
        )
      );
      setLoadingEdit(false);
      setOpenEdit(false);
      setEditIdx(null);
    } catch (err) {
      setLoadingEdit(false);
    }
  };

  return (
    <AdminLayout>
      <Box className="py-[10px] bg-[#f6f8f9] min-h-screen">
        <Box sx={{ p: 2, background: "white", borderRadius: 2, boxShadow: 1 }}>
          <Stack direction="row" alignItems="center" mb={2} spacing={2}>
            <TextField
              select
              label="Users"
              size="small"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              sx={{ width: 100 }}
            >
              {[10, 20, 50, 100].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="ml-auto"
              size="small"
              placeholder="Search:"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 250 }}
            />
          </Stack>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>CUSTOMER</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>PHONE</TableCell>
                  <TableCell>DATE</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((u, idx) => {
                  const user = u as Record<string, any>;
                  return (
                    <TableRow key={user._id} hover>
                      <TableCell>
                        <Link
                          to={`detail/${user._id}`}
                          className="hover:text-blue-400"
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar>{stringAvatar(user.fullName)}</Avatar>
                            <Typography>{user.fullName}</Typography>
                          </Stack>
                        </Link>
                      </TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {user.phone || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={user.userId?.active ? "Active" : "Inactive"}
                            onChange={(e) => {
                              setUsers((prev) =>
                                prev.map((u, i) =>
                                  i === idx
                                    ? {
                                        ...u,
                                        userId: {
                                          ...((u as any).userId || {}),
                                          active: e.target.value === "Active",
                                        },
                                      }
                                    : u
                                )
                              );
                            }}
                            sx={{
                              fontWeight: 500,
                              "& .MuiSelect-select": {
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                            renderValue={(selected) => (
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <FiberManualRecordIcon
                                  sx={{
                                    fontSize: 14,
                                    color:
                                      selected === "Active"
                                        ? "success.main"
                                        : "error.main",
                                    mr: 1,
                                  }}
                                />
                                {selected}
                              </Box>
                            )}
                          >
                            {statusOptions.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    minWidth: 90,
                                  }}
                                >
                                  <FiberManualRecordIcon
                                    sx={{
                                      fontSize: 14,
                                      color:
                                        opt.value === "Active"
                                          ? "success.main"
                                          : "error.main",
                                      mr: 1,
                                    }}
                                  />
                                  {opt.value}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary">
                            <Link to={`detail/${user._id}`}>
                              <VisibilityIcon className="text-blue-400" />
                            </Link>
                          </IconButton>
                          <IconButton onClick={(e) => handleMenuOpen(idx, e)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEls[idx]}
                            open={Boolean(anchorEls[idx])}
                            onClose={() => handleMenuClose(idx)}
                          >
                            <MenuItem
                              onClick={() => {
                                handleMenuClose(idx);
                                setEditIdx(idx);
                                setOpenEdit(true);
                              }}
                              className="hover:text-blue-400"
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleMenuClose(idx);
                                setDeleteIdx(idx);
                                setOpenDelete(true);
                              }}
                              className="hover:text-red-400"
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Stack>
        </Box>
      </Box>
      <ConfirmDeleteDialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setDeleteIdx(null);
        }}
        onConfirm={handleDelete}
        loading={loadingDelete}
        userName={
          deleteIdx !== null ? (filteredUsers[deleteIdx] as any)?.fullName : ""
        }
      />
      <EditAccountDialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditIdx(null);
        }}
        onSave={handleEdit}
        loading={loadingEdit}
        user={editIdx !== null ? filteredUsers[editIdx] : undefined}
      />
    </AdminLayout>
  );
}

export default Accounts;
