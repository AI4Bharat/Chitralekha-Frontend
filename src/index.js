import React from "react";
import "./index.css";
import App from "./web.route";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import themeDefault from "./theme/theme";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={themeDefault}>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <App />
        </LocalizationProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  </Provider>
);
