import React, { useState } from "react";
import { NavLink } from "react-router-dom";

//Style
import { headerStyle } from "styles";

//Components
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  Grid,
  AppBar,
  Divider,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function MobileNavbar({ UserMenu, SettingsMenu }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = headerStyle();

  const tabs = [
    {
      name: "Organizations",
      onClick: () => {
        setOpenDrawer(false);
      },
    },
    {
      name: "project",
      onClick: () => {
        setOpenDrawer(false);
      },
    },
    {
      name: "workspace",
      onClick: () => {
        setOpenDrawer(false);
      },
    },
  ];

  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          style: {
            padding: "16px",
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
            <NavLink
              onClick={() => setOpenDrawer(false)}
              style={{
                textDecoration: "none",
              }}
            >
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
                  U
                </Avatar>
                <Typography
                  variant="h2"
                  sx={{ p: 0, ml: 1 }}
                  style={{
                    color: "black",
                  }}
                >
                  User
                </Typography>
              </Box>
            </NavLink>
            <Divider />
          </Box>

          <Box >
            <List>
              {tabs.map((tab, index) => (
                <ListItem key={index} onClick={() => setOpenDrawer(false)}>
                  <Typography variant="body1">
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

          <Box>
            <Typography
              variant="h6"
              align="center"
              style={{
                fontSize: "1.1rem",
              }}
            >
              App Settings
            </Typography>
            <Divider />
            <List>
              {SettingsMenu.map((setting, index) => (
                <ListItem key={index} onClick={setting.onclick}>
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
          </Box>

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
                    setting.onclick();
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
        <Grid
          container
          direction="row"
          justifyContent={"space-between"}
          style={{
            padding: "0 5%",
          }}
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
            <Typography sx={{ fontSize: "0.7rem", fontWeight: "500", color: "#000000", marginTop: "auto" }}>
              Powered by EkStep Foundation
            </Typography>
          </Box>

          <Grid item>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
              <MenuIcon />
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>
    </>
  );
}
export default MobileNavbar;
