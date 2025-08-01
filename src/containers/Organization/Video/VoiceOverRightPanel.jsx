// Voice Over Right Panel
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { cloneDeep } from "lodash";
import {
  Sub,
  base64toBlob,
  getSubtitleRange,
  setAudioContent,
  onSubtitleChange,
} from "utils";
import { configs, endpoints, voiceoverFailInfoColumns } from "config";

//Styles
import "../../../styles/scrollbarStyle.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { VideoLandingStyle } from "styles";

//Components
import { Box, CardContent, Grid, Typography } from "@mui/material";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import ButtonComponent from "./components/ButtonComponent";
import Pagination from "./components/Pagination";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import subscript from "config/subscript";
import superscriptMap from "config/superscript";
import {
  ConfirmDialog,
  ConfirmErrorDialog,
  RecorderComponent,
  ShortcutKeys,
  TableDialog,
} from "common";

//APIs
import C from "redux/constants";
import {
  APITransport,
  FetchTranscriptPayloadAPI,
  setCurrentPage,
  setNextPage,
  setPreviousPage,
  setSubtitles,
  setSubtitlesForCheck,
  setTotalPages,
  SaveTranscriptAPI,
  FetchTaskFailInfoAPI,
  setTotalSentences,
  setSnackBar,
} from "redux/actions";
import { onExpandTimeline } from "utils/subtitleUtils";

const VoiceOverRightPanel = ({ setCurrentIndex }) => {
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
  const limit = useSelector((state) => state.commonReducer.limit);
  const totalPages = useSelector((state) => state.commonReducer.totalPages);
  const currentPage = useSelector((state) => state.commonReducer.currentPage);
  const next = useSelector((state) => state.commonReducer.nextPage);
  const previous = useSelector((state) => state.commonReducer.previousPage);
  const completedCount = useSelector(
    (state) => state.commonReducer.completedCount
  );
  const apiStatus = useSelector((state) => state.apiStatus);
  const totalSentences = useSelector(
    (state) => state.commonReducer.totalSentences
  );

  const [sourceText, setSourceText] = useState([]);
  const [enableTransliteration, setTransliteration] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [fontSize, setFontSize] = useState("large");
  const [data, setData] = useState([]);
  const [recordAudio, setRecordAudio] = useState([]);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [textChangeBtn, setTextChangeBtn] = useState([]);
  const [audioPlayer, setAudioPlayer] = useState([]);
  const [speedChangeBtn, setSpeedChangeBtn] = useState([]);
  const [openConfirmErrorDialog, setOpenConfirmErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorResponse, setErrorResponse] = useState([]);
  const [durationError, setDurationError] = useState([]);
  const [, setCanSave] = useState(false);
  const [complete, setComplete] = useState(false);
  const [getUpdatedAudio, setGetUpdatedAudio] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [tableDialogMessage, setTableDialogMessage] = useState("");
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [subsuper, setsubsuper] = useState(false);
  const [selection, setselection] = useState(false);
  const [, setSelectionStart] = useState();
  const [tableDialogResponse, setTableDialogResponse] = useState([]);
  const [tableDialogColumn, setTableDialogColumn] = useState([]);
  const [recorderTime, setRecorderTime] = useState(0);
  const loggedin_user_id = JSON.parse(localStorage.getItem("userData"))?.id;
  const [disable, setDisable] = useState(false);


  useEffect(() => {
    if(loggedin_user_id && taskData?.user?.id && loggedin_user_id !== taskData?.user?.id) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [loggedin_user_id, taskData])

  useEffect(() => {
    const { progress, success, data, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "SAVE_TRANSCRIPT") {
          setCanSave(false);
          setOpenConfirmDialog(false);

          if (complete) {
            navigate(
              `/my-organization/${assignedOrgId}/project/${taskData?.project}`
            );
          }

          if (getUpdatedAudio) {
            const sub = data?.payload?.payload.map((item) => new Sub(item));

            const newSub = cloneDeep(sub);

            dispatch(setCurrentPage(data?.current));
            dispatch(setNextPage(data?.next));
            dispatch(setPreviousPage(data?.previous));
            dispatch(setTotalPages(data?.count));
            dispatch(setSubtitlesForCheck(newSub));
            dispatch(setSubtitles(sub, C.SUBTITLES));
            dispatch(setTotalSentences(data?.sentences_count));
          }

          // getPayloadAPI(currentPage);
          setGetUpdatedAudio(false);
        }

        if (apiType === "GET_TASK_FAIL_INFO") {
          setOpenInfoDialog(true);
          setTableDialogColumn(voiceoverFailInfoColumns);
          setTableDialogMessage(data.message);
          setTableDialogResponse(data.data);
        }
      } else {
        if (apiType === "SAVE_TRANSCRIPT") {
          setOpenConfirmDialog(false);

          if (complete) {
            setOpenConfirmErrorDialog(true);
            setErrorMessage(data.message);
            setErrorResponse(data.missing_cards_info);
            setComplete(false);
          }
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const isDisabled = (index) => {
    if (next && sourceText.length - 1 === index) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    setAudioPlayer($audioRef.current);
    // eslint-disable-next-line
  }, [$audioRef.current]);

  useEffect(() => {
    let temp = [];
    subtitlesForCheck?.forEach(() => temp.push(1));

    $audioRef.current = $audioRef.current.slice(0, subtitlesForCheck?.length);
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
    isGetUpdatedAudio,
    value = currentPage
  ) => {
    dispatch(
      setSnackBar({
        open: true,
        message: "Saving...",
        variant: "info",
      })
    );

    const reqBody = {
      task_id: taskId,
      payload: {
        payload: sourceText,
      },
      offset: value,
    };

    if (isFinal) {
      reqBody.final = true;
    }

    setComplete(isFinal);
    setGetUpdatedAudio(isGetUpdatedAudio);

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
    dispatch(APITransport(obj));
  };

  const getPayloadAPI = (offset = currentPage) => {
    const payloadObj = new FetchTranscriptPayloadAPI(
      taskData.id,
      taskData.task_type,
      offset
    );
    dispatch(APITransport(payloadObj));
  };

  const handleAutosave = () => {
    const reqBody = {
      task_id: taskId,
      offset: currentPage,
      limit: limit,
      payload: {
        payload: subtitles,
      },
    };

    const obj = new SaveTranscriptAPI(reqBody, taskData?.task_type);
    dispatch(APITransport(obj));
  };

  const onNavigationClick = (value) => {
    handleAutosave();
    getPayloadAPI(value);
  };

  const updateRecorderState = (newState, index) => {
    const updatedArray = Object.assign([], recordAudio);
    updatedArray[index] = newState;
    setRecordAudio(updatedArray);
  };

  const onStopRecording = (data, index, recordingTime) => {
    setCanSave(true);
    setGetUpdatedAudio(true);
    const reader = new FileReader();

    let base64data;
    reader.readAsDataURL(data);
    reader.onloadend = function () {
      base64data = reader.result;

      const encode = base64data.split(",")[1];
      const updatedSourceText = setAudioContent(index, encode);
      dispatch(setSubtitles(updatedSourceText, C.SUBTITLES));
    };

    const temp = [...durationError];

    if (subtitles[index].time_difference < recordingTime) {
      temp[index] = true;
    } else {
      temp[index] = false;
    }
    setDurationError(temp);
  };

  const handleFileUpload = (event, index) => {
    const file = event.target.files[0];
    const updatedArray = [];
    updatedArray[index] = URL.createObjectURL(file);

    const reader = new FileReader();

    let base64data;
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      base64data = reader.result;
      let encode;
      if (base64data.includes("data:audio/wav;base64,")) {
        encode = base64data.replace("data:audio/wav;base64,", "");
      } else {
        encode = base64data.replace("data:audio/mpeg;base64,", "");
      }

      updatedArray.audioContent = encode;
      const updatedSourceText = setAudioContent(index, encode);
      dispatch(setSubtitles(updatedSourceText, C.SUBTITLES));
    };

    setData(updatedArray);

    setTimeout(() => {
      const temp = [...durationError];
      if (subtitles[index].time_difference < audioPlayer[index].duration) {
        temp[index] = true;
      } else {
        temp[index] = false;
      }
      setDurationError(temp);
    }, 1000);
  };

  // useEffect(() => {
  //   const subtitleScrollEle = document.getElementById("subtitleContainerVO");
  //   subtitleScrollEle
  //     .querySelector(`#container-1`)
  //     ?.scrollIntoView({ block: "center" });
  // }, [
  //   document
  //     .getElementById("subtitleContainerVO")
  //     ?.querySelector(`#container-1`),
  // ]);

  const handleInfoButtonClick = async () => {
    const apiObj = new FetchTaskFailInfoAPI(taskId, taskData?.task_type);
    dispatch(APITransport(apiObj));
  };
  const savedPreference = localStorage.getItem(
    "subscriptSuperscriptPreferenceVoiceOver"
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
          "subscriptSuperscriptPreferenceVoiceOver",
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

  const shortcuts = [
    {
      keys: ["Control", "l"],
      callback: () => next && onNavigationClick(currentPage + 1),
    },
    {
      keys: ["Control", "k"],
      callback: () => {
        previous && onNavigationClick(currentPage - 1);
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
  ];

  const expandTimestamp = useCallback(() => {
    const sub = onExpandTimeline(currentIndexToSplitTextBlock, true);
    dispatch(setSubtitles(sub, C.SUBTITLES));

  }, [currentIndexToSplitTextBlock, limit]);

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
            setsubsuper={setsubsuper}
            currentIndexToSplitTextBlock={currentIndexToSplitTextBlock}
            handleSubscript={handleSubscript}
            handleSuperscript={handleSuperscript}
            setRTL_Typing={setRTL_Typing}
            enableRTL_Typing={enableRTL_Typing}
            setFontSize={setFontSize}
            fontSize={fontSize}
            saveTranscriptHandler={saveTranscriptHandler}
            setOpenConfirmDialog={setOpenConfirmDialog}
            durationError={durationError}
            handleInfoButtonClick={handleInfoButtonClick}
            expandTimestamp={expandTimestamp}
            disabled={disable}
          />
        </Grid>

        <Box className={classes.subTitleContainer} id={"subtitleContainerVO"}>
          {sourceText?.map((item, index) => {
            return (
              <div
                key={index}
                className={isDisabled(index) ? classes.disabledCard : ""}
                style={{
                  borderBottom: "1px solid grey",
                  backgroundColor:
                    index % 2 === 0
                      ? "rgb(214, 238, 255)"
                      : "rgb(233, 247, 239)",
                }}
                id={`container-${index}`}
              >
                <Box
                  display="flex"
                  paddingTop={index === 1 ? "100px" : "25px"}
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

                  {taskData.source_type === "Machine Generated" ? (
                    <ButtonComponent
                      index={index}
                      showChangeBtn={textChangeBtn[index]}
                      saveTranscriptHandler={saveTranscriptHandler}
                      showSpeedChangeBtn={speedChangeBtn[index]}
                    />
                  ) : (
                    <RecorderComponent
                      index={index}
                      onStopRecording={onStopRecording}
                      durationError={durationError}
                      handleFileUpload={handleFileUpload}
                      isDisabled={isDisabled(index)}
                      updateRecorderState={updateRecorderState}
                      setRecorderTime={setRecorderTime}
                    />
                  )}
                </Box>

                <CardContent
                  style={{
                    display: "flex",
                    padding: "5px 0",
                    paddingBottom: index === 1 ? "100px" : "0px",
                    borderBottom: 2,
                    flexWrap: "wrap",
                  }}
                  onClick={() => {
                    if (player) {
                      if( typeof player.pauseVideo === 'function' ){
                        player.pauseVideo();
                        if (player.getDuration() >= item.startTime && (player.getCurrentTime() < item.startTime || player.getCurrentTime() > item.endTime)) {
                          player.seekTo(item.startTime + 0.001);
                        }
                      }else{
                        player.pause();
                        if (player.duration >= item.startTime && (player.currentTime < item.startTime || player.currentTime > item.endTime)) {
                          player.currentTime = item.startTime + 0.001;
                        }
                      }
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: index === 2 ? "100%" : "50%",
                      ...(!xl && { width: "100%", margin: "25px 0" }),
                    }}
                  >
                    <div className={classes.relative} style={{ width: "100%" }}>
                      {taskData?.target_language !== "en" &&
                      enableTransliteration ? (
                        <IndicTransliterate
                          customApiURL={`${configs.BASE_URL_AUTO}${endpoints.transliteration}`}
                          apiKey={`JWT ${localStorage.getItem("token")}`}
                          lang={taskData?.target_language}
                          value={item.text}
                          onChangeText={(text) => {
                            changeTranscriptHandler(text, index);
                          }}
                          onMouseUp={(e) => onMouseUp(e, index)}
                          style={{
                            fontSize: fontSize,
                            height: "100px",
                            width: "89%",
                            opacity: "1 !important",
                            ...(xl && {
                              width: index === 2 ? "89%" : "80%",
                              margin: "15px 0",
                            }),
                          }}
                          renderComponent={(props) => (
                            <div>
                              <textarea
                                className={`${
                                  classes.textAreaTransliteration
                                } ${index === 1 ? classes.boxHighlight : ""}`}
                                dir={enableRTL_Typing ? "rtl" : "ltr"}
                                rows={4}
                                disabled={isDisabled(index)}
                                {...props}
                              />
                            </div>
                          )}
                        />
                      ) : (
                        <div>
                          <textarea
                            disabled={isDisabled(index)}
                            onChange={(event) => {
                              changeTranscriptHandler(
                                event.target.value,
                                index
                              );
                            }}
                            onMouseUp={(e) => onMouseUp(e, index)}
                            style={{
                              fontSize: fontSize,
                              height: "100px",
                              width: "89%",
                              ...(xl && {
                                width: index === 2 ? "89%" : "80%",
                                margin: "15px 0",
                              }),
                            }}
                            value={item.text}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            className={`${classes.textAreaTransliteration} ${
                              index === 1 ? classes.boxHighlight : ""
                            }`}
                            rows={4}
                          />
                        </div>
                      )}
                    </div>
                  </Box>

                  <Box
                    sx={{
                      width: index === 2 ? "100%" : "50%",
                      ...(!xl && { width: "100%", margin: "0 0 25px 0" }),
                    }}
                  >
                    <div className={classes.recorder}>
                      <div
                        className={classes.audioBox}
                        style={
                          !xl
                            ? {
                                alignItems: "center",
                                flexDirection: "row",
                              }
                            : {}
                        }
                      >
                        <audio
                          disabled={isDisabled(index)}
                          src={data[index]}
                          controls
                          ref={(element) =>
                            ($audioRef.current[index] = element)
                          }
                          className={classes.audioPlayer}
                          style={{
                            display: isDisabled(index)
                              ? "none"
                              : recordAudio[index] === "stop"
                              ? ""
                              : "none",
                            width: index === 2 ? "91%" : "",
                            margin: index === 2 ? "0 auto 25px auto" : "",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          color: "#000",
                          margin: "18px auto",
                          fontSize: "18px",
                          display: recordAudio[index] === "stop" ? "none" : "",
                        }}
                      >
                        <div>Recording Audio....</div>
                        <div style={{ marginTop: "10px" }}>
                          Remaining Time:{" "}
                          {`${
                            item.time_difference - recorderTime > 0
                              ? item.time_difference - recorderTime
                              : 0
                          }`}{" "}
                          sec
                        </div>
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
            rows={totalPages}
            previous={previous}
            next={next}
            onClick={onNavigationClick}
            jumpTo={[...Array(totalPages).keys()].map((_, index) => index + 1)}
            durationError={durationError}
            completedCount={completedCount}
            current={currentPage}
            totalSentences={totalSentences}
          />
        </Box>

        {openConfirmDialog && (
          <ConfirmDialog
            openDialog={openConfirmDialog}
            handleClose={() => setOpenConfirmDialog(false)}
            submit={() => saveTranscriptHandler(true)}
            message={"Do you want to submit the Voice Over?"}
            loading={apiStatus.loading}
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

        {openInfoDialog && (
          <TableDialog
            openDialog={openInfoDialog}
            handleClose={() => setOpenInfoDialog(false)}
            message={tableDialogMessage}
            response={tableDialogResponse}
            columns={tableDialogColumn}
          />
        )}
      </Box>
    </>
  );
};

export default VoiceOverRightPanel;
