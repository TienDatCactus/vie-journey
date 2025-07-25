import {
  ArticleOutlined,
  Difference,
  OnlinePrediction,
} from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import MapPinIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import ActivityIcon from "@mui/icons-material/Speed";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  Grid2,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  useAdminAnalyticsStore,
  useAnalyticsData,
  useAnalyticsLoading,
} from "../../../services/stores/useAdminAnalyticsStore";

function AdminPage() {
  const { fetchAnalytics, setTimeRange } = useAdminAnalyticsStore();
  const analytics = useAnalyticsData();
  const loading = useAnalyticsLoading();
  const [timeRange, setTimeRangeLocal] = useState("30d");

  useEffect(() => {
    (async () => {
      await fetchAnalytics();
    })();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{ p: 3 }}
          className="flex flex-col items-center justify-center h-screen"
        >
          <CircularProgress />
          <Typography variant="h5" fontWeight="300" sx={{ mt: 2 }}>
            Loading analytics...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }
  const handleTimeRangeChange = (newTimeRange: "7d" | "30d" | "90d" | "1y") => {
    setTimeRangeLocal(newTimeRange);
    setTimeRange(newTimeRange);
  };

  // Use analytics data instead of hardcoded data
  const contentCreationData = analytics?.contentCreationData || [];
  const engagementData = analytics?.engagementData || [];
  const userActivityData = analytics?.userActivityData || [];
  const contentStatusData = analytics?.contentStatusData || [];
  const topLocationsData = analytics?.topLocationsData || [];

  const statsData = [
    {
      title: "Total Users",
      value: analytics?.totalUsers?.toLocaleString() || "0",
      change: analytics?.userGrowthData
        ? `${
            analytics?.userGrowthData && analytics?.userGrowthData.length > 0
              ? "+"
              : ""
          }${analytics.userGrowthData.length} today`
        : "No data",
      icon: <PeopleIcon />,
      color: "#e3f2fd",
      iconColor: "#1976d2",
    },
    {
      title: "Total Trips",
      value: analytics?.totalTrips?.toLocaleString() || "0",
      change: analytics?.totalTrips
        ? `${analytics.totalTrips > 0 ? "+" : ""}${analytics.totalTrips} today`
        : "No data",
      icon: <MapPinIcon />,
      color: "#e8f5e8",
      iconColor: "#2e7d32",
    },
    {
      title: "Blog Posts",
      value: analytics?.totalBlogs?.toLocaleString() || "0",
      change: analytics?.totalBlogs
        ? `${analytics.totalBlogs > 0 ? "+" : ""}${analytics.totalBlogs} today`
        : "No data",
      icon: <ArticleIcon />,
      color: "#f3e5f5",
      iconColor: "#7b1fa2",
    },
    {
      title: "Total Interactions",
      value: analytics?.totalInteractions?.toLocaleString() || "0",
      change: analytics?.totalInteractions
        ? `${analytics.totalInteractions > 0 ? "+" : ""}${
            Math.abs(analytics.totalInteractions) >= 1000
              ? `${(analytics.totalInteractions / 1000).toFixed(1)}k`
              : analytics.totalInteractions
          } today`
        : "No data",
      icon: <ActivityIcon />,
      color: "#fff3e0",
      iconColor: "#f57c00",
    },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="300" sx={{ mb: 1 }}>
              Analytics Dashboard
            </Typography>
            <Typography color="text.secondary">
              Comprehensive insights into platform performance and user
              engagement
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) =>
                handleTimeRangeChange(
                  e.target.value as "7d" | "30d" | "90d" | "1y"
                )
              }
              size="small"
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Key Metrics Cards */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card elevation={0} className="shadow-sm" sx={{ height: "100%" }}>
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
                      <Typography variant="h4" fontWeight="300">
                        {stat.value}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.change.startsWith("+")
                            ? "success.main"
                            : "text.secondary",
                        }}
                      >
                        {stat.change}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        {/* Charts Grid */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          {/* User Growth Chart - Updated to ScatterChart */}
          <Grid2 size={{ xs: 12, lg: 4 }}>
            <Card elevation={0} className="shadow-sm">
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PeopleIcon sx={{ fontSize: 20 }} />
                    <Typography variant="h6">User Activity</Typography>
                  </Stack>
                }
              />
              <CardContent className="h-full">
                <PieChart
                  series={[
                    {
                      data: userActivityData,
                      innerRadius: 40,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  height={200}
                  hideLegend
                />
                <Box
                  sx={{
                    mt: 2,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {userActivityData.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight="500">
                        {item.value.toLocaleString()}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid2>

          {/* Content Creation Chart */}
          <Grid2 size={{ xs: 12, lg: 8 }}>
            <Card elevation={0} className="shadow-sm">
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ArticleOutlined sx={{ fontSize: 20 }} />
                    <Typography variant="h6">Content Creation</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <BarChart
                  dataset={contentCreationData}
                  className="h-68"
                  xAxis={[
                    {
                      dataKey: "month",
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      dataKey: "blogs",
                      label: "Blogs",
                      color: "#8b5cf6",
                    },
                    {
                      dataKey: "trips",
                      label: "Trips",
                      color: "#06b6d4",
                    },
                  ]}
                  height={300}
                  grid={{ horizontal: true }}
                />
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        {/* Engagement and Activity */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          {/* Weekly Engagement */}
          <Grid2 size={12}>
            <Card elevation={0} className="shadow-sm">
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <OnlinePrediction sx={{ fontSize: 20 }} />
                    <Typography variant="h6">Weekly Engagement</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <LineChart
                  dataset={engagementData}
                  xAxis={[
                    {
                      dataKey: "day",
                      scaleType: "point",
                    },
                  ]}
                  series={[
                    {
                      dataKey: "likes",
                      label: "Likes",
                      color: "#ef4444",
                      curve: "catmullRom",
                    },
                    {
                      dataKey: "comments",
                      label: "Comments",
                      color: "#3b82f6",
                      curve: "catmullRom",
                    },
                    {
                      dataKey: "shares",
                      label: "Shares",
                      color: "#10b981",
                      curve: "catmullRom",
                    },
                  ]}
                  height={300}
                  grid={{ horizontal: true, vertical: true }}
                />
              </CardContent>
            </Card>
          </Grid2>

          {/* User Activity Distribution */}
        </Grid2>

        {/* Bottom Section */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          {/* Popular Destinations */}
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Card
              elevation={0}
              className="shadow-sm max-h-105 overflow-y-scroll"
            >
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MapPinIcon sx={{ fontSize: 20 }} />
                    <Typography variant="h6">Popular Destinations</Typography>
                  </Stack>
                }
              />
              <CardContent>
                <List disablePadding>
                  {topLocationsData.map((location, index) => (
                    <Box key={index}>
                      <ListItem
                        sx={{
                          bgcolor: "grey.50",
                          borderRadius: 1,
                          mb: 1,
                          px: 2,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="500">
                              {location.location}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {location.trips} trips • {location.blogs} blogs
                            </Typography>
                          }
                        />
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="h6" fontWeight="300">
                            {(location.trips + location.blogs).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            total content
                          </Typography>
                        </Box>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid2>

          {/* Content Status */}
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <Card elevation={0} className="shadow-sm ">
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Difference sx={{ fontSize: 20 }} />
                    <Typography variant="h6">
                      Content Status Overview
                    </Typography>
                  </Stack>
                }
              />
              <CardContent>
                <PieChart
                  series={[
                    {
                      data: contentStatusData,
                      outerRadius: 80,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  hideLegend
                  height={200}
                />
                <Grid2 container spacing={2} sx={{ mt: 2 }}>
                  {contentStatusData.map((item) => (
                    <Grid2 size={6} key={item.id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight="500">
                            {item.value.toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid2>
                  ))}
                </Grid2>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </Box>
    </DashboardLayout>
  );
}

export default AdminPage;
