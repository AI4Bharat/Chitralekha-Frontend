import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
  Link,
  AppBar,
  Divider,
  Avatar,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import headerStyle from "../styles/header";

function MobileNavbar(props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = headerStyle();

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
              to="/profile"
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
                  variant="h6"
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
          <Box>
            <List>
              {["Organizations", "project", "workspace"].map((tab) => (
                <ListItem onClick={() => setOpenDrawer(false)}>{tab}</ListItem>
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
            {/* <List>
              {appSettings.map((setting) => (
                <ListItem key={setting} onClick={setting.onclick}>
                  {setting.control ? (
                    <FormControlLabel
                      control={setting.control}
                      label={setting.name}
                    />
                  ) : (
                    <Typography variant="body1" textAlign="center">
                      {setting.name}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List> */}
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
            {/* <List>
              {userSettings.map((setting) => (
                <ListItem
                  key={setting}
                  onClick={() => {
                    setting.onclick();
                    setOpenDrawer(false);
                  }}
                >
                  <Typography variant="body1" textAlign="center">
                    {setting.name}
                  </Typography>
                </ListItem>
              ))}
            </List> */}
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
          <Grid item>
            <Link to="/projects">
              <img
                src={"https://i.imgur.com/pVT5Mjp.png"}
                alt="logo"
                className={classes.headerLogo}
                style={{ marginTop: "5%" }}
              />
            </Link>
          </Grid>
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
