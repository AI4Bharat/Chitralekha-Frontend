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
    permittedToDeleteVideoAudio: false,
    permittedToCreateVideoAudio: false,
  },
  {
    label: "Transcript Reviewer",
    value: "TRANSCRIPT_REVIEWER",
    permittedToDeleteVideoAudio: false,
    permittedToCreateVideoAudio: false,
  },
  {
    label: "Translation editor",
    value: "TRANSLATION_EDITOR",
    permittedToDeleteVideoAudio: false,
    permittedToCreateVideoAudio: false,
  },
  {
    label: "Translation Reviewer",
    value: "TRANSLATION_REVIEWER",
    permittedToDeleteVideoAudio: false,
    permittedToCreateVideoAudio: false,
  },
  {
    label: "Universal Editor",
    value: "UNIVERSAL_EDITOR",
    permittedToDeleteVideoAudio: false,
    permittedToCreateVideoAudio: false,
  },
  {
    label: "Project Manager",
    value: "PROJECT_MANAGER",
    permittedToDeleteVideoAudio: true,
    permittedToCreateVideoAudio: true,
  },
  {
    label: "Organization Owner",
    value: "ORG_OWNER",
    permittedToDeleteVideoAudio: false,
    permittedToCreateVideoAudio: false,
  }
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
