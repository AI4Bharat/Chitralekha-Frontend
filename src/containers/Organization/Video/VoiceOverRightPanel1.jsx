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
  timeChange,
  getSelectionStart,
  getTargetSelectionStart,
  onMerge,
  onRedoAction,
  onUndoAction,
  onSplit,
} from "utils";
import { configs, endpoints, voiceoverFailInfoColumns } from "config";
import { useTheme } from "@mui/material";

//Styles
import "../../../styles/scrollbarStyle.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { VideoLandingStyle } from "styles";
import LoopIcon from "@mui/icons-material/Loop";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

//Components
import { Box, CardContent, CircularProgress, Grid, IconButton, Menu, Tooltip, Typography } from "@mui/material";
import SettingsButtonComponent from "./components/SettingsButtonComponent";
import Pagination from "./components/Pagination";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate-transcribe";
import subscript from "config/subscript";
import superscriptMap from "config/superscript";
import CustomizedSnackbars from "../../../common/Snackbar";
import {
  ConfirmDialog,
  ConfirmErrorDialog,
  ExportDialog,
  RecorderComponent,
  ShortcutKeys,
  TableDialog,
  TimeBoxes,
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
  CreateGlossaryAPI,
  exportTranslationAPI,
  FetchTranscriptExportTypesAPI,
  FetchTranslationExportTypesAPI,
  FetchVoiceoverExportTypesAPI,
  exportTranscriptionAPI,
} from "redux/actions";
import { MenuItem } from "react-contextmenu";
import GlossaryDialog from "common/GlossaryDialog";
import { copySubs, exportFile, onExpandTimeline } from "utils/subtitleUtils";
import AudioPlayer from "./audioPanel";

const VoiceOverRightPanel1 = ({ currentIndex, setCurrentIndex, showTimeline, segment }) => {
  const { taskId } = useParams();
  const classes = VideoLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const xl = useMediaQuery("(min-width:1800px)");
  const $audioRef = useRef([]);
  const snackbar = useSelector((state) => state.commonReducer.snackbar);
  const loggedin_user_id = JSON.parse(localStorage.getItem("userData"))?.id;
  const [disable, setDisable] = useState(false);

  const taskData = useSelector((state) => state.getTaskDetails.data);
  const assignedOrgId = JSON.parse(localStorage.getItem("userData"))
    ?.organization?.id;
  const subtitles = useSelector((state) => state.commonReducer.subtitles);
  const player = useSelector((state) => state.commonReducer.player);
  const subtitlesForCheck = useSelector(
    (state) => state.commonReducer.subtitlesForCheck
  );
  const videoDetails = useSelector((state) => state.getVideoDetails.data);
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
  const textboxes = useRef([]);

  const [sourceText, setSourceText] = useState([]);
  const [enableTransliteration, setTransliteration] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [fontSize, setFontSize] = useState("large");
  const [data, setData] = useState([]);
  const [recordAudio, setRecordAudio] = useState([]);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
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
  const [selectionStart, setSelectionStart] = useState();
  const [tableDialogResponse, setTableDialogResponse] = useState([]);
  const [tableDialogColumn, setTableDialogColumn] = useState([]);
  const [recorderTime, setRecorderTime] = useState(0);
  const limit = useSelector((state) => state.commonReducer.limit);
  const [currentOffset, setCurrentOffset] = useState(1);
  const [apiInProgress, setApiInProgress] = useState(false);
  const [fetchInProgress, setFetchInProgress] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [showPopOver, setShowPopOver] = useState(false);
  const [redoStack, setRedoStack] = useState([]);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [openGlossaryDialog, setOpenGlossaryDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [glossaryDialogTitle, setGlossaryDialogTitle] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );
  const [loader, setLoader] = useState(false);

  const [exportTypes, setExportTypes] = useState({
    transcription: ["srt"],
    translation: ["srt"],
    voiceover: "mp3",
    speakerInfo: "false",
    bgMusic: "false",
  });

  useEffect(() => {
    const transcriptExportObj = new FetchTranscriptExportTypesAPI();
    dispatch(APITransport(transcriptExportObj));

    const translationExportObj = new FetchTranslationExportTypesAPI();
    dispatch(APITransport(translationExportObj));

    const voiceoverExportObj = new FetchVoiceoverExportTypesAPI();
    dispatch(APITransport(voiceoverExportObj));
  }, []);

    const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // xs, sm, md

  useEffect(() => {
    if(loggedin_user_id && taskData?.user?.id && loggedin_user_id !== taskData?.user?.id) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [loggedin_user_id, taskData])

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          dispatch(setSnackBar({ open: false, message: "", variant: "" }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={[snackbar.message]}
      />
    );

    //eslint-disable-next-line
  }, [snackbar]);

  useEffect(() => {
    const { progress, success, data, apiType } = apiStatus;
    setApiInProgress(progress);
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
            // SaveTranscriptAPI.isSaveInProgress(false);
            const sub = data?.payload?.payload.map((item) => new Sub(item));

            const newSub = cloneDeep(sub);

            dispatch(setCurrentPage(data?.current));
            dispatch(setNextPage(data?.next));
            dispatch(setPreviousPage(data?.previous));
            dispatch(setTotalPages(data?.count));
            dispatch(setSubtitlesForCheck(newSub));
            dispatch(setSubtitles(sub, C.SUBTITLES));
            dispatch(setTotalSentences(data?.sentences_count));
            setFetchInProgress(false);
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

        if(apiType === "CREATE_GLOSSARY"){
          setOpenGlossaryDialog(false);
        }

        if(apiType === "GET_TRANSCRIPT_PAYLOAD"){
          setLoader(false);
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
    // if (next && sourceText.length - 1 === index) {
    //   return true;
    // }

    return false;
  };

  useEffect(() => {
    if (videoDetails.hasOwnProperty("video")) {
        if(segment!==undefined){
          setTimeout(() => {          
            const subtitleScrollEle = document.getElementById("subtitleContainerVO");
            subtitleScrollEle
              .querySelector(`#container-${segment}`)
              ?.scrollIntoView(true, { block: "start" });
            subtitleScrollEle.querySelector(`#container-${segment} textarea`).click();
          }, 2000);
      }
    }
  }, [videoDetails]);

  useEffect(() => {
    setAudioPlayer($audioRef.current);
    // eslint-disable-next-line
  }, [$audioRef.current]);

  const sourceLength = (index) => {
    if (sourceText[index]?.transcription_text?.trim() !== "")
      return sourceText[index]?.transcription_text?.trim().split(" ").length;
    return 0;
  };

  const targetLength = (index) => {
    if (sourceText[index]?.text?.trim() !== "")
      return sourceText[index]?.text?.trim().split(" ").length;
    return 0;
  };

  useEffect(() => {
    let temp = [];
    subtitlesForCheck?.forEach(() => temp.push(1));

    $audioRef.current = $audioRef.current.slice(0, subtitlesForCheck?.length);
    setSpeedChangeBtn(subtitlesForCheck?.map(() => false));
    setDurationError(subtitlesForCheck?.map(() => false));
  }, [subtitlesForCheck]);

  useEffect(() => {
    if (currentPage) {
      setCurrentOffset(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    let updatedArray = [];
    let changed = false;
    // if (!!subtitles) {
    //   const recorderArray = subtitles.map(() => "stop");
    //   setRecordAudio(recorderArray);
    //   setData(new Array(recorderArray.length));
    //   updatedArray = subtitles.map(() => "");
    // }

    subtitles?.forEach((item, index) => {
      if(!item.hasOwnProperty("blobUrl")){
      if (item.audio && item.audio.hasOwnProperty("audioContent")) {
        if(item.audio.audioContent === ""){
          updatedArray[index] = "";
        }else{
          const blobUrl = base64toBlob(item.audio.audioContent);
          item.blobUrl = blobUrl;
          updatedArray[index] = blobUrl;
        }
      }
      changed = true;
      }
    });

    if(changed){
    setData(updatedArray);
    setSourceText(subtitles);
    }
  }, [subtitles]);

  const changeTranscriptHandler = (text, index, type="translation") => {
    const arr = [...sourceText];

    arr.forEach((element, i) => {
      if (index === i) {
        if(type==="translation"){
        element.text = text;
        }else if(type === "audio"){
        element.text_changed = true;
        }else if(type === "retranslate"){
        element.retranslate = true;  
        }else{
        element.transcription_text = text;
        }
      }
      if(index === "retranslate" && type === "retranslate"){
        element.retranslate = true;  
      }
      if(index === "audio" && type === "audio"){
        element.text_changed = true;  
      }
    });

    dispatch(setSubtitles(arr, C.SUBTITLES));
    if(type === "audio" || type === "retranslate"){
      saveTranscriptHandler(false, true);
      setFetchInProgress(true);
    }
    // saveTranscriptHandler(false, false);
  };

  const saveTranscriptHandler = async (
    isFinal,
    isGetUpdatedAudio,
    value = currentPage,
    bookmark = false,
    ) => {
    dispatch(
      setSnackBar({
        open: true,
        message: "Saving...",
        variant: "info",
      })
    );
    
    // if(isGetUpdatedAudio){
    //   SaveTranscriptAPI.isSaveInProgress(true);
    // }

    const subs = JSON.parse(JSON.stringify(sourceText));
    const reqBody = {
      task_id: taskId,
      ...(bookmark && {bookmark: currentIndex}),
      offset: value,
      payload: {
        payload: subs,
      },
    };

    if (isFinal) {
      reqBody.final = true;
    }else{
      reqBody.payload.payload.forEach(element => {
        element.audio = "";
      });
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
    setLoader(true);
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

  const createGlossary = (sentences) => {
    const userId = loggedInUserData.id;

    const apiObj = new CreateGlossaryAPI(userId, sentences);
    dispatch(APITransport(apiObj));
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


  useEffect(() => {
    const subtitleScrollEle = document.getElementById("subtitleContainerVO");
    subtitleScrollEle
      .querySelector(`#container-0`)
      ?.scrollIntoView(true, { block: "start" });
  }, [currentOffset]);

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
          "subscriptSuperscriptPreferenceVoiceOver",
          selection
        );
      }
    }, 0);
  };

  const handleTimeChange = useCallback(
    (value, index, type, time) => {
      const sub = timeChange(value, index, type, time, player);
      dispatch(setSubtitles(sub, C.SUBTITLES));
    },
    // eslint-disable-next-line
    [limit, currentOffset, player]
  );

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

    const sub = onSubtitleChange(textarea.value, index, 3);
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

  const prevOffsetRef = useRef(currentOffset);
  useEffect(() => {
    if (prevOffsetRef.current !== currentOffset) {
      setUndoStack([]);
      setRedoStack([]);
      prevOffsetRef.current = currentOffset;
    }
  }, [limit, currentOffset]);

  const onUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      const sub = onUndoAction(lastAction, true);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
      setRedoStack((prevState) => [...prevState, lastAction]);
    }
  }, [undoStack, redoStack]);

  const onRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const lastAction = redoStack[redoStack.length - 1];
      const sub = onRedoAction(lastAction, true);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
      setUndoStack((prevState) => [...prevState, lastAction]);
    }
  }, [undoStack, redoStack]);

  const onMergeClick = useCallback(
    (index) => {
      const selectionStart = getSelectionStart(index, true);
      const targetSelectionStart = getTargetSelectionStart(index, true);

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

      const sub = onMerge(index, true);
      dispatch(setSubtitles(sub, C.SUBTITLES));
    },
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

    const sub = onSplit(currentIndexToSplitTextBlock, selectionStart, null, null, true, true);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, true, sub);

  }, [currentIndexToSplitTextBlock, selectionStart, limit, currentOffset]);
  
  const expandTimestamp = useCallback(() => {
    const sub = onExpandTimeline(currentIndex, true);
    dispatch(setSubtitles(sub, C.SUBTITLES));

  }, [currentIndex, limit]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const arr = [...sourceText];
  //     let fetchAudio = false;

  //     arr.forEach((element) => {
  //       if(element.audio.audioContent === ""){
  //         element.text_changed = true;  
  //         fetchAudio = true;
  //         console.log(element.start_time);
  //       }
  //     });
  
  //     if(fetchAudio){
  //       dispatch(setSubtitles(arr, C.SUBTITLES));
  //       saveTranscriptHandler(false, true);
  //     }

  //   }, 60000);
  // }, [currentOffset, sourceText]);

  const handleTranscriptExport = async () => {
    const { transcription, speakerInfo } = exportTypes;

    transcription.map(async (transcript)=>{
    const apiObj = new exportTranscriptionAPI(
      taskId,
      transcript,
      speakerInfo
    );
    setOpenExportDialog(false);

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });

      if (res.ok) {
        const resp = await res.blob();

        exportFile(resp, taskData, transcript, "transcription");
      } else {
        const resp = await res.json();

        dispatch(
          setSnackBar({
            open: true,
            message: resp.message,
            variant: "success",
          })
        );
      }
    } catch (error) {
      dispatch(
        setSnackBar({
          open: true,
          message: "Something went wrong!!",
          variant: "error",
        })
      );
    }})
  };

  const handleTranslationExport = async () => {
    const { translation, speakerInfo } = exportTypes;

    translation.map(async (translate)=>{
    const apiObj = new exportTranslationAPI(taskId, translate, speakerInfo);
    setOpenExportDialog(false);

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });

      if (res.ok) {
        const resp = await res.blob();

        exportFile(resp, taskData, translate, "translation");
      } else {
        const resp = await res.json();

        dispatch(
          setSnackBar({
            open: true,
            message: resp.message,
            variant: "success",
          })
        );
      }
    } catch (error) {
      dispatch(
        setSnackBar({
          open: true,
          message: "Something went wrong!!",
          variant: "error",
        })
      );
    }})
  };

  const handleExportSubmitClick = (taskType) => {
    if(taskType === "TRANSCRIPTION_VOICEOVER_EDIT"){
      handleTranscriptExport();
    }else{
      handleTranslationExport();
    }
  };

  const handleExportRadioButtonChange = (event) => {
    const {
      target: { name, value },
    } = event;

    setExportTypes((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleExportCheckboxChange = (event) => {
    const {
      target: { name, value },
    } = event;
    let new_val=exportTypes[name]
    if (new_val.includes(value)){
      new_val = new_val.filter(item => item !== value)
    } else{
      new_val.push(value)
    }
    setExportTypes((prevState) => ({
      ...prevState,
      [name]: new_val,
    }));
  }

  return (
    <>
      {renderSnackBar()}
      {loader && <CircularProgress style={{position:"absolute", left:"50%", top:"50%", zIndex:"100"}} color="primary" size="50px" />}
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
            undoStack={undoStack}
            redoStack={redoStack}
            onUndo={onUndo}
            onRedo={onRedo}
            currentIndex={currentIndex}
            onMergeClick={onMergeClick}
            onSplitClick={onSplitClick}
            showPopOver={showPopOver}
            expandTimestamp={expandTimestamp}
            handleReGenerateTranslation={()=>{changeTranscriptHandler(null, "retranslate", "retranslate")}}
            handleGetUpdatedAudioForAll={()=>{changeTranscriptHandler(null, "audio", "audio")}}
            bookmarkSegment={() => {saveTranscriptHandler(false, false, currentPage, true)}}
            setOpenExportDialog={setOpenExportDialog}
            disabled={disable}
          />
        </Grid>

        <Box className={classes.subTitleContainer} id={"subtitleContainerVO"} style={{height: showTimeline ? "calc(100vh - 270px)" : "calc(84vh - 60px)"}}>
          {sourceText?.map((item, index) => {
            return (
              <div
                key={index}
                className={isDisabled(index) ? classes.disabledCard : ""}
                style={{
                  padding: "5px 0",
                  // margin: "2px",
                  // borderBottom: "1px solid grey",
                  backgroundColor: "white",
                }}
                id={`container-${index}`}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    padding: "0",
                  }}
                  style={{ alignItems: "center", padding: 0, width: "100%" }}
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
                  {item?.transcription_text?.length>-1 &&
                    <div
                      className={classes.relative}
                      onContextMenu={handleContextMenu}
                      style={{ width: "100%" }}
                    >
                      <textarea
                        readOnly={fetchInProgress ? true: false}
                        rows={item.transcription_text ? 4 : 6}
                        className={`${classes.textAreaTransliteration} ${currentIndex === index ? classes.boxHighlight : ""
                          }`}
                        onMouseUp={(e) => onMouseUp(e, index)}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        style={{ fontSize: fontSize }}
                        ref={(el) => (textboxes.current[index] = el)}
                        value={item.transcription_text}
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
                          left: "20px",
                          top: "3px"
                        }}
                      >
                        {sourceLength(index)}
                      </span>
                    </div>}

                  <div className={classes.relative}
 style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", width: "50%" ,         marginLeft: isSmallScreen ? "80px" : "0px",
        marginRight: isSmallScreen ? "65px" : "0px",
   
}}>
                    <div>{item.id}</div>
                    <div style={{ fontSize: "0.8rem" }}>Duration: {item.time_difference}</div>
                    <div style={{display: "flex"}}>
                    <Tooltip title="Regenerate Translation" placement="bottom">
                      <IconButton
                        className={classes.optionIconBtn}
                        style={{marginRight:"20px", marginLeft:"20px"}}
                        onClick={() => changeTranscriptHandler(null, index, "retranslate")}
                        disabled={apiInProgress}
                      >
                        <LoopIcon className={classes.rightPanelSvg} />
                      </IconButton>
                    </Tooltip>
                    <div>
                    <TimeBoxes
                      readOnly={fetchInProgress ? true: false}
                      handleTimeChange={handleTimeChange}
                      time={item.start_time}
                      index={index}
                      type={"startTime"}
                    />
                    <TimeBoxes
                      readOnly={fetchInProgress ? true: false}
                      handleTimeChange={handleTimeChange}
                      time={item.end_time}
                      index={index}
                      type={"endTime"}
                    />
                    </div>
                    {taskData.source_type === "Machine Generated" &&
                    <Tooltip title="Get Updated Audio" placement="bottom">
                      <IconButton
                        className={classes.optionIconBtn}
                        onClick={() => changeTranscriptHandler(null, index, "audio")}
                        style={{marginRight:"20px", marginLeft:"20px"}}
                        disabled={apiInProgress}
                      >
                        <TaskAltIcon className={classes.rightPanelSvg} />
                      </IconButton>
                    </Tooltip>
                    }
                    </div>
                    <Box
                      sx={{
                        width: index === 2 ? "100%" : "50%",
                        ...(!xl && { width: "100%", margin: "0" }),
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
                          <AudioPlayer src={data[index]} fast={item?.fast_audio}/>
                          {/* <audio
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
                              // width: index === 2 ? "91%" : "",
                              // margin: index === 2 ? "0 auto 25px auto" : "",
                            }}
                          /> */}
                        </div>
                        <div
                          style={{
                            color: "#000",
                            margin: "18px auto",
                            fontSize: "18px",
                            // display: recordAudio[index] === "stop" ? "none" : "",
                            display: "none"
                          }}
                        >
                          <div>Recording Audio....</div>
                          <div style={{ marginTop: "10px" }}>
                            Remaining Time:{" "}
                            {`${item.time_difference - recorderTime > 0
                              ? item.time_difference - recorderTime
                              : 0
                              }`}{" "}
                            sec
                          </div>
                        </div>
                      </div>
                    </Box>
                  </div>

                  {taskData?.target_language !== "en" &&
                    enableTransliteration ? (
                    <IndicTransliterate
                      customApiURL={`${configs.BASE_URL_AUTO}${endpoints.transliteration}`}
                      enableASR={true}
                      asrApiUrl={`${configs.BASE_URL_AUTO}/asr-api/generic/transcribe`}
                      apiKey={`JWT ${localStorage.getItem("token")}`}
                      lang={taskData?.target_language}
                      value={item.text}
                      onChangeText={(text) => {
                        changeTranscriptHandler(text, index);
                      }}
                      containerStyles={{
                        width: "100%",
                      }}
                      onMouseUp={(e) => onMouseUp(e, index)}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowPopOver(false);
                        }, 200);
                      }}
                      style={{ fontSize: fontSize }}
                      renderComponent={(props) => (
                        <div className={classes.relative}>
                          <textarea
                            readOnly={fetchInProgress ? true: false}
                            className={`${classes.textAreaTransliteration} ${currentIndex === index ? classes.boxHighlight : ""
                              } ${taskData?.source_type === "Original Source" &&
                              classes.w95
                              }`}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            ref={(el) => (textboxes.current[index] = el)}
                            rows={item.transcription_text ? 4 : 6}
                            onBlur={() => {
                              setTimeout(() => {
                                setShowPopOver(false);
                              }, 200);
                            }}
                            disabled={isDisabled(index)}
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
                              right: item.transcription_text ? "20px" : "32px",
                              top: "3px"
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
                        readOnly={fetchInProgress ? true: false}
                        rows={item.transcription_text ? 4 : 6}
                        className={`${classes.textAreaTransliteration} ${currentIndex === index ? classes.boxHighlight : ""
                          } ${taskData?.source_type === "Original Source" &&
                          classes.w95
                          }`}
                        ref={(el) => (textboxes.current[index] = el)}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        onMouseUp={(e) => onMouseUp(e, index)}
                        style={{ fontSize: fontSize }}
                        onChange={(event) => {
                          changeTranscriptHandler(
                            event.target.value,
                            index,
                          );
                        }}
                        value={item.text}
                        onBlur={() => {
                          setTimeout(() => {
                            setShowPopOver(false);
                          }, 200);
                        }}
                        disabled={isDisabled(index)}
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
                          right: item.transcription_text ? "20px" : "32px",
                          top: "3px"
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
            // jumpTo={[...Array(totalPages).keys()].map((_, index) => index + 1)}
            jumpTo={taskData?.task_type?.includes("VOICEOVER")?[...Array(totalPages).keys()].map((_, index) => index + 1).filter((p)=>p%15==1):[...Array(totalPages).keys()].map((_, index) => index + 1)}
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

        {openGlossaryDialog && (
          <GlossaryDialog
            openDialog={openGlossaryDialog}
            handleClose={() => setOpenGlossaryDialog(false)}
            submit={(sentences) => createGlossary(sentences)}
            selectedWord={selectedWord}
            title={glossaryDialogTitle}
            srcLang={taskData?.src_language}
            tgtLang={taskData?.target_language}
            disableFields={true}
          />
        )}

        {openExportDialog && (
          <ExportDialog
            open={openExportDialog}
            handleClose={() => setOpenExportDialog(false)}
            task_type="TRANSLATION_VOICEOVER_EDIT"
            taskType="TRANSLATION_VOICEOVER_EDIT"
            exportTypes={exportTypes}
            handleExportSubmitClick={handleExportSubmitClick}
            handleExportRadioButtonChange={handleExportRadioButtonChange}
            handleExportCheckboxChange={handleExportCheckboxChange}
            isBulkTaskDownload={false}
            currentSelectedTasks={[]}
            multiOptionDialog={true}
          />
        )}
      </Box>
    </>
  );
};

export default VoiceOverRightPanel1;
