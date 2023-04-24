import { ThemeProvider } from "@mui/material";
import Header from "./common/Header";
import GlobalStyles from "./styles/layoutStyles";
import themeDefault from "./theme/theme";
import BackButton from "./common/BackButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Joyride, { STATUS } from "react-joyride";
import { steps } from "./utils/utils";
import { TutorialTooltip } from "./common/TutorialPlayer";

const App = (props) => {
  const { component, Backbutton, backPressNavigationPath, isDrawer } = props;
  const classes = GlobalStyles();

  return (
    <ThemeProvider theme={themeDefault}>
      <div className={classes.root}>
        <Header />
        {localStorage.getItem("tutorialDone") ? (
          <></>
        ) : (
          <Joyride
            continuous={true}
            steps={steps}
            showProgress={true}
            showSkipButton={true}
            tooltipComponent={TutorialTooltip}
            callback={({ status }) => {
              if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                localStorage.setItem("tutorialDone", true);
              }
            }}
          />
        )}
        <div
          className={`${classes.container} main`}
          style={isDrawer ? { margin: 0, maxWidth: "100%", height: "100%" } : {}}
        >
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
