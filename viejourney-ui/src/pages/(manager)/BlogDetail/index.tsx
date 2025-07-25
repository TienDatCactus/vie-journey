import {
  ArrowBack,
  Block,
  Cancel,
  CheckCircle,
  ClearAll,
  Comment,
  History,
  Person,
  Place,
  RemoveRedEye,
  Star,
  ThumbUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useBlogDetail from "./container/hook";

export default function Blog() {
  const { id } = useParams<{ id: string }>();
  const {
    blog,
    handleUpdateStatus,
    handleBanAuthor,
    handleClearFlag,
    loading,
  } = useBlogDetail({
    id: id ?? "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    null | "APPROVED" | "REJECTED"
  >(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [clearFlagsConfirmOpen, setClearFlagsConfirmOpen] = useState(false);
  const navigate = useNavigate();
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
        <div className="mb-6 flex items-center justify-between">
          <Link to="/manager/blogs">
            <Button
              variant="text"
              startIcon={<ArrowBack />}
              className="text-gray-600 hover:bg-neutral-100"
            >
              Back to All Blogs
            </Button>
          </Link>
          <Stack
            direction="row"
            spacing={1}
            alignItems={"center"}
            className="mt-2"
          >
            <Chip
              label={blog?.status}
              className={`${
                blog?.status == "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : blog?.status == "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : blog?.status == "DRAFT"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            />
            <Button
              variant="outlined"
              className="border-gray-300 text-gray-700 rounded-sm"
              startIcon={<History />}
            >
              View History
            </Button>
          </Stack>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <Skeleton variant="rounded" height={100} />
              <Skeleton variant="rounded" height={400} />
            </div>

            <div className="space-y-6">
              {/* Author Information */}
              <Skeleton variant="rounded" width="100%" height={200} />

              {/* Moderation Actions */}
              <Skeleton variant="rounded" width="100%" height={200} />
            </div>
          </div>
        ) : (
          <Fade in={true} timeout={1000}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h1 className="text-2xl font-medium text-gray-900 mb-2">
                          {blog?.title}
                        </h1>
                        <p className="text-gray-600">{blog?.summary}</p>
                      </div>

                      {/* Author & Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            className="w-10 h-10"
                            src={
                              blog?.createdBy?.avatar?.url || "/placeholder.svg"
                            }
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {blog?.createdBy?.fullName ||
                                blog?.createdBy?.email}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>
                                Published at{" "}
                                {dayjs(blog?.createdAt).format("MMMM D, YYYY")}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Place className="w-3 h-3" />
                                <span>{blog?.destination}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <RemoveRedEye className="w-4 h-4" />
                            <span>{blog?.metrics?.viewCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbUp className="w-4 h-4" />
                            <span>{blog?.metrics?.likeCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Comment className="w-4 h-4" />
                            <span>{blog?.metrics?.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div
                    className="prose tiptap-preview  max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(blog?.content || ""),
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {/* Author Information */}
                <Card sx={{ boxShadow: 1 }}>
                  <CardHeader>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 500 }}
                    >
                      Author Information
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar sx={{ width: 48, height: 48 }}>
                          <img
                            src={
                              blog?.createdBy?.avatar?.url || "/placeholder.svg"
                            }
                            alt="Author"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "grey.900" }}
                          >
                            {blog?.createdBy?.fullName || "Unknown Author"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Star
                                sx={{
                                  width: 12,
                                  height: 12,
                                  color: "warning.main",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                4.5
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Member Since:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {dayjs(blog?.createdBy?.createdAt).format(
                              "MMM YYYY"
                            )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Date of Birth:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {blog?.createdBy?.dob || "Not Provided"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Reputation:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {blog?.createdBy?.flaggedCount || 0} Flags
                          </Typography>
                        </Box>
                      </Box>

                      <Tooltip title="Coming soon!">
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            bgcolor: "white",
                            borderColor: "grey.300",
                            color: "grey.700",
                          }}
                          startIcon={<Person sx={{ width: 16, height: 16 }} />}
                        >
                          View Author Profile
                        </Button>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>

                {/* Moderation Actions */}
                <Card sx={{ boxShadow: 1 }}>
                  <div className="p-4 pb-0">
                    <h1 className="text-lg font-semibold">
                      Moderation Actions
                    </h1>
                  </div>
                  <CardContent>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        {blog?.status === "PENDING" && (
                          <Button
                            fullWidth
                            className="rounded-sm"
                            variant="contained"
                            onClick={handleApprove}
                            sx={{
                              bgcolor: "success.main",
                              "&:hover": { bgcolor: "success.dark" },
                              color: "white",
                            }}
                            startIcon={
                              <CheckCircle sx={{ width: 16, height: 16 }} />
                            }
                          >
                            Approve Post
                          </Button>
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

                        {blog?.status === "PENDING" && (
                          <Button
                            fullWidth
                            className="rounded-sm"
                            variant="outlined"
                            onClick={handleReject}
                            sx={{
                              bgcolor: "white",
                              borderColor: "error.main",
                              color: "error.main",
                              "&:hover": {
                                bgcolor: "error.50",
                                borderColor: "error.dark",
                                color: "error.dark",
                              },
                            }}
                            startIcon={
                              <Cancel sx={{ width: 16, height: 16 }} />
                            }
                          >
                            Reject Post
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Block />}
                          onClick={handleBanAuthorClick}
                          className="rounded-sm"
                        >
                          Ban Author
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Fade>
        )}
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
              navigate("/manager/blogs");
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
