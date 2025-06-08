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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";

export interface SimpleCardProps {
  imageSrc: string;
  title: string;
  size: string;
  onClick: () => void;
  onUpdate?: (file: File) => void;
  onDelete?: () => void;
}

const Card = ({
  imageSrc,
  title,
  size,
  onClick,
  onUpdate,
  onDelete,
}: SimpleCardProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      <div className="w-full h-[340px] bg-white p-[10px] rounded-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-shadow group">
        <div
          className="relative w-full h-[250px] rounded-[5px] overflow-hidden"
          onClick={onClick}
        >
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModal(true);
                }}
                className="flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Update"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="flex items-center justify-center w-10 h-10 bg-red-500/90 hover:bg-red-500 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="Delete"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-[700] text-[20px]">{title}</h3>
          <p className="mt-[10px] text-[#a6acaf]">{size}</p>
        </div>
      </div>

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

export default Card;
