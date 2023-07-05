import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import DatasetStyle from "../../../styles/Dataset";
import Chitralekhalogo from "../../../../img/Chitralekha_Logo.png";
import {Routes, Route, useNavigate,Link} from 'react-router-dom';



const drawerWidth = 240;

 function Header(props) {
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClickUseCases = () =>{
    navigate('/useCases');

  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", mt: 3 }}>
      <Grid>
        <img src={Chitralekhalogo} style={{ maxWidth: "90px" }} alt="logo" />

        <Grid>
          {" "}
          <a target="_blank" href=" https://anuvaad.sunbird.org/">
            <Button
              sx={{
                color: "#51504f",
                textTransform: "capitalize",
                fontSize: "16px",
                fontFamily: "roboto,sans-serif",
              }}
            >
              Tutorial
            </Button>
          </a>
        </Grid>
        <Grid>
          {" "}
          <a target="_blank" href="https://github.com/AI4Bharat/Chitralekha-Frontend">
            <Button
              sx={{
                color: "#51504f",
                textTransform: "capitalize",
                fontSize: "16px",
                fontFamily: "roboto,sans-serif",
              }}
            >
              CodeBase
            </Button>
          </a>
        </Grid>
        
      
        <Grid>
          {" "}
          <a
            target="_blank"
            href="https://github.com/AI4Bharat/Chitralekha-Frontend/wiki"
          >
            <Button
              sx={{
                color: "#51504f",
                textTransform: "capitalize",
                fontSize: "16px",
                fontFamily: "roboto,sans-serif",
              }}
            >
              Wiki
            </Button>
          </a>
        </Grid>
        <Grid>
          {" "}
         
            <Button
            onClick={handleClickUseCases}
              sx={{
                color: "#51504f",
                textTransform: "capitalize",
                fontSize: "16px",
                fontFamily: "roboto,sans-serif",
              }}
            >
              Use Cases
            </Button>
         
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
            <a target="_blank" href=" https://anuvaad.sunbird.org/">
                <Button
                  sx={{
                    color: "#51504f",
                    textTransform: "capitalize",
                    fontSize: "16px",
                    fontFamily: "roboto,sans-serif",
                    ml: 3,
                  }}
                >
                  Tutorial
                </Button>
              </a>
              <a
                target="_blank"
                href="https://github.com/AI4Bharat/Chitralekha-Frontend"
              >
                <Button
                  sx={{
                    color: "#51504f",
                    textTransform: "capitalize",
                    fontSize: "16px",
                    fontFamily: "roboto,sans-serif",
                    ml: 3,
                  }}
                >
                  CodeBase
                </Button>
              </a>
             
              <a
                target="_blank"
                href="https://github.com/AI4Bharat/Chitralekha-Frontend/wiki"
              >
                <Button
                  sx={{
                    color: "#51504f",
                    textTransform: "capitalize",
                    fontSize: "16px",
                    fontFamily: "roboto,sans-serif",
                    ml: 3,
                  }}
                >
                  Wiki
                </Button>
              </a>

              <Button
                onClick={handleClickUseCases}
              sx={{
                color: "#51504f",
                textTransform: "capitalize",
                fontSize: "16px",
                fontFamily: "roboto,sans-serif",
                ml: 3,
              }}
            >
              Use Cases
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
              display: { sm: "flex", sm: "none" },
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
              mt:2
            }}
          >

<a
                target="_blank"
                href="https://chitralekha.ai4bharat.org/"
              >
                <Button
                  sx={{
                    color: "#51504f",
                    textTransform: "capitalize",
                    fontSize: "16px",
                    fontFamily: "roboto,sans-serif",
                    mt:1,
                    mr:2
                  }}
                >
                  Login
                </Button>
              </a>
            <Link to={`/`}>
            <img src={Chitralekhalogo} style={{ maxWidth: "70px" }} alt="logo" />
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

export default Header;
