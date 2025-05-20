import LuggageIcon from "@mui/icons-material/Luggage";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import {
  AppBar,
  Button,
  Container,
  Slide,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import React from "react";
interface Props {
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}
const HotelHeader: React.FC = () => {
  return (
    <HideOnScroll>
      <AppBar color="transparent" className="shadow-none">
        <Container>
          <Toolbar className="*:flex *:items-center justify-between flex items-center *:text-[#e5e5e5]">
            <div className="gap-2">
              <LuggageIcon className="text-[1.875rem] " />
              <h1>
                VieJourney's <span className="">Hotel</span>
              </h1>
            </div>
            <ul className="gap-8 *:text-sm *:hover:underline *:cursor-pointer ">
              <li>Home</li>
              <li>Rooms</li>
              <li>Facilities</li>
              <li>Offers</li>
              <li>About</li>
              <li>Blog</li>
            </ul>
            <div>
              <Button
                className="border-[#e8e8e8] text-[#ffffff] bg-transparent"
                variant="outlined"
                endIcon={<UndoOutlinedIcon />}
              >
                Back to Main
              </Button>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default HotelHeader;
