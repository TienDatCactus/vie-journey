import {
  ArrowBack,
  EditLocationAlt,
  EmergencyShare,
  SaveAs,
  Visibility,
} from "@mui/icons-material";
import { AppBar, Button, Divider, Stack, Toolbar } from "@mui/material";
import type React from "react";
import { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useBlogStore } from "../../../services/stores/useBlogStore";

interface BlogCreateHeaderProps {
  onSaveDraft: () => Promise<void>;
  onPublic: () => Promise<void>;
  blog?: any;
  formData?: {
    title: string;
    summary: string;
    slug: string;
    tags: string[];
  };
  wordCount?: number;
  loading?: boolean;
}

const BlogCreateHeader: React.FC<BlogCreateHeaderProps> = ({
  onSaveDraft,
  onPublic,
  blog,
  formData,
  wordCount = 0,
  loading: parentLoading = false,
}) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || { type: "draft" };

  const { publishBlog } = useBlogStore();

  const isLoading = loading || parentLoading;

  const handleSaveDraft = async () => {
    if (isLoading) return;

    try {
      setLoading(true);
      await onSaveDraft();
    } catch (error) {
      console.error("Save draft error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublicBlog = async () => {
    if (isLoading) return;

    setLoading(true);
    try {
      await onSaveDraft();

      if (type === "draft" && id) {
        await publishBlog(id);
      } else {
        await onPublic();
      }

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Publish blog error:", error);
      // Có thể hiển thị thông báo lỗi ở đây nếu cần
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (id) {
      // Open preview in new tab
      window.open(`/blogs/${id}/preview`, "_blank");
    }
  };

  const getLocationText = () => {
    if (blog?.destination?.location) {
      return blog.destination.location;
    }
    if (blog?.location) {
      return blog.location;
    }
    if (formData?.title) {
      return formData.title;
    }
    return "New Blog Post";
  };

  return (
    <AppBar position="static" className="bg-white shadow-sm border-b">
      <Toolbar className="flex justify-between items-center min-h-[64px]">
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          className="h-full px-2"
        >
          <Link to="/home" className="no-underline">
            <Button
              className="text-gray-800 hover:text-gray-600 normal-case"
              startIcon={<ArrowBack />}
              disabled={isLoading}
              size="medium"
            >
              Back to Home
            </Button>
          </Link>

          <Divider flexItem orientation="vertical" className="mx-2" />

          <Stack
            direction="row"
            spacing={1}
            className="text-neutral-600 text-sm"
            alignItems="center"
          >
            <EditLocationAlt fontSize="small" className="text-gray-500" />
            <span className="font-medium">{getLocationText()}</span>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" className="px-2">
          <span className="text-sm text-gray-600 font-medium">
            {wordCount} words
          </span>

          <Button
            startIcon={<Visibility />}
            className="text-gray-800 hover:text-gray-600 normal-case"
            onClick={handlePreview}
            disabled={!id || isLoading}
            size="medium"
          >
            Preview
          </Button>

          {type === "draft" ? (
            <>
              <Button
                loading={isLoading}
                startIcon={<SaveAs />}
                variant="outlined"
                className="border-gray-300 text-gray-800 hover:border-gray-400 hover:bg-gray-50 normal-case"
                onClick={handleSaveDraft}
                size="medium"
              >
                {isLoading ? "Saving..." : "Save Draft"}
              </Button>

              <Button
                loading={isLoading}
                variant="contained"
                startIcon={<EmergencyShare />}
                className="bg-black/80 hover:bg-black/60 text-white normal-case"
                onClick={handlePublicBlog}
                size="medium"
              >
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
            </>
          ) : (
            <Button
              disabled={isLoading}
              variant="contained"
              startIcon={<SaveAs />}
              className="bg-blue-600 hover:bg-blue-700 text-white normal-case"
              onClick={handleSaveDraft}
              size="medium"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default BlogCreateHeader;
