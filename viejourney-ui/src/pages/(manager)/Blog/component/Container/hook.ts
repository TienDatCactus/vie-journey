import { useEffect, useState } from "react";
import { IBlogPost, IBlogQuery } from "../../../../../utils/interfaces/blog";
import { enqueueSnackbar } from "notistack";
import {
  createBlog,
  deleteBlog,
  getListBlogs,
} from "../../../../../services/api/blog";

function useBlog() {
  const [blogs, setBlogs] = useState<IBlogPost[]>();
  const getBlogs = async () => {
    try {
      const res = await getListBlogs();
      if (res) {
        setBlogs(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateBlog = async (data: IBlogQuery) => {
    try {
      const res = await createBlog(data);
      if (res) {
        enqueueSnackbar("Create blog successful", { variant: "success" });
        getBlogs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await deleteBlog(id);
      if (res) {
        enqueueSnackbar("Delete blog successful", {
          variant: "success",
        });
        getBlogs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);
  return { blogs, handleCreateBlog, handleDeleteBlog };
}

export default useBlog;
