import { Place } from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BlogCreateLayout } from "../../../../layouts";
import { useBlogStore } from "../../../../services/stores/useBlogStore";
import { getWordCount } from "../../../../utils/handlers/utils";
import { SimpleEditor } from "./../../../../../@/components/tiptap-templates/simple/simple-editor";

const CreateBlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { type } = location.state || {};
  const {
    currentBlog,
    currentDraftBlog,
    currentPublicBlog,
    fetchBlogDetail,
    fetchBlogDraft,
    fetchBlogPublic,
    updateBlog,
    publishBlog,
  } = useBlogStore();

  const [editorContent, setEditorContent] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    slug: "",
    tags: [] as string[],
    coverImage: null as File | null,
    content: "", // Added content field
    places: [] as any[], // Added places field with any[] type
  });

  const blog =
    type === "public"
      ? currentPublicBlog
      : type === "draft"
      ? currentDraftBlog
      : currentBlog;
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setIsDataLoaded(false);

        if (type === "public") {
          await fetchBlogPublic(id);
        } else if (type === "draft") {
          await fetchBlogDraft(id);
        } else {
          await fetchBlogDetail(id);
        }
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
        enqueueSnackbar("Failed to load blog data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id, type, fetchBlogDetail, fetchBlogDraft, fetchBlogPublic]);

  useEffect(() => {
    if (blog && !isDataLoaded) {
      console.log("Loading blog data into form:", blog);

      setEditorContent(blog.content || "");

      setFormData({
        title: blog.title || "",
        summary: blog.summary || "",
        slug: blog.slug || "",
        tags: Array.isArray(blog.tags) ? blog.tags : [],
        coverImage: null,
        content: blog.content || "", // Initialize content
        places: blog.places || [], // Initialize places
      });

      setCoverImageUrl(blog.coverImage || null);

      setIsDataLoaded(true);
    }
  }, [blog, isDataLoaded]);

  useEffect(() => {
    setIsDataLoaded(false);
  }, [id, type]);

  const handleFormDataChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditorChange = (processedContent: {
    cleanHtml: string;
    places: any[];
  }) => {
    setFormData((prev) => ({
      ...prev,
      content: processedContent.cleanHtml,
      places: processedContent.places,
    }));
  };

  const handleSaveDraft = async () => {
    if (!id) {
      enqueueSnackbar("Blog ID is missing", { variant: "error" });
      return;
    }

    try {
      setLoading(true);

      const data = {
        title: formData.title,
        content: formData.content,
        places: formData.places,
        summary: formData.summary,
        slug: formData.slug,
        tags: formData.tags,
        coverImage: formData.coverImage,
      };

      const isPublic = type === "public";
      await updateBlog(id, data, isPublic);
    } catch (error) {
      console.error("Save draft error:", error);
      enqueueSnackbar("Failed to save blog", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePublicBlog = async () => {
    if (!id) {
      enqueueSnackbar("Blog ID is missing", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      await publishBlog(id);
    } catch (error) {
      console.error("Publish blog error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching initial data
  if (loading && !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress size={48} />
          <div className="text-lg text-gray-600">Loading blog data...</div>
        </div>
      </div>
    );
  }
  // Show error state if no blog data and not loading
  if (!blog && !loading && id) {
    return (
      <Dialog open={true} maxWidth="xs" fullWidth>
        <DialogTitle className="text-center text-red-500 text-xl pb-0">
          Blog not found or failed to load
        </DialogTitle>
        <DialogContent className="my-4 pb-0 text-center text-lg">
          Please try again or return to the homepage.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            className="rounded-sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <Button variant="outlined" className="rounded-sm">
              Back Home
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    );
  }

  // Don't render the editor until we have blog data
  if (!isDataLoaded && blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress size={48} />
          <div className="text-lg text-gray-600">Preparing editor...</div>
        </div>
      </div>
    );
  }
  const wordCount = getWordCount(editorContent);
  return (
    <BlogCreateLayout
      onSaveDraft={handleSaveDraft}
      onPublic={handlePublicBlog}
      wordCount={wordCount}
      blog={blog}
      formData={formData}
      onFormDataChange={handleFormDataChange}
      coverImageUrl={coverImageUrl}
      setCoverImageUrl={setCoverImageUrl}
      loading={loading}
    >
      <SimpleEditor
        key={`editor-${id}-${isDataLoaded}`} // Force re-render when data is loaded
        loading={loading}
        content={editorContent}
        onContentChange={handleEditorChange}
      />
      {!!blog && blog?.places.length > 0 && (
        <div className="mt-4 max-h-160 overflow-y-scroll px-4">
          <h2 className="text-lg font-semibold mb-2">Places Mentioned:</h2>
          <ul className="list-disc pl-5">
            {blog?.places.map((place, index) => {
              const placePhoto = place.photos?.[0] ? place.photos[0] : null;
              return (
                <>
                  <li
                    key={index}
                    className="mb-2 gap-4 max-h-50 h-50 grid grid-cols-12"
                  >
                    <div className="col-span-8 flex items-center gap-2 overflow-hidden">
                      <div>
                        <IconButton>
                          <Place className="text-gray-500" />
                        </IconButton>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h1 className="font-semibold">
                          {place.displayName || "Unnamed Place"}
                        </h1>
                        {place.types && (
                          <dl className="text-sm flex flex-wrap gap-2 text-gray-500">
                            {place.types[0].split(",").map((type, index) => (
                              <Chip key={index} label={type} />
                            ))}
                          </dl>
                        )}
                        <p className="text-sm text-gray-500">
                          {place.editorialSummary || "No summary available"}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-4 h-full flex flex-col space-y-2">
                      <div>
                        <Link target="_blank" to={place?.googleMapsURI || "#"}>
                          <Button
                            variant="outlined"
                            className="border-gray-300 text-sm text-gray-600 rounded-sm"
                          >
                            <img
                              src="/icons/icons8-google.svg"
                              className="w-6 h-6 inline-block mr-1"
                            />
                            View on Map
                          </Button>
                        </Link>
                      </div>

                      <div className="flex-1 overflow-hidden">
                        {placePhoto ? (
                          <img
                            src={placePhoto}
                            alt={place.displayName}
                            className="w-full h-36 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-semibold text-xl rounded-md bg-gray-200">
                            No image available
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                  {index < blog.places.length - 1 && (
                    <Divider className="my-4 border-gray-300" />
                  )}
                </>
              );
            })}
          </ul>
        </div>
      )}
    </BlogCreateLayout>
  );
};

export default CreateBlogDetail;
