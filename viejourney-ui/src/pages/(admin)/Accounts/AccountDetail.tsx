import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Grid2,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../layouts";
import {
  doDeleteUser,
  doGetUserDetail,
  doUpdateUserInfo,
} from "../../../services/api";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import EditAccountDialog from "./EditAccountDialog";

const tabList = ["Overview", "Activity"];

const activities = [
  {
    id: 1,
    color: "success.main",
    title: "Reynatte placed new order",
    date: "April 19, 2023",
    content: (
      <>
        New order placed{" "}
        <Typography component="span" color="primary" fontWeight={600}>
          #456987
        </Typography>
      </>
    ),
    actions: ["done", "view", "more"],
  },
  {
    id: 2,
    color: "info.main",
    title: "5+ friends join this group",
    date: "April 20, 2023",
    content: (
      <>
        Joined the group{" "}
        <Typography component="span" color="primary" fontWeight={600}>
          "Duralux"
        </Typography>
      </>
    ),
    actions: ["done", "view", "more"],
  },
  {
    id: 3,
    color: "secondary.main",
    title: "Socrates send you friend request",
    date: "April 21, 2023",
    content: <>New friend request</>,
    actions: ["done", "view", "more"],
  },
  {
    id: 4,
    color: "success.main",
    title: "Reynatte make deposit $565 USD",
    date: "April 22, 2023",
    content: (
      <>
        Make deposit{" "}
        <Typography component="span" color="primary" fontWeight={600}>
          $565 USD
        </Typography>
      </>
    ),
    actions: ["done", "view", "more"],
  },
  {
    id: 5,
    color: "info.main",
    title: "New event are coming soon",
    date: "April 23, 2023",
    content: (
      <>
        Attending the event{" "}
        <Typography component="span" color="primary" fontWeight={600}>
          "Duralux Event"
        </Typography>
      </>
    ),
    actions: ["done", "view", "more"],
  },
  {
    id: 6,
    color: "info.main",
    title: "5+ friends join this group",
    date: "April 20, 2023",
    content: (
      <>
        Joined the group{" "}
        <Typography component="span" color="primary" fontWeight={600}>
          "Duralux"
        </Typography>
      </>
    ),
    actions: ["done", "view", "more"],
  },
  {
    id: 7,
    color: "error.main",
    title: "New meeting joining are pending",
    date: "April 23, 2023",
    content: <>Duralux meeting</>,
    actions: ["done", "view", "more"],
  },
  {
    id: 8,
    color: "info.main",
    title: "5+ friends join this group",
    date: "April 20, 2023",
    content: (
      <>
        Joined the group{" "}
        <Typography component="span" color="primary" fontWeight={600}>
          "Duralux"
        </Typography>
      </>
    ),
    actions: ["done", "view", "more"],
  },
  {
    id: 9,
    color: "secondary.main",
    title: "Socrates send you friend request",
    date: "April 21, 2023",
    content: <>New friend request</>,
    actions: ["done", "view", "more"],
  },
];

// Helper to format date as dd/MM/yyyy
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("vi-VN");
};

const AccountDetail = () => {
  const [tab, setTab] = React.useState(0);
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const { id } = useParams();
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountDetail = async () => {
      try {
        if (!id) return;
        const data = await doGetUserDetail(id);
        setUser(data);
      } catch (err) {
        console.log("ERROR: " + err);
      }
    };
    fetchAccountDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setLoadingDelete(true);
    try {
      await doDeleteUser(id);
      setLoadingDelete(false);
      setOpenDelete(false);
      navigate("/admin/accounts");
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
    if (!id) return;
    setLoadingEdit(true);
    try {
      await doUpdateUserInfo(id, data);
      setLoadingEdit(false);
      setOpenEdit(false);
      // Reload lại user
      const updated = await doGetUserDetail(id);
      setUser(updated);
    } catch (err) {
      setLoadingEdit(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Grid2 container spacing={2}>
          {/* Left Side */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Stack alignItems="center" spacing={1}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={user?.avatar || undefined}
                    alt={user?.fullName || undefined}
                    sx={{ width: 100, height: 100, mb: 1 }}
                  />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {user?.fullName}
                </Typography>
                <Typography color="text.secondary" fontSize={15}>
                  {user?.userId}
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography color="text.secondary" fontSize={15}>
                    Address
                  </Typography>
                  <Box flex={1} />
                  <Typography fontSize={15}>{user?.address}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography color="text.secondary" fontSize={15}>
                    Phone
                  </Typography>
                  <Box flex={1} />
                  <Typography fontSize={15}>{user?.phone}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography color="text.secondary" fontSize={15}>
                    Email
                  </Typography>
                  <Box flex={1} />
                  <Typography fontSize={15}>{user?.userId.email}</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2} mt={4}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  fullWidth
                  onClick={() => setOpenDelete(true)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setOpenEdit(true)}
                >
                  Edit Profile
                </Button>
              </Stack>
            </Paper>
          </Grid2>
          {/* Right Side */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  mb: 2,
                  "& .MuiTab-root": { fontWeight: 600, fontSize: 16 },
                }}
              >
                {tabList.map((label) => (
                  <Tab key={label} label={label} />
                ))}
              </Tabs>
              {tab === 0 && (
                <Box>
                  <Typography fontWeight={600} fontSize={18} mb={1}>
                    Profile Details:
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={5} md={4}>
                      <Stack spacing={1}>
                        <Typography color="text.secondary" fontWeight={600}>
                          Full Name:
                        </Typography>
                        <Typography color="text.secondary" fontWeight={600}>
                          Date of Birth:
                        </Typography>
                        <Typography color="text.secondary" fontWeight={600}>
                          Mobile Number:
                        </Typography>
                        <Typography color="text.secondary" fontWeight={600}>
                          Email Address:
                        </Typography>
                        <Typography color="text.secondary" fontWeight={600}>
                          Address:
                        </Typography>
                        <Typography color="text.secondary" fontWeight={600}>
                          Joining Date:
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={7} md={8}>
                      <Stack spacing={1}>
                        <Typography>{user?.fullName}</Typography>
                        <Typography>{formatDate(user?.dob)}</Typography>
                        <Typography>{user?.phone}</Typography>
                        <Typography>{user?.userId.email}</Typography>
                        <Typography>{user?.address}</Typography>
                        <Typography>
                          {user?.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString()
                            : ""}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {tab === 1 && (
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography fontWeight={600} fontSize={18}>
                      Recent Activity:
                    </Typography>
                    <Button variant="outlined" size="small">
                      VIEW ALLS
                    </Button>
                  </Stack>
                  <Stack spacing={3} sx={{ position: "relative" }}>
                    {activities.map((act, idx) => (
                      <Stack
                        key={act.id}
                        direction="row"
                        alignItems="flex-start"
                        spacing={2}
                        sx={{ position: "relative" }}
                      >
                        {/* Timeline dot and line */}
                        <Box
                          sx={{
                            position: "relative",
                            minWidth: 24,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <FiberManualRecordIcon
                            sx={{ color: act.color, fontSize: 18, zIndex: 1 }}
                          />
                          {idx < activities.length - 1 && (
                            <Box
                              sx={{
                                width: 2,
                                flex: 1,
                                bgcolor: "#e0e0e0",
                                position: "absolute",
                                top: 18,
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 0,
                              }}
                            />
                          )}
                        </Box>
                        {/* Activity content */}
                        <Box flex={1}>
                          <Typography fontSize={15} color="text.secondary">
                            {act.title}{" "}
                            <Typography
                              component="span"
                              fontSize={13}
                              color="text.disabled"
                            >
                              [{act.date}]
                            </Typography>
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mt={0.5}
                          >
                            <Typography fontWeight={500} fontSize={16}>
                              {act.content}
                            </Typography>
                            {/* Ví dụ nút Conform, Join... */}
                            {act.id === 3 && (
                              <Chip
                                label="Conform"
                                color="success"
                                size="small"
                              />
                            )}
                            {act.id === 7 && (
                              <Chip label="Join" color="warning" size="small" />
                            )}
                          </Stack>
                        </Box>
                        {/* Actions */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton size="small">
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid2>
        <ConfirmDeleteDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={handleDelete}
          loading={loadingDelete}
          userName={user?.fullName}
        />
        <EditAccountDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onSave={handleEdit}
          loading={loadingEdit}
          user={user || undefined}
        />
      </Box>
    </DashboardLayout>
  );
};

export default AccountDetail;
