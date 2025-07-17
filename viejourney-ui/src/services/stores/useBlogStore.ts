import { enqueueSnackbar } from "notistack";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { IBlog, IRelatedBlogs } from "../../utils/interfaces/blog";
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
  getRelatedBlogs,
  likeBlog,
  publicBlog,
  startBlog,
  unlikeBlog,
} from "../api/blog";

interface BlogState {
  // Blog lists
  blogs: IRelatedBlogs[];
  myBlogs: IBlog[];
  relatedBlogs: IRelatedBlogs[];

  // Current blog being viewed/edited
  currentBlog: IBlog | null;
  currentDraftBlog: IBlog | null;
  currentPublicBlog: IBlog | null;

  // Pagination and filters
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  filters: {
    search: string;
    status: string;
    sort: string;
  };

  // Like status for current blog
  isLiked: boolean;
}

interface BlogActions {
  // Blog list actions
  fetchBlogs: (params?: any) => Promise<void>;
  fetchMyBlogs: () => Promise<void>;
  fetchRelatedBlogs: (blogId: string, tags: string[]) => Promise<void>;

  // Single blog actions
  fetchBlogDetail: (id: string) => Promise<void>;
  fetchBlogDraft: (id: string) => Promise<void>;
  fetchBlogPublic: (id: string) => Promise<void>;

  // Blog creation and editing
  startBlog: (location: string) => Promise<string | null>;
  updateBlog: (id: string, data: any, isPublic?: boolean) => Promise<void>;
  publishBlog: (id: string) => Promise<void>;

  // Blog interactions
  toggleLike: (id: string) => Promise<void>;
  flagBlog: (id: string, reason: string) => Promise<void>;
  checkLikeStatus: (id: string) => Promise<void>;

  // State management
  setPagination: (pagination: Partial<BlogState["pagination"]>) => void;
  setFilters: (filters: Partial<BlogState["filters"]>) => void;
  clearCurrentBlog: () => void;

  // Utility actions
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

type BlogStore = BlogState & BlogActions;

const initialState: BlogState = {
  blogs: [],
  myBlogs: [],
  relatedBlogs: [],
  currentBlog: null,
  currentDraftBlog: null,
  currentPublicBlog: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  filters: {
    search: "",
    status: "",
    sort: "",
  },

  isLiked: false,
};

export const useBlogStore = create<BlogStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Fetch blog list with filters and pagination
    fetchBlogs: async (params) => {
      try {
        const currentParams = {
          page: get().pagination.page,
          limit: get().pagination.limit,
          search: get().filters.search,
          status: get().filters.status,
          sort: get().filters.sort,
          ...params,
        };

        const response = await getBlogList(currentParams);

        if (response) {
          set((state) => ({
            blogs:
              currentParams.page === 1
                ? response
                : [...state.blogs, ...response],
            pagination: {
              ...state.pagination,
              page: currentParams.page,
              total: response.length,
            },
          }));
        }
      } catch (error) {
        console.error("fetchBlogs error:", error);
        enqueueSnackbar("Failed to fetch blogs", { variant: "error" });
      }
    },

    // Fetch user's blogs
    fetchMyBlogs: async () => {
      try {
        const response = await getMyBlog();
        if (response) {
          set({ myBlogs: response });
        }
      } catch (error) {
        console.error("fetchMyBlogs error:", error);
        enqueueSnackbar("Failed to fetch your blogs", { variant: "error" });
      }
    },

    // Fetch related blogs
    fetchRelatedBlogs: async (blogId: string, tags: string[]) => {
      try {
        const response = await getRelatedBlogs(blogId, tags);
        if (response) {
          set({ relatedBlogs: response });
        }
      } catch (error) {
        console.error("fetchRelatedBlogs error:", error);
        enqueueSnackbar("Failed to fetch related blogs", { variant: "error" });
      }
    },

    // Fetch single blog detail (public)
    fetchBlogDetail: async (id: string) => {
      set({ currentBlog: null });

      try {
        const response = await getBlogUserDetail(id);
        if (response) {
          set({ currentBlog: response });
        }
      } catch (error) {
        console.error("fetchBlogDetail error:", error);
        enqueueSnackbar("Failed to fetch blog details", { variant: "error" });
      }
    },

    // Fetch draft blog for editing
    fetchBlogDraft: async (id: string) => {
      try {
        const response = await getBlogDraft(id);
        if (response) {
          set({ currentDraftBlog: response });
        }
      } catch (error) {
        console.error("fetchBlogDraft error:", error);
      }
    },

    // Fetch public blog
    fetchBlogPublic: async (id: string) => {
      set({ currentPublicBlog: null });

      try {
        const response = await getBlogPublic(id);
        if (response) {
          set({ currentPublicBlog: response });
        }
      } catch (error) {
        console.error("fetchBlogPublic error:", error);
        enqueueSnackbar("Failed to fetch public blog", { variant: "error" });
      }
    },

    // Start a new blog
    startBlog: async (location: string) => {
      try {
        console.log(location);
        const response = await startBlog(location);

        if (response?.blogId) {
          enqueueSnackbar("Blog created successfully!", { variant: "success" });
          return response.blogId;
        }
        return null;
      } catch (error) {
        console.error("startBlog error:", error);
        enqueueSnackbar("Failed to create blog", { variant: "error" });
        return null;
      }
    },

    // Update blog (draft or public)
    updateBlog: async (id: string, data: any, isPublic = false) => {
      try {
        const response = isPublic
          ? await editBlogPublic(id, data)
          : await editBlogDraft(id, data);

        if (response) {
          set((state) => ({
            currentDraftBlog: isPublic ? state.currentDraftBlog : response,
            currentBlog: isPublic ? response : state.currentBlog,
          }));

          enqueueSnackbar("Blog updated successfully!", { variant: "success" });
        }
      } catch (error) {
        console.error("updateBlog error:", error);
        enqueueSnackbar("Failed to update blog", { variant: "error" });
      }
    },

    // Publish blog
    publishBlog: async (id: string) => {
      try {
        const response = await publicBlog(id);
        if (response) {
          enqueueSnackbar("Blog published successfully!", {
            variant: "success",
          });
          // Refresh my blogs to show updated status
          get().fetchMyBlogs();
        }
      } catch (error) {
        console.error("publishBlog error:", error);
        enqueueSnackbar("Failed to publish blog", { variant: "error" });
      }
    },

    // Toggle like status
    toggleLike: async (id: string) => {
      const currentLikeStatus = get().isLiked;

      // Optimistic update
      set({ isLiked: !currentLikeStatus });

      try {
        if (currentLikeStatus) {
          await unlikeBlog(id);
        } else {
          await likeBlog(id);
        }
      } catch (error) {
        console.error("toggleLike error:", error);
        set({ isLiked: currentLikeStatus });
      }
    },

    // Check like status
    checkLikeStatus: async (id: string) => {
      try {
        const response = await checkLike(id);
        set({ isLiked: !!response?.liked });
      } catch (error) {
        console.error("checkLikeStatus error:", error);
      }
    },

    // Flag blog
    flagBlog: async (id: string, reason: string) => {
      try {
        await createFlag(id, reason);
        enqueueSnackbar("Flag blog successfully", {
          variant: "success",
        });
      } catch (error) {
        console.error("flagBlog error:", error);
      }
    },

    // State management helpers
    setPagination: (pagination) => {
      set((state) => ({
        pagination: { ...state.pagination, ...pagination },
      }));
    },

    setFilters: (filters) => {
      set((state) => ({
        filters: { ...state.filters, ...filters },
        pagination: { ...state.pagination, page: 1 },
      }));
    },

    clearCurrentBlog: () => {
      set({
        currentBlog: null,
        currentDraftBlog: null,
        currentPublicBlog: null,
        isLiked: false,
      });
    },

    // Load more blogs (pagination)
    loadMore: async () => {
      const { pagination, fetchBlogs } = get();
      await fetchBlogs({ page: pagination.page + 1 });
    },

    // Refresh current data
    refresh: async () => {
      const { fetchBlogs, fetchMyBlogs, filters } = get();

      set((state) => ({
        pagination: { ...state.pagination, page: 1 },
      }));

      await Promise.all([fetchBlogs({ ...filters, page: 1 }), fetchMyBlogs()]);
    },
  }))
);

// Simplified selectors
export const useBlogSelectors = () => {
  const store = useBlogStore();

  return {
    totalBlogs: store.blogs.length,
    canLoadMore: store.pagination.page < store.pagination.totalPages,
    filteredBlogs: store.blogs,
  };
};
