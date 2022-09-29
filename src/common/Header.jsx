import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import headerStyle from "../styles/header";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import MobileNavbar from "./MobileNavbar";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header = () => {
  const classes = headerStyle();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box>
      {isMobile ? (
        <MobileNavbar />
      ) : (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters className={classes.toolbar}>
              <Box display="flex" alignItems="center">
                <img
                  src={"https://i.imgur.com/pVT5Mjp.png"}
                  alt="ai4bharat"
                  className={classes.Logo}
                />
                <Typography
                  variant="h4"
                  sx={{ color: "black", marginLeft: "10px" }}
                >
                  Chitralekha
                </Typography>
              </Box>

              <Box display="flex">
                <Button
                  variant="text"
                  className={classes.headerMenu}
                  sx={{ color: "#000" }}
                >
                  Organization
                </Button>
                <Button
                  variant="text"
                  className={classes.headerMenu}
                  sx={{ color: "#000" }}
                >
                  Projects
                </Button>
                <Button
                  variant="text"
                  className={classes.headerMenu}
                  sx={{ color: "#000" }}
                >
                  Workspace
                </Button>
              </Box>

              <Box className={classes.avatarBox}>
                <Tooltip title="Help">
                  <HelpOutlineIcon color="primary" className={classes.icon} />
                </Tooltip>

                <Tooltip title="Settings">
                  <SettingsOutlinedIcon
                    color="primary"
                    className={classes.icon}
                  />
                </Tooltip>

                <IconButton
                  onClick={handleOpenUserMenu}
                  className={classes.icon}
                >
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  <Typography
                    variant="h4"
                    sx={{
                      color: "black",
                      marginLeft: "10px",
                      fontSize: "20px",
                    }}
                  >
                    User
                  </Typography>
                </IconButton>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </Box>
  );
};
export default Header;
