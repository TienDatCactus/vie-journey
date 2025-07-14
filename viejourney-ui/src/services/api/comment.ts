import {
  CreateCommentPayload,
  IComment,
  ICommentParams,
} from "../../utils/interfaces/comment";
import http from "../axios";
import { COMMENT } from "./url";

export const getComment = async (
  params: ICommentParams
): Promise<IComment[]> => {
  const res = await http.get(`${COMMENT.COMMENTS}`, { params });
  return res.data;
};

export const createComment = async (payload: CreateCommentPayload) => {
  const res = await http.post(`${COMMENT.COMMENTS}`, payload);
  return res.data;
};

export const likeComment = async (commentId: string) => {
  const res = await http.post(`${COMMENT.COMMENTS}/${commentId}/like`);
  return res.data;
};

export const unlikeComment = async (commentId: string) => {
  const res = await http.delete(`${COMMENT.COMMENTS}/${commentId}/like`);
  return res.data;
};

export const editComment = async (commentId: string, content: string) => {
  const res = await http.patch(`${COMMENT.COMMENTS}/${commentId}`, { content });
  return res.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await http.delete(`${COMMENT.COMMENTS}/${commentId}`);
  return res.data;
};
