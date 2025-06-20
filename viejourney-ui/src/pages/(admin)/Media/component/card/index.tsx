"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Paper,
  Chip,
  Card,
  CardActions,
  CardMedia,
  CardContent,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { Delete, Edit } from "@mui/icons-material";

export interface SimpleCardProps {
  imageSrc: string;
  title: string;
  size: string;
  dimensions: string;
  onClick: () => void;
  onUpdate?: (file: File) => void;
  onDelete?: () => void;
}

const AssetCard = ({
  imageSrc,
  title,
  size,
  dimensions,
  onClick,
  onUpdate,
  onDelete,
}: SimpleCardProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSave = () => {
    if (selectedFile && onUpdate) {
      onUpdate(selectedFile);
    }
    setOpenModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <Card
        className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md"
        sx={{ maxWidth: 345 }}
      >
        <div
          className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden cursor-pointer"
          onClick={imageSrc ? onClick : undefined}
        >
          <CardMedia
            component="img"
            height="194"
            image={imageSrc || "/placeholder.svg"}
            alt="Paella dish"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-2 right-1/2 transform translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <CardActions className="flex gap-1">
              <IconButton
                onClick={() => setOpenModal(true)}
                className="bg-white"
                aria-label="add to favorites"
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => setOpenConfirm(true)}
                className="bg-red-500 text-white"
                aria-label="share"
              >
                <Delete />
              </IconButton>
            </CardActions>
          </div>
        </div>
        <CardContent>
          <h1 className="font-semibold">{title}</h1>
          <Typography variant="body2" color="text.secondary">
            Size: {size || "Unknown"} | Dimensions: {dimensions || "Unknown"}
          </Typography>
        </CardContent>
      </Card>
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onDelete?.();
              setOpenConfirm(false);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openModal}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Update Image
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCancel}
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ paddingTop: "16px !important" }}>
          <Box
            sx={{
              position: "relative",
              border: "2px dashed",
              borderColor: isDragOver
                ? "primary.main"
                : selectedFile
                ? "success.main"
                : "grey.300",
              borderRadius: "8px",
              padding: 3,
              backgroundColor: isDragOver
                ? "primary.50"
                : selectedFile
                ? "success.50"
                : "background.paper",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                borderColor:
                  !isDragOver && !selectedFile ? "grey.400" : undefined,
              },
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
              id="file-upload"
            />

            {!selectedFile ? (
              <Box sx={{ textAlign: "center" }}>
                <CloudUploadIcon
                  sx={{
                    fontSize: 48,
                    color: isDragOver ? "primary.main" : "text.secondary",
                    mb: 1,
                  }}
                />
                <Typography variant="body1" component="div" sx={{ mt: 2 }}>
                  <Box
                    component="span"
                    sx={{
                      color: "primary.main",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Click to upload
                  </Box>
                  <Box component="span" sx={{ color: "text.secondary" }}>
                    {" "}
                    or drag and drop
                  </Box>
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  PNG, JPG, GIF up to 10MB
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <CheckCircleIcon
                  sx={{ fontSize: 48, color: "success.main", mb: 2 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  File selected
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {selectedFile.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            )}
          </Box>

          {previewUrl && (
            <Box sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Preview
                </Typography>
                <IconButton
                  size="small"
                  onClick={removeFile}
                  sx={{
                    p: 1,
                    "&:hover": {
                      backgroundColor: "error.50",
                      color: "error.main",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "grey.100",
                }}
              >
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          )}

          {selectedFile && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 1.5,
                backgroundColor: "grey.50",
                borderRadius: "8px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <ImageIcon color="action" fontSize="small" />
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={selectedFile.type.split("/")[1].toUpperCase()}
                      size="small"
                      sx={{
                        height: "20px",
                        fontSize: "0.7rem",
                        backgroundColor: "grey.200",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleCancel}
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedFile}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssetCard;
