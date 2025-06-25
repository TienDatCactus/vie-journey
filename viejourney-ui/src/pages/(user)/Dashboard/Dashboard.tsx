"use client";

import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "motion/react";
import { enqueueSnackbar } from "notistack";
import React from "react";
import Map from "../../../components/Maps/Map";
import { MainLayout } from "../../../layouts";
import { editUserAvatar, updateUserInfo } from "../../../services/api/user";
import { useAuthStore } from "../../../services/stores/useAuthStore";
import ProfileSettings from "./component/Setting";
import TravelGuides from "./component/TravelGuides";
import TripPlans from "./component/TripPlan";

const Dashboard: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const { info, loadUserInfo } = useAuthStore();
  const [uploading, setUploading] = React.useState(false);
  const menuItems = [
    { id: 0, label: "Overview" },
    { id: 1, label: "Trip Plans" },
    { id: 2, label: "Guides" },
    { id: 3, label: "Settings" },
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
        if (!info?._id) {
          enqueueSnackbar("User ID is not available", {
            variant: "error",
          });
          return;
        }
        console.log(selectedFile);
        await editUserAvatar(info?._id, selectedFile);

        loadUserInfo();
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
        <div className="bg-white border-b border-gray-200">
          <motion.ul
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.05, // delay từng item
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="flex w-full bg-[#f4f4f4] p-2"
          >
            {menuItems.map((item) => (
              <motion.li
                initial={false}
                className="flex-1 "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
                key={item.id}
              >
                <Button
                  onClick={() => setValue(item.id)}
                  className={`w-full py-2 px-6 text-center font-medium transition-colors cursor-pointer ${
                    value === item.id
                      ? "text-gray-900 bg-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="w-full">
          {value === 0 && (
            <>
              <div className=" py-6">
                {(!info?.fullName ||
                  !info.address ||
                  !info.dob ||
                  !info.phone) && (
                  <Alert severity="warning" className="mb-4">
                    Your profile is incomplete. Please update your full name,
                    address, date of birth, and phone number to get the most out
                    of your travel dashboard.
                  </Alert>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1  h-full">
                    <Card className="p-6  h-full ">
                      <CardContent className="text-center p-0 flex flex-col justify-between h-full">
                        <Avatar
                          sx={{
                            width: 140,
                            height: 140,
                          }}
                          className="mx-auto bg-gray-300"
                        >
                          <img
                            src={info?.avatar || "/placeholder.svg"}
                            className="w-full h-full"
                            alt="avatar"
                          />
                        </Avatar>

                        <Typography variant="h6" className="font-semibold mb-1">
                          {info?.fullName}
                        </Typography>

                        <div className="flex justify-center gap-8 mb-4">
                          <div className="text-center">
                            <Typography variant="h6" className="font-bold">
                              0
                            </Typography>
                            <Typography
                              variant="caption"
                              className="text-gray-500"
                            >
                              Following
                            </Typography>
                          </div>
                          <div className="text-center">
                            <Typography variant="h6" className="font-bold">
                              0
                            </Typography>
                            <Typography
                              variant="caption"
                              className="text-gray-500"
                            >
                              Followers
                            </Typography>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            className="flex-1 text-gray-700 border-gray-300"
                            size="small"
                            onClick={handleEditClick}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<ShareIcon />}
                            className="flex-1 bg-gray-800 hover:bg-gray-900"
                            size="small"
                          >
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-3">
                    <Card className="relative overflow-hidden">
                      {/* Map Background with overlays */}
                      <div className="h-[318px] relative">
                        <Map
                          position="static"
                          className="w-full h-full"
                          detailed={false}
                        />

                        {/* Stats Chips */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Chip
                            label="1 Country"
                            className="bg-white/50 text-gray-800 backdrop-blur-sm border border-white/50 shadow-sm"
                            size="small"
                          />
                          <Chip
                            label="1 City & Region"
                            className="bg-white/50  text-gray-800 backdrop-blur-sm border border-white/50 shadow-sm"
                            size="small"
                          />
                          <Chip
                            label="Novice"
                            className="bg-white/50 text-gray-800 backdrop-blur-sm border border-white/50 shadow-sm"
                            size="small"
                          />
                        </div>

                        {/* Settings Icons */}
                        <div className="absolute top-4 right-4 flex gap-1">
                          <IconButton
                            size="small"
                            className="bg-white/50 text-gray-600 hover:text-gray-800 backdrop-blur-sm shadow-sm"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            className="bg-white/50 text-gray-600 hover:text-gray-800 backdrop-blur-sm shadow-sm"
                          >
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <div className="absolute bottom-4 left-4">
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            className="bg-white/50 text-gray-800 backdrop-blur-sm border border-white/50 hover:bg-white shadow-sm"
                            size="small"
                          >
                            Add visited places
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="font-semibold ">
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 mb-4">
                    Your latest travel updates and interactions
                  </Typography>

                  <div className="space-y-4">
                    <div className="flex items-center rounded-md gap-3 bg-neutral-100 p-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <LocationIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="body2" className="font-medium">
                          Added new trip plan
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          Trip to Paris • 2 days ago
                        </Typography>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {value === 1 && <TripPlans />}

          {value === 2 && <TravelGuides />}

          {value === 3 && info && <ProfileSettings userInfo={info} />}
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
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
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
