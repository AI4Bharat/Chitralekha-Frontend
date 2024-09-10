import { Box, Tab, Tabs, Typography, Paper } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import VideoTaskDetails from "./VideoTaskDetails";
import TaskDetails from "./TaskDetails";

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

const DashBoard1 = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (e, v) => {
        setTabValue(v)
    }

    return (
      
        < >
            <Box sx={{mb:2,}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin-tabs">
                    <Tab label="Video Task Details" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Task Details" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                </Tabs>
            </Box>
            <Box sx={{ p: 1}}>
                <TabPanel value={tabValue} index={0}>
                <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '32px'}}>
                    <VideoTaskDetails  />  
                </Paper>
                </TabPanel> 
                <TabPanel value={tabValue} index={1}>
                    <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '32px'}}>
                        <TaskDetails  />  
                    </Paper>
                </TabPanel> 
            </Box>
        </>
       
    )
}

export default DashBoard1;
