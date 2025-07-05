import SearchIcon from "@mui/icons-material/Search";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import {
  Button,
  ButtonGroup,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
const headerNav: Array<{ name: string; link: string }> = [
  {
    name: "Home",
    link: "/home",
  },
  {
    name: "Travel guides",
    link: "/guides",
  },
  {
    name: "Hotels",
    link: "/hotels",
  },

  {
    name: "Profile",
    link: "/profile",
  },
];
const Header = () => {
  const headerCheck = () => {
    return window.scrollY === 0;
  };
  const [isScrolled, setIsScrolled] = React.useState(headerCheck());

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(headerCheck());
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed w-full rounded-md min-h-[50px] px-10 flex justify-between items-center transition-all duration-75 shadow-md z-10 ${
        !isScrolled ? "bg-white" : ""
      }`}
    >
      <Stack className="h-full" direction={"row"} alignItems={"center"} gap={1}>
        <TravelExploreIcon
          className={`text-[40px] ${isScrolled ? "text-white" : ""}`}
        />
        <h1 className={`text-[20px] ${isScrolled ? "text-white" : ""}`}>
          VieJourney
        </h1>
        {!isScrolled ? (
          <Stack direction={"row"} gap={2} className="h-full mx-4 ">
            {!!headerNav.length &&
              headerNav?.map((nav, index) => (
                <div className="h-full transition-all duration-200 ease-in-out hover:scale-125">
                  <a
                    key={index}
                    className="no-underline text-[12px] text-[#5b5b5b] font-medium"
                    href={nav.link}
                  >
                    {nav.name}
                  </a>
                </div>
              ))}
          </Stack>
        ) : (
          ""
        )}
      </Stack>
      <Stack direction={"row"} gap={2} alignItems={"center"}>
        {!isScrolled ? (
          <TextField
            size="small"
            className="*:text-[12px] bg-[#f3f4f5] border-0 rounded-md"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none", // Removes the border
                },
              },
            }}
            variant="outlined"
            placeholder="Enter place or user"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-[20px]" />
                  </InputAdornment>
                ),
              },
            }}
          />
        ) : (
          ""
        )}
        <ButtonGroup variant="contained" aria-label="Disabled button group">
          <Button
            size="small"
            className="bg-white "
            variant="outlined"
            href="/auth/login"
          >
            Login
          </Button>
          <Button size="small" href="/auth/register">
            SignUp
          </Button>
        </ButtonGroup>
      </Stack>
    </div>
  );
};

export default Header;
