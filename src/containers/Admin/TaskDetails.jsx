import React, { useState } from 'react';
import { Grid, TextField, Button, Box, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import { JSONTree } from 'react-json-tree';
import GetTaskDetailsAPI from "redux/actions/api/Admin/GetTaskDetails.js";
import GetAllTranscriptionsAPI from "redux/actions/api/Admin/GetAllTranscriptions.js";
import GetAllTranslationsAPI from "redux/actions/api/Admin/GetAllTranslations.js";
import { snakeToTitleCase } from '../../utils/utils.js';

function TaskDetails() {
    const [taskId, setTaskId] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [taskDetails, setTaskDetails] = useState(null);
    const [transcriptions, setTranscriptions] = useState(null);
    const [translations, setTranslations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingTranscriptions, setLoadingTranscriptions] = useState(false);
    const [loadingTranslations, setLoadingTranslations] = useState(false);

    const fetchTaskDetails = async () => {
        setLoading(true);
        setTaskDetails(null);
        setTranscriptions(null);
        setTranslations(null);

        const apiObj = new GetTaskDetailsAPI(taskId);
        try {
            const res = await fetch(apiObj.apiEndPoint(), apiObj.getHeaders());
            let data;
            if (res.status === 200) {
                data = await res.json();
            } else if (res.status === 404) {
                data = { error: 'Task not found' };
            } else {
                data = { error: 'Something went wrong' };
            }

            setLoading(false);
            if (data.error) {
                setTaskDetails({ error: data.error });
                return;
            }

            setTaskDetails(data);
            const videoId = data.video;

            setTabValue(0);

            if (["TRANSCRIPTION_EDIT", "TRANSCRIPTION_REVIEW"].includes(data.task_type)) {
                fetchTranscriptions(videoId);
            } else if (["TRANSLATION_EDIT", "TRANSLATION_REVIEW", "TRANSLATION_VOICEOVER_EDIT", "TRANSLATION_VOICEOVER_REVIEW"].includes(data.task_type)) {
                fetchTranslations(videoId);
            }

        } catch (error) {
            setLoading(false);
            console.error(error); 
        }
    };

    const fetchTranscriptions = async (videoId) => {
        setLoadingTranscriptions(true);
        const apiObj = new GetAllTranscriptionsAPI(videoId);
        try {
            const res = await fetch(apiObj.apiEndPoint(), apiObj.getHeaders());
            let data;
            if (res.status === 200) {
                data = await res.json();
            } else {
                data = { error: 'Failed to fetch transcriptions' };
            }

            if (data.error) {
                setTranscriptions({ error: data.error });
            } else {
                setTranscriptions(data.transcripts);
            }
        } catch (error) {
            console.error(error); 
        }
        setLoadingTranscriptions(false);
    };

    const fetchTranslations = async (videoId) => {
        setLoadingTranslations(true);
        const apiObj = new GetAllTranslationsAPI(videoId);
        try {
            const res = await fetch(apiObj.apiEndPoint(), apiObj.getHeaders());
            let data;
            if (res.status === 200) {
                data = await res.json();
            } else {
                data = { error: 'Failed to fetch translations' };
            }

            if (data.error) {
                setTranslations({ error: data.error });
            } else {
                setTranslations(data);
            }
        } catch (error) {
            console.error(error);
        }
        setLoadingTranslations(false);
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
                        <Typography component={'div'}>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: '2em', alignItems: 'center' }}>
                    <TextField
                        id="task-id"
                        label="Task ID"
                        variant="outlined"
                        value={taskId}
                        onChange={(event) => setTaskId(event.target.value)}
                    />
                    <Button variant="contained" onClick={fetchTaskDetails}>
                        Fetch Task Details
                    </Button>
                </Box>
            </Grid>
            {loading && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
                    <CircularProgress color="primary" size={50} />
                </Grid>
            )}
            {taskDetails && (
                <>
                    <Grid item xs={12}>
                        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="task-details-tabs">
                            <Tab label="Details" sx={{ fontSize: 17, fontWeight: '400', marginRight: '28px !important' }} />
                            {["TRANSCRIPTION_EDIT", "TRANSCRIPTION_REVIEW"].includes(taskDetails.task_type) && (
                                <Tab label="Transcriptions" sx={{ fontSize: 17, fontWeight: '400', marginRight: '28px !important' }} />
                            )}
                            {["TRANSLATION_EDIT", "TRANSLATION_REVIEW", "TRANSLATION_VOICEOVER_EDIT", "TRANSLATION_VOICEOVER_REVIEW"].includes(taskDetails.task_type) && (
                                <Tab label="Translations" sx={{ fontSize: 17, fontWeight: '400', marginRight: '28px !important' }} />
                            )}
                        </Tabs>
                    </Grid>

                    <Grid item xs={12}>
                        <TabPanel value={tabValue} index={0}>
                            {taskDetails.error ? (
                                <Typography color="error">{taskDetails.error}</Typography>
                            ) : (
                                <JSONTree
                                    data={taskDetails}
                                    hideRoot={true}
                                    invertTheme={true}
                                    labelRenderer={([key]) => <strong>{typeof key === "string" ? snakeToTitleCase(key) : key}</strong>}
                                    valueRenderer={(raw) => <span>{typeof raw === "string" && raw.match(/^"(.*)"$/) ? raw.slice(1, -1) : raw}</span>}
                                    theme={theme}
                                />
                            )}
                        </TabPanel>

                        {["TRANSCRIPTION_EDIT", "TRANSCRIPTION_REVIEW"].includes(taskDetails.task_type) && (
                            <TabPanel value={tabValue} index={1}>
                                {loadingTranscriptions ? (
                                    <Grid container justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
                                        <CircularProgress color="primary" size={50} />
                                    </Grid>
                                ) : transcriptions ? (
                                    transcriptions.error ? (
                                        <Typography color="error">{transcriptions.error}</Typography>
                                    ) : (
                                        <JSONTree
                                            data={transcriptions}
                                            hideRoot={true}
                                            invertTheme={true}
                                            labelRenderer={([key]) => <strong>{typeof key === "string" ? snakeToTitleCase(key) : key}</strong>}
                                            valueRenderer={(raw) => <span>{typeof raw === "string" && raw.match(/^"(.*)"$/) ? raw.slice(1, -1) : raw}</span>}
                                            theme={theme}
                                        />
                                    )
                                ) : (
                                    <Typography>No transcriptions available.</Typography>
                                )}
                            </TabPanel>
                        )}

                        {["TRANSLATION_EDIT", "TRANSLATION_REVIEW", "TRANSLATION_VOICEOVER_EDIT", "TRANSLATION_VOICEOVER_REVIEW"].includes(taskDetails.task_type) && (
                            <TabPanel value={tabValue} index={1}>
                                {loadingTranslations ? (
                                    <Grid container justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
                                        <CircularProgress color="primary" size={50} />
                                    </Grid>
                                ) : translations ? (
                                    translations.error ? (
                                        <Typography color="error">{translations.error}</Typography>
                                    ) : (
                                        <JSONTree
                                            data={translations}
                                            hideRoot={true}
                                            invertTheme={true}
                                            labelRenderer={([key]) => <strong>{typeof key === "string" ? snakeToTitleCase(key) : key}</strong>}
                                            valueRenderer={(raw) => <span>{typeof raw === "string" && raw.match(/^"(.*)"$/) ? raw.slice(1, -1) : raw}</span>}
                                            theme={theme}
                                        />
                                    )
                                ) : (
                                    <Typography>No translations available.</Typography>
                                )}
                            </TabPanel>
                        )}
                    </Grid>
                </>
            )}
        </Grid>
    );
}

export default TaskDetails;
