import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import Map from "../../../Maps/Map";
import { useBlogStore } from "../../../../services/stores/useBlogStore";
import { useMapPan } from "../../../../services/stores/useMapPan";
import { Close, Fullscreen } from "@mui/icons-material";
const BlogSider: React.FC = () => {
  const { currentBlog } = useBlogStore();
  const { setSelected } = useMapPan();
  const handlePlaceSelect = (place: any) => {
    setSelected({
      ...place,
      location: {
        lat: place.latitude,
        lng: place.longitude,
      },
    });
  };
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  return (
    <aside className="hidden lg:block">
      <div className=" space-y-2">
        <h1 className="text-lg font-medium">Locations Mentioned</h1>
        <div className="relative">
          <Map
            defaultCenter={{ lat: 0, lng: 0 }}
            defaultZoom={2}
            detailed={false}
            position="relative"
            className="w-full h-90 shadow-md border border-dashed border-gray-400 hover:shadow-md duration-200 transition-all drop-shadow-md"
          />
          <IconButton
            onClick={handleOpenDialog}
            className="absolute top-2 right-2 bg-white shadow-md z-10"
          >
            <Fullscreen />
          </IconButton>
        </div>
        {/* Dialog for Fullscreen Map */}
        <Dialog open={open} fullWidth maxWidth="md" onClose={handleCloseDialog}>
          <DialogContent className=" p-0">
            {/* Close Button */}
            <div className="relative p-0">
              <IconButton
                onClick={handleCloseDialog}
                className="absolute left-4 bottom-4 z-50 bg-white shadow"
              >
                <Close />
              </IconButton>

              <Map
                position="relative"
                defaultCenter={{ lat: 0, lng: 0 }}
                defaultZoom={6}
                className="w-full h-160"
              />
            </div>
          </DialogContent>
          <div className="flex flex-wrap p-4 gap-2">
            {!!currentBlog?.places &&
              currentBlog?.places?.length > 0 &&
              currentBlog?.places.map((place) => (
                <Chip
                  onClick={() => handlePlaceSelect(place)}
                  key={place.placeId}
                  label={place.displayName}
                />
              ))}
          </div>
        </Dialog>
        <ul className="ml-2 py-2 flex flex-wrap wrap-break-word gap-2 max-h-52 overflow-y-scroll space-y-2">
          {currentBlog?.places.map((location) => (
            <li key={location.placeId}>
              <Chip
                onClick={() => handlePlaceSelect(location)}
                label={location.displayName}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="py-10 space-y-4">
        <div className=" text-center flex items-center justify-center flex-col space-y-2">
          <Avatar
            className="w-14 h-14"
            src={
              currentBlog?.createdBy?.avatar?.url ||
              "images/placeholders/icons8-avatar-50.png"
            }
          />
          <h1 className="font-medium text-lg">
            {currentBlog?.createdBy?.email || currentBlog?.createdBy?.fullName}
          </h1>
          <p className="text-sm text-gray-500">
            Travel enthusiast sharing hidden gems and local insights
          </p>
        </div>
        <Stack direction={"row"} justifyContent={"space-around"}>
          <div className="text-center ">
            <data value="24" className="text-lg">
              {currentBlog?.createdBy?.totalBlogs}
            </data>
            <p className="text-sm text-gray-500">Articles</p>
          </div>
          <div className="text-center">
            <data value="1000" className="text-lg">
              {currentBlog?.createdBy?.likesCount}
            </data>
            <p className="text-sm text-gray-500">Likes</p>
          </div>
        </Stack>
        <Tooltip title="Coming soon!">
          <Button
            variant="outlined"
            fullWidth
            className="border-gray-300 text-gray-600  bg-neutral-100 rounded-sm"
          >
            Follow
          </Button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default BlogSider;
