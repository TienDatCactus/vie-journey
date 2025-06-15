import {
  Add,
  Cloud,
  Delete,
  Edit,
  ExpandMore,
  Settings,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../../../../../services/stores/useAuthStore";
import { useTripDetailStore } from "../../../../../../../services/stores/useTripDetailStore";
import { User } from "../../../../../../../utils/interfaces";

interface ReservationNotesProps {
  state: {
    handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleClose?: () => void;
    anchorEl?: HTMLElement | null;
  };
}

interface NoteData {
  id: string;
  content: string;
  by: User;
  isEditing?: boolean;
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [localContent, setLocalContent] = useState(data.content);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setLocalContent(data.content);
  }, [data.content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContent(e.target.value);
  };

  const handleBlur = () => {
    onUpdate(data.id, localContent); // sync lên cha khi blur
    onToggleEdit(data.id); // giữ nguyên
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
                  handleClose();
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
            defaultValue={localContent}
            onChange={handleChange}
            onBlur={() => {
              handleBlur();
            }}
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
            {data.by?.fullName}
          </h2>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ReservationNotes: React.FC<ReservationNotesProps> = (props) => {
  const notes = useTripDetailStore((state) => state.notes);
  const { addNote, updateNote, toggleEditNote, deleteNote } =
    useTripDetailStore();
  const { user } = useAuthStore();
  const handleAddNote = () => {
    addNote({
      id: `note-${Date.now()}`,
      content: "",
      by: user as User,
      isEditing: true,
    });
  };

  const handleUpdateNote = (id: string, content: string) => {
    updateNote(id, content);
  };

  const handleToggleEdit = (id: string) => {
    toggleEditNote(id);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    props.state.handleClose?.();
  };

  return (
    <div>
      <Accordion
        elevation={0}
        className="bg-white py-4"
        slotProps={{ transition: { unmountOnExit: true } }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1bh-content"
          className="group"
          id="panel1bh-header"
        >
          <Badge badgeContent={notes.length} color="warning">
            <h1 className="text-3xl font-bold text-neutral-900 group-hover:underline">
              Notes
            </h1>
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ReservationNotes;
