import AddIcon from "@mui/icons-material/Add";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import ReduceCapacityIcon from "@mui/icons-material/ReduceCapacity";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import { Clear, Place as PlaceIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { usePlaceSearch } from "../../../../services/contexts/PlaceSearchContext";

const HomeFastSearch: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [adults, setAdults] = useState(1);
  const [childrens, setChildrens] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Use the global place search context
  const {
    searchInput,
    options,
    isLoading,
    open,
    setOpen,
    selectedOption,
    handlePlaceSelect, // This now handles map panning automatically
    handleInputChange,
    resetSearch,
  } = usePlaceSearch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "simple-popover" : undefined;

  const handleSearch = () => {
    // Add search functionality here
    console.log("Searching for", {
      place: selectedOption?.primaryText || searchInput,
      adults,
      childrens,
      rooms,
    });
  };

  return (
    <div className="w-full max-w-[1200px] py-10">
      <h1 className="my-0 text-[1.875rem] font-bold">
        Find your loving places
      </h1>
      <Stack
        direction={"row"}
        alignItems={"center"}
        className="mt-10"
        spacing={2}
      >
        <Autocomplete
          id="google-map-search"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          options={options}
          loading={isLoading}
          getOptionLabel={(option) => option.primaryText}
          isOptionEqualToValue={(option, value) =>
            option.placeId === value.placeId
          }
          noOptionsText={searchInput ? "No places found" : "Type to search"}
          filterOptions={(x) => x}
          onChange={(_event, value) => handlePlaceSelect(value)}
          onInputChange={handleInputChange}
          inputValue={searchInput}
          value={selectedOption}
          clearOnBlur={false}
          popupIcon={null}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search destinations"
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                className: "p-2",
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-2xl" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <React.Fragment>
                    {isLoading && (
                      <CircularProgress color="primary" size={20} />
                    )}
                    {searchInput && (
                      <IconButton size="small" onClick={() => resetSearch()}>
                        <Clear />
                      </IconButton>
                    )}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  py: 0.5,
                }}
              >
                <PlaceIcon
                  color="primary"
                  fontSize="small"
                  sx={{ mr: 1.5, ml: 0.5, minWidth: 24 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" component="span">
                    {option.primaryText}
                  </Typography>
                  {option.secondaryText && (
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      {option.secondaryText}
                    </Typography>
                  )}
                </Box>
              </Box>
            </li>
          )}
        />

        <Grid2 container direction={"row"} alignItems={"center"} spacing={2}>
          <Grid2 size={6}>
            <DatePicker label="from" />
          </Grid2>
          <Grid2 size={6}>
            <DatePicker label="to" />
          </Grid2>
        </Grid2>

        <div>
          <Button
            aria-describedby={popoverId}
            variant="outlined"
            onClick={handleClick}
            className="text-[black] border-[#b2b2b2]"
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              className="my-2"
            >
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <ReduceCapacityIcon />
                <span>:</span>
                <p className="my-0">{adults + childrens}</p>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <HotelIcon />
                <span>:</span>
                <p className="my-0">{rooms}</p>
              </Stack>
            </Stack>
          </Button>
          <Popover
            id={popoverId}
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack direction={"column"} spacing={2} className="p-4">
              <InputLabel
                component={"h1"}
                className="my-0 text-black text-[18px]"
              >
                Rooms and guests
              </InputLabel>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                justifyContent={"space-between"}
              >
                <HotelIcon />
                <p className="my-0 text-sm">Rooms</p>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <IconButton
                    className="bg-neutral-100"
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    disabled={rooms <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{rooms}</Typography>
                  <IconButton
                    className="bg-neutral-100"
                    onClick={() => setRooms(rooms + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                justifyContent={"space-between"}
              >
                <PersonIcon />
                <p className="my-0 text-sm">Adults</p>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <IconButton
                    className="bg-neutral-100"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{adults}</Typography>
                  <IconButton
                    className="bg-neutral-100"
                    onClick={() => setAdults(adults + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                justifyContent={"space-between"}
              >
                <ChildCareIcon />
                <p className="my-0 text-sm">Childrens</p>
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <IconButton
                    className="bg-neutral-100"
                    onClick={() => setChildrens(Math.max(0, childrens - 1))}
                    disabled={childrens <= 0}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{childrens}</Typography>
                  <IconButton
                    className="bg-neutral-100"
                    onClick={() => setChildrens(childrens + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
          </Popover>
        </div>

        <IconButton
          className="border border-[#ccc] p-2 shadow-none"
          onClick={handleSearch}
        >
          <SearchIcon fontSize="medium" className="text-[#000]" />
        </IconButton>
      </Stack>
    </div>
  );
};

export default HomeFastSearch;
