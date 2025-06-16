"use client";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import Map from "../../../components/Maps/Map";
import { MainLayout } from "../../../layouts";
import TripPlans from "./component/TripPlan";
import ProfileSettings from "./component/Setting";
import TravelGuides from "./component/TravelGuides";
import { useAuthStore } from "../../../services/stores/useAuthStore";

const Dashboard: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const { user } = useAuthStore();

  console.log(user)
  return (
    <MainLayout>
      <div className="min-h-[900px] bg-gray-50 mt-[80px] ">
        <div className="bg-white border-b border-gray-200">
          <div className="">
            <div className="flex w-full bg-[#f4f4f4] p-2">
              <button
                onClick={() => setValue(0)}
                className={`flex-1 py-2 px-6 text-center font-medium transition-colors cursor-pointer ${
                  value === 0
                    ? "text-gray-900  bg-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setValue(1)}
                className={`flex-1 py-2 px-6 text-center font-medium transition-colors cursor-pointer  ${
                  value === 1
                    ? "text-gray-900  bg-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Trip Plans
              </button>
              <button
                onClick={() => setValue(2)}
                className={`flex-1 py-2 px-6 text-center font-medium transition-colors cursor-pointer ${
                  value === 2
                    ? "text-gray-900  bg-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Guides
              </button>
              <button
                onClick={() => setValue(3)}
                className={`flex-1 py-2 px-6 text-center font-medium transition-colors cursor-pointer ${
                  value === 3
                    ? "text-gray-900  bg-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
          {value === 0 && (
            <>
              <div className=" py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Sidebar - Profile */}
                  <div className="lg:col-span-1">
                    <Card className="p-6">
                      <CardContent className="text-center p-0">
                        <Avatar
                          sx={{ width: 80, height: 80, margin: "0 auto 16px" }}
                          className="bg-gray-300"
                        >
                          <EditIcon />
                        </Avatar>

                        <Typography variant="h6" className="font-semibold mb-1">
                          Tien Dat
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-gray-500 mb-4"
                        >
                          @tien65
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
                              Following
                            </Typography>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            className="flex-1 text-gray-700 border-gray-300"
                            size="small"
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
                            className="bg-white/90 text-gray-800 backdrop-blur-sm border border-white/50 shadow-sm"
                            size="small"
                          />
                          <Chip
                            label="1 City & Region"
                            className="bg-white/90 text-gray-800 backdrop-blur-sm border border-white/50 shadow-sm"
                            size="small"
                          />
                          <Chip
                            label="Novice"
                            className="bg-white/90 text-gray-800 backdrop-blur-sm border border-white/50 shadow-sm"
                            size="small"
                          />
                        </div>

                        {/* Settings Icons */}
                        <div className="absolute top-4 right-4 flex gap-1">
                          <IconButton
                            size="small"
                            className="bg-white/90 text-gray-600 hover:text-gray-800 backdrop-blur-sm shadow-sm"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            className="bg-white/90 text-gray-600 hover:text-gray-800 backdrop-blur-sm shadow-sm"
                          >
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </div>

                        {/* Add Places Button */}
                        <div className="absolute bottom-4 left-4">
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            className="bg-white/90 text-gray-800 backdrop-blur-sm border border-white/50 hover:bg-white shadow-sm"
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
                  <Typography variant="h6" className="font-semibold mb-2">
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 mb-4">
                    Your latest travel updates and interactions
                  </Typography>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
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

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <GroupIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="body2" className="font-medium">
                          Joined travel community
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          Europe Travellers • 1 week ago
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

          {value === 3 && <ProfileSettings />}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
