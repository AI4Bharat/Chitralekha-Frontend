import React, { useCallback, useEffect, useState, useRef, memo } from "react";
import { IndicTransliterate } from "indic-transliterate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import subscript from "config/subscript";
import superscriptMap from "config/superscript";
import { configs, endpoints } from "config";
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
} from "@mui/material";
import {
  ConfirmDialog,
  ShortcutKeys,
  TableDialog,
  TagsSuggestionList,
  TimeBoxes,
} from "common";
import ButtonComponent from "./components/ButtonComponent";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import Pagination from "./components/Pagination";

//APIs
import C from "redux/constants";
import {
  APITransport,
  FetchTranscriptPayloadAPI,
  FetchTaskFailInfoAPI,
  SaveTranscriptAPI,
  setSnackBar,
  setSubtitles,
} from "redux/actions";
import { failTranscriptionInfoColumns } from "config";

const RightPanel = ({ currentIndex, currentSubs,setCurrentIndex }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const xl = useMediaQuery("(min-width:1800px)");
  const textboxes = useRef([]);

  const [selection, setselection] = useState(false);
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

  const [subsuper, setsubsuper] = useState(false);
  const [index] = useState();
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

  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [tableDialogMessage, setTableDialogMessage] = useState("");
  const [tableDialogResponse, setTableDialogResponse] = useState([]);
  const [tableDialogColumn, setTableDialogColumn] = useState([]);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;

    if (!progress) {
      if (success) {
        switch (apiType) {
          case "SAVE_TRANSCRIPT":
            if (!autoSave) {
              setTimeout(() => {
                dispatch(setSnackBar({ open: false }));
              }, 1000);
            }
            if (complete) {
              setTimeout(() => {
                navigate(
                  `/my-organization/${assignedOrgId}/project/${taskData?.project}`
                );
                setComplete(false);
              }, 2000);
            }
            break;

          case "GET_TASK_FAIL_INFO":
            setOpenInfoDialog(true);
            setTableDialogColumn(failTranscriptionInfoColumns);
            setTableDialogMessage(data.message);
            setTableDialogResponse(data.data);
            break;

          default:
            break;
        }
      } else {
        switch (apiType) {
          case "SAVE_TRANSCRIPT":
            setOpenConfirmDialog(false);

            if (complete) {
              setOpenInfoDialog(true);
              setTableDialogColumn(failTranscriptionInfoColumns);
              setTableDialogMessage(data.message);
              setTableDialogResponse(data.data);
            }
            break;

          default:
            break;
        }
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

  const savedPreference = localStorage.getItem(
    "subscriptSuperscriptPreferenceTranscript"
  );
  useEffect(() => {
    if (savedPreference === "true" && subsuper === false) {
      setsubsuper(JSON.parse(savedPreference));
    }
    // eslint-disable-next-line
  }, []);

  const prevOffsetRef = useRef(currentOffset);
  useEffect(() => {
    if (prevOffsetRef.current !== currentOffset) {
      setUndoStack([]);
      setRedoStack([]);
      prevOffsetRef.current = currentOffset;
    }
    // eslint-disable-next-line
  }, [limit, currentOffset]);

  const onMouseUp = (e, blockIdx) => {
    setTimeout(() => {
      setCurrentIndex(blockIdx);
    }, 100);

    if (e && e.target) {
      const { selectionStart, value } = e.target;
      if (selectionStart !== undefined && value !== undefined) {
        setShowPopOver(true);
        setCurrentIndexToSplitTextBlock(blockIdx);
        setSelectionStart(selectionStart);
      }
    }

    const getSelectedText = () => {
      const textVal = document.getElementsByClassName(classes.boxHighlight)[0];
      if (textVal) {
        const cursorStart = textVal.selectionStart;
        const cursorEnd = textVal.selectionEnd;
        const selectedText = textVal.value.substring(cursorStart, cursorEnd);
        if (selectedText !== "") {
          return selectedText;
        }
      }
      return "";
    };

    setTimeout(() => {
      const selectedText = getSelectedText();
      if (selectedText !== "" && subsuper === true) {
        setselection(true);
        localStorage.setItem(
          "subscriptSuperscriptPreferenceTranscript",
          selection
        );
      }
    }, 0);
  };

  const replaceSelectedText = (text, index) => {
    const textarea = document.getElementsByClassName(classes.boxHighlight)[0];
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeSelection = textarea.value.substring(0, start);
    const afterSelection = textarea.value.substring(end, textarea.value.length);

    textarea.value = beforeSelection + text + afterSelection;
    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;
    textarea.focus();

    const sub = onSubtitleChange(textarea.value, index, 0);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(true, true, sub);
  };

  const handleSubscript = () => {
    const textVal = document.getElementsByClassName(classes.boxHighlight)[0];
    const cursorStart = textVal.selectionStart;
    const cursorEnd = textVal.selectionEnd;
    const selectedText = textVal.value.substring(cursorStart, cursorEnd);

    if (selectedText !== "") {
      const subscriptText = selectedText.replace(
        /[0-9⁰¹²³⁴⁵⁶⁷⁸⁹a-zA-ZᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᴼᵖqʳˢᵗᶸᵛʷˣʸzᴬᴮᶜᴰᴱFᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣYᶻ]/g,
        (char) => {
          return subscript[char] || char;
        }
      );

      replaceSelectedText(subscriptText, currentIndexToSplitTextBlock);
    }
  };

  const handleSuperscript = () => {
    const textVal = document.getElementsByClassName(classes.boxHighlight)[0];
    const cursorStart = textVal.selectionStart;
    const cursorEnd = textVal.selectionEnd;
    const selectedText = textVal.value.substring(cursorStart, cursorEnd);

    if (selectedText !== "") {
      const superscriptText = selectedText.replace(
        /[0-9₀₁₂₃₄₅₆₇₈₉a-zA-ZₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyzA-Z]/g,
        (char) => {
          return superscriptMap[char] || char;
        }
      );

      replaceSelectedText(superscriptText, currentIndexToSplitTextBlock);
    }
  };

  const handleInfoButtonClick = async () => {
    const apiObj = new FetchTaskFailInfoAPI(taskId);
    dispatch(APITransport(apiObj));
  };

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

  const shortcuts = [
    {
      keys: ["Control", "l"],
      callback: () => next && onNavigationClick(currentOffset + 1),
    },
    {
      keys: ["Control", "k"],
      callback: () => {
        previous && onNavigationClick(currentOffset - 1);
      },
    },
    {
      keys: ["Control", "i"],
      callback: () => {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
          textboxes.current[currentIndex - 1].focus();
        }
      },
    },
    {
      keys: ["Control", "m"],
      callback: () => {
        if (currentIndex < subtitles.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          textboxes.current[currentIndex + 1].focus();
        }
      },
    },
    {
      keys: ["Control", "b"],
      callback: () => {
        handleSubscript();
      },
    },
    {
      keys: ["Control", "e"],
      callback: () => {
        handleSuperscript();
      },
    },
    {
      keys: ["Control", "a"],
      callback: () => {
        addNewSubtitleBox(currentIndex);
      },
    },
    {
      keys: ["Control", "d"],
      callback: () => {
        onDelete(currentIndex);
      },
    },
  ];

  return (
    <>
      <ShortcutKeys shortcuts={shortcuts} />
      <Box
        className={classes.rightPanelParentBox}
        style={{ position: "relative" }}
      >
        <Grid className={classes.rightPanelParentGrid}>
          <SettingsButtonComponent
            setTransliteration={setTransliteration}
            enableTransliteration={enableTransliteration}
            subsuper={subsuper}
            currentSubs={currentSubs}
            setsubsuper={setsubsuper}
            index={index}
            currentIndexToSplitTextBlock={currentIndexToSplitTextBlock}
            setRTL_Typing={setRTL_Typing}
            enableRTL_Typing={enableRTL_Typing}
            selection={selection}
            setselection={setselection}
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
            handleInfoButtonClick={handleInfoButtonClick}
            currentIndex={currentIndex}
            onMergeClick={onMergeClick}
            onDelete={onDelete}
            addNewSubtitleBox={addNewSubtitleBox}
            subtitles={subtitles}
          />
        </Grid>

        <Box id={"subTitleContainer"} className={classes.subTitleContainer}>
          {subtitles?.map((item, index) => {
            return (
              <Box
                key={index}
                id={`sub_${index}`}
                style={{
                  padding: "0",
                  borderBottom: "1px solid lightgray",
                  backgroundColor: "white",
                  display: "flex"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems:"center", justifyContent: "center", paddingLeft:"1%" }}>
                  <div style={{ border: "solid", backgroundColor: "#F5F5F5", borderColor: "#EEEEEE", marginBottom: "2px" }}>{item.start_time}</div>
                  <div style={{ border: "solid", backgroundColor: "#F5F5F5", borderColor: "#EEEEEE", marginBottom: "2px" }}>{item.end_time}</div>
                </div>

                <CardContent
                  style={{alignItems:"center", padding: 0, width:"100%"}}
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
                  {taskData?.src_language !== "en" && enableTransliteration ? (
                    <IndicTransliterate
                      lang={taskData?.src_language}
                      value={item.text}
                      onChange={(event) => {
                        changeTranscriptHandler(event, index);
                      }}
                      enabled={enableTransliterationSuggestion}
                      onChangeText={() => {}}
                      onMouseUp={(e) => onMouseUp(e, index)}
                      containerStyles={{}}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowPopOver(false);
                        }, 200);
                      }}
                      renderComponent={(props) => (
                        <div className={classes.relative}>
                          <textarea
                            className={`${classes.customTextarea} ${
                              currentIndex === index ? classes.boxHighlight : ""
                            }`}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            rows={2}
                            onMouseUp={(e) => onMouseUp(e, index)}
                            onBlur={() => {
                              setTimeout(() => {
                                setShowPopOver(false);
                              }, 200);
                            }}
                            ref={(el) => (textboxes.current[index] = el)}
                            style={{ fontSize: fontSize, height: "120px" }}
                            {...props}
                          />
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
                        className={`${classes.customTextarea} ${
                          currentIndex === index ? classes.boxHighlight : ""
                        }`}
                        style={{
                          fontSize: fontSize,
                          height: "120px",
                        }}
                        rows={2}
                        ref={(el) => (textboxes.current[index] = el)}
                        onBlur={() => {
                          setTimeout(() => {
                            setShowPopOver(false);
                          }, 200);
                        }}
                      />
                    </div>
                  )}
                </CardContent>

                {showSpeakerIdDropdown && (
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
                )}
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

        {openInfoDialog && (
          <TableDialog
            openDialog={openInfoDialog}
            handleClose={() => setOpenInfoDialog(false)}
            message={tableDialogMessage}
            response={tableDialogResponse}
            columns={tableDialogColumn}
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
            setEnableTransliterationSuggestion={
              setEnableTransliterationSuggestion
            }
          />
        )}
      </Box>
    </>
  );
};

export default memo(RightPanel);
