import { Card, Chip, IconButton, Button, Stack } from "@mui/material";
import React from "react";
import Map from "../../../../../components/Maps/Map";
import { Edit, Share, Add } from "@mui/icons-material";
import { useAuthStore } from "../../../../../services/stores/useAuthStore";
import { useMapPan } from "../../../../../services/stores/useMapPan";
const index: React.FC = () => {
  const { details } = useAuthStore();
  const { setSelectedLocation } = useMapPan();
  return (
    <div className=" py-6">
      <div className="lg:col-span-3">
        <Card
          elevation={0}
          className="relative shadow-sm bg-neutral-50 overflow-hidden"
        >
          <div className="h-100 relative">
            <Map
              defaultCenter={{ lat: 15.9753, lng: 105.7451 }}
              defaultZoom={5}
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
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                className="bg-white/50 text-gray-600 hover:text-gray-800 backdrop-blur-sm shadow-sm"
              >
                <Share fontSize="small" />
              </IconButton>
            </div>

            <div className="absolute bottom-4 left-4">
              <Button
                variant="contained"
                startIcon={<Add />}
                className="bg-white/50 text-gray-800 backdrop-blur-sm border border-white/50 hover:bg-white shadow-sm"
                size="small"
              >
                Add visited places
              </Button>
            </div>
          </div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems={"start"}
            className="px-4 py-2"
          >
            <div>
              <h1 className="text-base text-gray-600">Recent destinations</h1>
              <ul className="flex flex-wrap gap-2 my-2">
                {!!details &&
                  details?.destinations.length > 0 &&
                  details?.destinations.map((place, index) => (
                    <Chip
                      onClick={() =>
                        setSelectedLocation({
                          lat: place.location.lat,
                          lng: place.location.lng,
                        })
                      }
                      key={index}
                      label={place.name}
                      className=" bg-gray-200 text-gray-800"
                    />
                  ))}
              </ul>
            </div>
            <p className="font-medium">
              {details?.destinations.length || 0} destinations
            </p>
          </Stack>
        </Card>
      </div>
    </div>
  );
};

export default index;
