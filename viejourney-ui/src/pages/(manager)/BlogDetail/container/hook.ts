import { useEffect, useState } from "react";
import { getBlogDetail } from "../../../../services/api/blog";
import { IBlogDetail } from "../../../../utils/interfaces/blog";

function useBlogDetail({ id }: { id: string }) {
  const [blog, setBlog] = useState<IBlogDetail>();

  const handleGetBlogDetail = async () => {
    try {
      const res = await getBlogDetail(id);
      if (res) {
        setBlog(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetBlogDetail();
  }, []);
  return { blog };
}

export default useBlogDetail;
