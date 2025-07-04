import { useParams } from "react-router-dom";
import { BlogLayout } from "../../../../layouts";

const BlogDetail = () => {
  const { id } = useParams();
  if (!id) return <div>Blog ID not found.</div>;
  return <BlogLayout id={id}>dat</BlogLayout>;
};

export default BlogDetail;
