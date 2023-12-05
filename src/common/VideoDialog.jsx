import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMilliseconds, getTimeStamp, MenuProps } from "utils";
import { useVideoSubtitle } from "hooks";
import { speakerFields, voiceOptions } from "config";

//Styles
import { ProjectStyle } from "styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";


//Components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import CustomSwitchDarkBackground from "./CustomSwitchDarkBackground";
import CloseIcon from "@mui/icons-material/Close";
import VideoTaskList from "containers/Organization/Project/VideoTaskList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

//APIs
import C from "redux/constants";
import {
  FetchVideoDetailsAPI,
  APITransport,
  UpdateVideoAPI,
} from "redux/actions";
import CustomizedSnackbars from "./Snackbar";

const VideoDialog = ({ open, handleClose, videoDetails }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  // const [speakerType, setSpeakerType] = useState("individual");
  const [speakerType, setSpeakerType] = useState(videoDetails[0].multiple_speaker?"multiple":"individual");
  const [time, setTime] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [highlightedSubtitle, setHighlightedSubtitle] = useState([]);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [darkAndLightMood, setDarkAndLightMood] = useState(true);
  const [videoDescription, setVideoDescription] = useState("");
  const [voice, setVoice] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [speakerInfo, setSpeakerInfo] = useState(videoDetails[0].speaker_info);

  const ref = useRef(null);
  const { subtitle } = useVideoSubtitle(videoDetails[0].id);

  const classes = ProjectStyle();

  useEffect(() => {
    setVideoDescription(videoDetails[0].description);
    setVoice(videoDetails[0].gender_label);
  }, [videoDetails]);

  useEffect(() => {
    const subtitleList = Object.values(subtitle);
    const subs = subtitleList.filter((subtitleSentence) => {
      const { start_time, end_time, timestamps } = subtitleSentence;
      if (!!start_time && !!end_time && !!timestamps) {
        const start = getMilliseconds(start_time);
        const currentTime = getMilliseconds(time);
        const end = getMilliseconds(end_time);
        if (currentTime > start && currentTime <= end) {
          return true;
        } else {
          setHighlightedSubtitle([]);
        }
      }
      return false;
    });
    setSubtitles(subs);
    // eslint-disable-next-line
  }, [time]);

  useEffect(() => {
    processSubtitleData();
    // eslint-disable-next-line
  }, [subtitles]);

  const handleRemoveSpeaker = (event, index) => {
    event.stopPropagation();

    const temp = [...speakerInfo];
    temp.splice(index, 1);

    setSpeakerInfo(temp);
  };

  const handleSpeakerFieldChange = (event, index) => {
    const {
      target: { name, value },
    } = event;

    const temp = [...speakerInfo];

    if (name === "name") {
      const spaceIndex = value.indexOf(" ");

      if (spaceIndex !== -1) {
        temp[index]["id"] = value.substring(0, spaceIndex);
      } else {
        temp[index]["id"] = value;
      }
    }
    temp[index][name] = value;

    setSpeakerInfo(temp);
  };

  const handleAddMoreSpeakers = () => {
    setSpeakerInfo((prevState) => [
      ...prevState,
      {
        name: "",
        gender: "",
        age: "",
        id: "",
      },
    ]);
  };

  const getHighlightedWords = (index, currentTime, word, start, end) => {
    return (
      <span
        key={`word-${index}`}
        style={{
          color:
            currentTime >= start && currentTime <= end
              ? "orange"
              : currentTime >= start
              ? darkAndLightMood === false
                ? "black"
                : "white"
              : "grey",
        }}
      >{`${word} `}</span>
    );
  };

  const processSubtitleData = () => {
    subtitles.length &&
      subtitles.forEach((subtitle) => {
        setHighlightedSubtitle([]);
        subtitle.timestamps.forEach((timestamp, index) => {
          const text = Object.keys(timestamp)[0];
          const { start, end } = timestamp[text];
          const currentTime = getMilliseconds(time);
          const startTime = getMilliseconds(start);
          const endTime = getMilliseconds(end);
          setHighlightedSubtitle((prev) => [
            ...prev,
            getHighlightedWords(index, currentTime, text, startTime, endTime),
          ]);
        });
      });
  };

  useEffect(() => {
    const apiObj = new FetchVideoDetailsAPI(
      videoDetails[0].url,
      videoDetails[0].language,
      videoDetails[0].project_id,
      videoDetails[0].audio_only
    );
    dispatch(APITransport(apiObj));

    return () => {
      dispatch({ type: C.CLEAR_VIDEO_DETAILS });
    };
    // eslint-disable-next-line
  }, []);

  const onFullScreenChange = (status) => {
    setFullScreenMode(status);
  };

  useEffect(() => {
    window.onresize = function () {
      if (
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.document.fullscreenElement
      ) {
        onFullScreenChange(true);
      } else {
        onFullScreenChange(false);
      }
    };
  }, []);

  const video = useSelector((state) => state.getVideoDetails.data);

  //callback function called when the video is being played
  const handleProgress = () => {
    const time = getTimeStamp(ref?.current?.currentTime);
    setTime(time);
  };

  const handleFullscreenVideo = () => {
    let docElm = document.getElementById("myvideo");
    var isInFullScreen =
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);

    // var docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleplayVideo = (e) => {
    var btn = document.getElementById("myBtn");
    e.preventDefault();
    if (btn.paused) {
      btn.play();
    } else {
      btn.pause();
    }
  };

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (
  //       e.which === 32 &&
  //       e.target.id !== "description" &&
  //       document.activeElement !== ref.current
  //     ) {
  //       e.preventDefault();
  //       var video = document.getElementById("myBtn");
  //       if (video.paused) {
  //         video.play();
  //       } else {
  //         video.pause();
  //       }
  //     }
  //   };
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  const updateVideoHandler = async () => {
    const updateData = {
      gender: voice,
      description: videoDescription,
      video_id: videoDetails[0].id,
      // multiple_speaker: speakerType !== 'individual',
      multiple_speaker: String(speakerType !== 'individual'),
      speaker_info: speakerInfo
    };

    const apiObj = new UpdateVideoAPI(updateData);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  }, [snackbar]);

  return (
    <>
      {renderSnackBar()}

      <Dialog
        fullScreen={fullScreen}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        scroll="paper"
        PaperProps={{
          style: {
            overflowY: "hidden",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          id="responsive-dialog-title"
          display="flex"
          alignItems={"center"}
        >
          <Tooltip title={videoDetails[0].name}>
            <Typography
              variant="h4"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {videoDetails[0].name}
            </Typography>
          </Tooltip>

          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid
            container
            width={"100%"}
            alignItems="center"
            marginBottom="20px"
          >
            <Grid margin="auto">
            <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="select-voice">Voice Selection</InputLabel>
                <Select
                  fullWidth
                  labelId="select-voice"
                  label="Voice Selection"
                  value={voice}
                  onChange={(event) => setVoice(event.target.value)}
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                >
                  {voiceOptions?.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 3 }}>
              <RadioGroup
                  row
                  name="controlled-radio-buttons-group"
                  value={speakerType}
                  onChange={(event) => setSpeakerType(event.target.value)}
                >
                  <FormControlLabel
                    value="individual"
                    control={<Radio />}
                    label="Individual Speaker"
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "18px" },
                    }}
                  />

                  <FormControlLabel
                    value="multiple"
                    control={<Radio />}
                    label="Multi Speaker"
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "18px" },
                    }}
                  />
                </RadioGroup>
                {speakerType === "multiple" && (
          <>
            {speakerInfo.map((item, index) => {
              return (
                <Accordion
                  sx={{
                    borderRadius: "4px",
                    mt: 2,
                    "&:before": {
                      display: "none",
                    },
                    backgroundColor: index % 2 === 0 ? "#D6EAF8" : "#E9F7EF",
                  }}
                  key={`speakerInfo-accordion-${index}`}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={`speakerInfo-accordion-child-${index}`}
                  >
                    <Typography sx={{ margin: "4px 0", color: "#2A2A2A" }}>
                      Speaker {index + 1}
                    </Typography>

                    <Tooltip title="Delete Speaker">
                      <IconButton
                        aria-label="close"
                        onClick={(event) => handleRemoveSpeaker(event, index)}
                        sx={{ marginLeft: "auto" }}
                        disabled={speakerInfo.length === 1}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </AccordionSummary>
                  <AccordionDetails>
                    {speakerFields.map((element, idx) => {
                      return (
                        <Fragment key={`speaker-fields-${idx}`}>
                          {element.type === "text" ? (
                            <TextField
                              label={element.label}
                              value={item[element.name]}
                              name={element.name}
                              onChange={(event) =>
                                handleSpeakerFieldChange(event, index)
                              }
                              sx={element.sx}
                            />
                          ) : (
                            <FormControl fullWidth sx={element.sx}>
                              <InputLabel id={element.label}>
                                {element.label}
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId={element.label}
                                label={element.label}
                                name={element.name}
                                value={item[element.name]}
                                onChange={(event) =>
                                  handleSpeakerFieldChange(event, index)
                                }
                                style={{ zIndex: "0" }}
                                inputProps={{ "aria-label": "Without label" }}
                                MenuProps={MenuProps}
                              >
                                {element.options.map((item, index) => (
                                  <MenuItem key={index} value={item.value}>
                                    {item.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </Fragment>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              );
            })}

            <Button
              variant="text"
              sx={{
                display: "flex",
                mt: 2,
                borderRadius: 2,
                lineHeight: 1,
                ml: "auto",
              }}
              onClick={handleAddMoreSpeakers}
            >
              <AddIcon />
              Add More Speakers
            </Button>
          </>
        )}
              </FormControl>
              <TextField
                id="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={videoDescription}
                onChange={(event) => setVideoDescription(event.target.value)}
                sx={{ mb: 3, mt: 3 }}
              />

              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  borderRadius: "8px",
                  m: "24px auto 0 0",
                }}
                onClick={() => updateVideoHandler()}
              >
                Update Details
              </Button>
            </Grid>

            {/* <Grid className={classes.videoBox} id="myvideo">
              <video
                id="myBtn"
                ref={ref}
                style={fullScreenMode ? { width: "100%" } : { width: "600px" }}
                controls
                src={video.direct_video_url}
                className={classes.video}
                onTimeUpdate={handleProgress}
                onClick={handleplayVideo}
              />

              <div
                className={
                  fullScreenMode
                    ? darkAndLightMood === false
                      ? classes.lightmodesubtitle
                      : classes.darkmodesubtitle
                    : classes.darkmodesubtitle
                }
                style={
                  fullScreenMode
                    ? {
                        zIndex: 100,
                        fontSize: "35px",
                        position: "absolute",
                        bottom: "100px",
                        width: "100%",
                      }
                    : {}
                }
              >
                {highlightedSubtitle.length ? (
                  highlightedSubtitle.map((s) => s)
                ) : (
                  <></>
                )}
              </div>

              <Box>
                {fullScreenMode ? (
                  <Button
                    className={classes.fullscreenVideoBtns}
                    aria-label="fullscreen"
                    onClick={() => handleFullscreenVideo()}
                    variant="contained"
                    style={{
                      right: fullScreenMode ? "9%" : "",
                      bottom: fullScreenMode ? "5.5%" : "",
                    }}
                  >
                    <FullscreenExitIcon sx={{ fontSize: "40px" }} />
                  </Button>
                ) : (
                  <Button
                    className={classes.fullscreenVideoBtns}
                    aria-label="fullscreenExit"
                    onClick={() => handleFullscreenVideo()}
                    variant="contained"
                  >
                    <FullscreenIcon />
                  </Button>
                )}
              </Box>

              {fullScreenMode && (
                <CustomSwitchDarkBackground
                  sx={{ position: "relative", bottom: "7%", left: "34%" }}
                  labelPlacement="start"
                  checked={darkAndLightMood}
                  onChange={() =>
                    darkAndLightMood === false
                      ? setDarkAndLightMood(true)
                      : setDarkAndLightMood(false)
                  }
                />
              )}
            </Grid> */}
          </Grid>

          <div>
            <VideoTaskList videoDetails={videoDetails[0].id} />
          </div>
        </DialogContent>

        <DialogActions style={{ padding: "24px" }}>
          {/* <Button autoFocus onClick={handleClose}>
          Close
        </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VideoDialog;