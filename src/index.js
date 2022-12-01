import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./web.route";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import themeDefault from "./theme/theme";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={themeDefault}>
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <App />
          </LocalizationProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
