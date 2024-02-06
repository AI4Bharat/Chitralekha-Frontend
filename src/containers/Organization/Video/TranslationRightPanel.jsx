// TranslationRightPanel
import React, { memo, useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import subscript from "config/subscript";
import superscriptMap from "config/superscript";

import {
  addSubtitleBox,
  getSubtitleRangeTranscript,
  onMerge,
  onSubtitleDelete,
  onSubtitleChange,
  timeChange,
  onUndoAction,
  onRedoAction,
  getItemForDelete,
  getSelectionStart,
  getTargetSelectionStart,
  reGenerateTranslation,
} from "utils";

//Styles
import "../../../styles/scrollbarStyle.css";
import { VideoLandingStyle } from "styles";

//Components
import {
  Box,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import ButtonComponent from "./components/ButtonComponent";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import Pagination from "./components/Pagination";
import { ConfirmDialog, ShortcutKeys, TableDialog, TimeBoxes } from "common";

//APIs
import C from "redux/constants";
import {
  APITransport,
  CreateGlossaryAPI,
  FetchTaskFailInfoAPI,
  FetchTranscriptPayloadAPI,
  SaveTranscriptAPI,
  setSubtitles,
} from "redux/actions";
import { failInfoColumns } from "config";
import GlossaryDialog from "common/GlossaryDialog";

const TranslationRightPanel = ({ currentIndex, setCurrentIndex }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const xl = useMediaQuery("(min-width:1800px)");
  const textboxes = useRef([]);

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
  const apiStatus = useSelector((state) => state.apiStatus);
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  const [sourceText, setSourceText] = useState([]);
  const [enableTransliteration, setTransliteration] = useState(true);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [fontSize, setFontSize] = useState("large");
  const [currentOffset, setCurrentOffset] = useState(1);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [, setSelectionStart] = useState();
  const [selection, setselection] = useState(false);
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [regenerate, setRegenerate] = useState(false);
  const [complete, setComplete] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [tableDialogMessage, setTableDialogMessage] = useState("");
  const [tableDialogResponse, setTableDialogResponse] = useState([]);
  const [tableDialogColumn, setTableDialogColumn] = useState([]);
  const [subsuper, setsubsuper] = useState(false);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [selectedWord, setSelectedWord] = useState("");
  const [openGlossaryDialog, setOpenGlossaryDialog] = useState(false);
  const [glossaryDialogTitle, setGlossaryDialogTitle] = useState(false);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;

    if (!progress) {
      if (success) {
        switch (apiType) {
          case "SAVE_TRANSCRIPT":
            if (regenerate) {
              getPayload(currentPage, limit);
              setRegenerate(false);
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
            setTableDialogColumn(failInfoColumns);
            setTableDialogMessage(data.message);
            setTableDialogResponse(data.data);
            break;

          case "CREATE_GLOSSARY":
            setOpenGlossaryDialog(false);
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
              setTableDialogColumn(failInfoColumns);
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
    if (currentPage) {
      setCurrentOffset(currentPage);
    }
  }, [currentPage]);

  const handleContextMenu = (event) => {
    event.preventDefault();

    const selectedText = window.getSelection().toString();
    setSelectedWord(selectedText);

    if (selectedText !== "") {
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null
      );
    }
  };

  const handleContextMenuClick = (dialogTitle) => {
    setContextMenu(null);
    setOpenGlossaryDialog(true);
    setGlossaryDialogTitle(dialogTitle);
  };

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

    // eslint-disable-next-line
  }, [limit, currentOffset]);

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
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const onMergeClick = useCallback(
    (index) => {
      const selectionStart = getSelectionStart(index);
      const targetSelectionStart = getTargetSelectionStart(index);

      setUndoStack((prevState) => [
        ...prevState,
        {
          type: "merge",
          index: index,
          selectionStart,
          targetSelectionStart,
        },
      ]);
      setRedoStack([]);

      const sub = onMerge(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

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
  };

  const saveTranscriptHandler = async (
    isFinal,
    isRegenerate = false,
    subs = sourceText
  ) => {
    const reqBody = {
      task_id: taskId,
      offset: currentOffset,
      limit: limit,
      payload: {
        payload: subs,
      },
    };

    if (isFinal) {
      reqBody.final = true;
    }

    setComplete(isFinal);
    setRegenerate(isRegenerate);

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
    dispatch(APITransport(obj));
  };
  const savedPreference = localStorage.getItem(
    "subscriptSuperscriptPreferenceTranslate"
  );

  useEffect(() => {
    if (savedPreference === "true" && subsuper === false) {
      setsubsuper(JSON.parse(savedPreference));
    }
    // eslint-disable-next-line
  }, []);

  const onMouseUp = (e, blockIdx) => {
    setTimeout(() => {
      setCurrentIndex(blockIdx);
    }, 100);

    if (e && e.target) {
      const { selectionStart, value } = e.target;
      if (selectionStart !== undefined && value !== undefined) {
        setCurrentIndexToSplitTextBlock(blockIdx);
        setSelectionStart(selectionStart);
      }
    }

    const getSelectedText = () => {
      const elementsWithBoxHighlightClass = document.getElementsByClassName(
        classes.boxHighlight
      );
      for (let i = 0; i < elementsWithBoxHighlightClass.length; i++) {
        if (elementsWithBoxHighlightClass) {
          const textVal = elementsWithBoxHighlightClass[i];
          let cursorStart = textVal.selectionStart;
          let cursorEnd = textVal.selectionEnd;
          const selectedText = textVal.value.substring(cursorStart, cursorEnd);
          if (selectedText !== "") {
            return selectedText;
          }
        }
      }
      return "";
    };

    setTimeout(() => {
      const selectedText = getSelectedText();

      if (selectedText !== "" && subsuper === true) {
        setselection(true);
        localStorage.setItem(
          "subscriptSuperscriptPreferenceTranslate",
          selection
        );
      }
    }, 0);
  };

  const replaceSelectedText = (text, index, id) => {
    const textarea = document.getElementsByClassName(classes.boxHighlight)[id];
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeSelection = textarea.value.substring(0, start);
    const afterSelection = textarea.value.substring(end, textarea.value.length);

    textarea.value = beforeSelection + text + afterSelection;
    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;

    textarea.focus();

    const sub = onSubtitleChange(textarea.value, index, id);
    dispatch(setSubtitles(sub, C.SUBTITLES));
  };

  const handleSubscript = () => {
    const elementsWithBoxHighlightClass = document.getElementsByClassName(
      classes.boxHighlight
    );

    let index = "";
    for (let i = 0; i < elementsWithBoxHighlightClass.length; i++) {
      const textVal = elementsWithBoxHighlightClass[i];
      const cursorStart = textVal.selectionStart;
      const cursorEnd = textVal.selectionEnd;
      const selectedText = textVal.value.substring(cursorStart, cursorEnd);

      if (selectedText !== "") {
        index = i;
        const subscriptText = selectedText.replace(
          /[0-9⁰¹²³⁴⁵⁶⁷⁸⁹a-zA-ZᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᴼᵖqʳˢᵗᶸᵛʷˣʸzᴬᴮᶜᴰᴱFᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣYᶻ]/g,
          (char) => {
            return subscript[char] || char;
          }
        );

        replaceSelectedText(subscriptText, currentIndexToSplitTextBlock, index);
      }
    }
  };

  const handleSuperscript = () => {
    const elementsWithBoxHighlightClass = document.getElementsByClassName(
      classes.boxHighlight
    );

    let index = "";
    for (let i = 0; i < elementsWithBoxHighlightClass.length; i++) {
      const textVal = elementsWithBoxHighlightClass[i];
      const cursorStart = textVal.selectionStart;
      const cursorEnd = textVal.selectionEnd;
      const selectedText = textVal.value.substring(cursorStart, cursorEnd);

      if (selectedText !== "") {
        index = i;
        const superscriptText = selectedText.replace(
          /[0-9₀₁₂₃₄₅₆₇₈₉a-zA-ZₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyzA-Z]/g,
          (char) => {
            return superscriptMap[char] || char;
          }
        );

        replaceSelectedText(
          superscriptText,
          currentIndexToSplitTextBlock,
          index
        );
      }
    }
  };

  const handleTimeChange = useCallback(
    (value, index, type, time) => {
      const sub = timeChange(value, index, type, time);
      dispatch(setSubtitles(sub, C.SUBTITLES));
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const addNewSubtitleBox = useCallback(
    (index) => {
      const sub = addSubtitleBox(index);

      dispatch(setSubtitles(sub, C.SUBTITLES));

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

  const sourceLength = (index) => {
    if (sourceText[index]?.text?.trim() !== "")
      return sourceText[index]?.text?.trim().split(" ").length;
    return 0;
  };

  const targetLength = (index) => {
    if (sourceText[index]?.target_text?.trim() !== "")
      return sourceText[index]?.target_text?.trim().split(" ").length;
    return 0;
  };

  const onNavigationClick = (value) => {
    getPayload(value, limit);
  };

  const handleReGenerateTranslation = useCallback(
    (index) => {
      const regenerate = true;

      const sub = reGenerateTranslation(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));

      saveTranscriptHandler(false, regenerate, sub);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const handleInfoButtonClick = async () => {
    const apiObj = new FetchTaskFailInfoAPI(taskId);
    dispatch(APITransport(apiObj));
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

  const createGlossary = (glossaryText) => {
    const userId = loggedInUserData.id;
    const sentences = [
      {
        src: selectedWord,
        tgt: glossaryText,
        locale: `${taskData?.src_language}|${taskData?.target_language}`,
      },
    ];

    const apiObj = new CreateGlossaryAPI(userId, sentences);
    dispatch(APITransport(apiObj));
  };

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
            setsubsuper={setsubsuper}
            subsuper={subsuper}
            handleSubscript={handleSubscript}
            handleSuperscript={handleSuperscript}
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
            handleInfoButtonClick={handleInfoButtonClick}
          />
        </Grid>

        <Box
          className={classes.subTitleContainer}
          id={"subtitleContainerTranslation"}
        >
          {sourceText?.map((item, index) => {
            return (
              <Box
                key={index}
                id={`sub_${index}`}
                style={{
                  padding: "15px",
                  borderBottom: "1px solid lightgray",
                  backgroundColor:
                    index % 2 === 0
                      ? "rgb(214, 238, 255)"
                      : "rgb(233, 247, 239)",
                }}
              >
                <Box
                  display="flex"
                  alignItems={"center"}
                  justifyContent="center"
                  sx={{ margin: "0 10px" }}
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
                    handleReGenerateTranslation={handleReGenerateTranslation}
                  />

                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.end_time}
                    index={index}
                    type={"endTime"}
                  />
                </Box>

                <CardContent
                  sx={{
                    display: "flex",
                    padding: "5px 0",
                  }}
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
                  {taskData?.source_type !== "Original Source" && (
                    <div
                      className={classes.relative}
                      style={{ width: "100%", cursor: "context-menu" }}
                      onContextMenu={handleContextMenu}
                    >
                      <textarea
                        rows={4}
                        className={`${classes.textAreaTransliteration} ${
                          currentIndex === index ? classes.boxHighlight : ""
                        }`}
                        onMouseUp={(e) => onMouseUp(e, index)}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        style={{ fontSize: fontSize, height: "100px" }}
                        ref={(el) => (textboxes.current[index] = el)}
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
                            Math.abs(
                              sourceLength(index) - targetLength(index)
                            ) >= 3
                              ? "red"
                              : "green",
                          left: "6px",
                        }}
                      >
                        {sourceLength(index)}
                      </span>
                    </div>
                  )}

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
                      onMouseUp={(e) => onMouseUp(e, index)}
                      style={{ fontSize: fontSize, height: "100px" }}
                      renderComponent={(props) => (
                        <div className={classes.relative}>
                          <textarea
                            className={`${classes.textAreaTransliteration} ${
                              currentIndex === index ? classes.boxHighlight : ""
                            } ${
                              taskData?.source_type === "Original Source" &&
                              classes.w95
                            }`}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            ref={(el) => (textboxes.current[index] = el)}
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
                              right: "10px",
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
                        } ${
                          taskData?.source_type === "Original Source" &&
                          classes.w95
                        }`}
                        ref={(el) => (textboxes.current[index] = el)}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        onMouseUp={(e) => onMouseUp(e, index)}
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
                          right: "10px",
                        }}
                      >
                        {targetLength(index)}
                      </span>
                    </div>
                  )}
                </CardContent>

                <Menu
                  open={contextMenu !== null}
                  onClose={() => setContextMenu(null)}
                  anchorReference="anchorPosition"
                  anchorPosition={
                    contextMenu !== null
                      ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                      : undefined
                  }
                >
                  <MenuItem
                    onClick={() => handleContextMenuClick("Add Glossary")}
                  >
                    Add Glossary
                  </MenuItem>
                  {/* <MenuItem
                    onClick={() => handleContextMenuClick("Suggest Glossary")}
                  >
                    Suggest Glossary
                  </MenuItem> */}
                </Menu>
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
            message={"Do you want to submit the translation?"}
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

        {openGlossaryDialog && (
          <GlossaryDialog
            openDialog={openGlossaryDialog}
            handleClose={() => setOpenGlossaryDialog(false)}
            submit={(glossaryText) => createGlossary(glossaryText)}
            selectedWord={selectedWord}
            title={glossaryDialogTitle}
            language={taskData?.target_language}
          />
        )}
      </Box>
    </>
  );
};

export default memo(TranslationRightPanel);
