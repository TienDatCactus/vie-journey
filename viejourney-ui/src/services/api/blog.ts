/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BlogResponse,
  IBlog,
  IBlogDetail,
  IBlogDraft,
  IBlogQuery,
  IBlogRes,
  IQueryParam,
  IRelatedBlogs,
} from "../../utils/interfaces/blog";
import http from "../axios/index";
import { BLOG } from "./url";

export const getListBlogs = async (
  params: IQueryParam
): Promise<BlogResponse> => {
  const res = await http.get(BLOG.LIST_BLOGS, {
    params,
  });
  return res.data;
};

export const createBlog = async (data: IBlogQuery): Promise<IBlogRes> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("slug", data.slug);
  formData.append("content", data.content);
  formData.append("summary", data.summary);
  formData.append("location", data.destination);

  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  data?.tags?.forEach((tag) => {
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

// blog user
export const startBlog = async (location: string): Promise<IBlogDraft> => {
  if (!location.trim()) {
    throw new Error("Location cannot be empty");
  }
  const res = await http.post(`${BLOG.BLOGS}/start-blog`, {
    location,
  });
  return res.data;
};

export const getBlogDraft = async (id: string): Promise<IBlog> => {
  const res = await http.get(`${BLOG.BLOGS}/draft/${id}`);
  return res.data;
};

export const getBlogPublic = async (id: string): Promise<IBlog> => {
  const res = await http.get(`${BLOG.BLOGS}/published/${id}`);
  return res.data;
};
export const editBlogDraft = async (id: string, data: any) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);
  data.places.forEach((place: any, index: number) => {
    Object.entries(place).forEach(([key, value]) => {
      formData.append(`places[${index}][${key}]`, value as any);
    });
  });
  formData.append("summary", data.summary);
  formData.append("slug", data.slug);
  console.log(formData.get("places"));
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  data.tags.forEach((tag: string) => {
    formData.append("tags", tag);
  });
  const res = await http.patch(`${BLOG.BLOGS_UPDATE_DRAFT}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const editBlogPublic = async (id: string, data: any) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("summary", data.summary);
  formData.append("slug", data.slug);
  data.places.forEach((place: any, index: number) => {
    Object.entries(place).forEach(([key, value]) => {
      formData.append(`places[${index}][${key}]`, value as any);
    });
  });
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  data.tags.forEach((tag: string) => {
    formData.append("tags", tag);
  });

  const res = await http.patch(`${BLOG.BLOGS_EDIT}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const publicBlog = async (id: string) => {
  const res = await http.post(`${BLOG.BLOGS}/publish/${id}`);
  return res.data;
};

export const getMyBlog = async (): Promise<IBlog[]> => {
  const res = await http.get(`${BLOG.BLOGS}/my-blogs`);
  return res.data?.blogs;
};

export const getBlogUserDetail = async (id: string): Promise<IBlog> => {
  const res = await http.get(`${BLOG.BLOGS}/${id}`);
  return res.data;
};

export const getBlogList = async (params: any): Promise<IRelatedBlogs[]> => {
  const res = await http.get(`${BLOG.BLOGS}/home`, { params });
  return res.data.data.blogs;
};

export const getRelatedBlogs = async (
  blogId?: string,
  tags?: string[],
  destination?: string
): Promise<IRelatedBlogs[]> => {
  const res = await http.post(`${BLOG.BLOGS_RELATED}`, {
    blogId,
    tags,
    destination,
  });
  return res.data || [];
};

export const clearFlag = async (id: string) => {
  const res = await http.patch(`${BLOG.BLOGS}/${id}/flags`);
  return res.data;
};

export const createFlag = async (id: string, reason: string) => {
  const res = await http.post(`${BLOG.BLOGS}/${id}/flags`, { reason });
  return res.data;
};

export const likeBlog = async (id: string) => {
  const res = await http.post(`${BLOG.BLOGS}/${id}/like`);
  return res.data;
};

export const unlikeBlog = async (id: string) => {
  const res = await http.post(`${BLOG.BLOGS}/${id}/unlike`);
  return res.data;
};

export const checkLike = async (id: string) => {
  const res = await http.get(`${BLOG.BLOGS}/${id}/like`);
  return res.data;
};
