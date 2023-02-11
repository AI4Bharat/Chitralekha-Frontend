// TranslationRightPanel

import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  CardContent,
  Grid,
  Typography,
  Switch,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ProjectStyle from "../../../styles/ProjectStyle";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import { useParams, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import FindAndReplace from "../../../common/FindAndReplace";
import C from "../../../redux/constants";
import { setSubtitles } from "../../../redux/actions/Common";
import { getUpdatedTime } from "../../../utils/utils";
import TimeBoxes from "../../../common/TimeBoxes";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Sub from "../../../utils/Sub";
import DT from "duration-time-conversion";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SaveIcon from "@mui/icons-material/Save";
import ConfirmDialog from "../../../common/ConfirmDialog";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckIcon from "@mui/icons-material/Check";
import MicIcon from "@mui/icons-material/MicOutlined";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import StopIcon from "@mui/icons-material/Stop";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import ButtonComponent from "./components/ButtonComponent";
import { onRedoAction, onUndoAction } from "../../../utils/subtitleUtils";
import VideoLandingStyle from "../../../styles/videoLandingStyles";

const VoiceOverRightPanel = ({ currentIndex }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fullscreen = useSelector((state) => state.commonReducer.fullscreen);
  const taskData = useSelector((state) => state.getTaskDetails.data);
  const assignedOrgId = JSON.parse(localStorage.getItem("userData"))
    ?.organization?.id;
  const subtitles = useSelector((state) => state.commonReducer.subtitles);
  const player = useSelector(state => state.commonReducer.player);

  const [showPopOver, setShowPopOver] = useState(false);
  const [sourceText, setSourceText] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [selectionStart, setSelectionStart] = useState();
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [enableTransliteration, setTransliteration] = useState(true);
  const [anchorEle, setAnchorEle] = useState(null);
  const [anchorPos, setAnchorPos] = useState({
    positionX: 0,
    positionY: 0,
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [fontSize, setFontSize] = useState("large");
  const [data, setData] = useState(new Array());
  const [url, setUrl] = useState(new Array());
  const [recordAudio, setRecordAudio] = useState(new Array());
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const newSub = useCallback((item) => new Sub(item), []);

  useEffect(() => {
    if (!!sourceText) {
      const recorderArray = sourceText.map(() => "stop");
      setRecordAudio(recorderArray);
      setData(new Array(recorderArray.length));
    }
  }, [sourceText]);

  const formatSub = useCallback(
    (sub) => {
      if (Array.isArray(sub)) {
        return sub.map((item) => newSub(item));
      }
      return newSub(sub);
    },
    [newSub]
  );

  const hasSub = useCallback((sub) => subtitles.indexOf(sub), [subtitles]);

  const copySubs = useCallback(
    () => formatSub(subtitles),
    [subtitles, formatSub]
  );

  const onDelete = (index) => {
    const copySub = copySubs();
    copySub.splice(index, 1);
    dispatch(setSubtitles(copySub, C.SUBTITLES));
  };

  const onMergeClick = (item, index) => {
    const existingsourceData = copySubs();

    existingsourceData.splice(
      index,
      2,
      newSub({
        start_time: existingsourceData[index].start_time,
        end_time: existingsourceData[index + 1].end_time,
        text: `${existingsourceData[index].text} ${
          existingsourceData[index + 1].text
        }`,
        target_text: `${existingsourceData[index].target_text} ${
          existingsourceData[index + 1].target_text
        }`,
      })
    );

    dispatch(setSubtitles(existingsourceData, C.SUBTITLES));
    setSourceText(existingsourceData);
    saveTranscriptHandler(false, true, existingsourceData);
  };

  const onMouseUp = (e, blockIdx) => {
    if (e.target.selectionStart < e.target.value.length) {
      e.preventDefault();
      setAnchorPos({
        positionX: e.clientX,
        positionY: e.clientY,
      });
      setShowPopOver(true);
      setAnchorEle(e.currentTarget);
      setCurrentIndexToSplitTextBlock(blockIdx);
      setSelectionStart(e.target.selectionStart);
    }
  };

  useEffect(() => {
    setSourceText(subtitles);
  }, [subtitles]);

  const onReplacementDone = (updatedSource) => {
    setSourceText(updatedSource);
    dispatch(setSubtitles(updatedSource, C.SUBTITLES));
    saveTranscriptHandler(false, true);
  };

  const changeTranscriptHandler = (text, index, type) => {
    const arr = [...sourceText];

    arr.forEach((element, i) => {
      if (index === i) {
        if (type === "transaltion") {
          element.target_text = text;
        } else {
          element.text = text;
        }
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

  const onSplitClick = () => {
    const copySub = [...sourceText];

    const targetTextBlock = sourceText[currentIndexToSplitTextBlock];
    const index = hasSub(subtitles[currentIndexToSplitTextBlock]);

    const text1 = targetTextBlock.text.slice(0, selectionStart).trim();
    const text2 = targetTextBlock.text.slice(selectionStart).trim();

    if (!text1 || !text2) return;

    const splitDuration = (
      targetTextBlock.duration *
      (selectionStart / targetTextBlock.text.length)
    ).toFixed(3);

    if (splitDuration < 0.2 || targetTextBlock.duration - splitDuration < 0.2)
      return;

    copySub.splice(currentIndexToSplitTextBlock, 1);
    const middleTime = DT.d2t(
      targetTextBlock.startTime + parseFloat(splitDuration)
    );

    copySub.splice(
      index,
      0,
      newSub({
        start_time: subtitles[currentIndexToSplitTextBlock].start_time,
        end_time: middleTime,
        text: text1,
      })
    );

    copySub.splice(
      index + 1,
      0,
      newSub({
        start_time: middleTime,
        end_time: subtitles[currentIndexToSplitTextBlock].end_time,
        text: text2,
      })
    );

    dispatch(setSubtitles(copySub, C.SUBTITLES));
    setSourceText(copySub);
    saveTranscriptHandler(false, true, copySub);
  };

  const handleTimeChange = (value, index, type, time) => {
    const copySub = [...sourceText];

    if (type === "startTime") {
      copySub[index].start_time = getUpdatedTime(
        value,
        time,
        copySub[index].start_time
      );
    } else {
      copySub[index].end_time = getUpdatedTime(
        value,
        time,
        copySub[index].start_time
      );
    }

    dispatch(setSubtitles(copySub, C.SUBTITLES));
    setSourceText(copySub);
  };

  const addNewSubtitleBox = (index) => {
    const copySub = copySubs();

    copySub.splice(
      index + 1,
      0,
      newSub({
        start_time: copySub[index].end_time,
        end_time:
          index < sourceText.length - 1
            ? copySub[index + 1].start_time
            : copySub[index].end_time,
        text: "SUB_TEXT",
        target_text: "SUB_TEXT",
      })
    );

    dispatch(setSubtitles(copySub, C.SUBTITLES));
    setSourceText(copySub);
  };

  const fontMenu = [
    {
      label: "small",
      size: "small",
    },
    {
      label: "Normal",
      size: "large",
    },
    {
      label: "Large",
      size: "x-large",
    },
    {
      size: "xx-large",
      label: "Huge",
    },
  ];

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

  const targetLength = (index) => {
    if (sourceText[index]?.target_text.trim() !== "")
      return sourceText[index]?.target_text.trim().split(" ").length;
    return 0;
  };

  return (
    <>
      {renderSnackBar()}

      <Box className={classes.rightPanelParentBox}>
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
                  sx={{ paddingX: "20px", justifyContent: "space-around" }}
                >
                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.start_time}
                    index={index}
                    type={"startTime"}
                  />

                  <ButtonComponent
                    index={index}
                    lastItem={index < sourceText.length - 1}
                    onMergeClick={onMergeClick}
                    onDelete={onDelete}
                    addNewSubtitleBox={addNewSubtitleBox}
                  />

                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.end_time}
                    index={index}
                    type={"endTime"}
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
                  <div className={classes.relative} style={{ width: "100%" }}>
                    <textarea
                      rows={4}
                      className={`${classes.textAreaTransliteration} ${
                        currentIndex === index ? classes.boxHighlight : ""
                      }`}
                      dir={enableRTL_Typing ? "rtl" : "ltr"}
                      style={{ fontSize: fontSize, height: "100px" }}
                      value={item.text}
                      onChange={(event) => {
                        changeTranscriptHandler(
                          event.target.value,
                          index,
                          "transcript"
                        );
                      }}
                    />
                    <span
                      className={classes.wordCount}
                      style={{
                        color:
                          Math.abs(sourceLength(index) - targetLength(index)) >=
                          3
                            ? "red"
                            : "green",
                        left: "25px",
                      }}
                    >
                      {sourceLength(index)}
                    </span>
                  </div>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Grid
                      container
                      spacing={2}
                      style={{ justifyContent: "center" }}
                    >
                      <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        {recordAudio[index] == "stop" ||
                        recordAudio[index] == "" ? (
                          <IconButton
                            onClick={() => handleStartRecording(index)}
                          >
                            <MicIcon color="secondary" fontSize="large" />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => handleStopRecording(index)}
                          >
                            <StopIcon color="secondary" fontSize="large" />
                          </IconButton>
                        )}
                        <div style={{ display: "none" }}>
                          <AudioReactRecorder
                            state={recordAudio[index]}
                            onStop={(data) => onStopRecording(data, index)}
                            style={{ display: "none" }}
                          />
                        </div>
                        {recordAudio[index] == "stop" ? (
                          <div>
                            <audio src={data[index]} controls />
                          </div>
                        ) : (
                          <></>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Typography color="secondary" variant="h3">
                          or
                        </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton>
                          <UploadIcon color="secondary" fontSize="large" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </>
            );
          })}
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
