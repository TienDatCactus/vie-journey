import { CssBaseline, ScopedCssBaseline } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { LicenseInfo } from "@mui/x-license";
import { APIProvider } from "@vis.gl/react-google-maps";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import TypebotChat from "./components/TypeBotChat";
import "./index.css";
import { SocketProvider } from "./services/context/socketContext";
import Fallback from "./utils/handlers/loading/Fallback";
import router from "./utils/router/routes";
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_PRO_KEY);

dayjs.extend(advancedFormat);

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: `"Mona Sans", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
  },
});

root.render(
  <StyledEngineProvider injectFirst>
    <ScopedCssBaseline>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          {/* <ScrollProvider> */}
          <React.Suspense fallback={<Fallback />}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <APIProvider
                apiKey={apiKey}
                language="en"
                libraries={["places", "marker", "geometry"]}
              >
                <SocketProvider>
                  <HelmetProvider>
                    <RouterProvider router={router} />
                  </HelmetProvider>
                </SocketProvider>
              </APIProvider>
              <TypebotChat />
            </LocalizationProvider>
            <TypebotChat />
          </React.Suspense>
          {/* </ScrollProvider> */}
        </SnackbarProvider>
      </ThemeProvider>
    </ScopedCssBaseline>
  </StyledEngineProvider>
);
