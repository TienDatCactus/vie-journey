// src/pages/(manager)/Blog/component/BlogActionsMenu.tsx
import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Flag,
} from "@mui/icons-material";

interface BlogActionsMenuProps {
  blogId: string;
  status: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const BlogActionsMenu: React.FC<BlogActionsMenuProps> = ({
  blogId,
  status,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          "&:hover": {
            backgroundColor: "grey.100",
          },
        }}
      >
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleAction(() => onView(blogId))}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleAction(() => onEdit(blogId))}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        {status !== "APPROVED" && (
          <MenuItem
            onClick={() =>
              handleAction(() => onStatusChange(blogId, "APPROVED"))
            }
          >
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Approve</ListItemText>
          </MenuItem>
        )}

        {status !== "REJECTED" && (
          <MenuItem
            onClick={() =>
              handleAction(() => onStatusChange(blogId, "REJECTED"))
            }
          >
            <ListItemIcon>
              <Cancel fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Reject</ListItemText>
          </MenuItem>
        )}

        <MenuItem
          onClick={() => handleAction(() => onStatusChange(blogId, "FLAGGED"))}
        >
          <ListItemIcon>
            <Flag fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Flag</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(() => onDelete(blogId))}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default BlogActionsMenu;
