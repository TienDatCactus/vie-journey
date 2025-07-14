/* eslint-disable @typescript-eslint/no-explicit-any */
import { enqueueSnackbar } from "notistack";
import { create } from "zustand";
import {
  checkLike,
  createFlag,
  editBlogDraft,
  editBlogPublic,
  getBlogDraft,
  getBlogList,
  getBlogPublic,
  getBlogUserDetail,
  getMyBlog,
  likeBlog,
  publicBlog,
  startBlog,
  unlikeBlog,
} from "../../services/api/blog";

interface UserBlogStore {
  handleStartBlog: (location: string) => Promise<string | null>;
  handleGetBlogDetail: (id: string) => Promise<any>;
  handleGetBlogPublicDetail: (id: string) => Promise<any>;
  handleEditBlog: (id: string, data: any) => Promise<any>;
  handleEditPublicBlog: (id: string, data: any) => Promise<any>;
  handlePublish: (id: string) => Promise<any>;
  handleGetMyBlogs: () => Promise<any>;
  handleGetBlogUserDetail: (id: string) => Promise<any>;
  handleCreateFlag: (id: string, reason: string) => Promise<void>;
  handleLikeBlog: (id: string) => Promise<any>;
  handleUnlikeBlog: (id: string) => Promise<any>;
  handleCheckIsLike: (id: string) => Promise<any>;

  getBlogList: typeof getBlogList;
}

export const useUserBlog = create<UserBlogStore>((set, get) => ({
  handleStartBlog: async (location: string) => {
    try {
      const res = await startBlog(location);
      return res?.blogId || null;
    } catch (error) {
      console.error("handleStartBlog error:", error);
      return null;
    }
  },

  handleGetBlogDetail: async (id: string) => {
    try {
      return await getBlogDraft(id);
    } catch (error) {
      console.error("handleGetBlogDetail error:", error);
    }
  },

  handleGetBlogPublicDetail: async (id: string) => {
    try {
      return await getBlogPublic(id);
    } catch (error) {
      console.error("handleGetBlogPublicDetail error:", error);
    }
  },

  handleEditBlog: async (id: string, data: any) => {
    try {
      return await editBlogDraft(id, data);
    } catch (error) {
      console.error("handleEditBlog error:", error);
    }
  },

  handleEditPublicBlog: async (id: string, data: any) => {
    try {
      return await editBlogPublic(id, data);
    } catch (error) {
      console.error("handleEditPublicBlog error:", error);
    }
  },

  handlePublish: async (id: string) => {
    try {
      return await publicBlog(id);
    } catch (error) {
      console.error("handlePublish error:", error);
    }
  },

  handleGetMyBlogs: async () => {
    try {
      return await getMyBlog();
    } catch (error) {
      console.error("handleGetMyBlogs error:", error);
    }
  },

  handleGetBlogUserDetail: async (id: string) => {
    try {
      return await getBlogUserDetail(id);
    } catch (error) {
      console.error("handleGetBlogUserDetail error:", error);
    }
  },

  handleCreateFlag: async (id: string, reason: string) => {
    try {
      const res = await createFlag(id, reason);
      if (res) {
        enqueueSnackbar("Flagged blog successful", { variant: "success" });
      }
    } catch (error) {
      console.error("handleCreateFlag error:", error);
    }
  },

  handleLikeBlog: async (id: string) => {
    try {
      await likeBlog(id);
    } catch (error) {
      console.error("handleCreateFlag error:", error);
    }
  },

  handleUnlikeBlog: async (id: string) => {
    try {
      await unlikeBlog(id);
    } catch (error) {
      console.error("handleCreateFlag error:", error);
    }
  },
  handleCheckIsLike: async (id: string): Promise<boolean> => {
    try {
      const res = await checkLike(id);
      return !!res?.liked;
    } catch (error) {
      console.error("handleCheckIsLike error:", error);
      return false;
    }
  },

  getBlogList,
}));
