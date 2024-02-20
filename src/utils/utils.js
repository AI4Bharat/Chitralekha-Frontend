import DT from "duration-time-conversion";
import store from "../redux/store/store";
import {
  addNewVideo,
  assignTasks,
  editTranscription,
  editTranslation,
  editingReviewTasks,
} from "../config/helpOptions";

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
    canDeleteProject: false,
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
    canAddMembers: false,
    canDeleteProject: false,
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
    canDeleteProject: false,
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
    canDeleteProject: false,
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
    canDeleteProject: false,
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
    canDeleteProject: false,
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
    canDeleteProject: true,
  },
];

export const availability = [
  {
    label: "true",
    value: 1,
  },
  {
    label: "false",
    value: 0,
  },
];

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
    return seconds;
  }
  return 0;
};

export const getUpdatedTime = (value, type, time, index, startEnd) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const videoDuration = store.getState().getVideoDetails.data.video.duration;

  let newValue = "";

  const [hh, mm, sec] = time.split(":");
  const [ss, SSS] = sec.split(".");

  if (type === "hours") {
    if (value < 0) {
      newValue = "00";
    } else {
      newValue = value;
    }
  }

  if (type === "minutes" || type === "seconds") {
    if (+value <= 9 && value.length < 2) {
      localStorage.setItem("value", value);
      newValue = value.padStart(2, "0");
    } else {
      newValue = `${localStorage.getItem("value")}${value[value.length - 1]}`;
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
    const durationOfEndTime = DT.t2d(subtitles[index].end_time);

    if (durationOfPrevious > durationOfCurrent) {
      newTime = subtitles[index].start_time;
    }

    if (durationOfCurrent >= durationOfEndTime) {
      newTime = subtitles[index].end_time;
    }
  }

  if (startEnd === "endTime" && index < subtitles.length - 1) {
    const durationOfNext = DT.t2d(subtitles[index + 1].start_time);
    const durationOfCurrent = DT.t2d(newTime);
    const durationOfStartTime = DT.t2d(subtitles[index].start_time);

    if (durationOfNext < durationOfCurrent) {
      newTime = subtitles[index + 1].start_time;
    }

    if (durationOfCurrent <= durationOfStartTime) {
      let modifiedDuration = DT.t2d(subtitles[index].start_time);
      modifiedDuration = modifiedDuration + 1;
      newTime = DT.d2t(modifiedDuration);
    }
  }

  if (startEnd === "endTime" && index === subtitles.length - 1) {
    const durationOfVideo = DT.t2d(videoDuration);
    const durationOfCurrent = DT.t2d(newTime);
    const durationOfStartTime = DT.t2d(subtitles[index].start_time);

    if (durationOfCurrent > durationOfVideo) {
      newTime = DT.d2t(durationOfVideo);
    }

    if (durationOfCurrent <= durationOfStartTime) {
      let modifiedDuration = DT.t2d(subtitles[index].start_time);
      modifiedDuration = modifiedDuration + 1;
      newTime = DT.d2t(modifiedDuration);
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

  if (data.value === "VOICEOVER_EDIT") {
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
      const temp = task.filter(
        (item) =>
          item.value !== "TRANSLATION_REVIEW" && item.value !== "VOICEOVER_EDIT"
      );
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

export const getDateTime = () => {
  const date = new Date();
  const YYYYMMDD = date
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("");

  const HHMMSS = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

  return `${YYYYMMDD}_${HHMMSS}`;
};

export const getHelpList = (tab) => {
  switch (tab) {
    case "label.addnewVideo":
      return addNewVideo;

    case "label.editing&ReviewTasks":
      return editingReviewTasks;

    case "label.assigntasks":
      return assignTasks;

    case "label.editTranscription":
      return editTranscription;

    case "label.editTranslation":
      return editTranslation;

    default:
      return [];
  }
};

export const checkPassword = (str) => {
  const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return regex.test(str);
};

export const filterTaskList = (taskList, selectedFilters) => {
  const { status, taskType, srcLanguage, tgtLanguage } = selectedFilters;

  let filterResult = taskList;

  if (status?.length) {
    filterResult = filterResult.filter((value) => {
      return status.includes(value.status);
    });
  }

  if (taskType?.length) {
    filterResult = filterResult.filter((value) => {
      return taskType.includes(value.task_type);
    });
  }

  if (srcLanguage?.length) {
    filterResult = filterResult.filter((value) => {
      return srcLanguage.includes(value.src_language_label);
    });
  }

  if (tgtLanguage?.length) {
    filterResult = filterResult.filter((value) => {
      return tgtLanguage.includes(value.target_language_label);
    });
  }

  return filterResult;
};

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9\b]+$/;
  return regex.test(phone);
};
