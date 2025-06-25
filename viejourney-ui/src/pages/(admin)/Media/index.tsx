"use client";

import type React from "react";

import { Add, ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid2,
  IconButton,
  Modal,
  Stack,
} from "@mui/material";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../../layouts";
import { ASSET_TYPE } from "../../../utils/interfaces/admin";
import AssetCard from "./component/card";
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
      <div className="p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4 ">
            Media Management
          </h1>
          <p className="text-gray-600 ">
            Manage your media assets including avatars, banners, and content.
          </p>
        </div>
        <div className="flex items-center my-4  shadow-sm border border-neutral-100 rounded-md  w-fit">
          <Button
            onClick={() => {
              handleTabChange(ASSET_TYPE.AVATAR);
              setTabValue(0);
            }}
            className={`text-sm font-medium px-3 py-2 transition-colors rounded-s-md gap-2 rounded-e-none cursor-pointer uppercase ${
              tabValue === 0
                ? "text-blue-100 bg-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Avatar{" "}
            <Chip
              size="small"
              className="text-dark-700 bg-neutral-50"
              label={avatarLength}
            />
          </Button>
          <Button
            onClick={() => {
              handleTabChange(ASSET_TYPE.BANNER);
              setTabValue(1);
            }}
            className={`text-sm font-medium px-3 py-2  transition-colors rounded-none uppercase gap-2 cursor-pointer  ${
              tabValue === 1
                ? "text-blue-100 bg-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Banner{" "}
            <Chip
              size="small"
              className="text-dark-700 bg-neutral-50"
              label={bannerLength}
            />
          </Button>
          <Button
            onClick={() => {
              handleTabChange(ASSET_TYPE.CONTENT);
              setTabValue(2);
            }}
            className={`text-sm font-medium px-3 py-2 rounded-s-none gap-2 transition-colors rounded-e-lg  uppercase cursor-pointer ${
              tabValue === 2
                ? "text-blue-100 bg-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Content{" "}
            <Chip
              size="small"
              className="text-dark-700 bg-neutral-50"
              label={contentLength}
            />
          </Button>
        </div>
        <div
          className="border border-neutral-400 rounded-md p-4
        "
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {tabValue === 0 ? (
              <div>
                <h1 className="text-2xl font-semibold">Avatar Images</h1>
                <p className="text-sm text-gray-600">
                  Profile pictures and avatar images
                </p>
              </div>
            ) : tabValue === 1 ? (
              <div>
                <h1 className="text-2xl font-semibold">Banner Images</h1>
                <p className="text-sm text-gray-600">
                  Images used for banners and promotional content
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-semibold">Content Images</h1>
                <p className="text-sm text-gray-600">
                  Images used for content and articles
                </p>
              </div>
            )}
            <div>
              <Button variant="contained" color="primary" startIcon={<Add />}>
                Upload{" "}
                {tabValue === 0
                  ? "Avatar"
                  : tabValue === 1
                  ? "Banner"
                  : "Content"}
              </Button>
            </div>
          </Stack>
          <TabPanel value={tabValue} index={0}>
            <Grid2 container spacing={2}>
              {currentData.map((image, index) => (
                <Grid2 size={3} key={image._id}>
                  <AssetCard
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
                </Grid2>
              ))}
            </Grid2>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid2 container spacing={2}>
              {currentData.map((image, index) => (
                <Grid2 size={3} key={image._id}>
                  <AssetCard
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
                </Grid2>
              ))}
            </Grid2>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid2 container spacing={2}>
              {currentData.map((image, index) => (
                <Grid2 size={3} key={image._id}>
                  <AssetCard
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
                </Grid2>
              ))}
            </Grid2>
          </TabPanel>
        </div>

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

            <motion.img
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3 }}
              key={currentImage?.publicId}
              src={currentImage?.url || "/placeholder.svg"}
              alt={currentImage?.publicId}
              className=" w-120 h-auto object-contain rounded-[8px]"
            />
          </Box>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Banner;
