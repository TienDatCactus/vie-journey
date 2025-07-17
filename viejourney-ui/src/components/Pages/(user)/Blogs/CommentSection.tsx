import {
  ReviewsOutlined,
  Send,
  ThumbUp,
  MoreVert,
  Edit,
  Delete,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Skeleton,
  Chip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useBlogStore } from "../../../../services/stores/useBlogStore";
import { useComment } from "../../../../services/stores/useComment";
import { useAuthStore } from "../../../../services/stores/useAuthStore";
import { IComment } from "../../../../utils/interfaces/comment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { enqueueSnackbar } from "notistack";

dayjs.extend(relativeTime);

interface CommentSectionProps {
  blogId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const { user } = useAuthStore();
  const {
    handleGetComment,
    handleCreateComment,
    handleLikeComment,
    handleUnlikeComment,
    handleEditComment,
    handleDeleteComment,
  } = useComment();

  // Local state
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [editingComment, setEditingComment] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement;
    commentId: string;
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    commentId: string;
  }>({ open: false, commentId: "" });
  const { info } = useAuthStore();
  // Load comments when component mounts
  useEffect(() => {
    if (blogId) {
      loadComments();
    }
  }, [blogId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await handleGetComment({
        blogId,
        limit: 50,
      });
      setComments(fetchedComments);
      console.log("Comments loaded:", fetchedComments.length);
    } catch (error) {
      console.error("Failed to load comments:", error);
      enqueueSnackbar("Failed to load comments", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user || submitting) return;

    setSubmitting(true);
    try {
      const createdComment = await handleCreateComment({
        blogId,
        content: newComment.trim(),
      });

      if (createdComment) {
        setComments((prev) => [createdComment, ...prev]);
        setNewComment("");
        enqueueSnackbar("Comment posted successfully!", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to post comment", { variant: "error" });
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      enqueueSnackbar("Failed to post comment", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCommentSubmit = async () => {
    if (!editingComment || !editingComment.content.trim()) return;

    try {
      const updatedComment = await handleEditComment(
        editingComment.id,
        editingComment.content.trim()
      );

      if (updatedComment) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === editingComment.id ? updatedComment : comment
          )
        );
        setEditingComment(null);
        enqueueSnackbar("Comment updated successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failed to update comment", { variant: "error" });
      }
    } catch (error) {
      console.error("Failed to edit comment:", error);
      enqueueSnackbar("Failed to update comment", { variant: "error" });
    }
  };

  const handleDeleteCommentConfirm = async () => {
    if (!deleteDialog.commentId) return;

    try {
      const success = await handleDeleteComment(deleteDialog.commentId);

      if (success) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== deleteDialog.commentId)
        );
        setLikedComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteDialog.commentId);
          return newSet;
        });
        setDeleteDialog({ open: false, commentId: "" });
        enqueueSnackbar("Comment deleted successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failed to delete comment", { variant: "error" });
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      enqueueSnackbar("Failed to delete comment", { variant: "error" });
    }
  };

  const handleToggleLike = async (commentId: string) => {
    if (!user) return;

    const isCurrentlyLiked = likedComments.has(commentId);

    // Optimistic update
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              likeCount: isCurrentlyLiked
                ? Math.max(0, (comment.likes.length || 1) - 1)
                : (comment.likes.length || 0) + 1,
            }
          : comment
      )
    );

    try {
      let result;
      if (isCurrentlyLiked) {
        result = await handleUnlikeComment(commentId);
      } else {
        result = await handleLikeComment(commentId);
      }

      if (!result) {
        // Revert optimistic update if API call failed
        setLikedComments((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });

        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likeCount: isCurrentlyLiked
                    ? (comment.likes.length || 0) + 1
                    : Math.max(0, (comment.likes.length || 1) - 1),
                }
              : comment
          )
        );

        enqueueSnackbar("Failed to update like", { variant: "error" });
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      enqueueSnackbar("Failed to update like", { variant: "error" });
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    commentId: string
  ) => {
    setMenuAnchor({ element: event.currentTarget, commentId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const renderCommentSkeleton = () => (
    <div className="flex space-x-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={60} />
        <Skeleton variant="text" width="20%" height={16} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-gray-900">Comments</h3>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <ReviewsOutlined className="w-4 h-4" />
          <span>{comments.length} comments</span>
        </div>
      </div>

      {/* Add Comment */}
      {user ? (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar
              className="w-10 h-10"
              src={info?.avatar || "/placeholder.svg?height=40&width=40"}
            />
            <div className="flex-1">
              <TextField
                multiline
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts or ask a question..."
                className="border-gray-200 focus:border-gray-300"
                disabled={submitting}
                variant="standard"
                slotProps={{
                  input: {
                    className: "rounded-sm",
                  },
                }}
              />
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submitting}
                  className="bg-gray-900 rounded-sm hover:bg-gray-800 text-white disabled:bg-gray-400"
                >
                  <Send className="w-3 h-3 mr-2" />
                  {submitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Typography variant="body2" color="text.secondary">
            Please sign in to leave a comment
          </Typography>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i}>{renderCommentSkeleton()}</div>
            ))}
          </>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <ReviewsOutlined className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <Typography variant="h6" color="text.secondary">
              No comments yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share your thoughts!
            </Typography>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex space-x-4">
              <Avatar
                src={
                  comment.commentBy?.avatar?.url ||
                  "/placeholder.svg?height=40&width=40"
                }
                className="w-10 h-10"
              />
              <div className="flex-1">
                {editingComment?.id === comment._id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <TextField
                      multiline
                      fullWidth
                      rows={3}
                      value={editingComment.content}
                      onChange={(e) =>
                        setEditingComment({
                          ...editingComment,
                          content: e.target.value,
                        })
                      }
                      className="bg-white"
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleEditCommentSubmit}
                        disabled={!editingComment.content.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setEditingComment(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {comment.commentBy?.fullName || "Anonymous"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {dayjs(comment.createdAt).fromNow()}
                          </span>
                          {comment.updatedAt !== comment.createdAt && (
                            <Chip
                              label="edited"
                              size="small"
                              variant="outlined"
                              className="text-xs"
                            />
                          )}
                        </div>

                        {user &&
                          (comment.commentBy?._id === user._id ||
                            user.role != "USER") && (
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, comment._id)}
                            >
                              <MoreVert className="w-4 h-4" />
                            </IconButton>
                          )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      {user && (
                        <div className="flex items-center">
                          <IconButton
                            size="small"
                            onClick={() => handleToggleLike(comment._id)}
                            className={
                              likedComments.has(comment._id)
                                ? "text-blue-600"
                                : "text-gray-500"
                            }
                          >
                            <ThumbUp className="w-4 h-4" />
                          </IconButton>
                          <span className="ml-1">
                            {comment.likes.length || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const comment = comments.find(
              (c) => c._id === menuAnchor?.commentId
            );
            if (comment) {
              setEditingComment({
                id: comment._id,
                content: comment.content,
              });
            }
            handleMenuClose();
          }}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteDialog({
              open: true,
              commentId: menuAnchor?.commentId || "",
            });
            handleMenuClose();
          }}
          className="text-red-600"
        >
          <Delete className="w-4 h-4 mr-2" />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, commentId: "" })}
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, commentId: "" })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCommentConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CommentSection;
