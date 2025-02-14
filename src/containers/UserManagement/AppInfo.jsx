import { translate } from "config";

//Components
import { Grid, Typography, Hidden, ThemeProvider } from "@mui/material";

//Styles
import { themeDefault } from "theme";
import { LoginStyle } from "styles";

export default function AppInfo() {
  const classes = LoginStyle();
  const routeChange = () => {
    // let path = `dashboard`;
    // navigate(path);
  };
  return (
    <div>
      <ThemeProvider theme={themeDefault}>
        <Grid container className={classes.appInfoContainer}>
          <Grid item>
            <img
              src={"Chitralekha_Logo.png"}
              alt="logo"
              style={{
                width: "85px",
                borderRadius: 20,
              }}
            />
          </Grid>
          <Grid item>
            <Typography
              variant={"h2"}
              className={classes.title}
              onClick={routeChange}
            >
              Chitralekha
            </Typography>
          </Grid>
          <Typography variant={"body1"} className={classes.body}>
            {translate("label.chitralekhaInfo")}
          </Typography>
          <Typography className={classes.secondaryBodyText}>
            Powered by EkStep Foundation
          </Typography>
        </Grid>
      </ThemeProvider>
    </div>
  );
}
