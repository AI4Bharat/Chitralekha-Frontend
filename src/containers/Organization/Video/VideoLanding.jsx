import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import ReactTextareaAutosize from "react-textarea-autosize";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RightPanel from "./RightPanel";
import Timeline from "./Timeline";
import VideoPanel from "./components/VideoPanel";
import FetchTaskDetailsAPI from "../../../redux/actions/api/Project/FetchTaskDetails";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import FetchVideoDetailsAPI from "../../../redux/actions/api/Project/FetchVideoDetails";
import FetchTranscriptPayloadAPI from "../../../redux/actions/api/Project/FetchTranscriptPayload";
import TranslationRightPanel from "./TranslationRightPanel";
import CustomizedSnackbars from "../../../common/Snackbar";
import Sub from "../../../utils/Sub";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box } from "@mui/system";
import { FullScreen, setSubtitles } from "../../../redux/actions/Common";
import C from "../../../redux/constants";
import { FullScreenVideo } from "../../../redux/actions/Common";
import {
  fullscreenUtil,
  getKeyCode,
  onSplit,
} from "../../../utils/subtitleUtils";
import VideoLandingStyle from "../../../styles/videoLandingStyles";
import VideoName from "./components/VideoName";

const VideoLanding = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const classes = VideoLandingStyle();

  const [player, setPlayer] = useState();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [currentSubs, setCurrentSubs] = useState();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [focusing, setFocusing] = useState(false);
  const [inputItemCursor, setInputItemCursor] = useState(0);
  const [fontSize, setFontSize] = useState("large");
  const [darkAndLightMode, setDarkAndLightMode] = useState("dark");
  const [subtitlePlacement, setSubtitlePlacement] = useState("bottom");

  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );
  const fullscreen = useSelector((state) => state.commonReducer.fullscreen);
  const fullscreenVideo = useSelector(
    (state) => state.commonReducer.fullscreenVideo
  );
  const videoDetails = useSelector((state) => state.getVideoDetails.data);
  const subs = useSelector((state) => state.commonReducer.subtitles);

  useEffect(() => {
    const apiObj = new FetchTaskDetailsAPI(taskId);
    dispatch(APITransport(apiObj));
  }, []);

  useEffect(() => {
    if (taskDetails && taskDetails?.id) {
      const apiObj = new FetchVideoDetailsAPI(
        encodeURIComponent(taskDetails.video_url.replace(/&amp;/g, "&")),
        taskDetails.src_language,
        taskDetails.project,
        taskDetails.is_audio_only
      );
      dispatch(APITransport(apiObj));

      (async () => {
        const payloadObj = new FetchTranscriptPayloadAPI(
          taskDetails.id,
          taskDetails.task_type
        );
        dispatch(APITransport(payloadObj));
      })();
    }
  }, [taskDetails]);

  useEffect(() => {
    const sub = transcriptPayload?.payload?.payload.map(
      (item) => new Sub(item)
    );

    dispatch(setSubtitles(sub, C.SUBTITLES));
  }, [transcriptPayload?.payload?.payload]);

  useMemo(() => {
    const currentIndex = subs?.findIndex(
      (item) => item.startTime <= currentTime && item.endTime > currentTime
    );
    setCurrentIndex(currentIndex);
  }, [currentTime, subs]);

  useMemo(() => {
    subs && setCurrentSubs(subs[currentIndex]);
  }, [subs, currentIndex]);

  const renderSnackBar = () => {
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
  };

  const onChange = (event) => {
    player.pause();
    if (event.target.selectionStart) {
      setInputItemCursor(event.target.selectionStart);
    }
  };

  const onClick = (event) => {
    if (event.target.selectionStart) {
      setInputItemCursor(event.target.selectionStart);
    }
  };

  const onFocus = (event) => {
    setFocusing(true);
    if (event.target.selectionStart) {
      setInputItemCursor(event.target.selectionStart);
    }
  };

  const onBlur = () => {
    setTimeout(() => setFocusing(false), 500);
  };

  const onSplitClick = useCallback(() => {
    const copySub = onSplit(subs, currentIndex, inputItemCursor);
    dispatch(setSubtitles(copySub, C.SUBTITLES));

    const reqBody = {
      task_id: taskId,
      payload: {
        payload: copySub,
      },
    };

    const obj = new SaveTranscriptAPI(reqBody, "TRANSCRIPTION_EDIT");
    dispatch(APITransport(obj));
  }, [inputItemCursor, subs, currentIndex]);

  const onKeyDown = (event) => {
    const keyCode = getKeyCode(event);

    switch (keyCode) {
      case 32:
        event.preventDefault();
        if (player) {
          if (playing) {
            player.pause();
          } else {
            player.play();
          }
        }
        break;
      default:
        break;
    }
  };

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      if (fullscreen) {
        dispatch(FullScreen(false, C.FULLSCREEN));
      }

      if (fullscreenVideo) {
        dispatch(FullScreen(false, C.FULLSCREEN_VIDEO));
      }
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
    return () => window.removeEventListener("fullscreenchange", exitHandler);
  }, [exitHandler]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const handleFullscreen = () => {
    const res = fullscreenUtil(document.documentElement);
    dispatch(FullScreen(res, C.FULLSCREEN));
  };

  const handleFullscreenVideo = () => {
    const res = fullscreenUtil(document.getElementById("video"));
    dispatch(FullScreenVideo(res, C.FULLSCREEN_VIDEO));
  };

  const renderLoader = () => {
    if (videoDetails.length <= 0) {
      return (
        <Backdrop className={classes.backDrop} open={true}>
          <CircularProgress color="inherit" size="50px" />
          <Typography sx={{ mt: 3 }}>
            Please wait while your request is being processed
          </Typography>
        </Backdrop>
      );
    }
  };

  return (
    <Grid className={fullscreen ? classes.fullscreenStyle : ""}>
      {renderSnackBar()}

      {renderLoader()}

      <Grid container direction={"row"} className={classes.parentGrid}>
        <Grid md={8} xs={12} id="video" className={classes.videoParent}>
          <Box
            style={{ height: videoDetails?.video?.audio_only ? "100%" : "" }}
            className={classes.videoBox}
          >
            <VideoName
              fontSize={fontSize}
              setFontSize={setFontSize}
              darkAndLightMode={darkAndLightMode}
              setDarkAndLightMode={setDarkAndLightMode}
              player={player}
              subtitlePlacement={subtitlePlacement}
              setSubtitlePlacement={setSubtitlePlacement}
            />

            <VideoPanel
              setPlayer={setPlayer}
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
            />

            {currentSubs && (
              <div
                className={classes.subtitlePanel}
                style={{
                  bottom: fullscreen || fullscreenVideo ? "10%" : "",
                  margin: fullscreenVideo ? "auto" : "",
                  top: subtitlePlacement === "top" ? "15%" : "",
                }}
              >
                {taskDetails?.task_type?.includes("TRANSCRIPTION") &&
                focusing ? (
                  <div className={classes.operate} onClick={onSplitClick}>
                    Split Subtitle
                  </div>
                ) : null}

                <ReactTextareaAutosize
                  className={`${classes.playerTextarea} ${
                    darkAndLightMode === "dark"
                      ? classes.darkMode
                      : classes.lightMode
                  }`}
                  value={
                    taskDetails?.task_type?.includes("TRANSCRIPTION")
                      ? currentSubs.text
                      : currentSubs.target_text
                  }
                  style={{
                    fontSize: fontSize,
                  }}
                  spellCheck={false}
                  onChange={onChange}
                  onClick={onClick}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onKeyDown={onFocus}
                />
              </div>
            )}

            {!fullscreen && (
              <Box>
                <Button
                  className={classes.fullscreenVideoBtn}
                  aria-label="fullscreen"
                  onClick={() => handleFullscreenVideo()}
                  variant="contained"
                  style={{
                    bottom: fullscreenVideo ? "4%" : "",
                    right: fullscreenVideo ? "18%" : "",
                  }}
                >
                  {fullscreenVideo ? (
                    <FullscreenExitIcon />
                  ) : (
                    <FullscreenIcon />
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid md={4} xs={12} sx={{ width: "100%" }}>
          {taskDetails?.task_type?.includes("TRANSCRIPTION") ? (
            <RightPanel currentIndex={currentIndex} player={player} />
          ) : (
            <TranslationRightPanel
              currentIndex={currentIndex}
              player={player}
            />
          )}
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
        style={fullscreen ? { visibility: "hidden" } : {}}
      >
        <Timeline player={player} currentTime={currentTime} playing={playing} />
      </Grid>

      <Box>
        <Button
          className={classes.fullscreenBtn}
          aria-label="fullscreen"
          onClick={() => handleFullscreen()}
          variant="contained"
        >
          {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </Button>
      </Box>
    </Grid>
  );
};

export default VideoLanding;
