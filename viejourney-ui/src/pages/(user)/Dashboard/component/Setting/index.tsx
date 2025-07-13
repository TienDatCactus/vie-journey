"use client";

import {
  Edit as EditIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import type React from "react";
import { useState } from "react";
import { updateUserInfo } from "../../../../../services/api/user";
import { IUserInfoUpdate, UserInfo } from "../../../../../utils/interfaces";
import { useAuthStore } from "../../../../../services/stores/useAuthStore";

interface PrivacySettings {
  profileVisibility: boolean;
  showTravelHistory: boolean;
  allowMessages: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  tripReminders: boolean;
  socialUpdates: boolean;
}

export default function ProfileSettings({ userInfo }: { userInfo: UserInfo }) {
  const { loadCurrentUser } = useAuthStore();

  const [profileData, setProfileData] = useState<IUserInfoUpdate>({
    fullName: userInfo?.fullName,
    phone: userInfo?.phone,
    address: userInfo.address,
    dob: userInfo.dob ? dayjs(userInfo.dob).format("YYYY-MM-DD") : "",
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: true,
    showTravelHistory: true,
    allowMessages: false,
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      tripReminders: true,
      socialUpdates: false,
    });

  const handleProfileChange =
    (field: keyof IUserInfoUpdate) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handlePrivacyChange =
    (field: keyof PrivacySettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPrivacySettings((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  const handleNotificationChange =
    (field: keyof NotificationSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNotificationSettings((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  const handleSaveChanges = async () => {
    try {
      const res = await updateUserInfo(userInfo._id || " ", profileData);
      if (res) await loadCurrentUser();
      enqueueSnackbar("Update profile successful", {
        variant: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        py: 4,
        maxWidth: "125rem",
      }}
    >
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#1a1a1a", mb: 1 }}
          >
            Profile Settings
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Manage your account preferences and privacy
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Profile Information Section */}
          <Paper
            sx={{ p: 3, boxShadow: 1 }}
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveChanges();
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <EditIcon sx={{ fontSize: 20, color: "#555" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a1a1a" }}
              >
                Profile Information
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              Update your personal information and bio
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#333", mb: 0.5 }}
                >
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  value={profileData.fullName}
                  onChange={handleProfileChange("fullName")}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "white" }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#333", mb: 0.5 }}
                >
                  Phone
                </Typography>
                <TextField
                  fullWidth
                  value={profileData.phone}
                  onChange={handleProfileChange("phone")}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "white" }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#333", mb: 0.5 }}
                >
                  Date of Birth
                </Typography>
                <DatePicker
                  value={profileData.dob ? dayjs(profileData.dob) : null}
                  onChange={(newValue) =>
                    setProfileData((prev) => ({
                      ...prev,
                      dob: newValue ? newValue.format("YYYY-MM-DD") : "",
                    }))
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: { backgroundColor: "white" },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#333", mb: 0.5 }}
                >
                  Address
                </Typography>
                <TextField
                  fullWidth
                  value={profileData.address}
                  onChange={handleProfileChange("address")}
                  placeholder="Your current address"
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "white" }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  size="medium"
                  sx={{
                    backgroundColor: "#1f2937",
                    "&:hover": { backgroundColor: "#111827" },
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  Save Profile
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Privacy Settings Section */}
          <Paper sx={{ p: 3, boxShadow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LockIcon sx={{ fontSize: 20, color: "#555" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a1a1a" }}
              >
                Privacy Settings
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              Control who can see your information
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#1a1a1a" }}
                  >
                    Profile Visibility
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Make your profile visible to everyone
                  </Typography>
                </Box>
                <Switch
                  checked={privacySettings.profileVisibility}
                  onChange={handlePrivacyChange("profileVisibility")}
                  color="primary"
                />
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#1a1a1a" }}
                  >
                    Show Travel History
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Display your visited places publicly
                  </Typography>
                </Box>
                <Switch
                  checked={privacySettings.showTravelHistory}
                  onChange={handlePrivacyChange("showTravelHistory")}
                  color="primary"
                />
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#1a1a1a" }}
                  >
                    Allow Messages
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Let other users send you messages
                  </Typography>
                </Box>
                <Switch
                  checked={privacySettings.allowMessages}
                  onChange={handlePrivacyChange("allowMessages")}
                  color="primary"
                />
              </Box>
            </Box>
          </Paper>

          {/* Notifications Section */}
          <Paper sx={{ p: 3, boxShadow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <NotificationsIcon sx={{ fontSize: 20, color: "#555" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a1a1a" }}
              >
                Notifications
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              Choose what notifications you want to receive
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#1a1a1a" }}
                  >
                    Email Notifications
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Receive updates via email
                  </Typography>
                </Box>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange("emailNotifications")}
                  color="primary"
                />
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#1a1a1a" }}
                  >
                    Trip Reminders
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Get reminded about upcoming trips
                  </Typography>
                </Box>
                <Switch
                  checked={notificationSettings.tripReminders}
                  onChange={handleNotificationChange("tripReminders")}
                  color="primary"
                />
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "#1a1a1a" }}
                  >
                    Social Updates
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Notifications about followers and likes
                  </Typography>
                </Box>
                <Switch
                  checked={notificationSettings.socialUpdates}
                  onChange={handleNotificationChange("socialUpdates")}
                  color="primary"
                />
              </Box>
            </Box>
          </Paper>

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              size="large"
              fullWidth
              sx={{
                backgroundColor: "#1f2937",
                "&:hover": {
                  backgroundColor: "#111827",
                },
                textTransform: "none",
                fontWeight: 500,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
