import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import Button from "@mui/material/Button/Button";
import TextField from "@mui/material/TextField";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../services/stores/useAuthStore";
import { useComment } from "../../../services/stores/useComment";
import { IComment } from "../../../utils/interfaces/comment";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const SingleComment = ({
  comment,
  onUpdate,
  onDelete,
}: {
  comment: IComment;
  onUpdate?: () => void;
  onDelete?: () => void;
}) => {
  const {
    handleLikeComment,
    handleUnlikeComment,
    handleEditComment,
    handleDeleteComment,
  } = useComment();
  const { info } = useAuthStore();
  const currentUserId = info?._id ?? "";

  const [likeCount, setLikeCount] = useState(comment.likes.length);
  const [isLiked, setIsLiked] = useState(comment.likes.includes(currentUserId));
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleClickLike = async () => {
    try {
      if (isLiked) {
        await handleUnlikeComment(comment._id);
        setLikeCount((prev) => Math.max(prev - 1, 0));
        setIsLiked(false);
      } else {
        await handleLikeComment(comment._id);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (err) {
     console.log(err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      enqueueSnackbar("Comment cannot be empty", { variant: "warning" });
      return;
    }

    setLoading(true);
    const res = await handleEditComment(comment._id, editedContent);
    setLoading(false);
    if (res) {
      enqueueSnackbar("Comment updated", { variant: "success" });
      setIsEditing(false);
      onUpdate?.();
    } else {
      enqueueSnackbar("Failed to update comment", { variant: "error" });
    }
  };

  const confirmDelete = async () => {
    const success = await handleDeleteComment(comment._id);
    setDeleteDialogOpen(false);
    if (success) {
      enqueueSnackbar("Comment deleted", { variant: "success" });
      onDelete?.();
    } else {
      enqueueSnackbar("Failed to delete comment", { variant: "error" });
    }
  };

  return (
    <>
      <div className={`comment-block mt-5 flex gap-5 ${comment.parentId ? "ml-10" : ""}`}>
        <img
          src={
            comment.commentBy.avatar ||
            "https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_1280.png"
          }
          alt="avatar"
          className={`${comment.parentId ? "w-8 h-8" : "w-10 h-10"} rounded-full object-cover`}
        />
        <div className="px-3 w-full">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <p className="text-[14px] font-bold">{comment.commentBy.fullName}</p>
              <span className="text-gray-600 text-[14px]">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            {comment.commentBy._id === currentUserId && !isEditing && (
              <div className="flex gap-2 text-gray-500 text-sm">
                <EditIcon className="cursor-pointer" onClick={() => setIsEditing(true)} />
                <DeleteIcon className="cursor-pointer" onClick={() => setDeleteDialogOpen(true)} />
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <TextField
                fullWidth
                multiline
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                disabled={loading}
              />
              <div className="mt-2 flex gap-3">
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="text-blue-600 hover:underline"
                >
                  <CheckIcon /> Save
                </button>
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:underline">
                  <CloseIcon /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[14px] font-[400] mt-1">{comment.content}</div>
          )}

          <div className="text-[14px] font-[600] flex items-center gap-1 py-3">
            <div className="flex items-center gap-1 cursor-pointer" onClick={handleClickLike}>
              {isLiked ? (
                <ThumbUpIcon className="text-blue-600 text-[19px]" />
              ) : (
                <ThumbUpOffAltIcon className="text-gray-600 text-[19px]" />
              )}
              <span className={`font-[600] min-w-[30px] ${isLiked ? "text-blue-600" : "text-gray-600"}`}>
                {likeCount}
              </span>
            </div>
            <p className="font-bold ml-3 cursor-pointer">Reply</p>
          </div>
        </div>
      </div>

      {/* MUI Confirm Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
const Comment = ({ id }: { id: string }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const { handleGetComment, handleCreateComment } = useComment();

  useEffect(() => {
    const fetchComments = async () => {
      const res = await handleGetComment({ blogId: id });
      setComments(res);
    };
    fetchComments();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      enqueueSnackbar("Please enter comment content!", {
        variant: "warning",
      });
      return;
    }

    const res = await handleCreateComment({ blogId: id, content: commentText });
    if (res) {
      const updated = await handleGetComment({ blogId: id });
      setComments(updated);
      setCommentText(""); // reset input
    }
  };

  const topLevelComments = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);

  const getReplies = (parentId: string) =>
    replies.filter((reply) => reply.parentId === parentId);

  return (
    <div>
      {/* Input comment */}
      <div className="comment mt-15 flex gap-5">
        <img
          src="https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_1280.png"
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="relative w-full">
          <TextField
            placeholder="Ask a question or share your thoughts"
            className="w-full"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "9999px",
                paddingRight: "80px",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
              "& .MuiOutlinedInput-input": { padding: "12px 16px" },
            }}
          />
          <Button
            onClick={handleSubmitComment}
            className="absolute font-bold cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-blue-600 px-4 py-1.5 rounded-full text-sm hover:text-blue-900 transition-colors"
          >
            Post
          </Button>
        </div>
      </div>

      <div className="mt-10">
        {topLevelComments.map((comment) => (
          <div key={comment._id}>
            <SingleComment
              comment={comment}
              onUpdate={async () => {
                const updated = await handleGetComment({ blogId: id });
                setComments(updated);
              }}
              onDelete={async () => {
                const updated = await handleGetComment({ blogId: id });
                setComments(updated);
              }}
            />

            {getReplies(comment._id).map((reply) => (
              <SingleComment
                key={reply._id}
                comment={reply}
                onUpdate={async () => {
                  const updated = await handleGetComment({ blogId: id });
                  setComments(updated);
                }}
                onDelete={async () => {
                  const updated = await handleGetComment({ blogId: id });
                  setComments(updated);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
