"use client";

import type React from "react";

import { Close, CloudUpload } from "@mui/icons-material";
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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../../../../../services/stores/useAuthStore";
import { STATUS_BLOG, TAG_BLOG } from "../../../../../utils/constants/common";
import { IBlogQuery } from "../../../../../utils/interfaces/blog";

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
    // trip: "",
    tripId: "",
    // location: "",
    content: "",
    slug: "",
    status: STATUS_BLOG[0].value,
    tags: [] as string[],
    // readTime: "",
    // featured: false,
    summary: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);

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

    setCoverImage(file);
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

      // trip: "",
      // location: "",
      content: "",
      status: STATUS_BLOG[0].value,
      tags: [],
      // readTime: "",
      // featured: false,
      slug: "",
      summary: "",
      tripId: "",
    });
    setCoverImage(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-lg",
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
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Trip "
                variant="outlined"
                value={formData.tripId}
                onChange={(e) => handleInputChange("tripId", e.target.value)}
                placeholder="Trip id"
                // required
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  MenuProps={{ disablePortal: true }}
                >
                  {STATUS_BLOG.map((status, index) => {
                    return (
                      <MenuItem key={index} value={status.value}>
                        {status.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>

          <Divider />

          {/* Trip & Location */}
          {/* <div className="space-y-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Trip & Location Details
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Trip Name"
                variant="outlined"
                value={formData.trip}
                onChange={(e) => handleInputChange("trip", e.target.value)}
                placeholder="e.g., Vietnam Adventure 2024"
              />

              <TextField
                fullWidth
                label="Location"
                variant="outlined"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Da Nang, Vietnam"
              />
            </div>

            <TextField
              fullWidth
              label="Estimated Read Time (minutes)"
              variant="outlined"
              type="number"
              value={formData.readTime}
              onChange={(e) => handleInputChange("readTime", e.target.value)}
              placeholder="e.g., 8"
            />
          </div> */}

          <Divider />

          {/* Content */}
          <div className="space-y-4">
            <Typography variant="h6" className="font-semibold text-gray-800">
              Content
            </Typography>

            <TextField
              fullWidth
              label="Blog Content"
              variant="outlined"
              multiline
              rows={6}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Write your blog post content here..."
              required
            />
          </div>

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

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
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
                  {coverImage ? coverImage.name : "Click to upload cover image"}
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </Typography>
              </label>
            </div>
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
