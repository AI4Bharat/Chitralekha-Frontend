import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Joyride, { STATUS } from "react-joyride";
import { steps } from "utils";

import themeDefault from "./theme/theme";
import { Grid, ThemeProvider } from "@mui/material";
import GlobalStyles from "./styles/layoutStyles";

import {
  BackButton,
  CustomizedSnackbars,
  Header,
  IntroHeader,
  TutorialTooltip,
} from "common";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { setSnackBar } from "redux/actions";

const App = (props) => {
  const { component, Backbutton, backPressNavigationPath, isDrawer } = props;
  const classes = GlobalStyles();

  const dispatch = useDispatch();

  const snackbar = useSelector((state) => state.commonReducer.snackbar);

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          dispatch(setSnackBar({ open: false, message: "", variant: "" }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={[snackbar.message]}
      />
    );

    //eslint-disable-next-line
  }, [snackbar]);

  return (
    <div>
      {localStorage.getItem("token") === null ? (
        <div style={{ textAlign: "center" }}>
          <IntroHeader />
          <Grid sx={{ overflowX: "hidden", backgroundColor: "white" }}>
            {component}
          </Grid>
        </div>
      ) : (
        <ThemeProvider theme={themeDefault}>
          {renderSnackBar()}

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
              style={
                isDrawer ? { margin: 0, maxWidth: "100%", height: "100%" } : {}
              }
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
      )}
    </div>
  );
};

export default App;
