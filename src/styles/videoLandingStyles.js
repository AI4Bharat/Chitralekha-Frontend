import { makeStyles } from "@mui/styles";

const VideoLandingStyle = makeStyles({
  parentGrid: {
    marginTop: "55px",
    overflow: "hidden",
  },

  videoParent: {
    width: "100%",
    overflow: "hidden",
  },

  videoBox: {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
  },

  videoNameBox: {
    display: "flex",
    flexDirection: "row",
  },

  videoName: {
    textAlign: "center",
    margin: "32px",
    width: "90%",
  },

  settingsIconBtn: {
    backgroundColor: "#2C2799",
    borderRadius: "50%",
    color: "#fff",
    margin: "auto",
    "&:hover": {
      backgroundColor: "#271e4f",
    },
  },

  subtitlePanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: "20",
    left: "0",
    right: "0",
    bottom: "23%",
    width: "63%",
    padding: "0 30px",
    userSelect: "none",
    pointerEvents: "none",
  },

  operate: {
    padding: "5px 15px",
    color: "#fff",
    fontSize: "13px",
    borderRadius: "3px",
    marginBottom: "5px",
    backgroundColor: "rgb(0 0 0 / 75%)",
    border: "1px solid rgb(255 255 255 / 20%)",
    cursor: "pointer",
    pointerEvents: "all",
  },

  playerTextarea: {
    width: "100%",
    outline: "none",
    resize: "none",
    textAlign: "center",
    lineHeight: "1.2",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    padding: "5px 10px",
    pointerEvents: "all",
  },

  darkMode: {
    backgroundColor: "rgb(256 256 256 / 50%)",
    color: "#000",
    fontWeight: "bolder",
  },

  lightMode: {
    backgroundColor: "rgb(0 0 0 / 50%)",
    color: "#fff",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
  },

  fullscreenVideoBtn: {
    position: "absolute",
    bottom: "18%",
    right: "35%",
    zIndex: "999",
    borderRadius: "4px",
    minWidth: "45px",
    padding: 0,
    backgroundColor: "rgb(0 0 0 / 50%)",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
  },

  fullscreenBtn: {
    position: "absolute",
    bottom: "25px",
    right: "25px",
    zIndex: "999",
    borderRadius: "4px",
    backgroundColor: "#0083e2",
    minWidth: "45px",
    padding: 0,
  },

  backDrop: {
    color: "#fff",
    zIndex: 999999,
    display: "flex",
    flexDirection: "column",
    "&.MuiBackdrop-root": {
      backgroundColor: "#1d1d1d",
    },
  },

  timeLineParent: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "150px",
    width: "100%",
  },

  waveform: {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    zIndex: "1",
    width: "100%",
    height: "100%",
    userSelect: "none",
    pointerEvents: "none",
  },

  progress: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "-12px",
    zIndex: 11,
    width: "100%",
    height: "12px",
    userSelect: "none",
    borderTop: "1px solid rgb(255 255 255 / 20%)",
    backgroundColor: "rgb(0 0 0 / 50%)",
  },

  bar: {
    position: "absolute",
    left: "0",
    top: "0",
    bottom: "0",
    width: "0%",
    height: "100%",
    display: "inline-block",
    backgroundColor: "#730000",
    overflow: "hidden",
  },

  handle: {
    position: "absolute",
    right: "0",
    top: "0",
    bottom: "0",
    width: "10px",
    cursor: "ew-resize",
    backgroundColor: "#ff9800",
  },

  timelineSubtitle: {
    position: "absolute",
    left: "10",
    top: "0",
    bottom: "0",
    right: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },

  item: {
    position: "absolute",
    top: "0",
    bottom: "0",
    height: "100%",
    backgroundColor: "rgb(255 255 255 / 20%)",
  },

  grab: {
    position: "relative",
    zIndex: "11",
    cursor: "grab",
    height: "25%",
    userSelect: "none",
    backgroundColor: "rgb(33 150 243 / 20%)",
    borderTop: "1px solid rgb(33 150 243 / 30%)",
    borderBottom: "1px solid rgb(33 150 243 / 30%)",
  },

  grabbing: {
    cursor: "grabbing",
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

  Metronome: {
    position: "absolute",
    zIndex: "8",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    cursor: "ew-resize",
    userSelect: "none",
  },

  template: {
    position: "absolute",
    top: "0",
    bottom: "0",
    height: "100%",
    backgroundColor: "rgba(76, 175, 80, 0.5)",
    borderLeft: "1px solid rgba(76, 175, 80, 0.8)",
    borderRight: "1px solid rgba(76, 175, 80, 0.8)",
    userSelect: "none",
    pointerEvents: "none",
  },

  contextMenu: {
    position: "absolute",
    zIndex: "9",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "all",
  },

  parentSubtitleBox: {
    position: "absolute",
    zIndex: "9",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },

  subItem: {
    position: "absolute",
    top: "40%",
    left: "0",
    height: "40%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    wordWrap: "break-word",
    color: "#fff",
    fontSize: "14px",
    cursor: "move",
    userSelect: "none",
    pointerEvents: "all",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",

    "&:hover": {
      backgroundColor: " rgba(255, 255, 255, 0.3)",
    },
  },

  subHighlight: {
    backgroundColor: "rgba(33, 150, 243, 0.5)",
    border: "1px solid rgba(33, 150, 243, 0.5)",
  },

  subHandle: {
    position: "absolute",
    top: "0",
    bottom: "0",
    zIndex: "1",
    height: "100%",
    cursor: "col-resize",
    userSelect: "none",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },

  subText: {
    position: "relative",
    zIndex: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
    height: "100%",
    wordWrap: "break-word",
  },

  subTextP: {
    margin: "2px 0",
    lineHeight: "1",
  },

  subDuration: {
    opacity: "0.5",
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100%",
    textAlign: "center",
    fontSize: "12px",
  },

  menuItem: {
    padding: "5px 15px",
    backgroundColor: "#fff",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "skyblue",
    },
  },

  menuItemNav: {
    borderRadius: "6px",
    zIndex: "20",
  },

  optionIconBtn: {
    backgroundColor: "#0083e2",
    borderRadius: "50%",
    marginRight: "10px",
    color: "#fff",
    "&:disabled": {
      background: "grey",
    },
    "&:hover": {
      backgroundColor: "#271e4f",
    },
  },

  rightPanelParentGrid: {
    display: "flex",
    direction: "row",
    flexWrap: "wrap",
    margin: "23.5px 0",
    justifyContent: "center",
  },

  rightPanelParentBox: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #eaeaea",
  },

  rightPanelBtnGrp: {
    backgroundColor: "#2C2799",
    borderRadius: "50%",
    color: "#fff",
    marginX: "5px",
    "&:hover": {
      backgroundColor: "#271e4f",
    },
  },

  rightPanelDivider: {
    border: "1px solid lightgray",
    height: "auto",
    margin: "0 5px",
  },

  subTitleContainer: {
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid #eaeaea",
    overflowY: "scroll",
    overflowX: "hidden",
    height: window.innerHeight * 0.667,
    backgroundColor: "black",
    marginTop: "5px",
    width: "100%",
    textAlign: "center",
  },

  topBox: {
    display: "flex",
    padding: "10px 0 0 20px",
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: {
    padding: "5px 0",
    borderBottom: "2px solid",
    alignItems: "center",
  },

  relative: {
    position: "relative",
  },

  customTextarea: {
    margin: "5px 20px 15px 23px",
    padding: "16.5px 12px",
    fontSize: "1.25rem",
    fontWeight: "400",
    lineHeight: "1.4375em",
    color: "rgba(0, 0, 0, 0.87)",
    borderRadius: "4px",
    borderColor: "rgba(0, 0, 0, 0.23)",
    outlineColor: "#2C2799",
    resize: "none",
    fontFamily: "Roboto, sans-serif",
    width: "100%",
  },

  boxHighlight: {
    backgroundColor: "rgb(0 87 158)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "#fff !important",
  },

  wordCount: {
    background: "white",
    color: "green",
    fontWeight: 700,
    height: "20px",
    width: "30px",
    borderRadius: "50%",
    position: "absolute",
    bottom: "-10px",
    right: "-25px",
    textAlign: "center",
  },

  topBoxTranslation: {
    display: "flex",
    paddingTop: "16px",
    paddingX: "20px",
    justifyContent: "space-around",
  },

  textAreaTransliteration: {
    width: "80%",
    margin: "5px 10px 15px 20px",
    padding: "16.5px 12px",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.4375em",
    color: "rgba(0, 0, 0, 0.87)",
    borderRadius: "4px",
    borderColor: "#616A6B",
    outlineColor: "#2C2799",
    resize: "none",
    fontFamily: "Roboto, sans-serif",
  },
});

export default VideoLandingStyle;