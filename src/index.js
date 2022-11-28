import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./web.route";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import { ThemeProvider } from "@mui/material";
import themeDefault from "./theme/theme";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={themeDefault}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
