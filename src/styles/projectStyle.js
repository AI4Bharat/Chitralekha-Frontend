import { makeStyles } from "@mui/styles";

const ProjectStyle = makeStyles({
  container: {
    maxWidth: "1272px",
    width: "100%",
    margin: "40px auto",
  },

  datePicker: {
    width: "100%",
  },

  findBtn: {
    width: "20%",
    borderRadius: "8px",
  },
  findreplBtn: {
    width: "30%",
    borderRadius: "7px",
    margin: "24px auto",
    backgroundColor: "#19ab27",
  },

  videoPlayer: {
    position: "relative",
    zIndex: "10",
    outline: "none",
    maxHeight: "90vw",
    maxWidth: "100vw",
    boxShadow: "0px 5px 25px 5px rgb(0 0 0 / 80%)",
    backgroundColor: " #000",
    cursor: "pointer",
  },

  duration: {
    position: "absolute",
    left: "0",
    right: "0",
    top: "-50px",
    zIndex: "12",
    fontSize: "18px",
    color: "rgb(255 255 255 / 75%)",
    textShadow: "0 1px 2px rgb(0 0 0 / 75%)",
    marginLeft: "20px",
    userSelect: "none",
    pointerEvents: "none",
  },

  durationSpan: {
    padding: "5px 10px",
    backgroundColor: "rgb(0 0 0 / 50%)",
  },

  headerMenu: {
    width: "80%",
    // margin: "5px 15px 15px 10px",
    margin: "5px 15px 15px 23px",
    padding: "16.5px 12px",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.4375em",
    color: "rgba(0, 0, 0, 0.87)",
    borderRadius: "4px",
    borderColor: "white",
    outlineColor: "#2C2799",
    resize: "none",
    fontFamily: "Roboto, sans-serif",
  },

  videoBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "600px",
    position: "relative",
    flexDirection: "column",
  },

  backlight: {
    position: "absolute",
    zIndex: 9,
    inset: 0,
    width: "100%",
    height: "100%",
  },

  video: {
    // position: "relative",
    // maxWidth: "100%",
    // maxHeight: "90%",
    // height: "100vh",

    margin: "-1px",
    "&::-webkit-media-controls-fullscreen-button": {
      display: "none",
    },
  },

  subIllegal: {
    backgroundColor: "rgba(199, 81, 35, 0.5)",
  },

  fullscreenStyle: {
    position: "relative",
    top: "55%",
    transform: "translateY(-50%)",
    "-webkit-transform": "translateY(-50%)",
    "-ms-transform": "translateY(-50%)",
    overflow: "hidden",
  },

  settingBtn: {
    position: "absolute",
    bottom: "18%",
    right: "38%",
    zIndex: "9999",
    borderRadius: "4px",
    minWidth: "45px",
    padding: 0,
    backgroundColor: "rgb(0 0 0 / 50%)",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
  },

  fullscreenVideoBtns: {
    position: "absolute",
    bottom: "5%",
    right: "3%",
    zIndex: "999",
    borderRadius: "4px",
    minWidth: "45px",
    padding: 0,
    backgroundColor: "rgb(0 0 0 / 50%)",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
    "&:hover": {
      backgroundColor: "black",
    },
  },

  playbackRate: {
    position: "absolute",
    bottom: "18%",
    right: "41%",
    zIndex: "999",
    borderRadius: "4px",
    minWidth: "45px",
    padding: 0,
    backgroundColor: "rgb(0 0 0 / 50%)",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
    display: "flex",
    alignItems: "center",
  },

  timeBox: {
    marginRight: "auto",
    borderRadius: "4px",
    width: "20%",
    backgroundColor: "#616A6B",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    padding: "7px 14px",
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
    "&::-webkit-calendar-picker-indicator": {
      display: "none",
    },
  },
  darkmodesubtitle: {
    //zIndex:20,
    background: "black",
    fontSize: "20px",
    width: "600px",
    height: "55px",
    textAlign: "center",
    marginRight: "-1px",
  },
  lightmodesubtitle: {
    //zIndex:20,
    background: "white",
    fontSize: "20px",
    width: "600px",
    height: "55px",
    textAlign: "center",
    marginRight: "-1px",
  },

  timeInputBox: {
    backgroundColor: "#F5F5F5",
    width: "2ch",
    margin: "0",
    padding: "0",
    "& .MuiInputBase-input": {
      textAlign: "center",
      color: "#000",
      fontSize: "0.8rem",
      padding: "0",
    },
    "& .MuiInput-root:after": {
      border: "none",
    },
    "& .MuiInput-root:hover:before": {
      border: "none",
    },
    "& .MuiInput-root:before": {
      border: "none",
    },
    "& .MuiInput-input": {
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
      },
    },
  },

  taskBox: {
    padding: "20px",
    border: "1px solid #eaeaea",
    backgroundColor: "#E0E0E0",
    borderRadius: "25px",
  },

  arrow: {
    margin: "0 10px",
    width: "50px",
    height: "30px",
    display: "flex",
    clipPath:
      "polygon(0 10px,calc(100% - 15px) 10px,calc(100% - 15px) 0,100% 50%,calc(100% - 15px) 100%,calc(100% - 15px) calc(100% - 10px),0 calc(100% - 10px))",
    backgroundColor: "#E0E0E0",
  },

  contentParent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.87)",
    fontWeight: "normal",
    textAlign: "left",
  },

  header: {
    fontWeight: "600",
    padding: "20px",
    textAlign: "center",
    width: "135px",
  },

  content: {
    padding: "20px",
    textAlign: "center",
    width: "160px",
  },

  contentTaskType: {
    padding: "10px",
    color: "rgba(73, 124, 39)",
    backgroundColor: "rgba(45, 191, 56 ,0.3 )",
    margin: "10px",
    fontWeight: "600",
    borderRadius: "15px",
    textAlign: "center",
  },

  contentStatus: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    alignItems: "center",
  },

  contentStatusTop: {
    borderRadius: "10px",
    width: "75%",
    backgroundColor: "#FFD981",
    textAlign: "center",
    margin: "10px 0 5px 0",
  },

  content2: {
    width: "50%",
    padding: "10px",
  },

  headerParent: {
    display: "flex",
    backgroundColor: "#F8F8FA !important",
    color: "rgba(0, 0, 0, 0.87)",
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    alignItems: "center",
  },

  message: {
    textAlign: "initial",
    marginBottom: "10px",
  },

  videoName: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  reportVideoName: {
    display: "-webkit-box",
    maxWidth: "400px",
    "-webkit-line-clamp": "2",
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  findReplaceButton: {
    backgroundColor: "#2C2799",
    borderRadius: "50%",
    color: "#fff",
    margin: "0 5px 0 0",
    height: "fit-content",
    width: "fit-content",
    "&:hover": {
      backgroundColor: "#271e4f",
    },
  },

  rightPanelSvg: {
    width: "0.8em",
    height: "0.8em",
  },

  findReplaceTextbox: {
    width: "-webkit-fill-available",
    padding: "16.5px 14px",
    font: "inherit",
    fontSize: "1.25rem",
  },

  findReplaceTextboxLabel: {
    backgroundColor: "white",
    position: "absolute",
    left: "10px",
    top: "-10px",
    paddingInline: "5px",
  },

  matchTypeSwitch: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: "30px",
  },
});

export default ProjectStyle;
