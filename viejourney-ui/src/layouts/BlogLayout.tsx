import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid2,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BlogSider from "../components/Pages/(user)/Blogs/BlogSider";
import CommentSection from "../components/Pages/(user)/Blogs/CommentSection";
import RelatedBlogs from "../components/Pages/(user)/Blogs/RelatedBlogs";
import { useAuthStore } from "../services/stores/useAuthStore";
import { useBlogStore } from "../services/stores/useBlogStore";
import MainLayout from "./MainLayout";
const BlogLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchBlogDetail, currentBlog, fetchRelatedBlogs } = useBlogStore();
  const { info } = useAuthStore();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          await fetchBlogDetail(id);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [fetchBlogDetail, id]);
  useEffect(() => {
    if (currentBlog) {
      document.title = `${currentBlog.title} - Vie Journey`;
    }
  }, [currentBlog]);
  useEffect(() => {
    if (currentBlog?._id && currentBlog?.tags) {
      (async () => {
        await fetchRelatedBlogs(
          currentBlog?._id || "",
          currentBlog?.tags || []
        );
      })();
    }
  }, [currentBlog, fetchRelatedBlogs]);
  if (loading) {
    return (
      <Container
        maxWidth="xl"
        className="flex h-screen flex-col justify-center items-center space-y-2 py-4"
      >
        <CircularProgress size={48} />
        <h1 className="text-center text-xl font-light ">
          Loading blog data...
        </h1>
      </Container>
    );
  }
  if (
    currentBlog?.status !== "APPROVED" &&
    currentBlog?.createdBy?._id !== info?._id
  ) {
    return (
      <Container
        maxWidth="xl"
        className="flex h-screen flex-col justify-center items-center py-4"
      >
        <h1 className="text-center text-2xl font-bold">Blog Not Found</h1>
        <Alert
          variant="standard"
          severity="info"
          className="text-center my-2 text-gray-600"
        >
          The blog you are looking for does not exist or is not available.
        </Alert>
        <Link to="/">
          <Button variant="contained" color="primary">
            Back to Home
          </Button>
        </Link>
      </Container>
    );
  }
  return (
    <MainLayout>
      <Container maxWidth="xl" className="py-4">
        <div className="my-4 justify-start flex w-full">
          <Link to="/">
            <Button
              className="text-gray-600 hover:text-gray-900"
              startIcon={<ArrowBack />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
        <Grid2
          container
          sx={{
            width: "100%",
            position: "relative",
            minHeight: "100vh",
          }}
          p={"0px 0"}
          spacing={1}
        >
          <Grid2 size={9} paddingInline={4}>
            <main>
              <div className="py-6">{children}</div>
              <Divider />
              {currentBlog?.status === "APPROVED" && (
                <CommentSection blogId={currentBlog?._id || ""} />
              )}
            </main>
          </Grid2>
          <Grid2
            size={3}
            sx={{
              position: "sticky",
              top: 40,
              alignSelf: "flex-start",
            }}
          >
            <BlogSider />
          </Grid2>
        </Grid2>
        <RelatedBlogs />
      </Container>
    </MainLayout>
  );
};

export default BlogLayout;
