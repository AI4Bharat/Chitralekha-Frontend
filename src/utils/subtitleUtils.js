import Sub from "./Sub";
import { getDateTime, getUpdatedTime } from "./utils";
import DT from "duration-time-conversion";
import store from "../redux/store/store";
import { noiseTags } from "config";
import { specialOrgIds } from "config";
import getLocalStorageData from "./getLocalStorageData";
import { FetchVideoDetailsAPI } from "redux/actions";

export const newSub = (item) => {
  return new Sub(item);
};

export const formatSub = (sub) => {
  if (Array.isArray(sub)) {
    return sub.map((item) => newSub(item));
  }
  return newSub(sub);
};

export const hasSub = (sub, type) => {
  const subtitles = store.getState().commonReducer.subtitles;

  return subtitles.indexOf(sub);
};

export const copySubs = () => {
  const subtitles = store.getState().commonReducer.subtitles;
  return formatSub(subtitles);
};

export const fontMenu = [
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

export const getKeyCode = (event) => {
  const tag = document.activeElement.tagName.toUpperCase();
  const editable = document.activeElement.getAttribute("contenteditable");
  if (
    tag !== "INPUT" &&
    tag !== "TEXTAREA" &&
    editable !== "" &&
    editable !== "true"
  ) {
    return Number(event.keyCode);
  }
};

export const timeChange = (value, index, type, time, player) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];

  if (type === "startTime") {
    copySub[index].start_time = getUpdatedTime(
      value,
      time,
      copySub[index].start_time,
      index,
      type,
      player,
    );
  } else {
    copySub[index].end_time = getUpdatedTime(
      value,
      time,
      copySub[index].end_time,
      index,
      type,
      player,
    );
  }

  return copySub;
};

export const addSubtitleBox = (index, paraphrase=false) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const copySub = [...subtitles];

  if(index === -1){
    copySub.splice(
      0,
      0,
      newSub({
        start_time: DT.d2t(0),
        end_time: DT.d2t(5),
        text: "",
        speaker_id: "",
        target_text: "",
      })
    );
  
    return copySub;
  }else{
  const duration = DT.t2d(copySub[index].end_time);

  copySub.splice(
    index + 1,
    0,
    newSub({
      start_time: copySub[index].end_time,
      end_time:
        index < subtitles.length - 1
          ? copySub[index + 1].start_time
          : DT.d2t(duration + 0.5),
      text: "",
      speaker_id: "",
      ...(paraphrase ? {paraphrased_text: ""} : {target_text: ""})
    })
  );

  return copySub;
  }
};

export const onMerge = (index, votr=false, paraphrase=false) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const existingsourceData = [...subtitles];

  if(votr){
  existingsourceData.splice(
    index,
    2,
    newSub({
      id: existingsourceData[index].id,
      start_time: existingsourceData[index].start_time,
      end_time: existingsourceData[index + 1].end_time,
      time_difference: (parseFloat(existingsourceData[index].time_difference) + parseFloat(existingsourceData[index+1].time_difference)).toFixed(3),
      text: `${existingsourceData[index].text} ${
        existingsourceData[index + 1].text
      }`,
      transcription_text: `${existingsourceData[index].transcription_text} ${
        existingsourceData[index + 1].transcription_text
      }`,
      audio:existingsourceData[index].audio,
      audio_speed: existingsourceData[index].audio_speed,
      blobUrl: existingsourceData[index].blobUrl,
    })
  );
  }else{
  existingsourceData.splice(
    index,
    2,
    newSub({
      id: existingsourceData[index].id,
      start_time: existingsourceData[index].start_time,
      end_time: existingsourceData[index + 1].end_time,
      text: `${existingsourceData[index].text} ${
        existingsourceData[index + 1].text
      }`,
      ...(paraphrase ? {paraphrased_text: `${existingsourceData[index].paraphrased_text} ${
        existingsourceData[index + 1].paraphrased_text
      }`} : {target_text: `${existingsourceData[index].target_text} ${
        existingsourceData[index + 1].target_text
      }`}),
      speaker_id: "",
    })
  );
  }

  return existingsourceData;
};

export const onSubtitleDelete = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const copySub = [...subtitles];
  copySub.splice(index, 1);

  return copySub;
};

export const onCopyToParaphrasedSegment = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  subtitles[index].paraphrased_text = subtitles[index].text;
  return subtitles;
};

export const onSplit = (
  currentIndex,
  selectionStart,
  timings = null,
  targetSelectionStart = null,
  translateSplit = false,
  votr=false,
  paraphrase=false,
) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const copySub = [...subtitles];

  const targetTextBlock = subtitles[currentIndex];
  const index = hasSub(subtitles[currentIndex], subtitles);

  let text1, text2, targetText1, targetText2, splitDuration;
  if(votr){
    text1 = targetTextBlock.transcription_text.slice(0, selectionStart).trim();
    text2 = targetTextBlock.transcription_text.slice(selectionStart).trim();
  }else{
    text1 = targetTextBlock.text.slice(0, selectionStart).trim();
    text2 = targetTextBlock.text.slice(selectionStart).trim();  
  }
  
  if(text1 && text2){
    if(votr){
      targetText1 = translateSplit ? targetTextBlock.text : targetSelectionStart
      ? targetTextBlock.text.slice(0, targetSelectionStart).trim()
      : null;
      targetText2 = translateSplit ? " " : targetSelectionStart
        ? targetTextBlock.text.slice(targetSelectionStart).trim()
        : null;
    }else if(paraphrase === true){
      targetText1 = targetSelectionStart
        ? targetTextBlock.paraphrased_text.slice(0, targetSelectionStart).trim()
        : targetTextBlock.paraphrased_text;
      targetText2 = targetSelectionStart
        ? targetTextBlock.paraphrased_text.slice(targetSelectionStart).trim()
        : "";
    }else{
      targetText1 = translateSplit ? targetTextBlock.target_text : targetSelectionStart
        ? targetTextBlock.target_text.slice(0, targetSelectionStart).trim()
        : null;
      targetText2 = translateSplit ? " " : targetSelectionStart
        ? targetTextBlock.target_text.slice(targetSelectionStart).trim()
        : null;
    }

    if (
      !text1 ||
      !text2 ||
      (targetSelectionStart && (!targetText1 || !targetText2))
    )
      return subtitles;

    copySub.splice(currentIndex, 1);
    let middleTime = null;

    if (!timings) {
      if(votr){
        splitDuration = (
          targetTextBlock.duration *
          (selectionStart / targetTextBlock.transcription_text.length)
        ).toFixed(3);
      }else{
        splitDuration = (
          targetTextBlock.duration *
          (selectionStart / targetTextBlock.text.length)
        ).toFixed(3);
      }

      if (splitDuration < 0.2 || targetTextBlock.duration - splitDuration < 0.2)
        return subtitles;

      middleTime = DT.d2t(targetTextBlock.startTime + parseFloat(splitDuration));
    }

    if(votr){
    copySub.splice(
      index,
      0,
      newSub({
        id: targetTextBlock.id,
        start_time: middleTime
          ? subtitles[currentIndex].start_time
          : timings[0].start,
        end_time: middleTime ?? timings[0].end,
        time_difference: (DT.t2d(middleTime)-DT.t2d(targetTextBlock.start_time)).toFixed(3),
        text: targetText1,
        transcription_text: text1,
        audio:targetTextBlock.audio,
        audio_speed: targetTextBlock.audio_speed,
        blobUrl: targetTextBlock.blobUrl,
      })
    );

    copySub.splice(
      index + 1,
      0,
      newSub({
        start_time: middleTime ?? timings[1].start ?? timings[0].end,
        end_time:
          middleTime || !timings[1].end
            ? subtitles[currentIndex].end_time
            : timings[1].end,
        time_difference: (DT.t2d(targetTextBlock.end_time)-DT.t2d(middleTime)).toFixed(3),
        text: targetText2,
        transcription_text: text2,
        audio:targetTextBlock.audio,
        audio_speed: targetTextBlock.audio_speed,
        blobUrl: targetTextBlock.blobUrl,
      })
    );
    }else{
    copySub.splice(
      index,
      0,
      newSub({
        start_time: middleTime
          ? subtitles[currentIndex].start_time
          : timings[0].start,
        end_time: middleTime ?? timings[0].end,
        text: text1,
        speaker_id: "",
        ...(paraphrase ? {paraphrased_text: targetText1} : ((translateSplit || targetSelectionStart) && { target_text: targetText1 })),
      })
    );

    copySub.splice(
      index + 1,
      0,
      newSub({
        start_time: middleTime ?? timings[1].start ?? timings[0].end,
        end_time:
          middleTime || !timings[1].end
            ? subtitles[currentIndex].end_time
            : timings[1].end,
        text: text2,
        speaker_id: "",
        ...(paraphrase ? {paraphrased_text: targetText2} : ((translateSplit || targetSelectionStart) && { target_text: targetText2 })),
      })
    );
    }
  }
  return copySub;
};

export const onExpandTimeline = (id, vo=false) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const copySub = [...subtitles];

  if(id === 0 && copySub.length > 1){
    // copySub[id].start_time = DT.d2t(0);
    copySub[id].end_time = DT.d2t(DT.t2d(copySub[id+1].start_time)-0.2);
  }else if(id+1 === copySub.length){
    copySub[id].start_time = DT.d2t(DT.t2d(copySub[id-1].end_time)+0.2)
  }else{
    copySub[id].start_time = DT.d2t(DT.t2d(copySub[id-1].end_time)+0.2)
    copySub[id].end_time = DT.d2t(DT.t2d(copySub[id+1].start_time)-0.2);
  }

  if(vo===true){
    copySub[id].time_difference = (DT.t2d(copySub[id].end_time) - DT.t2d(copySub[id].start_time)).toFixed(3);
  }

  return copySub;
};

export const onSubtitleChange = (text, index, id) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const copySub = [...subtitles];

  copySub.forEach((element, i) => {
    if (index === i) {
      if (id === 1) {
        element.target_text = text;
      } else if (id === 3) {
        element.transcription_text = text;
      } else{
        element.text = text;
      }
    }
  });

  return copySub;
};

export const fullscreenUtil = (element) => {
  let doc = window.document;
  let docEl = element;

  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;

  const cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
    return true;
  } else {
    cancelFullScreen.call(doc);
    return false;
  }
};

export const themeMenu = [
  { label: "Light", mode: "light" },
  { label: "Dark", mode: "dark" },
];

export const playbackSpeed = [
  {
    label: "0.25",
    speed: 0.25,
  },
  {
    label: "0.5",
    speed: 0.5,
  },
  {
    label: "0.75",
    speed: 0.75,
  },
  {
    label: "Normal",
    speed: 1,
  },
  {
    label: "1.25",
    speed: 1.25,
  },
  {
    label: "1.5",
    speed: 1.5,
  },
  {
    label: "1.75",
    speed: 1.75,
  },
  {
    label: "2",
    speed: 2,
  },
];

export const placementMenu = [
  { label: "Top", mode: "top" },
  { label: "Bottom", mode: "bottom" },
];

export const onUndoAction = (lastAction, votr=false, paraphrase=false) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const { type, index, selectionStart, targetSelectionStart, timings, data } =
    lastAction;

  switch (type) {
    case "merge":
      return (
        onSplit(index, selectionStart, timings, targetSelectionStart, false, votr, paraphrase)
      );

    case "split":
      return onMerge(index, votr, paraphrase);

    case "delete":
      const copySub = copySubs();
      copySub.splice(index, 0, data);
      return copySub;

    case "add":
      return onSubtitleDelete(index + 1);

    default:
      return subtitles;
  }
};

export const onRedoAction = (lastAction, votr=false, paraphrase=false) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const { type, index, selectionStart, targetSelectionStart, timings } =
    lastAction;

  switch (type) {
    case "merge":
      return onMerge(index, votr, paraphrase) || subtitles;

    case "split":
      return (
        onSplit(index, selectionStart, timings, targetSelectionStart, false, votr, paraphrase) ||
        subtitles
      );

    case "delete":
      return onSubtitleDelete(index);

    case "add":
      return addSubtitleBox(index);

    default:
      return subtitles;
  }
};

export const setAudioContent = (index, audio) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = copySubs(subtitles);

  copySub[index].audio = { audioContent: audio };

  return copySub;
};

export const base64toBlob = (base64) => {
  const byteCharacters = atob(base64);

  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: "audio/wav" });
  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
};

export const getSubtitleRange = () => {
  const subtitles = store.getState().commonReducer.subtitles;

  if (subtitles) {
    if (subtitles.length) {
      return `${subtitles[0]?.id} - ${subtitles[subtitles.length-1]?.id}`;
    } else {
      return `${subtitles[0]?.id} - ${subtitles[0]?.id}`;
    }
  }
};

export const getSubtitleRangeTranscript = () => {
  const rangeStart = store.getState().commonReducer.rangeStart;
  const rangeEnd = store.getState().commonReducer.rangeEnd;

  if (rangeStart && rangeEnd) {
    return `${rangeStart} - ${rangeEnd}`;
  }
};

export const isPlaying = (player) => {
  return !!(
    player.currentTime > 0 &&
    !player.paused &&
    !player.ended &&
    player.readyState > 2
  );
};

export const getSelectionStart = (index, votr=false) => {
  const subtitles = store.getState().commonReducer.subtitles;
  if(votr){
    return subtitles[index].transcription_text.length;
  }else{
    return subtitles[index].text.length;
  }
};

export const getTargetSelectionStart = (index, votr=false, paraphrase=false) => {
  const subtitles = store.getState().commonReducer.subtitles;
  if(votr){
    return subtitles[index].text.length;
  }else{
    if(paraphrase){
      return subtitles[index].paraphrased_text.length;
    }else{
      return subtitles[index].target_text.length;
    }
  }
};

export const getTimings = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const timings = [
    {
      start: subtitles[index].start_time,
      end: subtitles[index].end_time,
    },
    {
      start: subtitles[index + 1]?.start_time,
      end: subtitles[index + 1]?.end_time,
    },
  ];

  return timings;
};

export const getItemForDelete = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const data = subtitles[index];

  return data;
};

export const assignSpeakerId = (id, index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];
  copySub[index].speaker_id = id;

  return copySub;
};

export const getTagsList = (sourceLang) => {
  switch (sourceLang) {
    case "Hindi":
      return noiseTags.hindi;
    case "Malayalam":
      return noiseTags.malayalam;
    case "Bengali":
      return noiseTags.bengali;
    case "Sanskrit":
      return noiseTags.sanskrit;
    case "Marathi":
      return noiseTags.marathi;
    case "Kannada":
      return noiseTags.kannada;
    case "Telugu":
      return noiseTags.telugu;
    case "Sindhi":
      return noiseTags.sindhi;
    case "Bodo":
      return noiseTags.bodo;
    case "Assamese":
      return noiseTags.assamese;
    case "Tamil":
      return noiseTags.tamil;
    case "Santali":
      return noiseTags.santali;
    case "Odia":
      return noiseTags.odia;
    case "English":
      return noiseTags.english;
    default:
      return [];
  }
};

export const reGenerateTranslation = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];
  copySub[index].retranslate = true;

  return copySub;
};

export const paraphrase = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];
  if(index === "paraphrase"){
    copySub.forEach((element) => {
      element.paraphrase = true;
    })
  }else{
    copySub[index].paraphrase = true;
  }
  return copySub;
};

export const exportVoiceover = async (data, taskDetails, exportTypes) => {
  const userOrgId = getLocalStorageData("userData").organization.id;

  const { video_name: videoName, target_language: targetLanguage, project, video_url, src_language } =
    taskDetails;

  const apiObj = new FetchVideoDetailsAPI(
    video_url,
    src_language,
    project
  );
  const res = await fetch(apiObj.apiEndPoint(), {
    method: "GET",
    headers: apiObj.getHeaders().headers,
  });
  const video = await res.json();
  console.log(video);

  const { voiceover } = exportTypes;

  if (data.azure_url) {
    let fileName = "";
    if (specialOrgIds.includes(userOrgId)) {
      fileName = data.video_name
    } else if (video?.video?.description?.length){
      fileName = `${video.video.description}.${voiceover}`;
    } else {
      fileName = `Chitralekha_Video_${videoName}_${getDateTime()}_${targetLanguage}.${voiceover}`;
    }

    fetch(data.azure_url)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    })
    .catch(error => console.error("Error downloading file:", error));
  }
};

export const exportFile = async (data, taskDetails, exportType, type) => {
  const {
    video: videoId,
    src_language: sourceLanguage,
    target_language: targetLanguage,
    description,    
    project,
    video_url
  } = taskDetails;
  const userOrgId = getLocalStorageData("userData").organization.id;

  const apiObj = new FetchVideoDetailsAPI(
    video_url,
    sourceLanguage,
    project
  );
  const res = await fetch(apiObj.apiEndPoint(), {
    method: "GET",
    headers: apiObj.getHeaders().headers,
  });
  const video = await res.json();

  let newBlob;
  if (exportType === "docx") {
    newBlob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  } else {
    newBlob = new Blob([data]);
  }

  const blobUrl = window.URL.createObjectURL(newBlob);
  const link = document.createElement("a");
  link.href = blobUrl;

  const date = new Date();
  const YYYYMMDD = date
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("");
  const HHMMSS = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

  const format = exportType === "docx-bilingual" ? "docx" : exportType;
  const language = type === "transcription" ? sourceLanguage : targetLanguage;

  let fileName = "";
  if (specialOrgIds.includes(userOrgId) && description.length) {
    fileName = `${description}.${format}`;
  } else if(video?.video?.description?.length){
    fileName = `${video.video.description}.${format}`;
  } else {
    fileName = `Chitralekha_Video${videoId}_${YYYYMMDD}_${HHMMSS}_${language}.${format}`;
  }

  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);

  // clean up Url
  window.URL.revokeObjectURL(blobUrl);
};

export const exportZip = (data, type = "task", videoName) => {
  const newBlob = new Blob([data], { type: "application/zip" });

  const blobUrl = window.URL.createObjectURL(newBlob);

  const link = document.createElement("a");
  link.href = blobUrl;

  const date = new Date();
  const YYYYMMDD = date
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("");

  const HHMMSS = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

  let name = "";
  if (type === "task") {
    name = `Chitralekha_Tasks_${YYYYMMDD}_${HHMMSS}.zip`;
  } else {
    name = `Chitralekha_Video_${videoName}_${YYYYMMDD}_${HHMMSS}.zip`;
  }

  link.setAttribute("download", name);

  document.body.appendChild(link);

  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};
