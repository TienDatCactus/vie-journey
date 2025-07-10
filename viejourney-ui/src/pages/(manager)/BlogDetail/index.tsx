"use client";

import {
  Block,
  Check,
  ClearAll,
  Close,
  Flag,
  LocationOn,
  Phone,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useBlogDetail from "./container/hook";

export default function Blog() {
  const { id } = useParams<{ id: string }>();
  const { blog, handleUpdateStatus, handleBanAuthor, handleClearFlag } = useBlogDetail({
    id: id ?? "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    null | "APPROVED" | "REJECTED"
  >(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [clearFlagsConfirmOpen, setClearFlagsConfirmOpen] = useState(false);

  const handleApprove = () => {
    setConfirmAction("APPROVED");
    setConfirmOpen(true);
  };

  const handleReject = () => {
    setConfirmAction("REJECTED");
    setConfirmOpen(true);
  };

  const handleBanAuthorClick = () => {
    setBanDialogOpen(true);
  };

  const handleClearFlags = () => {
    setClearFlagsConfirmOpen(true);
  };

  const confirmClearFlags = () => {
    if (id) {
      handleClearFlag(id);
    }
    setClearFlagsConfirmOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Blog Moderation
          </Typography>
          <Button
            variant="text"
            size="small"
            href="/manager/blogs"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to All Blogs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {/* <Typography variant="body2" color="text.secondary">
                      Published on {post.publishedDate}
                    </Typography>
                    <Chip
                      label={post.category}
                      size="small"
                      className="bg-blue-100 text-blue-800"
                    /> */}
                  </div>
                  <Typography
                    variant="h4"
                    className="font-bold text-gray-900 mb-4"
                  >
                    {blog?.title}
                  </Typography>
                </div>

                {/* Post Content */}
                <div className="prose max-w-none">
                  <Typography
                    variant="body1"
                    className="text-gray-700 mb-4 leading-relaxed"
                  >
                    {blog?.summary}
                  </Typography>

                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Information */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <Typography variant="h6" className="font-semibold mb-4">
                  Author Information
                </Typography>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar
                    src={blog?.createdBy.avatar.url}
                    alt={blog?.createdBy.fullName}
                    className="w-12 h-12"
                  />
                  <div>
                    <Typography variant="subtitle1" className="font-medium">
                      {blog?.createdBy.fullName}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      Joined {post.author.joinDate}
                    </Typography> */}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {/* <div className="flex items-center gap-2">
                    <Email className="w-4 h-4 text-gray-500" />
                    <Typography variant="body2">{blog?.createdBy.phone}</Typography>
                  </div> */}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <Typography variant="body2">
                      {blog?.createdBy.phone}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationOn className="w-4 h-4 text-gray-500" />
                    <Typography variant="body2">
                      {blog?.createdBy.address}
                    </Typography>
                  </div>
                </div>

                <Divider className="my-4" />
                {/* 
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {post.author.posts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posts
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {post.author.followers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Followers
                    </Typography>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* Flags */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <Typography
                  variant="h6"
                  className="font-semibold mb-4 flex items-center gap-2"
                >
                  <Flag className="w-5 h-5 text-red-500" />
                  Flags ({blog?.flags.length})
                </Typography>

                <div className="space-y-3">
                  {blog?.flags.map((flag, index) => (
                    <Paper
                      key={index}
                      className="p-3 bg-red-50 border border-red-200"
                    >
                      <div className="flex items-start gap-2">
                        <Flag className="w-4 h-4 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <Typography
                            variant="body2"
                            className="font-medium text-red-800"
                          >
                            {flag.reason}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Reported by manager •{" "}
                            {dayjs(flag.date).format("YYYY-MM-DD")}
                          </Typography>
                        </div>
                      </div>
                    </Paper>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Moderation Actions */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <Typography variant="h6" className="font-semibold mb-4">
                  Moderation Actions
                </Typography>

                <div className="space-y-3">
                  {blog?.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<Check />}
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Close />}
                        onClick={handleReject}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}

                  {blog?.flags && blog.flags.length > 0 ? (
                    <Button
                      variant="outlined"
                      startIcon={<ClearAll />}
                      onClick={handleClearFlags}
                      className="w-full"
                    >
                      Clear Flags
                    </Button>
                  ) : (
                    <></>
                  )}

                  <Divider className="my-3" />

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Block />}
                    onClick={handleBanAuthorClick}
                    className="w-full"
                  >
                    Ban Author
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        open={clearFlagsConfirmOpen}
        onClose={() => setClearFlagsConfirmOpen(false)}
      >
        <DialogTitle>Confirm Clear Flags</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to <strong>clear all flags</strong> for this
            blog?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setClearFlagsConfirmOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmClearFlags}
            color="warning"
            variant="contained"
          >
            Clear Flags
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)}>
        <DialogTitle>Ban Author</DialogTitle>
        <DialogContent>
          <Typography className="mb-2">
            Please enter the reason for banning the author:
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="Reason for banning the author..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBanDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (blog?.createdBy?._id && banReason.trim()) {
                await handleBanAuthor(id ?? "", banReason);
                setBanDialogOpen(false);
                setBanReason("");
              }
            }}
            color="error"
            variant="contained"
            disabled={!banReason.trim()}
          >
            Ban
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Moderation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            <strong>
              {confirmAction === "APPROVED" ? "approve" : "reject"}
            </strong>{" "}
            this blog post?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (confirmAction && id) {
                handleUpdateStatus(id, confirmAction);
              }
              setConfirmOpen(false);
            }}
            color={confirmAction === "APPROVED" ? "success" : "error"}
            variant="contained"
          >
            {confirmAction === "APPROVED" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
