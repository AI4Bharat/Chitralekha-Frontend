import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./web.route";
import {Provider} from 'react-redux'
import store from "./redux/store/store";
import { ThemeProvider } from '@mui/material';
import themeDefault from "./theme/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={themeDefault}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
