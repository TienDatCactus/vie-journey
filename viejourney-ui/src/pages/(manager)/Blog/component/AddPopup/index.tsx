"use client"

import type React from "react"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material"
import { Close, CloudUpload, Add } from "@mui/icons-material"
import { useState } from "react"
import { PostData } from "../../../../../utils/interfaces/blog"



interface NewPostDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (postData: PostData) => void
}

export default function NewPostDialog({ open, onClose, onSubmit }: NewPostDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    trip: "",
    location: "",
    content: "",
    status: "draft",
    tags: [] as string[],
    readTime: "",
    featured: false,
  })

  const [newTag, setNewTag] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCoverImage(file)
    }
  }

  const handleSubmit = () => {
    const postData = {
      ...formData,
      coverImage,
      createdDate: new Date().toISOString(),
    }
    onSubmit(postData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      title: "",
      author: "",
      trip: "",
      location: "",
      content: "",
      status: "draft",
      tags: [],
      readTime: "",
      featured: false,
    })
    setNewTag("")
    setCoverImage(null)
    onClose()
  }

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
      <DialogTitle className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <Typography variant="h5" className="font-bold text-gray-900">
            Create New Blog Post
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Add a new travel blog post to your dashboard
          </Typography>
        </div>
        <IconButton onClick={handleClose} className="text-gray-400 hover:text-gray-600">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Author"
              variant="outlined"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              placeholder="Author name"
              required
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="pending">Pending Review</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <Divider />

        {/* Trip & Location */}
        <div className="space-y-4">
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
        </div>

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

        <Divider />

        {/* Tags */}
        <div className="space-y-4">
          <Typography variant="h6" className="font-semibold text-gray-800">
            Tags
          </Typography>

          <div className="flex gap-2">
            <TextField
              label="Add Tag"
              variant="outlined"
              size="small"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="e.g., food, adventure, culture"
              className="flex-1"
            />
            <Button variant="outlined" onClick={handleAddTag} startIcon={<Add />} className="whitespace-nowrap">
              Add Tag
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <Box className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
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
              <CloudUpload className="text-gray-400 mb-2" sx={{ fontSize: 48 }} />
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
          onClick={handleSubmit}
          variant="contained"
          className="px-6 bg-indigo-600 hover:bg-indigo-700"
          disabled={!formData.title || !formData.author || !formData.content}
        >
          Create Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}
