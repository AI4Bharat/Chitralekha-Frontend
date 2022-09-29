import { Grid, Typography, Hidden, ThemeProvider, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { translate } from "../../config/localisation";
import themeDefault from "../../theme/theme";
import LoginStyle from "../../styles/loginStyle";

export default function AppInfo() {
  let navigate = useNavigate();
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
                src={"ai4bharat.png"}
                alt="logo"
                style={{ width: "85px", margin: "10% 0px 0% 35px" }}
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
        </Grid>
      </ThemeProvider>
    </div>
  );
}
