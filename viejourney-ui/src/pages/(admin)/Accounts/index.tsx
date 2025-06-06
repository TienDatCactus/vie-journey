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
import { useState } from "react";
import { Link } from "react-router-dom";

const users = [
  {
    id: 1,
    name: "Alexandra Della",
    email: "alex.della@outlook.com",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    phone: "+1 (375) 9632 548",
    date: "2023-04-05, 00:05PM",
    status: "Active",
  },
  {
    id: 2,
    name: "Nancy Elliot",
    email: "nancy.elliot@outlook.com",
    avatar: null,
    phone: "(375) 8523 456",
    date: "2023-04-06, 02:52PM",
    status: "Active",
  },
  {
    id: 3,
    name: "Green Cute",
    email: "green.cute@outlook.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    phone: "(845) 9632 874",
    date: "2023-04-08, 08:34PM",
    status: "Active",
  },
  {
    id: 4,
    name: "Henry Leach",
    email: "henry.leach@outlook.com",
    avatar: null,
    phone: "(258) 9514 657",
    date: "2023-04-10, 05:25PM",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Marianne Audrey",
    email: "marine.adrey@outlook.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    phone: "(456) 6547 524",
    date: "2023-04-12, 12:02PM",
    status: "Active",
  },
  {
    id: 6,
    name: "Nancy Elliot",
    email: "nancy.elliot@outlook.com",
    avatar: null,
    phone: "(375) 8523 456",
    date: "2023-04-15, 02:40PM",
    status: "Active",
  },
  {
    id: 7,
    name: "Cute Green",
    email: "cute.green@outlook.com",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    phone: "(632) 5486 662",
    date: "2023-04-25, 03:42PM",
    status: "Active",
  },
  {
    id: 8,
    name: "Leach Henry",
    email: "leach.henry@outlook.com",
    avatar: null,
    phone: "(951) 5478 884",
    date: "2023-04-14, 03:32PM",
    status: "Active",
  },
];

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
  const [anchorEls, setAnchorEls] = useState<(null | HTMLElement)[]>(
    users.map(() => null)
  );
  const [statusList, setStatusList] = useState(users.map((u) => u.status));
  const [search, setSearch] = useState("");

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
  const handleStatusChange = (index: number, value: string) => {
    const newStatus = [...statusList];
    newStatus[index] = value;
    setStatusList(newStatus);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

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
                {filteredUsers.map((user, idx) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Link to={`detail`} className="hover:text-blue-400">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {user.avatar ? (
                            <Avatar src={user.avatar} alt={user.name} />
                          ) : (
                            <Avatar>{stringAvatar(user.name)}</Avatar>
                          )}
                          <Typography>{user.name}</Typography>
                        </Stack>
                      </Link>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{user.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{user.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={statusList[idx]}
                          onChange={(e) =>
                            handleStatusChange(idx, e.target.value)
                          }
                          sx={{
                            fontWeight: 500,
                            "& .MuiSelect-select": {
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                          <Link to={`detail`}>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </AdminLayout>
  );
}

export default Accounts;
