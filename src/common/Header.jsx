import React, { useState } from "react";
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
import { Grid, useMediaQuery } from "@mui/material";
import MobileNavbar from "./MobileNavbar";
import { NavLink } from "react-router-dom";

const Header = () => {
  const classes = headerStyle();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenSettingsMenu = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };

  const handleOpenHelpMenu = (event) => {
    setAnchorElHelp(event.currentTarget);
  };

  const handleCloseHelpMenu = () => {
    setAnchorElHelp(null);
  };

  const HelpMenu = [
    {
      name: "Help",
      onClick: () => {},
    },
  ];

  const SettingsMenu = [
    {
      name: "Settings",
      onClick: () => {},
    },
  ];

  const UserMenu = [
    {
      name: "My Profile",
      onClick: () => {},
    },
    {
      name: "Change Password",
      onClick: () => {},
    },
    {
      name: "Logout",
      onClick: () => {},
    },
  ];

  return (
    <Box>
      {isMobile ? (
        <MobileNavbar SettingsMenu={SettingsMenu} UserMenu={UserMenu} />
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
                <Typography variant="h4" sx={{ color: "black" }}>
                  Chitralekha
                </Typography>
              </Box>

              <Grid
                container
                direction="row"
                justifyContent="center"
                columnGap={2}
                rowGap={2}
                xs={12}
                sm={12}
                md={7}
              >
                <Typography variant="body1">
                  <NavLink
                    to="#"
                    className={classes.headerMenu}
                    activeClassName={classes.highlightedMenu}
                  >
                    Organizations
                  </NavLink>
                </Typography>
                <Typography variant="body1">
                  <NavLink
                    to="#"
                    className={classes.headerMenu}
                    activeClassName={classes.highlightedMenu}
                  >
                    Projects
                  </NavLink>
                </Typography>
                <Typography variant="body1">
                  <NavLink
                    to="#"
                    className={classes.headerMenu}
                    activeClassName={classes.highlightedMenu}
                  >
                    Workspace
                  </NavLink>
                </Typography>
              </Grid>

              <Box className={classes.avatarBox}>
                <IconButton
                  onClick={handleOpenHelpMenu}
                  className={classes.icon}
                >
                  <Tooltip title="Help">
                    <HelpOutlineIcon color="primary" className={classes.icon} />
                  </Tooltip>
                </IconButton>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElHelp}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElHelp)}
                  onClose={handleCloseHelpMenu}
                >
                  {HelpMenu.map((item, index) => (
                    <MenuItem key={index} onClick={item.onClick}>
                      <Typography variant="body2" textAlign="center">
                        {item.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>

                <IconButton
                  onClick={handleOpenSettingsMenu}
                  className={classes.icon}
                >
                  <Tooltip title="Settings">
                    <SettingsOutlinedIcon
                      color="primary"
                      className={classes.icon}
                    />
                  </Tooltip>
                </IconButton>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElSettings}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElSettings)}
                  onClose={handleCloseSettingsMenu}
                >
                  {SettingsMenu.map((item, index) => (
                    <MenuItem key={index} onClick={item.onClick}>
                      <Typography variant="body2" textAlign="center">
                        {item.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>

                <IconButton
                  onClick={handleOpenUserMenu}
                  className={classes.icon}
                  sx={{ marginLeft: "20px" }}
                >
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  <Typography
                    variant="h4"
                    sx={{
                      color: "rgb(39, 30, 79)",
                      marginLeft: "10px",
                      fontSize: "1.25rem",
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: "400",
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
                    horizontal: "center",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {UserMenu.map((item, index) => (
                    <MenuItem key={index} onClick={item.onClick}>
                      <Typography variant="body2" textAlign="center">
                        {item.name}
                      </Typography>
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
