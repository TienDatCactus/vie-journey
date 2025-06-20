import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ReactNode, useCallback, useState } from "react";
import { useBlocker } from "react-router-dom";
import BlogCreateHeader from "../components/Layout/Blog/BlogCreateHeader";
import BlogCreateToolbar from "../components/Layout/Blog/BlogCreateToolbar";

const BlogCreateLayout = ({ children }: { children: ReactNode }) => {
  const [isDirty, setIsDirty] = useState(true);
  const [open, setOpen] = useState(true);
  let blocker = useBlocker(useCallback(() => isDirty, [isDirty]));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleProceed = () => {
    setOpen(false);
    setIsDirty(false);
    blocker?.proceed();
  };

  return (
    <>
      {blocker?.state === "blocked" && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Unsaved Changes"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have unsaved changes. Are you sure you want to leave this
              page? If you leave, your changes will be lost.
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
      <BlogCreateHeader />
      <Container className="grid grid-cols-12 gap-4 p-4 ">
        <BlogCreateToolbar />
        <main className="h-screen lg:col-span-9">{children}</main>
      </Container>
    </>
  );
};

export default BlogCreateLayout;
