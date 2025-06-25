import React from "react";
import { BlogCreateLayout } from "../../../../layouts";
import { SimpleEditor } from "./../../../../../@/components/tiptap-templates/simple/simple-editor";
const CreateBlogDetail: React.FC = () => {
  return (
    <BlogCreateLayout>
      <SimpleEditor />
    </BlogCreateLayout>
  );
};

export default CreateBlogDetail;
