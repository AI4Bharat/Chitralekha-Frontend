import Sub from "./Sub";
import DT from "duration-time-conversion";

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
    permittedToDeleteProject: false,
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    orgSettingVisible: false,
  },
  {
    label: "Transcript Reviewer",
    value: "TRANSCRIPT_REVIEWER",
    permittedToDeleteProject: false,
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    orgSettingVisible: false,
  },
  {
    label: "Translation editor",
    value: "TRANSLATION_EDITOR",
    permittedToDeleteProject: false,
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    orgSettingVisible: false,
  },
  {
    label: "Translation Reviewer",
    value: "TRANSLATION_REVIEWER",
    permittedToDeleteProject: false,
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
    orgSettingVisible: false,
  },
  {
    label: "Universal Editor",
    value: "UNIVERSAL_EDITOR",
    permittedToDeleteProject: false,
    permittedToDeleteVideoAudio: false,
    permittedToCreateTask: false,
    permittedToAddMembersInProject: false,
    permittedToDeleteProject: false,
    permittedToCreateVideoAudio: false,
    taskAction: true,
  },
  {
    label: "Project Manager",
    value: "PROJECT_MANAGER",
    permittedToDeleteProject: true,
    permittedToDeleteVideoAudio: true,
    permittedToCreateTask: true,
    permittedToAddMembersInProject: true,
    permittedToDeleteProject: true,
    permittedToCreateVideoAudio: true,
    taskAction: false,
    orgSettingVisible: false,
  },
  {
    label: "Organization Owner",
    value: "ORG_OWNER",
    permittedToDeleteProject: true,
    permittedToDeleteVideoAudio: true,
    permittedToCreateTask: true,
    permittedToAddMembersInProject: true,
    permittedToDeleteProject: true,
    permittedToCreateVideoAudio: true,
    taskAction: false,
    orgSettingVisible: true,
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

export const getUpdatedTime = (value, type, time) => {
  const [hh, mm, sec] = time.split(":");
  const [ss, SSS] = sec.split(".");

  let newValue = "";
  console.log(value, "iipipipip");
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

  if (type === "hours") {
    return `${newValue}:${mm}:${ss}.${SSS}`;
  } else if (type === "minutes") {
    return `${hh}:${newValue}:${ss}.${SSS}`;
  } else if (type === "seconds") {
    return `${hh}:${mm}:${newValue}.${SSS}`;
  } else if (type === "miliseconds") {
    return `${hh}:${mm}:${ss}.${newValue}`;
  }
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
      value: userDetails?.organization?.title?.length ? userDetails?.organization?.title : "-",
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