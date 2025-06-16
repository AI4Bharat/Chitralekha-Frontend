import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

//Styles
import { LoginStyle } from "styles";

//Components
import { Box, Tab, Typography, Tabs } from "@mui/material";
import EditProfile from "./EditProfile";
import LoginAndSecurity from "./LoginAndSecurity";
import Notifications from "./Notifications";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ProfilePage = () => {
  const classes = LoginStyle();
  const { id } = useParams();

  const [tabValue, setTabValue] = useState(0);

  const loggedInUserData = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  const handleTabChange = (_event, index) => {
    setTabValue(index);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" sx={{m:1}}>
          <Tab label="General" className={classes.profileTabs} />

          {(loggedInUserData.id === +id ||
            loggedInUserData.role === "ADMIN") && (
            <Tab label="Login & Security" className={classes.profileTabs} />
          )}

          {(loggedInUserData.id === +id ||
            loggedInUserData.role === "ADMIN") && (
            <Tab label="Notifications" className={classes.profileTabs} />
          )}
        </Tabs>
      </Box>

      <Box>
        <TabPanel value={tabValue} index={0}>
          <EditProfile />
        </TabPanel>

        {(loggedInUserData.id === +id || loggedInUserData.role === "ADMIN") && (
          <TabPanel value={tabValue} index={1}>
            <LoginAndSecurity />
          </TabPanel>
        )}

        {(loggedInUserData.id === +id || loggedInUserData.role === "ADMIN") && (
          <TabPanel value={tabValue} index={2}>
            <Notifications />
          </TabPanel>
        )}
      </Box>
    </>
  );
};

export default ProfilePage;
