import { Container } from "@mui/material";
import { ReactNode } from "react";
import BlogCreateHeader from "../components/Layout/Blog/BlogCreateHeader";
import BlogCreateToolbar from "../components/Layout/Blog/BlogCreateToolbar";
import { IBlog } from "../utils/interfaces/blog";

const BlogCreateLayout = ({
  children,
  blog,
  onSaveDraft,
  onPublic,
  formData,
  onFormDataChange,
  coverImageUrl,
  setCoverImageUrl,
  wordCount,
}: {
  children: ReactNode;
  blog: IBlog | null;
  onSaveDraft: () => Promise<void>;
  onPublic: () => Promise<void>;
  formData: {
    title: string;
    summary: string;
    slug: string;
    tags: string[];
    coverImage: File | null;
  };
  onFormDataChange: (field: string, value: any) => void;
  coverImageUrl: string | null;
  setCoverImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  wordCount?: number;
}) => {
  return (
    <>
      <BlogCreateHeader
        onSaveDraft={onSaveDraft}
        onPublic={onPublic}
        blog={blog}
        formData={formData}
        wordCount={wordCount}
      />
      <Container className="grid grid-cols-12 gap-4 p-4 ">
        <BlogCreateToolbar
          blog={blog}
          formData={formData}
          onFormDataChange={onFormDataChange}
          coverImageUrl={coverImageUrl}
          setCoverImageUrl={setCoverImageUrl}
        />
        <main className=" lg:col-span-9">{children}</main>
      </Container>
    </>
  );
};

export default BlogCreateLayout;
