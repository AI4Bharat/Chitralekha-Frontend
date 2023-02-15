// Voice Over Right Panel

import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  CardContent,
  Grid,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import { useParams, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import C from "../../../redux/constants";
import { setSubtitles } from "../../../redux/actions/Common";
import TimeBoxes from "../../../common/TimeBoxes";
import ConfirmDialog from "../../../common/ConfirmDialog";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import ButtonComponent from "./components/ButtonComponent";
import {
  addSubtitleBox,
  base64toBlob,
  onMerge,
  onRedoAction,
  onSubtitleDelete,
  onUndoAction,
  setAudioContent,
  timeChange,
} from "../../../utils/subtitleUtils";
import VideoLandingStyle from "../../../styles/videoLandingStyles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FetchTranscriptPayloadAPI from "../../../redux/actions/api/Project/FetchTranscriptPayload";
import APITransport from "../../../redux/actions/apitransport/apitransport";

const VoiceOverRightPanel = ({ currentIndex }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const xl = useMediaQuery('(min-width:1600px)');
  
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

  const getPayloadAPI = (_event, value) => {
    const payloadObj = new FetchTranscriptPayloadAPI(
      taskData.id,
      taskData.task_type,
      value
    );
    dispatch(APITransport(payloadObj));
  };

  const onDelete = useCallback(
    (index) => {
      const data = subtitles[index];
      const sub = onSubtitleDelete(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      setUndoStack([
        ...undoStack,
        {
          type: "delete",
          index: index,
          data: data,
        },
      ]);
      setRedoStack([]);
    },
    [undoStack, subtitles]
  );

  const onMergeClick = useCallback(
    (index) => {
      const selectionStart = subtitles[index].text.length;
      const targetSelectionStart = subtitles[index].target_text.length;
      const sub = onMerge(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      saveTranscriptHandler(false, true, sub);
      setUndoStack([
        ...undoStack,
        {
          type: "merge",
          index: index,
          selectionStart: selectionStart,
          targetSelectionStart: targetSelectionStart,
        },
      ]);
      setRedoStack([]);
    },
    [undoStack, subtitles]
  );

  useEffect(() => {
    setTextChangeBtn(subtitlesForCheck?.map(() => false));
  }, [subtitlesForCheck]);

  useEffect(() => {
    let updatedArray = [];

    if (!!subtitles) {
      const recorderArray = subtitles.map(() => "stop");
      setRecordAudio(recorderArray);
      setData(new Array(recorderArray.length));
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

  useEffect(() => {
    const subtitleScrollEle = document.getElementById(
      "subtitleContainerTranslation"
    );
    subtitleScrollEle
      .querySelector(`#sub_${currentIndex}`)
      ?.scrollIntoView(true, { block: "start" });
  }, [currentIndex]);

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

  const saveTranscriptHandler = async (isFinal, isAutosave) => {
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

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setLoading(false);

      setSnackbarInfo({
        open: isAutosave,
        message: resp?.message
          ? resp?.message
          : isAutosave
          ? "Saved as draft"
          : "Translation Submitted Successfully",
        variant: "success",
      });
      if (isFinal) {
        setTimeout(() => {
          navigate(
            `/my-organization/${assignedOrgId}/project/${taskData?.project}`
          );
        }, 2000);
      }
    } else {
      setLoading(false);

      setSnackbarInfo({
        open: isAutosave,
        message: resp?.message,
        variant: "error",
      });
    }
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

  const addNewSubtitleBox = useCallback(
    (index) => {
      const sub = addSubtitleBox(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      setUndoStack([
        ...undoStack,
        {
          type: "add",
          index: index,
        },
      ]);
      setRedoStack([]);
    },
    [undoStack]
  );

  const handleStartRecording = (index) => {
    updateRecorderState(RecordState.START, index);
  };

  const updateRecorderState = (newState, index) => {
    const updatedArray = Object.assign([], recordAudio);
    updatedArray[index] = newState;
    setRecordAudio(updatedArray);
  };

  const onStopRecording = (data, index) => {
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
      updateRecorderState(RecordState.STOP, index);
    }
  };

  const handleStopRecording = (index) => {
    updateRecorderState(RecordState.STOP, index);
  };

  const sourceLength = (index) => {
    if (sourceText[index]?.text.trim() !== "")
      return sourceText[index]?.text.trim().split(" ").length;
    return 0;
  };

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
              <>
                <Box
                  display="flex"
                  paddingTop="16px"
                  sx={{ paddingX: "20px", justifyContent: "space-between" }}
                >
                  <Typography variant="body1" className={classes.durationBox}>
                    Duration: {item.time_difference} ms
                  </Typography>

                  <ButtonComponent
                    index={index}
                    lastItem={index < sourceText.length - 1}
                    onMergeClick={onMergeClick}
                    onDelete={onDelete}
                    addNewSubtitleBox={addNewSubtitleBox}
                    handleStartRecording={handleStartRecording}
                    handleStopRecording={handleStopRecording}
                    recordAudio={recordAudio}
                    showChangeBtn={textChangeBtn[index]}
                    saveTranscriptHandler={saveTranscriptHandler}
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
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                      <div
                        className={classes.relative}
                        style={{ width: "100%" }}
                      >
                        <textarea
                          rows={4}
                          className={`${classes.textAreaTransliteration} ${
                            currentIndex === index ? classes.boxHighlight : ""
                          }`}
                          dir={enableRTL_Typing ? "rtl" : "ltr"}
                          style={{
                            fontSize: fontSize,
                            height: "100px",
                            margin: "15px 0 25px 0",
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
                        />
                        <span
                          className={classes.wordCount}
                          style={{
                            left: "25px",
                            ...(!xl && {
                              left: "10px",
                              bottom: "5px",
                            }),
                          }}
                        >
                          {sourceLength(index)}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                      <div className={classes.recorder}>
                        <div style={{ display: "none" }}>
                          <AudioReactRecorder
                            state={recordAudio[index]}
                            onStop={(data) => onStopRecording(data, index)}
                          />
                        </div>
                        {recordAudio[index] == "stop" ? (
                          <div>
                            <audio src={data[index]} controls />
                          </div>
                        ) : (
                          <div style={{ color: "#fff", margin: "18px auto" }}>
                            Recording Audio....
                          </div>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </>
            );
          })}
        </Box>

        <Box
          className={classes.paginationBox}
          style={{
            ...(!xl && {
              bottom: "5%",
            }),
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={getPayloadAPI}
            className={classes.paginationItems}
            color="primary"
            shape="rounded"
            variant="outlined"
          />
        </Box>

        {openConfirmDialog && (
          <ConfirmDialog
            openDialog={openConfirmDialog}
            handleClose={() => setOpenConfirmDialog(false)}
            submit={() => saveTranscriptHandler(true, false)}
            message={"Do you want to submit the translation?"}
            loading={loading}
          />
        )}
      </Box>
    </>
  );
};

export default VoiceOverRightPanel;
