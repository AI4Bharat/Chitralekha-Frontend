// TranslationRightPanel

import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { CardContent, Grid } from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import { useDispatch, useSelector } from "react-redux";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import { useParams, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../../common/Snackbar";
import "../../../styles/ScrollbarStyle.css";
import C from "../../../redux/constants";
import { setSubtitles } from "../../../redux/actions/Common";
import TimeBoxes from "../../../common/TimeBoxes";
import ConfirmDialog from "../../../common/ConfirmDialog";
import {
  addSubtitleBox,
  onMerge,
  onSubtitleDelete,
  timeChange,
  onUndoAction,
  onRedoAction,
} from "../../../utils/subtitleUtils";
import ButtonComponent from "./components/ButtonComponent";
import { memo } from "react";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import VideoLandingStyle from "../../../styles/videoLandingStyles";

const TranslationRightPanel = ({ currentIndex, player }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [enableTransliteration, setTransliteration] = useState(true);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState("large");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const onDelete = useCallback((index) => {
    const data = subtitles[index];
    const sub = onSubtitleDelete(index); 
    dispatch(setSubtitles(sub, C.SUBTITLES));
    setUndoStack([...undoStack, {
      type: "delete",
      index: index,
      data: data,
    }]);
    setRedoStack([]);
  }, [undoStack, subtitles]);

  const onMergeClick = useCallback((index) => {
    const selectionStart = subtitles[index].text.length;
    const targetSelectionStart = subtitles[index].target_text.length;
    const sub = onMerge(index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    saveTranscriptHandler(false, true, sub);
    setUndoStack([...undoStack, {
      type: "merge",
      index: index,
      selectionStart: selectionStart,
      targetSelectionStart: targetSelectionStart,
    }]);
    setRedoStack([]);
  }, [undoStack, subtitles]);

  useEffect(() => {
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
              <Box id={`sub_${index}`}>
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

                  {enableTransliteration ? (
                    <IndicTransliterate
                      lang={taskData?.target_language}
                      value={item.target_text}
                      onChangeText={(text) => {
                        changeTranscriptHandler(text, index, "transaltion");
                      }}
                      containerStyles={{
                        width: "100%",
                      }}
                      style={{ fontSize: fontSize, height: "100px" }}
                      renderComponent={(props) => (
                        <div className={classes.relative}>
                          <textarea
                            className={`${classes.textAreaTransliteration} ${
                              currentIndex === index ? classes.boxHighlight : ""
                            }`}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            rows={4}
                            {...props}
                          />
                          <span
                            className={classes.wordCount}
                            style={{
                              color:
                                Math.abs(
                                  sourceLength(index) - targetLength(index)
                                ) >= 3
                                  ? "red"
                                  : "green",
                              right: "25px",
                            }}
                          >
                            {targetLength(index)}
                          </span>
                        </div>
                      )}
                    />
                  ) : (
                    <div className={classes.relative} style={{ width: "100%" }}>
                      <textarea
                        rows={4}
                        className={`${classes.textAreaTransliteration} ${
                          currentIndex === index ? classes.boxHighlight : ""
                        }`}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        style={{ fontSize: fontSize, height: "100px" }}
                        onChange={(event) => {
                          changeTranscriptHandler(
                            event.target.value,
                            index,
                            "transaltion"
                          );
                        }}
                        value={item.target_text}
                      />
                      <span
                        className={classes.wordCount}
                        style={{
                          color:
                            Math.abs(
                              sourceLength(index) - targetLength(index)
                            ) >= 3
                              ? "red"
                              : "green",
                          right: "25px",
                        }}
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
            submit={() => saveTranscriptHandler(true, false)}
            message={"Do you want to submit the translation?"}
            loading={loading}
          />
        )}
      </Box>
    </>
  );
};

export default memo(TranslationRightPanel);
