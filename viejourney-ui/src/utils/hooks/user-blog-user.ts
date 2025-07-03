// import { enqueueSnackbar } from "notistack";
import {
  editBlogDraft,
  getBlogDraft,
  publicBlog,
  startBlog,
} from "../../services/api/blog";

function useBlogUser() {
  const handleStartBlog = async (location: string): Promise<string | null> => {
    try {
      const res = await startBlog(location);
      if (res) {
        return res.blogId;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const handleGetBlogDetail = async (id: string) => {
    try {
      const res = await getBlogDraft(id);
      if (res) return res;
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditBlog = async (id: string, data: any) => {
    try {
      const res = await editBlogDraft(id, data);
      if (res) return res;
    } catch (error) {
      console.log(error);
    }
  };
  const handlePublish = async (id: string) => {
    try {
      const res = await publicBlog(id);
      return res;
     
    } catch (err) {
      console.log(err);
    }
  };
  return {
    handleStartBlog,
    handleGetBlogDetail,
    handleEditBlog,
    handlePublish,
  };
}

export default useBlogUser;
