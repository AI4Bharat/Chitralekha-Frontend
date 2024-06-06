import { translate } from "config";

//Components
import { Grid, Typography, Hidden, ThemeProvider, Button } from "@mui/material";

//Styles
import { themeDefault } from "theme";
import { LoginStyle } from "styles";
import { useState } from "react";
import { OnBoardingForm } from "common";

export default function AppInfo() {
  const classes = LoginStyle();

  const [openOnboardingForm, setOpenOnboardingForm] = useState(false);

  const routeChange = () => {
    // let path = `dashboard`;
    // navigate(path);
  };

  return (
    <div>
      <ThemeProvider theme={themeDefault}>
        <Grid container>
          <Hidden only="xs">
            <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
              <img
                src={"Chitralekha_Logo.png"}
                alt="logo"
                style={{
                  width: "85px",
                  margin: "10% 0px 0% 35px",
                  borderRadius: 20,
                }}
              />{" "}
            </Grid>{" "}
          </Hidden>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography
              variant={"h2"}
              className={classes.title}
              style={{ margin: "10% 294px 10% 39px" }}
              onClick={routeChange}
            >
              Chitralekha
            </Typography>
          </Grid>

          <Hidden only="xs">
            <Typography
              variant={"body1"}
              className={classes.body}
              style={{ margin: "10px 0px 40px 39px" }}
            >
              {translate("label.chitralekhaInfo")}
            </Typography>
          </Hidden>

          {/* <Button
            variant="contained"
            color="secondary"
            sx={{
              margin: "auto",
              width: "80%",
              background: "white",
              color: "rgba(44, 39, 153, 1)",
            }}
            onClick={() => setOpenOnboardingForm(true)}
          >
            Request to Join
          </Button> */}

          <Typography
            style={{
              // position: "absolute",
              fontSize: "1rem",
              // bottom: "0.5rem",
              margin: "10px 0px 10px 39px",
            }}
          >
            Powered by EkStep Foundation
          </Typography>
        </Grid>

        {openOnboardingForm && (
          <OnBoardingForm
            openOnboardingForm={openOnboardingForm}
            handleClose={() => setOpenOnboardingForm(false)}
          />
        )}
      </ThemeProvider>
    </div>
  );
}
