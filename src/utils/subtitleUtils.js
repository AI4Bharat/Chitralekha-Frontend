import Sub from "./Sub";
import { getUpdatedTime } from "./utils";
import DT from "duration-time-conversion";

export const newSub = (item) => {
  return new Sub(item);
};

export const formatSub = (sub) => {
  if (Array.isArray(sub)) {
    return sub.map((item) => newSub(item));
  }
  return newSub(sub);
};

export const hasSub = (sub, subtitles) => {
  return subtitles.indexOf(sub);
};

export const copySubs = (subtitles) => {
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

export const timeChange = (sourceText, value, index, type, time) => {
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
      copySub[index].end_time
    );
  }

  return copySub;
};

export const addSubtitleBox = (sourceText, index) => {
  const copySub = copySubs(sourceText);
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

  return copySub;
};

export const onMerge = (subtitles, index) => {
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

export const onSubtitleDelete = (subtitles, index) => {
  const copySub = copySubs(subtitles);
  copySub.splice(index, 1);

  return copySub;
};

export const onSplit = (subtitles, currentIndex, selectionStart) => {
  const copySub = copySubs(subtitles);

  const targetTextBlock = subtitles[currentIndex];
  const index = hasSub(subtitles[currentIndex], subtitles);

  const text1 = targetTextBlock.text.slice(0, selectionStart).trim();
  const text2 = targetTextBlock.text.slice(selectionStart).trim();

  if (!text1 || !text2) return;

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
    })
  );

  copySub.splice(
    index + 1,
    0,
    newSub({
      start_time: middleTime,
      end_time: subtitles[currentIndex].end_time,
      text: text2,
    })
  );

  return copySub;
};
