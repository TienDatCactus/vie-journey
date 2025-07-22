import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Close,
  Delete,
  Download,
  Edit,
  FilterList,
  GridView,
  Image as ImageIcon,
  MoreHoriz,
  Search,
  Upload,
  ViewList,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../layouts";
import { ASSET_TYPE } from "../../../utils/interfaces/admin";
import useHook from "./container/hook";
import { doUploadSystemAsset } from "../../../services/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const BANNER_SUBSECTIONS = [
  { value: "hero", label: "Hero" },
  { value: "intro", label: "Intro" },
  { value: "destination", label: "Destination" },
  { value: "hotel", label: "Hotel" },
  { value: "creator", label: "Creator" },
];
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const MediaDashboard = () => {
  const {
    listImg,
    contentLength,
    avatarLength,
    bannerLength,
    handleTabChange,
    deleteAsset,
  } = useHook();

  // Modal and navigation state
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [currentData, setCurrentData] = useState(listImg || []);

  // UI state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedImageForMenu, setSelectedImageForMenu] = useState<
    string | null
  >(null);
  const [selectedSubsection, setSelectedSubsection] = useState("");
  const [pickedImage, setPickedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPickedImage(file);
  };
  const handleSubmitUpload = async () => {
    try {
      setLoading(true);
      if (!pickedImage) return;
      await doUploadSystemAsset(pickedImage, selectedSubsection);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleImageRemove = () => {
    setPickedImage(null);
  };

  // Filter data based on search
  const filteredData = currentData.filter(
    (image) =>
      image.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.publicId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = (index: number) => {
    setCurrentImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? filteredData.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === filteredData.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleTabChangeLocal = (newValue: number) => {
    setTabValue(newValue);
    setSelectedImages([]);
    setSearchQuery("");

    switch (newValue) {
      case 0:
        handleTabChange(ASSET_TYPE.AVATAR);
        break;
      case 1:
        handleTabChange(ASSET_TYPE.BANNER);
        break;
      case 2:
        handleTabChange(ASSET_TYPE.CONTENT);
        break;
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredData.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredData.map((image) => image._id));
    }
  };

  const handleBulkDelete = () => {
    selectedImages.forEach((imageId) => {
      const assetType =
        tabValue === 0
          ? ASSET_TYPE.AVATAR
          : tabValue === 1
          ? ASSET_TYPE.BANNER
          : ASSET_TYPE.CONTENT;
      deleteAsset(imageId, assetType);
    });
    setSelectedImages([]);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    imageId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedImageForMenu(imageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedImageForMenu(null);
  };

  const currentImage = filteredData[currentImageIndex];

  useEffect(() => {
    if (listImg) {
      setCurrentData(listImg);
    }
  }, [listImg]);

  if (!listImg) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <DashboardLayout>
      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 300, color: "grey.900", mb: 1 }}
          >
            Media Assets
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.600" }}>
            Manage your media files including avatars, banners, and content
            images.
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => handleTabChangeLocal(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Avatars</span>
                  <Chip
                    label={avatarLength}
                    size="small"
                    sx={{ bgcolor: "grey.200", color: "grey.700" }}
                  />
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Banners</span>
                  <Chip
                    label={bannerLength}
                    size="small"
                    sx={{ bgcolor: "grey.200", color: "grey.700" }}
                  />
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Content</span>
                  <Chip
                    label={contentLength}
                    size="small"
                    sx={{ bgcolor: "grey.200", color: "grey.700" }}
                  />
                </Stack>
              }
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Tab Content Header */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {tabValue === 0
                    ? "Avatar Images"
                    : tabValue === 1
                    ? "Banner Images"
                    : "Content Images"}
                </Typography>
                <Typography variant="body2" sx={{ color: "grey.600" }}>
                  {tabValue === 0
                    ? "Profile pictures and avatar images"
                    : tabValue === 1
                    ? "Images used for banners and promotional content"
                    : "Images used for content and articles"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={() => setUploadDialogOpen(true)}
                sx={{ bgcolor: "grey.900", "&:hover": { bgcolor: "grey.800" } }}
              >
                Upload Banner
              </Button>
            </Stack>

            {/* Controls */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{ width: 280, bgcolor: "white" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 16, color: "grey.400" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{ bgcolor: "white" }}
                >
                  Filter
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                  sx={{ bgcolor: "white" }}
                >
                  <ToggleButton value="grid">
                    <GridView sx={{ fontSize: 16 }} />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList sx={{ fontSize: 16 }} />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>

            {/* Bulk Selection Bar */}
            {selectedImages.length > 0 && (
              <Alert
                severity="info"
                sx={{ mb: 3 }}
                action={
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      sx={{ bgcolor: "white" }}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Delete />}
                      onClick={handleBulkDelete}
                      sx={{
                        bgcolor: "white",
                        color: "error.main",
                        borderColor: "error.main",
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                }
              >
                {selectedImages.length} item
                {selectedImages.length > 1 ? "s" : ""} selected
              </Alert>
            )}

            {/* Select All */}
            {filteredData.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Button
                  startIcon={<CheckCircle />}
                  onClick={handleSelectAll}
                  size="small"
                  variant="text"
                >
                  {selectedImages.length === filteredData.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </Box>
            )}

            {/* Image Grid/List */}
            <TabPanel value={tabValue} index={tabValue}>
              {viewMode === "grid" ? (
                <Grid2 container spacing={3}>
                  {filteredData.map((image, index) => (
                    <Grid2
                      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                      key={image._id}
                    >
                      <Card
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s",
                          border: selectedImages.includes(image._id)
                            ? "2px solid"
                            : "1px solid",
                          borderColor: selectedImages.includes(image._id)
                            ? "primary.main"
                            : "grey.200",
                          "&:hover": {
                            boxShadow: 3,
                            transform: "translateY(-2px)",
                          },
                        }}
                        onClick={() => toggleImageSelection(image._id)}
                      >
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            sx={{ aspectRatio: "1", objectFit: "cover" }}
                            image={image.url || "/placeholder.svg"}
                            alt={image.publicId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpen(index);
                            }}
                          />

                          {/* Selection Indicator */}
                          {selectedImages.includes(image._id) && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                width: 20,
                                height: 20,
                                bgcolor: "primary.main",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "white", fontSize: 12 }}
                              >
                                ✓
                              </Typography>
                            </Box>
                          )}

                          {/* Menu Button */}
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                            }}
                            onClick={(e) => handleMenuOpen(e, image._id)}
                          >
                            <MoreHoriz sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>

                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            noWrap
                            sx={{ fontWeight: 500, mb: 1 }}
                          >
                            {image.userId || "Untitled"}
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "grey.500" }}
                            >
                              {image.file_size}
                            </Typography>
                            <Chip
                              label="PNG"
                              size="small"
                              sx={{ bgcolor: "grey.100", color: "grey.600" }}
                            />
                          </Stack>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "grey.400",
                              mt: 0.5,
                              display: "block",
                            }}
                          >
                            {image.dimensions || "Unknown dimensions"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid2>
                  ))}
                </Grid2>
              ) : (
                // List View
                <Stack spacing={1}>
                  {filteredData.map((image, index) => (
                    <Paper
                      key={image._id}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        border: selectedImages.includes(image._id)
                          ? "1px solid"
                          : "none",
                        borderColor: "primary.main",
                        "&:hover": { bgcolor: "grey.50" },
                      }}
                      onClick={() => toggleImageSelection(image._id)}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Checkbox
                          checked={selectedImages.includes(image._id)}
                          onChange={() => toggleImageSelection(image._id)}
                        />
                        <Box
                          component="img"
                          src={image.url || "/placeholder.svg"}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            objectFit: "cover",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(index);
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500 }}
                          >
                            {image.userId || "Untitled"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "grey.500" }}
                          >
                            {image.file_size} • {image.dimensions}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, image._id)}
                        >
                          <MoreHoriz />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </TabPanel>
          </Box>
        </Paper>

        {/* Image Viewer Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              outline: "none",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
              }}
            >
              <Close />
            </IconButton>

            <IconButton
              onClick={() => handleNavigate("prev")}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={() => handleNavigate("next")}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
              }}
            >
              <ChevronRight />
            </IconButton>

            <motion.img
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3 }}
              key={currentImage?.publicId}
              src={currentImage?.url || "/placeholder.svg"}
              alt={currentImage?.publicId}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </Box>
        </Modal>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Download sx={{ mr: 1, fontSize: 16 }} />
            Download
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Edit sx={{ mr: 1, fontSize: 16 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedImageForMenu) {
                const assetType =
                  tabValue === 0
                    ? ASSET_TYPE.AVATAR
                    : tabValue === 1
                    ? ASSET_TYPE.BANNER
                    : ASSET_TYPE.CONTENT;
                deleteAsset(selectedImageForMenu, assetType);
              }
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            <Delete sx={{ mr: 1, fontSize: 16 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Upload Dialog */}
        <Dialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <div>
              <h1>Upload Banner Images </h1>
              <Typography variant="body2" className="text-sm text-neutral-800">
                Drag and drop your images here or click the button below to
                browse files.
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Supported formats: JPG, PNG, GIF
              </Alert>
            </div>
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth size="small" className="my-4">
              <InputLabel id="banner-subsection-label">
                Banner Subsection
              </InputLabel>
              <Select
                labelId="banner-subsection-label"
                value={selectedSubsection}
                label="Banner Subsection"
                MenuProps={{
                  disablePortal: true,
                }}
                onChange={(e) => setSelectedSubsection(e.target.value)}
              >
                {BANNER_SUBSECTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {!selectedSubsection && (
                <FormHelperText error>
                  Please select a banner subsection
                </FormHelperText>
              )}
            </FormControl>
            <Paper
              sx={{
                border: "2px dashed",
                borderColor: "grey.300",
                borderRadius: 2,
                p: 6,
                textAlign: "center",
                bgcolor: "grey.50",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("upload-input")?.click()}
            >
              <ImageIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
              <Typography variant="body1" sx={{ color: "grey.600", mb: 1 }}>
                Drag and drop your images here
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.500", mb: 3 }}>
                or click to browse files
              </Typography>
              <Button variant="outlined">Choose Files</Button>
              <input
                id="upload-input"
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
            </Paper>

            {/* Preview section */}
            {pickedImage && (
              <>
                <Typography variant="h6" sx={{ mt: 4 }}>
                  Preview
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{ position: "relative", p: 1, textAlign: "center" }}
                >
                  <img
                    src={URL.createObjectURL(pickedImage as any)}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: 300,
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleImageRemove()}
                    sx={{ position: "absolute", top: 4, right: 4 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <Typography noWrap variant="caption">
                    {/* {file?.name} */}
                  </Typography>
                </Paper>
              </>
            )}
            <legend className="text-sm italic text-neutral-600 mt-2">
              *Other content types (AVATAR, CONTENT) are not currently
              supported.
            </legend>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button
              disabled={!pickedImage}
              loading={loading}
              onClick={handleSubmitUpload}
              variant="contained"
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default MediaDashboard;
