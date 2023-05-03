import { Box, Tab, Typography, Divider, Tabs } from '@mui/material'
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import React, { useState, useEffect } from "react";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const ProfilePage = () => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
  
    return (
      
        < >
            <Box sx={{mb:2,}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="Profile" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Login & security" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    
                </Tabs>
            </Box>
            <Box sx={{ p: 1}}>
                <TabPanel value={tabValue} index={0}>
                < EditProfile/>  
                </TabPanel> 
                <TabPanel value={tabValue} index={1}>
                <ChangePassword />  
                </TabPanel>  
                 
            </Box>
        </>
       
    )
}

export default ProfilePage;














