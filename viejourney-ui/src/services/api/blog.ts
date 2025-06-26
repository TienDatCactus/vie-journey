import {
  IBlogDetail,
  IBlogPost,
  IBlogQuery,
  IBlogRes,
} from "../../utils/interfaces/blog";
import http from "../axios/index";
import { BLOG } from "./url";

export const getListBlogs = async (): Promise<IBlogPost[]> => {
  const res = await http.get(BLOG.LIST_BLOGS);
  return res.data.data;
};

export const createBlog = async (data: IBlogQuery): Promise<IBlogRes> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("slug", data.slug);
  formData.append("content", data.content);
  formData.append("summary", data.summary);
  formData.append("location", data.location);

  formData.append("userId", data.userId);
  if (data.file) {
    formData.append("file", data.file);
  }

  data.tags.forEach((tag) => {
    formData.append("tags", tag);
  });

  const res = await http.post(BLOG.LIST_BLOGS, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await http.delete(`${BLOG.BLOGS}/${id}`);
  return res.data;
};

export const getBlogDetail = async (id: string): Promise<IBlogDetail> => {
  const res = await http.get(`${BLOG.LIST_BLOGS}/${id}`);
  return res.data;
};

export const updateStatusBlog = async (
  id: string,
  status: "APPROVED" | "REJECTED"
) => {
  const res = await http.post(`${BLOG.BLOGS}/${id}/status`, {
    status,
  });
  return res.data;
};

export const banAuthor = async (id: string, reason: string) => {
  const res = await http.post(`${BLOG.BLOGS}/ban-author/${id}`, {
    reason,
  });
  return res.data;
};
