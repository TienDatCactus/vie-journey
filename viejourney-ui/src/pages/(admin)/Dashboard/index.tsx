import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArticleIcon from "@mui/icons-material/Article";
import FlagIcon from "@mui/icons-material/Flag";
import LoginIcon from "@mui/icons-material/Login";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { LicenseInfo } from "@mui/x-license";
import { AdminLayout } from "../../../layouts";

// Set MUI Pro License
LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_PRO_KEY);

// Top Stats Cards Data
const statsData = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+17 new today",
    icon: <PeopleIcon />,
    color: "#e3f2fd",
    iconColor: "#1976d2",
  },
  {
    title: "Active Users (7d)",
    value: "3,421",
    change: "+5.25% from last week",
    icon: <TrendingUpIcon />,
    color: "#e8f5e8",
    iconColor: "#2e7d32",
  },
  {
    title: "Number of Admins",
    value: "8",
    change: "Access control size",
    icon: <AdminPanelSettingsIcon />,
    color: "#ffebee",
    iconColor: "#d32f2f",
  },
  {
    title: "Blog Posts",
    value: "5,632",
    change: "+156 today",
    icon: <ArticleIcon />,
    color: "#f3e5f5",
    iconColor: "#7b1fa2",
    flagged: 23,
  },
];

// Blog Posts Overview Data
const blogOverviewData = [
  { label: "Total Blog Posts", value: "5,632", color: "#333" },
  { label: "Flagged Blogs", value: "23", color: "#f44336", flag: true },
  { label: "Published Today", value: "+156", color: "#4caf50" },
  { label: "Growth Rate", value: "+8.3%", color: "#4caf50" },
];

// Recent Actions Data
const recentActions = [
  {
    id: 1,
    action: "User Registration",
    user: "john.doe@email.com",
    details: "New user registered",
    severity: "Info",
    time: "14:30:25",
    icon: <PersonAddIcon />,
  },
  {
    id: 2,
    action: "Blog Flagged",
    user: "admin@system.com",
    details: "Blog 'How to Make Money Fast' flagged for spam",
    severity: "Warning",
    time: "14:25:12",
    icon: <FlagIcon />,
  },
  {
    id: 3,
    action: "Admin Login",
    user: "sarah.admin@company.com",
    details: "Admin user logged in",
    severity: "Info",
    time: "14:20:45",
    icon: <LoginIcon />,
  },
  {
    id: 4,
    action: "Content Removed",
    user: "moderator@system.com",
    details: "Blog post removed due to policy violation",
    severity: "High",
    time: "14:15:33",
    icon: <RemoveCircleIcon />,
  },
  {
    id: 5,
    action: "User Suspended",
    user: "admin@system.com",
    details: "User account suspended for 7 days",
    severity: "High",
    time: "14:10:18",
    icon: <PersonOffIcon />,
  },
];

const actionsColumns: GridColDef[] = [
  {
    field: "action",
    headerName: "Action",
    width: 180,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        {params.row.icon}
        <Typography variant="body2">{params.value}</Typography>
      </Stack>
    ),
  },
  {
    field: "user",
    headerName: "User",
    width: 250,
    renderCell: (params) => (
      <Typography variant="body2" color="primary">
        {params.value}
      </Typography>
    ),
  },
  {
    field: "details",
    headerName: "Details",
    width: 300,
    flex: 1,
  },
  {
    field: "severity",
    headerName: "Severity",
    width: 100,
    renderCell: (params) => {
      const color =
        params.value === "High"
          ? "error"
          : params.value === "Warning"
          ? "warning"
          : "info";
      return <Chip label={params.value} color={color} size="small" />;
    },
  },
  {
    field: "time",
    headerName: "Time",
    width: 100,
    renderCell: (params) => (
      <Typography variant="body2" color="text.secondary">
        {params.value}
      </Typography>
    ),
  },
];

function AdminPage() {
  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary" className="mb-6">
            High-level snapshot of system activities and metrics
          </Typography>
        </Box>
        {/* Top Stats Cards */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ height: "100%", position: "relative" }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        color: stat.iconColor,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.change}
                      </Typography>
                    </Box>
                  </Stack>
                  {stat.flagged && (
                    <Chip
                      label={`${stat.flagged} flagged`}
                      color="error"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontSize: "0.75rem",
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        {/* Main Content - Two Columns */}
        <Grid2 container spacing={3}>
          {/* Blog Posts Overview - 1/4 width */}
          <Grid2 size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Blog Posts Overview
              </Typography>
              <Typography color="text.secondary" mb={3}>
                Content statistics and health metrics
              </Typography>

              <Stack spacing={3}>
                {blogOverviewData.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: item.color }}
                      >
                        {item.value}
                      </Typography>
                      {item.flag && (
                        <Chip
                          label="F"
                          color="error"
                          size="small"
                          sx={{ minWidth: 24, height: 20 }}
                        />
                      )}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid2>

          {/* Recent Actions - 3/4 width */}
          <Grid2 size={{ xs: 12, md: 9 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" fontWeight="bold">
                  Recent Actions
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  endIcon={<VisibilityIcon />}
                  sx={{ textTransform: "none" }}
                >
                  View Activity Log
                </Button>
              </Stack>
              <Typography color="text.secondary" mb={3}>
                Last 10 items from activity log
              </Typography>

              <Box sx={{ height: 400, width: "100%" }}>
                <DataGridPremium
                  rows={recentActions}
                  columns={actionsColumns}
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
                      display: "flex",
                      alignItems: "center",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#fafafa",
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid2>
        </Grid2>
      </Box>
    </AdminLayout>
  );
}

export default AdminPage;
