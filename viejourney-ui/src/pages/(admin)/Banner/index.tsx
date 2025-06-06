"use client";

import type React from "react";

import {
  ChevronLeft,
  ChevronRight,
  Close,
  FilterList,
  GridView,
  Search,
  Share,
  ViewList,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { AdminLayout } from "../../../layouts";
import Card from "./container/card";

const galleryImages = Array.from({ length: 9 }).map((_, index) => ({
  id: index,
  src: "/images/banner.jpg",
  title: `Gallery Image ${index + 1}`,
  size: "141.1 KB",
}));

const galleryVideos = Array.from({ length: 6 }).map((_, index) => ({
  id: index,
  src: "/images/banner.jpg",
  title: `Video ${index + 1}`,
  size: "2.5 MB",
}));

const galleryDocuments = Array.from({ length: 4 }).map((_, index) => ({
  id: index,
  src: "/images/banner.jpg",
  title: `Document ${index + 1}`,
  size: "512 KB",
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Banner = () => {
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [currentData, setCurrentData] = useState(galleryImages);

  const handleUpdate = (index: number, type: string) => {
    console.log(`Update ${type} at index:`, index);
  };

  const handleDelete = (index: number, type: string) => {
    console.log(`Delete ${type} at index:`, index);
  };

  const handleTabChange = (
    event: React.SyntheticEvent | null,
    newValue: number
  ) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        setCurrentData(galleryImages);
        break;
      case 1:
        setCurrentData(galleryVideos);
        break;
      case 2:
        setCurrentData(galleryDocuments);
        break;
      default:
        setCurrentData(galleryImages);
    }
  };

  const handleOpen = (index: number) => {
    setCurrentImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? currentData.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === currentData.length - 1 ? 0 : prev + 1
      );
    }
  };

  const currentImage = currentData[currentImageIndex];

  return (
    <AdminLayout>
      <div className="py-[10px] bg-[#f6f8f9] min-h-screen">
        <Container>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border-neutral-100">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleTabChange(null, 0)}
                  className={`text-sm font-medium px-3 py-1 rounded transition-colors cursor-pointer  ${
                    tabValue === 0
                      ? "text-black bg-gray-100"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Banner ({galleryImages.length})
                </button>
                <button
                  onClick={() => handleTabChange(null, 1)}
                  className={`text-sm font-medium px-3 py-1 rounded transition-colors cursor-pointer ${
                    tabValue === 1
                      ? "text-black bg-gray-100"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Avatar ({galleryVideos.length})
                </button>
                <button
                  onClick={() => handleTabChange(null, 2)}
                  className={`text-sm font-medium px-3 py-1 rounded transition-colors cursor-pointer ${
                    tabValue === 2
                      ? "text-black bg-gray-100"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Content ({galleryDocuments.length})
                </button>
              </div>

              {/* Center - Search */}
              <div className="flex-1 max-w-md mx-8">
                <TextField
                  placeholder="Search assets..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="text-gray-400" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f8f9fa",
                        "& fieldset": {
                          borderColor: "#e9ecef",
                        },
                        "&:hover fieldset": {
                          borderColor: "#dee2e6",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                    },
                  }}
                />
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-2">
                <IconButton
                  size="small"
                  className="text-gray-500 hover:text-gray-700"
                  title="Filter"
                >
                  <FilterList fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className="text-gray-500 hover:text-gray-700"
                  title="Share"
                >
                  <Share fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                  title="Grid View"
                >
                  <GridView fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  className="text-gray-500 hover:text-gray-700"
                  title="List View"
                >
                  <ViewList fontSize="small" />
                </IconButton>
              </div>
            </div>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              {galleryImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Card
                    imageSrc={image.src}
                    title={image.title}
                    size={image.size}
                    onClick={() => handleOpen(index)}
                    onUpdate={() => handleUpdate(index, "image")}
                    onDelete={() => handleDelete(index, "image")}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {galleryVideos.map((video, index) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card
                    imageSrc={video.src}
                    title={video.title}
                    size={video.size}
                    onClick={() => handleOpen(index)}
                    onUpdate={() => handleUpdate(index, "video")}
                    onDelete={() => handleDelete(index, "video")}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              {galleryDocuments.map((document, index) => (
                <Grid item xs={12} sm={6} md={4} key={document.id}>
                  <Card
                    imageSrc={document.src}
                    title={document.title}
                    size={document.size}
                    onClick={() => handleOpen(index)}
                    onUpdate={() => handleUpdate(index, "document")}
                    onDelete={() => handleDelete(index, "document")}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Container>

        <Modal
          open={open}
          onClose={handleClose}
          className="flex items-center justify-center"
        >
          <Box className="relative max-w-[90vw] max-h-[90vh] outline-none flex justify-center">
            <div
              className="fixed inset-0 bg-black opacity-10 z-[-1]"
              onClick={handleClose}
            />

            <IconButton
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-50 text-black hover:bg-opacity-70"
              size="large"
            >
              <Close />
            </IconButton>

            <IconButton
              onClick={() => handleNavigate("prev")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 text-black hover:bg-opacity-70"
              size="large"
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={() => handleNavigate("next")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 text-black hover:bg-opacity-70"
              size="large"
            >
              <ChevronRight />
            </IconButton>

            <img
              src={currentImage?.src || "/placeholder.svg"}
              alt={currentImage?.title}
              className="max-w-[50%] max-h-full object-contain rounded-[8px]"
            />
          </Box>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Banner;
