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
  const [params, setParams] = useState<IQueryParam>({
    search: "",
    page: 1,
    pageSize: SIZE,
    status: "",
    sort: "asc",
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
        await getBlogs(params);
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
        await getBlogs(params);
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
    await getBlogs(newParams);
  };

  const handleSearchChange = async (search: string) => {
    const newParams = {
      ...params,
      search,
    };
    setParams(newParams);
    await getBlogs(newParams);
  };

  const handleChangeStatus = async (status: string) => {
    const newParams = {
      ...params,
      status,
    };
    setParams(newParams);
    await getBlogs(newParams);
  };
  const handleSort = async (sort: string) => {
    const newParams = {
      ...params,
      sort,
    };
    setParams(newParams);
    await getBlogs(newParams);
  };

  useEffect(() => {
    (async () => {
      await getBlogs(params);
    })();
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
    handleChangeStatus,
    handleSort,
    getBlogs,
  };
}

export default useBlog;
