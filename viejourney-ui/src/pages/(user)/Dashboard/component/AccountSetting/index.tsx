import {
  Box,
  Button,
  Grid2,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { updateUserInfo } from "../../../../../services/api/user";
import { useAuthStore } from "../../../../../services/stores/useAuthStore";
import { IUserInfoUpdate } from "../../../../../utils/interfaces";
import {
  Badge,
  ContactMail,
  Edit,
  Fireplace,
  Phone,
} from "@mui/icons-material";

// Form validation schema
interface ProfileFormInputs extends IUserInfoUpdate {
  fullName: string;
  phone: string;
  address?: string;
  dob?: string;
}

const AccountSetting: React.FC = () => {
  const { info, user, loadCurrentUser } = useAuthStore();

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      dob: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  // Initialize form with user data
  useEffect(() => {
    if (info) {
      reset({
        fullName: info.fullName || "",
        phone: info.phone || "",
        address: info.address || "",
        dob: info.dob ? dayjs(info.dob).format("YYYY-MM-DD") : "",
      });
    }
  }, [info, reset]);

  // Form submission handler
  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      const res = await updateUserInfo(info?._id || "", data);
      if (res) {
        await loadCurrentUser();
        enqueueSnackbar("Profile updated successfully", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      enqueueSnackbar("Failed to update profile. Please try again.", {
        variant: "error",
      });
    }
  };

  return (
    <Paper
      sx={{ p: 3, boxShadow: 1 }}
      component="form"
      elevation={0}
      className="shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Edit sx={{ fontSize: 20, color: "#555" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
          Profile Information
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
        Update your personal information and bio
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid2 container spacing={2}>
          <Grid2
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Full Name
            </Typography>
            <Controller
              name="fullName"
              control={control}
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  slotProps={{
                    input: {
                      className: "rounded-none",
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge sx={{ fontSize: 20, color: "#aaa" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  size="small"
                  sx={{ backgroundColor: "white" }}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              )}
            />
          </Grid2>
          <Grid2
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              disabled
              slotProps={{
                input: {
                  className: "rounded-none",
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContactMail sx={{ fontSize: 20, color: "#aaa" }} />
                    </InputAdornment>
                  ),
                },
              }}
              value={user?.email || ""}
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "#f5f5f5" }}
            />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Phone
            </Typography>
            <Controller
              name="phone"
              control={control}
              rules={{
                pattern: {
                  value:
                    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: "Please enter a valid phone number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="tel"
                  slotProps={{
                    input: {
                      className: "rounded-none",
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ fontSize: 20, color: "#aaa" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "white" }}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Date of Birth
            </Typography>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(
                      newValue ? newValue.format("YYYY-MM-DD") : ""
                    );
                  }}
                  disableFuture
                  openTo="year"
                  views={["year", "month", "day"]}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      error: !!errors.dob,
                      helperText: errors.dob?.message,
                      sx: {
                        backgroundColor: "white",
                        borderRadius: 0,
                        "& fieldset": {
                          borderRadius: 0,
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Address
            </Typography>
            <Controller
              name="address"
              control={control}
              rules={{
                maxLength: {
                  value: 100,
                  message: "Address cannot exceed 100 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  slotProps={{
                    input: {
                      className: "rounded-none",
                      startAdornment: (
                        <InputAdornment position="start">
                          <Fireplace sx={{ fontSize: 20, color: "#aaa" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  placeholder="Your current address"
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "white" }}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid2>
        </Grid2>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={!isDirty || isSubmitting}
            size="medium"
            sx={{
              backgroundColor: "#1f2937",
              "&:hover": { backgroundColor: "#111827" },
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: 0,
            }}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AccountSetting;
