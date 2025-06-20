"use client";

import {
  CheckCircle,
  Comment,
  Delete,
  Edit,
  LocationOn,
  MoreVert,
  OpenInNew,
  Schedule,
  Share,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IBlogPost } from "../../../../../utils/interfaces/blog";

export default function BlogPostRow({
  blog,
  handeleDeleteBlog,
}: {
  blog: IBlogPost;
  handeleDeleteBlog: (id: string) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const getStatusBadge = () => {
    switch (blog.status) {
      case "APPROVED":
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
            <CheckCircle sx={{ fontSize: 16 }} />
            <span>APPROVED</span>
          </div>
        );
      case "PENDING":
        return (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit">
            <Schedule sx={{ fontSize: 16 }} />
            <span>PENDING</span>
          </div>
        );
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50">
      <td className="py-4 pr-4">
        <Checkbox size="small" />
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-medium">{blog.summary}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Avatar sx={{ width: 24, height: 24 }} src={blog?.avatar}>
              {blog?.createdBy?.charAt(0) ?? ""}
            </Avatar>
            <span className="text-sm text-gray-500">
              {blog?.createdBy ?? ""}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col">
          <span>{blog.title}</span>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <LocationOn sx={{ fontSize: 12 }} />
            <span>Đà Nẵng, Việt Nam</span>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-sm">
            <Visibility className="text-gray-500" sx={{ fontSize: 16 }} />
            <span>{blog.viewCount.toLocaleString()}</span>
            <span className="mx-1">•</span>
            <Comment sx={{ fontSize: 14 }} />
            <span>{blog.commentCount}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {blog.likeCount} min read
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">{getStatusBadge()}</td>

      <td className="py-4 pr-4">
        <div className="flex flex-col text-sm">
          <div>
            <span className="text-gray-500">Modified: </span>
            <span>{dayjs(blog.updatedAt).format("YYYY-MM-DD")}</span>
          </div>
          {blog.createdAt && (
            <div className="mt-1">
              <span className="text-gray-500">Published: </span>
              <span>{dayjs(blog.createdAt).format("YYYY-MM-DD")}</span>
            </div>
          )}
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-1">
          <IconButton size="small">
            <Visibility className="text-gray-500" sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small">
            <Edit className="text-gray-500" sx={{ fontSize: 16 }} />
          </IconButton>
          <div className="relative" ref={dropdownRef}>
            <IconButton
              size="small"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreVert className="text-gray-500" sx={{ fontSize: 16 }} />
            </IconButton>

            {showDropdown && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-10">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    // Có thể thêm logic chia sẻ ở đây
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <Share sx={{ fontSize: 16 }} />
                  Share
                </button>
                <Link
                  to={`http://localhost:5173/blog/${blog._id}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left cursor-pointer"
                >
                  <OpenInNew sx={{ fontSize: 16 }} />
                  View Live
                </Link>
                <button
                  onClick={() => {
                    setSelectedBlogId(blog._id);
                    setOpenConfirm(true);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                >
                  <Delete sx={{ fontSize: 16 }} />
                  Delete
                </button>
              </div>
            )}
            <Dialog
              open={openConfirm}
              onClose={() => setOpenConfirm(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this blog?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenConfirm(false)} color="inherit">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedBlogId) {
                      handeleDeleteBlog(selectedBlogId);
                    }
                    setOpenConfirm(false);
                    setSelectedBlogId(null);
                  }}
                  color="error"
                  variant="contained"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </td>
    </tr>
  );
}
