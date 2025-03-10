import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
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
// import VoiceOverRightPanel from "./VoiceOverRightPanel";
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
  UpdateTimeSpentPerTask,
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
  setSnackBar,
} from "redux/actions";
import C from "redux/constants";
import CustomizedSnackbars from "../../../common/Snackbar";
import { useAutoSave, useUpdateTimeSpent } from "hooks";
import VoiceOverRightPanel1 from "./VoiceOverRightPanel1";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { Pause } from "@mui/icons-material";
import ParaphraseRightPanel from "./ParaphraseRightPanel";

const VideoLanding = () => {
  const { taskId, offset, segment } = useParams();
  const dispatch = useDispatch();
  const classes = VideoLandingStyle();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubs, setCurrentSubs] = useState();
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [fontSize, setFontSize] = useState("large");
  const [darkAndLightMode, setDarkAndLightMode] = useState("dark");
  const [subtitlePlacement, setSubtitlePlacement] = useState("bottom");
  const [useYtdlp, setUseYtdlp] = useState(true);
  const snackbar = useSelector((state) => state.commonReducer.snackbar);
  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const loggedin_user_id = JSON.parse(localStorage.getItem("userData"))?.id;
  const loggedin_user_role = JSON.parse(localStorage.getItem("userData"))?.role;
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
  const ref = useRef(0);

  useEffect(() => {
    if (
      taskDetails &&
      loggedin_user_role && loggedin_user_id &&
      loggedin_user_id !== taskDetails?.user?.id &&
      loggedin_user_role !== "ADMIN" &&
      loggedin_user_role !== "ORG_OWNER" &&
      loggedin_user_role !== "PROJECT_MANAGER"
    ) {
      // 1. Render snackbar
      dispatch(
        setSnackBar({
          open: true,
          message: "You don't have permissions to access this page!",
          variant: "error",
        })
      );
      // 2. redirect
      navigate("/task-list");
    }
  }, [taskDetails]);

  useEffect(() => {
    let intervalId;

    const updateTimer = () => {
      ref.current = ref.current + 1;
    };

    intervalId = setInterval(updateTimer, 1000);

    setInterval(() => {
      clearInterval(intervalId);
      ref.current = 0;

      intervalId = setInterval(updateTimer, 1000);
    }, 60 * 1000);

    return () => {
      const apiObj = new UpdateTimeSpentPerTask(taskId, ref.current);
      dispatch(APITransport(apiObj));
      clearInterval(intervalId);
      ref.current = 0;
    };
    // eslint-disable-next-line
  }, []);

  useAutoSave();
  useUpdateTimeSpent(ref);

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
          taskDetails.task_type,
          offset !== undefined ? offset : 1
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

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          dispatch(setSnackBar({ open: false, message: "", variant: "" }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={[snackbar.message]}
      />
    );

    //eslint-disable-next-line
  }, [snackbar]);

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
    const res = fullscreenUtil(document.getElementById("right-panel"));
    dispatch(FullScreen(res, C.FULLSCREEN));
  };

  const handleFullscreenVideo = () => {
    const res = fullscreenUtil(document.getElementById("video"));
    dispatch(FullScreenVideo(res, C.FULLSCREEN_VIDEO));
  };

  const renderLoader = () => {
    // if (videoDetails.length <= 0) {
    //   return (
    //     <Backdrop className={classes.backDrop} open={true}>
    //       <CircularProgress color="inherit" size="50px" />
    //       <Typography sx={{ mt: 3 }}>
    //         Please wait while your request is being processed
    //       </Typography>
    //     </Backdrop>
    //   );
    // }
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
    <>
      {renderSnackBar()}
      <Grid className={fullscreen ? classes.fullscreenStyle : ""}>
        {renderLoader()}

        <PanelGroup direction="horizontal" className={classes.parentGrid}>
          <Panel
            defaultSize={25}
            minSize={20}
            id="video"
            className={classes.videoParent}
          >
            <Box
              style={{
                height: videoDetails?.video?.audio_only
                  ? "100%"
                  : showTimeline
                  ? "calc(100vh - 183px)"
                  : "calc(92.5vh - 60px)",
              }}
              className={classes.videoBox}
            >
              <VideoName
                fontSize={fontSize}
                setFontSize={setFontSize}
                darkAndLightMode={darkAndLightMode}
                setDarkAndLightMode={setDarkAndLightMode}
                subtitlePlacement={subtitlePlacement}
                setSubtitlePlacement={setSubtitlePlacement}
                showSubtitles={showSubtitles}
                setShowSubtitles={setShowSubtitles}
                showTimeline={showTimeline}
                setShowTimeline={setShowTimeline}
                useYtdlp={useYtdlp}
                setUseYtdlp={setUseYtdlp}
              />

              <VideoPanel
                setCurrentTime={setCurrentTime}
                setPlaying={setPlaying}
                useYtdlp={useYtdlp}
                setUseYtdlp={setUseYtdlp}
              />

              {currentSubs && showSubtitles && (
                <div
                  className={classes.subtitlePanel}
                  style={{
                    bottom: fullscreen || fullscreenVideo ? "10%" : "",
                    margin: fullscreenVideo ? "auto" : "",
                    top: subtitlePlacement === "top" ? "15%" : "",
                  }}
                >
                  <div
                    className={`${classes.playerTextarea} ${
                      darkAndLightMode === "dark"
                        ? classes.darkMode
                        : classes.lightMode
                    }`}
                    style={{
                      fontSize: fontSize,
                      maxHeight: "100px",
                    }}
                  >
                    {taskDetails.task_type.includes("TRANSCRIPTION") ||
                    taskDetails.task_type.includes("VOICEOVER")
                      ? currentSubs.text
                      : currentSubs.target_text}
                  </div>
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
          </Panel>
          <PanelResizeHandle />
          <Panel
            defaultSize={75}
            minSize={50}
            id="right-panel"
            style={{
              backgroundColor: "white",
              paddingTop: fullscreen ? "4%" : "0",
            }}
          >
            {taskDetails?.task_type?.includes("TRANSCRIPTION") ? (
              taskDetails?.status === "PARAPHRASE" ? (
                <ParaphraseRightPanel
                  currentIndex={currentIndex}
                  currentSubs={currentSubs}
                  setCurrentIndex={setCurrentIndex}
                  showTimeline={showTimeline}
                  segment={segment}
                />
              ) : (
                <RightPanel
                  currentIndex={currentIndex}
                  currentSubs={currentSubs}
                  setCurrentIndex={setCurrentIndex}
                  showTimeline={showTimeline}
                  segment={segment}
                />
              )
            ) : taskDetails?.task_type?.includes("VOICEOVER") ? (
              // <VoiceOverRightPanel currentIndex={currentIndex}
              // setCurrentIndex={setCurrentIndex} />
              <VoiceOverRightPanel1
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                showTimeline={showTimeline}
                segment={segment}
              />
            ) : (
              <TranslationRightPanel
                currentIndex={currentIndex}
                currentSubs={currentSubs}
                setCurrentIndex={setCurrentIndex}
                showTimeline={showTimeline}
                segment={segment}
              />
            )}
            {fullscreen && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "2%",
                }}
              >
                <PlayArrow
                  color="primary"
                  style={{ transform: "scale(3)", margin: "0 20px" }}
                  onClick={() => {
                    if (player)
                      typeof player.pauseVideo === "function"
                        ? player.playVideo()
                        : player.play();
                  }}
                />
                <Pause
                  color="primary"
                  style={{ transform: "scale(3)", margin: "0 20px" }}
                  onClick={() => {
                    if (player)
                      typeof player.pauseVideo === "function"
                        ? player.pauseVideo()
                        : player.pause();
                  }}
                />
              </div>
            )}
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
          </Panel>
        </PanelGroup>

        {showTimeline && (
          <Grid
            width={"100%"}
            position="fixed"
            bottom={1}
            style={fullscreen ? { visibility: "hidden" } : {}}
          >
            <Timeline currentTime={currentTime} playing={playing} />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default memo(VideoLanding);
