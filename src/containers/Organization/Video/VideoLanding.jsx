import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";
import { fullscreenUtil, getKeyCode, Sub } from "utils";

//Styles
import { VideoLandingStyle } from "styles";

//Components
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import ReactTextareaAutosize from "react-textarea-autosize";
import RightPanel from "./RightPanel";
import VoiceOverRightPanel from "./VoiceOverRightPanel";
import Timeline from "./Timeline";
import VideoPanel from "./components/VideoPanel";
import TranslationRightPanel from "./TranslationRightPanel";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import VideoName from "./components/VideoName";

//APIs
import {
  APITransport,
  FetchTaskDetailsAPI,
  FetchTranscriptPayloadAPI,
  FetchVideoDetailsAPI,
  FullScreen,
  FullScreenVideo,
  setCompletedCount,
  setCurrentPage,
  setNextPage,
  setPreviousPage,
  setRangeEnd,
  setRangeStart,
  setSubtitles,
  setSubtitlesForCheck,
  setTotalPages,
  setTotalSentences,
} from "redux/actions";
import C from "redux/constants";
import { useAutosave, useTimer, useUpdateTimeSpent } from "hooks";

const VideoLanding = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const classes = VideoLandingStyle();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubs, setCurrentSubs] = useState();
  const [currentIndex, setCurrentIndex] = useState(-1);
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
  const player = useSelector((state) => state.commonReducer.player);
  const currentPage = useSelector((state) => state.commonReducer.currentPage);
  const limit = useSelector((state) => state.commonReducer.limit);

  useTimer(1000, 60 * 1000, taskId);
  useAutosave(taskId, currentPage, limit, taskDetails);
  useUpdateTimeSpent(taskId);

  useEffect(() => {
    const apiObj = new FetchTaskDetailsAPI(taskId);
    dispatch(APITransport(apiObj));

    return () => {
      dispatch({ type: C.CLEAR_STATE, payload: [] });
    };
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [taskDetails]);

  useEffect(() => {
    const sub = transcriptPayload?.payload?.payload.map(
      (item) => new Sub(item)
    );

    const newSub = cloneDeep(sub);

    dispatch(setCurrentPage(transcriptPayload?.current));
    dispatch(setNextPage(transcriptPayload?.next));
    dispatch(setPreviousPage(transcriptPayload?.previous));
    dispatch(setTotalPages(transcriptPayload?.count));
    dispatch(setSubtitlesForCheck(newSub));
    dispatch(setCompletedCount(transcriptPayload?.completed_count));
    dispatch(setRangeStart(transcriptPayload?.start));
    dispatch(setRangeEnd(transcriptPayload?.end));
    dispatch(setSubtitles(sub, C.SUBTITLES));
    dispatch(setTotalSentences(transcriptPayload?.sentences_count));

    // eslint-disable-next-line
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

  const onKeyDown = useCallback(
    (event) => {
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
    },
    [player, playing]
  );

  const exitHandler = useCallback(() => {
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
    // eslint-disable-next-line
  }, [fullscreen, fullscreenVideo]);

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

  useEffect(() => {
    if (localStorage.getItem("canReload") === "true") {
      localStorage.setItem("canReload", false);
      window.location.reload(true);
    } else {
      localStorage.setItem("canReload", true);
    }

    return () => {
      localStorage.setItem("canReload", true);
    };
  }, []);

  return (
    <Grid className={fullscreen ? classes.fullscreenStyle : ""}>
      {renderLoader()}

      <Grid container direction={"row"} className={classes.parentGrid}>
        <Grid md={6} xs={12} id="video" className={classes.videoParent}>
          <Box
            style={{ height: videoDetails?.video?.audio_only ? "100%" : "" }}
            className={classes.videoBox}
          >
            <VideoName
              fontSize={fontSize}
              setFontSize={setFontSize}
              darkAndLightMode={darkAndLightMode}
              setDarkAndLightMode={setDarkAndLightMode}
              subtitlePlacement={subtitlePlacement}
              setSubtitlePlacement={setSubtitlePlacement}
            />

            <VideoPanel
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
                <ReactTextareaAutosize
                  className={`${classes.playerTextarea} ${
                    darkAndLightMode === "dark"
                      ? classes.darkMode
                      : classes.lightMode
                  }`}
                  value={
                    taskDetails.task_type.includes("TRANSCRIPTION") ||
                    taskDetails.task_type.includes("VOICEOVER")
                      ? currentSubs.text
                      : currentSubs.target_text
                  }
                  style={{
                    fontSize: fontSize,
                  }}
                  spellCheck={false}
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
                    bottom: fullscreenVideo ? "2%" : "",
                    right: fullscreenVideo ? "2%" : "",
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

        <Grid md={6} xs={12} sx={{ width: "100%" }}>
          {taskDetails?.task_type?.includes("TRANSCRIPTION") ? (
            <RightPanel currentIndex={currentIndex} />
          ) : taskDetails?.task_type?.includes("TRANSLATION") ? (
            <TranslationRightPanel currentIndex={currentIndex} />
          ) : (
            <VoiceOverRightPanel currentIndex={currentIndex} />
          )}
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
        style={fullscreen ? { visibility: "hidden" } : {}}
      >
        <Timeline currentTime={currentTime} playing={playing} />
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

export default memo(VideoLanding);
