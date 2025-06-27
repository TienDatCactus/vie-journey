import { useEffect, useState } from "react";
import {
  IBlogPost,
  IBlogQuery,
  IQueryParam,
} from "../../../../../utils/interfaces/blog";
import { enqueueSnackbar } from "notistack";
import {
  createBlog,
  deleteBlog,
  getListBlogs,
} from "../../../../../services/api/blog";

const SIZE = 10;
function useBlog() {
  const [blogs, setBlogs] = useState<IBlogPost[]>();
  const [totalPage, setTotoalPage] = useState<number>();
  const [totalBlog, setTotalBlog] = useState<number>();
  const [params, setParams] = useState({
    search: "",
    page: 1,
    pageSize: SIZE,
  });
  const getBlogs = async (params: IQueryParam) => {
    try {
      const res = await getListBlogs(params);
      if (res) {
        setBlogs(res.data);
        setTotoalPage(res.totalPages);
        setTotalBlog(res.Total_Blogs);
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
        getBlogs(params);
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
        getBlogs(params);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = async (page: number) => {
    const newParams = {
      ...params,
      page: page,
    };
    setParams(newParams);
    getBlogs(newParams);
  };

  const handleSearchChange = (search: string) => {
    const newParams = {
      ...params,
      search,
    };
    setParams(newParams);
    getBlogs(newParams);
  };

  useEffect(() => {
    getBlogs(params);
  }, []);
  return {
    blogs,
    handleCreateBlog,
    handleDeleteBlog,
    totalPage,
    params,
    totalBlog,
    handleChangePage,
    handleSearchChange,
  };
}

export default useBlog;
