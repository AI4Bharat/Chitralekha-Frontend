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
    width: "40%",
    borderRadius: "7px",
    margin: "24px auto",
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
    width: "75%",
  },
  textAreaTransliteration: {
    width: "80%",
   // margin: "5px 15px 15px 10px",
   margin: "5px 15px 15px 23px",
    padding: "16.5px 12px",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.4375em",
    color: "rgba(0, 0, 0, 0.87)",
    borderRadius: "4px",
    borderColor: "rgba(0, 0, 0, 0.23)",
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
    height: "100%"
  },

  video: {
    position: "relative", 
    maxWidth: "100%", 
    maxHeight: "90%",
    height: "100vh",
  }
});

export default ProjectStyle;
