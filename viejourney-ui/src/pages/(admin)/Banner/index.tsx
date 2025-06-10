"use client";

import type React from "react";

import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import { Box, Container, Grid, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../../layouts";
import { ASSET_TYPE } from "../../../utils/interfaces/admin";
import Card from "./component/card";
import useHook from "./container/hook";

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
  const {
    listImg,
    contentLength,
    avatarLength,
    bannerLength,
    handleTabChange,
    updateAsset,
    deleteAsset,
  } = useHook();

  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [currentData, setCurrentData] = useState(listImg || []);

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

  useEffect(() => {
    if (listImg) {
      setCurrentData(listImg);
    }
  }, [listImg]);
  if (!listImg) {
    return <div></div>;
  }

  return (
    <AdminLayout>
      <div className="py-[10px] bg-[#f6f8f9] min-h-screen">
        <Container>
          <Box sx={{ mt: 2 }}>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    handleTabChange(ASSET_TYPE.AVATAR);
                    setTabValue(0);
                  }}
                  className={`text-sm font-medium px-3 py-1 rounded transition-colors cursor-pointer uppercase ${
                    tabValue === 0
                      ? "text-green-100 bg-[#1bb99a]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Avatar ({avatarLength})
                </button>
                <button
                  onClick={() => {
                    handleTabChange(ASSET_TYPE.BANNER);
                    setTabValue(1);
                  }}
                  className={`text-sm font-medium px-3 py-1 rounded transition-colors uppercase cursor-pointer  ${
                    tabValue === 1
                      ? "text-green-100 bg-[#1bb99a]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Banner ({bannerLength})
                </button>
                <button
                  onClick={() => {
                    handleTabChange(ASSET_TYPE.CONTENT);
                    setTabValue(2);
                  }}
                  className={`text-sm font-medium px-3 py-1 rounded transition-colors  uppercase cursor-pointer ${
                    tabValue === 2
                      ? "text-green-100 bg-[#1bb99a]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Content ({contentLength})
                </button>
              </div>
            </div>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              {currentData.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image._id}>
                  <Card
                    imageSrc={image.url}
                    title={image.userId}
                    size={image.file_size}
                    dimensions={image.dimensions}
                    onClick={() => handleOpen(index)}
                    onUpdate={(file: File) =>
                      updateAsset(file, image.publicId, ASSET_TYPE.AVATAR)
                    }
                    onDelete={() => deleteAsset(image._id, ASSET_TYPE.AVATAR)}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {currentData.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image._id}>
                  <Card
                    imageSrc={image.url}
                    title={image.userId}
                    size={image.file_size}
                    dimensions={image.dimensions}
                    onClick={() => handleOpen(index)}
                    onUpdate={(file: File) =>
                      updateAsset(file, image.publicId, ASSET_TYPE.BANNER)
                    }
                    onDelete={() => deleteAsset(image._id, ASSET_TYPE.AVATAR)}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              {currentData.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={image._id}>
                  <Card
                    imageSrc={image.url}
                    title={image.userId}
                    size={image.file_size}
                    dimensions={image.dimensions}
                    onClick={() => handleOpen(index)}
                    onUpdate={(file: File) =>
                      updateAsset(file, image.publicId, ASSET_TYPE.CONTENT)
                    }
                    onDelete={() => deleteAsset(image._id, ASSET_TYPE.AVATAR)}
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
              src={currentImage?.url || "/placeholder.svg"}
              alt={currentImage?.publicId}
              className="max-w-[50%] max-h-full object-contain rounded-[8px]"
            />
          </Box>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Banner;
