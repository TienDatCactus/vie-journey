import {
  Add,
  CheckCircle,
  Download,
  FilterList,
  Flag,
  GridView,
  MenuBook,
  Newspaper,
  Schedule,
  Search,
  ViewList,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  type SelectChangeEvent,
} from "@mui/material";
import {
  DataGridPremium,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowId,
  GridRowParams,
  GridSortModel,
} from "@mui/x-data-grid-premium";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../layouts";
import BlogStatusChip from "./component/BlogStatusChip";
import StatCard from "./component/Card";
import useBlog from "./component/Container/hook";

export default function BlogManagementList() {
  const {
    blogs,
    handleDeleteBlog,
    params,
    totalBlog,
    handleChangePage,
    handleSearchChange,
    handleChangeStatus,
    handleSort,
  } = useBlog();

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowId[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: params.page - 1,
    pageSize: params.pageSize,
  });

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    try {
      setLoading(true);
      setPaginationModel(newModel);
      handleChangePage(newModel.page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSortModelChange = (model: GridSortModel) => {
    try {
      setLoading(true);
      if (model.length > 0) {
        const sort = model[0];
        handleSort(sort.sort || "asc");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // DataGrid columns definition
  const columns: GridColDef[] = [
    {
      field: "title",
      cellClassName: "flex items-center",
      headerName: "Title & Author",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Box
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              mb: 0.5,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => {
              // Navigate to blog detail
              window.location.href = `/manager/blogs/${params.row._id}`;
            }}
          >
            {params.row.title}
          </Box>
          <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            by {params.row.createdBy?.fullName || params.row.createdBy?.email}
          </Box>
        </Box>
      ),
    },
    {
      field: "destination",
      cellClassName: "flex items-center",
      headerName: "Trip & Location",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Box sx={{ fontWeight: 500, fontSize: "0.875rem", mb: 0.5 }}>
            {params.row.destination || "No destination"}
          </Box>
          <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            {params.row.places?.length || 0} places mentioned
          </Box>
        </Box>
      ),
    },
    {
      field: "content",
      headerName: "Content",
      cellClassName: "flex items-center",
      width: 200,
      renderCell: (params) => {
        const wordCount = params.row.content
          ? params.row.content.replace(/<[^>]*>/g, "").split(" ").length
          : 0;
        const summary = params.row.summary || "";

        return (
          <Box sx={{ py: 1 }}>
            <Box sx={{ fontSize: "0.875rem", mb: 0.5 }}>
              {summary.length > 50 ? `${summary.substring(0, 50)}...` : summary}
            </Box>
            <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {wordCount} words
            </Box>
          </Box>
        );
      },
    },
    {
      field: "status",
      align: "center",
      cellClassName: "flex items-center",
      headerName: "Status",
      width: 120,
      renderCell: (params) => <BlogStatusChip status={params.row.status} />,
    },
    {
      field: "dates",
      headerName: "Dates",
      cellClassName: "flex items-center",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ py: 1, fontSize: "0.75rem" }}>
          <Box sx={{ mb: 0.5 }}>
            Created: {dayjs(params.row.createdAt).format("MMM DD, YYYY")}
          </Box>
          <Box sx={{ color: "text.secondary" }}>
            Updated: {dayjs(params.row.updatedAt).format("MMM DD, YYYY")}
          </Box>
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      cellClassName: "flex items-center",
      headerName: "Actions",
      width: 120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="view"
          icon={<ViewList />}
          label="View"
          onClick={() => {
            window.location.href = `/manager/blogs/${params.row._id}`;
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Flag />}
          label="Delete"
          onClick={() => handleDeleteBlog(params.row._id)}
          showInMenu
        />,
      ],
    },
  ];

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    try {
      setLoading(true);
      handleChangeStatus(event.target.value);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    try {
      setLoading(true);
      handleSort(event.target.value);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    try {
      setLoading(true);
      rowSelectionModel.forEach((id) => {
        handleDeleteBlog(id as string);
      });
      setRowSelectionModel([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStatusChange = (status: string) => {
    // Implement bulk status change
    console.log("Bulk status change:", status, rowSelectionModel);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearchChange(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Sync pagination model with params
  useEffect(() => {
    try {
      setLoading(true);
      setPaginationModel({
        page: params.page - 1,
        pageSize: params.pageSize,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.pageSize]);

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, bgcolor: "grey.50", minHeight: "100vh" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Box sx={{ bgcolor: "grey.200", p: 2, borderRadius: 1 }}>
              <Newspaper sx={{ fontSize: "2rem" }} />
            </Box>
            <Box>
              <Box
                sx={{
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "grey.900",
                  mb: 0.5,
                }}
              >
                Blog Content Dashboard
              </Box>
              <Box sx={{ color: "grey.500", fontSize: "1rem" }}>
                Manage and moderate travel blog posts
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{
                color: "black",
                borderColor: "grey.300",
                bgcolor: "white",
                borderRadius: 0.5,
              }}
            >
              Export
            </Button>
            <Link to="/blogs/create">
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  bgcolor: "rgba(0,0,0,0.8)",
                  color: "white",
                  borderRadius: 0.5,
                }}
              >
                New Post
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Stats Cards */}
        {!loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 4,
              mb: 2,
            }}
          >
            <StatCard
              title="Total Posts"
              value={totalBlog + ""}
              icon={<MenuBook sx={{ color: "grey.600" }} />}
            />
            <StatCard
              title="Published"
              value="3"
              icon={<CheckCircle sx={{ color: "grey.600" }} />}
            />
            <StatCard
              title="Pending Review"
              value="1"
              icon={<Schedule sx={{ color: "grey.600" }} />}
            />
            <StatCard
              title="Flagged"
              value="2"
              icon={<Flag sx={{ color: "grey.600" }} />}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 4,
              mb: 2,
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{ borderRadius: 1 }}
            />{" "}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{ borderRadius: 1 }}
            />{" "}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        )}

        {/* Filters and Search */}
        <Card elevation={0} className="shadow-sm" sx={{ mb: 2, p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <TextField
              placeholder="Search by title, author, tag, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 0.5, height: 40 },
                },
              }}
              sx={{ minWidth: 300 }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <FilterList sx={{ color: "grey.500", fontSize: 16 }} />
                  <Box sx={{ color: "grey.500", fontSize: "0.875rem" }}>
                    Filters:
                  </Box>
                </Box>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={params.status}
                    label="Status"
                    onChange={handleStatusFilterChange}
                    sx={{ borderRadius: 0.5 }}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={params.sort}
                    label="Sort By"
                    onChange={handleSortByChange}
                    sx={{ borderRadius: 0.5 }}
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newAlignment) => {
                  if (newAlignment !== null) {
                    setViewMode(newAlignment);
                  }
                }}
              >
                <ToggleButton value="cards">
                  <GridView sx={{ fontSize: 16 }} />
                </ToggleButton>
                <ToggleButton value="table">
                  <ViewList sx={{ fontSize: 16 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Bulk Actions */}
          {rowSelectionModel.length > 0 && (
            <Box
              sx={{ mt: 3, p: 2, bgcolor: "primary.light", borderRadius: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ color: "primary.dark", fontWeight: 500 }}>
                  {rowSelectionModel.length} item(s) selected
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleBulkStatusChange("APPROVED")}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleBulkStatusChange("REJECTED")}
                >
                  Reject
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          )}
        </Card>

        {/* DataGrid */}
        <Card elevation={0} sx={{ boxShadow: 1, height: 500 }}>
          <DataGridPremium
            rows={blogs || []}
            columns={columns}
            getRowId={(row) => row._id}
            loading={loading}
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            rowCount={totalBlog || 0}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            // Sorting
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
            // Selection
            checkboxSelection
            // Styling
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "grey.50",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "grey.100",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "grey.50",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid",
                borderColor: "grey.300",
                backgroundColor: "grey.50",
              },
            }}
            // Features
            disableColumnFilter={false}
            disableColumnSelector={false}
            disableDensitySelector={false}
            // Row height
            getRowHeight={() => "auto"}
            getEstimatedRowHeight={() => 80}
          />
        </Card>
      </Box>
    </DashboardLayout>
  );
}
