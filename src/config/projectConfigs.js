import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PreviewIcon from "@mui/icons-material/Preview";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import UploadIcon from "@mui/icons-material/Upload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";

export const genderOptions = [
  {
    label: "Male",
    value: "Male",
  },
  {
    label: "Female",
    value: "Female",
  },
];

export const ageGroupOptions = [
  {
    label: "1-10",
    value: "1-10",
  },
  {
    label: "11-20",
    value: "11-20",
  },
  {
    label: "21-60",
    value: "21-60",
  },
  {
    label: "61-100",
    value: "61-100",
  },
];

export const speakerFields = [
  {
    label: "Enter Speaker Name",
    name: "name",
    type: "text",
    sx: {
      margin: "4px 4px 4px 0",
      width: "49.5%",
      backgroundColor: "#fff",
    },
  },
  {
    label: "Enter Speaker ID",
    name: "id",
    value: "",
    type: "text",
    sx: {
      margin: "4px 0 4px 4px",
      width: "49.5%",
      backgroundColor: "#fff",
    },
  },
  {
    label: "Select Speaker Gender",
    name: "gender",
    type: "select",
    sx: {
      margin: "4px 4px 4px 0",
      width: "49.5%",
      backgroundColor: "#fff",
    },
    options: genderOptions,
  },
  {
    label: "Select Age group",
    name: "age",
    type: "select",
    sx: {
      margin: "4px 0 4px 4px",
      width: "49.5%",
      backgroundColor: "#fff",
    },
    options: ageGroupOptions,
  },
];

export const voiceOptions = [
  {
    label: "Male - Adult",
    value: "Male",
  },
  {
    label: "Female - Adult",
    value: "Female",
  },
];

export const buttonConfig = [
  {
    title: "Info",
    color: "primary",
    icon: <InfoOutlinedIcon />,
    key: "Info",
  },
  {
    title: "Reopen",
    color: "primary",
    icon: <LockOpenOutlinedIcon />,
    key: "Reopen",
  },
  {
    title: "Upload Subtitles to Youtube",
    color: "primary",
    icon: <UploadIcon />,
    key: "Upload",
  },
  {
    title: "Edit Task Details",
    color: "primary",
    icon: <AppRegistrationIcon />,
    key: "Update",
  },
  {
    title: "view",
    color: "primary",
    icon: <PreviewIcon />,
    disabled: false,
    key: "View",
  },
  {
    title: "Edit",
    color: "primary",
    icon: <EditIcon />,
    key: "Edit",
  },
  {
    title: "Update Speaker Info",
    color: "primary",
    icon: <EditIcon />,
    key: "Edit-Speaker",
  },
  {
    title: "Export",
    color: "primary",
    icon: <FileDownloadIcon />,
    key: "Export",
  },
  {
    title: "Preview",
    color: "primary",
    icon: <VisibilityIcon />,
    key: "Preview",
  },
  {
    title: "Regenerate",
    color: "primary",
    icon: <LockResetIcon />,
    key: "Regenerate",
  },
  {
    title: "Delete",
    color: "error",
    icon: <DeleteIcon />,
    key: "Delete",
  },
];

export const toolBarActions = [
  {
    key: "bulkTaskUpdate",
    title: "Bulk Task Update",
    icon: <AppRegistrationIcon />,
  },
  // {
  //   key: "bulkTaskDelete",
  //   title: "Bulk Task Delete",
  //   icon: <DeleteIcon />,
  //   style: { color: "#d32f2f" },
  // },
  {
    key: "bulkTaskDownload",
    title: "Bulk Task Dowload",
    icon: <FileDownloadIcon />,
    style: { marginRight: "auto" },
  },
  {
    key: "bulkTaskUpload",
    title: "Bulk Subtitle Upload",
    icon: <UploadIcon />,
    style: { marginRight: "auto" },
  },
];

export const speakerInfoOptions = [
  {
    label: "Yes",
    value: "true",
  },
  {
    label: "No",
    value: "false",
  },
];

export const bgMusicOptions = [
  {
    label: "Yes",
    value: "true",
  },
  {
    label: "No",
    value: "false",
  },
];

export const domains = [
  { code: "general", label: "General" },
  { code: "news", label: "News" },
  { code: "education", label: "Education" },
  { code: "legal", label: "Legal" },
  {
    code: "government-press-release",
    label: "Government Press Release",
  },
  { code: "healthcare", label: "Healthcare" },
  { code: "agriculture", label: "Agriculture" },
  { code: "automobile", label: "Automobile" },
  { code: "tourism", label: "Tourism" },
  { code: "financial", label: "Financial" },
  { code: "movies", label: "Movies" },
  { code: "subtitles", label: "Subtitles" },
  { code: "sports", label: "Sports" },
  { code: "technology", label: "Technology" },
  { code: "lifestyle", label: "Lifestyle" },
  { code: "entertainment", label: "Entertainment" },
  { code: "art-and-culture", label: "Art and Culture" },
  { code: "parliamentary", label: "Parliamentary" },
  { code: "economy", label: "Economy" },
  { code: "history", label: "History" },
  { code: "philosophy", label: "Philosophy" },
  { code: "religion", label: "Religion" },
  {
    code: "national-security-and-defence",
    label: "National Security and Defence",
  },
  { code: "literature", label: "Literature" },
  { code: "geography", label: "Geography" },
];

export const orgTypeList = [
  { label: "NGO", value: "NGO" },
  { label: "Startup", value: "Startup" },
  { label: "Corporate", value: "Corporate" },
];

export const usageList = [
  { label: "Transcription", value: "transcription" },
  { label: "Translation", value: "translation" },
  { label: "Voice Over", value: "voiceOver" },
]