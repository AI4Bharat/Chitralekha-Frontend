import { Grid } from "@mui/material";
import ReactTextareaAutosize from "react-textarea-autosize";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
import ProjectStyle from "../../../styles/ProjectStyle";
import DT from "duration-time-conversion";

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
  const [subs, setSubs] = useState([]);
  const [currentSubs, setCurrentSubs] = useState();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [focusing, setFocusing] = useState(false);
  const [inputItemCursor, setInputItemCursor] = useState(0);

  const taskDetails = useSelector((state) => state.getTaskDetails.data);
  const transcriptPayload = useSelector(
    (state) => state.getTranscriptPayload.data
  );

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

    setSubs(sub);
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

  const hasSub = useCallback((sub) => subs.indexOf(sub), [subs]);

  const newSub = useCallback((item) => new Sub(item), []);

  const onChange = useCallback((event) => {
    player.pause();
    if (event.target.selectionStart) {
      setInputItemCursor(event.target.selectionStart);
    }
  }, []);

  const onClick = useCallback(
    (event) => {
      // player.pause();
      if (event.target.selectionStart) {
        setInputItemCursor(event.target.selectionStart);
      }
    },
    []
  );

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
    const index = hasSub(subs[currentIndex]);

    const text1 = subs[currentIndex].text.slice(0, inputItemCursor).trim();
    const text2 = subs[currentIndex].text.slice(inputItemCursor).trim();

    if (!text1 || !text2) return;

    const splitDuration = (
      subs[currentIndex].duration *
      (inputItemCursor / subs[currentIndex].text.length)
    ).toFixed(3);

    if (
      splitDuration < 0.2 ||
      subs[currentIndex].duration - splitDuration < 0.2
    )
      return;

    subs.splice(index, 1);
    const middleTime = DT.d2t(
      subs[currentIndex].startTime + parseFloat(splitDuration)
    );
    subs.splice(
      index,
      0,
      newSub({
        start_time: subs[currentIndex].start_time,
        end_time: middleTime,
        text: text1,
      })
    );
    subs.splice(
      index + 1,
      0,
      newSub({
        start_time: middleTime,
        end_time: subs[currentIndex].end_time,
        text: text2,
      })
    );
    setSubs(subs);
  }, [inputItemCursor]);

  return (
    <Grid>
      {renderSnackBar()}
      <Grid
        container
        direction={"row"}
        sx={{ marginTop: 7, overflow: "hidden" }}
      >
        <Grid width="100%" overflow="hidden" md={8} xs={12}>
          <VideoPanel
            setPlayer={setPlayer}
            setCurrentTime={setCurrentTime}
            setPlaying={setPlaying}
            playing={playing}
            currentTime={currentTime}
          />

          {currentSubs ? (
            <div className={classes.subtitlePanel}>
              {focusing ? (
                <div className={classes.operate} onClick={onSplit}>
                  Split Subtitle
                </div>
              ) : null}

              <ReactTextareaAutosize
                className={`${classes.playerTextarea} ${
                  !playing ? classes.pause : ""
                }`}
                value={
                  currentSubs.targetText
                    ? currentSubs.targetText
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
        </Grid>

        <Grid md={4} xs={12} sx={{ width: "100%" }}>
          {(taskDetails?.task_type === "TRANSCRIPTION_EDIT" ||
            taskDetails?.task_type === "TRANSCRIPTION_REVIEW") && (
            <RightPanel currentIndex={currentIndex} />
          )}
          {(taskDetails?.task_type === "TRANSLATION_EDIT" ||
            taskDetails?.task_type === "TRANSLATION_REVIEW") && (
            <TranslationRightPanel currentIndex={currentIndex} />
          )}
        </Grid>
      </Grid>
      <Grid width={"100%"} position="fixed" bottom={1}>
        <Timeline
          waveform={waveform}
          setWaveform={setWaveform}
          player={player}
          render={render}
          setRender={setRender}
          currentTime={currentTime}
          playing={playing}
          subtitles={subs}
          setSubtitles={setSubs}
        />
      </Grid>
    </Grid>
  );
};

export default VideoLanding;
