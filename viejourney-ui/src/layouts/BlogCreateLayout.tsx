import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@mui/material";
import { ReactNode, useCallback, useRef, useState } from "react";
import { useBlocker } from "react-router-dom";
import BlogCreateHeader from "../components/Layout/Blog/BlogCreateHeader";
import BlogCreateToolbar from "../components/Layout/Blog/BlogCreateToolbar";
import { IContentItem } from "../utils/interfaces/blog";

const BlogCreateLayout = ({ 
  children, 
  blog, 
  onSaveDraft,
  onPublic,
  formData,
  onFormDataChange 
}: { 
  children: ReactNode;
  blog: IContentItem;
  onSaveDraft: () => void;
  onPublic: () => void;
  formData: {
    title: string;
    summary: string;
    slug: string;
    tags: string[];
  };
  onFormDataChange: (field: string, value: any) => void;
}) => {
  const [isDirty, setIsDirty] = useState(true);
  const [open, setOpen] = useState(true);
  const [hasProceeded, setHasProceeded] = useState(false);
  const blockerRef = useRef<ReturnType<typeof useBlocker> | null>(null);

  blockerRef.current = useBlocker(useCallback(() => isDirty, [isDirty]));

  const handleClose = () => {
    setOpen(false);
  };

  const handleProceed = () => {
    if (hasProceeded) return;
    setHasProceeded(true);
    setOpen(false);
    setIsDirty(false);
    blockerRef.current?.proceed();
  };

  return (
    <>
      {blockerRef.current?.state === "blocked" && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Unsaved Changes"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have unsaved changes. Are you sure you want to leave this page? If you leave, your changes will be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Stay</Button>
            <Button onClick={handleProceed} autoFocus>
              I understand
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <BlogCreateHeader onSaveDraft={onSaveDraft} onPublic={onPublic} />
      <Container className="grid grid-cols-12 gap-4 p-4 ">
        <BlogCreateToolbar 
          blog={blog} 
          formData={formData} 
          onFormDataChange={onFormDataChange} 
        />
        <main className="h-screen lg:col-span-9">{children}</main>
      </Container>
    </>
  );
};

export default BlogCreateLayout;
