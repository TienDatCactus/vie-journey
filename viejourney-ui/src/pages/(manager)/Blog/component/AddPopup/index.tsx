"use client";

import type React from "react";

import { Close, CloudUpload, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../../../../../services/stores/useAuthStore";
import { TAG_BLOG } from "../../../../../utils/constants/common";
import type { IBlogQuery } from "../../../../../utils/interfaces/blog";
import { SimpleEditor } from "../../../../../../@/components/tiptap-templates/simple/simple-editor";

interface NewPostDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (postData: IBlogQuery) => void;
}

export default function NewPostDialog({
  open,
  onClose,
  onSubmit,
}: NewPostDialogProps) {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: "",
    userId: user?._id || "",
    location: "",
    content: "",
    slug: "",
    tags: [] as string[],
    summary: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (file) {
      setCoverImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "cover-image-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData = {
      ...formData,
      file: coverImage ?? null,
    };
    onSubmit(postData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      userId: user?._id || "",
      content: "",
      tags: [],
      slug: "",
      summary: "",
      location: "",
    });
    setCoverImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "",
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <Typography variant="h5" className="font-bold text-gray-900">
              Create New Blog Post
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Add a new travel blog post to your dashboard
            </Typography>
          </div>
          <IconButton
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Basic Information
            </Typography>

            <TextField
              fullWidth
              label="Post Title"
              variant="outlined"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter an engaging title for your blog post"
              required
            />

            <TextField
              fullWidth
              label="Post Slug"
              variant="outlined"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              placeholder="Enter an engaging slug for your blog post"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      localhost:5173/blogs/
                    </InputAdornment>
                  ),
                },
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <TextField
                fullWidth
                label="Destination "
                variant="outlined"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Destination"
                // required
              />
            </div>
          </div>

          <Divider />

          <div className="space-y-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Summary
            </Typography>

            <TextField
              fullWidth
              label="Blog Summary"
              variant="outlined"
              multiline
              rows={3}
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              placeholder="Write your blog post content here..."
              required
            />
          </div>

          <Divider />

          {/* Tags */}
          <div className="space-y-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Tags
            </Typography>

            <FormControl fullWidth>
              <InputLabel id="tag-select-label">Select Tags</InputLabel>
              <Select
                labelId="tag-select-label"
                multiple
                value={formData.tags}
                onChange={(e) =>
                  handleInputChange("tags", e.target.value as string[])
                }
                MenuProps={{ disablePortal: true }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    ))}
                  </Box>
                )}
              >
                {TAG_BLOG.map((tag) => (
                  <MenuItem key={tag.value} value={tag.value}>
                    {tag.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Divider />

          {/* Cover Image */}
          <div className="space-y-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Cover Image
            </Typography>

            {imagePreview ? (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-48 object-cover  border border-gray-200"
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>

                {/* File Info */}
                <div className="flex items-center justify-between p-3 bg-gray-50 ">
                  <div>
                    <Typography
                      variant="body2"
                      className="font-medium text-gray-700"
                    >
                      {coverImage?.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {coverImage &&
                        `${(coverImage.size / 1024 / 1024).toFixed(2)} MB`}
                    </Typography>
                  </div>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleRemoveImage}
                    startIcon={<Delete />}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300  p-6 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cover-image-upload"
                />
                <label htmlFor="cover-image-upload" className="cursor-pointer">
                  <CloudUpload
                    className="text-gray-400 mb-2"
                    sx={{ fontSize: 48 }}
                  />
                  <Typography variant="body1" className="text-gray-600 mb-1">
                    Click to upload cover image
                  </Typography>
                  <Typography variant="body2" className="text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </Typography>
                </label>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Content
            </Typography>
            <SimpleEditor
              onContentChange={(html) =>
                handleInputChange("content", html.cleanHtml)
              }
            />
          </div>
        </DialogContent>

        <DialogActions className="p-6 border-t border-gray-200 gap-2">
          <Button onClick={handleClose} variant="outlined" className="px-6">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
            // disabled={!formData.title || !formData.author || !formData.content}
          >
            Create Post
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
