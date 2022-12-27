// TranslationRightPanel

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, CardContent, Divider, Grid, Typography, Switch } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ProjectStyle from "../../../styles/ProjectStyle";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { useParams, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import FindAndReplace from "../../../common/FindAndReplace";
import C from "../../../redux/constants";
import { setSubtitles } from "../../../redux/actions/Common";
import SplitPopOver from "../../../common/SplitPopOver";


const TranslationRightPanel = ({ currentIndex, player }) => {
    const { taskId, orgId, projectId } = useParams();
    const classes = ProjectStyle();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fullscreen = useSelector((state) => state.commonReducer.fullscreen);
    const taskData = useSelector((state) => state.getTaskDetails.data);
    const assignedOrgId = JSON.parse(localStorage.getItem("userData"))
        ?.organization?.id;
    const subtitles = useSelector((state) => state.commonReducer.subtitles);

    const [sourceText, setSourceText] = useState([]);
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    const [enableTransliteration, setTransliteration] = useState(true)
    
    useEffect(() => {
        setSourceText(subtitles);
    }, [subtitles]);

    const onReplacementDone = (updatedSource) => {
        setSourceText(updatedSource);
        dispatch(setSubtitles(updatedSource, C.SUBTITLES));
        saveTranscriptHandler(false, true);
    }

    const changeTranscriptHandler = (text, index) => {
        const arr = [...sourceText];
        arr.forEach((element, i) => {
            if (index === i) {
                element.target_text = text;
            }
        });

        dispatch(setSubtitles(arr, C.SUBTITLES));
        setSourceText(arr);
        saveTranscriptHandler(false, false);
    };

    const saveTranscriptHandler = async (isFinal, isAutosave) => {
        const reqBody = {
            task_id: taskId,
            payload: {
                payload: sourceText,
            },
        };

        if (isFinal) {
            reqBody.final = true;
        }

        const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
        //dispatch(APITransport(obj));
        const res = await fetch(obj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(obj.getBody()),
            headers: obj.getHeaders().headers,
        });
        const resp = await res.json();
        if (res.ok) {
            setSnackbarInfo({
                open: isAutosave,
                message: resp?.message ? resp?.message : isAutosave ? "Saved as draft" : "",
                variant: "success",
            });
            if (isFinal) {
                setTimeout(() => {
                    navigate(
                        `/my-organization/${assignedOrgId}/project/${taskData?.project}`
                    );
                }, 2000);
            }
            //navigate(`/my-organization/:${orgId}/project/:${projectId}`)
        } else {
            setSnackbarInfo({
                open: isAutosave,
                message: "Failed",
                variant: "error",
            });
        }
    };

    const renderSnackBar = () => {
        return (
            <CustomizedSnackbars
                open={snackbar.open}
                handleClose={() =>
                    setSnackbarInfo({ open: false, message: "", variant: "" })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                variant={snackbar.variant}
                message={snackbar.message}
            />
        );
    };

    return (
        <>
            {renderSnackBar()}
            <Box
                sx={{
                    display: "flex",
                    border: fullscreen ? "" : "1px solid #eaeaea",
                }}
                //   width="25%"
                flexDirection="column"
            >
                <Grid display={"flex"} direction={"row"} flexWrap={"wrap"} margin={"23.5px 0"} justifyContent={"space-evenly"}>
                    {/* <Button variant="contained" className={classes.findBtn}>
          Find/Search
        </Button> */}
                    <Grid display={"flex"} alignItems={"center"} paddingX={2}>
                        <Typography>Transliteration</Typography>
                        <Switch
                            checked={enableTransliteration}
                            onChange={() => setTransliteration(!enableTransliteration)}
                        />
                    </Grid>
                    <FindAndReplace
                        sourceData={sourceText}
                        subtitleDataKey={"target_text"}
                        onReplacementDone={onReplacementDone}
                        enableTransliteration={enableTransliteration}
                        transliterationLang={taskData?.target_language}
                    />
                    <Button
                        variant="contained"
                        className={classes.findBtn}
                        onClick={() => saveTranscriptHandler(false, true)}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.findBtn}
                        onClick={() => saveTranscriptHandler(true, true)}
                    >
                        Complete
                    </Button>
                </Grid>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderTop: "1px solid #eaeaea",
                        overflowY: "scroll",
                        overflowX: "hidden",
                        height: window.innerHeight * 0.63,
                        backgroundColor: "black",
                        // color: "white",
                        marginTop: "5px",
                    }}
                    className={"subTitleContainer"}
                >
                    {sourceText?.map((item, index) => {
                        return (
                            <>
                                <Box
                                    display="flex"
                                    paddingTop="16px"
                                    sx={{ paddingX: 0, justifyContent: "space-around" }}
                                >
                                    <TextField
                                        variant="outlined"
                                        value={item.start_time}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                width: "85%",
                                                backgroundColor: "#616A6B",
                                                color: "white",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "12px",
                                                padding: "7px 14px",
                                                textAlign: "center",
                                            },
                                        }}
                                    />

                                    <TextField
                                        variant="outlined"
                                        value={item.end_time}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                width: "85%",
                                                marginLeft: "auto",
                                                backgroundColor: "#616A6B",
                                                color: "white",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "12px",
                                                textAlign: "center",
                                                padding: "7px 14px",
                                            },
                                        }}
                                    />
                                </Box>

                                <CardContent
                                    sx={{ display: "flex", padding: "5px 0", borderBottom: 2 }} 
                                    onClick={() => {
                                        if (player) {
                                          player.pause();
                                          if (player.duration >= item.startTime) {
                                            player.currentTime = item.startTime + 0.001;
                                          }
                                        }
                                      }}
                                >
                                    <textarea
                                        rows={4}
                                        className={`${classes.textAreaTransliteration} ${currentIndex === index ? classes.boxHighlight : ""
                                            }`}
                                        contentEditable={false}
                                        defaultValue={item.text}
                                    />
                                    {enableTransliteration ?
                                        <IndicTransliterate
                                            lang={taskData?.target_language}
                                            value={item.target_text}
                                            // onChangeText={(text, index) => {}}
                                            onChangeText={(text) => {
                                                changeTranscriptHandler(text, index);
                                            }}
                                            containerStyles={{
                                                width: "100%",
                                            }}
                                            renderComponent={(props) => (
                                                <textarea
                                                    className={`${classes.textAreaTransliteration} ${currentIndex === index ? classes.boxHighlight : ""
                                                        }`}
                                                    rows={4}
                                                    {...props}
                                                />
                                            )}
                                        />
                                        : <textarea
                                            rows={4}
                                            className={`${classes.textAreaTransliteration} ${currentIndex === index ? classes.boxHighlight : ""
                                                }`}
                                            onChange={(event) => {
                                                changeTranscriptHandler(event.target.value, index);
                                            }}
                                            value={item.target_text}
                                        />}
                                </CardContent>
                            </>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
};

export default TranslationRightPanel;
