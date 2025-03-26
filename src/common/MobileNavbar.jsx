import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

//Styles
import { headerStyle } from "styles";

//Components
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  AppBar,
  Divider,
  Avatar,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import HelpDialog from "./HelpDialog";

function MobileNavbar({ UserMenu, SettingsMenu, userData }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = headerStyle();
  const navigate = useNavigate();
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  const handleClickHelp = () => {
    setOpenHelpDialog(true);
  };

  const handleClose = () => {
    setOpenHelpDialog(false);
  };

  const tabs = [
    {
      name: "Organizations",
      onClick: () => {
        navigate(`/my-organization/${userData?.organization?.id}`);
        setOpenDrawer(false);
      },
    },
    {
      name: "Tasks",
      onClick: () => {
        navigate(`/task-list`);
        setOpenDrawer(false);
      },
    },
    userData?.role === "ADMIN"
      ? {
          name: "Admin",
          onClick: () => {
            navigate(`/admin`);
            setOpenDrawer(false);
          },
        }
      : null,
  ].filter(Boolean);
  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        className={classes.drawer}
        PaperProps={{
          style: {
            fontFamily: "Rowdies,cursive,Roboto,sans-serif",
          },
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
        transitionDuration={{ enter: 400, exit: 300 }}
      >
        <Box
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            pb: 2,
          }}
        >
          <Box className={classes.navbar_banner}>
            <NavLink
              to={`/profile/${userData.id}`}
              onClick={() => setOpenDrawer(false)}
              style={{ textDecoration: "none" }}
            >
              <Box className={classes.profileBox}>
                <Avatar
                  alt="user_profile_pic"
                  className={classes.mobileNav_avatar}
                >
                  {userData?.first_name?.charAt(0)}
                </Avatar>
                <Box style={{ marginLeft: "20px" }}>
                  <Typography variant="h6" className={classes.username}>
                    {userData?.first_name} {userData?.last_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: "rgba(0,0,0,0.6)", fontSize: "0.85rem" }}
                  >
                    View Profile
                  </Typography>
                </Box>
              </Box>
            </NavLink>
            <IconButton
              className={classes.closeButton}
              onClick={() => setOpenDrawer(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box style={{ padding: "8px" }}>
            <Typography className={classes.sectionTitle}>
              Organization
            </Typography>
            <List>
              {tabs.map((tab, index) => (
                <ListItem
                  key={index}
                  onClick={tab.onClick}
                  className={classes.listItem}
                >
                  {tab.name}
                </ListItem>
              ))}
            </List>
          </Box>

          <Box style={{ padding: "8px" }}>
            <Typography className={classes.sectionTitle}>
              App Settings
            </Typography>
            <Divider />
            <List>
              {userData?.role === "ADMIN" ||
              userData?.role === "ORG_OWNER" ||
              userData?.role === "PROJECT_MANAGER" ? (
                <ListItem
                  onClick={() => {
                    navigate("/task-queue-status");
                    setOpenDrawer(false);
                  }}
                  className={classes.listItem}
                >
                  {"Task Queue Status"}
                </ListItem>
              ) : (
                ""
              )}
              <ListItem
                onClick={() => {
                  window.open(
                    "https://github.com/AI4Bharat/Chitralekha/wiki",
                    "_blank"
                  );
                  setOpenDrawer(false);
                }}
                className={classes.listItem}
              >
                {"Wiki"}
              </ListItem>

              <ListItem
                onClick={() => {
                  handleClickHelp();
                  setOpenDrawer(false);
                }}
                className={classes.listItem}
              >
                {"Help"}
              </ListItem>
            </List>
          </Box>

          <Box style={{ padding: "8px" }}>
            <Typography className={classes.sectionTitle}>
              User Settings
            </Typography>
            <Divider />
            <List>
              {UserMenu.map((setting, index) => (
                <ListItem
                  key={index}
                  onClick={() => {
                    setting.onClick();
                    setOpenDrawer(false);
                  }}
                  className={
                    setting.name === "Logout"
                      ? classes.logoutItem
                      : classes.listItem
                  }
                >
                  {setting.name}
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      <AppBar style={{ backgroundColor: "#ffffff", padding: "8px 0" }}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding="0 16px"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" alignItems="center">
              <img
                src={"Chitralekha_Logo_Transparent.png"}
                alt="logo"
                className={classes.headerLogo}
              />
              <Typography
                variant="h3"
                sx={{ color: "black", marginLeft: "10px" }}
              >
                Chitralekha
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: "0.7rem", fontWeight: "500", color: "#000000" }}
            >
              Powered by EkStep Foundation
            </Typography>
          </Box>

          <IconButton
            className={classes.menuButton}
            onClick={() => setOpenDrawer(!openDrawer)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </AppBar>
      {openHelpDialog && (
        <HelpDialog
          openHelpDialog={openHelpDialog}
          handleClose={() => handleClose()}
          setOpenHelpDialog={setOpenHelpDialog}
        />
      )}
    </>
  );
}

export default MobileNavbar;
