import React, { useCallback, useEffect, useState, memo } from "react";
import Box from "@mui/material/Box";
import { CardContent, Grid } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import { useNavigate, useParams } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import { setSubtitles } from "../../../redux/actions/Common";
import C from "../../../redux/constants";
import TimeBoxes from "../../../common/TimeBoxes";
import ConfirmDialog from "../../../common/ConfirmDialog";
import {
  addSubtitleBox,
  newSub,
  onMerge,
  onSplit,
  onSubtitleDelete,
  timeChange,
  onUndoAction,
  onRedoAction,
} from "../../../utils/subtitleUtils";
import ButtonComponent from "./components/ButtonComponent";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import VideoLandingStyle from "../../../styles/videoLandingStyles";

const RightPanel = ({ currentIndex, player }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const [showPopOver, setShowPopOver] = useState(false);
  const [selectionStart, setSelectionStart] = useState();
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [enableTransliteration, setTransliteration] = useState(true);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState("large");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    if (subtitles?.length === 0) {
      const defaultSubs = [
        newSub({
          start_time: "00:00:00.000",
          end_time: "00:00:00.000",
          text: "Please type here..",
        }),
      ];
      dispatch(setSubtitles(defaultSubs, C.SUBTITLES));
    } else {
      setSourceText(subtitles);
    }
  }, [subtitles]);

  useEffect(() => {
    const subtitleScrollEle = document.getElementById("subTitleContainer");
    subtitleScrollEle
      .querySelector(`#sub_${currentIndex}`)
      ?.scrollIntoView(true, { block: "start" });
  }, [currentIndex]);

  const onMergeClick = useCallback((index) => {
    const selectionStart = sourceText[index].text.length;
    const sub = onMerge(index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    setUndoStack([...undoStack, {
      type: "merge",
      index: index,
      selectionStart: selectionStart,
    }]);
    setRedoStack([]);
    saveTranscriptHandler(false, true, sub);
  }, [undoStack]);

  const onMouseUp = (e, blockIdx) => {
    if (e.target.selectionStart < e.target.value.length) {
      e.preventDefault();
      setShowPopOver(true);
      setCurrentIndexToSplitTextBlock(blockIdx);
      setSelectionStart(e.target.selectionStart);
    }
  };

  const onSplitClick = useCallback(() => {
    const sub = onSplit(currentIndexToSplitTextBlock, selectionStart);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    setUndoStack([...undoStack, {
      type: "split",
      index: currentIndexToSplitTextBlock,
      selectionStart: selectionStart,
    }]);
    setRedoStack([]);
    saveTranscriptHandler(false, true, sub);
  }, [currentIndexToSplitTextBlock, selectionStart, undoStack]);

  const changeTranscriptHandler = useCallback(
    (text, index) => {
      const arr = [...sourceText];
      arr.forEach((element, i) => {
        if (index === i) {
          element.text = text;
        }
      });

      dispatch(setSubtitles(arr, C.SUBTITLES));
      saveTranscriptHandler(false, false);
    },
    [sourceText]
  );

  const saveTranscriptHandler = async (
    isFinal,
    isAutosave,
    payload = sourceText
  ) => {
    setLoading(true);
    const reqBody = {
      task_id: taskId,
      payload: {
        payload: payload,
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
      setSnackbarInfo({
        open: isAutosave,
        message: resp?.message
          ? resp?.message
          : isAutosave
          ? "Saved as draft"
          : "",
        variant: "success",
      });
      setLoading(false);
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

  const handleTimeChange = useCallback((value, index, type, time) => {
    const sub = timeChange(value, index, type, time);
    dispatch(setSubtitles(sub, C.SUBTITLES));
  }, []);

  const onDelete = useCallback((index) => {
    let data = subtitles[index];
    const sub = onSubtitleDelete(index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    setUndoStack([...undoStack, {
      type: "delete",
      index: index,
      data: data,
    }]);
    setRedoStack([]);
  }, [undoStack]);

  const addNewSubtitleBox = useCallback((index) => {
    const sub = addSubtitleBox(index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    setUndoStack([...undoStack, {
      type: "add",
      index: index,
    }]);
    setRedoStack([]);
  }, [undoStack]);

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

  const targetLength = (index) => {
    if (sourceText[index]?.text.trim() !== "")
      return sourceText[index]?.text.trim().split(" ").length;
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

        <Box id={"subTitleContainer"} className={classes.subTitleContainer}>
          {sourceText?.map((item, index) => {
            return (
              <Box id={`sub_${index}`}>
                <Box className={classes.topBox}>
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
                    onSplitClick={onSplitClick}
                    showPopOver={showPopOver}
                    showSplit={true}
                  />

                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.end_time}
                    index={index}
                    type={"endTime"}
                  />
                </Box>

                <CardContent
                  className={classes.cardContent}
                  onClick={() => {
                    if (player) {
                      player.pause();
                      if (player.duration >= item.startTime) {
                        player.currentTime = item.startTime + 0.001;
                      }
                    }
                  }}
                >
                  {taskData?.src_language !== "en" && enableTransliteration ? (
                    <IndicTransliterate
                      lang={taskData?.src_language}
                      value={item.text}
                      onChangeText={(text) => {
                        changeTranscriptHandler(text, index);
                      }}
                      onMouseUp={(e) => onMouseUp(e, index)}
                      containerStyles={{
                        width: "90%",
                      }}
                      onBlur={() =>
                        setTimeout(() => {
                          setShowPopOver(false);
                        }, 200)
                      }
                      renderComponent={(props) => (
                        <div className={classes.relative}>
                          <textarea
                            className={`${classes.customTextarea} ${
                              currentIndex === index ? classes.boxHighlight : ""
                            }`}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            rows={4}
                            onMouseUp={(e) => onMouseUp(e, index)}
                            onBlur={() =>
                              setTimeout(() => {
                                setShowPopOver(false);
                              }, 200)
                            }
                            style={{ fontSize: fontSize, height: "120px" }}
                            {...props}
                          />
                          <span id="charNum" className={classes.wordCount}>
                            {targetLength(index)}
                          </span>
                        </div>
                      )}
                    />
                  ) : (
                    <div className={classes.relative}>
                      <textarea
                        onChange={(event) => {
                          changeTranscriptHandler(event.target.value, index);
                        }}
                        onMouseUp={(e) => onMouseUp(e, index)}
                        value={item.text}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        className={`${classes.customTextarea} ${
                          currentIndex === index ? classes.boxHighlight : ""
                        }`}
                        style={{
                          width: "90%",
                          fontSize: fontSize,
                          height: "120px",
                        }}
                        rows={4}
                        onBlur={() =>
                          setTimeout(() => {
                            setShowPopOver(false);
                          }, 200)
                        }
                      />
                      <span
                        id="charNum"
                        className={classes.wordCount}
                        style={{ right: "25px" }}
                      >
                        {targetLength(index)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Box>
            );
          })}
        </Box>

        {openConfirmDialog && (
          <ConfirmDialog
            openDialog={openConfirmDialog}
            handleClose={() => setOpenConfirmDialog(false)}
            submit={() => saveTranscriptHandler(true, true)}
            message={"Do you want to submit the transcript?"}
            loading={loading}
          />
        )}
      </Box>
    </>
  );
};

export default memo(RightPanel);
