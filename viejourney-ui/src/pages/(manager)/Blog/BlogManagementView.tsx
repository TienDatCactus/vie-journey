"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import {
  Flag,
  Email,
  Phone,
  LocationOn,
  Check,
  Close,
  Block,
  ClearAll,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import useBlogDetail from "../BlogDetail/container/hook";

interface AuthorInfo {
  name: string;
  avatar: string;
  joinDate: string;
  email: string;
  phone: string;
  location: string;
  posts: number;
  followers: number;
}

interface ModerationFlag {
  id: string;
  type: "inappropriate" | "spam";
  reason: string;
  reportedBy: string;
  date: string;
}

interface BlogPost {
  id: string;
  title: string;
  publishedDate: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  content: string;
  author: AuthorInfo;
  flags: ModerationFlag[];
}

export default function BlogManagementView() {
  const [post] = React.useState<BlogPost>();
  const { id } = useParams<{ id: string }>();

  const { blog } = useBlogDetail({ id: id ?? "" });

  const handleApprove = () => {
    console.log("Approving post:", post?.id);
  };

  const handleReject = () => {
    console.log("Rejecting post:", post?.id);
  };

  const handleBanAuthor = () => {
    console.log("Banning author:", post?.author.name);
  };

  const handleClearFlags = () => {
    console.log("Clearing flags for post:", post?.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Blog Moderation
          </Typography>
          <Button
            variant="text"
            size="small"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to All Blogs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Typography variant="body2" color="text.secondary">
                      Published on {post?.publishedDate}
                    </Typography>
                    <Chip
                      label={post?.category}
                      size="small"
                      className="bg-blue-100 text-blue-800"
                    />
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

                  {blog?.content}
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
                    src={post?.author.avatar}
                    alt={post?.author.name}
                    className="w-12 h-12"
                  />
                  <div>
                    <Typography variant="subtitle1" className="font-medium">
                      {post?.author.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Joined {post?.author.joinDate}
                    </Typography>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Email className="w-4 h-4 text-gray-500" />
                    <Typography variant="body2">
                      {post?.author.email}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <Typography variant="body2">
                      {post?.author.phone}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationOn className="w-4 h-4 text-gray-500" />
                    <Typography variant="body2">
                      {post?.author.location}
                    </Typography>
                  </div>
                </div>

                <Divider className="my-4" />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {post?.author.posts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posts
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {post?.author.followers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Followers
                    </Typography>
                  </div>
                </div>
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
                  Flags ({post?.flags.length})
                </Typography>

                <div className="space-y-3">
                  {post?.flags.map((flag) => (
                    <Paper
                      key={flag.id}
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
                            Reported by {flag.reportedBy} • {flag.date}
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

                  <Button
                    variant="outlined"
                    startIcon={<ClearAll />}
                    onClick={handleClearFlags}
                    className="w-full"
                  >
                    Clear Flags
                  </Button>

                  <Divider className="my-3" />

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Block />}
                    onClick={handleBanAuthor}
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
    </div>
  );
}
