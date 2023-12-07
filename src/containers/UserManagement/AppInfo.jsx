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
        <Grid container>
          <Hidden only="xs">
            <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
              <img
                src={"Chitralekha_Logo.png"}
                alt="logo"
                style={{ width: "85px", margin: "10% 0px 0% 35px", borderRadius: 20 }}
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
              style={{ margin: "20px 0px 50px 39px" }}
            >
              {translate("label.chitralekhaInfo")}
            </Typography>
          </Hidden>
          <Typography
              style={{ position: 'absolute', fontSize: "1rem", bottom: "0.5rem", margin: "20px 0px 50px 39px" }}>
                Powered by EkStep Foundation
                </Typography>
        </Grid>
      </ThemeProvider>
    </div>
  );
}
