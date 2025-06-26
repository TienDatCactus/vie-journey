"use client";

import {
  CheckCircle,
  Comment,
  Delete,
  Edit,
  LocationOn,
  Schedule,
  Visibility,
   
} from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
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
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IBlogPost } from "../../../../../utils/interfaces/blog";

export default function BlogPostRow({
  blog,
  handleDeleteBlog,
}: {
  blog: IBlogPost;
  handleDeleteBlog: (id: string) => void;
}) {
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
      case "REJECTED":
        return (
          <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-md w-fit">
            <CloseIcon  sx={{ fontSize: 16 }} />
            <span>REJECTED</span>
          </div>
        );
    }
  };

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
            <Avatar sx={{ width: 24, height: 24 }} src={blog?.avatarUser}>
              {blog?.createdBy.fullName}
            </Avatar>
            <span className="text-sm text-gray-500">
              {blog?.createdBy.fullName}
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
          <Link
            to={`http://localhost:5173/manager/blogs/${blog._id}`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left cursor-pointer"
          >
            <Visibility className="text-gray-500" sx={{ fontSize: 16 }} />
          </Link>

          <IconButton size="small">
            <Edit className="text-gray-500" sx={{ fontSize: 16 }} />
          </IconButton>

          <Button
            onClick={() => {
              setSelectedBlogId(blog._id);
              setOpenConfirm(true);
            }}
            className=" text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Delete sx={{ fontSize: 16 }} />
          </Button>

          {/* Confirm delete dialog */}
          <div className="relative" ref={dropdownRef}>
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
                      handleDeleteBlog(selectedBlogId); // ✅ Sử dụng đúng tên hàm
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
