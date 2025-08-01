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
    position: "relative",
  },

  videoNameBox: {
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "rgba(254, 191, 44, 0.1)",
    backgroundColor: "white",
  },

  videoName: {
    textAlign: "center",
    margin: "13.5px",
    width: "90%",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },

  settingsIconBtn: {
    backgroundColor: "#2C2799",
    borderRadius: "50%",
    color: "#fff",
    margin: "auto 10px",
    height: "fit-content",
    width: "fit-content",
    "&:hover": {
      backgroundColor: "#271e4f",
    },
  },

  subtitlePanel: {
    position: "absolute",
    zIndex: "20",
    left: "0",
    right: "0",
    bottom: "7%",
    width: "94%",
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
    lineHeight: "1",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    padding: "5px 10px",
    pointerEvents: "all",
    overflow: "scroll",
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
    bottom: "1%",
    right: "3%",
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
    height: "100px",
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
    backgroundColor: "rgba(33, 150, 243, 0.5)",
    overflow: "hidden",
  },

  handle: {
    position: "absolute",
    right: "0",
    top: "0",
    bottom: "0",
    width: "2px",
    cursor: "ew-resize",
    backgroundColor: "red",
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

  subNonHighlight: {
    backgroundColor: "rgba(238, 238, 238, 0.5)",
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
    //backgroundColor: "#fff",
    // backgroundColor: "#fcf7e9",
    border: "solid",
    borderWidth: "1px",
    borderColor: "#EEEEEE",
    borderRadius: "50%",
    marginRight: "10px",
    color: "blue",
    height: "fit-content",
    width: "fit-content",
    "&:disabled": {
      background: "lightgray",
    },
    "&:hover": {
      // backgroundColor: "#fff",
      backgroundColor: "#fcf7e9",
    },
  },

  rightPanelParentGrid: {
    display: "flex",
    direction: "row",
    flexWrap: "wrap",
    padding: "12px 0",
    justifyContent: "center",
    // backgroundColor: "rgba(254, 191, 44, 0.1)",
    // backgroundColor: "#fcf7e9",
  },

  rightPanelParentBox: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #eeeeee",
  },

  rightPanelBtnGrp: {
    backgroundColor: "#2C2799",
    borderRadius: "50%",
    color: "#fff",
    marginRight: "5px",
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

  rightPanelDivider: {
    border: "1px solid grey",
    height: "auto",
    margin: "0 5px 0 0",
  },

  subTitleContainer: {
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid #eaeaea",
    overflowY: "scroll",
    overflowX: "scroll",
    width: "100%",
    textAlign: "center",
    boxSizing: "border-box",
    backgroundColor: "white",
  },

  topBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: {
    padding: "16px 0",
    alignItems: "center",
  },

  relative: {
    position: "relative",
  },

  customTextarea: {
    padding: "16.5px 12px",
    fontSize: "1.25rem",
    fontWeight: "400",
    lineHeight: "1.4375em",
    // maxLength: "200",
    // fieldSizing: "content",
    color: "rgba(0, 0, 0, 0.87)",
    // border:"none",
    border : "1px solid #808080",
    borderRadius: "8px",
    outline:"none",
    resize: "none",
    fontFamily: "Roboto, sans-serif",
    width: "95.5%",

    "&::selection": {
    //  backgroundColor: "#8ebf42",
      backgroundColor: "#808080"
    },
    "&:hover, &:focus": {
      backgroundColor: "rgba(214, 234, 248, 0.4)"
    },
  },

  boxHighlight: {
    backgroundColor: "rgba(214, 234, 248, 0.4)",
    // border: "1px solid rgb(44,39,153)",
    color: "#000 !important",
    border: "2.5px solid rgba(44,39,153,0.9) !important",
    borderRadius: "4px",
    fieldSizing: "content",
    minHeight:"100px",
  },

  wordCount: {
    color: "green",
    fontWeight: 700,
    height: "20px",
    width: "30px",
    borderRadius: "40%",
    position: "absolute",
    top: "5px",
    right: "15px",
    textAlign: "center",
    zIndex:"100",
    backgroundColor: "white",
  },

  topBoxTranslation: {
    display: "flex",
    paddingTop: "16px",
    paddingX: "20px",
    justifyContent: "space-around",
  },

  textAreaTransliteration: {
    width: "90%",
    padding: "16.5px 12px",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.4375em",
    color: "rgba(0, 0, 0, 0.87)",
    // border: "none",
    border : "1px solid #808080",
    // fieldSizing: "content",
    borderRadius: "8px",

    // outlineColor: "#2C2799",
    // borderColor: "#ffffff",
    outline:"none",
    resize: "none",
    fontFamily: "Roboto, sans-serif",

    "&::selection": {
    //  backgroundColor: "#8ebf42",
      backgroundColor: "#808080"
    },
    "&:hover, &:focus": {
      backgroundColor: "rgba(214, 234, 248, 0.4)"
    },
  },

  videoPlayerParent: {
    boxSizing: "border-box",
  },

  videoPlayer: {
    cursor: "pointer",
    width: "100%",
    objectFit: "fill",
    maxHeight: "100%",
  },

  recorder: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    height: "100%",
  },

  paginationBox: {
    // position: "absolute",
    bottom: "0px",
    background: "#fff",
    width: "100%",
    color: "#fff",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0, 5px",
    border: "1px solid #EAEAEA",
  },

  durationBox: {
    backgroundColor: "#616A6B",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
  },

  audioBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    height: "100%",
    justifyContent: "space-evenly",
  },

  playbackRate: {
    borderRadius: "4px",
    minWidth: "45px",
    padding: 0,
    backgroundColor: "#0083e2",
    display: "flex",
    alignItems: "center",
    marginRight: "10%",
  },

  disabledCard: {
    opacity: "0.5",
    cursor: "not-allowed",
  },

  suggestionListTypography: {
    borderBottom: "1px solid lightgrey",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#000",
    padding: "16px",
    "&:hover": {
      color: "white",
      backgroundColor: "#1890ff",
    },
  },

  suggestionListHeader: {
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid lightgrey",
  },

  audioPlayer: {
    "&::-webkit-media-controls-panel": {
      backgroundColor: "#fcf7e9",
    },
  },

  w95: {
    width: "95%"
  }
});

export default VideoLandingStyle;
