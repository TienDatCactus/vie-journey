import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Alert,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import axios from "axios";
import { HOTELS } from "../../../services/api/url";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  coordinate: string;
  image: string[];
}

interface ImportHotelDialogProps {
  open: boolean;
  onClose: () => void;
  onImport?: (hotels: Hotel[]) => void; // For backward compatibility
  onImportSuccess?: () => void; // Callback after successful import
  loading?: boolean;
}

const ImportHotelDialog: React.FC<ImportHotelDialogProps> = ({
  open,
  onClose,
  onImport,
  onImportSuccess,
  loading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  }>({ success: 0, errors: [] });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus("idle");
      setImportResults({ success: 0, errors: [] });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImportStatus("processing");
    setImportProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call API
      const response = await axios.post(
        import.meta.env.VITE_PRIVATE_URL + HOTELS.IMPORT_HOTEL,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setImportProgress(100);

      // Process API response
      const result = response.data;

      setImportResults({
        success: result.success || result.imported || 0,
        errors: result.errors || [],
      });

      if (result.success > 0 || result.imported > 0) {
        setImportStatus("success");

        // Call onImport if provided (for backward compatibility)
        if (onImport && result.hotels) {
          onImport(result.hotels);
        }

        // Call onImportSuccess callback
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        setImportStatus("error");
      }
    } catch (error: any) {
      setImportStatus("error");
      console.error("Import error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to import hotels. Please try again.";

      setImportResults({
        success: 0,
        errors: [errorMessage],
      });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportProgress(0);
    setImportStatus("idle");
    setImportResults({ success: 0, errors: [] });
    onClose();
  };

  const getStatusColor = () => {
    switch (importStatus) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "processing":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusIcon = () => {
    switch (importStatus) {
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "500px" },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Import Hotels
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a JSON or CSV file to import multiple hotels
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* File Upload */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Select File
            </Typography>

            <Paper
              sx={{
                p: 3,
                border: "2px dashed",
                borderColor: selectedFile ? "primary.main" : "grey.300",
                bgcolor: selectedFile ? "primary.50" : "grey.50",
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.50",
                },
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              <Stack alignItems="center" spacing={2}>
                <UploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedFile
                      ? selectedFile.name
                      : "Choose a file to upload"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats: JSON, CSV (Max size: 10MB)
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Import Progress */}
          {importStatus === "processing" && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Import Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={importProgress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Processing... {importProgress}%
              </Typography>
            </Box>
          )}

          {/* Import Results */}
          {(importStatus === "success" || importStatus === "error") && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Import Results
              </Typography>

              <Alert
                severity={getStatusColor()}
                icon={getStatusIcon()}
                sx={{ mb: 2 }}
              >
                {importStatus === "success"
                  ? `Successfully imported ${importResults.success} hotels`
                  : "Import completed with errors"}
              </Alert>

              {importResults.success > 0 && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: "success.50" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="success.main"
                  >
                    ✓ {importResults.success} hotels imported successfully
                  </Typography>
                </Paper>
              )}

              {importResults.errors.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: "error.50" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="error.main"
                    mb={1}
                  >
                    ⚠ {importResults.errors.length} errors found:
                  </Typography>
                  <List dense>
                    {importResults.errors.slice(0, 5).map((error, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={error}
                          primaryTypographyProps={{
                            variant: "body2",
                            color: "error.main",
                          }}
                        />
                      </ListItem>
                    ))}
                    {importResults.errors.length > 5 && (
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={`... and ${
                            importResults.errors.length - 5
                          } more errors`}
                          primaryTypographyProps={{
                            variant: "body2",
                            color: "error.main",
                            fontStyle: "italic",
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              )}
            </Box>
          )}

          {/* Format Instructions */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              File Format Requirements
            </Typography>
            <Alert severity="info">
              <Typography variant="body2" component="div">
                <strong>JSON format example:</strong>
                <pre style={{ margin: "8px 0", fontSize: "12px" }}>
                  {`[
  {
    "name": "Hotel Name",
    "description": "Hotel description",
    "rating": 4.5,
    "address": "Hotel address",
    "coordinate": "{'latitude': 12.34, 'longitude': 56.78}",
    "image": ["image1.jpg", "image2.jpg"]
  }
]`}
                </pre>
              </Typography>
            </Alert>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading || importStatus === "processing"}
        >
          {importStatus === "success" ? "Close" : "Cancel"}
        </Button>
        {importStatus !== "success" && (
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={!selectedFile || loading || importStatus === "processing"}
            startIcon={<UploadIcon />}
          >
            {importStatus === "processing" ? "Importing..." : "Import Hotels"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportHotelDialog;
