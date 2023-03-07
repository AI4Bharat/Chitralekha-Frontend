// Voice Over Right Panel

import React, { useCallback, useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import { CardContent, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import { useParams, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import C from "../../../redux/constants";
import {
  setCurrentPage,
  setNextPage,
  setPreviousPage,
  setSubtitles,
  setSubtitlesForCheck,
  setTotalPages,
} from "../../../redux/actions/Common";
import ConfirmDialog from "../../../common/ConfirmDialog";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import ButtonComponent from "./components/ButtonComponent";
import {
  base64toBlob,
  getSubtitleRange,
  onRedoAction,
  onUndoAction,
  setAudioContent,
} from "../../../utils/subtitleUtils";
import VideoLandingStyle from "../../../styles/videoLandingStyles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FetchTranscriptPayloadAPI from "../../../redux/actions/api/Project/FetchTranscriptPayload";
import APITransport from "../../../redux/actions/apitransport/apitransport";
// import FastForwardIcon from "@mui/icons-material/FastForward";
// import FastRewindIcon from "@mui/icons-material/FastRewind";
import Pagination from "./components/Pagination";
import Sub from "../../../utils/Sub";
import { cloneDeep } from "lodash";
import ConfirmErrorDialog from "../../../common/ConfirmErrorDialog";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";

const VoiceOverRightPanel = ({ currentIndex }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const xl = useMediaQuery("(min-width:1800px)");
  const $audioRef = useRef([]);

  const taskData = useSelector((state) => state.getTaskDetails.data);
  const assignedOrgId = JSON.parse(localStorage.getItem("userData"))
    ?.organization?.id;
  const subtitles = useSelector((state) => state.commonReducer.subtitles);
  const player = useSelector((state) => state.commonReducer.player);
  const subtitlesForCheck = useSelector(
    (state) => state.commonReducer.subtitlesForCheck
  );
  const totalPages = useSelector((state) => state.commonReducer.totalPages);
  const currentPage = useSelector((state) => state.commonReducer.currentPage);
  const next = useSelector((state) => state.commonReducer.nextPage);
  const previous = useSelector((state) => state.commonReducer.previousPage);
  // const transcriptPayload = useSelector(
  //   (state) => state.getTranscriptPayload.data
  // );

  const [sourceText, setSourceText] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [enableTransliteration, setTransliteration] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState("large");
  const [data, setData] = useState(new Array());
  const [recordAudio, setRecordAudio] = useState(new Array());
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [textChangeBtn, setTextChangeBtn] = useState([]);
  // const [audioPlaybackRate, setAudioPlaybackRate] = useState([]);
  const [audioPlayer, setAudioPlayer] = useState([]);
  const [speedChangeBtn, setSpeedChangeBtn] = useState([]);
  const [openConfirmErrorDialog, setOpenConfirmErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorResponse, setErrorResponse] = useState([]);
  const [durationError, setDurationError] = useState([]);

  useEffect(() => {
    setAudioPlayer($audioRef.current);
  }, [$audioRef.current]);

  useEffect(() => {
    let temp = [];
    subtitlesForCheck?.forEach(() => temp.push(1));

    $audioRef.current = $audioRef.current.slice(0, subtitlesForCheck?.length);
    // setAudioPlaybackRate(temp);
    setTextChangeBtn(subtitlesForCheck?.map(() => false));
    setSpeedChangeBtn(subtitlesForCheck?.map(() => false));
    setDurationError(subtitlesForCheck?.map(() => false));
  }, [subtitlesForCheck]);

  useEffect(() => {
    let updatedArray = [];

    if (!!subtitles) {
      const recorderArray = subtitles.map(() => "stop");
      setRecordAudio(recorderArray);
      setData(new Array(recorderArray.length));
      updatedArray = subtitles.map(() => "");
    }

    subtitles?.forEach((item, index) => {
      if (item.audio && item.audio.hasOwnProperty("audioContent")) {
        const blobUrl = base64toBlob(item.audio.audioContent);
        item.blobUrl = blobUrl;
        updatedArray[index] = blobUrl;
      }
    });

    setData(updatedArray);
    setSourceText(subtitles);
  }, [subtitles]);

  const changeTranscriptHandler = (text, index, type) => {
    const arr = [...sourceText];
    const temp = [...textChangeBtn];

    subtitlesForCheck.forEach((item, i) => {
      if (index === i) {
        if (item.text === text) {
          temp[index] = false;
        } else {
          temp[index] = true;
        }
      }
    });

    arr.forEach((element, i) => {
      if (index === i) {
        element.text = text;
        element.text_changed = temp[index];
      }
    });

    setTextChangeBtn(temp);
    dispatch(setSubtitles(arr, C.SUBTITLES));
    // saveTranscriptHandler(false, false);
  };

  const saveTranscriptHandler = async (
    isFinal,
    isAutosave,
    isGetUpdatedAudio
  ) => {
    const reqBody = {
      task_id: taskId,
      payload: {
        payload: sourceText,
      },
      offset: currentPage,
    };

    if (isFinal) {
      reqBody.final = true;
    }

    if (isAutosave) {
      setSnackbarInfo({
        open: true,
        message: "Saving...",
        variant: "info",
      });
    }

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      setLoading(false);
      setOpenConfirmDialog(false);

      if (isFinal) {
        navigate(
          `/my-organization/${assignedOrgId}/project/${taskData?.project}`
        );
      }

      setSnackbarInfo({
        open: isAutosave,
        message: resp?.message
          ? resp?.message
          : isAutosave
          ? "Saved as draft"
          : "Translation Submitted Successfully",
        variant: "success",
      });

      if (isGetUpdatedAudio) {
        const sub = resp?.payload?.payload.map((item) => new Sub(item));

        const newSub = cloneDeep(sub);

        dispatch(setCurrentPage(resp?.current));
        dispatch(setNextPage(resp?.next));
        dispatch(setPreviousPage(resp?.previous));
        dispatch(setTotalPages(resp?.count));
        dispatch(setSubtitlesForCheck(newSub));
        dispatch(setSubtitles(sub, C.SUBTITLES));
      }
    } else {
      setLoading(false);
      setOpenConfirmDialog(false);

      if (isFinal) {
        setOpenConfirmErrorDialog(true);
        setErrorMessage(resp.message);
        setErrorResponse(resp.missing_cards_info);
      }

      setSnackbarInfo({
        open: isAutosave,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const getPayloadAPI = (value) => {
    const payloadObj = new FetchTranscriptPayloadAPI(
      taskData.id,
      taskData.task_type,
      value
    );
    dispatch(APITransport(payloadObj));
  };

  const onNavigationClick = (value) => {
    // saveTranscriptHandler(false, true);
    getPayloadAPI(value);
  };

  const onUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      const sub = onUndoAction(lastAction);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
      setRedoStack([...redoStack, lastAction]);
    }
  }, [undoStack, redoStack]);

  const onRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const lastAction = redoStack[redoStack.length - 1];
      const sub = onRedoAction(lastAction);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
      setUndoStack([...undoStack, lastAction]);
    }
  }, [undoStack, redoStack]);

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

  const handleStartRecording = (index) => {
    updateRecorderState(RecordState.START, index);
  };

  const updateRecorderState = (newState, index) => {
    const updatedArray = Object.assign([], recordAudio);
    updatedArray[index] = newState;
    setRecordAudio(updatedArray);
  };

  const onStopRecording = (data, index) => {
    updateRecorderState(RecordState.STOP, index);

    if (data && data.hasOwnProperty("url")) {
      const updatedArray = Object.assign([], data);
      updatedArray[index] = data.url;

      const reader = new FileReader();

      let base64data;
      reader.readAsDataURL(data.blob);
      reader.onloadend = function () {
        base64data = reader.result;
        const encode = base64data.replace("data:audio/wav;base64,", "");
        updatedArray.audioContent = encode;
        const updatedSourceText = setAudioContent(index, encode);
        dispatch(setSubtitles(updatedSourceText, C.SUBTITLES));
      };

      setData(updatedArray);
    }

    setTimeout(() => {
      const temp = [...durationError];
      if (subtitles[index].time_difference < audioPlayer[index].duration) {
        temp[index] = true;
      } else {
        temp[index] = false;
      }
      setDurationError(temp);
    }, 500);
  };

  const handleStopRecording = (index) => {
    updateRecorderState(RecordState.STOP, index);
  };

  const handlePauseRecording = (index) => {
    updateRecorderState(RecordState.PAUSE, index);
  };

  // const playbackRateHandler = (rate, index) => {
  //   if (rate <= 2.1) {
  //     const arr = [...sourceText];
  //     const speed = [...speedChangeBtn];

  //     if (rate !== 1) {
  //       speed[index] = true;
  //     } else {
  //       speed[index] = false;
  //     }

  //     arr.forEach((element, i) => {
  //       if (index === i) {
  //         element.audio_speed = Math.round(audioPlaybackRate[index] * 10) / 10;
  //       }
  //     });

  //     const tempArr = [...audioPlayer];
  //     tempArr[index].playbackRate = rate;

  //     const temp = [...audioPlaybackRate];
  //     temp[index] = rate;

  //     setSpeedChangeBtn(speed);
  //     setAudioPlayer(tempArr);
  //     setAudioPlaybackRate(temp);
  //   }
  // };

  return (
    <>
      {renderSnackBar()}

      <Box
        className={classes.rightPanelParentBox}
        style={{ position: "relative" }}
      >
        <Grid className={classes.rightPanelParentGrid}>
          <SettingsButtonComponent
            setTransliteration={setTransliteration}
            enableTransliteration={enableTransliteration}
            setRTL_Typing={setRTL_Typing}
            enableRTL_Typing={enableRTL_Typing}
            setFontSize={setFontSize}
            fontSize={fontSize}
            saveTranscriptHandler={saveTranscriptHandler}
            setOpenConfirmDialog={setOpenConfirmDialog}
            onUndo={onUndo}
            onRedo={onRedo}
            undoStack={undoStack}
            redoStack={redoStack}
          />
        </Grid>

        <Box
          className={classes.subTitleContainer}
          id={"subtitleContainerTranslation"}
        >
          {sourceText?.map((item, index) => {
            return (
              <div style={{ borderBottom: "1px solid grey" }}>
                <Box
                  display="flex"
                  paddingTop="25px"
                  sx={{ paddingX: "20px", justifyContent: "space-between" }}
                >
                  <Typography
                    variant="body1"
                    className={classes.durationBox}
                    marginRight={"5px"}
                  >
                    {item.id}
                  </Typography>

                  <Typography
                    variant="body1"
                    className={classes.durationBox}
                    marginRight={"auto"}
                  >
                    Duration: {item.time_difference} sec
                  </Typography>

                  <ButtonComponent
                    index={index}
                    handleStartRecording={handleStartRecording}
                    handleStopRecording={handleStopRecording}
                    recordAudio={recordAudio}
                    showChangeBtn={textChangeBtn[index]}
                    saveTranscriptHandler={saveTranscriptHandler}
                    showSpeedChangeBtn={speedChangeBtn[index]}
                    handlePauseRecording={handlePauseRecording}
                    durationError={durationError}
                  />
                </Box>

                <CardContent
                  style={{
                    display: "flex",
                    padding: "5px 0",
                    paddingBottom: "0",
                    borderBottom: 2,
                    flexWrap: "wrap",
                    ...(!xl && {
                      paddingBottom: "20px",
                    }),
                  }}
                  onClick={() => {
                    if (player) {
                      player.pause();
                      if (player.duration >= item.startTime) {
                        player.currentTime = item.startTime + 0.001;
                      }
                    }
                  }}
                >
                  <Box sx={{ width: "50%", ...(!xl && { width: "100%" }) }}>
                    <div className={classes.relative} style={{ width: "100%" }}>
                      {/* <textarea
                        rows={4}
                        className={`${classes.textAreaTransliteration} ${
                          currentIndex === index ? classes.boxHighlight : ""
                        }`}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        style={{
                          fontSize: fontSize,
                          height: "100px",
                          // margin: "15px 0 25px 0",
                          width: "89%",
                          ...(xl && {
                            width: "80%",
                            margin: "15px 0",
                          }),
                        }}
                        value={item.text}
                        onChange={(event) => {
                          changeTranscriptHandler(
                            event.target.value,
                            index,
                            "voiceover"
                          );
                        }}
                      /> */}

                      {taskData?.target_language !== "en" &&
                      enableTransliteration ? (
                        <IndicTransliterate
                          lang={taskData?.target_language}
                          value={item.text}
                          onChangeText={(text) => {
                            changeTranscriptHandler(text, index);
                          }}
                          style={{
                            fontSize: fontSize,
                            height: "100px",
                            width: "89%",
                            ...(xl && {
                              width: "80%",
                              margin: "15px 0",
                            }),
                          }}
                          renderComponent={(props) => (
                            <div>
                              <textarea
                                className={`${
                                  classes.textAreaTransliteration
                                } ${
                                  currentIndex === index
                                    ? classes.boxHighlight
                                    : ""
                                }`}
                                dir={enableRTL_Typing ? "rtl" : "ltr"}
                                rows={4}
                                {...props}
                              />
                            </div>
                          )}
                        />
                      ) : (
                        <div>
                          <textarea
                            onChange={(event) => {
                              changeTranscriptHandler(
                                event.target.value,
                                index
                              );
                            }}
                            style={{
                              fontSize: fontSize,
                              height: "100px",
                              width: "89%",
                              ...(xl && {
                                width: "80%",
                                margin: "15px 0",
                              }),
                            }}
                            value={item.text}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            className={`${classes.textAreaTransliteration} ${
                              currentIndex === index ? classes.boxHighlight : ""
                            }`}
                            rows={4}
                          />
                        </div>
                      )}
                    </div>
                  </Box>

                  <Box sx={{ width: "50%", ...(!xl && { width: "100%" }) }}>
                    <div className={classes.recorder}>
                      <div style={{ display: "none" }}>
                        <AudioReactRecorder
                          state={recordAudio[index]}
                          onStop={(data) => onStopRecording(data, index)}
                        />
                      </div>
                      <div
                        className={classes.audioBox}
                        style={
                          !xl
                            ? {
                                alignItems: "center",
                                flexDirection: "row",
                                width: "100%",
                              }
                            : {}
                        }
                      >
                        <audio
                          src={data[index]}
                          controls
                          ref={(element) =>
                            ($audioRef.current[index] = element)
                          }
                          style={{
                            display: recordAudio[index] == "stop" ? "" : "none",
                          }}
                        />

                        {/* <div
                            className={classes.playbackRate}
                            style={{
                              margin: !xl ? "0" : "",
                              display:
                                transcriptPayload.source_type ===
                                "MACHINE_GENERATED"
                                  ? "none"
                                  : "",
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                audioPlaybackRate[index] >= 0.2 &&
                                playbackRateHandler(
                                  audioPlaybackRate[index] - 0.1,
                                  index
                                )
                              }
                              sx={{ color: " #fff" }}
                            >
                              <FastRewindIcon />
                            </IconButton>

                            <p style={{ margin: 0, color: " #fff" }}>
                              {Math.round(audioPlaybackRate[index] * 10) / 10}x
                            </p>

                            <IconButton
                              onClick={() =>
                                audioPlaybackRate[index] <= 15.9 &&
                                playbackRateHandler(
                                  audioPlaybackRate[index] + 0.1,
                                  index
                                )
                              }
                              sx={{ color: " #fff" }}
                            >
                              <FastForwardIcon />
                            </IconButton>
                          </div> */}
                      </div>
                      <div
                        style={{
                          color: "#fff",
                          margin: "18px auto",
                          display: recordAudio[index] == "stop" ? "none" : "",
                        }}
                      >
                        Recording Audio....
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </div>
            );
          })}
        </Box>

        <Box
          className={classes.paginationBox}
          style={{
            ...(!xl && {
              bottom: "-11%",
            }),
          }}
        >
          <Pagination
            range={getSubtitleRange()}
            rows={totalPages + 2}
            previous={previous}
            next={next}
            onClick={onNavigationClick}
            jumpTo={[...Array(totalPages).keys()].map((_, index) => index + 1)}
          />
        </Box>

        {openConfirmDialog && (
          <ConfirmDialog
            openDialog={openConfirmDialog}
            handleClose={() => setOpenConfirmDialog(false)}
            submit={() => saveTranscriptHandler(true, false)}
            message={"Do you want to submit the Voice Over?"}
            loading={loading}
          />
        )}

        {openConfirmErrorDialog && (
          <ConfirmErrorDialog
            message={errorMessage}
            openDialog={openConfirmErrorDialog}
            handleClose={() => setOpenConfirmErrorDialog(false)}
            response={errorResponse}
          />
        )}
      </Box>
    </>
  );
};

export default VoiceOverRightPanel;