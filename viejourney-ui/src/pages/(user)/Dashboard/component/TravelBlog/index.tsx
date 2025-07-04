import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Grid,
  Container,
  Skeleton,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  Edit,
  Delete,
  Share,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { IMyBlog } from "../../../../../utils/interfaces/blog";
import useBlogUser from "../../../../../utils/hooks/user-blog-user";
import { ImagePlusIcon } from "../../../../../../@/components/tiptap-icons/image-plus-icon";

export default function TravelBlog() {
  const [myBlogs, setMyBlogs] = useState<IMyBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleGetMyBlogs } = useBlogUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await handleGetMyBlogs();
        if (res) setMyBlogs(res);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "primary";
    }
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3} className="mt-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card className="h-full">
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} width="80%" />
              <Skeleton
                variant="text"
                height={20}
                width="60%"
                className="mt-2"
              />
              <Skeleton
                variant="text"
                height={16}
                width="100%"
                className="mt-2"
              />
              <Skeleton variant="text" height={16} width="90%" />
              <Box className="flex justify-between items-center mt-4">
                <Skeleton variant="rectangular" width={80} height={24} />
                <Skeleton variant="text" width={100} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography
          variant="h4"
          component="h1"
          className="mb-6 font-bold text-gray-800"
        >
          My Travel Blogs
        </Typography>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (myBlogs.length === 0) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography
          variant="h4"
          component="h1"
          className="mb-6 font-bold text-gray-800"
        >
          My Travel Blogs
        </Typography>
        <Box className="text-center py-12">
          <Typography variant="h6" className="text-gray-500 mb-4">
            No blogs found
          </Typography>
          <Typography variant="body1" className="text-gray-400">
            Start creating your first travel blog to share your adventures!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Travel Blogs
            </h1>
            <p className="text-gray-600">
              {myBlogs.length} {myBlogs.length === 1 ? "blog" : "blogs"} found
            </p>
          </div>
          <Button href="/blogs/create">
            <ImagePlusIcon className="w-4 h-4 mr-2" />
            Create Blog
          </Button>
        </div>
      </Box>

      <Grid container spacing={3}>
        {myBlogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card
              className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/blogs/${blog._id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={blog.coverImage}
                alt={blog.title}
                className="h-48 object-cover"
              />

              <CardContent className="flex-1 flex flex-col">
                <Box className="flex justify-between items-start mb-2">
                  <Chip
                    label={blog.status}
                    color={getStatusColor(blog.status) as any}
                    size="small"
                    className="capitalize"
                  />
                  <Box className="flex gap-1">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (blog.status === "DRAFT") {
                            navigate(`/blogs/edit/${blog._id}`, {
                              state: { type: "draft" },
                            });
                          } else {
                            navigate(`/blogs/edit/${blog._id}`, {
                              state: { type: "public" },
                            });
                          }
                        }}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-gray-500 hover:text-green-600"
                      >
                        <Share fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: handle delete logic
                        }}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  component="h2"
                  className="mb-2 font-semibold line-clamp-2"
                >
                  {blog.title}
                </Typography>

                <Typography
                  variant="body2"
                  className="text-gray-600 mb-3 line-clamp-3 flex-1"
                >
                  {blog.summary}
                </Typography>

                <Box className="flex items-center mb-2 text-gray-500">
                  <LocationOn fontSize="small" className="mr-1" />
                  <Typography variant="body2" className="truncate">
                    {blog.location}
                  </Typography>
                </Box>

                <Box className="flex items-center justify-between text-gray-500 text-sm">
                  <Box className="flex items-center">
                    <CalendarToday fontSize="small" className="mr-1" />
                    <Typography variant="caption">
                      {formatDate(blog.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
