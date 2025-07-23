import {
  Clear,
  Close,
  CloudUpload,
  Edit,
  ExpandMore,
  Explore,
  Save,
  Upload,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  Stack,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import * as React from "react";

import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useAssetsStore } from "../../../../../../services/stores/useAssets";
import { useTripDetailStore } from "../../../../../../services/stores/useTripDetailStore";
import { useBlogStore } from "../../../../../../services/stores/useBlogStore";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 0, pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Header: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState<File | null>(null);
  const { doAddUserAsset, userAssets } = useAssetsStore();
  const trip = useTripDetailStore((state) => state.trip);
  const { handleUpdateTripCover } = useTripDetailStore();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { relatedBlogs } = useBlogStore();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadAsset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
    }
  };
  const handleSaveAsset = async () => {
    try {
      setLoading(true);
      if (image) {
        await doAddUserAsset(image);
        setImage(null);
        handleClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAccept = async (
    date: [dayjs.Dayjs | null, dayjs.Dayjs | null]
  ) => {
    try {
      setLoading(true);
      const startDate = dayjs(date[0]).toISOString();
      const endDate = dayjs(date[1]).toISOString();
      if (startDate && endDate) {
        await useTripDetailStore
          .getState()
          .handleUpdateTripDates(startDate, endDate);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectImage = async (assetId: string) => {
    try {
      setLoading(true);
      await handleUpdateTripCover(assetId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section>
      <div className="z-10 relative w-full h-70">
        <div>
          <img
            src={
              trip?.coverImage?.url ||
              "/images/placeholders/main-placeholder.jpg"
            }
            onError={(e) => {
              e.currentTarget.src = "/images/placeholders/main-placeholder.jpg";
            }}
            alt=""
            className="w-full h-70 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-neutral-900 to-transparent"></div>
        </div>
        <IconButton
          onClick={handleClickOpen}
          className="absolute hover:animate-spin top-4 right-4 group bg-neutral-200 "
        >
          <Edit className="text-neutral-900" />
        </IconButton>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-40 w-120 rounded-2xl shadow-md bg-white *:text-neutral-800 p-4 flex flex-col justify-between itemce">
          <div className="hover:bg-neutral-300 w-fit p-2 rounded-md transition-all duration-200">
            <h1 className="text-4xl font-bold">{trip?.title}</h1>
          </div>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <div>
              <DateRangePicker
                loading={loading}
                onAccept={handleAccept}
                slotProps={{
                  textField: {
                    variant: "standard",
                    InputProps: {
                      disableUnderline: true, // Remove the underline for standard variant
                      sx: {
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        padding: "8px",
                        backgroundColor: "transparent",
                        "& .MuiInputBase-input": {
                          padding: "4px 8px",
                        },
                        boxShadow: "none",
                        border: "none",

                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      },
                    },
                  },
                }}
                defaultValue={
                  trip?.startDate && trip?.endDate
                    ? [dayjs(trip.startDate), dayjs(trip.endDate)]
                    : [null, null]
                }
              />
            </div>
            <AvatarGroup
              sx={{
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  fontSize: "0.875rem",
                },
              }}
              max={trip?.tripmates?.length || 1}
            >
              {trip?.tripmates?.map((mate: string, index: number) => (
                <Avatar
                  key={index}
                  alt={mate}
                  content={mate}
                  src={"/static/images/avatar/1.jpg"}
                />
              ))}
            </AvatarGroup>
          </Stack>
        </div>
      </div>
      <div className="lg:py-10 lg:px-10">
        <Accordion
          elevation={0}
          className="bg-neutral-100"
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            className="group"
            id="panel1bh-header"
          >
            <h1 className="text-3xl font-bold text-neutral-900 group-hover:underline">
              Explore
            </h1>
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid *:bg-neutral-100 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {!!relatedBlogs &&
                relatedBlogs?.length > 0 &&
                relatedBlogs.map((item, index) => (
                  <Card
                    elevation={0}
                    className="max-w-[240px] flex flex-col"
                    key={index}
                  >
                    <CardMedia
                      component="img"
                      className="w-full  object-cover"
                      image={
                        item?.coverImage ||
                        "/images/placeholders/main-placeholder.jpg"
                      }
                      alt={item?.title}
                    />
                    <CardContent className="p-0 lg:py-1">
                      <h1 className="text-lg font-semibold text-dark-900">
                        {item?.title}
                      </h1>
                      <p className="text-sm text-neutral-600 font-medium text-ellipsis line-clamp-2">
                        {item?.summary}
                      </p>
                    </CardContent>
                    <CardActions className="flex items-center gap-1 p-0 py-2">
                      <Avatar
                        className="lg:w-8 lg:h-8"
                        src={item?.author?.name}
                      />
                      <h2 className="text-sm text-neutral-800 font-medium">
                        {item?.author?.name}
                      </h2>
                    </CardActions>
                  </Card>
                ))}
              {relatedBlogs?.length === 0 && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-center p-4">
                  <p className="text-neutral-600 text-lg">
                    No related blogs found.
                  </p>
                </div>
              )}
            </div>
            {relatedBlogs?.length > 0 && (
              <div className="flex justify-end py-2">
                <Button
                  variant="contained"
                  className="bg-dark-800"
                  color="primary"
                  endIcon={<Explore />}
                >
                  Explore More
                </Button>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </div>
      <Dialog
        slotProps={{
          transition: { unmountOnExit: true },
          paper: {
            className: "bg-white  shadow-lg min-w-200",
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack>
            <h1 className="text-2xl">Change cover image</h1>
            <IconButton
              className="absolute top-2 right-2"
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Your Photos" {...a11yProps(0)} />
              <Tab label="Select Photos" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="flex flex-col items-center justify-center gap-4 p-4">
              {image ? (
                <div className="flex relative flex-col items-center border border-dashed border-gray-500 p-4 rounded-lg ">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="uploaded"
                    className="lg:w-80 h-auto mx-auto"
                  />
                  <IconButton
                    onClick={() => setImage(null)}
                    className="absolute -top-5 -right-5"
                    color="error"
                  >
                    <Clear className="text-3xl" />
                  </IconButton>
                </div>
              ) : (
                <>
                  <img
                    src="/images/svg/undraw_upload-image_tpmp.svg"
                    alt="upload image"
                    className="lg:w-80 h-auto mx-auto"
                  />
                  <h1 className="text-3xl font-semibold">Upload your photos</h1>
                  <p className="text-base text-neutral-600">
                    You haven't uploaded any photos
                  </p>
                </>
              )}

              <div
                className={`flex ${
                  image ? "gap-2" : "flex-col gap-4"
                } *:rounded-sm`}
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  loading={loading}
                  tabIndex={-1}
                  startIcon={<CloudUpload />}
                >
                  Upload files
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleUploadAsset}
                    accept="image/*"
                    multiple
                  />
                </Button>
                {image && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveAsset}
                    loading={loading}
                    startIcon={<Save />}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {!!userAssets && userAssets?.length > 0 ? (
              <Stack
                className="grid lg:grid-cols-3"
                flexWrap="wrap"
                gap={1}
                justifyContent="center"
              >
                {userAssets.map((asset, index) => {
                  const isSelected = selectedId == asset?._id;
                  return (
                    <Box
                      key={asset._id}
                      component="label"
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: isSelected
                          ? "3px solid #1976d2"
                          : "border border-dashed border-gray-300",
                        transition: "border 0.2s",
                      }}
                      onClick={() => setSelectedId(asset?._id || null)}
                    >
                      <Radio
                        checked={isSelected}
                        onChange={() => setSelectedId(asset?._id || null)}
                        value={asset?._id}
                        sx={{ display: "none" }} // ẩn radio
                      />
                      <Box
                        component="img"
                        src={asset.url}
                        alt={`placeholder-${index}`}
                        className="w-full h-60 object-cover cursor-pointer hover:opacity-80 transition-opacity duration-200  rounded-lg "
                        sx={{
                          width: 150,
                          height: 100,
                          objectFit: "cover",
                          filter: isSelected ? "brightness(0.85)" : "none",
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            ) : (
              <Stack className="flex flex-col items-center justify-center gap-4 p-4">
                <IconButton className="bg-neutral-200 hover:bg-neutral-300 transition-colors duration-200 p-4 h-fit w-fit">
                  <Upload />
                </IconButton>
                <h1 className="text-3xl font-semibold">No photos available</h1>
                <p className="text-base text-neutral-600">
                  You haven't uploaded any photos
                </p>
              </Stack>
            )}
            {selectedId && (
              <div className="*:rounded-sm flex items-center justify-end gap-2 p-2">
                <Button
                  color="error"
                  variant="outlined"
                  loading={loading}
                  startIcon={<Clear />}
                  onClick={() => setSelectedId(null)}
                >
                  Remove
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  loading={loading}
                  onClick={() => handleSelectImage(selectedId)}
                  startIcon={<Save />}
                >
                  Set as Cover Image
                </Button>
              </div>
            )}
          </CustomTabPanel>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Header;
