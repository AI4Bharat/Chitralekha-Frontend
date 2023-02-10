import Sub from "./Sub";
import { getUpdatedTime } from "./utils";
import DT from "duration-time-conversion";
import store from "../redux/store/store";

export const newSub = (item) => {
  return new Sub(item);
};

export const formatSub = (sub) => {
  if (Array.isArray(sub)) {
    return sub.map((item) => newSub(item));
  }
  return newSub(sub);
};

export const hasSub = (sub) => {
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

export const timeChange = (value, index, type, time) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];

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
      copySub[index].end_time
    );
  }

  return copySub;
};

export const addSubtitleBox = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = copySubs(subtitles);

  copySub.splice(
    index + 1,
    0,
    newSub({
      start_time: copySub[index].end_time,
      end_time:
        index < subtitles.length - 1
          ? copySub[index + 1].start_time
          : copySub[index].end_time,
      text: "SUB_TEXT",
      target_text: "SUB_TEXT",
    })
  );

  return copySub;
};

export const onMerge = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const existingsourceData = copySubs(subtitles);

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

  return existingsourceData;
};

export const onSubtitleDelete = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const copySub = copySubs(subtitles);
  copySub.splice(index, 1);

  return copySub;
};

export const onSplit = (currentIndex, selectionStart, targetSelectionStart = null) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = copySubs(subtitles);

  const targetTextBlock = subtitles[currentIndex];
  const index = hasSub(subtitles[currentIndex], subtitles);

  const text1 = targetTextBlock.text.slice(0, selectionStart).trim();
  const text2 = targetTextBlock.text.slice(selectionStart).trim();
  const targetText1 = targetSelectionStart ? targetTextBlock.target_text.slice(0, targetSelectionStart).trim() : null;
  const targetText2 = targetSelectionStart ? targetTextBlock.target_text.slice(targetSelectionStart).trim() : null;

  if ((!text1 || !text2) || (targetSelectionStart && (!targetText1 || !targetText2))) return;

  const splitDuration = (
    targetTextBlock.duration *
    (selectionStart / targetTextBlock.text.length)
  ).toFixed(3);

  if (splitDuration < 0.2 || targetTextBlock.duration - splitDuration < 0.2)
    return;

  copySub.splice(currentIndex, 1);

  const middleTime = DT.d2t(
    targetTextBlock.startTime + parseFloat(splitDuration)
  );

  copySub.splice(
    index,
    0,
    newSub({
      start_time: subtitles[currentIndex].start_time,
      end_time: middleTime,
      text: text1,
      ...(targetSelectionStart && { target_text: targetText1 })
    })
  );

  copySub.splice(
    index + 1,
    0,
    newSub({
      start_time: middleTime,
      end_time: subtitles[currentIndex].end_time,
      text: text2,
      ...(targetSelectionStart && { target_text: targetText2 })
    })
  );

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

export const onUndoAction = (lastAction) => {
  const subtitles = store.getState().commonReducer.subtitles;
  if (lastAction.type === "merge") {
    console.log(lastAction, "lastAction");
    return (
      onSplit(
        lastAction.index,
        lastAction.selectionStart >= subtitles[lastAction.index].text.length
          ? subtitles[lastAction.index].text.length / 2
          : lastAction.selectionStart,
        lastAction.targetSelectionStart >= subtitles[lastAction.index].target_text.length
          ? subtitles[lastAction.index].target_text.length / 2
          : lastAction.targetSelectionStart
      ) ?? subtitles
    );
  } else if (lastAction.type === "split") {
    return onMerge(lastAction.index) ?? subtitles;
  } else if (lastAction.type === "delete") {
    const copySub = copySubs(subtitles);
    copySub.splice(lastAction.index, 0, lastAction.data);
    return copySub;
  } else if (lastAction.type === "add") {
    return onSubtitleDelete(lastAction.index+1);
  }
  return subtitles;
};

export const onRedoAction = (lastAction) => {
  const subtitles = store.getState().commonReducer.subtitles;
  if (lastAction.type === "merge") {
    return onMerge(lastAction.index) ?? subtitles;
  } else if (lastAction.type === "split") {
    return (
      onSplit(
        lastAction.index,
        lastAction.selectionStart >= subtitles[lastAction.index].text.length
          ? subtitles[lastAction.index].text.length / 2
          : lastAction.selectionStart,
        lastAction.targetSelectionStart >= subtitles[lastAction.index].target_text.length
          ? subtitles[lastAction.index].target_text.length / 2
          : lastAction.targetSelectionStart
      ) ?? subtitles
    );
  } else if (lastAction.type === "delete") {
    return onSubtitleDelete(lastAction.index);
  } else if (lastAction.type === "add") {
    return addSubtitleBox(lastAction.index);
  }
  return subtitles;
};