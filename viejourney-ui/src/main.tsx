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
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import AuthProvider from "./services/contexts/AuthContext";
import { PlaceSearchProvider } from "./services/contexts/PlaceSearchContext";
import Fallback from "./utils/handlers/loading/Fallback";
import router from "./utils/router/routes";
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_PRO_KEY);

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: `"Mona Sans", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
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
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ScopedCssBaseline>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            {/* <ScrollProvider> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <React.Suspense fallback={<Fallback />}>
                <AuthProvider>
                  <APIProvider
                    apiKey={apiKey}
                    language="en"
                    libraries={["places", "marker", "geometry"]}
                  >
                    <PlaceSearchProvider>
                      <RouterProvider router={router} />
                    </PlaceSearchProvider>
                  </APIProvider>
                </AuthProvider>
              </React.Suspense>
            </LocalizationProvider>
            {/* </ScrollProvider> */}
          </SnackbarProvider>
        </ThemeProvider>
      </ScopedCssBaseline>
    </StyledEngineProvider>
  </React.StrictMode>
);
