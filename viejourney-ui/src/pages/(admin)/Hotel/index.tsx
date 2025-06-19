import React, { useState } from "react";
import { AdminLayout } from "../../../layouts";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Avatar,
} from "@mui/material";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { LicenseInfo } from "@mui/x-license";
import {
  Add as AddIcon,
  FileUpload as ImportIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Hotel as HotelIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import AddHotelDialog from "./AddHotelDialog";
import EditHotelDialog from "./EditHotelDialog";
import ImportHotelDialog from "./ImportHotelDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

// Set MUI Pro License
LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_PRO_KEY);

interface Hotel {
  _id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  coordinate: string;
  image: string[];
}

// Actions Menu Component
const ActionMenu = ({
  hotelId,
  onEdit,
  onDelete,
  onView,
}: {
  hotelId: string;
  onEdit: (hotelId: string) => void;
  onDelete: (hotelId: string) => void;
  onView: (hotelId: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    onView(hotelId);
    handleClose();
  };

  const handleEdit = () => {
    onEdit(hotelId);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(hotelId);
    handleClose();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-controls={open ? "hotel-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id="hotel-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Detail</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Hotel</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Hotel</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Sample data
const sampleHotels: Hotel[] = [
  {
    _id: "684472f4c7f674e5061783c7",
    name: "Sunshine Resort",
    description: "Resort bên bờ biển với tiện nghi cao cấp",
    rating: 4.8,
    address: "123 Biển Xanh, Nha Trang",
    coordinate: "{'latitude': 12.2388, 'longitude': 109.1967}",
    image: ["resort1.jpg", "resort2.jpg"],
  },
  {
    _id: "684472f4c7f674e5061783c8",
    name: "Grand Plaza Hotel",
    description: "Khách sạn sang trọng tại trung tâm thành phố",
    rating: 4.5,
    address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
    coordinate: "{'latitude': 10.7769, 'longitude': 106.7009}",
    image: ["hotel1.jpg", "hotel2.jpg"],
  },
  {
    _id: "684472f4c7f674e5061783c9",
    name: "Mountain View Lodge",
    description: "Khu nghỉ dưỡng trên núi với view tuyệt đẹp",
    rating: 4.2,
    address: "789 Đường Núi, Sa Pa, Lào Cai",
    coordinate: "{'latitude': 22.3364, 'longitude': 103.8438}",
    image: ["lodge1.jpg", "lodge2.jpg"],
  },
];

const HotelManagement = () => {
  const [hotels, setHotels] = useState<Hotel[]>(sampleHotels);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [deleteHotelId, setDeleteHotelId] = useState<string | null>(null);

  const handleAddHotel = () => {
    setAddDialogOpen(true);
  };

  const handleImportHotels = () => {
    setImportDialogOpen(true);
  };

  const handleEditHotel = (hotelId: string) => {
    const hotel = hotels.find((h) => h._id === hotelId);
    if (hotel) {
      setSelectedHotel(hotel);
      setEditDialogOpen(true);
    }
  };

  const handleDeleteHotel = (hotelId: string) => {
    setDeleteHotelId(hotelId);
    setDeleteDialogOpen(true);
  };

  const handleViewHotel = (hotelId: string) => {
    console.log("View hotel:", hotelId);
    // Navigate to hotel detail page
  };

  const handleSaveHotel = async (hotelData: Partial<Hotel>) => {
    setLoading(true);
    try {
      if (selectedHotel) {
        // Update existing hotel
        setHotels((prev) =>
          prev.map((h) =>
            h._id === selectedHotel._id ? { ...h, ...hotelData } : h
          )
        );
      } else {
        // Add new hotel
        const newHotel: Hotel = {
          _id: Date.now().toString(),
          name: hotelData.name || "",
          description: hotelData.description || "",
          rating: hotelData.rating || 0,
          address: hotelData.address || "",
          coordinate: hotelData.coordinate || "",
          image: hotelData.image || [],
        };
        setHotels((prev) => [...prev, newHotel]);
      }

      setAddDialogOpen(false);
      setEditDialogOpen(false);
      setSelectedHotel(null);
    } catch (error) {
      console.error("Error saving hotel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteHotelId) return;

    setLoading(true);
    try {
      setHotels((prev) => prev.filter((h) => h._id !== deleteHotelId));
      setDeleteDialogOpen(false);
      setDeleteHotelId(null);
    } catch (error) {
      console.error("Error deleting hotel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportComplete = (importedHotels: Hotel[]) => {
    setHotels((prev) => [...prev, ...importedHotels]);
    setImportDialogOpen(false);
  };

  // DataGrid columns definition
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "NAME",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            <HotelIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.value}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: "description",
      headerName: "DESCRIPTION",
      flex: 1.2,
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "rating",
      headerName: "RATING",
      flex: 0.6,
      minWidth: 120,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating value={params.value} readOnly size="small" precision={0.1} />
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "address",
      headerName: "ADDRESS",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <ActionMenu
          hotelId={params.row._id}
          onEdit={handleEditHotel}
          onDelete={handleDeleteHotel}
          onView={handleViewHotel}
        />
      ),
    },
  ];

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
              Hotel Management
            </Typography>
            <Typography color="text.secondary">
              Manage your hotel inventory and details
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ImportIcon />}
              onClick={handleImportHotels}
              sx={{ textTransform: "none" }}
            >
              Import Hotels
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddHotel}
              sx={{ textTransform: "none" }}
            >
              Add Hotel
            </Button>
          </Stack>
        </Stack>

        {/* Hotel List */}
        <Paper sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <HotelIcon color="action" />
                <Typography variant="h6" fontWeight="bold">
                  Hotel List
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="body2">
                View and manage all hotels in the system
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ height: 600, width: "100%" }}>
            <DataGridPremium
              rows={hotels}
              columns={columns}
              getRowId={(row) => row._id}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              disableRowSelectionOnClick
              disableColumnMenu
              hideFooterSelectedRowCount
              checkboxSelection={false}
              disableColumnSelector
              disableColumnFilter
              disableColumnResize
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

        {/* Dialogs */}
        <AddHotelDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSave={handleSaveHotel}
          loading={loading}
        />

        <EditHotelDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedHotel(null);
          }}
          hotel={selectedHotel}
          onSave={handleSaveHotel}
          loading={loading}
        />

        <ImportHotelDialog
          open={importDialogOpen}
          onClose={() => setImportDialogOpen(false)}
          onImport={handleImportComplete}
          loading={loading}
        />

        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeleteHotelId(null);
          }}
          onConfirm={handleConfirmDelete}
          loading={loading}
          hotelName={
            deleteHotelId
              ? hotels.find((h) => h._id === deleteHotelId)?.name || ""
              : ""
          }
        />
      </Box>
    </AdminLayout>
  );
};

export default HotelManagement;
