"use client";

import {
  CheckCircle,
  Comment,
  Edit,
  Flag,
  LocationOn,
  MoreVert,
  Schedule,
  Star,
  ThumbUp,
  Visibility,
  Share,
  OpenInNew,
  Delete,
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
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface BlogPostRowProps {
  title: string;
  author: string;
  trip: string;
  location: string;
  views: number;
  comments: number;
  readTime: number;
  status: "published" | "pending" | "flagged";
  performance: number;
  likes: number;
  modifiedDate: string;
  publishedDate: string;
  featured?: boolean;
  flagged?: boolean;
}

export default function BlogPostRow({
  title,
  author,
  trip,
  location,
  views,
  comments,
  readTime,
  status,
  performance,
  likes,
  modifiedDate,
  publishedDate,
  featured,
  flagged,
}: BlogPostRowProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const getStatusBadge = () => {
    switch (status) {
      case "published":
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
            <CheckCircle sx={{ fontSize: 16 }} />
            <span>Published</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit">
            <Schedule sx={{ fontSize: 16 }} />
            <span>Pending</span>
          </div>
        );
      case "flagged":
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md w-fit">
            <Flag sx={{ fontSize: 16 }} />
            <span>Flagged</span>
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

  const handleDropdownClick = (action: string) => {
    console.log(`${action} clicked for post: ${title}`);
    setShowDropdown(false);
    // Add your action handlers here
  };

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50">
      <td className="py-4 pr-4">
        <Checkbox size="small" />
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-medium">{title}</span>
            {featured && (
              <Star className="text-purple-500" sx={{ fontSize: 16 }} />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Avatar sx={{ width: 24, height: 24 }}>{author.charAt(0)}</Avatar>
            <span className="text-sm text-gray-500">{author}</span>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col">
          <span>{trip}</span>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <LocationOn sx={{ fontSize: 12 }} />
            <span>{location}</span>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-sm">
            <Visibility className="text-gray-500" sx={{ fontSize: 16 }} />
            <span>{views.toLocaleString()}</span>
            <span className="mx-1">•</span>
            <Comment sx={{ fontSize: 14 }} />
            <span>{comments}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">{readTime} min read</div>
        </div>
      </td>
      <td className="py-4 pr-4">
        {getStatusBadge()}
        {flagged && (
          <div className="flex items-center gap-1 text-red-600 mt-1">
            <Flag sx={{ fontSize: 16 }} />
            <span>1</span>
          </div>
        )}
      </td>
      <td className="py-4 pr-4">
        {performance > 0 && (
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Visibility className="text-gray-500" sx={{ fontSize: 16 }} />
              <span>{performance.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <ThumbUp sx={{ fontSize: 14 }} />
              <span>{likes}</span>
            </div>
          </div>
        )}
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-col text-sm">
          <div>
            <span className="text-gray-500">Modified: </span>
            <span>{modifiedDate}</span>
          </div>
          {publishedDate && (
            <div className="mt-1">
              <span className="text-gray-500">Published: </span>
              <span>{publishedDate}</span>
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
                  onClick={() => handleDropdownClick("share")}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <Share sx={{ fontSize: 16 }} />
                  Share
                </button>
                <Link
                  to={"http://localhost:5173/blog/123"}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left cursor-pointer"
                >
                  <OpenInNew sx={{ fontSize: 16 }} />
                  View Live
                </Link>
                <button
                  onClick={() => {
                    setOpenConfirm(true);
                    handleDropdownClick("delete");
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
                    setOpenConfirm(false);
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
