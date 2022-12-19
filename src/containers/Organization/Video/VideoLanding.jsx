import { Button, Grid, IconButton } from "@mui/material";
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
import DT from "duration-time-conversion";
import SaveTranscriptAPI from "../../../redux/actions/api/Project/SaveTranscript";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box } from "@mui/system";
import { FullScreen, setSubtitles } from "../../../redux/actions/Common";
import C from "../../../redux/constants";
import { FullScreenVideo } from "../../../redux/actions/Common";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";

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
  const [playbackRate, setPlaybackRate] = useState(1);

  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );
  const fullscreen = useSelector((state) => state.commonReducer.fullscreen);
  const fullscreenVideo = useSelector(
    (state) => state.commonReducer.fullscreenVideo
  );
  const subs = useSelector((state) => state.commonReducer.subtitles);

  const hasSub = useCallback((sub) => subs.indexOf(sub), [subs]);

  const newSub = useCallback((item) => new Sub(item), []);

  const formatSub = useCallback(
    (sub) => {
      if (Array.isArray(sub)) {
        return sub.map((item) => newSub(item));
      }
      return newSub(sub);
    },
    [newSub]
  );

  const copySubs = useCallback(() => formatSub(subs), [subs, formatSub]);

  useEffect(() => {
    const apiObj = new FetchTaskDetailsAPI(taskId);
    dispatch(APITransport(apiObj));
  }, []);

  useEffect(() => {
    if (taskDetails) {
      const apiObj = new FetchVideoDetailsAPI(
        taskDetails.video_url,
        taskDetails.src_language,
        taskDetails.project
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

  const onChange = useCallback((event) => {
    player.pause();
    if (event.target.selectionStart) {
      setInputItemCursor(event.target.selectionStart);
    }
  }, []);

  const onClick = useCallback((event) => {
    // player.pause();
    if (event.target.selectionStart) {
      setInputItemCursor(event.target.selectionStart);
    }
  }, []);

  const onFocus = useCallback((event) => {
    setFocusing(true);
    if (event.target.selectionStart) {
      setInputItemCursor(event.target.selectionStart);
    }
  }, []);

  const onBlur = useCallback(() => {
    setTimeout(() => setFocusing(false), 500);
  }, []);

  const onSplit = useCallback(() => {
    const copySub = copySubs();

    const index = hasSub(subs[currentIndex]);

    const text1 = copySub[currentIndex].text.slice(0, inputItemCursor).trim();
    const text2 = copySub[currentIndex].text.slice(inputItemCursor).trim();

    if (!text1 || !text2) return;

    const splitDuration = (
      copySub[currentIndex].duration *
      (inputItemCursor / copySub[currentIndex].text.length)
    ).toFixed(3);

    if (
      splitDuration < 0.2 ||
      copySub[currentIndex].duration - splitDuration < 0.2
    )
      return;

    copySub.splice(index, 1);
    const middleTime = DT.d2t(
      subs[currentIndex].startTime + parseFloat(splitDuration)
    );

    copySub.splice(
      index,
      0,
      newSub({
        start_time: subs[currentIndex].start_time,
        end_time: middleTime,
        text: text1,
      })
    );

    copySub.splice(
      index + 1,
      0,
      newSub({
        start_time: middleTime,
        end_time: subs[currentIndex].end_time,
        text: text2,
      })
    );

    dispatch(setSubtitles(copySub, C.SUBTITLES));
    setCurrentSubs(copySub[currentIndex]);

    const reqBody = {
      task_id: taskId,
      payload: {
        payload: copySub,
      },
    };

    const obj = new SaveTranscriptAPI(reqBody, "TRANSCRIPTION_EDIT");
    dispatch(APITransport(obj));
  }, [inputItemCursor]);

  function getKeyCode(event) {
    const tag = document.activeElement.tagName.toUpperCase();
    const editable = document.activeElement.getAttribute("contenteditable");
    if (
      tag !== "INPUT" &&
      tag !== "TEXTAREA" &&
      editable !== "" &&
      editable !== "true"
    ) {
      return Number(event.keyCode);
    }
  }

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

  const playbackRateHandler = (rate) => {
    player.playbackRate = rate;
    setPlaybackRate(rate);
  };

  return (
    <Grid className={fullscreen ? classes.fullscreenStyle : ""}>
      {renderSnackBar()}
      <Grid
        container
        direction={"row"}
        sx={{ marginTop: 7, overflow: "hidden" }}
      >
        <Grid width="100%" overflow="hidden" md={8} xs={12} id="video">
          <VideoPanel
            setPlayer={setPlayer}
            setCurrentTime={setCurrentTime}
            setPlaying={setPlaying}
            playing={playing}
            currentTime={currentTime}
          />

          {currentSubs ? (
            <div
              className={classes.subtitlePanel}
              style={{
                bottom: fullscreen ? "5%" : fullscreenVideo ? "15%" : "",
                margin: fullscreenVideo ? "auto" : "",
              }}
            >
              {!currentSubs.target_text && focusing ? (
                <div className={classes.operate} onClick={onSplit}>
                  Split Subtitle
                </div>
              ) : null}

              <ReactTextareaAutosize
                className={`${classes.playerTextarea} ${
                  !playing ? classes.pause : ""
                }`}
                value={
                  currentSubs.target_text
                    ? currentSubs.target_text
                    : currentSubs.text
                }
                spellCheck={false}
                onChange={onChange}
                onClick={onClick}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onFocus}
              />
            </div>
          ) : null}

          <div
            className={classes.playbackRate}
            style={{
              bottom: fullscreenVideo ? "28%" : fullscreen ? "3%" : "",
              right: fullscreenVideo ? "23%" : fullscreen ? "35%" : "",
            }}
          >
            <Button
              onClick={() =>
                playbackRate >= 0.2 && playbackRateHandler(playbackRate - 0.1)
              }
              sx={{ color: " #fff" }}
            >
              <FastRewindIcon />
            </Button>
            <p style={{ margin: 0, color: " #fff" }}>
              {Math.round(playbackRate * 10) / 10}x
            </p>
            <Button
              onClick={() =>
                playbackRate <= 15.9 && playbackRateHandler(playbackRate + 0.1)
              }
              sx={{ color: " #fff" }}
            >
              <FastForwardIcon />
            </Button>
          </div>

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
            <RightPanel currentIndex={currentIndex} player={player}/>
          )}
          {(taskDetails?.task_type === "TRANSLATION_EDIT" ||
            taskDetails?.task_type === "TRANSLATION_REVIEW") && (
            <TranslationRightPanel currentIndex={currentIndex} />
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
