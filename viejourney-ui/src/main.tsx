import { CssBaseline, ScopedCssBaseline } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "maplibre-gl/dist/maplibre-gl.css";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./services/contexts";
import Fallback from "./utils/handlers/loading/Fallback";
import router from "./utils/router/routes";
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

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
                  <RouterProvider router={router} />
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
