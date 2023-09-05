import React, { useCallback, useEffect, useState, useRef, memo } from "react";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addSubtitleBox,
  getSubtitleRangeTranscript,
  onMerge,
  onSplit,
  onSubtitleChange,
  onSubtitleDelete,
  timeChange,
  onUndoAction,
  onRedoAction,
  getSelectionStart,
  getTimings,
  getItemForDelete,
  MenuProps,
  assignSpeakerId,
  getTagsList,
} from "utils";

//Styles
import "../../../styles/scrollbarStyle.css";
import { VideoLandingStyle } from "styles";

//Components
import {
  Box,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
  Popover,
  Typography,
  Button
} from "@mui/material";
import { ConfirmDialog, TagsSuggestionList, TimeBoxes } from "common";
import ButtonComponent from "./components/ButtonComponent";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import Pagination from "./components/Pagination";

//APIs
import C from "redux/constants";
import {
  APITransport,
  FetchTranscriptPayloadAPI,
  SaveTranscriptAPI,
  setSnackBar,
  setSubtitles,
} from "redux/actions";

const RightPanel = ({ currentIndex }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const xl = useMediaQuery("(min-width:1800px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? ' -popover' : undefined;
  const taskData = useSelector((state) => state.getTaskDetails.data);
  const assignedOrgId = JSON.parse(localStorage.getItem("userData"))
    ?.organization?.id;
  const subtitles = useSelector((state) => state.commonReducer.subtitles);
  const player = useSelector((state) => state.commonReducer.player);
  const totalPages = useSelector((state) => state.commonReducer.totalPages);
  const currentPage = useSelector((state) => state.commonReducer.currentPage);
  const next = useSelector((state) => state.commonReducer.nextPage);
  const previous = useSelector((state) => state.commonReducer.previousPage);
  const completedCount = useSelector(
    (state) => state.commonReducer.completedCount
  );
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );
  const limit = useSelector((state) => state.commonReducer.limit);
  const videoDetails = useSelector((state) => state.getVideoDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const [subsuper, setsubsuper] = useState(true)
  const [showPopOver, setShowPopOver] = useState(false);
  const [selectionStart, setSelectionStart] = useState();
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [enableTransliteration, setTransliteration] = useState(true);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [fontSize, setFontSize] = useState("large");
  const [currentOffset, setCurrentOffset] = useState(1);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showSpeakerIdDropdown, setShowSpeakerIdDropdown] = useState([]);
  const [speakerIdList, setSpeakerIdList] = useState([]);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);
  const [tagSuggestionsAnchorEl, setTagSuggestionsAnchorEl] = useState(null);
  const [tagSuggestionList, setTagSuggestionList] = useState([]);
  const [textWithoutBackSlash, setTextWithoutBackSlash] = useState("");
  const [textAfterBackSlash, setTextAfterBackSlash] = useState("");
  const [enableTransliterationSuggestion, setEnableTransliterationSuggestion] =
    useState(true);
  const [complete, setComplete] = useState(false);
  const [autoSave, setAutoSave] = useState(false);

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress && success && apiType === "SAVE_TRANSCRIPT") {
      if (!autoSave) {
        dispatch(setSnackBar({ open: false }));
      }

      if (complete) {
        setTimeout(() => {
          navigate(
            `/my-organization/${assignedOrgId}/project/${taskData?.project}`
          );
          setComplete(false);
        }, 2000);
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  useEffect(() => {
    if (videoDetails.hasOwnProperty("video")) {
      const speakerList = videoDetails?.video?.speaker_info?.map((speaker) => {
        return speaker;
      });
      setSpeakerIdList(speakerList);
      setShowSpeakerIdDropdown(videoDetails?.video?.multiple_speaker);
    }
  }, [videoDetails]);

  useEffect(() => {
    if (currentPage) {
      setCurrentOffset(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const subtitleScrollEle = document.getElementById("subTitleContainer");
    subtitleScrollEle
      .querySelector(`#sub_${currentIndex}`)
      ?.scrollIntoView(true, { block: "start" });
  }, [currentIndex]);

  const getPayload = (offset = currentOffset, lim = limit) => {
    const payloadObj = new FetchTranscriptPayloadAPI(
      taskData.id,
      taskData.task_type,
      offset,
      lim
    );
    dispatch(APITransport(payloadObj));
  };

  const prevOffsetRef = useRef(currentOffset);
  useEffect(() => {
    if (prevOffsetRef.current !== currentOffset) {
      setUndoStack([]);
      setRedoStack([]);
      prevOffsetRef.current = currentOffset;
    }
    getPayload(currentOffset, limit);
    // eslint-disable-next-line
  }, [limit, currentOffset]);

  useEffect(() => {
    var selectedText = "";
    document.addEventListener("mouseup", function (event) {
      selectedText = getSelectedText();
      if (!!selectedText) {
        setAnchorEl(event.target);
      }
    });
  }, []);

  const getSelectedText = () => {
    var selectedText = '';
    if (window.getSelection) { // For modern browsers
      selectedText = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== 'Control') { // For older IE versions
      selectedText = document.selection.createRange().text;
    }
    return selectedText;
  }

  const replaceSelectedText = (text,index) => {
    const textarea = document.getElementsByClassName(classes.boxHighlight)[0];
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeSelection = textarea.value.substring(0, start);
    const afterSelection = textarea.value.substring(end, textarea.value.length);

    textarea.value = beforeSelection + text + afterSelection;
    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;
    textarea.focus();
    console.log(textarea.value,index);
    const sub = onSubtitleChange(textarea.value, index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    console.log(subtitles);
    // saveTranscriptHandler(true, true, sub);
  }
  const getSelectedTextStyle = () => {
    const textVal = document.getElementsByClassName(classes.boxHighlight)[0];
    let cursorStart = textVal.selectionStart;
    let cursorEnd = textVal.selectionEnd;
    let selectedText = textVal.value.substring(cursorStart, cursorEnd);

    if (selectedText.includes("₀") || selectedText.includes("₁")) {
        return 'subscript';
    } else if (selectedText.includes("⁰") || selectedText.includes("¹")) {
        return 'superscript';
    } else {
        return ''; 
    }
};
  const handleSubscript = () => {
    const textVal = document.getElementsByClassName(classes.boxHighlight)[0]; 
    let cursorStart = textVal.selectionStart;
    let cursorEnd = textVal.selectionEnd;
    let selectedText = textVal.value.substring(cursorStart, cursorEnd)
    console.log("selectedText", selectedText);
    if (selectedText!="") {
      const subscriptText = selectedText.replace(/[0-9⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (char) => {
        const subscriptMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '⁰': '₀', '¹': '₁', '²': '₂', '³': '₃', '⁴': '₄', '⁵': '₅', '⁶': '₆', '⁷': '₇', '⁸': '₈', '⁹': '₉' };
        return subscriptMap[char];
      });
      replaceSelectedText(subscriptText,currentIndexToSplitTextBlock);
    }
  }

  const handleSuperscript = () => {
    const textVal = document.getElementsByClassName(classes.boxHighlight)[0]; 
    let cursorStart = textVal.selectionStart;
    let cursorEnd = textVal.selectionEnd;
    let selectedText = textVal.value.substring(cursorStart, cursorEnd)
    if (selectedText!="") {
      const superscriptText = selectedText.replace(/[0-9₀₁₂₃₄₅₆₇₈₉]/g, (char) => {
        const superscriptMap = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' ,'₀': '⁰', '₁': '¹', '₂': '²', '₃': '³', '₄': '⁴', '₅': '⁵', '₆': '⁶', '₇': '⁷', '₈': '⁸', '₉': '⁹'};
        return superscriptMap[char];
      });
      replaceSelectedText(superscriptText,currentIndexToSplitTextBlock);
    }
  }



  const onMergeClick = useCallback(
    (index) => {
      const selectionStart = getSelectionStart(index);
      const timings = getTimings(index);

      setUndoStack((prevState) => [
        ...prevState,
        {
          type: "merge",
          index: index,
          timings,
          selectionStart,
        },
      ]);
      setRedoStack([]);

      const sub = onMerge(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      // saveTranscriptHandler(false, true, sub);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const onMouseUp = (e, blockIdx) => {
    if (e.target.selectionStart < e.target.value.length) {
      e.preventDefault();
      setShowPopOver(true);
      setCurrentIndexToSplitTextBlock(blockIdx);
      setSelectionStart(e.target.selectionStart);
    }
  };

  const onSplitClick = useCallback(() => {
    setUndoStack((prevState) => [
      ...prevState,
      {
        type: "split",
        index: currentIndexToSplitTextBlock,
        selectionStart,
      },
    ]);
    setRedoStack([]);

    const sub = onSplit(currentIndexToSplitTextBlock, selectionStart);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, true, sub);

    // eslint-disable-next-line
  }, [currentIndexToSplitTextBlock, selectionStart, limit, currentOffset]);

  const changeTranscriptHandler = (event, index) => {
    const {
      target: { value },
      currentTarget,
    } = event;
    const containsBackslash = value.includes("\\");
    setEnableTransliterationSuggestion(true);

    if (containsBackslash) {
      setEnableTransliterationSuggestion(false);

      const textBeforeSlash = value.split("\\")[0];
      const currentTargetWord = value.split("\\")[1].split(" ")[0];
      const textAfterSlash = value.split("\\")[1].split(" ").slice(1).join(" ");

      const tags = getTagsList(videoDetails?.video?.language_label);

      const filteredSuggestionByInput = Object.entries(tags).filter(([tag]) => {
        return tag.toLowerCase().includes(currentTargetWord.toLowerCase());
      });

      const filteredSuggestions = Object.fromEntries(filteredSuggestionByInput);

      setCurrentSelectedIndex(index);
      setTagSuggestionsAnchorEl(currentTarget);
      setTextWithoutBackSlash(textBeforeSlash);
      setTextAfterBackSlash(textAfterSlash);

      if (Object.keys(filteredSuggestions).length) {
        setTagSuggestionList(filteredSuggestions);
      } else {
        setTagSuggestionList([]);
      }
    }

    const sub = onSubtitleChange(value, index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, false, sub);
  };

  const saveTranscriptHandler = async (
    isFinal,
    isAutosave,
    payload = subtitles
  ) => {
    const reqBody = {
      task_id: taskId,
      offset: currentOffset,
      limit: limit,
      payload: {
        payload: payload,
      },
    };

    if (isFinal) {
      reqBody.final = true;
    }

    setComplete(isFinal);
    setAutoSave(isAutosave);

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
    dispatch(APITransport(obj));
  };

  const handleTimeChange = useCallback(
    (value, index, type, time) => {
      const sub = timeChange(value, index, type, time);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      // saveTranscriptHandler(false, true, sub);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const onDelete = useCallback(
    (index) => {
      setUndoStack((prevState) => [
        ...prevState,
        {
          type: "delete",
          index: index,
          data: getItemForDelete(index),
        },
      ]);
      setRedoStack([]);

      const sub = onSubtitleDelete(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      // saveTranscriptHandler(false, false, sub);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const addNewSubtitleBox = useCallback(
    (index) => {
      const sub = addSubtitleBox(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      // saveTranscriptHandler(false, false, sub);

      setUndoStack((prevState) => [
        ...prevState,
        {
          type: "add",
          index: index,
        },
      ]);
      setRedoStack([]);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const onUndo = useCallback(() => {
    if (undoStack.length > 0) {
      //getting last last action performed by user
      const lastAction = undoStack[undoStack.length - 1];

      // modifing subtitles based on last action
      const sub = onUndoAction(lastAction);
      dispatch(setSubtitles(sub, C.SUBTITLES));

      //removing the last action from undo and putting in redo stack
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
      setRedoStack((prevState) => [...prevState, lastAction]);
    }

    // eslint-disable-next-line
  }, [undoStack, redoStack]);

  const onRedo = useCallback(() => {
    if (redoStack.length > 0) {
      //getting last last action performed by user
      const lastAction = redoStack[redoStack.length - 1];

      // modifing subtitles based on last action
      const sub = onRedoAction(lastAction);
      dispatch(setSubtitles(sub, C.SUBTITLES));

      //removing the last action from redo and putting in undo stack
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
      setUndoStack((prevState) => [...prevState, lastAction]);
    }

    // eslint-disable-next-line
  }, [undoStack, redoStack]);

  const targetLength = (index) => {
    if (subtitles[index]?.text.trim() !== "")
      return subtitles[index]?.text.trim().split(" ").length;
    return 0;
  };

  const onNavigationClick = (value) => {
    getPayload(value, limit);
  };

  const handleSpeakerChange = (id, index) => {
    const sub = assignSpeakerId(id, index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, false, sub);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        className={classes.rightPanelParentBox}
        style={{ position: "relative" }}
      >
        <Grid className={classes.rightPanelParentGrid}>
          <SettingsButtonComponent
            setTransliteration={setTransliteration}
            enableTransliteration={enableTransliteration}
             subsuper={subsuper}
             setsubsuper={setsubsuper}
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
            onSplitClick={onSplitClick}
            handleSubscript={handleSubscript}
            handleSuperscript={handleSuperscript}
            showPopOver={showPopOver}
            showSplit={true}
          />
        </Grid>

        <Box id={"subTitleContainer"} className={classes.subTitleContainer}>
          {subtitles?.map((item, index) => {
            return (
              <Box
                key={index}
                id={`sub_${index}`}
                style={{
                  padding: "16px",
                  borderBottom: "1px solid lightgray",
                  backgroundColor:
                    index % 2 === 0
                      ? "rgb(214, 238, 255)"
                      : "rgb(233, 247, 239)",
                }}
              >
                <Box className={classes.topBox}>
                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.start_time}
                    index={index}
                    type={"startTime"}
                  />

                  <ButtonComponent
                    index={index}
                    lastItem={index < subtitles.length - 1}
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
                  className={classes.cardContent}
                  aria-describedby={"suggestionList"}
                  onClick={() => {
                    if (player) {
                      player.pause();
                      if (player.duration >= item.startTime) {
                        player.currentTime = item.startTime + 0.001;
                      }
                    }
                  }}
                >
                  {/* {subsuper != false?
                    <div>
                      <Button variant="contained" onClick={()=>handleSubscript(index)} size="small" sx={{borderRadius:"4px"}}>
                      x₂
                      </Button>
                      <Button variant="contained" onClick={()=>handleSuperscript(index)} size="small" sx={{borderRadius:"4px"}}>
                      x²
                      </Button>
                     </div>: null} */}
                  {taskData?.src_language !== "en" && enableTransliteration ? (
                    <IndicTransliterate
                      lang={taskData?.src_language}
                      value={item.text}
                      onChange={(event) => {
                        changeTranscriptHandler(event, index);
                      }}
                      enabled={enableTransliterationSuggestion}
                      onChangeText={() => { }}
                      onMouseUp={(e) => onMouseUp(e, index)}
                      containerStyles={{}}
                      onBlur={() =>
                        setTimeout(() => {
                          setShowPopOver(false);
                        }, 200)
                      }
                      renderComponent={(props) => (
                        <div className={classes.relative} >
                          <textarea
                            className={`${classes.customTextarea} ${currentIndex === index ? classes.boxHighlight : ""
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
                          changeTranscriptHandler(event, index);
                        }}
                        onMouseUp={(e) => onMouseUp(e, index)}
                        value={item.text}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        className={`${classes.customTextarea} ${currentIndex === index ? classes.boxHighlight : ""
                          }`}
                        style={{
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
                      <span id="charNum" className={classes.wordCount}>
                        {targetLength(index)}
                      </span>
                    </div>
                  )}
                </CardContent>

                {showSpeakerIdDropdown ? (
                  <FormControl
                    sx={{ width: "50%", mr: "auto", float: "left" }}
                    size="small"
                  >
                    <InputLabel id="select-speaker">Select Speaker</InputLabel>
                    <Select
                      fullWidth
                      labelId="select-speaker"
                      label="Select Speaker"
                      value={item.speaker_id}
                      onChange={(event) =>
                        handleSpeakerChange(event.target.value, index)
                      }
                      style={{
                        backgroundColor: "#fff",
                        textAlign: "left",
                      }}
                      inputProps={{
                        "aria-label": "Without label",
                        style: { textAlign: "left" },
                      }}
                      MenuProps={MenuProps}
                    >
                      {speakerIdList?.map((speaker, index) => (
                        <MenuItem key={index} value={speaker.id}>
                          {speaker.name} ({speaker.gender[0]})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null}
              </Box>
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
            range={getSubtitleRangeTranscript()}
            rows={totalPages}
            previous={previous}
            next={next}
            onClick={onNavigationClick}
            jumpTo={[...Array(transcriptPayload?.total_pages)].map(
              (_, index) => index + 1
            )}
            completedCount={completedCount}
            current={currentPage}
          />
        </Box>

        {openConfirmDialog && (
          <ConfirmDialog
            openDialog={openConfirmDialog}
            handleClose={() => setOpenConfirmDialog(false)}
            submit={() => saveTranscriptHandler(true)}
            message={"Do you want to submit the transcript?"}
            loading={apiStatus.loading}
          />
        )}

        {Boolean(tagSuggestionsAnchorEl) && (
          <TagsSuggestionList
            tagSuggestionsAnchorEl={tagSuggestionsAnchorEl}
            setTagSuggestionList={setTagSuggestionList}
            index={currentSelectedIndex}
            filteredSuggestionByInput={tagSuggestionList}
            setTagSuggestionsAnchorEl={setTagSuggestionsAnchorEl}
            textWithoutBackslash={textWithoutBackSlash}
            textAfterBackSlash={textAfterBackSlash}
            // saveTranscriptHandler={saveTranscriptHandler}
            setEnableTransliterationSuggestion={
              setEnableTransliterationSuggestion
            }
          />
        )}
        {/* <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Button variant="contained" onClick={handleSubscript}>
            Subscript
          </Button>
          <Button variant="contained" onClick={handleSuperscript}>
            Superscript
          </Button>
        </Popover> */}
      </Box>
    </>
  );
};

export default memo(RightPanel);