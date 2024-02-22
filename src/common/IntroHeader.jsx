import * as React from "react";
import { useNavigate, Link } from "react-router-dom";

//Styles
import { IntroDatasetStyle } from "styles";
//Icons
import MenuIcon from "@mui/icons-material/Menu";
import { Chitralekhalogo } from "assets/profileImages/index";

//Components
import {
  Grid,
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  IconButton,
  Button,
  Typography,
} from "@mui/material";

const drawerWidth = 240;

function IntroHeader(props) {
  const classes = IntroDatasetStyle();
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClickUseCases = () => {
    navigate("/useCases");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", mt: 3 }}>
      <Grid>
        <img src={Chitralekhalogo} style={{ maxWidth: "90px" }} alt="logo" />
        <Grid>
          <Button
            onClick={() => navigate("/")}
            className={classes.headerDrawerButton}
          >
            Home
          </Button>
        </Grid>

        <Grid>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.youtube.com/@chitralekha-bhashini"
          >
            <Button className={classes.headerDrawerButton}>Tutorial</Button>
          </a>
        </Grid>

        <Grid>
          <a
            target="_blank"
            href="https://github.com/AI4Bharat/Chitralekha"
            rel="noreferrer"
          >
            <Button className={classes.headerDrawerButton}>CodeBase</Button>
          </a>
        </Grid>

        <Grid>
          <a
            target="_blank"
            href="https://github.com/AI4Bharat/Chitralekha/wiki"
            rel="noreferrer"
          >
            <Button className={classes.headerDrawerButton}>Wiki</Button>
          </a>
        </Grid>

        <Grid>
          <Button
            onClick={handleClickUseCases}
            className={classes.headerDrawerButton}
          >
            Use Cases
          </Button>
        </Grid>

        <Grid>
          <Button
            onClick={() => navigate("/testimonials")}
            className={classes.headerDrawerButton}
          >
            Testimonials
          </Button>
        </Grid>

        <Grid>
          <Button
            onClick={() => navigate("/dashboards")}
            className={classes.headerDrawerButton}
          >
            Dashboards
          </Button>
        </Grid>

        <Grid>
          <Typography className={classes.poweredByEkstep}>
            Powered by EkStep Foundation
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          background: "white",
          height: "80px",
          padding: "15x 0px 0px 50px",
        }}
      >
        <Toolbar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Grid>
              <Button
                onClick={() => navigate("/")}
                className={classes.headerDrawerButton}
              >
                Home
              </Button>

              <a
                target="_blank"
                href="https://www.youtube.com/@chitralekha-bhashini"
                rel="noreferrer"
              >
                <Button className={classes.headerButtons}>Tutorial</Button>
              </a>
              <a
                target="_blank"
                href="https://github.com/AI4Bharat/Chitralekha"
                rel="noreferrer"
              >
                <Button className={classes.headerButtons}>Codebase</Button>
              </a>
              <a
                target="_blank"
                href="https://github.com/AI4Bharat/Chitralekha/wiki"
                rel="noreferrer"
              >
                <Button className={classes.headerButtons}>Wiki</Button>
              </a>
              <Button
                onClick={handleClickUseCases}
                className={classes.headerButtons}
              >
                Use Cases
              </Button>
              <Button
                onClick={() => navigate("/testimonials")}
                className={classes.headerButtons}
              >
                Testimonials
              </Button>
              <Button
                onClick={() => navigate("/dashboards")}
                className={classes.headerButtons}
              >
                Dashboards
              </Button>
            </Grid>
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: "flex", sm: "none" },
              color: "black",
              justifyContent: "end",
              ml: 3,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Grid
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "end",
              mr: 3,
              mt: 2,
            }}
          >
            <Link to={`/login`}>
              <Button variant="contained" className={classes.button}>
                Login
              </Button>
            </Link>

            <Link to={`/`}>
              <img
                src={Chitralekhalogo}
                style={{ maxWidth: "60px" }}
                alt="logo"
              />
            </Link>
          </Grid>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
export default IntroHeader;
