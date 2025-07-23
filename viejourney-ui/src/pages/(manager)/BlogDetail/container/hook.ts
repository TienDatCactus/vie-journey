import { useEffect, useState } from "react";
import {
  banAuthor,
  clearFlag,
  getBlogDetail,
  updateStatusBlog,
} from "../../../../services/api/blog";
import { IBlogDetail } from "../../../../utils/interfaces/blog";
import { enqueueSnackbar } from "notistack";

function useBlogDetail({ id }: { id: string }) {
  const [blog, setBlog] = useState<IBlogDetail>();
  const [loading, setLoading] = useState(false);
  const handleGetBlogDetail = async () => {
    try {
      setLoading(true);
      const res = await getBlogDetail(id);
      if (res) {
        setBlog(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      const res = await updateStatusBlog(id, status);
      if (res) {
        enqueueSnackbar("Update status blog successful", {
          variant: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBanAuthor = async (id: string, reason: string) => {
    try {
      const res = await banAuthor(id, reason);
      if (res) {
        enqueueSnackbar("Ban author successful", {
          variant: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClearFlag = async (id: string) => {
    try {
      const res = await clearFlag(id);
      if (res) {
        enqueueSnackbar("Clear flag blog successful", {
          variant: "success",
        });
      }
      handleGetBlogDetail();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetBlogDetail();
  }, []);
  return {
    blog,
    handleUpdateStatus,
    handleBanAuthor,
    handleClearFlag,
    loading,
  };
}

export default useBlogDetail;
