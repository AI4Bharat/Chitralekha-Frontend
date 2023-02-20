import Sub from "./Sub";
import DT from "duration-time-conversion";
import { useCallback } from "react";
import store from "../redux/store/store";

export function authenticateUser() {
  const access_token = localStorage.getItem("token");
  if (access_token) {
    return true;
  } else {
    return false;
  }
}

export const steps = [
  {
    content: "Welcome to Chitralekha. Let's begin our journey!",
    title: "Welcome",
    placement: "center",
    target: "body",
  },
  {
    target: ".organizations",
    title: "Organizations",
    content: "Access All the info about your organizations here",
    placement: "bottom",
  },
  {
    target: ".projects",
    title: "Projects",
    content: "Access All the info about your projects here",
    placement: "bottom",
  },
  {
    target: ".workspace",
    title: "Workspace",
    content: "Access All the info about your workspace here",
    placement: "bottom",
  },
  {
    target: ".help",
    title: "Help",
    content: "Access Help",
    placement: "bottom",
  },
  {
    target: ".settings",
    title: "Settings",
    content: "Access Settings",
    placement: "bottom",
  },
  {
    target: ".profile",
    title: "User Profile",
    content: "Edit or view your profile information.",
    placement: "bottom",
  },
  {
    target: ".main",
    content: "Content Here",
    placement: "top",
  },
];

export const roles = [
  {
    label: "Transcript editor",
    value: "TRANSCRIPT_EDITOR",
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    orgSettingVisible: false,
    projectSettingVisible: false,
    showSelectCheckbox: false,
    canEditTask: false,
    canDeleteTask: false,
    ProjectReport: false,
    organizationReport: false,
    canAddMembers: false,
  },
  {
    label: "Transcript Reviewer",
    value: "TRANSCRIPT_REVIEWER",
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    orgSettingVisible: false,
    projectSettingVisible: false,
    showSelectCheckbox: false,
    canEditTask: false,
    canDeleteTask: false,
    ProjectReport: false,
    organizationReport: false,
    organizationReport: false,
    canAddMembers: false,
  },
  {
    label: "Translation editor",
    value: "TRANSLATION_EDITOR",
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    orgSettingVisible: false,
    projectSettingVisible: false,
    showSelectCheckbox: false,
    canEditTask: false,
    ProjectReport: false,
    organizationReport: false,
    canAddMembers: false,
  },
  {
    label: "Translation Reviewer",
    value: "TRANSLATION_REVIEWER",
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    orgSettingVisible: false,
    projectSettingVisible: false,
    showSelectCheckbox: false,
    canEditTask: false,
    canDeleteTask: false,
    ProjectReport: false,
    organizationReport: false,
    canAddMembers: false,
  },
  {
    label: "Universal Editor",
    value: "UNIVERSAL_EDITOR",
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    projectSettingVisible: false,
    showSelectCheckbox: false,
    canEditTask: false,
    canDeleteTask: false,
    ProjectReport: false,
    organizationReport: false,
    canAddMembers: false,
  },
  {
    label: "Project Manager",
    value: "PROJECT_MANAGER",
    permittedToDeleteVideoAudio: true,
    permittedToCreateTask: true,
    permittedToAddMembersInProject: true,
    permittedToDeleteProject: true,
    permittedToCreateVideoAudio: true,
    taskAction: false,
    orgSettingVisible: false,
    projectSettingVisible: true,
    showSelectCheckbox: true,
    canEditTask: true,
    canDeleteTask: true,
    ProjectReport: true,
    organizationReport: false,
    canAddMembers: true,
  },
  {
    label: "Organization Owner",
    value: "ORG_OWNER",
    permittedToDeleteVideoAudio: true,
    permittedToCreateTask: true,
    permittedToAddMembersInProject: true,
    permittedToDeleteProject: true,
    permittedToCreateVideoAudio: true,
    taskAction: false,
    orgSettingVisible: true,
    projectSettingVisible: true,
    showSelectCheckbox: true,
    canEditTask: true,
    canDeleteTask: true,
    ProjectReport: true,
    organizationReport: true,
    canAddMembers: true,
  },
];

export const tasks = [
  {
    id: 1,
    type: "TRANSCRIPTION_SELECT_SOURCE",
    label: "Transcription Select Source",
  },
  {
    id: 2,
    type: "TRANSCRIPTION_EDIT",
    label: "Transcription Edit",
  },
  {
    id: 3,
    type: "TRANSCRIPTION_REVIEW",
    label: "Transcription Review",
  },
  {
    id: 4,
    type: "TRANSLATION_SELECT_SOURCE",
    label: "Translation Select Source",
  },
  {
    id: 5,
    type: "TRANSLATION_EDIT",
    label: "Translation Edit",
  },
  {
    id: 6,
    type: "TRANSLATION_REVIEW",
    label: "Translation Review",
  },
];

export const transcriptSelectSource = [
  "Machine Generated",
  "Original Source",
  "Manually Uploaded (srt)",
  "Manually Created",
];

export function ass2vtt(data) {
  const re_ass = new RegExp(
    "Dialogue:\\s\\d," +
      "(\\d+:\\d\\d:\\d\\d.\\d\\d)," +
      "(\\d+:\\d\\d:\\d\\d.\\d\\d)," +
      "([^,]*)," +
      "([^,]*)," +
      "(?:[^,]*,){4}" +
      "([\\s\\S]*)$",
    "i"
  );

  function fixTime(time = "") {
    return time
      .split(/[:.]/)
      .map((item, index, arr) => {
        if (index === arr.length - 1) {
          if (item.length === 1) {
            return "." + item + "00";
          } else if (item.length === 2) {
            return "." + item + "0";
          }
        } else {
          if (item.length === 1) {
            return (index === 0 ? "0" : ":0") + item;
          }
        }

        return index === 0
          ? item
          : index === arr.length - 1
          ? "." + item
          : ":" + item;
      })
      .join("");
  }

  return (
    "WEBVTT\n\n" +
    data
      .split(/\r?\n/)
      .map((line) => {
        const m = line.match(re_ass);
        if (!m) return null;
        return {
          start: fixTime(m[1].trim()),
          end: fixTime(m[2].trim()),
          text: m[5]
            .replace(/{[\s\S]*?}/g, "")
            .replace(/(\\N)/g, "\n")
            .trim()
            .split(/\r?\n/)
            .map((item) => item.trim())
            .join("\n"),
        };
      })
      .filter((line) => line)
      .map((line, index) => {
        if (line) {
          return (
            index +
            1 +
            "\n" +
            line.start +
            " --> " +
            line.end +
            "\n" +
            line.text
          );
        } else {
          return "";
        }
      })
      .filter((line) => line.trim())
      .join("\n\n")
  );
}

export function getExt(url) {
  return url.trim().toLowerCase().split(".").pop();
}

export function srt2vtt(srt) {
  return "WEBVTT \r\n\r\n".concat(
    srt
      .replace(/\{\\([ibu])\}/g, "</$1>")
      .replace(/\{\\([ibu])1\}/g, "<$1>")
      .replace(/\{([ibu])\}/g, "<$1>")
      .replace(/\{\/([ibu])\}/g, "</$1>")
      .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, "$1.$2")
      .replace(/{[\s\S]*?}/g, "")
      .concat("\r\n\r\n")
  );
}

const SUB_GAP = 5;

export function url2sub(url) {
  return new Promise((resolve) => {
    const $video = document.createElement("video");
    const $track = document.createElement("track");
    $track.default = true;
    $track.kind = "metadata";
    $video.appendChild($track);
    $track.onload = () => {
      resolve(
        Array.from($track.track.cues).map((item) => {
          const start = DT.d2t(item.startTime);
          const end = DT.d2t(item.endTime);
          const text = item.text;
          return new Sub({ start, end, text });
        })
      );
    };
    $track.src = url;
  });
}

export function vtt2url(vtt) {
  return URL.createObjectURL(
    new Blob([vtt], {
      type: "text/vtt",
    })
  );
}

export function file2sub(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const ext = getExt(file.name);
      if (ext === "json") {
        try {
          const sub = JSON.parse(reader.result).map((item) => new Sub(item));
          resolve(sub);
        } catch (error) {
          reject(error);
        }
      } else {
        const text = reader.result.replace(/{[\s\S]*?}/g, "");
        switch (ext) {
          case "vtt": {
            const url = vtt2url(text);
            const sub = await url2sub(url);
            resolve(sub);
            break;
          }
          case "ass": {
            const vtt = ass2vtt(text);
            const url = vtt2url(vtt);
            const sub = await url2sub(url);
            resolve(sub);
            break;
          }
          case "srt": {
            const vtt = srt2vtt(text);
            const url = vtt2url(vtt);
            const sub = await url2sub(url);
            resolve(sub);
            break;
          }
          case "json": {
            const sub = JSON.parse(text).map((item) => new Sub(item));
            resolve(sub);
            break;
          }
          default:
            resolve([]);
            break;
        }
      }
    };
    reader.readAsText(file);
  });
}

export function sub2vtt(sub) {
  return (
    "WEBVTT\n\n" +
    sub
      .map((item, index) => {
        return (
          index + 1 + "\n" + item.start + " --> " + item.end + "\n" + item.text
        );
      })
      .join("\n\n")
  );
}

export function sub2srt(sub) {
  return sub
    .map((item, index) => {
      return `${index + 1}\n${item.start.replace(
        ".",
        ","
      )} --> ${item.end.replace(".", ",")}\n${item.text}`;
    })
    .join("\n\n");
}

export function sub2txt(sub) {
  return sub
    .map((item, i) => {
      if (i === 0) return item.text.trim() + " ";
      let startDate = Date.parse("01/01/2000 " + item.start);
      let endDate = Date.parse("01/01/2000 " + sub[i - 1].end);
      if ((startDate - endDate) / 1000 > SUB_GAP)
        return item.text.trim() + "\n\n";
      return item.text.trim() + " ";
    })
    .join("");
}

export const parseSubtitles = async (subtitles) => {
  const suburl = vtt2url(subtitles);
  const urlsub = await url2sub(suburl);
  return urlsub;
};

export function getKeyCode(event) {
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
}

export const getTimeStamp = (currentTime) => {
  if (currentTime) {
    const date = new Date(currentTime * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const milliseconds = date
      .getMilliseconds()
      .toString()
      .substring(0, 2)
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
  return 0;
};

export const getMilliseconds = (timeInString) => {
  if (timeInString) {
    var a = timeInString.split(":");
    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    console.log(seconds);
    return seconds;
  }
  return 0;
};

export const getUpdatedTime = (value, type, time, index, startEnd) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const [hh, mm, sec] = time.split(":");
  const [ss, SSS] = sec.split(".");

  let newValue = "";
  if (type === "hours") {
    if (value < 0) {
      newValue = "00";
    } else {
      newValue = value;
    }
  }

  if (type === "minutes" || type === "seconds") {
    if (+value <= 9 && value.length < 2) {
      newValue = value.padStart(2, "0");
    } else {
      newValue = `${value[value.length - 2]}${value[value.length - 1]}`;
    }

    if (+newValue >= 60) {
      newValue = "59";
    }
  }

  if (type === "miliseconds") {
    if (value) {
      if (value < 0 || +value > 999) {
        newValue = "000";
      } else {
        newValue = value;
      }

      if (value.length > 3) {
        newValue = `${value[value.length - 3]}${value[value.length - 2]}${
          value[value.length - 1]
        }`;
      }
    } else {
      newValue = "000";
    }
  }

  let newTime = "";

  if (type === "hours") {
    newTime = `${newValue}:${mm}:${ss}.${SSS}`;
  } else if (type === "minutes") {
    newTime = `${hh}:${newValue}:${ss}.${SSS}`;
  } else if (type === "seconds") {
    newTime = `${hh}:${mm}:${newValue}.${SSS}`;
  } else if (type === "miliseconds") {
    newTime = `${hh}:${mm}:${ss}.${newValue}`;
  }

  if (startEnd === "startTime" && index > 0) {
    const durationOfPrevious = DT.t2d(subtitles[index - 1].end_time);
    const durationOfCurrent = DT.t2d(newTime);

    if (durationOfPrevious >= durationOfCurrent) {
      newTime = subtitles[index - 1].end_time;
    }
  }

  if (startEnd === "endTime" && index < subtitles.length) {
    const durationOfNext = DT.t2d(subtitles[index + 1].start_time);
    const durationOfCurrent = DT.t2d(newTime);

    if (durationOfNext <= durationOfCurrent) {
      newTime = subtitles[index + 1].start_time;
    }
  }

  return newTime;
};

export const getProfile = (userDetails) => {
  const temp = [
    {
      label: "First Name",
      value: userDetails.first_name?.length > 0 ? userDetails.first_name : "-",
    },
    {
      label: "Last Name",
      value: userDetails.last_name?.length > 0 ? userDetails.last_name : "-",
    },
    {
      label: "Gender",
      value: "-",
    },
    {
      label: "Role",
      value: userDetails.role_label?.length > 0 ? userDetails.role_label : "-",
    },
    {
      label: "Phone",
      value: userDetails.phone?.length > 0 ? userDetails.phone : "-",
    },
    {
      label: "Email",
      value: userDetails.email?.length ? userDetails.email : "-",
    },
    {
      label: "Username",
      value: userDetails.username?.length ? userDetails.username : "-",
    },
    {
      label: "Organization",
      value: userDetails?.organization?.title?.length
        ? userDetails?.organization?.title
        : "-",
    },
    {
      label: "Language Proficiency",
      value: "-",
    },
    {
      label: "Availability Status",
      value: userDetails.availability_status ? "Active" : "Inactive",
    },
  ];

  return temp;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function snakeToTitleCase(str) {
  return str
    .split("_")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export const getDisableOption = (data, defaultTask) => {
  if (data.value === "TRANSCRIPTION_EDIT") {
    return false;
  }

  if (
    data.value === "TRANSCRIPTION_REVIEW" ||
    data.value === "TRANSLATION_EDIT"
  ) {
    if (defaultTask.some((item) => item.value === "TRANSCRIPTION_EDIT")) {
      return false;
    }
    return true;
  }

  if (data.value === "TRANSLATION_REVIEW") {
    if (defaultTask.some((item) => item.value === "TRANSLATION_EDIT")) {
      return false;
    }
    return true;
  }
};

export const defaultTaskHandler = (task) => {
  let dTask = [];
  let lang = [];

  const isTranscriptionEdit = task.findIndex(
    (item) => item.value === "TRANSCRIPTION_EDIT"
  );

  if (isTranscriptionEdit === -1) {
    dTask = [];
    lang = [];
  } else {
    const isTranslationEdit = task.findIndex(
      (item) => item.value === "TRANSLATION_EDIT"
    );

    if (isTranslationEdit === -1) {
      const temp = task.filter((item) => item.value !== "TRANSLATION_REVIEW");
      dTask = [...temp];
      lang = [];
    } else {
      dTask = [...task];
    }
  }

  return { dTask, lang };
};

export const diableTargetLang = (defaultTask) => {
  const temp = defaultTask.find((item) => item.value.includes("TRANSLATION"));
  if (temp) {
    return false;
  }
  return true;
};
