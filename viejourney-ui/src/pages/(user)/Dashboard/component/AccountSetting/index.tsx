import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { updateUserInfo } from "../../../../../services/api/user";
import { useAuthStore } from "../../../../../services/stores/useAuthStore";
import { IUserInfoUpdate } from "../../../../../utils/interfaces";
import { Edit } from "@mui/icons-material";
const index: React.FC = () => {
  const { info } = useAuthStore();
  const [profileData, setProfileData] = useState<IUserInfoUpdate>({
    fullName: info?.fullName,
    phone: info?.phone,
    address: info?.address,
    dob: info?.dob ? dayjs(info.dob).format("YYYY-MM-DD") : "",
  });
  const handleProfileChange =
    (field: keyof IUserInfoUpdate) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };
  const handleSaveChanges = async () => {
    const { loadCurrentUser, info } = useAuthStore();
    try {
      const res = await updateUserInfo(info?._id || " ", profileData);
      if (res) await loadCurrentUser();
      enqueueSnackbar("Update profile successful", {
        variant: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Paper
      sx={{ p: 3, boxShadow: 1 }}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSaveChanges();
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Edit sx={{ fontSize: 20, color: "#555" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
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
  );
};

export default index;
