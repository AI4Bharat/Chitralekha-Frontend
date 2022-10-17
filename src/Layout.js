import { ThemeProvider } from "@mui/material";
import Header from "./common/Header";
import GlobalStyles from "./styles/LayoutStyles";
import themeDefault from "./theme/theme";
import BackButton from "./common/BackButton";
import { translate } from "./config/localisation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const App = (props) => {
  const {component, Backbutton, backPressNavigationPath } = props;
  const classes = GlobalStyles();

  return (
    <ThemeProvider theme={themeDefault}>
      <div className={classes.root}>
        <Header />
        <div className={classes.container}>
          {Backbutton && (
            <BackButton
              startIcon={<ArrowBackIcon />}
              sx={{ color: "white", mb: 2 }}
              backPressNavigationPath={
                backPressNavigationPath ? backPressNavigationPath : ""
              }
              label={"Back To Previous Page"}
            />
          )}
          {component}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
