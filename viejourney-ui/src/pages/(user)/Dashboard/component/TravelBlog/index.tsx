import {
  Add,
  CalendarToday,
  Delete,
  Edit,
  LocationOn,
  Public,
  Share,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid2,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImagePlusIcon } from "../../../../../../@/components/tiptap-icons/image-plus-icon";
import { useBlogStore } from "../../../../../services/stores/useBlogStore";
import CardSkeleton from "../../../../../utils/handlers/loading/CardSkeleton";

export default function TravelBlog() {
  const [loading, setLoading] = useState(true);
  const { fetchMyBlogs, myBlogs } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        await fetchMyBlogs();
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "draft":
        return "primary";
      case "pending":
        return "warning";
      default:
        return "primary";
    }
  };

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
        <CardSkeleton />
      </Container>
    );
  }

  if (myBlogs.length === 0) {
    return (
      <Box
        sx={{
          maxWidth: "125rem",
          mx: "auto",
          backgroundColor: "#fafafa",
          py: 4,
        }}
      >
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#1a1a1a",
                }}
              >
                Travel Guides
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  fontSize: "16px",
                }}
              >
                Share your travel knowledge
              </Typography>
            </Box>

            <Link to={"/blogs/create"}>
              <Button
                variant="contained"
                startIcon={<Add />}
                className="rounded-sm bg-gray-800 hover:bg-gray-900 text-white"
              >
                Create Guide
              </Button>
            </Link>
          </Box>

          <Box
            sx={{
              display: "flex",

              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                borderRadius: "50%",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Public
                className="text-gray-400"
                sx={{
                  fontSize: 60,
                  strokeWidth: 1,
                }}
              />
            </Box>

            <Typography
              variant="h6"
              className="text-2xl"
              sx={{
                fontWeight: 600,
                color: "#333",
              }}
            >
              No guides yet
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#666",
                maxWidth: "400px",
                lineHeight: 1.6,
              }}
            >
              Start sharing your travel experiences by creating your first guide
            </Typography>

            <Link to={"/blogs/create"}>
              <Button
                variant="contained"
                // onClick={handleCreateFirstGuide}
                sx={{
                  backgroundColor: "#2c2c2c",
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                  px: 4,
                  py: 1.5,
                  fontSize: "16px",
                }}
              >
                Create Your First Guide
              </Button>
            </Link>
          </Box>
        </div>
      </Box>
    );
  }

  return (
    <Box className="max-w-[125rem] mx-auto bg-gray-50  my-4">
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
          <Link to="/blogs/create">
            <Button>
              <ImagePlusIcon className="w-4 h-4 mr-2" />
              Create Blog
            </Button>
          </Link>
        </div>
      </Box>

      <Grid2 container spacing={3}>
        {myBlogs.map((blog) => (
          <Grid2 size={4} key={blog._id}>
            <Card
              className="h-full hover:shadow-lg  transition-shadow duration-300 cursor-pointer"
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
                <Box className="flex justify-between items-start">
                  <Chip
                    label={blog.status}
                    color={getStatusColor(blog?.status || "draft")}
                    size="small"
                    className="capitalize"
                  />
                  <Box className="flex gap-1">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (blog.status.toLowerCase() === "draft") {
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
                  className=" font-semibold line-clamp-1"
                >
                  {blog.title}
                </Typography>

                <Typography
                  variant="body2"
                  className="text-gray-600 mb-3 line-clamp-3 flex-1"
                >
                  {blog.summary}
                </Typography>

                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  className="mt-auto"
                >
                  <Box className="flex items-center  text-gray-500">
                    <LocationOn fontSize="small" className="mr-1" />
                    <Typography variant="body2" className="truncate">
                      {blog.destination}
                    </Typography>
                  </Box>

                  <Box className="flex items-center justify-between text-gray-500 text-sm">
                    <Box className="flex items-center">
                      <CalendarToday fontSize="small" className="mr-1" />
                      <Typography variant="body2">
                        {dayjs(blog.createdAt).format("MMM D, YYYY")}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
