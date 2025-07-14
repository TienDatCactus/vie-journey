import { create } from "zustand";
import {
  createComment,
  deleteComment,
  editComment,
  getComment,
  likeComment,
  unlikeComment,
} from "../../services/api/comment";
import {
  CreateCommentPayload,
  IComment,
  ICommentParams,
} from "../../utils/interfaces/comment";

interface UseComment {
  handleGetComment: (params: ICommentParams) => Promise<IComment[]>;
  handleCreateComment: (
    payload: CreateCommentPayload
  ) => Promise<IComment | null>;
  handleLikeComment: (commentId: string) => Promise<string[] | null>;
  handleUnlikeComment: (commentId: string) => Promise<string[] | null>;
  handleEditComment: (
    commentId: string,
    content: string
  ) => Promise<IComment | null>;
  handleDeleteComment: (commentId: string) => Promise<boolean>;
}

export const useComment = create<UseComment>((set, get) => ({
  handleGetComment: async (params: ICommentParams) => {
    try {
      const comments = await getComment(params);
      return comments;
    } catch {
      return [];
    }
  },

  handleCreateComment: async (payload: CreateCommentPayload) => {
    try {
      const comment = await createComment(payload);
      return comment;
    } catch {
      return null;
    }
  },

  handleLikeComment: async (commentId: string) => {
    try {
      const res = await likeComment(commentId);
      return res;
    } catch {
      return null;
    }
  },
  handleUnlikeComment: async (commentId: string) => {
    try {
      const res = await unlikeComment(commentId);
      return res;
    } catch {
      return null;
    }
  },

  handleEditComment: async (commentId: string, content: string) => {
    try {
      const updatedComment = await editComment(commentId, content);
      return updatedComment;
    } catch {
      return null;
    }
  },

  handleDeleteComment: async (commentId: string) => {
    try {
      await deleteComment(commentId);
      return true;
    } catch {
      return false;
    }
  },
}));
