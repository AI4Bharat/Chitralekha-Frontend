import React, { useState } from 'react';
import { Grid, TextField, Button, Tab, Tabs, Box, Typography, CircularProgress } from '@mui/material';
import { JSONTree } from 'react-json-tree';
import GetVideoDetailsAPI from "redux/actions/api/Admin/GetVideoDetails.js";
import { snakeToTitleCase } from '../../utils/utils.js';

function VideoDetails() {
    const [videoUrl, setVideoUrl] = useState(''); 
    const [tabValue, setTabValue] = useState(0);
    const [taskDetails, setTaskDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchVideoDetails = async () => {
        setLoading(true);
        setTaskDetails(null);

        const apiObj = new GetVideoDetailsAPI(videoUrl); 
        fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(async (res) => {
                if (res.status === 200) {
                    const data = await res.json();
                    return data;
                } else if (res.status === 404) {
                    return { error: 'Task not found' };
                } else {
                    return { error: 'Something went wrong' };
                }
            })
            .then(data => {
                setLoading(false);
                setTaskDetails(data); 
            });
    };

    const theme = {
        extend: {
            base00: '#000',
            base01: '#383830',
            base02: '#49483e',
            base03: '#75715e',
            base04: '#a59f85',
            base05: '#f8f8f2',
            base06: '#f5f4f1',
            base07: '#f9f8f5',
            base08: '#f92672',
            base09: '#fd971f',
            base0A: '#f4bf75',
            base0B: '#a6e22e',
            base0C: '#a1efe4',
            base0D: '#66d9ef',
            base0E: '#ae81ff',
            base0F: '#cc6633',
        },
        value: ({ style }, nodeType, keyPath) => ({
            style: {
                ...style,
                borderLeft: '2px solid #ccc',
                marginLeft: '1.375em',
                paddingLeft: '2em',
            },
        }),
        nestedNode: ({ style }, nodeType, keyPath) => ({
            style: {
                ...style,
                borderLeft: '2px solid #ccc',
                marginLeft: keyPath.length > 1 ? '1.375em' : 0,
                textIndent: '-0.375em',
            },
        }),
        arrowContainer: ({ style }, arrowStyle) => ({
            style: {
                ...style,
                paddingRight: '1.375rem',
                textIndent: '0rem',
                backgroundColor: 'white',
            },
        }),
    };

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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{display:"flex" ,flexDirection:{xs:'column',sm:'column',md:'row',lg:'row'},alignItems:{xs:'center',sm:'center'}}} >
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                    <TextField
                        id="video-url"
                        label="Video URL"
                        variant="outlined"
                        value={videoUrl}
                        onChange={(event) => setVideoUrl(event.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                    <Button variant="contained" onClick={fetchVideoDetails}>
                        Fetch Video Details
                    </Button>
                    
                    </Grid>
            </Grid>
            {loading && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
                    <CircularProgress color="primary" size={50} />
                </Grid>
            )}
            {taskDetails && (
                <>
                    <Grid item xs={12}>
                        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="video-task-details-tabs">
                            <Tab label="Details" sx={{ fontSize: 17, fontWeight: '400', marginRight: '28px !important' }} />
                        </Tabs>
                    </Grid>

                    <Grid item xs={12}>
                        <TabPanel value={tabValue} index={0}>
                            <JSONTree
                                data={taskDetails}
                                hideRoot={true}
                                invertTheme={true}
                                labelRenderer={([key]) => <strong>{typeof key === "string" ? snakeToTitleCase(key) : key}</strong>}
                                valueRenderer={(raw) => <span>{typeof raw === "string" && raw.match(/^"(.*)"$/) ? raw.slice(1, -1) : raw}</span>}
                                theme={theme}
                            />
                        </TabPanel>
                    </Grid>
                </>
            )}
        </Grid>
    );
}

export default VideoDetails;
