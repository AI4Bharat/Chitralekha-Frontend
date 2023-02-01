import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ReactTextareaAutosize from "react-textarea-autosize";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProjectStyle from "../../../styles/ProjectStyle";
import RightPanel from "./RightPanel";
import Timeline from "./Timeline";
import VideoPanel from "./VideoPanel";
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
import CustomMenuComponent from "../../../common/CustomMenuComponent";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import { getKeyCode, newSub, onSplit } from "../../../utils/subtitleUtils";

const VideoLanding = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const classes = ProjectStyle();

  const [waveform, setWaveform] = useState();
  const [player, setPlayer] = useState();
  const [render, setRender] = useState({
    padding: 2,
    duration: 10,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });
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
  const [anchorElSettings, setAnchorElSettings] = useState(null);

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
    if (
      taskDetails &&
      taskDetails?.video_url &&
      taskDetails?.src_language &&
      taskDetails?.project &&
      taskDetails?.id &&
      taskDetails?.task_type
    ) {
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
  }, [inputItemCursor]);

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
    let doc = window.document;
    let docEl = doc.documentElement;

    const requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    const cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl);
      dispatch(FullScreen(true, C.FULLSCREEN));
    } else {
      dispatch(FullScreen(false, C.FULLSCREEN));
      cancelFullScreen.call(doc);
    }
  };

  const handleFullscreenVideo = () => {
    let doc = window.document;
    let elem = document.getElementById("video");

    const requestFullScreen =
      elem.requestFullscreen ||
      elem.mozRequestFullScreen ||
      elem.webkitRequestFullScreen ||
      elem.msRequestFullscreen;
    const cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(elem);
      dispatch(FullScreenVideo(true, C.FULLSCREEN_VIDEO));
    } else {
      dispatch(FullScreenVideo(false, C.FULLSCREEN_VIDEO));
      cancelFullScreen.call(doc);
    }
  };

  const renderLoader = () => {
    if (videoDetails.length <= 0) {
      return (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: 999999,
            display: "flex",
            flexDirection: "column",
            "&.MuiBackdrop-root": {
              backgroundColor: "#1d1d1d",
            },
          }}
          open={true}
        >
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

      <Grid
        container
        direction={"row"}
        sx={{ marginTop: 7, overflow: "hidden" }}
      >
        <Grid width="100%" overflow="hidden" md={8} xs={12} id="video">
          <Box
            margin="auto"
            display="flex"
            flexDirection="column"
            style={{ height: videoDetails?.video?.audio_only ? "100%" : "" }}
          >
            <Box
              display="flex"
              flexDirection="row"
              style={fullscreenVideo ? { width: "60%", margin: "auto" } : {}}
              border={"1px solid #eaeaea"}
              borderRight="none"
            >
              <Tooltip title={videoDetails?.video?.name} placement="bottom">
                <Typography
                  variant="h4"
                  textAlign="center"
                  margin={4}
                  width="90%"
                  className={classes.videoName}
                  style={fullscreenVideo ? { color: "white" } : {}}
                >
                  {videoDetails?.video?.name}
                </Typography>
              </Tooltip>

              <Tooltip title="Settings" placement="bottom">
                <IconButton
                  sx={{
                    backgroundColor: "#2C2799",
                    borderRadius: "50%",
                    color: "#fff",
                    margin: "auto",
                    "&:hover": {
                      backgroundColor: "#271e4f",
                    },
                  }}
                  onClick={(event) => setAnchorElSettings(event.currentTarget)}
                >
                  <WidgetsOutlinedIcon />
                </IconButton>
              </Tooltip>

              <CustomMenuComponent
                anchorElSettings={anchorElSettings}
                handleClose={() => setAnchorElSettings(null)}
                setFontSize={setFontSize}
                fontSize={fontSize}
                darkAndLightMode={darkAndLightMode}
                setDarkAndLightMode={setDarkAndLightMode}
                player={player}
                contianer={document.getElementById("video")}
              />
            </Box>

            <VideoPanel
              setPlayer={setPlayer}
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
            />
          </Box>

          {currentSubs ? (
            <div
              className={classes.subtitlePanel}
              style={{
                bottom: fullscreen ? "10%" : fullscreenVideo ? "15%" : "",
                margin: fullscreenVideo ? "auto" : "",
              }}
            >
              {!currentSubs.target_text && focusing ? (
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
                  currentSubs.target_text
                    ? currentSubs.target_text
                    : currentSubs.text
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
          ) : null}

          {!fullscreen && (
            <Box>
              {fullscreenVideo ? (
                <Button
                  className={classes.fullscreenVideoBtn}
                  aria-label="fullscreen"
                  onClick={() => handleFullscreenVideo()}
                  variant="contained"
                  style={{
                    bottom: fullscreenVideo ? "28%" : "",
                    right: fullscreenVideo ? "20%" : "",
                  }}
                >
                  <FullscreenExitIcon />
                </Button>
              ) : (
                <Button
                  className={classes.fullscreenVideoBtn}
                  aria-label="fullscreenExit"
                  onClick={() => handleFullscreenVideo()}
                  variant="contained"
                >
                  <FullscreenIcon />
                </Button>
              )}
            </Box>
          )}
        </Grid>

        <Grid md={4} xs={12} sx={{ width: "100%" }}>
          {(taskDetails?.task_type === "TRANSCRIPTION_EDIT" ||
            taskDetails?.task_type === "TRANSCRIPTION_REVIEW") && (
            <RightPanel currentIndex={currentIndex} player={player} />
          )}
          {(taskDetails?.task_type === "TRANSLATION_EDIT" ||
            taskDetails?.task_type === "TRANSLATION_REVIEW") && (
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
        <Timeline
          waveform={waveform}
          setWaveform={setWaveform}
          player={player}
          render={render}
          setRender={setRender}
          currentTime={currentTime}
          playing={playing}
          newSub={newSub}
        />
      </Grid>

      <Box>
        {fullscreen ? (
          <Button
            className={classes.fullscreenBtn}
            aria-label="fullscreen"
            onClick={() => handleFullscreen()}
            variant="contained"
          >
            <FullscreenExitIcon />
          </Button>
        ) : (
          <Button
            className={classes.fullscreenBtn}
            aria-label="fullscreenExit"
            onClick={() => handleFullscreen()}
            variant="contained"
          >
            <FullscreenIcon />
          </Button>
        )}
      </Box>
    </Grid>
  );
};

export default VideoLanding;
