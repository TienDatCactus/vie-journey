import {
  CalendarMonthOutlined,
  Favorite,
  FavoriteOutlined,
  FileUpload,
  Flag,
  LockClock,
  Place,
  Visibility,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
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
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BlogLayout } from "../../../../layouts";
import { useBlogStore } from "../../../../services/stores/useBlogStore";
import { useMapPan } from "../../../../services/stores/useMapPan";
const BlogDetail = () => {
  const { currentBlog, isLiked, toggleLike, flagBlog, checkLikeStatus } =
    useBlogStore();
  const { setSelected } = useMapPan();
  // Flag dialog state
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [selectedFlagType, setSelectedFlagType] = useState("");
  const [flagLoading, setFlagLoading] = useState(false);

  // Check like status when blog is loaded
  useEffect(() => {
    if (currentBlog?._id) {
      checkLikeStatus(currentBlog._id);
    }
  }, [currentBlog?._id, checkLikeStatus]);

  const handlePlaceSelect = (place: any) => {
    setSelected({
      ...place,
      location: {
        lat: place.latitude,
        lng: place.longitude,
      },
    });
  };

  const handleLikeToggle = async () => {
    if (!currentBlog?._id) return;

    try {
      await toggleLike(currentBlog._id);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleFlagClick = () => {
    setFlagDialogOpen(true);
  };

  const handleFlagSubmit = async () => {
    if (!currentBlog?._id || !selectedFlagType || !flagReason.trim()) {
      return;
    }

    setFlagLoading(true);

    try {
      const fullReason = `${selectedFlagType}: ${flagReason.trim()}`;
      await flagBlog(currentBlog._id, fullReason.trim());
      setFlagDialogOpen(false);
      setFlagReason("");
      setSelectedFlagType("");
      console.log("Blog flagged successfully");
    } catch (error) {
      console.error("Failed to flag blog:", error);
    } finally {
      setFlagLoading(false);
    }
  };

  const handleFlagCancel = () => {
    setFlagDialogOpen(false);
    setFlagReason("");
    setSelectedFlagType("");
  };

  const flagTypes = [
    { value: "spam", label: "Spam or misleading content" },
    { value: "inappropriate", label: "Inappropriate content" },
    { value: "harassment", label: "Harassment or bullying" },
    { value: "violence", label: "Violence or dangerous content" },
    { value: "misinformation", label: "False or misleading information" },
    { value: "copyright", label: "Copyright infringement" },
    { value: "other", label: "Other" },
  ];
  const handleShare = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/share.php?u=${currentUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const getStatusAlert = (status: any) => {
    switch (status) {
      case "DRAFT":
        return {
          type: "info",
          message:
            "This blog is currently in draft mode. Remember to submit it for review when ready.",
        };
      case "PENDING":
        return {
          type: "warning",
          message:
            "This blog is pending review. You will be notified once it's approved or rejected.",
        };
      case "REJECTED":
        return {
          type: "error",
          message:
            "This blog was rejected. Please review the feedback and make necessary updates.",
        };
      case "APPROVED":
        return {
          type: "success",
          message: "This blog has been approved and is now publicly visible.",
        };
      default:
        return {
          type: "info",
          message: "Unknown status. Please contact support.",
        };
    }
  };

  return (
    <BlogLayout>
      <Helmet>
        <title>{currentBlog?.title}</title>
        <meta property="og:title" content={currentBlog?.title} />
        <meta property="og:description" content={currentBlog?.summary} />
        <meta property="og:image" content={currentBlog?.coverImage} />
        <meta property="og:type" content="article" />
      </Helmet>
      <div className="space-y-2 pb-4">
        {currentBlog?.status != "APPROVED" && (
          <Alert
            className="mb-4"
            severity={
              currentBlog?.status == "DRAFT"
                ? "success"
                : currentBlog?.status == "PENDING"
                ? "info"
                : currentBlog?.status == "REJECTED"
                ? "error"
                : "warning"
            }
          >
            {getStatusAlert(currentBlog?.status)?.message}
          </Alert>
        )}
        <div className="flex flex-wrap gap-2">
          {currentBlog?.tags?.map((tag, index) => (
            <Chip label={tag} key={index} />
          ))}
        </div>
        <h1 className="text-4xl font-light text-gray-900 leading-tight">
          {currentBlog?.title || `Trip to ${currentBlog?.destination}`}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {currentBlog?.summary}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar
            className="w-10 h-10"
            src={
              currentBlog?.createdBy?.avatar?.url ||
              "/placeholder.svg?height=48&width=48"
            }
          />
          <div>
            <p className="font-medium text-gray-900">
              {currentBlog?.createdBy?.fullName ||
                currentBlog?.createdBy?.email}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CalendarMonthOutlined className="w-3 h-3" />
                <span>
                  {dayjs(currentBlog?.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <LockClock className="w-3 h-3" />
                <span>8 min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <Visibility className="w-3 h-3" />
                <span>{currentBlog?.metrics?.viewCount || 0} views</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <IconButton
              onClick={handleLikeToggle}
              className={isLiked ? "text-red-500" : "text-gray-500"}
            >
              {isLiked ? <Favorite /> : <FavoriteOutlined />}
            </IconButton>
          </Tooltip>

          {currentBlog?.status == "APPROVED" && (
            <Tooltip title="Flag as inappropriate">
              <Button
                onClick={handleFlagClick}
                color="warning"
                className="text-gray-500"
              >
                <Flag color="warning" />
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Share">
            <Button
              startIcon={<FileUpload color="info" />}
              onClick={handleShare}
              color="info"
              variant="outlined"
              className="rounded-sm"
            >
              Share
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="my-4">
        <div
          className="prose tiptap-preview max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(currentBlog?.content || ""),
          }}
        />
      </div>

      <Divider className="my-6" />

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">Mentions places</h2>
        <ul className="list-disc">
          {currentBlog?.places?.map((place, index) => {
            const placePhoto = place.photos?.[0] ? place.photos[0] : null;
            return (
              <React.Fragment key={place.placeId || index}>
                <li
                  onClick={() => handlePlaceSelect(place)}
                  className="hover:bg-gray-100 rounded-xl cursor-pointer mb-2 gap-4 grid grid-cols-12"
                >
                  <div className="col-span-8 flex items-center gap-2 overflow-hidden">
                    <div>
                      <IconButton>
                        <Place className="text-gray-500" />
                      </IconButton>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h1 className="font-semibold">
                        {place.displayName || "Unnamed Place"}
                      </h1>
                      {place.types && (
                        <dl className="text-sm flex flex-wrap gap-2 text-gray-500">
                          {place.types[0]?.split(",").map((type, typeIndex) => (
                            <Chip key={typeIndex} label={type} />
                          ))}
                        </dl>
                      )}
                      <p className="text-sm text-gray-500">
                        {place.editorialSummary || "No summary available"}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-4 space-y-2">
                    {placePhoto ? (
                      <img
                        src={placePhoto}
                        alt={place.displayName}
                        className="w-full h-52 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-52 flex items-center justify-center font-semibold text-xl rounded-md bg-gray-200">
                        No image available
                      </div>
                    )}
                  </div>
                </li>
                {index < (currentBlog?.places?.length || 0) - 1 && (
                  <Divider className="my-4 border-gray-300" />
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>

      {/* Flag Dialog */}
      <Dialog
        open={flagDialogOpen}
        onClose={handleFlagCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Flag this blog</Typography>
          <Typography variant="body2" color="text.secondary">
            Help us understand what's wrong with this content
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <FormControl fullWidth required>
              <InputLabel>Reason for flagging</InputLabel>
              <Select
                value={selectedFlagType}
                onChange={(e) => setSelectedFlagType(e.target.value)}
                label="Reason for flagging"
                MenuProps={{
                  container: () => document.body,
                  disablePortal: true,
                }}
              >
                {flagTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Additional details"
              multiline
              rows={4}
              maxRows={6}
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Please provide more details about why you're flagging this content..."
              required
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleFlagCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleFlagSubmit}
            variant="contained"
            color="warning"
            disabled={!selectedFlagType || !flagReason.trim() || flagLoading}
          >
            {flagLoading ? "Submitting..." : "Submit Flag"}
          </Button>
        </DialogActions>
      </Dialog>
    </BlogLayout>
  );
};

export default BlogDetail;
