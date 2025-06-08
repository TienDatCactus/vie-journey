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

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_PRIVATE_URL + ACCOUNTS.GET_ACCOUNTS,
          { withCredentials: true }
        );
        const data = res.data?.data || res.data || [];
        setUsers(data);
        setAnchorEls(data.map(() => null));
      } catch (err) {
        console.log("ERROR: " + err);
      }
    };
    fetchAccounts();
  }, []);

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

  return (
    <AdminLayout>
      <Box className="py-[10px] bg-[#f6f8f9] min-h-screen">
        <Box sx={{ p: 2, background: "white", borderRadius: 2, boxShadow: 1 }}>
          <Stack direction="row" alignItems="center" mb={2}>
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
                      <TableCell>{user.userId.email || "-"}</TableCell>
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
                              onClick={() => handleMenuClose(idx)}
                              className="hover:text-blue-400"
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleMenuClose(idx)}
                              className="hover:text-blue-400"
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
        </Box>
      </Box>
    </AdminLayout>
  );
}

export default Accounts;
