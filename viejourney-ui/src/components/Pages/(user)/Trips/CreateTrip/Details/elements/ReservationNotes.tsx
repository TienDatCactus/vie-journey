import {
  Add,
  Cloud,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../../../../../../services/context/socketContext";
import { NoteData } from "../../../../../../../services/stores/storeInterfaces";
import { useTripDetailStore } from "../../../../../../../services/stores/useTripDetailStore";

interface ReservationNotesProps {
  state: {
    handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleClose?: () => void;
    anchorEl?: HTMLElement | null;
  };
}

interface NotesCardProps {
  index?: number;
  data: NoteData;
  onUpdate: (id: string, content: string) => void;
  onToggleEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotesCard: React.FC<NotesCardProps> = ({
  data,
  index,
  onUpdate,
  onToggleEdit,
  onDelete,
}) => {
  const { socket } = useSocket();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [localContent, setLocalContent] = useState(data.content);
  const open = Boolean(anchorEl);
  useEffect(() => {
    setLocalContent(data.content);
  }, [data.content]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContent(e.target.value);
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      socket?.emit("planItemUpdated", {
        section: "notes",
        item: {
          id: data.id,
          text: localContent,
        },
      });
      onToggleEdit(data.id);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      elevation={0}
      className="w-full flex rounded-xl bg-amber-50 border border-amber-200 flex-col p-2 px-4"
    >
      <CardContent className="p-0 lg:py-1  flex flex-col justify-between">
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <h1 className="text-lg font-semibold text-dark-900">Note #{index}</h1>
          <IconButton
            className="p-1"
            id={`note-menu-${data.id}`}
            aria-controls={open ? `note-menu-${data.id}` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Settings />
          </IconButton>
          <Menu
            id={`note-menu-${data.id}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": `note-menu-${data.id}`,
              },
            }}
          >
            <MenuList>
              <MenuItem
                onClick={() => {
                  onDelete(data.id);
                }}
              >
                <ListItemIcon>
                  <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  ⌘X
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  onToggleEdit(data.id);
                }}
              >
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>{data.isEditing ? "Save" : "Edit"}</ListItemText>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  ⌘C
                </Typography>
              </MenuItem>

              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Web Clipboard</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>

        {data.isEditing ? (
          <TextField
            className="border-none py-2"
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
            defaultValue={localContent}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            multiline
            rows={2}
          />
        ) : (
          <p
            onDoubleClick={() => onToggleEdit(data.id)}
            className="text-base pt-2 pb-4 text-neutral-600 font-medium text-ellipsis line-clamp-2"
          >
            {data.content || (
              <i>
                This is a note about the trip. It can contain any information
                you want to remember.
              </i>
            )}
          </p>
        )}

        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <span>by:</span>
          <Avatar className="lg:w-6 lg:h-6" />
          <h2 className="text-sm text-neutral-800 font-medium">
            {data.by?.fullName || data.by?.email}
          </h2>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ReservationNotes: React.FC<ReservationNotesProps> = (props) => {
  const notes = useTripDetailStore((state) => state.notes);
  const [expanded, setExpanded] = useState(false);

  const { updateNote, toggleEditNote } = useTripDetailStore();
  const { socket } = useSocket();
  const handleAddNote = () => {
    socket?.emit("planItemAdded", {
      section: "notes",
      item: {
        text: "",
      },
    });
  };

  const handleUpdateNote = (id: string, content: string) => {
    updateNote(id, content);
  };

  const handleToggleEdit = (id: string) => {
    toggleEditNote(id);
  };

  const handleDeleteNote = (id: string) => {
    socket?.emit("planItemDeleted", {
      section: "notes",
      itemId: id,
    });
    props.state.handleClose?.();
  };

  return (
    <div className="bg-white py-4 rounded" id="notes">
      <div
        className="flex items-center justify-between cursor-pointer p-4"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Badge badgeContent={notes.length} color="warning">
          <h1 className="text-3xl font-bold text-neutral-900 hover:underline">
            Notes
          </h1>
        </Badge>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-4 pt-4"
          >
            <div className="grid gap-4">
              {notes.map((note, index) => (
                <NotesCard
                  key={note.id}
                  data={note}
                  index={index + 1}
                  onUpdate={handleUpdateNote}
                  onToggleEdit={handleToggleEdit}
                  onDelete={handleDeleteNote}
                />
              ))}
              <p className="text-sm text-neutral-600 font-medium flex flex-col">
                <i>*Double click on a note to edit it.</i>
                <i>
                  *Press{" "}
                  <span className="font-semibold bg-neutral-200 font-mono px-1 rounded">
                    Enter
                  </span>{" "}
                  on a note to edit it.
                </i>
              </p>
              <Divider textAlign="left">
                <Button
                  endIcon={<Add />}
                  className="text-dark-900"
                  onClick={handleAddNote}
                >
                  Add more Notes
                </Button>
              </Divider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationNotes;
