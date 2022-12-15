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
    width: "30%",
    borderRadius: "7px",
    margin: "24px auto",
    backgroundColor: "#0083e2",
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

  subtitle: {
    position: "absolute",
    left: "0",
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

  customTextarea: {
    margin: "5px 15px 15px 23px",
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
  textAreaTransliteration: {
    width: "80%",
    // margin: "5px 15px 15px 10px",
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
    width: "100%",
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
    position: "relative",
    maxWidth: "100%",
    maxHeight: "90%",
    height: "100vh",
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

  subIllegal: {
    backgroundColor: "rgba(199, 81, 35, 0.5)",
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
    backgroundColor: "rgb(0 0 0 / 0)",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
  },

  pause: {
    backgroundColor: "rgb(0 0 0 / 50%)",
  },

  boxHighlight: {
    backgroundColor: "rgb(0 87 158)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "#fff",
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

  fullscreenStyle: {
    position: "relative",
    top: "55%",
    transform: "translateY(-50%)",
    "-webkit-transform": "translateY(-50%)",
    "-ms-transform": "translateY(-50%)",
    overflow: "hidden"
  },

  fullscreenVideoBtn: {
    position: "absolute",
    bottom: "18%",
    right: "35%",
    zIndex: "999",
    borderRadius: "4px",
    minWidth: "45px",
    padding: 0,
    backgroundColor: "rgb(0 0 0 / 0)",
    textShadow:
      "rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 0px -1px 1px",
  }
});

export default ProjectStyle;
