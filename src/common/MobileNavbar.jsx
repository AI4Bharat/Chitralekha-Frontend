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

function MobileNavbar({ UserMenu, SettingsMenu, userData }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = headerStyle();
  const navigate = useNavigate();

  const tabs = [
    {
      name: "Organizations",
      onClick: () => {
        navigate(`/my-organization/${localStorage.getItem("id")}`);
        setOpenDrawer(false);
      },
    },
    {
      name: "Tasks",
      onClick: () => {
        navigate(`/task-list/${localStorage.getItem("id")}`);
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
        PaperProps={{
          style: {
            padding: "16px",
            fontFamily:"Rowdies,cursive,Roboto,sans-serif"
          },
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            paddingBottom: "16px",
            
          }}
        >
          <Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                columnGap: "16px",
                paddingBottom: "16px",
              }}
            >
              <Avatar
                alt="user_profile_pic"
                variant="contained"
                className={classes.avatar}
              >
                {userData?.first_name?.charAt(0)}
              </Avatar>
              <Typography
                variant="h2"
                sx={{ p: 0, ml: 1 }}
                style={{
                  color: "black",
                }}
              >
                {userData?.first_name} {userData?.last_name}
              </Typography>
            </Box>
            <Divider />
          </Box>

          <Box>
            <List>
              {tabs.map((tab, index) => (
                <ListItem key={index} onClick={tab.onClick}>
                  <Typography variant="body1" align="right">
                    <NavLink
                      to=""
                      className={classes.headerMenu}
                      activeClassName={classes.highlightedMenu}
                    >
                      {tab.name}
                    </NavLink>
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
          <Typography
              variant="h6"
              align="center"
              style={{
                fontSize: "1.1rem",
                fontFamily:"Roboto, sans-serif",
                fontWeight:"700"
              }}
            >
              App Settings
            </Typography>
            <Divider />

          {userData?.role === "ADMIN" ||
          userData?.role === "ORG_OWNER" ||
          userData?.role === "PROJECT_MANAGER" ? (
            <IconButton
              onClick={() => {
                navigate("/task-queue-status");
                setOpenDrawer(false);
              }}
              className={`${classes.icon} help`}
            >
              <Tooltip title="Task Queue Status">
                <HourglassBottomIcon color="primary" className={classes.icon2} />
              </Tooltip>
            </IconButton>
          ) : (
            ""
          )}

          <IconButton
            onClick={() => {
              // Assuming handleClickHelp is a function to open the help dialog
              navigate("/help");
              setOpenDrawer(false);
            }}
            className={`${classes.icon} help`}
          >
            <Tooltip title="Help">
              <HelpOutlineIcon color="primary" className={classes.icon} />
            </Tooltip>
          </IconButton>

          {/* <Box>
            <List>
              {SettingsMenu.map((setting, index) => (
                <ListItem key={index} onClick={() => {
                  setting.onClick();
                  setOpenDrawer(false);
                }}>
                  <Typography
                    variant="body1"
                    textAlign="center"
                    style={{
                      color: "black",
                      fontSize: "1rem",
                      fontWeight: "400",
                    }}
                  >
                    {setting.name}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box> */}

          <Box>
            <Typography
              variant="h6"
              align="center"
              style={{
                fontSize: "1.1rem",
              }}
            >
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
                >
                  <Typography
                    variant="body2"
                    textAlign="center"
                    style={{
                      color: "black",
                      fontSize: "1rem",
                      fontWeight: "400",
                      cursor:"pointer"
                    }}
                  >
                    {setting.name}
                  </Typography>
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
              <Typography variant="h3" sx={{ color: "black", marginLeft: "10px" }}>
                Chitralekha               
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: "0.7rem", fontWeight: "500", color: "#000000" }}
            >
              Powered by EkStep Foundation
            </Typography>
          </Box>

          <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
            <MenuIcon />
          </IconButton>
        </Box>
      </AppBar>
    </>
  );
}

export default MobileNavbar;
