import { ThemeProvider } from "@mui/material";
import themeDefault from "./theme/theme";
const App = (props) => {
  return (
    <ThemeProvider theme={themeDefault}>
      {props.children}
    </ThemeProvider>
  );
};

export default App;
