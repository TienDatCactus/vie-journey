import React, { useEffect, useState } from "react";
import { BlogCreateLayout } from "../../../../layouts";
import { SimpleEditor } from "./../../../../../@/components/tiptap-templates/simple/simple-editor";
import { useParams } from "react-router-dom";
import useBlogUser from "../../../../utils/hooks/user-blog-user";
import { IContentItem } from "../../../../utils/interfaces/blog";
import { enqueueSnackbar } from "notistack";

const CreateBlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { handleGetBlogDetail, handleEditBlog, handlePublish } = useBlogUser();
  const [blog, setBlog] = useState<IContentItem>();
  const [editorContent, setEditorContent] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    slug: "",
    tags: [] as string[],
    coverImage: null as File | null,
  });

  useEffect(() => {
    const fetchBlogDetail = async () => {
      const res = await handleGetBlogDetail(id ?? "");
      if (res) {
        setBlog(res);
        setEditorContent(res.content || "");
        setFormData({
          title: res.title || "",
          summary: res.summary || "",
          slug: res.slug || "",
          tags: res.tags || [],
          coverImage: null,
        });
        setCoverImageUrl(res.coverImage || null);
      }
    };
    fetchBlogDetail();
  }, [id]);

  const handleContentChange = (html: string) => {
    setEditorContent(html);
  };

  const handleFormDataChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveDraft = async () => {
    const data = {
      title: formData.title,
      content: editorContent,
      summary: formData.summary,
      slug: formData.slug,
      tags: formData.tags,
      coverImage: formData.coverImage,
    };

    console.log("Saving draft with data:", data.coverImage);

    const res = await handleEditBlog(id ?? "", data);
    if (res) {
      enqueueSnackbar("Edit blog successful", { variant: "success" });
    } else {
      enqueueSnackbar("Edit blog error", { variant: "error" });
    }
  };

  const handlePublicBlog = async () => {
    const res = await handlePublish(id ?? "");
    if (res)
      enqueueSnackbar(res.message || "Publish successful", {
        variant: "success",
      });
  };

  if (!blog) return null;

  return (
    <BlogCreateLayout
      blog={blog}
      onSaveDraft={handleSaveDraft}
      formData={formData}
      onPublic={handlePublicBlog}
      onFormDataChange={handleFormDataChange}
      coverImageUrl={coverImageUrl}
      setCoverImageUrl={setCoverImageUrl}
    >
      <SimpleEditor content={editorContent} onContentChange={handleContentChange} />
    </BlogCreateLayout>
  );
};

export default CreateBlogDetail;
