import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Hotel as HotelIcon,
  FileUpload as ImportIcon,
  LocationOn as LocationIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doCreateHotel, doGetAllHotels } from "../../../services/api";
import { Hotel } from "../../../utils/interfaces";
import AddHotelDialog from "./AddHotelDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import EditHotelDialog from "./EditHotelDialog";
import ImportHotelDialog from "./ImportHotelDialog";
import { DashboardLayout } from "../../../layouts";

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

const HotelManagement = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [deleteHotelId, setDeleteHotelId] = useState<string | null>(null);

  // Fetch hotels data
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const result = await doGetAllHotels();

        // Process the response data to match our interface
        const processedHotels = result.map((hotel: Hotel) => ({
          _id: hotel._id,
          name: hotel.name,
          description: hotel.description,
          rating: hotel.rating,
          address: hotel.address,
          coordinate: hotel.coordinate,
          // Parse images array if it's a string
          images: Array.isArray(hotel.images)
            ? hotel.images
                .map((img: string) => {
                  // If image is in format "['img1.jpg', 'img2.jpg']", parse it
                  if (img.startsWith("[") && img.endsWith("]")) {
                    try {
                      return JSON.parse(img.replace(/'/g, '"'));
                    } catch {
                      return [img];
                    }
                  }
                  return img;
                })
                .flat()
            : hotel.images || [],
        }));

        setHotels(processedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        // Set fallback data if API fails
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

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
    navigate(`/manager/hotels/detail/${hotelId}`);
  };

  const handleSaveHotel = async (hotelData: Partial<Hotel>) => {
    setLoading(true);
    try {
      if (selectedHotel) {
        // Update existing hotel (this is for backward compatibility)
        setHotels((prev) =>
          prev.map((h) =>
            h._id === selectedHotel._id ? { ...h, ...hotelData } : h
          )
        );
      } else {
        // Add new hotel - Call CREATE_HOTEL API
        console.log("Calling CREATE_HOTEL API with payload:", hotelData);

        await doCreateHotel(hotelData as any);
        const fetchHotels = async () => {
          try {
            const result = await doGetAllHotels();

            const processedHotels = result.map((hotel: Hotel) => ({
              ...hotel,
              coordinate:
                typeof hotel.coordinate === "object"
                  ? JSON.stringify(hotel.coordinate)
                  : hotel.coordinate,
              // Ensure images field is properly handled
              images: hotel.images || [],
            }));

            setHotels(processedHotels);
          } catch (error) {
            console.error("Error refreshing hotels:", error);
          }
        };

        await fetchHotels();
      }

      setAddDialogOpen(false);
      setEditDialogOpen(false);
      setSelectedHotel(null);
    } catch (error) {
      console.error("Error saving hotel:", error);
      // Show error message to user
      alert("Failed to save hotel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // New function to handle hotel update via API
  const handleUpdateHotel = async () => {
    // Refresh the hotel list after successful update
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const result = await doGetAllHotels();

        const processedHotels = result.data.map((hotel: Hotel) => ({
          _id: hotel._id,
          name: hotel.name,
          description: hotel.description,
          rating: hotel.rating,
          address: hotel.address,
          coordinate: hotel.coordinate,
          images: Array.isArray(hotel.images)
            ? hotel.images
                .map((img: string) => {
                  if (img.startsWith("[") && img.endsWith("]")) {
                    try {
                      return JSON.parse(img.replace(/'/g, '"'));
                    } catch {
                      return [img];
                    }
                  }
                  return img;
                })
                .flat()
            : hotel.images || [],
        }));

        setHotels(processedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    await fetchHotels();
    setEditDialogOpen(false);
    setSelectedHotel(null);
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

  // New function to handle hotel delete via API
  const handleDeleteHotelAPI = async () => {
    // Refresh the hotel list after successful delete
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const result = await doGetAllHotels();

        const processedHotels = result.data.map((hotel: Hotel) => ({
          _id: hotel._id,
          name: hotel.name,
          description: hotel.description,
          rating: hotel.rating,
          address: hotel.address,
          coordinate: hotel.coordinate,
          images: Array.isArray(hotel.images)
            ? hotel.images
                .map((img: string) => {
                  if (img.startsWith("[") && img.endsWith("]")) {
                    try {
                      return JSON.parse(img.replace(/'/g, '"'));
                    } catch {
                      return [img];
                    }
                  }
                  return img;
                })
                .flat()
            : hotel.images || [],
        }));

        setHotels(processedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    await fetchHotels();
    setDeleteDialogOpen(false);
    setDeleteHotelId(null);
  };

  const handleImportComplete = (importedHotels: Hotel[]) => {
    setHotels((prev) => [...prev, ...importedHotels]);
    setImportDialogOpen(false);
  };

  // New function to handle hotel import via API
  const handleImportSuccess = async () => {
    // Refresh the hotel list after successful import
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const result = await doGetAllHotels();

        const processedHotels = result.data.map((hotel: Hotel) => ({
          _id: hotel._id,
          name: hotel.name,
          description: hotel.description,
          rating: hotel.rating,
          address: hotel.address,
          coordinate: hotel.coordinate,
          images: Array.isArray(hotel.images)
            ? hotel.images
                .map((img: string) => {
                  if (img.startsWith("[") && img.endsWith("]")) {
                    try {
                      return JSON.parse(img.replace(/'/g, '"'));
                    } catch {
                      return [img];
                    }
                  }
                  return img;
                })
                .flat()
            : hotel.images || [],
        }));

        setHotels(processedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    await fetchHotels();
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
    <DashboardLayout>
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
          onUpdate={handleUpdateHotel}
          loading={loading}
        />

        <ImportHotelDialog
          open={importDialogOpen}
          onClose={() => setImportDialogOpen(false)}
          onImport={handleImportComplete}
          onImportSuccess={handleImportSuccess}
          loading={loading}
        />

        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeleteHotelId(null);
          }}
          onConfirm={handleConfirmDelete}
          onDelete={handleDeleteHotelAPI}
          loading={loading}
          hotelId={deleteHotelId || ""}
          hotelName={
            deleteHotelId
              ? hotels.find((h) => h._id === deleteHotelId)?.name || ""
              : ""
          }
        />
      </Box>
    </DashboardLayout>
  );
};

export default HotelManagement;
