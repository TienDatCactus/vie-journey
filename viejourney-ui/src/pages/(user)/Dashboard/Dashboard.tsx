"use client";

import {
  AddAPhoto,
  Close as CloseIcon,
  Edit,
  Share,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";
import { MainLayout } from "../../../layouts";
import { editUserAvatar } from "../../../services/api/user";
import { useAuthStore } from "../../../services/stores/useAuthStore";
import AccountSetting from "./component/AccountSetting";
import TravelBlog from "./component/TravelBlog";
import TripPlans from "./component/TripPlan";
import ProfileMap from "./component/ProfileMap";

const Dashboard: React.FC = () => {
  const { details, info, credential } = useAuthStore();
  const loadUserDetails = useAuthStore((state) => state.loadUserDetails);
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser);
  useEffect(() => {
    const loadData = async () => {
      if (!details && credential?.userId) {
        await loadUserDetails();
      }
    };
    loadData();
  }, [details, credential?.userId, loadUserDetails]);
  const [value, setValue] = React.useState(0);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [uploading, setUploading] = React.useState(false);
  const menuItems = [
    { id: 0, label: "Overview" },
    { id: 1, label: "Trip Plans" },
    { id: 2, label: "Blogs" },
    { id: 3, label: "Setting" },
  ];
  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSaveAvatar = async () => {
    if (selectedFile) {
      try {
        setUploading(true);
        if (selectedFile.size > 5 * 1024 * 1024) {
          enqueueSnackbar("File size exceeds 5MB limit", {
            variant: "error",
          });
          return;
        }
        if (!credential?.userId) {
          enqueueSnackbar("User ID is not available", {
            variant: "error",
          });
          return;
        }
        const res = await editUserAvatar(credential.userId, selectedFile);
        if (res) await loadCurrentUser();
        enqueueSnackbar("Updated image successful", {
          variant: "success",
        });
        handleCloseModal();
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-[125rem] mx-auto lg:px-20 lg:py-10 bg-gray-50 ">
        <div className="w-full shadow-sm">
          <Card className="p-6 bg-gray-50  h-full " elevation={0}>
            <CardContent className="text-center p-0 flex  h-full">
              <Stack direction={"row"} className="w-full" spacing={2}>
                <div>
                  <div className="relative w-fit">
                    <Avatar
                      sx={{
                        width: 140,
                        height: 140,
                      }}
                      className="mx-auto bg-gray-300 relative"
                    >
                      <img
                        src={info?.avatar || "/placeholder.svg"}
                        className="w-full h-full"
                        alt="avatar"
                      />
                    </Avatar>
                    <IconButton
                      size="small"
                      className="p-2 absolute bottom-0 z-10 bg right-0 bg-black text-white hover:bg-gray-800"
                      onClick={handleEditClick}
                    >
                      <AddAPhoto className="text-xl" />
                    </IconButton>
                  </div>
                </div>

                <Stack className="flex-1 justify-between">
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    className="flex-1 px-4"
                  >
                    <div className="text-start">
                      <Typography
                        variant="h6"
                        className="font-semibold mb-1 text-2xl"
                      >
                        {info?.fullName}
                      </Typography>
                      <p className="text-gray-600 text-sm">
                        Passionate traveler exploring the world one destination
                        at a time
                      </p>
                    </div>
                    <Stack direction={"row"} spacing={1} className="mb-2">
                      <Button
                        variant="outlined"
                        className="rounded-sm bg-white border-gray-300 mt-2 text-gray-800"
                        onClick={() => setValue(3)}
                        size="small"
                        startIcon={<Edit />}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outlined"
                        className="rounded-sm bg-white border-gray-300 mt-2 text-gray-800"
                        startIcon={<Share />}
                        size="small"
                      >
                        Share
                      </Button>
                    </Stack>
                  </Stack>

                  <div className="grid grid-cols-4 my-4">
                    <div className="text-center">
                      <Typography variant="h6" className="font-bold">
                        {details?.tripCount || 0}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        Trips
                      </Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="h6" className="font-bold">
                        {details?.destinations?.length || 0}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        Destinations
                      </Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="h6" className="font-bold">
                        {details?.tripCount || 0}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        Likes
                      </Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="h6" className="font-bold">
                        {details?.blogCount || 0}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        Blogs
                      </Typography>
                    </div>
                  </div>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </div>
        <ToggleButtonGroup
          color="info"
          value={value}
          exclusive
          aria-label="Platform"
          className="my-4"
        >
          {menuItems.map((item) => (
            <ToggleButton
              key={item.id}
              className="p-2 w-40 "
              value={item.id}
              onClick={() => setValue(item.id)}
              selected={value === item.id}
            >
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {(!info?.fullName || !info.address || !info.dob || !info.phone) && (
          <Alert severity="warning" className="mb-4">
            Your profile is incomplete. Please update your full name, address,
            date of birth, and phone number to get the most out of your travel
            dashboard.
          </Alert>
        )}
        <div className="w-full">
          {value === 0 && <ProfileMap />}

          {value === 1 && <TripPlans />}

          {value === 2 && <TravelBlog />}
          {value === 3 && <AccountSetting />}
        </div>

        {/* Edit Avatar Modal */}
        <Dialog
          open={editModalOpen}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Edit Avatar</Typography>
              <IconButton onClick={handleCloseModal} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={3}
              py={2}
            >
              {/* Current/Preview Avatar */}
              <Avatar sx={{ width: 120, height: 120 }} className="bg-gray-300">
                <img
                  src={previewUrl || info?.avatar}
                  className="w-full h-full object-cover"
                  alt="avatar preview"
                />
              </Avatar>

              {/* File Input */}
              <Box width="100%">
                <Typography variant="body2" className="mb-2 font-medium">
                  Choose new avatar
                </Typography>
                <TextField
                  type="file"
                  name="fileAttachment"
                  fullWidth
                  inputProps={{
                    accept: ".jpg,.jpeg,.png,.gif,.webp",
                  }}
                  onChange={handleFileChange}
                  variant="outlined"
                />
                <Typography variant="caption" className="text-gray-500 mt-1">
                  Supported formats: JPG, JPEG, PNG, GIF, WEBP (max 5MB)
                </Typography>
              </Box>

              {selectedFile && (
                <Box width="100%" p={2} bgcolor="grey.50" borderRadius={1}>
                  <Typography variant="body2" className="font-medium">
                    Selected file:
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    {selectedFile.name} (
                    {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions className="px-6 pb-4">
            <Button onClick={handleCloseModal} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSaveAvatar}
              variant="contained"
              disabled={!selectedFile || uploading}
              className="bg-gray-800 hover:bg-gray-900 text-white"
            >
              {uploading ? "Uploading..." : "Save Avatar"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
